import React, { useState, useEffect, useMemo } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { FaLeaf, FaHeart, FaShoppingBag } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/product", { replace: true });
    }
  }, [navigate]);

  const passwordStrength = useMemo(() => {
    const p = formData.password;
    if (!p) return { score: 0, label: "", color: "bg-slate-200" };
    if (p.length < 6) return { score: 1, label: "Weak", color: "bg-red-400" };
    if (p.length < 8) return { score: 2, label: "Fair", color: "bg-amber-400" };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) {
      return { score: 4, label: "Strong", color: "bg-emerald-500" };
    }
    return { score: 3, label: "Good", color: "bg-emerald-400" };
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
    if (message.text) setMessage({ text: "", type: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "Please accept the terms to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          text: "Account created! Redirecting you to sign in...",
          type: "success",
        });
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      } else {
        setMessage({
          text: result.msg || result.message || "Registration failed. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage({
        text: "Cannot reach server. Start the backend on port 5000 and try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-11 pr-4 py-3 text-sm border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition ${
      errors[field]
        ? "border-red-300 focus:ring-red-400"
        : "border-slate-200 focus:ring-emerald-500 focus:border-transparent"
    }`;

  const benefits = [
    { icon: FaShoppingBag, text: "Shop 10+ organic grocery items" },
    { icon: FaHeart, text: "Save favorites for quick reorder" },
    { icon: FaLeaf, text: "Secure Khalti payments at checkout" },
  ];

  return (
    <div className="min-h-screen pt-16 bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-900 via-emerald-800 to-green-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1464226186944-9fd338b38176?w=1200&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 border border-white/20">
              <FaLeaf className="text-2xl text-emerald-200" />
            </span>
            <div>
              <p className="text-xl font-bold">Koshi Organic</p>
              <p className="text-emerald-200 text-sm">Agro Food</p>
            </div>
          </Link>

          <div>
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Join our
              <span className="block text-emerald-200">organic community.</span>
            </h2>
            <p className="text-emerald-100/90 text-lg max-w-md leading-relaxed mb-10">
              Create a free account to browse fresh produce, manage favorites, and pay safely
              with Khalti.
            </p>
            <ul className="space-y-4">
              {benefits.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/15">
                    <Icon className="text-emerald-200" />
                  </span>
                  <span className="text-emerald-50 font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-emerald-200/70 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md my-8">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <FaLeaf />
              </span>
              <span className="text-xl font-bold text-slate-900">Koshi Organic</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
            <div className="px-8 pt-8 pb-2">
              <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
              <p className="text-slate-500 mt-1 text-sm">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="username"
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder="Your display name"
                    value={formData.username}
                    onChange={handleChange}
                    className={inputClass("username")}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass("password")} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= passwordStrength.score ? passwordStrength.color : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      Strength: <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={inputClass("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (errors.terms) setErrors({ ...errors, terms: null });
                    }}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    I agree to the terms of service and privacy policy for Koshi Organic Agro
                    Food.
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.terms}
                  </p>
                )}
              </div>

              {message.text && (
                <div
                  className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
                    message.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                  role="alert"
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-5 w-5 shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-200"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create free account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Your data is stored securely. We never share your information with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
