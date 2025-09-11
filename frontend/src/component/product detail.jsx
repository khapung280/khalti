import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
  FaShare,
  FaLeaf,
  FaHome,
  FaArrowLeft,
  FaTruck,
  FaShieldAlt,
  FaBox,
  FaCheckCircle,
  FaTimes,
  FaExpand,
  FaRegClock,
  FaUndo,
  FaCreditCard,
} from "react-icons/fa";
import { HiSparkles, HiOutlineLightningBolt } from "react-icons/hi";
import { getUserId } from "../utils/auth";

const API = "http://localhost:5000/api/product";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80";

const categoryColors = {
  Vegetables: "bg-emerald-100 text-emerald-800",
  Fruits: "bg-orange-100 text-orange-800",
  Grains: "bg-amber-100 text-amber-800",
  "Dairy & Eggs": "bg-sky-100 text-sky-800",
  Pantry: "bg-violet-100 text-violet-800",
  Beverages: "bg-teal-100 text-teal-800",
  General: "bg-slate-100 text-slate-700",
};

const TABS = [
  { id: "description", label: "Overview" },
  { id: "details", label: "Specifications" },
  { id: "reviews", label: "Reviews" },
  { id: "delivery", label: "Shipping" },
];

const CATEGORY_SPECS = {
  Vegetables: ["Rich in vitamins", "Farm-harvested daily", "Cold-chain packed"],
  Fruits: ["Naturally sweet", "Seasonal pick", "No wax coating"],
  Grains: ["High fiber", "Stone-milled option", "Long shelf life"],
  "Dairy & Eggs": ["Farm-fresh", "Refrigerated delivery", "Quality tested"],
  Pantry: ["Airtight sealed", "Premium grade", "Authentic origin"],
  Beverages: ["No added sugar", "Natural ingredients", "Eco packaging"],
  General: ["Quality assured", "Locally sourced", "Fresh guarantee"],
};

const MOCK_REVIEWS = [
  {
    name: "Sunita K.",
    rating: 5,
    date: "2 weeks ago",
    text: "Fresh quality and fast delivery. Will order again!",
  },
  {
    name: "Ramesh T.",
    rating: 5,
    date: "1 month ago",
    text: "Exactly as described. Packaging was excellent.",
  },
  {
    name: "Anita S.",
    rating: 4,
    date: "1 month ago",
    text: "Good product. Slightly smaller pack than expected but tasty.",
  },
];

