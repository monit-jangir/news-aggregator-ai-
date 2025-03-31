console.log("Starting News Aggregator Tool...");

import { NewsAggregatorTool } from "./NewsAggregatorTool.js";

console.log("Import successful! Initializing tool...");

async function run() {
    try {
        const newsTool = new NewsAggregatorTool();
        console.log("Fetching news...");

        const headlines = await newsTool.getNews("sports");

        console.log("Latest Sports News:", headlines);
    } catch (error) {
        console.error("Error running News Aggregator Tool:", error);
    }
}

run();
