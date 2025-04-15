"""Main entry point for the calculator application."""

from interface import CalculatorInterface

def main():
    calculator = CalculatorInterface()
    calculator.run()

if __name__ == "__main__":
    main()