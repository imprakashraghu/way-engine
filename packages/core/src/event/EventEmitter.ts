// EventEmitter.ts

import { GraphEvent } from "./EventTypes";

export type Listener = (event: GraphEvent) => void;

export class EventEmitter {
  private listeners: Listener[] = [];

  /**
   * Subscribe to events.
   */
  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Emit an event to all subscribers.
   */
  emit(event: GraphEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}