export interface DragSession {
  nodeIds: string[]; // nodes being dragged
  startPositions: Record<string, { x: number; y: number }>;
  startPoint: { x: number; y: number }; // pointer-down point
  lastDelta: { x: number; y: number }; // last drag movement
  active: boolean;
}