import React, { useState } from 'react';
import { Clock, Shield, AlertCircle, Compass, History, HelpCircle } from 'lucide-react';
import { HistoricalDisaster } from '../types';

const HISTORICAL_DATA: HistoricalDisaster[] = [
  {
    id: "hist_bhopal",
    title: "The Bhopal Gas Tragedy",
    year: 1984,
    location: "Bhopal, Madhya Pradesh, India",
    description: "Water leaked directly into a massive subterranean storage tank contenant forty-two tons of highly volatile Methyl Isocyanate (MIC) gas at the Union Carbide pesticide plant, triggering a hyper-exothermic chemical reaction.",
    consequences: "Lethal gas clouds blanketed surrounding residential density zones, leading to thousands of immediate deaths and chronic respiratory and neurological injuries for over half a million residents.",
    solutionsTaken: [
      "Immediate neutralization of the residual tank components via emergency flare burning systems.",
      "The passage of India's comprehensive Environment Protection Act of 1986.",
      "Enactment of absolute safety liabilities and the globally modeled Emergency Planning & Community Right-to-Know Act (EPCRA) to mandate chemical tracking inventories."
    ],
    modernLessons: "Chemical storage vessels must be equipped with fully redundant computerized acoustic leak containment valves, secondary inert liquid nitrogen cooling blankets and mechanical scrubbers maintained at absolute non-zero operational schedules."
  },
  {
    id: "hist_minamata",
    title: "The Minamata Mercury Poisoning",
    year: 1956,
    location: "Minamata Bay, Kumamoto, Japan",
    description: "The Chisso Corporation industrial chemical plant dumped massive waste volumes of organic methylmercury directly into local marine waters across decades, which bioaccumulated heavily inside local shellfish and finned species.",
    consequences: "Local fishing populations suffered devastating neurological breakdowns—extreme convulsions, motor coordination failures, birth mutations, and deaths—subsequently identified as Minamata Disease.",
    solutionsTaken: [
      "Rigorous physical dredging of 1.5 million cubic meters of contaminated toxic mercury beach sludge from Minamata bay.",
      "Installation of closed-loop chemical precipitate settling tanks at the plant.",
      "Adoption of the international Minamata Convention on Mercury in 2013 to ban trade and enforce tracking of mercury wastes globally."
    ],
    modernLessons: "Heavy metal industrial outfalls must undergo continuous atomic vacuum absorption filtration. No organic mercury compounds may ever be mixed with general public wastewater drainage pipes under extreme criminal prosecution."
  },
  {
    id: "hist_deepwater",
    title: "The Deepwater Horizon Subsea Blowout",
    year: 2010,
    location: "Gulf of Mexico, United States",
    description: "A high-pressure methane gas surge burst from a deep exploratory subsea petroleum oil well, bypassing cement seals and causing a violent fire explosion on the floating drilling platform, leading to its sinking.",
    consequences: "Uncontrolled subsea petroleum oil leaked directly at 1,500 meters depth across 87 straight days, depositing approximately 4.9 million barrels of crude onto shorelines, marshes, and deep water estuaries.",
    solutionsTaken: [
      "Subsea deployment of a 100-ton steel emergency 'Capping Stack' to seal the leaking well choke lines.",
      "Application of subsea and surface chemical dispersants (Corexit) to break down oil globules.",
      "Formulation of the US Bureau of Safety and Environmental Enforcement (BSEE) to split inspection oversight from drilling licensing."
    ],
    modernLessons: "Every drilling pipeline must integrate redundant acoustic-trigger subsea Blowout Preventers (BOPs) with dual high-shear rams capable of slicing titanium drill pipes under oceanic hydraulic velocities."
  }
];

export default function BeforeTime() {
  const [selectedDisasterId, setSelectedDisasterId] = useState<string | null>(HISTORICAL_DATA[0].id);

  const selectedDisaster = HISTORICAL_DATA.find(d => d.id === selectedDisasterId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full" id="before_time_container">
      {/* Sidebar Navigation: Timelines (4 columns) */}
      <div className="lg:col-span-5 flex flex-col gap-4" id="hist_left_column">
        <div className="bg-slate-50 border rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-700" />
            <h3 className="font-semibold text-sm text-slate-800">Historical Disasters Archive</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Review detailed, actual environmental crises from the past, how they were resolved on-the-scene, and what modern safety systems resulted.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {HISTORICAL_DATA.map((disaster) => (
            <button
              key={disaster.id}
              onClick={() => setSelectedDisasterId(disaster.id)}
              className={`w-full text-left rounded-xl p-4 border transition flex justify-between items-center ${
                selectedDisasterId === disaster.id 
                  ? 'border-emerald-600 bg-emerald-50/20 shadow-inner' 
                  : 'border-slate-100 bg-white hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 block">{disaster.year} • {disaster.location.split(',').pop()?.trim()}</span>
                <h4 className="text-xs font-bold text-slate-800 mt-1">{disaster.title}</h4>
              </div>
              <Clock className="w-4 h-4 text-slate-400 flex-none" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Details Panel (8 columns) */}
      <div className="lg:col-span-7" id="hist_right_column">
        {selectedDisaster ? (
          <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col gap-6" id="hist_details">
            {/* Title Block */}
            <div className="border-b pb-4 flex flex-col gap-1">
              <span className="text-xs font-bold font-mono text-emerald-600 block">{selectedDisaster.year} — HISTORICAL ANALYSIS</span>
              <h3 className="text-xl font-extrabold text-slate-800">{selectedDisaster.title}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Location: {selectedDisaster.location}</p>
            </div>

            {/* Description of Accident */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase font-mono">
                <AlertCircle className="w-4 h-4 text-rose-500" /> Cause of Catastrophe
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50 border rounded-lg p-3.5">
                {selectedDisaster.description}
              </p>
            </div>

            {/* Ecological Damage */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase font-mono">Ecological Damage & Toll</span>
              <p className="text-xs text-slate-500 border-l-2 border-rose-400 pl-3.5 leading-relaxed font-sans">
                {selectedDisaster.consequences}
              </p>
            </div>

            {/* Solutions Taken */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase font-mono">Emergency Remediation & Legal Solutions Taken</span>
              <div className="flex flex-col gap-2.5">
                {selectedDisaster.solutionsTaken.map((sol, index) => (
                  <div key={index} className="flex gap-2.5 items-start text-xs text-slate-600 leading-relaxed bg-emerald-50/10 border border-slate-100 p-3 rounded-lg">
                    <Shield className="w-4 h-4 text-emerald-600 flex-none mt-0.5" />
                    <p>{sol}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modern Preventative Standards */}
            <div className="border-t border-slate-100 pt-5 flex flex-col gap-2.5 bg-slate-905 border border-slate-800/10 p-4 rounded-xl">
              <span className="text-xs font-bold text-slate-800 uppercase font-mono leading-none tracking-wide">Preventative Engineering Standards Reductions</span>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {selectedDisaster.modernLessons}
              </p>
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-slate-400 py-12">
            Select a timeline incident to explore chemical failures and emergency remediation outcomes.
          </div>
        )}
      </div>
    </div>
  );
}
