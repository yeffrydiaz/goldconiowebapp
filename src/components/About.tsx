/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Gem, Landmark, ShieldAlert, Compass } from "lucide-react";
import { triggerHapticFeedback } from "../utils/haptics";
import { recordClick } from "../utils/analytics";

export default function About() {
  const features = [
    {
      icon: Gem,
      title: "Hard Asset Philosophy",
      desc: "Styled after ancient physical gold coinage, Goldconio acts as a resilient hedging protocol on-chain, limiting inflation with consistent algorithmic burning.",
    },
    {
      icon: Landmark,
      title: "PancakeSwap Dynamic Liquidity",
      desc: "3% of every transaction is directed to the liquidity pool to ensure market stability, creating an ever-rising, hyper-stable price floor.",
    },
    {
      icon: ShieldAlert,
      title: "Continuous Burn & Growth",
      desc: "2% of the tokens are continuously burned to decrease overall supply, and 1% is added to the ecosystem's Growth Fund.",
    },
    {
      icon: Compass,
      title: "Frictionless Yield Reflection",
      desc: "Hold GCNIO directly in your wallet and earn passive reflections. 4% of every transaction is automatically redistributed to all existing token holders in real-time.",
    },
  ];

  const handleLearnMore = () => {
    triggerHapticFeedback();
    recordClick("About section: Learn More clicked", "system");
    document.getElementById("ecosystem-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about-section" className="py-24 px-6 bg-neutral-900/60 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono font-bold text-[#D4AF37] tracking-widest uppercase">
              DECENTRALIZED DIGITAL GOLD
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-neutral-100 leading-tight">
              Fusing Classic Luxury with <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#D4AF37] text-glow-gold">
                DeFi Velocity
              </span>
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
              Goldconio reimagines high-grade digital wealth representation on the Binance Smart Chain. By binding classical coin mechanics with contemporary multi-layered smart contract parameters, GCNIO offers a reliable token with dynamic, self-balancing tokenomics.
            </p>
            <p className="text-neutral-400 text-base leading-relaxed">
              Whether you are hedging against global inflation, holding for native passive reflections, or trading active pools on PancakeSwap, Goldconio offers a premier Web3 portal designed to secure and compound your capital automatically.
            </p>
            
            <button
              onClick={handleLearnMore}
              className="mt-4 px-6 py-3 border border-[#D4AF37]/20 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#F9E29C] rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer"
            >
              Explore Connected Apps &rarr;
            </button>
          </div>

          {/* Tokenomics Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 bg-neutral-950/90 border border-[#D4AF37]/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative shadow-glow-gold"
          >
            <h3 className="text-xl font-display font-bold text-neutral-100 mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
              Verified Tokenomics
            </h3>

            <div className="space-y-5">
              {/* Token supply */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-500">TOTAL SUPPLY</span>
                  <span className="text-neutral-200">1,000,000,000 GCNIO</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8a6d1e] to-[#D4AF37] w-[100%]" />
                </div>
              </div>

              {/* Locked LP */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-500">PANCAKESWAP LP LOCK</span>
                  <span className="text-[#D4AF37] font-semibold">600,000,000 GCNIO (60%)</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8a6d1e] to-[#D4AF37] w-[60%]" />
                </div>
              </div>

              {/* Burned */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-500">ALGORITHMIC BURN PORTION</span>
                  <span className="text-neutral-200">300,000,000 GCNIO (30%)</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8a6d1e] to-[#D4AF37] w-[30%]" />
                </div>
              </div>

              {/* Marketing / Ecosystem */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-500">ECOSYSTEM / DEPLOYER VAULT</span>
                  <span className="text-neutral-200">100,000,000 GCNIO (10%)</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8a6d1e] to-[#D4AF37] w-[10%]" />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-500">
              <span>Deployer Address: 0x5c7e...2d7</span>
              <span className="text-green-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping" />
                Verified BSC contract
              </span>
            </div>
          </motion.div>

        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-neutral-950/40 hover:bg-neutral-900/40 border border-neutral-800/80 hover:border-[#D4AF37]/20 rounded-xl p-6 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-5">
                  <Icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h4 className="text-lg font-sans font-bold text-neutral-100 mb-2">
                  {f.title}
                </h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
