import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { TrendingContext } from "../context/TrendingContext";
import { StockContext } from "../context/TrendingContext"; // assuming it's in the same file
import TrendingCoin from "./../components/TrendingCoin";
import Stocks from "./../components/stocks"; // component name should start with uppercase

const Trending = () => {
  const { trendData, resetTrendingResult } = useContext(TrendingContext);
  const { stockData } = useContext(StockContext);

  return (
    <section className="w-[80%] h-full flex flex-col mt-16 mb-24 relative">
      {/* Trending Crypto Coins */}
      <div className="w-full min-h-[60vh] py-8 flex flex-wrap justify-evenly border border-gray-100 rounded">
        {trendData &&
          trendData.map((coin) => (
            <TrendingCoin key={coin.item.coin_id} data={coin.item} />
          ))}
        <button
          className="w-[2rem] ml-4 hover:scale-110 transition-all absolute right-0 -top-10"
          onClick={resetTrendingResult}
        >
          {/* SVG for refresh icon */}
        </button>
      </div>

      {/* 🟢 Stocks Section Below Crypto */}
      <div className="mt-10">
        <Stocks data={stockData} />
      </div>

      <Outlet />
    </section>
  );
};

export default Trending;
