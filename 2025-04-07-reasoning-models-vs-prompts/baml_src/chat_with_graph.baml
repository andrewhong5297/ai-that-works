class Message {
    role "user" | "assistant" | "tool"
    content string
}

class GraphQuery {
    action "graph_query" @stream.not_null
    query string @description(#"
        a Cypher query to run on the graph
    "#) @stream.not_null
    initial_reasoning string @description(#"
      short summary of the initial reasoning for the query to display to the user

    "#)
    problems_with_initial_reasoning string @description(#"
      short summary of the problems with the initial reasoning for the query to display to the user

    "#)
    improved_reasoning string @description(#"
      short summary of the improved reasoning for the query to display to the user
    "#)
}

class NotRelevant {
    action "not_relevant" @stream.not_null
    reasoning string @description(#"
        a short message to the user summarizing why the query is not relevant
    "#)
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
    Try and help the user out, as long as its about the schema.

    I have access to a neo4j graph database of movies and their relationships.
    {{ schema }}

    {% for m in messages %}
    {{ _.role(m.role) }}
    {{ m.content }}
    {% endfor %}


    {{ _.role('system') }}
    {{ ctx.output_format }}

    {% if true %}
    Before answering, note what is useful and particularly hard, 
    or things that indicate the user is not using the schema.
    example:

    Initial reasoning: 
    ...
    ```cypher
    ...
    ```

    Problems with initial reasoning:
    ...

    Improved reasoning:
    ...
    ```cypher
    ...
    ```


    { ... } // schema
    {% endif %}
  "#
}

test TestName {
  functions [ChatWithGraph]
  args {
    messages [
      {
        role "user"
        content "how do i make cookies?"
      }
    ]
    schema #"
{
  "nodes": [
    {
      "name": "_Bloom_Perspective_",
      "indexes": [],
      "constraints": [
        "Constraint( id=3, name='constraint_f7832722', type='UNIQUENESS', schema=(:_Bloom_Perspective_ {id}), ownedIndex=1 )"
      ]
    },
    {
      "name": "Movie",
      "indexes": [
        "year",
        "imdbRating",
        "released",
        "imdbId",
        "title",
        "tagline",
        "title,plot",
        "plotEmbedding",
        "posterEmbedding"
      ],
      "constraints": [
        "Constraint( id=77, name='constraint_737d9c1d', type='UNIQUENESS', schema=(:Movie {tmdbId}), ownedIndex=61 )",
        "Constraint( id=75, name='constraint_3d5fcb7f', type='UNIQUENESS', schema=(:Movie {movieId}), ownedIndex=59 )"
      ]
    },
    {
      "name": "User",
      "indexes": [
        "name"
      ],
      "constraints": [
        "Constraint( id=76, name='constraint_3b27b0', type='UNIQUENESS', schema=(:User {userId}), ownedIndex=64 )"
      ]
    },
    {
      "name": "Actor",
      "indexes": [],
      "constraints": []
    },
    {
      "name": "Director",
      "indexes": [],
      "constraints": []
    },
    {
      "name": "Genre",
      "indexes": [],
      "constraints": [
        "Constraint( id=74, name='constraint_f8689281', type='UNIQUENESS', schema=(:Genre {name}), ownedIndex=62 )"
      ]
    },
    {
      "name": "Person",
      "indexes": [
        "name,bio",
        "name"
      ],
      "constraints": [
        "Constraint( id=73, name='constraint_4499eae9', type='UNIQUENESS', schema=(:Person {tmdbId}), ownedIndex=63 )"
      ]
    },
    {
      "name": "_Bloom_Scene_",
      "indexes": [],
      "constraints": []
    }
  ],
  "relationships": [
    [
      {
        "name": "Person",
        "indexes": [
          "name,bio",
          "name"
        ],
        "constraints": [
          "Constraint( id=73, name='constraint_4499eae9', type='UNIQUENESS', schema=(:Person {tmdbId}), ownedIndex=63 )"
        ]
      },
      "ACTED_IN",
      {
        "name": "Movie",
        "indexes": [
          "year",
          "imdbRating",
          "released",
          "imdbId",
          "title",
          "tagline",
          "title,plot",
          "plotEmbedding",
          "posterEmbedding"
        ],
        "constraints": [
          "Constraint( id=77, name='constraint_737d9c1d', type='UNIQUENESS', schema=(:Movie {tmdbId}), ownedIndex=61 )",
          "Constraint( id=75, name='constraint_3d5fcb7f', type='UNIQUENESS', schema=(:Movie {movieId}), ownedIndex=59 )"
        ]
      }
    ],
    [
      {
        "name": "Actor",
        "indexes": [],
        "constraints": []
      },
      "ACTED_IN",
      {
        "name": "Movie",
        "indexes": [
          "year",
          "imdbRating",
          "released",
          "imdbId",
          "title",
          "tagline",
          "title,plot",
          "plotEmbedding",
          "posterEmbedding"
        ],
        "constraints": [
          "Constraint( id=77, name='constraint_737d9c1d', type='UNIQUENESS', schema=(:Movie {tmdbId}), ownedIndex=61 )",
          "Constraint( id=75, name='constraint_3d5fcb7f', type='UNIQUENESS', schema=(:Movie {movieId}), ownedIndex=59 )"
        ]
      }
    ],
    [
      {
        "name": "Director",
        "indexes": [],
        "constraints": []
      },
      "ACTED_IN",
      {
        "name": "Movie",
        "indexes": [
          "year",
          "imdbRating",
          "released",
          "imdbId",
          "title",
          "tagline",
          "title,plot",
          "plotEmbedding",
          "posterEmbedding"
        ],
        "constraints": [
          "Constraint( id=77, name='constraint_737d9c1d', type='UNIQUENESS', schema=(:Movie {tmdbId}), ownedIndex=61 )",
          "Constraint( id=75, name='constraint_3d5fcb7f', type='UNIQUENESS', schema=(:Movie {movieId}), ownedIndex=59 )"
        ]
      }
    ],
    [
      {
        "name": "User",
        "indexes": [
          "name"
        ],
        "constraints": [
          "Constraint( id=76, name='constraint_3b27b0', type='UNIQUENESS', schema=(:User {userId}), ownedIndex=64 )"
        ]
      },
      "RATED",
      {
        "name": "Movie",
        "indexes": [
          "year",
          "imdbRating",
          "released",
          "imdbId",
          "title",
          "tagline",
          "title,plot",
          "plotEmbedding",
          "posterEmbedding"
        ],
        "constraints": [
          "Constraint( id=77, name='constraint_737d9c1d', type='UNIQUENESS', schema=(:Movie {tmdbId}), ownedIndex=61 )",
          "Constraint( id=75, name='constraint_3d5fcb7f', type='UNIQUENESS', schema=(:Movie {movieId}), ownedIndex=59 )"
        ]
      }
    ],
    [
      {
        "name": "Movie",
        "indexes": [
          "year",
          "imdbRating",
          "released",
          "imdbId",
          "title",
          "tagline",
          "title,plot",
          "plotEmbedding",
          "posterEmbedding"
        ],
        "constraints": [
          "Constraint( id=77, name='constraint_737d9c1d', type='UNIQUENESS', schema=(:Movie {tmdbId}), ownedIndex=61 )",
          "Constraint( id=75, name='constraint_3d5fcb7f', type='UNIQUENESS', schema=(:Movie {movieId}), ownedIndex=59 )"
        ]
      },
      "IN_GENRE",
      {
        "name": "Genre",
        "indexes": [],
        "constraints": [
          "Constraint( id=74, name='constraint_f8689281', type='UNIQUENESS', schema=(:Genre {name}), ownedIndex=62 )"
        ]
      }
    ],
    [
      {
        "name": "Director",
        "indexes": [],
        "constraints": []
      },
      "DIRECTED",
      {
        "name": "Movie",
        "indexes": [
          "year",
          "imdbRating",
          "released",
          "imdbId",
          "title",
          "tagline",
          "title,plot",
          "plotEmbedding",
          "posterEmbedding"
        ],
        "constraints": [
          "Constraint( id=77, name='constraint_737d9c1d', type='UNIQUENESS', schema=(:Movie {tmdbId}), ownedIndex=61 )",
          "Constraint( id=75, name='constraint_3d5fcb7f', type='UNIQUENESS', schema=(:Movie {movieId}), ownedIndex=59 )"
        ]
      }
    ],
    [
      {
        "name": "Actor",
        "indexes": [],
        "constraints": []
      },
      "DIRECTED",
      {
        "name": "Movie",
        "indexes": [
          "year",
          "imdbRating",
          "released",
          "imdbId",
          "title",
          "tagline",
          "title,plot",
          "plotEmbedding",
          "posterEmbedding"
        ],
        "constraints": [
          "Constraint( id=77, name='constraint_737d9c1d', type='UNIQUENESS', schema=(:Movie {tmdbId}), ownedIndex=61 )",
          "Constraint( id=75, name='constraint_3d5fcb7f', type='UNIQUENESS', schema=(:Movie {movieId}), ownedIndex=59 )"
        ]
      }
    ],
    [
      {
        "name": "Person",
        "indexes": [
          "name,bio",
          "name"
        ],
        "constraints": [
          "Constraint( id=73, name='constraint_4499eae9', type='UNIQUENESS', schema=(:Person {tmdbId}), ownedIndex=63 )"
        ]
      },
      "DIRECTED",
      {
        "name": "Movie",
        "indexes": [
          "year",
          "imdbRating",
          "released",
          "imdbId",
          "title",
          "tagline",
          "title,plot",
          "plotEmbedding",
          "posterEmbedding"
        ],
        "constraints": [
          "Constraint( id=77, name='constraint_737d9c1d', type='UNIQUENESS', schema=(:Movie {tmdbId}), ownedIndex=61 )",
          "Constraint( id=75, name='constraint_3d5fcb7f', type='UNIQUENESS', schema=(:Movie {movieId}), ownedIndex=59 )"
        ]
      }
    ],
    [
      {
        "name": "_Bloom_Perspective_",
        "indexes": [],
        "constraints": [
          "Constraint( id=3, name='constraint_f7832722', type='UNIQUENESS', schema=(:_Bloom_Perspective_ {id}), ownedIndex=1 )"
        ]
      },
      "_Bloom_HAS_SCENE_",
      {
        "name": "_Bloom_Scene_",
        "indexes": [],
        "constraints": []
      }
    ]
  ]
}
    "#
  }
}
