# Chapter 1a - adding local models

this chapter starts where chapter 1 left off, with a basic CLI program that can talk to LLMs.

In this chapter, we'll point the cli tool at a local model.

First, copy the new agent.baml file:

    cp walkthrough/01a-agent.baml baml_src/agent.baml


then set the following environment variables:

set

    export LOCALMODEL_BASE_URL=
    export LOCALMODEL_MODEL_NAME=

and then  run the CLI with

    npx tsx src/index.ts 'hello, world'

## ollama example

start the ollama server:

    ollama serve

in another shell, 


then, in a third shell, set your env vars 

    export LOCALMODEL_BASE_URL=http://localhost:11434/v1
    export LOCALMODEL_MODEL_NAME=llama3

and run the CLI:
    npx tsx src/index.ts 'hello, world'

## lmstudio example

similar to ollama, you'll need to just drop in your URL and model name.





