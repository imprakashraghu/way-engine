Event System

The EventEmitter dispatches graph events to subscribers.

Events include:
- node:added / node:updated / node:removed
- port:added / port:updated / port:removed
- edge:added / edge:updated / edge:removed
- graph:changed

Listeners subscribe to events and react:
- UI re-renders
- History / undo-redo tracking
- Plugins
- Analytics
- Debug tools