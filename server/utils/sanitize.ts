import sanitizeHtml from 'sanitize-html';

export function sanitizeHtmlContent(html: string): string {
  if (!html) return '';

  return sanitizeHtml(html, {
    allowedTags: [
      'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4',
      'h5', 'h6', 'hgroup', 'main', 'nav', 'section', 'blockquote', 'dd', 'div',
      'dl', 'dt', 'figcaption', 'figure', 'hr', 'li', 'main', 'ol', 'p', 'pre',
      'ul', 'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn',
      'em', 'i', 'kbd', 'mark', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp',
      'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
    ],
    allowedAttributes: {
      '*': ['class', 'style'],
      'a': ['href', 'name', 'target', 'rel']
    },
    allowedClasses: {
      '*': ['*'] // Allow all classes for styling (Tailwind, Quill custom styles)
    },
    allowedStyles: {
      '*': {
        // Allow text-align, color, background-color, font-weight, text-decoration, padding
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'color': [/^#(?:[0-9a-fA-F]{3}){1,2}$/, /^rgb\(\d+,\s*\d+,\s*\d+\)$/, /^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/],
        'background-color': [/^#(?:[0-9a-fA-F]{3}){1,2}$/, /^rgb\(\d+,\s*\d+,\s*\d+\)$/, /^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/],
        'font-weight': [/^\d+$/, /^bold$/, /^normal$/],
        'text-decoration': [/^underline$/, /^line-through$/, /^none$/],
        'padding-left': [/^\d+(?:px|em|rem|%)$/]
      }
    }
  });
}

export function sanitizePlainText(text: string): string {
  if (!text) return '';
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
}

