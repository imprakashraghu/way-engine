- nodes: list of node objects
- edges: list of edge objects
- metadata (optional):
    - createdAt
    - updatedAt
    - version
    - custom data

Graph Structure:

- nodes: Record<string, Node>
- ports: Record<string, Port>
- edges: Record<string, Edge>

Optional:
- metadata
- version
- createdAt
- updatedAt

Reason for using Record<string, T> instead of arrays:

- O(1) access by ID
- No need to search arrays for lookups
- Efficient edge lookups (sourcePortId, targetPortId)
- Makes updates cheap and predictable
- Scales to large graphs (10,000+ nodes)
