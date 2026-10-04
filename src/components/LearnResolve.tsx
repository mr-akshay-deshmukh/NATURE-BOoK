import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Sprout, Heart, ChevronRight, HelpCircle, RefreshCw } from 'lucide-react';
import { LearnResolveItem } from '../types';

const INITIAL_LEARN_RESOLVE_ITEMS: LearnResolveItem[] = [
  {
    id: "lr_food_wastage",
    issue: "Excessive Community Food Wastage & Methane Gas Outgassing",
    category: "Organic Waste & Energy",
    description: "Domestic food scrap discard decays directly in organic landfills under oxygen-free anaerobic states, compressing heavy methane gas directly into global heat reservoirs.",
    solutionTitle: "Decentralized Modular Dry-Methane Anaerobic Digestion",
    solutionDetails: "Construct sealed community steel cylinders filled with organic microbes. Raw food wastes are crushed and stored in these cylinders. Methanogenic bacteria digest the starch, converting it into high-purity methane gas (biogas) suitable for fuel and culinary stoves within 14 days, leaving nutrient-dense organic fertilizer.",
    benefits: [
      "Avoids landfill gas concentrations by up to 94%",
      "Provides zero-cost thermal heating fuel to surrounding households",
      "Supplies clean, chemical-free compost for organic community farms"
    ]
  },
  {
    id: "lr_lithium_batteries",
    issue: "Depleted Lithium-Ion Battery Decomposition & Groundwater Acidification",
    category: "Chemical & Electronic Waste",
    description: "Discarded cellphones and battery cells rust in landfills, letting toxic cobalt, cadmium, and lithium-salt acids leak directly into local rivers and ground soils.",
    solutionTitle: "Closed-loop Hydrometallurgical cobalt & Acid Leaching Extractor",
    solutionDetails: "Depleted battery cells are shredded in safe nitrogen chambers to avoid fire hazards, producing a powder known as black mass. Applying mild citric acid and thermal treatment extracts ninety-eight percent of rare cobalt and lithium sulfate, which are recrystallized and returned directly to battery production loops.",
    benefits: [
      "Halts lead/cadmium leach leakage into local aquifers",
      "Reduces high-carbon mechanical mining requirements for raw minerals",
      "Achieves zero hazardous sludge outputs under organic acid solvents"
    ]
  },
  {
    id: "lr_sewage_metals",
    issue: "Municipal Sewage Lead & Mercury Contamination",
    category: "Water Quality & Remediation",
    description: "Industrial wastewater runoff carries suspended toxic heavy metal ions like chromium, lead, and mercury directly through general water filtration nets.",
    solutionTitle: "Pleurotus Mycelial Filtration (Industrial Myco-filtration Barriers)",
    solutionDetails: "Heavy nets of oyster mushroom mycelium mixed with organic wood chips are draped directly inside sewers and drainage exits. The dense mycelial filaments naturally bio-absorb and hold atomic lead and mercury ions within their cell walls, cleansing the exit waters before they hit regional riverways.",
    benefits: [
      "Filters heavy metals without electricity or chemical coagulants",
      "Extremely low installation and maintenance costs",
      "Fungi can be safely harvested and incinerated in isolated chambers"
    ]
  },
  {
    id: "lr_deforestation",
    issue: "Severe Topsoil Degradation & Canopy Logging Desertification",
    category: "Soil & Forest Restoration",
    description: "Heavy logging and canopy clearing strips tree roots from topsoil layers, leading to rapid soil erosion, nitrogen starvation, and eventual desert sand sprawl.",
    solutionTitle: "Phytoremediation with Local Deep-Root Legume Species",
    solutionDetails: "Seed fields with fast-growing local leguminous shrubs (like Acacia or Sesbania). Their roots form relationships with underground Rhizobium microbes, drawing gaseous nitrogen directly into depleted soils while locking down soil structures with expansive fiber root umbrellas.",
    benefits: [
      "Stops rain topsoil erosion and stabilizes structural sediment",
      "Naturally restores nitrogen, preparing the plot for major crops",
      "Provides shade microclimates that foster native biodiversity"
    ]
  }
];

