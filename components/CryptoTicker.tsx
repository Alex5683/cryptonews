'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const coins = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'tether', symbol: 'USDT' },
  { id: 'binancecoin', symbol: 'BNB' },
  { id: 'solana', symbol: 'SOL' },
  { id: 'ripple', symbol: 'XRP' },
  { id: 'dogecoin', symbol: 'DOGE' },
  { id: 'cardano', symbol: 'ADA' },
  { id: 'toncoin', symbol: 'TON' },
  { id: 'shiba-inu', symbol: 'SHIB' },
];

type CoinPrice = {
  id: string;
  symbol: string;
  current_price: number;
};

const API_KEY = 'CG-T9g9UiueJgsnntj758KkEo9w';

export default function CryptoTicker() {
  const [prices, setPrices] = useState<CoinPrice[]>([]);

  // Fetch prices from CoinGecko API every 1 second with API key
  useEffect(() => {
    let isMounted = true;

    async function fetchPrices() {
      try {
        const ids = coins.map((c) => c.id).join(',');
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
          {
            headers: {
              'X-CoinGecko-Api-Key': API_KEY,
            },
          }
        );
        const data = await res.json();
        if (isMounted) {
          setPrices(data);
        }
      } catch (error) {
        console.error('Failed to fetch crypto prices:', error);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Animation duration and width for scrolling
  const scrollDuration = 20; // seconds

  // Duplicate prices array to create seamless infinite scroll
  const tickerItems = [...prices, ...prices];

  return (
    <div className="w-full overflow-hidden bg-black">
      <motion.div
        className="flex whitespace-nowrap text-white font-mono text-sm"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: scrollDuration }}
      >
        {tickerItems.map((coin, index) => (
          <div
            key={`${coin.id}-${index}`}
            className="flex items-center space-x-2 px-6 border-r border-gray-700 last:border-none"
          >
            <span className="uppercase">{coin.symbol}</span>
            <span>${coin.current_price?.toFixed(4)}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
