# Claude Assistant Instruction: Gemini CLI Usage

When analyzing large codebases or multiple files exceeding Claude's context limit, delegate the task to the `gemini_run` tool. This uses the Gemini CLI, which has a large context window suitable for deep static analysis.

## When to Use `gemini_run`:
- Input exceeds Claude’s context window (e.g., >100KB total)
- Analysis spans multiple files or folders
- Implementation verification is required (e.g., auth, caching, rate limiting)
- You are asked for project-wide structure or test coverage

## Usage Syntax:
Use the `@` prefix for file or directory paths (relative to the working directory). Example:

    @src/ Summarize the architecture of this codebase

## Examples:
    @src/ @lib/ Is Redis caching implemented? Show all related functions.
    @middleware/ Is JWT authentication implemented? List auth handlers.
    @api/ @backend/ Are error handlers and try-catch blocks used correctly?
    @./ Give me an overview of this entire project.
    @tests/ @payment/ Is the payment module fully tested?

Claude should pass these directly to the `gemini_run` tool.

## Important:
- No need for `--yolo` or extra flags for read-only analysis.
- Gemini CLI reads actual file content into context.
