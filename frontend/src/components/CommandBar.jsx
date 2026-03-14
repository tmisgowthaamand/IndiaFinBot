/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, DollarSign, TrendingUp, Target, BarChart3 } from "lucide-react";

export default function CommandBar({ isOpen, setIsOpen, setActiveTab }) {
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setIsOpen]);

  if (!isOpen) return null;

  const actions = [
    { id: "analyze", title: "Analyze Market", icon: <TrendingUp className="w-4 h-4" />, action: () => setActiveTab("chat") },
    { id: "compare", title: "Compare Competitors", icon: <Target className="w-4 h-4" />, action: () => setActiveTab("competition") },
    { id: "schemes", title: "Search Govt Schemes", icon: <Search className="w-4 h-4" />, action: () => setActiveTab("schemes") },
    { id: "forecast", title: "Generate Financial Forecast", icon: <BarChart3 className="w-4 h-4" />, action: () => setActiveTab("overview") },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl glass-card rounded-xl shadow-2xl overflow-hidden border border-white/10"
        >
          <div className="flex items-center px-4 py-4 border-b border-white/10">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input 
              autoFocus
              className="flex-1 bg-transparent outline-none text-white text-lg placeholder:text-gray-500" 
              placeholder="What do you need to calculate?" 
            />
            <div className="flex items-center space-x-1 px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 font-medium">
              <Command className="w-3 h-3" /> <span>K</span>
            </div>
          </div>
          <div className="p-2 py-4">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggested Actions</p>
            <div className="space-y-1">
              {actions.map((act) => (
                <button
                  key={act.id}
                  onClick={() => {
                    act.action();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 text-sm text-gray-300 rounded-lg hover:bg-white/5 hover:text-white transition-colors group"
                >
                  <span className="mr-3 p-1.5 rounded-md bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    {act.icon}
                  </span>
                  {act.title}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
