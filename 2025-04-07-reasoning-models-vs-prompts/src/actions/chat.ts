"use server";

import { moviesSchema } from "@/lib/graphSchema";
import { Neo4jSession } from "@/lib/neo4j";
import { b } from "@/baml_client";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  timestamp: string;
  isError?: boolean;
  isToolCall?: boolean;
}

export async function streamChatResponse(
  messages: ChatMessage[]
): Promise<ReadableStream> {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const neo4jSession = new Neo4jSession();
      try {
        const sendEvent = (event: string) => {
          controller.enqueue(encoder.encode(`${event}\n\n`));
        };

        const workingContext: ChatMessage[] = [];
        while (true) {
          if (workingContext.length > 40) {
            const completion: ChatMessage = {
              id: `error-${workingContext.length}`,
              role: "assistant",
              content: "I encountered too many errors, please try again",
              timestamp: new Date().toISOString(),
            };
            sendEvent(JSON.stringify({
              type: "complete",
              content: {
                content: completion.content,
              },
            }));
            controller.close();
            return;
          }
          const response = await b.ChatWithGraph(
            [...messages, ...workingContext],
            moviesSchema
          );
          console.log("=======INPUT========");
          console.log(`... ${workingContext.length - 1} other messages...`);
          console.log(JSON.stringify([workingContext.slice(-1)[0]], null, 2));
          console.log("=======OUTPUT========");
          console.log(JSON.stringify(response, null, 2));

          if (response.action === "reply") {
            sendEvent(
              JSON.stringify({
                type: "complete",
                content: {
                  content: response.response,
                },
              })
            );
            controller.close();
            return;
          }
          response.action satisfies "graph_query";
          const reasoningEvent = JSON.stringify({
            type: "reasoning",
            content: {
              initial_reasoning: response.initial_reasoning,
              problems_with_initial_reasoning: response.problems_with_initial_reasoning,
              improved_reasoning: response.improved_reasoning,
            },
          });
          sendEvent(reasoningEvent);

          const completion = JSON.stringify({
            type: "graph_query",
            content: {
              query: response.query,
            },
          });
          sendEvent(completion);

          // add the query to the working context
          workingContext.push({
            id: `query-${workingContext.length}`,
            role: "assistant",
            content: response.query,
            timestamp: new Date().toISOString(),
          });

          // go do the query
          try {
            const result = await neo4jSession.run(response.query);
            const resultMessage: ChatMessage = {
              id: `result-${workingContext.length}`,
              role: "tool",
              content: JSON.stringify(result, null, 2),
              timestamp: new Date().toISOString(),
            };
            workingContext.push(resultMessage);
            if (result.length === 0) {
              const errorMessage: ChatMessage = {
                id: `error-${workingContext.length}`,
                role: "tool",
                content: "Hmm, seems like the query didn't return any results perhaps its wrong? or misspelled, should we ask the user for more information?",
                timestamp: new Date().toISOString(),
              };
              workingContext.push(errorMessage);
              sendEvent(JSON.stringify(errorMessage));
            }
            sendEvent(JSON.stringify(resultMessage));
            // back to top with result
          } catch (e: unknown) {
            const errorMessage: ChatMessage = {
              id: `error-${workingContext.length}`,
              role: "tool",
              content: e instanceof Error ? e.message : String(e),
              isError: true,
              timestamp: new Date().toISOString(),
            };
            workingContext.push(errorMessage);
            sendEvent(JSON.stringify(errorMessage));
            // back to top with error
          }
        }
      } finally {
        await neo4jSession.close();
      }
    },
  });

  return stream;
}
