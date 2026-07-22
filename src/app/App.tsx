import { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, Search, MessageCircle, Calendar, User, Bell,
  Settings, ArrowLeft, Star, ChevronRight, Send,
  Mic, Heart, BookOpen, Award, TrendingUp, Clock,
  CheckCircle, X, Filter, Plus, Edit2, LogOut, Moon,
  Shield, HelpCircle, Target, Users, Activity, Lock,
  Eye, EyeOff, Zap, Video, Smile, Phone, ChevronDown,
  ThumbsUp, MapPin, BarChart2,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen =
  | "splash" | "onboarding" | "login" | "register"
  | "forgot-password" | "otp" | "home" | "explore"
  | "skill-detail" | "chat-list" | "chat" | "calendar"
  | "profile" | "exchange-request" | "notifications"
  | "settings" | "progress" | "admin" | "reviews";

type NavFn = (s: Screen) => void;
type AvatarColor = "indigo" | "cyan" | "green" | "purple" | "orange" | "pink" | "amber";

// ─── Design Helpers ───────────────────────────────────────────────────────────

const bg = (d: boolean) => d ? "bg-slate-900" : "bg-[#F8FAFC]";
const tx = (d: boolean) => d ? "text-white" : "text-gray-900";
const cd = (d: boolean) => d ? "bg-slate-800 border-slate-700/60" : "bg-white border-gray-100";
const mu = (d: boolean) => d ? "text-slate-400" : "text-gray-500";
const ip = (d: boolean) => d ? "bg-slate-700 text-white placeholder:text-slate-500" : "bg-slate-100 text-gray-900 placeholder:text-gray-400";

// ─── Shared Components ────────────────────────────────────────────────────────

const AVATAR_COLORS: Record<AvatarColor, string> = {
  indigo: "from-indigo-500 to-indigo-700",
  cyan: "from-cyan-400 to-cyan-600",
  green: "from-green-400 to-green-600",
  purple: "from-purple-500 to-purple-700",
  orange: "from-orange-400 to-orange-600",
  pink: "from-pink-400 to-pink-600",
  amber: "from-amber-400 to-amber-600",
};

function Av({ name, sz = 40, color = "indigo" }: { name: string; sz?: number; color?: AvatarColor }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_COLORS[color]} text-white font-bold flex-shrink-0 select-none`}
      style={{ width: sz, height: sz, fontSize: sz * 0.36 }}
    >
      {initials}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} className={i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  );
}

function Bar2({ label, nav, back, dark, right }: {
  label: string; nav: NavFn; back?: Screen; dark: boolean; right?: React.ReactNode;
}) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${cd(dark)} border-b sticky top-0 z-10`}>
      {back
        ? <button onClick={() => nav(back)} className={`w-9 h-9 ${ip(dark)} rounded-xl flex items-center justify-center`}><ArrowLeft size={18} className={tx(dark)} /></button>
        : <div className="w-9" />}
      <p className={`text-sm font-bold ${tx(dark)}`}>{label}</p>
      {right ?? <div className="w-9" />}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`w-12 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${on ? "bg-indigo-600" : "bg-gray-300"}`}>
      <div className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${on ? "translate-x-[26px]" : "translate-x-[3px]"}`} />
    </button>
  );
}

// ─── 1. Splash ────────────────────────────────────────────────────────────────

function SplashScreen({ dark }: { dark: boolean }) {
  return (
    <div className="min-h-[790px] bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-600 flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl" />

      {/* Floating skill cards */}
      <div className="absolute top-28 left-5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-3 py-2.5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎸</span>
          <div><p className="text-[11px] font-bold text-white">Guitar</p><p className="text-[9px] text-white/70">Alex → Sarah</p></div>
        </div>
      </div>
      <div className="absolute top-60 right-5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-3 py-2.5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚛️</span>
          <div><p className="text-[11px] font-bold text-white">React</p><p className="text-[9px] text-white/70">Mike → Emma</p></div>
        </div>
      </div>
      <div className="absolute bottom-52 left-5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-3 py-2.5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">📸</span>
          <div><p className="text-[11px] font-bold text-white">Photography</p><p className="text-[9px] text-white/70">Priya → David</p></div>
        </div>
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-[32px] border border-white/40 flex items-center justify-center mb-6 shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-white/50 to-white/10 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">🔄</span>
          </div>
        </div>
        <h1 className="text-5xl font-black text-white mb-3 tracking-tight">SkillSwap</h1>
        <p className="text-white/80 text-sm font-medium text-center px-14 leading-relaxed">
          Learn Together. Teach Together.
        </p>
        <div className="mt-20 flex items-center gap-2">
          {[0, 150, 300].map(d => (
            <div key={d} className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 2. Onboarding ───────────────────────────────────────────────────────────

const OB_DATA = [
  { emoji: "🎓", title: "Learn New Skills", sub: "Discover hundreds of skills taught by talented students just like you — for free.", grad: "from-indigo-600 to-purple-600", chipA: { e: "🐍", l: "Python" }, chipB: { e: "🎨", l: "Design" } },
  { emoji: "👨‍🏫", title: "Teach Others", sub: "Share your expertise and help fellow students grow while earning recognition and badges.", grad: "from-cyan-500 to-teal-600", chipA: { e: "⭐", l: "4.9 Rating" }, chipB: { e: "👥", l: "12 Students" } },
  { emoji: "🚀", title: "Grow Together", sub: "Build lasting connections, accelerate your learning, and unlock achievements together.", grad: "from-purple-600 to-pink-600", chipA: { e: "🔥", l: "Trending" }, chipB: { e: "🤝", l: "500+ Swaps" } },
];

function OnboardingScreen({ page, setPage, nav, dark }: {
  page: number; setPage: (p: number) => void; nav: NavFn; dark: boolean;
}) {
  const d = OB_DATA[page];
  return (
    <div className={`min-h-[790px] ${bg(dark)} flex flex-col relative overflow-hidden`}>
      <div className="flex justify-end px-6 pt-4">
        <button onClick={() => nav("login")} className="text-sm font-semibold text-indigo-500">Skip</button>
      </div>

      <div className="flex-1 flex items-center justify-center px-10 pt-4">
        <div className={`w-68 h-68 bg-gradient-to-br ${d.grad} rounded-[44px] flex items-center justify-center shadow-2xl relative`} style={{ width: 260, height: 260 }}>
          <span className="text-8xl">{d.emoji}</span>
          <div className="absolute -top-4 -right-4 w-11 h-11 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <Star size={18} className="text-white fill-white" />
          </div>
          <div className="absolute -bottom-3 -left-3 w-9 h-9 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Heart size={14} className="text-white fill-white" />
          </div>
          <div className="absolute top-6 -right-14 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-xl">
            <span className="text-[11px] font-bold text-indigo-700">{d.chipA.e} {d.chipA.l}</span>
          </div>
          <div className="absolute bottom-10 -left-14 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-xl">
            <span className="text-[11px] font-bold text-purple-700">{d.chipB.e} {d.chipB.l}</span>
          </div>
        </div>
      </div>

      <div className="px-8 pb-12">
        <h2 className={`text-3xl font-black ${tx(dark)} mb-3`}>{d.title}</h2>
        <p className={`text-sm leading-relaxed ${mu(dark)} mb-10`}>{d.sub}</p>
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === page ? `w-8 bg-gradient-to-r ${d.grad}` : "w-2 bg-gray-200"}`} />
          ))}
        </div>
        <button
          onClick={() => page < 2 ? setPage(page + 1) : nav("login")}
          className={`w-full py-4 rounded-2xl bg-gradient-to-r ${d.grad} text-white font-bold text-base shadow-2xl`}
        >
          {page < 2 ? "Next →" : "Get Started"}
        </button>
      </div>
    </div>
  );
}

// ─── 3. Login ─────────────────────────────────────────────────────────────────

