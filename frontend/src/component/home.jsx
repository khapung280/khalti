import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaStar,
  FaShoppingCart,
  FaLeaf,
  FaTruck,
  FaUsers,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const API = "http://localhost:5000/api/product";
const HOME_API = "http://localhost:5000/api/home";

const HomePage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [cmsHome, setCmsHome] = useState(null);

  useEffect(() => {
    axios.get(HOME_API).then((res) => setCmsHome(res.data)).catch(() => setCmsHome(null));
  }, []);

  useEffect(() => {
    axios
      .get(API)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setFeaturedProducts(list.slice(0, 4));
      })
      .catch(() => setFeaturedProducts([]));
  }, []);

  const features = [
    {
      name: "100% Organic",
      description: "Purely natural farming without chemicals or pesticides — certified and traceable.",
      icon: FaLeaf,
      image:
        "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80",
    },
    {
      name: "Farm Fresh Delivery",
      description: "Harvested daily and delivered from Koshi region farms to your doorstep.",
      icon: FaTruck,
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    },
    {
      name: "Direct from Farmers",
      description: "Fair trade practices supporting 200+ local farming families.",
      icon: FaUsers,
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    },
    {
      name: "Quality Guaranteed",
      description: "Every product is inspected for freshness, purity, and authentic origin.",
      icon: FaShieldAlt,
      image:
        "https://images.unsplash.com/photo-1464226186944-9fd338b38176?w=800&q=80",
    },
  ];

  const stats = [
    { value: "10+", label: "Grocery Items" },
    { value: "200+", label: "Farm Families" },
    { value: "100%", label: "Organic" },
    { value: "4.8★", label: "Customer Rating" },
  ];

  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "Restaurant Owner, Biratnagar",
      quote:
        "Koshi Organic products transformed our kitchen. Fresh produce and consistent quality every single order.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Health & Wellness Coach",
      quote:
        "I recommend Koshi Organic to all my clients. Clean labels, real farmers, and unbeatable freshness.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      rating: 5,
    },
    {
      name: "Anil Thapa",
      role: "Home Chef, Kathmandu",
      quote:
        "Finally a store I trust for daily groceries. The honey and vegetables taste like they came straight from the farm.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      rating: 5,
    },
  ];

  const fallbackProducts = [
    {
      name: "Organic Vegetables",
      category: "Vegetables",
      image:
        "https://images.unsplash.com/photo-1444459094717-a39f1e3e0903?w=600&q=80",
      price: 250,
    },
    {
      name: "Himalayan Honey",
      category: "Pantry",
      image:
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
      price: 450,
    },
    {
      name: "Organic Basmati Rice",
      category: "Grains",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
      price: 185,
    },
    {
      name: "Fresh Farm Eggs",
      category: "Dairy & Eggs",
      image:
        "https://images.unsplash.com/photo-1582722872445-44dc5f4e7eeb?w=600&q=80",
      price: 320,
    },
  ];

  const displayProducts =
    featuredProducts.length > 0
      ? featuredProducts.map((p) => ({
          id: p._id,
          name: p.ProductName,
          category: p.Category || "Organic",
          image: p.Thumbnail,
          price: p.Price,
        }))
      : fallbackProducts.map((p, i) => ({ ...p, id: `fb-${i}` }));

  const defaultTrustItems = [
    "Certified Organic",
    "Same-Day Delivery",
    "Fair Trade Farmers",
    "Secure Payments",
  ];
  const trustItems =
    cmsHome?.trustBadges?.length > 0 ? cmsHome.trustBadges : defaultTrustItems;

  const featureIcons = [FaLeaf, FaTruck, FaUsers, FaShieldAlt];
  const displayFeatures =
    cmsHome?.benefits?.length > 0
      ? cmsHome.benefits.map((b, i) => ({
          name: b.title,
          description: b.description,
          icon: featureIcons[i % featureIcons.length],
          image: b.imageUrl || features[i % features.length]?.image,
        }))
      : features;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative pt-24 min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-green-900/80 to-transparent" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_30%,white_0%,transparent_45%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm font-medium mb-6">
                <HiSparkles className="text-emerald-200" />
                {cmsHome?.tagline || "Koshi Organic Agro Food"}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
                {cmsHome?.heroTitle ? (
                  cmsHome.heroTitle
                ) : (
                  <>
                    Farm Fresh
                    <span className="block text-emerald-200">Organic Groceries</span>
                    <span className="block text-white">from Nepal</span>
                  </>
                )}
              </h1>
              <p className="text-lg text-emerald-100/90 max-w-xl mb-8 leading-relaxed">
                {cmsHome?.heroSubtitle ||
                  "Premium vegetables, grains, dairy, and pantry essentials — grown with care in the fertile Koshi region and delivered straight to your table."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/product"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-800 font-bold rounded-xl hover:bg-emerald-50 transition shadow-xl shadow-emerald-950/30"
                >
                  <FaShoppingCart />
                  Shop Groceries
                  <FaArrowRight className="text-sm" />
                </Link>
                <Link
                  to="/About"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition backdrop-blur-sm"
                >
                  Our Story
                </Link>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition"
                >
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-emerald-200 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Trust bar */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center justify-center gap-2 text-slate-600">
                <FaCheckCircle className="text-emerald-500 shrink-0" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Why Koshi Organic
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Quality you can see, taste, and trust
            </h2>
            <p className="text-slate-500 text-lg">
              From soil to shelf — we control every step for fresher, healthier groceries.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayFeatures.map((feature) => (
              <article
                key={feature.name}
                className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                    <feature.icon className="text-emerald-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">
                Our Store
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Featured groceries</h2>
            </div>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800 transition"
            >
              View all products
              <FaArrowRight />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <article
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80";
                    }}
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg">
                    {product.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-emerald-700 font-bold text-lg mb-4">
                    Rs. {Number(product.price).toLocaleString()}
                  </p>
                  <Link
                    to={typeof product.id === "string" && product.id.startsWith("fb-") ? "/product" : `/product/${product.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition"
                  >
                    <FaShoppingCart />
                    View Product
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Mission strip */}
      <section className="py-16 bg-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Nourishing communities, naturally</h2>
              <p className="text-emerald-100 text-lg leading-relaxed mb-6">
                Since 2010, Koshi Organic Agro Food has connected health-conscious families with
                farmers who grow food the right way — without shortcuts, without chemicals.
              </p>
              <Link
                to="/About"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-800 font-semibold rounded-xl hover:bg-emerald-50 transition"
              >
                Learn our story
                <FaArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: "2010", t: "Founded" },
                { n: "500+", t: "Acres farmed" },
                { n: "50+", t: "Products" },
                { n: "15+", t: "Districts served" },
              ].map((item) => (
                <div
                  key={item.t}
                  className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-center"
                >
                  <p className="text-3xl font-bold">{item.n}</p>
                  <p className="text-emerald-200 text-sm mt-1">{item.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Loved by families & businesses
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
              <div className="relative flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={testimonials[activeTestimonial].image}
                  alt={testimonials[activeTestimonial].name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-200 shadow-md shrink-0"
                />
                <div className="flex-1">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < testimonials[activeTestimonial].rating
                            ? "text-amber-400"
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 text-lg leading-relaxed italic mb-4">
                    &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                  </p>
                  <p className="font-bold text-slate-900">{testimonials[activeTestimonial].name}</p>
                  <p className="text-emerald-600 text-sm">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveTestimonial(i)}
                    aria-label={`Testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === activeTestimonial ? "w-8 bg-emerald-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready for fresher groceries?</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers. Browse our organic store and get farm-fresh delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/product"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition shadow-lg"
            >
              Start Shopping
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaLeaf className="text-emerald-400" />
                Koshi Organic
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Bringing you the purest organic agro products from Nepal&apos;s Koshi region.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition" aria-label="Facebook">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition" aria-label="Instagram">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition" aria-label="WhatsApp">
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </div>
            {[
              {
                title: "Shop",
                links: [
                  { label: "All Products", to: "/product" },
                  { label: "Vegetables", to: "/product" },
                  { label: "Grains", to: "/product" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "About Us", to: "/About" },
                  { label: "Contact", to: "/contact" },
                  { label: "Our Farmers", to: "/About" },
                ],
              },
              {
                title: "Account",
                links: [
                  { label: "Login", to: "/login" },
                  { label: "Register", to: "/register" },
                  { label: "Shop Now", to: "/product" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="hover:text-emerald-400 transition">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Koshi Organic Agro Food. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
