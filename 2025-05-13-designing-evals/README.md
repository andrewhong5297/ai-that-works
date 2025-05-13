# 🦄 designing evals

> minimalist and high-performance testing/evals for LLM applications

[Video](https://www.youtube.com/watch?v=) • [RSVP](https://lu.ma/j5y6bd3i)

## Overview

This session explores best practices for evaluating LLM applications, focusing on practical, efficient approaches that provide meaningful insights without unnecessary complexity.

## Running this code

### installing dependencies

```bash
# Install dependencies
uv sync
```


### Download the enron email dataset

```bash
wget 'https://www.cs.cmu.edu/~enron/enron_mail_20150507.tar.gz'
```

unzip the file

```bash
tar -xzvf enron_mail_20150507.tar.gz
```

### Download sarbanes-oxley dataset

```bash
wget 'https://www.govinfo.gov/content/pkg/PLAW-107publ204/html/PLAW-107publ204.htm'
```


### run the code

```
# Run the code
python hello.py
```

## Key Topics

1. Why evals are great - what you can do with an answer key
2. How to get the answer key
    1. we all start out with no answer key
    2. how do you build it up over time
3. Structured Data vs. Unstructured data
    1. people view as one or the other, but its often semi-structured / a blend
    2. json with sentences
    3. markdown with json
4. using rubrics to design evals
5. llm as judge
6. Enron email dataset
7. Visualizing Eval Results

## Session Notes

Checklist

- Vibe evals - run your prompt (e.g. in playground) and look at the output
    - write in a few test cases that work
    - write a few end to end tests that run your prompt chain (e.g. with pytest)
    - great for tone
- capture intermediate steps of your pipeline as probes and individual testable components
    - alternative to probes 
- structured outputs from an llm
    - helps you break your problems down into smaller components
    - e.g. lesson plan output --> "list of biases", "estimated cost"
- don't use numbers for confidence, use a rubric
    - categorical, "slow" vs "medium" vs "fast" - enum-based evals
- use prod data to build up your golden dataset over time
    - review diffs in either/both of RAW OUTPUT and the STRUCTURED EVALUATION of your pipeline outputs


## Links

- (using only) integrated tests are a scam https://www.youtube.com/watch?v=VDfX44fZoMc
