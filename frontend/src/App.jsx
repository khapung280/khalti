import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SelectPaymentType from "./pages/selectpaymentType";
import Khalti from "./pages/khalti";
import PaymentSuccess from "./pages/paymentsucess";
import { Provider } from "react-redux";
import store from "./store/store";
import React from "react";
import Register from "./component/register";
import Login from "./component/login";
import Product from "./component/product";
import Navbar from "./component/nav";
import HomePage from "./component/home";
import AboutPage from "./component/aboutus";
import { Contact } from "lucide-react";
import ContactPage from "./component/contact";
import ProductDetail from "./component/product detail";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/About" element={<AboutPage/>} />
          <Route
            path="/product"
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<ContactPage/>} />
          <Route
            path="/Payment"
            element={
              <ProtectedRoute>
                <SelectPaymentType />
              </ProtectedRoute>
            }
          />
          <Route
            path="/khalti"
            element={
              <ProtectedRoute>
                <Khalti />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Product" element={<Navigate to="/product" replace />} />



        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
