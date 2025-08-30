export function style(obj = {}) {
    return Object.entries(obj)
    .filter(([,v]) => v !== undefined && v !== null && v !== '')
    .map(([k,v]) => `${k.replace(/([A-Z])/g,'-$1').toLowerCase()}:${v}`)
    .join(';')
}