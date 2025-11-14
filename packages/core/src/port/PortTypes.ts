// PortTypes.ts will contain:
//
// interface Port {
//   id: string;
//   nodeId: string;
//   type: "input" | "output" | "default";
//   position?: { x: number, y: number };
//   data?: Record<string, any>;
// }
//
// This file defines the shape of a Port object.

export type PortType = "input" | "output" | "default";

export interface PortPosition {
  x: number;
  y: number;
}

/**
 * A Port is an attachment point on a Node.
 * Edges connect to Ports, not directly to Nodes.
 */
export interface Port {
  id: string;                    // Unique identifier for the Port
  nodeId: string;                // ID of the Node this port belongs to
  type: PortType;                // input/output/default

  position?: PortPosition;       // Position relative to the Node
  data?: Record<string, any>;    // Optional custom metadata
}