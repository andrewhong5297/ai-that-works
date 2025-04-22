# Building a 12 Factor Agent 

> In this episode, we dove deep on the theory behind 12 factor agents, before getting hands on and building one from scratch

[Video]() 

For a full deep dive of the concepts and visuals, check out [12-factor-agents](https://hlyr.dev/12fa)

[![12 factor agent](https://private-user-images.githubusercontent.com/3730605/430151074-23286ad8-7bef-4902-b371-88ff6a22e998.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDUzNTY0MDgsIm5iZiI6MTc0NTM1NjEwOCwicGF0aCI6Ii8zNzMwNjA1LzQzMDE1MTA3NC0yMzI4NmFkOC03YmVmLTQ5MDItYjM3MS04OGZmNmEyMmU5OTgucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDQyMiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA0MjJUMjEwODI4WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9YzUxYmU4Y2IxYmU5MDAzNDgyMzgxOGUxMzQ3MTNhYWMxOWRkNWU4NWZmY2RiZjkwYzI4NTk1ZWNjZmY4MTBkMyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.MLNLXSj3I3OXsCltsea_EpDvFKNMlC3Y36GHkJ2ECiE)](https://hlyr.dev/12fa)


## How to use this code

There are a few ways to use the code in this folder, the final result is in `final/` and the step by step walkthrough is in `step-by-step/`.

```
.
├── README.md
├── final
│   ├── baml_src
│   │   ├── agent.baml
│   │   └── ...
│   ├── src
│   │   ├── agent.ts
│   │   └── ...
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
└── step-by-step
    ├── walkthrough
    │   ├── 00-index.ts
    │   ├── 01-agent.baml
    │   ├── 01-agent.ts
    │   ├── ...more files...
    │   └── 10-server.ts
    ├── package-lock.json
    ├── package.json
    ├── tsconfig.json
    └── walkthrough.md
```


### final results

if you just want to run the final result of all our coding, use the code in `final/` 

```bash
cd final
npm install
```

use the cli with

```bash
npx tsx src/index.ts 'hello world'
```

or run the server with

```bash
npx tsx src/server.ts
```

### step by step walkthrough

if you want to walk through the code step by step, use the code in `step-by-step/`

```bash
cd step-by-step
npm install
```

then follow the steps in [step-by-step/walkthrough.md](step-by-step/walkthrough.md) one by one