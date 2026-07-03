/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClickMetric {
  id: string;
  label: string;
  category: "cta" | "social" | "ecosystem" | "system";
  timestamp: string;
}

export interface ScrollMetric {
  depth: number;
  timestamp: string;
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: string[];
  sessionStartTime: number;
  durationSeconds: number;
  clicks: ClickMetric[];
  scrollDepths: ScrollMetric[];
  lastVisited: string;
  retentionScore: number;
  notes: string[];
}

export interface TokenPriceData {
  priceUsd: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  circulatingSupply: number;
}
