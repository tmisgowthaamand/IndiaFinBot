/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

function ReactParticles() {
  const particles = React.useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      width: Math.random() * 4 + 1,
      height: Math.random() * 4 + 1,
      background: i % 3 === 0 ? "#FF6B35" : i % 3 === 1 ? "#00B4D8" : "#9BF6FF",
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
      animation: `float${i % 3} ${10 + Math.random() * 10}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 5}s`,
    }));
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {particles.map((p) => (
        <div key={p.id} style={{
          position: "absolute",
          width: p.width,
          height: p.height,
          borderRadius: "50%",
          background: p.background,
          left: p.left,
          top: p.top,
          opacity: p.opacity,
          animation: p.animation,
          animationDelay: p.animationDelay,
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

const MARKER_COLORS = { CA: "#3b82f6", MSME: "#22c55e", LOAN: "#eab308", COMP: "#ef4444" };

function createMarkerIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #FFF;box-shadow:0 0 6px ${color};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function IndiaMapZone({ stateCode, theme }) {
  const [mapType, setMapType] = useState("CA"); // CA, MSME, LOAN, COMP

  const center = stateCode && INDIA_STATES[stateCode] ? INDIA_STATES[stateCode].coords : { lat: 20.5937, lng: 78.9629 };

  const markers = React.useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const latOffset = (Math.random() - 0.5) * 2;
      const lngOffset = (Math.random() - 0.5) * 2;
      return {
        id: i, lat: center.lat + latOffset, lng: center.lng + lngOffset,
        title: mapType === "CA" ? `Verified Tax Partner ${i + 1}` : mapType === "MSME" ? `SEZ Govt Tech Park ${i + 1}` : mapType === "LOAN" ? `Approved MUDRA Bank Branch` : `Local Competitor Business`,
        desc: mapType === "CA" ? `Fee: ₹5K/mo | GST Filing` : mapType === "LOAN" ? `Interest: 8.5% | Fast Approval` : mapType === "MSME" ? `Subsidized IT & Agri Plot` : `High Density Market`
      };
    });
  }, [center.lat, center.lng, mapType]);

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
        <MapContainer center={[center.lat, center.lng]} zoom={stateCode ? 7 : 5} style={{ width: "100%", height: "100%" }} zoomControl={true} maxBounds={[[6, 67], [38, 98]]} maxBoundsViscosity={1.0}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://carto.com/">CARTO</a>' />
          <Circle center={[center.lat, center.lng]} radius={150000} pathOptions={{ color: "#00B4D8", fillColor: "#00B4D8", fillOpacity: 0.1, weight: 2 }} />
          {markers.map(m => (
            <Marker key={m.id} position={[m.lat, m.lng]} icon={createMarkerIcon(MARKER_COLORS[mapType])}>
              <Popup>
                <div style={{ padding: "5px 10px", color: "#111" }}>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "15px", fontWeight: 800 }}>{m.title}</h4>
                  <p style={{ margin: "0 0 10px 0", fontSize: "13px" }}>{m.desc}</p>
                  <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`, "_blank")} style={{ padding: "6px 12px", background: "#00B4D8", color: "#FFF", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Get Directions ↗</button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ color: theme === "light" ? "#0f172a" : "#9BF6FF", fontWeight: 700, fontSize: "14px" }}>Loan Amount (₹)</label>
          <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} style={{ padding: "14px 18px", borderRadius: "10px", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFF", fontSize: "17px", outline: "none", transition: "all 0.2s" }} onFocus={e => e.target.style.borderColor = "#10B981"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ color: theme === "light" ? "#0f172a" : "#9BF6FF", fontWeight: 700, fontSize: "14px" }}>Interest Rate (p.a %)</label>
          <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value)} style={{ padding: "14px 18px", borderRadius: "10px", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFF", fontSize: "17px", outline: "none", transition: "all 0.2s" }} onFocus={e => e.target.style.borderColor = "#10B981"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ color: theme === "light" ? "#0f172a" : "#9BF6FF", fontWeight: 700, fontSize: "14px" }}>Tenure (Years)</label>
          <input type="number" value={tenureYears} onChange={e => setTenureYears(e.target.value)} style={{ padding: "14px 18px", borderRadius: "10px", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFF", fontSize: "17px", outline: "none", transition: "all 0.2s" }} onFocus={e => e.target.style.borderColor = "#10B981"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
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

function CGTMSEDetailPage({ setActiveTab }) {
  const S = { /* shorthand styles */
    section: { marginBottom: "50px" },
    h2: { fontSize: "26px", fontWeight: 800, color: "#FFF", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "12px" },
    badge: (color) => ({ display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, background: `rgba(${color},0.15)`, border: `1px solid rgba(${color},0.3)`, color: `rgb(${color})` }),
    card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "22px 26px" },
    infoBox: (c) => ({ background: `rgba(${c},0.07)`, border: `1px solid rgba(${c},0.2)`, borderRadius: "12px", padding: "18px 22px" }),
    link: { color: "#3B82F6", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", transition: "opacity 0.2s" },
  };

  const DOCS = [
    { icon: "🏢", title: "Certificate of Incorporation / Registration", desc: "MSME/Udyam, Shop & Establishment Act, or company incorporation proof.", link: "https://udyamregistration.gov.in", ref: "MSME Registry" },
    { icon: "📋", title: "Duly filled CGTMSE Application Form", desc: "Available from MLI (Member Lending Institutions) — your bank branch.", link: "https://www.cgtmse.in/Downloads", ref: "CGTMSE Downloads" },
    { icon: "📊", title: "Last 2–3 Years Financial Statements", desc: "Audited P&L, Balance Sheet, and Cash Flow statements signed by a CA.", link: "https://www.icai.org", ref: "ICAI (CA Portal)" },
    { icon: "🧾", title: "GST Registration Certificate", desc: "GST certificate from the GST portal confirming your GSTIN number.", link: "https://www.gst.gov.in", ref: "GST Portal" },
    { icon: "📁", title: "Project Report / Business Plan", desc: "Detailed business plan covering investment outlay, projected revenue, and repayment capacity.", link: "https://www.startupindia.gov.in/content/sih/en/service_providers.html", ref: "Startup India Docs" },
    { icon: "🪪", title: "KYC Documents of Promoters", desc: "Aadhaar, PAN, passport-size photos of all founders and directors.", link: "https://uidai.gov.in", ref: "UIDAI (Aadhaar)" },
    { icon: "🏦", title: "Bank Account Statements", desc: "Last 12 months statements for the primary business account.", link: "https://rbi.org.in/scripts/Notification.aspx", ref: "RBI Guidelines" },
    { icon: "📝", title: "Sanction Letter from Bank (MLI)", desc: "Formal loan sanction letter from your Member Lending Institution (bank).", link: "https://www.cgtmse.in/MLIDetails", ref: "CGTMSE MLI List" },
    { icon: "🗺️", title: "Land / Premises Proof", desc: "Lease deed, sale deed, or NOC for business premises (for manufacturing units).", link: "https://dolr.gov.in", ref: "Dept. of Land Resources" },
    { icon: "⚙️", title: "Machinery / Asset Quotations", desc: "Supplier quotations or invoice for capital assets being purchased using the loan.", link: "https://makeinindia.com", ref: "Make in India" },
  ];

  const STEPS = [
    { num: "01", title: "Register on Udyam Portal", detail: "Get your free MSME Udyam Registration certificate from udyamregistration.gov.in. This is mandatory as a precondition.", color: "59,130,246" },
    { num: "02", title: "Approach a Member Lending Institution", detail: "Visit a scheduled commercial bank (SBI, PNB, Bank of Baroda, HDFC, ICICI, etc.) that is an MLI under CGTMSE.", color: "6,182,212" },
    { num: "03", title: "Submit Loan Application", detail: "File your term loan / working capital loan application with your project report, KYC, financials, and business plan.", color: "16,185,129" },
    { num: "04", title: "Bank Internal Appraisal", detail: "Your bank/MLI conducts a credit appraisal. If approved, they issue a sanction letter.", color: "245,158,11" },
    { num: "05", title: "Bank Files CGTMSE Guarantee Request", detail: "The bank then applies to CGTMSE online on your behalf via the CGTMSE portal for guarantee coverage.", color: "168,85,247" },
    { num: "06", title: "CGTMSE Processing & Approval", detail: "CGTMSE reviews the request and approves the guarantee cover (85% for Micro, 75% for others).", color: "239,68,68" },
    { num: "07", title: "Loan Disbursement", detail: "Post approval, your bank disburses the sanctioned loan amount directly to your account.", color: "59,130,246" },
  ];

  const FEES = [
    { category: "Micro Enterprises (Loan up to ₹5L)", agf: "0.37%", arfNorth: "0.25%", arfOther: "0.37%" },
    { category: "Small Enterprises (₹5L – ₹50L)", agf: "0.55%", arfNorth: "0.40%", arfOther: "0.55%" },
    { category: "Small Enterprises (₹50L – ₹2Cr)", agf: "0.60%", arfNorth: "0.55%", arfOther: "0.60%" },
    { category: "Enterprises (₹2Cr – ₹5Cr)", agf: "1.20%", arfNorth: "1.20%", arfOther: "1.20%" },
  ];

  const TIMELINE = [
    { phase: "Udyam Registration", duration: "Same Day", icon: "⚡" },
    { phase: "Bank Loan Application", duration: "1–3 Days", icon: "📝" },
    { phase: "Bank Credit Appraisal", duration: "7–21 Days", icon: "🔍" },
    { phase: "CGTMSE Guarantee Submission", duration: "3–5 Days", icon: "🏛️" },
    { phase: "CGTMSE Approval", duration: "7–14 Days", icon: "✅" },
    { phase: "Loan Disbursement", duration: "2–5 Days", icon: "💰" },
    { phase: "Total End-to-End", duration: "20–45 Days", icon: "🏁" },
  ];

  const coverageChartData = [
    { name: "Micro Ent.\n(₹2Cr limit)", coverage: 85, uncovered: 15 },
    { name: "Small Ent.\n(₹2–5Cr)", coverage: 75, uncovered: 25 },
    { name: "NE/Hill States\nAll Categories", coverage: 80, uncovered: 20 },
    { name: "Women/SC/ST\nEntrepreneurs", coverage: 85, uncovered: 15 },
  ];

  const loanRangeData = [
    { range: "0–5L", applicants: 42 },
    { range: "5–25L", applicants: 30 },
    { range: "25L–1Cr", applicants: 16 },
    { range: "1–2Cr", applicants: 7 },
    { range: "2–5Cr", applicants: 5 },
  ];

  const approvalTrendData = [
    { year: "2020", guarantees: 420000 },
    { year: "2021", guarantees: 530000 },
    { year: "2022", guarantees: 680000 },
    { year: "2023", guarantees: 810000 },
    { year: "2024", guarantees: 950000 },
    { year: "2025", guarantees: 1100000 },
  ];

  const RELATED = [
    { icon: "🪙", name: "PMMY / MUDRA Loan", desc: "Micro loans up to ₹20L without collateral via Pradhan Mantri Mudra Yojana.", link: "#", onClick: () => setActiveTab("pmmy") },
    { icon: "🏭", name: "PMEGP Subsidy", desc: "15–35% project cost subsidy for setting up new micro-businesses.", link: "#", onClick: () => setActiveTab("pmegp") },
    { icon: "👩‍💼", name: "Stand-Up India", desc: "₹10L to ₹1Cr loans specially for SC/ST/Women led greenfield enterprises.", link: "https://www.standupmitra.in" },
    { icon: "📜", name: "TReDS Platform", desc: "Quick vendor discounting of MSME receivables from large corporate buyers.", link: "https://m1xchange.com" },
    { icon: "🏛️", name: "SIDBI MSME Loans", desc: "Direct loan facility from SIDBI for MSMEs at competitive interest rates.", link: "https://www.sidbi.in" },
    { icon: "🌐", name: "Udyam Registration", desc: "Free MSME registration required for all government scheme eligibility.", link: "https://udyamregistration.gov.in" },
  ];

  return (
    <div className="content-area glass-panel custom-scrollbar fade-in-up" style={{ borderRadius: "20px", padding: "clamp(20px, 4vw, 45px)" }}>

      {/* Back Button */}
      <button onClick={() => setActiveTab("schemes")} style={{ marginBottom: "30px", padding: "10px 18px", background: "rgba(255,255,255,0.05)", color: "#E4E4E7", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: 600, transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
        ← Back to Schemes
      </button>

      {/* Hero Banner */}
      <div style={{ ...S.infoBox("59,130,246"), marginBottom: "40px", display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start", borderLeft: "5px solid #3B82F6" }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "40px" }}>🏦</span>
            <div>
              <h1 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, color: "#FFF", margin: 0, letterSpacing: "-0.5px" }}>CGTMSE Scheme</h1>
              <p style={{ color: "#71717A", margin: "4px 0 0 0", fontSize: "14px" }}>Credit Guarantee Fund Trust for Micro & Small Enterprises</p>
            </div>
          </div>
          <p style={{ color: "#A1A1AA", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>
            A flagship Government of India initiative administered jointly by <strong style={{ color: "#FFF" }}>SIDBI</strong> and the <strong style={{ color: "#FFF" }}>Ministry of MSME</strong>. It enables banks to provide <strong style={{ color: "#3B82F6" }}>collateral-free credit</strong> to eligible micro and small enterprises up to ₹5 Crore by providing a guarantee cover to the lending institution.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
            <span style={S.badge("16,185,129")}>✅ Collateral Free</span>
            <span style={S.badge("59,130,246")}>🏛️ Govt Backed</span>
            <span style={S.badge("245,158,11")}>💰 Up to ₹5 Cr</span>
            <span style={S.badge("168,85,247")}>📈 85% Coverage</span>
          </div>
        </div>
        <div style={{ background: "rgba(59,130,246,0.1)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(59,130,246,0.2)", minWidth: "200px", textAlign: "center" }}>
          <div style={{ fontSize: "42px", fontWeight: 900, color: "#3B82F6" }}>₹5 Cr</div>
          <div style={{ color: "#71717A", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Maximum Loan Amount</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "15px 0" }} />
          <div style={{ fontSize: "30px", fontWeight: 900, color: "#10B981" }}>85%</div>
          <div style={{ color: "#71717A", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Max Guarantee Coverage</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "15px 0" }} />
          <a href="https://www.cgtmse.in" target="_blank" rel="noreferrer" style={{ ...S.link, justifyContent: "center", background: "#3B82F6", color: "#FFF", padding: "10px 18px", borderRadius: "8px", fontWeight: 700 }}>Official Portal ↗</a>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "50px" }}>
        {[
          { label: "Guarantees (2025)", val: "11 Lakh+", color: "#3B82F6", icon: "🔐" },
          { label: "Total Corpus", val: "₹7,500 Cr", color: "#10B981", icon: "💼" },
          { label: "MLI Banks", val: "130+", color: "#06B6D4", icon: "🏦" },
          { label: "Interest Rate Range", val: "8–13%", color: "#F59E0B", icon: "📊" },
          { label: "Repayment Tenure", val: "Up to 7 Yrs", color: "#A78BFA", icon: "📅" },
        ].map((stat, i) => (
          <div key={i} style={{ ...S.card, textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: stat.color }}>{stat.val}</div>
            <div style={{ fontSize: "11px", color: "#71717A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "4px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Required Documents */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(59,130,246,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>📄</span> Required Documents</h2>
        <p style={{ color: "#71717A", marginBottom: "24px", lineHeight: 1.7 }}>Prepare these documents <strong style={{ color: "#FFF" }}>before visiting your bank</strong>. Each document links to its official source for verification.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" }}>
          {DOCS.map((doc, i) => (
            <div key={i} style={{ ...S.card, display: "flex", gap: "14px", alignItems: "flex-start", borderLeft: "3px solid rgba(59,130,246,0.4)" }}>
              <div style={{ fontSize: "28px", flexShrink: 0 }}>{doc.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "6px" }}>{doc.title}</div>
                <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6 }}>{doc.desc}</div>
                <a href={doc.link} target="_blank" rel="noreferrer" style={{ ...S.link, fontSize: "12px", marginTop: "8px", display: "inline-flex" }} onMouseOver={e => e.currentTarget.style.opacity = 0.7} onMouseOut={e => e.currentTarget.style.opacity = 1}>
                  📎 {doc.ref} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Process Flowchart */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(16,185,129,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🔄</span> Application Process — Step by Step</h2>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "36px", top: "20px", bottom: "20px", width: "2px", background: "linear-gradient(to bottom, #3B82F6, #10B981)", borderRadius: "2px", display: "block" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "16px" }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `rgba(${step.color},0.15)`, border: `2px solid rgba(${step.color},0.5)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 900, color: `rgb(${step.color})`, fontSize: "14px" }}>{step.num}</div>
                <div style={{ ...S.card, flex: 1, padding: "16px 20px" }}>
                  <div style={{ fontWeight: 700, color: "#FFF", fontSize: "15px", marginBottom: "6px" }}>{step.title}</div>
                  <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6 }}>{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(245,158,11,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>📈</span> Visual Data &amp; Analytics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>

          {/* Coverage Bar Chart */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#F59E0B", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📊 Guarantee Coverage % by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={coverageChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#71717A" tick={{ fontSize: 10 }} />
                <YAxis stroke="#71717A" domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`${v}%`]} />
                <Bar dataKey="coverage" fill="#3B82F6" radius={[5, 5, 0, 0]} name="Coverage %" />
                <Bar dataKey="uncovered" fill="rgba(239,68,68,0.3)" radius={[5, 5, 0, 0]} name="Uncovered %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Approval Trend Line Chart */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#10B981", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📈 Annual Guarantees Approved (Cumulative)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={approvalTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#71717A" tick={{ fontSize: 10 }} />
                <YAxis stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${(v/100000).toFixed(0)}L`} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [v.toLocaleString("en-IN")]} />
                <Line type="monotone" dataKey="guarantees" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Guarantees" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Loan Range Distribution */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#A78BFA", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📉 Loan Range Distribution of Applicants (%)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={loanRangeData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="range" stroke="#71717A" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`${v}%`]} />
                <Bar dataKey="applicants" fill="#A78BFA" radius={[0, 5, 5, 0]} name="Applicants %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Eligibility Checklist Visual */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#06B6D4", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>✅ Eligibility Checklist</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { ok: true, item: "Registered as Micro or Small Enterprise (Udyam)" },
                { ok: true, item: "Loan amount between ₹10,000 and ₹5 Crore" },
                { ok: true, item: "Business operational or new (greenfield) project" },
                { ok: true, item: "No existing CGTMSE covered loan in default" },
                { ok: true, item: "Viable project / business plan submitted to bank" },
                { ok: false, item: "Medium or Large enterprises (not eligible)" },
                { ok: false, item: "Agricultural or retail trading activities (restricted)" },
                { ok: false, item: "Educational / SHG loans under other guarantees" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.ok ? "✅" : "❌"}</span>
                  <span style={{ color: item.ok ? "#E4E4E7" : "#71717A", fontSize: "13px", textDecoration: item.ok ? "none" : "line-through" }}>{item.item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Fee Structure */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(239,68,68,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>💳</span> Fee Structure (Annual)</h2>
        <div style={{ ...S.infoBox("245,158,11"), marginBottom: "20px" }}>
          <strong style={{ color: "#F59E0B" }}>ℹ️ Note:</strong> <span style={{ color: "#A1A1AA" }}>CGTMSE charges Annual Guarantee Fees (AGF) on the guaranteed amount. These are paid by the bank (MLI) and <strong style={{ color: "#FFF" }}>may or may not be passed on to you</strong>. Always clarify with your bank upfront.</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "rgba(59,130,246,0.1)" }}>
                <th style={{ padding: "14px 18px", textAlign: "left", color: "#3B82F6", fontWeight: 700 }}>Loan Category</th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#3B82F6", fontWeight: 700 }}>Annual Guarantee Fee</th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#10B981", fontWeight: 700 }}>NE/Hill States Rate</th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#F59E0B", fontWeight: 700 }}>Other Regions Rate</th>
              </tr>
            </thead>
            <tbody>
              {FEES.map((fee, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "14px 18px", color: "#E4E4E7" }}>{fee.category}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center", color: "#A78BFA", fontWeight: 700 }}>{fee.agf}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center", color: "#10B981", fontWeight: 700 }}>{fee.arfNorth}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center", color: "#F59E0B", fontWeight: 700 }}>{fee.arfOther}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: "#71717A", fontSize: "12px", marginTop: "12px" }}>Source: <a href="https://www.cgtmse.in/DownloadFile?fileName=Revised%20Annual%20Guarantee%20Fee%20structure%202023.pdf" target="_blank" rel="noreferrer" style={S.link}>CGTMSE Official Fee Circular 2023 ↗</a></p>
      </div>

      {/* Approval Timeline */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>⏱️</span> Approval Timeline</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
          {TIMELINE.map((tl, i) => (
            <div key={i} style={{ ...S.card, textAlign: "center", borderTop: i === TIMELINE.length - 1 ? "3px solid #10B981" : "3px solid rgba(59,130,246,0.3)" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{tl.icon}</div>
              <div style={{ fontWeight: 700, color: i === TIMELINE.length - 1 ? "#10B981" : "#F59E0B", fontSize: "15px", marginBottom: "5px" }}>{tl.duration}</div>
              <div style={{ color: "#71717A", fontSize: "11px" }}>{tl.phase}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Reference Links */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(6,182,212,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🔗</span> Official Government Reference Links</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
          {[
            { label: "CGTMSE Official Portal", url: "https://www.cgtmse.in", desc: "Apply, check status, and download forms." },
            { label: "Udyam MSME Registration", url: "https://udyamregistration.gov.in", desc: "Mandatory first step before applying to any bank." },
            { label: "MSME Ministry", url: "https://msme.gov.in", desc: "Central ministry overseeing all MSME schemes." },
            { label: "SIDBI (Co-Trustee)", url: "https://www.sidbi.in", desc: "Small Industries Development Bank  — manages corpus." },
            { label: "RBI MLI Guidelines", url: "https://www.rbi.org.in", desc: "Reserve Bank of India lending norms applicable to MLIs." },
            { label: "CGTMSE MLI Bank List", url: "https://www.cgtmse.in/MLIDetails", desc: "Full list of 130+ banks participating in CGTMSE." },
            { label: "Startup India Portal", url: "https://www.startupindia.gov.in", desc: "Additional benefits for DPIIT-recognized startups." },
            { label: "Jan Samarth Portal", url: "https://www.jansamarth.in", desc: "Single-window platform for all government credit schemes." },
          ].map((ref, i) => (
            <a key={i} href={ref.url} target="_blank" rel="noreferrer" style={{ ...S.card, textDecoration: "none", display: "flex", flexDirection: "column", gap: "6px", cursor: "pointer", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"} onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
              <div style={{ fontWeight: 700, color: "#3B82F6", fontSize: "13px", display: "flex", justifyContent: "space-between" }}>{ref.label}<span>↗</span></div>
              <div style={{ color: "#71717A", fontSize: "12px" }}>{ref.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ ...S.infoBox("16,185,129"), borderLeft: "5px solid #10B981" }}>
        <h2 style={{ ...S.h2, marginBottom: "20px" }}>🚀 What To Do Next</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {[
            { step: "1", action: "Register on Udyam Portal", link: "https://udyamregistration.gov.in", cta: "Register Free →" },
            { step: "2", action: "Find your nearest MLI bank from CGTMSE list", link: "https://www.cgtmse.in/MLIDetails", cta: "View Banks →" },
            { step: "3", action: "Prepare your documents & project report", link: "https://www.msme.gov.in", cta: "MSME Docs Guide →" },
            { step: "4", action: "Apply via Jan Samarth single-window platform", link: "https://www.jansamarth.in", cta: "Apply Online →" },
            { step: "5", action: "Track your CGTMSE guarantee approval status", link: "https://www.cgtmse.in", cta: "Track Status →" },
            { step: "6", action: "Explore related MSME schemes below", link: "#related", cta: "View Related ↓" },
          ].map((ns, i) => (
            <a key={i} href={ns.link} target={ns.link.startsWith("http") ? "_blank" : "_self"} rel="noreferrer" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "10px", padding: "16px", textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(16,185,129,0.15)"} onMouseOut={e => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(16,185,129,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#10B981", fontWeight: 800, fontSize: "13px" }}>{ns.step}</div>
              <div style={{ color: "#E4E4E7", fontSize: "13px", lineHeight: 1.5 }}>{ns.action}</div>
              <div style={{ color: "#10B981", fontSize: "12px", fontWeight: 700 }}>{ns.cta}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Related Schemes */}
      <div id="related" style={{ ...S.section, marginTop: "50px" }}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🧩</span> Related MSME Schemes to Explore</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          {RELATED.map((r, i) => (
            <div key={i} style={{ ...S.card, display: "flex", gap: "14px", alignItems: "flex-start", cursor: r.onClick ? "pointer" : "default" }} onClick={r.onClick || undefined}>
              <span style={{ fontSize: "28px" }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "5px" }}>{r.name}</div>
                <div style={{ color: "#71717A", fontSize: "12px", lineHeight: 1.6, marginBottom: "10px" }}>{r.desc}</div>
                {r.onClick ? (
                  <button onClick={r.onClick} style={{ ...S.link, fontSize: "12px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>View Full Guide ↗</button>
                ) : (
                  <a href={r.link} target="_blank" rel="noreferrer" style={{ ...S.link, fontSize: "12px" }}>Learn More ↗</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function PMMYDetailPage({ setActiveTab }) {
  const S = {
    section: { marginBottom: "50px" },
    h2: { fontSize: "26px", fontWeight: 800, color: "#FFF", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "12px" },
    badge: (color) => ({ display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, background: `rgba(${color},0.15)`, border: `1px solid rgba(${color},0.3)`, color: `rgb(${color})` }),
    card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "22px 26px" },
    infoBox: (c) => ({ background: `rgba(${c},0.07)`, border: `1px solid rgba(${c},0.2)`, borderRadius: "12px", padding: "18px 22px" }),
    link: { color: "#F59E0B", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", transition: "opacity 0.2s" },
  };

  /* ── Loan Slab Data ── */
  const SLABS = [
    { name: "Shishu", range: "Up to ₹50,000", color: "16,185,129", icon: "🌱", purpose: "For new entrepreneurs & first-time business starters. Covers basic startup funding, working capital, and initial equipment costs.", interest: "9% – 12% p.a.", tenure: "Up to 5 Years", collateral: "Not Required", eligibility: "Any Indian citizen aged 18–65 starting or running a small non-farm enterprise." },
    { name: "Kishore", range: "₹50,001 – ₹5 Lakh", color: "59,130,246", icon: "🚀", purpose: "For businesses looking to expand. Covers equipment purchases, inventory buildup, and operational scaling.", interest: "10% – 14% p.a.", tenure: "Up to 5 Years", collateral: "Not Required", eligibility: "Existing micro-enterprise with business proof and 6+ months bank statements." },
    { name: "Tarun", range: "₹5,00,001 – ₹10 Lakh", color: "168,85,247", icon: "🏢", purpose: "For established micro-enterprises needing significant expansion, capital investments, and technology upgrades.", interest: "11% – 16% p.a.", tenure: "Up to 7 Years", collateral: "Not Required", eligibility: "Well-established business with audited financials and a clear expansion plan." },
    { name: "Tarun Plus", range: "₹10 Lakh – ₹20 Lakh", color: "239,68,68", icon: "⭐", purpose: "New category (Budget 2024-25) for entrepreneurs who have successfully availed and repaid a Tarun loan.", interest: "11% – 18% p.a.", tenure: "Up to 7 Years", collateral: "Not Required", eligibility: "Must have successfully repaid a previous Tarun category MUDRA loan." },
  ];

  /* ── Required Documents ── */
  const DOCS = [
    { icon: "🪪", title: "Identity Proof (Aadhaar / PAN)", desc: "Self-attested Aadhaar Card, PAN Card, Voter ID, Driving License, or Passport of the applicant.", link: "https://uidai.gov.in", ref: "UIDAI (Aadhaar)" },
    { icon: "🏠", title: "Address Proof", desc: "Recent utility bills (not older than 2 months), Aadhaar, Passport, Voter ID, or latest bank statement.", link: "https://uidai.gov.in", ref: "UIDAI Portal" },
    { icon: "📝", title: "Duly Filled MUDRA Loan Application Form", desc: "Available at any participating bank branch or download from the MUDRA portal.", link: "https://www.mudra.org.in", ref: "MUDRA Official" },
    { icon: "📸", title: "Two Passport-Size Photographs", desc: "Recent passport-sized colour photographs of the applicant.", link: "#", ref: "Standard Requirement" },
    { icon: "🏪", title: "Business Registration / Proof", desc: "Shop & Establishment Certificate, GST Registration, Partnership Deed, or Udyam Registration.", link: "https://udyamregistration.gov.in", ref: "Udyam Registration" },
    { icon: "📋", title: "Business Plan / Project Report", desc: "A detailed plan covering total investment, projected revenue, repayment capacity, and business viability.", link: "https://www.startupindia.gov.in", ref: "Startup India" },
    { icon: "🏦", title: "Bank Statements (6–12 Months)", desc: "Last 6 to 12 months bank account statements for the primary business account.", link: "https://rbi.org.in", ref: "RBI Guidelines" },
    { icon: "🧾", title: "Income Tax Returns (ITR)", desc: "Past 1–2 years ITR (especially for Kishore and Tarun categories).", link: "https://www.incometax.gov.in", ref: "Income Tax Portal" },
    { icon: "⚙️", title: "Quotations for Machinery / Equipment", desc: "Supplier quotations or proforma invoices for assets to be purchased (for Kishore & Tarun loans).", link: "https://makeinindia.com", ref: "Make in India" },
    { icon: "📊", title: "Caste / Community Certificate (if applicable)", desc: "For SC/ST/OBC applicants to avail any additional benefits or priority processing.", link: "https://services.india.gov.in", ref: "National Services Portal" },
  ];

  /* ── Application Process Steps ── */
  const STEPS = [
    { num: "01", title: "Determine Your Loan Category", detail: "Identify whether you need Shishu (up to ₹50K), Kishore (up to ₹5L), Tarun (up to ₹10L), or Tarun Plus (up to ₹20L) based on your business stage and funding requirements.", color: "245,158,11" },
    { num: "02", title: "Choose a Lending Institution", detail: "Select any participating bank — SBI, PNB, HDFC, ICICI, or any Regional Rural Bank, Small Finance Bank, NBFC, or MFI that offers MUDRA loans.", color: "59,130,246" },
    { num: "03", title: "Prepare Your Documents", detail: "Gather identity proof, address proof, business registration, bank statements, project report, and quotations as applicable to your loan category.", color: "6,182,212" },
    { num: "04", title: "Submit Loan Application", detail: "Visit the bank branch in person OR apply online via the official JanSamarth portal (jansamarth.in) or Udyamimitra portal (udyamimitra.in).", color: "16,185,129" },
    { num: "05", title: "Bank Verification & Credit Appraisal", detail: "The bank verifies your documents, reviews your business plan, checks your credit history (CIBIL), and conducts a field inspection if required.", color: "168,85,247" },
    { num: "06", title: "Loan Sanction & Agreement", detail: "If approved, the bank issues a sanction letter detailing the loan amount, interest rate, tenure, and repayment schedule. You sign the loan agreement.", color: "239,68,68" },
    { num: "07", title: "Loan Disbursement", detail: "The sanctioned amount is disbursed directly to your bank account. For Shishu loans, disbursement can happen within 7–10 working days.", color: "59,130,246" },
    { num: "08", title: "Receive MUDRA Card (Optional)", detail: "A MUDRA Card (RuPay debit card) may be issued for Shishu loans, allowing you to manage working capital expenses directly.", color: "245,158,11" },
  ];

  /* ── Fee Structure ── */
  const FEES = [
    { category: "Shishu (Up to ₹50,000)", processing: "Nil / Waived", interest: "9% – 12% p.a.", prepayment: "No Penalty" },
    { category: "Kishore (₹50,001 – ₹5L)", processing: "0.50% of Loan Amount", interest: "10% – 14% p.a.", prepayment: "No Penalty" },
    { category: "Tarun (₹5L – ₹10L)", processing: "0.50% – 1% of Loan Amount", interest: "11% – 16% p.a.", prepayment: "2% of Outstanding (varies)" },
    { category: "Tarun Plus (₹10L – ₹20L)", processing: "0.50% – 1% of Loan Amount", interest: "11% – 18% p.a.", prepayment: "2% of Outstanding (varies)" },
  ];

  /* ── Approval Timeline ── */
  const TIMELINE = [
    { phase: "Document Preparation", duration: "1–3 Days", icon: "📋" },
    { phase: "Application Submission", duration: "Same Day", icon: "📝" },
    { phase: "Bank Verification", duration: "3–7 Days", icon: "🔍" },
    { phase: "Credit Appraisal", duration: "5–14 Days", icon: "🏦" },
    { phase: "Loan Sanction", duration: "2–5 Days", icon: "✅" },
    { phase: "Disbursement", duration: "3–7 Days", icon: "💰" },
    { phase: "Total (Shishu)", duration: "7–14 Days", icon: "⚡" },
    { phase: "Total (Kishore/Tarun)", duration: "14–30 Days", icon: "🏁" },
  ];

  /* ── Chart Data ── */
  const slabChartData = [
    { name: "Shishu", maxLoan: 0.5, color: "#10B981" },
    { name: "Kishore", maxLoan: 5, color: "#3B82F6" },
    { name: "Tarun", maxLoan: 10, color: "#A78BFA" },
    { name: "Tarun Plus", maxLoan: 20, color: "#EF4444" },
  ];

  const disbursementTrendData = [
    { year: "2015-16", amount: 132955 },
    { year: "2016-17", amount: 175312 },
    { year: "2017-18", amount: 253677 },
    { year: "2018-19", amount: 321723 },
    { year: "2019-20", amount: 337495 },
    { year: "2020-21", amount: 321759 },
    { year: "2021-22", amount: 339110 },
    { year: "2022-23", amount: 414880 },
    { year: "2023-24", amount: 505126 },
    { year: "2024-25", amount: 545000 },
  ];

  const categoryDistributionData = [
    { name: "Shishu", percentage: 68, accounts: "88%" },
    { name: "Kishore", percentage: 22, accounts: "9%" },
    { name: "Tarun", percentage: 10, accounts: "3%" },
  ];

  const sectorWiseData = [
    { sector: "Trading", pct: 42 },
    { sector: "Services", pct: 28 },
    { sector: "Manufacturing", pct: 18 },
    { sector: "Allied Agri", pct: 12 },
  ];

  /* ── Related Schemes ── */
  const RELATED = [
    { icon: "🏦", name: "CGTMSE Scheme", desc: "Collateral-free credit guarantee up to ₹5 Crore for micro & small enterprises.", link: "#", onClick: () => setActiveTab("cgtmse") },
    { icon: "🏭", name: "PMEGP Subsidy", desc: "15–35% project cost subsidy for setting up new micro-businesses.", link: "#", onClick: () => setActiveTab("pmegp") },
    { icon: "👩‍💼", name: "Stand-Up India", desc: "₹10L to ₹1Cr loans specially for SC/ST/Women led greenfield enterprises.", link: "https://www.standupmitra.in" },
    { icon: "📜", name: "TReDS Platform", desc: "Quick vendor discounting of MSME receivables from large corporate buyers.", link: "https://m1xchange.com" },
    { icon: "🏛️", name: "SIDBI MSME Loans", desc: "Direct loan facility from SIDBI for MSMEs at competitive interest rates.", link: "https://www.sidbi.in" },
    { icon: "🌐", name: "Udyam Registration", desc: "Free MSME registration required for all government scheme eligibility.", link: "https://udyamregistration.gov.in" },
  ];

  return (
    <div className="content-area glass-panel custom-scrollbar fade-in-up" style={{ borderRadius: "20px", padding: "clamp(20px, 4vw, 45px)" }}>

      {/* Back Button */}
      <button onClick={() => setActiveTab("schemes")} style={{ marginBottom: "30px", padding: "10px 18px", background: "rgba(255,255,255,0.05)", color: "#E4E4E7", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: 600, transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
        ← Back to Schemes
      </button>

      {/* Hero Banner */}
      <div style={{ ...S.infoBox("245,158,11"), marginBottom: "40px", display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start", borderLeft: "5px solid #F59E0B" }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "40px" }}>🪙</span>
            <div>
              <h1 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, color: "#FFF", margin: 0, letterSpacing: "-0.5px" }}>PMMY — MUDRA Loans</h1>
              <p style={{ color: "#71717A", margin: "4px 0 0 0", fontSize: "14px" }}>Pradhan Mantri MUDRA Yojana — Micro Units Development & Refinance Agency</p>
            </div>
          </div>
          <p style={{ color: "#A1A1AA", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>
            Launched in <strong style={{ color: "#FFF" }}>April 2015</strong> by the Government of India, PMMY provides <strong style={{ color: "#F59E0B" }}>collateral-free micro-credit</strong> up to ₹20 Lakh to non-corporate, non-farm small and micro enterprises. MUDRA is a subsidiary of <strong style={{ color: "#FFF" }}>SIDBI</strong> and operates under the <strong style={{ color: "#FFF" }}>Ministry of Finance</strong>. Loans are disbursed through commercial banks, RRBs, small finance banks, MFIs, and NBFCs across India.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
            <span style={S.badge("16,185,129")}>✅ No Collateral</span>
            <span style={S.badge("245,158,11")}>🏛️ Govt of India Scheme</span>
            <span style={S.badge("59,130,246")}>💰 Up to ₹20 Lakh</span>
            <span style={S.badge("168,85,247")}>📊 4 Loan Slabs</span>
          </div>
        </div>
        <div style={{ background: "rgba(245,158,11,0.1)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(245,158,11,0.2)", minWidth: "200px", textAlign: "center" }}>
          <div style={{ fontSize: "42px", fontWeight: 900, color: "#F59E0B" }}>₹20L</div>
          <div style={{ color: "#71717A", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Maximum Loan (Tarun Plus)</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "15px 0" }} />
          <div style={{ fontSize: "30px", fontWeight: 900, color: "#10B981" }}>0%</div>
          <div style={{ color: "#71717A", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Collateral Required</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "15px 0" }} />
          <a href="https://www.mudra.org.in" target="_blank" rel="noreferrer" style={{ ...S.link, justifyContent: "center", background: "#F59E0B", color: "#111", padding: "10px 18px", borderRadius: "8px", fontWeight: 700 }}>Official MUDRA Portal ↗</a>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "50px" }}>
        {[
          { label: "Total Disbursed (2024)", val: "₹5.45 Lakh Cr", color: "#F59E0B", icon: "💰" },
          { label: "Accounts Sanctioned", val: "47 Cr+", color: "#10B981", icon: "📊" },
          { label: "Lending Institutions", val: "27 Banks+", color: "#06B6D4", icon: "🏦" },
          { label: "Loan Categories", val: "4 Slabs", color: "#A78BFA", icon: "📋" },
          { label: "Repayment Tenure", val: "Up to 7 Yrs", color: "#3B82F6", icon: "📅" },
        ].map((stat, i) => (
          <div key={i} style={{ ...S.card, textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: stat.color }}>{stat.val}</div>
            <div style={{ fontSize: "11px", color: "#71717A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "4px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Loan Slab Comparison */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(245,158,11,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>📊</span> Loan Categories — Shishu, Kishore, Tarun & Tarun Plus</h2>
        <p style={{ color: "#71717A", marginBottom: "24px", lineHeight: 1.7 }}>PMMY categorizes loans based on the <strong style={{ color: "#FFF" }}>stage of business growth</strong> and funding requirements. Each category has different limits, interest rates, and documentation needs.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
          {SLABS.map((slab, i) => (
            <div key={i} style={{ ...S.card, borderTop: `4px solid rgb(${slab.color})`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -10, right: -10, fontSize: "60px", opacity: 0.06 }}>{slab.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "32px" }}>{slab.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, color: `rgb(${slab.color})`, fontSize: "20px" }}>{slab.name}</div>
                  <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px" }}>{slab.range}</div>
                </div>
              </div>
              <p style={{ color: "#A1A1AA", fontSize: "13px", lineHeight: 1.7, margin: "0 0 16px 0" }}>{slab.purpose}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Interest Rate", value: slab.interest },
                  { label: "Max Tenure", value: slab.tenure },
                  { label: "Collateral", value: slab.collateral },
                ].map((item, j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "rgba(0,0,0,0.25)", borderRadius: "8px" }}>
                    <span style={{ color: "#71717A", fontSize: "12px", fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: "#E4E4E7", fontSize: "12px", fontWeight: 700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "14px", padding: "10px 14px", background: `rgba(${slab.color},0.08)`, borderRadius: "8px", border: `1px solid rgba(${slab.color},0.15)` }}>
                <span style={{ color: `rgb(${slab.color})`, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Who is Eligible?</span>
                <p style={{ color: "#A1A1AA", fontSize: "12px", lineHeight: 1.6, margin: "6px 0 0 0" }}>{slab.eligibility}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documents */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(59,130,246,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>📄</span> Required Documents</h2>
        <p style={{ color: "#71717A", marginBottom: "24px", lineHeight: 1.7 }}>Prepare these documents <strong style={{ color: "#FFF" }}>before visiting your bank</strong>. Document requirements may vary slightly by lending institution. Each links to its official verification source.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" }}>
          {DOCS.map((doc, i) => (
            <div key={i} style={{ ...S.card, display: "flex", gap: "14px", alignItems: "flex-start", borderLeft: "3px solid rgba(245,158,11,0.4)" }}>
              <div style={{ fontSize: "28px", flexShrink: 0 }}>{doc.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "6px" }}>{doc.title}</div>
                <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6 }}>{doc.desc}</div>
                {doc.link !== "#" && (
                  <a href={doc.link} target="_blank" rel="noreferrer" style={{ ...S.link, fontSize: "12px", marginTop: "8px", display: "inline-flex" }} onMouseOver={e => e.currentTarget.style.opacity = 0.7} onMouseOut={e => e.currentTarget.style.opacity = 1}>
                    {"📎 " + doc.ref + " ↗"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Process Flowchart */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(16,185,129,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🔄</span> Application Process — Step by Step</h2>
        <div style={{ ...S.infoBox("6,182,212"), marginBottom: "24px" }}>
          <strong style={{ color: "#06B6D4" }}>💡 Tip:</strong> <span style={{ color: "#A1A1AA" }}>You can apply both <strong style={{ color: "#FFF" }}>online</strong> (via JanSamarth / Udyamimitra portal) and <strong style={{ color: "#FFF" }}>offline</strong> (by visiting any participating bank branch). Online applications for Shishu loans can be approved within 7–8 working days.</span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "36px", top: "20px", bottom: "20px", width: "2px", background: "linear-gradient(to bottom, #F59E0B, #10B981)", borderRadius: "2px", display: "block" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "16px" }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `rgba(${step.color},0.15)`, border: `2px solid rgba(${step.color},0.5)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 900, color: `rgb(${step.color})`, fontSize: "14px" }}>{step.num}</div>
                <div style={{ ...S.card, flex: 1, padding: "16px 20px" }}>
                  <div style={{ fontWeight: 700, color: "#FFF", fontSize: "15px", marginBottom: "6px" }}>{step.title}</div>
                  <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6 }}>{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Where to Apply */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🏦</span> Where to Apply — Lending Channels</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {[
            { icon: "🏛️", title: "Public Sector Banks", desc: "SBI, PNB, Bank of Baroda, Canara Bank, Union Bank, Bank of India, Indian Bank, and more.", color: "16,185,129" },
            { icon: "🏢", title: "Private Sector Banks", desc: "HDFC, ICICI, Axis, Kotak Mahindra, Yes Bank, IndusInd, IDFC First Bank, etc.", color: "59,130,246" },
            { icon: "🌾", title: "Regional Rural Banks (RRBs)", desc: "Local RRBs across all states provide MUDRA loans for grassroot-level businesses.", color: "245,158,11" },
            { icon: "💳", title: "Small Finance Banks", desc: "AU Small Finance, Equitas, Ujjivan, Jana, and other SFBs offering micro-credit.", color: "168,85,247" },
            { icon: "🤝", title: "Micro Finance Institutions", desc: "MFIs like Bandhan, Bharat Financial, SKS Microfinance approved by MUDRA.", color: "6,182,212" },
            { icon: "📱", title: "Online Portals", desc: "Apply via JanSamarth (jansamarth.in), Udyamimitra (udyamimitra.in), or PSB Loans in 59 Minutes.", color: "239,68,68" },
          ].map((ch, i) => (
            <div key={i} style={{ ...S.card, borderLeft: `3px solid rgb(${ch.color})` }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{ch.icon}</div>
              <div style={{ fontWeight: 700, color: "#FFF", fontSize: "15px", marginBottom: "8px" }}>{ch.title}</div>
              <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6 }}>{ch.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(245,158,11,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>📈</span> Visual Data & Analytics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>

          {/* Loan Slab Comparison Bar Chart */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#F59E0B", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📊 Maximum Loan Amount by Category (₹ Lakh)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={slabChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#71717A" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `₹${v}L`} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`₹${v} Lakh`]} />
                <Bar dataKey="maxLoan" fill="#F59E0B" radius={[5, 5, 0, 0]} name="Max Loan" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Annual Disbursement Trend Line Chart */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#10B981", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📈 Annual Disbursement Trend (₹ Crore)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={disbursementTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#71717A" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" />
                <YAxis stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`₹${v.toLocaleString("en-IN")} Cr`]} />
                <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Disbursed (Cr)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution Bar */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#A78BFA", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📉 Loan Distribution by Category (% of Amount)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryDistributionData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" stroke="#71717A" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`${v}%`]} />
                <Bar dataKey="percentage" fill="#A78BFA" radius={[0, 5, 5, 0]} name="% of Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sector-wise Distribution */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#06B6D4", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>🏭 Sector-wise Loan Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sectorWiseData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="sector" stroke="#71717A" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`${v}%`]} />
                <Bar dataKey="pct" fill="#06B6D4" radius={[5, 5, 0, 0]} name="Distribution %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Eligibility Checklist */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#06B6D4", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>✅ Eligibility Checklist</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { ok: true, item: "Indian citizen aged 18–65 years" },
                { ok: true, item: "Non-farm income-generating activity (manufacturing, trading, services)" },
                { ok: true, item: "Valid Aadhaar, PAN, and business registration" },
                { ok: true, item: "No default on any previous bank loans" },
                { ok: true, item: "Viable business plan with repayment capacity" },
                { ok: true, item: "Individual, proprietor, partnership, or private company" },
                { ok: false, item: "Direct agricultural farming activities (excluded)" },
                { ok: false, item: "Corporate entities with turnover above ₹5 Cr (not eligible)" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.ok ? "✅" : "❌"}</span>
                  <span style={{ color: item.ok ? "#E4E4E7" : "#71717A", fontSize: "13px", textDecoration: item.ok ? "none" : "line-through" }}>{item.item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MUDRA Card Info */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#F59E0B", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>💳 MUDRA Card (RuPay)</h3>
            <p style={{ color: "#A1A1AA", fontSize: "13px", lineHeight: 1.7, margin: "0 0 16px 0" }}>A MUDRA Card is a <strong style={{ color: "#FFF" }}>RuPay debit card</strong> issued to Shishu loan borrowers. It allows direct access to working capital for day-to-day business expenses.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                "Works like a regular debit card at POS & ATMs",
                "Pre-loaded working capital limit from your loan",
                "Track expenses digitally for better accounting",
                "Available at all major PSU and private banks",
                "No additional charges for card issuance",
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: "#F59E0B", fontSize: "14px" }}>▸</span>
                  <span style={{ color: "#E4E4E7", fontSize: "13px" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fee Structure */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(239,68,68,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>💳</span> Fee Structure & Interest Rates</h2>
        <div style={{ ...S.infoBox("245,158,11"), marginBottom: "20px" }}>
          <strong style={{ color: "#F59E0B" }}>ℹ️ Note:</strong> <span style={{ color: "#A1A1AA" }}>Interest rates under MUDRA are <strong style={{ color: "#FFF" }}>not fixed by the government</strong> — they vary by lending institution, borrower profile, CIBIL score, and loan category. Shishu loans typically have <strong style={{ color: "#FFF" }}>zero processing fees</strong>. Always compare rates across multiple banks before applying.</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "rgba(245,158,11,0.1)" }}>
                <th style={{ padding: "14px 18px", textAlign: "left", color: "#F59E0B", fontWeight: 700 }}>Loan Category</th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#F59E0B", fontWeight: 700 }}>Processing Fee</th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#10B981", fontWeight: 700 }}>Interest Rate (p.a.)</th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#3B82F6", fontWeight: 700 }}>Prepayment Penalty</th>
              </tr>
            </thead>
            <tbody>
              {FEES.map((fee, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "14px 18px", color: "#E4E4E7" }}>{fee.category}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center", color: "#A78BFA", fontWeight: 700 }}>{fee.processing}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center", color: "#10B981", fontWeight: 700 }}>{fee.interest}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center", color: "#3B82F6", fontWeight: 700 }}>{fee.prepayment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: "#71717A", fontSize: "12px", marginTop: "12px" }}>Source: <a href="https://www.mudra.org.in" target="_blank" rel="noreferrer" style={S.link}>MUDRA Official Portal ↗</a> | <a href="https://rbi.org.in" target="_blank" rel="noreferrer" style={S.link}>RBI Lending Rate Guidelines ↗</a></p>
      </div>

      {/* Approval Timeline */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>⏱️</span> Approval Timeline</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
          {TIMELINE.map((tl, i) => (
            <div key={i} style={{ ...S.card, textAlign: "center", borderTop: i >= TIMELINE.length - 2 ? "3px solid #10B981" : "3px solid rgba(245,158,11,0.3)" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{tl.icon}</div>
              <div style={{ fontWeight: 700, color: i >= TIMELINE.length - 2 ? "#10B981" : "#F59E0B", fontSize: "15px", marginBottom: "5px" }}>{tl.duration}</div>
              <div style={{ color: "#71717A", fontSize: "11px" }}>{tl.phase}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Reference Links */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(6,182,212,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🔗</span> Official Government Reference Links</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
          {[
            { label: "MUDRA Official Portal", url: "https://www.mudra.org.in", desc: "Official PMMY website with scheme details, FAQs, and downloads." },
            { label: "JanSamarth Portal", url: "https://www.jansamarth.in", desc: "Single-window online application platform for all government credit schemes." },
            { label: "Udyamimitra Portal", url: "https://www.udyamimitra.in", desc: "Online portal for handholding support to MSMEs applying for credit." },
            { label: "Udyam MSME Registration", url: "https://udyamregistration.gov.in", desc: "Free MSME registration — often required for MUDRA loan eligibility." },
            { label: "MSME Ministry", url: "https://msme.gov.in", desc: "Central ministry overseeing all MSME schemes and policies." },
            { label: "PSB Loans in 59 Minutes", url: "https://www.psbloansin59minutes.com", desc: "In-principle loan approval in under 59 minutes from PSU banks." },
            { label: "SIDBI (Parent Body)", url: "https://www.sidbi.in", desc: "Small Industries Development Bank — parent organization of MUDRA." },
            { label: "RBI Lending Norms", url: "https://www.rbi.org.in", desc: "Reserve Bank of India guidelines on lending rates and priority sector lending." },
          ].map((ref, i) => (
            <a key={i} href={ref.url} target="_blank" rel="noreferrer" style={{ ...S.card, textDecoration: "none", display: "flex", flexDirection: "column", gap: "6px", cursor: "pointer", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"} onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
              <div style={{ fontWeight: 700, color: "#F59E0B", fontSize: "13px", display: "flex", justifyContent: "space-between" }}>{ref.label}<span>↗</span></div>
              <div style={{ color: "#71717A", fontSize: "12px" }}>{ref.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ ...S.infoBox("16,185,129"), borderLeft: "5px solid #10B981" }}>
        <h2 style={{ ...S.h2, marginBottom: "20px" }}>🚀 What To Do Next</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {[
            { step: "1", action: "Check your eligibility — Indian citizen, non-farm business, age 18–65", link: "https://www.mudra.org.in", cta: "Check Eligibility →" },
            { step: "2", action: "Register on Udyam Portal for MSME certification", link: "https://udyamregistration.gov.in", cta: "Register Free →" },
            { step: "3", action: "Download MUDRA loan application form from official portal", link: "https://www.mudra.org.in", cta: "Download Form →" },
            { step: "4", action: "Visit nearest bank branch or apply online via JanSamarth", link: "https://www.jansamarth.in", cta: "Apply Online →" },
            { step: "5", action: "Compare interest rates across SBI, PNB, HDFC and other banks", link: "https://www.psbloansin59minutes.com", cta: "Compare Banks →" },
            { step: "6", action: "Explore CGTMSE and other MSME support schemes", link: "#related", cta: "View Related ↓" },
          ].map((ns, i) => (
            <a key={i} href={ns.link} target={ns.link.startsWith("http") ? "_blank" : "_self"} rel="noreferrer" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "10px", padding: "16px", textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(16,185,129,0.15)"} onMouseOut={e => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(16,185,129,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#10B981", fontWeight: 800, fontSize: "13px" }}>{ns.step}</div>
              <div style={{ color: "#E4E4E7", fontSize: "13px", lineHeight: 1.5 }}>{ns.action}</div>
              <div style={{ color: "#10B981", fontSize: "12px", fontWeight: 700 }}>{ns.cta}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Related Schemes */}
      <div id="related" style={{ ...S.section, marginTop: "50px" }}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🧩</span> Related MSME Schemes to Explore</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          {RELATED.map((r, i) => (
            <div key={i} style={{ ...S.card, display: "flex", gap: "14px", alignItems: "flex-start", cursor: r.onClick ? "pointer" : "default" }} onClick={r.onClick || undefined}>
              <span style={{ fontSize: "28px" }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "5px" }}>{r.name}</div>
                <div style={{ color: "#71717A", fontSize: "12px", lineHeight: 1.6, marginBottom: "10px" }}>{r.desc}</div>
                {r.onClick ? (
                  <button onClick={r.onClick} style={{ ...S.link, fontSize: "12px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>View Full Guide ↗</button>
                ) : (
                  <a href={r.link} target="_blank" rel="noreferrer" style={{ ...S.link, fontSize: "12px" }}>Learn More ↗</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function PMEGPDetailPage({ setActiveTab }) {
  const S = {
    section: { marginBottom: "50px" },
    h2: { fontSize: "26px", fontWeight: 800, color: "#FFF", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "12px" },
    badge: (color) => ({ display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, background: `rgba(${color},0.15)`, border: `1px solid rgba(${color},0.3)`, color: `rgb(${color})` }),
    card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "22px 26px" },
    infoBox: (c) => ({ background: `rgba(${c},0.07)`, border: `1px solid rgba(${c},0.2)`, borderRadius: "12px", padding: "18px 22px" }),
    link: { color: "#22C55E", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", transition: "opacity 0.2s" },
  };

  /* ── Subsidy Slab Data ── */
  const SUBSIDY_SLABS = [
    { category: "General Category", location: "Urban", subsidy: "15%", ownContrib: "10%", bankFinance: "75%", color: "59,130,246" },
    { category: "General Category", location: "Rural", subsidy: "25%", ownContrib: "10%", bankFinance: "65%", color: "6,182,212" },
    { category: "Special Category*", location: "Urban", subsidy: "25%", ownContrib: "5%", bankFinance: "70%", color: "168,85,247" },
    { category: "Special Category*", location: "Rural", subsidy: "35%", ownContrib: "5%", bankFinance: "60%", color: "16,185,129" },
  ];

  /* ── Required Documents ── */
  const DOCS = [
    { icon: "🪪", title: "Aadhaar Card & PAN Card", desc: "Self-attested copies of Aadhaar and PAN. Aadhaar is mandatory for online registration and verification.", link: "https://uidai.gov.in", ref: "UIDAI (Aadhaar)" },
    { icon: "📸", title: "Passport-Size Photographs", desc: "Two recent passport-sized colour photographs of the applicant.", link: "#", ref: "Standard Requirement" },
    { icon: "🎓", title: "Educational Qualification Certificate", desc: "Minimum 8th pass for projects above ₹10L (manufacturing) or ₹5L (service). No requirement below these limits.", link: "#", ref: "As Per Guidelines" },
    { icon: "📋", title: "Detailed Project Report (DPR)", desc: "A comprehensive business plan covering project cost breakdown, machinery, raw material, income projections, and repayment capacity.", link: "https://www.kviconline.gov.in", ref: "KVIC Portal" },
    { icon: "📊", title: "Caste / Community Certificate", desc: "For SC/ST/OBC/Minority applicants to avail higher subsidy rates under special category benefits.", link: "https://services.india.gov.in", ref: "National Services Portal" },
    { icon: "🏠", title: "Address Proof", desc: "Ration Card, Voter ID, Electricity Bill, or any valid government-issued address document.", link: "#", ref: "Standard Requirement" },
    { icon: "🏪", title: "Premises Proof (Rent/Ownership)", desc: "Rent agreement, lease deed, or ownership document for the proposed business premises.", link: "#", ref: "Bank Requirement" },
    { icon: "⚙️", title: "Machinery & Equipment Quotations", desc: "Supplier quotations or proforma invoices for all machinery and equipment included in the project cost.", link: "https://makeinindia.com", ref: "Make in India" },
    { icon: "🏦", title: "Bank Account Details", desc: "Cancelled cheque or bank passbook copy for the bank account where the loan will be credited.", link: "#", ref: "Bank Requirement" },
    { icon: "🌐", title: "Udyam Registration Certificate", desc: "Mandatory MSME registration must be completed before loan approval. Free of cost on the Udyam portal.", link: "https://udyamregistration.gov.in", ref: "Udyam Registration" },
    { icon: "🏘️", title: "Rural Area Certificate (if applicable)", desc: "Certificate from local authority confirming the project is located in a rural area for higher subsidy eligibility.", link: "#", ref: "Local Authority" },
    { icon: "📜", title: "EDP Training Certificate (if completed)", desc: "Certificate from Entrepreneurship Development Programme. EDP training is mandatory and arranged post-approval.", link: "https://www.kviconline.gov.in", ref: "KVIC EDP" },
  ];

  /* ── Application Process Steps ── */
  const STEPS = [
    { num: "01", title: "Visit the PMEGP e-Portal", detail: "Go to the official KVIC PMEGP e-Portal at kviconline.gov.in and click on 'Online Application Form for Individual' or 'Non-Individual'.", color: "22,163,74" },
    { num: "02", title: "Register with Aadhaar Verification", detail: "Validate your Aadhaar details online. A User ID and Password will be sent via SMS to your registered mobile number for login.", color: "59,130,246" },
    { num: "03", title: "Fill the Online Application Form", detail: "Enter personal details, business/project information, preferred loan category (manufacturing/service), and choose your financing bank branch.", color: "6,182,212" },
    { num: "04", title: "Upload Required Documents", detail: "Upload scanned copies of Aadhaar, PAN, photos, educational certificates, DPR, caste certificate (if applicable), and quotations.", color: "16,185,129" },
    { num: "05", title: "Submit & Get Application ID", detail: "Review all details carefully and submit. An Application ID is generated for tracking. The application is forwarded to KVIC/KVIB/DIC.", color: "245,158,11" },
    { num: "06", title: "DLTFC Interview & Scrutiny", detail: "The District Level Task Force Committee (DLTFC) shortlists and interviews applicants. Your project viability is assessed.", color: "168,85,247" },
    { num: "07", title: "DIC/KVIB Verification & Forwarding", detail: "The DIC or KVIC/KVIB office verifies application details and forwards the approved application to your chosen bank branch.", color: "239,68,68" },
    { num: "08", title: "Bank Loan Sanction", detail: "The bank processes, appraises, and sanctions the loan. The margin money subsidy request is initiated by the bank.", color: "59,130,246" },
    { num: "09", title: "Complete EDP Training", detail: "Attend the mandatory Entrepreneurship Development Programme (EDP) training for 10-15 days, arranged by KVIC/KVIB/DIC after preliminary approval.", color: "22,163,74" },
    { num: "10", title: "Subsidy Release & Disbursement", detail: "The government margin money subsidy is deposited in a TDR (Term Deposit Receipt) linked to your loan for 3 years lock-in. Loan amount is disbursed to your account.", color: "245,158,11" },
  ];

  /* ── Approval Timeline ── */
  const TIMELINE = [
    { phase: "Online Application", duration: "1–2 Days", icon: "📋" },
    { phase: "DLTFC Review", duration: "15–30 Days", icon: "🔍" },
    { phase: "DIC/KVIB Verification", duration: "7–15 Days", icon: "🏛️" },
    { phase: "Bank Appraisal", duration: "15–30 Days", icon: "🏦" },
    { phase: "Loan Sanction", duration: "7–14 Days", icon: "✅" },
    { phase: "EDP Training", duration: "10–15 Days", icon: "🎓" },
    { phase: "Subsidy Release", duration: "15–30 Days", icon: "💰" },
    { phase: "Total End-to-End", duration: "2–5 Months", icon: "🏁" },
  ];

  /* ── Chart Data ── */
  const subsidyChartData = [
    { name: "Gen Urban", subsidy: 15, own: 10, bank: 75 },
    { name: "Gen Rural", subsidy: 25, own: 10, bank: 65 },
    { name: "Special Urban", subsidy: 25, own: 5, bank: 70 },
    { name: "Special Rural", subsidy: 35, own: 5, bank: 60 },
  ];

  const yearlyData = [
    { year: "2015-16", units: 40828, margin: 1437 },
    { year: "2016-17", units: 44754, margin: 1638 },
    { year: "2017-18", units: 52214, margin: 1894 },
    { year: "2018-19", units: 73427, margin: 2510 },
    { year: "2019-20", units: 67536, margin: 2350 },
    { year: "2020-21", units: 75109, margin: 2588 },
    { year: "2021-22", units: 79265, margin: 2790 },
    { year: "2022-23", units: 96291, margin: 3498 },
    { year: "2023-24", units: 102500, margin: 3850 },
    { year: "2024-25", units: 110000, margin: 4200 },
  ];

  const sectorData = [
    { sector: "Food Processing", pct: 22 },
    { sector: "Textile & Garments", pct: 15 },
    { sector: "Mineral Based", pct: 12 },
    { sector: "Agro Based", pct: 11 },
    { sector: "Service & Trading", pct: 18 },
    { sector: "Engineering", pct: 10 },
    { sector: "Others", pct: 12 },
  ];

  const projectCostData = [
    { name: "Manufacturing", maxCost: 50 },
    { name: "Service/Business", maxCost: 20 },
    { name: "Mfg Upgradation", maxCost: 100 },
    { name: "Svc Upgradation", maxCost: 25 },
  ];

  /* ── Related Schemes ── */
  const RELATED = [
    { icon: "🏦", name: "CGTMSE Scheme", desc: "Collateral-free credit guarantee up to ₹5 Crore for micro & small enterprises.", link: "#", onClick: () => setActiveTab("cgtmse") },
    { icon: "🪙", name: "PMMY / MUDRA Loan", desc: "Micro loans up to ₹20L without collateral via Pradhan Mantri Mudra Yojana.", link: "#", onClick: () => setActiveTab("pmmy") },
    { icon: "👩‍💼", name: "Stand-Up India", desc: "₹10L to ₹1Cr loans for SC/ST/Women led greenfield enterprises.", link: "https://www.standupmitra.in" },
    { icon: "📜", name: "TReDS Platform", desc: "Quick vendor discounting of MSME receivables from large corporate buyers.", link: "https://m1xchange.com" },
    { icon: "🏛️", name: "SIDBI MSME Loans", desc: "Direct loan facility from SIDBI for MSMEs at competitive interest rates.", link: "https://www.sidbi.in" },
    { icon: "🌐", name: "Udyam Registration", desc: "Free MSME registration required for all government scheme eligibility.", link: "https://udyamregistration.gov.in" },
  ];

  return (
    <div className="content-area glass-panel custom-scrollbar fade-in-up" style={{ borderRadius: "20px", padding: "clamp(20px, 4vw, 45px)" }}>

      {/* Back Button */}
      <button onClick={() => setActiveTab("schemes")} style={{ marginBottom: "30px", padding: "10px 18px", background: "rgba(255,255,255,0.05)", color: "#E4E4E7", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: 600, transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
        ← Back to Schemes
      </button>

      {/* Hero Banner */}
      <div style={{ ...S.infoBox("22,163,74"), marginBottom: "40px", display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start", borderLeft: "5px solid #16A34A" }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "40px" }}>🏭</span>
            <div>
              <h1 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, color: "#FFF", margin: 0, letterSpacing: "-0.5px" }}>PMEGP Scheme</h1>
              <p style={{ color: "#71717A", margin: "4px 0 0 0", fontSize: "14px" }}>Prime Minister's Employment Generation Programme</p>
            </div>
          </div>
          <p style={{ color: "#A1A1AA", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>
            A flagship <strong style={{ color: "#FFF" }}>credit-linked subsidy scheme</strong> by the Ministry of MSME, Government of India, aimed at <strong style={{ color: "#22C55E" }}>generating employment</strong> through new micro-enterprises in non-farm sectors. Administered by <strong style={{ color: "#FFF" }}>KVIC</strong> (Khadi & Village Industries Commission) at the national level and through <strong style={{ color: "#FFF" }}>KVIBs</strong> and <strong style={{ color: "#FFF" }}>DICs</strong> at the state level. Approved for continuation from 2021-22 to 2025-26.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
            <span style={S.badge("22,163,74")}>✅ Govt Subsidy</span>
            <span style={S.badge("59,130,246")}>🏛️ KVIC Administered</span>
            <span style={S.badge("245,158,11")}>💰 Up to 35% Subsidy</span>
            <span style={S.badge("168,85,247")}>🏭 Mfg: ₹50L | Svc: ₹20L</span>
          </div>
        </div>
        <div style={{ background: "rgba(22,163,74,0.1)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(22,163,74,0.2)", minWidth: "200px", textAlign: "center" }}>
          <div style={{ fontSize: "42px", fontWeight: 900, color: "#22C55E" }}>35%</div>
          <div style={{ color: "#71717A", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Max Subsidy (Special Rural)</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "15px 0" }} />
          <div style={{ fontSize: "30px", fontWeight: 900, color: "#F59E0B" }}>₹50L</div>
          <div style={{ color: "#71717A", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Max Project (Manufacturing)</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "15px 0" }} />
          <a href="https://www.kviconline.gov.in" target="_blank" rel="noreferrer" style={{ ...S.link, justifyContent: "center", background: "#16A34A", color: "#FFF", padding: "10px 18px", borderRadius: "8px", fontWeight: 700 }}>KVIC Official Portal ↗</a>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "50px" }}>
        {[
          { label: "Units Assisted (2024)", val: "1.1 Lakh+", color: "#22C55E", icon: "🏭" },
          { label: "Employment Generated", val: "8 Per Unit", color: "#06B6D4", icon: "👷" },
          { label: "Mfg. Project Limit", val: "₹50 Lakh", color: "#F59E0B", icon: "⚙️" },
          { label: "Service Project Limit", val: "₹20 Lakh", color: "#3B82F6", icon: "🛎️" },
          { label: "Subsidy Lock-in", val: "3 Years", color: "#A78BFA", icon: "🔒" },
        ].map((stat, i) => (
          <div key={i} style={{ ...S.card, textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: stat.color }}>{stat.val}</div>
            <div style={{ fontSize: "11px", color: "#71717A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "4px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Subsidy Structure */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(22,163,74,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>💰</span> Subsidy Structure — Margin Money</h2>
        <p style={{ color: "#71717A", marginBottom: "16px", lineHeight: 1.7 }}>PMEGP provides a <strong style={{ color: "#FFF" }}>margin money subsidy</strong> that directly reduces your loan repayment burden. The subsidy percentage depends on your <strong style={{ color: "#22C55E" }}>category</strong> and whether the project is in an <strong style={{ color: "#22C55E" }}>urban or rural</strong> area.</p>
        <div style={{ ...S.infoBox("168,85,247"), marginBottom: "24px" }}>
          <strong style={{ color: "#A78BFA" }}>* Special Categories:</strong> <span style={{ color: "#A1A1AA" }}>SC, ST, OBC, Minorities, Women, Ex-Servicemen, Differently-abled, Transgender, NER/Hill/Border/Aspirational District applicants.</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "rgba(22,163,74,0.1)" }}>
                <th style={{ padding: "14px 18px", textAlign: "left", color: "#22C55E", fontWeight: 700 }}>Beneficiary Category</th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#22C55E", fontWeight: 700 }}>Area</th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#F59E0B", fontWeight: 700 }}>Govt Subsidy</th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#3B82F6", fontWeight: 700 }}>Own Contribution</th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#A78BFA", fontWeight: 700 }}>Bank Finance</th>
              </tr>
            </thead>
            <tbody>
              {SUBSIDY_SLABS.map((slab, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "14px 18px", color: "#E4E4E7", fontWeight: 600 }}>{slab.category}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center", color: `rgb(${slab.color})`, fontWeight: 700 }}>{slab.location}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center", color: "#F59E0B", fontWeight: 800, fontSize: "16px" }}>{slab.subsidy}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center", color: "#3B82F6", fontWeight: 700 }}>{slab.ownContrib}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center", color: "#A78BFA", fontWeight: 700 }}>{slab.bankFinance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: "#71717A", fontSize: "12px", marginTop: "12px" }}>Source: <a href="https://www.kviconline.gov.in" target="_blank" rel="noreferrer" style={S.link}>KVIC Official Guidelines ↗</a> | <a href="https://msme.gov.in" target="_blank" rel="noreferrer" style={S.link}>Ministry of MSME ↗</a></p>

        {/* Project Cost Limits Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "24px" }}>
          {[
            { type: "Manufacturing Unit", limit: "₹50 Lakh", icon: "⚙️", color: "245,158,11", desc: "Setting up new manufacturing micro-enterprises including food processing, textiles, engineering products, etc." },
            { type: "Service / Business Unit", limit: "₹20 Lakh", icon: "🛎️", color: "59,130,246", desc: "Service-based enterprises including salon, repair shops, consultancy, healthcare services, IT services, etc." },
            { type: "Upgradation (Mfg)", limit: "₹1 Crore", icon: "📈", color: "168,85,247", desc: "Existing PMEGP units expanding/modernizing. Subsidy: 15% (General) / 20% (Special). Own contribution: 10%." },
            { type: "Upgradation (Service)", limit: "₹25 Lakh", icon: "🔄", color: "22,163,74", desc: "Existing service units under PMEGP eligible for second loan for expansion or technology upgradation." },
          ].map((item, i) => (
            <div key={i} style={{ ...S.card, borderLeft: `3px solid rgb(${item.color})` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "28px" }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: `rgb(${item.color})`, fontSize: "14px" }}>{item.type}</div>
                  <div style={{ fontWeight: 800, color: "#FFF", fontSize: "20px" }}>{item.limit}</div>
                </div>
              </div>
              <p style={{ color: "#71717A", fontSize: "12px", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documents */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(59,130,246,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>📄</span> Required Documents</h2>
        <p style={{ color: "#71717A", marginBottom: "24px", lineHeight: 1.7 }}>Prepare these documents <strong style={{ color: "#FFF" }}>before applying online</strong>. Exact requirements may vary by implementing agency (KVIC, KVIB, or DIC). Each links to its official source.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" }}>
          {DOCS.map((doc, i) => (
            <div key={i} style={{ ...S.card, display: "flex", gap: "14px", alignItems: "flex-start", borderLeft: "3px solid rgba(22,163,74,0.4)" }}>
              <div style={{ fontSize: "28px", flexShrink: 0 }}>{doc.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "6px" }}>{doc.title}</div>
                <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6 }}>{doc.desc}</div>
                {doc.link !== "#" && (
                  <a href={doc.link} target="_blank" rel="noreferrer" style={{ ...S.link, fontSize: "12px", marginTop: "8px", display: "inline-flex" }} onMouseOver={e => e.currentTarget.style.opacity = 0.7} onMouseOut={e => e.currentTarget.style.opacity = 1}>
                    {"📎 " + doc.ref + " ↗"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Process */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(16,185,129,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🔄</span> Application Process — Step by Step</h2>
        <div style={{ ...S.infoBox("6,182,212"), marginBottom: "24px" }}>
          <strong style={{ color: "#06B6D4" }}>💡 Important:</strong> <span style={{ color: "#A1A1AA" }}>PMEGP applications are submitted <strong style={{ color: "#FFF" }}>online only</strong> through the KVIC PMEGP e-Portal. After online submission, the process involves DLTFC interview, DIC/KVIB verification, bank appraisal, and mandatory <strong style={{ color: "#FFF" }}>EDP training</strong> (10-15 days). The margin money is held in a <strong style={{ color: "#FFF" }}>3-year lock-in TDR</strong>.</span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "36px", top: "20px", bottom: "20px", width: "2px", background: "linear-gradient(to bottom, #16A34A, #06B6D4)", borderRadius: "2px", display: "block" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "16px" }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `rgba(${step.color},0.15)`, border: `2px solid rgba(${step.color},0.5)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 900, color: `rgb(${step.color})`, fontSize: "14px" }}>{step.num}</div>
                <div style={{ ...S.card, flex: 1, padding: "16px 20px" }}>
                  <div style={{ fontWeight: 700, color: "#FFF", fontSize: "15px", marginBottom: "6px" }}>{step.title}</div>
                  <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6 }}>{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Where to Apply */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🏛️</span> Implementing Agencies — Where to Apply</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {[
            { icon: "🇮🇳", title: "KVIC (National Nodal Agency)", desc: "Khadi and Village Industries Commission — central implementing body coordinating PMEGP nationwide.", color: "22,163,74", link: "https://www.kviconline.gov.in" },
            { icon: "🏢", title: "State KVIC Directorates", desc: "State-level KVIC offices manage district-level coordination and beneficiary selection.", color: "59,130,246" },
            { icon: "🏘️", title: "State KVIBs", desc: "State Khadi and Village Industries Boards implement the scheme at the state/district level.", color: "245,158,11" },
            { icon: "🏦", title: "District Industries Centres (DICs)", desc: "DICs handle implementation at the district level, especially for urban area projects.", color: "168,85,247" },
            { icon: "🏧", title: "Participating Banks", desc: "27+ nationalized banks, private banks, RRBs, and cooperative banks disburse PMEGP loans.", color: "6,182,212" },
            { icon: "📱", title: "PMEGP e-Portal (Online)", desc: "All applications submitted online through KVIC's PMEGP e-Portal. Track status in real-time.", color: "239,68,68", link: "https://www.kviconline.gov.in/pmegpeportal/" },
          ].map((ch, i) => (
            <div key={i} style={{ ...S.card, borderLeft: `3px solid rgb(${ch.color})` }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{ch.icon}</div>
              <div style={{ fontWeight: 700, color: "#FFF", fontSize: "15px", marginBottom: "8px" }}>{ch.title}</div>
              <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6, marginBottom: ch.link ? "10px" : 0 }}>{ch.desc}</div>
              {ch.link && <a href={ch.link} target="_blank" rel="noreferrer" style={{ ...S.link, fontSize: "12px" }}>Visit Portal ↗</a>}
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(245,158,11,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>📈</span> Visual Data & Analytics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>

          {/* Subsidy Breakdown Bar Chart */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#22C55E", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📊 Subsidy % Breakdown by Category & Area</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={subsidyChartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#71717A" tick={{ fontSize: 10 }} />
                <YAxis stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`${v}%`]} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="subsidy" fill="#22C55E" radius={[3, 3, 0, 0]} name="Govt Subsidy" stackId="a" />
                <Bar dataKey="own" fill="#3B82F6" radius={[0, 0, 0, 0]} name="Own Contribution" stackId="a" />
                <Bar dataKey="bank" fill="#A78BFA" radius={[3, 3, 0, 0]} name="Bank Finance" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly Units Trend */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#10B981", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📈 Units Assisted Per Year (Growth Trend)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={yearlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#71717A" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" />
                <YAxis stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [v.toLocaleString("en-IN")]} />
                <Line type="monotone" dataKey="units" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Units Assisted" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Distribution */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#F59E0B", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>🏭 Sector-wise Project Distribution (%)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="sector" stroke="#71717A" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`${v}%`]} />
                <Bar dataKey="pct" fill="#F59E0B" radius={[0, 5, 5, 0]} name="Share %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Project Cost Limits */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#3B82F6", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📊 Max Project Cost Limits (₹ Lakh)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={projectCostData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#71717A" tick={{ fontSize: 10 }} />
                <YAxis stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `₹${v}L`} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`₹${v} Lakh`]} />
                <Bar dataKey="maxCost" fill="#3B82F6" radius={[5, 5, 0, 0]} name="Max Project Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Eligibility Checklist */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#06B6D4", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>✅ Eligibility Checklist</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { ok: true, item: "Indian citizen aged 18 years or above" },
                { ok: true, item: "8th pass for projects >₹10L (mfg) or >₹5L (service)" },
                { ok: true, item: "New project only — no existing govt subsidy beneficiaries" },
                { ok: true, item: "One person per family (self + spouse) is eligible" },
                { ok: true, item: "No income ceiling — open to all income groups" },
                { ok: true, item: "SHGs, Trusts, Societies, Co-operatives also eligible" },
                { ok: false, item: "Existing units or units under other govt subsidy (excluded)" },
                { ok: false, item: "Pure trading activities without capital setup (not eligible)" },
                { ok: false, item: "Cost of land cannot be included in project cost" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.ok ? "✅" : "❌"}</span>
                  <span style={{ color: item.ok ? "#E4E4E7" : "#71717A", fontSize: "13px", textDecoration: item.ok ? "none" : "line-through" }}>{item.item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* EDP Training Info */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#22C55E", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>🎓 EDP Training & Lock-in</h3>
            <p style={{ color: "#A1A1AA", fontSize: "13px", lineHeight: 1.7, margin: "0 0 16px 0" }}>Every PMEGP beneficiary must complete a mandatory <strong style={{ color: "#FFF" }}>Entrepreneurship Development Programme (EDP)</strong> training arranged by KVIC/KVIB/DIC after preliminary approval.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                "EDP training duration: 10–15 days (residential or non-residential)",
                "Training cost borne by the government (free for beneficiary)",
                "Covers: business planning, accounts, marketing, compliance",
                "Margin money subsidy held in TDR for 3 years lock-in",
                "After 3 years, TDR subsidy adjusted against outstanding loan",
                "If unit fails within lock-in, subsidy may be recoverable",
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: "#22C55E", fontSize: "14px" }}>▸</span>
                  <span style={{ color: "#E4E4E7", fontSize: "13px" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Approval Timeline */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>⏱️</span> Approval Timeline</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
          {TIMELINE.map((tl, i) => (
            <div key={i} style={{ ...S.card, textAlign: "center", borderTop: i === TIMELINE.length - 1 ? "3px solid #10B981" : "3px solid rgba(22,163,74,0.3)" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{tl.icon}</div>
              <div style={{ fontWeight: 700, color: i === TIMELINE.length - 1 ? "#10B981" : "#F59E0B", fontSize: "15px", marginBottom: "5px" }}>{tl.duration}</div>
              <div style={{ color: "#71717A", fontSize: "11px" }}>{tl.phase}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Reference Links */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(6,182,212,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🔗</span> Official Government Reference Links</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
          {[
            { label: "KVIC PMEGP e-Portal", url: "https://www.kviconline.gov.in/pmegpeportal/", desc: "Official online application portal for PMEGP. Apply, track status, and download forms." },
            { label: "KVIC Official Website", url: "https://www.kviconline.gov.in", desc: "Khadi & Village Industries Commission — national nodal agency for PMEGP." },
            { label: "Ministry of MSME", url: "https://msme.gov.in", desc: "Central ministry overseeing PMEGP and all MSME schemes and policies." },
            { label: "MyScheme.gov.in", url: "https://www.myscheme.gov.in", desc: "Government portal for all central schemes including PMEGP eligibility checker." },
            { label: "JanSamarth Portal", url: "https://www.jansamarth.in", desc: "Single-window online platform for all government credit-linked subsidy schemes." },
            { label: "Udyam MSME Registration", url: "https://udyamregistration.gov.in", desc: "Mandatory MSME registration before PMEGP loan approval. Free of cost." },
            { label: "SIDBI (Refinance)", url: "https://www.sidbi.in", desc: "Small Industries Development Bank provides refinance facility to PMEGP lending banks." },
            { label: "PMEGP Guidelines PDF", url: "https://msme.gov.in/sites/default/files/PMEGP-guideline.pdf", desc: "Official PMEGP scheme guidelines document from Ministry of MSME." },
          ].map((ref, i) => (
            <a key={i} href={ref.url} target="_blank" rel="noreferrer" style={{ ...S.card, textDecoration: "none", display: "flex", flexDirection: "column", gap: "6px", cursor: "pointer", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = "rgba(22,163,74,0.3)"} onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
              <div style={{ fontWeight: 700, color: "#22C55E", fontSize: "13px", display: "flex", justifyContent: "space-between" }}>{ref.label}<span>↗</span></div>
              <div style={{ color: "#71717A", fontSize: "12px" }}>{ref.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ ...S.infoBox("16,185,129"), borderLeft: "5px solid #10B981" }}>
        <h2 style={{ ...S.h2, marginBottom: "20px" }}>🚀 What To Do Next</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {[
            { step: "1", action: "Check eligibility — age 18+, 8th pass for larger projects, new enterprise only", link: "https://www.myscheme.gov.in", cta: "Check Eligibility →" },
            { step: "2", action: "Complete Udyam Registration (mandatory before loan approval)", link: "https://udyamregistration.gov.in", cta: "Register Free →" },
            { step: "3", action: "Prepare your Detailed Project Report (DPR) with cost breakdown", link: "https://www.kviconline.gov.in", cta: "DPR Templates →" },
            { step: "4", action: "Apply online through the KVIC PMEGP e-Portal", link: "https://www.kviconline.gov.in/pmegpeportal/", cta: "Apply Now →" },
            { step: "5", action: "Track your application status using your Application ID", link: "https://www.kviconline.gov.in/pmegpeportal/", cta: "Track Status →" },
            { step: "6", action: "Explore CGTMSE, MUDRA, and other MSME support schemes", link: "#related", cta: "View Related ↓" },
          ].map((ns, i) => (
            <a key={i} href={ns.link} target={ns.link.startsWith("http") ? "_blank" : "_self"} rel="noreferrer" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "10px", padding: "16px", textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(16,185,129,0.15)"} onMouseOut={e => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(16,185,129,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#10B981", fontWeight: 800, fontSize: "13px" }}>{ns.step}</div>
              <div style={{ color: "#E4E4E7", fontSize: "13px", lineHeight: 1.5 }}>{ns.action}</div>
              <div style={{ color: "#10B981", fontSize: "12px", fontWeight: 700 }}>{ns.cta}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Related Schemes */}
      <div id="related" style={{ ...S.section, marginTop: "50px" }}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🧩</span> Related MSME Schemes to Explore</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          {RELATED.map((r, i) => (
            <div key={i} style={{ ...S.card, display: "flex", gap: "14px", alignItems: "flex-start", cursor: r.onClick ? "pointer" : "default" }} onClick={r.onClick || undefined}>
              <span style={{ fontSize: "28px" }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "5px" }}>{r.name}</div>
                <div style={{ color: "#71717A", fontSize: "12px", lineHeight: 1.6, marginBottom: "10px" }}>{r.desc}</div>
                {r.onClick ? (
                  <button onClick={r.onClick} style={{ ...S.link, fontSize: "12px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>View Full Guide ↗</button>
                ) : (
                  <a href={r.link} target="_blank" rel="noreferrer" style={{ ...S.link, fontSize: "12px" }}>Learn More ↗</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function PLIDetailPage({ setActiveTab }) {
  const S = {
    section: { marginBottom: "50px" },
    h2: { fontSize: "26px", fontWeight: 800, color: "#FFF", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "12px" },
    badge: (color) => ({ display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, background: `rgba(${color},0.15)`, border: `1px solid rgba(${color},0.3)`, color: `rgb(${color})` }),
    card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "22px 26px" },
    infoBox: (c) => ({ background: `rgba(${c},0.07)`, border: `1px solid rgba(${c},0.2)`, borderRadius: "12px", padding: "18px 22px" }),
    link: { color: "#F59E0B", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", transition: "opacity 0.2s" },
  };

  /* ── 14 PLI Sectors ── */
  const SECTORS = [
    { name: "Mobile & Electronics", ministry: "MeitY", outlay: "₹40,951 Cr", incentive: "4%–6%", icon: "📱", color: "59,130,246" },
    { name: "Pharma & Bulk Drugs", ministry: "DoP", outlay: "₹15,000 Cr", incentive: "3%–10%", icon: "💊", color: "16,185,129" },
    { name: "Medical Devices", ministry: "DoP", outlay: "₹3,420 Cr", incentive: "5%–8%", icon: "🩺", color: "6,182,212" },
    { name: "Auto & Auto Components", ministry: "DHI", outlay: "₹25,938 Cr", incentive: "4%–7%", icon: "🚗", color: "245,158,11" },
    { name: "IT Hardware", ministry: "MeitY", outlay: "₹17,000 Cr", incentive: "4%–5%", icon: "💻", color: "168,85,247" },
    { name: "Telecom & Networking", ministry: "DoT", outlay: "₹12,195 Cr", incentive: "4%–7%", icon: "📡", color: "239,68,68" },
    { name: "Textile Products", ministry: "MoT", outlay: "₹10,683 Cr", incentive: "3%–11%", icon: "🧵", color: "236,72,153" },
    { name: "Food Processing", ministry: "MoFPI", outlay: "₹10,900 Cr", incentive: "4%–10%", icon: "🍲", color: "34,197,94" },
    { name: "White Goods (AC/LED)", ministry: "DPIIT", outlay: "₹6,238 Cr", incentive: "4%–6%", icon: "❄️", color: "96,165,250" },
    { name: "Specialty Steel", ministry: "MoS", outlay: "₹6,322 Cr", incentive: "4%–12%", icon: "🔩", color: "148,163,184" },
    { name: "ACC Battery Storage", ministry: "DHI", outlay: "₹18,100 Cr", incentive: "Subsidy-based", icon: "🔋", color: "74,222,128" },
    { name: "Solar PV Modules", ministry: "MNRE", outlay: "₹24,000 Cr", incentive: "Subsidy-based", icon: "☀️", color: "250,204,21" },
    { name: "Drones & Components", ministry: "MoCA", outlay: "₹120 Cr", incentive: "20%", icon: "🛸", color: "129,140,248" },
    { name: "Advanced Chemistry Cell", ministry: "DHI", outlay: "₹18,100 Cr", incentive: "Capacity-linked", icon: "⚗️", color: "45,212,191" },
  ];

  /* ── Required Documents ── */
  const DOCS = [
    { icon: "🏢", title: "Certificate of Incorporation", desc: "Proof that the company is registered in India under the Companies Act, 2013 or LLP Act, 2008.", link: "https://www.mca.gov.in", ref: "MCA Portal" },
    { icon: "📋", title: "PAN & GST Registration", desc: "Valid PAN card of the company and active GST registration certificate (GSTIN) for manufacturing operations.", link: "https://www.gst.gov.in", ref: "GST Portal" },
    { icon: "📊", title: "Audited Financial Statements", desc: "Last 3 years audited P&L and Balance Sheet showing global/domestic revenue meeting sector-specific thresholds.", link: "#", ref: "CA Certified" },
    { icon: "📝", title: "Business Plan & Investment Proposal", desc: "Detailed plan showing projected incremental investment in plant, machinery, R&D, and manufacturing capacity.", link: "#", ref: "Company Format" },
    { icon: "🏭", title: "Manufacturing Licence / IEM", desc: "Industrial Entrepreneur Memorandum (IEM) or relevant manufacturing licence for the product category.", link: "https://dpiit.gov.in", ref: "DPIIT Portal" },
    { icon: "📄", title: "Memorandum & Articles of Association", desc: "MOA/AOA showing the manufacturing activity as part of the company's authorized business objects.", link: "https://www.mca.gov.in", ref: "MCA Portal" },
    { icon: "🔧", title: "Production & Capacity Details", desc: "Current installed capacity, product mix, production volumes from base year (FY 2019-20), and expansion plans.", link: "#", ref: "Self-Declaration" },
    { icon: "🌐", title: "Udyam / MSME Registration (if applicable)", desc: "For MSME applicants — valid Udyam registration certificate. Free registration on official portal.", link: "https://udyamregistration.gov.in", ref: "Udyam Portal" },
    { icon: "📈", title: "Incremental Sales Projection", desc: "Year-wise projected sales growth over base year (FY 2019-20) to demonstrate eligibility for incentive claims.", link: "#", ref: "Company Format" },
    { icon: "✅", title: "Board Resolution", desc: "Company board resolution authorizing the application under the specific PLI sector scheme.", link: "#", ref: "Company Board" },
    { icon: "🏦", title: "Bank Account & IFSC Details", desc: "Company current account details for incentive disbursement. Must be a scheduled commercial bank.", link: "#", ref: "Bank Requirement" },
    { icon: "📜", title: "Sector-Specific Compliance Certificates", desc: "BIS certification, pollution clearance, factory licence, FSSAI (food), drug licence (pharma), etc., as applicable.", link: "https://www.bis.gov.in", ref: "BIS Portal" },
  ];

  /* ── Application Process ── */
  const STEPS = [
    { num: "01", title: "Identify Your PLI Sector", detail: "Determine which of the 14 PLI sectors your manufacturing activity falls under. Each sector has its own scheme guidelines, nodal ministry, and incentive structure.", color: "245,158,11" },
    { num: "02", title: "Check Sector-Specific Eligibility", detail: "Verify minimum global/domestic revenue thresholds, investment commitments, and product category requirements for your chosen sector.", color: "59,130,246" },
    { num: "03", title: "Register on the PLI Portal", detail: "Create an account on the designated online portal of the respective nodal ministry. Complete company profile with all statutory details.", color: "6,182,212" },
    { num: "04", title: "Submit Application with Documents", detail: "Fill the online application form with company details, investment plan, production data, and upload all required documents within the application window.", color: "16,185,129" },
    { num: "05", title: "Application Review by Nodal Ministry", detail: "The nodal ministry/DPIIT reviews applications for eligibility, scrutinizes documents, and may request additional clarification.", color: "168,85,247" },
    { num: "06", title: "Approval & Letter of Intent", detail: "Approved applicants receive a Letter of Intent (LOI) confirming their selection. The LOI specifies investment commitments and timelines.", color: "239,68,68" },
    { num: "07", title: "Execute Investment & Manufacturing", detail: "Make the committed incremental investment in plant, machinery, and technology. Commence or scale-up manufacturing operations in India.", color: "245,158,11" },
    { num: "08", title: "Achieve Incremental Sales Targets", detail: "Meet year-wise incremental sales thresholds over the base year (FY 2019-20) as defined in the scheme guidelines.", color: "59,130,246" },
    { num: "09", title: "File Incentive Claim Annually", detail: "Submit audited production, sales, and investment data through the portal each year. Claims are verified by the ministry and independent auditors.", color: "22,163,74" },
    { num: "10", title: "Incentive Disbursement", detail: "After verification, the government disburses the incentive (4-6% of incremental sales) directly to the company's bank account.", color: "245,158,11" },
  ];

  /* ── Approval Timeline ── */
  const TIMELINE = [
    { phase: "Application Window", duration: "30–90 Days", icon: "📋" },
    { phase: "Eligibility Screening", duration: "30–60 Days", icon: "🔍" },
    { phase: "LOI Issuance", duration: "15–30 Days", icon: "✉️" },
    { phase: "Investment Period", duration: "1–3 Years", icon: "🏭" },
    { phase: "Annual Claim Filing", duration: "60–90 Days", icon: "📊" },
    { phase: "Verification & Audit", duration: "30–60 Days", icon: "✅" },
    { phase: "Incentive Disbursement", duration: "30–45 Days", icon: "💰" },
    { phase: "Scheme Duration", duration: "4–6 Years", icon: "🏁" },
  ];

  /* ── Chart Data ── */
  const budgetData = [
    { name: "Mobile/Elec", budget: 40951 },
    { name: "Auto", budget: 25938 },
    { name: "Solar PV", budget: 24000 },
    { name: "ACC Battery", budget: 18100 },
    { name: "IT HW", budget: 17000 },
    { name: "Pharma", budget: 15000 },
    { name: "Telecom", budget: 12195 },
    { name: "Textiles", budget: 10683 },
    { name: "Food", budget: 10900 },
    { name: "Steel", budget: 6322 },
    { name: "White Goods", budget: 6238 },
    { name: "Medical", budget: 3420 },
    { name: "Drones", budget: 120 },
  ];

  const investmentTrend = [
    { year: "2020-21", investment: 5200, sales: 42000, jobs: 120000 },
    { year: "2021-22", investment: 18500, sales: 185000, jobs: 310000 },
    { year: "2022-23", investment: 47000, sales: 550000, jobs: 590000 },
    { year: "2023-24", investment: 115000, sales: 1090000, jobs: 850000 },
    { year: "2024-25", investment: 176000, sales: 1650000, jobs: 1200000 },
  ];

  const incentiveData = [
    { sector: "Drones", pct: 20 },
    { sector: "Specialty Steel", pct: 12 },
    { sector: "Textiles", pct: 11 },
    { sector: "Food Processing", pct: 10 },
    { sector: "Pharma", pct: 10 },
    { sector: "Medical Devices", pct: 8 },
    { sector: "Auto Components", pct: 7 },
    { sector: "Telecom", pct: 7 },
    { sector: "Mobile/Electronics", pct: 6 },
    { sector: "White Goods", pct: 6 },
    { sector: "IT Hardware", pct: 5 },
  ];

  /* ── Related Schemes ── */
  const RELATED = [
    { icon: "🏦", name: "CGTMSE Scheme", desc: "Collateral-free credit guarantee up to ₹5 Crore for micro & small enterprises.", link: "#", onClick: () => setActiveTab("cgtmse") },
    { icon: "🪙", name: "PMMY / MUDRA Loan", desc: "Micro loans up to ₹20L without collateral via Pradhan Mantri Mudra Yojana.", link: "#", onClick: () => setActiveTab("pmmy") },
    { icon: "🏭", name: "PMEGP Subsidy", desc: "15–35% project cost subsidy for new micro-enterprises via KVIC.", link: "#", onClick: () => setActiveTab("pmegp") },
    { icon: "👩‍💼", name: "Stand-Up India", desc: "₹10L to ₹1Cr loans for SC/ST/Women led greenfield enterprises.", link: "https://www.standupmitra.in" },
    { icon: "🌍", name: "Make in India", desc: "Government initiative to encourage manufacturing and investment in India.", link: "https://www.makeinindia.com" },
    { icon: "🌐", name: "Udyam Registration", desc: "Free MSME registration required for all government scheme eligibility.", link: "https://udyamregistration.gov.in" },
  ];

  return (
    <div className="content-area glass-panel custom-scrollbar fade-in-up" style={{ borderRadius: "20px", padding: "clamp(20px, 4vw, 45px)" }}>

      {/* Back Button */}
      <button onClick={() => setActiveTab("schemes")} style={{ marginBottom: "30px", padding: "10px 18px", background: "rgba(255,255,255,0.05)", color: "#E4E4E7", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: 600, transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
        ← Back to Schemes
      </button>

      {/* Hero Banner */}
      <div style={{ ...S.infoBox("245,158,11"), marginBottom: "40px", display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start", borderLeft: "5px solid #F59E0B" }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "40px" }}>⚙️</span>
            <div>
              <h1 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, color: "#FFF", margin: 0, letterSpacing: "-0.5px" }}>PLI Scheme</h1>
              <p style={{ color: "#71717A", margin: "4px 0 0 0", fontSize: "14px" }}>Production Linked Incentive — Atmanirbhar Bharat</p>
            </div>
          </div>
          <p style={{ color: "#A1A1AA", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>
            A flagship <strong style={{ color: "#FFF" }}>incentive-based manufacturing scheme</strong> launched in 2020 under <strong style={{ color: "#F59E0B" }}>Atmanirbhar Bharat</strong>. The PLI scheme offers <strong style={{ color: "#FFF" }}>4%–6% financial incentives on incremental sales</strong> of goods manufactured in India across <strong style={{ color: "#F59E0B" }}>14 key sectors</strong>. Total outlay of <strong style={{ color: "#FFF" }}>₹1.97 Lakh Crore</strong> aimed at boosting domestic manufacturing, reducing imports, attracting investment, and creating large-scale employment.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
            <span style={S.badge("245,158,11")}>⚙️ 14 Sectors</span>
            <span style={S.badge("59,130,246")}>💰 ₹1.97L Cr Outlay</span>
            <span style={S.badge("16,185,129")}>📈 4–6% Incentive</span>
            <span style={S.badge("168,85,247")}>🏭 Make in India</span>
          </div>
        </div>
        <div style={{ background: "rgba(245,158,11,0.1)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(245,158,11,0.2)", minWidth: "200px", textAlign: "center" }}>
          <div style={{ fontSize: "42px", fontWeight: 900, color: "#F59E0B" }}>₹1.97L Cr</div>
          <div style={{ color: "#71717A", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Total Budget Outlay</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "15px 0" }} />
          <div style={{ fontSize: "30px", fontWeight: 900, color: "#22C55E" }}>14</div>
          <div style={{ color: "#71717A", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Manufacturing Sectors</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "15px 0" }} />
          <a href="https://www.makeinindia.com" target="_blank" rel="noreferrer" style={{ ...S.link, justifyContent: "center", background: "#F59E0B", color: "#111", padding: "10px 18px", borderRadius: "8px", fontWeight: 700 }}>Make in India Portal ↗</a>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: "16px", marginBottom: "50px" }}>
        {[
          { label: "Total Investment", val: "₹1.76L Cr", color: "#F59E0B", icon: "💸" },
          { label: "Jobs Created", val: "12 Lakh+", color: "#22C55E", icon: "👷" },
          { label: "Sales by PLI Cos", val: "₹16.5L Cr", color: "#3B82F6", icon: "📈" },
          { label: "Approved Applicants", val: "806+", color: "#A78BFA", icon: "✅" },
          { label: "Scheme Duration", val: "4–6 Years", color: "#06B6D4", icon: "📅" },
        ].map((stat, i) => (
          <div key={i} style={{ ...S.card, textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: stat.color }}>{stat.val}</div>
            <div style={{ fontSize: "11px", color: "#71717A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "4px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 14 Sectors Grid */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(245,158,11,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🏭</span> 14 PLI Sectors — Incentive Overview</h2>
        <p style={{ color: "#71717A", marginBottom: "20px", lineHeight: 1.7 }}>Each sector has its own nodal ministry, budget allocation, and incentive structure. The incentive is calculated on <strong style={{ color: "#FFF" }}>incremental sales</strong> over the base year (FY 2019-20).</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(225px, 1fr))", gap: "14px" }}>
          {SECTORS.map((s, i) => (
            <div key={i} style={{ ...S.card, borderLeft: `3px solid rgb(${s.color})`, display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "28px", flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "4px" }}>{s.name}</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", color: `rgb(${s.color})`, fontWeight: 700 }}>{s.outlay}</span>
                  <span style={{ fontSize: "11px", color: "#71717A" }}>•</span>
                  <span style={{ fontSize: "11px", color: "#E4E4E7", fontWeight: 600 }}>{s.incentive}</span>
                </div>
                <div style={{ fontSize: "11px", color: "#71717A" }}>Ministry: {s.ministry}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incentive Structure Explanation */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(59,130,246,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>💰</span> Incentive Structure — How It Works</h2>
        <div style={{ ...S.infoBox("245,158,11"), marginBottom: "24px" }}>
          <strong style={{ color: "#F59E0B" }}>Core Principle:</strong> <span style={{ color: "#A1A1AA" }}>PLI incentives are paid as a <strong style={{ color: "#FFF" }}>percentage of incremental sales</strong> (typically 4–6%) over the base year FY 2019-20. Companies must first invest, achieve sales targets, and then file annual claims. The incentive encourages <strong style={{ color: "#FFF" }}>large-scale manufacturing in India</strong> and reduces import dependency.</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {[
            { title: "Base Year", val: "FY 2019-20", icon: "📅", color: "59,130,246", desc: "All incremental sales and investment are measured against FY 2019-20 as the reference baseline year." },
            { title: "Incentive Rate", val: "4% – 6%", icon: "💰", color: "245,158,11", desc: "Standard incentive on net incremental sales. Rate varies by sector and may increase on higher value addition." },
            { title: "Duration", val: "4 – 6 Years", icon: "⏱️", color: "168,85,247", desc: "Incentive payout period from the year of meeting threshold. Specific duration varies by sector scheme." },
            { title: "Key Requirement", val: "Invest + Sell", icon: "🎯", color: "16,185,129", desc: "Must meet BOTH incremental investment threshold AND incremental sales target each year to claim incentives." },
          ].map((item, i) => (
            <div key={i} style={{ ...S.card, borderTop: `3px solid rgb(${item.color})` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "28px" }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: `rgb(${item.color})`, fontSize: "13px" }}>{item.title}</div>
                  <div style={{ fontWeight: 800, color: "#FFF", fontSize: "20px" }}>{item.val}</div>
                </div>
              </div>
              <p style={{ color: "#71717A", fontSize: "12px", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documents */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(6,182,212,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>📄</span> Required Documents</h2>
        <p style={{ color: "#71717A", marginBottom: "24px", lineHeight: 1.7 }}>Prepare these documents <strong style={{ color: "#FFF" }}>before applying online</strong>. Requirements vary by sector — check specific sector guidelines from the nodal ministry.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" }}>
          {DOCS.map((doc, i) => (
            <div key={i} style={{ ...S.card, display: "flex", gap: "14px", alignItems: "flex-start", borderLeft: "3px solid rgba(245,158,11,0.4)" }}>
              <div style={{ fontSize: "28px", flexShrink: 0 }}>{doc.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "6px" }}>{doc.title}</div>
                <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6 }}>{doc.desc}</div>
                {doc.link !== "#" && (
                  <a href={doc.link} target="_blank" rel="noreferrer" style={{ ...S.link, fontSize: "12px", marginTop: "8px", display: "inline-flex" }} onMouseOver={e => e.currentTarget.style.opacity = 0.7} onMouseOut={e => e.currentTarget.style.opacity = 1}>
                    {"📎 " + doc.ref + " ↗"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility Criteria */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(16,185,129,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>✅</span> Eligibility Criteria</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
          <div style={S.card}>
            <h3 style={{ color: "#22C55E", margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700 }}>✅ Who Can Apply</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "Company registered in India (Companies Act / LLP Act)",
                "Manufacturing goods in one of the 14 PLI sectors",
                "Meets sector-specific minimum global/domestic revenue threshold",
                "Commits to incremental investment in plant, machinery, R&D",
                "Can achieve year-wise incremental sales targets over base year",
                "Investments made on or after April 1, 2020 are eligible",
                "MSMEs eligible under specific sector guidelines",
                "Joint ventures and subsidiaries of global firms are eligible",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "16px", flexShrink: 0 }}>✅</span>
                  <span style={{ color: "#E4E4E7", fontSize: "13px" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={S.card}>
            <h3 style={{ color: "#EF4444", margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700 }}>❌ Not Eligible</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "Trading or import-only companies (no manufacturing in India)",
                "Companies not meeting minimum revenue thresholds",
                "Units not making incremental investment over base year",
                "Products not covered under the 14 notified sectors",
                "Companies under insolvency or NCLT proceedings",
                "Failure to meet sales target — no incentive for that year",
                "Non-compliance with domestic value addition norms",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "16px", flexShrink: 0 }}>❌</span>
                  <span style={{ color: "#71717A", fontSize: "13px", textDecoration: "line-through" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Application Process */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🔄</span> Application Process — Step by Step</h2>
        <div style={{ ...S.infoBox("6,182,212"), marginBottom: "24px" }}>
          <strong style={{ color: "#06B6D4" }}>💡 Key Points:</strong> <span style={{ color: "#A1A1AA" }}>Each PLI sector has its own <strong style={{ color: "#FFF" }}>dedicated online portal</strong> managed by the nodal ministry. Applications are accepted during <strong style={{ color: "#FFF" }}>specific windows</strong>. After approval, companies must invest, manufacture, and achieve incremental sales targets before claiming incentives. Claims are <strong style={{ color: "#FFF" }}>verified annually</strong> by the ministry and independent auditors.</span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "36px", top: "20px", bottom: "20px", width: "2px", background: "linear-gradient(to bottom, #F59E0B, #3B82F6)", borderRadius: "2px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "16px" }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `rgba(${step.color},0.15)`, border: `2px solid rgba(${step.color},0.5)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 900, color: `rgb(${step.color})`, fontSize: "14px" }}>{step.num}</div>
                <div style={{ ...S.card, flex: 1, padding: "16px 20px" }}>
                  <div style={{ fontWeight: 700, color: "#FFF", fontSize: "15px", marginBottom: "6px" }}>{step.title}</div>
                  <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6 }}>{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(59,130,246,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>📈</span> Visual Data & Analytics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>

          {/* Sector Budget Allocation */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#F59E0B", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📊 Sector-wise Budget Outlay (₹ Crore)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={budgetData} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <YAxis type="category" dataKey="name" stroke="#71717A" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`₹${v.toLocaleString("en-IN")} Cr`]} />
                <Bar dataKey="budget" fill="#F59E0B" radius={[0, 5, 5, 0]} name="Budget (₹ Cr)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Investment & Sales Trend */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#3B82F6", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📈 Investment & Sales Growth (₹ Crore)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={investmentTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#71717A" tick={{ fontSize: 10 }} />
                <YAxis stroke="#71717A" tick={{ fontSize: 9 }} tickFormatter={v => v >= 100000 ? `${(v/100000).toFixed(1)}L` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`₹${v.toLocaleString("en-IN")} Cr`]} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="investment" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} name="Committed Investment" />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} name="Total Sales" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Max Incentive % by Sector */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#22C55E", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>💰 Maximum Incentive Rate by Sector (%)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={incentiveData} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="sector" stroke="#71717A" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`${v}%`]} />
                <Bar dataKey="pct" fill="#22C55E" radius={[0, 5, 5, 0]} name="Max Incentive %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Jobs Created Trend */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#A78BFA", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>👷 Employment Generated (Cumulative)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={investmentTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#71717A" tick={{ fontSize: 10 }} />
                <YAxis stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${(v/100000).toFixed(1)}L`} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [v.toLocaleString("en-IN") + " jobs"]} />
                <Bar dataKey="jobs" fill="#A78BFA" radius={[5, 5, 0, 0]} name="Jobs Created" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Approval Timeline */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>⏱️</span> Approval & Disbursement Timeline</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
          {TIMELINE.map((tl, i) => (
            <div key={i} style={{ ...S.card, textAlign: "center", borderTop: i === TIMELINE.length - 1 ? "3px solid #F59E0B" : "3px solid rgba(245,158,11,0.3)" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{tl.icon}</div>
              <div style={{ fontWeight: 700, color: i === TIMELINE.length - 1 ? "#F59E0B" : "#3B82F6", fontSize: "15px", marginBottom: "5px" }}>{tl.duration}</div>
              <div style={{ color: "#71717A", fontSize: "11px" }}>{tl.phase}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Reference Links */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(6,182,212,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🔗</span> Official Government Reference Links</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
          {[
            { label: "Make in India Portal", url: "https://www.makeinindia.com", desc: "Government's official manufacturing and investment promotion portal covering PLI sectors." },
            { label: "DPIIT (Industry & Trade)", url: "https://dpiit.gov.in", desc: "Department for Promotion of Industry — notifies PLI guidelines and monitors implementation." },
            { label: "MeitY (Electronics PLI)", url: "https://www.meity.gov.in", desc: "Ministry of Electronics & IT — manages PLI for Mobile, Electronics, and IT Hardware." },
            { label: "PIB — PLI Updates", url: "https://pib.gov.in", desc: "Press Information Bureau — official press releases and updates on PLI scheme progress." },
            { label: "MyScheme.gov.in", url: "https://www.myscheme.gov.in", desc: "Central scheme portal with sector-wise PLI eligibility checker and guidelines." },
            { label: "Ministry of MSME", url: "https://msme.gov.in", desc: "For MSME-specific incentive programmes complementing PLI initiatives." },
            { label: "Invest India", url: "https://www.investindia.gov.in", desc: "India's national investment promotion agency — guidance on PLI applications." },
            { label: "NITI Aayog — PLI Report", url: "https://www.niti.gov.in", desc: "Policy think tank reports on PLI scheme impact, recommendations, and future roadmap." },
          ].map((ref, i) => (
            <a key={i} href={ref.url} target="_blank" rel="noreferrer" style={{ ...S.card, textDecoration: "none", display: "flex", flexDirection: "column", gap: "6px", cursor: "pointer", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"} onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
              <div style={{ fontWeight: 700, color: "#F59E0B", fontSize: "13px", display: "flex", justifyContent: "space-between" }}>{ref.label}<span>↗</span></div>
              <div style={{ color: "#71717A", fontSize: "12px" }}>{ref.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ ...S.infoBox("245,158,11"), borderLeft: "5px solid #F59E0B" }}>
        <h2 style={{ ...S.h2, marginBottom: "20px" }}>🚀 What To Do Next</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {[
            { step: "1", action: "Identify which of the 14 PLI sectors matches your manufacturing activity", link: "https://www.makeinindia.com", cta: "Explore Sectors →" },
            { step: "2", action: "Check sector-specific eligibility — revenue thresholds and investment requirements", link: "https://www.myscheme.gov.in", cta: "Check Eligibility →" },
            { step: "3", action: "Prepare your business plan, investment proposal, and all required documents", link: "https://dpiit.gov.in", cta: "View Guidelines →" },
            { step: "4", action: "Apply through the sector-specific nodal ministry PLI portal during the application window", link: "https://www.makeinindia.com", cta: "Apply Online →" },
            { step: "5", action: "Track your application status and stay updated on deadlines", link: "https://pib.gov.in", cta: "Track Updates →" },
            { step: "6", action: "Explore complementary schemes — CGTMSE, MUDRA, PMEGP for additional support", link: "#related", cta: "Related Schemes ↓" },
          ].map((ns, i) => (
            <a key={i} href={ns.link} target={ns.link.startsWith("http") ? "_blank" : "_self"} rel="noreferrer" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "10px", padding: "16px", textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(245,158,11,0.15)"} onMouseOut={e => e.currentTarget.style.background = "rgba(245,158,11,0.08)"}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(245,158,11,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#F59E0B", fontWeight: 800, fontSize: "13px" }}>{ns.step}</div>
              <div style={{ color: "#E4E4E7", fontSize: "13px", lineHeight: 1.5 }}>{ns.action}</div>
              <div style={{ color: "#F59E0B", fontSize: "12px", fontWeight: 700 }}>{ns.cta}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Related Schemes */}
      <div id="related" style={{ ...S.section, marginTop: "50px" }}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🧩</span> Related MSME & Manufacturing Schemes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          {RELATED.map((r, i) => (
            <div key={i} style={{ ...S.card, display: "flex", gap: "14px", alignItems: "flex-start", cursor: r.onClick ? "pointer" : "default" }} onClick={r.onClick || undefined}>
              <span style={{ fontSize: "28px" }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "5px" }}>{r.name}</div>
                <div style={{ color: "#71717A", fontSize: "12px", lineHeight: 1.6, marginBottom: "10px" }}>{r.desc}</div>
                {r.onClick ? (
                  <button onClick={r.onClick} style={{ ...S.link, fontSize: "12px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>View Full Guide ↗</button>
                ) : (
                  <a href={r.link} target="_blank" rel="noreferrer" style={{ ...S.link, fontSize: "12px" }}>Learn More ↗</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function TReDSDetailPage({ setActiveTab }) {
  const S = {
    section: { marginBottom: "50px" },
    h2: { fontSize: "26px", fontWeight: 800, color: "#FFF", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "12px" },
    badge: (color) => ({ display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, background: `rgba(${color},0.15)`, border: `1px solid rgba(${color},0.3)`, color: `rgb(${color})` }),
    card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "22px 26px" },
    infoBox: (c) => ({ background: `rgba(${c},0.07)`, border: `1px solid rgba(${c},0.2)`, borderRadius: "12px", padding: "18px 22px" }),
    link: { color: "#06B6D4", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", transition: "opacity 0.2s" },
  };

  /* ── RBI-Approved TReDS Platforms ── */
  const PLATFORMS = [
    { name: "M1xchange", operator: "Mynd Solutions Pvt Ltd", url: "https://www.m1xchange.com", desc: "Largest TReDS platform by transaction volume. Over ₹1.5 Lakh Crore in transactions processed.", icon: "🔵", color: "59,130,246" },
    { name: "RXIL", operator: "NSE-SIDBI Joint Venture", url: "https://www.rxil.in", desc: "Receivables Exchange of India. ₹80,500 Cr processed in FY25 alone. Strong PSU buyer network.", icon: "🟢", color: "16,185,129" },
    { name: "Invoicemart (A.TReDS)", operator: "Axis Bank Initiative", url: "https://www.invoicemart.com", desc: "Third major TReDS platform with growing network of buyers and financiers.", icon: "🟠", color: "245,158,11" },
    { name: "C2TReDS", operator: "C2FO Factoring Solutions", url: "https://www.c2treds.com", desc: "Backed by global working capital platform C2FO. Focus on dynamic discounting.", icon: "🟣", color: "168,85,247" },
    { name: "DTX (KredX)", operator: "KredX Platform Pvt Ltd", url: "https://www.dtxindia.in", desc: "Latest RBI-approved TReDS platform. Technology-first approach to invoice financing.", icon: "🔴", color: "239,68,68" },
  ];

  /* ── Required Documents ── */
  const DOCS = [
    { icon: "🆔", title: "Udyam Registration Certificate", desc: "Valid MSME Udyam registration is mandatory to participate as a seller on any TReDS platform.", link: "https://udyamregistration.gov.in", ref: "Udyam Portal" },
    { icon: "📋", title: "PAN Card (Company/Firm)", desc: "Permanent Account Number of the entity. Required for KYC verification and tax compliance.", link: "https://www.incometax.gov.in", ref: "Income Tax Portal" },
    { icon: "🧾", title: "GST Registration Certificate", desc: "Active GSTIN is essential as invoices uploaded must be GST-compliant trade receivables.", link: "https://www.gst.gov.in", ref: "GST Portal" },
    { icon: "🏦", title: "Bank Account Details", desc: "Current account details with cancelled cheque for fund settlement. Must be a scheduled commercial bank.", link: "#", ref: "Bank Requirement" },
    { icon: "🏢", title: "Certificate of Incorporation / Partnership Deed", desc: "For companies: COI from MCA. For partnerships: registered deed. For proprietors: business registration.", link: "https://www.mca.gov.in", ref: "MCA Portal" },
    { icon: "📄", title: "Board Resolution / Authority Letter", desc: "Authorization from the board/partners to register on TReDS and conduct invoice discounting transactions.", link: "#", ref: "Company Format" },
    { icon: "📊", title: "Audited Financial Statements", desc: "Last 2 years audited P&L and Balance Sheet. Helps financiers assess creditworthiness for bidding.", link: "#", ref: "CA Certified" },
    { icon: "📝", title: "KYC of Authorized Signatories", desc: "Identity proof (Aadhaar/Passport), address proof, and signature verification from banker for authorized users.", link: "https://uidai.gov.in", ref: "UIDAI Portal" },
    { icon: "🧑‍💼", title: "Income Tax Returns (2 Years)", desc: "Filed ITR for last 2 financial years to demonstrate business activity and revenue history.", link: "https://www.incometax.gov.in", ref: "IT Portal" },
    { icon: "📑", title: "MOA & AOA (For Companies)", desc: "Memorandum and Articles of Association showing authorized business activities of the company.", link: "https://www.mca.gov.in", ref: "MCA Portal" },
  ];

  /* ── Invoice Discounting Process ── */
  const STEPS = [
    { num: "01", title: "Register on a TReDS Platform", detail: "MSME (seller), corporate buyer, and financier register on any RBI-approved TReDS platform with required documents and complete digital KYC.", color: "6,182,212" },
    { num: "02", title: "MSME Uploads Invoice", detail: "After delivering goods/services, the MSME seller uploads the invoice (Factoring Unit) onto the TReDS platform with details like amount, buyer name, and due date.", color: "59,130,246" },
    { num: "03", title: "Buyer Accepts Invoice", detail: "The corporate buyer reviews and digitally accepts the uploaded invoice, confirming their payment obligation. This triggers the bidding process.", color: "16,185,129" },
    { num: "04", title: "Financiers Bid Competitively", detail: "Multiple banks and NBFCs bid to discount the accepted invoice. They offer competitive interest rates based on the buyer's creditworthiness, not the MSME's.", color: "168,85,247" },
    { num: "05", title: "MSME Accepts Best Bid", detail: "The MSME seller reviews all financier bids and selects the most favorable offer (lowest discount rate). The entire process is transparent.", color: "245,158,11" },
    { num: "06", title: "Funds Disbursed to MSME", detail: "The selected financier disburses funds to the MSME within 24-48 hours. This is WITHOUT RECOURSE — MSME has no liability if buyer defaults.", color: "22,163,74" },
    { num: "07", title: "Buyer Pays Financier on Due Date", detail: "On the original invoice due date, the buyer pays the full invoice amount directly to the financier through the platform's settlement mechanism.", color: "239,68,68" },
  ];

  /* ── Fee Structure ── */
  const FEES = [
    { item: "Registration Fee", amount: "₹5,000 – ₹25,000", note: "One-time, non-refundable. Varies by platform.", icon: "📋" },
    { item: "Annual Subscription", amount: "Nil – ₹10,000", note: "Some platforms charge annual maintenance fees.", icon: "📅" },
    { item: "Transaction Fee (Seller)", amount: "0.01% – 0.10%", note: "Small % of invoice value. Main cost for MSMEs.", icon: "💰" },
    { item: "Discount Rate (Interest)", amount: "6% – 9% p.a.", note: "Determined by competitive bidding. Based on buyer credit.", icon: "📉" },
    { item: "Stamp Duty", amount: "As applicable", note: "Electronic stamp duty on factoring unit. Varies by state.", icon: "📜" },
    { item: "Platform Charges (Buyer)", amount: "Minimal / Nil", note: "Buyers typically face no or minimal charges.", icon: "🏢" },
  ];

  /* ── Approval Timeline ── */
  const TIMELINE = [
    { phase: "Online Application", duration: "1 Day", icon: "📋" },
    { phase: "Document Upload", duration: "1–2 Days", icon: "📄" },
    { phase: "KYC Verification", duration: "2–3 Days", icon: "🔍" },
    { phase: "Agreement Signing", duration: "1–2 Days", icon: "✍️" },
    { phase: "Account Activation", duration: "1 Day", icon: "✅" },
    { phase: "First Invoice Upload", duration: "Same Day", icon: "📤" },
    { phase: "Fund Disbursement", duration: "24–48 Hours", icon: "💰" },
    { phase: "Total Onboarding", duration: "2–7 Days", icon: "🏁" },
  ];

  /* ── Chart Data ── */
  const transactionData = [
    { year: "2018-19", volume: 8500 },
    { year: "2019-20", volume: 17200 },
    { year: "2020-21", volume: 22500 },
    { year: "2021-22", volume: 39800 },
    { year: "2022-23", volume: 62000 },
    { year: "2023-24", volume: 98500 },
    { year: "2024-25", volume: 145000 },
  ];

  const platformShare = [
    { name: "M1xchange", share: 45 },
    { name: "RXIL", share: 30 },
    { name: "Invoicemart", share: 15 },
    { name: "C2TReDS", share: 6 },
    { name: "DTX", share: 4 },
  ];

  const rateComparison = [
    { source: "TReDS", rate: 7.5 },
    { source: "Bank OD", rate: 12 },
    { source: "NBFC", rate: 15 },
    { source: "Informal", rate: 24 },
  ];

  const msmeGrowth = [
    { year: "2019-20", sellers: 8500, buyers: 950, financiers: 45 },
    { year: "2020-21", sellers: 15200, buyers: 1800, financiers: 52 },
    { year: "2021-22", sellers: 28000, buyers: 3200, financiers: 60 },
    { year: "2022-23", sellers: 45000, buyers: 5500, financiers: 68 },
    { year: "2023-24", sellers: 72000, buyers: 9800, financiers: 75 },
    { year: "2024-25", sellers: 105000, buyers: 15000, financiers: 82 },
  ];

  /* ── Related Schemes ── */
  const RELATED = [
    { icon: "🏦", name: "CGTMSE Scheme", desc: "Collateral-free credit guarantee up to ₹5 Crore for micro & small enterprises.", link: "#", onClick: () => setActiveTab("cgtmse") },
    { icon: "🪙", name: "PMMY / MUDRA Loan", desc: "Micro loans up to ₹20L without collateral via Pradhan Mantri Mudra Yojana.", link: "#", onClick: () => setActiveTab("pmmy") },
    { icon: "🏭", name: "PMEGP Subsidy", desc: "15-35% project cost subsidy for new micro-enterprises via KVIC.", link: "#", onClick: () => setActiveTab("pmegp") },
    { icon: "⚙️", name: "PLI Scheme", desc: "4-6% incentive on incremental sales for 14 key manufacturing sectors.", link: "#", onClick: () => setActiveTab("pli") },
    { icon: "👩‍💼", name: "Stand-Up India", desc: "Loans ₹10L to ₹1Cr for SC/ST/Women led greenfield enterprises.", link: "https://www.standupmitra.in" },
    { icon: "🌐", name: "Udyam Registration", desc: "Free MSME registration required for TReDS seller eligibility.", link: "https://udyamregistration.gov.in" },
  ];

  return (
    <div className="content-area glass-panel custom-scrollbar fade-in-up" style={{ borderRadius: "20px", padding: "clamp(20px, 4vw, 45px)" }}>

      {/* Back Button */}
      <button onClick={() => setActiveTab("schemes")} style={{ marginBottom: "30px", padding: "10px 18px", background: "rgba(255,255,255,0.05)", color: "#E4E4E7", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: 600, transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
        ← Back to Schemes
      </button>

      {/* Hero Banner */}
      <div style={{ ...S.infoBox("6,182,212"), marginBottom: "40px", display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start", borderLeft: "5px solid #06B6D4" }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "40px" }}>📜</span>
            <div>
              <h1 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, color: "#FFF", margin: 0, letterSpacing: "-0.5px" }}>TReDS Platform</h1>
              <p style={{ color: "#71717A", margin: "4px 0 0 0", fontSize: "14px" }}>Trade Receivables Discounting System — RBI Regulated</p>
            </div>
          </div>
          <p style={{ color: "#A1A1AA", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>
            An <strong style={{ color: "#FFF" }}>RBI-regulated electronic platform</strong> that enables MSMEs to discount their trade receivables (invoices) through competitive bidding by multiple <strong style={{ color: "#06B6D4" }}>banks and NBFCs</strong>. TReDS provides <strong style={{ color: "#FFF" }}>non-recourse financing</strong> — MSMEs get paid within <strong style={{ color: "#06B6D4" }}>24-48 hours</strong> without collateral. Companies with turnover above <strong style={{ color: "#FFF" }}>₹250 Crore must register</strong> on TReDS, ensuring a large buyer network for MSMEs.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
            <span style={S.badge("6,182,212")}>📜 RBI Regulated</span>
            <span style={S.badge("59,130,246")}>🏦 5 Platforms</span>
            <span style={S.badge("16,185,129")}>⚡ 24-48hr Payout</span>
            <span style={S.badge("245,158,11")}>🔒 Non-Recourse</span>
          </div>
        </div>
        <div style={{ background: "rgba(6,182,212,0.1)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(6,182,212,0.2)", minWidth: "200px", textAlign: "center" }}>
          <div style={{ fontSize: "42px", fontWeight: 900, color: "#06B6D4" }}>₹1.45L Cr</div>
          <div style={{ color: "#71717A", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>FY25 Transaction Volume</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "15px 0" }} />
          <div style={{ fontSize: "30px", fontWeight: 900, color: "#22C55E" }}>1L+</div>
          <div style={{ color: "#71717A", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>MSME Sellers Registered</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "15px 0" }} />
          <a href="https://www.rbi.org.in" target="_blank" rel="noreferrer" style={{ ...S.link, justifyContent: "center", background: "#06B6D4", color: "#111", padding: "10px 18px", borderRadius: "8px", fontWeight: 700 }}>RBI Official Portal ↗</a>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: "16px", marginBottom: "50px" }}>
        {[
          { label: "FY25 Volume", val: "₹1.45L Cr", color: "#06B6D4", icon: "💰" },
          { label: "Registered MSMEs", val: "1 Lakh+", color: "#22C55E", icon: "🏭" },
          { label: "Payout Speed", val: "24-48 Hrs", color: "#3B82F6", icon: "⚡" },
          { label: "Avg Discount Rate", val: "6-9% p.a.", color: "#F59E0B", icon: "📉" },
          { label: "RBI Platforms", val: "5 Approved", color: "#A78BFA", icon: "🏦" },
        ].map((stat, i) => (
          <div key={i} style={{ ...S.card, textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: stat.color }}>{stat.val}</div>
            <div style={{ fontSize: "11px", color: "#71717A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "4px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* How TReDS Works - 3 Participants */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(6,182,212,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🔄</span> How TReDS Works — Key Participants</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {[
            { role: "MSME Seller", icon: "🏭", color: "16,185,129", points: ["Uploads approved invoices to TReDS", "Receives competitive bids from financiers", "Gets paid within 24-48 hours", "Non-recourse: no liability if buyer defaults", "No collateral required"] },
            { role: "Corporate Buyer", icon: "🏢", color: "59,130,246", points: ["Accepts MSME invoices on platform", "Pays financier on original due date", "Companies >₹250Cr must register by mandate", "Improves supplier relationships", "Digital, paperless process"] },
            { role: "Financier (Bank/NBFC)", icon: "🏦", color: "245,158,11", points: ["Bids competitively to discount invoices", "Risk based on buyer creditworthiness", "RBI-permitted banks and NBFC-Factors", "Insurance companies can provide credit cover", "Earns spread on discounted invoices"] },
          ].map((p, i) => (
            <div key={i} style={{ ...S.card, borderTop: `3px solid rgb(${p.color})` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span style={{ fontSize: "32px" }}>{p.icon}</span>
                <div style={{ fontWeight: 800, color: `rgb(${p.color})`, fontSize: "18px" }}>{p.role}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {p.points.map((pt, j) => (
                  <div key={j} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: `rgb(${p.color})`, flexShrink: 0 }} />
                    <span style={{ color: "#E4E4E7", fontSize: "13px" }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...S.infoBox("6,182,212") }}>
          <strong style={{ color: "#06B6D4" }}>💡 Key Advantage:</strong> <span style={{ color: "#A1A1AA" }}> TReDS financing is <strong style={{ color: "#FFF" }}>without recourse</strong> to the MSME seller. The credit risk is entirely on the <strong style={{ color: "#FFF" }}>buyer</strong>, which means MSMEs get <strong style={{ color: "#FFF" }}>better interest rates</strong> compared to their own credit profile. Even small MSMEs can access institutional finance at rates <strong style={{ color: "#06B6D4" }}>6-9% p.a.</strong> vs 15-24% from informal sources.</span>
        </div>
      </div>

      {/* 5 RBI Platforms */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(59,130,246,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🏦</span> RBI-Approved TReDS Platforms</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {PLATFORMS.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noreferrer" style={{ ...S.card, textDecoration: "none", borderLeft: `3px solid rgb(${p.color})`, display: "flex", gap: "14px", alignItems: "flex-start", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = `rgb(${p.color})`} onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
              <span style={{ fontSize: "28px", flexShrink: 0 }}>{p.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "15px", marginBottom: "3px" }}>{p.name} <span style={{ color: `rgb(${p.color})`, fontSize: "12px" }}>↗</span></div>
                <div style={{ color: "#71717A", fontSize: "11px", marginBottom: "6px" }}>Operated by: {p.operator}</div>
                <div style={{ color: "#A1A1AA", fontSize: "12px", lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Fee Structure */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(245,158,11,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>💰</span> Fee Structure</h2>
        <p style={{ color: "#71717A", marginBottom: "20px", lineHeight: 1.7 }}>TReDS fees are <strong style={{ color: "#FFF" }}>transparent and competitive</strong>. The main cost is the discount rate determined by competitive bidding. Platform charges are minimal.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          {FEES.map((f, i) => (
            <div key={i} style={{ ...S.card, display: "flex", gap: "14px", alignItems: "flex-start", borderLeft: "3px solid rgba(6,182,212,0.4)" }}>
              <span style={{ fontSize: "28px", flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "4px" }}>{f.item}</div>
                <div style={{ color: "#06B6D4", fontSize: "16px", fontWeight: 800, marginBottom: "4px" }}>{f.amount}</div>
                <div style={{ color: "#71717A", fontSize: "12px" }}>{f.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documents */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(59,130,246,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>📄</span> Required Documents for MSME Registration</h2>
        <p style={{ color: "#71717A", marginBottom: "24px", lineHeight: 1.7 }}>Prepare these documents <strong style={{ color: "#FFF" }}>before registering</strong> on any TReDS platform. The process is fully digital with online KYC.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" }}>
          {DOCS.map((doc, i) => (
            <div key={i} style={{ ...S.card, display: "flex", gap: "14px", alignItems: "flex-start", borderLeft: "3px solid rgba(6,182,212,0.4)" }}>
              <div style={{ fontSize: "28px", flexShrink: 0 }}>{doc.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "6px" }}>{doc.title}</div>
                <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6 }}>{doc.desc}</div>
                {doc.link !== "#" && (
                  <a href={doc.link} target="_blank" rel="noreferrer" style={{ ...S.link, fontSize: "12px", marginTop: "8px", display: "inline-flex" }} onMouseOver={e => e.currentTarget.style.opacity = 0.7} onMouseOut={e => e.currentTarget.style.opacity = 1}>
                    {"📎 " + doc.ref + " ↗"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Discounting Process */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🔄</span> Invoice Discounting Process — Step by Step</h2>
        <div style={{ ...S.infoBox("6,182,212"), marginBottom: "24px" }}>
          <strong style={{ color: "#06B6D4" }}>💡 How it works:</strong> <span style={{ color: "#A1A1AA" }}> The entire process is <strong style={{ color: "#FFF" }}>digital and paperless</strong>. MSMEs upload invoices, buyers accept them, and financiers bid competitively. Funds reach the MSME within <strong style={{ color: "#FFF" }}>24-48 hours</strong>. On the due date, the buyer pays the financier directly. The MSME has <strong style={{ color: "#FFF" }}>zero liability</strong> after receiving payment.</span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "36px", top: "20px", bottom: "20px", width: "2px", background: "linear-gradient(to bottom, #06B6D4, #3B82F6)", borderRadius: "2px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "16px" }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `rgba(${step.color},0.15)`, border: `2px solid rgba(${step.color},0.5)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 900, color: `rgb(${step.color})`, fontSize: "14px" }}>{step.num}</div>
                <div style={{ ...S.card, flex: 1, padding: "16px 20px" }}>
                  <div style={{ fontWeight: 700, color: "#FFF", fontSize: "15px", marginBottom: "6px" }}>{step.title}</div>
                  <div style={{ color: "#71717A", fontSize: "13px", lineHeight: 1.6 }}>{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eligibility */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(16,185,129,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>✅</span> Eligibility Criteria</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
          <div style={S.card}>
            <h3 style={{ color: "#22C55E", margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700 }}>✅ MSME Sellers</h3>
            {[
              "Valid Udyam Registration (Micro, Small, or Medium)",
              "Active GST registration with invoice compliance",
              "Operating for at least 1 year",
              "Supplying goods/services to registered buyers",
              "Bank account with a scheduled commercial bank",
              "No minimum turnover requirement",
              "Both manufacturing and service MSMEs eligible",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", flexShrink: 0 }}>✅</span>
                <span style={{ color: "#E4E4E7", fontSize: "13px" }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <h3 style={{ color: "#3B82F6", margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700 }}>🏢 Corporate Buyers (Mandatory)</h3>
            {[
              "Companies with turnover >₹250 Cr MUST register (Nov 2024 mandate)",
              "All CPSEs (Central Public Sector Enterprises) must register",
              "Previous threshold was ₹500 Cr — now expanded significantly",
              "Government departments and PSUs encouraged to onboard",
              "Deadline: March/June 2025 for mandatory registration",
              "Voluntary registration open for all other companies",
              "Process is free and digital for buyers",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", flexShrink: 0 }}>🔵</span>
                <span style={{ color: "#E4E4E7", fontSize: "13px" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(59,130,246,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>📈</span> TReDS Data & Analytics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>

          {/* Transaction Volume Growth */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#06B6D4", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📈 Transaction Volume Growth (₹ Crore)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={transactionData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#71717A" tick={{ fontSize: 10 }} />
                <YAxis stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`₹${v.toLocaleString("en-IN")} Cr`]} />
                <Bar dataKey="volume" fill="#06B6D4" radius={[5, 5, 0, 0]} name="Volume (₹ Cr)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Market Share */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#3B82F6", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>🏦 Platform Market Share (%)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={platformShare} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" stroke="#71717A" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`${v}%`]} />
                <Bar dataKey="share" fill="#3B82F6" radius={[0, 5, 5, 0]} name="Market Share" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Interest Rate Comparison */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#22C55E", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>📉 TReDS vs Other Financing (% p.a.)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={rateComparison} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="source" stroke="#71717A" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71717A" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} formatter={v => [`${v}% p.a.`]} />
                <Bar dataKey="rate" radius={[5, 5, 0, 0]} name="Interest Rate">
                  {rateComparison.map((entry, index) => {
                    const colors = ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444"];
                    return <Cell key={index} fill={colors[index]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* MSME Registration Growth */}
          <div style={{ ...S.card }}>
            <h3 style={{ color: "#A78BFA", margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>🏭 Participant Growth Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={msmeGrowth} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#71717A" tick={{ fontSize: 10 }} />
                <YAxis stroke="#71717A" tick={{ fontSize: 9 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <Tooltip contentStyle={{ background: "#111216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="sellers" stroke="#22C55E" strokeWidth={3} dot={{ r: 4 }} name="MSME Sellers" />
                <Line type="monotone" dataKey="buyers" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} name="Corporate Buyers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Onboarding Timeline */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>⏱️</span> Onboarding & Payout Timeline</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
          {TIMELINE.map((tl, i) => (
            <div key={i} style={{ ...S.card, textAlign: "center", borderTop: i === TIMELINE.length - 1 ? "3px solid #06B6D4" : "3px solid rgba(6,182,212,0.3)" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{tl.icon}</div>
              <div style={{ fontWeight: 700, color: i === TIMELINE.length - 1 ? "#06B6D4" : "#3B82F6", fontSize: "15px", marginBottom: "5px" }}>{tl.duration}</div>
              <div style={{ color: "#71717A", fontSize: "11px" }}>{tl.phase}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Reference Links */}
      <div style={S.section}>
        <h2 style={S.h2}><span style={{ background: "rgba(6,182,212,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🔗</span> Official Reference Links</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
          {[
            { label: "RBI — TReDS Guidelines", url: "https://www.rbi.org.in", desc: "RBI master directions and circulars governing TReDS operations and participant regulations." },
            { label: "M1xchange", url: "https://www.m1xchange.com", desc: "Largest TReDS platform. Register as seller, buyer, or financier. Complete digital onboarding." },
            { label: "RXIL (NSE-SIDBI)", url: "https://www.rxil.in", desc: "Receivables Exchange of India. Joint venture between NSE and SIDBI for MSME receivables." },
            { label: "Invoicemart (A.TReDS)", url: "https://www.invoicemart.com", desc: "Axis Bank-backed TReDS platform with growing network of participating institutions." },
            { label: "Ministry of MSME", url: "https://msme.gov.in", desc: "Official guidelines on mandatory TReDS registration and MSME payment facilitation." },
            { label: "Udyam Registration", url: "https://udyamregistration.gov.in", desc: "Free MSME registration — mandatory requirement to participate as seller on TReDS." },
            { label: "MSME Samadhaan", url: "https://samadhaan.msme.gov.in", desc: "Government portal for filing delayed payment complaints against buyers. Complements TReDS." },
            { label: "MyScheme — TReDS", url: "https://www.myscheme.gov.in", desc: "Central scheme portal with TReDS information and eligibility checker." },
          ].map((ref, i) => (
            <a key={i} href={ref.url} target="_blank" rel="noreferrer" style={{ ...S.card, textDecoration: "none", display: "flex", flexDirection: "column", gap: "6px", cursor: "pointer", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = "rgba(6,182,212,0.3)"} onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
              <div style={{ fontWeight: 700, color: "#06B6D4", fontSize: "13px", display: "flex", justifyContent: "space-between" }}>{ref.label}<span>↗</span></div>
              <div style={{ color: "#71717A", fontSize: "12px" }}>{ref.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ ...S.infoBox("6,182,212"), borderLeft: "5px solid #06B6D4" }}>
        <h2 style={{ ...S.h2, marginBottom: "20px" }}>🚀 What To Do Next</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {[
            { step: "1", action: "Get Udyam Registration (free) if you don't have it — mandatory for TReDS seller registration", link: "https://udyamregistration.gov.in", cta: "Register Now →" },
            { step: "2", action: "Choose a TReDS platform (M1xchange, RXIL, Invoicemart) and complete online registration with KYC", link: "https://www.m1xchange.com", cta: "Register on M1xchange →" },
            { step: "3", action: "Upload your first approved invoice and wait for buyer acceptance on the platform", link: "https://www.rxil.in", cta: "Try RXIL Platform →" },
            { step: "4", action: "Compare financier bids and accept the best rate — funds arrive within 24-48 hours", link: "#", cta: "Start Discounting →" },
            { step: "5", action: "Ask your corporate buyers to register on TReDS — mandatory for companies >₹250Cr turnover", link: "https://msme.gov.in", cta: "Share Mandate Details →" },
            { step: "6", action: "Explore other MSME schemes like CGTMSE, MUDRA, and PMEGP for additional financing support", link: "#related", cta: "Related Schemes ↓" },
          ].map((ns, i) => (
            <a key={i} href={ns.link} target={ns.link.startsWith("http") ? "_blank" : "_self"} rel="noreferrer" style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: "10px", padding: "16px", textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(6,182,212,0.15)"} onMouseOut={e => e.currentTarget.style.background = "rgba(6,182,212,0.08)"}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(6,182,212,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#06B6D4", fontWeight: 800, fontSize: "13px" }}>{ns.step}</div>
              <div style={{ color: "#E4E4E7", fontSize: "13px", lineHeight: 1.5 }}>{ns.action}</div>
              <div style={{ color: "#06B6D4", fontSize: "12px", fontWeight: 700 }}>{ns.cta}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Related Schemes */}
      <div id="related" style={{ ...S.section, marginTop: "50px" }}>
        <h2 style={S.h2}><span style={{ background: "rgba(168,85,247,0.2)", padding: "8px 12px", borderRadius: "10px", fontSize: "20px" }}>🧩</span> Related MSME Financing Schemes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          {RELATED.map((r, i) => (
            <div key={i} style={{ ...S.card, display: "flex", gap: "14px", alignItems: "flex-start", cursor: r.onClick ? "pointer" : "default" }} onClick={r.onClick || undefined}>
              <span style={{ fontSize: "28px" }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "14px", marginBottom: "5px" }}>{r.name}</div>
                <div style={{ color: "#71717A", fontSize: "12px", lineHeight: 1.6, marginBottom: "10px" }}>{r.desc}</div>
                {r.onClick ? (
                  <button onClick={r.onClick} style={{ ...S.link, fontSize: "12px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>View Full Guide ↗</button>
                ) : (
                  <a href={r.link} target="_blank" rel="noreferrer" style={{ ...S.link, fontSize: "12px" }}>Learn More ↗</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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


  const systemPrompt = `You are IndiaFinBot, an ultra-fast, highly advanced AI Accounting & Business Advisor for India with specialized AI-powered Financial Statement Analysis capabilities.
${formatLanguageInstruction()} 

CRITICAL SPEED & COMPLETENESS: You must provide a comprehensive, end-to-end response instantly. Focus on high-speed delivery without sacrificing depth. For any 'all-in-one' requests, consolidate your entire strategy into one perfectly formatted master response. ABSOLUTELY NEVER break or truncate a markdown table mid-way. Every table MUST have ALL its rows fully completed with data before moving on. If a section has a table, complete it entirely with all rows and the closing pipe characters. Never leave a table header without its data rows.

User's Real-Time Profile context:
- Location / State: ${locationContext}
- Available Investment Capacity: ${investment || 'Not specified'}
- Core Business Interests: ${interests || 'Not specified'}
- Individual Skills/Experience: ${skills || 'Not specified'}
- Account: Premium Gemini 3.1 Pro User (${premiumUserEmail})

Your Core Capabilities & Guidelines:

🔍 AI SMART FINANCIAL ANALYSIS MODULE (PRIORITY):
When analyzing uploaded financial statements, bank statements, or transaction data, you MUST:

A. AUTOMATIC DATA EXTRACTION & INTELLIGENCE:
   - Extract ALL transaction data without missing a single entry
   - Identify transaction patterns: recurring payments, seasonal variations, irregular expenses
   - Detect income sources: primary revenue streams, secondary income, one-time receipts
   - Map expense categories: operational costs, fixed expenses, variable costs, discretionary spending
   - Calculate key metrics: total income, total expenses, net profit/loss, cash flow trends
   - Identify liabilities: outstanding loans, credit obligations, pending payments

B. FINANCIAL HEALTH INDICATORS:
   - Cash Flow Analysis: Positive/negative trends, liquidity position, working capital status
   - Profitability Ratios: Gross profit margin, net profit margin, ROI calculations
   - Expense Efficiency: Cost-to-revenue ratio, expense optimization opportunities
   - Financial Risks: Overdependence on single income source, high-risk expenditures, debt burden
   - Growth Potential: Revenue growth rate, scalability indicators, expansion opportunities

C. PATTERN RECOGNITION & ANOMALY DETECTION:
   - Identify unusual transactions or irregularities that need attention
   - Detect cash flow cycles: monthly patterns, quarterly trends, annual seasonality
   - Flag potential compliance issues or missing documentation
   - Highlight opportunities for tax savings and deductions

D. VISUAL INTELLIGENCE REPORTING:
   Present insights using structured formats:
   
   📊 TRANSACTION SUMMARY TABLE:
   | Category | Amount (₹) | % of Total | Trend |
   |----------|-----------|-----------|-------|
   | Income | X | Y% | ↑/↓ |
   | Expenses | X | Y% | ↑/↓ |
   
   📈 CASH FLOW VISUALIZATION:
   Generate recharts JSON for monthly cash flow trends showing income vs expenses
   
   💰 PROFIT/LOSS PROJECTION:
   Create 1-5 year financial projections based on historical data
   
   ⚠️ RISK DASHBOARD:
   List top 5 financial risks with severity ratings and mitigation strategies

E. INDIAN COMPLIANCE & REGULATORY ALIGNMENT:
   - GST Compliance: Verify GST calculations, input tax credit eligibility, filing requirements
   - Income Tax: Identify deductible expenses under Sections 80C, 80D, business deductions
   - TDS Compliance: Check TDS deductions, quarterly return requirements
   - State-Specific Rules: Apply ${locationContext} specific tax rates, local cess, state schemes
   - Audit Requirements: Flag if turnover crosses audit thresholds (₹1 Cr for business, ₹10 Cr for presumptive)

F. ACTIONABLE PROFIT OPTIMIZATION:
   - Cost Reduction Strategies: Identify top 3 expense categories to optimize
   - Revenue Enhancement: Suggest pricing adjustments, new revenue streams
   - Working Capital Management: Optimize receivables, payables, inventory
   - Tax Planning: Legal strategies to minimize tax liability
   - Investment Opportunities: Surplus fund deployment recommendations

G. NEXT-TERM PROFITABILITY ROADMAP:
   Based on transaction patterns, provide:
   - Concrete profit targets for next quarter/year
   - Step-by-step action plan with timelines
   - Expected ROI from each recommended action
   - Risk mitigation strategies
   - Monthly milestones and KPIs to track

1. End-To-End Statement Analysis: Perform deeply intelligent audit. DO NOT MISS A SINGLE TRANSACTION. Verify balances meticulously, trace all debit/credit paths.
2. Next-Term Profitability: ALWAYS project concrete roadmap for strong profits in NEXT term. Convert losses into high margin profits.
3. State/District Localization: Tailor answers to ${locationContext}. State-specific MSME subsidies, GST codes, industrial zones.
4. Concrete Practical Examples: Provide highly personalized examples mapping to user's requirements and limits.
5. Bank Statement Analysis: Analyze financial health deeply. Growth/loss inferences, cashflow cycles, 1-5 year projections.
6. Roadmap & Graphing: For statistics, P&L projections, output recharts JSON: \`\`\`recharts\n[{"name": "Year 1", "Revenue": 1500000, "Profit": 300000}]\n\`\`\`
7. Govt Schemes, Tax, & Loans: Localized schemes (CGTMSE, MUDRA), tax rebates, loan structures.
8. CA Connections: Provide Premium High-Fee CAs and Budget-Friendly Compliance CAs.
9. Visual Blueprinting: For 'visual blueprint' requests, respond with [GENERATE_IMAGE: <comprehensive prompt>].
10. Tone: Beautiful markdown, highly structured, encouraging, professional, mapped to Indian market logic.`;

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
      const API_BASE = import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://indiafinbot-4cef.onrender.com";

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
        
        // Generate image with multiple fallback options
        setTimeout(async () => {
          showNotification(t("notifPainting"));
          const seed = Math.floor(Math.random() * 1000000);
          const promptSuffix = `high quality, professional business photography, cinematic lighting, ${locationContext}, 4k, detailed`;
          const enhancedPrompt = `${imagePrompt}. ${promptSuffix}`;
          const encodedPrompt = encodeURIComponent(enhancedPrompt);
          
          // Try multiple image generation services with fallbacks
          const imageUrls = [
            `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`,
            `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`,
            `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1024&height=1024&seed=${seed}`
          ];
          
          let workingUrl = imageUrls[0];
          
          // Test image loading with timeout
          const testImageLoad = (url) => {
            return new Promise((resolve) => {
              const img = new Image();
              const timeout = setTimeout(() => {
                resolve(false);
              }, 5000);
              
              img.onload = () => {
                clearTimeout(timeout);
                resolve(true);
              };
              
              img.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
              };
              
              img.src = url;
            });
          };
          
          // Try each URL until one works
          for (const url of imageUrls) {
            const loaded = await testImageLoad(url);
            if (loaded) {
              workingUrl = url;
              break;
            }
          }
          
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMsgIdx = newMessages.findLastIndex(m => m.tempImage);
            if (lastMsgIdx !== -1) {
              const updatedContent = newMessages[lastMsgIdx].content.replace(
                `\n\n🎨 **Generating high-quality image...**\n`, 
                `\n\n![Vision](${workingUrl})\n\n*AI-generated visualization based on your business context*\n`
              );
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
          { text: `I have uploaded my ${isImage ? "image" : "financial document (bank statement/financial statement)"}: "${file.name}". 

🔍 COMPREHENSIVE AI FINANCIAL ANALYSIS REQUEST:

Please perform a complete AI-powered financial intelligence analysis with the following requirements:

1. AUTOMATIC DATA EXTRACTION:
   - Extract ALL transactions, income entries, and expense items
   - Identify transaction dates, amounts, descriptions, and categories
   - Calculate opening balance, closing balance, and verify accuracy

2. PATTERN RECOGNITION & INTELLIGENCE:
   - Identify recurring income sources and their reliability
   - Detect recurring expenses (subscriptions, EMIs, rent, utilities)
   - Find seasonal patterns and business cycles
   - Flag any irregular or suspicious transactions

3. FINANCIAL HEALTH ANALYSIS:
   - Calculate total income, total expenses, net profit/loss
   - Analyze cash flow trends (positive/negative, improving/declining)
   - Assess liquidity position and working capital
   - Identify financial risks and vulnerabilities

4. COMPLIANCE & REGULATORY CHECK (Indian Standards):
   - GST compliance status and input tax credit opportunities
   - Income Tax deduction eligibility (80C, 80D, business expenses)
   - TDS compliance verification
   - State-specific tax implications for ${locationContext}
   - Audit threshold checks

5. VISUAL INTELLIGENCE DASHBOARD:
   - Create transaction summary table with categories and percentages
   - Generate cash flow visualization (recharts format)
   - Show expense breakdown by category
   - Display profit/loss trends

6. PROFIT OPTIMIZATION ROADMAP:
   - Identify top 3 cost-cutting opportunities with expected savings
   - Suggest revenue enhancement strategies
   - Provide tax optimization recommendations
   - Calculate potential profit improvement

7. NEXT-TERM PROFITABILITY PROJECTION:
   - Based on historical data, project next quarter/year performance
   - Set realistic profit targets
   - Provide step-by-step action plan with timelines
   - Define KPIs to track progress

8. RISK ASSESSMENT:
   - List top 5 financial risks with severity ratings
   - Provide mitigation strategies for each risk
   - Highlight growth opportunities

Location Context: ${locationContext}
Business Type: ${interests || 'General Business'}
Investment Capacity: ${investment || 'Not specified'}

Please provide a comprehensive, structured analysis in ${lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : lang === 'ta' ? 'Tamil' : lang === 'te' ? 'Telugu' : lang === 'ml' ? 'Malayalam' : 'Kannada'} with clear sections, tables, and actionable insights.` }
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
        
        await sendMessage(visualMsg, `Here is my CSV financial statement data: \n\n${text.slice(0, 4000)}...\n\n🔍 COMPREHENSIVE AI FINANCIAL ANALYSIS REQUEST:\n\nPlease perform complete AI-powered financial intelligence analysis:\n\n1. DATA EXTRACTION: Extract all transactions, categorize income/expenses\n2. PATTERN ANALYSIS: Identify recurring patterns, seasonal trends, anomalies\n3. FINANCIAL HEALTH: Calculate profit/loss, cash flow, liquidity ratios\n4. COMPLIANCE CHECK: GST, Income Tax, TDS compliance for ${locationContext}\n5. VISUAL DASHBOARD: Create tables, charts (recharts format) for insights\n6. PROFIT OPTIMIZATION: Top 3 cost-cutting opportunities, revenue strategies\n7. NEXT-TERM PROJECTION: Concrete profitability roadmap with action plan\n8. RISK ASSESSMENT: Top 5 risks with mitigation strategies\n\nContext: ${locationContext} | Business: ${interests || 'General'} | Investment: ${investment || 'Not specified'}\n\nProvide structured analysis with clear sections, actionable insights, and compliance recommendations.`);
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
      <ReactParticles />

      {notification && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: "rgba(0,180,216,0.9)", color: "#fff", padding: "12px 24px", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.3)", animation: "tdot 0.3s ease-in-out", fontWeight: 600 }}>
          🔔 {notification}
        </div>
      )}

      <StockTicker />

      {/* Modern Header */}
      <div className="glass-panel" style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(0, 180, 216, 0.2)", padding: "10px 20px" }}>
        <div className="nav-header" style={{ maxWidth: "100%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #3B82F6, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)", border: "1px solid rgba(255,255,255,0.1)" }}>🇮🇳</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#FFF", letterSpacing: "-1px" }}>IndiaFin<span style={{ color: "#06B6D4" }}>Bot</span></div>
            </div>
          </div>

          <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "6px", border: "1px solid rgba(255,255,255,0.05)", gap: "4px", flexWrap: "wrap", justifyContent: "center", backdropFilter: "blur(10px)" }}>
            <button onClick={() => { setActiveTab("overview"); setSelectedDetailId(null); }} className="nav-tab fade-in-up" style={{ animationDelay: "0.1s", background: activeTab === "overview" ? "rgba(255,255,255,0.1)" : "transparent", color: activeTab === "overview" ? "#FFF" : "#A1A1AA", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px" }}>📊 Overview</button>
            <button onClick={() => setActiveTab("schemes")} className="nav-tab fade-in-up" style={{ animationDelay: "0.2s", background: activeTab === "schemes" ? "rgba(255,255,255,0.1)" : "transparent", color: activeTab === "schemes" ? "#FFF" : "#A1A1AA", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}>🏛️ Schemes</button>
            <button onClick={() => setActiveTab("chat")} className="nav-tab fade-in-up" style={{ animationDelay: "0.3s", background: activeTab === "chat" ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))" : "transparent", color: activeTab === "chat" ? "#FFF" : "#A1A1AA", padding: "8px 20px", borderRadius: "8px", border: "1px solid", borderColor: activeTab === "chat" ? "rgba(59,130,246,0.3)" : "transparent", cursor: "pointer", fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s", textShadow: activeTab === "chat" ? "0 0 10px rgba(255,255,255,0.2)" : "none" }}>🤖 AI Smart Analysis</button>
            <button onClick={() => setActiveTab("inspire")} className="nav-tab fade-in-up" style={{ animationDelay: "0.4s", background: activeTab === "inspire" ? "rgba(255,255,255,0.1)" : "transparent", color: activeTab === "inspire" ? "#FFF" : "#A1A1AA", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}>🌟 Markets</button>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
              style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", color: "#FFF", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", outline: "none", fontWeight: 600, fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", color: "#FFF", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", outline: "none", fontWeight: 600, fontSize: "13px" }}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="ml">മലയാളം</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>

            <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(""); }} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", color: "#FFF", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", outline: "none", fontWeight: 600, fontSize: "13px", maxWidth: "100%" }}>
              <option value="">{t("selectState")}</option>
              {Object.keys(INDIA_STATES).map(state => <option key={state} value={state}>{state}</option>)}
            </select>
            <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedState} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", color: "#FFF", border: "1px solid rgba(255,255,255,0.08)", opacity: !selectedState ? 0.4 : 1, cursor: "pointer", outline: "none", fontWeight: 600, fontSize: "13px", maxWidth: "100%" }}>
              <option value="">{t("selectDistrict")}</option>
              {selectedState && INDIA_STATES[selectedState].dists.map(dist => <option key={dist} value={dist}>{dist}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="main-container">
        
        <button 
          onClick={() => setSidebarVisible(!sidebarVisible)} 
          style={{ position: "absolute", left: sidebarVisible ? "392px" : "12px", top: "12px", zIndex: 100, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFF", width: "40px", height: "40px", borderRadius: "10px", cursor: "pointer", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
          title={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
        >
          {sidebarVisible ? "«" : "»"}
        </button>

        {/* Universal Left Sidebar: Profile Details */}
        <div className={`sidebar glass-panel custom-scrollbar ${!sidebarVisible ? 'hide-sidebar' : ''}`} style={{ borderRadius: "20px", display: "flex", flexDirection: "column", padding: sidebarVisible ? "35px 25px" : "0", overflowY: "auto" }}>
          {sidebarVisible && (
            <>
              <h3 style={{ color: "#FFF", margin: "0 0 20px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: 10, fontWeight: 700, whiteSpace: "nowrap" }}><span style={{ background: "rgba(59, 130, 246, 0.2)", color: "#3B82F6", padding: "6px", borderRadius: "8px", fontSize: "16px" }}>🚀</span> {t("startupConfig")}</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div>
              <label style={labelStyle}>{t("investmentLabel")}</label>
              <select value={investment} onChange={e => setInvestment(e.target.value)} style={{...inputStyle, background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", color: "#FFF"}}>
                <option value="" style={{ background: "#111216", color: "#A1A1AA" }}>{t("investmentPlaceholder")}</option>
                {INVESTMENT_RANGES.map((r, i) => <option key={i} value={r} style={{ background: "#111216", color: "#fff" }}>{r}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>{t("interestsLabel")}</label>
              <select value={interests} onChange={e => setInterests(e.target.value)} style={{...inputStyle, background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", color: "#FFF"}}>
                <option value="" style={{ background: "#111216", color: "#A1A1AA" }}>{t("interestsPlaceholder")}</option>
                {BUSINESS_VERTICALS.map((v, i) => <option key={i} value={v} style={{ background: "#111216", color: "#fff" }}>{v}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>{t("skillsLabel")}</label>
              <select value={skills} onChange={e => setSkills(e.target.value)} style={{...inputStyle, background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", color: "#FFF"}}>
                <option value="" style={{ background: "#111216", color: "#A1A1AA" }}>{t("skillsPlaceholder")}</option>
                {FOUNDER_SKILLS.map((s, i) => <option key={i} value={s} style={{ background: "#111216", color: "#fff" }}>{s}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              const fullMsg = `${t("prefixLocation")} ${locationContext}.\n${t("prefixInvestment")} ${investment || 'Not specified'}\n${t("prefixInterests")} ${interests || 'Not specified'}\n${t("prefixSkills")} ${skills || 'Not specified'}\n\n${t("msgRunAnalysis")}`;
              sendMessage(fullMsg);
            }}
            style={{ padding: "14px", marginTop: "20px", borderRadius: "8px", background: "linear-gradient(135deg, #3B82F6, #06B6D4)", color: "#FFF", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontWeight: 600, fontSize: "14px", boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)", transition: "transform 0.2s" }}
            onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
            {t("runAnalysisBtn")}
          </button>

          <div style={{ marginTop: "32px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px" }}>
            <h4 style={{ color: "#71717A", margin: "0 0 12px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>{t("govtPortals")}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a href="https://www.gst.gov.in" target="_blank" rel="noreferrer" style={{ color: "#F4F4F5", textDecoration: "none", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", fontWeight: 500 }} onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>🧾 {t("gstPortal")}</span> <span style={{ color: "#71717A" }}>↗</span></a>
              <a href="https://udyamregistration.gov.in" target="_blank" rel="noreferrer" style={{ color: "#F4F4F5", textDecoration: "none", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", fontWeight: 500 }} onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>🏢 {t("msmePortal")}</span> <span style={{ color: "#71717A" }}>↗</span></a>
              <a href="https://www.startupindia.gov.in" target="_blank" rel="noreferrer" style={{ color: "#F4F4F5", textDecoration: "none", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", fontWeight: 500 }} onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}><span>🚀 {t("startupPortal")}</span> <span style={{ color: "#71717A" }}>↗</span></a>
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

          <div style={{ marginTop: "32px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px", paddingBottom: "24px" }}>
            <h4 style={{ color: "#71717A", margin: "0 0 12px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Live Bank Loans ('25-'26)</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {ALL_BANKS_DATA.govt.slice(0, 3).map((bank, i) => (
                <a key={`govt-${i}`} href={bank.link} target="_blank" rel="noreferrer" style={{ color: "#F4F4F5", textDecoration: "none", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", fontWeight: 500 }} onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}>
                   <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontWeight: 600, color: "#E4E4E7", marginBottom: 2 }}>{bank.name}</span><span style={{ fontSize: "11px", color: "#A1A1AA" }}>MSME/Biz: <strong style={{color:"#3B82F6", fontWeight: 700}}>{bank.rate}</strong></span></div> <span style={{ color: "#71717A" }}>↗</span>
                </a>
              ))}
              {ALL_BANKS_DATA.private.slice(0, 3).map((bank, i) => (
                <a key={`pvt-${i}`} href={bank.link} target="_blank" rel="noreferrer" style={{ color: "#F4F4F5", textDecoration: "none", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", fontWeight: 500 }} onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}>
                   <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontWeight: 600, color: "#E4E4E7", marginBottom: 2 }}>{bank.name}</span><span style={{ fontSize: "11px", color: "#A1A1AA" }}>Startup/Biz: <strong style={{color:"#10B981", fontWeight: 700}}>{bank.rate}</strong></span></div> <span style={{ color: "#71717A" }}>↗</span>
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
          <div className="content-area glass-panel custom-scrollbar" style={{ borderRadius: "20px", padding: "30px" }}>

            {!selectedDetailId ? (
              <div className="fade-in-up">
                <h1 style={{ fontSize: "42px", margin: "0 0 15px 0", color: "#FFF", fontWeight: 900, letterSpacing: "-1.5px" }} className="gradient-text">{t("welcomeTitle")}</h1>
                <p style={{ fontSize: "18px", color: "#94a3b8", margin: "0 0 45px 0", maxWidth: "800px", lineHeight: 1.7, fontWeight: 500 }}>{t("welcomeDesc")}</p>

                <div className="grid-cards fade-in-up" style={{ animationDelay: "0.2s" }}>
                  {OVERVIEW_CARDS.map((card, i) => (
                    <div key={i} onClick={() => setSelectedDetailId(card.id)} className="service-card glass-panel float-hover fade-in-up" style={{ animationDelay: `${0.1 * i}s`, borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.08)" }}>
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

                <div className="glass-panel" style={{ marginTop: "40px", padding: "30px", borderRadius: "16px", background: "rgba(59, 130, 246, 0.05)", borderLeft: "4px solid #3B82F6" }}>
                  <h3 style={{ color: "#FFF", margin: "0 0 10px 0" }}>{t("regionalLogic")} <span style={{ color: "#3B82F6", fontWeight: 800 }}>{locationContext}</span></h3>
                  <p style={{ color: "#A1A1AA", lineHeight: 1.6, margin: 0 }}>{t("regionalLogicDesc")}</p>
                </div>

                {/* Massive Interactive Map Section Loading Here */}
                <div style={{ marginTop: "40px" }}>
                  <IndiaMapZone stateCode={selectedState} theme={theme} />
                </div>

                <LoanCalculator theme={theme} />

                <TaxComplianceCalendar theme={theme} />

                <QuickToolsGrid theme={theme} sendMessage={sendMessage} t={t} />
              </div>
            ) : (
              renderInteractiveDashboard(OVERVIEW_CARDS.find(c => c.id === selectedDetailId))
            )}

          </div>
        )}

        {activeTab === "inspire" && (
          <div className="content-area glass-panel custom-scrollbar fade-in-up" style={{ borderRadius: "20px", padding: "35px" }}>
            <h1 style={{ fontSize: "40px", margin: "0 0 35px 0", color: "#FFF", fontWeight: 900, letterSpacing: "-1px" }} className="gradient-text">{t("inspireTitle")}</h1>

            <h2 style={{ fontSize: "26px", color: "#FFF", margin: "0 0 25px 0", fontWeight: 800 }}>🌟 <span style={{ color: "#06B6D4" }}>{t("leadersTitle")}</span></h2>
            <div className="grid-cards" style={{ marginBottom: "50px" }}>
              {SECTOR_LEADERS.map((leader, i) => (
                <div key={i} className="glass-panel float-hover fade-in-up" style={{ animationDelay: `${i*0.1}s`, borderRadius: "20px", padding: "25px", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, background: "rgba(6,182,212,0.1)", borderRadius: "50%", filter: "blur(20px)" }}></div>
                  <img src={leader.image} alt={leader.name} style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", marginBottom: "20px", border: "2px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", color: "#FFF" }}>{leader.name}</h3>
                  <p style={{ margin: "0 0 15px 0", color: "#3B82F6", fontSize: "14px", fontWeight: 600 }}>{leader.company} | {leader.role}</p>
                  <p style={{ margin: 0, fontStyle: "italic", color: "#71717A", fontSize: "14px", lineHeight: 1.5 }}>"{leader.quote}"</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
              <div>
                <h2 style={{ fontSize: "22px", color: "#3B82F6", margin: "0 0 20px 0", fontWeight: 700 }}>{t("mediaTitle")}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {YOUTUBE_CHANNELS.map((ch, i) => (
                    <div key={i} className="glass-panel focus-lift" style={{ padding: "20px", borderRadius: "12px", borderLeft: "4px solid #3B82F6", transition: "all 0.2s" }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#FFF", fontSize: "16px", fontWeight: 700 }}>{ch.name} <span style={{ color: "#71717A", fontSize: "13px", fontWeight: "normal" }}>({ch.handle})</span></h4>
                      <p style={{ margin: "0 0 15px 0", color: "#A1A1AA", fontSize: "14px", lineHeight: 1.5 }}>{ch.desc}</p>
                      <a href={ch.link} target="_blank" rel="noreferrer" style={{ color: "#3B82F6", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>Watch & Learn →</a>
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
          <div className="content-area glass-panel custom-scrollbar fade-in-up" style={{ borderRadius: "20px", padding: "35px" }}>
            <h1 style={{ fontSize: "40px", margin: "0 0 15px 0", color: "#FFF", fontWeight: 900, letterSpacing: "-1px" }} className="gradient-text">🏛️ Government Schemes & Pro</h1>
            <p style={{ color: "#94a3b8", fontSize: "18px", marginBottom: "45px", maxWidth: "800px", lineHeight: 1.7, fontWeight: 500 }}>Explore end-to-end verified India compensation frameworks, deep research limits, and exact startup subsidy allowances. Match your profile against top-tier MSME programs to unlock direct capital.</p>

            <div className="grid-cards fade-in-up" style={{ animationDelay: "0.2s", marginBottom: "50px" }}>
              {GOVERNMENT_SCHEMES.map((scheme, i) => (
                <div key={i} className="glass-panel float-hover fade-in-up" style={{ animationDelay: `${i*0.1}s`, borderRadius: "20px", padding: "30px", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden", cursor: [1,2,3,4,5].includes(scheme.rank) ? "pointer" : "default" }}
                  onClick={() => { if (scheme.rank === 1) setActiveTab("cgtmse"); if (scheme.rank === 2) setActiveTab("pmmy"); if (scheme.rank === 3) setActiveTab("pmegp"); if (scheme.rank === 4) setActiveTab("pli"); if (scheme.rank === 5) setActiveTab("treds"); }}>
                  <div style={{ position: "absolute", top: -20, right: -20, fontSize: "80px", opacity: 0.05 }}>{scheme.icon}</div>
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 15, border: "1px solid rgba(255,255,255,0.05)" }}>
                    {scheme.icon}
                  </div>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "#FFF", fontWeight: 700 }}>{scheme.title}</h3>
                  <p style={{ margin: "0 0 20px 0", color: "#94a3b8", fontSize: "14px", lineHeight: 1.6 }}>{scheme.desc}</p>

                  <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", padding: "10px", borderRadius: "8px", marginBottom: "20px" }}>
                    <span style={{ display: "block", color: "#10B981", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Available Subsidy / Coverage</span>
                    <span style={{ color: "#FFF", fontSize: "14px", fontWeight: 600 }}>{scheme.coverage}</span>
                  </div>

                  {[1,2,3,4,5].includes(scheme.rank) ? (
                    <button onClick={(e) => { e.stopPropagation(); const tabMap = {1:"cgtmse",2:"pmmy",3:"pmegp",4:"pli",5:"treds"}; setActiveTab(tabMap[scheme.rank]); }} style={{ display: "inline-block", background: scheme.rank === 1 ? "linear-gradient(135deg, #3B82F6, #06B6D4)" : scheme.rank === 2 ? "linear-gradient(135deg, #F59E0B, #EF4444)" : scheme.rank === 3 ? "linear-gradient(135deg, #16A34A, #06B6D4)" : scheme.rank === 4 ? "linear-gradient(135deg, #A855F7, #F59E0B)" : "linear-gradient(135deg, #06B6D4, #3B82F6)", color: "#FFF", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700, transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                      📄 Full Guide & Apply ↗
                    </button>
                  ) : (
                    <a href={scheme.link} target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "linear-gradient(135deg, #00B4D8, #0284c7)", color: "#FFF", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 700, transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                      Apply / Research ↗
                    </a>
                  )}
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

        {activeTab === "cgtmse" && <CGTMSEDetailPage setActiveTab={setActiveTab} />}
        {activeTab === "pmmy" && <PMMYDetailPage setActiveTab={setActiveTab} />}
        {activeTab === "pmegp" && <PMEGPDetailPage setActiveTab={setActiveTab} />}
        {activeTab === "pli" && <PLIDetailPage setActiveTab={setActiveTab} />}
        {activeTab === "treds" && <TReDSDetailPage setActiveTab={setActiveTab} />}

        {activeTab === "privacy" && (
          <div className="content-area glass-panel custom-scrollbar fade-in-up" style={{ borderRadius: "20px", padding: "40px" }}>
            <button onClick={() => setActiveTab("overview")} style={{ marginBottom: "30px", padding: "10px 18px", background: "rgba(255,255,255,0.05)", color: "#E4E4E7", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: 600, transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.background="rgba(255,255,255,0.1)"}} onMouseOut={e => {e.currentTarget.style.background="rgba(255,255,255,0.05)"}}>← Back to Home</button>
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
          <div className="content-area glass-panel custom-scrollbar fade-in-up" style={{ borderRadius: "20px", padding: "40px" }}>
            <button onClick={() => setActiveTab("overview")} style={{ marginBottom: "30px", padding: "10px 18px", background: "rgba(255,255,255,0.05)", color: "#E4E4E7", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: 600, transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.background="rgba(255,255,255,0.1)"}} onMouseOut={e => {e.currentTarget.style.background="rgba(255,255,255,0.05)"}}>← Back to Home</button>
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
          <div className="content-area glass-panel custom-scrollbar fade-in-up" style={{ borderRadius: "20px", padding: "40px" }}>
            <button onClick={() => setActiveTab("overview")} style={{ marginBottom: "30px", padding: "10px 18px", background: "rgba(255,255,255,0.05)", color: "#E4E4E7", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: 600, transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.background="rgba(255,255,255,0.1)"}} onMouseOut={e => {e.currentTarget.style.background="rgba(255,255,255,0.05)"}}>← Back to Home</button>
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
          <div className="content-area glass-panel fade-in-up" style={{ display: "flex", flexDirection: "column", borderRadius: "20px", overflow: "hidden", position: "relative" }}>
            <div className="chat-messages-container custom-scrollbar" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 18, padding: "30px" }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", width: "100%" }}>
                  {msg.role !== "user" && <div style={{ minWidth: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #3B82F6, #06B6D4)", marginRight: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)", flexShrink: 0 }}>🤖</div>}
                  <div className={msg.role === "user" ? "chat-user" : "chat-bot"} style={{ padding: "20px 25px", borderRadius: "16px", borderTopRightRadius: msg.role === "user" ? 4 : 16, borderTopLeftRadius: msg.role !== "user" ? 4 : 16, maxWidth: "80%", lineHeight: 1.7, fontSize: "15px", overflowX: "auto" }}>
                    {msg.isUploading ? (
                      <div><TypingDots /> <span style={{ marginLeft: 10, color: "#00B4D8" }}>{msg.content}</span></div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ _node, ...props }) => <h1 style={{ color: "#FFF", marginTop: 0, fontSize: "24px", fontWeight: 800, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10 }} {...props} />,
                          h2: ({ _node, ...props }) => <h2 style={{ color: "#3B82F6", marginTop: 25, fontSize: "20px", fontWeight: 700 }} {...props} />,
                          h3: ({ _node, ...props }) => <h3 style={{ color: "#E4E4E7", margin: "20px 0 10px", fontWeight: 600 }} {...props} />,
                          strong: ({ _node, ...props }) => <strong style={{ color: "#FFF", fontWeight: 700 }} {...props} />,
                          a: ({ _node, ...props }) => <a style={{ color: "#06B6D4", textDecoration: "none", fontWeight: 600 }} {...props} />,
                          ul: ({ _node, ...props }) => <ul style={{ paddingLeft: 20, margin: "15px 0" }} {...props} />,
                          li: ({ _node, ...props }) => <li style={{ margin: "8px 0" }} {...props} />,
                          table: ({ _node, ...props }) => <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0", background: "rgba(255,255,255,0.02)", borderRadius: 8 }} {...props} /></div>,
                          th: ({ _node, ...props }) => <th style={{ padding: "12px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.05)", color: "#E4E4E7", textAlign: "left" }} {...props} />,
                          td: ({ _node, ...props }) => <td style={{ padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }} {...props} />,
                          img: function ImgWithHooks({ _node, ...props }) {
                            const [src, setSrc] = useState(props.src || "");
                            const [errorCount, setErrorCount] = useState(0);

                            useEffect(() => {
                              if (!src.startsWith("http")) {
                                const visualPrompt = `${src} in ${locationContext} business style, professional photography`;
                                setSrc(`https://image.pollinations.ai/prompt/${encodeURIComponent(visualPrompt)}?width=1200&height=800&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`);
                              }
                            }, [src]);

                            const handleError = () => {
                              if (errorCount < 3) {
                                const newSeed = Math.floor(Math.random() * 10000000);
                                const newSrc = src.includes("seed=") 
                                  ? src.replace(/seed=\d+/, `seed=${newSeed}`)
                                  : `${src}&seed=${newSeed}`;
                                setSrc(newSrc);
                                setErrorCount(prev => prev + 1);
                              }
                            };

                            return (
                              <div style={{ position: "relative", width: "100%", minHeight: src ? 200 : 0 }}>
                                <img 
                                  style={{ maxWidth: "100%", borderRadius: 12, marginTop: 15, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 20px rgba(0,0,0,0.3)", display: "block" }} 
                                  {...props} 
                                  src={src} 
                                  onError={handleError}
                                />
                                {errorCount >= 3 && <div style={{ color: "#FF6B35", fontSize: "12px", marginTop: 10 }}>⚠️ Image service busy. Try refreshing the chat.</div>}
                              </div>
                            );
                          },
                          code: ({ _node, inline, className, children, ...props }) => {
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
                              } catch {
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
                  <div style={{ minWidth: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #3B82F6, #06B6D4)", marginRight: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)", flexShrink: 0 }}>🤖</div>
                  <div className="chat-bot" style={{ padding: "15px 25px", borderRadius: "16px", borderTopLeftRadius: 4 }}><TypingDots /></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: "20px 30px", background: "rgba(10, 11, 14, 0.8)", borderTop: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>
              <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg" style={{ display: "none" }} />
                <button
                  onClick={() => fileInputRef.current.click()}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#E4E4E7", padding: "14px 20px", borderRadius: 12, cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", whiteSpace: "nowrap" }}
                  onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "scale(1)"; }}>
                  <span style={{ fontSize: "18px" }}>📈</span> {t("uploadBtn")}
                </button>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                  placeholder={isListening ? "🎙️ Listening..." : "Ask IndiaFinBot a question..."}
                  style={{ flex: 1, padding: "16px 22px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", color: "#fff", fontSize: "15px", outline: "none", transition: "border 0.3s" }}
                  onFocus={e => e.target.style.borderColor = "#3B82F6"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button
                  onClick={toggleMic}
                  style={{ background: isListening ? "rgba(239, 68, 68, 0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${isListening ? "#ef4444" : "rgba(255,255,255,0.1)"}`, color: isListening ? "#ef4444" : "#E4E4E7", padding: "15px", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  title="Voice Input"
                >
                  <span className={isListening ? "pulse-anim" : ""} style={{ fontSize: "18px" }}>🎙️</span>
                </button>
                <button
                  onClick={() => sendMessage(input)}
                  style={{ padding: "16px 35px", borderRadius: 12, background: "linear-gradient(135deg, #3B82F6, #06B6D4)", color: "#FFF", border: "1px solid rgba(255,255,255,0.1)", cursor: input.trim() ? "pointer" : "default", fontWeight: 700, fontSize: "15px", boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)", transition: "transform 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
                  Launch 🚀
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
