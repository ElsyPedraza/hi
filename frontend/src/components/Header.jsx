import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Home,
  Map,
  Theater,
  FerrisWheelIcon as Ferris,
  Phone,
  Mail,
  Ticket,
  LayoutDashboard,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import banner from "@/assets/banner.jpg";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useUser } from "@/contexts/UserProvider";

export default function Header() {
  const [activeItem, setActiveItem] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, handleLogout } = useUser();

  const menuItems = [
    { id: "home", label: "Home", icon: <Home className="mr-2 h-6 w-6" /> },
    {
      id: "attractions",
      label: "Attrazioni",
      icon: <Ferris className="mr-2 h-6 w-6" />,
    },
    {
      id: "map",
      label: "La nostra mappa",
      icon: <Map className="mr-2 h-6 w-6" />,
    },
    {
      id: "shows",
      label: "Eventi Speciali",
      icon: <Theater className="mr-2 h-6 w-6" />,
    },
    {
      id: "tickets",
      label: "Biglietti",
      icon: <Ticket className="mr-2 h-6 w-6" />,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-6 w-6" />,
    },
    {
      id: "contact",
      label: "Contattaci",
      icon: <Phone className="mr-2 h-6 w-6" />,
    }
  ];

  const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  return (
    <header className="relative h-[300px] w-full overflow-hidden">
      <img
        src={banner}
        alt="Banner EnjoyPark"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/80 z-10"></div>

      {/* Top slim header */}
      <div className=" relative z-10 bg-black/30 backdrop-blur-sm text-white py-2 px-4 md:px-8">
        <div className="container px-2 md:px-20 mx-auto flex justify-between items-center text-sm">
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              <span>+39 123 456 7890</span>
            </div>
            <div className="hidden sm:flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              <span>info@hi.it</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center space-x-3">
              <SocialLink
                href="#"
                icon={<Facebook className="h-4 w-4" />}
                label="Facebook"
              />
              <SocialLink
                href="#"
                icon={<Instagram className="h-4 w-4" />}
                label="Instagram"
              />
              <SocialLink
                href="#"
                icon={<Youtube className="h-4 w-4" />}
                label="Youtube"
              />
            </div>
            <div>
              {/* Login button - top right */}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={springConfig}
              >
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <span className="text-white flex">
                      <DotLottieReact
                        src="https://lottie.host/75ec45eb-38ab-4d20-b426-020a9964950a/QNExmcRjQI.lottie"
                        loop
                        autoplay
                        className="w-12"
                      />
                      Ciao, {user.firstName}
                    </span>
                    <motion.button
                      onClick={handleLogout}
                      className="bg-white/0 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Logout
                    </motion.button>
                  </div>
                ) : (
                  <Link to="/login">
                    <motion.button
                      className="bg-white/0 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium border border-white/30 hover:bg-white/30 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Accedi
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo */}
      <motion.div
        className="absolute top-16 left-8 z-20 px-2 md:px-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springConfig}
      >
        <div className="relative w-40 h-40 rounded-full bg-white/80 backdrop-blur-lg shadow-2xl flex items-center justify-center overflow-hidden">
          <Link to="/">
            <DotLottieReact
              className="w-full h-full object-contain"
              src="https://lottie.host/05f465cf-b6ea-417c-b500-022704fb26ad/sHJhkuzs9C.lottie"
              loop
              autoplay
            />
          </Link>
        </div>
      </motion.div>

      {/* Navigation Menu - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-black/60 backdrop-blur-md border-t border-white/20">
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="container mx-auto px-8">
              <ul className="flex justify-center space-x-8 py-4">
                {menuItems
                  .filter((item) => {
                    // Nascondi "Il mio Planner" se l'utente non è loggato
                    if (item.id === "dashboard" && !isAuthenticated)
                      return false;
                    return true;
                  })
                  .map((item, index) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springConfig, delay: index * 0.1 }}
                    >
                      <NavLink
                        to={`/${item.id === "home" ? "" : item.id}`}
                        isActive={activeItem === item.id}
                        onClick={() => setActiveItem(item.id)}
                        icon={item.icon}
                        label={item.label}
                      />
                    </motion.li>
                  ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
      <MobileBottomNav />
    </header>
  );
}

// Componente NavLink per desktop
function NavLink({ to, isActive, onClick, icon, label }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        className={`
          relative flex items-center text-white font-medium px-4 py-2 rounded-md transition-all duration-300
          ${isActive ? "bg-white/20" : "hover:bg-white/10"}
        `}
        onClick={onClick}
      >
        {React.cloneElement(icon, { className: "mr-2 h-4 w-4" })}
        {label}
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400"
            layoutId="activeTab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </Link>
    </motion.div>
  );
}

// Componente SocialLink
function SocialLink({ href, icon, label }) {
  return (
    <motion.a
      href={href}
      className="hover:text-orange-300 transition-colors"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </motion.a>
  );
}
