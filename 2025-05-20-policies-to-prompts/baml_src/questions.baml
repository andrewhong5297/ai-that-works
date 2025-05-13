// Defining a data model.
class Question {
  question string @description("A binary question that can be answered to determine whether the rule was followed")
}

// Create a function to extract the resume from a string.
function ExtractQuestions(document: string) -> Question[] {
  // Specify a client as provider/model-name
  // you can use custom LLM params with a custom client name from clients.baml like "client CustomHaiku"
  client "openai/gpt-4o" // Set OPENAI_API_KEY to use this client.
  prompt #"

    You are a compliance expert. You read
    policy documents and create questions
    for an auditor to answer. The questions
    should be binary questions that can be
    answered to determine whether the rule
    was followed.

    The document will have many rules, output
    questions for all of them.

    {{ _.role("user") }}

    Here is the document you are auditing:

    {{ document }}

    {{ ctx.output_format }}
  "#
}



// Test the function with a sample resume. Open the VSCode playground to run this.
test vaibhav_resume {
  functions [ExtractResume]
  args {
    resume #"
      Vaibhav Gupta
      vbv@boundaryml.com

      Experience:
      - Founder at BoundaryML
      - CV Engineer at Google
      - CV Engineer at Microsoft

      Skills:
      - Rust
      - C++
    "#
  }
}
