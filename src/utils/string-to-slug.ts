export function stringToSlug(str: string): string {
    // Remove caracteres especiais
    const cleanedStr = str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    // Substitui espaços por hifens
    const slug = cleanedStr.replace(/\s+/g, '-');

    return slug;
}
