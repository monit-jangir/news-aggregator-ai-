import { symbol } from "zod";
import { StockMarketTool } from "./StockMarketTool.js"; // Ensure this file exists

async function main() {
    const tool = new StockMarketTool();
    try {
        const stockData = tool.run({symbol:"AAPL"}); // Remove 'await' here
        console.log("Stock Data:", stockData);
    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}

main();
