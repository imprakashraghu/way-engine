History Rules:

1. Every time GraphManager performs a mutation AND emits a `graph:changed` event,
   the HistoryManager records a snapshot EXCEPT when:
   - undo() is running
   - redo() is running
   - batch operations group them
   - change is flagged as "transient" (dragging, hover, etc.)

2. Snapshots are immutable:
   - Each entry = complete graph state

3. Undo Logic:
   - Move current graph to future[]
   - Pop last item from past[]
   - That becomes present

4. Redo Logic:
   - Move current graph to past[]
   - Pop from future[]
   - That becomes present

5. History capacity:
   - Optional max stack size (default: infinite)
