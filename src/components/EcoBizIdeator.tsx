import React, { useState } from 'react';
import { Award, Briefcase, Sparkles, Sprout, ArrowRight, Package, TrendingUp, RefreshCw } from 'lucide-react';
import { BusinessEnvironmentItem } from '../types';

const INITIAL_BUSINESS_CASES: BusinessEnvironmentItem[] = [
  {
    id: "eb_sunglasses",
    wasteMaterial: "Ocean-Dumped PET Plastic Bottles & Drift Flotsam",
    businessName: "OceanOptics Eyewear",
    productDescription: "Hand-crafted designer sunglasses featuring polarized UV400 protective lenses. The frames are injection-molded entirely from recycled PET bottle flakes recovered by community cleanup taskforces.",
    targetMarket: "Eco-conscious Gen-Z, surfers, outdoor explorers, premium retail boutiques.",
    difficulty: "Medium",
    environmentalImpact: "Extracts approximately 18 plastic beverage bottles from ocean estuaries per frame produced.",
    revenueModel: "Premium direct-to-consumer online sales at $85 per pair, with 10% profit returned directly to ocean cleanup crews."
  },
  {
    id: "eb_carpets",
    wasteMaterial: "Discarded Nylon Drift Fishing Nets (Ghost Nets)",
    businessName: "NetTread Carpeting",
    productDescription: "Commercial-grade modular carpet tiles designed for high-traffic office spaces. Ghost nets are melted into sturdy nylon fibers and colored with organic waterless dyes.",
    targetMarket: "Corporate architects, university campuses, sustainable construction developers.",
    difficulty: "Hard",
    environmentalImpact: "Recovers fatal marine entrapment nets, protecting sea turtles and whales while avoiding standard carbon emissions of virgin petroleum nylon synthesizers.",
    revenueModel: "B2B commercial specifications, averaging $32 per square yard with recurring restoration support."
  },
  {
    id: "eb_denim",
    wasteMaterial: "Post-Industrial Denim Scrap & Discarded Blue Jeans",
    businessName: "IndigoShield Insulation",
    productDescription: "High-density thermal and acoustic insulation batts for residential walls, completely manufactured by shredding old denim jeans and treating the fibers with non-toxic boric acid for flame resistance.",
    targetMarket: "Green building contractors, acoustic music studio builders, smart eco-homeowners.",
    difficulty: "Easy",
    environmentalImpact: "Diverts high-volume cotton textile scraps from incinerator chimneys and offers chemical-free interior airspace safety.",
    revenueModel: "Wholesale shipment orders to major regional eco-building material distributors."
  }
];

