import { Industry, Member } from './types';

export const MOCK_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Sarah Jenkins',
    company: 'Pixel Perfect Web',
    industry: Industry.TECHNOLOGY,
    specialty: 'Web Development',
    asks: [
      'Introduction to Marketing Directors at mid-sized firms',
      'Small businesses needing e-commerce solutions',
      'Graphic designers looking for dev partners'
    ],
    gives: [
      'Custom WordPress Development',
      'React Web Applications',
      'Website Maintenance Packages'
    ],
    avatar: 'https://picsum.photos/200/200?random=1',
    email: 'sarah@pixelperfect.com',
    phoneNumber: '919876543210',
    chapterRole: 'Member'
  },
  {
    id: 'm2',
    name: 'David Chen',
    company: 'Growth Digital',
    industry: Industry.MARKETING,
    specialty: 'SEO & SEM',
    asks: [
      'Companies launching new websites',
      'Businesses with low Google Maps rankings',
      'Real estate agents needing lead gen'
    ],
    gives: [
      'SEO Audits',
      'Google Ads Management',
      'Content Strategy'
    ],
    avatar: 'https://picsum.photos/200/200?random=2',
    email: 'david@growthdigital.com',
    phoneNumber: '919876543211',
    chapterRole: 'Member'
  }
];

