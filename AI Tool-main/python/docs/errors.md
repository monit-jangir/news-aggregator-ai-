# ⚠️ Error Handling

<!-- TOC -->
## Table of Contents
- [Overview](#overview)
- [The FrameworkError Class](#the-frameworkerror-class)
  - [Specialized Error Classes](#specialized-error-classes)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Creating Custom Errors](#creating-custom-errors)
  - [Wrapping Existing Errors](#wrapping-existing-errors)
- [Examples](#examples)
<!-- /TOC -->

---

## Overview

Error handling is a critical part of any Python application, especially when dealing with asynchronous operations, various error types, and error propagation across multiple layers. In the BeeAI Framework, we provide a robust and consistent error-handling structure that ensures reliability and ease of debugging.

> [!NOTE]
>
> Location within the framework: [beeai_framework/errors.py](/python/beeai_framework/errors.py).

---

## The FrameworkError class

Within the BeeAI Framework, regular Python Exceptions are used to handle common issues such as `ValueError`, `TypeError`. However, to provide a more comprehensive error handling experience, we have introduced `FrameworkError`, which is a subclass of Exception. Where additional context is needed, we can use `FrameworkError` to provide additional information about the nature of the error. This may wrap the original exception following the standard Python approach.

Benefits of using `FrameworkError`:

- **Additional properties**: Exceptions may include additional properties to provide a more detailed view of the error.
- **Preserved error chains**: Retains the full history of errors, giving developers full context for debugging.
- **Context**: Each error can contain a dictionary of context, allowing you to store additional values to help the user identify and debug the error.
- **Utility functions:** Includes methods for formatting error stack traces and explanations, making them suitable for use with LLMs and other external tools.
- **Native support:** Built on native Python Exceptions functionality, avoiding the need for additional dependencies while leveraging familiar mechanisms.

This structure ensures that users can trace the complete error history while clearly identifying any errors originating from the BeeAI Framework.

<!-- embedme examples/errors/base.py -->
```py
from beeai_framework.errors import FrameworkError

# Create the main FrameworkError instance
error = FrameworkError("Function 'getUser' has failed.", is_fatal=True, is_retryable=False)
inner_error = FrameworkError("Cannot retrieve data from the API.")
innermost_error = ValueError("User with Given ID Does not exist!")

# Chain the errors together using __cause__
inner_error.__cause__ = innermost_error
error.__cause__ = inner_error

# Set the context dictionary for the top level error
# Add any additional context here. This will help with debugging
error.context["workflow"] = "activity_planner"
error.context["provider"] = "ollama"
error.context["chat_model"] = "granite3.2:8b"

# Print some properties of the error
print("\n-- Error properties:")
print(f"Message: {error.message}")  # Main error message
# Is the error fatal/retryable?
print(f"Meta: fatal:{FrameworkError.is_fatal(error)} retryable:{FrameworkError.is_retryable(error)}")
print(f"Cause: {error.get_cause()}")  # Prints the cause of the error
print(f"Context: {error.context}")  # Prints the dictionary of the error context

print("\n-- Explain:")
print(error.explain())  # Human-readable format without stack traces (ideal for LLMs)
print("\n-- str():")
print(str(error))  # Human-readable format (for debug)

```

_Source: [examples/errors/base.py](/python/examples/errors/base.py)_

Framework error also has two additional properties which help with agent processing, though ultimately the code that catches the exception will determine the appropriate action.

- **is_retryable** : hints that the error is retryable.
- **is_fatal** : hints that the error is fatal.

### Specialized error classes

The BeeAI Framework extends `FrameworkError` to create specialized error classes for different components or scenarios. This ensures that each part of the framework has clear and well-defined error types, improving debugging and error handling.

> [!TIP]
>
> Casting an unknown error to a `FrameworkError` can be done by calling the `FrameworkError.ensure` static method ([example](/python/examples/errors/cast.py)).

The definitions for these classes are typically local to the module where they are raised.

| Error Class | Category | Description | 
|-------------|----------|-------------|
| `AbortError` | Aborts | Raised when an operation has been aborted |
| `ToolError` | Tools | Raised when a problem is reported by a tool |
| `ToolInputValidationError` | Tools | Extends ToolError, raised when input validation fails |
| `AgentError` | Agents | Raised when problems occur in agents |
| `PromptTemplateError` | Prompt Templates | Raised when problems occur processing prompt templates |
| `LoggerError` | Loggers | Raised when errors occur during logging |
| `SerializerError` | Serializers | Raised when problems occur serializing or deserializing objects |
| `WorkflowError` | Workflow | Raised when a workflow encounters an error |
| `ParserError` | Parser | Raised when a parser fails to parse the input data. Includes additional *Reason* |
| `ResourceError` | Memory | Raised when an error occurs with processing agent memory |
| `ResourceFatalError` | Memory | Extends ResourceError, raised for particularly severe errors that are likely to be fatal |
| `EmitterError` | Emitter | Raised when a problem occurs in the emitter |
| `BackendError` | Backend | Raised when a backend encounters an error |
| `ChatModelError` | Backend | Extends BackendError, raised when a chat model fails to process input data |
| `MessageError` | Backend | Raised when a message processing fails |

## Tools example

example
<!-- embedme examples/errors/tool.py -->
```py
import asyncio

from beeai_framework import tool
from beeai_framework.tools import ToolError


async def main() -> None:
    @tool
    def dummy() -> None:
        """
        A dummy tool.
        """
        raise ToolError("Dummy error.")

    await dummy.run({})


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except ToolError as e:
        print("===CAUSE===")
        print(e.get_cause())
        print("===EXPLAIN===")
        print(e.explain())

```

_Source: [examples/errors/tool.py](/python/examples/errors/tool.py)_

---

## Usage

### Basic usage

To use Framework error, add the following import:
```py
from beeai_framework.errors import FrameworkError
```

Add any additional custom errors you need in your code to the import, for example
```py
from beeai_framework.errors import FrameworkError, ChatModelError,ToolError
```

### Creating custom errors

If you wish to create additional errors, you can extend `FrameworkError` or any of the other errors above:

```py
from beeai_framework.errors import FrameworkError

```py
class MyCustomError(FrameworkError):
    def __init__(self, message: str = "My custom error", *, cause: Exception | None = None, context: dict | None = None) -> None:
        super().__init__(message, is_fatal=True, is_retryable=False, cause=cause, context=context)
```

### Wrapping existing errors

You can wrap existing errors in a `FrameworkError`, for example:
```py
inner_err: Exception = ValueError("Value error")
error = FrameworkError.ensure(inner_err)
raise(error)
```

### Using properties and methods

Framework error also has two additional properties which help with agent processing, though ultimately the code that catches the exception will determine the appropriate action.

- **is_retryable** : hints that the error is retryable.
- **is_fatal** : hints that the error is fatal.

These can be accessed via:

```py
err = FrameworkError("error")
isfatal: bool = FrameworkError.is_fatal(err)
isretryable: bool = FrameworkError.is_retryable(err)
```

This allows use of some useful functions within the error class.

For example the `explain` static method will return a string that may be more useful for an LLM to interpret:

```py
message: str = FrameworkError.ensure(error).explain()
```

See the source file [errors.py](/python/beeai_framework/errors.py) for additional methods.

## Examples

- All error examples can be found in [here](/python/examples/errors).
