# Python Setup

This guide will help you install uv, create a project, and run the hello world example.

If you're unfamilair with `uv`, you're welcome.

## Install uv

Install uv:

https://docs.astral.sh/uv/getting-started/installation/


```
curl -LsSf https://astral.sh/uv/install.sh | sh
```


## Create a project

```
uv init
```

## Run hello world


```
uv run hello.py
```

## Add baml as a dependency

```
uv add baml-py
```

## initialize the baml project

```
uv run baml-cli init
```

## run the baml example tests


```
uv run baml-cli test
```

## VSCode/Cursor extension

you'll also want to install the BAML editor extension for [cursor](https://marketplace.cursorapi.com/items?itemName=Boundary.baml-extension) or [vscode](https://marketplace.visualstudio.com/items?itemName=Boundary.baml-extension).

If you're not using vscode or cursor, you can still complete pretty much all of this workshop using the baml-cli commands.


## check your work

expected source files at the env can be found in [./final](./final)
