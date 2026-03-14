/* eslint-disable no-unused-vars */
import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { 
  CA_DATABASES, GOVERNMENT_SCHEMES, MARKET_DATA_5Y, TOP_COMPANIES_DATA, SECTOR_LEADERS, YOUTUBE_CHANNELS, INFLUENCERS_DB, ALL_BANKS_DATA
} from "../data/constants";

const MotionDiv = ({ children, className }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={className}>
    {children}
  </motion.div>
);

export function OverviewTab({ setActiveTab, t }) {
  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <MotionDiv>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">{t("welcomeTitle") || "Overview & Scale Analytics"}</h1>
        <p className="text-gray-400 text-lg mb-12 max-w-3xl leading-relaxed">
          Monitor your enterprise growth trajectory, automated compliance pipelines, and 5-year projective forecasts natively using highly optimized visual intelligence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { id: "business", title: "Business Strategy", desc: "Scale optimization and predictive cashflow.", color: "text-primary" },
            { id: "finance", title: "Financial AI", desc: "Automated statement deep-scans & structuring.", color: "text-neon-green" },
            { id: "marketing", title: "Pro Marketing", desc: "SaaS automation and client acquisition flows.", color: "text-neon-blue" },
            { id: "operations", title: "Operations", desc: "Logistics and team architecture structuring.", color: "text-orange-400" }
          ].map((card, i) => (
            <div key={i} onClick={() => setActiveTab("chat")} className="glass-card hover:-translate-y-2 cursor-pointer transition-all p-6 rounded-2xl group border-white/5 relative overflow-hidden">
               <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
               <h3 className={`text-xl font-bold mb-2 ${card.color}`}>{card.title} ↗</h3>
               <p className="text-sm text-gray-400 leading-relaxed m-0 relative z-10">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
           <div className="glass-card p-6 rounded-2xl border-white/5 h-[400px] flex flex-col">
             <h3 className="font-bold text-neon-blue mb-6 tracking-wide">Market Size Projections (5Y)</h3>
             <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={MARKET_DATA_5Y}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                   <XAxis dataKey="year" stroke="#94a3b8" />
                   <YAxis stroke="#94a3b8" />
                   <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
                   <Legend />
                   <Line type="basis" dataKey="TopTier" stroke="#F5B841" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                   <Line type="basis" dataKey="MidCap" stroke="#22d3ee" strokeWidth={3} />
                   <Line type="basis" dataKey="SmallScale" stroke="#10B981" strokeWidth={3} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="glass-card p-6 rounded-2xl border-white/5 h-[400px] flex flex-col">
             <h3 className="font-bold text-neon-green mb-6 tracking-wide">Ecosystem Growth</h3>
             <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={MARKET_DATA_5Y}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                   <XAxis dataKey="year" stroke="#94a3b8" />
                   <YAxis stroke="#94a3b8" />
                   <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
                   <Legend />
                   <Bar dataKey="TopTier" fill="#F5B841" radius={[4, 4, 0, 0]} />
                   <Bar dataKey="Startup" fill="#f97316" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Top Companies Database</h2>
        <div className="glass-card rounded-2xl p-6 overflow-x-auto border-white/5">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-neon-blue/10 text-neon-blue">
                 <th className="p-4 font-bold rounded-tl-lg">Rank</th>
                 <th className="p-4 font-bold">Company</th>
                 <th className="p-4 font-bold">Category</th>
                 <th className="p-4 font-bold">Revenue</th>
                 <th className="p-4 font-bold">Profit</th>
                 <th className="p-4 font-bold rounded-tr-lg">Growth</th>
               </tr>
             </thead>
             <tbody>
               {TOP_COMPANIES_DATA.map((comp, i) => (
                 <tr key={i} className="border-b border-white/5 text-gray-200 hover:bg-white/5 transition-colors">
                   <td className="p-4 font-black">#{comp.rank}</td>
                   <td className="p-4 font-medium">{comp.name}</td>
                   <td className="p-4">
                     <span className={`px-3 py-1 rounded-md text-xs font-bold border ${comp.category === 'Top-Tier' ? 'bg-primary/10 text-primary border-primary/20' : comp.category === 'Small-Scale' ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : 'bg-neon-blue/10 text-neon-blue border-neon-blue/20'}`}>{comp.category}</span>
                   </td>
                   <td className="p-4 text-gray-300">{comp.revenue}</td>
                   <td className={`p-4 font-bold ${comp.profit.includes('Loss') ? 'text-orange-500' : 'text-neon-green'}`}>{comp.profit}</td>
                   <td className="p-4 text-neon-blue font-bold">{comp.growth}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </MotionDiv>
    </div>
  );
}

export function SchemesTab({ setActiveTab, sendMessage }) {
  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <MotionDiv>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">🏛️ Government Schemes & Pro Research</h1>
        <p className="text-gray-400 text-lg mb-12 max-w-3xl leading-relaxed">
          Match your profile against top-tier MSME programs to unlock direct capital.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {GOVERNMENT_SCHEMES.map((scheme, i) => (
             <div key={i} className="glass-card rounded-2xl p-6 border-neon-blue/20 relative overflow-hidden group">
               <div className="absolute -top-6 -right-6 text-8xl opacity-[0.03] group-hover:opacity-10 transition-opacity">{scheme.icon}</div>
               <div className="w-14 h-14 rounded-xl bg-neon-blue/10 flex items-center justify-center text-3xl mb-5 border border-neon-blue/30">{scheme.icon}</div>
               <h3 className="text-xl font-bold text-white mb-3">{scheme.title}</h3>
               <p className="text-sm text-gray-400 leading-relaxed mb-6">{scheme.desc}</p>
               <div className="bg-neon-green/10 border border-neon-green/20 p-3 rounded-lg mb-6">
                 <span className="block text-neon-green text-[11px] font-bold uppercase tracking-wider mb-1">Max Coverage</span>
                 <span className="text-white font-bold">{scheme.coverage}</span>
               </div>
               <button 
                 onClick={() => { setActiveTab("chat"); sendMessage(`Tell me how to apply for ${scheme.title}`); }}
                 className="px-6 py-2.5 bg-gradient-to-r from-primary to-orange-500 rounded-lg text-black font-black text-sm hover:-translate-y-1 transition-transform shadow-glow-primary"
               >
                 Apply Now ↗
               </button>
             </div>
          ))}
        </div>

        <div className="glass-card p-8 rounded-2xl border-primary/30 bg-primary/5">
          <h2 className="text-2xl font-bold text-primary mb-4">End-to-End Pro Compensation Analysis</h2>
          <p className="text-gray-300 md:text-lg mb-6 leading-relaxed max-w-4xl">Our integration dynamically triggers deep AI sweeps across structural documentation to generate high-level breakdowns of executive compensation vs Top-Tier frameworks.</p>
          <button 
            onClick={() => setActiveTab("chat")}
            className="px-6 py-3 bg-primary text-black font-black rounded-lg hover:bg-orange-400 transition-colors"
          >
            Request AI Pro Analysis ↗
          </button>
        </div>
      </MotionDiv>
    </div>
  );
}

export function CompetitionTab({ setActiveTab, sendMessage }) {
  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <MotionDiv>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">Accounting Services: 5-Year Analytics</h1>
        <p className="text-gray-400 text-lg mb-12 max-w-3xl leading-relaxed">
          Exhaustive end-to-end research spanning the last 5 years illustrates a massive paradigm shift in the accounting services sector.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div onClick={() => { setActiveTab("chat"); sendMessage("How to transition to remote accessibility?"); }} className="glass-card cursor-pointer p-8 rounded-2xl border-l-[4px] border-l-red-500 bg-red-500/5 hover:bg-red-500/10 transition-colors">
            <h3 className="text-2xl font-bold text-red-500 mb-4">📉 Traditional Decline</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Manual ledger and localized physical bookkeeping firms faced a 35% decline as clients pivot towards automated GST processing.</p>
          </div>
          <div onClick={() => { setActiveTab("chat"); sendMessage("Give me an execution plan to start an AI tax optimization service."); }} className="glass-card cursor-pointer p-8 rounded-2xl border-l-[4px] border-l-neon-green bg-neon-green/5 hover:bg-neon-green/10 transition-colors">
            <h3 className="text-2xl font-bold text-neon-green mb-4">🚀 Cloud-AI Hypergrowth</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Advisory firms using AI sweeps for tax optimization saw a 210% increase in client acquisitions. Competition is now technological.</p>
          </div>
          <div onClick={() => { setActiveTab("chat"); sendMessage("Compile a strategic guide on offering VC fund allocation services."); }} className="glass-card cursor-pointer p-8 rounded-2xl border-l-[4px] border-l-primary bg-primary/5 hover:bg-primary/10 transition-colors">
            <h3 className="text-2xl font-bold text-primary mb-4">⚔️ Market Saturation</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Basic IT return filing is highly saturated resulting in price wars. High-margin services exist exclusively in strategic VC fund structuring.</p>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}

export function InspireTab() {
  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <MotionDiv>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">Leaders & Inspiration</h1>
        <p className="text-gray-400 text-lg mb-12 max-w-3xl leading-relaxed">Learn from the top pioneers sculpting the Indian financial and startup ecosystem.</p>

        <h2 className="text-2xl font-bold text-primary mb-6">Sector Visionaries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SECTOR_LEADERS.map((leader, i) => (
             <div key={i} className="glass-card p-6 rounded-2xl border-primary/30 text-center items-center flex flex-col group hover:-translate-y-2 transition-transform">
               <img src={leader.image} alt={leader.name} className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-primary group-hover:shadow-glow-primary transition-shadow" />
               <h3 className="text-xl font-bold text-white mb-1">{leader.name}</h3>
               <p className="text-neon-blue font-bold text-sm mb-4">{leader.company} | {leader.role}</p>
               <p className="text-gray-300 text-sm italic leading-relaxed">"{leader.quote}"</p>
             </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-neon-blue mb-6">Top Creator Channels</h2>
        <div className="space-y-4 mb-12">
          {YOUTUBE_CHANNELS.map((ch, i) => (
            <div key={i} className="glass-card p-5 rounded-xl border-l-[3px] border-neon-blue flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold text-lg mb-1">{ch.name} <span className="text-gray-400 text-sm font-normal">({ch.handle})</span></h4>
                <p className="text-gray-400 text-sm m-0">{ch.desc}</p>
              </div>
              <a href={ch.link} target="_blank" rel="noreferrer" className="text-neon-blue font-bold whitespace-nowrap hover:text-white transition-colors">Watch →</a>
            </div>
          ))}
        </div>
      </MotionDiv>
    </div>
  );
}
