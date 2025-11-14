// GraphTypes.ts will contain:
//
// interface Graph {
//   nodes: Record<string, Node>;
//   ports: Record<string, Port>;
//   edges: Record<string, Edge>;
//
//   metadata?: Record<string, any>;
//   version?: string;
// }
//
// This is the core data structure stored by the engine.
//
// The GraphManager will implement actions to mutate this graph.
// Graph is immutable: all modifications return a new Graph object.

import { Node } from '../node/NodeTypes';
import { Edge } from '../edge/EdgeTypes';
import { Port } from '../port/PortTypes';

export interface Graph {
    nodes: Record<string, Node>;
    ports: Record<string, Port>;
    edges: Record<string, Edge>;

    metadata?: Record<string, any>;
    version?: string;
}