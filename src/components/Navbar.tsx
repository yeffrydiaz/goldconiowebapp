/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Shield, Link2, Coins, BarChart3, Milestone, HelpCircle } from "lucide-react";
import { triggerHapticFeedback } from "../utils/haptics";
import { recordClick } from "../utils/analytics";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAdminClick: () => void;
  isAdminLoggedIn: boolean;
}

export default function Navbar({ activeTab, setActiveTab, onAdminClick, isAdminLoggedIn }: NavbarProps) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show near top
      if (currentScrollY < 120) {
        setVisible(true);
      } else {
        // Hide if scrolling down, show if scrolling up
        if (currentScrollY > lastScrollY + 10) {
          setVisible(false);
        } else if (currentScrollY < lastScrollY - 10) {
          setVisible(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { id: "home", label: "Home", icon: Home, targetId: "hero-section" },
    { id: "contract", label: "Contract", icon: Shield, targetId: "contract-section" },
    { id: "about", label: "About", icon: Coins, targetId: "about-section" },
    { id: "roadmap", label: "Roadmap", icon: Milestone, targetId: "roadmap-section" },
    { id: "faq", label: "FAQ", icon: HelpCircle, targetId: "faq-section" },
    { id: "ecosystem", label: "Ecosystem", icon: Link2, targetId: "ecosystem-section" },
  ];

  const handleNavClick = (id: string, targetId: string) => {
    triggerHapticFeedback();
    setActiveTab(id);
    recordClick(`Nav bottom bar: ${id}`, "system");

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="persistent-bottom-navbar"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-neutral-950/80 backdrop-blur-lg border border-[#D4AF37]/20 shadow-xl rounded-full px-4 py-2.5 flex items-center justify-between"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => handleNavClick(item.id, item.targetId)}
                className={`relative flex flex-col items-center justify-center gap-1 py-1 px-3.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? "text-[#D4AF37] font-medium" 
                    : "text-neutral-400 hover:text-[#F9E29C]/80"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-glow"
                    className="absolute inset-0 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
                <span className="text-[10px] font-sans tracking-wide">{item.label}</span>
              </button>
            );
          })}

          {/* Secure Admin Tab */}
          <button
            id="nav-btn-admin"
            onClick={() => {
              triggerHapticFeedback();
              recordClick("Nav bottom bar: admin_click", "system");
              onAdminClick();
            }}
            className={`relative flex flex-col items-center justify-center gap-1 py-1 px-3.5 rounded-full transition-all duration-300 ${
              isAdminLoggedIn 
                ? "text-green-400 font-medium" 
                : "text-neutral-400 hover:text-[#F9E29C]/80"
            }`}
          >
            {isAdminLoggedIn && (
              <span className="absolute -top-1 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            )}
            <BarChart3 className="h-5 w-5" />
            <span className="text-[10px] font-sans tracking-wide">
              {isAdminLoggedIn ? "Metrics" : "Admin"}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
