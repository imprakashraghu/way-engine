Command System Overview

Commands wrap graph operations into undoable, consistent actions.

Command structure:
- execute(graph) -> newGraph
- undo(graph) -> oldGraph

CommandManager:
- Executes commands
- Sends results to HistoryManager
- Provides undo/redo integration
- Stores current graph state

Examples of future commands:
- AddNodeCommand
- RemoveNodeCommand
- MoveNodeCommand
- AddPortCommand
- AddEdgeCommand
- RewireEdgeCommand
- BatchCommand (multi-step)
