/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Link2, LineChart, RefreshCw, Layers, ArrowUpRight, CheckCircle2, Image } from "lucide-react";
import { triggerHapticFeedback } from "../utils/haptics";
import { recordClick } from "../utils/analytics";

interface EcosystemProps {
  onBuyClick: () => void;
  onChartClick: () => void;
}

export default function Ecosystem({ onBuyClick, onChartClick }: EcosystemProps) {
  const contractAddress = "0x5c7e2fbf5803938b99191387465e95e70ab552d7";
  const bscScanUrl = `https://bscscan.com/address/${contractAddress}`;
  const pooCoinUrl = `https://poocoin.app/tokens/${contractAddress}`;
  const openSeaUrl = `https://opensea.io/collection/goldconio`;
  
  const ecosystemLinks = [
    {
      id: "pancakeswap",
      title: "PancakeSwap Exchange",
      icon: RefreshCw,
      desc: "Swap BNB or BUSD directly for GCNIO. Automated Market Maker liquidity is locked permanently with secure LP tokens burned.",
      btnText: "Trade GCNIO Pool",
      action: onBuyClick,
      badge: "Fastest Swapping",
      color: "border-[#D4AF37]/20 hover:border-[#D4AF37]/60"
    },
    {
      id: "poocoin",
      title: "PooCoin Live Charting",
      icon: LineChart,
      desc: "View direct real-time price candlesticks, decentralized order history, wallet transactions, and historical buyer metrics.",
      btnText: "Open PooCoin Chart",
      action: () => {
        triggerHapticFeedback();
        recordClick("Ecosystem Card: PooCoin", "ecosystem");
        window.open(pooCoinUrl, "_blank", "noopener,noreferrer");
      },
      badge: "Real-time Metrics",
      color: "border-[#D4AF37]/20 hover:border-[#D4AF37]/60"
    },
    {
      id: "bscscan",
      title: "BscScan Tracker",
      icon: Link2,
      desc: "Audit our fully verified token code, inspect block confirmations, current wallet holder distribution ratios, and transaction gas logs.",
      btnText: "View on BscScan",
      action: () => {
        triggerHapticFeedback();
        recordClick("Ecosystem Card: BscScan", "ecosystem");
        window.open(bscScanUrl, "_blank", "noopener,noreferrer");
      },
      badge: "Verified Explorer",
      color: "border-[#D4AF37]/20 hover:border-[#D4AF37]/60"
    },
    {
      id: "opensea",
      title: "OpenSea Collection",
      icon: Image,
      desc: "Explore, buy, and sell exclusive Goldconio digital assets and NFTs on the world's premier decentralized marketplace.",
      btnText: "View on OpenSea",
      action: () => {
        triggerHapticFeedback();
        recordClick("Ecosystem Card: OpenSea", "ecosystem");
        window.open(openSeaUrl, "_blank", "noopener,noreferrer");
      },
      badge: "NFT Marketplace",
      color: "border-[#D4AF37]/20 hover:border-[#D4AF37]/60"
    }
  ];

  return (
    <section id="ecosystem-section" className="py-24 px-6 bg-neutral-950 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-[#D4AF37] tracking-widest uppercase">
            CONNECTIVITY HUB
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-100 mt-2">
            The Goldconio Ecosystem
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-3">
            Securely trade, audit, and chart Goldconio across key decentralized finance (DeFi) networks.
          </p>
        </div>

        {/* Clean responsive card layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {ecosystemLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`flex flex-col bg-neutral-900/40 rounded-2xl p-6 sm:p-8 border ${link.color} transition-all duration-300 relative group overflow-hidden shadow-glow-gold-hover`}
              >
                {/* Decorative glow badge */}
                <div className="absolute top-4 right-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-2.5 py-0.5 text-[10px] font-mono text-[#D4AF37]">
                  {link.badge}
                </div>

                <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-6 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-neutral-950 transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-display font-bold text-neutral-100 mb-3 group-hover:text-[#D4AF37] transition-colors">
                  {link.title}
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed mb-8 flex-grow">
                  {link.desc}
                </p>

                <button
                  onClick={link.action}
                  className="w-full bg-neutral-950 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/20 hover:border-[#D4AF37] py-3.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
                >
                  {link.btnText}
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Audit Status strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200">Continuous Security Verifications</h4>
              <p className="text-xs text-neutral-500">Contract audit rating 9.8/10. Liquidity is locked for 5 years.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-xs font-mono text-neutral-400 bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded">
              SOLIDITYSEC: PASSED
            </span>
            <span className="text-xs font-mono text-neutral-400 bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded">
              DEV KEYS: REVOKED
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
