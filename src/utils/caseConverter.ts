export const toLowerCase = (text: string): string => text.toLowerCase();

export const toUpperCase = (text: string): string => text.toUpperCase();

export const toCamelCase = (text: string): string => {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, "");
};

export const toCapitalCase = (text: string): string => {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const toConstantCase = (text: string): string => {
  return text.replace(/\s+/g, "_").toUpperCase();
};

export const toDotCase = (text: string): string => {
  return text.replace(/\s+/g, ".").toLowerCase();
};

export const toHeaderCase = (text: string): string => {
  return text
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, "-");
};

export const toParamCase = (text: string): string => {
  return text.replace(/\s+/g, "-").toLowerCase();
};

export const toPascalCase = (text: string): string => {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => match.toUpperCase())
    .replace(/\s+/g, "");
};

export const toPathCase = (text: string): string => {
  return text.replace(/\s+/g, "/").toLowerCase();
};

export const toSentenceCase = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase());
};

export const toSnakeCase = (text: string): string => {
  return text.replace(/\s+/g, "_").toLowerCase();
};

export const toSwapCase = (text: string): string => {
  return text
    .split("")
    .map((char) =>
      char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
    )
    .join("");
};

export const toTitleCase = (text: string): string => {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};
