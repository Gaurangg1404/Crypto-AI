
import { createContext, useState, useLayoutEffect } from "react";

export const StockContext = createContext();

const FINNHUB_API_KEY = "d0d5931r01qm2sk82cqgd0d5931r01qm2sk82cr0"; // Replace with your actual Finnhub API key

export const StockProvider = ({ children }) => {
  const [stockData, setStockData] = useState();
  const [searchData, setSearchData] = useState();
  const [selectedStock, setSelectedStock] = useState();
  const [stockSearch, setStockSearch] = useState("");

  const [currency, setCurrency] = useState("USD"); // Currently unused, as Finnhub returns all prices in native currency
  const [sortBy, setSortBy] = useState("market_cap_desc"); // Sorting logic can be added on frontend
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [error, setError] = useState({ stockData: "", search: "", selectedStock: "" });

const getStockData = async () => {
  setError({ ...error, stockData: "" });
  setStockData();

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=d0d5931r01qm2sk82cqgd0d5931r01qm2sk82cr0`
    );
    const data = await response.json();

    setStockData(data.slice(0, 10)); // show first 10 stocks for simplicity
  } catch (error) {
    console.error(error);
    setError({ ...error, stockData: "Failed to fetch stock data" });
  }
};


  const getSelectedStockData = async (symbol) => {
    setSelectedStock();

    try {
      const [quoteRes, profileRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
      ]);

      const quote = await quoteRes.json();
      const profile = await profileRes.json();

      setSelectedStock({ ...profile, ...quote });
    } catch (err) {
      console.error(err);
      setError((prev) => ({ ...prev, selectedStock: "Failed to fetch selected stock data" }));
    }
  };

  const getSearchResult = async (query) => {
    try {
      const res = await fetch(`https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`);
      const data = await res.json();
      setSearchData(data.result || []);
    } catch (err) {
      console.error(err);
      setError((prev) => ({ ...prev, search: "Failed to fetch search results" }));
    }
  };

  useLayoutEffect(() => {
    getStockData();
  }, [page, perPage]);

  return (
    <StockContext.Provider
      value={{
        stockData,
        searchData,
        selectedStock,
        getSearchResult,
        setStockSearch,
        setSearchData,
        currency,
        setCurrency,
        sortBy,
        setSortBy,
        page,
        setPage,
        totalPages,
        setPerPage,
        perPage,
        getSelectedStockData,
        error,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};