function LoginScreen({ nav, dark, showPw, setShowPw }: {
  nav: NavFn; dark: boolean; showPw: boolean; setShowPw: (v: boolean) => void;
}) {
  return (
    <div className={`min-h-[790px] ${bg(dark)} flex flex-col`}>
      <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 h-48 flex items-end pb-8 px-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full" />
        <div className="absolute top-5 right-16 w-16 h-16 bg-white/10 rounded-full" />
        <div>
          <h1 className="text-3xl font-black text-white">Welcome Back! 👋</h1>
          <p className="text-white/75 text-sm mt-1">Sign in to continue your skill journey</p>
        </div>
      </div>
      <div className="flex-1 px-6 pt-8 pb-6">
        <div className="mb-4">
          <label className={`text-xs font-bold ${mu(dark)} mb-2 block uppercase tracking-wider`}>Email Address</label>
          <div className={`flex items-center gap-3 ${ip(dark)} rounded-[16px] px-4 py-3.5`}>
            <User size={17} className="text-indigo-500 flex-shrink-0" />
            <input type="email" placeholder="your@university.edu" defaultValue="alex@mit.edu" className="flex-1 bg-transparent text-sm outline-none" />
          </div>
        </div>
        <div className="mb-2">
          <label className={`text-xs font-bold ${mu(dark)} mb-2 block uppercase tracking-wider`}>Password</label>
          <div className={`flex items-center gap-3 ${ip(dark)} rounded-[16px] px-4 py-3.5`}>
            <Lock size={17} className="text-indigo-500 flex-shrink-0" />
            <input type={showPw ? "text" : "password"} placeholder="••••••••" defaultValue="skillswap" className="flex-1 bg-transparent text-sm outline-none" />
            <button onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={17} className="text-gray-400" /> : <Eye size={17} className="text-gray-400" />}</button>
          </div>
        </div>
        <div className="flex justify-end mb-7">
          <button onClick={() => nav("forgot-password")} className="text-sm font-semibold text-indigo-600">Forgot Password?</button>
        </div>
        <button onClick={() => nav("home")} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200/60 mb-4 text-sm">
          Sign In
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex-1 h-px ${dark ? "bg-slate-700" : "bg-gray-200"}`} />
          <span className={`text-xs ${mu(dark)}`}>or continue with</span>
          <div className={`flex-1 h-px ${dark ? "bg-slate-700" : "bg-gray-200"}`} />
        </div>
        <button className={`w-full py-3.5 ${cd(dark)} border rounded-2xl flex items-center justify-center gap-3 font-semibold text-sm mb-8 ${tx(dark)}`}>
          <span className="text-xl font-black text-blue-600">G</span> Continue with Google
        </button>
        <p className={`text-center text-sm ${mu(dark)}`}>
          No account?{" "}
          <button onClick={() => nav("register")} className="text-indigo-600 font-bold">Sign Up Free</button>
        </p>
      </div>
    </div>
  );
}

// ─── 4. Register ──────────────────────────────────────────────────────────────

function RegisterScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  return (
    <div className={`min-h-[790px] ${bg(dark)} flex flex-col`}>
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 h-44 flex items-end pb-7 px-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full" />
        <div>
          <h1 className="text-3xl font-black text-white">Create Account ✨</h1>
          <p className="text-white/75 text-sm mt-1">Join 10,000+ students on SkillSwap</p>
        </div>
      </div>
      <div className="flex-1 px-6 pt-6 pb-6">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[["First Name", "Alex"], ["Last Name", "Johnson"]].map(([l, p]) => (
            <div key={l}>
              <label className={`text-[10px] font-bold ${mu(dark)} mb-1.5 block uppercase tracking-wider`}>{l}</label>
              <input className={`w-full ${ip(dark)} rounded-[14px] px-3.5 py-3 text-sm outline-none`} placeholder={p} />
            </div>
          ))}
        </div>
        {[["University Email", "alex@mit.edu", "email"], ["College / University", "MIT, Stanford, IIT...", "text"], ["Password", "Min. 8 characters", "password"]].map(([l, p, t]) => (
          <div key={l} className="mb-4">
            <label className={`text-[10px] font-bold ${mu(dark)} mb-1.5 block uppercase tracking-wider`}>{l}</label>
            <input type={t} className={`w-full ${ip(dark)} rounded-[14px] px-3.5 py-3 text-sm outline-none`} placeholder={p} />
          </div>
        ))}
        <button onClick={() => nav("otp")} className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-200/60 mb-4 text-sm">
          Create Account
        </button>
        <button className={`w-full py-3.5 ${cd(dark)} border rounded-2xl flex items-center justify-center gap-3 font-semibold text-sm mb-6 ${tx(dark)}`}>
          <span className="text-xl font-black text-blue-600">G</span> Sign up with Google
        </button>
        <p className={`text-center text-sm ${mu(dark)}`}>
          Have an account?{" "}
          <button onClick={() => nav("login")} className="text-indigo-600 font-bold">Sign In</button>
        </p>
      </div>
    </div>
  );
}

// ─── 5. Forgot Password ───────────────────────────────────────────────────────

function ForgotScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  return (
    <div className={`min-h-[790px] ${bg(dark)} flex flex-col`}>
      <Bar2 label="Reset Password" nav={nav} back="login" dark={dark} />
      <div className="flex-1 flex flex-col items-center px-6 pt-12">
        <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center mb-6">
          <Lock size={36} className="text-indigo-600" />
        </div>
        <h2 className={`text-2xl font-black ${tx(dark)} mb-2`}>Forgot Password?</h2>
        <p className={`text-sm ${mu(dark)} text-center mb-8 leading-relaxed`}>
          Enter your email and we{"'"}ll send you a link to reset your password.
        </p>
        <div className="w-full mb-6">
          <label className={`text-xs font-bold ${mu(dark)} mb-2 block uppercase tracking-wider`}>Email Address</label>
          <div className={`flex items-center gap-3 ${ip(dark)} rounded-[16px] px-4 py-3.5`}>
            <User size={17} className="text-indigo-500 flex-shrink-0" />
            <input type="email" placeholder="your@university.edu" className="flex-1 bg-transparent text-sm outline-none" />
          </div>
        </div>
        <button onClick={() => nav("otp")} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200/60 mb-4 text-sm">
          Send Reset Link
        </button>
        <button onClick={() => nav("login")} className="text-sm font-semibold text-indigo-600">Back to Login</button>
      </div>
    </div>
  );
}

// ─── 6. OTP ───────────────────────────────────────────────────────────────────

function OTPScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  const digits = ["4", "7", "2", "9", "", ""];
  return (
    <div className={`min-h-[790px] ${bg(dark)} flex flex-col`}>
      <Bar2 label="Verify Email" nav={nav} back="register" dark={dark} />
      <div className="flex-1 flex flex-col items-center px-6 pt-12">
        <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mb-6">
          <CheckCircle size={36} className="text-green-600" />
        </div>
        <h2 className={`text-2xl font-black ${tx(dark)} mb-2 text-center`}>Check Your Email</h2>
        <p className={`text-sm ${mu(dark)} text-center mb-8`}>
          We sent a 6-digit code to{" "}
          <span className="font-bold text-indigo-600">alex@mit.edu</span>
        </p>
        <div className="flex gap-2.5 mb-8">
          {digits.map((d, i) => (
            <div key={i} className={`w-12 h-14 ${ip(dark)} rounded-2xl flex items-center justify-center text-xl font-black ${tx(dark)} border-2 ${d ? "border-indigo-500" : dark ? "border-slate-600" : "border-gray-200"}`}>
              {d}
            </div>
          ))}
        </div>
        <button onClick={() => nav("home")} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-green-200/60 mb-4 text-sm">
          Verify and Continue
        </button>
        <p className={`text-sm ${mu(dark)}`}>
          No code?{" "}
          <button className="text-indigo-600 font-bold">Resend OTP</button>
        </p>
      </div>
    </div>
  );
}

// ─── 7. Home ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { icon: "💻", name: "Programming", count: 234 },
  { icon: "🎨", name: "Design", count: 189 },
  { icon: "📸", name: "Photography", count: 156 },
  { icon: "🎵", name: "Music", count: 203 },
  { icon: "📣", name: "Marketing", count: 98 },
  { icon: "🌍", name: "Language", count: 312 },
  { icon: "💼", name: "Business", count: 145 },
  { icon: "🎬", name: "Video", count: 87 },
];

const SKILLS = [
  { skill: "Python & Machine Learning", teacher: "Sarah Chen", rating: 4.9, sessions: 48, color: "indigo" as AvatarColor, exchange: "UI/UX Design", tag: "⭐ Top Rated" },
  { skill: "UI/UX Design System", teacher: "Mike Rodriguez", rating: 4.8, sessions: 36, color: "cyan" as AvatarColor, exchange: "Photography", tag: "🔥 Hot" },
  { skill: "Spanish Conversation", teacher: "Emma Wilson", rating: 4.7, sessions: 52, color: "green" as AvatarColor, exchange: "Music Production", tag: "✨ New" },
];

function HomeScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      {/* Header */}
      <div className="px-5 pt-3 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-xs ${mu(dark)}`}>Good morning 🌤</p>
            <h1 className={`text-xl font-black ${tx(dark)}`}>Alex Johnson</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => nav("notifications")} className={`w-10 h-10 ${cd(dark)} border rounded-2xl flex items-center justify-center relative`}>
              <Bell size={18} className={tx(dark)} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <button onClick={() => nav("profile")}><Av name="Alex Johnson" sz={40} color="indigo" /></button>
          </div>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-3 ${ip(dark)} rounded-2xl px-4 py-3 mb-4`}>
          <Search size={17} className="text-indigo-500 flex-shrink-0" />
          <input placeholder="Search skills, teachers..." className="flex-1 bg-transparent text-sm outline-none" />
          <button onClick={() => nav("explore")} className="bg-indigo-600 text-white p-1.5 rounded-lg"><Filter size={13} /></button>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl p-4 flex items-center justify-between shadow-xl shadow-indigo-200/50">
          <div className="text-white">
            <p className="text-[11px] opacity-80 font-medium">Your Week</p>
            <p className="text-lg font-black">3 Sessions Done 🔥</p>
            <button onClick={() => nav("progress")} className="text-[11px] bg-white/20 px-3 py-1 rounded-full mt-1.5 font-semibold">View Progress →</button>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🏆</div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-base font-black ${tx(dark)}`}>Categories</h2>
          <button onClick={() => nav("explore")} className="text-xs font-semibold text-indigo-600">See All</button>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(c => (
            <button key={c.name} onClick={() => nav("explore")} className={`flex-shrink-0 flex flex-col items-center gap-1.5 ${cd(dark)} border rounded-2xl p-3 w-[74px]`}>
              <span className="text-2xl">{c.icon}</span>
              <span className={`text-[10px] font-bold ${tx(dark)} text-center leading-tight`}>{c.name}</span>
              <span className="text-[9px] text-indigo-600 font-semibold">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Skills */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-base font-black ${tx(dark)}`}>Popular Skills</h2>
          <button onClick={() => nav("explore")} className="text-xs font-semibold text-indigo-600">See All</button>
        </div>
        <div className="flex flex-col gap-3">
          {SKILLS.map(s => (
            <button key={s.skill} onClick={() => nav("skill-detail")} className={`${cd(dark)} border rounded-2xl p-3.5 text-left`}>
              <div className="flex items-center gap-3">
                <Av name={s.teacher} sz={46} color={s.color} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-[13px] font-bold ${tx(dark)} truncate`}>{s.skill}</p>
                  </div>
                  <p className={`text-[11px] ${mu(dark)}`}>by {s.teacher}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Stars rating={s.rating} />
                    <span className="text-[10px] font-bold text-amber-600">{s.rating}</span>
                    <span className={`text-[10px] ${mu(dark)}`}>· {s.sessions} sessions</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[9px] text-cyan-600 font-bold mb-1">Wants</p>
                  <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-1 rounded-xl font-bold">{s.exchange}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Teachers */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-base font-black ${tx(dark)}`}>Trending Teachers</h2>
          <button className="text-xs font-semibold text-indigo-600">See All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { name: "David Park", skill: "React Dev", rating: 4.9, color: "purple" as AvatarColor, e: "⚛️" },
            { name: "Priya Sharma", skill: "Photography", rating: 4.8, color: "pink" as AvatarColor, e: "📸" },
            { name: "James Lee", skill: "Guitar", rating: 4.7, color: "orange" as AvatarColor, e: "🎸" },
            { name: "Aria Kim", skill: "Data Science", rating: 4.9, color: "cyan" as AvatarColor, e: "📊" },
          ].map(t => (
            <button key={t.name} onClick={() => nav("skill-detail")} className={`flex-shrink-0 ${cd(dark)} border rounded-2xl p-3.5 w-[130px] text-left`}>
              <Av name={t.name} sz={44} color={t.color} />
              <p className={`text-xs font-bold ${tx(dark)} mt-2 leading-tight`}>{t.name}</p>
              <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">{t.e} {t.skill}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-bold text-amber-600">{t.rating}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Session */}
      <div className="px-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-base font-black ${tx(dark)}`}>Upcoming Session</h2>
          <button onClick={() => nav("calendar")} className="text-xs font-semibold text-indigo-600">Calendar</button>
        </div>
        <div className={`${cd(dark)} border rounded-2xl p-4 flex items-center gap-3`}>
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl">💻</div>
          <div className="flex-1">
            <p className={`text-sm font-bold ${tx(dark)}`}>Python Fundamentals</p>
            <p className={`text-xs ${mu(dark)}`}>with Sarah Chen</p>
            <div className="flex items-center gap-1 mt-1">
              <Clock size={11} className="text-indigo-500" />
              <span className="text-[11px] text-indigo-600 font-semibold">Today, 4:00 PM · 1 hour</span>
            </div>
          </div>
          <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-200">Join</button>
        </div>
      </div>
    </div>
  );
}

