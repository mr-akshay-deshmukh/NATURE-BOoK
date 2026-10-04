import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up large JSON body sizes to accommodate media uploads (photos/audio/video base64)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy initializer for Google Gen AI to prevent crashing if API key is not yet set up
let aiClientInstance: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClientInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in Settings -> Secrets.");
    }
    aiClientInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClientInstance;
}

async function generateContentWithRetry(params: any, retries = 3, delay = 1000): Promise<any> {
  const ai = getAIClient();
  let lastError: any = null;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      lastError = err;
      const statusCode = err?.status || err?.statusCode || (err?.message && err.message.includes("503") ? 503 : 0);
      const isTransient = statusCode === 503 || statusCode === 429 || (err?.message && (err.message.toLowerCase().includes("unavailable") || err.message.toLowerCase().includes("high demand") || err.message.toLowerCase().includes("resource exhausted") || err.message.toLowerCase().includes("overloaded") || err.message.toLowerCase().includes("rate limit") || err.message.toLowerCase().includes("spikes in demand")));
      
      if (isTransient && attempt < retries) {
        console.warn(`[Gemini API] Transient error (attempt ${attempt}/${retries}): ${err?.message || err}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Analyze reported environmental issue & generate guided resolution workflow
app.post("/api/analyze-issue", async (req, res) => {
  try {
    const { title, description, category, fileUrl, fileType } = req.body;
    const ai = getAIClient();

    let contents: any[] = [];
    const prompt = `
      You are an expert Environmental Impact Analyst and biochemist/disaster response lead.
      Analyze the following reported environmental degradation issue and generate a complete step-by-step resolution guide.
      
      Issue Details:
      - Title: ${title}
      - Description: ${description}
      - Category: ${category}
      
      Provide a highly realistic, scientifically sound, and safe guide. It should include physical remediation steps, chemical/biological treatments where applicable, required local resources, and safety warnings.
    `;

    contents.push(prompt);

    // If an image is appended as base64 string
    if (fileUrl && fileType === 'image' && fileUrl.startsWith('data:image/')) {
      const parts = fileUrl.split(';base64,');
      const mime = parts[0].split(':')[1];
      const data = parts[1];
      contents.push({
        inlineData: {
          mimeType: mime,
          data: data
        }
      });
    }

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A professional 2-3 sentence biochem/ecological summary of the problem."
            },
            immediateSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 high-priority steps to prevent further immediate deterioration, written concisely."
            },
            longTermSolutions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 structural, biological or systemic resolutions (e.g. bio-swales, specific tree species planting, community regulation)."
            },
            neededResources: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of tools, personnel, chemicals or funding required to complete the steps."
            },
            safetyPrecautions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Crucial local safety precautions or hazard alerts for volunteers."
            }
          },
          required: ["summary", "immediateSteps", "longTermSolutions", "neededResources", "safetyPrecautions"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Error in /api/analyze-issue:", err);
    res.status(500).json({ error: err.message || "Failed to analyze environmental issue." });
  }
});

// 2. Trash Sorter Camera: Identify a piece of trash and recommend precise recycling & business conversion ideas
app.post("/api/sort-waste", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ error: "Missing waste fileUrl base64 content." });
    }

    let mime = "image/png";
    let data = "";
    if (fileUrl.includes(';base64,')) {
      const parts = fileUrl.split(';base64,');
      mime = parts[0]?.split(':')[1] || "image/png";
      data = parts[1] || "";
    } else {
      data = fileUrl;
    }

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mime,
            data: data
          }
        },
        "Analyze this item. Identify exactly what it is, classify its environmental threat potential, tell the user exactly how to sort/recycle/compost/dispose it safely, and suggest a creative waste-to-business upcycling idea."
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedMaterial: {
              type: Type.STRING,
              description: "The name of the item identified (e.g. crumpled plastic beverage bottle, rusted batteries)."
            },
            wasteCategory: {
              type: Type.STRING,
              description: "One of: Recyclable, Compostable, Hazardous Waste, Upcyclable, Landfill, Electronic Waste."
            },
            sortingInstructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Step-by-step instructions (e.g. wash it, peel labels, return to collection hub) to safely handle."
            },
            ecoAlternativeBizIdea: {
              type: Type.STRING,
              description: "A highly creative, actual business conversion concept for this waste stream (such as grinding it for 3D printer filament or crafting tiles)."
            }
          },
          required: ["identifiedMaterial", "wasteCategory", "sortingInstructions", "ecoAlternativeBizIdea"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Error in /api/sort-waste:", err);
    res.status(500).json({ error: err.message || "Failed to analyze material." });
  }
});

// 3. Environment & Business Feature: Make a business canvas out of any custom waste material
app.post("/api/generate-business", async (req, res) => {
  try {
    const { wasteMaterial } = req.body;
    if (!wasteMaterial) {
      return res.status(400).json({ error: "Missing wasteMaterial material description." });
    }

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: `
        You are a venture capitalist specializing in circular economy and green micro-enterprises.
        propose a business model that converts the waste material "${wasteMaterial}" into a valuable upscale consumer product.
        Provide creative, concrete details. For example, converting discarded rubber tires into stylish outdoor footwear, or coconut shells into activated charcoal powder.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wasteMaterial: { type: Type.STRING },
            businessName: { type: Type.STRING, description: "A catchy names for the eco-brand." },
            productDescription: { type: Type.STRING, description: "Exactly what product is crafted out of the waste and why it is stylish/functional." },
            targetMarket: { type: Type.STRING, description: "Core audience (e.g. Gen-Z interior decorators, organic farming co-ops)." },
            difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard processing requirements." },
            environmentalImpact: { type: Type.STRING, description: "How this improves landfills or ocean pollution volumes." },
            revenueModel: { type: Type.STRING, description: "Detailed strategy on sourcing and high-margin sales structure." }
          },
          required: ["wasteMaterial", "businessName", "productDescription", "targetMarket", "difficulty", "environmentalImpact", "revenueModel"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Error in /api/generate-business:", err);
    res.status(500).json({ error: err.message || "Failed to generate business concept." });
  }
});

