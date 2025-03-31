import { Tool } from "beeai-framework";
import yahooFinance from "yahoo-finance2";

export class StockMarketTool extends Tool<{ symbol: string }, string, {}> {
  name = "StockMarketTool";
  description = "Fetches stock market prices for a given symbol.";
  
  getInputJsonSchema() {
    return {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Stock symbol (e.g., AAPL, TSLA, GOOGL)"
        }
      },
      required: ["symbol"]
    };
  }
  
  async run({ symbol }: { symbol: string }) {
    try {
      console.log(`Fetching stock data for: ${symbol}`);
      const result = await yahooFinance.quote(symbol);  // Await the promise
      console.log("Stock Data:", result);
      
      if (!result || !result.regularMarketPrice) {
        throw new Error("Invalid stock data received.");
      }
      
      return `The current price of ${symbol} is $${result.regularMarketPrice}`;
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return `Failed to fetch stock data for ${symbol}. Error: ${error.message}`;
    }
  }
  
}