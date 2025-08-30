import { style } from '../utils/inlineStyles.js'


export function renderDivTree(tree) {
    const parts = [
        '<!doctype html>',
        '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
        '<title>Email</title></head><body style="margin:0;padding:0;background:#f5f5f5;">',
        '<div style="max-width:640px;margin:0 auto;padding:16px;background:#ffffff;">'
    ]


    const renderBlock = (b) => {
        switch (b.type) {
            case 'heading': {
                const Tag = `h${b.level || 2}`
                return `<${Tag} style="${style({ textAlign: b.align, margin: '0 0 12px' })}">${escapeHtml(b.text)}</${Tag}>`
            }
            case 'paragraph': {
                return `<p style="${style({ textAlign: b.align, margin: '0 0 12px', lineHeight: '1.5' })}">${escapeHtml(b.text)}</p>`
            }
            case 'image': {
                return `<img src="${escapeAttr(b.src)}" alt="${escapeAttr(b.alt)}" style="${style({ width: b.width || '100%', height: 'auto', display: 'block', margin: '0 0 12px' })}"/>`
            }
            case 'button': {
                const aStyle = style({
                    display: 'inline-block',
                    background: '#111827',
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    textAlign: 'center',
                    margin: '0 0 12px'
                })
                return `<div style="${style({ textAlign: b.align })}"><a href="${escapeAttr(b.url)}" style="${aStyle}">${escapeHtml(b.text)}</a></div>`
            }
            case 'divider': {
                return `<hr style="${style({ border: 0, height: `${b.thickness || 1}px`, background: b.color || '#e5e7eb', margin: '12px 0' })}">`
            }
            case 'spacer': {
                return `<div style="${style({ height: `${b.height || 16}px` })}"></div>`
            }
            case 'columns2': {
                const gap = b.gap ?? 16
                const col = (inner) => `<div style="${style({ flex: '1 1 0' })}">${inner.map(renderBlock).join('')}</div>`
                return `<div style="${style({ display: 'flex', gap: `${gap}px`, margin: '0 0 12px' })}">${b.cols.map(c => col(c.blocks || [])).join('')}</div>`
            }
            default:
                return ''
        }
    }


    for (const block of tree) parts.push(renderBlock(block))
    parts.push('</div></body></html>')
    return parts.join('')
}


function escapeHtml(s = '') { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])) }
function escapeAttr(s = '') { return s.replace(/["&<>]/g, c => ({ '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])) }