"use client";

import React from "react";

interface GlowingSearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const GlowingSearchBar: React.FC<GlowingSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative flex items-center justify-center w-full">
      <div id="poda" className="relative flex items-center justify-center group w-full">
        {/* Outer glow layer 1 */}
        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[3px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[999px] before:h-[999px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[60deg]
                        before:bg-[conic-gradient(#000,#7f1d1d_5%,#000_38%,#000_50%,#9f1239_60%,#000_87%)] before:transition-all before:duration-2000
                        dark:before:bg-[conic-gradient(#000,#7f1d1d_5%,#000_38%,#000_50%,#9f1239_60%,#000_87%)]
                        group-hover:before:rotate-[-120deg] group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]">
        </div>
        {/* Inner glow layer 2 */}
        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[3px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                        before:bg-[conic-gradient(rgba(0,0,0,0),#4a1526,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#6e1b3d,rgba(0,0,0,0)_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]">
        </div>
        {/* Inner glow layer 3 */}
        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[3px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                        before:bg-[conic-gradient(rgba(0,0,0,0),#4a1526,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#6e1b3d,rgba(0,0,0,0)_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]">
        </div>
        {/* Bright accent glow */}
        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-lg blur-[2px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg]
                        before:bg-[conic-gradient(rgba(0,0,0,0)_0%,#d4a0a0,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#dfa2c0,rgba(0,0,0,0)_58%)] before:brightness-140
                        before:transition-all before:duration-2000 group-hover:before:rotate-[-97deg] group-focus-within:before:rotate-[443deg] group-focus-within:before:duration-[4000ms]">
        </div>
        {/* Inner color ring */}
        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[0.5px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[70deg]
                        before:bg-[conic-gradient(#1c191c,#7f1d1d_5%,#1c191c_14%,#1c191c_50%,#9f1239_60%,#1c191c_64%)] before:brightness-130
                        before:transition-all before:duration-2000 group-hover:before:rotate-[-110deg] group-focus-within:before:rotate-[430deg] group-focus-within:before:duration-[4000ms]">
        </div>

        {/* Main Input */}
        <div className="relative group w-full">
          <input
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={onChange}
            className="bg-white dark:bg-[#0c1020] border-none w-full h-[52px] rounded-xl text-slate-800 dark:text-white px-12 text-sm focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
          />
          {/* Decorative edge glow */}
          <div className="pointer-events-none w-[30px] h-[20px] absolute bg-maroon-700 top-[10px] left-[5px] blur-2xl opacity-60 transition-all duration-2000 group-hover:opacity-0 dark:opacity-80 dark:group-hover:opacity-0"></div>
          {/* Search icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" height="18" fill="none" className="feather feather-search">
              <circle stroke="url(#searchGradient)" r="8" cy="11" cx="11"></circle>
              <line stroke="url(#searchLineGrad)" y2="16.65" y1="22" x2="16.65" x1="22"></line>
              <defs>
                <linearGradient gradientTransform="rotate(50)" id="searchGradient">
                  <stop stopColor="#be185d" offset="0%"></stop>
                  <stop stopColor="#9f1239" offset="50%"></stop>
                </linearGradient>
                <linearGradient id="searchLineGrad">
                  <stop stopColor="#9f1239" offset="0%"></stop>
                  <stop stopColor="#881337" offset="50%"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlowingSearchBar;