// ─── 8. Explore ───────────────────────────────────────────────────────────────

const EXPLORE_SKILLS = [
  { name: "React Development", teacher: "David Park", rating: 4.9, color: "indigo" as AvatarColor, e: "⚛️", mode: "Online" },
  { name: "DSLR Photography", teacher: "Priya Sharma", rating: 4.8, color: "pink" as AvatarColor, e: "📸", mode: "Offline" },
  { name: "Guitar – Beginner", teacher: "James Lee", rating: 4.7, color: "orange" as AvatarColor, e: "🎸", mode: "Both" },
  { name: "Data Science", teacher: "Aria Kim", rating: 4.9, color: "cyan" as AvatarColor, e: "📊", mode: "Online" },
  { name: "UI/UX Design", teacher: "Mike Rodriguez", rating: 4.8, color: "purple" as AvatarColor, e: "🎨", mode: "Online" },
  { name: "Spanish Language", teacher: "Emma Wilson", rating: 4.7, color: "green" as AvatarColor, e: "🌍", mode: "Both" },
];

function ExploreScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  const [active, setActive] = useState("All");
  const filters = ["All", "Programming", "Design", "Music", "Photography", "Language"];
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      <div className="px-5 pt-4 pb-3">
        <h1 className={`text-xl font-black ${tx(dark)} mb-4`}>Explore Skills</h1>
        <div className={`flex items-center gap-3 ${ip(dark)} rounded-2xl px-4 py-3 mb-4`}>
          <Search size={17} className="text-indigo-500 flex-shrink-0" />
          <input placeholder="Skill, teacher, college..." className="flex-1 bg-transparent text-sm outline-none" />
          <button className="bg-indigo-600 text-white p-1.5 rounded-lg"><Filter size={13} /></button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-hide">
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${active === f ? "bg-indigo-600 text-white shadow-md" : `${cd(dark)} border ${tx(dark)}`}`}>{f}</button>
          ))}
        </div>
        <p className={`text-[11px] ${mu(dark)} mb-3`}>Showing {EXPLORE_SKILLS.length} results</p>
      </div>
      <div className="px-5 grid grid-cols-2 gap-3 pb-8">
        {EXPLORE_SKILLS.map(s => (
          <button key={s.name} onClick={() => nav("skill-detail")} className={`${cd(dark)} border rounded-2xl p-3 text-left`}>
            <div className={`w-full h-[70px] ${dark ? "bg-slate-700" : "bg-gradient-to-br from-indigo-50 to-cyan-50"} rounded-xl flex items-center justify-center mb-2.5`}>
              <span className="text-3xl">{s.e}</span>
            </div>
            <p className={`text-[12px] font-bold ${tx(dark)} leading-tight mb-1.5`}>{s.name}</p>
            <div className="flex items-center gap-1 mb-2">
              <Av name={s.teacher} sz={14} color={s.color} />
              <span className={`text-[9px] ${mu(dark)}`}>{s.teacher.split(" ")[0]}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-0.5">
                <Star size={9} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-bold text-amber-600">{s.rating}</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${s.mode === "Online" ? "bg-green-100 text-green-700" : s.mode === "Offline" ? "bg-orange-100 text-orange-700" : "bg-indigo-100 text-indigo-700"}`}>{s.mode}</span>
            </div>
            <button className="w-full py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-bold">Request Exchange</button>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 9. Skill Detail ─────────────────────────────────────────────────────────

function SkillDetailScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      {/* Hero */}
      <div className="relative h-52">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[120px]">⚛️</div>
        </div>
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={() => nav("explore")} className="w-9 h-9 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center"><ArrowLeft size={18} className="text-white" /></button>
          <button onClick={() => setSaved(!saved)} className="w-9 h-9 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center">
            <Heart size={18} className={saved ? "text-red-400 fill-red-400" : "text-white"} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-[10px] bg-green-500 text-white px-2.5 py-1 rounded-full font-bold mb-2 inline-block">🔥 Popular</span>
          <h1 className="text-2xl font-black text-white">React Development</h1>
        </div>
      </div>

      {/* Teacher floating card */}
      <div className={`mx-5 -mt-5 ${cd(dark)} border rounded-2xl p-4 shadow-xl mb-4`}>
        <div className="flex items-center gap-3">
          <Av name="David Park" sz={50} color="indigo" />
          <div className="flex-1">
            <h3 className={`text-[15px] font-bold ${tx(dark)}`}>David Park</h3>
            <p className={`text-[11px] ${mu(dark)}`}>🎓 Seoul National University</p>
            <div className="flex items-center gap-2 mt-1">
              <Stars rating={4.9} />
              <span className="text-[11px] font-bold text-amber-600">4.9</span>
              <span className={`text-[11px] ${mu(dark)}`}>(127)</span>
            </div>
          </div>
          <button onClick={() => nav("chat")} className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <MessageCircle size={18} className="text-indigo-600" />
          </button>
        </div>
      </div>

      <div className="px-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[["⏱", "3 Years", "Experience"], ["👥", "48", "Students"], ["📅", "183", "Sessions"]].map(([ic, v, l]) => (
            <div key={l} className={`${cd(dark)} border rounded-2xl p-3 text-center`}>
              <span className="text-xl mb-1 block">{ic}</span>
              <p className={`text-[13px] font-black ${tx(dark)}`}>{v}</p>
              <p className={`text-[10px] ${mu(dark)}`}>{l}</p>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="mb-5">
          <h3 className={`text-sm font-black ${tx(dark)} mb-2`}>About</h3>
          <p className={`text-[12px] leading-relaxed ${mu(dark)}`}>
            CS student with 3 years of React experience. I teach components, hooks, state management, and full-stack apps with Next.js. Looking to learn photography in exchange!
          </p>
        </div>

        {/* Skill Exchange */}
        <div className="mb-5">
          <h3 className={`text-sm font-black ${tx(dark)} mb-3`}>Skill Exchange</h3>
          <div className="flex gap-3">
            <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-2xl p-3">
              <p className="text-[9px] text-indigo-600 font-black mb-1.5 uppercase tracking-wider">Teaches</p>
              <div className="flex flex-wrap gap-1">
                {["React", "TypeScript", "Next.js"].map(s => <span key={s} className="text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">{s}</span>)}
              </div>
            </div>
            <div className="flex-1 bg-cyan-50 border border-cyan-100 rounded-2xl p-3">
              <p className="text-[9px] text-cyan-600 font-black mb-1.5 uppercase tracking-wider">Wants</p>
              <div className="flex flex-wrap gap-1">
                {["DSLR", "Editing", "Lighting"].map(s => <span key={s} className="text-[9px] bg-cyan-600 text-white px-2 py-0.5 rounded-full font-bold">{s}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-5">
          <h3 className={`text-sm font-black ${tx(dark)} mb-2`}>Availability</h3>
          <div className="flex gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
              <div key={d} className={`flex-1 py-2 rounded-xl text-center text-[10px] font-bold ${[0, 2, 4, 5].includes(i) ? "bg-indigo-600 text-white" : `${cd(dark)} border ${mu(dark)}`}`}>{d}</div>
            ))}
          </div>
        </div>

        {/* Review preview */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className={`text-sm font-black ${tx(dark)}`}>Reviews</h3>
            <button onClick={() => nav("reviews")} className="text-[11px] font-semibold text-indigo-600">See All (127)</button>
          </div>
          <div className={`${cd(dark)} border rounded-2xl p-3.5`}>
            <div className="flex items-center gap-2 mb-2">
              <Av name="Emma W" sz={28} color="green" />
              <div>
                <p className={`text-xs font-bold ${tx(dark)}`}>Emma Wilson</p>
                <Stars rating={5} />
              </div>
            </div>
            <p className={`text-[11px] ${mu(dark)} leading-relaxed`}>"David is an amazing teacher! He explained React hooks so intuitively. Highly recommend!"</p>
          </div>
        </div>

        <div className="pb-8">
          <button onClick={() => nav("exchange-request")} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-200/60 text-sm">
            📩 Request Skill Exchange
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 10. Chat List ────────────────────────────────────────────────────────────

const CONVOS = [
  { name: "Sarah Chen", msg: "Ready for our Python session? 🐍", time: "2m", unread: 2, color: "indigo" as AvatarColor, online: true },
  { name: "Mike Rodriguez", msg: "I shared the design files 📎", time: "15m", unread: 0, color: "cyan" as AvatarColor, online: true },
  { name: "David Park", msg: "Great session today! Thanks 🙏", time: "1h", unread: 0, color: "purple" as AvatarColor, online: false },
  { name: "Emma Wilson", msg: "Can we reschedule to Friday?", time: "3h", unread: 1, color: "green" as AvatarColor, online: false },
  { name: "Priya Sharma", msg: "Sent you the photography tips doc!", time: "1d", unread: 0, color: "pink" as AvatarColor, online: false },
  { name: "James Lee", msg: "Your chord progression was fire 🎵", time: "2d", unread: 0, color: "orange" as AvatarColor, online: false },
];

function ChatListScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-xl font-black ${tx(dark)}`}>Messages</h1>
          <button className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-200">
            <Plus size={18} className="text-white" />
          </button>
        </div>
        <div className={`flex items-center gap-3 ${ip(dark)} rounded-2xl px-4 py-3`}>
          <Search size={16} className="text-indigo-500 flex-shrink-0" />
          <input placeholder="Search conversations..." className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>
      <div className="px-5">
        {CONVOS.map(c => (
          <button key={c.name} onClick={() => nav("chat")} className={`w-full flex items-center gap-3 py-3.5 border-b ${dark ? "border-slate-700/60" : "border-gray-100"} last:border-0`}>
            <div className="relative">
              <Av name={c.name} sz={48} color={c.color} />
              {c.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-[13px] font-bold ${tx(dark)}`}>{c.name}</p>
                <span className={`text-[10px] ${mu(dark)}`}>{c.time}</span>
              </div>
              <p className={`text-xs ${mu(dark)} mt-0.5 truncate`}>{c.msg}</p>
            </div>
            {c.unread > 0 && (
              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] text-white font-black">{c.unread}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 11. Chat ─────────────────────────────────────────────────────────────────

const CHAT_MSGS = [
  { id: 1, text: "Hey! Ready for our Python session today? 🐍", sent: false, time: "3:45 PM", read: true },
  { id: 2, text: "Yes! Super excited. I have been practicing list comprehensions all day 💪", sent: true, time: "3:46 PM", read: true },
  { id: 3, text: "Perfect! Let us start with that. Can you share your Jupyter notebook setup?", sent: false, time: "3:47 PM", read: true },
  { id: 4, text: "Sure, sharing now 📎", sent: true, time: "3:47 PM", read: true },
  { id: 5, text: "Got it! This looks great 🔥 Let me prepare some exercises for you", sent: false, time: "3:48 PM", read: false },
];

function ChatScreen({ nav, dark, msg, setMsg }: { nav: NavFn; dark: boolean; msg: string; setMsg: (m: string) => void }) {
  return (
    <div className={`${bg(dark)} flex flex-col`} style={{ height: 790 }}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 ${cd(dark)} border-b`}>
        <button onClick={() => nav("chat-list")}><ArrowLeft size={20} className={tx(dark)} /></button>
        <div className="relative">
          <Av name="Sarah Chen" sz={36} color="indigo" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-bold ${tx(dark)}`}>Sarah Chen</p>
          <p className="text-[10px] text-green-500 font-semibold">Online · Python Teacher</p>
        </div>
        <div className="flex gap-2">
          <button className={`w-8 h-8 ${ip(dark)} rounded-xl flex items-center justify-center`}><Phone size={14} className={tx(dark)} /></button>
          <button className={`w-8 h-8 ${ip(dark)} rounded-xl flex items-center justify-center`}><Video size={14} className={tx(dark)} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto flex flex-col gap-3 scrollbar-hide">
        <div className="flex justify-center">
          <span className={`text-[10px] ${mu(dark)} px-3 py-1 ${dark ? "bg-slate-800" : "bg-gray-100"} rounded-full`}>Today</span>
        </div>
        {CHAT_MSGS.map(m => (
          <div key={m.id} className={`flex ${m.sent ? "justify-end" : "justify-start"} gap-2`}>
            {!m.sent && <Av name="Sarah Chen" sz={26} color="indigo" />}
            <div className="max-w-[72%]">
              <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                m.sent ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-sm" : `${cd(dark)} border ${tx(dark)} rounded-bl-sm`
              }`}>{m.text}</div>
              <div className={`flex items-center gap-1 mt-0.5 ${m.sent ? "justify-end" : ""}`}>
                <span className={`text-[9px] ${mu(dark)}`}>{m.time}</span>
                {m.sent && <CheckCircle size={9} className={m.read ? "text-cyan-500" : "text-gray-400"} />}
              </div>
            </div>
          </div>
        ))}
        {/* Typing indicator */}
        <div className="flex gap-2">
          <Av name="Sarah Chen" sz={26} color="indigo" />
          <div className={`${cd(dark)} border px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center`}>
            {[0, 150, 300].map(d => <div key={d} className={`w-1.5 h-1.5 ${dark ? "bg-slate-500" : "bg-gray-400"} rounded-full animate-bounce`} style={{ animationDelay: `${d}ms` }} />)}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className={`px-3 py-3 ${cd(dark)} border-t`}>
        <div className="flex items-center gap-2">
          <button className={`w-9 h-9 ${ip(dark)} rounded-xl flex items-center justify-center flex-shrink-0`}><Plus size={16} className="text-indigo-500" /></button>
          <div className={`flex-1 flex items-center gap-2 ${ip(dark)} rounded-2xl px-3 py-2.5`}>
            <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent text-sm outline-none" />
            <Smile size={15} className="text-gray-400 flex-shrink-0" />
          </div>
          <button className={`w-9 h-9 ${ip(dark)} rounded-xl flex items-center justify-center flex-shrink-0`}><Mic size={15} className="text-indigo-500" /></button>
          <button className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-300">
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 12. Calendar ────────────────────────────────────────────────────────────

const HAS_SESSION = [4, 7, 11, 14, 17, 20, 22, 25, 28];
const DAY_SESSIONS = [
  { time: "10:00 AM", dur: "1h", title: "Python Fundamentals", teacher: "Sarah Chen", type: "Online", dot: "#4F46E5" },
  { time: "2:00 PM", dur: "1.5h", title: "React Workshop", teacher: "David Park", type: "Online", dot: "#06B6D4" },
  { time: "6:00 PM", dur: "45m", title: "Spanish Conversation", teacher: "Emma Wilson", type: "Online", dot: "#22C55E" },
];

function CalendarScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  const [sel, setSel] = useState(17);
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-xl font-black ${tx(dark)}`}>Calendar</h1>
            <p className={`text-[11px] ${mu(dark)}`}>July 2026</p>
          </div>
          <button className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-200"><Plus size={18} className="text-white" /></button>
        </div>

        {/* Monthly calendar */}
        <div className={`${cd(dark)} border rounded-2xl p-4 mb-5`}>
          <div className="flex items-center justify-between mb-3">
            <button className={`w-8 h-8 ${ip(dark)} rounded-xl flex items-center justify-center`}><ChevronDown size={14} className={`${tx(dark)} rotate-90`} /></button>
            <p className={`text-sm font-black ${tx(dark)}`}>July 2026</p>
            <button className={`w-8 h-8 ${ip(dark)} rounded-xl flex items-center justify-center`}><ChevronDown size={14} className={`${tx(dark)} -rotate-90`} /></button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className={`text-center text-[10px] font-bold ${mu(dark)} py-1`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5">
            {/* July 2026 starts Wednesday = 3 empty cells */}
            {[0, 1, 2].map(i => <div key={`e${i}`} />)}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <button key={d} onClick={() => setSel(d)} className={`relative h-9 w-9 mx-auto flex items-center justify-center rounded-full text-[12px] font-semibold transition-all ${d === sel ? "bg-indigo-600 text-white" : `${tx(dark)} hover:bg-indigo-50`}`}>
                {d}
                {HAS_SESSION.includes(d) && d !== sel && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-[15px] font-black ${tx(dark)}`}>July {sel}</h2>
          <span className={`text-[11px] ${mu(dark)}`}>{DAY_SESSIONS.length} sessions</span>
        </div>
        <div className="flex flex-col gap-3 pb-8">
          {DAY_SESSIONS.map(s => (
            <div key={s.title} className={`${cd(dark)} border rounded-2xl p-4 flex items-center gap-3`}>
              <div className="w-1.5 h-16 rounded-full flex-shrink-0" style={{ background: s.dot }} />
              <div className="flex-1">
                <p className={`text-[13px] font-bold ${tx(dark)}`}>{s.title}</p>
                <p className={`text-[11px] ${mu(dark)}`}>with {s.teacher}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-indigo-500" />
                    <span className="text-[10px] text-indigo-600 font-semibold">{s.time} · {s.dur}</span>
                  </div>
                  <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{s.type}</span>
                </div>
              </div>
              <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-md shadow-indigo-200 flex-shrink-0">Join</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 13. Profile ─────────────────────────────────────────────────────────────

function ProfileScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  const [tab, setTab] = useState("skills");
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      {/* Cover */}
      <div className="relative h-36 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-3 left-8 w-20 h-20 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-3 right-12 w-10 h-10 border border-white/20 rounded-full" />
          <div className="absolute top-8 right-6 w-6 h-6 border border-white/20 rounded-full" />
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <button onClick={() => nav("settings")} className="w-9 h-9 bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center"><Settings size={16} className="text-white" /></button>
          <button className="w-9 h-9 bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center"><Edit2 size={16} className="text-white" /></button>
        </div>
      </div>

      <div className="px-5 -mt-8 mb-4">
        <div className="flex items-end gap-4">
          <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
            <span className="text-2xl font-black text-white">AJ</span>
          </div>
          <div className="pb-1">
            <h1 className={`text-lg font-black ${tx(dark)}`}>Alex Johnson</h1>
            <p className={`text-[11px] ${mu(dark)}`}>🎓 MIT · Computer Science · Year 3</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {[["23", "Sessions"], ["4.8", "Rating"], ["12", "Skills"], ["8", "Taught"]].map(([v, l]) => (
            <div key={l} className={`${cd(dark)} border rounded-2xl p-3 text-center`}>
              <p className="text-[15px] font-black text-indigo-600">{v}</p>
              <p className={`text-[10px] ${mu(dark)}`}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mb-4">
        <p className={`text-[12px] leading-relaxed ${mu(dark)}`}>CS Student @ MIT | React Developer | UI/UX Enthusiast | Looking to learn photography and music | Open for skill exchanges!</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {["React", "Python", "TypeScript", "Node.js"].map(t => (
            <span key={t} className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-bold">{t}</span>
          ))}
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className={`flex ${cd(dark)} border rounded-2xl p-1`}>
          {["skills", "achievements", "reviews"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-[11px] font-bold capitalize transition-all ${tab === t ? "bg-indigo-600 text-white shadow" : mu(dark)}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-8">
        {tab === "skills" && (
          <>
            <p className={`text-[10px] font-black ${mu(dark)} uppercase tracking-wider mb-2`}>I Teach</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["React Development", "JavaScript", "TypeScript", "Node.js", "Python Basics"].map(s => <span key={s} className="text-[11px] bg-indigo-600 text-white px-3 py-1.5 rounded-full font-bold">{s}</span>)}
            </div>
            <p className={`text-[10px] font-black ${mu(dark)} uppercase tracking-wider mb-2`}>I Want to Learn</p>
            <div className="flex flex-wrap gap-2">
              {["Photography", "Guitar", "Spanish", "Video Editing"].map(s => <span key={s} className="text-[11px] bg-cyan-100 text-cyan-700 px-3 py-1.5 rounded-full font-bold">{s}</span>)}
            </div>
          </>
        )}
        {tab === "achievements" && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { e: "🏆", l: "Champion", d: "10+ students" },
              { e: "⭐", l: "5 Star", d: "Perfect rating" },
              { e: "🔥", l: "On Fire", d: "30 day streak" },
              { e: "📚", l: "Scholar", d: "10 skills" },
              { e: "🤝", l: "Connector", d: "20 swaps" },
              { e: "🎓", l: "Certified", d: "Verified" },
            ].map(a => (
              <div key={a.l} className={`${cd(dark)} border rounded-2xl p-3 text-center`}>
                <span className="text-2xl mb-1 block">{a.e}</span>
                <p className={`text-[10px] font-bold ${tx(dark)}`}>{a.l}</p>
                <p className={`text-[9px] ${mu(dark)}`}>{a.d}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "reviews" && (
          <div className="flex flex-col gap-3">
            {[
              { name: "Sarah C", text: "Alex is brilliant! Helped me understand Python so quickly.", r: 5, c: "indigo" as AvatarColor },
              { name: "David P", text: "Great exchange — very patient and knowledgeable!", r: 5, c: "cyan" as AvatarColor },
              { name: "Emma W", text: "Loves teaching! Clear explanations and super friendly.", r: 4, c: "green" as AvatarColor },
            ].map(r => (
              <div key={r.name} className={`${cd(dark)} border rounded-2xl p-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <Av name={r.name} sz={28} color={r.c} />
                  <div><p className={`text-xs font-bold ${tx(dark)}`}>{r.name}</p><Stars rating={r.r} /></div>
                </div>
                <p className={`text-[11px] ${mu(dark)}`}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 14. Exchange Request ─────────────────────────────────────────────────────

function ExchangeRequestScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  const [status, setStatus] = useState<"idle" | "sent" | "declined">("idle");
  const [selTimes, setSelTimes] = useState([0, 2]);
  const times = ["Monday 4–5 PM", "Wednesday 3–4 PM", "Friday 6–7 PM", "Saturday 10–11 AM"];
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      <Bar2 label="Exchange Request" nav={nav} back="skill-detail" dark={dark} />
      <div className="px-5 pt-5">
        {/* Request summary */}
        <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-3xl p-5 mb-5 text-white shadow-2xl shadow-indigo-200/50">
          <div className="flex items-center gap-3 mb-4">
            <Av name="David Park" sz={46} color="indigo" />
            <div>
              <p className="font-black text-[15px]">David Park</p>
              <p className="text-white/70 text-[11px]">React Development · 3 years exp</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-3 mb-4">
            <div className="flex-1 text-center">
              <p className="text-[9px] opacity-80 mb-0.5">You Offer</p>
              <p className="font-black text-sm">📸 Photography</p>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">⇄</div>
            <div className="flex-1 text-center">
              <p className="text-[9px] opacity-80 mb-0.5">You Learn</p>
              <p className="font-black text-sm">⚛️ React Dev</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["📅 Mon, Wed, Fri", "⏱ 1hr sessions", "💻 Online"].map(t => (
              <span key={t} className="text-[10px] bg-white/20 rounded-xl px-3 py-1 font-semibold">{t}</span>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="mb-5">
          <label className={`text-xs font-black ${mu(dark)} uppercase tracking-wider mb-2 block`}>Your Message</label>
          <textarea
            className={`w-full ${ip(dark)} rounded-2xl px-4 py-3 text-[13px] outline-none resize-none leading-relaxed`}
            rows={4}
            defaultValue="Hi David! I would love to exchange skills with you. I have been doing photography for 3 years and would love to learn React from you. Looking forward to our sessions!"
          />
        </div>

        {/* Preferred Times */}
        <div className="mb-6">
          <label className={`text-xs font-black ${mu(dark)} uppercase tracking-wider mb-3 block`}>Preferred Times</label>
          <div className="grid grid-cols-2 gap-2">
            {times.map((t, i) => (
              <button key={t} onClick={() => setSelTimes(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])} className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${selTimes.includes(i) ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : `${cd(dark)} border ${tx(dark)}`}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Status display */}
        {status === "sent" && (
          <div className="bg-green-100 border border-green-200 rounded-2xl p-4 flex items-center gap-3 mb-4">
            <CheckCircle size={22} className="text-green-600 flex-shrink-0" />
            <div><p className="text-sm font-bold text-green-800">Request Sent!</p><p className="text-[11px] text-green-600">David will respond within 24 hours</p></div>
          </div>
        )}
        {status === "declined" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 mb-4">
            <X size={22} className="text-red-500 flex-shrink-0" />
            <div><p className="text-sm font-bold text-red-700">Request Cancelled</p><p className="text-[11px] text-red-500">Browse other skill teachers</p></div>
          </div>
        )}

        {status === "idle" && (
          <div className="flex gap-3 mb-4">
            <button onClick={() => setStatus("declined")} className={`flex-1 py-3.5 ${cd(dark)} border rounded-2xl text-sm font-bold text-red-500`}>✕ Cancel</button>
            <button onClick={() => setStatus("sent")} className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-200/60">✓ Send Request</button>
          </div>
        )}
        <button onClick={() => nav("explore")} className={`w-full py-3 ${cd(dark)} border rounded-2xl text-sm font-semibold ${tx(dark)} mb-8`}>Explore Other Skills</button>
      </div>
    </div>
  );
}

// ─── 15. Notifications ────────────────────────────────────────────────────────

const NOTIFS = [
  { e: "✅", title: "Exchange Accepted!", desc: "David Park accepted your React exchange request", time: "2 min ago", unread: true },
  { e: "📅", title: "Session Reminder", desc: "Python session with Sarah Chen in 1 hour", time: "45 min ago", unread: true },
  { e: "💬", title: "New Message", desc: "Mike: I sent the design files!", time: "1h ago", unread: true },
  { e: "⭐", title: "New Review!", desc: "Emma Wilson left you a 5-star review", time: "3h ago", unread: false },
  { e: "🔔", title: "Session Completed", desc: "Python session complete. Rate Sarah?", time: "1d ago", unread: false },
  { e: "👥", title: "New Interest", desc: "Priya Sharma is interested in your photography", time: "2d ago", unread: false },
  { e: "🏆", title: "Achievement Unlocked!", desc: "You earned the Top Teacher badge!", time: "3d ago", unread: false },
];

function NotificationsScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      <Bar2 label="Notifications" nav={nav} back="home" dark={dark} right={
        <button className="text-[11px] font-bold text-indigo-600">Mark All</button>
      } />
      <div className="px-5 pt-4">
        <p className={`text-[10px] font-black ${mu(dark)} uppercase tracking-wider mb-3`}>Recent</p>
        <div className="flex flex-col gap-2 pb-8">
          {NOTIFS.map((n, i) => (
            <div key={i} className={`flex items-start gap-3 ${cd(dark)} border rounded-2xl p-4 relative ${n.unread ? "border-indigo-200" : ""}`}>
              {n.unread && <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full" />}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${n.unread ? "bg-indigo-100" : dark ? "bg-slate-700" : "bg-gray-100"}`}>{n.e}</div>
              <div className="flex-1">
                <p className={`text-[13px] font-bold ${tx(dark)}`}>{n.title}</p>
                <p className={`text-[11px] ${mu(dark)} mt-0.5 leading-relaxed`}>{n.desc}</p>
                <p className="text-[10px] text-indigo-500 font-semibold mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 16. Settings ─────────────────────────────────────────────────────────────

function SettingsScreen({ nav, dark, setDark }: { nav: NavFn; dark: boolean; setDark: (v: boolean) => void }) {
  const [notif, setNotif] = useState(true);
  const [loc, setLoc] = useState(false);
  const sections = [
    {
      title: "Preferences",
      items: [
        { e: "🌙", l: "Dark Mode", type: "toggle", v: dark, cb: () => setDark(!dark) },
        { e: "🔔", l: "Notifications", type: "toggle", v: notif, cb: () => setNotif(!notif) },
        { e: "📍", l: "Location Services", type: "toggle", v: loc, cb: () => setLoc(!loc) },
        { e: "🌍", l: "Language", type: "chip", chip: "English" },
      ]
    },
    {
      title: "Account",
      items: [
        { e: "🔒", l: "Privacy Settings", type: "nav" },
        { e: "🛡️", l: "Security", type: "nav" },
        { e: "🎓", l: "Student Verification", type: "nav" },
        { e: "💳", l: "Subscription", type: "nav" },
      ]
    },
    {
      title: "Support",
      items: [
        { e: "❓", l: "Help Center", type: "nav" },
        { e: "ℹ️", l: "About SkillSwap", type: "nav" },
        { e: "⭐", l: "Rate the App", type: "nav" },
      ]
    },
  ];
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      <Bar2 label="Settings" nav={nav} back="profile" dark={dark} />
      <div className="px-5 pt-4 pb-8">
        <div className={`${cd(dark)} border rounded-2xl p-4 mb-5 flex items-center gap-3`}>
          <Av name="Alex Johnson" sz={50} color="indigo" />
          <div className="flex-1">
            <p className={`text-sm font-bold ${tx(dark)}`}>Alex Johnson</p>
            <p className={`text-[11px] ${mu(dark)}`}>alex@mit.edu</p>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">Pro Member</span>
          </div>
          <ChevronRight size={16} className={mu(dark)} />
        </div>
        {sections.map(sec => (
          <div key={sec.title} className="mb-4">
            <p className={`text-[10px] font-black ${mu(dark)} uppercase tracking-wider mb-2 px-1`}>{sec.title}</p>
            <div className={`${cd(dark)} border rounded-2xl overflow-hidden`}>
              {sec.items.map((item, idx) => (
                <div key={item.l} className={`flex items-center gap-3 px-4 py-3.5 ${idx < sec.items.length - 1 ? `border-b ${dark ? "border-slate-700/60" : "border-gray-100"}` : ""}`}>
                  <span className="text-lg w-7 flex-shrink-0">{item.e}</span>
                  <p className={`flex-1 text-sm font-medium ${tx(dark)}`}>{item.l}</p>
                  {item.type === "toggle" && <Toggle on={item.v as boolean} onChange={item.cb!} />}
                  {item.type === "chip" && <span className={`text-[11px] ${mu(dark)}`}>{item.chip} <ChevronRight size={12} className="inline" /></span>}
                  {item.type === "nav" && <ChevronRight size={16} className={mu(dark)} />}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="w-full py-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center gap-2 text-red-500 font-bold text-sm mt-2">
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );
}

// ─── 17. Learning Progress ────────────────────────────────────────────────────

function ProgressScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  const progressItems = [
    { name: "React Development", pct: 85 },
    { name: "Python & ML", pct: 70 },
    { name: "UI/UX Design", pct: 60 },
    { name: "Photography", pct: 45 },
  ];
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      <Bar2 label="My Progress" nav={nav} back="home" dark={dark} />
      <div className="px-5 pt-5">
        {/* Circular Progress */}
        <div className="flex justify-center mb-6">
          <div className="relative" style={{ width: 168, height: 168 }}>
            <svg width="168" height="168" viewBox="0 0 168 168" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="84" cy="84" r="70" fill="none" stroke={dark ? "#1e293b" : "#EEF2FF"} strokeWidth="12" />
              <circle cx="84" cy="84" r="70" fill="none" stroke="url(#prog)" strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 70 * 0.78} ${2 * Math.PI * 70}`} strokeLinecap="round" />
              <defs>
                <linearGradient id="prog" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${tx(dark)}`}>78%</span>
              <span className={`text-[10px] ${mu(dark)}`}>Overall</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { e: "⏱", v: "47h", l: "Hours Learned", bg: "bg-indigo-100", tc: "text-indigo-600" },
            { e: "📅", v: "23", l: "Sessions Done", bg: "bg-cyan-100", tc: "text-cyan-600" },
            { e: "🎯", v: "12", l: "Skills Mastered", bg: "bg-green-100", tc: "text-green-600" },
            { e: "🏅", v: "8", l: "Certificates", bg: "bg-purple-100", tc: "text-purple-600" },
          ].map(s => (
            <div key={s.l} className={`${cd(dark)} border rounded-2xl p-4 flex items-center gap-3`}>
              <div className={`w-11 h-11 ${s.bg} rounded-2xl flex items-center justify-center text-xl flex-shrink-0`}>{s.e}</div>
              <div>
                <p className={`text-lg font-black ${s.tc}`}>{s.v}</p>
                <p className={`text-[10px] ${mu(dark)}`}>{s.l}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Skills progress bars */}
        <div className={`${cd(dark)} border rounded-2xl p-4 mb-5`}>
          <h3 className={`text-sm font-black ${tx(dark)} mb-4`}>Skills Progress</h3>
          {progressItems.map(p => (
            <div key={p.name} className="mb-3 last:mb-0">
              <div className="flex justify-between mb-1.5">
                <span className={`text-[12px] font-semibold ${tx(dark)}`}>{p.name}</span>
                <span className="text-[12px] font-black text-indigo-600">{p.pct}%</span>
              </div>
              <div className={`h-2 rounded-full ${dark ? "bg-slate-700" : "bg-gray-100"}`}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.pct}%`, background: "linear-gradient(90deg, #4F46E5, #06B6D4)" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="mb-8">
          <h3 className={`text-sm font-black ${tx(dark)} mb-3`}>Achievement Badges</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { e: "🏆", n: "Champion", ok: true },
              { e: "⭐", n: "5 Star", ok: true },
              { e: "🔥", n: "On Fire", ok: true },
              { e: "📚", n: "Scholar", ok: true },
              { e: "🤝", n: "Connector", ok: false },
              { e: "🚀", n: "Launcher", ok: false },
            ].map(b => (
              <div key={b.n} className={`${cd(dark)} border rounded-2xl p-3 text-center ${!b.ok ? "opacity-40" : ""}`}>
                <span className="text-2xl mb-1 block">{b.e}</span>
                <p className={`text-[10px] font-bold ${tx(dark)}`}>{b.n}</p>
                {b.ok && <span className="text-[9px] text-green-600 font-semibold">Earned ✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 18. Admin Dashboard ─────────────────────────────────────────────────────

const BAR_DATA = [
  { m: "Jan", users: 400, sessions: 240 }, { m: "Feb", users: 620, sessions: 380 },
  { m: "Mar", users: 820, sessions: 510 }, { m: "Apr", users: 1100, sessions: 690 },
  { m: "May", users: 1350, sessions: 860 }, { m: "Jun", users: 1600, sessions: 1010 },
  { m: "Jul", users: 1920, sessions: 1230 },
];

const PIE_DATA = [
  { name: "Programming", value: 35, color: "#4F46E5" },
  { name: "Design", value: 22, color: "#06B6D4" },
  { name: "Music", value: 18, color: "#22C55E" },
  { name: "Language", value: 15, color: "#F59E0B" },
  { name: "Other", value: 10, color: "#EC4899" },
];

function AdminScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      <div className={`px-5 pt-4 pb-3 ${cd(dark)} border-b`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-lg font-black ${tx(dark)}`}>Admin Dashboard</h1>
            <p className={`text-[11px] ${mu(dark)}`}>July 2026 Overview</p>
          </div>
          <Av name="Admin User" sz={36} color="indigo" />
        </div>
      </div>
      <div className="px-5 pt-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { e: "👥", l: "Total Users", v: "12,847", chg: "+18%", bg: "bg-indigo-50", tc: "text-indigo-600" },
            { e: "🟢", l: "Active Users", v: "8,312", chg: "+12%", bg: "bg-green-50", tc: "text-green-600" },
            { e: "📚", l: "Skills Listed", v: "3,492", chg: "+24%", bg: "bg-cyan-50", tc: "text-cyan-600" },
            { e: "✅", l: "Completed", v: "9,871", chg: "+31%", bg: "bg-purple-50", tc: "text-purple-600" },
          ].map(s => (
            <div key={s.l} className={`${cd(dark)} border rounded-2xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center text-lg`}>{s.e}</div>
                <span className="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{s.chg}</span>
              </div>
              <p className={`text-[17px] font-black ${tx(dark)}`}>{s.v}</p>
              <p className={`text-[10px] ${mu(dark)}`}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className={`${cd(dark)} border rounded-2xl p-4 mb-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-black ${tx(dark)}`}>User Growth</h3>
            <div className="flex gap-3 text-[9px] font-bold">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-600 rounded-full inline-block" />Users</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-cyan-500 rounded-full inline-block" />Sessions</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={BAR_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -22 }}>
              <XAxis dataKey="m" tick={{ fontSize: 9, fill: dark ? "#94a3b8" : "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: dark ? "#94a3b8" : "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#1e293b" : "#fff", border: "none", borderRadius: 12, fontSize: 11, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="users" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={16} />
              <Bar dataKey="sessions" fill="#06B6D4" radius={[4, 4, 0, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className={`${cd(dark)} border rounded-2xl p-4 mb-4`}>
          <h3 className={`text-sm font-black ${tx(dark)} mb-3`}>Category Distribution</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" strokeWidth={0}>
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1">
              {PIE_DATA.map(d => (
                <div key={d.name} className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className={`text-[10px] ${tx(dark)}`}>{d.name}</span>
                  </div>
                  <span className={`text-[10px] font-black ${tx(dark)}`}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className={`${cd(dark)} border rounded-2xl p-4 mb-8`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-black ${tx(dark)}`}>Pending Actions</h3>
            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black">23 urgent</span>
          </div>
          {[
            { l: "Pending Requests", n: 47, c: "text-amber-600" },
            { l: "Reported Users", n: 8, c: "text-red-600" },
            { l: "Verification Queue", n: 156, c: "text-indigo-600" },
          ].map((it, i) => (
            <div key={it.l} className={`flex items-center justify-between py-2.5 ${i < 2 ? `border-b ${dark ? "border-slate-700/60" : "border-gray-100"}` : ""}`}>
              <span className={`text-[12px] ${tx(dark)}`}>{it.l}</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[12px] font-black ${it.c}`}>{it.n}</span>
                <ChevronRight size={14} className={mu(dark)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 19. Reviews ─────────────────────────────────────────────────────────────

const REVIEWS_DATA = [
  { name: "Emma Wilson", r: 5, text: "David is an incredible React teacher! His explanations are clear, patient, and super practical. Best exchange on SkillSwap!", date: "Jul 15", color: "green" as AvatarColor, ver: true },
  { name: "James Lee", r: 5, text: "Learned so much in just 2 sessions. The real-world project approach really helped me understand React components and hooks.", date: "Jul 10", color: "orange" as AvatarColor, ver: true },
  { name: "Aria Kim", r: 4, text: "Great teacher, very knowledgeable. Would love a more structured curriculum next time! Overall fantastic experience.", date: "Jun 28", color: "cyan" as AvatarColor, ver: false },
  { name: "Priya Sharma", r: 5, text: "Amazing exchange! David taught me React while I taught him photography. Perfect skill swap!", date: "Jun 20", color: "pink" as AvatarColor, ver: true },
];

function ReviewsScreen({ nav, dark }: { nav: NavFn; dark: boolean }) {
  const dist = [5, 4, 3, 2, 1].map((r, i) => ({ r, n: [89, 28, 6, 3, 1][i], pct: [70, 22, 5, 2, 1][i] }));
  return (
    <div className={`min-h-[790px] ${bg(dark)}`}>
      <Bar2 label="Reviews" nav={nav} back="skill-detail" dark={dark} />
      <div className="px-5 pt-4">
        {/* Summary */}
        <div className={`${cd(dark)} border rounded-2xl p-5 mb-5`}>
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <p className={`text-5xl font-black ${tx(dark)}`}>4.9</p>
              <Stars rating={4.9} />
              <p className={`text-[10px] ${mu(dark)} mt-1`}>127 reviews</p>
            </div>
            <div className="flex-1">
              {dist.map(d => (
                <div key={d.r} className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] ${mu(dark)} w-3 text-right`}>{d.r}</span>
                  <Star size={9} className="text-amber-400 fill-amber-400" />
                  <div className={`flex-1 h-1.5 ${dark ? "bg-slate-700" : "bg-gray-100"} rounded-full`}>
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className={`text-[10px] ${mu(dark)} w-4 text-right`}>{d.n}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-200/50">
            ✍️ Write a Review
          </button>
        </div>

        <div className="flex flex-col gap-3 pb-8">
          {REVIEWS_DATA.map(r => (
            <div key={r.name} className={`${cd(dark)} border rounded-2xl p-4`}>
              <div className="flex items-start gap-3 mb-3">
                <Av name={r.name} sz={38} color={r.color} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-[13px] font-bold ${tx(dark)}`}>{r.name}</p>
                    {r.ver && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-black">✓ Verified</span>}
                  </div>
                  <Stars rating={r.r} />
                </div>
                <span className={`text-[10px] ${mu(dark)} flex-shrink-0`}>{r.date}</span>
              </div>
              <p className={`text-[12px] leading-relaxed ${mu(dark)}`}>{r.text}</p>
              <button className={`flex items-center gap-1.5 mt-3 text-[10px] ${mu(dark)} hover:text-indigo-600 transition-colors`}>
                <ThumbsUp size={11} /> Helpful (12)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

const NAV_TABS = [
  { id: "home", Icon: Home, label: "Home", screen: "home" as Screen },
  { id: "explore", Icon: Search, label: "Explore", screen: "explore" as Screen },
  { id: "chat", Icon: MessageCircle, label: "Messages", screen: "chat-list" as Screen },
  { id: "calendar", Icon: Calendar, label: "Calendar", screen: "calendar" as Screen },
  { id: "profile", Icon: User, label: "Profile", screen: "profile" as Screen },
];

function BottomNav({ active, setActive, nav, dark }: {
  active: string; setActive: (t: string) => void; nav: NavFn; dark: boolean;
}) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 ${cd(dark)} border-t pt-2 pb-4`} style={{ borderRadius: "0 0 52px 52px" }}>
      <div className="flex items-center justify-around px-2">
        {NAV_TABS.map(({ id, Icon, label, screen }) => {
          const on = active === id;
          return (
            <button key={id} onClick={() => { setActive(id); nav(screen); }} className="flex flex-col items-center gap-0.5 relative py-1 px-2">
              {on && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-indigo-600 rounded-full" />}
              <div className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all ${on ? "bg-indigo-100" : ""}`}>
                <Icon size={20} className={on ? "text-indigo-600" : mu(dark)} />
              </div>
              <span className={`text-[9px] font-bold ${on ? "text-indigo-600" : mu(dark)}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Screen Selector (sidebar) ────────────────────────────────────────────────

const SCREEN_LIST: [Screen, string, string][] = [
  ["splash", "Splash", "🚀"],
  ["onboarding", "Onboarding", "✨"],
  ["login", "Login", "🔐"],
  ["register", "Register", "📝"],
  ["forgot-password", "Forgot Password", "🔑"],
  ["otp", "OTP Verify", "✅"],
  ["home", "Home", "🏠"],
  ["explore", "Explore", "🔍"],
  ["skill-detail", "Skill Detail", "⚛️"],
  ["chat-list", "Chat List", "💬"],
  ["chat", "Chat Screen", "📨"],
  ["calendar", "Calendar", "📅"],
  ["profile", "Profile", "👤"],
  ["exchange-request", "Exchange Request", "🤝"],
  ["notifications", "Notifications", "🔔"],
  ["settings", "Settings", "⚙️"],
  ["progress", "Progress", "📈"],
  ["admin", "Admin Dashboard", "🛠"],
  ["reviews", "Reviews", "⭐"],
];

// ─── Main App ─────────────────────────────────────────────────────────────────

const MAIN_SCREENS = ["home", "explore", "chat-list", "calendar", "profile"];

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [dark, setDark] = useState(false);
  const [obPage, setObPage] = useState(0);
  const [activeTab, setActiveTab] = useState("home");
  const [showPw, setShowPw] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);

  const nav: NavFn = useCallback((s: Screen) => {
    if (editMode) return; // lock navigation while editing
    setScreen(s);
    if (s === "chat-list") setActiveTab("chat");
    else if (MAIN_SCREENS.includes(s)) setActiveTab(s);
  }, [editMode]);

  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => nav("onboarding"), 2800);
      return () => clearTimeout(t);
    }
  }, [screen]);

  // Toggle contentEditable directly on the DOM node to avoid React conflicts
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    if (editMode) {
      el.setAttribute("contenteditable", "true");
      // Disable button/link pointer events so clicks don't navigate
      el.querySelectorAll<HTMLElement>("button, a, input, textarea, select").forEach(b => {
        b.dataset.prevPe = b.style.pointerEvents;
        b.style.pointerEvents = "none";
      });
    } else {
      el.removeAttribute("contenteditable");
      el.querySelectorAll<HTMLElement>("button, a, input, textarea, select").forEach(b => {
        b.style.pointerEvents = b.dataset.prevPe ?? "";
      });
    }
  }, [editMode, screen]); // re-run after screen changes so new buttons are caught

  const isMain = MAIN_SCREENS.includes(screen);

  return (
    <>
      {/* Edit-mode CSS injected globally */}
      <style>{`
        .skillswap-editable [data-ce] { outline: none; }
        .skillswap-editable p:hover,
        .skillswap-editable h1:hover,
        .skillswap-editable h2:hover,
        .skillswap-editable h3:hover,
        .skillswap-editable span:hover,
        .skillswap-editable label:hover {
          outline: 1.5px dashed #4F46E5;
          outline-offset: 2px;
          border-radius: 3px;
          cursor: text;
        }
        .skillswap-editable:focus { outline: none; }
        .skillswap-editable { caret-color: #4F46E5; }
      `}</style>
    <div className={`min-h-screen flex items-center justify-center gap-8 p-6 transition-colors duration-300 ${dark ? "bg-slate-950" : "bg-gradient-to-br from-indigo-100 via-purple-50 to-cyan-100"}`} style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* Phone Frame */}
      <div className="flex-shrink-0 relative" style={{ width: 390, height: 844 }}>
        {/* Outer bezel */}
        <div className={`absolute inset-0 rounded-[55px] ${dark ? "bg-slate-700" : "bg-gray-900"} shadow-2xl`} />
        <div className="absolute inset-[2px] rounded-[53px] bg-gray-800" />

        {/* Screen */}
        <div className={`absolute inset-[3px] rounded-[52px] overflow-hidden`}>
          {/* Status bar */}
          <div className={`flex items-center justify-between px-8 pt-3.5 pb-1.5 text-[11px] font-semibold relative z-20 ${
            ["splash", "onboarding"].includes(screen)
              ? "text-white"
              : screen === "skill-detail" && "text-white" || (dark ? "text-white" : "text-gray-900")
          }`}>
            <span>9:41</span>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl" />
            <div className="flex items-center gap-1.5">
              <div className="flex gap-[2px] items-end">
                {[5, 7, 9, 11].map((h, i) => <div key={i} className={`w-[3px] rounded-sm ${i < 3 ? "bg-current" : "bg-current opacity-30"}`} style={{ height: h }} />)}
              </div>
              <span>5G</span>
              <div className="w-5 h-2.5 border border-current rounded-sm relative">
                <div className="absolute inset-[2px] right-[3px] bg-current rounded-sm" style={{ width: "70%" }} />
                <div className="absolute -right-[3px] top-[3px] w-[2px] h-1 bg-current rounded-r-sm opacity-60" />
              </div>
            </div>
          </div>

          {/* Scrollable screen */}
          <div
            ref={screenRef}
            suppressContentEditableWarning
            className={`absolute inset-0 top-8 overflow-y-auto scrollbar-hide ${dark ? "bg-slate-900" : "bg-[#F8FAFC]"} ${editMode ? "skillswap-editable" : ""}`}
            style={{ paddingBottom: isMain ? 80 : 0, borderRadius: "0 0 52px 52px" }}
          >
            {screen === "splash" && <SplashScreen dark={dark} />}
            {screen === "onboarding" && <OnboardingScreen page={obPage} setPage={setObPage} nav={nav} dark={dark} />}
            {screen === "login" && <LoginScreen nav={nav} dark={dark} showPw={showPw} setShowPw={setShowPw} />}
            {screen === "register" && <RegisterScreen nav={nav} dark={dark} />}
            {screen === "forgot-password" && <ForgotScreen nav={nav} dark={dark} />}
            {screen === "otp" && <OTPScreen nav={nav} dark={dark} />}
            {screen === "home" && <HomeScreen nav={nav} dark={dark} />}
            {screen === "explore" && <ExploreScreen nav={nav} dark={dark} />}
            {screen === "skill-detail" && <SkillDetailScreen nav={nav} dark={dark} />}
            {screen === "chat-list" && <ChatListScreen nav={nav} dark={dark} />}
            {screen === "chat" && <ChatScreen nav={nav} dark={dark} msg={chatMsg} setMsg={setChatMsg} />}
            {screen === "calendar" && <CalendarScreen nav={nav} dark={dark} />}
            {screen === "profile" && <ProfileScreen nav={nav} dark={dark} />}
            {screen === "exchange-request" && <ExchangeRequestScreen nav={nav} dark={dark} />}
            {screen === "notifications" && <NotificationsScreen nav={nav} dark={dark} />}
            {screen === "settings" && <SettingsScreen nav={nav} dark={dark} setDark={setDark} />}
            {screen === "progress" && <ProgressScreen nav={nav} dark={dark} />}
            {screen === "admin" && <AdminScreen nav={nav} dark={dark} />}
            {screen === "reviews" && <ReviewsScreen nav={nav} dark={dark} />}
          </div>

          {/* Bottom Nav */}
          {isMain && <BottomNav active={activeTab} setActive={setActiveTab} nav={nav} dark={dark} />}
        </div>

        {/* Home bar */}
        <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full z-20" />
      </div>

      {/* Screen Selector Sidebar */}
      <div className={`flex-shrink-0 flex flex-col gap-1 rounded-3xl p-4 shadow-xl ${dark ? "bg-slate-800 border border-slate-700" : "bg-white/80 backdrop-blur-md border border-white"}`} style={{ maxHeight: 844, overflowY: "auto", width: 180, scrollbarWidth: "none" }}>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 px-1 ${dark ? "text-slate-400" : "text-gray-400"}`}>Screens</p>
        {SCREEN_LIST.map(([s, label, emoji]) => (
          <button
            key={s}
            onClick={() => { nav(s); if (s === "onboarding") setObPage(0); }}
            className={`text-left px-3 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 ${
              screen === s
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : dark ? "text-slate-300 hover:bg-slate-700" : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        ))}

        {/* Dark mode toggle */}
        <div className={`mt-3 pt-3 border-t ${dark ? "border-slate-700" : "border-gray-200"} flex items-center justify-between px-1`}>
          <span className={`text-[11px] font-bold ${dark ? "text-slate-400" : "text-gray-500"}`}>Dark Mode</span>
          <Toggle on={dark} onChange={() => setDark(!dark)} />
        </div>

        {/* Edit Mode toggle */}
        <div className={`mt-2 pt-3 border-t ${dark ? "border-slate-700" : "border-gray-200"}`}>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl text-[12px] font-bold shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
            >
              ✏️ Edit Content
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 px-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-green-600">Editing — click any text</span>
              </div>
              <button
                onClick={() => setEditMode(false)}
                className={`w-full py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 ${dark ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                ✓ Done Editing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
