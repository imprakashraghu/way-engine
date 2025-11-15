# Command System

The Command System is responsible for executing structured operations on the graph.

This system is the backbone of undo/redo.

## Built Components
- **CommandManager**
- **CommandTypes**
- **BatchCommand**
- **MacroCommands**

## Command Categories
- NodeCommands
- PortCommands
- EdgeCommands

## Example
```ts
commandManager.execute({
  type: "node:add",
  payload: { ... }
});
