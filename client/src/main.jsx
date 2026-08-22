import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";

axios.defaults.withCredentials = true;

// Add JWT token to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('devboard_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

createRoot(document.getElementById("root")).render(
  <App />
);