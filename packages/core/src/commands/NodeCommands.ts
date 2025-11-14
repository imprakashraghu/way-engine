// NodeCommands.ts

import { Command } from "./CommandTypes";
import { Graph } from "../graph/GraphTypes";
import { addNode, updateNode, removeNode, addEdge, addPort } from "../graph/GraphManager";
import { NodePosition } from "../Node";

//
// 1. AddNodeCommand
//
export class AddNodeCommand implements Command {
  label = "Add Node";

  private node: any; // actual Node type

  constructor(node: any) {
    this.node = node;
  }

  execute(graph: Graph): Graph {
    return addNode(graph, this.node);
  }

  undo(graph: Graph): Graph {
    return removeNode(graph, this.node.id);
  }
}

//
// 2. UpdateNodeCommand
//
export class UpdateNodeCommand implements Command {
  label = "Update Node";

  private nodeId: string;
  private patch: any;
  private previous: any;

  constructor(nodeId: string, patch: any) {
    this.nodeId = nodeId;
    this.patch = patch;
  }

  execute(graph: Graph): Graph {
    // Save previous version before updating
    this.previous = graph.nodes[this.nodeId];
    return updateNode(graph, this.nodeId, this.patch);
  }

  undo(graph: Graph): Graph {
    return updateNode(graph, this.nodeId, this.previous);
  }
}

//
// 3. MoveNodeCommand
//
export class MoveNodeCommand implements Command {
  label = "Move Node";

  private nodeId: string;
  private newPos: { x: number; y: number };
  private oldPos: NodePosition = { x: 0, y: 0 };

  constructor(nodeId: string, newX: number, newY: number) {
    this.nodeId = nodeId;
    this.newPos = { x: newX, y: newY };
  }

  execute(graph: Graph): Graph {
    // store old position
    const node = graph.nodes[this.nodeId];
    this.oldPos = { x: node.position.x, y: node.position.y };

    return updateNode(graph, this.nodeId, {
        position: {
            x: this.newPos.x,
            y: this.newPos.y,
        }
    });
  }

  undo(graph: Graph): Graph {
    return updateNode(graph, this.nodeId, {
        position: {
            x: this.oldPos.x,
            y: this.oldPos.y,
        }
    });
  }
}

//
// 4. RemoveNodeCommand
//
export class RemoveNodeCommand implements Command {
  label = "Remove Node";

  private nodeId: string;
  private snapshot: any; // will store full backup (node + ports + edges)

  constructor(nodeId: string) {
    this.nodeId = nodeId;
  }

  execute(graph: Graph): Graph {
    // Snapshot node, ports, and edges before deletion
    const node = graph.nodes[this.nodeId];

    const ports = Object.values(graph.ports).filter(
      (p) => p.nodeId === this.nodeId
    );
    const portIds = ports.map((p) => p.id);

    const edges = Object.values(graph.edges).filter(
      (e) => portIds.includes(e.sourcePortId) || portIds.includes(e.targetPortId)
    );

    this.snapshot = { node, ports, edges };

    return removeNode(graph, this.nodeId);
  }

  undo(graph: Graph): Graph {
    let g = graph;

    // Restore node
    g = addNode(g, this.snapshot.node);

    // Restore ports
    for (const port of this.snapshot.ports) {
      g = addPort(g, port); // Next step: addNodePort wrapper
    }

    // Restore edges
    for (const edge of this.snapshot.edges) {
      g = addEdge(g, edge);
    }

    return g;
  }
}
