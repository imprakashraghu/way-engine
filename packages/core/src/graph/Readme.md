Graph Model

The Graph is the single source of truth for the entire engine.
It stores:
- nodes (id → Node)
- ports (id → Port)
- edges (id → Edge)

GraphManager provides:
- immutable graph mutation
- safe global add/remove/update of nodes, ports, edges
- ensures graph integrity
- resolves port.nodeId → edge.sourceNodeId and edge.targetNodeId
- enforces validation rules
