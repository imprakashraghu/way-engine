// EdgeTypes.ts will define:
//
// interface Edge {
//   id: string;
//   sourcePortId: string;
//   targetPortId: string;
//   data?: Record<string, any>;
// }
//
// Optionally later:
// sourceNodeId (derived automatically)
// targetNodeId (derived automatically)

/**
 * Defines the direction of a Port.
 * Edges must always connect from an output → input (recommended).
 * "default" allows flexible or undirected graphs.
 */
export type PortType = "input" | "output" | "default";

/**
 * The core definition of an Edge in the graph.
 * Edges connect ports, not nodes.
 */
export interface Edge {
  id: string; // Unique identifier for the edge

  sourcePortId: string; // Port the edge starts from
  targetPortId: string; // Port the edge ends at

  // Optional: the nodes for convenience — these will be filled by the Graph layer.
  sourceNodeId?: string;
  targetNodeId?: string;

  data?: Record<string, any>; // Custom metadata for the edge
}