export const INDIA_STATES = {
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

export const BUSINESS_VERTICALS = ["Retail", "IT Services", "Manufacturing", "Agriculture", "Healthcare", "Education", "FinTech", "E-commerce", "Hospitality", "CleanTech", "Logistics", "Real Estate", "Professional Services", "Energy"];
export const FOUNDER_SKILLS = ["Operations", "Marketing", "Finance", "Sales", "Technical", "HR", "Legal", "Management", "Product Design", "Strategy", "Data Analysis", "Project Management"];
export const INVESTMENT_RANGES = ["₹50,000 - ₹2 Lakhs", "₹2 Lakhs - ₹5 Lakhs", "₹5 Lakhs - ₹10 Lakhs", "₹10 Lakhs - ₹25 Lakhs", "₹25 Lakhs - ₹50 Lakhs", "₹50 Lakhs - ₹1 Crore", "₹1 Crore - ₹5 Crores", "Above ₹5 Crores"];

export const SECTOR_LEADERS = [
  { name: "Ratan Tata", company: "Tata Group", quote: "Ups and downs in life are very important to keep us going.", role: "Industrialist", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" },
  { name: "Narayana Murthy", company: "Infosys", quote: "In God we trust, everybody else must bring data.", role: "IT Pioneer", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
  { name: "Falguni Nayar", company: "Nykaa", quote: "Think big, but start small.", role: "E-commerce Founder", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
];

export const YOUTUBE_CHANNELS = [
  { name: "CA Rachana Ranade", desc: "Top Indian finance educator covering stock markets and corporate accounting.", handle: "@carachanaranade", link: "https://youtube.com/c/carachanaranade" },
  { name: "Pranjal Kamra", desc: "Simplifying personal finance, mutual funds, and business investments.", handle: "@pranjalkamra", link: "https://youtube.com/c/pranjalkamra" },
  { name: "Labour Law Advisor", desc: "Expert advice on HR, payroll, taxes, and labor laws for Indian businesses.", handle: "@LabourLawAdvisor", link: "https://youtube.com/c/LabourLawAdvisor" },
];

export const INFLUENCERS_DB = {
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

export const CA_DATABASES = {
  high: [
    { name: "Deloitte India", type: "Top-Tier Firm", fee: "₹50k - ₹2L/mo", services: "Audit, M&A, Int. Taxation", email: "contact@deloitte.in", phone: "+91-22-6185-4000" },
    { name: "KPMG India", type: "Big 4 Partner", fee: "₹40k - ₹1.5L/mo", services: "Corporate Finance, Risk", email: "india@kpmg.com", phone: "+91-124-307-4000" }
  ],
  low: [
    { name: "Local Area CA & Associates", type: "Budget Compliance", fee: "₹3k - ₹10k/mo", services: "GST Filing, Bookkeeping, ITR", email: "hello@localca.in", phone: "+91-98765-43210" },
    { name: "TaxMate Solutions", type: "Startup Focused", fee: "₹5k - ₹12k/mo", services: "Company Incorporation, TDS", email: "support@taxmate.in", phone: "+91-91234-56789" }
  ]
};

export const GOVERNMENT_SCHEMES = [
  { rank: 1, title: "CGTMSE Scheme (Credit Guarantee)", desc: "Collateral-free credit to micro and small enterprises. Default guarantee up to ₹5 Crore.", icon: "🏦", coverage: "Up to 85%", link: "https://www.cgtmse.in" },
  { rank: 2, title: "PMMY (MUDRA Loans)", desc: "Micro finance up to ₹10 Lakhs for non-corporate, non-farm scale startups.", icon: "🪙", coverage: "Shishu, Kishore, Tarun slabs", link: "https://www.mudra.org.in" },
  { rank: 3, title: "PMEGP (Employment Gen.)", desc: "Credit-linked subsidy to set up new micro-businesses and generate domestic employment.", icon: "🏭", coverage: "15% - 35% project cost subsidies", link: "https://www.kviconline.gov.in" },
  { rank: 4, title: "PLI (Production Linked Incentive)", desc: "Boost domestic manufacturing capabilities and enhance large-scale exports.", icon: "⚙️", coverage: "4% - 6% core incremental sales rebate", link: "https://www.makeinindia.com" },
  { rank: 5, title: "TReDS (Trade Receivables)", desc: "Facilitate quick vendor discounting of MSME trade receivables from corporate buyers.", icon: "📜", coverage: "Automated factoring & liquidity", link: "https://www.rbi.org.in" },
  { rank: 6, title: "Stand-Up India Scheme", desc: "Loans extending ₹10 Lakhs to ₹1 Crore for greenfield enterprises led by SC/ST/Women.", icon: "👩‍💼", coverage: "Credit-growth assurance", link: "https://www.standupmitra.in" }
];

export const MARKET_DATA_5Y = [
  { year: "Year 1", TopTier: 15, MidCap: 8, SmallScale: 20, Startup: -40 },
  { year: "Year 2", TopTier: 12, MidCap: 15, SmallScale: 10, Startup: -20 },
  { year: "Year 3", TopTier: 20, MidCap: 25, SmallScale: 15, Startup: 10 },
  { year: "Year 4", TopTier: 18, MidCap: 22, SmallScale: 30, Startup: 45 },
  { year: "Year 5", TopTier: 22, MidCap: 30, SmallScale: 40, Startup: 80 },
];

export const TOP_COMPANIES_DATA = [
  { rank: 1, name: "Reliance Industries", category: "Top-Tier", revenue: "₹9.78 Lakh Cr", profit: "₹73,670 Cr", growth: "+12%" },
  { rank: 2, name: "TCS", category: "Top-Tier", revenue: "₹2.25 Lakh Cr", profit: "₹42,303 Cr", growth: "+9%" },
  { rank: 25, name: "Varun Beverages", category: "Mid-Cap", revenue: "₹13,173 Cr", profit: "₹1,550 Cr", growth: "+21%" },
  { rank: 40, name: "Polycab India", category: "Medium", revenue: "₹14,107 Cr", profit: "₹1,282 Cr", growth: "+18%" },
  { rank: 85, name: "Local Retail Hubs", category: "Small-Scale", revenue: "₹5-50 Cr", profit: "₹1-5 Cr", growth: "+5%" },
  { rank: "N/A", name: "Modern AI Startups", category: "Startup", revenue: "₹0-5 Cr", profit: "-₹2 Cr (Loss)", growth: "+310%" },
];

export const ALL_BANKS_DATA = {
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

