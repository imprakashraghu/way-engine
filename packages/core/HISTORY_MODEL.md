History Model:

- stack: list of past commands
- pointer: current index in the history stack

Supported actions:
- undo()
- redo()
- clearHistory()
- push(commandSnapshot)

A snapshot can contain:
- command name
- previous state (before)
- next state (after)
- timestamp