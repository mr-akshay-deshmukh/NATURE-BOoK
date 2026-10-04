import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Activity, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PollutionReport } from '../types';
import GlobalHazardMap from './GlobalHazardMap';

interface EnvironmentalDashboardProps {
  reports: PollutionReport[];
  onSelectReport?: (id: string) => void;
}

export default function EnvironmentalDashboard({ reports, onSelectReport }: EnvironmentalDashboardProps) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  // Compute key stats securely
  const totalReports = reports.length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const implementingCount = reports.filter(r => r.status === 'implementing').length;
  const analyzingCount = reports.filter(r => r.status === 'analyzing').length;
  const reportedCount = reports.filter(r => r.status === 'reported').length;

  const totalVolunteers = reports.reduce((sum, r) => sum + (r.volunteers?.length || 0), 0);
  const resolutionRate = totalReports > 0 ? Math.round((resolvedCount / totalReports) * 100) : 0;

  // Categories Setup
  const categories = [
    { key: 'water_pollution', label: "Water Pollution", color: "#22c55e", hoverColor: "#16a34a" }, // green-500
    { key: 'deforestation', label: "Deforestation", color: "#fbbf24", hoverColor: "#d97706" }, // amber-400
    { key: 'waste_dump', label: "Illegal Waste", color: "#f87171", hoverColor: "#dc2626" }, // rose-400
    { key: 'air_pollution', label: "Air Quality", color: "#c084fc", hoverColor: "#9333ea" }, // purple-400
    { key: 'soil_erosion', label: "Soil Erosion", color: "#34d399", hoverColor: "#059669" } // emerald-400
  ];

  // Aggregate category counts
  const categoryCounts = reports.reduce((acc, report) => {
    const cat = report.category || 'water_pollution';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Structure category chart data
  const categoryChartData = categories.map(cat => {
    const count = categoryCounts[cat.key] || 0;
    const catVolunteers = reports
      .filter(r => r.category === cat.key)
      .reduce((sum, r) => sum + (r.volunteers?.length || 0), 0);

    return {
      name: cat.label,
      "Reports": count,
      "Volunteers": catVolunteers,
      color: cat.color,
      hoverColor: cat.hoverColor,
      rawKey: cat.key
    };
  });

  // Aggregate Status Counts
  const statusCounts = {
    reported: reportedCount,
    analyzing: analyzingCount,
    implementing: implementingCount,
    resolved: resolvedCount
  };

  const statusConfigs = [
    { key: 'reported', label: "Reported", color: "#ef4444" },
    { key: 'analyzing', label: "Analyzing", color: "#f59e0b" },
    { key: 'implementing', label: "Implementing", color: "#3b82f6" },
    { key: 'resolved', label: "Resolved", color: "#22c55e" }
  ];

  const statusChartData = statusConfigs.map(sc => ({
    name: sc.label,
    value: statusCounts[sc.key as keyof typeof statusCounts] || 0,
    color: sc.color
  })).filter(item => item.value > 0); // Only render categories that have data for cleaner pies

  // Fallback if statusChartData is empty (render a placeholder)
  const safeStatusChartData = statusChartData.length > 0 
    ? statusChartData 
    : [{ name: "No Reports", value: 1, color: "#1f2937" }];

  // Custom tooltips to present gorgeous design instead of default frames
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0b0e0b] border border-green-800/40 p-3 rounded-xl shadow-2xl font-mono text-xs text-slate-200">
          <p className="text-white font-extrabold border-b border-green-950/40 pb-1 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color || payload[0].color }} />
            {payload[0].name}
          </p>
          <div className="flex flex-col gap-1 text-[11px]">
            {payload.map((p: any, idx: number) => (
              <p key={idx} className="flex justify-between gap-4">
                <span className="text-slate-400">{p.name}:</span>
                <span className="font-extrabold text-white">{p.value}</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 w-full font-sans text-slate-200" id="environmental_dashboard_root">
      
      {/* GLOBAL GOOGLE MAP PLATFORM VIEW */}
      <GlobalHazardMap reports={reports} onSelectReport={onSelectReport} />

      {/* QUICK INSIGHTS SUMMARY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard_metrics_counter_grid">
        
        {/* TOTAL REPORTS */}
        <div className="bg-[#121612]/80 border border-green-900/30 p-4.5 rounded-2xl flex items-center justify-between shadow-lg" id="stat_total_reports">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Total Incidents</span>
            <span className="text-2xl font-extrabold text-white mt-1 block font-mono">{totalReports}</span>
            <span className="text-[9px] text-green-500 font-mono mt-0.5 block">Logged in Field Feed</span>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* ACTIVE VOLUNTEERS */}
        <div className="bg-[#121612]/80 border border-green-900/30 p-4.5 rounded-2xl flex items-center justify-between shadow-lg" id="stat_total_volunteers">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Active Volunteers</span>
            <span className="text-2xl font-extrabold text-white mt-1 block font-mono">{totalVolunteers}</span>
            <span className="text-[9px] text-green-400 font-mono mt-0.5 block">Ecological Action Squad</span>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-2.5 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* RESOLVED INCIDENTS */}
        <div className="bg-[#121612]/80 border border-green-900/30 p-4.5 rounded-2xl flex items-center justify-between shadow-lg" id="stat_total_resolved">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Eco-Secured Sites</span>
            <span className="text-2xl font-extrabold text-[#22c55e] mt-1 block font-mono">{resolvedCount}</span>
            <span className="text-[9px] text-green-400 font-mono mt-0.5 block">Full Remediation Achieved</span>
          </div>
          <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] p-2.5 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* REMEDIATION COMPLETE STATUS PERCENTAGE */}
        <div className="bg-[#121612]/80 border border-green-900/30 p-4.5 rounded-2xl flex items-center justify-between shadow-lg" id="stat_remediation_rate">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Success Velocity</span>
            <span className="text-2xl font-extrabold text-green-400 mt-1 block font-mono">{resolutionRate}%</span>
            <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Target Resolution: 100%</span>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-2.5 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* DETAILED CHARTS SECTION - ROW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard_charts_row_grid">
        
        {/* CHARTS CONTAINER 1: CATEGORY SPECIFIC INCIDENT FREQUENCY (BAR OR PIE SELECTOR) */}
        <div className="lg:col-span-7 bg-[#121612] border border-green-900/30 rounded-2xl p-6 shadow-xl flex flex-col" id="chart_category_frequency">
          <div className="flex justify-between items-center pb-3 border-b border-green-900/20 mb-5">
            <div>
              <h3 className="font-semibold text-white text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-400" /> Hazard Breakdowns by Class
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Quantifying incident frequency and volunteer density per category</p>
            </div>
            
            <div className="flex bg-black/40 border border-green-900/30 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-[10px] font-bold font-mono tracking-wider uppercase rounded-md transition ${
                  chartType === 'bar' ? 'bg-green-600 text-black font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bar Chart
              </button>
              <button
                type="button"
                onClick={() => setChartType('pie')}
                className={`px-3 py-1 text-[10px] font-bold font-mono tracking-wider uppercase rounded-md transition ${
                  chartType === 'pie' ? 'bg-green-600 text-black font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pie Chart
              </button>
            </div>
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            {chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryChartData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                >
                  <defs>
                    {categories.map((c, i) => (
                      <linearGradient key={i} id={`barGrad_${c.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c.color} stopOpacity={0.9}/>
                        <stop offset="100%" stopColor={c.color} stopOpacity={0.3}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#4b5563" 
                    fontSize={10} 
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#4b5563" 
                    fontSize={10}
                    fontFamily="monospace" 
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }} />
                  <Bar dataKey="Reports" radius={[4, 4, 0, 0]}>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#barGrad_${entry.rawKey})`} />
                    ))}
                  </Bar>
                  <Bar dataKey="Volunteers" fill="#22c55e" opacity={0.5} radius={[4, 4, 0, 0]} />
                  <Legend 
                    wrapperStyle={{ paddingTop: 10, fontSize: 10, fontFamily: 'monospace' }}
                    verticalAlign="bottom"
                    iconSize={8}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData.filter(d => d.Reports > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="Reports"
                    nameKey="name"
                  >
                    {categoryChartData.filter(d => d.Reports > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#121612" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* CHARTS CONTAINER 2: PROGRESS LIFECYCLE BREAKDOWN PIE */}
        <div className="lg:col-span-5 bg-[#121612] border border-green-900/30 rounded-2xl p-6 shadow-xl flex flex-col" id="chart_remediation_lifecycle">
          <div className="pb-3 border-b border-green-900/20 mb-5">
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-green-400" /> Remediation Lifecycles
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Tracking reported, active, or resolved project phases</p>
          </div>

          <div className="h-68 w-full flex items-center justify-center relative">
            {/* Legend overlays or donut representation */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safeStatusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={false}
                >
                  {safeStatusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#121612" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle" 
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingLeft: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner text metric */}
            <div className="absolute top-1/2 left-[31%] -translate-x-1/2 -translate-y-1/2 text-center select-none pointer-events-none">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Resolved</span>
              <span className="text-xl font-black text-green-400 font-mono">{resolvedCount} / {totalReports}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CARD: RECENT HOTSPOT REPORTS LIST */}
      <div className="bg-[#121612] border border-green-900/30 rounded-2xl p-6 shadow-xl flex flex-col" id="dashboard_unresolved_table">
        <div className="flex justify-between items-center pb-3 border-b border-green-900/20 mb-4">
          <div>
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-400" /> Active Emergency Locations
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Urgent bio-hazard zones currently under investigation or action</p>
          </div>
          <span className="text-[10px] font-mono bg-green-950/40 border border-green-900/50 px-2 py-1 rounded text-green-400 font-bold">
            {reports.filter(r => r.status !== 'resolved').length} Active Sites
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-green-900/20 text-slate-400 text-[10px] font-mono tracking-wider uppercase">
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Incident Category</th>
                <th className="py-2.5 px-3">Status Lifecycle</th>
                <th className="py-2.5 px-3">Ecologists</th>
                <th className="py-2.5 px-3 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-950/20 text-xs text-slate-300">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-green-950/10 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-medium text-white line-clamp-1">{rep.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono line-clamp-1">{rep.address}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-mono uppercase bg-black/40 border border-green-900/20 px-2 py-0.5 rounded text-slate-300">
                      {rep.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        rep.status === 'resolved' ? 'bg-green-500' :
                        rep.status === 'implementing' ? 'bg-blue-500' :
                        rep.status === 'analyzing' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="text-[10px] font-mono uppercase text-slate-200">{rep.status || 'reported'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                    {rep.volunteers?.length || 0} enrolled
                  </td>
                  <td className="py-3 px-3 text-right">
                    {onSelectReport && (
                      <button
                        type="button"
                        onClick={() => onSelectReport(rep.id)}
                        className="text-[10px] text-green-400 hover:text-white font-mono uppercase font-bold tracking-wide flex items-center gap-1 ml-auto hover:underline"
                      >
                        Inspect <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                    Zero logged degradation issues. Use telemetry maps to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
