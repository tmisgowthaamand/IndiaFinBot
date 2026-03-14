/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Settings, Target, Map } from "lucide-react";
import { BUSINESS_VERTICALS, FOUNDER_SKILLS, INVESTMENT_RANGES } from "../data/constants";

export default function Sidebar({ 
  isVisible, setIsVisible,
  investment, setInvestment,
  interests, setInterests,
  skills, setSkills,
  sendMessage,
  locationContext, t
}) {
  return (
    <>
      <button 
        onClick={() => setIsVisible(!isVisible)} 
        className={`fixed z-50 p-2 glass-card rounded-lg text-neon-blue border-neon-blue/30 transition-all duration-300 hover:bg-neon-blue/20 
          ${isVisible ? "left-[365px]" : "left-4"} top-24`}
        title={isVisible ? "Hide Sidebar" : "Show Sidebar"}
      >
        {isVisible ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      <motion.div 
        initial={false}
        animate={{ width: isVisible ? 360 : 0, opacity: isVisible ? 1 : 0 }}
        className="glass-card flex-shrink-0 h-[calc(100vh-100px)] rounded-2xl overflow-y-auto overflow-x-hidden sticky top-24 border-white/10"
      >
        <div className="p-6 w-[360px]">
          <h3 className="text-white text-lg font-bold flex items-center gap-3 mb-6 tracking-wide">
            <span className="p-2 bg-gradient-to-br from-primary to-orange-500 rounded-lg shadow-glow-primary">
              <Settings className="w-4 h-4 text-black" />
            </span> 
            Startup Config
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[13px] text-primary/80 font-bold uppercase tracking-wider mb-2">Investment Capacity</label>
              <select 
                value={investment} 
                onChange={(e) => setInvestment(e.target.value)}
                className="w-full glass-input"
              >
                <option value="" className="bg-gray-900 text-gray-400">Select Scale</option>
                {INVESTMENT_RANGES.map((r, i) => <option key={i} value={r} className="bg-gray-900 text-white">{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[13px] text-primary/80 font-bold uppercase tracking-wider mb-2">Industry Verticals</label>
              <select 
                value={interests} 
                onChange={(e) => setInterests(e.target.value)}
                className="w-full glass-input"
              >
                <option value="" className="bg-gray-900 text-gray-400">Select Market</option>
                {BUSINESS_VERTICALS.map((v, i) => <option key={i} value={v} className="bg-gray-900 text-white">{v}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[13px] text-primary/80 font-bold uppercase tracking-wider mb-2">Primary Skillset</label>
              <select 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)}
                className="w-full glass-input"
              >
                <option value="" className="bg-gray-900 text-gray-400">Select Core Skill</option>
                {FOUNDER_SKILLS.map((s, i) => <option key={i} value={s} className="bg-gray-900 text-white">{s}</option>)}
              </select>
            </div>

            <button
              onClick={() => {
                const fullMsg = `📍 Location: ${locationContext}.\n💰 Base Capital: ${investment || 'Not specified'}\n🏢 Focus: ${interests || 'Not specified'}\n🧠 Skills: ${skills || 'Not specified'}\n\nExecute full business analysis now.`;
                sendMessage(fullMsg);
              }}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-black font-black tracking-wide shadow-glow-primary hover:-translate-y-1 transition-transform"
            >
              Analyze Strategy
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-[13px] text-neon-blue font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Map className="w-4 h-4" /> Portals
            </h4>
            <div className="space-y-3">
              {[
                { label: "GST Network", icon: "🧾", link: "https://www.gst.gov.in" },
                { label: "Udyam MSME", icon: "🏢", link: "https://udyamregistration.gov.in" },
                { label: "Startup India", icon: "🚀", link: "https://www.startupindia.gov.in" }
              ].map((link, i) => (
                <a 
                  key={i} 
                  href={link.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex justify-between items-center w-full px-4 py-3 bg-gray-900/60 rounded-xl text-sm font-medium border border-white/5 hover:bg-neon-blue/10 hover:border-neon-blue/40 text-gray-300 transition-colors"
                >
                  <span className="flex items-center gap-3">{link.icon} {link.label}</span>
                  <span className="text-gray-500 hover:text-white">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
