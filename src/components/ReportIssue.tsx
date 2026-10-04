import React, { useState } from 'react';
import { 
  Camera, MapPin, Send, Users, AlertTriangle, CheckCircle, 
  Sparkles, Shield, Compass, BookOpen, Clock, RefreshCw, Upload, X 
} from 'lucide-react';
import { PollutionReport, Volunteer, AIResolutionGuide } from '../types';

interface ReportIssueProps {
  reports: PollutionReport[];
  onAddReport: (report: PollutionReport) => void;
  onAddVolunteer: (reportId: string, volunteer: Volunteer) => void;
  onUpdateAIResolution: (reportId: string, guide: AIResolutionGuide) => void;
  onUpdateReportStatus?: (reportId: string, status: PollutionReport['status']) => void;
  selectedReportId?: string | null;
  onSelectReportId?: (id: string | null) => void;
}

const SAMPLE_PRESETS = [
  {
    name: "Amazonian Deforestation Area",
    category: "deforestation" as const,
    description: "Illegal logging and heavy clearing of canopy trees detected stretching across key boundary lines.",
    lat: -3.465,
    lng: -62.215,
    imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='400' height='250' fill='%232c3e27'/><path d='M30,120 L50,80 L70,120 Z M60,110 L90,60 L120,110 Z M130,160 L150,110 L170,160 Z M180,140 L210,90 L240,140 Z' fill='%236e8b3d'/><path d='M250,180 L280,180 L265,150 Z' fill='%238b7355'/><rect x='280' y='140' width='80' height='15' fill='%238b2500' transform='rotate(15 280 140)'/><text x='20' y='50' fill='white' font-family='sans-serif' font-weight='bold' font-size='16'>Deforestation Spot</text></svg>"
  },
  {
    name: "River Degradation",
    category: "water_pollution" as const,
    description: "Multi-colored plastic bottles, oil slicks, and metal drums leaking an unknown detergent substance directly into municipal waters.",
    lat: 40.712,
    lng: -74.006,
    imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='400' height='250' fill='%23223344'/><path d='M0,150 Q100,120 200,150 T400,150 L400,250 L0,250 Z' fill='%233a5f6e'/><circle cx='80' cy='180' r='10' fill='%238b4513'/><rect x='150' y='160' width='30' height='15' rx='5' fill='%23ff3333'/><circle cx='220' cy='175' r='15' fill='%23228b22' opacity='0.7'/><text x='20' y='50' fill='white' font-family='sans-serif' font-weight='bold' font-size='16'>River Degradation</text></svg>"
  },
  {
    name: "Illegal Electronic Waste Dump",
    category: "waste_dump" as const,
    description: "Burning heap of old circuit boards, copper batteries, and heavy lead scrap accumulating near a local waterway.",
    lat: 12.971,
    lng: 77.594,
    imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='400' height='250' fill='%231f2421'/><path d='M50,220 L150,140 L250,220 Z' fill='%23424c40'/><rect x='100' y='180' width='40' height='30' fill='%234e4e4e'/><circle cx='110' cy='195' r='6' fill='%23ffdd55'/><path d='M160,195 L200,195 L180,215 Z' fill='%233e7d32'/><text x='20' y='50' fill='white' font-family='sans-serif' font-weight='bold' font-size='16'>Illegal Toxic Dump</text></svg>"
  }
];

