import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow } from "@react-google-maps/api";
import { translations } from "./translations";

const INDIA_STATES = {
  "Andhra Pradesh": { dists: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"], coords: { lat: 15.9129, lng: 79.7400 } },
  "Assam": { dists: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"], coords: { lat: 26.2006, lng: 92.9376 } },
  "Bihar": { dists: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"], coords: { lat: 25.0961, lng: 85.3131 } },
  "Delhi": { dists: ["New Delhi", "Dwarka", "Rohini", "Lajpat Nagar", "Saket", "Connaught Place"], coords: { lat: 28.7041, lng: 77.1025 } },
  "Gujarat": { dists: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"], coords: { lat: 22.2587, lng: 71.1924 } },
  "Haryana": { dists: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Hisar"], coords: { lat: 29.0588, lng: 76.0856 } },
  "Karnataka": { dists: ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi", "Davangere"], coords: { lat: 15.3173, lng: 75.7139 } },
  "Kerala": { dists: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"], coords: { lat: 10.8505, lng: 76.2711 } },
  "Madhya Pradesh": { dists: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"], coords: { lat: 22.9734, lng: 78.6569 } },
  "Maharashtra": { dists: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane"], coords: { lat: 19.7515, lng: 75.7139 } },
  "Punjab": { dists: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"], coords: { lat: 31.1471, lng: 75.3412 } },
  "Rajasthan": { dists: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"], coords: { lat: 27.0238, lng: 74.2179 } },
  "Tamil Nadu": { dists: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"], coords: { lat: 11.1271, lng: 78.6569 } },
  "Telangana": { dists: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"], coords: { lat: 18.1124, lng: 79.0193 } },
  "Uttar Pradesh": { dists: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad"], coords: { lat: 26.8467, lng: 80.9462 } },
  "West Bengal": { dists: ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Howrah"], coords: { lat: 22.9868, lng: 87.8550 } },
};

const BUSINESS_VERTICALS = ["Retail", "IT Services", "Manufacturing", "Agriculture", "Healthcare", "Education", "FinTech", "E-commerce", "Hospitality", "CleanTech", "Logistics", "Real Estate", "Professional Services", "Energy"];
const FOUNDER_SKILLS = ["Operations", "Marketing", "Finance", "Sales", "Technical", "HR", "Legal", "Management", "Product Design", "Strategy", "Data Analysis", "Project Management"];
const INVESTMENT_RANGES = ["₹50,000 - ₹2 Lakhs", "₹2 Lakhs - ₹5 Lakhs", "₹5 Lakhs - ₹10 Lakhs", "₹10 Lakhs - ₹25 Lakhs", "₹25 Lakhs - ₹50 Lakhs", "₹50 Lakhs - ₹1 Crore", "₹1 Crore - ₹5 Crores", "Above ₹5 Crores"];

const SECTOR_LEADERS = [
  { name: "Ratan Tata", company: "Tata Group", quote: "Ups and downs in life are very important to keep us going.", role: "Industrialist", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" },
  { name: "Narayana Murthy", company: "Infosys", quote: "In God we trust, everybody else must bring data.", role: "IT Pioneer", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
  { name: "Falguni Nayar", company: "Nykaa", quote: "Think big, but start small.", role: "E-commerce Founder", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
];

const YOUTUBE_CHANNELS = [
  { name: "CA Rachana Ranade", desc: "Top Indian finance educator covering stock markets and corporate accounting.", handle: "@carachanaranade", link: "https://youtube.com/c/carachanaranade" },
  { name: "Pranjal Kamra", desc: "Simplifying personal finance, mutual funds, and business investments.", handle: "@pranjalkamra", link: "https://youtube.com/c/pranjalkamra" },
  { name: "Labour Law Advisor", desc: "Expert advice on HR, payroll, taxes, and labor laws for Indian businesses.", handle: "@LabourLawAdvisor", link: "https://youtube.com/c/LabourLawAdvisor" },
];

const INFLUENCERS_DB = {
  "South India Leaders": [
    { cat: "Tamil Nadu", names: ["N. R. Narayana Murthy", "Sridhar Vembu", "Ritesh Agarwal", "Vijay Shekhar Sharma", "Sundar Pichai", "R. Gopalakrishnan", "Radhika Gupta", "Anand Mahindra"] },
    { cat: "Karnataka", names: ["Nandan Nilekani", "Kiran Mazumdar Shaw", "Sachin Bansal", "Binny Bansal", "Byju Raveendran"] },
    { cat: "Kerala", names: ["M. A. Yusuff Ali", "K. P. Hussain", "Ravi Pillai"] },
    { cat: "AP & Telangana", names: ["Satya Nadella", "B. V. R. Mohan Reddy", "K. T. Rama Rao", "Srini Raju"] }
  ],
  "North India Leaders": [
    { cat: "Delhi & Haryana", names: ["Ritesh Agarwal", "Deepinder Goyal", "Pankaj Chaddah", "Amit Jain", "Vineeta Singh", "Peyush Bansal"] },
    { cat: "UP & Punjab", names: ["Naveen Tewari", "Alakh Pandey", "Anupam Mittal", "Kunal Shah", "Aman Gupta"] },
    { cat: "Rajasthan & Gujarat", names: ["Ghanshyam Sarda", "Rahul Taneja", "Mukesh Ambani", "Gautam Adani"] }
  ],
  "Finance & Creators": [
    { cat: "Accounting Content", names: ["CA Rachana Ranade", "Pranjal Kamra", "Neha Nagar", "Sharan Hegde", "Anushka Rathod", "Akshat Shrivastava", "Shashank Udupa"] },
    { cat: "Startup & Marketing", names: ["Raj Shamani", "Ankur Warikoo", "Deepak Shenoy", "Nikhil Kamath", "Nithin Kamath", "Ashneer Grover", "Namita Thapar", "Gaurav Taneja", "Ranveer Allahbadia", "Tanmay Bhat", "Sandeep Maheshwari"] },
    { cat: "Investors & Mentors", names: ["Rakesh Jhunjhunwala", "Raamdeo Agrawal", "Porinju Veliyath", "Harsh Goenka", "Uday Kotak", "Vijay Kedia", "Radhakishan Damani", "Dr Vivek Bindra", "Ujjwal Patni"] }
  ]
};

const CA_DATABASES = {
  high: [
    { name: "Deloitte India", type: "Top-Tier Firm", fee: "₹50k - ₹2L/mo", services: "Audit, M&A, Int. Taxation", email: "contact@deloitte.in", phone: "+91-22-6185-4000" },
    { name: "KPMG India", type: "Big 4 Partner", fee: "₹40k - ₹1.5L/mo", services: "Corporate Finance, Risk", email: "india@kpmg.com", phone: "+91-124-307-4000" }
  ],
  low: [
    { name: "Local Area CA & Associates", type: "Budget Compliance", fee: "₹3k - ₹10k/mo", services: "GST Filing, Bookkeeping, ITR", email: "hello@localca.in", phone: "+91-98765-43210" },
    { name: "TaxMate Solutions", type: "Startup Focused", fee: "₹5k - ₹12k/mo", services: "Company Incorporation, TDS", email: "support@taxmate.in", phone: "+91-91234-56789" }
  ]
};

const GOVERNMENT_SCHEMES = [
  { rank: 1, title: "CGTMSE Scheme (Credit Guarantee)", desc: "Collateral-free credit to micro and small enterprises. Default guarantee up to ₹5 Crore.", icon: "🏦", coverage: "Up to 85%", link: "https://www.cgtmse.in" },
  { rank: 2, title: "PMMY (MUDRA Loans)", desc: "Micro finance up to ₹10 Lakhs for non-corporate, non-farm scale startups.", icon: "🪙", coverage: "Shishu, Kishore, Tarun slabs", link: "https://www.mudra.org.in" },
  { rank: 3, title: "PMEGP (Employment Gen.)", desc: "Credit-linked subsidy to set up new micro-businesses and generate domestic employment.", icon: "🏭", coverage: "15% - 35% project cost subsidies", link: "https://www.kviconline.gov.in" },
  { rank: 4, title: "PLI (Production Linked Incentive)", desc: "Boost domestic manufacturing capabilities and enhance large-scale exports.", icon: "⚙️", coverage: "4% - 6% core incremental sales rebate", link: "https://www.makeinindia.com" },
  { rank: 5, title: "TReDS (Trade Receivables)", desc: "Facilitate quick vendor discounting of MSME trade receivables from corporate buyers.", icon: "📜", coverage: "Automated factoring & liquidity", link: "https://www.rbi.org.in" },
  { rank: 6, title: "Stand-Up India Scheme", desc: "Loans extending ₹10 Lakhs to ₹1 Crore for greenfield enterprises led by SC/ST/Women.", icon: "👩‍💼", coverage: "Credit-growth assurance", link: "https://www.standupmitra.in" }
];

const MARKET_DATA_5Y = [
  { year: "Year 1", TopTier: 15, MidCap: 8, SmallScale: 20, Startup: -40 },
  { year: "Year 2", TopTier: 12, MidCap: 15, SmallScale: 10, Startup: -20 },
  { year: "Year 3", TopTier: 20, MidCap: 25, SmallScale: 15, Startup: 10 },
  { year: "Year 4", TopTier: 18, MidCap: 22, SmallScale: 30, Startup: 45 },
  { year: "Year 5", TopTier: 22, MidCap: 30, SmallScale: 40, Startup: 80 },
];

const TOP_COMPANIES_DATA = [
  { rank: 1, name: "Reliance Industries", category: "Top-Tier", revenue: "₹9.78 Lakh Cr", profit: "₹73,670 Cr", growth: "+12%" },
  { rank: 2, name: "TCS", category: "Top-Tier", revenue: "₹2.25 Lakh Cr", profit: "₹42,303 Cr", growth: "+9%" },
  { rank: 25, name: "Varun Beverages", category: "Mid-Cap", revenue: "₹13,173 Cr", profit: "₹1,550 Cr", growth: "+21%" },
  { rank: 40, name: "Polycab India", category: "Medium", revenue: "₹14,107 Cr", profit: "₹1,282 Cr", growth: "+18%" },
  { rank: 85, name: "Local Retail Hubs", category: "Small-Scale", revenue: "₹5-50 Cr", profit: "₹1-5 Cr", growth: "+5%" },
  { rank: "N/A", name: "Modern AI Startups", category: "Startup", revenue: "₹0-5 Cr", profit: "-₹2 Cr (Loss)", growth: "+310%" },
];

const ALL_BANKS_DATA = {
  govt: [
    { name: "State Bank of India", abbr: "SBI", rate: "8.00% - 9.50%", link: "https://sbi.co.in/web/business/sme" },
    { name: "Punjab National Bank", abbr: "PNB", rate: "8.40% - 10.20%", link: "https://pnbindia.in/msme-banking.aspx" },
    { name: "Bank of Baroda", abbr: "BOB", rate: "8.35% - 10.15%", link: "https://www.bankofbaroda.in/business-banking/msme" },
    { name: "Canara Bank", abbr: "Canara", rate: "8.50% - 10.25%", link: "https://canarabank.com/userpage?id=3" },
    { name: "Bank of India", abbr: "BOI", rate: "8.45% - 10.50%", link: "https://bankofindia.co.in/msme" },
    { name: "Union Bank of India", abbr: "UBI", rate: "8.50% - 10.30%", link: "https://www.unionbankofindia.co.in/english/msme.aspx" },
    { name: "Indian Bank", abbr: "IB", rate: "8.40% - 10.40%", link: "https://indianbank.in/departments/msme/" },
    { name: "Central Bank of India", abbr: "CBI", rate: "8.55% - 10.55%", link: "https://www.centralbankofindia.co.in/en/msme-loans" },
    { name: "Bank of Maharashtra", abbr: "BOM", rate: "8.50% - 10.45%", link: "https://bankofmaharashtra.in/msme-banking" }
  ],
  private: [
    { name: "HDFC Bank", rate: "10.50% - 14.50%", link: "https://www.hdfcbank.com/sme/borrow" },
    { name: "ICICI Bank", rate: "10.75% - 15.00%", link: "https://www.icicibank.com/business-banking" },
    { name: "Axis Bank", rate: "11.00% - 15.25%", link: "https://www.axisbank.com/business-banking" },
    { name: "Kotak Mahindra", rate: "10.99% - 15.50%", link: "https://www.kotak.com/en/business/sme-banking.html" },
    { name: "IndusInd Bank", rate: "11.25% - 16.00%", link: "https://www.indusind.com/in/en/business.html" },
    { name: "Yes Bank", rate: "11.50% - 16.25%", link: "https://www.yesbank.in/business-banking/msme-loans" },
    { name: "IDFC First Bank", rate: "12.00% - 16.50%", link: "https://www.idfcfirstbank.com/business-banking" },
    { name: "Federal Bank", rate: "10.50% - 14.75%", link: "https://www.federalbank.co.in/business/loans" },
    { name: "Bandhan Bank", rate: "11.00% - 15.00%", link: "https://bandhanbank.com/sme-banking" },
    { name: "RBL Bank", rate: "11.50% - 16.00%", link: "https://www.rblbank.com/business-banking" },
    { name: "South Indian Bank", rate: "10.75% - 15.25%", link: "https://www.southindianbank.com/content/business-banking/29" },
    { name: "City Union Bank", rate: "11.00% - 15.50%", link: "https://www.cityunionbank.com/corporate" }
  ]
};

function Particles() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: Math.random() * 4 + 1,
          height: Math.random() * 4 + 1,
          borderRadius: "50%",
          background: i % 3 === 0 ? "#FF6B35" : i % 3 === 1 ? "#00B4D8" : "#9BF6FF",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.4 + 0.1,
          animation: `float${i % 3} ${10 + Math.random() * 10}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
        }} />
      ))}
      <style>{`
        @keyframes float0 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-50px)} }
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,40px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,30px)} }
        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.5); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,107,53,0.8); }
        .nav-tab { transition: all 0.3s ease; }
        .nav-tab:hover { background: rgba(255,107,53,0.15) !important; color: #FFF; }
        .service-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
        .service-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,180,216,0.3); border-color: #00B4D8 !important; }
        @keyframes pulseMic { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
        .pulse-anim { animation: pulseMic 1s infinite; }
      `}</style>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "8px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#00B4D8", animation: "tdot 1.4s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />
      ))}
      <style>{`@keyframes tdot{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

function StockTicker() {
  const [stocks, setStocks] = useState([
    { symbol: "NIFTY 50", price: 22040.70, change: 120.50, pct: 0.55 },
    { symbol: "SENSEX", price: 72643.43, change: 335.39, pct: 0.46 },
    { symbol: "RELIANCE", price: 2987.50, change: 45.20, pct: 1.54 },
    { symbol: "HDFCBANK", price: 1435.60, change: -12.40, pct: -0.86 },
    { symbol: "INFY", price: 1675.30, change: 15.60, pct: 0.94 },
    { symbol: "AAPL", price: 178.50, change: 2.10, pct: 1.19 },
    { symbol: "MSFT", price: 415.20, change: 5.30, pct: 1.29 },
    { symbol: "GOOGL", price: 152.10, change: -1.20, pct: -0.78 },
    { symbol: "AMZN", price: 185.40, change: 3.50, pct: 1.92 },
    { symbol: "TSLA", price: 195.40, change: -4.50, pct: -2.25 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const volatility = s.price * 0.001;
        const changeDiff = (Math.random() - 0.5) * volatility;
        const newPrice = Math.max(1, s.price + changeDiff);
        const newChange = s.change + changeDiff;
        const newPct = (newChange / (newPrice - newChange)) * 100;
        return { ...s, price: newPrice, change: newChange, pct: newPct };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "10px 0", overflow: "hidden", whiteSpace: "nowrap", display: "flex", alignItems: "center", position: "relative", zIndex: 100 }}>
      {/* Live Data Badge */}
      <div style={{ position: "absolute", left: 15, zIndex: 101, display: "flex", alignItems: "center", gap: 6, background: "rgba(15,23,42,0.9)", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(16,185,129,0.3)" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", animation: "blink 1s infinite" }} />
        <span style={{ color: "#10B981", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>LIVE MARKET API</span>
      </div>
      <div style={{ display: "inline-block", animation: "ticker 40s linear infinite", paddingLeft: "100%" }}>
        {stocks.map((s, i) => (
          <span key={i} style={{ display: "inline-block", marginRight: "50px", fontSize: "14px", fontWeight: "600", color: "#e2e8f0" }}>
            <span style={{ color: "#9BF6FF", marginRight: 8 }}>{s.symbol}</span>
            <span>{s.price.toFixed(2)}</span>
            <span style={{ marginLeft: 8, color: s.change >= 0 ? "#10B981" : "#FF6B35" }}>
              {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change).toFixed(2)} ({s.change >= 0 ? "+" : ""}{s.pct.toFixed(2)}%)
            </span>
          </span>
        ))}
        {/* Duplicate list for seamless loop effect */}
        {stocks.map((s, i) => (
          <span key={`loop-${i}`} style={{ display: "inline-block", marginRight: "50px", fontSize: "14px", fontWeight: "600", color: "#e2e8f0" }}>
            <span style={{ color: "#9BF6FF", marginRight: 8 }}>{s.symbol}</span>
            <span>{s.price.toFixed(2)}</span>
            <span style={{ marginLeft: 8, color: s.change >= 0 ? "#10B981" : "#FF6B35" }}>
              {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change).toFixed(2)} ({s.change >= 0 ? "+" : ""}{s.pct.toFixed(2)}%)
            </span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyAm0Ux8hobuoyiw3wIWpYrHm-MIZ7y1QXM";
const MAP_OPTIONS = { disableDefaultUI: true, zoomControl: true, restriction: { latLngBounds: { north: 37.0902, south: 8.0863, east: 97.3956, west: 68.1862 }, strictBounds: true }, styles: [{ stylers: [{ saturation: -100 }, { lightness: 20 }] }, { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] }, { elementType: "geometry", stylers: [{ color: "#060913" }] }, { featureType: "water", stylers: [{ color: "#00B4D8" }] }] };

function IndiaMapZone({ stateCode, theme }) {
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: MAPS_API_KEY });
  const [mapType, setMapType] = useState("CA"); // CA, MSME, LOAN, COMP
  const [activeMarker, setActiveMarker] = useState(null);

  const center = stateCode && INDIA_STATES[stateCode] ? INDIA_STATES[stateCode].coords : { lat: 20.5937, lng: 78.9629 };

  const generateMocks = (centerLat, centerLng, type) => {
    return Array.from({ length: 8 }).map((_, i) => {
      const latOffset = (Math.random() - 0.5) * 2;
      const lngOffset = (Math.random() - 0.5) * 2;
      return {
        id: i, lat: centerLat + latOffset, lng: centerLng + lngOffset,
        title: type === "CA" ? `Verified Tax Partner ${i + 1}` : type === "MSME" ? `SEZ Govt Tech Park ${i + 1}` : type === "LOAN" ? `Approved MUDRA Bank Branch` : `Local Competitor Business`,
        desc: type === "CA" ? `Fee: ₹5K/mo | GST Filing` : type === "LOAN" ? `Interest: 8.5% | Fast Approval` : type === "MSME" ? `Subsidized IT & Agri Plot` : `High Density Market`
      };
    });
  };

  const markers = generateMocks(center.lat, center.lng, mapType);

  if (!isLoaded) return <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}><TypingDots /></div>;

  return (
    <div className="glass-panel" style={{ borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", height: "600px", border: "1px solid rgba(0,180,216,0.3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ margin: "0 0 5px 0", color: theme === "light" ? "#0f172a" : "#FFF", fontSize: "22px", display: "flex", alignItems: "center", gap: 8 }}>📍 Live Market Intel Radar</h2>
          <p style={{ margin: 0, color: theme === "light" ? "#475569" : "#94a3b8", fontSize: "14px" }}>Scanning physical infrastructure in <strong style={{ color: "#00B4D8" }}>{stateCode || "India"}</strong></p>
        </div>

        <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "4px" }}>
          {[{ id: "CA", icon: "👨‍💼", label: "Auditors & CA" }, { id: "MSME", icon: "🏭", label: "SEZ Zones" }, { id: "LOAN", icon: "🏦", label: "MUDRA Branches" }, { id: "COMP", icon: "📊", label: "Competitors" }].map(btn => (
            <button key={btn.id} onClick={() => setMapType(btn.id)} style={{ padding: "8px 12px", borderRadius: "6px", background: mapType === btn.id ? "rgba(0,180,216,0.2)" : "transparent", color: mapType === btn.id ? "#00B4D8" : "#94a3b8", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px", display: "flex", gap: "6px" }}>
              <span>{btn.icon}</span> <span className="hide-mobile">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, borderRadius: "12px", overflow: "hidden", position: "relative" }}>
        <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={center} zoom={stateCode ? 7 : 5} options={MAP_OPTIONS} onClick={() => setActiveMarker(null)}>
          <Circle center={center} radius={150000} options={{ strokeColor: "#00B4D8", strokeOpacity: 0.8, strokeWeight: 2, fillColor: "#00B4D8", fillOpacity: 0.1 }} />
          {markers.map(m => (
            <Marker key={m.id} position={{ lat: m.lat, lng: m.lng }} onClick={() => setActiveMarker(m)}
              icon={{ url: mapType === "CA" ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' : mapType === "MSME" ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' : mapType === "LOAN" ? 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png' : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
            >
              {activeMarker?.id === m.id && (
                <InfoWindow position={{ lat: m.lat, lng: m.lng }} onCloseClick={() => setActiveMarker(null)}>
                  <div style={{ padding: "5px 10px", color: "#111" }}>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "15px", fontWeight: 800 }}>{m.title}</h4>
                    <p style={{ margin: "0 0 10px 0", fontSize: "13px" }}>{m.desc}</p>
                    <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`, "_blank")} style={{ padding: "6px 12px", background: "#00B4D8", color: "#FFF", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Get Directions ↗</button>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

function LoanCalculator({ theme }) {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);

  const calculateEMI = () => {
    const p = Number(loanAmount) || 0;
    const r = (Number(interestRate) || 0) / 12 / 100;
    const n = (Number(tenureYears) || 0) * 12;
    if (r === 0) return n > 0 ? p / n : 0;
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const emi = calculateEMI() || 0;
  const totalAmount = emi * (tenureYears * 12);
  const totalInterest = totalAmount - loanAmount;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="glass-panel" style={{ borderRadius: "16px", padding: "30px", display: "flex", flexDirection: "column", gap: "25px", border: "1px solid rgba(16,185,129,0.3)", marginTop: "40px" }}>
      <div>
        <h2 style={{ margin: "0 0 5px 0", color: theme === "light" ? "#0f172a" : "#FFF", fontSize: "24px", display: "flex", alignItems: "center", gap: 8 }}>🧮 Smart EMI Loan Calculator</h2>
        <p style={{ margin: 0, color: theme === "light" ? "#475569" : "#94a3b8", fontSize: "15px" }}>Calculate precise MSME & MUDRA loan monthly repayments instantly.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "25px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ color: theme === "light" ? "#0f172a" : "#9BF6FF", fontWeight: 700, fontSize: "14px" }}>Loan Amount (₹)</label>
          <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} style={{ padding: "12px 15px", borderRadius: "8px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFF", fontSize: "16px", outline: "none" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ color: theme === "light" ? "#0f172a" : "#9BF6FF", fontWeight: 700, fontSize: "14px" }}>Interest Rate (p.a %)</label>
          <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value)} style={{ padding: "12px 15px", borderRadius: "8px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFF", fontSize: "16px", outline: "none" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ color: theme === "light" ? "#0f172a" : "#9BF6FF", fontWeight: 700, fontSize: "14px" }}>Tenure (Years)</label>
          <input type="number" value={tenureYears} onChange={e => setTenureYears(e.target.value)} style={{ padding: "12px 15px", borderRadius: "8px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFF", fontSize: "16px", outline: "none" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "10px" }}>
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#10B981", fontSize: "14px", textTransform: "uppercase" }}>Monthly EMI</h4>
          <span style={{ fontSize: "28px", fontWeight: 900, color: theme === "light" ? "#0f172a" : "#FFF" }}>{formatCurrency(emi)}</span>
        </div>
        <div style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#FF6B35", fontSize: "14px", textTransform: "uppercase" }}>Total Interest</h4>
          <span style={{ fontSize: "28px", fontWeight: 900, color: theme === "light" ? "#0f172a" : "#FFF" }}>{formatCurrency(totalInterest > 0 ? totalInterest : 0)}</span>
        </div>
        <div style={{ background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.2)", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#00B4D8", fontSize: "14px", textTransform: "uppercase" }}>Total Payment</h4>
          <span style={{ fontSize: "28px", fontWeight: 900, color: theme === "light" ? "#0f172a" : "#FFF" }}>{formatCurrency(totalAmount > 0 ? totalAmount : 0)}</span>
        </div>
      </div>
    </div>
  );
}

function TaxComplianceCalendar({ theme }) {
  const deadlines = [
    { title: "GSTR-1 Monthly", date: "11th of Every Month", desc: "Outward supply details for normal taxpayers", type: "GST", color: "#FFB703" },
    { title: "GSTR-3B Monthly", date: "20th of Every Month", desc: "Summary return & tax payment", type: "GST", color: "#FFB703" },
    { title: "TDS/TCS Payment", date: "7th of Next Month", desc: "Deductions made in previous month", type: "TAX", color: "#00B4D8" },
    { title: "Advance Tax (Q4)", date: "15th March 2026", desc: "Last installment for FY 25-26", type: "TAX", color: "#00B4D8" },
    { title: "ITR Filing (Audit)", date: "31st October", desc: "For businesses requiring tax audit", type: "ITR", color: "#10B981" },
    { title: "ROC Annual Filing", date: "Within 30 Days of AGM", desc: "AOC-4 and MGT-7 filings for companies", type: "ROC", color: "#FF6B35" }
  ];

  return (
    <div className="glass-panel" style={{ borderRadius: "16px", padding: "30px", marginTop: "40px", border: "1px solid rgba(255,183,3,0.3)" }}>
      <h2 style={{ margin: "0 0 5px 0", color: theme === "light" ? "#0f172a" : "#FFF", fontSize: "24px", display: "flex", alignItems: "center", gap: 8 }}>📅 Tax & Compliance Deadlines ('25-'26)</h2>
      <p style={{ margin: "0 0 25px 0", color: theme === "light" ? "#475569" : "#94a3b8", fontSize: "15px" }}>Never miss a due date. Stay 100% compliant with our automated tracking logic.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {deadlines.map((d, i) => (
          <div key={i} style={{ background: "rgba(0,0,0,0.4)", borderLeft: `4px solid ${d.color}`, borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", transition: "transform 0.2s", cursor: "pointer" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
            <span style={{ fontWeight: 800, color: d.color, fontSize: "12px", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{d.type} Deadline</span>
            <h4 style={{ margin: "0 0 10px 0", color: "#FFF", fontSize: "18px" }}>{d.title}</h4>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "8px", fontWeight: 700, color: "#e2e8f0", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              ⏰ {d.date}
            </div>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px", lineHeight: 1.5 }}>{d.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickToolsGrid({ theme, sendMessage, t }) {
  return (
    <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
      <div className="glass-panel service-card" style={{ padding: "30px", borderRadius: "16px", border: "1px solid rgba(16,185,129,0.3)", textAlign: "left", display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: "22px", margin: "0 0 10px 0", color: "#10B981" }}>📊 AI Tax Optimizer</h3>
        <p style={{ color: theme === "light" ? "#475569" : "#94a3b8", fontSize: "14px", margin: "0 0 20px 0", lineHeight: 1.6, flex: 1 }}>Automatically scan your transaction data to find hidden deductions and legal loopholes mapped directly to your state.</p>
        <button onClick={() => sendMessage(t("msgTaxOptimizer"))} style={{ padding: "14px 20px", background: "rgba(16,185,129,0.1)", border: "1px solid #10B981", borderRadius: "8px", color: "#10B981", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.background = "#10B981"; e.currentTarget.style.color = "#FFF"}} onMouseOut={e => {e.currentTarget.style.background = "rgba(16,185,129,0.1)"; e.currentTarget.style.color = "#10B981"}}>Run Optimization Mode →</button>
      </div>
      <div className="glass-panel service-card" style={{ padding: "30px", borderRadius: "16px", border: "1px solid rgba(0,180,216,0.3)", textAlign: "left", display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: "22px", margin: "0 0 10px 0", color: "#00B4D8" }}>🔗 Fast E-Way Bill</h3>
        <p style={{ color: theme === "light" ? "#475569" : "#94a3b8", fontSize: "14px", margin: "0 0 20px 0", lineHeight: 1.6, flex: 1 }}>Fastest 1-click E-Way bill logistics automation. Linked seamlessly inside your GSTIN compliance pipeline and supply chain.</p>
        <button onClick={() => sendMessage(t("msgEWayBill"))} style={{ padding: "14px 20px", background: "rgba(0,180,216,0.1)", border: "1px solid #00B4D8", borderRadius: "8px", color: "#00B4D8", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.background = "#00B4D8"; e.currentTarget.style.color = "#FFF"}} onMouseOut={e => {e.currentTarget.style.background = "rgba(0,180,216,0.1)"; e.currentTarget.style.color = "#00B4D8"}}>Gen E-Way Bill Pipeline →</button>
      </div>
    </div>
  );
}

function GlobalFooter({ setActiveTab }) {
  const navigateTo = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div style={{ padding: "30px 20px", background: "rgba(15,23,42,0.8)", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", position: "relative", zIndex: 10, marginTop: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", color: "#94a3b8", fontSize: "14px", flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ fontWeight: 800, color: "#9BF6FF" }}>IndiaFinBot Pro</span>
        <span className="hide-mobile">|</span>
        <button onClick={() => navigateTo('privacy')} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", transition: "color 0.2s", padding: 0 }} onMouseOver={e=>e.currentTarget.style.color="#FFF"} onMouseOut={e=>e.currentTarget.style.color="#94a3b8"}>Privacy Policy</button>
        <span className="hide-mobile">|</span>
        <button onClick={() => navigateTo('terms')} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", transition: "color 0.2s", padding: 0 }} onMouseOver={e=>e.currentTarget.style.color="#FFF"} onMouseOut={e=>e.currentTarget.style.color="#94a3b8"}>Terms of Service</button>
        <span className="hide-mobile">|</span>
        <button onClick={() => navigateTo('help')} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", transition: "color 0.2s", padding: 0 }} onMouseOver={e=>e.currentTarget.style.color="#FFF"} onMouseOut={e=>e.currentTarget.style.color="#94a3b8"}>Help Center</button>
      </div>
      <p style={{ margin: 0, color: "#475569", fontSize: "12px", textAlign: "center" }}>© 2025-2026 IndiaFinBot AI Solutions. Intelligent Enterprise Infrastructure. All rights reserved.</p>
      
      <button onClick={scrollToTop} style={{ marginTop: "10px", padding: "10px 20px", background: "rgba(0,180,216,0.1)", border: "1px solid #00B4D8", color: "#00B4D8", borderRadius: "50px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, transition: "all 0.2s" }} onMouseOver={e=>{e.currentTarget.style.background="#00B4D8"; e.currentTarget.style.color="#FFF"; e.currentTarget.style.transform="translateY(-3px)"}} onMouseOut={e=>{e.currentTarget.style.background="rgba(0,180,216,0.1)"; e.currentTarget.style.color="#00B4D8"; e.currentTarget.style.transform="translateY(0)"}}>
        ↑ Scroll To Top
      </button>
    </div>
  );
}

export default function IndiaFinBot() {
  const [lang, setLang] = useState("en"); // en, hi, ta, te, ml, kn
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [isListening, setIsListening] = useState(false);

  const premiumUserEmail = import.meta.env.VITE_PREMIUM_USER_EMAIL || "gowthaamaneswar98@gmail.com";

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const toggleMic = () => {
    if (isListening) return;
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showNotification("Voice input not supported in this browser. Please use Chrome.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "hi" ? "hi-IN" : lang === "ta" ? "ta-IN" : lang === "te" ? "te-IN" : lang === "ml" ? "ml-IN" : lang === "kn" ? "kn-IN" : "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      showNotification(t("notifListening"));
    };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      showNotification(t("notifVoiceCaptured"));
    };
    recognition.onerror = () => {
      setIsListening(false);
      showNotification(t("notifMicError"));
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // User Profile State
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [investment, setInvestment] = useState("");
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const t = (key) => translations[lang][key] || translations['en'][key];

  // Initialize welcome message dynamically on linguistic state changes!
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: t("greeting"), time: new Date().toLocaleTimeString() }]);
    }
  }, [lang]);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const locationContext = selectedState ? `${selectedDistrict || 'Any District'}, ${selectedState}` : 'India';

  const formatLanguageInstruction = () => {
    let targetLanguage = "English";
    switch (lang) {
      case "hi": targetLanguage = "Hindi (Devanagari script)"; break;
      case "ta": targetLanguage = "Tamil"; break;
      case "te": targetLanguage = "Telugu"; break;
      case "ml": targetLanguage = "Malayalam"; break;
      case "kn": targetLanguage = "Kannada"; break;
      default: targetLanguage = "English"; break;
    }
    
    return `CRITICAL INSTRUCTION: You MUST process the user's request and respond ENTIRELY and EXCLUSIVELY in the ${targetLanguage} language. Even if the user explicitly types their prompt in English, your final output, all headers, analysis, and text MUST be strictly written natively in ${targetLanguage}. Ensure perfect grammar, formatting, and correct vocabulary in ${targetLanguage}. DO NOT mix languages.`;
  }


  const systemPrompt = `You are IndiaFinBot, an ultra-fast, highly advanced AI Accounting & Business Advisor for India.
${formatLanguageInstruction()} 

CRITICAL SPEED & COMPLETENESS: You must provide a comprehensive, end-to-end response instantly. Focus on high-speed delivery without sacrificing depth. For any 'all-in-one' requests, consolidate your entire strategy into one perfectly formatted master response.

User's Real-Time Profile context:
- Location / State: ${locationContext}
- Available Investment Capacity: ${investment || 'Not specified'}
- Core Business Interests: ${interests || 'Not specified'}
- Individual Skills/Experience: ${skills || 'Not specified'}
- Account: Premium Gemini 3.1 Pro User (${premiumUserEmail})

Your Core Capabilities & Guidelines:
1. End-To-End Statement Analysis: Whenever a user uploads a statement, perform a deeply intelligent, end-to-end audit. DO NOT MISS A SINGLE TRANSACTION. Verify balances meticulously, trace all debit/credit paths natively.
2. Next-Term Profitability: ALWAYS project and formulate a concrete roadmap on how the user can generate strong profits in the NEXT term based on their prior transaction patterns. Output clear solutions to convert losses into high margin profits.
3. State/District Localization: ALWAYS tailor answers drastically based on their specific Indian state. State-specific MSME subsidies, distinct GST state codes, local industrial zones.
4. Concrete Practical Examples: Provide highly personalized, practical examples mapping strictly to their uploaded requirements and limits. Give them distinct solution formulas.
5. Bank Statement Analysis: Analyze financial health deeply. Draw growth/loss inferences, cashflow cycles, 1-5 year historical projections.
6. Roadmap & Graphing Context: If prompted about statistics, 1-5 year P&L projections, or share market trends, YOU MUST output a JSON block with language 'recharts' containing an array of objects. Example: \`\`\`recharts\n[{"name": "Year 1", "Revenue": 1500000, "Profit": 300000}, {"name": "Year 2", "Revenue": 2000000, "Profit": 500000}]\n\`\`\` Keep the keys exactly 'name', 'Revenue', and 'Profit'.
7. Govt Schemes, Tax, & Loans: Dive aggressively into localized schemes (CGTMSE, MUDRA), tax rebates, loan structures.
8. CA Connections: Provide both Premium High-Fee CAs and Budget-Friendly Compliance CAs.
9. Gemini 3.1 Visual Blueprinting: If the user asks for a 'visual blueprint' or 'all-in-one image' of their strategy, YOU MUST respond with [GENERATE_IMAGE: <comprehensive cinematic prompt>]. This prompt should be a master composition representing their entire business ecosystem: the ${locationContext} cityscape, their ${interests} operations, wealth growth graphs, and government scheme symbols all in one premium, cinematic frame.
10. Tone: Beautiful markdown, highly structured, encouraging, professional but deeply mapped to their contextual language and Indian market logic.`;

  const sendMessage = async (msg, apiContentOverride = null) => {
    setActiveTab("chat");
    if (!msg.trim() && !apiContentOverride) return;
    const userMsg = {
      role: "user",
      content: msg || "I have uploaded my document for analysis.",
      apiContent: apiContentOverride || msg,
      time: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    showNotification(t("notifAnalysisStart"));
    try {
      const history = [...messages, userMsg].map((m) => {
        const role = m.role === "assistant" ? "model" : "user";
        let parts = Array.isArray(m.apiContent) ? m.apiContent : [{ text: String(m.apiContent || m.content) }];
        return { role, parts };
      });

      // Use the Render backend URL in production, or localhost during development
      const API_BASE = import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://indiafinbot.onrender.com";

      // Call our secure Backend API instead of exposing Gemini tokens
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: history,
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      let reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I had trouble responding.";
      
      const dMatch = reply.match(/\[GENERATE_IMAGE:\s*(.*?)\]/);
      const mdMatch = reply.match(/!\[.*?\]\((?!http)(.*?)\)/);
      const imageMatch = dMatch || mdMatch;
      
      if (imageMatch) {
        const imagePrompt = dMatch ? dMatch[1] : mdMatch[1];
        reply = reply.replace(imageMatch[0], `\n\n🎨 **Generating high-quality image...**\n`);
        setMessages(prev => [...prev, { role: "assistant", content: reply, time: new Date().toLocaleTimeString(), tempImage: true }]);
        
        // Directly route to Nano Banana Engine (Pollinations) to prevent limit errors
        setTimeout(() => {
          showNotification(t("notifPainting"));
          const seed = Math.floor(Math.random() * 1000000);
          const promptSuffix = `cinematic, high quality, professional business photography, ${locationContext}`;
          const fallbackPrompt = encodeURIComponent(`${imagePrompt}, ${promptSuffix}`);
          const fallbackUrl = `https://pollinations.ai/p/${fallbackPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`;
          
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMsgIdx = newMessages.findLastIndex(m => m.tempImage);
            if (lastMsgIdx !== -1) {
              const updatedContent = newMessages[lastMsgIdx].content.replace(`\n\n🎨 **Generating high-quality image...**\n`, `\n\n![Vision](${fallbackUrl})\n`);
              newMessages[lastMsgIdx] = { ...newMessages[lastMsgIdx], content: updatedContent };
              delete newMessages[lastMsgIdx].tempImage;
            }
            return newMessages;
          });
        }, 1500); 
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: reply, time: new Date().toLocaleTimeString() }]);
      }
      
      showNotification(t("notifAnalysisComplete"));
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Error: ${err.message}`, time: new Date().toLocaleTimeString() }]);
      showNotification(t("notifError"));
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";

    const isPDF = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");

    setActiveTab("chat");
    const uploadingMsg = { role: "user", content: `📎 ${t("uploadBtn")} "${file.name}"...`, time: new Date().toLocaleTimeString(), isUploading: true };
    setMessages(prev => [...prev, uploadingMsg]);
    setLoading(true);

    try {
      if (isPDF || isImage) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });

        const apiContent = [
          { inlineData: { mimeType: file.type, data: base64 } },
          { text: `I have uploaded my ${isImage ? "image" : "document (bank statement etc)"}: "${file.name}". \n\nCRITICAL INSTRUCTIONS FOR ANALYSIS:\n1. Analyze this statement strictly end-to-end for my business in ${locationContext} without leaving any single transaction out.\n2. Trace and explain the paths of my debits (where did money leak/flow?) and credits (where are the strong income sources?).\n3. Calculate and verify my balance correctly.\n4. NEXT TERM PROFITABILITY: Based precisely on my past spending/income patterns in this document, formulate a concrete, intelligent roadmap on how I can generate strong profits in the NEXT term.\n5. Give me highly personalized, practical examples mapping to my specific requirements to convert losses into high gross profits.\n\nBe highly intelligent, structured, and reply strictly in the language format chosen before.` }
        ];

        setMessages(prev => prev.filter(m => !m.isUploading));
        setLoading(false);
        const visualMsg = `${t("prefixUploaded")} "${file.name}"\n\n${t("msgUploadAnalysis")}`;
        
        await sendMessage(visualMsg, apiContent);
      } else if (isCSV) {
        const text = await file.text();
        setMessages(prev => prev.filter(m => !m.isUploading));
        setLoading(false);
        const visualMsg = `${t("prefixCSVUploaded")} "${file.name}"\n\n${t("msgUploadAnalysis")}`;
        
        await sendMessage(visualMsg, `Here is my CSV financial statement data: \n\n${text.slice(0, 4000)}...\n\nCRITICAL INSTRUCTIONS FOR ANALYSIS:\n1. Analyze this statement strictly end-to-end for my business in ${locationContext} without leaving any single transaction out.\n2. Trace and explain the paths of my debits and credits.\n3. Calculate and verify my balance correctly.\n4. NEXT TERM PROFITABILITY: Formulate a concrete roadmap on how I can generate strong profits in the NEXT term based on these transaction patterns.\n5. Give me highly personalized, practical examples mapping to my specific requirements to convert losses into high gross profits.\n\nBe highly intelligent, proactive, and provide clear step-by-step solutions.`);
      } else {
        setMessages(prev => prev.filter(m => !m.isUploading));
        setLoading(false);
        await sendMessage(`📎 File uploaded: "${file.name}"`);
      }
    } catch (err) {
      setMessages(prev => prev.filter(m => !m.isUploading));
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Error: ${err.message}`, time: new Date().toLocaleTimeString() }]);
    }
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.4)", color: "#fff", marginBottom: "14px", boxSizing: "border-box", outline: "none", fontSize: "14px", transition: "border 0.3s" };
  const labelStyle = { display: "block", fontSize: "13px", color: "#9BF6FF", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" };

  const OVERVIEW_CARDS = [
    { id: "business", title: t("card1Title"), img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800", desc: t("card1Desc") },
    { id: "finance", title: t("card2Title"), img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800", desc: t("card2Desc") },
    { id: "marketing", title: t("card3Title"), img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", desc: t("card3Desc") },
    { id: "operations", title: t("card4Title"), img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", desc: t("card4Desc") }
  ];

  // Sub-Render Data Charts
  const renderInteractiveDashboard = (card) => (
    <div style={{ padding: "10px", animation: "fadeIn 0.5s ease-in-out" }}>
      <button onClick={() => setSelectedDetailId(null)} style={{ background: "transparent", color: "#00B4D8", border: "none", cursor: "pointer", fontSize: "16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "5px" }}>
        {t("backToMatrix")}
      </button>

      <div style={{ display: "flex", gap: "30px", marginBottom: "40px", flexWrap: "wrap", alignItems: "center" }}>
        <img src={card.img} alt="Hero" style={{ width: "300px", height: "200px", borderRadius: "16px", objectFit: "cover", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h1 style={{ fontSize: "38px", margin: "0 0 10px 0", color: "#FFF" }}>{card.title} {t("deepDiveSuffix")}</h1>
          <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: 1.6 }}>{t("deepDiveDesc")} <span style={{ color: "#00B4D8", fontWeight: "bold" }}>{locationContext}</span>.</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap" }}>
            <span style={{ padding: "6px 14px", background: "rgba(255,107,53,0.1)", color: "#FF6B35", borderRadius: "20px", fontSize: "13px", fontWeight: 700, border: "1px solid rgba(255,107,53,0.3)" }}>{t("tag1")}</span>
            <span style={{ padding: "6px 14px", background: "rgba(16,185,129,0.1)", color: "#10B981", borderRadius: "20px", fontSize: "13px", fontWeight: 700, border: "1px solid rgba(16,185,129,0.3)" }}>{t("tag2")}</span>
            <span style={{ padding: "6px 14px", background: "rgba(0,180,216,0.1)", color: "#00B4D8", borderRadius: "20px", fontSize: "13px", fontWeight: 700, border: "1px solid rgba(0,180,216,0.3)" }}>{t("tag3")}</span>
          </div>
        </div>
      </div>

      <h2 style={{ color: "#FFF", fontSize: "24px", margin: "0 0 20px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>{t("chartTitle1")}</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
        <div className="glass-panel" style={{ flex: 1, minWidth: "400px", height: "350px", padding: "20px", borderRadius: "16px" }}>
          <h3 style={{ color: "#00B4D8", textAlign: "center", marginBottom: "15px" }}>{t("chartTitle2")}</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={MARKET_DATA_5Y} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #00b4d8", borderRadius: "8px" }} />
              <Legend />
              <Line type="monotone" dataKey="TopTier" stroke="#FFB703" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="MidCap" stroke="#00B4D8" strokeWidth={3} />
              <Line type="monotone" dataKey="SmallScale" stroke="#10B981" strokeWidth={3} />
              <Line type="monotone" dataKey="Startup" stroke="#FF6B35" strokeWidth={3} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ flex: 1, minWidth: "400px", height: "350px", padding: "20px", borderRadius: "16px" }}>
          <h3 style={{ color: "#10B981", textAlign: "center", marginBottom: "15px" }}>{t("chartTitle3")}</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={MARKET_DATA_5Y} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #10b981", borderRadius: "8px" }} />
              <Legend />
              <Bar dataKey="TopTier" fill="#FFB703" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Startup" fill="#FF6B35" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 style={{ color: "#FFF", fontSize: "24px", margin: "0 0 20px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>{t("tableTitle")}</h2>
      <div className="glass-panel" style={{ borderRadius: "16px", padding: "20px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(0,180,216,0.1)", color: "#00B4D8" }}>
              <th style={{ padding: "15px" }}>{t("thRank")}</th>
              <th style={{ padding: "15px" }}>{t("thCompany")}</th>
              <th style={{ padding: "15px" }}>{t("thCategory")}</th>
              <th style={{ padding: "15px" }}>{t("thRevenue")}</th>
              <th style={{ padding: "15px" }}>{t("thProfit")}</th>
              <th style={{ padding: "15px" }}>{t("thGrowth")}</th>
            </tr>
          </thead>
          <tbody>
            {TOP_COMPANIES_DATA.map((comp, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#e2e8f0", whiteSpace: "nowrap" }}>
                <td style={{ padding: "15px", fontWeight: "bold" }}>#{comp.rank}</td>
                <td style={{ padding: "15px" }}>{comp.name}</td>
                <td style={{ padding: "15px" }}>
                  <span style={{ padding: "4px 8px", background: comp.category === "Top-Tier" ? "rgba(255,183,3,0.15)" : comp.category === "Mid-Cap" || comp.category === "Medium" ? "rgba(0,180,216,0.15)" : comp.category === "Small-Scale" ? "rgba(16,185,129,0.15)" : "rgba(255,107,53,0.15)", color: comp.category === "Top-Tier" ? "#FFB703" : comp.category === "Mid-Cap" || comp.category === "Medium" ? "#00B4D8" : comp.category === "Small-Scale" ? "#10B981" : "#FF6B35", borderRadius: "6px", fontSize: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {comp.category}
                  </span>
                </td>
                <td style={{ padding: "15px" }}>{comp.revenue}</td>
                <td style={{ padding: "15px", color: comp.profit.includes("Loss") ? "#FF6B35" : "#10B981", fontWeight: "bold" }}>{comp.profit}</td>
                <td style={{ padding: "15px", color: "#00B4D8" }}>{comp.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={theme === "light" ? "light-mode" : ""} style={{ fontFamily: "'Inter', system-ui, sans-serif", background: theme === "light" ? "#f8fafc" : "#060913", minHeight: "100vh", color: theme === "light" ? "#0f172a" : "#f0f0f0", display: "flex", flexDirection: "column", position: "relative" }}>
      {theme === "light" && (
        <style>{`
          .light-mode .glass-panel { background: rgba(255,255,255,0.75) !important; border-color: rgba(0,0,0,0.1) !important; box-shadow: 0 4px 10px rgba(0,0,0,0.05) !important; }
          .light-mode h1, .light-mode h2, .light-mode h3, .light-mode h4, .light-mode label { color: #0f172a !important; text-shadow: none !important; }
          .light-mode p, .light-mode td, .light-mode th { color: #334155 !important; }
          .light-mode input, .light-mode select { background: #ffffff !important; color: #0f172a !important; border-color: rgba(0,0,0,0.2) !important; }
          .light-mode input::placeholder { color: #94a3b8 !important; }
          .light-mode a { background: rgba(2,132,199,0.05) !important; border: 1px solid rgba(0,0,0,0.1) !important; color: #0284c7 !important; }
          .light-mode a span { color: #0284c7 !important; }
          .light-mode a:hover { background: rgba(2,132,199,0.15) !important; }
          .light-mode .nav-tab { color: #475569 !important; }
          .light-mode .nav-tab:hover { background: rgba(2,132,199,0.1) !important; color: #0f172a !important; }
          .light-mode strong { color: #0f172a !important; }
          .light-mode .service-card p { color: #475569 !important; }
          .light-mode table { border-color: rgba(0,0,0,0.1) !important; }
          .light-mode th { background: rgba(2,132,199,0.1) !important; color: #0284c7 !important; border-color: rgba(0,0,0,0.1) !important; }
          .light-mode tr { border-bottom-color: rgba(0,0,0,0.1) !important; }
          .light-mode td { border-color: rgba(0,0,0,0.1) !important; }
          .light-mode .chat-user { background: linear-gradient(135deg, #e2e8f0, #cbd5e1) !important; border-color: rgba(0,0,0,0.1) !important; color: #0f172a !important; box-shadow: 0 4px 10px rgba(0,0,0,0.05) !important; }
          .light-mode .chat-bot { background: #ffffff !important; border-color: rgba(2,132,199,0.2) !important; color: #1e293b !important; box-shadow: 0 4px 10px rgba(0,0,0,0.05) !important; }
          .light-mode .chat-md-table { border: 1px solid rgba(0,0,0,0.1) !important; background: #ffffff !important; }
        `}</style>
      )}
      <Particles />

      {notification && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: "rgba(0,180,216,0.9)", color: "#fff", padding: "12px 24px", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.3)", animation: "tdot 0.3s ease-in-out", fontWeight: 600 }}>
          🔔 {notification}
        </div>
      )}

      <StockTicker />

      {/* Modern Header */}
      <div className="glass-panel" style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(0, 180, 216, 0.2)", padding: "15px 30px" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 15 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg, #FF6B35, #FFB703)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 0 20px rgba(255,107,53,0.3)" }}>🇮🇳</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#FFF", letterSpacing: "-0.5px", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>IndiaFin<span style={{ color: "#00B4D8" }}>Bot</span></div>
            </div>
          </div>

          <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "6px", border: "1px solid rgba(255,255,255,0.05)", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => { setActiveTab("overview"); setSelectedDetailId(null); }} className="nav-tab" style={{ background: activeTab === "overview" ? "rgba(0, 180, 216, 0.2)" : "transparent", color: activeTab === "overview" ? "#00B4D8" : "#94a3b8", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap" }}>{t("tabOverview")}</button>
            <button onClick={() => setActiveTab("schemes")} className="nav-tab" style={{ background: activeTab === "schemes" ? "rgba(0, 180, 216, 0.2)" : "transparent", color: activeTab === "schemes" ? "#00B4D8" : "#94a3b8", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px" }}>🏛️ {t("tabSchemes") || "Schemes & Pro"}</button>
            <button onClick={() => setActiveTab("chat")} className="nav-tab" style={{ background: activeTab === "chat" ? "rgba(0, 180, 216, 0.2)" : "transparent", color: activeTab === "chat" ? "#00B4D8" : "#94a3b8", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap" }}>🤖 {t("tabChat")}</button>
            <button onClick={() => setActiveTab("inspire")} className="nav-tab" style={{ background: activeTab === "inspire" ? "rgba(0, 180, 216, 0.2)" : "transparent", color: activeTab === "inspire" ? "#00B4D8" : "#94a3b8", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap" }}>{t("tabInspire")}</button>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
              style={{ padding: "10px 15px", borderRadius: 10, background: theme === "light" ? "rgba(2,132,199,0.1)" : "rgba(255,255,255,0.1)", color: theme === "light" ? "#0284c7" : "#FFF", border: theme === "light" ? "1px solid rgba(2,132,199,0.2)" : "1px solid rgba(255,255,255,0.2)", cursor: "pointer", outline: "none", fontWeight: 700, backdropFilter: "blur(5px)", display: "flex", alignItems: "center", gap: "6px" }}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            {/* Language Dropdown */}
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: "10px 15px", borderRadius: 10, background: "rgba(255,107,53,0.1)", color: "#FF6B35", border: "1px solid rgba(255,107,53,0.3)", cursor: "pointer", outline: "none", fontWeight: 700, backdropFilter: "blur(5px)" }}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="ml">മലയാളം</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>

            <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(""); }} style={{ padding: "10px 15px", borderRadius: 10, background: "rgba(0,0,0,0.5)", color: "#FFF", border: "1px solid rgba(0,180,216,0.3)", cursor: "pointer", outline: "none", fontWeight: 500, backdropFilter: "blur(5px)", maxWidth: "100%" }}>
              <option value="">{t("selectState")}</option>
              {Object.keys(INDIA_STATES).map(state => <option key={state} value={state}>{state}</option>)}
            </select>
            <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedState} style={{ padding: "10px 15px", borderRadius: 10, background: "rgba(0,0,0,0.5)", color: "#FFF", border: "1px solid rgba(0,180,216,0.3)", opacity: !selectedState ? 0.4 : 1, cursor: "pointer", outline: "none", fontWeight: 500, maxWidth: "100%" }}>
              <option value="">{t("selectDistrict")}</option>
              {selectedState && INDIA_STATES[selectedState].dists.map(dist => <option key={dist} value={dist}>{dist}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="main-container" style={{ position: "relative", zIndex: 5, flex: 1, maxWidth: 1800, margin: "0 auto", width: "100%", padding: "25px", display: "flex", gap: "25px" }}>
        
        <button 
          onClick={() => setSidebarVisible(!sidebarVisible)} 
          style={{ position: "absolute", left: sidebarVisible ? "355px" : "15px", top: "15px", zIndex: 100, background: "rgba(0,180,216,0.2)", border: "1px solid #00B4D8", color: "#00B4D8", width: "40px", height: "40px", borderRadius: "10px", cursor: "pointer", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
          title={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
        >
          {sidebarVisible ? "«" : "»"}
        </button>

        {/* Universal Left Sidebar: Profile Details */}
        <div className={`sidebar glass-panel custom-scrollbar ${!sidebarVisible ? 'hide-sidebar' : ''}`} style={{ borderRadius: "20px", padding: sidebarVisible ? "25px" : "0px", display: "flex", flexDirection: "column", overflowY: "auto", width: sidebarVisible ? "360px" : "0px", opacity: sidebarVisible ? 1 : 0, border: sidebarVisible ? "1px solid rgba(255,255,255,0.08)" : "none", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", flexShrink: 0 }}>
          {sidebarVisible && (
            <>
              <h3 style={{ color: "#FFF", margin: "0 0 20px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: 10, fontWeight: 700, whiteSpace: "nowrap" }}><span style={{ background: "#FF6B35", padding: "6px", borderRadius: "8px", fontSize: "16px" }}>🚀</span> {t("startupConfig")}</h3>

          <div>
            <label style={labelStyle}>{t("investmentLabel")}</label>
            <select value={investment} onChange={e => setInvestment(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#00B4D8"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}>
              <option value="" style={{ background: "#060913", color: "#666" }}>{t("investmentPlaceholder")}</option>
              {INVESTMENT_RANGES.map((r, i) => <option key={i} value={r} style={{ background: "#060913", color: "#fff" }}>{r}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>{t("interestsLabel")}</label>
            <select value={interests} onChange={e => setInterests(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#00B4D8"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}>
              <option value="" style={{ background: "#060913", color: "#666" }}>{t("interestsPlaceholder")}</option>
              {BUSINESS_VERTICALS.map((v, i) => <option key={i} value={v} style={{ background: "#060913", color: "#fff" }}>{v}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>{t("skillsLabel")}</label>
            <select value={skills} onChange={e => setSkills(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#00B4D8"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}>
              <option value="" style={{ background: "#060913", color: "#666" }}>{t("skillsPlaceholder")}</option>
              {FOUNDER_SKILLS.map((s, i) => <option key={i} value={s} style={{ background: "#060913", color: "#fff" }}>{s}</option>)}
            </select>
          </div>

          <button
            onClick={() => {
              const fullMsg = `${t("prefixLocation")} ${locationContext}.\n${t("prefixInvestment")} ${investment || 'Not specified'}\n${t("prefixInterests")} ${interests || 'Not specified'}\n${t("prefixSkills")} ${skills || 'Not specified'}\n\n${t("msgRunAnalysis")}`;
              sendMessage(fullMsg);
            }}
            style={{ padding: "15px", marginTop: "10px", borderRadius: "12px", background: "linear-gradient(135deg, #FF6B35, #FFB703)", color: "#111", border: "none", cursor: "pointer", fontWeight: 800, fontSize: "15px", boxShadow: "0 8px 25px rgba(255,107,53,0.4)", transition: "transform 0.2s" }}
            onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
            {t("runAnalysisBtn")}
          </button>

          <div style={{ marginTop: "35px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "25px" }}>
            <h4 style={{ color: "#9BF6FF", margin: "0 0 15px 0", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>{t("govtPortals")}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a href="https://www.gst.gov.in" target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "12px 16px", background: "rgba(0,0,0,0.4)", borderRadius: "10px", fontSize: "14px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", fontWeight: 500 }} onMouseOver={e => { e.currentTarget.style.background = "rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>🧾 {t("gstPortal")}</span> <span>↗</span></a>
              <a href="https://udyamregistration.gov.in" target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "12px 16px", background: "rgba(0,0,0,0.4)", borderRadius: "10px", fontSize: "14px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", fontWeight: 500 }} onMouseOver={e => { e.currentTarget.style.background = "rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>🏢 {t("msmePortal")}</span> <span>↗</span></a>
              <a href="https://www.startupindia.gov.in" target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "12px 16px", background: "rgba(0,0,0,0.4)", borderRadius: "10px", fontSize: "14px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", fontWeight: 500 }} onMouseOver={e => { e.currentTarget.style.background = "rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>🚀 {t("startupPortal")}</span> <span>↗</span></a>
            </div>
          </div>

          <div style={{ marginTop: "25px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "25px" }}>
            <h4 style={{ color: "#9BF6FF", margin: "0 0 15px 0", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Share Market Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ margin: "0 0 5px 0", color: "#94a3b8", fontSize: "12px", fontWeight: 600 }}>🇮🇳 Top India Markets</p>
              <a href="https://www.nseindia.com" target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "10px 14px", background: "rgba(0,0,0,0.4)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(255,107,53,0.15)"; e.currentTarget.style.borderColor = "#FF6B35"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>📈 NSE India</span> <span>↗</span></a>
              <a href="https://www.bseindia.com" target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "10px 14px", background: "rgba(0,0,0,0.4)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(255,107,53,0.15)"; e.currentTarget.style.borderColor = "#FF6B35"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>📉 BSE India</span> <span>↗</span></a>
              <a href="https://www.moneycontrol.com" target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "10px 14px", background: "rgba(0,0,0,0.4)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(255,107,53,0.15)"; e.currentTarget.style.borderColor = "#FF6B35"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>📰 Moneycontrol</span> <span>↗</span></a>

              <p style={{ margin: "10px 0 5px 0", color: "#94a3b8", fontSize: "12px", fontWeight: 600 }}>🇺🇸 Top US Markets</p>
              <a href="https://www.nyse.com" target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "10px 14px", background: "rgba(0,0,0,0.4)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>🏛️ NYSE</span> <span>↗</span></a>
              <a href="https://www.nasdaq.com" target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "10px 14px", background: "rgba(0,0,0,0.4)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>📊 NASDAQ</span> <span>↗</span></a>
              <a href="https://finance.yahoo.com" target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "10px 14px", background: "rgba(0,0,0,0.4)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>📈 Yahoo Finance</span> <span>↗</span></a>

              <p style={{ margin: "10px 0 5px 0", color: "#94a3b8", fontSize: "12px", fontWeight: 600 }}>🌐 Our Partners</p>
              <a href="https://indiafinbot.com" target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "10px 14px", background: "rgba(0,0,0,0.4)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(16,185,129,0.15)"; e.currentTarget.style.borderColor = "#10B981"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>🤖 IndiaFinBot Official</span> <span>↗</span></a>
            </div>
          </div>

          <div style={{ marginTop: "25px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "25px" }}>
            <h4 style={{ color: "#9BF6FF", margin: "0 0 15px 0", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Live Bank Loans ('25-'26)</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ margin: "0 0 5px 0", color: "#94a3b8", fontSize: "12px", fontWeight: 600 }}>🏦 Govt & Public Banks</p>
              {ALL_BANKS_DATA.govt.map((bank, i) => (
                <a key={`govt-${i}`} href={bank.link} target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "12px 14px", background: "rgba(0,0,0,0.4)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}>
                  <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontWeight: 700, color: "#9BF6FF", marginBottom: 4 }}>{bank.name} {bank.abbr && `(${bank.abbr})`}</span><span style={{ fontSize: "11px", color: "#94a3b8" }}>MSME/Biz: <strong style={{color:"#10B981"}}>{bank.rate}</strong></span></div> <span>↗</span>
                </a>
              ))}

              <p style={{ margin: "10px 0 5px 0", color: "#94a3b8", fontSize: "12px", fontWeight: 600 }}>🏛️ Top Private Banks</p>
              {ALL_BANKS_DATA.private.map((bank, i) => (
                <a key={`pvt-${i}`} href={bank.link} target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", padding: "12px 14px", background: "rgba(0,0,0,0.4)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}>
                   <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontWeight: 700, color: "#FFB703", marginBottom: 4 }}>{bank.name}</span><span style={{ fontSize: "11px", color: "#94a3b8" }}>Startup/Biz: <strong style={{color:"#10B981"}}>{bank.rate}</strong></span></div> <span>↗</span>
                </a>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "25px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "25px", paddingBottom: "25px" }}>
            <h4 style={{ color: "#FFB703", margin: "0 0 15px 0", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 800 }}>⚡ Active Pro Features</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ color: "#e2e8f0", padding: "10px 14px", background: "rgba(255,183,3,0.05)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,183,3,0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px" }}>🎙️</span> <span style={{ fontWeight: 600 }}>Live Voice Mic Engine</span>
              </div>
              <div style={{ color: "#e2e8f0", padding: "10px 14px", background: "rgba(255,183,3,0.05)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,183,3,0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px" }}>🧠</span> <span style={{ fontWeight: 600 }}>Gemini 3.1 Pro APIs</span>
              </div>
              <div style={{ color: "#e2e8f0", padding: "10px 14px", background: "rgba(255,183,3,0.05)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,183,3,0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px" }}>🗺️</span> <span style={{ fontWeight: 600 }}>Regional Mapping Radar</span>
              </div>
              <div style={{ color: "#e2e8f0", padding: "10px 14px", background: "rgba(255,183,3,0.05)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,183,3,0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px" }}>🧮</span> <span style={{ fontWeight: 600 }}>Financial Logic Configs</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

        {activeTab === "overview" && (
          <div className="content-area glass-panel custom-scrollbar" style={{ borderRadius: "20px", padding: selectedDetailId ? "20px" : "40px" }}>

            {!selectedDetailId ? (
              <>
                <h1 style={{ fontSize: "38px", margin: "0 0 10px 0", color: "#FFF", fontWeight: 800, letterSpacing: "-1px" }}>{t("welcomeTitle")}</h1>
                <p style={{ fontSize: "18px", color: "#94a3b8", margin: "0 0 40px 0", maxWidth: "800px", lineHeight: 1.6 }}>{t("welcomeDesc")}</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px" }}>
                  {OVERVIEW_CARDS.map((card, i) => (
                    <div key={i} onClick={() => setSelectedDetailId(card.id)} className="service-card glass-panel" style={{ borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ height: "200px", backgroundImage: `url(${card.img})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0f172a 0%, transparent 100%)" }}></div>
                      </div>
                      <div style={{ padding: "25px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <h3 style={{ color: "#FFF", fontSize: "22px", margin: "0 0 10px 0", fontWeight: 700 }}>{card.title} ↗</h3>
                        <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-panel" style={{ marginTop: "40px", padding: "30px", borderRadius: "16px", background: "rgba(0,180,216,0.05)", borderLeft: "4px solid #00B4D8" }}>
                  <h3 style={{ color: "#FFF", marginTop: 0 }}>{t("regionalLogic")} <span style={{ color: "#00B4D8" }}>{locationContext}</span></h3>
                  <p style={{ color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>{t("regionalLogicDesc")}</p>
                </div>

                {/* Massive Interactive Map Section Loading Here */}
                <div style={{ marginTop: "40px" }}>
                  <IndiaMapZone stateCode={selectedState} theme={theme} />
                </div>

                <LoanCalculator theme={theme} />

                <TaxComplianceCalendar theme={theme} />

                <QuickToolsGrid theme={theme} sendMessage={sendMessage} t={t} />
              </>
            ) : (
              renderInteractiveDashboard(OVERVIEW_CARDS.find(c => c.id === selectedDetailId))
            )}

          </div>
        )}

        {activeTab === "inspire" && (
          <div className="content-area glass-panel custom-scrollbar" style={{ borderRadius: "20px", padding: "40px" }}>
            <h1 style={{ fontSize: "34px", margin: "0 0 30px 0", color: "#FFF", fontWeight: 800 }}>{t("inspireTitle")}</h1>

            <h2 style={{ fontSize: "22px", color: "#FFB703", margin: "0 0 20px 0" }}>{t("leadersTitle")}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px", marginBottom: "40px" }}>
              {SECTOR_LEADERS.map((leader, i) => (
                <div key={i} className="glass-panel" style={{ borderRadius: "16px", padding: "20px", border: "1px solid rgba(255,107,53,0.3)" }}>
                  <img src={leader.image} alt={leader.name} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "15px", border: "2px solid #FF6B35" }} />
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", color: "#FFF" }}>{leader.name}</h3>
                  <p style={{ margin: "0 0 15px 0", color: "#9BF6FF", fontSize: "13px", fontWeight: 600 }}>{leader.company} | {leader.role}</p>
                  <p style={{ margin: 0, fontStyle: "italic", color: "#cbd5e1", fontSize: "14px", lineHeight: 1.5 }}>"{leader.quote}"</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
              <div>
                <h2 style={{ fontSize: "22px", color: "#00B4D8", margin: "0 0 20px 0" }}>{t("mediaTitle")}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {YOUTUBE_CHANNELS.map((ch, i) => (
                    <div key={i} className="glass-panel" style={{ padding: "15px 20px", borderRadius: "12px", borderLeft: "3px solid #00B4D8" }}>
                      <h4 style={{ margin: "0 0 5px 0", color: "#FFF", fontSize: "16px" }}>{ch.name} <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: "normal" }}>({ch.handle})</span></h4>
                      <p style={{ margin: "0 0 10px 0", color: "#94a3b8", fontSize: "13px", lineHeight: 1.4 }}>{ch.desc}</p>
                      <a href={ch.link} target="_blank" rel="noreferrer" style={{ color: "#00B4D8", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>Watch & Learn →</a>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 style={{ fontSize: "22px", color: "#10B981", margin: "0 0 20px 0" }}>{t("caTitle")}</h2>
                <div className="glass-panel" style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "rgba(0,0,0,0.5)", color: "#94a3b8" }}>
                        <th style={{ padding: "12px 15px", fontWeight: 600 }}>{t("caThFirm")}</th>
                        <th style={{ padding: "12px 15px", fontWeight: 600 }}>{t("caThTier")}</th>
                        <th style={{ padding: "12px 15px", fontWeight: 600 }}>{t("caThFee")}</th>
                        <th style={{ padding: "12px 15px", fontWeight: 600 }}>{t("caThReach")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...CA_DATABASES.high, ...CA_DATABASES.low].map((ca, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "15px", color: "#FFF", fontWeight: 500 }}>{ca.name}</td>
                          <td style={{ padding: "15px", color: ca.type.includes("Top") ? "#FFB703" : "#10B981" }}>{ca.type}</td>
                          <td style={{ padding: "15px", color: "#e2e8f0", whiteSpace: "nowrap" }}>{ca.fee}</td>
                          <td style={{ padding: "15px" }}><a href={`mailto:${ca.email}`} style={{ color: "#00B4D8", textDecoration: "none" }}>{ca.email}</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: "12px 15px", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", fontSize: "12px", textAlign: "center", borderTop: "1px solid rgba(16,185,129,0.2)" }}>
                    {t("caFooter")}
                  </div>
                </div>
              </div>
            </div>

            {/* Huge Database Render Area */}
            <div style={{ marginTop: "50px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "40px" }}>
              <h1 style={{ fontSize: "30px", margin: "0 0 10px 0", color: "#FFF", fontWeight: 800 }}>India Startup & Creator Directory</h1>
              <p style={{ color: "#94a3b8", fontSize: "15px", marginBottom: "30px" }}>Connect directly through verified social channels across YouTube, LinkedIn, and Instagram.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                {Object.keys(INFLUENCERS_DB).map((region, rIdx) => (
                  <div key={rIdx}>
                    <h3 style={{ fontSize: "20px", color: region.includes("South") ? "#FFB703" : region.includes("North") ? "#10B981" : "#00B4D8", margin: "0 0 20px 0", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: 10 }}>{region}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                      {INFLUENCERS_DB[region].map((block, bIdx) => (
                        <div key={bIdx} className="glass-panel" style={{ borderRadius: "12px", padding: "15px" }}>
                          <h4 style={{ margin: "0 0 12px 0", color: "#FFF", fontSize: "15px", background: "rgba(0,0,0,0.4)", padding: "6px 12px", borderRadius: "6px", display: "inline-block" }}>📍 {block.cat}</h4>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {block.names.map((name, nIdx) => (
                              <div key={nIdx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: nIdx < block.names.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                                <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 600 }}>{name}</span>
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(name)}`} target="_blank" rel="noreferrer" title="YouTube" style={{ background: "rgba(255,0,0,0.1)", color: "#ef4444", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", textDecoration: "none" }}>YT</a>
                                  <a href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(name)}`} target="_blank" rel="noreferrer" title="LinkedIn" style={{ background: "rgba(10,102,194,0.1)", color: "#3b82f6", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", textDecoration: "none" }}>IN</a>
                                  <a href={`https://www.instagram.com/explore/tags/${name.replace(/\s+/g, '').toLowerCase()}/`} target="_blank" rel="noreferrer" title="Instagram" style={{ background: "rgba(217,70,239,0.1)", color: "#d946ef", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", textDecoration: "none" }}>IG</a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Dynamic Govt Schemes Tab Component */}
        {activeTab === "schemes" && (
          <div className="content-area glass-panel custom-scrollbar" style={{ borderRadius: "20px", padding: "40px" }}>
            <h1 style={{ fontSize: "34px", margin: "0 0 10px 0", color: "#FFF", fontWeight: 800 }}>🏛️ Government Schemes & Pro Research</h1>
            <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "40px", maxWidth: "800px", lineHeight: 1.6 }}>Explore end-to-end verified India compensation frameworks, deep research limits, and exact startup subsidy allowances. Match your profile against top-tier MSME programs to unlock direct capital.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px", marginBottom: "40px" }}>
              {GOVERNMENT_SCHEMES.map((scheme, i) => (
                <div key={i} className="glass-panel" style={{ borderRadius: "16px", padding: "25px", border: "1px solid rgba(0,180,216,0.2)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, fontSize: "80px", opacity: 0.1 }}>{scheme.icon}</div>
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: "rgba(0,180,216,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 15, border: "1px solid rgba(0,180,216,0.3)" }}>
                    {scheme.icon}
                  </div>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "#FFF" }}>{scheme.title}</h3>
                  <p style={{ margin: "0 0 20px 0", color: "#94a3b8", fontSize: "14px", lineHeight: 1.6 }}>{scheme.desc}</p>

                  <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", padding: "10px", borderRadius: "8px", marginBottom: "20px" }}>
                    <span style={{ display: "block", color: "#10B981", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Available Subsidy / Coverage</span>
                    <span style={{ color: "#FFF", fontSize: "14px", fontWeight: 600 }}>{scheme.coverage}</span>
                  </div>

                  <a href={scheme.link} target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "linear-gradient(135deg, #00B4D8, #0284c7)", color: "#FFF", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 700, transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                    Apply / Research ↗
                  </a>
                </div>
              ))}
            </div>

            <div className="glass-panel" style={{ borderRadius: "16px", padding: "30px", borderLeft: "4px solid #FFB703", background: "rgba(255,183,3,0.05)" }}>
              <h2 style={{ margin: "0 0 15px 0", color: "#FFB703", fontSize: "22px" }}>End-to-End Pro Compensation Analysis</h2>
              <p style={{ color: "#e2e8f0", fontSize: "15px", lineHeight: 1.6, margin: "0 0 20px 0" }}>Our integration dynamically triggers deep AI sweeps across structural documentation to generate high-level breakdowns of executive compensation vs Top-Tier frameworks. Enter your current financial bandwidth inside the profile editor to let the Pro bot analyze your enterprise roadmap against global standards.</p>
              <button onClick={() => { setActiveTab("chat"); }} style={{ padding: "12px 24px", borderRadius: "8px", background: "#FFB703", color: "#111", border: "none", fontWeight: 800, cursor: "pointer", fontSize: "14px" }}>Request AI Pro Analysis ↗</button>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="content-area glass-panel custom-scrollbar" style={{ borderRadius: "20px", padding: "40px" }}>
            <button onClick={() => setActiveTab("overview")} style={{ marginBottom: "30px", padding: "12px 20px", background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid #10B981", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: 700, transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.background="#10B981"; e.currentTarget.style.color="#FFF"}} onMouseOut={e => {e.currentTarget.style.background="rgba(16,185,129,0.1)"; e.currentTarget.style.color="#10B981"}}>← Back to Home</button>
            <h1 style={{ fontSize: "38px", color: "#FFF", marginBottom: "20px", fontWeight: 800 }}>Privacy Policy</h1>
            <div style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <p>Your privacy is important to us. This Privacy Policy outlines how your data is collected, used, and protected when you use IndiaFinBot.</p>
              <h3 style={{ color: "#9BF6FF", marginTop: "10px", marginBottom: "5px" }}>1. Information We Collect</h3>
              <ul style={{ paddingLeft: "20px" }}>
                <li><strong>Profile Data:</strong> Business interests, investment capabilities, and founder skills you explicitly configure.</li>
                <li><strong>Location Data:</strong> State and District inputs used to tailor highly specific MSME policies and language translation.</li>
                <li><strong>Document Processing:</strong> Uploaded financial statements (PDF, CSV, Image) are securely processed via Gemini AI and never stored permanently.</li>
              </ul>
              <h3 style={{ color: "#9BF6FF", marginTop: "10px", marginBottom: "5px" }}>2. Data Security & Encryption</h3>
              <p>All chat queries and uploaded files are routed over encrypted HTTPS. Sensitive PII data is stripped out locally before AI deep-scanning where applicable.</p>
              <h3 style={{ color: "#9BF6FF", marginTop: "10px", marginBottom: "5px" }}>3. Third-Party Interfaces</h3>
              <p>Our application interacts directly with OpenRouter and Pollinations.ai APIs for language processing and image generation. Data sent out is purely contextual to generate relevant financial blueprints.</p>
              <p style={{ marginTop: "20px", fontStyle: "italic", fontSize: "14px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "15px" }}>Last updated: March 2026</p>
            </div>
          </div>
        )}

        {activeTab === "terms" && (
          <div className="content-area glass-panel custom-scrollbar" style={{ borderRadius: "20px", padding: "40px" }}>
            <button onClick={() => setActiveTab("overview")} style={{ marginBottom: "30px", padding: "12px 20px", background: "rgba(0,180,216,0.1)", color: "#00B4D8", border: "1px solid #00B4D8", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: 700, transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.background="#00B4D8"; e.currentTarget.style.color="#FFF"}} onMouseOut={e => {e.currentTarget.style.background="rgba(0,180,216,0.1)"; e.currentTarget.style.color="#00B4D8"}}>← Back to Home</button>
            <h1 style={{ fontSize: "38px", color: "#FFF", marginBottom: "20px", fontWeight: 800 }}>Terms of Service</h1>
            <div style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <p>By using IndiaFinBot Pro, you agree to these Terms of Service. Please read them carefully.</p>
              <h3 style={{ color: "#FFB703", marginTop: "10px", marginBottom: "5px" }}>1. Disclaimer of Liability</h3>
              <p>IndiaFinBot is an AI-powered analytical tool, not a certified human Chartered Accountant (CA). All generated roadmaps, P&L models, structural breakdowns, and projections are for educational and advisory purposes only.</p>
              <h3 style={{ color: "#FFB703", marginTop: "10px", marginBottom: "5px" }}>2. User Responsibilities</h3>
              <p>You assume all responsibility for any action taken upon your business following advice simulated by the engine. Users are heavily advised to verify numbers with official CA partners and physical Gov guidelines (GSTIN, MSME portals).</p>
              <h3 style={{ color: "#FFB703", marginTop: "10px", marginBottom: "5px" }}>3. API Rate Limits</h3>
              <p>Pro users benefit from high limits but are still bound by fair-use policies against the core Gemini infrastructure. Abuse of image/text generations may result in temporary API throttling.</p>
              <p style={{ marginTop: "20px", fontStyle: "italic", fontSize: "14px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "15px" }}>Last updated: March 2026</p>
            </div>
          </div>
        )}

        {activeTab === "help" && (
          <div className="content-area glass-panel custom-scrollbar" style={{ borderRadius: "20px", padding: "40px" }}>
            <button onClick={() => setActiveTab("overview")} style={{ marginBottom: "30px", padding: "12px 20px", background: "rgba(255,107,53,0.1)", color: "#FF6B35", border: "1px solid #FF6B35", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: 700, transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.background="#FF6B35"; e.currentTarget.style.color="#FFF"}} onMouseOut={e => {e.currentTarget.style.background="rgba(255,107,53,0.1)"; e.currentTarget.style.color="#FF6B35"}}>← Back to Home</button>
            <h1 style={{ fontSize: "38px", color: "#FFF", marginBottom: "20px", fontWeight: 800 }}>Help Center & FAQ</h1>
            <div style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <p>Need support? You can find answers to our most common questions below.</p>
              <div style={{ background: "rgba(0,0,0,0.4)", padding: "25px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "10px" }}>
                <h4 style={{ margin: 0, color: "#9BF6FF", fontSize: "18px" }}>How do I generate accurate charts?</h4>
                <p style={{ margin: 0 }}>Ask the AI Bot directly to "Show me a 5 year Profit/Loss projection block" or "Plot my expenses". The bot will natively render Recharts block data dynamically.</p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.4)", padding: "25px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "10px" }}>
                <h4 style={{ margin: 0, color: "#9BF6FF", fontSize: "18px" }}>Why are images rendering weirdly?</h4>
                <p style={{ margin: 0 }}>Our image engine runs on Pollinations Free Tier. Try explicitly detailing your image prompt: e.g., "Create a beautiful 3D isometric representation of an IT hub in Chennai".</p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.4)", padding: "25px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "10px" }}>
                <h4 style={{ margin: 0, color: "#9BF6FF", fontSize: "18px" }}>Does the AI Support local languages?</h4>
                <p style={{ margin: 0 }}>Yes! Use the top navigation bar to flip the dashboard's internal language engine. The AI respects this and will output data natively in Tamil, Hindi, Kannada, Malayalam, or Telugu.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="content-area glass-panel" style={{ display: "flex", flexDirection: "column", borderRadius: "20px", overflow: "hidden", position: "relative" }}>
            <div className="chat-messages-container custom-scrollbar" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 18, padding: "30px" }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", width: "100%" }}>
                  {msg.role !== "user" && <div style={{ minWidth: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #FFB703)", marginRight: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 10px rgba(255,107,53,0.3)", flexShrink: 0 }}>🤖</div>}
                  <div className={msg.role === "user" ? "chat-user" : "chat-bot"} style={{ background: msg.role === "user" ? "linear-gradient(135deg, #1e293b, #0f172a)" : "rgba(0,0,0,0.4)", border: msg.role === "user" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,180,216,0.15)", padding: "20px 25px", borderRadius: "16px", borderTopRightRadius: msg.role === "user" ? 4 : 16, borderTopLeftRadius: msg.role !== "user" ? 4 : 16, maxWidth: "80%", lineHeight: 1.7, fontSize: "15px", color: "#e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", overflowX: "auto" }}>
                    {msg.isUploading ? (
                      <div><TypingDots /> <span style={{ marginLeft: 10, color: "#00B4D8" }}>{msg.content}</span></div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => <h1 style={{ color: "#FFF", marginTop: 0, fontSize: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10 }} {...props} />,
                          h2: ({ node, ...props }) => <h2 style={{ color: "#00B4D8", marginTop: 25, fontSize: "20px" }} {...props} />,
                          h3: ({ node, ...props }) => <h3 style={{ color: "#FFB703", margin: "20px 0 10px" }} {...props} />,
                          strong: ({ node, ...props }) => <strong style={{ color: "#FFF", fontWeight: 700 }} {...props} />,
                          a: ({ node, ...props }) => <a style={{ color: "#FF6B35", textDecoration: "none", fontWeight: 600 }} {...props} />,
                          ul: ({ node, ...props }) => <ul style={{ paddingLeft: 20, margin: "15px 0" }} {...props} />,
                          li: ({ node, ...props }) => <li style={{ margin: "8px 0" }} {...props} />,
                          table: ({ node, ...props }) => <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0", background: "rgba(0,0,0,0.3)", borderRadius: 8 }} {...props} /></div>,
                          th: ({ node, ...props }) => <th style={{ padding: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,180,216,0.1)", color: "#00B4D8", textAlign: "left" }} {...props} />,
                          td: ({ node, ...props }) => <td style={{ padding: "10px 12px", border: "1px solid rgba(255,255,255,0.1)" }} {...props} />,
                          img: ({ node, ...props }) => {
                            let safeSrc = props.src || "";
                            if (!safeSrc.startsWith("http")) {
                              const visualPrompt = `${safeSrc} in ${locationContext} business style`;
                              safeSrc = `https://image.pollinations.ai/prompt/${encodeURIComponent(visualPrompt)}?width=1200&height=800&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
                            } else {
                              safeSrc = safeSrc.replace(/ /g, '%20');
                            }
                            return <img style={{ maxWidth: "100%", borderRadius: 12, marginTop: 15, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }} {...props} src={safeSrc} />;
                          },
                          code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || "");
                            if (!inline && match && match[1] === "recharts") {
                              try {
                                const data = JSON.parse(String(children).replace(/\n$/, ""));
                                return (
                                  <div style={{ width: "100%", height: 350, background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "20px 20px 20px 0", marginTop: 25 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={data} margin={{ top: 10, right: 10, left: 60, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" stroke="#00B4D8" />
                                        <YAxis stroke="#00B4D8" />
                                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
                                        <Legend wrapperStyle={{ paddingTop: 10 }} />
                                        <Bar dataKey="Revenue" fill="#00B4D8" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Profit" fill="#FFB703" radius={[4, 4, 0, 0]} />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                );
                              } catch (e) {
                                return <code className={className} style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: 8, display: "block", overflowX: "auto" }} {...props}>{children}</code>;
                              }
                            }
                            return <code className={className} style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: 4 }} {...props}>{children}</code>;
                          }
                        }}
                      >{msg.content}</ReactMarkdown>
                    )}
                  </div>
                  {msg.role === "user" && <div style={{ minWidth: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.1)", marginLeft: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>👤</div>}
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
                  <div style={{ minWidth: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #FFB703)", marginRight: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 10px rgba(255,107,53,0.3)", flexShrink: 0 }}>🤖</div>
                  <div className="chat-bot" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,180,216,0.15)", padding: "15px 25px", borderRadius: "16px", borderTopLeftRadius: 4 }}><TypingDots /></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: "20px 30px", background: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(0,180,216,0.2)", backdropFilter: "blur(20px)" }}>
              <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg" style={{ display: "none" }} />
                <button
                  onClick={() => fileInputRef.current.click()}
                  style={{ background: "rgba(0,180,216,0.1)", border: "1px solid #00B4D8", color: "#00B4D8", padding: "15px 20px", borderRadius: 12, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", whiteSpace: "nowrap" }}
                  onMouseOver={e => { e.currentTarget.style.background = "rgba(0,180,216,0.2)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "rgba(0,180,216,0.1)"; e.currentTarget.style.transform = "scale(1)"; }}>
                  <span style={{ fontSize: "18px" }}>📊</span> {t("uploadBtn")}
                </button>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                  placeholder={isListening ? "🎙️ Listening..." : t("chatPlaceholder")}
                  style={{ flex: 1, padding: "16px 22px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(15,23,42,0.8)", color: "#fff", fontSize: "15px", outline: "none", boxShadow: "inset 0 2px 5px rgba(0,0,0,0.5)", transition: "border 0.3s" }}
                  onFocus={e => e.target.style.borderColor = "#FF6B35"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button
                  onClick={toggleMic}
                  style={{ background: isListening ? "rgba(239, 68, 68, 0.2)" : "rgba(0,180,216,0.1)", border: `1px solid ${isListening ? "#ef4444" : "#00B4D8"}`, color: isListening ? "#ef4444" : "#00B4D8", padding: "15px", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  title="Voice Input"
                >
                  <span className={isListening ? "pulse-anim" : ""} style={{ fontSize: "18px" }}>🎙️</span>
                </button>
                <button
                  onClick={() => sendMessage(input)}
                  style={{ padding: "16px 35px", borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #FFB703)", color: "#111", border: "none", cursor: input.trim() ? "pointer" : "default", fontWeight: 900, fontSize: "16px", boxShadow: "0 5px 15px rgba(255,107,53,0.4)", transition: "transform 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
                  {t("launchBtn")}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <GlobalFooter setActiveTab={setActiveTab} />
    </div>
  );
}
