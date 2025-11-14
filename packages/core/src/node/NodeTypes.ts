// NodeTypes.ts defines the structure of a Node.

// Fields:
// - id: unique identifier (string)
// - position: { x, y }
// - type: optional string
// - data: optional custom object
// - ports: optional list of ports

// This file will contain the Node interface/type definition.

// Fields to include:
// - id
// - position { x, y }
// - type (optional)
// - data (optional)
// - ports (optional, list of ports)

export interface NodePosition {
    x: number;
    y: number;
}

export interface Node {
    id: string;                 // every node has a unique id
    position: NodePosition;     // x and y coordinates (required)

    type?: string;              // Optional: helps classify nodes (flow, shape, etc.)
    data?: Record<string, any>; // Optional payload for custom user data
    ports?: string[];           // Optional list of port IDs owned by this node
}