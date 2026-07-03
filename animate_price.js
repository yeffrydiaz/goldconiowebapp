import fs from 'fs';
let code = fs.readFileSync('src/components/PriceTicker.tsx', 'utf-8');

const oldPriceUI = `<span className="text-sm font-mono font-bold text-[#F9E29C] text-glow-neon">
              {formatCurrency(gcnio.price)}
            </span>`;

const newPriceUI = `<motion.span 
              key={gcnio.price}
              initial={{ color: gcnio.change24h >= 0 ? '#4ade80' : '#f87171' }}
              animate={{ color: '#F9E29C' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-sm font-mono font-bold text-glow-neon inline-block"
            >
              {formatCurrency(gcnio.price)}
            </motion.span>`;

if (code.includes(oldPriceUI)) {
    code = code.replace(oldPriceUI, newPriceUI);
    fs.writeFileSync('src/components/PriceTicker.tsx', code);
    console.log("Updated price animation successfully");
} else {
    console.log("Could not find old UI exactly");
}
