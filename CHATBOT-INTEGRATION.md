# AI Chatbot Integration Guide

This document outlines how to integrate Claude AI or Gemini AI into the Candle Master trading simulator.

## Overview

The AI Trading Assistant is designed to help beginner traders by:
- Analyzing candlestick patterns in real-time
- Providing trading advice based on current market conditions
- Answering questions about trading strategies
- Offering risk management guidance

## Architecture

```
┌─────────────────┐
│   User Input    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Chat Component │
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Route     │
│  (Backend/API)  │
└────────┬────────┘
         │
         ├──► Knowledge Base PDFs
         │
         ▼
┌─────────────────┐
│  Claude/Gemini  │
│      API        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AI Response   │
└─────────────────┘
```

## Option 1: Claude AI Integration

### Installation

```bash
npm install @anthropic-ai/sdk
```

### Environment Variables

Create a `.env` file:
```env
VITE_CLAUDE_API_KEY=your_api_key_here
```

### Implementation

Create `src/services/claudeService.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendMessageToClaude(
  messages: ChatMessage[],
  currentChartData?: any
): Promise<string> {
  try {
    const systemPrompt = `You are an expert trading advisor and mentor for the Candle Master app.

Your role:
- Analyze candlestick patterns and provide insights
- Teach beginners about technical analysis
- Offer risk management advice
- Explain trading strategies clearly
- Be encouraging but realistic about trading risks

Current context:
${currentChartData ? `User is viewing: ${JSON.stringify(currentChartData)}` : 'No chart data available'}

Guidelines:
- Keep responses concise (2-3 paragraphs max)
- Use emojis sparingly and appropriately
- Focus on education, not financial advice
- Always emphasize risk management`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    return response.content[0].type === 'text'
      ? response.content[0].text
      : 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to get response from AI');
  }
}
```

## Option 2: Gemini AI Integration

### Installation

```bash
npm install @google/generative-ai
```

### Environment Variables

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### Implementation

Create `src/services/geminiService.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function sendMessageToGemini(
  message: string,
  chatHistory: any[] = [],
  currentChartData?: any
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const systemInstruction = `You are an expert trading advisor for the Candle Master app.

Current context:
${currentChartData ? `Chart data: ${JSON.stringify(currentChartData)}` : ''}

Focus on:
- Teaching candlestick pattern recognition
- Explaining trading concepts clearly
- Providing risk management guidance
- Being supportive but realistic`;

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get response from AI');
  }
}
```

## Updating the Chat Component

Modify `src/App.tsx` to integrate the AI service:

```typescript
// Add state for chat messages
const [messages, setMessages] = useState<Array<{role: string; content: string}>>([]);
const [inputValue, setInputValue] = useState('');
const [isLoading, setIsLoading] = useState(false);

// Handle send message
const handleSendMessage = async () => {
  if (!inputValue.trim() || isLoading) return;

  const userMessage = inputValue.trim();
  setInputValue('');

  // Add user message
  setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

  setIsLoading(true);
  try {
    // Get chart context
    const chartContext = {
      currentPrice: currentCandle?.close,
      balance: displayBalance,
      position: position?.type,
      recentCandles: visibleData.slice(-5)
    };

    // Choose your AI service
    const response = await sendMessageToClaude(
      [...messages, { role: 'user', content: userMessage }],
      chartContext
    );

    // Add AI response
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  } catch (error) {
    console.error('Error:', error);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.'
    }]);
  } finally {
    setIsLoading(false);
  }
};
```

## Knowledge Base Integration (RAG)

For more advanced context:

```bash
npm install pdf-parse
```

```typescript
// Load and parse PDFs
import pdfParse from 'pdf-parse';

async function loadKnowledgeBase() {
  const pdfFiles = [
    '/knowledge/trading-basics.pdf',
    '/knowledge/candlestick-patterns.pdf',
    '/knowledge/risk-management.pdf'
  ];

  const knowledgeText = await Promise.all(
    pdfFiles.map(async (file) => {
      const response = await fetch(file);
      const buffer = await response.arrayBuffer();
      const data = await pdfParse(Buffer.from(buffer));
      return data.text;
    })
  );

  return knowledgeText.join('\n\n');
}

// Include in system prompt
const knowledgeBase = await loadKnowledgeBase();
const systemPrompt = `You are a trading advisor with access to:
${knowledgeBase}

Use this knowledge to answer questions accurately.`;
```

## Security Considerations

⚠️ **Important**:
- Never commit API keys to Git
- Use environment variables for all secrets
- Consider using a backend proxy to hide API keys from frontend
- Implement rate limiting to prevent abuse
- Add user authentication before production

## Testing

```typescript
// Test file: src/services/__tests__/chatService.test.ts
describe('AI Chat Service', () => {
  it('should return valid response', async () => {
    const response = await sendMessageToClaude([
      { role: 'user', content: 'What is a hammer candlestick?' }
    ]);
    expect(response).toBeTruthy();
  });
});
```

## Next Steps

1. ✅ Set up Knowledge Base folder
2. ⬜ Choose AI provider (Claude or Gemini)
3. ⬜ Add API key to environment
4. ⬜ Implement chat service
5. ⬜ Connect to Chat component
6. ⬜ Add PDF knowledge base files
7. ⬜ Test with real trading scenarios
8. ⬜ Deploy with proper security

## Resources

- [Claude API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [RAG Implementation Guide](https://www.anthropic.com/index/retrieval-augmented-generation)
