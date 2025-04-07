'use server'
// import { b } from "@/baml_client"

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


const queryNeo4j = (query: string) => {
    if (Math.random() > 0.5) {      
        throw new Error("Not implemented")
    }
    return `results: [{
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
    }]`
}

const fakeResponse = () => {
    return {
        action: "reply",
        content: "Hello, how are you?"
    }
}
export async function streamChatResponse(messages: ChatMessage[]): Promise<ReadableStream> {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
        const workingContext: ChatMessage[] = []
        while (true) {
            // const response = await b.ChatWithGraph([...messages, ...workingContext], movies_schema)
            const response = fakeResponse()
            if (response.action === "reply") {
            
                const completion = JSON.stringify({
                    type: 'complete',
                    content: response
                });
                controller.enqueue(encoder.encode(completion + '\n'));
                controller.close();
                return ;
            } else if (response.action === "graph_query") {
                const completion = JSON.stringify({
                    type: 'graph_query',
                    content: response
                });
                controller.enqueue(encoder.encode(completion + '\n'));

                // add the query to the working context
                workingContext.push({
                    id: `query-${workingContext.length}`,
                    role: 'assistant',
                    content: `cypher: ${response.query}`,
                    timestamp: new Date().toISOString()
                })


                // go do the query
                try {
                    const result = queryNeo4j(response.query)   
                    const resultMessage = JSON.stringify({
                        type: 'graph_result',
                        content: result
                    })
                    controller.enqueue(encoder.encode(resultMessage + '\n'));
                    // back to top with result
                    continue;
                } catch (e) {
                    const errorMessage = JSON.stringify({
                        type: 'graph_error',
                        content: `error: ${e}`
                    })
                    workingContext.push({
                        id: `error-${workingContext.length}`,
                        role: 'assistant',
                        content: `error: ${e}`,
                        timestamp: new Date().toISOString()
                    })
                    controller.enqueue(encoder.encode(errorMessage + '\n'));
                    // back to top with error
                    continue;
                }
            }
        }
    }
  });

  return stream;
}
