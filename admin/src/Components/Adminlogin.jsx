import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  // --- Auth state ---
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- Data state ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Table UI state ---
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("ProductName");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- Helpers ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Login successful! Welcome ${data.username || formData.username}`);
        setIsLoggedIn(true);
        fetchProducts();
      } else {
        setMessage(`❌ ${data.message || "Login failed"}`);
      }
    } catch {
      setMessage("⚠️ Server error. Please try again.");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/product");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFormData({ username: "", email: "", password: "" });
    setMessage("");
    setProducts([]);
    setSearch("");
    setPage(1);
  };

  const formatPrice = (n) =>
    typeof n === "number" ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n) : "-";

  const sortBy = (key) => {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const sortIndicator = (active) => (
    <span className={`inline-flex flex-col ml-1 ${active ? "opacity-100" : "opacity-40"}`}>
      <svg viewBox="0 0 20 20" className={`w-3 h-3 ${sortDir === "asc" ? "" : "opacity-40"}`} aria-hidden="true">
        <path d="M10 5l-5 6h10l-5-6z" />
      </svg>
      <svg viewBox="0 0 20 20" className={`w-3 h-3 -mt-1 ${sortDir === "desc" ? "" : "opacity-40"}`} aria-hidden="true">
        <path d="M10 15l5-6H5l5 6z" />
      </svg>
    </span>
  );

  const stockBadge = (stock) => {
    const s = Number(stock) || 0;
    const cls =
      s > 50
        ? "bg-green-100 text-green-800"
        : s > 20
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{s} in stock</span>;
  };

  // --- Derived data ---
  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.ProductName || "").toLowerCase().includes(q) ||
      (p.ProductCode || "").toLowerCase().includes(q) ||
      (p.Description || "").toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    const va = a[sortKey];
    const vb = b[sortKey];
    if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
    return String(va || "").localeCompare(String(vb || "")) * dir;
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const paged = sorted.slice(start, start + pageSize);

  const changePage = (to) => setPage(Math.min(Math.max(1, to), totalPages));

  // --- Views ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Login</h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {["username", "email", "password"].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                    required
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter your ${field}`}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Sign in
              </button>
            </form>
            {message && (
              <div
                className={`mt-4 p-3 rounded-md ${
                  message.includes("✅")
                    ? "bg-green-50 text-green-800"
                    : message.includes("❌")
                    ? "bg-red-50 text-red-800"
                    : "bg-yellow-50 text-yellow-800"
                }`}
              >
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="w-full sm:w-80 pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Rows per page</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="sticky top-16 z-10 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Thumbnail</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => sortBy("ProductName")}>
                    Name {sortIndicator(sortKey === "ProductName")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => sortBy("Price")}>
                    Price {sortIndicator(sortKey === "Price")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => sortBy("Stock")}>
                    Stock {sortIndicator(sortKey === "Stock")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-16">
                      <div className="flex justify-center">
                        <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-indigo-600 rounded-full"></div>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="py-6">
                      <div className="mx-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-500 italic">
                      No products found
                    </td>
                  </tr>
                ) : (
                  paged.map((p) => (
                    <tr key={p._id} className="hover:bg-indigo-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{p._id}</td>
                      <td className="px-6 py-4">
                        <div className="w-14 h-14 rounded-md shadow-md overflow-hidden">
                          <img
                            src={p.Thumbnail}
                            alt={p.ProductName}
                            className="w-full h-full object-cover transform hover:scale-110 transition"
                            onError={(e) => {
                              e.currentTarget.src =
                                "data:image/svg+xml;charset=UTF-8," +
                                encodeURIComponent(
                                  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
                                     <rect width='100%' height='100%' fill='#eef2ff'/>
                                     <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6366f1' font-size='14'>No Image</text>
                                   </svg>`
                                );
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{p.ProductName}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatPrice(p.Price)}</td>
                      <td className="px-6 py-4">{stockBadge(p.Stock)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <span className="line-clamp-2">{p.Description}</span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition"
                          onClick={() => alert(`Edit ${p.ProductName}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm border border-red-200 text-red-700 hover:bg-red-50 transition"
                          onClick={() => alert(`Delete ${p.ProductName}`)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{total === 0 ? 0 : start + 1}-{Math.min(start + pageSize, total)}</span> of{" "}
              <span className="font-semibold">{total}</span>
            </p>

            <div className="inline-flex rounded-md shadow-sm overflow-hidden">
              <button
                onClick={() => changePage(1)}
                className="px-3 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50"
                disabled={currentPage === 1}
              >
                « First
              </button>
              <button
                onClick={() => changePage(currentPage - 1)}
                className="px-3 py-2 text-sm border-t border-b border-gray-200 bg-white hover:bg-gray-50"
                disabled={currentPage === 1}
              >
                ‹ Prev
              </button>
              <span className="px-4 py-2 text-sm border-t border-b border-gray-200 bg-gray-50">
                Page <strong>{currentPage}</strong> / {totalPages}
              </span>
              <button
                onClick={() => changePage(currentPage + 1)}
                className="px-3 py-2 text-sm border-t border-b border-gray-200 bg-white hover:bg-gray-50"
                disabled={currentPage === totalPages}
              >
                Next ›
              </button>
              <button
                onClick={() => changePage(totalPages)}
                className="px-3 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50"
                disabled={currentPage === totalPages}
              >
                Last »
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
