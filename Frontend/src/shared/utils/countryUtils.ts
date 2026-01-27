/**
 * Convert ISO 3166-1 alpha-2 country code to flag emoji
 * @param countryCode - Two-letter ISO country code (e.g., 'US', 'KE')
 * @returns Flag emoji or original code if invalid
 */
export function countryCodeToFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) {
    return countryCode;
  }
  
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

/**
 * Get a descriptive display for a country with flag
 * @param name - Country name
 * @param code - Country code
 * @returns Formatted string like "🇰🇪 Kenya"
 */
export function getCountryDisplay(name: string, code: string): string {
  const flag = countryCodeToFlag(code);
  return `${flag} ${name}`;
}

/**
 * Get flag emoji only from country code
 * @param code - Country code
 * @returns Flag emoji
 */
export function getFlagEmoji(code: string): string {
  return countryCodeToFlag(code);
}
