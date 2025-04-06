class Message {
    role "user" | "assistant"
    content string
}

class GraphQuery {
    action "graph_query" @stream.not_null
    query string @description(#"
        a Cypher query to run on the graph
    "#) @stream.not_null
}


class Response {
    action "reply" @stream.not_null
    response string @description(#"
        The response to the user
    "#) @stream.not_null
}

function ChatWithGraph(messages: Message[], schema: string) -> Response | GraphQuery {
  client "openai/gpt-4o-mini"
  prompt #"
    Try and help the user out.

    I have access to a neo4j graph database of movies and their relationships.
    {{ schema }}

    {{ ctx.output_format }}

    {% for m in messages %}
    {{ _.role(m.role) }}
    {{ m.content }}
    {% endfor %}
  "#
}

test TestName {
  functions [ChatWithGraph]
  args {
    messages [
      {
        role "user"
        content "What are the top 10 movies?"
      }
    ]
  }
}
