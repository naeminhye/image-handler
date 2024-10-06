export const PIECE_SIZE_OPTIONS = [100, 200, 500, 1000];

export const SEPARATOR = "-";
export function replaceDashesWithRandomChars(input: string) {
  return input.replace(/-/g, () => {
    // Generate a random letter (both upper and lower case)
    const isUpperCase = Math.random() < 0.5; // Randomly choose upper or lower case
    const randomCharCode =
      Math.floor(Math.random() * 26) + (isUpperCase ? 65 : 97); // 65 is 'A', 97 is 'a'
    return String.fromCharCode(randomCharCode);
  });
}

export function revertToOriginalString(modifiedString: string) {
  // Replace every character with a hyphen to revert back to original structure
  return modifiedString.replace(/[a-zA-Z]/g, SEPARATOR); // Replace all letters with '-'
}
