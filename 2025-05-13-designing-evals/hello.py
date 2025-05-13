from datetime import datetime
from baml_client import b
import json
import os


# save the lesson plan and evaluation to a file
date = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
os.makedirs(f"evals/run_{date}", exist_ok=True)
    

def lesson_plan_test_harness(test_idx: int, topic: str):
    lesson_plan = b.CreateLessonPlan(topic)
    evaluation = b.EvaluateLessonPlan(topic, lesson_plan)
    with open(f"evals/run_{date}/data_{test_idx}.json", "w") as f:
        f.write(json.dumps({
            "topic": topic,
            "lesson_plan": lesson_plan.model_dump(),
            "evaluation": evaluation.model_dump()
        }))
    assert evaluation.pacing != "fast"
    assert len(evaluation.biases) == 0
    assert evaluation.estimatedCosts < 0
    
def test_1():
    lesson_plan_test_harness(1, "multiplication tables up to 5")

def test_2():
    lesson_plan_test_harness(2, "introduction to basic fractions")

