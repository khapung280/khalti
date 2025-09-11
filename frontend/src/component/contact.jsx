import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaLeaf,
  FaChevronDown,
  FaPaperPlane,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { CheckCircle, AlertCircle } from "lucide-react";

const CONTACT_INFO = [
  {
    icon: FaMapMarkerAlt,
    title: "Visit us",
    lines: ["Koshi Organic Farms", "Biratnagar, Koshi Region", "Nepal"],
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: FaPhone,
    title: "Call us",
    lines: ["+977 980-1234567", "Sun–Fri, 9AM – 6PM"],
    color: "bg-sky-100 text-sky-600",
  },
  {
    icon: FaEnvelope,
    title: "Email us",
    lines: ["info@koshiorganic.com", "support@koshiorganic.com"],
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: FaClock,
    title: "Working hours",
    lines: ["Mon – Fri: 9:00 – 18:00", "Sat: 10:00 – 16:00"],
    color: "bg-amber-100 text-amber-600",
  },
];

const FAQS = [
  {
    question: "How can I verify your products are organic?",
    answer:
      "All products are sourced from certified organic farms in the Koshi region. We provide batch details and welcome scheduled farm visits.",
  },
  {
    question: "What are your delivery options?",
    answer:
      "We offer standard delivery (2–4 days) within major cities in Nepal. Express same-day delivery is available in select areas.",
  },
  {
    question: "Do you accept Khalti payments?",
    answer:
      "Yes! You can pay securely using Khalti at checkout after adding items to your cart from the shop.",
  },
  {
    question: "Can I order in bulk for my business?",
    answer:
      "We offer wholesale pricing for restaurants and retailers. Contact us with your requirements and we'll send a custom quote.",
  },
];

const ContactPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", type: "" });
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (feedback.text) setFeedback({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) {
      setFeedback({ text: "Please fill in your name, email, and message.", type: "error" });
      return;
    }
    setSubmitting(true);
    setFeedback({ text: "", type: "" });

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject,
          message: form.message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setFeedback({
          text: "Thank you! Your message was saved. We will reply within 24 hours.",
          type: "success",
        });
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "general",
          message: "",
        });
      } else {
        setFeedback({
          text: data.error || "Could not send message. Is the backend running on port 5000?",
          type: "error",
        });
      }
    } catch {
      setFeedback({
        text: "Cannot reach server. Start the backend (npm run dev in /backend) and try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition";

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white py-20 sm:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm font-medium mb-6">
            <HiSparkles className="text-emerald-200" />
            We&apos;re here to help
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Get in touch
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Questions about orders, organic products, or partnerships? Our team in the Koshi
            region is ready to assist you.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONTACT_INFO.map(({ icon: Icon, title, lines, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-200 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${color} mb-4`}
                >
                  <Icon className="text-xl" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                {lines.map((line) => (
                  <p key={line} className="text-slate-500 text-sm">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Send a message</h2>
              <p className="text-slate-500 text-sm mb-8">
                Fill out the form and we&apos;ll get back to you within one business day.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1.5">
                      First name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="+977 9800000000"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="general">General inquiry</option>
                    <option value="order">Order support</option>
                    <option value="wholesale">Wholesale / bulk</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                {feedback.text && (
                  <div
                    className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
                      feedback.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {feedback.type === "success" ? (
                      <CheckCircle className="w-5 h-5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0" />
                    )}
                    <span>{feedback.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold transition-all ${
                    submitting
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-200"
                  }`}
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map + Social */}
            <div className="space-y-6">
              <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 h-80 lg:h-96">
                <iframe
                  title="Koshi Organic Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.102370777496!2d85.32407031504376!3d27.71754498299872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196de5da5741%3A0x6527928b7f8a43a1!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="bg-gradient-to-br from-emerald-800 to-teal-800 rounded-3xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2">Connect with us</h3>
                <p className="text-emerald-100 text-sm mb-6">
                  Follow for farm updates, seasonal offers, and recipes with our organic produce.
                </p>
                <div className="flex gap-3">
                  {[
                    { Icon: FaFacebook, href: "#", bg: "hover:bg-blue-600" },
                    { Icon: FaInstagram, href: "#", bg: "hover:bg-pink-600" },
                    { Icon: FaWhatsapp, href: "#", bg: "hover:bg-green-600" },
                  ].map(({ Icon, href, bg }, i) => (
                    <a
                      key={i}
                      href={href}
                      className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 border border-white/20 ${bg} transition`}
                      aria-label="Social link"
                    >
                      <Icon className="text-lg" />
                    </a>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-emerald-200 text-sm mb-3">Prefer to shop right away?</p>
                  <Link
                    to="/product"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-800 font-semibold rounded-xl hover:bg-emerald-50 transition text-sm"
                  >
                    Browse our shop
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">
              FAQ
            </p>
            <h2 className="text-3xl font-bold text-slate-900">Common questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition"
                  >
                    <span className="font-semibold text-slate-900">{faq.question}</span>
                    <FaChevronDown
                      className={`text-emerald-600 shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaLeaf className="text-emerald-400" />
            <span className="font-bold text-white">Koshi Organic Agro Food</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <Link to="/" className="hover:text-emerald-400 transition">
              Home
            </Link>
            <Link to="/product" className="hover:text-emerald-400 transition">
              Shop
            </Link>
            <Link to="/About" className="hover:text-emerald-400 transition">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
