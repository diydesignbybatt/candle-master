# Services Directory

This folder contains service modules for external API integrations and business logic.

## Planned Services

### 1. `chatService.ts` (To be implemented)
AI chatbot integration service.

**Features:**
- Send messages to AI (Claude or Gemini)
- Maintain chat history
- Provide trading context to AI
- Handle API errors gracefully

**Usage:**
```typescript
import { sendMessage } from './services/chatService';

const response = await sendMessage(userMessage, chatHistory, chartContext);
```

### 2. `knowledgeBaseService.ts` (To be implemented)
Load and parse PDF knowledge base files.

**Features:**
- Load PDFs from `/public/knowledge/`
- Extract text content
- Index for quick retrieval
- Support RAG (Retrieval Augmented Generation)

**Usage:**
```typescript
import { loadKnowledgeBase, searchKnowledge } from './services/knowledgeBaseService';

const knowledgeContext = await searchKnowledge('candlestick patterns');
```

### 3. `storageService.ts` (Optional)
Enhanced local storage management.

**Features:**
- Typed localStorage wrappers
- Data encryption (for sensitive info)
- Auto-expiration
- Data migration helpers

**Usage:**
```typescript
import { save, load, clear } from './services/storageService';

save('user-settings', { theme: 'dark', sound: true });
const settings = load('user-settings');
```

## File Structure (When Implemented)

```
src/services/
├── README.md (this file)
├── chatService.ts          # AI integration (Claude/Gemini)
├── knowledgeBaseService.ts # PDF parsing and RAG
├── storageService.ts       # Enhanced localStorage
└── __tests__/
    ├── chatService.test.ts
    └── knowledgeBaseService.test.ts
```

## Implementation Priority

1. **Phase 1 (Basic Chat):**
   - Implement `chatService.ts` with Claude/Gemini
   - Basic message handling
   - Error handling

2. **Phase 2 (Enhanced Context):**
   - Add chart context to messages
   - Implement `knowledgeBaseService.ts`
   - RAG for better responses

3. **Phase 3 (Advanced Features):**
   - Chat history persistence
   - Multi-turn conversations
   - Custom training on user's trading patterns

## Getting Started

See `CHATBOT-INTEGRATION.md` in the project root for detailed implementation guide.
