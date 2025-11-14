Engine Model:

The Engine is the main public API for users.

Responsibilities:
- initialize state
- expose graph operations
- expose selection operations
- expose commands
- expose history (undo/redo)
- expose events (subscribe / emit)
- expose serialization (save/load)
- provide utility shortcuts

Engine Structure:
- state (central state model)
- methods to perform core actions
- methods to query the graph
- methods to subscribe to events

Key Engine Actions (conceptual):
- addNode
- removeNode
- updateNode
- moveNode

- addEdge
- removeEdge

- select
- clearSelection

- undo
- redo

- serialize
- load
