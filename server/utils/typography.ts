import { prisma } from './prisma'

export interface TypographySectionConfig {
  fontFamily?: string
  fontSize?: string
  fontSizeMobile?: string
  fontWeight?: string
  fontStyle?: string
  lineHeight?: string
  letterSpacing?: string
  color?: string
  textTransform?: string
}

export interface TypographyConfig {
  body: TypographySectionConfig
  headings: TypographySectionConfig
  h1: TypographySectionConfig
  h2: TypographySectionConfig
  h3: TypographySectionConfig
  h4: TypographySectionConfig
  h5: TypographySectionConfig
  h6: TypographySectionConfig
  display: TypographySectionConfig
  navigation: TypographySectionConfig
  button: TypographySectionConfig
  projectTitle: TypographySectionConfig
}

export const AVAILABLE_FONTS = [
  { name: 'DM Sans', category: 'Sans-Serif', google: 'DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400' },
  { name: 'Cormorant Garamond', category: 'Serif', google: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400' },
  { name: 'Inter', category: 'Sans-Serif', google: 'Inter:wght@300;400;500;600;700' },
  { name: 'Plus Jakarta Sans', category: 'Sans-Serif', google: 'Plus+Jakarta+Sans:wght@300;400;500;600;700' },
  { name: 'Outfit', category: 'Sans-Serif', google: 'Outfit:wght@300;400;500;600;700' },
  { name: 'Playfair Display', category: 'Serif', google: 'Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Lora', category: 'Serif', google: 'Lora:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Montserrat', category: 'Sans-Serif', google: 'Montserrat:wght@300;400;500;600;700' },
  { name: 'Manrope', category: 'Sans-Serif', google: 'Manrope:wght@300;400;500;600;700' },
  { name: 'Cinzel', category: 'Serif', google: 'Cinzel:wght@400;500;600;700' },
  { name: 'System Sans', category: 'System', google: null },
  { name: 'System Serif', category: 'System', google: null }
]

export const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  body: {
    fontFamily: 'DM Sans',
    fontSize: '15px',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: '1.65',
    letterSpacing: '-0.01em',
    color: '#364d59'
  },
  headings: {
    fontFamily: 'DM Sans',
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    color: '#1a1a1a'
  },
  h1: {
    fontSize: '42px',
    fontSizeMobile: '28px',
    fontWeight: '500',
    lineHeight: '1.2',
    letterSpacing: '-0.025em'
  },
  h2: {
    fontSize: '32px',
    fontSizeMobile: '24px',
    fontWeight: '500',
    lineHeight: '1.25',
    letterSpacing: '-0.02em'
  },
  h3: {
    fontSize: '24px',
    fontSizeMobile: '20px',
    fontWeight: '500',
    lineHeight: '1.3',
    letterSpacing: '-0.015em'
  },
  h4: {
    fontSize: '18px',
    fontSizeMobile: '16px',
    fontWeight: '600',
    lineHeight: '1.35',
    letterSpacing: '-0.01em'
  },
  h5: {
    fontSize: '16px',
    fontSizeMobile: '14px',
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0'
  },
  h6: {
    fontSize: '14px',
    fontSizeMobile: '13px',
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0.02em'
  },
  display: {
    fontFamily: 'Cormorant Garamond',
    fontSize: '48px',
    fontSizeMobile: '34px',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: '1.15',
    letterSpacing: '-0.02em',
    color: '#090402'
  },
  navigation: {
    fontFamily: 'DM Sans',
    fontSize: '14px',
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: '0.02em',
    textTransform: 'none'
  },
  button: {
    fontFamily: 'DM Sans',
    fontSize: '12px',
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  },
  projectTitle: {
    fontFamily: 'Cormorant Garamond',
    fontSize: '48px',
    fontSizeMobile: '32px',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: '1.15',
    letterSpacing: '-0.025em',
    color: '#090402'
  }
}

