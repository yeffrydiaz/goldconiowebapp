import fs from 'fs';
let code = fs.readFileSync('src/components/PriceTicker.tsx', 'utf-8');

const oldChartUI = `<motion.div 
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
          </motion.div>`;

const newChartUI = `<motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-4 border-t border-neutral-800/80 pt-5 mb-2 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <span className="text-sm font-sans font-bold text-neutral-200">GCNIO Analytics</span>
                   <span className={\`text-[10px] font-mono px-2 py-0.5 rounded-full \${
                     chartData.length > 0 && chartData[chartData.length-1].price >= chartData[0].price
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                   }\`}>
                     {chartData.length > 0 && chartData[chartData.length-1].price >= chartData[0].price ? "▲" : "▼"}
                     {chartData.length > 0 ? Math.abs(((chartData[chartData.length-1].price - chartData[0].price) / chartData[0].price) * 100).toFixed(2) : "0.00"}%
                   </span>
                 </div>
                 <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                   <span>High: <span className="text-neutral-300">{chartData.length > 0 ? formatCurrency(Math.max(...chartData.map(d => d.price)), 6) : "$0.00"}</span></span>
                   <span>Low: <span className="text-neutral-300">{chartData.length > 0 ? formatCurrency(Math.min(...chartData.map(d => d.price)), 6) : "$0.00"}</span></span>
                 </div>
               </div>

               <div className="flex items-center gap-3 w-full md:w-auto">
                 <div className="flex items-center gap-1 bg-neutral-900 rounded-lg p-1 border border-neutral-800 w-full md:w-auto">
                   {["1D", "7D", "30D"].map((t) => (
                     <button
                       key={t}
                       onClick={() => {
                          setTimeframe(t as any);
                          const gcnioPrice = assets.find(a => a.symbol === "GCNIO")?.price || 0.003852;
                          setChartData(generateChartData(gcnioPrice, t as any));
                       }}
                       className={\`flex-1 md:flex-none px-4 py-1.5 rounded text-[10px] font-mono font-bold transition-all \${timeframe === t ? "bg-[#D4AF37] text-black shadow-sm" : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800"}\`}
                     >
                       {t}
                     </button>
                   ))}
                 </div>
                 
                 <button 
                   onClick={() => window.open("https://pancakeswap.finance/swap?outputCurrency=0x5c7e2fbf5803938b99191387465e95e70ab552d7", "_blank")}
                   className="hidden md:flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#F9E29C] text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                 >
                   Trade GCNIO
                 </button>
               </div>
            </div>
            
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', fontSize: '12px', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                    formatter={(value) => [formatCurrency(value, 6), 'Price']}
                    labelStyle={{ color: '#888', marginBottom: '4px' }}
                    cursor={{ stroke: '#D4AF37', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Area type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" activeDot={{ r: 4, fill: '#D4AF37', stroke: '#000', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>`;

if (code.includes(oldChartUI)) {
    code = code.replace(oldChartUI, newChartUI);
    fs.writeFileSync('src/components/PriceTicker.tsx', code);
    console.log("Updated successfully");
} else {
    console.log("Could not find old UI exactly");
}
