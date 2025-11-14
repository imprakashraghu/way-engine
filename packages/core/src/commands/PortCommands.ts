// PortCommands.ts

import { Command } from "./CommandTypes";
import { Graph } from "../graph/GraphTypes";
import {
  addPort,
  updatePort,
  removePort,
  addEdge
} from "../graph/GraphManager";

//
// 1. AddPortCommand
//
export class AddPortCommand implements Command {
  label = "Add Port";

  private port: any; // replace with Port type

  constructor(port: any) {
    this.port = port;
  }

  execute(graph: Graph): Graph {
    return addPort(graph, this.port);
  }

  undo(graph: Graph): Graph {
    return removePort(graph, this.port.id);
  }
}

//
// 2. UpdatePortCommand
//
export class UpdatePortCommand implements Command {
  label = "Update Port";

  private portId: string;
  private patch: any;
  private previous: any;

  constructor(portId: string, patch: any) {
    this.portId = portId;
    this.patch = patch;
  }

  execute(graph: Graph): Graph {
    // store previous state
    this.previous = graph.ports[this.portId];
    return updatePort(graph, this.portId, this.patch);
  }

  undo(graph: Graph): Graph {
    return updatePort(graph, this.portId, this.previous);
  }
}

//
// 3. RemovePortCommand
//
export class RemovePortCommand implements Command {
  label = "Remove Port";

  private portId: string;
  private snapshot: {
    port: any;
    edges: any[];
  } = { port: null, edges: [] };

  constructor(portId: string) {
    this.portId = portId;
  }

  execute(graph: Graph): Graph {
    // Capture port before deletion
    const port = graph.ports[this.portId];

    // Edges connected to this port
    const edges = Object.values(graph.edges).filter(
      (e) =>
        e.sourcePortId === this.portId ||
        e.targetPortId === this.portId
    );

    // snapshot all data needed for undo
    this.snapshot = { port, edges };

    // remove port (GraphManager automatically removes edges)
    return removePort(graph, this.portId);
  }

  undo(graph: Graph): Graph {
    let g = graph;

    // restore port
    g = addPort(g, this.snapshot.port);

    // restore edges
    for (const edge of this.snapshot.edges) {
      g = addEdge(g, edge); // requires addEdge import
    }

    return g;
  }
}
