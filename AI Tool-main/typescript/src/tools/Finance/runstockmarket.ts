import { StockMarketTool } from "./StockMarketTool.js"; // Ensure this file exists

async function main() {
    const tool = new StockMarketTool();
    try {
        const stockData = tool.getStockPrice("AAPL"); // Remove 'await' here
        console.log("Stock Data:", stockData);
    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}

main();
