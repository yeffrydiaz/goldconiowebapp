/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen, ShieldCheck } from "lucide-react";
import { triggerHapticFeedback } from "../utils/haptics";
import { recordClick } from "../utils/analytics";

interface FAQItem {
  question: string;
  answer: string;
  category: "Tokenomics" | "Reflections" | "Liquidity";
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      category: "Tokenomics",
      question: "What is Goldconio (GCNIO) and how is its value backed?",
      answer: "Goldconio (GCNIO) is a premium BEP-20 token built on the Binance Smart Chain. It is engineered with a mathematical ratio correlating directly to Pax Gold (PAXG), representing virtual gold velocity. By leveraging real-world gold tracker metrics, GCNIO merges classical store-of-value confidence with modern high-frequency decentralized finance trading velocity."
    },
    {
      category: "Reflections",
      question: "How does the 4% Reflection mechanism distribute rewards?",
      answer: "Every on-chain transaction (buy/sell) is subject to a friction fee where exactly 4% is automatically sliced and distributed instantly to all wallet holders proportional to their current balance. There are no complicated lockups or staking pools to sign up for—your balance simply grows directly inside your private decentralized wallet over time."
    },
    {
      category: "Liquidity",
      question: "Is the liquidity pool locked, and for how long?",
      answer: "Yes, security is our ultimate priority. 60% of the total token supply (600,000,000 GCNIO) is securely locked inside the PancakeSwap Liquidity Pool for 3 years. This lock is verified on-chain via smart lock locker contracts and ensures a robust trading floor that prevents any form of market manipulation."
    },
    {
      category: "Tokenomics",
      question: "What is the recommended slippage tolerance when trading?",
      answer: "Due to the combined 10% transaction tax (4% reflections, 3% liquidity, 2% burn, 1% growth fund), a minimum slippage tolerance of 11.00% is highly recommended on exchanges like PancakeSwap. This ensures transactions resolve seamlessly during volatile market conditions without failing."
    },
    {
      category: "Liquidity",
      question: "Who holds the remaining 40% of the token supply?",
      answer: "30% of the supply is reserved for strategic marketing and ecosystem incentives, slowly unlocked for community distribution events. The final 10% is allocated to the foundational core development team, fully locked under linear vesting smart contracts to guarantee long-term alignment with the project's health."
    }
  ];

  const handleToggle = (index: number) => {
    triggerHapticFeedback();
    const item = faqItems[index];
    if (openIndex !== index) {
      recordClick(`FAQ Expand: ${item.question}`, "system");
      setOpenIndex(index);
    } else {
      setOpenIndex(null);
    }
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case "Tokenomics":
        return "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20";
      case "Reflections":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "Liquidity":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-neutral-400 bg-neutral-900 border-neutral-800";
    }
  };

  return (
    <section id="faq-section" className="py-24 px-6 bg-neutral-900/60 relative overflow-hidden">
      {/* Visual luxury ambient glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-[150px] pointer-events-none" />
      
      {/* Decorative horizontal gold dividers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-[#D4AF37] tracking-widest uppercase flex items-center justify-center gap-2">
            <BookOpen className="h-4 w-4 text-[#D4AF37]" />
            COMMON QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-neutral-100 mt-2 mb-4">
            Campaign FAQ
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Get instant answers regarding our verified smart token mechanics, secure reflections distribution, and liquidity lock metrics.
          </p>
        </div>

        {/* Accordion List Container */}
        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div 
                key={idx}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? "bg-neutral-950 border-[#D4AF37]/40 shadow-lg shadow-[0_0_20px_rgba(212,175,55,0.04)]" 
                    : "bg-neutral-950/40 border-neutral-800/80 hover:border-[#D4AF37]/20"
                }`}
              >
                {/* Accordion Header bar */}
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full text-left p-6 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-2">
                    <span className={`inline-block text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${
                      getCategoryBadgeColor(item.category)
                    }`}>
                      {item.category}
                    </span>
                    <h3 className={`text-base sm:text-lg font-sans font-bold transition-colors ${
                      isOpen ? "text-[#F9E29C]" : "text-neutral-200"
                    }`}>
                      {item.question}
                    </h3>
                  </div>

                  <div className={`mt-5 shrink-0 h-7 w-7 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                    isOpen 
                      ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]" 
                      : "bg-neutral-900 border-neutral-800 text-neutral-500"
                  }`}>
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {/* Accordion Collapsible Panel Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-neutral-900 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

        {/* Dynamic verified audit footprint sticker */}
        <div className="mt-12 text-center flex flex-col items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-xl px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-green-400" />
            <span className="text-[10px] font-mono text-neutral-400">AUDITED SECURE MECHANICS CODEBASE</span>
          </div>
        </div>

      </div>
    </section>
  );
}
