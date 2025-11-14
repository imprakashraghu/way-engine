- id (required)
- sourceNodeId (required)
- sourcePortId (optional)
- targetNodeId (required)
- targetPortId (optional)
- data (optional)

Edge Required Fields:
- id: string
- sourcePortId: string
- targetPortId: string

Optional Fields:
- sourceNodeId: string  (derived from port)
- targetNodeId: string  (derived from port)
- data: custom metadata

Why edges connect ports instead of nodes:

- Ports enforce directionality (input/output)
- Ports allow multiple connections per node
- Ports allow custom routing positions
- Ports enable complex shapes (diamond, decision nodes)
- Ports give full flexibility for visual layout
