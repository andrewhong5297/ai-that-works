## NYC workshop pre-requisites


This folder contains the pre-requisites for the NYC workshop on 2025-05-10


### the fast version

jump into `final` and make sure you can run the CLI

```
export OPENAI_API_KEY=...
cd final && npx tsx src/index.ts 'hello, world'
```


**Note** these examples use OpenAI - if you don't have an OpenAI key, you can use another inference provider (docs on how in 01-cli-and-agent folder). During the workshop, keys for inference will be provided.

### the full version

There are three folders here

- [00-hello-world](./00-hello-world) - basic nodejs and typescript setup steps
- [01-cli-and-agent](./01-cli-and-agent) - set up a basic CLI program that talks to LLMs
- [final](./final) - the expected results after completing all the steps in `01-cli-and-agent`

Each is incremental, that is, 01-cli-and-agent starts off with the expected "end state" from 00


### setting up pre-requisites

- `cd 00-hello-world` and follow the readme steps

when you are done:

- `cd 01-cli-and-agent` and follow the readme steps

when you are done with that, you are good to go!

You can verify your work by comparing the updated contents of 01-cli-and-agent to what's in `final`