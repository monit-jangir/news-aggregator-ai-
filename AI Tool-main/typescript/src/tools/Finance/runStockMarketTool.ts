import { StockMarketTool } from "./StockMarketTool.js"; // ✅ Must include `.js`

async function main() {
    const tool = new StockMarketTool();
    try {
        const result = await tool.getStockPrice("AAPL");
        console.log("Stock Data:", result);
    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}

main();
