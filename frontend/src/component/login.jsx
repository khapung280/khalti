import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { FaLeaf, FaShieldAlt, FaTruck } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/product";

  useEffect(() => {
    if (isLoggedIn()) {
      navigate(redirectTo, { replace: true });
    }
    const saved = localStorage.getItem("rememberedEmail");
    if (saved) {
      setFormData((prev) => ({ ...prev, email: saved }));
      setRememberMe(true);
    }
  }, [navigate, redirectTo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        setMessage({ text: "Welcome back! Redirecting to your shop...", type: "success" });
        localStorage.setItem("token", result.token);

        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 900);
      } else {
        setMessage({
          text: result.msg || result.message || "Invalid email or password.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      const isNetworkError =
        error?.message?.includes("fetch") || error?.name === "TypeError";
      setMessage({
        text: isNetworkError
          ? "Cannot reach server. Start the backend on port 5000 and try again."
          : "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const perks = [
    { icon: FaLeaf, text: "100% organic groceries" },
    { icon: FaTruck, text: "Farm-fresh delivery" },
    { icon: FaShieldAlt, text: "Secure checkout with Khalti" },
  ];

  return (
    <div className="min-h-screen pt-16 bg-slate-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-emerald-900/40" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm">
              <FaLeaf className="text-2xl text-emerald-200" />
            </span>
            <div>
              <p className="text-xl font-bold">Koshi Organic</p>
              <p className="text-emerald-200 text-sm">Agro Food</p>
            </div>
          </Link>

          <div>
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Welcome back to
              <span className="block text-emerald-200">fresh, local food.</span>
            </h2>
            <p className="text-emerald-100/90 text-lg max-w-md leading-relaxed mb-10">
              Sign in to browse organic groceries, save favorites, and checkout securely with
              Khalti.
            </p>
            <ul className="space-y-4">
              {perks.map(({ icon: Icon, text }) => (
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
            © {new Date().getFullYear()} Koshi Organic Agro Food
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
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
              <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
              <p className="text-slate-500 mt-1 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
                >
                  Create one free
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
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
                    className="w-full pl-11 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

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
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-11 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Remember me
                </label>
                <span className="text-slate-400 text-xs">Forgot password? (soon)</span>
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
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold text-sm transition-all ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-200 hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to shop
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="px-8 pb-8">
              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  or
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <Link
                to="/"
                className="mt-4 flex items-center justify-center w-full py-3 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                Continue browsing as guest
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
