import React, { useState } from 'react';
import { 
  AlertTriangle, Camera, Sprout, Briefcase, History, 
  Compass, ShieldCheck, Leaf, Globe, ChevronRight, MessageSquare,
  BarChart3
} from 'lucide-react';

import { PollutionReport, Volunteer, AIResolutionGuide } from './types';
import ReportIssue from './components/ReportIssue';
import EnvironmentalDashboard from './components/EnvironmentalDashboard';
import SmartSorter from './components/SmartSorter';
import LearnResolve from './components/LearnResolve';
import EcoBizIdeator from './components/EcoBizIdeator';
import BeforeTime from './components/BeforeTime';
import FutureSolution from './components/FutureSolution';
import { ToastContainer, ToastMessage } from './components/ToastNotification';
import ReportModal from './components/ReportModal';
import LoginModal from './components/LoginModal';

// 2-3 comprehensive initial reported issues for immediate beautiful layout mapping
const INITIAL_REPORTS: PollutionReport[] = [
  {
    id: "rep_deforest_01",
    title: "Heavy Illegal Mahogany Logging Sector 3",
    description: "Multi-ton forestry logging equipment and clearcut canopy gaps stretching across ancestral reserve borders. Critical erosion threatens adjacent river mudbanks.",
    category: "deforestation",
    status: "reported",
    latitude: -3.4658,
    longitude: -62.2159,
    address: "Amazonian Rainforest Reserve Sec-3, Brazil",
    reportedAt: "2026-05-28T09:15:00Z",
    volunteers: [
      {
        id: "v_1",
        name: "Marcus Aurelius",
        email: "marcus@forestry.org",
        role: "trees",
        solutionWork: "Planting fast-grow local canopy seedlings and creating heavy organic soil logs as physical mud guards."
      }
    ],
    aiResolutionGuide: {
      summary: "Severe biotope threat with extensive mahogany canopy logging. Clear-cutting strips critical root matrix locks, leading to complete topsoil erosion hazards.",
      immediateSteps: [
        "Erect high-visibility warning stakes to outline protected tribal boundaries.",
        "Integrate felled branches and bio-logs perpendicular to slope channels to slow rain sediments.",
        "Collect native canopy seeds for emergency container nursing."
      ],
      longTermSolutions: [
        "Lobby for drone-reconnaissance patrols over boundary junctions.",
        "Sow quick-root leguminous shrubs (Acacia) to inject critical nitrogen back into degraded topsoil."
      ],
      neededResources: [
        "1500 Acacia seed plugs",
        "Biodegradable sediment logs",
        "Soil moisture tracking probes"
      ],
      safetyPrecautions: [
        "Beware of unstable mud slope collapses during heavy rainfall.",
        "Always wear durable logging protection sleeves to prevent wood splits."
      ]
    }
  },
  {
    id: "rep_wash_02",
    title: "Leaking Electroplating Acid Drainage Heap",
    description: "Rusted processing drums leaking a deep blue acidic residue directly into local creek beds. Surrounding grass species display severe biological chlorosis.",
    category: "water_pollution",
    status: "reported",
    latitude: 31.2589,
    longitude: 31.1025,
    address: "El-Mahalla Outflow Creek, Nile Delta",
    reportedAt: "2026-05-30T14:40:00Z",
    volunteers: [],
  }
];

