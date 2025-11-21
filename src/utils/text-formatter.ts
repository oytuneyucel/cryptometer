/**
 * At lower prices, additional decimals become important. Therefore we format a given price based on its value.
 * - If the price is less than 1, it returns the price with 6 decimal places.
 * - If the price is between 1 and 10 (inclusive), it returns the price with 4 decimal places.
 * - If the price is greater than or equal to 10, it returns the price with 2 decimal places.
 *
 * @param {number} price - The price to format.
 * @returns {string} - The formatted price as a string.
 */
export const formatPrice = (price: number): string =>
  `$${
    price < 0.01
      ? price.toFixed(6)
      : price < 10
      ? price.toFixed(4)
      : price.toFixed(2)
  }`;

/**
 * Format large volume numbers with K, M, B suffixes for readability
 * 
 * @param {number} volume - The volume to format.
 * @returns {string} - The formatted volume as a string.
 */
export const formatVolume = (volume: number): string => {
  if (volume >= 1_000_000_000) {
    return `${(volume / 1_000_000_000).toFixed(2)}B`;
  } else if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`;
  } else if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(2)}K`;
  }
  return volume.toFixed(2);
};

export const generateSymbolsQuery = (symbols: string[]): string =>
  `["${symbols.join(`","`)}"]`;
