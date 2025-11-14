Validation Model:

Core Validation Rules:
- Node IDs must be unique
- Edge IDs must be unique
- All nodes referenced by edges must exist
- All ports referenced by edges must exist
- Node positions must be valid numbers
- Edges cannot connect a node to itself (optional)
- Ports must belong to their node

Validation Actions:
- validateGraph()
- validateNode(id)
- validateEdge(id)
- listErrors()