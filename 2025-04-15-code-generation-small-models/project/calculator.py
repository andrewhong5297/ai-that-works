"""Core calculator logic handling operations and memory."""

from operations import add, subtract, multiply, divide

class Calculator:
    def __init__(self):
        self.memory = 0
        self.operations = {
            '+': add,
            '-': subtract,
            '*': multiply,
            '/': divide
        }
    
    def calculate(self, a: float, operator: str, b: float) -> float:
        """Perform calculation based on operator."""
        if operator not in self.operations:
            raise ValueError(f"Unknown operator: {operator}")
        
        return self.operations[operator](a, b)
    
    def store_in_memory(self, value: float) -> None:
        """Store a value in memory."""
        self.memory = value
    
    def recall_memory(self) -> float:
        """Recall value from memory."""
        return self.memory
    
    def clear_memory(self) -> None:
        """Clear the memory."""
        self.memory = 0