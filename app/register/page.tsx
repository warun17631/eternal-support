"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Phone, ArrowRight, 
  Loader2, AlertCircle, ChevronDown 
} from "lucide-react";

/* ---------------- TYPES ---------------- */
interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

/* ---------------- NAVBAR COMPONENT ---------------- */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const serviceLinks = [
    { name: "In-Home Support", desc: "Daily living assistance" },
    { name: "Personal Care", desc: "Dignified hygiene support" },
    { name: "Aged Care", desc: "Senior specialized care" },
    { name: "Transport", desc: "Accessible travel solutions" },
    { name: "Social Inclusion", desc: "Community engagement" },
    { name: "SIL Living", desc: "Independent housing" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${
      isScrolled ? "py-4 bg-white/80 backdrop-blur-2xl shadow-sm" : "py-10 bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/Eternal support services.png"
            alt="Eternal Support Logo"
            className="w-12 h-12 rounded-2xl object-cover shadow-xl shadow-blue-200 group-hover:rotate-[15deg] transition-transform duration-500"
          />
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            Eternal  
            <span className="font-extrabold" style={{ color: "#0F8FA3" }}>
              {" "}Support Services
            </span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-12">
          <Link href="/" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors">Home</Link>
          
          <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
            <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors">
              Services <motion.span animate={{ rotate: isDropdownOpen ? 180 : 0 }} className="text-[10px]"><ChevronDown size={12} /></motion.span>
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute left-1/2 -translate-x-1/2 top-full pt-6 w-[450px]">
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.08)] p-6 grid grid-cols-2 gap-2">
                    {serviceLinks.map((s, i) => (
                      <Link key={i} href="#services" className="p-4 rounded-2xl hover:bg-blue-50 transition-all group/item">
                        <p className="text-[11px] font-black text-slate-900 group-hover/item:text-blue-600 uppercase tracking-wider">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">{s.desc}</p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/About" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors">About</Link>
          <Link href="/register">
            <button className="px-10 py-4 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-slate-900 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <div className="w-6 space-y-1.5">
            <div className={`h-0.5 bg-current transition-all ${mobileOpen ? "rotate-45 translate-y-2" : "w-6"}`} />
            <div className={`h-0.5 bg-current transition-all ${mobileOpen ? "opacity-0" : "w-4 ml-auto"}`} />
            <div className={`h-0.5 bg-current transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : "w-6"}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 bg-white z-[90] p-10 flex flex-col justify-center gap-10 lg:hidden">
            {["Home", "Services", "About", "Register"].map((t, i) => (
              <Link key={i} href={t === "Register" ? "/register" : "/"} onClick={() => setMobileOpen(false)} className="text-6xl font-black tracking-tighter text-slate-900 hover:text-blue-600 transition-colors">
                {t}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* ---------------- REGISTER PAGE COMPONENT ---------------- */
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password) return "Please fill in all required fields.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/users", { ...form, role: "client" });
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 pt-32 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[500px]"
        >
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 overflow-hidden border border-slate-100">
            
            {/* Form Header */}
            <div className="bg-slate-900 p-10 text-white text-center">
              <h2 className="text-3xl font-black tracking-tight uppercase">Create Account</h2>
              <p className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-widest">
                Eternal Support Services
              </p>
            </div>

            <div className="p-10">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-6 flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-bold"
                  >
                    <AlertCircle size={18} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      placeholder="hello@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="relative">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="phone"
                        placeholder="Optional"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-[#0F8FA3] hover:bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Register Account <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Joined us before?{" "}
                  <Link href="/login" className="text-[#0F8FA3] hover:text-slate-900 transition-colors ml-1">
                    Sign In Here
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-center mt-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2026 Eternal Support Services
          </p>
        </motion.div>
      </div>
    </>
  );
}