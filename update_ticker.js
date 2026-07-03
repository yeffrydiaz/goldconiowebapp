import fs from 'fs';
let code = fs.readFileSync('src/components/PriceTicker.tsx', 'utf-8');

code = code.replace(
    'import { Coins, TrendingUp, TrendingDown, RefreshCw, BarChart2, ShieldCheck, Activity } from "lucide-react";',
    'import { Coins, TrendingUp, TrendingDown, RefreshCw, BarChart2, ShieldCheck, Activity } from "lucide-react";\nimport { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";'
);

code = code.replace(
    'const [isLiveApi, setIsLiveApi] = useState(false);',
    'const [isLiveApi, setIsLiveApi] = useState(false);\n  const [chartData, setChartData] = useState<{time: string, price: number}[]>([]);\n  const [showChart, setShowChart] = useState(false);'
);

// We need to inject the logic to populate chartData in simulateLocalTick and fetchPrices.
// Actually, let's just generate the 7-day chart data based on the calculated GCNIO price right when it's fetched or simulated.

code = code.replace(
    'setAssets([',
    `
      // Generate 7-day historical mock data based on the final price
      const newChartData = [];
      const now = new Date();
      for (let i = 7; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        // add some random fluctuation between -5% and +5%
        const fluctuation = 1 + (Math.random() - 0.5) * 0.1;
        newChartData.push({
          time: d.toLocaleDateString(undefined, { weekday: 'short' }),
          price: finalGcnioPrice * (i === 0 ? 1 : fluctuation) // current price for today
        });
      }
      setChartData(newChartData);

      setAssets([`
);

code = code.replace(
    'simulateLocalTick();',
    `simulateLocalTick();
      
      // Generate fallback chart data
      const fallbackPrice = assets.find(a => a.symbol === "GCNIO")?.price || 0.003852;
      const newChartData = [];
      const now = new Date();
      for (let i = 7; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const fluctuation = 1 + (Math.random() - 0.5) * 0.1;
        newChartData.push({
          time: d.toLocaleDateString(undefined, { weekday: 'short' }),
          price: fallbackPrice * (i === 0 ? 1 : fluctuation)
        });
      }
      setChartData(newChartData);`
);

// Now update the UI to include a button to toggle the chart and the chart itself.
const replacementUI = `
          {/* Market Cap widget */}
          <div className="text-center sm:text-left min-w-[110px]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Market Capitalization</span>
            <span className="text-sm font-mono font-bold text-neutral-100 block">
              {formatMarketCap(gcnio.marketCap)}
            </span>
          </div>
          
          <div className="h-8 w-[1px] bg-neutral-800 hidden sm:block" />
          <button 
            onClick={() => setShowChart(!showChart)}
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#F9E29C] transition-colors border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 rounded-md px-3 py-1.5 ml-2"
          >
            <BarChart2 className="h-4 w-4" />
            {showChart ? "Hide Chart" : "7D Chart"}
          </button>
`;

code = code.replace(
    '{/* Market Cap widget */}\n          <div className="text-center sm:text-left min-w-[110px]">\n            <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Market Capitalization</span>\n            <span className="text-sm font-mono font-bold text-neutral-100 block">\n              {formatMarketCap(gcnio.marketCap)}\n            </span>\n          </div>',
    replacementUI
);

const chartUI = `
        {/* Multi-asset Side Ticker Carousel */}
        
        {showChart && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "120px" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-4 border-t border-neutral-800/80 pt-4 mb-4"
          >
            <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-mono text-neutral-400">GCNIO 7-Day Performance</span>
            </div>
            <div className="h-[90px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', fontSize: '12px', color: '#fff' }}
                    itemStyle={{ color: '#D4AF37' }}
                    formatter={(value: number) => [formatCurrency(value, 6), 'Price']}
                  />
                  <Area type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
`;

code = code.replace(
    '{/* Multi-asset Side Ticker Carousel */}',
    chartUI
);

fs.writeFileSync('src/components/PriceTicker.tsx', code);
