import fs from 'fs';
let code = fs.readFileSync('src/components/PriceTicker.tsx', 'utf-8');

code = code.replace(
    'const [showChart, setShowChart] = useState(false);',
    'const [showChart, setShowChart] = useState(false);\n  const [timeframe, setTimeframe] = useState<"1D" | "7D" | "30D">("7D");'
);

// We need a helper function to generate chart data so we can call it when timeframe changes.
const generateDataCode = `
  const generateChartData = (currentPrice: number, range: "1D" | "7D" | "30D") => {
    const data = [];
    const points = range === "1D" ? 24 : range === "7D" ? 7 : 30;
    const volatility = range === "1D" ? 0.02 : range === "7D" ? 0.1 : 0.25;
    
    let simulatedPrice = currentPrice * (1 - (Math.random() * volatility * 0.5)); // start slightly off
    
    const now = new Date();
    for (let i = points; i >= 0; i--) {
      let d = new Date(now.getTime());
      if (range === "1D") d.setHours(d.getHours() - i);
      else d.setDate(d.getDate() - i);
      
      if (i === 0) {
        simulatedPrice = currentPrice;
      } else {
        const fluctuation = 1 + (Math.random() - 0.5) * (volatility / (points / 4));
        simulatedPrice = simulatedPrice * fluctuation;
      }
      
      data.push({
        time: range === "1D" 
          ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        price: simulatedPrice
      });
    }
    return data;
  };
`;

code = code.replace(
    'const fetchPrices = async () => {',
    generateDataCode + '\n  const fetchPrices = async () => {'
);

// update fetchPrices
code = code.replace(
    /const newChartData = \[\];[\s\S]*?setChartData\(newChartData\);/,
    'setChartData(generateChartData(finalGcnioPrice, timeframe));'
);

// update simulateLocalTick
code = code.replace(
    /const fallbackPrice = assets\.find\(a => a\.symbol === "GCNIO"\)\?\.price \|\| 0\.003852;\n      const newChartData = \[\];[\s\S]*?setChartData\(newChartData\);/,
    'const fallbackPrice = assets.find(a => a.symbol === "GCNIO")?.price || 0.003852;\n      setChartData(generateChartData(fallbackPrice, timeframe));'
);

const chartUIRegex = /<motion\.div[\s\S]*?<\/motion\.div>/;

const newChartUI = `
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "180px" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-4 border-t border-neutral-800/80 pt-4 mb-4"
          >
            <div className="flex justify-between items-center mb-4">
               <span className="text-xs font-mono text-neutral-400">GCNIO Performance</span>
               <div className="flex items-center gap-2 bg-neutral-900 rounded-lg p-1 border border-neutral-800">
                 {["1D", "7D", "30D"].map((t) => (
                   <button
                     key={t}
                     onClick={() => {
                        setTimeframe(t as any);
                        const gcnioPrice = assets.find(a => a.symbol === "GCNIO")?.price || 0.003852;
                        setChartData(generateChartData(gcnioPrice, t as any));
                     }}
                     className={\`px-3 py-1 rounded text-[10px] font-mono font-bold transition-colors \${timeframe === t ? "bg-[#D4AF37] text-black" : "text-neutral-500 hover:text-neutral-300"}\`}
                   >
                     {t}
                   </button>
                 ))}
               </div>
            </div>
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', fontSize: '12px', color: '#fff' }}
                    itemStyle={{ color: '#D4AF37' }}
                    formatter={(value: number) => [formatCurrency(value, 6), 'Price']}
                    labelStyle={{ color: '#888', marginBottom: '4px' }}
                  />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Area type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
`;

code = code.replace(chartUIRegex, newChartUI);

fs.writeFileSync('src/components/PriceTicker.tsx', code);
