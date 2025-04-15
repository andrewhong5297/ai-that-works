"""User interface for the calculator application."""

from calculator import Calculator

class CalculatorInterface:
    def __init__(self):
        self.calculator = Calculator()
        self.running = True

    def get_number(self, prompt: str) -> float:
        """Get a valid number from user input."""
        while True:
            try:
                return float(input(prompt))
            except ValueError:
                print("Please enter a valid number.")

    def get_operator(self) -> str:
        """Get a valid operator from user input."""
        valid_operators = ['+', '-', '*', '/']
        while True:
            operator = input("Enter operator (+, -, *, /): ").strip()
            if operator in valid_operators:
                return operator
            print("Please enter a valid operator.")

    def display_menu(self):
        """Display the calculator menu."""
        print("\nCalculator Menu:")
        print("1. Perform calculation")
        print("2. Store in memory")
        print("3. Recall from memory")
        print("4. Clear memory")
        print("5. Exit")

    def run(self):
        """Run the calculator interface."""
        print("Welcome to the Calculator!")
        
        while self.running:
            self.display_menu()
            choice = input("\nEnter your choice (1-5): ")

            if choice == '1':
                try:
                    a = self.get_number("Enter first number: ")
                    operator = self.get_operator()
                    b = self.get_number("Enter second number: ")
                    
                    result = self.calculator.calculate(a, operator, b)
                    print(f"\nResult: {result}")
                except ValueError as e:
                    print(f"Error: {e}")
                    
            elif choice == '2':
                value = self.get_number("Enter number to store: ")
                self.calculator.store_in_memory(value)
                print("Value stored in memory.")
                
            elif choice == '3':
                value = self.calculator.recall_memory()
                print(f"Value in memory: {value}")
                
            elif choice == '4':
                self.calculator.clear_memory()
                print("Memory cleared.")
                
            elif choice == '5':
                self.running = False
                print("Thank you for using the Calculator!")
                
            else:
                print("Invalid choice. Please try again.")