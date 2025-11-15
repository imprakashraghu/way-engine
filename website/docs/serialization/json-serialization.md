---
title: JSON Serialization
sidebar_position: 1
---

# JSON Serialization

The Serialization System allows saving and loading graph state in a portable JSON format.

## Built Components
- **GraphSerializer**

## Supported Features
- Export full graph (nodes, ports, edges)
- Import full graph with validation
- Works with History and Commands
- Safe loading (invalid graphs rejected)

## Example: Export
```ts
const json = graphSerializer.export(graph);
localStorage.setItem("graph", json);
```

## Example: Import
```ts
const json = localStorage.getItem("graph");
const graph = graphSerializer.import(json);
```

## Use Cases
- Persisting graph to backend
- Saving user work locally
- Copy/paste across editors