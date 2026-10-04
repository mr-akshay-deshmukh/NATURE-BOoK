import React, { useState } from 'react';
import { MapPin, Upload, X, Compass, AlertTriangle } from 'lucide-react';
import { PollutionReport } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReport: (report: PollutionReport) => void;
}

export default function ReportModal({ isOpen, onClose, onAddReport }: ReportModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PollutionReport['category']>('water_pollution');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<PollutionReport['fileType']>('none');
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
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

  const processFile = (file: File) => {
    const fakeUrl = URL.createObjectURL(file);
    setFileUrl(fakeUrl);
    if (file.type.startsWith('image/')) setFileType('image');
    else if (file.type.startsWith('video/')) setFileType('video');
    else if (file.type.startsWith('audio/')) setFileType('audio');
    else setFileType('image');
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#121612] border border-green-900/40 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-green-900/30 bg-[#0b0e0b]">
          <div className="flex items-center gap-3">
            <div className="bg-green-900/20 p-2 rounded-lg text-green-400 border border-green-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">Quick Report</h2>
              <span className="text-[10px] text-green-400 font-mono tracking-wider uppercase">Log Environmental Hazard</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Report Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Oil Leakage on Sandy Riverbank"
                className="w-full text-sm bg-black/40 border border-green-900/40 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-sm bg-black/40 border border-green-900/40 rounded-lg py-2.5 px-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                >
                  <option value="water_pollution">Water Pollution</option>
                  <option value="deforestation">Deforestation</option>
                  <option value="waste_dump">Illegal Waste Dump</option>
                  <option value="air_pollution">Air Quality Hazard</option>
                  <option value="soil_erosion">Soil Erosion</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nearest City/Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Nile Basin Sector 4"
                  className="w-full text-sm bg-black/40 border border-green-900/40 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
              </div>
            </div>

            <div className="bg-black/30 border border-green-900/30 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" /> Exact Coordinates *
                </span>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="text-[10px] bg-green-600/20 text-green-400 hover:bg-green-500 hover:text-black border border-green-500/30 transition-all font-bold py-1.5 px-3 rounded flex items-center gap-1.5 uppercase font-mono tracking-wider"
                >
                  <Compass className="w-3.5 h-3.5" /> Auto-Locate
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="0.000001"
                  placeholder="Lat (e.g. 12.97)"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full text-sm bg-black/40 border border-green-900/40 rounded-lg py-2 px-3 text-slate-200 font-mono focus:outline-none focus:border-green-500"
                  required
                />
                <input
                  type="number"
                  step="0.000001"
                  placeholder="Lng (e.g. 77.59)"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full text-sm bg-black/40 border border-green-900/40 rounded-lg py-2 px-3 text-slate-200 font-mono focus:outline-none focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all ${
                dragActive ? 'border-green-500 bg-green-950/20' : 'border-green-900/40 bg-black/20 hover:border-green-500/40'
              }`}
            >
              {fileUrl ? (
                <div className="relative h-24 border border-green-900/45 rounded bg-black/40 flex items-center justify-center overflow-hidden px-4">
                  {fileType === 'image' ? (
                    <img src={fileUrl} alt="Upload" className="h-full w-auto object-cover rounded" />
                  ) : (
                    <span className="text-xs font-mono text-green-400 font-bold uppercase">{fileType} Uploaded</span>
                  )}
                  <button
                    type="button"
                    onClick={() => { setFileUrl(null); setFileType('none'); }}
                    className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full hover:bg-red-500 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="bg-green-950/30 p-2.5 rounded-full text-green-400 border border-green-900/30">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-200 font-bold block mb-0.5">Attach visual evidence</span>
                    <span className="text-[10px] text-slate-400 font-mono">Drag & drop or Click to choose (Photo/Video)</span>
                  </div>
                  <input type="file" accept="image/*,video/*" onChange={handleFileInput} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Observations *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give exact details on biological degradation..."
                rows={3}
                className="w-full text-sm bg-black/40 border border-green-900/40 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                required
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black text-sm uppercase tracking-wide py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]"
              >
                Submit Report to Global Network
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
