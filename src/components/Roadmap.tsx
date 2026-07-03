/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { 
  Calendar, CheckCircle2, ShieldAlert, Sparkles, Star, Rocket, MapPin, Milestone, Layers, Globe, Compass 
} from "lucide-react";
import { triggerHapticFeedback } from "../utils/haptics";
import { recordClick } from "../utils/analytics";

interface MilestoneItem {
  text: string;
  isCompleted: boolean;
}

interface RoadmapPhase {
  phase: string;
  title: string;
  date: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  icon: any;
  milestones: MilestoneItem[];
}

export default function Roadmap() {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const phases: RoadmapPhase[] = [
    {
      phase: "PHASE 01",
      title: "Genesis & Deployment",
      date: "Q1 - Q2 2026",
      description: "Establishing the secure cryptographic core, token distribution framework, and verified smart contract code.",
      status: "completed",
      icon: Star,
      milestones: [
        { text: "Smart Contract deployment on BSC (BEP-20)", isCompleted: true },
        { text: "Security Audit by SoliditySec (100% Verified)", isCompleted: true },
        { text: "PancakeSwap liquidity pool lock setup (60% locked for 3 years)", isCompleted: true },
        { text: "Initial Community Drop & Social verification channels launch", isCompleted: true }
      ]
    },
    {
      phase: "PHASE 02",
      title: "DeFi Velocity & Oracles",
      date: "Q3 - Q4 2026",
      description: "Unleashing the digital gold value engine, real-time price feeds, and decentralization hub metrics.",
      status: "in-progress",
      icon: Compass,
      milestones: [
        { text: "Live real-time Price Oracle integration (CoinGecko Simple API)", isCompleted: true },
        { text: "DEX Tracker listing (PooCoin & DexTools verified banners)", isCompleted: true },
        { text: "Simulated Exchange & Trade portal (Interactive Swap Widget)", isCompleted: true },
        { text: "Initial Centralized Exchange (CEX) tier-2 discussions", isCompleted: false }
      ]
    },
    {
      phase: "PHASE 03",
      title: "Gold Sovereign Reserve",
      date: "Q1 - Q2 2027",
      description: "Bridging the decentralized digital asset with certified, real-world vault-locked physical gold bullion.",
      status: "upcoming",
      icon: Layers,
      milestones: [
        { text: "Legal agreement with LBMA-certified physical gold vault custodians", isCompleted: false },
        { text: "Proof-of-Reserve (PoR) dynamic verification board", isCompleted: false },
        { text: "GCNIO to Physical Gold physical redemption testing pilot", isCompleted: false },
        { text: "Quarterly gold-reserve security audits by accredited third parties", isCompleted: false }
      ]
    },
    {
      phase: "PHASE 04",
      title: "Global Wealth Ecosystem",
      date: "Q3 - Q4 2027",
      description: "Unlocking elite real-world utility, luxury marketplace integrations, and borderless transactions.",
      status: "upcoming",
      icon: Rocket,
      milestones: [
        { text: "Goldconio Visa Debit Card (Instantly spend GCNIO globally)", isCompleted: false },
        { text: "Exclusive luxury goods online marketplace supporting GCNIO directly", isCompleted: false },
        { text: "Cross-chain bridge integration (Ethereum & Arbitrum networks)", isCompleted: false },
        { text: "Global GCNIO Sovereign Governance DAO launch", isCompleted: false }
      ]
    }
  ];

  const handlePhaseClick = (index: number) => {
    triggerHapticFeedback();
    const label = `Roadmap Phase ${index + 1} expanded: ${phases[index].title}`;
    recordClick(label, "system");
    setActivePhase(activePhase === index ? null : index);
  };

  const getStatusBadge = (status: "completed" | "in-progress" | "upcoming") => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-green-400 bg-green-500/10 border border-green-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            ✓ COMPLETED
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            ● IN PROGRESS
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-neutral-500 bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            ○ UPCOMING
          </span>
        );
    }
  };

  return (
    <section id="roadmap-section" className="py-24 px-6 bg-neutral-950/40 relative overflow-hidden">
      {/* Absolute Decorative Glow Orbs */}
      <div className="absolute top-1/3 right-1/4 translate-x-1/3 -translate-y-1/2 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 -translate-x-1/3 translate-y-1/2 w-80 h-80 rounded-full bg-[#D4AF37]/3 blur-[140px] pointer-events-none" />
      
      {/* Decorative cyber horizontal border line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-[#D4AF37] tracking-widest uppercase flex items-center justify-center gap-2">
            <Milestone className="h-4 w-4 text-[#D4AF37]" />
            MILESTONES & GROWTH
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-neutral-100 mt-2 mb-4">
            Campaign Roadmap
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Follow our strategic layout as we scale Goldconio from a secure BSC token campaign into a premier, vault-backed global currency ecosystem.
          </p>
          
          {/* Timeline progress completion statistics bar */}
          <div className="mt-8 max-w-md mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-2 shadow-glow-gold">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-400">Total Campaign Completion</span>
              <span className="text-[#D4AF37] font-bold">55% Progress</span>
            </div>
            <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-neutral-800/80">
              <div className="h-full bg-gradient-to-r from-[#8a6d1e] via-[#D4AF37] to-[#F9E29C] w-[55%] rounded-full" />
            </div>
            <span className="text-[10px] font-mono text-neutral-500 text-center block">Phases 1 & 2 fully audited and executing locally.</span>
          </div>
        </div>

        {/* Timeline track container */}
        <div className="relative">
          {/* Vertical central path line for large screens */}
          <div className="absolute left-[30px] md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#8a6d1e]/40 via-[#D4AF37]/20 to-neutral-900 pointer-events-none" />

          {/* Timeline phases mapping */}
          <div className="space-y-12">
            {phases.map((phase, idx) => {
              const Icon = phase.icon;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`flex flex-col md:flex-row relative items-start md:items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  
                  {/* Timeline interactive anchor node */}
                  <div className="absolute left-[30px] md:left-1/2 md:-translate-x-1/2 z-20 flex items-center justify-center">
                    <button
                      onClick={() => handlePhaseClick(idx)}
                      className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                        phase.status === "completed"
                          ? "bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                          : phase.status === "in-progress"
                          ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                          : "bg-neutral-950 border-neutral-800 text-neutral-500"
                      } hover:scale-110 active:scale-95`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Left or Right blank spatial filler for grid alignment */}
                  <div className="hidden md:block w-1/2 px-10" />

                  {/* Real visual content box card */}
                  <div className="w-full md:w-1/2 pl-[65px] md:pl-0 md:px-10">
                    <div 
                      onClick={() => handlePhaseClick(idx)}
                      className={`bg-neutral-900/60 hover:bg-neutral-900/90 border rounded-2xl p-6 sm:p-8 transition-all duration-500 shadow-xl cursor-pointer relative overflow-hidden group shadow-glow-gold-hover ${
                        phase.status === "in-progress" 
                          ? "border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.05)]" 
                          : "border-neutral-800/80 hover:border-[#D4AF37]/20"
                      }`}
                    >
                      {/* Premium gold hover border sheen */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8a6d1e] to-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" />

                      {/* Header metrics */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-bold text-[#D4AF37] tracking-wider">
                          {phase.phase}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                            {phase.date}
                          </span>
                          {getStatusBadge(phase.status)}
                        </div>
                      </div>

                      <h3 className="text-xl font-display font-bold text-neutral-100 group-hover:text-[#D4AF37] transition-colors mb-2">
                        {phase.title}
                      </h3>
                      
                      <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                        {phase.description}
                      </p>

                      {/* Toggleable expansion of Phase's Milestones */}
                      <div className="space-y-3.5 border-t border-neutral-800/80 pt-5">
                        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                          <span>Verified Milestones</span>
                          <span className="text-neutral-400 font-bold">
                            ({phase.milestones.filter(m => m.isCompleted).length} / {phase.milestones.length})
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {phase.milestones.map((milestone, mIdx) => (
                            <div 
                              key={mIdx}
                              className="flex items-start gap-3 bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-800/40"
                            >
                              <div className="shrink-0 mt-0.5">
                                {milestone.isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-neutral-800 shrink-0" />
                                )}
                              </div>
                              <span className={`text-xs ${
                                milestone.isCompleted 
                                  ? "text-neutral-300 line-through decoration-neutral-800" 
                                  : "text-neutral-400"
                              } leading-relaxed`}>
                                {milestone.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Footnote Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl">
            <ShieldAlert className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              ROADMAP TARGETS CORRELATE WITH LIVE CHAIN LOCK DATES
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
