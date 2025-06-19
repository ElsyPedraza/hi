import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AxiosProvider from "./contexts/AxiosProvider.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Mappa from "./pages/Mappa.jsx";
import Shows from "./pages/Shows.jsx";
import Attractions from "./pages/Attractions.jsx";
import Tickets from "./pages/Tickets.jsx";
import Contact from "./pages/Contact.jsx";
import Register from "./pages/Register";
import UserProvider from "./contexts/UserProvider";
import Dashboard from "./pages/Dashboard";
import PlannerPage from "@/pages/PlannerPage";
import { PlannerProvider } from "./contexts/PlannerProvider";
import Success from "./pages/Success.jsx";
import MainLayout from "./layouts/MainLayout";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AxiosProvider>
        <UserProvider>
          <PlannerProvider>
            <Routes>
              {/* Route con layout (Header + MobileBottomNav) */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="shows" element={<Shows />} />
                <Route path="attractions" element={<Attractions />} />
                <Route path="tickets" element={<Tickets />} />
                <Route path="contact" element={<Contact />} />
                <Route path="map" element={<Mappa />} />
                <Route path="/planner/:date" element={<PlannerPage />} />
                <Route path="/success" element={<Success />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              {/* Route senza layout */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </PlannerProvider>
        </UserProvider>
      </AxiosProvider>
    </BrowserRouter>
  </React.StrictMode>
);
