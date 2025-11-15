# Event System

The Event System provides a lightweight event bus used across the entire engine.

## Built Components
- **EventEmitter**
- **EventTypes**

## What Events Cover
- `node:added`, `node:updated`, `node:removed`
- `port:added`, `port:removed`
- `edge:added`, `edge:removed`
- `graph:changed`

## Example Usage
```ts
graph.events.on("node:added", (node) => {
  console.log("Node added:", node);
});
