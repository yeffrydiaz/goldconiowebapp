/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Wifi, WifiOff, Twitter, Send, Github, MessageCircle, 
  Layers, ArrowUpRight, ShieldAlert, CheckCircle2, RefreshCw, 
  Coins, Info, HelpCircle, Activity, Sun, Moon, Sparkles, ExternalLink, Image, Instagram, Facebook
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ContractBox from "./components/ContractBox";
import About from "./components/About";
import Ecosystem from "./components/Ecosystem";
import AdminDashboard from "./components/AdminDashboard";
import PriceTicker from "./components/PriceTicker";
import Roadmap from "./components/Roadmap";
import FAQ from "./components/FAQ";
import HoldingsCalculator from "./components/HoldingsCalculator";
import GoldconioLogo from "./components/GoldconioLogo";

import { 
  triggerHapticFeedback, triggerToggleHaptic, triggerSuccessHaptic 
} from "./utils/haptics";
import { 
  recordPageLoad, recordClick, recordScrollDepth, recordSessionDuration 
} from "./utils/analytics";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Offline support indicator
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  
  // Custom dark theme presets
  const [theme, setTheme] = useState<"luxury-charcoal" | "midnight-black">("luxury-charcoal");

  // PancakeSwap simulated swap widget states
  const [swapBnb, setSwapBnb] = useState("0.15");
  const [swapGcnio, setSwapGcnio] = useState("43,125.00");
  const [swapStatus, setSwapStatus] = useState<"idle" | "estimating" | "success">("idle");
  const [swapTxHash, setSwapTxHash] = useState("");

  const sectionsRef = {
    hero: useRef<HTMLDivElement>(null),
    contract: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    ecosystem: useRef<HTMLDivElement>(null),
  };

  // On Mount: Record Page Load metrics and sync theme
  useEffect(() => {
    recordPageLoad();

    // Check system preference for dark theme automatic synchronization
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (systemPrefersDark) {
      setTheme("midnight-black");
    }

    const handleOnline = () => {
      setIsOnline(true);
      triggerSuccessHaptic();
    };
    const handleOffline = () => {
      setIsOnline(false);
      triggerToggleHaptic();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Track session durations (10-second logging ticks)
  useEffect(() => {
    const timer = setInterval(() => {
      recordSessionDuration(10);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Track scroll depth and synchronize Navbar active tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Update active tab depending on current section
      const heroEl = document.getElementById("hero-section");
      const contractEl = document.getElementById("contract-section");
      const aboutEl = document.getElementById("about-section");
      const roadmapEl = document.getElementById("roadmap-section");
      const faqEl = document.getElementById("faq-section");
      const ecosystemEl = document.getElementById("ecosystem-section");

      if (ecosystemEl && scrollPosition >= ecosystemEl.offsetTop) {
        setActiveTab("ecosystem");
      } else if (faqEl && scrollPosition >= faqEl.offsetTop) {
        setActiveTab("faq");
      } else if (roadmapEl && scrollPosition >= roadmapEl.offsetTop) {
        setActiveTab("roadmap");
      } else if (aboutEl && scrollPosition >= aboutEl.offsetTop) {
        setActiveTab("about");
      } else if (contractEl && scrollPosition >= contractEl.offsetTop) {
        setActiveTab("contract");
      } else if (heroEl) {
        setActiveTab("home");
      }

      // Record Scroll depth achievements
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const scrollPercent = Math.round((window.scrollY / totalHeight) * 100);
        if (scrollPercent >= 25 && scrollPercent < 50) recordScrollDepth(25);
        if (scrollPercent >= 50 && scrollPercent < 75) recordScrollDepth(50);
        if (scrollPercent >= 75 && scrollPercent < 95) recordScrollDepth(75);
        if (scrollPercent >= 95) recordScrollDepth(100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate swap rate (1 BNB = ~287,500 GCNIO at simulated market depth)
  useEffect(() => {
    const val = parseFloat(swapBnb);
    if (!isNaN(val) && val > 0) {
      const rate = 287500;
      const result = val * rate;
      setSwapGcnio(result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    } else {
      setSwapGcnio("0.00");
    }
  }, [swapBnb]);

  const toggleTheme = () => {
    triggerToggleHaptic();
    const nextTheme = theme === "luxury-charcoal" ? "midnight-black" : "luxury-charcoal";
    setTheme(nextTheme);
    recordClick(`Theme switched to: ${nextTheme}`, "system");
  };

  const handleSimulateSwap = (e: FormEvent) => {
    e.preventDefault();
    if (parseFloat(swapBnb) <= 0 || isNaN(parseFloat(swapBnb))) return;

    triggerHapticFeedback();
    setSwapStatus("estimating");
    recordClick(`Swap simulation initiated: ${swapBnb} BNB`, "cta");

    setTimeout(() => {
      // Simulate successful blockchain receipt
      const hash = "0x" + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setSwapTxHash(hash);
      setSwapStatus("success");
      triggerSuccessHaptic();
    }, 1500);
  };

  const handleCloseSwapSuccess = () => {
    triggerToggleHaptic();
    setSwapStatus("idle");
    setSwapBnb("0.15");
  };

  const scrollToSection = (id: string) => {
    triggerHapticFeedback();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleExternalLink = (label: string, url: string) => {
    triggerHapticFeedback();
    recordClick(`External Link: ${label}`, "social");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className={`min-h-screen text-neutral-100 transition-colors duration-500 font-sans ${
        theme === "luxury-charcoal" 
          ? "bg-neutral-900" 
          : "bg-black"
      }`}
    >
      
      {/* 1. TOP STATUS & SYSTEM UTILITIES BAR */}
      <div className="bg-neutral-950 border-b border-neutral-800/80 sticky top-0 z-50 px-6 py-3.5 flex justify-between items-center backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => scrollToSection("hero-section")}>
            {/* Spinning Golden Coin in Header */}
            <GoldconioLogo size={24} className="animate-[spin_10s_linear_infinite]" />
            <span className="font-display font-bold tracking-wide text-sm hidden sm:inline-block">
              GOLDCONIO <span className="text-[#D4AF37] text-xs font-mono font-medium">(GCNIO)</span>
            </span>
          </div>

          {/* Offline/Online indicators */}
          <div className="flex items-center gap-1.5 ml-2">
            {isOnline ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                <Wifi className="h-3 w-3" />
                ONLINE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full animate-pulse">
                <WifiOff className="h-3 w-3" />
                OFFLINE MODE (CACHED)
              </span>
            )}
          </div>
        </div>

        {/* System Settings (Theme toggle, Admin quick access) */}
        <div className="flex items-center gap-3">
          
          {/* Quick theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 border border-neutral-800 hover:border-[#D4AF37]/20 rounded-xl text-neutral-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
            title="Toggle midnight dark vs charcoal dark theme"
          >
            {theme === "luxury-charcoal" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          {/* Quick metric statistics label for user confidence */}
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
            <Activity className="h-3.5 w-3.5 text-[#D4AF37] animate-pulse" />
            <span>2.8 SEC BLOCKS</span>
          </div>

        </div>
      </div>

      {/* OFFLINE FLOATING WARNING TO ENHANCE CACHE INTENT */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-950 border-b border-amber-500/20 px-6 py-2.5 text-center text-xs text-amber-300 font-mono flex items-center justify-center gap-2 relative z-30"
          >
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Disconnected from BSC RPC. Using stable local cache data logs. You can still audit metrics and simulate trades.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN SECTIONS WRAPPER */}
      <main className="relative pb-32">
        
        {/* HERO SECTION */}
        <Hero 
          onBuyClick={() => scrollToSection("swap-simulator-box")} 
          onChartClick={() => scrollToSection("contract-section")} 
        />

        {/* REAL-TIME PRICE TICKER */}
        <PriceTicker />

        {/* CONTRACT INFO BOX SECTION */}
        <ContractBox />

        {/* INTERACTIVE PANCAKESWAP SWAP SIMULATOR BLOCK */}
        <section id="swap-simulator-box" className="py-20 px-6 bg-neutral-900/40 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent" />
          
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-mono font-bold text-[#D4AF37] tracking-widest uppercase flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                SIMULATE TRADING & HOLDINGS
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-bold text-neutral-100 mt-2">
                Trading & Yield Estimator
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
                Simulate swapping BNB directly for Goldconio, track your portfolio valuation, and calculate reflection earnings in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-neutral-950 p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/20 shadow-2xl relative shadow-glow-gold flex flex-col justify-between"
              >
                <form onSubmit={handleSimulateSwap} className="space-y-5">
                  
                  {/* From input */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                    <div className="flex justify-between items-center text-xs text-neutral-500 font-mono mb-2">
                      <span>FROM (ESTIMATED SPEND)</span>
                      <span>BALANCE: 12.45 BNB</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={swapBnb}
                        onChange={(e) => setSwapBnb(e.target.value)}
                        className="bg-transparent text-2xl font-bold font-sans text-neutral-100 focus:outline-none w-full"
                      />
                      <span className="bg-neutral-950 px-3.5 py-1.5 rounded-lg border border-neutral-800 text-xs font-mono text-neutral-300 font-bold shrink-0">
                        BNB
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center -my-3 relative z-10">
                    <div className="h-9 w-9 bg-[#D4AF37] border border-[#D4AF37]/40 rounded-xl flex items-center justify-center text-black shadow-md">
                      <RefreshCw className="h-4 w-4 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* To output */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                    <div className="flex justify-between items-center text-xs text-neutral-500 font-mono mb-2">
                      <span>TO (ESTIMATED RECEIPT)</span>
                      <span className="text-[#D4AF37] font-semibold">REFLECTIONS ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-2xl font-bold font-sans text-[#D4AF37] text-glow-gold truncate">
                        {swapGcnio}
                      </span>
                      <span className="bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] font-bold shrink-0">
                        GCNIO
                      </span>
                    </div>
                  </div>

                  {/* Swap taxes info */}
                  <div className="space-y-1.5 bg-neutral-900/40 p-3.5 rounded-xl border border-neutral-800 text-[11px] font-mono text-neutral-400">
                    <div className="flex justify-between">
                      <span>Minimum received after tax</span>
                      <span className="text-neutral-300">{(parseFloat(swapBnb) * 258750 || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })} GCNIO (10% Tax)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slippage Tolerance</span>
                      <span className="text-[#D4AF37] font-semibold">11.00% (Auto)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PancakeSwap Liquidity Pool</span>
                      <span className="text-green-400">Secure (Locked)</span>
                    </div>
                  </div>

                  {/* Swap button */}
                  <button
                    type="submit"
                    disabled={swapStatus === "estimating"}
                    className={`w-full py-4 rounded-xl font-sans font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                      swapStatus === "estimating"
                        ? "bg-neutral-800 text-neutral-500 cursor-wait"
                        : "bg-[#D4AF37] hover:bg-[#F9E29C] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-[1.01] active:scale-[0.99]"
                    }`}
                  >
                    {swapStatus === "estimating" ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Estimating BSC gas limits...
                      </>
                    ) : (
                      <>
                        Simulate Swap (PancakeSwap)
                        <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>

                </form>

                {/* Transaction success sub-modal */}
                <AnimatePresence>
                  {swapStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 bg-neutral-950/95 rounded-2xl p-6 flex flex-col items-center justify-center text-center z-20 border border-green-500/30"
                    >
                      <div className="h-14 w-14 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-4 text-green-400">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-sans font-bold text-neutral-100">
                        Simulated Transaction Confirmed
                      </h3>
                      <p className="text-neutral-400 text-xs max-w-sm mt-1 mb-6">
                        Your swap was processed on the simulated testnet. GCNIO reflections are now accumulating locally!
                      </p>

                      <div className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 mb-6 space-y-1.5 text-left font-mono text-[10px] text-neutral-400">
                        <div className="flex justify-between">
                          <span>Status</span>
                          <span className="text-green-400 font-bold">Success (Confirmed)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Swapped</span>
                          <span className="text-neutral-200">{swapBnb} BNB for {swapGcnio} GCNIO</span>
                        </div>
                        <div className="block truncate">
                          <span>TxHash</span>
                          <span className="text-[#D4AF37] block truncate mt-0.5">{swapTxHash}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[280px]">
                        <button
                          onClick={() => {
                            window.open("https://pancakeswap.finance/swap?chain=bsc&inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x5C7e2fBf5803938b99191387465E95E70Ab552D7&exactAmount=&exactField=INPUT", "_blank");
                          }}
                          className="w-full bg-[#D4AF37] hover:bg-[#F9E29C] text-black font-bold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          Trade on PancakeSwap
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={handleCloseSwapSuccess}
                          className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Process Another Swap
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>

              {/* HOLDINGS CALCULATOR COMPONENT */}
              <HoldingsCalculator initialBalance={swapStatus === "success" ? swapGcnio.replace(/,/g, "") : "100000"} />
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <About />

        {/* ROADMAP SECTION */}
        <Roadmap />

        {/* FAQ SECTION */}
        <FAQ />

        {/* ECOSYSTEM LINKS SECTION */}
        <Ecosystem 
          onBuyClick={() => scrollToSection("swap-simulator-box")} 
          onChartClick={() => scrollToSection("contract-section")} 
        />

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-neutral-950 border-t border-neutral-800/80 py-16 px-6 relative z-10 text-center sm:text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Logo brand & description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#8a6d1e] to-[#D4AF37] border border-[#D4AF37] flex items-center justify-center text-[11px] text-neutral-950 font-bold">
                G
              </span>
              <span className="font-display font-bold tracking-wide text-neutral-100 text-sm">
                GOLDCONIO (GCNIO)
              </span>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed max-w-sm">
              The premium, verified wealth preservation protocol on the Binance Smart Chain. Fusing classical gold values with state-of-the-art decentralized reflections.
            </p>
          </div>

          {/* Social media connections */}
          <div className="md:col-span-4 flex flex-col items-center sm:items-start gap-3">
            <span className="text-[10px] font-mono font-bold text-neutral-500 tracking-wider uppercase">
              Join GCNIO Communities
            </span>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleExternalLink("Twitter", "https://x.com")}
                className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/20 text-neutral-400 hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                title="Follow Goldconio on Twitter / X"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleExternalLink("Instagram", "https://www.instagram.com/goldconio/")}
                className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/20 text-neutral-400 hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                title="Follow Goldconio on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleExternalLink("Facebook", "https://www.facebook.com/goldconio/")}
                className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/20 text-neutral-400 hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                title="Follow Goldconio on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleExternalLink("Telegram", "https://telegram.org")}
                className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/20 text-neutral-400 hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                title="Join Goldconio Telegram Channel"
              >
                <Send className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleExternalLink("Discord", "https://discord.com")}
                className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/20 text-neutral-400 hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                title="Join Goldconio Discord Community"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleExternalLink("GitHub", "https://github.com/goldconio/goldconioprotocol")}
                className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/20 text-neutral-400 hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                title="View Open Source Code"
              >
                <Github className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleExternalLink("OpenSea", "https://opensea.io/collection/goldconio")}
                className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/20 text-neutral-400 hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                title="View Goldconio on OpenSea"
              >
                <Image className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Copyright details */}
          <div className="md:col-span-3 flex flex-col items-center sm:items-end gap-1 font-mono text-[10px] text-neutral-500">
            <span>&copy; 2026 Goldconio Token Campaign.</span>
            <span>All rights reserved.</span>
            <span className="text-[#D4AF37]/50 mt-1">BSC CONTRACT STANDARDS</span>
          </div>

        </div>

        {/* Dynamic standard Crypto Disclaimer statement */}
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-neutral-900 text-center text-[10px] font-sans text-neutral-600 leading-relaxed max-w-4xl mx-auto">
          <strong>Risk Disclaimer:</strong> Cryptocurrency trading, investing, and holding involve significant capital risk. Goldconio (GCNIO) is a decentralized smart contract token. Reflections, taxes, burn mechanisms, and liquidity pool locks are programmed variables inside open-source code on the Binance Smart Chain. Always perform your own research (DYOR) and audit secure logs before swapping capital. This page serves solely as a mock-informational landing and trade simulator platform.
        </div>
      </footer>

      {/* 2. PERSISTENT NAVIGATION BOTTOM BAR WITH AUTO-HIDE SCROLL */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAdminClick={() => {
          triggerHapticFeedback();
          setIsAdminOpen(true);
        }}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* 3. SECURE AUTHENTICATED ADMINISTRATOR ANALYTICS PANEL */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />

    </div>
  );
}
