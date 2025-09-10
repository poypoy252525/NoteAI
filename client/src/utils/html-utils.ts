/**
 * Strip HTML tags from a string and return plain text
 * @param html - HTML string to strip tags from
 * @returns Plain text string
 */
export function stripHtmlTags(html: string): string {
  // Create a temporary element to parse HTML
  const temp = document.createElement("div");
  temp.innerHTML = html;
  
  // Get text content and clean up whitespace
  return temp.textContent?.replace(/\s+/g, ' ').trim() || "";
}

/**
 * Get a preview of HTML content with a maximum length
 * @param html - HTML string to get preview from
 * @param maxLength - Maximum length of preview (default: 150)
 * @returns Plain text preview string
 */
export function getHtmlPreview(html: string, maxLength: number = 150): string {
  const plainText = stripHtmlTags(html);
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last space before maxLength to avoid cutting words
  const lastSpace = plainText.lastIndexOf(' ', maxLength);
  const cutoff = lastSpace > 0 ? lastSpace : maxLength;
  
  return plainText.substring(0, cutoff) + "...";
}
