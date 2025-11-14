// HistoryManager.ts

import { HistoryState, HistorySnapshot } from "./HistoryTypes";
import { Graph } from "../graph/GraphTypes";
import { graphEvents } from "../graph/GraphManager";
import { GraphEvent } from "../event/EventTypes";

export class HistoryManager {
  private state: HistoryState<Graph>;
  private isChanging = false; // prevents infinite loops
  private maxHistory = 200;   // optional: limit stack size

  constructor(initialGraph: Graph) {
    this.state = {
      past: [],
      present: initialGraph,
      future: []
    };

    // Automatically record history when graph changes
    graphEvents.subscribe((event) => {
      if (event.type === "graph:changed") {
        if (!this.isChanging) {
          this.record(this.state.present!);
        }
      }
    });
  }

  /**
   * Record a new snapshot into the history.
   */
  record(graph: Graph) {
    // Do not record if graph hasn't changed
    if (this.state.present === graph) return;

    // Clear redo stack when a new action happens
    this.state.future = [];

    // Add present to past
    if (this.state.present) {
      this.state.past.push({
        graph,
        timestamp: Date.now()
      });

      // Trim to max size
      if (this.state.past.length > this.maxHistory) {
        this.state.past.shift();
      }
    }

    // Update present
    this.state.present = graph;
  }

  /**
   * Undo the last action.
   */
  undo(): Graph | null {
    if (this.state.past.length === 0) return null;

    this.isChanging = true;

    const snapshot = this.state.past.pop()!;
    const oldPresent = this.state.present;

    // Move current state to future
    if (oldPresent) {
      this.state.future.push({
        graph: oldPresent,
        timestamp: Date.now()
      });
    }

    // Set present to previous snapshot
    this.state.present = snapshot.graph;

    this.isChanging = false;

    return this.state.present;
  }

  /**
   * Redo an undone action.
   */
  redo(): Graph | null {
    if (this.state.future.length === 0) return null;

    this.isChanging = true;

    const snapshot = this.state.future.pop()!;
    const oldPresent = this.state.present;

    // Move current state to past
    if (oldPresent) {
      this.state.past.push({
        graph: oldPresent,
        timestamp: Date.now()
      });
    }

    // Set present to next snapshot
    this.state.present = snapshot.graph;

    this.isChanging = false;

    return this.state.present;
  }

  /**
   * Get the current graph.
   */
  getPresent(): Graph {
    return this.state.present!;
  }

  /**
   * Clear all undo/redo history.
   */
  clear() {
    this.state.past = [];
    this.state.future = [];
  }

  getState() {
    return this.state;
  }
}