import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { khaltiPayment } from "../store/KhaltiSlice";

const KhaltiPayment = () => {
  const location = useLocation();
  const checkout = location.state || {};

  const [orderId, setOrderId] = useState(checkout.orderId || "");
  const [totalAmount, setTotalAmount] = useState(
    checkout.totalAmount ? String(checkout.totalAmount) : ""
  );

  const dispatch = useDispatch();
  const paymentUrl = useSelector((state) => state.khalti.khaltiUrl);
  const pidx = useSelector((state) => state.khalti.pidx);
  const status = useSelector((state) => state.khalti.status);

  const handleInitiatePayment = () => {
    if (!orderId || !totalAmount) {
      alert("Please provide valid order details.");
      return;
    }

    const payload = {
      paymentMethod: "khalti",
      paymentStatus: "unpaid",
      pidx: null,
      orderId,
      totalAmount: Number(totalAmount),
    };

    dispatch(khaltiPayment(payload));
  };

  useEffect(() => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
      alert("Payment initiated successfully! Redirecting to Khalti...");
    }
  }, [paymentUrl]);

  useEffect(() => {
    if (checkout.orderId) setOrderId(checkout.orderId);
    if (checkout.totalAmount) setTotalAmount(String(checkout.totalAmount));
  }, [checkout.orderId, checkout.totalAmount]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 py-8 max-w-lg mx-auto">
      <Link to="/product" className="text-emerald-600 text-sm font-medium hover:underline">
        ← Back to shop
      </Link>
      {checkout.productName && (
        <p className="mt-4 text-slate-600 text-sm">
          Paying for: <strong className="text-slate-900">{checkout.productName}</strong>
          {checkout.quantity > 1 && ` × ${checkout.quantity}`}
        </p>
      )}
      <h2 className="text-2xl font-bold text-slate-900 mt-4 mb-6">Khalti checkout</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Order ID: </label>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Total Amount: </label>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="Enter Total Amount"
        />
      </div>

      <button
        onClick={handleInitiatePayment}
        disabled={status === "loading"}
        style={{
          padding: "10px",
          background: "#5cb85c",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {status === "loading" ? "Processing..." : "Initiate Payment"}
      </button>

      {paymentUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Payment URL:</p>
          <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
            {paymentUrl}
          </a>
        </div>
      )}

      {pidx && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>pidx:</strong> {pidx}</p>
        </div>
      )}
    </div>
  );
};

export default KhaltiPayment;