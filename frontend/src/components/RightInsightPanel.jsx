/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";

export default function RightInsightPanel({ interests }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      className="hidden xl:flex flex-col w-[320px] fixed right-6 top-24 bottom-6 space-y-4"
    >
      <div className="glass-card rounded-2xl p-5 border border-primary/20 shadow-glow-primary relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
          <Sparkles className="w-12 h-12 text-primary" />
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 bg-primary/20 text-primary rounded-lg backdrop-blur-md border border-primary/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white tracking-wide uppercase text-sm">AI Insight</h3>
        </div>

        <div className="space-y-4 relative z-10">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Your Industry</p>
            <p className="text-white font-medium text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></span>
              {interests || "Accounting Services"}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Est. Market Growth</p>
            <div className="flex items-end gap-2 text-neon-green">
              <TrendingUp className="w-5 h-5 mb-0.5" />
              <span className="text-xl font-black">12.4%</span>
              <span className="text-xs mb-1 font-semibold text-gray-400">CAGR '25</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Primary Opportunity</p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
              <p className="text-sm text-gray-200 leading-relaxed font-medium">MSME compliance automation and AI tax optimization workflows.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card flex-1 rounded-2xl p-5 border border-white/10 flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white tracking-wide uppercase text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            Risk Monitor
          </h3>
          <button className="text-gray-500 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
             <div className="flex justify-between items-center text-xs mb-2">
               <span className="text-gray-400 font-medium">Regulatory Drift</span>
               <span className="text-orange-400 font-bold">Medium</span>
             </div>
             <div className="w-full bg-gray-900 rounded-full h-1.5 border border-white/5">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
             </div>
          </div>

          <div className="flex flex-col">
             <div className="flex justify-between items-center text-xs mb-2">
               <span className="text-gray-400 font-medium">Market Saturation</span>
               <span className="text-red-400 font-bold">High</span>
             </div>
             <div className="w-full bg-gray-900 rounded-full h-1.5 border border-white/5">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full" style={{ width: '82%' }}></div>
             </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
           <button className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-colors">
             Run Full Diagnostics
           </button>
        </div>
      </div>
    </motion.div>
  );
}
