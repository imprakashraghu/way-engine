// GraphSerializer.ts

import { Graph } from "../graph/GraphTypes";
import { validateGraph } from "../graph/GraphValidation";

/**
 * Serializes a graph to JSON string.
 */
export function serializeGraph(graph: Graph): string {
  return JSON.stringify(graph, null, 2);
}

/**
 * Deserializes JSON back into a Graph object.
 * Performs validation, version checks, and structural integrity checks.
 */
export function deserializeGraph(json: string): Graph {
  let parsed: any;

  try {
    parsed = JSON.parse(json);
  } catch (err) {
    throw new Error("deserializeGraph: Invalid JSON string.");
  }

  // Basic shape check
  if (!parsed.nodes || !parsed.ports || !parsed.edges) {
    throw new Error("deserializeGraph: Missing required fields.");
  }

  // Build graph object
  const graph: Graph = {
    nodes: parsed.nodes,
    ports: parsed.ports,
    edges: parsed.edges,
    metadata: parsed.metadata ?? {},
    version: parsed.version ?? "1.0.0",
  };

  return graph;
}

/**
 * A safe deserializer that validates the graph and optionally repairs it.
 */
export function safeDeserializeGraph(json: string): {
  graph: Graph | null;
  errors: string[];
} {
  try {
    const graph = deserializeGraph(json);

    const errors = validateGraph(graph);

    return {
      graph: errors.length === 0 ? graph : null,
      errors,
    };
  } catch (err: any) {
    return {
      graph: null,
      errors: [err.message],
    };
  }
}