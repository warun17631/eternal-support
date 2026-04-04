"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

/* ---------------- TYPES & INTERFACES ---------------- */
interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
}

/* ---------------- GLOBAL COMPONENTS & ANIMATIONS ---------------- */
const FadeUp = ({ children, delay = 0 }: FadeUpProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/* ---------------- PREMIUM NAVBAR ---------------- */
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
              Services <motion.span animate={{ rotate: isDropdownOpen ? 180 : 0 }} className="text-[8px]">▼</motion.span>
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

        <button className="lg:hidden text-slate-900 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <div className="w-6 space-y-1.5">
            <div className={`h-0.5 bg-current transition-all ${mobileOpen ? "rotate-45 translate-y-2" : "w-6"}`} />
            <div className={`h-0.5 bg-current transition-all ${mobileOpen ? "opacity-0" : "w-4 ml-auto"}`} />
            <div className={`h-0.5 bg-current transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : "w-6"}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 bg-white z-[90] p-10 flex flex-col justify-center gap-10 lg:hidden">
            {["Home", "Services", "About", "register"].map((t, i) => (
              <Link key={i} href={t === "register" ? "/register" : "#"} onClick={() => setMobileOpen(false)} className="text-6xl font-black tracking-tighter text-slate-900 hover:text-blue-600 transition-colors">
                {t}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* ---------------- HERO SECTION ---------------- */
const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  
  const heroBg = "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=2000";

  return (
    <section className="relative min-h-[110vh] flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="Background" className="w-full h-full object-cover opacity-10" />
      </div>

      <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-blue-600/10 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[5%] right-[5%] w-[35rem] h-[35rem] bg-indigo-400/10 blur-[140px] rounded-full" />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
        <FadeUp>
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-10 bg-white border border-slate-100 rounded-full shadow-xl shadow-blue-50/50">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Next-Gen Disability Support</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="text-8xl md:text-[10rem] font-black text-slate-900 leading-[0.8] tracking-tight mb-12">
            Better <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400">Everyday.</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="max-w-2xl mx-auto text-slate-500 text-xl font-medium leading-relaxed mb-16">
            We provide specialized infrastructure and human-centric care to ensure independence 
            is accessible for everyone, everywhere.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/register">
              <button className="px-14 py-6 bg-blue-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 hover:-translate-y-1 transition-all active:scale-95">
                Join our Network
              </button>
            </Link>
            <button className="px-10 py-6 bg-white border border-slate-100 text-slate-900 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
              Watch Vision
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

/* ---------------- SERVICES GRID ---------------- */
const Services = () => {
  const serviceItems = [
    { title: "In-Home Support",  img: "/In-Home Support.png" },
    { title: "Personal Care", img: "/Personal Care.png" },
    { title: "Aged Care Support",  img: "/Aged Care Support.png" },
    { title: "Respite Care", img: "/Respite Care.png" },
    { title: "Supported Independent Living",img: "/Supported Independent Living.png" },
    { title: "Engaging Supports", desc: "", img: "/Engaging Supports.png" },
  ];

  return (
    <section id="services" className="py-40 bg-slate-50/50 relative">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-32">
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">The Portfolio</p>
            <h2 className="text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter">Engineered <br /> for Independence.</h2>
          </div>
          <p className="text-slate-400 font-bold text-lg leading-relaxed max-w-md ml-auto text-right">
            Every service is backed by rigorous training and an obsession with detail. 
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceItems.map((s, i: number) => (
            <motion.div key={i} whileHover={{ y: -15 }} className="group relative bg-white rounded-[3.5rem] border border-slate-50 shadow-sm overflow-hidden transition-all">
              <div className="h-64 w-full overflow-hidden">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{s.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- FINAL CTA ---------------- */
const CTA = () => (
  <section className="py-40 px-8">
    <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[5rem] p-20 text-center text-white shadow-[0_40px_100px_rgba(37,99,235,0.3)] relative overflow-hidden">
      <FadeUp>
        <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter">Start your <br /> better tomorrow.</h2>
        <Link href="/register">
          <button className="px-16 py-7 bg-white text-blue-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl relative z-10">
            Register Now
          </button>
        </Link>
      </FadeUp>
    </div>
  </section>
);

export default function EternalSupportPage() {
  return (
    <main className="bg-white selection:bg-blue-600 selection:text-white antialiased">
      <Navbar />
      <Hero />
      <Services />
      <CTA />
      
      <footer className="py-20 border-t border-slate-50 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em] mb-4">© 2026 Eternal Support Ecosystem</p>
      </footer>
    </main>
  );
}