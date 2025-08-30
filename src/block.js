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
    return { id: crypto.randomUUID(), type, ...structuredClone(base.defaults) }
}