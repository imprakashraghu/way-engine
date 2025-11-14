- id (required)
- position (required) → x, y
- type (optional)
- data (optional)
- ports (optional)

Implementation files:
- src/node/NodeTypes.ts
- src/node/NodeManager.ts
- src/node/NodeUtils.ts
- src/Node.ts (public entrypoint)

Type Definition (planned for NodeTypes.ts):
- id: string
- position: { x: number, y: number }
- type?: string
- data?: object
- ports?: array of Port objects

Minimum Required Fields for Implementation:
- id: string
- position: x, y as numbers

Optional Fields:
- type?: string
- data?: any object
- ports?: array of ports