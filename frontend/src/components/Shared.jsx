/* eslint-disable react-hooks/purity */
import React, { useState, useEffect } from "react";

export function Particles() {
  const particles = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      width: Math.random() * 3 + 0.5,
      height: Math.random() * 3 + 0.5,
      background: i % 4 === 0 ? "#d4a853" : i % 4 === 1 ? "#22d3ee" : i % 4 === 2 ? "#10B981" : "#f5a623",
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.25 + 0.05,
      animation: `float ${12 + Math.random() * 12}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 6}s`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full" style={{
          width: p.width,
          height: p.height,
          background: p.background,
          left: p.left,
          top: p.top,
          opacity: p.opacity,
          animation: p.animation,
          animationDelay: p.animationDelay,
        }} />
      ))}
    </div>
  );
}

export function TypingDots() {
  return (
    <div className="flex gap-1.5 items-center py-2">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full bg-neon-blue animate-pulse-slow" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
}

export function StockTicker() {
  const [stocks, setStocks] = useState([
    { symbol: "NIFTY", price: 22040.70, change: 120.50, pct: 0.55 },
    { symbol: "SENSEX", price: 72643.43, change: 335.39, pct: 0.46 },
    { symbol: "RELIANCE", price: 2987.50, change: 45.20, pct: 1.54 },
    { symbol: "HDFC", price: 1435.60, change: -12.40, pct: -0.86 },
    { symbol: "INFY", price: 1675.30, change: 15.60, pct: 0.94 },
    { symbol: "TCS", price: 4125.10, change: 25.10, pct: 1.12 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const volatility = s.price * 0.0015;
        const changeDiff = (Math.random() - 0.5) * volatility;
        return { ...s, price: s.price + changeDiff, change: s.change + changeDiff, pct: ((s.change + changeDiff) / (s.price - s.change)) * 100 };
      }));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card py-2 overflow-hidden whitespace-nowrap flex items-center relative z-[100] border-b border-white/5">
      <div className="absolute left-4 z-10 flex items-center gap-2 bg-gray-900/90 px-3 py-1 rounded-full border border-neon-green/30">
        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
        <span className="text-neon-green text-xs font-bold tracking-widest uppercase">Live Market</span>
      </div>
      <div className="inline-block px-[100%]" style={{ animation: 'marquee 15s linear infinite', willChange: 'transform' }}>
        <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
        {[...stocks, ...stocks].map((s, i) => (
          <span key={i} className="inline-block mr-12 text-sm font-semibold text-gray-200">
            <span className="text-neon-blue mr-2">{s.symbol}</span>
            <span>{s.price.toFixed(2)}</span>
            <span className={`ml-2 ${s.change >= 0 ? "text-neon-green" : "text-red-500"}`}>
              {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change).toFixed(2)} ({s.change >= 0 ? "+" : ""}{s.pct.toFixed(2)}%)
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function GlobalFooter({ setActiveTab }) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <div className="p-8 bg-gray-900/60 border-t border-white/5 backdrop-blur-xl flex flex-col items-center gap-4 relative z-10 mt-auto">
      <div className="flex items-center gap-6 text-gray-400 text-sm flex-wrap justify-center font-medium">
        <span className="font-bold text-primary tracking-wide">IndiaFinBot Pro</span>
        <span className="hidden sm:inline">|</span>
        <button onClick={() => setActiveTab('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
        <span className="hidden sm:inline">|</span>
        <button onClick={() => setActiveTab('terms')} className="hover:text-white transition-colors">Terms</button>
      </div>
      <p className="m-0 text-gray-500 text-xs text-center tracking-wider">© 2026 IndiaFinBot AI Solutions. Intelligent Enterprise Infrastructure. All rights reserved.</p>
      <button 
        onClick={scrollToTop} 
        className="mt-4 px-6 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-full hover:bg-primary/20 hover:border-primary/40 hover:text-white transition-all font-bold hover:-translate-y-1"
      >
        ↑ Scroll To Top
      </button>
    </div>
  );
}
