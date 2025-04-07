'use server'
import { moviesSchema } from "@/lib/graphSchema"
import { queryNeo4j } from "@/lib/neo4j"

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'tool'
  content: string
  timestamp: string
  isError?: boolean
  isToolCall?: boolean
}

interface ChatResponse {
  messages: ChatMessage[]
  totalMessages: number
}

type ReplyResponse = {
    action: "reply";
    content: string;
}
type QueryGraphResponse = {
    action: "graph_query";
    query: string;
}

const fakeResponse = (messages: ChatMessage[]): ReplyResponse | QueryGraphResponse => {
    const isUserMessage = messages.slice(-1)[0].role === "user"
    if (isUserMessage && messages.slice(-1)[0].content.includes("matrix")) {
        return {
            action: "graph_query",
            query: "MATCH (m:Movie {title: 'The Matrix'})-[r:ACTED_IN|DIRECTED]-(p:Person) RETURN m, r, p"
        }
    } else if (isUserMessage && messages.slice(-1)[0].content.includes("keanu")) {
        return {
            action: "graph_query",
            query: "MATCH (p:Person {name: 'Keanu Reeves'})-[r:ACTED_IN]-(m:Movie) RETURN p, r, m"
        }
    } else if (messages.slice(-1)[0].isError) {
        return {
            action: "graph_query",
            query: messages.slice(-2)[0].content
        }
    } else if (messages.slice(-1)[0].role === "tool") {
        return {
            action: "reply",
            content: `Here's what I found: ${messages.slice(-1)[0].content}`
        }
    }

    return {
        action: "reply",
        content: "I can help you find information about movies, actors and their relationships. Try asking about specific movies or actors!"
    }
}

export async function streamChatResponse(messages: ChatMessage[]): Promise<ReadableStream> {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
        const workingContext: ChatMessage[] = []
        while (true) {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 250));
            if (workingContext.length > 10) {
                const completion: ChatMessage = {
                    id: `error-${workingContext.length}`,
                    role: 'assistant',
                    content: "I encountered too many errors, please try again",
                    timestamp: new Date().toISOString(),
                };
                controller.enqueue(encoder.encode(JSON.stringify(completion) + '\n'));
                controller.close();
                return;
            }
            const response = fakeResponse([...messages, ...workingContext])
            console.log("=======INPUT========")
            console.log(`... ${workingContext.length - 1} other messages...`)
            console.log(JSON.stringify([workingContext.slice(-1)[0]], null, 2))
            console.log("=======OUTPUT========")
            console.log(JSON.stringify(response, null, 2))

            if (response.action === "reply") {
                const completion = JSON.stringify({
                    type: 'complete',
                    content: {
                        content: response.content
                    }
                });
                controller.enqueue(encoder.encode(completion + '\n'));
                controller.close();
                return;
            } else if (response.action === "graph_query") {
                const completion = JSON.stringify({
                    type: 'graph_query',
                    content: {
                        query: response.query
                    }
                });
                controller.enqueue(encoder.encode(completion + '\n'));

                // add the query to the working context
                workingContext.push({
                    id: `query-${workingContext.length}`,
                    role: 'assistant',
                    content: response.query,
                    timestamp: new Date().toISOString()
                })

                // go do the query
                try {
                    const result = await queryNeo4j(response.query)   
                    const resultMessage: ChatMessage = {
                        id: `result-${workingContext.length}`,
                        role: 'tool',
                        content: JSON.stringify(result, null, 2),
                        timestamp: new Date().toISOString()
                    }
                    workingContext.push(resultMessage)
                    controller.enqueue(encoder.encode(JSON.stringify(resultMessage) + '\n'));
                    // back to top with result
                    continue;
                } catch (e: any) {
                    const errorMessage: ChatMessage = {
                        id: `error-${workingContext.length}`,
                        role: 'tool',
                        content: e.message,
                        isError: true,
                        timestamp: new Date().toISOString()
                    }
                    workingContext.push(errorMessage)
                    controller.enqueue(encoder.encode(JSON.stringify(errorMessage) + '\n'));
                    // back to top with error
                    continue;
                }
            }
        }
    }
  });

  return stream;
}
