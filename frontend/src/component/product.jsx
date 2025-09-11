import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUserId } from "../utils/auth";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaLeaf,
  FaTruck,
  FaFilter,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const API = "http://localhost:5000/api/product";

const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Dairy & Eggs", "Pantry", "Beverages"];

const categoryColors = {
  Vegetables: "bg-emerald-100 text-emerald-800",
  Fruits: "bg-orange-100 text-orange-800",
  Grains: "bg-amber-100 text-amber-800",
  "Dairy & Eggs": "bg-sky-100 text-sky-800",
  Pantry: "bg-violet-100 text-violet-800",
  Beverages: "bg-teal-100 text-teal-800",
  General: "bg-gray-100 text-gray-700",
};

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();
  const userId = getUserId();

  const fetchData = async () => {
    setLoading(true);
    try {
      const productRes = await axios.get(API);
      setProducts(Array.isArray(productRes.data) ? productRes.data : []);

      if (userId) {
        const favRes = await axios.get(`http://localhost:5000/api/fav/${userId}`);
        const favIds = (favRes.data.favorites || [])
          .filter((fav) => fav.product?._id)
          .map((fav) => fav.product._id);
        setFavorites(favIds);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    if (q !== null) setSearch(q);
    if (cat) setCategory(cat);
  }, [searchParams]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await axios.post(`${API}/seed`);
      await fetchData();
    } catch (err) {
      console.error("Seed failed:", err);
      alert("Could not load products. Make sure the backend is running.");
    } finally {
      setSeeding(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.ProductName?.toLowerCase().includes(q) ||
          p.Description?.toLowerCase().includes(q) ||
          p.ProductCode?.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      list = list.filter((p) => (p.Category || "General") === category);
    }

    if (sortBy === "price-asc") list.sort((a, b) => a.Price - b.Price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.Price - a.Price);
    else if (sortBy === "stock") list.sort((a, b) => b.Stock - a.Stock);
    else list.sort((a, b) => a.ProductName.localeCompare(b.ProductName));

    return list;
  }, [products, search, category, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [search, category, sortBy]);

  const toggleFavorite = async (productId, e) => {
    e.stopPropagation();
    if (!userId) {
      alert("Please log in to add favorites.");
      return;
    }
    try {
      const isFav = favorites.includes(productId);
      if (isFav) {
        await axios.delete("http://localhost:5000/api/fav/remove", {
          data: { userId, productId },
        });
        setFavorites((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post("http://localhost:5000/api/fav/add", { userId, productId });
        setFavorites((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error("Favorite toggle failed:", error);
    }
  };

  const inStockCount = products.filter((p) => p.Stock > 0).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="pt-24 pb-12 relative overflow-hidden bg-gradient-to-br from-emerald-800 via-green-700 to-teal-800 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm font-medium mb-4">
                <HiSparkles /> Koshi Organic Agro
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
                Fresh Grocery Store
              </h1>
              <p className="text-emerald-100 max-w-xl text-lg">
                Farm-fresh organic produce delivered from the Koshi region. Quality you can taste.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 shrink-0">
              {[
                { icon: FaLeaf, label: "100% Organic", value: "Certified" },
                { icon: FaTruck, label: "Fast Delivery", value: "Same day" },
                { icon: FaStar, label: "Products", value: products.length || "10+" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20"
                >
                  <Icon className="mx-auto text-2xl mb-2 text-emerald-200" />
                  <p className="text-xl font-bold">{value}</p>
                  <p className="text-xs text-emerald-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search groceries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <FaFilter />
                <span className="hidden sm:inline">Sort:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="name">Name A–Z</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="stock">Stock: High to Low</option>
              </select>
              <span className="text-sm text-slate-500">
                {inStockCount} in stock · {filtered.length} shown
              </span>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse">
                <div className="h-48 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-8 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <FaLeaf className="mx-auto text-5xl text-emerald-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No products yet</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Load our curated collection of 10 organic grocery items to get started.
            </p>
            <button
              type="button"
              onClick={handleSeed}
              disabled={seeding}
              className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {seeding ? "Loading..." : "Load 10 Grocery Products"}
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg">No products match your search.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-4 text-emerald-600 font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentProducts.map((product) => {
                const cat = product.Category || "General";
                const isLow = product.Stock < 15;
                const isFav = favorites.includes(product._id);

                return (
                  <article
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={product.Thumbnail}
                        alt={product.ProductName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80";
                        }}
                      />
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          categoryColors[cat] || categoryColors.General
                        }`}
                      >
                        {cat}
                      </span>
                      {isLow && (
                        <span className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                          Low stock
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(product._id, e)}
                        className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/90 shadow-md hover:bg-white transition"
                      >
                        {isFav ? (
                          <FaHeart className="text-red-500 text-lg" />
                        ) : (
                          <FaRegHeart className="text-slate-500 text-lg" />
                        )}
                      </button>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h2 className="font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-emerald-700 transition-colors">
                          {product.ProductName}
                        </h2>
                        <span className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg">
                          <FaStar className="text-amber-400 text-xs" />
                          <span className="text-xs font-bold text-amber-700">4.8</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{product.ProductCode}</p>
                      <p className="text-sm text-slate-500 line-clamp-2 flex-1 mb-4">
                        {product.Description}
                      </p>

                      <div className="flex items-end justify-between mt-auto pt-3 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-400">Price</p>
                          <p className="text-xl font-bold text-emerald-700">
                            Rs. {product.Price.toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-lg ${
                            product.Stock > 15
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          {product.Stock > 15 ? `${product.Stock} in stock` : `${product.Stock} left`}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product._id}`);
                        }}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition"
                      >
                        <FaShoppingCart />
                        View Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-white"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      currentPage === i + 1
                        ? "bg-emerald-600 text-white"
                        : "bg-white border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-white"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          © 2025 Koshi Organic Agro Food · Fresh from farm to your table
        </div>
      </footer>
    </div>
  );
}
