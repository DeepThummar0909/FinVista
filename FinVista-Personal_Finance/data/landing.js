import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

export const statsData = [
  {
    value: "75K+",
    label: "Active Users",
  },
  {
    value: "₹3B+",
    label: "Assets & Transactions Managed",
  },
  {
    value: "99.99%",
    label: "Platform Uptime",
  },
  {
    value: "4.8/5",
    label: "User Satisfaction",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "AI-Powered Analytics",
    description:
      "Uncover deep insights into your spending, saving, and investment patterns using intelligent analytics.",
  },
  {
    icon: <Receipt className="h-8 w-8 text-blue-600" />,
    title: "Smart Receipt Capture",
    description:
      "Scan and extract data from receipts instantly with our AI-based scanning engine.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Budget & Investment Planner",
    description:
      "Create tailored budgets and investment plans with real-time tracking and smart recommendations.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Unified Account View",
    description:
      "Track your bank accounts, credit cards, and investment portfolios from one dashboard.",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Multi-Currency Tracking",
    description:
      "Handle finances across borders with accurate, real-time currency conversion.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Automated Intelligence",
    description:
      "Get personalized tips and alerts on when to save, invest, or optimize spending.",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Sign Up Instantly",
    description:
      "Start managing your money within minutes with our fast and secure registration.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Link & Track Everything",
    description:
      "Sync your accounts, transactions, and investments — all tracked automatically in real time.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Get Smart Insights",
    description:
      "Receive AI-driven suggestions to improve savings, reduce waste, and grow your wealth.",
  },
];

// Testimonials Data
export const testimonialsData = [
  {
    name: "Aarav Mehta",
    role: "Startup Founder",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    quote:
      "This app helped me streamline both my personal expenses and startup investments. The insights are incredibly actionable and easy to understand.",
  },
  {
    name: "Priya Nair",
    role: "Investment Analyst",
    image: "https://randomuser.me/api/portraits/women/95.jpg",
    quote:
      "From SIP tracking to budgeting across currencies, everything just works. Welth is a must-have for modern investors.",
  },
  {
    name: "Daniel Carter",
    role: "Remote Developer",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    quote:
      "I travel often, and Welth helps me manage multi-currency expenses while keeping an eye on my mutual funds and stocks. Seamless experience!",
  },
];
