/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, TrendingUp, Coins, ChevronDown, Award } from "lucide-react";
import { triggerHapticFeedback } from "../utils/haptics";
import { recordClick } from "../utils/analytics";
import GoldconioLogo from "./GoldconioLogo";

interface HeroProps {
  onBuyClick: () => void;
  onChartClick: () => void;
}

export default function Hero({ onBuyClick, onChartClick }: HeroProps) {
  const [price, setPrice] = useState(0.003852);
  const [priceChange, setPriceChange] = useState(14.85);
  const [isPriceUp, setIsPriceUp] = useState(true);

  // Simulate premium real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 0.00003; // Slightly upward bias
      const newPrice = Math.max(0.001, price + delta);
      
      const changeDelta = (Math.random() - 0.5) * 0.1;
      const newChange = priceChange + changeDelta;

      setPrice(newPrice);
      setPriceChange(Math.max(1, newChange));
      setIsPriceUp(delta >= 0);
    }, 4500);

    return () => clearInterval(interval);
  }, [price, priceChange]);

  const handleCTA = (label: string, callback: () => void) => {
    triggerHapticFeedback();
    recordClick(label, "cta");
    callback();
  };

  return (
    <section id="hero-section" className="relative min-h-screen pt-28 pb-16 px-6 flex flex-col items-center justify-center overflow-hidden bg-radial-gradient">
      {/* Absolute Gold Glow Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Verification & Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-neutral-900/90 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 mb-8 shadow-glow-gold"
        >
          <Award className="h-4 w-4 text-[#D4AF37] animate-pulse" />
          <span className="text-xs font-mono tracking-wider text-[#D4AF37] font-medium">
            BSC VERIFIED ASSET • AUDITED BY SOLIDITYSEC
          </span>
        </motion.div>

        {/* Catchy headline with golden glow */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-neutral-100 leading-[1.1] mb-6"
        >
          Digital Wealth <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#D4AF37] text-glow-gold">
            Reimagined in Gold
          </span>
        </motion.h1>

        {/* Subheadline with high-contrast text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg text-neutral-400 max-w-2xl mb-10 leading-relaxed"
        >
          <span className="font-semibold text-neutral-200">Goldconio (GCNIO)</span> is the premier luxury store of value on the Binance Smart Chain. Fusing hard-asset philosophy with lightning-fast transactional velocity, GCNIO offers smart reflections and locked liquidity.
        </motion.p>

        {/* Interactive Glowing 3D Gold Coin Representing Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          className="relative w-52 h-52 mb-12 group cursor-pointer flex items-center justify-center"
          onClick={() => {
            triggerHapticFeedback();
            recordClick("Interactive golden coin spun", "system");
          }}
        >
          {/* Animated Super Glow Rings */}
          <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-3xl group-hover:bg-[#D4AF37]/40 transition-all duration-700 animate-pulse" />
          <div className="absolute -inset-10 rounded-full bg-[#FFF2B2]/5 blur-2xl animate-[spin_4s_linear_infinite]" />
          <div className="absolute -inset-4 rounded-full border-[1.5px] border-dashed border-[#D4AF37]/30 scale-90 group-hover:scale-110 group-hover:border-[#D4AF37]/60 group-hover:rotate-45 transition-all duration-700 pointer-events-none" />
          <div className="absolute -inset-8 rounded-full border border-[#D4AF37]/10 scale-90 group-hover:scale-105 group-hover:border-[#D4AF37]/25 transition-all duration-700 pointer-events-none animate-[spin_10s_linear_infinite]" />
          
          {/* Main Gold Coin Body */}
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="w-36 h-36 flex items-center justify-center shadow-[0_0_80px_rgba(212,175,55,0.6)] group-hover:shadow-[0_0_120px_rgba(255,242,178,0.8)] rounded-full relative transition-shadow duration-500"
          >
            <GoldconioLogo size={144} className="hover:scale-110 transition-transform duration-300" />
          </motion.div>
        </motion.div>

        {/* Real-time Dynamic Ticker Tapes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 items-center mb-12 font-mono text-sm bg-neutral-900/60 border border-neutral-800/80 px-6 py-3 rounded-2xl max-w-lg"
        >
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-neutral-400">GCNIO Price:</span>
            <span className="text-neutral-100 font-bold transition-all duration-300">
              ${price.toFixed(6)}
            </span>
          </div>
          <div className="h-4 w-px bg-neutral-800 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <TrendingUp className={`h-4 w-4 ${isPriceUp ? "text-green-400 animate-bounce" : "text-[#D4AF37]"}`} />
            <span className="text-neutral-400">24h Change:</span>
            <span className={`font-bold ${isPriceUp ? "text-green-400" : "text-[#D4AF37]"}`}>
              +{priceChange.toFixed(2)}%
            </span>
          </div>
        </motion.div>

        {/* Call-to-Action Buttons (Neon Gold theme) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center"
        >
          {/* Primary Button: Neon Gold High Contrast */}
          <button
            id="hero-buy-btn"
            onClick={() => handleCTA("Hero CTA: Buy on PancakeSwap", onBuyClick)}
            className="group relative flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#F9E29C] text-black font-sans font-bold text-base px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            Buy on PancakeSwap
            <ArrowUpRight className="h-5 w-5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Secondary Button: Premium Glass Outline */}
          <button
            id="hero-chart-btn"
            onClick={() => handleCTA("Hero CTA: Live Chart", onChartClick)}
            className="group flex items-center justify-center gap-2 bg-neutral-900/80 hover:bg-neutral-800 text-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37]/80 font-sans font-semibold text-base px-8 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Live Chart
            <TrendingUp className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-20 flex flex-col items-center gap-1.5 text-neutral-500 hover:text-[#D4AF37] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            triggerHapticFeedback();
            document.getElementById("contract-section")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">Explore Ecosystem</span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>

      </div>
    </section>
  );
}
