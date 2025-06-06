# from flask import Flask, jsonify
# from flask_cors import CORS
# import pandas as pd
# import yfinance as yf

# app = Flask(__name__)
# CORS(app)

# def load_stock_symbols():
#     df = pd.read_excel("S&P 500.xlsx")  # Ensure correct filename
#     return df[['Symbol', 'Company']]


# def fetch_stock_data(symbol):
#     symbol = symbol.replace('.', '-')  # ✅ Convert BRK.B -> BRK-B
#     stock = yf.Ticker(symbol)
#     df = stock.history(period="2d")
#     if df.shape[0] < 2:
#         return None
#     df['Price_Change'] = df['Close'].pct_change()
#     return df.iloc[-1]


# def get_top_stocks():
#     symbols_df = load_stock_symbols()
#     performance = []
#     for _, row in symbols_df.iterrows():
#         symbol = row['Symbol']
#         name = row['Company']
#         try:
#             data = fetch_stock_data(symbol)
#             if data is not None and not pd.isna(data['Price_Change']):
#                 performance.append({
#                     "ticker": symbol,
#                     "company": name,
#                     "price_change": round(float(data['Price_Change']), 4)
#                 })
#         except Exception as e:
#             print(f"Error processing {symbol}: {e}")
#     performance.sort(key=lambda x: x['price_change'], reverse=True)
#     return performance[:5]



# @app.route("/")
# def home():
#     return "Mukul is writing"

# @app.route("/api/top_stocks")
# def top_stocks():
#     try:
#         data = get_top_stocks()
#         return jsonify(data)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import requests

app = Flask(__name__)
CORS(app)

FINNHUB_API_KEY = "d0d5931r01qm2sk82cqgd0d5931r01qm2sk82cr0"  # 🔁 Replace with your actual API key

# Load symbols and company names from Excel
def load_stock_symbols():
    try:
        df = pd.read_excel("S&P 500.xlsx")
        return df[['Symbol', 'Company']]
    except Exception as e:
        print("Error reading Excel:", e)
        return pd.DataFrame(columns=['Symbol', 'Company'])

# Fetch quote for one stock
def get_stock_data(symbol):
    try:
        url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={FINNHUB_API_KEY}"
        res = requests.get(url)
        data = res.json()

        if data and "c" in data and data["c"] > 0 and data["pc"] > 0:
            current = data["c"]
            previous = data["pc"]
            price_change_pct = ((current - previous) / previous) * 100
            return {
                "symbol": symbol,
                "current_price": round(current, 2),
                "price_change": round(price_change_pct, 2)
            }
    except Exception as e:
        print(f"Error fetching data for {symbol}:", e)
    return None

# Get top stocks
def get_top_stocks(limit=5):
    df = load_stock_symbols()
    df = df.head(50)  # Limit to 50 stocks for dev/testing

    results = []
    for _, row in df.iterrows():
        symbol = row['Symbol']
        company = row['Company']
        stock_info = get_stock_data(symbol)
        if stock_info:
            stock_info["company"] = company
            results.append(stock_info)

    results.sort(key=lambda x: x["price_change"], reverse=True)
    return results[:limit]

@app.route("/api/top_stocks")
def top_stocks():
    try:
        data = get_top_stocks()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    return "✅ S&P 500 Stock Tracker (Finnhub API) is working!"

if __name__ == "__main__":
    app.run(debug=True)
