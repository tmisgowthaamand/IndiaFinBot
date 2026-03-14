import { INDIA_STATES } from "../data/constants";

export default function TopNav({ theme, setTheme, lang, setLang, activeTab, setActiveTab, selectedState, setSelectedState, setSelectedDistrict, t }) {
  return (
    <div className="glass-card sticky top-0 z-50 border-b border-neon-blue/20 px-6 py-4">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between flex-wrap gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-3xl shadow-glow-primary">
            🇮🇳
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
              IndiaFin<span className="text-primary">Bot</span>
            </h1>
          </div>
        </div>

        <div className="flex bg-gray-900/40 rounded-xl p-1.5 border border-white/5 gap-1 flex-wrap justify-center backdrop-blur-md">
          {[
            { id: "overview", label: t("tabOverview") || "Overview" },
            { id: "schemes", label: `🏛️ ${t("tabSchemes") || "Schemes & Pro"}` },
            { id: "chat", label: `🤖 ${t("tabChat") || "Chat"}` },
            { id: "competition", label: "📊 Competition" },
            { id: "inspire", label: t("tabInspire") || "Leaders" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`px-5 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors duration-300 ${
                activeTab === tab.id 
                ? "bg-primary/20 text-primary" 
                : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap justify-center items-center">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 backdrop-blur-md transition-colors bg-white/10 text-white border border-white/20 hover:bg-white/20"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)} 
            className="hidden sm:block px-4 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/30 font-bold backdrop-blur-md outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="ml">മലയാളം</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>

          <select 
            value={selectedState} 
            onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(""); }} 
            className="px-4 py-2.5 rounded-lg bg-gray-900/80 text-white border border-neon-blue/30 font-medium backdrop-blur-md outline-none cursor-pointer"
          >
            <option value="">{t("selectState") || "Select State"}</option>
            {Object.keys(INDIA_STATES).map(state => <option key={state} value={state}>{state}</option>)}
          </select>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-purple-500 p-[2px]">
             <div className="w-full h-full rounded-full bg-gray-900 border-2 border-transparent overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Profile" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