const RAW_PLATINA_DATA = [
  { name: 'Ajay Gumbar', gives: ['Manvendra Prasad (Intellex)', 'Surjit Wahl (Bharti Axa Life)', 'Amit Arora (Mability Labs)', 'Nalin Bhandari (India First Life)'], asks: ['Subhash Agarwal (Max Life Insurance)', 'Insurance professionals'] },
  { name: 'Alok Ranjan', gives: ['Yotta Data Services', 'Arvind Chander (Mindstream)', 'Raghav Maheshwari (Altpac)', 'Ongrid Owners', 'Mangesh Magician'], asks: ['Real Estate Developers', 'Digital Marketing Heads', 'M3M/DLF Digital Heads', 'Marketing Agencies'] },
  { name: 'Anjali Mathur', gives: ['Vijeta (GMR)', 'HR events professionals', 'KKR HR', 'Vansh (Shriram Pistons)', 'Satyendra (Stryker)'], asks: ['HR Training GMR', 'Tower Research HR', 'Power Research HR', 'Training professionals'] },
  { name: 'Arjit Benjamin', gives: ['Pawan Baid (ABCI Infra)', 'Sanjay Dahuja (Berkley Motors)', 'Abhishek Tyagi (Vidya Electronics)', 'Anu Vishal Mittal (Adidas)', 'Saivaits (Crystal Glass)'], asks: ['Rajeev Nair (HP Legal)', 'Tarun Sharma (Hyphen Cosmetics)', 'Pharma company owners'] },
  { name: 'Chandan Monga', gives: ['Shiraz (DesqWorx)', 'Rajesh (XYG Glass)', 'Ashutosh (Gold Plus Glass)', 'Vipin Chohan (AVM Electronics)'], asks: ['Restaurants, Retail spaces, Hotels, Co-working spaces', 'Architects & Interior Designers'] },
  { name: 'Charru Kulthia', gives: ['Shashank Tiwari (30 Sunday VP)'], asks: ['Architects & Interiors', 'DLF Commercial Leasing Head', 'Commercial spaces owners'] },
  { name: 'Dharmesh Sharma', gives: ['Mandeep Singh (Indus Group)', 'Mukesh Kumar (M3M)', 'Deepak Singla (SP Singla)', 'Prabodh Kumar (Juniper)', 'Nilesh Rai (HMSI)', 'Dinesh Rai (Honda)', 'Satyendra Vidhyarthi (Saco Infra)'], asks: ['Solar EPC Companies', 'Friends & Family Insurance', 'CFO Ecapan Prefab', 'Purchase Head Orient Cables'] },
  { name: 'Divyanshu Verma', gives: ['Abhishek Kaushal (SCW)', 'Arun Yadav (Maersk)', 'Neeraj Ahuja (EA Tech)', 'Sandeep Bawlia (Oxytal)', 'Himanshu Verma (Singapore News)', 'Rishabh Jain'], asks: ['Kindergartens, Playschools, Schools for web dev', 'Real estate consultants', 'Insurance companies', 'Business Owners for web/content dev'] },
  { name: 'Dr Rahul Raj', gives: ['Dr SP Kataria (Medanta Hospital)', 'Dr Anurag Jain (Safdarjung)'], asks: ['Friends & Family dental care', 'Smile correction', 'Missing teeth replacement', 'Medical Tourism (Dental)'] },
  { name: 'Gaurav Sarna', gives: ['Shamit Ajmani (Lavanya Banquets)', 'Anuj Sharma (Ramada Hotel)', 'Divya Grover (Mastercard)', 'Puneet Mathur (Tissot)', 'Sunny (Watch Showroom)', 'Sanjeev Datta (Personality School)', 'Jatin Narang (Krishna Overseas)'], asks: ['Wedding Functions', 'Destination weddings', 'Wedding planners', 'Matrimonial companies'] },
  { name: 'Gautam Jain', gives: ['Bharat Goyal (Automobile Parts)', 'Ashish Dhingra (Obsessions India)', 'Vikram Sharma (Corrugated Boxes)', 'Vivek Jain (Grey Orange)'], asks: ['Higher education for kids', 'Power Grid Investigation Officer', 'Smokers', 'Early retirement investment', 'NRI investors'] },
  { name: 'Harsh Gupta', gives: ['Deepankar Anand (Elanco)', 'Shivam Singh (Elevator)', 'Abhishek Bansal (Arvind Mills)', 'Varun Bansal (Bata IT)', 'Kailash Garg (Narayanan)', 'Kashish Garg (Navjiwan)', 'Gourja Bansal (Sophia Genomics)', 'Ravi Chaurasiya (Sara Designs)'], asks: ['Interior Designers', 'Krishna Baid (Workroom)', 'Priyanka Shah (Chalk Studios)', 'Umesh Kumar (The Interior)', 'Sameer Moksha Salii', 'Ratan Shukla (Star Fox)', 'Shezaan Bhojani (Design Cafe)'] },
  { name: 'Harsh Vardhan Sharma', gives: ['Dr Bhupendra (NMO)', 'Bhim Singh (GST)', 'Yogesh Thakur (Bhoomika Reality)'], asks: ['Friends & Family better loan interest', 'DLF/Godrej allotment holders', 'Better ROI on loans', 'DLF Sales Head'] },
  { name: 'Ishan Gupta', gives: ['Tarun Bansal (Corporate Gifting)', 'Naveen Goel/Dr DP Goel (Canwinn)', 'Mayank Kaushik', 'Kushal Bansal (Lapcare)', 'Kushal Mangla (Lapcare)'], asks: ['Builders & Interior Designers', 'Architects & Developers', 'Infra project managers'] },
  { name: 'Jatin Choudhary', gives: ['Dharmesh Kumar (Mahagun)', 'Nipun Narula (Alfa Fire)', 'Dhananveer Singh (Balaji Kripa)', 'Dharamveer Singh (Balaji Kripa)', 'Survadipta Banerjee (Movens)', 'Lalit Kukreja (Freelancer)'], asks: ['Kuldeep Dagar (Flipkart)', 'Pooja Maheshwari (Max Fashion)', 'Transportation contacts'] },
  { name: 'Jatin Kapoor', gives: ['Dr Kanchan Singh (Ram Rattan)', 'Ramesh Syan', 'Ramesh Puri (Antila Heights)', 'Mohit Shikara (Elevate)'], asks: ['Land Investment seekers', 'Joint Venture Land Development', 'Agricultural investment', 'Ex-Army people', 'ROI investments', 'Farmhouse investors'] },
  { name: 'Kunj Kalra', gives: ['Saurabh Maheshwari (Pioneer Embroideries)', 'Anmol Kedia (Sparsh Group)', 'Simran Singh (Water Resources)'], asks: ['Factory Owners in Himachal', 'Industries', 'Schools in Noida/Greater Noida', 'Industrial/Commercial clients Jharkhand/Odisha', 'Real Estate investment', 'NTPC Mining', 'Factories in Jharkhand'] },
  { name: 'Manish Malhotra', gives: ['Dharmendra Singh (Corrugated Boxes)', 'Rajat (Bisleri Distributor)', 'Jasmeet Singh (Builder)'], asks: ['Friends & Family for Plots & Kothis', 'Residential properties 1.5-2Cr', 'M3M/Smartworld 1.6-1.75Cr', 'Gurgaon property buyers', 'Real Estate investment'] },
  { name: 'Meenu Singh', gives: ['Amit Singh (Indane Gas)', 'Abhinay Tomer (Polycab)', 'Shivam Chauhan (Springs Spruce)', 'Ruchi Dhaiya (Kontent Edge)'], asks: ['Friends & Family refurbishing', 'Old furniture restoration', 'Godrej cupboard refurbish', 'Dining table refurbishing'] },
  { name: 'Mitali Bansal', gives: ['Harpreet Bedi (Reet Rivaaz)', 'Samriddhi (Bakers Oven)', 'Parth Bhimani (Basit Drones)'], asks: ['B2B Bakeries', 'Auto Component Manufacturers Manesar', 'Industrial B2B setups', 'Toys/game manufacturers', 'Auto component factories NCR', 'B2B Bakeries Pan India'] },
  { name: 'Naveen Gupta', gives: ['Vineet Gupta (Golden Agri)', 'Sachin (Pioneer)', 'Sareena (Alchemist Live)'], asks: ['Procurement Head Nestle', 'Hotel Admin/Procurement Hilton/Hyatt/Ramada/Ibis', 'Flight Travel Desk BCG'] },
  { name: 'Pushp Wadera', gives: ['Priyanka Srivastava (Architect)', 'Ajay Kaul (Architect)', 'Kumar (Infrastructure)', 'Vikrant Singh (Samsung)', 'Girish Kapur (Isomars)', 'Achal Gupta (GEM)', 'Abhay Saxena (Builder)'], asks: ['Architects Ghaziabad', 'Architects Noida', 'Builders Ghaziabad'] },
  { name: 'Rajat Sharma', gives: ['Digvijay Singh (Labels)', 'Anil (KGDS)', 'Manoj Tanwar (Consultant)', 'Manoj (MCD Councilor)', 'Japkirat S (ORB Hardware)', 'Kunal (Import Agent)'], asks: ['Travel & Visa Services', 'Canton Fair clients', 'Hotel deals', 'Architecture/Construction for Canton', 'China procurement'] },
  { name: 'Ria Kachhawaha', gives: ['Vivek Shukla (Voltas)', 'Kunal (Albaross RF)', 'Shithar (TIOL)', 'Dr Sandeep (Curigo)', 'Gajendra Gehlot (Rajasthan Minerals)'], asks: ['Business Owners/Startups going digital', 'Mobile app launches', 'Digital expansion', 'Dinesh Pai (Zerodha)'] },
  { name: 'Robin Garg', gives: ['Anuj Mago (VIP Mobile Numbers)', 'Anuj Mann (VIP Numbers)', 'Anuj Maggo (VIP Numbers)'], asks: ['Diamond Jewellery buyers', 'Wedding customers', 'Gold investors', 'Wearing customers'] },
  { name: 'Samika Sharma', gives: ['Rakesh Sharma (CBD Sanitary)', 'Nehal Vohra (Dermatologist)', 'Tishya Kakkar (LSI Lights)', 'Kimaya Sharma (Makeup Artist)', 'Khushi Neb (Air BnB)', 'Disha Kakkar (LSR)'], asks: ['Builders in Delhi/NCR', 'Real estate developers', 'Dream home builders', 'General contractors PAN India', 'Civil contractors', 'Home owners New York'] },
  { name: 'Saummay Sharma', gives: ['Pankaj Kumar (TI Wires)', 'Lakhan (Hindware)', 'Tilak Raj (Shriram Pistons)', 'Balbir (Jackson & Co)', 'Ajay Kumar (R R Kables)', 'Sanjeev (Shri Ram Pistons)'], asks: ['Industries electrical needs', 'Consultants & Panel Builders', 'Project Head Siegwerk', 'Reliable electrical vendors', 'Consultants and industries'] },
  { name: 'Saurabh Malhotra', gives: ['Gagan Sharma (Desi Dana)', 'Raghav Arora (Sirca Paints)', 'Ankit Khemka (Open House)'], asks: ['Friends/family 5-10 year investment', 'Mid-cap fund investors', 'Business cycle funds', 'Investment seekers'] },
  { name: 'Saurabh Sibal', gives: ['Ashish Aggarwal (TSA India)', 'Rajeev Garg (Anupam Royals)', 'Rajiv (Anupam Royale)'], asks: ['Corporate events', 'Product launches', 'Exhibitions', 'End-to-end event solutions', 'Fortune 500 companies', 'Amazon Marketing Team'] },
  { name: 'Shagun Kaushal', gives: [], asks: [] },
  { name: 'Shubham Sethi', gives: ['Animesh Srizo (China Furniture)', 'Vikrant Yadav (Mahaveer)', 'Daksh (Casabella Banquet)', 'Supreet Singh (Jegson)', 'Supreet Dhingra (Jegson)', 'Neha Jain (Elements Wallpaper)'], asks: ['Nishant Baxy (Mobility)', 'Rockman Marketing Head', 'Hero Group Marketing', 'Hyundai Mobis Marketing', 'GV India Marketing', 'Hyundai Marketing'] },
  { name: 'Simar Pal Singh', gives: ['Tarun Sharma (Bhagwati Float)', 'Manish Bakshi (Crown Cars)', 'Bhupendra Sahani (CDS)', 'Abhay Arya (Fabcore)', 'Ishaan Sharma (Bhagwati Trading)'], asks: ['Interior Designers', 'Architects'] },
  { name: 'Sonal Mehta', gives: ['Rohit Gupta (Suncity)', 'Manmohan Malik (Himalaya Food)', 'Kaushik Ray (Biryani By Kilo)', 'Devendra Pal (DOSCHEMEN)', 'Gurpal (Trevoc)', 'Ashutosh Dhawan (Mankind)', 'Preety Singh (NAREDCO)', 'Mukul Pasricha (Spring House)'], asks: ['Grand Hyatt Promoter', 'Interior Designers', 'Hemant Ruia (DP World)', 'Rajesh Jain (Conscient)', 'Rishi Raj (Conscient)', 'Hemant Baid (ABCI Infra)', 'Ashish Sarin (Alpha Corp)'] },
  { name: 'Sumit Nagpal', gives: ['Gurleen Kaur (Kurry Consulting)', 'Rishabh Mahipal (Maximalist)', 'Jatin (AT&T Tax)', 'Mandeep Wasan (Antarnaad)', 'Acharya Ashima (Astrologer)', 'C U Singh (Senior Advocate)', 'Kshitij Gupta (Cup Paka)', 'Abhi Malhotra (Founder)'], asks: ['Sanjeev Sachdeva (Elan Group)', 'Vineet Maheshwari (Signature Global)', 'Rahul Chandra (M3M)', 'Dhananjay Shahi (Deloitte)', 'Sheel Sinha (JLL India)', 'Deepak Manglani (Spinny)', 'Vatsal Arya (Finserv)', 'Vikrant Tomar (Narula General)'] },
  { name: 'Supreet Singh', gives: ['Vivek Jain (Bombay Stock Exchange)', 'Pawan Gupta', 'Piyush Gupta (VLTR)', 'Jayanta Saha (Indira IVF)'], asks: ['Raj Shikha (Battery Smart)', 'Soniya Goel', 'SME growth seekers', 'HR services seekers'] },
  { name: 'Tamanna Gupta', gives: ['Riddhima Bhasin (Fashion Designer)', 'Udit Bansal (Stationery)', 'Kashih (Makeup Artist)', 'Shivam Malhotra (DU Express)', 'Elizabeth (Gaurav Gupta Couture)', 'Heena (EGC Kitchens)', 'Rachit (Clay Tiles)'], asks: ['Home Owners for furniture', 'Vanita Arora/Gupta (Good Homes)', 'Builders Gurgaon'] },
  { name: 'Vinay Malik', gives: ['Hitesh Arora (Demi Iron Stones)', 'Saurabh Garg (Ekaani Group)'], asks: ['Interior Designers Delhi/NCR', 'Architects Delhi/NCR'] },
  { name: 'Vipul Arora', gives: ['Saurabh (Cement Tiles)', 'Shekhar Pawar (Landcasa)', 'Ishant Satya (Concrete)', 'Shivam Rao (Trinity Gaming)', 'Chirag Dahiya (Tennis Academy)'], asks: ['Dinesh Arora (Qavalli)', 'Umang Tiwari (Hospitality Innovators)', 'Rahul Neema (Syrup)', 'Kanika Soni (Chrome Studios)', 'DLF Cafe'] },
  { name: 'Yogendra Pal Singh', gives: ['Deepak Khanna (Triumph)', 'Manish Mittal (Green Hydrogen)', 'Avijit Banerjee (HDFC)', 'Sandeep Arora (Brij Hotels)'], asks: ['Kapil Chopra (Postcard Hotel)', 'Hospitality Founders/Owners', 'Anant Apurv & Udit Kumar (Brij Hotels)'] }
];

