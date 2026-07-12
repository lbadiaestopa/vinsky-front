export function formatSection(section) {
    return section
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}