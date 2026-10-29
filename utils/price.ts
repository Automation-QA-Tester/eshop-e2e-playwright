/**
 * Converts a displayed price such as "$1,234.56" to cents (123456).
 * Cents are integers, so comparisons are not affected by floating point errors.
 */
export function parsePriceToCents(text: string): number {
    const cleaned = text.replace(/[^0-9.]/g, '');
    if (cleaned === '') {
        throw new Error(`Cannot parse price from text: "${text}"`);
    }
    return Math.round(parseFloat(cleaned) * 100);
}