// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const TopStocks = () => {
//   const [stocks, setStocks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get('http://127.0.0.1:5000/api/top_stocks')
//       .then(response => {
//         setStocks(response.data.stocks || response.data); // handles both structures
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching stock data:', error);
//         setLoading(false);
//       });
//   }, []);
//   if (loading) {
//     return <div>Loading top stocks...</div>;
//   }

//   return (
//     <div className="mt-10">
//       <h2 className="text-xl font-bold mb-4">Top Performing Stocks Today</h2>
//       <table className="w-full table-auto border border-gray-200">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-4 py-2 border">Ticker</th>
//             <th className="px-4 py-2 border">Company</th>
//             <th className="px-4 py-2 border">Price Change</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stocks.map((stock, index) => (
//             <tr key={index}>
//               <td className="px-4 py-2 border">{stock.ticker}</td>
//               <td className="px-4 py-2 border">{stock.company}</td>
//               <td className="px-4 py-2 border">
//                 {(stock.price_change * 100).toFixed(2)}%
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TopStocks;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/top_stocks')
      .then(response => {
        setStocks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading top stocks...</div>;
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Top Performing Stocks</h2>
      <table className="w-full table-auto border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Ticker</th>
            <th className="px-4 py-2 border">Company</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Price Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border">{stock.symbol}</td>
              <td className="px-4 py-2 border">{stock.company}</td>
              <td className="px-4 py-2 border">${stock.current_price}</td>
              <td className="px-4 py-2 border">{stock.price_change.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopStocks;
