import math


def next_fibonacci_number(n: int) -> int:
    """
    Returns the next Fibonacci number after the given input `n`, assuming `n` is already a Fibonacci number.

    Args:
        n (int): The input Fibonacci number.

    Returns:
        int: The next Fibonacci number.
    """
    if n < 0:
        raise ValueError("Input must be a non-negative Fibonacci number.")

    # Generate the next Fibonacci number directly using an iterative approach
    a, b = 0, 1
    while a < n:  # Find the Fibonacci pair surrounding `n`
        a, b = b, a + b

    return b  # Return the next Fibonacci number after `n`


#######
# The following code is a more complex implementation that works for any non-negative integer input `n`. Also faster.
#######

# def next_fibonacci_number(n):
#     """
#     Returns the next Fibonacci number after the given input `n`.

#     Args:
#         n (int): The input number.

#     Returns:
#         int: The next Fibonacci number.

#     Raises:
#         ValueError: If the input is not a non-negative integer.
#     """
#     if not isinstance(n, int) or n < 0:
#         raise ValueError("Input must be a non-negative integer.")

#     # Check if `n` is a Fibonacci number using a mathematical property
#     def is_fibonacci(num):
#         # A number is Fibonacci if and only if one or both of (5*num^2 + 4) or (5*num^2 - 4) is a perfect square.
#         test1 = 5 * num**2 + 4
#         test2 = 5 * num**2 - 4
#         return is_perfect_square(test1) or is_perfect_square(test2)

#     # Helper function to check if a number is a perfect square
#     def is_perfect_square(x):
#         s = int(math.sqrt(x))
#         return s * s == x

#     # Get the nth Fibonacci number using Binet's formula
#     def fib(n):
#         sqrt_5 = math.sqrt(5)
#         phi = (1 + sqrt_5) / 2  # Golden ratio
#         return round((phi**n - (-1 / phi) ** n) / sqrt_5)

#     # Find the index of the smallest Fibonacci number greater than `n`
#     if n == 0:
#         return 1
#     if n == 1:
#         return 2  # Special case for small inputs

#     # Estimate the Fibonacci index close to `n` using an approximation formula
#     sqrt_5 = math.sqrt(5)
#     phi = (1 + sqrt_5) / 2
#     index = math.ceil(math.log(n * sqrt_5, phi))

#     # Generate the next Fibonacci numbers until we surpass `n`
#     fib_num = fib(index)
#     while fib_num <= n:
#         index += 1
#         fib_num = fib(index)

#     return fib_num
