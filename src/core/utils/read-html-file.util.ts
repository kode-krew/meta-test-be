import { readFileSync } from 'fs';

export const readHtmlFile = (
  path: string,
  replacements: { [key: string]: string },
): string => {
  let content = readFileSync(path, 'utf8');
  for (const key in replacements) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
  }
  return content;
};
