'use server'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatResponse {
  messages: ChatMessage[]
  totalMessages: number
}

export async function getMockChatData(): Promise<ChatResponse> {
  // Simulate a delay to mimic real API behavior
  await new Promise(resolve => setTimeout(resolve, 1000))

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      role: 'user',
      content: 'Hello! How can you help me today?',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      role: 'assistant',
      content: 'I can help you with various tasks like coding, writing, analysis, and more. What would you like to work on?',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      role: 'user',
      content: 'Can you help me with some coding?',
      timestamp: new Date().toISOString()
    },
    {
      id: '4',
      role: 'assistant',
      content: 'Of course! I can help you with coding in various languages and frameworks. What specific programming task would you like assistance with?',
      timestamp: new Date().toISOString()
    }
  ]

  return {
    messages: mockMessages,
    totalMessages: mockMessages.length
  }
}

export async function streamChatResponse(message: string): Promise<ReadableStream> {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Simulate typing effect
      const response = "I'm processing your message: " + message;
      for (let i = 0; i < response.length; i++) {
        const chunk = response.slice(0, i + 1);
        const data = JSON.stringify({
          type: 'chunk',
          content: chunk
        });
        controller.enqueue(encoder.encode(data + '\n'));
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate typing speed
      }

      // Send completion event
      const completion = JSON.stringify({
        type: 'complete',
        content: response
      });
      controller.enqueue(encoder.encode(completion + '\n'));
      controller.close();
    }
  });

  return stream;
}