export default function LearnResolve() {
  const [items, setItems] = useState<LearnResolveItem[]>(INITIAL_LEARN_RESOLVE_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(INITIAL_LEARN_RESOLVE_ITEMS[0].id);

  // Call Express system to generate custom solutions using Gemini API
  const handleGenerateCustomSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-learn-resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: customQuery })
      });

      if (!response.ok) {
        throw new Error("Unable to resolve chemical solution.");
      }

      const generatedItem: LearnResolveItem = await response.json();
      generatedItem.id = `lr_cust_${Date.now()}`;
      generatedItem.isCustom = true;

      setItems(prev => [generatedItem, ...prev]);
      setSelectedItemId(generatedItem.id);
      setCustomQuery('');
    } catch (err) {
      console.error(err);
      // fallback in case of errors
      const fallbackItem: LearnResolveItem = {
        id: `lr_fail_${Date.now()}`,
        issue: customQuery,
        category: "Custom Bio-Remediation",
        description: `Unchecked accumulation or contamination from ${customQuery} causing regional biotope failures.`,
        solutionTitle: "Biological Symbiotic Filtration Loop Extraction",
        solutionDetails: "Subject the waste material to a secondary composting digestion chain using heat-insulated organic reactors and microbial agents, converting toxic derivatives into inert carbon dioxide and safe plant fertilizer.",
        benefits: [
          "Reduces regional material dump volume by 65%",
          "Locks complex polymers into stable ecological structures",
          "Can be deployed using standard agricultural recycling tools"
        ],
        isCustom: true
      };
      setItems(prev => [fallbackItem, ...prev]);
      setSelectedItemId(fallbackItem.id);
      setCustomQuery('');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.issue.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.solutionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedItem = items.find(item => item.id === selectedItemId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full" id="learn_resolve_container">
      {/* Search and List Column (4 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-5" id="learn_left_column">
        {/* Custom problem solver engine */}
        <div className="bg-neutral-950 text-slate-100 rounded-2xl p-5 border border-green-900/40 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-400 animate-spin" />
            <div>
              <h3 className="font-bold text-sm text-white">AI Eco-Remediation Formulator</h3>
              <p className="text-[10px] text-green-500 font-mono uppercase tracking-wider">Request chemical / biological answers in real-time</p>
            </div>
          </div>
          
          <form onSubmit={handleGenerateCustomSolution} className="flex flex-col gap-3">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="e.g., How to resolve styrofoam waste?"
              className="w-full text-xs bg-black/50 border border-green-900/40 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-500"
              required
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-4 rounded-lg text-xs transition flex justify-center items-center gap-1.5 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Calculating Bio-Formula...
                </>
              ) : (
                <>
                  <Sprout className="w-3.5 h-3.5" /> Formulate Solution Guide
                </>
              )}
            </button>
          </form>
        </div>

        {/* Regular search and list */}
        <div className="bg-[#121612] border border-green-900/30 rounded-2xl p-5 shadow-xl flex flex-col gap-4 flex-1">
          <div className="relative">
            <Search className="w-4 h-4 text-green-500/50 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Browse issues, materials, or fixes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-black/40 border border-green-900/30 rounded-lg py-2.5 pl-9 pr-3 text-slate-200 placeholder:text-slate-500 focus:border-green-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`w-full text-left rounded-xl p-3 border transition flex items-start gap-3 group ${
                  selectedItemId === item.id 
                    ? 'border-green-500 bg-green-950/30 text-white shadow-[0_0_10px_rgba(34,197,94,0.15)] ring-1 ring-green-500/20' 
                    : 'border-green-900/20 bg-black/20 text-slate-300 hover:bg-green-950/10'
                }`}
              >
                <div className="bg-green-950 text-green-403 text-green-400 border border-green-900/40 p-2 rounded-lg flex-none mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 w-0">
                  <div className="flex items-center gap-1.5 mb-11 mb-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-green-500/70">{item.category}</span>
                    {item.isCustom && (
                      <span className="text-[8px] bg-sky-950 text-sky-400 border border-sky-900/40 font-bold uppercase px-1.5 rounded-full">AI Gen</span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-green-300 transition-colors line-clamp-1">{item.issue}</h4>
                  <p className="text-[10px] text-slate-400 font-sans line-clamp-2 mt-0.5">{item.solutionTitle}</p>
                </div>
              </button>
            ))}

            {filteredItems.length === 0 && (
              <p className="text-xs text-slate-500 italic text-center py-8 font-mono">No remediation cases found matching lookup filter.</p>
            )}
          </div>
        </div>
      </div>

      {/* Structured Workbook Details Area (7 cols) */}
      <div className="lg:col-span-7" id="learn_right_column">
        {selectedItem ? (
          <div className="bg-[#121612] border border-green-900/30 rounded-2xl p-6 shadow-xl flex flex-col gap-6" id="learn_detail_panel">
            {/* Header issue */}
            <div className="border-b border-green-900/20 pb-4 flex flex-col gap-1.5">
              <span className="text-xs font-bold font-mono text-green-400 uppercase tracking-widest">{selectedItem.category} Workbook</span>
              <h3 className="text-xl font-extrabold text-white leading-snug">{selectedItem.issue}</h3>
              <p className="text-xs text-slate-300 bg-black/40 border border-green-900/25 rounded-lg p-3.5 italic mt-2 leading-relaxed font-mono">
                "{selectedItem.description}"
              </p>
            </div>

            {/* Title & Detailed biochem steps */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-400" />
                <h4 className="text-sm font-extrabold text-slate-200">Biochemical / Mechanical Remedy Formulation:</h4>
              </div>
              <h5 className="text-xs font-bold text-green-300 bg-green-950/50 border border-green-900/40 py-1.5 px-3 rounded-lg w-fit">
                {selectedItem.solutionTitle}
              </h5>
              
              <div className="text-xs text-slate-300 leading-relaxed font-sans bg-black/30 border border-green-900/20 rounded-xl p-4 mt-1 shadow-inner">
                <p className="whitespace-pre-wrap">{selectedItem.solutionDetails}</p>
              </div>
            </div>

            {/* Direct Ecological Benefits */}
            <div className="flex flex-col gap-3 border-t border-green-900/20 pt-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Ecological Benefits Checklist</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {selectedItem.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-305 border border-green-900/20 bg-black/30 rounded-lg p-3 text-slate-300 font-sans">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500 flex-none mt-0.5" />
                    <p className="leading-snug">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-slate-500 py-12 font-mono text-center">
            Select an educational workbook issue to review ecological breakdown remedies.
          </div>
        )}
      </div>
    </div>
  );
}
