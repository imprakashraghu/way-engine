// EventTypes.ts

export type GraphEvent =
  | { type: "node:added"; nodeId: string }
  | { type: "node:updated"; nodeId: string }
  | { type: "node:removed"; nodeId: string }

  | { type: "port:added"; portId: string; nodeId: string }
  | { type: "port:updated"; portId: string }
  | { type: "port:removed"; portId: string }

  | { type: "edge:added"; edgeId: string }
  | { type: "edge:updated"; edgeId: string }
  | { type: "edge:removed"; edgeId: string }

  | { type: "graph:changed" };
