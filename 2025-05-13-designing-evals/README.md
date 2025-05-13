# 🦄 designing evals

> minimalist and high-performance testing/evals for LLM applications

Video • [RSVP](https://lu.ma/j5y6bd3i)

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

Coming soon after the session!
