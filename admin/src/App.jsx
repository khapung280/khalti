import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./Components/Adminlogin";
import React from "react";
function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLogin/>} />
  



        </Routes>
      </BrowserRouter>
  );
}

export default App;
