// BatchCommand.ts

import { Command } from "./CommandTypes";
import { Graph } from "../graph/GraphTypes";

/**
 * A command that groups multiple commands
 * into a single undoable action.
 */
export class BatchCommand implements Command {
  label = "Batch Command";

  private commands: Command[];
  private snapshots: Graph[] = [];

  constructor(commands: Command[]) {
    this.commands = commands;
  }

  /**
   * Execute each command in sequence.
   * Save snapshots to undo them later.
   */
  execute(graph: Graph): Graph {
    let current = graph;

    this.snapshots = []; // clear previous run

    for (const cmd of this.commands) {
      this.snapshots.push(current); // store state BEFORE each command
      current = cmd.execute(current);
    }

    return current;
  }

  /**
   * Undo commands in REVERSE order,
   * restoring snapshots BEFORE each command.
   */
  undo(graph: Graph): Graph {
    // Start from the last command and go backwards
    let current = graph;

    for (let i = this.commands.length - 1; i >= 0; i--) {
      const previousState = this.snapshots[i];
      current = previousState;
    }

    return current;
  }
}