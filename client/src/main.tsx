import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import CheckAuth from "./components/check-auth";
import TicketsPage from "./pages/tickets";
import TicketDetailsPage from "./pages/ticket";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import AdminPanel from "./pages/admin";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element with ID 'root'.");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <CheckAuth protected={true}>
                <TicketsPage />
              </CheckAuth>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <CheckAuth protected={true}>
                <TicketDetailsPage />
              </CheckAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <CheckAuth protected={true}>
                <AdminPanel />
              </CheckAuth>
            }
          />
        </Route>

        <Route
          path="/login"
          element={
            <CheckAuth protected={false}>
              <LoginPage />
            </CheckAuth>
          }
        />
        <Route
          path="/signup"
          element={
            <CheckAuth protected={false}>
              <SignupPage />
            </CheckAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);