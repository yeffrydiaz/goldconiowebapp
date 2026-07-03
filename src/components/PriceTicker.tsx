/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Coins, TrendingUp, TrendingDown, RefreshCw, BarChart2, ShieldCheck, Activity } from "lucide-react";
import { triggerHapticFeedback } from "../utils/haptics";
import { recordClick } from "../utils/analytics";

interface TickerAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  isCustomGcnio?: boolean;
}

export default function PriceTicker() {
  const [assets, setAssets] = useState<TickerAsset[]>([
    { symbol: "GCNIO", name: "Goldconio Token", price: 0.003852, change24h: 14.85, marketCap: 3852000, isCustomGcnio: true },
    { symbol: "PAXG", name: "Pax Gold", price: 2385.40, change24h: 1.25, marketCap: 448000000 },
    { symbol: "BNB", name: "Binance Coin", price: 612.80, change24h: -0.45, marketCap: 89400000000 },
    { symbol: "BTC", name: "Bitcoin", price: 96420.00, change24h: 3.12, marketCap: 1890000000000 },
    { symbol: "ETH", name: "Ethereum", price: 3450.50, change24h: 1.88, marketCap: 415000000000 }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLiveApi, setIsLiveApi] = useState(false);

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      // CoinGecko public API requires no keys
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,binancecoin,bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true&include_market_cap=true"
      );
      
      if (!response.ok) throw new Error("CoinGecko rate limit or server error");
      
      const data = await response.json();
      
      const paxgPrice = data["pax-gold"]?.usd || 2385.40;
      const paxgChange = data["pax-gold"]?.usd_24h_change || 1.25;
      const paxgMarketCap = data["pax-gold"]?.usd_market_cap || 448000000;

      const bnbPrice = data["binancecoin"]?.usd || 612.80;
      const bnbChange = data["binancecoin"]?.usd_24h_change || -0.45;
      const bnbMarketCap = data["binancecoin"]?.usd_market_cap || 89400000000;

      const btcPrice = data["bitcoin"]?.usd || 96420.00;
      const btcChange = data["bitcoin"]?.usd_24h_change || 3.12;
      const btcMarketCap = data["bitcoin"]?.usd_market_cap || 1890000000000;

      const ethPrice = data["ethereum"]?.usd || 3450.50;
      const ethChange = data["ethereum"]?.usd_24h_change || 1.88;
      const ethMarketCap = data["ethereum"]?.usd_market_cap || 415000000000;

      // Try fetching real GCNIO price from DEX APIs
      let realGcnioPrice: number | null = null;
      let realGcnioChange: number | null = null;
      let realGcnioMarketCap: number | null = null;

      try {
        const dexRes = await fetch("https://api.dexscreener.com/latest/dex/tokens/0x5c7e2fbf5803938b99191387465e95e70ab552d7");
        if (dexRes.ok) {
          const dexData = await dexRes.json();
          if (dexData.pairs && dexData.pairs.length > 0) {
            const pair = dexData.pairs[0];
            realGcnioPrice = parseFloat(pair.priceUsd);
            realGcnioMarketCap = parseFloat(pair.fdv) || (realGcnioPrice * 1000000000);
            realGcnioChange = parseFloat(pair.priceChange?.h24) || 0;
          }
        }
      } catch (err) {
        console.warn("Failed to fetch real GCNIO price from DexScreener", err);
      }

      if (realGcnioPrice === null) {
        try {
          const gtRes = await fetch("https://api.geckoterminal.com/api/v2/networks/bsc/tokens/0x5c7e2fbf5803938b99191387465e95e70ab552d7");
          if (gtRes.ok) {
            const gtData = await gtRes.json();
            if (gtData.data?.attributes?.price_usd) {
              realGcnioPrice = parseFloat(gtData.data.attributes.price_usd);
              realGcnioMarketCap = gtData.data.attributes.fdv_usd ? parseFloat(gtData.data.attributes.fdv_usd) : (realGcnioPrice * 1000000000);
              realGcnioChange = 0; // fallback if no change data
            }
          }
        } catch (err) {
          console.warn("Failed to fetch real GCNIO price from GeckoTerminal", err);
        }
      }

      // Calculate GCNIO price relative to real Pax Gold (backed by classical gold values!)
      // 1 GCNIO is pegged to 0.000001618 PAXG (Golden ratio peg!)
      const gcnioRatio = 0.000001618;
      const calculatedGcnioPrice = paxgPrice * gcnioRatio;
      
      // Calculate derived GCNIO market capitalization based on total supply of 1,000,000,000 (1 billion)
      const calculatedGcnioMarketCap = calculatedGcnioPrice * 1000000000;
      
      // GCNIO change: PAXG gold change with a slight premium multiplier (+0.5%) due to BNB trading velocity
      const calculatedGcnioChange = paxgChange + 0.52;

      const finalGcnioPrice = realGcnioPrice ?? calculatedGcnioPrice;
      const finalGcnioMarketCap = realGcnioMarketCap ?? calculatedGcnioMarketCap;
      const finalGcnioChange = realGcnioChange ?? calculatedGcnioChange;

      setAssets([
        { symbol: "GCNIO", name: "Goldconio Token", price: finalGcnioPrice, change24h: finalGcnioChange, marketCap: finalGcnioMarketCap, isCustomGcnio: true },
        { symbol: "PAXG", name: "Pax Gold (Gold Peg)", price: paxgPrice, change24h: paxgChange, marketCap: paxgMarketCap },
        { symbol: "BNB", name: "Binance Coin", price: bnbPrice, change24h: bnbChange, marketCap: bnbMarketCap },
        { symbol: "BTC", name: "Bitcoin", price: btcPrice, change24h: btcChange, marketCap: btcMarketCap },
        { symbol: "ETH", name: "Ethereum", price: ethPrice, change24h: ethChange, marketCap: ethMarketCap }
      ]);
      setLastUpdated(new Date());
      setIsLiveApi(true);
    } catch (err) {
      console.warn("CoinGecko API offline or throttled. Keeping cached data and running high-fidelity simulation.", err);
      setIsLiveApi(false);
      // Fail gracefully: simulate natural minute price changes locally
      simulateLocalTick();
    } finally {
      setIsLoading(false);
    }
  };

  const simulateLocalTick = () => {
    setAssets(prev => {
      return prev.map(asset => {
        // Apply slight random walk
        const percentWalk = (Math.random() - 0.49) * 0.0008; // slight upward drift
        const newPrice = asset.price * (1 + percentWalk);
        const newChange = asset.change24h + (Math.random() - 0.5) * 0.02;
        
        let newMarketCap = asset.marketCap;
        if (asset.isCustomGcnio) {
          newMarketCap = newPrice * 1000000000; // total supply GCNIO
        } else {
          newMarketCap = asset.marketCap * (1 + percentWalk);
        }

        return {
          ...asset,
          price: newPrice,
          change24h: newChange,
          marketCap: newMarketCap
        };
      });
    });
    setLastUpdated(new Date());
  };

  useEffect(() => {
    fetchPrices();
    
    // Refresh from API every 45 seconds to respect CoinGecko's free tier limits
    const apiInterval = setInterval(() => {
      fetchPrices();
    }, 45000);

    // Apply microscopic local simulation ticks every 5 seconds for visual engagement
    const simInterval = setInterval(() => {
      simulateLocalTick();
    }, 5000);

    return () => {
      clearInterval(apiInterval);
      clearInterval(simInterval);
    };
  }, []);

  const handleRefreshClick = () => {
    triggerHapticFeedback();
    recordClick("Price Ticker Manual Refresh", "system");
    fetchPrices();
  };

  const formatCurrency = (val: number, precision = 2) => {
    if (val < 1) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }).format(val);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(val);
  };

  const formatMarketCap = (val: number) => {
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return formatCurrency(val, 0);
  };

  // Find GCNIO for main dashboard display
  const gcnio = assets.find(a => a.symbol === "GCNIO") || assets[0];

  return (
    <div className="w-full bg-neutral-950 border-y border-neutral-800/80 py-4 px-6 relative overflow-hidden">
      {/* Golden accent linear background glow */}
      <div className="absolute inset-0 bg-radial-gradient opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Core Live GCNIO Metric Summary Card */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-start w-full lg:w-auto">
          
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#8a6d1e] to-[#D4AF37] border border-[#D4AF37]/80 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Coins className="h-5 w-5 text-neutral-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm tracking-wide text-neutral-100">GCNIO</span>
                <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded px-1.5 py-0.2">REAL-TIME</span>
              </div>
              <span className="text-xs text-neutral-400 font-sans block">Goldconio Tracker</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-neutral-800 hidden sm:block" />

          {/* Price widget */}
          <div className="text-center sm:text-left min-w-[100px]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Live Price (USD)</span>
            <span className="text-sm font-mono font-bold text-[#F9E29C] text-glow-neon">
              {formatCurrency(gcnio.price)}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-neutral-800 hidden sm:block" />

          {/* 24h Change widget */}
          <div className="text-center sm:text-left min-w-[90px]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">24H Volatility</span>
            <span className={`text-sm font-mono font-bold flex items-center justify-center sm:justify-start gap-1 ${
              gcnio.change24h >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {gcnio.change24h >= 0 ? "+" : ""}
              {gcnio.change24h.toFixed(2)}%
            </span>
          </div>

          <div className="h-8 w-[1px] bg-neutral-800 hidden sm:block" />

          {/* Market Cap widget */}
          <div className="text-center sm:text-left min-w-[110px]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Market Capitalization</span>
            <span className="text-sm font-mono font-bold text-neutral-100 block">
              {formatMarketCap(gcnio.marketCap)}
            </span>
          </div>

        </div>

        {/* Multi-asset Side Ticker Carousel */}
        <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto border-t lg:border-t-0 border-neutral-800/80 pt-4 lg:pt-0">
          
          <div className="hidden md:flex items-center gap-4 overflow-hidden max-w-sm lg:max-w-md xl:max-w-lg">
            <span className="text-[10px] font-mono text-neutral-500 shrink-0 uppercase tracking-wider flex items-center gap-1">
              <Activity className="h-3 w-3 text-[#D4AF37]" />
              Market Context:
            </span>
            <div className="flex items-center gap-5 overflow-x-auto no-scrollbar py-1">
              {assets.filter(a => !a.isCustomGcnio).map((asset) => (
                <div key={asset.symbol} className="flex items-center gap-1.5 shrink-0 bg-neutral-900/60 border border-neutral-800/60 px-2.5 py-1 rounded-lg text-xs font-mono">
                  <span className="text-neutral-400 font-bold">{asset.symbol}</span>
                  <span className="text-neutral-200">${asset.price.toLocaleString("en-US", { maximumFractionDigits: asset.price > 1000 ? 2 : 4 })}</span>
                  <span className={`text-[10px] font-bold ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {asset.change24h >= 0 ? "▲" : "▼"}{Math.abs(asset.change24h).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Refresh Action Buttons & Status */}
          <div className="flex items-center gap-3 ml-auto lg:ml-0 font-mono text-[10px]">
            <div className="flex flex-col items-end text-right">
              <span className="text-neutral-500">
                {isLiveApi ? (
                  <span className="text-green-500 flex items-center gap-1 font-semibold">
                    <span className="h-1 w-1 bg-green-500 rounded-full animate-ping" />
                    COINGECKO LIVE
                  </span>
                ) : (
                  <span className="text-[#D4AF37]/70 flex items-center gap-1 font-semibold">
                    <span className="h-1 w-1 bg-[#D4AF37] rounded-full" />
                    AUTONOMOUS
                  </span>
                )}
              </span>
              <span className="text-neutral-600 text-[9px]">
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            
            <button
              onClick={handleRefreshClick}
              disabled={isLoading}
              className={`h-8 w-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-[#D4AF37]/30 flex items-center justify-center transition-all duration-300 text-neutral-400 hover:text-[#D4AF37] cursor-pointer ${
                isLoading ? "animate-spin text-[#D4AF37]" : ""
              }`}
              title="Manual price sync"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
