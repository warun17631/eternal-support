"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
  ChevronDown,
  Menu,
  X,
  CheckCircle2
} from "lucide-react";

/* ---------------- TYPES ---------------- */
interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

/* ---------------- NAVBAR ---------------- */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#0F8FA3] rounded-xl flex items-center justify-center text-white font-black rotate-3 group-hover:rotate-12 transition-transform">
            E
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-800">
            Eternal <span className="text-[#0F8FA3]">Support</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-8 items-center font-bold text-sm uppercase tracking-widest text-slate-600">
          <Link href="/" className="hover:text-[#0F8FA3] transition">Home</Link>

          <div
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
            className="relative cursor-pointer"
          >
            <span className="flex items-center gap-1 hover:text-[#0F8FA3] transition">
              Services <ChevronDown size={14} />
            </span>

            <AnimatePresence>
              {dropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 mt-4 w-64 overflow-hidden"
                >
                  {["In-Home Support", "Transport", "Aged Care", "Social Inclusion"].map((item) => (
                    <div key={item} className="p-3 hover:bg-slate-50 rounded-lg transition text-slate-700 normal-case font-semibold cursor-pointer">
                      {item}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/about" className="hover:text-[#0F8FA3] transition">About</Link>

          <Link href="/register">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-900 text-white px-8 py-3 rounded-full shadow-lg shadow-slate-200"
            >
              Get Started
            </motion.button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-slate-800" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-t border-slate-100 p-6 flex flex-col gap-6 lg:hidden shadow-xl"
          >
            <Link href="/" className="font-bold text-lg">Home</Link>
            <Link href="/about" className="font-bold text-lg">About</Link>
            <Link href="/register" className="bg-[#0F8FA3] text-white p-4 rounded-xl text-center font-bold">Get Started</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password) return "All fields with * are required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "That email address doesn't look right.";
    if (form.password.length < 6) return "Password needs to be at least 6 characters.";
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
      await axios.post("https://eternal-support.onrender.com/api/users", { ...form, role: "user" });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      <Navbar />

      {/* Background Colorful Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-[#0F8FA3]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="relative flex items-center justify-center min-h-screen pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white"
        >
          {success ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-10">
              <div className="flex justify-center mb-6">
                <CheckCircle2 size={80} className="text-[#0F8FA3]" />
              </div>
              <h2 className="text-3xl font-black text-slate-800">Welcome Aboard!</h2>
              <p className="text-slate-500 mt-2 font-medium text-lg">Your account has been created. Redirecting to login...</p>
            </motion.div>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">Create Account</h2>
                <p className="text-slate-500 mt-2 font-medium">Join Eternal Support Services today.</p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-50 text-red-600 p-4 mb-6 rounded-2xl flex items-center gap-3 border border-red-100 text-sm font-bold"
                  >
                    <AlertCircle size={20} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0F8FA3] transition-colors" size={20} />
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full pl-12 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#0F8FA3]/10 focus:border-[#0F8FA3] outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0F8FA3] transition-colors" size={20} />
                      <input
                        type="text"
                        name="phone"
                        placeholder="+1 234..."
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full pl-12 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#0F8FA3]/10 focus:border-[#0F8FA3] outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0F8FA3] transition-colors" size={20} />
                    <input
                      type="email"
                      name="email"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-12 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#0F8FA3]/10 focus:border-[#0F8FA3] outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0F8FA3] transition-colors" size={20} />
                    <input
                      type="password"
                      name="password"
                      placeholder="Minimum 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-12 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#0F8FA3]/10 focus:border-[#0F8FA3] outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F8FA3] hover:bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#0F8FA3]/20 transition-all flex justify-center items-center gap-3 mt-4"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Create My Account <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-center mt-8 font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em]">
                By joining, you agree to our Terms and Conditions
              </p>

              <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <p className="font-semibold text-slate-500">
                  Already a member?{" "}
                  <Link href="/login" className="text-[#0F8FA3] hover:underline font-black">
                    Login here
                  </Link>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}