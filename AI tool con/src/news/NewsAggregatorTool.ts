import { Tool } from "beeai-framework";
import NewsAPI from "newsapi";

export class NewsAggregatorTool extends Tool<{ topic: string }, string, {}> {
  name = "NewsAggregatorTool";
  description = "Fetches latest news articles for a given topic.";

  private newsapi = new NewsAPI("6eb4403b69974ba79547db4c1770b93e");

  getInputJsonSchema() {
    return {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "News topic to search for (e.g., technology, sports, business)",
        },
      },
      required: ["topic"],
    };
  }

  async run(input: { topic: string }, context: any) {
    try {

      console.log(`Fetching news for topic: ${input.topic}`);
      const response = await this.newsapi.v2.topHeadlines({
        q: input.topic,
        language: "en",
        pageSize: 5,
      });
      
      console.log(response)

      if (!response?.articles?.length) {
        return { result: `No news found for topic: ${input.topic}`, context };
      }

      const formattedNews = response.articles
        .map((article, index) => `${index + 1}. ${article.title} - ${article.source.name}`)
        .join("\n");
      console.log(formattedNews)
      return { result: `Top news for "${input.topic}":\n${formattedNews}`, context };
    } catch (error: any) {
      console.error("Error fetching news:", error);
      return { result: `Failed to fetch news for "${input.topic}". Error: ${error.message}`, context };
    }
  }
}