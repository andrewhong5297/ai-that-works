# Twelve Factor Agents Workshop

This workshop guides you through building a robust agent system step by step, incorporating best practices from the twelve-factor app methodology.

## Chapters

1. **Prerequisites** - Basic setup with Node.js and TypeScript (in [`../pre-requisites`](../pre-requisites))
2. **Calculator Tools** - Add basic calculator functionality to your agent ([`02-calculator-tools`](./02-calculator-tools))
3. **Tool Loop** - Implement a proper agent loop for handling multiple operations ([`03-tool-loop`](./03-tool-loop))
4. **BAML Tests** - Add test coverage for your agent's behavior ([`04-baml-tests`](./04-baml-tests))
5. **Human Tools** - Add support for human interaction and clarification ([`05-human-tools`](./05-human-tools))
6. **Customize Prompt** - Improve agent reasoning with better prompting ([`06-customize-prompt`](./06-customize-prompt))
7. **Context Window** - Optimize context handling and formatting ([`07-context-window`](./07-context-window))
8. **API Endpoints** - Add HTTP API support with Express ([`08-api-endpoints`](./08-api-endpoints))
9. **State Management** - Add thread persistence and async clarification ([`09-state-management`](./09-state-management))
10. **Human Approval** - Implement approval workflows for sensitive operations ([`10-human-approval`](./10-human-approval))

## Getting Started

1. Make sure you've completed the prerequisites in [`../pre-requisites`](../pre-requisites)
2. Each chapter folder contains:
   - A README.md with step-by-step instructions
   - A `walkthrough` directory with reference implementations
   - Working example code

## Running the Examples

Each chapter builds on the previous one. You can either:

1. Follow each chapter's README.md to build the agent step by step
2. Use the provided walkthrough files to skip to a specific implementation

## Development

```bash
# Install dependencies
npm install

# Run the CLI version
npx tsx src/index.ts 'your message here'

# Run the server (chapters 8-10)
npx tsx src/server.ts

# Run tests
npx baml-cli test
```

## Key Features

- Calculator operations (add, subtract, multiply, divide)
- Human interaction for clarification
- Test coverage with BAML
- HTTP API endpoints
- State management
- Human approval workflows
- Customizable prompting
- Context window optimization

## Directory Structure

- `src/` - Main source code
- `baml_src/` - BAML definitions for the agent
- `walkthrough/` - Reference implementations for each step