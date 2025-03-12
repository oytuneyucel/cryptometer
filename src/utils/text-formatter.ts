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

export const generateSymbolsQuery = (symbols: string[]): string =>
  `["${symbols.join(`","`)}"]`;