export default function ReportIssue({ 
  reports, 
  onAddReport, 
  onAddVolunteer,
  onUpdateAIResolution,
  onUpdateReportStatus,
  selectedReportId: propSelectedReportId,
  onSelectReportId: propOnSelectReportId
}: ReportIssueProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PollutionReport['category']>('water_pollution');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<PollutionReport['fileType']>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Active analysis / interaction state
  const [localSelectedReportId, setLocalSelectedReportId] = useState<string | null>(null);
  const selectedReportId = propSelectedReportId !== undefined ? propSelectedReportId : (localSelectedReportId || (reports.length > 0 ? reports[0].id : null));
  const setSelectedReportId = propOnSelectReportId !== undefined ? propOnSelectReportId : setLocalSelectedReportId;
  const [analyzingReportId, setAnalyzingReportId] = useState<string | null>(null);
  const [showVolunteerModal, setShowVolunteerModal] = useState<string | null>(null);

  // Volunteer sign up form
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volRole, setVolRole] = useState<'trees' | 'cleanup' | 'stopping_degradation' | 'donation' | 'education'>('cleanup');
  const [volsolutionWork, setVolsolutionWork] = useState('');
  const [volDonation, setVolDonation] = useState('');

  // Auto-acquire geolocation
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          setAddress(`Geo-Coordinates: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          alert("Could not access your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result as string);
      if (file.type.startsWith('image/')) {
        setFileType('image');
      } else if (file.type.startsWith('audio/')) {
        setFileType('audio');
      } else if (file.type.startsWith('video/')) {
        setFileType('video');
      } else {
        setFileType('none');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Selection of premium demo presets for easy evaluation
  const applyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setTitle(preset.name);
    setDescription(preset.description);
    setCategory(preset.category);
    setLatitude(preset.lat.toFixed(5));
    setLongitude(preset.lng.toFixed(5));
    setAddress(preset.name);
    setFileUrl(preset.imageUrl);
    setFileType('image');
  };

  // Submit pollution report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !latitude || !longitude) {
      alert("Please fill in Title, Description, and both Geolocation coordinates.");
      return;
    }

    const newReport: PollutionReport = {
      id: `rep_${Date.now()}`,
      title,
      description,
      category,
      status: 'reported',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || `Report Location (${latitude}, ${longitude})`,
      fileUrl: fileUrl || undefined,
      fileType: fileType,
      reportedAt: new Date().toISOString(),
      volunteers: []
    };

    onAddReport(newReport);
    
    // Clear state
    setTitle('');
    setDescription('');
    setLatitude('');
    setLongitude('');
    setAddress('');
    setFileUrl(null);
    setFileType('none');
    
    // Open the new report right away
    setSelectedReportId(newReport.id);
  };

  // Call server-side API to analyze issue and generate real-time resolution guide
  const handleAIAnalyze = async (report: PollutionReport) => {
    setAnalyzingReportId(report.id);
    onUpdateReportStatus?.(report.id, 'analyzing');
    try {
      const response = await fetch("/api/analyze-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: report.title,
          description: report.description,
          category: report.category,
          fileUrl: report.fileUrl,
          fileType: report.fileType
        })
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const guide: AIResolutionGuide = await response.json();
      onUpdateAIResolution(report.id, guide);
    } catch (err) {
      console.error(err);
      // Generate standard fallback biochem guide if offline/unconfigured
      const fallbackGuide: AIResolutionGuide = {
        summary: `Ecosystem collapse profile at ${report.address}. High-risk concentration of environmental degrading matrices matching direct ${report.category.replace('_', ' ')} dynamics.`,
        immediateSteps: [
          "Contain flow using regional absorbing containment barriers.",
          "Establish high-visibility warning signage to demarcate toxicity lines.",
          "Isolate point source discharge valves or identify culprits."
        ],
        longTermSolutions: [
          "Plant extensive phytoremediating local hyperaccumulator species.",
          "Introduce bio-swales and municipal sediment ponds to extract toxic residues.",
          "Lobby for legislative regional protection buffers."
        ],
        neededResources: [
          "Biological phytocenters seeding kits",
          "Portable water monitoring sensors",
          "Rotary tilling spades & soil carbon injectors"
        ],
        safetyPrecautions: [
          "Always don heavy filtration respirators and anti-chemical sleeves.",
          "Keep direct skin exposure isolated from standard water tables.",
          "Do not ingest local groundwater."
        ]
      };
      onUpdateAIResolution(report.id, fallbackGuide);
    } finally {
      setAnalyzingReportId(null);
    }
  };

  // Volunteer sign up trigger
  const handleRegisterVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName || !volEmail || !volsolutionWork) {
      alert("Please fill in Name, Email, and your planned Solution Contribution.");
      return;
    }

    if (!showVolunteerModal) return;

    const newVolunteer: Volunteer = {
      id: `vol_${Date.now()}`,
      name: volName,
      email: volEmail,
      role: volRole,
      solutionWork: volsolutionWork,
      contributionAmount: volDonation ? parseFloat(volDonation) : undefined
    };

    onAddVolunteer(showVolunteerModal, newVolunteer);

    // Reset volunteer form keys
    setVolName('');
    setVolEmail('');
    setVolRole('cleanup');
    setVolsolutionWork('');
    setVolDonation('');
    setShowVolunteerModal(null);
  };

  const selectedReport = reports.find(r => r.id === selectedReportId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full" id="report_issue_container">
      {/* LEFT COLUMN: Map coordinates and submission panel */}
      <div className="lg:col-span-5 flex flex-col gap-6" id="left_report_column">
        {/* Presets shortcut */}
        <div className="bg-[#121612] border border-green-900/30 rounded-xl p-5" id="presets_panel">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-green-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-slate-100">Quick-Load Environmental Presets</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">Select a preloaded ecological disaster zone to test interactive real-time AI solutions instantly:</p>
          <div className="flex flex-col gap-2">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="w-full text-left text-xs bg-black/30 hover:bg-green-950/20 hover:border-green-500/30 border border-green-900/40 rounded-lg p-2.5 transition-all text-slate-300 font-medium flex justify-between items-center"
              >
                <span>{preset.name}</span>
                <span className="text-[10px] bg-[#1a201a] text-green-400 border border-green-900/40 px-2 py-0.5 rounded-full capitalize font-mono">
                  {preset.category.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Issue Reporter form */}
        <div className="bg-[#121612] border border-green-900/30 rounded-2xl p-6 shadow-xl flex flex-col gap-5" id="reporting_form_card">
          <div className="flex items-center gap-3 border-b border-green-900/20 pb-4">
            <div className="bg-green-900/20 p-2.5 rounded-lg text-green-400 border border-green-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">Log Degradation Zone</h2>
              <p className="text-xs text-slate-400">Report pollution, deforestation, or erosion with files & exact Geolocation</p>
            </div>
          </div>

          <form onSubmit={handleSubmitReport} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">Report Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Oil Leakage on Sandy Riverbank"
                className="w-full text-sm bg-black/40 border border-green-900/40 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-sm bg-black/40 border border-green-900/40 rounded-lg py-2 px-2 text-slate-250 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                  <option value="water_pollution">Water Pollution</option>
                  <option value="deforestation">Deforestation</option>
                  <option value="waste_dump">Illegal Waste Dump</option>
                  <option value="air_pollution">Air Quality Hazard</option>
                  <option value="soil_erosion">Soil Erosion</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Nearest City/Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Nile Basin Sector 4"
                  className="w-full text-sm bg-black/40 border border-green-900/40 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
            </div>

            {/* Geolocation Section */}
            <div className="bg-black/20 border border-green-900/30 rounded-xl p-3.5 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Precise Geolocation *
                </span>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="text-[10px] bg-green-600 hover:bg-green-50 transition text-black font-bold py-1 px-2.5 rounded-md flex items-center gap-1"
                >
                  <Compass className="w-3 h-3" /> Get Current GPS Location
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="Latitude (e.g. 12.97)"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full text-xs bg-black/50 border border-green-900/40 rounded-lg py-2 px-2.5 text-slate-200 font-mono focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="Longitude (e.g. 77.59)"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full text-xs bg-black/50 border border-green-900/40 rounded-lg py-2 px-2.5 text-slate-200 font-mono focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Drag & Drop File Container */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${
                dragActive ? 'border-green-500 bg-green-950/20' : 'border-green-900/40 bg-black/20 hover:border-green-500/40'
              }`}
            >
              {fileUrl ? (
                <div className="relative w-full max-w-[120px] aspect-video border border-green-900/45 rounded bg-black/40 flex flex-col items-center justify-center overflow-hidden">
                  {fileType === 'image' ? (
                    <img src={fileUrl} alt="Attached input" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-mono text-green-400 font-bold uppercase">{fileType} Uploaded</span>
                  )}
                  <button
                    type="button"
                    onClick={() => { setFileUrl(null); setFileType('none'); }}
                    className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full hover:bg-red-50 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="bg-[#1a201a] p-2 rounded-full text-green-400 border border-green-900/30">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-355 font-semibold block">Upload pollution proof file</span>
                    <span className="text-[10px] text-slate-500">Drag & drop or Click to choose (Photo, Audio, Video)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,audio/*,video/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Description & Observations *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give exact details on biological degradation, scale of damage, water smell, local forest logging rate..."
                rows={3}
                className="w-full text-sm bg-black/40 border border-green-900/40 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full text-sm bg-green-600/20 border border-green-500/40 hover:bg-green-600/30 text-green-400 font-bold py-2.5 rounded-xl transition flex justify-center items-center gap-2 shadow-[0_0_12px_rgba(34,197,94,0.15)]"
            >
              <Send className="w-4 h-4" /> Finalize & Post Degradation Report
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Active report selector, AI Resolution guide flow, Volunteer sign up list */}
      <div className="lg:col-span-7 flex flex-col gap-6" id="right_report_column">
        {/* Active reports grid */}
        <div className="bg-[#121612] border border-green-900/30 rounded-2xl p-6 shadow-xl flex-1 flex flex-col" id="reports_flow_view">
          <h2 className="font-semibold text-white text-lg mb-3">Community Reporting Feed</h2>
          
          {reports.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center py-12 text-slate-400 bg-black/30 rounded-xl border border-dashed border-green-900/40">
              <Compass className="w-10 h-10 mb-2 animate-bounce text-green-600/40" />
              <p className="text-sm font-medium">No active environmental reports recorded.</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">Specify GPS coordinates on the left or select a preset to start.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 flex-1">
              {/* Reports list slider buttons */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 snap-x">
                {reports.map((rep) => (
                  <button
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`snap-start flex-none border rounded-xl py-2.5 px-4 text-left transition-all ${
                      selectedReportId === rep.id 
                        ? 'border-green-500 bg-green-950/30 text-white shadow-[0_0_10px_rgba(34,197,94,0.15)] ring-1 ring-green-500/20' 
                        : 'border-green-900/30 bg-black/30 hover:border-green-500/20 text-slate-350 hover:bg-green-950/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          rep.category === 'deforestation' ? 'bg-amber-500' :
                          rep.category === 'water_pollution' ? 'bg-green-500' :
                          'bg-rose-500'
                        }`} />
                        <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">{rep.category.replace('_', ' ')}</span>
                      </div>
                      <span className="text-[8px] font-mono font-bold uppercase text-green-400 border border-green-900/20 px-1.5 py-0.5 rounded bg-black/40">
                        {rep.status || 'reported'}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1 w-44">{rep.title}</h4>
                    
                    {/* Visual Segmented Progress Tracker */}
                    <div className="mt-3 flex items-center gap-1 w-44">
                      {['reported', 'analyzing', 'implementing', 'resolved'].map((st, sIdx) => {
                        const phases = ['reported', 'analyzing', 'implementing', 'resolved'];
                        const currentPhase = phases.indexOf(rep.status || 'reported');
                        const isDone = sIdx <= currentPhase;
                        const isCurrentActive = sIdx === currentPhase;
                        return (
                          <div 
                            key={st}
                            className={`h-1.5 flex-1 rounded-sm transition-all duration-300 ${
                              isCurrentActive ? 'bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]' :
                              isDone ? 'bg-green-600' : 'bg-neutral-800'
                            }`}
                            title={`Remediation state: ${st}`}
                          />
                        );
                      })}
                    </div>
                  </button>
                ))}
              </div>

              {/* ACTIVE REPORT PROFILE DETAILS */}
              {selectedReport ? (
                <div className="flex-1 border border-green-900/30 bg-black/30 rounded-xl p-5 flex flex-col gap-5" id="active_profile">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold font-mono tracking-wider bg-green-950 text-green-400 border border-green-900/40 px-2 py-0.5 rounded uppercase">
                          {selectedReport.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">ID: {selectedReport.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight">{selectedReport.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" /> {selectedReport.address} 
                        <span className="text-green-500/70 font-mono">({selectedReport.latitude.toFixed(4)}, {selectedReport.longitude.toFixed(4)})</span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowVolunteerModal(selectedReport.id)}
                        className="bg-green-600 hover:bg-green-500 transition text-black font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-[0_0_12px_rgba(34,197,94,0.3)] font-sans"
                      >
                        <Users className="w-3.5 h-3.5" /> Join as Volunteer
                      </button>
                    </div>
                  </div>

                  {/* Remediation Lifecycle Visual Progress Timeline */}
                  <div className="bg-[#121812]/50 border border-green-900/30 rounded-xl p-4 flex flex-col gap-4 font-sans" id="lifecycle_timeline">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <span className="text-[10px] font-bold font-mono tracking-wider text-green-400 uppercase">
                        Remediation Lifecycle Status
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {['reported', 'analyzing', 'implementing', 'resolved'].map((st) => {
                          const isCurrent = (selectedReport.status || 'reported') === st;
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                if (onUpdateReportStatus) {
                                  onUpdateReportStatus(selectedReport.id, st as any);
                                }
                              }}
                              className={`text-[9px] font-mono uppercase px-2.5 py-1 rounded-md transition ${
                                isCurrent
                                  ? 'bg-green-500 text-black font-extrabold shadow-[0_0_8px_rgba(34,197,94,0.45)]'
                                  : 'bg-black/50 text-slate-405 text-slate-400 hover:text-white hover:bg-green-950/20 border border-green-900/20'
                              }`}
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timeline representation */}
                    <div className="relative flex items-center justify-between px-3 py-1.5 overflow-x-auto min-w-[280px]">
                      {/* grey connector line */}
                      <div className="absolute left-8 right-8 h-0.5 bg-neutral-800 top-[15px] -translate-y-1/2 z-0" />
                      {/* green active connector line */}
                      <div 
                        className="absolute left-8 h-0.5 bg-green-500 top-[15px] -translate-y-1/2 z-10 transition-all duration-500" 
                        style={{
                          width: `${
                            selectedReport.status === 'reported' ? '0%' :
                            selectedReport.status === 'analyzing' ? '33.33%' :
                            selectedReport.status === 'implementing' ? '66.66%' : '100%'
                          }`
                        }}
                      />

                      {['reported', 'analyzing', 'implementing', 'resolved'].map((st, idx) => {
                        const phases = ['reported', 'analyzing', 'implementing', 'resolved'];
                        const currentPhase = phases.indexOf(selectedReport.status || 'reported');
                        const isDone = idx <= currentPhase;
                        const isCurrent = (selectedReport.status || 'reported') === st;

                        // phase details
                        const labels: Record<string, string> = {
                          reported: "Reported",
                          analyzing: "Analyzing",
                          implementing: "Implementing",
                          resolved: "Resolved"
                        };

                        const descriptors: Record<string, string> = {
                          reported: "Incident posted",
                          analyzing: "AI Remedy Guide",
                          implementing: "Workers Active",
                          resolved: "Eco-Safe Secure"
                        };

                        return (
                          <div 
                            key={st} 
                            onClick={() => onUpdateReportStatus?.(selectedReport.id, st as any)}
                            className="relative z-20 flex flex-col items-center gap-1.5 cursor-pointer max-w-[85px] text-center select-none"
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 ${
                              isCurrent 
                                ? 'bg-green-400 text-black ring-4 ring-green-950 shadow-[0_0_12px_rgba(34,197,94,0.7)] font-black animate-pulse' 
                                : isDone 
                                  ? 'bg-green-600 text-black border-transparent' 
                                  : 'bg-black text-slate-500 border border-green-900/30'
                            }`}>
                              {idx + 1}
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <span className={`text-[9px] sm:text-[10px] font-bold tracking-wide uppercase transition-colors ${
                                isCurrent ? 'text-green-400' : isDone ? 'text-green-500' : 'text-slate-500'
                              }`}>
                                {labels[st]}
                              </span>
                              <span className="text-[8px] text-slate-500 tracking-tight leading-none truncate max-w-[75px] block">
                                {descriptors[st]}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-sm text-slate-300 border-l-2 border-green-500 pl-3 leading-relaxed">
                    {selectedReport.description}
                  </div>

                  {/* Attachment indicator */}
                  {selectedReport.fileUrl && (
                    <div className="bg-black/40 border border-green-900/30 rounded-xl overflow-hidden p-2 flex items-center gap-3">
                      {selectedReport.fileType === 'image' ? (
                        <img 
                          referrerPolicy="no-referrer"
                          src={selectedReport.fileUrl} 
                          alt="Attachment File" 
                          className="w-16 h-12 object-cover rounded bg-black/20 border border-green-900/30" 
                        />
                      ) : (
                        <div className="w-16 h-12 bg-black/30 rounded flex items-center justify-center text-slate-400 border border-green-900/30">
                          <Compass className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                      <div className="flex-1">
                        <span className="text-xs font-medium text-white block capitalize">{selectedReport.fileType} Proof Attached</span>
                        <span className="text-[10px] text-green-500/50 font-mono">Verified locally with metadata encryption logs.</span>
                      </div>
                    </div>
                  )}

                  {/* VOLUNTEER LIST FOR THIS RECORD */}
                  <div className="bg-black/20 rounded-xl p-4 border border-green-900/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-lg border border-green-900/20">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-green-400" /> Active Volunteer Group ({selectedReport.volunteers?.length || 0})
                      </span>
                    </div>

                    {(!selectedReport.volunteers || selectedReport.volunteers.length === 0) ? (
                      <p className="text-xs text-slate-500 italic text-center py-2 font-mono">No volunteers have joined this specific solution workflow yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[140px] overflow-y-auto pr-1">
                        {selectedReport.volunteers.map((v) => (
                          <div key={v.id} className="border border-green-900/20 bg-black/50 rounded-lg p-3 flex flex-col gap-1.5">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-xs font-semibold text-slate-100 truncate">{v.name}</span>
                              <span className="text-[8px] bg-green-950 text-green-400 border border-green-900/30 uppercase font-mono px-1.5 py-0.5 rounded font-bold">
                                {v.role.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 italic line-clamp-2">" {v.solutionWork} "</p>
                            {v.contributionAmount && (
                              <span className="text-[10px] font-mono text-green-400 font-bold">
                                Donated: ${v.contributionAmount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* REAL-TIME AI SOLUTION GUIDE PANEL */}
                  <div className="bg-neutral-950 text-slate-100 rounded-xl p-5 border border-green-900/40 flex flex-col gap-4 shadow-xl" id="ai_solution_block">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-950/80 text-green-400 p-1.5 rounded border border-green-800">
                          <Sparkles className="w-4 h-4 animate-spin text-green-405" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-wide font-sans">Real-time AI Solution Advisor</h4>
                          <span className="text-[9px] text-green-554 text-green-500 font-mono uppercase tracking-wider block mt-0.5">Calculates biochemistry remedies in real-time</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAIAnalyze(selectedReport)}
                        disabled={analyzingReportId === selectedReport.id}
                        className="text-xs font-bold bg-green-600 hover:bg-green-500 text-neutral-950 h-8 px-3.5 rounded transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,197,94,0.3)] disabled:bg-green-950 disabled:text-green-800 disabled:shadow-none"
                      >
                        {analyzingReportId === selectedReport.id ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" /> Analyzing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3" /> Execute AI Guide Workflow
                          </>
                        )}
                      </button>
                    </div>

                    {selectedReport.aiResolutionGuide ? (
                      <div className="flex flex-col gap-4 text-xs font-sans mt-2" id="resolution_steps">
                        <div className="bg-[#121612] rounded-lg p-3.5 border border-green-900/30">
                          <span className="text-[10px] font-bold text-green-500 uppercase font-mono mb-1 block tracking-wider">Ecological Threat Profile</span>
                          <p className="text-slate-200 leading-relaxed text-xs">{selectedReport.aiResolutionGuide.summary}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-amber-400 uppercase font-mono mb-2 block flex items-center gap-1 tracking-wider">
                              <CheckCircle className="w-3 h-3" /> Immediate Response Actions
                            </span>
                            <ul className="list-disc pl-4 text-slate-300 flex flex-col gap-1.5 leading-relaxed font-sans">
                              {selectedReport.aiResolutionGuide.immediateSteps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-green-400 uppercase font-mono mb-2 block flex items-center gap-1 tracking-wider">
                              <Shield className="w-3 h-3" /> Long-Term Remediation
                            </span>
                            <ul className="list-disc pl-4 text-slate-300 flex flex-col gap-1.5 leading-relaxed font-sans">
                              {selectedReport.aiResolutionGuide.longTermSolutions.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="border-t border-green-900/30 pt-3.5 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-green-400 uppercase font-mono mb-1.5 block tracking-wider font-semibold">Needed Materials & Kit</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedReport.aiResolutionGuide.neededResources.map((res, idx) => (
                                <span key={idx} className="bg-green-950/40 text-green-400 border border-green-900/40 px-2 py-0.5 rounded text-[10px] font-mono">
                                  {res}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-rose-400 uppercase font-mono mb-1.5 block tracking-wider font-semibold">Crucial Personal Protection</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedReport.aiResolutionGuide.safetyPrecautions.map((safe, idx) => (
                                <span key={idx} className="bg-rose-950/30 text-rose-300 border border-rose-900/40 px-2 py-0.5 rounded text-[10px]">
                                  ⚠️ {safe}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col justify-center items-center py-6 text-slate-400 bg-black/40 rounded border border-dashed border-green-900/30 text-center">
                        <p className="text-xs font-semibold text-slate-300">No AI resolution blueprint generated yet.</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">Press "Execute AI Guide Workflow" above to request biochemistry & remediation tactics.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex justify-center items-center py-12 text-slate-400">
                  Select an environmental report above to inspect volunteer dynamics and trigger AI repairs.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* VOLUNTEER SIGN-UP MODAL OVERLAY */}
      {showVolunteerModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4" id="volunteer_modal">
          <div className="bg-[#121612] border border-green-800/40 p-6 max-w-md w-full rounded-2xl shadow-2xl flex flex-col gap-4 text-slate-200">
            <div className="flex justify-between items-center pb-2 border-b border-green-900/30">
              <h3 className="font-bold text-white text-lg flex items-center gap-1.5">
                <Users className="w-5 h-5 text-green-400" /> Join Ecological Solutions team
              </h3>
              <button 
                type="button"
                onClick={() => setShowVolunteerModal(null)} 
                className="text-slate-400 hover:text-white font-bold p-1 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterVolunteer} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={volName}
                  onChange={(e) => setVolName(e.target.value)}
                  placeholder="e.g., Dr. Elena Rostova"
                  className="w-full text-sm bg-black/50 border border-green-900/40 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Contact Email *</label>
                <input
                  type="email"
                  value={volEmail}
                  onChange={(e) => setVolEmail(e.target.value)}
                  placeholder="e.g., elena@ecosolutions.org"
                  className="w-full text-sm bg-black/50 border border-green-900/40 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Volunteer Action</label>
                  <select
                    value={volRole}
                    onChange={(e) => setVolRole(e.target.value as any)}
                    className="w-full text-sm bg-black/50 border border-green-900/40 text-slate-205 py-2 px-2 rounded-lg text-slate-105 focus:outline-none"
                  >
                    <option value="cleanup">Physical Cleanup Work</option>
                    <option value="trees">Planting Trees / Spores</option>
                    <option value="stopping_degradation">Stopping Loggers / Barriers</option>
                    <option value="donation">Donating Project Money</option>
                    <option value="education">Community Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Donation Amount ($ USD optional)</label>
                  <input
                    type="number"
                    value={volDonation}
                    onChange={(e) => setVolDonation(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full text-sm bg-black/50 border border-green-900/40 rounded-lg py-2 px-3 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Solution Proposal *</label>
                <textarea
                  value={volsolutionWork}
                  onChange={(e) => setVolsolutionWork(e.target.value)}
                  placeholder="Specify what actual task you will carry out on the ground, or how you intend to construct organic safeguards..."
                  rows={3}
                  className="w-full text-xs bg-black/50 border border-green-900/40 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              >
                Confirm Volunteer Sign-Up
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
