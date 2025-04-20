 🐝 MONIT-AI: Enhanced BeeAI with News Aggregator Agent

MONIT-AI is a customized fork of the BeeAI framework — a modular, agent-based AI assistant platform. This version introduces a powerful **News Aggregator Agent** that fetches and summarizes the latest news articles in real-time, making the assistant even more informative and helpful.

## 🚀 What's New?

- 📰 **News Aggregator Agent**: 
  - Retrieves current headlines using news APIs or web scraping
  - Summarizes and categorizes news into topics
  - Integrated into the existing BeeAI agent pipeline

## 🔧 Built on BeeAI Framework

BeeAI is a composable LangChain-based agent framework that supports:

- Modular agent design (e.g., LoggingAgent, WebSearchAgent, and now NewsAgent)
- Flexible memory and conversation history
- CLI interface and extensible backend

## 📁 Directory Structure

```
MONIT-AI/
├── agents/
│   ├── LoggingAgent.py
│   └── NewsAggregatorAgent.py    # 🆕 Newly added news agent
├── main.py
├── prompts/
├── utils/
├── logs/
├── requirements.txt
└── README.md
```

## 🚀 Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/monit-jangir/MONIT-AI.git
   cd MONIT-AI
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Assistant**
   ```bash
   python main.py
   ```

## 🌐 News Aggregator Usage

Once launched, you can ask questions like:

- *"Show me the latest tech news."*
- *"What’s happening in world politics today?"*
- *"Summarize today’s top headlines."*

## 🔮 Future Plans

- GUI-based interface
- Voice commands
- Caching of trending topics
- Real-time news notifications

## 🤝 Contributing

Want to add more agents or improve the News Aggregator? Fork the repo, make changes, and submit a PR!

## 👤 Author

**Monit Jangir**  
📧 [monitjangir@gmail.com](mailto:monitjangir@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/monit-jangir/)

