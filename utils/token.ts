/**
 * Generates a random token with the specified length
 * @param length - The length of the token (default: 8)
 * @returns A random alphanumeric string
 */
export function generateRandomToken(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  
  return result
}

/**
 * Generates a random token with 8 characters (convenience function)
 * @returns A random 8-character alphanumeric string
 */
export function generateToken(): string {
  return generateRandomToken(8)
}