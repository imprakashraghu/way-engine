// HistoryTypes.ts

// A single snapshot of the entire graph
export interface HistorySnapshot<TGraph> {
  graph: TGraph;
  timestamp: number;
}

// The entire history state
export interface HistoryState<TGraph> {
  past: HistorySnapshot<TGraph>[];    // Undo stack
  present: TGraph | null;             // Current graph state
  future: HistorySnapshot<TGraph>[];  // Redo stack
}
