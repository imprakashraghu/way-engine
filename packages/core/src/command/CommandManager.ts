// CommandManager.ts

import { Command } from "./CommandTypes";
import { Graph } from "../graph/GraphTypes";
import { HistoryManager } from "../history/HistoryManager";

export class CommandManager {
  private history: HistoryManager;
  private currentGraph: Graph;

  constructor(initialGraph: Graph, history: HistoryManager) {
    this.currentGraph = initialGraph;
    this.history = history;
  }

  /**
   * Execute a command:
   * - apply the command
   * - update graph
   * - send new graph to history
   */
  execute(command: Command): Graph {
    const newGraph = command.execute(this.currentGraph);

    this.currentGraph = newGraph;

    // Record after applying
    this.history.record(newGraph);

    return newGraph;
  }

  /**
   * Undo via HistoryManager.
   */
  undo(): Graph | null {
    const graph = this.history.undo();
    if (graph) {
      this.currentGraph = graph;
    }
    return graph;
  }

  /**
   * Redo via HistoryManager.
   */
  redo(): Graph | null {
    const graph = this.history.redo();
    if (graph) {
      this.currentGraph = graph;
    }
    return graph;
  }

  /**
   * Returns current graph state.
   */
  getGraph(): Graph {
    return this.currentGraph;
  }
}
