# 🦄 code generation with small models

> large models can do a lot, but so can small models. we'll discuss techniques for how to leverage extremely small models for generating diffs and making changes in complete codebases.

## Project Structure

This session contains two main components:

### 1. Calculator Project (`/project`)
A simple calculator application that demonstrates a complete, well-structured Python codebase. Features include:
- Basic arithmetic operations (+, -, *, /)
- Memory functionality (store, recall, clear)
- Interactive command-line interface
- Clean separation of concerns (operations, calculator logic, user interface)

### 2. Agent Project (`/agent`)
A BAML-based project that shows how to use small models to generate and modify code. The agent demonstrates:
- Code analysis and understanding
- Targeted code modifications
- Working with existing codebases

## Running the Code

### Calculator Project
```bash
cd project

# Install dependencies
uv sync

# Run the calculator
python main.py
```

### Agent Project
```bash
cd agent

# Install dependencies
uv sync

# Generate BAML code
uv run baml-cli generate

# Run the agent
python hello.py
```
