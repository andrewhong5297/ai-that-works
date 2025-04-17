import ast

def find_imports(code: str) -> list[str]:
    tree = ast.parse(code)
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                yield alias.name
        elif isinstance(node, ast.ImportFrom):
            yield node.module
    

def main():
    print("Hello from 2025-04-15-code-generation-small-models!")


if __name__ == "__main__":
    main()
