/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function GoldconioLogo({ className = "", size = 120 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none drop-shadow-[0_0_35px_rgba(212,175,55,0.7)] hover:drop-shadow-[0_0_70px_rgba(255,242,178,0.9)] transition-all duration-700 ${className}`}
    >
      <defs>
        {/* Outer Coin Body Metallic Gradient */}
        <radialGradient id="goldCoinPlate" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="25%" stopColor="#F1C40F" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="75%" stopColor="#AA7C11" />
          <stop offset="100%" stopColor="#5B4507" />
          <animate attributeName="fx" values="30%;70%;30%" dur="8s" repeatCount="indefinite" />
          <animate attributeName="fy" values="30%;70%;30%" dur="8s" repeatCount="indefinite" />
        </radialGradient>

        {/* Shimmer Angle Linear Gradient (Animated) */}
        <linearGradient id="shimmerSheen" x1="-100%" y1="-100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="45%" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="50%" stopColor="#ffffff" stopOpacity={0.9} />
          <stop offset="55%" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          <animate attributeName="x1" values="-100%;200%;200%" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y1" values="-100%;200%;200%" dur="4s" repeatCount="indefinite" />
          <animate attributeName="x2" values="0%;300%;300%" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="0%;300%;300%" dur="4s" repeatCount="indefinite" />
        </linearGradient>

        {/* Outer Glow Pulse */}
        <radialGradient id="glowPulse" cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="#FFF2B2" stopOpacity={0} />
          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#F1C40F" stopOpacity={0} />
        </radialGradient>

        {/* Ingot Base Gold Linear Gradient */}
        <linearGradient id="ingotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3A8" />
          <stop offset="30%" stopColor="#F39C12" />
          <stop offset="70%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#7E5D02" />
        </linearGradient>

        {/* Ingot Edge Highlight */}
        <linearGradient id="ingotHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#F1C40F" stopOpacity={0.1} />
        </linearGradient>

        {/* Dark Rim Shadow */}
        <radialGradient id="rimShadow" cx="50%" cy="50%" r="50%">
          <stop offset="92%" stopColor="#000000" stopOpacity={0} />
          <stop offset="97%" stopColor="#000000" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.9} />
        </radialGradient>

        {/* Coin Edge Ridge Pattern */}
        <pattern id="coinRidges" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="4" fill="#AA7C11" />
        </pattern>
      </defs>

      {/* 0. Pulsing Outer Glow Background */}
      <circle cx="256" cy="256" r="256" fill="url(#glowPulse)">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* 1. Outer Coin Base Circle */}
      <circle cx="256" cy="256" r="240" fill="url(#goldCoinPlate)" />
      
      {/* 2. Coin Rim Ring Accent */}
      <circle cx="256" cy="256" r="236" stroke="#AA7C11" strokeWidth="3" />
      <circle cx="256" cy="256" r="226" stroke="#FFF2B2" strokeWidth="1.5" strokeOpacity="0.5" />

      {/* 3. Beaded Border Pattern along Rim */}
      <g stroke="#AA7C11" strokeWidth="2" strokeDasharray="6,12" fill="none">
        <circle cx="256" cy="256" r="216" opacity="0.7" />
      </g>

      {/* Decorative Golden Starburst Ornaments around Outer Ring */}
      <g transform="translate(256,256)" stroke="#AA7C11" strokeWidth="2" opacity="0.6">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <line
            key={i}
            x1="0"
            y1="-226"
            x2="0"
            y2="-216"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>

      {/* 4. Fine Inner Engraved Circle */}
      <circle cx="256" cy="256" r="186" stroke="#5B4507" strokeWidth="3" strokeOpacity="0.4" />
      <circle cx="256" cy="256" r="182" fill="none" stroke="#FFF2B2" strokeWidth="1" strokeOpacity="0.2" />

      {/* 5. Central Ingot Diamond Arrangement (Symmetric 3D-effect Trapezoids) */}
      {/* 
          Ingots are stacked in layers forming a diamond pattern:
          Row 1: 1 Ingot (Top)
          Row 2: 2 Ingots (Upper Middle)
          Row 3: 3 Ingots (Center Axis)
          Row 4: 2 Ingots (Lower Middle)
          Row 5: 1 Ingot (Bottom)
      */}
      <g id="ingotGroup" transform="translate(0, -6)">
        {/* Row 1 (Top Ingot - 1 Unit) */}
        <g transform="translate(198, 110)">
          <path d="M12 0 H104 L116 36 H0 L12 0 Z" fill="url(#ingotGradient)" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))" />
          <path d="M12 0 L0 36 M104 0 L116 36" stroke="url(#ingotHighlight)" strokeWidth="1.5" />
          <path d="M12 0 H104" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.8" />
        </g>

        {/* Row 2 (Upper Middle - 2 Ingots) */}
        <g transform="translate(136, 160)">
          {/* Left */}
          <g transform="translate(0, 0)">
            <path d="M12 0 H104 L116 36 H0 L12 0 Z" fill="url(#ingotGradient)" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))" />
            <path d="M12 0 L0 36 M104 0 L116 36" stroke="url(#ingotHighlight)" strokeWidth="1.5" />
            <path d="M12 0 H104" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" />
          </g>
          {/* Right */}
          <g transform="translate(124, 0)">
            <path d="M12 0 H104 L116 36 H0 L12 0 Z" fill="url(#ingotGradient)" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))" />
            <path d="M12 0 L0 36 M104 0 L116 36" stroke="url(#ingotHighlight)" strokeWidth="1.5" />
            <path d="M12 0 H104" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" />
          </g>
        </g>

        {/* Row 3 (Center Axis - 3 Ingots) */}
        <g transform="translate(74, 210)">
          {/* Left */}
          <g transform="translate(0, 0)">
            <path d="M12 0 H104 L116 36 H0 L12 0 Z" fill="url(#ingotGradient)" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))" />
            <path d="M12 0 L0 36 M104 0 L116 36" stroke="url(#ingotHighlight)" strokeWidth="1.5" />
            <path d="M12 0 H104" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" />
          </g>
          {/* Middle */}
          <g transform="translate(124, 0)">
            <path d="M12 0 H104 L116 36 H0 L12 0 Z" fill="url(#ingotGradient)" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))" />
            <path d="M12 0 L0 36 M104 0 L116 36" stroke="url(#ingotHighlight)" strokeWidth="1.5" />
            <path d="M12 0 H104" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" />
          </g>
          {/* Right */}
          <g transform="translate(248, 0)">
            <path d="M12 0 H104 L116 36 H0 L12 0 Z" fill="url(#ingotGradient)" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))" />
            <path d="M12 0 L0 36 M104 0 L116 36" stroke="url(#ingotHighlight)" strokeWidth="1.5" />
            <path d="M12 0 H104" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" />
          </g>
        </g>

        {/* Row 4 (Lower Middle - 2 Ingots) */}
        <g transform="translate(136, 260)">
          {/* Left */}
          <g transform="translate(0, 0)">
            <path d="M12 0 H104 L116 36 H0 L12 0 Z" fill="url(#ingotGradient)" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))" />
            <path d="M12 0 L0 36 M104 0 L116 36" stroke="url(#ingotHighlight)" strokeWidth="1.5" />
            <path d="M12 0 H104" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" />
          </g>
          {/* Right */}
          <g transform="translate(124, 0)">
            <path d="M12 0 H104 L116 36 H0 L12 0 Z" fill="url(#ingotGradient)" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))" />
            <path d="M12 0 L0 36 M104 0 L116 36" stroke="url(#ingotHighlight)" strokeWidth="1.5" />
            <path d="M12 0 H104" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" />
          </g>
        </g>

        {/* Row 5 (Bottom Ingot - 1 Unit) */}
        <g transform="translate(198, 310)">
          <path d="M12 0 H104 L116 36 H0 L12 0 Z" fill="url(#ingotGradient)" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))" />
          <path d="M12 0 L0 36 M104 0 L116 36" stroke="url(#ingotHighlight)" strokeWidth="1.5" />
          <path d="M12 0 H104" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" />
        </g>
      </g>

      {/* Decorative Ingot/Brick Stamp Label underneath the Diamond Stack */}
      <text
        x="256"
        y="390"
        fill="#AA7C11"
        fontSize="15"
        fontWeight="bold"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="2"
        opacity="0.8"
      >
        GOLD SECURED
      </text>

      {/* 6. Realistic Shadow Overlay for 3D depth */}
      <circle cx="256" cy="256" r="240" fill="url(#rimShadow)" pointerEvents="none" />

      {/* 7. Gloss / Shimmer Overlay */}
      <circle cx="256" cy="256" r="236" fill="url(#shimmerSheen)" pointerEvents="none" />
    </svg>
  );
}
