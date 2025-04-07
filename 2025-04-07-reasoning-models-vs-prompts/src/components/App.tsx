"use client";
import { useState } from "react";
import { streamChatResponse } from "@/actions/chat";
import type { ChatMessage } from "@/actions/chat";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to MovieBot! I can answer questions about movies.',
      timestamp: '2024-04-07T00:00:00.000Z'
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showDebug, setShowDebug] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    // Update messages with user message first
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage("");
    setIsStreaming(true);

    try {
      const stream = await streamChatResponse(updatedMessages);
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const events = chunk.split('\n').filter(Boolean);

        for (const event of events) {
          const data = JSON.parse(event);
          
          if (data.type === 'complete') {
            const assistantMessage: ChatMessage = {
              id: Date.now().toString(),
              role: 'assistant',
              content: data.content.content,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, assistantMessage]);
          } else if (data.type === 'graph_query') {
            const queryMessage: ChatMessage = {
              id: `query-${Date.now()}`,
              role: 'assistant',
              content: `Querying the database: ${data.content.query}`,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, queryMessage]);
          } else if (data.type === 'graph_result') {
            const resultMessage: ChatMessage = {
              id: `result-${Date.now()}`,
              role: 'assistant',
              content: `Database result: ${data.content}`,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, resultMessage]);
          } else if (data.type === 'graph_error') {
            const errorMessage: ChatMessage = {
              id: `error-${Date.now()}`,
              role: 'assistant',
              content: `Error: ${data.content}`,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
          }
        }
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, there was an error processing your message.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* Main content that will compress */}
      <div className={`flex-1 transition-all duration-300 ${showDebug ? 'mr-[500px]' : 'mr-[40px]'}`}>
        <div className="max-w-[1600px] mx-auto px-4 py-4 sm:px-6 lg:px-8">
          {/* Chat Box */}
          <div className="bg-white rounded-lg shadow-sm flex flex-col">
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold text-gray-900">MovieBot Chat</h1>
            </div>
            
            <div className="h-[70vh] overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {message.role === 'user' ? 'You' : 'Assistant'}
                        </span>
                        <span className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask about movies..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isStreaming}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isStreaming}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isStreaming ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Section */}
      <div className={`fixed right-0 top-0 h-full transition-transform duration-300 ease-in-out ${showDebug ? 'translate-x-0' : 'translate-x-[460px]'}`}>
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-gray-800 text-white px-2 py-4 rounded-l-lg hover:bg-gray-700 shadow-lg"
          aria-label={showDebug ? 'Hide Debug Panel' : 'Show Debug Panel'}
        >
          {showDebug ? '→' : '←'}
        </button>
        <div className="w-[500px] h-full bg-gray-800 shadow-2xl">
          <div className="p-4 h-full flex flex-col">
            <h2 className="text-sm font-mono text-gray-400 mb-2 flex items-center justify-between">
              Debug Messages
              <span className="text-xs text-gray-500">{messages.length} messages</span>
            </h2>
            <pre className="text-xs font-mono text-gray-300 overflow-auto flex-1 bg-gray-900 rounded p-4">
              {JSON.stringify(messages, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
