/**
 * Process a template string by replacing placeholders with values
 * @param template - The template string with placeholders like {{name}}
 * @param values - Object containing values for the placeholders
 * @returns The processed string with placeholders replaced
 */
export function processTemplate(template: string, values: Record<string, string> = {}): string {
  // If no template or it's empty, return empty string
  if (!template) return '';
  
  // Replace all placeholders with their values or keep the placeholder if no value is provided
  return template.replace(/{{([^}]+)}}/g, (match, placeholder) => {
    return values[placeholder] || match;
  });
}

/**
 * Extract placeholders from a template string
 * @param template - The template string with placeholders like {{name}}
 * @returns Array of placeholder names without the brackets
 */
export function extractPlaceholders(template: string): string[] {
  if (!template) return [];
  
  const matches = template.match(/{{([^}]+)}}/g) || [];
  return matches.map(match => match.slice(2, -2));
}
