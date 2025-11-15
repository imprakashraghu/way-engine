---
title: Drag System
sidebar_position: 2
---

# Drag System

The Drag System enables node dragging.

## Built Components
- **DragManager**
- **DragTypes**

## Responsibilities
- Track drag start / move / end
- Update node positions
- Integrate with hit testing
- Emit drag-related events

## Example
```ts
dragManager.startDrag(nodeId, pointerPosition);
dragManager.update(pointerPosition);
dragManager.endDrag();
