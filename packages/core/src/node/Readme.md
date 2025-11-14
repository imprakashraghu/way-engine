NodeTypes.ts → definition of Node shape (id, position, type, data, ports)
NodeUtils.ts → helper utilities for nodes (position, data updates, etc.)
NodeManager.ts → methods to create, update, validate, or manipulate nodes
Node.ts → top-level export file that exposes Node-related functionality

NodeTypes.ts:
Defines the shape of a Node and the required fields.

Implementation Steps:
1. Define Node interface in NodeTypes.ts
2. Implement create/update/remove in NodeManager.ts
3. Add helper utils in NodeUtils.ts
4. Re-export everything in Node.ts

NodeManager.ts manages node creation, updates, movement, and port assignments.