export default function EcoBizIdeator() {
  const [cases, setCases] = useState<BusinessEnvironmentItem[]>(INITIAL_BUSINESS_CASES);
  const [customMaterial, setCustomMaterial] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(INITIAL_BUSINESS_CASES[0].id);

  // Trigger Gemini API to generate custom waste conversion ideas
  const handleGenerateCustomIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMaterial) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wasteMaterial: customMaterial })
      });

      if (!response.ok) {
        throw new Error("Failed to ideate business concept.");
      }

      const generatedCase: BusinessEnvironmentItem = await response.json();
      generatedCase.id = `eb_cust_${Date.now()}`;

      setCases(prev => [generatedCase, ...prev]);
      setActiveCaseId(generatedCase.id);
      setCustomMaterial('');
    } catch (err) {
      console.error(err);
      // Fallback custom model on error
      const fallbackCase: BusinessEnvironmentItem = {
        id: `eb_err_${Date.now()}`,
        wasteMaterial: customMaterial,
        businessName: "EcoInnovate MicroLabs",
        productDescription: `Premium high-texture building panels or decorative products extruded and heat-pressed using 100% sourced ${customMaterial}.`,
        targetMarket: "Boutique designers, regional interior builders, eco-friendly consumer goods.",
        difficulty: "Medium",
        environmentalImpact: `Prevents un-reclaimable landfill dumping of ${customMaterial} and offsets synthetic resin carbon footprint.`,
        revenueModel: "SaaS local-sourcing subscription model coupled with directly fabricated high-margin online catalog sales."
      };
      setCases(prev => [fallbackCase, ...prev]);
      setActiveCaseId(fallbackCase.id);
      setCustomMaterial('');
    } finally {
      setIsGenerating(false);
    }
  };

  const activeCase = cases.find(c => c.id === activeCaseId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full" id="eco_biz_container">
      {/* Sidebar: Sourcing panel (4 columns) */}
      <div className="lg:col-span-5 flex flex-col gap-5" id="biz_left_column">
        
        {/* Custom Input Canvas box */}
        <div className="bg-neutral-950 border border-green-900/40 text-slate-105 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-400 animate-spin" />
            <div>
              <h3 className="font-bold text-sm text-white">AI Circular Brand Architect</h3>
              <p className="text-[10px] text-green-500 font-mono uppercase tracking-wider mt-0.5">Formulates eco-venture canvases in real-time</p>
            </div>
          </div>

          <form onSubmit={handleGenerateCustomIdea} className="flex flex-col gap-3">
            <label className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Enter Excess Material / Trash Sourcing:</label>
            <input
              type="text"
              value={customMaterial}
              onChange={(e) => setCustomMaterial(e.target.value)}
              placeholder="e.g., Orange peels, Used tires, Coffee grounds..."
              className="w-full text-xs bg-black/50 border border-green-900/40 rounded-lg py-2.5 px-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-500"
              required
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-4 rounded-lg text-xs transition flex justify-center items-center gap-1.5 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Structuring Brand Canvas...
                </>
              ) : (
                <>
                  <Briefcase className="w-3.5 h-3.5" /> Launch Brand Venture
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing pre-loaded circular cases list */}
        <div className="bg-[#121612] border border-green-900/30 rounded-2xl p-5 shadow-sm flex flex-col gap-4 flex-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">Active Circular Ventures</h3>
          <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1 font-sans">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCaseId(c.id)}
                className={`w-full text-left rounded-xl p-3 border transition flex items-center gap-3 group ${
                  activeCaseId === c.id 
                    ? 'border-green-500 bg-green-950/30 text-white shadow-[0_0_10px_rgba(34,197,94,0.15)] ring-1 ring-green-500/20' 
                    : 'border-green-900/15 bg-black/20 text-slate-300 hover:bg-green-950/10'
                }`}
              >
                <div className="bg-green-950 text-green-400 border border-green-900/40 p-2 rounded-lg flex-none mt-0.5">
                  <Package className="w-4 h-4" />
                </div>
                <div className="flex-1 w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-green-500/70 truncate">{c.wasteMaterial}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-green-300 transition-colors truncate">{c.businessName}</h4>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas View (7 columns) */}
      <div className="lg:col-span-7" id="biz_right_column">
        {activeCase ? (
          <div className="bg-[#121612] border border-green-900/30 rounded-2xl p-6 shadow-xl flex flex-col gap-6" id="biz_detail_canvas">
            
            {/* Header branding */}
            <div className="border-b border-green-900/20 pb-4 flex justify-between items-start gap-4">
              <div>
                <span className="text-xs font-bold font-mono text-green-400 uppercase tracking-widest">Circular Economy Concept Case</span>
                <h3 className="text-2xl font-extrabold text-white mt-1 leading-snug">{activeCase.businessName}</h3>
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1 font-mono">
                  Sourcing: <span className="text-green-400 font-bold">{activeCase.wasteMaterial}</span>
                </p>
              </div>

              <span className={`text-[10px] font-bold font-mono uppercase px-2.5 py-1 rounded border ${
                activeCase.difficulty === 'Easy' ? 'bg-green-950/60 text-green-400 border border-green-900/45' :
                activeCase.difficulty === 'Medium' ? 'bg-amber-950/60 text-amber-500 border border-amber-900/45' :
                'bg-rose-950/60 text-rose-450 border border-rose-900/45'
              }`}>
                Difficulty: {activeCase.difficulty}
              </span>
            </div>

            {/* Core Description */}
            <div className="bg-black/40 border border-green-900/25 rounded-xl p-4 flex flex-col gap-2 font-mono">
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Product & Engineering Description</span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeCase.productDescription}
              </p>
            </div>

            {/* Grid of VC Canvas Elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-green-900/20 bg-black/20 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase font-mono tracking-wider">Target Demographic</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeCase.targetMarket}</p>
              </div>

              <div className="border border-green-900/20 bg-black/20 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-green-400" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase font-mono tracking-wider">Ecological Volume Diverted</span>
                </div>
                <p className="text-xs text-slate-305 text-slate-300 leading-relaxed font-sans">{activeCase.environmentalImpact}</p>
              </div>
            </div>

            {/* Supply chain & revenue model card */}
            <div className="border border-green-900/30 rounded-xl p-4 bg-green-950/10 flex flex-col gap-2 mt-2">
              <span className="text-[10px] font-bold text-green-400 uppercase font-mono tracking-wider">Supply Chain & Revenue Synthesis</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeCase.revenueModel}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-slate-500 py-12 font-mono text-center">
            Choose a circular brand from active cases or create your own with the Circular Brand Architect.
          </div>
        )}
      </div>
    </div>
  );
}
