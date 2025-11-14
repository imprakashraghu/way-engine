export type HitType = "none" | "node" | "port" | "edge";

export interface HitResult {
  type: HitType;
  id: string | null;       // nodeId, portId, or edgeId
}
