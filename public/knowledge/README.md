# Knowledge Base for AI Trading Assistant

This folder contains PDF files and documents that will be used to train and provide context to the AI Trading Assistant chatbot.

## Purpose

The AI assistant will use these documents to:
- Answer trading-related questions
- Provide candlestick pattern analysis
- Offer risk management advice
- Explain trading strategies
- Guide beginners through market concepts

## Recommended Documents to Add

1. **Trading Basics**
   - `trading-basics.pdf` - Fundamental trading concepts
   - `market-terminology.pdf` - Common trading terms

2. **Technical Analysis**
   - `candlestick-patterns.pdf` - Complete guide to candlestick patterns
   - `chart-analysis.pdf` - Reading and interpreting charts
   - `technical-indicators.pdf` - Moving averages, RSI, MACD, etc.

3. **Risk Management**
   - `risk-management.pdf` - Position sizing, stop losses
   - `psychology-of-trading.pdf` - Emotional discipline

4. **Strategy Documents**
   - `day-trading-strategies.pdf`
   - `swing-trading-strategies.pdf`

## AI Integration (Future)

### Claude AI Integration
```javascript
// Example integration with Claude API
const response = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  system: `You are an expert trading advisor. Use the following knowledge base: ${knowledgeBaseContext}`,
  messages: [
    { role: "user", content: userQuestion }
  ]
});
```

### Gemini AI Integration
```javascript
// Example integration with Gemini API
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const result = await model.generateContent({
  contents: [{
    role: 'user',
    parts: [{ text: userQuestion }]
  }],
  systemInstruction: `You are a trading advisor with access to: ${knowledgeBaseContext}`
});
```

## File Format Guidelines

- Use **PDF format** for all documents
- Keep file sizes reasonable (< 10MB each)
- Name files descriptively with lowercase and hyphens
- Organize by category if needed

## Usage in App

The chatbot will:
1. Load PDF documents from this folder
2. Extract and index the content
3. Use RAG (Retrieval Augmented Generation) to answer questions
4. Provide citations to specific documents when relevant