// Map of normalized names to WhatsApp-ready phone numbers (91 + 10 digits)
const MEMBER_PHONE_MAP: Record<string, string> = {
  'Ajay Gumbar': '919899441012',
  'Alok Ranjan': '919818986708',
  'Anjali Mathur': '919818733770',
  'Arjit Benjamin': '919871169856',
  'Chandan Monga': '919873338258',
  'Charru Kulthia': '919821120242',
  'Dharmesh Sharma': '917038321969',
  'Divyanshu Verma': '919643004362',
  'Dr Rahul Raj': '917303133053',
  'Gaurav Sarna': '919899199126',
  'Gautam Jain': '919811057046',
  'Harsh Gupta': '919620377100',
  'Harsh Vardhan Sharma': '919990078888',
  'Ishan Gupta': '919654462090',
  'Jatin Choudhary': '919929109373',
  'Jatin Kapoor': '918826063064',
  'Kunj Kalra': '919311071987',
  'Manish Malhotra': '917982473808',
  'Meenu Singh': '919999982765',
  'Mitali Bansal': '917506589936',
  'Naveen Gupta': '919731240022',
  'Pushp Wadera': '919999200218',
  'Rajat Sharma': '919899735800',
  'Ria Kachhawaha': '918527753969',
  'Robin Garg': '918760000000',
  'Samika Sharma': '919311016945',
  'Saummay Sharma': '919358759727',
  'Saurabh Malhotra': '919818642202',
  'Saurabh Sibal': '919818711274',
  'Shagun Kaushal': '918800568989',
  'Shubham Sethi': '918087312207',
  'Simar Pal Singh': '919711200956',
  'Sonal Mehta': '919090900016',
  'Sumit Nagpal': '919811051285',
  'Supreet Singh': '918433982800',
  'Tamanna Gupta': '919711110318',
  'Vinay Malik': '919899966112',
  'Vipul Arora': '918810565556',
  'Yogendra Pal Singh': '919873577619'
};

