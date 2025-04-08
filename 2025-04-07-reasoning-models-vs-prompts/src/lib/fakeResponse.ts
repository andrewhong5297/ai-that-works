import { ChatMessage } from "@/actions/chat"

export type ReplyResponse = {
    action: "reply";
    content: string;
}

export type QueryGraphResponse = {
    action: "graph_query";
    query: string;
}

export const fakeResponse = (messages: ChatMessage[]): ReplyResponse | QueryGraphResponse => {
    const isUserMessage = messages.slice(-1)[0].role === "user"
    if (isUserMessage && messages.slice(-1)[0].content.includes("matrix")) {
        return {
            action: "graph_query",
            query: "MATCH (m:Movie)<-[:RATED]-(u:User) WHERE m.title CONTAINS 'Matrix' WITH m, count(*) AS reviews RETURN m.title AS movie, reviews ORDER BY reviews DESC LIMIT 5"
        }
    } else if (isUserMessage && messages.slice(-1)[0].content.includes("keanu")) {
        return {
            action: "graph_query",
            query: "MATCH (p:Person {name: 'Keanu Reeves'})-[r:ACTED_IN]->(m:Movie) RETURN p.name as actor, m.title as movie, m.year as year ORDER BY m.year DESC"
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