// 4. Learn and Resolve: Generate biocuring/remediation solution for any eco issue
app.post("/api/generate-learn-resolve", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter." });
    }

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: `
        You are an environmental engineering professor. 
        Formulate a detailed biochemical, physical, or systematic workbook explaining how to solve the issue of "${query}".
        For example: how to treat food waste -> solution title: Decentralized Dry-Methane Anaerobic Digestion (biogas).
        Ensure it reads with extreme technical precision but contains clear instructions suitable for community implementation or DIY.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issue: { type: Type.STRING, description: "The core environmental hazard identified." },
            category: { type: Type.STRING, description: "E.g. Bio-Energy, Soil Remediation, Water Re-purposing, Carbon Sequestering." },
            description: { type: Type.STRING, description: "Summary why this issue causes extreme degradation if left unaddressed." },
            solutionTitle: { type: Type.STRING, description: "The scientific or engineering solution title." },
            solutionDetails: { type: Type.STRING, description: "A multi-paragraph comprehensive operational sequence of how the chemical or mechanical process works." },
            benefits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 direct ecological benefits resulting from implementing this solution."
            }
          },
          required: ["issue", "category", "description", "solutionTitle", "solutionDetails", "benefits"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Error in /api/generate-learn-resolve:", err);
    res.status(500).json({ error: err.message || "Failed to generate learning material." });
  }
});

// 5. Future Solution Forecast: Project futurist challenges globally in real time (simulated weekly updating)
app.get("/api/future-threats", async (req, res) => {
  try {
    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: `
        You are a Climate Risk Modeler.
        Generate exactly 4 projection hazards scheduled to occur globally in future years (between 2030 and 2060).
        Assign them to specific localized addresses or landmarks globally with precise latitude and longitude.
        Examples include rising salinity in the Nile Delta (2032), permafrost methane sinkhole collapses in Yamal Peninsula (2038), hydrogen-sulfide coastal outgassing in the Baltic Sea (2045).
        Vary the locations widely to span different continents (e.g., South America, Africa, Arctic, Asia).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A simple short unique snake_case slug." },
              year: { type: Type.INTEGER, description: "The future projected crisis year (2030-2060)." },
              title: { type: Type.STRING, description: "A highly scientific title for the threat hazard." },
              address: { type: Type.STRING, description: "A specific address, city or ecological region and country." },
              latitude: { type: Type.NUMBER, description: "Vaguely accurate latitude coordinate." },
              longitude: { type: Type.NUMBER, description: "Vaguely accurate longitude coordinate." },
              riskDescription: { type: Type.STRING, description: "A terrifyingly realistic scientific description of why files will break down and how it disrupts food webs or sea states." },
              severity: { type: Type.STRING, description: "Moderate, Severe, or Critical." },
              requiredSolutionType: { type: Type.STRING, description: "The domain of engineering required to solve it (e.g. Bio-engineering, Marine desalination, Geo-engineering, Synthetic ecology)." }
            },
            required: ["id", "year", "title", "address", "latitude", "longitude", "riskDescription", "severity", "requiredSolutionType"]
          }
        }
      }
    });

    const result = JSON.parse(response.text || "[]");
    res.json(result);
  } catch (err: any) {
    console.error("Error in /api/future-threats:", err);
    // Provide a comprehensive fall-back set of real-time futuristic models if API is unconfigured
    res.json([
      {
        id: "nile_delta_salinity_2032",
        year: 2032,
        title: "Hyper-Salinization Crisis in Nile Delta Crop Zones",
        address: "Nile Delta, Egypt",
        latitude: 31.2,
        longitude: 31.0,
        riskDescription: "Sea-level intrusion and decreased river velocity cause fresh water aquifer tables to brackish completely,threatening regional wheat crops and food security.",
        severity: "Critical",
        requiredSolutionType: "Agricultural Hydro-Engineering"
      },
      {
        id: "yamal_sinkhole_collapse_2038",
        year: 2038,
        title: "Permafrost Outgassing & Crater Collapses",
        address: "Yamal Peninsula, Siberia",
        latitude: 70.0,
        longitude: 72.0,
        riskDescription: "Subterranean gas hydrate methane explosions leave 50-meter-deep visual craters, introducing violent spikes in greenhouse gas concentration into the arctic circle.",
        severity: "Severe",
        requiredSolutionType: "Cryo-Engineering & Methane Mitigation"
      },
      {
        id: "marinas_corals_bleaching_2042",
        year: 2042,
        title: "Coral Collapse & Marine Anoxia Event",
        address: "Great Barrier Reef, Australia",
        latitude: -18.28,
        longitude: 147.69,
        riskDescription: "Elevated marine heat waves trigger absolute coral symbiont expulsion, leading to regional food web starvation and reef framework calcification failures.",
        severity: "Critical",
        requiredSolutionType: "Synthetic Marine Genomics"
      }
    ]);
  }
});

