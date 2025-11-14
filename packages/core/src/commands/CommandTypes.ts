// CommandTypes.ts

import { Graph } from "../graph/GraphTypes";

export interface Command {
  /**
   * Executes the command and returns a new graph.
   */
  execute(graph: Graph): Graph;

  /**
   * Reverses the command (for undo).
   * Must restore the graph to its state before execute().
   */
  undo(graph: Graph): Graph;

  /**
   * Optional descriptive label (useful for UI or debugging).
   */
  label?: string;
}
