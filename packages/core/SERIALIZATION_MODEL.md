Serialization Model:

Graph Serialization:
- serializeGraph(graph) → JSON
- deserializeGraph(json) → graph

JSON Structure:
- nodes: array of node objects
- edges: array of edge objects
- metadata (optional)
- version (optional)

Node Serialization:
- id
- position
- type
- data
- ports

Edge Serialization:
- id
- sourceNodeId
- sourcePortId
- targetNodeId
- targetPortId
- data