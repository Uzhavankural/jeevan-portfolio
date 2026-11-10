export interface StatItem {
  value: string;
  label: string;
  detail?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  period: string;
  bullets: string[];
  chips: string[];
  liveUrl: string | null;
  liveLabel: string;
  codeUrl: string | null;
  codeLabel: string;
}

export interface TimelineEntry {
  id: string;
  period: string;
  kind: "Experience" | "Project" | "Education";
  title: string;
  organization: string;
  summary: string;
  highlights: string[];
}

export interface PrincipleItem {
  number: string;
  title: string;
  description: string;
}

export const RESUME_DATA = {
  person: {
    greeting: "Hello, I'm",
    name: "Jeevan Srinivasan",
    role: "Digital Marketing Executive",
    city: "Coimbatore, Tamil Nadu",
    email: "jeevansrinivasan062@gmail.com",
    linkedin: "https://www.linkedin.com/in/jeevan-srinivasan/",
    uzhavarmarketUrl: "https://uzhavarmarket.netlify.app",
    heroBio:
      "Hands-on in social media marketing, Meta Ads campaign management, content creation, and lead generation — driving measurable growth for automotive and agriculture brands.",
    languages: [
      { name: "Tamil", level: "Native" },
      { name: "English", level: "Intermediate" },
    ],
  },
  heroStats: [
    {
      value: "~1,000",
      label: "Leads generated",
      detail: "Organic & paid at ABT Maruti",
    },
    {
      value: "15K",
      label: "Peak IG followers",
      detail: "Grown for Uzhavankural",
    },
    {
      value: "15",
      label: "Meta ad campaigns",
      detail: "Launched & managed",
    },
  ] satisfies StatItem[],
  workSection: {
    heading: "Work that ships",
    subtitle:
      "Paid and organic campaigns, brand growth, and full-stack web builds executed from brief to live audience.",
    stats: [
      { value: "~1,000", label: "Leads generated" },
      { value: "₹15–₹300", label: "Approx. cost / lead" },
      { value: "15", label: "Meta ad campaigns" },
    ] satisfies StatItem[],
    projects: [
      {
        id: "uzhavar-market",
        title: "Uzhavar Market — Agricultural Marketplace",
        category: "Web Application",
        period: "Ongoing Development",
        bullets: [
          "Developing an online agricultural marketplace connecting farmers directly with customers.",
          "Building the frontend application using Next.js and React.js.",
          "Implementing backend services, database, and authentication using Supabase.",
          "Managing source code and deployment workflows using GitHub and Netlify.",
        ],
        chips: ["Next.js", "React.js", "Supabase", "GitHub", "Netlify"],
        liveUrl: "https://uzhavarmarket.netlify.app",
        liveLabel: "Live site",
        codeUrl: null,
        codeLabel: "Code private",
      },
      {
        id: "abt-maruti",
        title: "ABT Maruti — Meta Ads & Lead Generation",
        category: "Paid & Organic Campaigns",
        period: "15 Sep 2026 – Present",
        bullets: [
          "Generated approximately 1,000 leads through organic social media and paid advertising campaigns.",
          "Launched and managed 15 Meta advertising campaigns at an approximate cost per lead of ₹15–₹300.",
          "Created promotional posters and shot and edited automotive promotional reels and videos.",
          "Planned content calendars, selected target audiences and locations, and monitored performance.",
        ],
        chips: [
          "Meta Ads Manager",
          "Meta Business Suite",
          "CapCut",
          "Lead Generation",
          "Audience Targeting",
        ],
        liveUrl: "https://www.linkedin.com/in/jeevan-srinivasan/",
        liveLabel: "LinkedIn",
        codeUrl: null,
        codeLabel: "Ad account internal",
      },
      {
        id: "uzhavankural",
        title: "Uzhavankural — Agriculture Digital Brand",
        category: "Brand & Content Growth",
        period: "Aug 2025 – Present",
        bullets: [
          "Built and managed an agriculture-focused digital brand, growing its Instagram audience to 15K followers at peak.",
          "Managed Instagram and Facebook accounts, social media content strategy, and community interactions.",
          "Developed reel scripts and handled video shooting, editing, and publishing.",
          "Executed product marketing campaigns and managed the brand website.",
        ],
        chips: [
          "Meta Business Suite",
          "CapCut",
          "ChatGPT",
          "Gemini",
          "Instagram & Facebook",
        ],
        liveUrl: "https://www.linkedin.com/in/jeevan-srinivasan/",
        liveLabel: "LinkedIn",
        codeUrl: null,
        codeLabel: "Brand assets private",
      },
    ] satisfies ProjectItem[],
  },
  stackTools: [
    { name: "Meta Business Suite", group: "Advertising" },
    { name: "Meta Ads Manager", group: "Advertising" },
    { name: "CapCut", group: "Video & Creative" },
    { name: "AirBrush", group: "Video & Creative" },
    { name: "ChatGPT", group: "AI Workflow" },
    { name: "Gemini", group: "AI Workflow" },
    { name: "Google Flow", group: "AI Workflow" },
    { name: "Antigravity", group: "AI Workflow" },
    { name: "Next.js", group: "Web Stack" },
    { name: "React.js", group: "Web Stack" },
    { name: "Supabase", group: "Web Stack" },
    { name: "GitHub", group: "Deployment" },
    { name: "Netlify", group: "Deployment" },
  ],
  recordTimeline: [
    {
      id: "rec-abt-maruti",
      period: "15 September 2026 – Present",
      kind: "Experience",
      title: "Digital Marketing Executive",
      organization: "ABT Maruti",
      summary:
        "Leading organic social content and paid Meta advertising focused on automotive lead generation.",
      highlights: [
        "Generated approximately 1,000 leads across organic and paid channels.",
        "Launched and managed 15 Meta advertising campaigns (₹15–₹300 approx. CPL).",
        "Shot and edited automotive reels, created promotional posters, and managed content calendars.",
      ],
    },
    {
      id: "rec-uzhavar-market",
      period: "Ongoing Development",
      kind: "Project",
      title: "Uzhavar Market — Agricultural Marketplace",
      organization: "uzhavarmarket.netlify.app",
      summary:
        "Building an online marketplace connecting farmers directly with customers.",
      highlights: [
        "Frontend built with Next.js and React.js; backend, database, and auth on Supabase.",
        "Source control and production deployments managed via GitHub and Netlify.",
      ],
    },
    {
      id: "rec-education",
      period: "Graduated 2026",
      kind: "Education",
      title: "B.E. — Computer Science and Design",
      organization: "Karpagam Academy of Higher Education",
      summary:
        "Undergraduate engineering degree blending software fundamentals with design thinking.",
      highlights: [
        "Applied engineering foundation directly into Next.js, React.js, and Supabase web builds.",
      ],
    },
    {
      id: "rec-uzhavankural",
      period: "August 2025 – Present",
      kind: "Experience",
      title: "Founder & Digital Marketing Manager",
      organization: "Uzhavankural",
      summary:
        "Built and scaled an agriculture-focused digital brand from zero to 15K peak Instagram followers.",
      highlights: [
        "Owned Instagram & Facebook strategy, reel scripting, shooting, editing, and publishing.",
        "Managed online community engagement, product marketing campaigns, and brand website.",
      ],
    },
  ] satisfies TimelineEntry[],
  about: {
    paragraphs: [
      "I am a Digital Marketing Executive based in Coimbatore, Tamil Nadu, holding a Bachelor of Engineering (B.E.) in Computer Science and Design from Karpagam Academy of Higher Education (graduated 2026). My background bridges hands-on audience growth with modern web development.",
      "From generating approximately 1,000 leads across 15 Meta advertising campaigns at ABT Maruti to scaling Uzhavankural to 15K Instagram followers at peak and building Uzhavar Market with Next.js and Supabase, I focus on creative execution backed by clear performance tracking.",
    ],
    skills: [
      "Social Media Marketing",
      "Meta Ads Campaign Management",
      "Lead Generation",
      "Content Strategy & Planning",
      "Video Shooting & Editing",
      "Audience Targeting",
      "Campaign Performance Analysis",
      "AI-Powered Content Creation",
      "Website Management",
    ],
    principles: [
      {
        number: "01",
        title: "Audience before ad spend",
        description:
          "Define target audiences, locations, and campaign objectives clearly before launching Meta Ads delivery.",
      },
      {
        number: "02",
        title: "Creative built for retention",
        description:
          "Pair scripted short-form reels, promotional posters, and consistent content calendars to keep feeds active.",
      },
      {
        number: "03",
        title: "Measure cost and outcome",
        description:
          "Monitor campaign performance closely to keep lead generation efficient across both organic and paid channels.",
      },
      {
        number: "04",
        title: "Own the web destination",
        description:
          "Combine digital marketing with Next.js, React.js, and Supabase engineering so traffic lands on fast, functional web apps.",
      },
    ] satisfies PrincipleItem[],
  },
} as const;