export default function App() {
  const [reports, setReports] = useState<PollutionReport[]>(INITIAL_REPORTS);
  const [activeTab, setActiveTab] = useState<'reports' | 'analytics' | 'sorter' | 'learn' | 'biz' | 'history' | 'future'>('reports');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(INITIAL_REPORTS[0].id);
  const [isQuickReportOpen, setIsQuickReportOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Logic pointers passed to sub-components
  const handleAddReport = (newReport: PollutionReport) => {
    setReports(prev => [newReport, ...prev]);
    addToast("New Issue Reported", `A new ${newReport.category.replace('_', ' ')} incident has been logged.`, 'success');
  };

  const handleAddVolunteer = (reportId: string, volunteer: Volunteer) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        const vols = rep.volunteers || [];
        return {
          ...rep,
          volunteers: [...vols, volunteer]
        };
      }
      return rep;
    }));
    addToast("Volunteer Registered", `${volunteer.name} has joined the remediation effort!`, 'success');
  };

  const handleUpdateAIResolution = (reportId: string, guide: AIResolutionGuide) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          aiResolutionGuide: guide,
          status: 'resolved'
        };
      }
      return rep;
    }));
    addToast("AI Analysis Complete", "Remediation guide generated and issue marked resolved.", 'info');
  };

  const handleUpdateReportStatus = (reportId: string, status: PollutionReport['status']) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status
        };
      }
      return rep;
    }));
    addToast("Status Updated", `Report status transitioned to ${status.toUpperCase()}.`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#0a0c0a] text-slate-200 flex flex-col font-sans antialiased" id="main_app_wrapper">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* GLOBAL BANNER */}
      <header className="bg-[#0d110d] border-b border-green-900/30 sticky top-0 z-40 shadow-xl shadow-black/40" id="global_header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-[9px] font-bold font-mono text-green-500 tracking-widest uppercase block leading-none">Global Eco-Remediation System</span>
              <h1 className="text-xl font-black text-white tracking-wider mt-0.5">NATURE <span className="text-green-500">BoOk</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="hidden md:block bg-[#121612] hover:bg-green-950/40 text-green-400 border border-green-900/40 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 uppercase font-mono tracking-wider"
            >
              System Login
            </button>
            <button
              onClick={() => setIsQuickReportOpen(true)}
              className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] flex items-center gap-1.5 uppercase font-mono tracking-wider"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Quick Report
            </button>
            <div className="hidden lg:flex items-center gap-3 bg-[#121612] border border-green-900/30 rounded-xl px-4 py-1.5" id="header_coordinates">
              <Globe className="w-4 h-4 text-green-400 animate-spin" />
              <span className="text-xs font-mono font-medium text-green-400">System Integrity: Online // UTC 2026</span>
            </div>
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <ReportModal
        isOpen={isQuickReportOpen}
        onClose={() => setIsQuickReportOpen(false)}
        onAddReport={handleAddReport}
      />

      {/* TABS SELECTOR IN MAIN BODY */}
      <div className="bg-[#0b0e0b] border-b border-green-900/20" id="tabs_bar_container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1.5 py-3.5 overflow-x-auto" aria-label="Tabs">
            {[
              { id: 'reports', label: '1. Pollution Feed & Volunteers', icon: AlertTriangle },
              { id: 'analytics', label: '2. Live Impact Dashboard', icon: BarChart3 },
              { id: 'sorter', label: '3. Real-Time AI Trash Sorter', icon: Camera },
              { id: 'learn', label: '4. Learn & Resolve Workbook', icon: Sprout },
              { id: 'biz', label: '5. Business & Environment', icon: Briefcase },
              { id: 'history', label: '6. Before Time (History)', icon: History },
              { id: 'future', label: '7. Future Solutions', icon: Compass }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    isSelected
                      ? 'bg-green-600/20 text-green-400 border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                      : 'text-slate-400 border-transparent hover:text-white hover:bg-green-950/25'
                  }`}
                  style={{ minHeight: '44px' }} // Standard 44px mobile touch-target
                >
                  <TabIcon className={`w-4 h-4 ${isSelected ? 'text-green-400' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* CORE PAGES RENDER STAGE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="application_viewport">
        {activeTab === 'reports' && (
          <ReportIssue
            reports={reports}
            onAddReport={handleAddReport}
            onAddVolunteer={handleAddVolunteer}
            onUpdateAIResolution={handleUpdateAIResolution}
            onUpdateReportStatus={handleUpdateReportStatus}
            selectedReportId={selectedReportId}
            onSelectReportId={setSelectedReportId}
          />
        )}
        {activeTab === 'analytics' && (
          <EnvironmentalDashboard
            reports={reports}
            onSelectReport={(reportId) => {
              setSelectedReportId(reportId);
              setActiveTab('reports');
            }}
          />
        )}
        {activeTab === 'sorter' && <SmartSorter />}
        {activeTab === 'learn' && <LearnResolve />}
        {activeTab === 'biz' && <EcoBizIdeator />}
        {activeTab === 'history' && <BeforeTime />}
        {activeTab === 'future' && <FutureSolution />}
      </main>

      {/* SYSTEM INTEGRATION FOOTER */}
      <footer className="bg-black border-t border-green-900/30 py-6 text-center text-xs text-slate-500" id="global_footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 font-sans">© 2026 Nature BoOk // Biospheric Remediation Protocol Active</p>
          <div className="flex gap-4 font-mono text-[9px] uppercase tracking-[2px]">
            <span className="text-green-500 block">● Satellite Uplink: Stable</span>
            <span className="text-green-905 text-green-900">|</span>
            <span className="text-green-400">Global Toxicity Level: 0.14% PPM</span>
            <span className="text-green-905 text-green-900">|</span>
            <span className="text-slate-500">Design Version 4.02 // Powered by Bio-AI Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