// Map of normalized names to Company and Specialty details
const MEMBER_ROSTER_DETAILS: Record<string, { company: string, specialty: string }> = {
  'Ajay Gumbar': { company: 'Taxonym Advisors LLP', specialty: 'Tax Law' },
  'Alok Ranjan': { company: 'Ioteraction Technologies Services Pvt Ltd', specialty: 'Advertising & Marketing' },
  'Anjali Mathur': { company: 'Capers Corporate Wellness Pvt Ltd', specialty: 'Training & Coaching' },
  'Arjit Benjamin': { company: 'Prosoll Law', specialty: 'Intellectual Property Law' },
  'Chandan Monga': { company: 'ALL GLASS & ALUMINIUM SOLUTION', specialty: 'Glass' },
  'Charru Kulthia': { company: 'Consciouspaces IN', specialty: 'Interior Design - Commercial' },
  'Dharmesh Sharma': { company: 'PMP Insurance Broking LLP', specialty: 'General Insurance' },
  'Divyanshu Verma': { company: 'Konverzions', specialty: 'Web Development' },
  'Dr Rahul Raj': { company: 'The Dental Villa', specialty: 'Dentist' },
  'Garv Bakshi': { company: 'Graf Interiors', specialty: 'Office Furniture' },
  'Gaurav Sarna': { company: 'Sitarra & Co', specialty: 'Wedding Planner' },
  'Gautam Jain': { company: 'GRK ASSOCIATES', specialty: 'Life and Disability Insurance' },
  'Harsh Gupta': { company: 'Hamsa Homes and Lifestyle', specialty: 'Home Furnishings' },
  'Harsh Vardhan Sharma': { company: 'BetterFinance.in', specialty: 'Finance & Insurance' },
  'Ishan Gupta': { company: 'Ishika Sanitary & Hardware Udyog', specialty: 'Bath Accessories' },
  'Jatin Choudhary': { company: 'Swajat', specialty: 'Apparel' },
  'Jatin Kapoor': { company: 'Avyaya Proptech Pvt Ltd', specialty: 'Real Estate Investments' },
  'Kunj Kalra': { company: 'SOLLUZ ENERGY PVT LTD', specialty: 'Solar' },
  'Manish Malhotra': { company: 'PROP 24', specialty: 'Residential Real Estate Agent' },
  'Meenu Singh': { company: 'Timeless Tales by Meenu', specialty: 'Furniture manufacture' },
  'Mitali Bansal': { company: 'Genesis Pro Pac', specialty: 'Packaging' },
  'Naveen Gupta': { company: 'TREV MOBILITY TECH PRIVATE LIMITED', specialty: 'Travel' },
  'Pushp Wadera': { company: 'Pushp International', specialty: 'Kitchen Construction' },
  'Rajat Sharma': { company: 'TRAVEL WORLD', specialty: 'Travel' },
  'Ria Kachhawaha': { company: 'App Theka', specialty: 'App Developer' },
  'Robin Garg': { company: 'PRJ Jeweller', specialty: 'Fine Jewelry' },
  'Samika Sharma': { company: 'DS Dezigns', specialty: 'Interior Design - Residential' },
  'Saummay Sharma': { company: 'Jai Shree Electricals', specialty: 'Electrical Equipment' },
  'Saurabh Malhotra': { company: 'Lightpillar', specialty: 'Wealth Management' },
  'Saurabh Sibal': { company: 'SGS Enterprises', specialty: 'Corporate Events' },
  'Shagun Kaushal': { company: 'Sabre Training and Consulting', specialty: 'Training & Coaching' },
  'Shubham Sethi': { company: 'Optmum Digital Marketing', specialty: 'Search Engine Optimisation' },
  'Simar Pal Singh': { company: 'Orb Designs', specialty: 'Tiles' },
  'Sonal Mehta': { company: 'Resurgent India Limited', specialty: 'Financial Advisor' },
  'Sumit Nagpal': { company: 'P&R Law Chambers', specialty: 'Civil Law' },
  'Supreet Singh': { company: 'Strategic Strides', specialty: 'Human Resources' },
  'Tamanna Gupta': { company: 'Sarmaya Homes', specialty: 'Retail' },
  'Vinay Malik': { company: 'Jay Dee Sales Corp', specialty: 'Construction' },
  'Vipul Arora': { company: 'Growtech Today', specialty: 'Landscape Services' },
  'Yogendra Pal Singh': { company: 'ExcelDes Spaces', specialty: 'Architect' }
};

export const PLATINA_MEMBERS: Member[] = RAW_PLATINA_DATA.map((m, index) => {
  // Look up phone number from map
  const mobile = MEMBER_PHONE_MAP[m.name] || '';

  // Look up company and specialty from roster details
  const details = MEMBER_ROSTER_DETAILS[m.name] || { company: 'BNI Member', specialty: 'Member' };

  return {
    id: `pm-${index}`,
    name: m.name,
    company: details.company,
    industry: Industry.GENERAL,
    specialty: details.specialty,
    asks: m.asks,
    gives: m.gives,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random&color=fff`,
    email: '',
    phoneNumber: mobile,
    chapterRole: m.name === 'Arjit Benjamin' ? 'Captain' :
      m.name === 'Jatin Choudhary' ? 'Co-Captain' :
        m.name === 'Samika Sharma' ? 'Vault Keeper' : 'Hero'
  };
});
