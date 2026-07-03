/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Copy, ShieldCheck, Terminal, HelpCircle, ExternalLink } from "lucide-react";
import { triggerSuccessHaptic } from "../utils/haptics";
import { recordClick } from "../utils/analytics";

export default function ContractBox() {
  const contractAddress = "0x5c7e2fbf5803938b99191387465e95e70ab552d7";
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      triggerSuccessHaptic();
      recordClick("Contract Address Copied", "system");

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      // Fallback
      console.warn("Failed to copy using clipboard API", err);
    }
  };

  return (
    <section id="contract-section" className="py-20 px-6 bg-neutral-950 relative overflow-hidden">
      {/* Decorative cyber line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg px-3 py-1 mb-4"
          >
            <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-xs font-mono font-semibold text-[#D4AF37]">SECURE CONTRACT DETECTED</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-100">
            Smart Contract Info
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-2">
            Verified, safe, and audited contract on the Binance Smart Chain.
          </p>
        </div>

        {/* Visually distinct luxurious contract area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-neutral-900/90 rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden group shadow-glow-gold"
        >
          {/* Neon gold gradient border corner tags */}
          <div className="absolute top-0 left-0 w-8 h-[2px] bg-[#D4AF37]" />
          <div className="absolute top-0 left-0 w-[2px] h-8 bg-[#D4AF37]" />
          <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-[#D4AF37]" />
          <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#D4AF37]" />

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-[#D4AF37]" />
                BEP-20 Standard Contract
              </span>
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-neutral-500 hover:text-[#D4AF37] transition-colors"
                title="Help info"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>

            {/* Address bar with Copy to clipboard */}
            <div className="bg-black/80 rounded-xl border border-neutral-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
              <div className="w-full flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-xs font-mono text-neutral-500 block mb-1">Contract Address</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-mono text-[#F9E29C] block truncate select-all tracking-tight sm:tracking-normal">
                    {contractAddress}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors relative group"
                    title="Copy to Clipboard"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    
                    {/* Success Tooltip */}
                    <AnimatePresence>
                      {copied && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-black text-[10px] font-bold px-2.5 py-1 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none"
                        >
                          Copied!
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
              
              <button
                id="copy-contract-btn"
                onClick={handleCopy}
                className={`relative w-full sm:w-auto px-5 py-3 rounded-lg font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                  copied
                    ? "bg-green-500 text-neutral-950 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    : "bg-[#D4AF37] hover:bg-[#F9E29C] text-black shadow-[0_0_10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] active:scale-95"
                }`}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="checked"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5"
                    >
                      <Copy className="h-4 w-4 stroke-[2.5]" />
                      Copy Address
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xs font-mono text-green-400 font-medium"
              >
                Verified contract copied. Import GCNIO to PancakeSwap or MetaMask safely!
              </motion.div>
            )}

            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-neutral-900 text-xs text-neutral-400 p-3.5 rounded-lg border border-neutral-800 font-sans leading-relaxed"
                >
                  To view your Goldconio balance in MetaMask or Trust Wallet, tap the **Copy Address** button, navigate to your wallet, click "Import Tokens" or "Custom Token", choose the **Binance Smart Chain (BSC)** network, and paste this address. The symbol **GCNIO** and decimals **18** will fill automatically.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick stats tags inside the box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-2">
              <div className="bg-black/40 border border-neutral-800 p-3 rounded-lg text-center">
                <span className="text-[10px] text-neutral-500 font-mono block uppercase">Reflections</span>
                <span className="text-xs font-sans text-[#D4AF37] font-bold">4% Reward</span>
              </div>
              <div className="bg-black/40 border border-neutral-800 p-3 rounded-lg text-center">
                <span className="text-[10px] text-neutral-500 font-mono block uppercase">Liquidity</span>
                <span className="text-xs font-sans text-neutral-200 font-bold">3% Pool</span>
              </div>
              <div className="bg-black/40 border border-neutral-800 p-3 rounded-lg text-center">
                <span className="text-[10px] text-neutral-500 font-mono block uppercase">Burn Rate</span>
                <span className="text-xs font-sans text-neutral-200 font-bold">2% Burn</span>
              </div>
              <div className="bg-black/40 border border-neutral-800 p-3 rounded-lg text-center">
                <span className="text-[10px] text-neutral-500 font-mono block uppercase">Growth Fund</span>
                <span className="text-xs font-sans text-neutral-200 font-bold">1% Added</span>
              </div>
            </div>

            {/* External Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => window.open("https://bscscan.com/address/0x5c7e2fbf5803938b99191387465e95e70ab552d7", "_blank")}
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white font-bold text-xs px-5 py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                View on BscScan
                <ExternalLink className="h-4 w-4" />
              </button>
              <button
                onClick={() => window.open("https://poocoin.app/tokens/0x5c7e2fbf5803938b99191387465e95e70ab552d7", "_blank")}
                className="bg-neutral-900 hover:bg-neutral-800 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-xs px-5 py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                View Chart on PooCoin
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