// 6. Future Evaluator: Evaluate a user's proposed futuristic climate solution
app.post("/api/evaluate-future-solution", async (req, res) => {
  try {
    const { threatTitle, userSolution, requiredSolutionType } = req.body;
    if (!userSolution) {
      return res.status(400).json({ error: "Missing proposed userSolution text." });
    }

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: `
        You are a Climate Venture Reviewer and Nobel Prize-winning science advisor.
        Critique the user's viability in solving the future environmental crisis described:
        - Crisis Title: "${threatTitle}"
        - Expected solution style: "${requiredSolutionType}"
        - User's Solution: "${userSolution}"
        
        Assign a rigorous, mathematically valid scientific viability score between 1 and 100 base on chemistry, physical viability, logistics, scalability, and ethical impact. Include a thorough analysis pointing out loopholes, strong concepts, and advice on modifications needed.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            viabilityScore: { type: Type.INTEGER, description: "The score out of 100." },
            aiFeedback: { type: Type.STRING, description: "Detailed 4-5 sentence professional peer review of the solution." }
          },
          required: ["viabilityScore", "aiFeedback"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Error in /api/evaluate-future-solution:", err);
    res.status(500).json({ error: err.message || "Failed to evaluate future solution." });
  }
});

// ==========================================
// VITE OR STATIC SERVING MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Environment-Friendly AI Express server running on URL http://localhost:${PORT}`);
  });
}

startServer();
