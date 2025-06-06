import { createContext, useLayoutEffect, useState } from "react";

// Trending (Crypto) Context
export const TrendingContext = createContext({});

export const TrendingProvider = ({ children }) => {
  const [trendData, setTrendData] = useState();

  const getTrendData = async () => {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/search/trending`);
      const data = await res.json();
      setTrendData(data.coins);
    } catch (error) {
      console.log("Trending fetch error:", error);
    }
  };

  useLayoutEffect(() => {
    getTrendData();
  }, []);

  const resetTrendingResult = () => {
    getTrendData();
  };

  return (
    <TrendingContext.Provider value={{ trendData, resetTrendingResult }}>
      {children}
    </TrendingContext.Provider>
  );
};

// 🟢 Stock Context
export const StockContext = createContext({});

export const StockProvider = ({ children }) => {
  const [stockData, setStockData] = useState();

  const getStockData = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/top_stocks`);
      const data = await res.json();
      setStockData(data.stocks || data); // fallback for raw array
    } catch (error) {
      console.log("Stock fetch error:", error);
    }
  };

  useLayoutEffect(() => {
    getStockData();
  }, []);

  return (
    <StockContext.Provider value={{ stockData }}>
      {children}
    </StockContext.Provider>
  );
};

// 🔁 Combined Provider
export const AppDataProvider = ({ children }) => {
  return (
    <TrendingProvider>
      <StockProvider>
        {children}
      </StockProvider>
    </TrendingProvider>
  );
};
