// block.js

// ---- utils ----
function safeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // RFC4122-ish fallback (non-crypto)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function cloneDeep(obj) {
  if (typeof structuredClone === 'function') return structuredClone(obj)
  return JSON.parse(JSON.stringify(obj))
}

// ---- blocks ----
export const BLOCKS = {
  heading: {
    label: 'Heading',
    defaults: { text: 'Your Heading', level: 2, align: 'left' }
  },
  paragraph: {
    label: 'Paragraph',
    defaults: { text: 'Write something meaningful here...', align: 'left' }
  },
  image: {
    label: 'Image',
    defaults: { src: 'https://via.placeholder.com/600x200', alt: 'Image', width: '100%' }
  },
  button: {
    label: 'Button',
    defaults: { text: 'Click Me', url: '#', align: 'left' }
  },
  divider: {
    label: 'Divider',
    defaults: { thickness: 1, color: '#e5e7eb' }
  },
  spacer: {
    label: 'Spacer',
    defaults: { height: 16 }
  },
  columns2: {
    label: 'Columns (2)',
    defaults: { gap: 16, cols: [{ blocks: [] }, { blocks: [] }] }
  }
}

export function newBlock(type) {
  const base = BLOCKS[type]
  if (!base) throw new Error(`Unknown block: ${type}`)
  return {
    id: safeId(),
    type,
    ...cloneDeep(base.defaults)
  }
}
