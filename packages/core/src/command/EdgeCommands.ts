// EdgeCommands.ts

import { Command } from "./CommandTypes";
import { Graph } from "../graph/GraphTypes";
import {
  addEdge,
  updateEdge,
  removeEdge,
  rewireEdge,
} from "../graph/GraphManager";

//
// 1. AddEdgeCommand
//
export class AddEdgeCommand implements Command {
  label = "Add Edge";

  private edge: any; // replace with Edge type

  constructor(edge: any) {
    this.edge = edge;
  }

  execute(graph: Graph): Graph {
    return addEdge(graph, this.edge);
  }

  undo(graph: Graph): Graph {
    return removeEdge(graph, this.edge.id);
  }
}

//
// 2. UpdateEdgeCommand
//
export class UpdateEdgeCommand implements Command {
  label = "Update Edge";

  private edgeId: string;
  private patch: any;
  private previous: any;

  constructor(edgeId: string, patch: any) {
    this.edgeId = edgeId;
    this.patch = patch;
  }

  execute(graph: Graph): Graph {
    this.previous = graph.edges[this.edgeId];
    return updateEdge(graph, this.edgeId, this.patch);
  }

  undo(graph: Graph): Graph {
    return updateEdge(graph, this.edgeId, this.previous);
  }
}

//
// 3. RemoveEdgeCommand
//
export class RemoveEdgeCommand implements Command {
  label = "Remove Edge";

  private edgeId: string;
  private backup: any;

  constructor(edgeId: string) {
    this.edgeId = edgeId;
  }

  execute(graph: Graph): Graph {
    this.backup = graph.edges[this.edgeId];
    return removeEdge(graph, this.edgeId);
  }

  undo(graph: Graph): Graph {
    return addEdge(graph, this.backup);
  }
}

//
// 4. RewireEdgeCommand
//
export class RewireEdgeCommand implements Command {
  label = "Rewire Edge";

  private edgeId: string;
  private patch: { sourcePortId?: string; targetPortId?: string };
  private previous: any;

  constructor(edgeId: string, patch: { sourcePortId?: string; targetPortId?: string }) {
    this.edgeId = edgeId;
    this.patch = patch;
  }

  execute(graph: Graph): Graph {
    this.previous = graph.edges[this.edgeId];
    return rewireEdge(graph, this.edgeId, this.patch);
  }

  undo(graph: Graph): Graph {
    return rewireEdge(graph, this.edgeId, {
      sourcePortId: this.previous.sourcePortId,
      targetPortId: this.previous.targetPortId,
    });
  }
}
