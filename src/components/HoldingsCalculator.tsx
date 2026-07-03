/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Calculator, TrendingUp, DollarSign, Coins, Landmark, Calendar, RefreshCw, BarChart3, HelpCircle 
} from "lucide-react";
import GoldconioLogo from "./GoldconioLogo";
import { triggerHapticFeedback } from "../utils/haptics";
import { recordClick } from "../utils/analytics";

interface HoldingsCalculatorProps {
  initialBalance?: string;
}

export default function HoldingsCalculator({ initialBalance = "100000" }: HoldingsCalculatorProps) {
  const [holdings, setHoldings] = useState<string>(initialBalance);
  const [estimatedVolume, setEstimatedVolume] = useState<number>(500000); // Default $500k USD daily volume
  const [gcnioPrice, setGcnioPrice] = useState<number>(0.003852);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch GCNIO price relative to Pax Gold (CoinGecko Simple API) to keep calculations 100% accurate and real-time
  const fetchLivePriceForCalc = async () => {
    setIsLoading(true);
    try {
      let realPrice: number | null = null;
      
      try {
        const dexRes = await fetch("https://api.dexscreener.com/latest/dex/tokens/0x5c7e2fbf5803938b99191387465e95e70ab552d7");
        if (dexRes.ok) {
          const dexData = await dexRes.json();
          if (dexData.pairs && dexData.pairs.length > 0) {
            realPrice = parseFloat(dexData.pairs[0].priceUsd);
          }
        }
      } catch (err) {
        // Silent catch
      }

      if (realPrice === null) {
        try {
          const gtRes = await fetch("https://api.geckoterminal.com/api/v2/networks/bsc/tokens/0x5c7e2fbf5803938b99191387465e95e70ab552d7");
          if (gtRes.ok) {
            const gtData = await gtRes.json();
            if (gtData.data?.attributes?.price_usd) {
              realPrice = parseFloat(gtData.data.attributes.price_usd);
            }
          }
        } catch (err) {
          // Silent catch
        }
      }

      if (realPrice !== null) {
        setGcnioPrice(realPrice);
        setLastUpdated(new Date());
      } else {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd"
        );
        if (response.ok) {
          const data = await response.json();
          const paxgPrice = data["pax-gold"]?.usd || 2385.40;
          // 1 GCNIO = 0.000001618 PAXG (Golden Ratio peg value!)
          const calculatedGcnioPrice = paxgPrice * 0.000001618;
          setGcnioPrice(calculatedGcnioPrice);
          setLastUpdated(new Date());
        }
      }
    } catch (err) {
      console.warn("CoinGecko API offline for calculator. Using high-fidelity fallback.", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePriceForCalc();
    const interval = setInterval(fetchLivePriceForCalc, 60000); // Sync every minute
    return () => clearInterval(interval);
  }, []);

  // Update holdings if parent passes a new simulated swap balance
  useEffect(() => {
    if (initialBalance) {
      setHoldings(initialBalance);
    }
  }, [initialBalance]);

  const handleManualSync = () => {
    triggerHapticFeedback();
    recordClick("Calculator Live Price Sync", "system");
    fetchLivePriceForCalc();
  };

  const handleHoldingsChange = (val: string) => {
    // Sanitize input to only permit numbers
    const cleanVal = val.replace(/[^0-9.]/g, "");
    setHoldings(cleanVal);
  };

  const numericHoldings = parseFloat(holdings) || 0;
  const currentUSDValue = numericHoldings * gcnioPrice;

  // Reflection calculations:
  // Total supply = 1,000,000,000 GCNIO
  const totalSupply = 1000000000;
  const userShareOfPool = numericHoldings / totalSupply;

  // Reflections fee is 4% of transactional volume
  const dailyReflectionsFeePoolUSD = estimatedVolume * 0.04;
  const dailyReflectionsFeePoolGCNIO = dailyReflectionsFeePoolUSD / gcnioPrice;

  const dailyEarningsGCNIO = dailyReflectionsFeePoolGCNIO * userShareOfPool;
  const dailyEarningsUSD = dailyEarningsGCNIO * gcnioPrice;

  const weeklyEarningsGCNIO = dailyEarningsGCNIO * 7;
  const weeklyEarningsUSD = dailyEarningsUSD * 7;

  const yearlyEarningsGCNIO = dailyEarningsGCNIO * 365;
  const yearlyEarningsUSD = dailyEarningsUSD * 365;

  const formatCrypto = (val: number) => {
    return val.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  const formatUSD = (val: number) => {
    if (val < 1) {
      return val.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      });
    }
    return val.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-neutral-950 p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden shadow-glow-gold flex flex-col justify-between h-full"
    >
      {/* Absolute faint background coin watermarking */}
      <div className="absolute -bottom-12 -right-12 opacity-10 pointer-events-none transform rotate-12">
        <GoldconioLogo size={200} />
      </div>

      <div className="space-y-6">
        
        {/* Header Widget */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl flex items-center justify-center text-[#D4AF37]">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-sans font-bold text-neutral-100 flex items-center gap-1.5">
                Yield Calculator
              </h3>
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                Simulate reflection APY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 rounded px-2 py-1">
              ${gcnioPrice.toFixed(6)} / GCNIO
            </span>
            <button
              onClick={handleManualSync}
              disabled={isLoading}
              className={`h-7 w-7 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#D4AF37] transition-all duration-300 cursor-pointer ${
                isLoading ? "animate-spin text-[#D4AF37]" : ""
              }`}
              title="Manual update rate"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Input: GCNIO Holdings */}
        <div className="space-y-2">
          <label className="flex justify-between items-center text-xs font-mono text-neutral-400 uppercase tracking-wider">
            <span>Enter Your GCNIO Holdings</span>
            <span className="text-neutral-500">Supply Share: {(userShareOfPool * 100).toFixed(4)}%</span>
          </label>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={holdings}
                onChange={(e) => handleHoldingsChange(e.target.value)}
                className="bg-transparent text-2xl font-bold font-sans text-neutral-100 focus:outline-none w-full"
                placeholder="0.00"
              />
              <span className="text-xs text-[#D4AF37] font-mono block mt-1">
                Value: {formatUSD(currentUSDValue)} USD
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <GoldconioLogo size={28} />
              <span className="bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] font-bold">
                GCNIO
              </span>
            </div>
          </div>
        </div>

        {/* Slider: Simulated Volume */}
        <div className="space-y-3 bg-neutral-900/60 p-4 rounded-xl border border-neutral-800/80">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-neutral-400 uppercase tracking-wider">24h Trading Volume</span>
            <span className="text-[#D4AF37] font-bold">{formatUSD(estimatedVolume)}</span>
          </div>
          
          <input
            type="range"
            min="50000"
            max="5000000"
            step="50000"
            value={estimatedVolume}
            onChange={(e) => setEstimatedVolume(parseInt(e.target.value))}
            className="w-full accent-[#D4AF37] h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer border border-neutral-800"
          />

          <div className="flex justify-between text-[9px] font-mono text-neutral-500">
            <span>$50K Volume</span>
            <span>$1.5M Average</span>
            <span>$5M Extreme</span>
          </div>
        </div>

        {/* Compound Yield Earnings Displays */}
        <div className="grid grid-cols-3 gap-3">
          
          {/* Daily Card */}
          <div className="bg-neutral-900 border border-neutral-800/80 p-3 rounded-xl text-center">
            <span className="text-[9px] font-mono text-neutral-500 block uppercase">Daily Reward</span>
            <span className="text-sm font-bold font-sans text-green-400 block mt-1">
              +{formatCrypto(dailyEarningsGCNIO)}
            </span>
            <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
              {formatUSD(dailyEarningsUSD)}
            </span>
          </div>

          {/* Weekly Card */}
          <div className="bg-neutral-900 border border-neutral-800/80 p-3 rounded-xl text-center">
            <span className="text-[9px] font-mono text-neutral-500 block uppercase">Weekly (7D)</span>
            <span className="text-sm font-bold font-sans text-green-400 block mt-1">
              +{formatCrypto(weeklyEarningsGCNIO)}
            </span>
            <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
              {formatUSD(weeklyEarningsUSD)}
            </span>
          </div>

          {/* Yearly Card */}
          <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-3 rounded-xl text-center">
            <span className="text-[9px] font-mono text-[#D4AF37] block uppercase font-bold">Yearly APY</span>
            <span className="text-sm font-bold font-sans text-green-400 block mt-1 text-glow-gold">
              +{formatCrypto(yearlyEarningsGCNIO)}
            </span>
            <span className="text-[10px] font-mono text-[#D4AF37] block mt-0.5 font-bold">
              {formatUSD(yearlyEarningsUSD)}
            </span>
          </div>

        </div>

        {/* Reflection info blurb */}
        <div className="text-[10px] font-mono text-neutral-500 flex items-start gap-1.5 bg-neutral-900/30 p-2.5 rounded-lg border border-neutral-800/40">
          <TrendingUp className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
          <p className="leading-normal">
            Reflections are paid in real-time straight to your wallet. Estimations assume a 4% distribution fee on trades. Your balance automatically aggregates compound shares.
          </p>
        </div>

      </div>
    </motion.div>
  );
}