function resolveFontFamily(name?: string): string {
  if (!name || name === 'DM Sans') {
    return '"DM Sans", system-ui, -apple-system, sans-serif'
  }
  if (name === 'Cormorant Garamond') {
    return '"Cormorant Garamond", Georgia, serif'
  }
  if (name === 'System Sans') {
    return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
  if (name === 'System Serif') {
    return 'Georgia, Cambria, "Times New Roman", Times, serif'
  }
  return `"${name}", system-ui, sans-serif`
}

export function generateTypographyCss(config: TypographyConfig): string {
  const c = config
  const bodyFont = resolveFontFamily(c.body.fontFamily)
  const headingsFont = resolveFontFamily(c.headings.fontFamily)
  const displayFont = resolveFontFamily(c.display.fontFamily)
  const navFont = resolveFontFamily(c.navigation.fontFamily)
  const btnFont = resolveFontFamily(c.button.fontFamily)
  const projFont = resolveFontFamily(c.projectTitle.fontFamily)

  return `
/* Dynamic Website Typography Settings (Auto-generated from Admin Panel) */
:root {
  --font-default: ${bodyFont};
  --font-primary: ${headingsFont};
  --font-secondary: ${displayFont};

  --site-body-font: ${bodyFont};
  --site-body-size: ${c.body.fontSize || '15px'};
  --site-body-weight: ${c.body.fontWeight || '400'};
  --site-body-style: ${c.body.fontStyle || 'normal'};
  --site-body-line-height: ${c.body.lineHeight || '1.65'};
  --site-body-letter-spacing: ${c.body.letterSpacing || '-0.01em'};
  --site-body-color: ${c.body.color || '#364d59'};

  --site-heading-font: ${headingsFont};
  --site-heading-weight: ${c.headings.fontWeight || '500'};
  --site-heading-style: ${c.headings.fontStyle || 'normal'};
  --site-heading-line-height: ${c.headings.lineHeight || '1.2'};
  --site-heading-letter-spacing: ${c.headings.letterSpacing || '-0.02em'};
  --site-heading-color: ${c.headings.color || '#1a1a1a'};

  --site-h1-size: ${c.h1.fontSize || '42px'};
  --site-h1-weight: ${c.h1.fontWeight || '500'};
  --site-h1-line-height: ${c.h1.lineHeight || '1.2'};
  --site-h1-letter-spacing: ${c.h1.letterSpacing || '-0.025em'};

  --site-h2-size: ${c.h2.fontSize || '32px'};
  --site-h2-weight: ${c.h2.fontWeight || '500'};
  --site-h2-line-height: ${c.h2.lineHeight || '1.25'};
  --site-h2-letter-spacing: ${c.h2.letterSpacing || '-0.02em'};

  --site-h3-size: ${c.h3.fontSize || '24px'};
  --site-h3-weight: ${c.h3.fontWeight || '500'};
  --site-h3-line-height: ${c.h3.lineHeight || '1.3'};
  --site-h3-letter-spacing: ${c.h3.letterSpacing || '-0.015em'};

  --site-h4-size: ${c.h4.fontSize || '18px'};
  --site-h4-weight: ${c.h4.fontWeight || '600'};
  --site-h4-line-height: ${c.h4.lineHeight || '1.35'};
  --site-h4-letter-spacing: ${c.h4.letterSpacing || '-0.01em'};

  --site-h5-size: ${c.h5.fontSize || '16px'};
  --site-h5-weight: ${c.h5.fontWeight || '600'};
  --site-h5-line-height: ${c.h5.lineHeight || '1.4'};
  --site-h5-letter-spacing: ${c.h5.letterSpacing || '0'};

  --site-h6-size: ${c.h6.fontSize || '14px'};
  --site-h6-weight: ${c.h6.fontWeight || '600'};
  --site-h6-line-height: ${c.h6.lineHeight || '1.4'};
  --site-h6-letter-spacing: ${c.h6.letterSpacing || '0.02em'};

  --site-display-font: ${displayFont};
  --site-display-size: ${c.display.fontSize || '48px'};
  --site-display-weight: ${c.display.fontWeight || '400'};
  --site-display-style: ${c.display.fontStyle || 'normal'};
  --site-display-line-height: ${c.display.lineHeight || '1.15'};
  --site-display-letter-spacing: ${c.display.letterSpacing || '-0.02em'};
  --site-display-color: ${c.display.color || '#090402'};

  --site-nav-font: ${navFont};
  --site-nav-size: ${c.navigation.fontSize || '14px'};
  --site-nav-weight: ${c.navigation.fontWeight || '500'};
  --site-nav-style: ${c.navigation.fontStyle || 'normal'};
  --site-nav-letter-spacing: ${c.navigation.letterSpacing || '0.02em'};
  --site-nav-transform: ${c.navigation.textTransform || 'none'};

  --site-btn-font: ${btnFont};
  --site-btn-size: ${c.button.fontSize || '12px'};
  --site-btn-weight: ${c.button.fontWeight || '700'};
  --site-btn-style: ${c.button.fontStyle || 'normal'};
  --site-btn-letter-spacing: ${c.button.letterSpacing || '0.05em'};
  --site-btn-transform: ${c.button.textTransform || 'uppercase'};

  --site-project-title-font: ${projFont};
  --site-project-title-size: ${c.projectTitle.fontSize || '48px'};
  --site-project-title-weight: ${c.projectTitle.fontWeight || '400'};
  --site-project-title-style: ${c.projectTitle.fontStyle || 'normal'};
  --site-project-title-line-height: ${c.projectTitle.lineHeight || '1.15'};
  --site-project-title-letter-spacing: ${c.projectTitle.letterSpacing || '-0.025em'};
  --site-project-title-color: ${c.projectTitle.color || '#090402'};
}

body {
  font-family: var(--site-body-font);
  font-size: var(--site-body-size);
  font-weight: var(--site-body-weight);
  font-style: var(--site-body-style);
  line-height: var(--site-body-line-height);
  letter-spacing: var(--site-body-letter-spacing);
  color: var(--site-body-color);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--site-heading-font);
  font-style: var(--site-heading-style);
  color: var(--site-heading-color);
}

h1:not(.font-display) {
  font-size: var(--site-h1-size);
  font-weight: var(--site-h1-weight);
  line-height: var(--site-h1-line-height);
  letter-spacing: var(--site-h1-letter-spacing);
}

h2 {
  font-size: var(--site-h2-size);
  font-weight: var(--site-h2-weight);
  line-height: var(--site-h2-line-height);
  letter-spacing: var(--site-h2-letter-spacing);
}

h3 {
  font-size: var(--site-h3-size);
  font-weight: var(--site-h3-weight);
  line-height: var(--site-h3-line-height);
  letter-spacing: var(--site-h3-letter-spacing);
}

h4 {
  font-size: var(--site-h4-size);
  font-weight: var(--site-h4-weight);
  line-height: var(--site-h4-line-height);
  letter-spacing: var(--site-h4-letter-spacing);
}

h5 {
  font-size: var(--site-h5-size);
  font-weight: var(--site-h5-weight);
  line-height: var(--site-h5-line-height);
  letter-spacing: var(--site-h5-letter-spacing);
}

h6 {
  font-size: var(--site-h6-size);
  font-weight: var(--site-h6-weight);
  line-height: var(--site-h6-line-height);
  letter-spacing: var(--site-h6-letter-spacing);
}

.font-display,
.display-heading {
  font-family: var(--site-display-font) !important;
  font-weight: var(--site-display-weight);
  font-style: var(--site-display-style);
  letter-spacing: var(--site-display-letter-spacing);
}

.project-title,
.project-detail-title,
h1.font-display {
  font-family: var(--site-project-title-font) !important;
  font-size: var(--site-project-title-size);
  font-weight: var(--site-project-title-weight);
  font-style: var(--site-project-title-style);
  line-height: var(--site-project-title-line-height);
  letter-spacing: var(--site-project-title-letter-spacing);
  color: var(--site-project-title-color);
}

.navbar a,
.navbar a:focus,
nav.navbar a {
  font-family: var(--site-nav-font);
  font-size: var(--site-nav-size);
  font-weight: var(--site-nav-weight);
  font-style: var(--site-nav-style);
  letter-spacing: var(--site-nav-letter-spacing);
  text-transform: var(--site-nav-transform);
}

button.btn-primary,
button.btn-secondary,
.btn-primary,
.btn-secondary,
.btn {
  font-family: var(--site-btn-font);
  font-size: var(--site-btn-size);
  font-weight: var(--site-btn-weight);
  font-style: var(--site-btn-style);
  letter-spacing: var(--site-btn-letter-spacing);
  text-transform: var(--site-btn-transform);
}

/* Responsive Font Scaling for Mobile & Tablet */
@media (max-width: 768px) {
  h1:not(.font-display) { font-size: ${c.h1.fontSizeMobile || '28px'} !important; }
  h2 { font-size: ${c.h2.fontSizeMobile || '24px'} !important; }
  h3 { font-size: ${c.h3.fontSizeMobile || '20px'} !important; }
  h4 { font-size: ${c.h4.fontSizeMobile || '16px'} !important; }
  h5 { font-size: ${c.h5.fontSizeMobile || '14px'} !important; }
  h6 { font-size: ${c.h6.fontSizeMobile || '13px'} !important; }
  .font-display { font-size: ${c.display.fontSizeMobile || '34px'}; }
  .project-title,
  .project-detail-title,
  h1.font-display { font-size: ${c.projectTitle.fontSizeMobile || '32px'} !important; }
}
`.trim()
}

export function getGoogleFontsLinks(config: TypographyConfig): string[] {
  const families = new Set<string>()
  const collect = (font?: string) => {
    if (!font) return
    const match = AVAILABLE_FONTS.find(f => f.name === font && f.google)
    if (match?.google) {
      families.add(match.google)
    }
  }

  collect(config.body.fontFamily)
  collect(config.headings.fontFamily)
  collect(config.display.fontFamily)
  collect(config.navigation.fontFamily)
  collect(config.button.fontFamily)
  collect(config.projectTitle.fontFamily)

  if (!families.size) return []
  return Array.from(families).map(family => `https://fonts.googleapis.com/css2?family=${family}&display=swap`)
}

export async function getTypographyConfig(): Promise<{ config: TypographyConfig; isDefault: boolean; updatedAt: Date | null }> {
  try {
    const record = await prisma.settings.findUnique({
      where: { setting_key: 'site_typography' }
    })

    if (!record?.setting_value) {
      return {
        config: JSON.parse(JSON.stringify(DEFAULT_TYPOGRAPHY)),
        isDefault: true,
        updatedAt: null
      }
    }

    const parsed = JSON.parse(record.setting_value)
    // Deep merge with default to guarantee all fields exist even if schema expands
    const merged: TypographyConfig = {
      body: { ...DEFAULT_TYPOGRAPHY.body, ...(parsed.body || {}) },
      headings: { ...DEFAULT_TYPOGRAPHY.headings, ...(parsed.headings || {}) },
      h1: { ...DEFAULT_TYPOGRAPHY.h1, ...(parsed.h1 || {}) },
      h2: { ...DEFAULT_TYPOGRAPHY.h2, ...(parsed.h2 || {}) },
      h3: { ...DEFAULT_TYPOGRAPHY.h3, ...(parsed.h3 || {}) },
      h4: { ...DEFAULT_TYPOGRAPHY.h4, ...(parsed.h4 || {}) },
      h5: { ...DEFAULT_TYPOGRAPHY.h5, ...(parsed.h5 || {}) },
      h6: { ...DEFAULT_TYPOGRAPHY.h6, ...(parsed.h6 || {}) },
      display: { ...DEFAULT_TYPOGRAPHY.display, ...(parsed.display || {}) },
      navigation: { ...DEFAULT_TYPOGRAPHY.navigation, ...(parsed.navigation || {}) },
      button: { ...DEFAULT_TYPOGRAPHY.button, ...(parsed.button || {}) },
      projectTitle: { ...DEFAULT_TYPOGRAPHY.projectTitle, ...(parsed.projectTitle || {}) }
    }

    return {
      config: merged,
      isDefault: false,
      updatedAt: record.updated_at
    }
  } catch (err) {
    console.error('Error fetching typography config:', err)
    return {
      config: JSON.parse(JSON.stringify(DEFAULT_TYPOGRAPHY)),
      isDefault: true,
      updatedAt: null
    }
  }
}
