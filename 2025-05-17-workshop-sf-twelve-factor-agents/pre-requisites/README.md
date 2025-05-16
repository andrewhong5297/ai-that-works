## SF workshop pre-requisites


This folder contains the pre-requisites for the SF workshop on 2025-05-17.

You should complete at LEAST folders 00- and 01-, to ensure you have the basic LLM inference stack up



### the fast version

complete the README.md in the following folders:

- [00-hello-world](./00-hello-world) - basic nodejs and typescript setup steps
- [00a-python-setup](./00a-python-setup) - ensure you have uv installed to work with python projects
- [01-cli-and-agent](./01-cli-and-agent) - set up a basic CLI program that talks to LLMs

### the full version

There are four folders here.

We'll move very quickly through chapters 02- and 03- on saturday so we can get to the more interesting stuff,
so if you have time / are newer to agent building, it's recommended to walk through those as well!

- [00-hello-world](./00-hello-world) - basic nodejs and typescript setup steps
- [01-cli-and-agent](./01-cli-and-agent) - set up a basic CLI program that talks to LLMs
- [02-calculator-tools](./02-calculator-tools) - the expected results after completing all the steps in `01-cli-and-agent`, plus steps to add tools
- [03-tool-loop](./03-tool-loop) - the expected results after completing all the steps in `02-calculator-tools`, plus steps to build a simple agentic loop

Each is incremental, that is, 01-cli-and-agent starts off with the expected "end state" from 00

### configuring local models

In case of wifi issues, you may find it handy to run examples with local models via [lmstudio](https://lmstudio.ai/) or [ollama](https://ollama.com/).

If you have a running model + endpoint, you can test the examples 

    export LOCALMODEL_BASE_URL=
    export LOCALMODEL_API_KEY= # optional


and completing the steps in 

- [01a-cli-and-agent-localmodels](./01a-cli-and-agent-localmodels)
