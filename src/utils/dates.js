export function toDatetimeLocal(dateStr) {
    if (!dateStr) return ''
    return dateStr.replace(' ', 'T').slice(0, 16)
}

export function fromDatetimeLocal(value) {
    if (!value) return ''
    return value.replace('T', ' ') + ':00'
}