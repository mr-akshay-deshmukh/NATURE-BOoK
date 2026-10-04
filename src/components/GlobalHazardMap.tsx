import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { PollutionReport } from '../types';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface MarkerWithInfoWindowProps {
  key?: React.Key;
  report: PollutionReport;
  onClick: () => void;
}

function ReportMarker({ report, onClick }: MarkerWithInfoWindowProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  // Set color based on status
  let bgColor = "#ef4444"; // reported (red)
  if (report.status === 'analyzing') bgColor = "#f59e0b"; // analyzing (amber)
  if (report.status === 'implementing') bgColor = "#3b82f6"; // implementing (blue)
  if (report.status === 'resolved') bgColor = "#22c55e"; // resolved (green)

  return (
    <>
      <AdvancedMarker 
        ref={markerRef} 
        position={{ lat: report.latitude, lng: report.longitude }} 
        onClick={() => setOpen(true)}
      >
        <Pin background={bgColor} glyphColor="#fff" borderColor="rgba(0,0,0,0.5)" />
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)}>
          <div className="p-1 font-sans text-slate-800 max-w-[200px]">
            <h4 className="font-bold text-sm mb-1">{report.title}</h4>
            <p className="text-[10px] text-slate-500 mb-2">{report.category.replace('_', ' ')}</p>
            <button
              onClick={() => {
                setOpen(false);
                onClick();
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-3 rounded text-[10px] uppercase font-mono transition-colors"
            >
              View Details
            </button>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

interface GlobalHazardMapProps {
  reports: PollutionReport[];
  onSelectReport?: (id: string) => void;
}

export default function GlobalHazardMap({ reports, onSelectReport }: GlobalHazardMapProps) {
  if (!hasValidKey) {
    return (
      <div className="w-full h-[400px] bg-[#121612] border border-green-900/30 rounded-2xl flex flex-col items-center justify-center text-center p-6 shadow-xl mb-6">
        <h2 className="text-xl font-bold text-white mb-3">Google Maps API Key Required</h2>
        <p className="text-slate-400 text-sm mb-2 max-w-lg">
          <strong>Step 1:</strong> <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener" className="text-green-400 hover:underline">Get an API Key</a>
        </p>
        <p className="text-slate-400 text-sm mb-4 max-w-lg">
          <strong>Step 2:</strong> Add your key as a secret in AI Studio to enable the Global Threat Map:
        </p>
        <ul className="text-left text-sm text-slate-300 bg-black/40 border border-green-900/20 p-4 rounded-xl list-disc pl-8 mb-4 max-w-lg">
          <li className="mb-1">Open <strong>Settings</strong> (⚙️ gear icon, <strong>top-right corner</strong>)</li>
          <li className="mb-1">Select <strong>Secrets</strong></li>
          <li className="mb-1">Type <code className="bg-green-900/40 text-green-300 px-1 rounded">GOOGLE_MAPS_PLATFORM_KEY</code> as the secret name, press <strong>Enter</strong></li>
          <li>Paste your API key as the value, press <strong>Enter</strong></li>
        </ul>
        <p className="text-[10px] font-mono text-green-500 uppercase tracking-widest">The app rebuilds automatically.</p>
      </div>
    );
  }

  // Calculate center. If there are reports, average their locations, else default center.
  let centerLat = 20.0;
  let centerLng = 0.0;
  
  if (reports.length > 0) {
    const sumLat = reports.reduce((acc, r) => acc + r.latitude, 0);
    const sumLng = reports.reduce((acc, r) => acc + r.longitude, 0);
    centerLat = sumLat / reports.length;
    centerLng = sumLng / reports.length;
  }

  return (
    <div className="w-full h-[400px] bg-[#121612] border border-green-900/30 rounded-2xl shadow-xl mb-6 overflow-hidden relative">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{lat: centerLat, lng: centerLng}}
          defaultZoom={2}
          mapId="ENVIRONMENTAL_THREAT_MAP"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{width: '100%', height: '100%'}}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {reports.map(report => (
            <ReportMarker 
              key={report.id} 
              report={report} 
              onClick={() => onSelectReport?.(report.id)} 
            />
          ))}
        </Map>
      </APIProvider>
      <div className="absolute top-4 left-4 bg-black/80 border border-green-500/30 backdrop-blur-sm p-3 rounded-xl pointer-events-none z-10">
        <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-2">
          Global Threat Map
        </h4>
        <div className="flex flex-col gap-1.5 text-[10px] font-mono uppercase tracking-wider">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ef4444]"></span> Reported</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span> Analyzing</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> Implementing</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#22c55e]"></span> Resolved</div>
        </div>
      </div>
    </div>
  );
}