function Toast({ message, type, onClose }) {
  if (!message) return null;
  const bg = type === "error" ? "bg-red-600" : "bg-emerald-600";
  return (
    <div
      className={`fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-[60] ${bg} text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-3 animate-fade-in`}
      role="status"
    >
      <FaCheckCircle />
      {message}
      <button type="button" onClick={onClose} className="opacity-80 hover:opacity-100">
        <FaTimes />
      </button>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = getUserId();
  const tabsRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [shareTip, setShareTip] = useState("");
  const [favLoading, setFavLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [openFaq, setOpenFaq] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const maxQty = product ? Math.min(Math.max(product.Stock || 0, 0), 10) : 10;
  const lineTotal = product ? product.Price * quantity : 0;
  const cat = product?.Category || "General";
  const specs = CATEGORY_SPECS[cat] || CATEGORY_SPECS.General;

  const galleryImages = useMemo(() => {
    if (!product?.Thumbnail) return [FALLBACK_IMG];
    const base = product.Thumbnail;
    const sep = base.includes("?") ? "&" : "?";
    return [
      base,
      `${base}${sep}w=800&q=80&fit=crop`,
      `${base}${sep}w=400&q=80&sat=-20`,
    ];
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];
    const sameCat = allProducts.filter(
      (p) => p._id !== product._id && p.Category === product.Category
    );
    const rest = allProducts.filter((p) => p._id !== product._id);
    return [...sameCat, ...rest].slice(0, 4);
  }, [product, allProducts]);

  const ratingBreakdown = useMemo(
    () => [
      { stars: 5, pct: 72 },
      { stars: 4, pct: 18 },
      { stars: 3, pct: 6 },
      { stars: 2, pct: 3 },
      { stars: 1, pct: 1 },
    ],
    []
  );

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 3200);
  }, []);

  const saveRecentlyViewed = useCallback((item) => {
    try {
      const key = "khalti_recent_products";
      const raw = JSON.parse(localStorage.getItem(key) || "[]");
      const filtered = raw.filter((p) => p._id !== item._id);
      const next = [{ _id: item._id, ProductName: item.ProductName, Thumbnail: item.Thumbnail, Price: item.Price, Category: item.Category }, ...filtered].slice(0, 5);
      localStorage.setItem(key, JSON.stringify(next));
      setRecentlyViewed(next.filter((p) => p._id !== item._id));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setImageIndex(0);
      try {
        const [detailRes, listRes] = await Promise.all([
          axios.get(`${API}/${id}`),
          axios.get(API),
        ]);
        const p = detailRes.data;
        setProduct(p);
        setAllProducts(Array.isArray(listRes.data) ? listRes.data : []);
        saveRecentlyViewed(p);

        try {
          const key = "khalti_recent_products";
          const raw = JSON.parse(localStorage.getItem(key) || "[]");
          setRecentlyViewed(raw.filter((r) => r._id !== id).slice(0, 4));
        } catch {
          setRecentlyViewed([]);
        }

        if (userId) {
          try {
            const favRes = await axios.get(`http://localhost:5000/api/fav/${userId}`);
            const favIds = (favRes.data.favorites || [])
              .filter((f) => f.product?._id)
              .map((f) => f.product._id);
            setIsFavorite(favIds.includes(id));
          } catch {
            setIsFavorite(false);
          }
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, userId, saveRecentlyViewed]);

  const handleQuantityChange = (delta) => {
    setQuantity((q) => {
      const next = q + delta;
      if (next < 1) return 1;
      if (next > maxQty) return maxQty;
      return next;
    });
  };

  const toggleFavorite = async () => {
    if (!userId) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setFavLoading(true);
    try {
      if (isFavorite) {
        await axios.delete("http://localhost:5000/api/fav/remove", {
          data: { userId, productId: id },
        });
        setIsFavorite(false);
        showToast("Removed from favorites");
      } else {
        await axios.post("http://localhost:5000/api/fav/add", { userId, productId: id });
        setIsFavorite(true);
        showToast("Added to favorites");
      }
    } catch (err) {
      console.error("Favorite failed:", err);
      showToast("Could not update favorites", "error");
    } finally {
      setFavLoading(false);
    }
  };

  const addToCart = () => {
    if (!product || product.Stock <= 0) return;
    try {
      const key = "khalti_cart";
      const cart = JSON.parse(localStorage.getItem(key) || "[]");
      const idx = cart.findIndex((c) => c.productId === product._id);
      if (idx >= 0) {
        cart[idx].quantity = Math.min(cart[idx].quantity + quantity, maxQty);
      } else {
        cart.push({
          productId: product._id,
          name: product.ProductName,
          price: product.Price,
          thumbnail: product.Thumbnail,
          quantity,
        });
      }
      localStorage.setItem(key, JSON.stringify(cart));
      showToast(`${quantity} item(s) added to cart`);
    } catch {
      showToast("Could not save cart", "error");
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    navigate("/khalti", {
      state: {
        orderId: product._id,
        totalAmount: lineTotal,
        productName: product.ProductName,
        quantity,
      },
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.ProductName,
          text: product?.Description?.slice(0, 100),
          url,
        });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareTip("Link copied to clipboard!");
    } catch {
      setShareTip(url);
    }
    setTimeout(() => setShareTip(""), 3000);
  };

  const handleImageMove = (e) => {
    if (!isZooming) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const stockInfo = () => {
    if (!product) return { text: "Unavailable", cls: "bg-slate-100 text-slate-600", pct: 0 };
    const s = product.Stock;
    const pct = Math.min(100, Math.round((s / 120) * 100));
    if (s <= 0) return { text: "Out of stock", cls: "bg-red-100 text-red-800", pct: 0 };
    if (s < 15) return { text: `Only ${s} left — order soon`, cls: "bg-amber-100 text-amber-800", pct };
    return { text: "In stock — ready to ship", cls: "bg-emerald-100 text-emerald-800", pct };
  };

  const stock = stockInfo();
  const freeDelivery = lineTotal >= 500;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="h-32 bg-gradient-to-r from-emerald-800 to-teal-800 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 bg-slate-200 rounded-3xl h-[480px]" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-10 bg-slate-200 rounded w-3/4" />
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-40 bg-slate-200 rounded-2xl" />
              <div className="h-14 bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex flex-col items-center justify-center px-4 text-center">
        <FaBox className="text-5xl text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Product not found</h2>
        <p className="text-slate-500 mb-6">This item may have been removed or the link is invalid.</p>
        <Link
          to="/product"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          <FaArrowLeft />
          Back to shop
        </Link>
      </div>
    );
  }

  const currentImg = galleryImages[imageIndex] || product.Thumbnail || FALLBACK_IMG;

  return (
    <div className="min-h-screen bg-slate-50 pb-28 lg:pb-16">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "" })} />

      {/* Hero strip */}
      <div className="pt-16 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,white_0%,transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
          <nav className="flex items-center gap-2 text-sm text-emerald-100/90 flex-wrap mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              <FaHome className="text-xs" /> Home
            </Link>
            <FaChevronRight className="text-emerald-400/60 text-xs" />
            <Link to="/product" className="hover:text-white">
              Shop
            </Link>
            <FaChevronRight className="text-emerald-400/60 text-xs" />
            <Link to={`/product?category=${encodeURIComponent(cat)}`} className="hover:text-white">
              {cat}
            </Link>
            <FaChevronRight className="text-emerald-400/60 text-xs" />
            <span className="text-white font-medium truncate max-w-[200px]">{product.ProductName}</span>
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${categoryColors[cat] || categoryColors.General}`}>
              <FaLeaf /> {cat}
            </span>
            <button
              type="button"
              onClick={() => navigate("/product")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold backdrop-blur"
            >
              <FaArrowLeft /> Back to shop
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Gallery column */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative aspect-square max-h-[560px] rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl cursor-crosshair group"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleImageMove}
              onClick={() => setLightbox(true)}
            >
              <img
                src={currentImg}
                alt={product.ProductName}
                className={`w-full h-full object-cover transition-transform duration-200 ${isZooming ? "scale-150" : "group-hover:scale-105"}`}
                style={
                  isZooming
                    ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : undefined
                }
                onError={(e) => {
                  e.target.src = FALLBACK_IMG;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(true);
                }}
                className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-white/90 text-slate-700 shadow-lg hover:bg-white"
                aria-label="Expand image"
              >
                <FaExpand />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite();
                }}
                disabled={favLoading}
                className="absolute top-4 right-4 p-3 rounded-full bg-white shadow-lg hover:scale-110 transition disabled:opacity-60"
              >
                {isFavorite ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-slate-600 text-xl" />}
              </button>
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow">
                <HiSparkles /> Koshi Organic
              </span>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    imageIndex === i ? "border-emerald-500 ring-2 ring-emerald-200" : "border-slate-200 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                </button>
              ))}
            </div>

            {/* Trust grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: FaLeaf, title: "Certified organic", sub: "No pesticides" },
                { icon: FaTruck, title: "Fast delivery", sub: "2–4 days" },
                { icon: FaShieldAlt, title: "Secure checkout", sub: "Khalti pay" },
                { icon: FaUndo, title: "Easy returns", sub: "24hr support" },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="bg-white border border-slate-200 rounded-2xl p-4">
                  <Icon className="text-emerald-600 text-lg mb-2" />
                  <p className="text-xs font-bold text-slate-800">{title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase column — sticky */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-20 space-y-5">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8">
                <p className="text-xs font-mono text-slate-400 tracking-wider">{product.ProductCode}</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 leading-snug">
                  {product.ProductName}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <FaStar key={n} className={n <= 4 ? "text-amber-400 text-sm" : "text-amber-200 text-sm"} />
                    ))}
                    <span className="ml-2 text-sm font-bold text-slate-800">4.8</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("reviews");
                        tabsRef.current?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-xs text-emerald-600 hover:underline ml-1"
                    >
                      (48 reviews)
                    </button>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${stock.cls}`}>{stock.text}</span>
                </div>

                {/* Stock bar */}
                {product.Stock > 0 && (
                  <div className="mt-4">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                        style={{ width: `${Math.max(stock.pct, 8)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{product.Stock} units available</p>
                  </div>
                )}

                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Unit price</p>
                      <p className="text-3xl sm:text-4xl font-bold text-emerald-800">
                        Rs. {product.Price.toLocaleString()}
                      </p>
                    </div>
                    {quantity > 1 && (
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Subtotal</p>
                        <p className="text-xl font-bold text-slate-900">Rs. {lineTotal.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  {freeDelivery && (
                    <p className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1">
                      <FaTruck /> Free delivery on this order
                    </p>
                  )}
                  {!freeDelivery && lineTotal > 0 && (
                    <p className="text-xs text-slate-500 mt-2">
                      Add Rs. {(500 - lineTotal).toLocaleString()} more for free delivery
                    </p>
                  )}
                </div>

                {/* Quick specs */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {specs.map((s) => (
                    <span key={s} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-slate-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-12 h-12 text-lg font-bold text-slate-600 hover:bg-white disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= maxQty || product.Stock <= 0}
                        className="w-12 h-12 text-lg font-bold text-slate-600 hover:bg-white disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-slate-400">Max {maxQty} per order</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={product.Stock <= 0}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-300/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl"
                  >
                    <HiOutlineLightningBolt className="text-xl" />
                    Buy now — Rs. {lineTotal.toLocaleString()}
                  </button>
                  <button
                    type="button"
                    onClick={addToCart}
                    disabled={product.Stock <= 0}
                    className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-emerald-600 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 disabled:opacity-50 transition"
                  >
                    <FaShoppingCart />
                    Add to cart
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={toggleFavorite}
                      className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                    >
                      {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                      {isFavorite ? "Saved" : "Wishlist"}
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                    >
                      <FaShare /> Share
                    </button>
                  </div>
                </div>

                {shareTip && <p className="text-xs text-emerald-600 font-medium mt-2 text-center">{shareTip}</p>}

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-6 text-slate-400">
                  <FaCreditCard title="Cards" className="text-xl" />
                  <img
                    src="https://play-lh.googleusercontent.com/Xh_OlrdkF1UnGCnMN__4z-yXffBAEl0eUDeVDPr4UthOERV4Fll9S-TozSfnlXDFzw"
                    alt="Khalti"
                    className="h-6 opacity-70"
                  />
                  <span className="text-[10px] font-medium uppercase tracking-wider">Secure payment</span>
                </div>
              </div>

              {/* Order summary mini */}
              <div className="bg-slate-900 text-white rounded-2xl p-5">
                <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-300 mb-3">Order preview</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex justify-between">
                    <span>{product.ProductName} × {quantity}</span>
                    <span className="text-white font-medium">Rs. {lineTotal.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Delivery</span>
                    <span className={freeDelivery ? "text-emerald-400" : ""}>
                      {freeDelivery ? "FREE" : "Rs. 80"}
                    </span>
                  </li>
                </ul>
                <div className="flex justify-between mt-4 pt-4 border-t border-slate-700 font-bold">
                  <span>Estimated total</span>
                  <span className="text-emerald-400">
                    Rs. {(lineTotal + (freeDelivery ? 0 : 80)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + FAQ */}
        <div ref={tabsRef} className="mt-14 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/80">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition ${
                    activeTab === tab.id
                      ? "border-emerald-600 text-emerald-700 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8 text-slate-600 leading-relaxed">
              {activeTab === "description" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">About this product</h3>
                    <p>{product.Description}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      "Certified organic from Koshi region farms",
                      "Packed in food-grade, eco-friendly materials",
                      "Quality checked before dispatch",
                      "Supports local farmer cooperatives",
                    ].map((line) => (
                      <div key={line} className="flex gap-3 p-4 rounded-xl bg-emerald-50/80 border border-emerald-100">
                        <FaCheckCircle className="text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  <dl className="grid sm:grid-cols-2 gap-4">
                    {[
                      ["SKU", product.ProductCode],
                      ["Category", cat],
                      ["Stock", `${product.Stock} units`],
                      ["Unit price", `Rs. ${product.Price.toLocaleString()}`],
                      ["Origin", "Koshi Region, Nepal"],
                      ["Shelf life", cat === "Vegetables" || cat === "Fruits" ? "3–7 days refrigerated" : "6–12 months"],
                    ].map(([label, value]) => (
                      <div key={label} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <dt className="text-xs text-slate-400 uppercase tracking-wider">{label}</dt>
                        <dd className="font-semibold text-slate-900 mt-1">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row gap-8">
                    <div className="text-center sm:text-left sm:pr-8 sm:border-r border-slate-200">
                      <p className="text-5xl font-bold text-slate-900">4.8</p>
                      <div className="flex justify-center sm:justify-start gap-0.5 my-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <FaStar key={n} className="text-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-500">Based on 48 reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {ratingBreakdown.map((row) => (
                        <div key={row.stars} className="flex items-center gap-3 text-sm">
                          <span className="w-8 text-slate-500">{row.stars}★</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                          </div>
                          <span className="w-8 text-slate-400 text-xs">{row.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {MOCK_REVIEWS.map((r, i) => (
                      <article key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                              {r.name[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{r.name}</p>
                              <p className="text-xs text-slate-400">{r.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <FaStar key={n} className={n <= r.rating ? "text-amber-400 text-xs" : "text-slate-200 text-xs"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">{r.text}</p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "delivery" && (
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { icon: FaTruck, title: "Standard", desc: "2–4 business days. Rs. 80 (free over Rs. 500)." },
                    { icon: HiOutlineLightningBolt, title: "Express", desc: "Same-day in Kathmandu valley before 2 PM." },
                    { icon: FaRegClock, title: "Returns", desc: "Report damaged goods within 24 hours for replacement." },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="p-5 rounded-2xl border border-slate-200">
                      <Icon className="text-emerald-600 text-xl mb-3" />
                      <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
                      <p className="text-sm">{desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FAQ sidebar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm h-fit">
            <h3 className="font-bold text-slate-900 mb-4">Common questions</h3>
            <div className="space-y-2">
              {[
                { q: "Is this product certified organic?", a: "Yes. All Koshi Organic items meet our farm certification standards." },
                { q: "How is freshness guaranteed?", a: "We harvest and pack within 24 hours for perishables, with cold-chain where needed." },
                { q: "Can I pay with Khalti?", a: "Yes. Use Buy now to checkout securely via Khalti e-payment." },
                { q: "What if my order arrives damaged?", a: "Contact us within 24 hours with photos — we'll replace or refund." },
              ].map((item, i) => (
                <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-800 flex justify-between items-center hover:bg-slate-50"
                  >
                    {item.q}
                    <FaChevronRight className={`text-slate-400 text-xs transition ${openFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <p className="px-4 pb-3 text-xs text-slate-600 leading-relaxed">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recently viewed */}
        {recentlyViewed.length > 0 && (
          <section className="mt-14">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recently viewed</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recentlyViewed.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="shrink-0 w-36 bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-emerald-300 text-left"
                >
                  <img src={p.Thumbnail} alt="" className="w-full h-24 object-cover" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                  <div className="p-2">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-2">{p.ProductName}</p>
                    <p className="text-xs text-emerald-700 font-bold mt-1">Rs. {p.Price?.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 pb-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Recommended</p>
                <h2 className="text-2xl font-bold text-slate-900">You may also like</h2>
              </div>
              <Link to={`/product?category=${encodeURIComponent(cat)}`} className="text-emerald-700 font-semibold text-sm hover:underline">
                Shop {cat}
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <article
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:border-emerald-300 hover:shadow-xl transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-slate-100 relative">
                    <img
                      src={p.Thumbnail}
                      alt={p.ProductName}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      onError={(e) => { e.target.src = FALLBACK_IMG; }}
                    />
                    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded ${categoryColors[p.Category] || categoryColors.General}`}>
                      {p.Category || "General"}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 group-hover:text-emerald-700">{p.ProductName}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-emerald-700 font-bold">Rs. {p.Price?.toLocaleString()}</p>
                      <span className="text-[10px] text-amber-600 font-medium flex items-center gap-0.5">
                        <FaStar /> 4.8
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-3 safe-area-pb">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500 truncate">{product.ProductName}</p>
          <p className="text-lg font-bold text-emerald-700">Rs. {lineTotal.toLocaleString()}</p>
        </div>
        <button
          type="button"
          onClick={addToCart}
          disabled={product.Stock <= 0}
          className="p-3 rounded-xl border-2 border-emerald-600 text-emerald-700 disabled:opacity-50"
          aria-label="Add to cart"
        >
          <FaShoppingCart />
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={product.Stock <= 0}
          className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl disabled:opacity-50"
        >
          Buy now
        </button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setLightbox(false)}
          >
            <FaTimes size={24} />
          </button>
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setImageIndex((i) => (i === 0 ? galleryImages.length - 1 : i - 1));
            }}
          >
            <FaChevronLeft />
          </button>
          <img
            src={currentImg}
            alt={product.ProductName}
            className="max-h-[85vh] max-w-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setImageIndex((i) => (i === galleryImages.length - 1 ? 0 : i + 1));
            }}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
