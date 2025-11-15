# Selection System

The Selection System handles selecting nodes and edges.

## Built Components
- **SelectionManager**
- **SelectionTypes**

## Supports
- Single selection
- Multi-selection
- Clearing selection

## Example API
```ts
selectionManager.select(nodeId);
selectionManager.selectMany([id1, id2]);
selectionManager.clear();
