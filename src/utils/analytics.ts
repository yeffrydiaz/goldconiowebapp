/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalyticsData, ClickMetric, ScrollMetric } from "../types";

const LOCAL_STORAGE_KEY = "gcnio_analytics_v1";

// Helper to generate a stable, anonymous visitor ID
function getOrCreateVisitorId(): string {
  let id = localStorage.getItem("gcnio_visitor_id");
  if (!id) {
    id = "gcnio_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
    localStorage.setItem("gcnio_visitor_id", id);
  }
  return id;
}

export function loadAnalytics(): AnalyticsData {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    const visitorId = getOrCreateVisitorId();
    
    if (data) {
      const parsed = JSON.parse(data) as AnalyticsData;
      // Make sure array bounds or fields are correct
      if (!parsed.clicks) parsed.clicks = [];
      if (!parsed.scrollDepths) parsed.scrollDepths = [];
      if (!parsed.notes) parsed.notes = [];
      if (!parsed.uniqueVisitors) parsed.uniqueVisitors = [visitorId];
      if (!parsed.uniqueVisitors.includes(visitorId)) {
        parsed.uniqueVisitors.push(visitorId);
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load analytics", e);
  }

  // Default initial structure
  const visitorId = getOrCreateVisitorId();
  return {
    totalVisits: 1,
    uniqueVisitors: [visitorId],
    sessionStartTime: Date.now(),
    durationSeconds: 0,
    clicks: [],
    scrollDepths: [],
    lastVisited: new Date().toISOString(),
    retentionScore: 85, // Default base score
    notes: ["Goldconio token campaign launched.", "Verify liquidity pools on PancakeSwap before 2026-07-15."],
  };
}

export function saveAnalytics(data: AnalyticsData) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save analytics", e);
  }
}

/**
 * Increment page visits and track session start
 */
export function recordPageLoad() {
  const data = loadAnalytics();
  data.totalVisits += 1;
  data.sessionStartTime = Date.now();
  data.lastVisited = new Date().toISOString();
  
  // Recalculate a funny but realistic engagement score based on click activity and visit counts
  const visitWeight = Math.min(data.totalVisits * 5, 40);
  const clickWeight = Math.min(data.clicks.length * 3, 40);
  const scrollWeight = data.scrollDepths.length > 0 ? Math.max(...data.scrollDepths.map(d => d.depth)) * 0.2 : 0;
  data.retentionScore = Math.min(Math.round(20 + visitWeight + clickWeight + scrollWeight), 100);

  saveAnalytics(data);
}

/**
 * Log a button click event
 */
export function recordClick(label: string, category: "cta" | "social" | "ecosystem" | "system") {
  const data = loadAnalytics();
  const metric: ClickMetric = {
    id: "clk_" + Math.random().toString(36).substring(2, 9),
    label,
    category,
    timestamp: new Date().toISOString(),
  };
  data.clicks.push(metric);
  
  // Limit max clicks kept to prevent storage exhaustion
  if (data.clicks.length > 300) {
    data.clicks.shift();
  }

  // Save changes
  saveAnalytics(data);
}

/**
 * Log scroll depth reached (25, 50, 75, 100)
 */
export function recordScrollDepth(depth: number) {
  const data = loadAnalytics();
  // Check if this scroll depth was already logged in this session to prevent spamming
  const alreadyLogged = data.scrollDepths.some(s => s.depth === depth);
  if (!alreadyLogged) {
    const metric: ScrollMetric = {
      depth,
      timestamp: new Date().toISOString(),
    };
    data.scrollDepths.push(metric);
    saveAnalytics(data);
  }
}

/**
 * Update accumulated reading duration
 */
export function recordSessionDuration(seconds: number) {
  const data = loadAnalytics();
  data.durationSeconds += seconds;
  saveAnalytics(data);
}

/**
 * Export analytics as CSV file
 */
export function exportAnalyticsToCSV() {
  const data = loadAnalytics();
  
  // 1. Overall Summary Table
  let csv = "--- GOLDCONIO ENGAGEMENT & RETENTION REPORT ---\n";
  csv += `Report Generated,${new Date().toLocaleString()}\n`;
  csv += `Total page loads/visits,${data.totalVisits}\n`;
  csv += `Unique visitor count,${data.uniqueVisitors.length}\n`;
  csv += `Total active duration (seconds),${data.durationSeconds}\n`;
  csv += `Retention Score (out of 100),${data.retentionScore}%\n`;
  csv += `Total Interactions Logged,${data.clicks.length}\n\n`;

  // 2. Click metrics
  csv += "--- CLICK ENGAGEMENT DATA LOG ---\n";
  csv += "ID,Event Label,Category,Timestamp\n";
  data.clicks.forEach(c => {
    // Escape commas
    const label = c.label.replace(/"/g, '""');
    csv += `${c.id},"${label}",${c.category},${c.timestamp}\n`;
  });
  csv += "\n";

  // 3. Scroll metrics
  csv += "--- SCROLL DEPTH ENGAGEMENT ---\n";
  csv += "Scroll Depth %,Timestamp\n";
  data.scrollDepths.forEach(s => {
    csv += `${s.depth}%,${s.timestamp}\n`;
  });
  csv += "\n";

  // 4. Notes
  csv += "--- ADMINISTRATOR LEDGER ENTRIES ---\n";
  csv += "Index,Ledger Entry Note\n";
  data.notes.forEach((n, idx) => {
    const cleanNote = n.replace(/"/g, '""');
    csv += `${idx + 1},"${cleanNote}"\n`;
  });

  // Create blob and trigger download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `gcnio_analytics_report_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export analytics as JSON backup
 */
export function exportAnalyticsToJSON() {
  const data = loadAnalytics();
  const fileContent = JSON.stringify(data, null, 2);
  const blob = new Blob([fileContent], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `gcnio_analytics_backup_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
