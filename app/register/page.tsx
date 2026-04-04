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
  ChevronDown
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
      className={`fixed w-full z-50 transition ${
        isScrolled
          ? "bg-white shadow-md py-4"
          : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          Eternal <span className="text-blue-600">Support</span>
        </Link>

        <div className="hidden lg:flex gap-10 items-center">
          <Link href="/">Home</Link>

          <div
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
            className="relative"
          >
            <button className="flex items-center gap-2">
              Services <ChevronDown size={14} />
            </button>

            <AnimatePresence>
              {dropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bg-white shadow-lg rounded-xl p-4 mt-2 w-56"
                >
                  <p>In-Home Support</p>
                  <p>Transport</p>
                  <p>Aged Care</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/about">About</Link>

          <Link href="/register">
            <button className="bg-black text-white px-6 py-2 rounded-full">
              Get Started
            </button>
          </Link>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="bg-white p-6 flex flex-col gap-6 lg:hidden">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    if (!form.name || !form.email || !form.password)
      return "Please fill all required fields";

    if (!/\S+@\S+\.\S+/.test(form.email))
      return "Invalid email format";

    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    return "";
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://eternal-support.onrender.com/api/users",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: "user"
        }
      );

      console.log(res.data);

      alert("✅ Registered Successfully");

      router.push("/login");

    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h2>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-100 text-red-600 p-3 mb-4 rounded"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded flex justify-center items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Register <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}