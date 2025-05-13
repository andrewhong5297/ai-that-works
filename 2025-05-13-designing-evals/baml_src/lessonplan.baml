class LessonPlan {
  topic string @description("The main math topic for the lesson")
  learningObjectives string[] @description("Key concepts students should learn")
  activities string[] @description("Engaging activities to teach the concept")
  materials string[] @description("Required materials for the lesson")
  timeAllocation int @alias("time_allocation_mins")
  assessmentMethod string @description("How to check student understanding")
  differentiationStrategies string[] @description("Ways to adjust for different learning levels")
}

function CreateLessonPlan(topic: string) -> LessonPlan {
  client "anthropic/claude-3-5-sonnet-latest"
  prompt #"
    Create a detailed, age-appropriate math lesson plan for 3rd grade students.
    The lesson should be engaging, include hands-on activities, and accommodate different learning styles.
    Make sure the activities are fun and interactive for 8-9 year old students.

    {{ ctx.output_format }}

    {{ _.role("user") }} {{ topic }}
  "#
}

test MultiplicationLessonTest {
  functions [CreateLessonPlan]
  args {
    topic "multiplication tables up to 5"
  }
}

test FractionsLessonTest {
  functions [CreateLessonPlan]
  args {
    topic "introduction to basic fractions"
  }
}

class LessonPlanEvaluation {
  pacing "slow" | "medium" | "fast" @description("How fast the lesson is paced")
  biases string[] @description(#"
    Any biases in the lesson plan that could make a student feel uncomfortable.
  "#)
  estimatedCosts int @description("Estimated cost of materials for the lesson")
}

function EvaluateLessonPlan(topic: string, lessonPlan: LessonPlan) -> LessonPlanEvaluation {
  client "anthropic/claude-3-5-sonnet-latest"
  prompt #"
    Evaluate the lesson plan for 3rd grade students.
    The lesson should be engaging, include hands-on activities, and accommodate different learning styles.
    Make sure the activities are fun and interactive for 8-9 year old students.

    {{ ctx.output_format }}

    {{ _.role("user") }} {{ lessonPlan }}
  "#
}
