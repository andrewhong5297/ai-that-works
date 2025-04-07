'use server'
// import { b, Message } from "@/baml_client"
import { moviesSchema } from "@/lib/graphSchema"

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'tool'
  content: string
  timestamp: string
  // for the UI
  isError?: boolean
  isToolCall?: boolean
}

interface ChatResponse {
  messages: ChatMessage[]
  totalMessages: number
}

let queryCount = 0;

const queryNeo4j = (query: string) => {
    queryCount++;
    if (queryCount % 2 === 0) {
        throw new Error("Error connecting to database")
    }
    return JSON.stringify([{
        type: "movie",
        title: "The Matrix",
        year: 1999,
        rating: 8.7,
        description: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
        edges: [
            {
                type: "starred_by",
                nodes: [
                    {
                        type: "actor",
                        name: "Keanu Reeves",
                        description: "The actor who played Neo"
                    },
                    {
                        type: "actor",
                        name: "Carrie-Anne Moss",
                        description: "The actress who played Trinity"
                    }
                ]
            }
        ]
    }]);
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
            query: "MATCH (m:Movie {title: 'The Matrix'}) RETURN m"
        }
    } else if (isUserMessage && messages.slice(-1)[0].content.includes("keanu")) {
        return {
            action: "graph_query",
            query: "MATCH (a:Actor {name: 'Keanu Reeves'}) RETURN a"
        }
    } else if (messages.slice(-1)[0].isError) {
        return {
            action: "graph_query",
            query: messages.slice(-2)[0].content
        }
    } else if (messages.slice(-1)[0].role === "tool") {
        return {
            action: "reply",
            content: `heres what I got: ${messages.slice(-1)[0].content}`
        }
    }

    return {
        action: "reply",
        content: "Sorry I can only help with questions about the matrix"
    }
}
export async function streamChatResponse(messages: ChatMessage[]): Promise<ReadableStream> {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
        const workingContext: ChatMessage[] = []
        while (true) {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 250));
            const response = fakeResponse([...messages, ...workingContext])
            console.log("=======INPUT========")
            console.log(`... ${workingContext.length - 1} other messages...`)
            console.log(JSON.stringify([workingContext.slice(-1)[0]], null, 2))
            console.log("=======OUTPUT========")
            console.log(JSON.stringify(response, null, 2))

            // const messagesForBaml: Message[] = [...messages, ...workingContext].map(m => ({
            //     // tool messages are basically user messages - we track "tool" differently so we can show them in the UI
            //     role: m.role === "assistant" ? "assistant" : "user",
            //     content: m.content
            // }))
            // const response = await b.ChatWithGraph(messagesForBaml, moviesSchema)
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
                    const result = queryNeo4j(response.query)   
                    // fake a delay
                    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 250));
                    const resultMessage: ChatMessage = {
                        id: `result-${workingContext.length}`,
                        role: 'tool',
                        content: JSON.stringify(JSON.parse(result), null, 2),
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
