import { Tool } from "beeai-framework/tools/tool"; // Import BeeAI's base Tool class
import yahooFinance from "yahoo-finance2"; // Import Yahoo Finance API

export class StockMarketTool extends Tool {
  name = "StockMarketTool";
  description = "Fetches stock market prices for a given symbol.";

  // Define the input schema for the tool
  async run({ symbol }: { symbol: string }): Promise<string> {
    try {
      const result = await yahooFinance.quote(symbol);
      return `The current price of ${symbol} is $${result.regularMarketPrice}`;
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return "Failed to fetch stock data. Please check the stock symbol.";
    }
  }
}
