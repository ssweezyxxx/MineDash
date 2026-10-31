export const THEME_STORAGE_KEY = 'blockmine-theme';
export const CUSTOM_THEME_STORAGE_KEY = 'blockmine-custom-theme';
export const DEFAULT_THEME = 'dark';
export const THEME_MODES = ['light', 'dark', 'system', 'custom'];

const THEME_COLOR_META = {
  dark: '#111318',
  light: '#F8F9FF',
};

export const CUSTOM_THEME_COLOR_FIELDS = {
  background: { cssVar: 'background', labelKey: 'theme.editor.colors.background.label', descriptionKey: 'theme.editor.colors.background.description' },
  foreground: { cssVar: 'foreground', labelKey: 'theme.editor.colors.foreground.label', descriptionKey: 'theme.editor.colors.foreground.description' },
  card: { cssVar: 'card', labelKey: 'theme.editor.colors.card.label', descriptionKey: 'theme.editor.colors.card.description' },
  cardForeground: { cssVar: 'card-foreground', labelKey: 'theme.editor.colors.cardForeground.label', descriptionKey: 'theme.editor.colors.cardForeground.description' },
  popover: { cssVar: 'popover', labelKey: 'theme.editor.colors.popover.label', descriptionKey: 'theme.editor.colors.popover.description' },
  popoverForeground: { cssVar: 'popover-foreground', labelKey: 'theme.editor.colors.popoverForeground.label', descriptionKey: 'theme.editor.colors.popoverForeground.description' },
  primary: { cssVar: 'primary', labelKey: 'theme.editor.colors.primary.label', descriptionKey: 'theme.editor.colors.primary.description' },
  primaryForeground: { cssVar: 'primary-foreground', labelKey: 'theme.editor.colors.primaryForeground.label', descriptionKey: 'theme.editor.colors.primaryForeground.description' },
  secondary: { cssVar: 'secondary', labelKey: 'theme.editor.colors.secondary.label', descriptionKey: 'theme.editor.colors.secondary.description' },
  secondaryForeground: { cssVar: 'secondary-foreground', labelKey: 'theme.editor.colors.secondaryForeground.label', descriptionKey: 'theme.editor.colors.secondaryForeground.description' },
  muted: { cssVar: 'muted', labelKey: 'theme.editor.colors.muted.label', descriptionKey: 'theme.editor.colors.muted.description' },
  mutedForeground: { cssVar: 'muted-foreground', labelKey: 'theme.editor.colors.mutedForeground.label', descriptionKey: 'theme.editor.colors.mutedForeground.description' },
  accent: { cssVar: 'accent', labelKey: 'theme.editor.colors.accent.label', descriptionKey: 'theme.editor.colors.accent.description' },
  accentForeground: { cssVar: 'accent-foreground', labelKey: 'theme.editor.colors.accentForeground.label', descriptionKey: 'theme.editor.colors.accentForeground.description' },
  border: { cssVar: 'border', labelKey: 'theme.editor.colors.border.label', descriptionKey: 'theme.editor.colors.border.description' },
  input: { cssVar: 'input', labelKey: 'theme.editor.colors.input.label', descriptionKey: 'theme.editor.colors.input.description' },
  ring: { cssVar: 'ring', labelKey: 'theme.editor.colors.ring.label', descriptionKey: 'theme.editor.colors.ring.description' },
  graphHeader: { cssVar: 'graph-header', labelKey: 'theme.editor.colors.graphHeader.label', descriptionKey: 'theme.editor.colors.graphHeader.description' },
  graphSurface: { cssVar: 'graph-surface', labelKey: 'theme.editor.colors.graphSurface.label', descriptionKey: 'theme.editor.colors.graphSurface.description' },
  graphInput: { cssVar: 'graph-input', labelKey: 'theme.editor.colors.graphInput.label', descriptionKey: 'theme.editor.colors.graphInput.description' },
  scrollbarThumb: { cssVar: 'scrollbar-thumb', labelKey: 'theme.editor.colors.scrollbarThumb.label', descriptionKey: 'theme.editor.colors.scrollbarThumb.description' },
  scrollbarThumbHover: { cssVar: 'scrollbar-thumb-hover', labelKey: 'theme.editor.colors.scrollbarThumbHover.label', descriptionKey: 'theme.editor.colors.scrollbarThumbHover.description' },
  scrollbarButtonBg: { cssVar: 'scrollbar-button-bg', labelKey: 'theme.editor.colors.scrollbarButtonBg.label', descriptionKey: 'theme.editor.colors.scrollbarButtonBg.description' },
};

export const CUSTOM_THEME_SECTIONS = [
  {
    titleKey: 'theme.editor.sections.surface.title',
    descriptionKey: 'theme.editor.sections.surface.description',
    colorKeys: ['background', 'foreground', 'card', 'cardForeground', 'popover', 'popoverForeground'],
  },
  {
    titleKey: 'theme.editor.sections.brand.title',
    descriptionKey: 'theme.editor.sections.brand.description',
    colorKeys: ['primary', 'primaryForeground', 'ring'],
  },
  {
    titleKey: 'theme.editor.sections.ui.title',
    descriptionKey: 'theme.editor.sections.ui.description',
    colorKeys: ['secondary', 'secondaryForeground', 'muted', 'mutedForeground', 'accent', 'accentForeground', 'border', 'input'],
  },
  {
    titleKey: 'theme.editor.sections.graphEditor.title',
    descriptionKey: 'theme.editor.sections.graphEditor.description',
    colorKeys: ['graphHeader', 'graphSurface', 'graphInput'],
  },
  {
    titleKey: 'theme.editor.sections.scrollbar.title',
    descriptionKey: 'theme.editor.sections.scrollbar.description',
    colorKeys: ['scrollbarThumb', 'scrollbarThumbHover', 'scrollbarButtonBg'],
  },
];

/* Google Pixel Material 3 (Material You) Dark Default */
const DARK_PRESET_COLORS = {
  background: '#111318',
  foreground: '#E2E2E9',
  card: '#1D2026',
  cardForeground: '#E2E2E9',
  popover: '#252830',
  popoverForeground: '#E2E2E9',
  primary: '#A8C7FA',
  primaryForeground: '#062E6F',
  secondary: '#283141',
  secondaryForeground: '#D7E3F7',
  muted: '#191C22',
  mutedForeground: '#B8BBC6',
  accent: '#28354A',
  accentForeground: '#D3E3FD',
  border: '#32353E',
  input: '#373A45',
  ring: '#A8C7FA',
  graphHeader: '#2C384E',
  graphSurface: '#1D222D',
  graphInput: '#131720',
  scrollbarThumb: '#434752',
  scrollbarThumbHover: '#59637A',
  scrollbarButtonBg: '#1D2026',
};

/* Google Pixel Material 3 (Material You) Light Default */
const LIGHT_PRESET_COLORS = {
  background: '#F8F9FF',
  foreground: '#191C20',
  card: '#EFF1F8',
  cardForeground: '#191C20',
  popover: '#E8EBF4',
  popoverForeground: '#191C20',
  primary: '#0B57D0',
  primaryForeground: '#FFFFFF',
  secondary: '#D3E3FD',
  secondaryForeground: '#041E49',
  muted: '#E8ECF4',
  mutedForeground: '#44474E',
  accent: '#D3E3FD',
  accentForeground: '#041E49',
  border: '#D8DDE8',
  input: '#C4C7D0',
  ring: '#0B57D0',
  graphHeader: '#2C384E',
  graphSurface: '#1D222D',
  graphInput: '#131720',
  scrollbarThumb: '#ACB2C0',
  scrollbarThumbHover: '#77839B',
  scrollbarButtonBg: '#E8ECF4',
};

export const BUILT_IN_THEME_PRESETS = {
  dark: {
    baseTheme: 'dark',
    colors: DARK_PRESET_COLORS,
  },
  light: {
    baseTheme: 'light',
    colors: LIGHT_PRESET_COLORS,
  },
};

const CUSTOM_THEME_VARIABLES = Object.values(CUSTOM_THEME_COLOR_FIELDS).map((field) => field.cssVar);

function clonePreset(baseTheme = 'dark') {
  const preset = BUILT_IN_THEME_PRESETS[baseTheme] || BUILT_IN_THEME_PRESETS.dark;
  return {
    baseTheme: preset.baseTheme,
    colors: { ...preset.colors },
  };
}

export function normalizeHexColor(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  if (!/^#([\da-fA-F]{3}|[\da-fA-F]{6})$/.test(withHash)) {
    return null;
  }

  if (withHash.length === 4) {
    return `#${withHash[1]}${withHash[1]}${withHash[2]}${withHash[2]}${withHash[3]}${withHash[3]}`.toUpperCase();
  }

  return withHash.toUpperCase();
}

export function hexToRgb(hex) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;

  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHslChannels({ r, g, b }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
  }

  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return `${hue} ${(saturation * 100).toFixed(1)}% ${(lightness * 100).toFixed(1)}%`;
}

export function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return { h: 0, s: 0, l: 0 };
  }

  const red = rgb.r / 255;
  const green = rgb.g / 255;
  const blue = rgb.b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
  }

  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

export function hslToHex({ h, s, l }) {
  const hue = ((Number(h) % 360) + 360) % 360;
  const saturation = Math.max(0, Math.min(100, Number(s))) / 100;
  const lightness = Math.max(0, Math.min(100, Number(l))) / 100;

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = hue / 60;
  const x = chroma * (1 - Math.abs((segment % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment >= 0 && segment < 1) [red, green, blue] = [chroma, x, 0];
  else if (segment >= 1 && segment < 2) [red, green, blue] = [x, chroma, 0];
  else if (segment >= 2 && segment < 3) [red, green, blue] = [0, chroma, x];
  else if (segment >= 3 && segment < 4) [red, green, blue] = [0, x, chroma];
  else if (segment >= 4 && segment < 5) [red, green, blue] = [x, 0, chroma];
  else [red, green, blue] = [chroma, 0, x];

  const match = lightness - chroma / 2;
  const toHex = (value) => Math.round((value + match) * 255).toString(16).padStart(2, '0');

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`.toUpperCase();
}

function applyCustomThemeVariables(root, customTheme) {
  Object.entries(CUSTOM_THEME_COLOR_FIELDS).forEach(([key, field]) => {
    const color = customTheme.colors[key];
    const rgb = hexToRgb(color);
    if (!rgb) return;
    root.style.setProperty(`--${field.cssVar}`, rgbToHslChannels(rgb));
  });
}

function clearCustomThemeVariables(root) {
  CUSTOM_THEME_VARIABLES.forEach((cssVar) => {
    root.style.removeProperty(`--${cssVar}`);
  });
}

export function sanitizeCustomTheme(theme) {
  const fallbackBaseTheme = theme?.baseTheme === 'light' ? 'light' : 'dark';
  const fallback = clonePreset(fallbackBaseTheme);
  const nextColors = { ...fallback.colors };

  Object.keys(nextColors).forEach((colorKey) => {
    const normalized = normalizeHexColor(theme?.colors?.[colorKey]);
    if (normalized) {
      nextColors[colorKey] = normalized;
    }
  });

  return {
    baseTheme: fallbackBaseTheme,
    colors: nextColors,
  };
}

export function getDefaultCustomTheme(baseTheme = 'dark') {
  return clonePreset(baseTheme);
}

export function loadStoredCustomTheme() {
  if (typeof window === 'undefined') {
    return clonePreset('dark');
  }

  try {
    const stored = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
    if (!stored) {
      return clonePreset('dark');
    }

    return sanitizeCustomTheme(JSON.parse(stored));
  } catch {
    return clonePreset('dark');
  }
}

export function readStoredThemeMode() {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME;
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_MODES.includes(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function syncThemeColorMeta(resolvedTheme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    return;
  }

  meta.setAttribute('content', resolvedTheme === 'dark' ? THEME_COLOR_META.dark : THEME_COLOR_META.light);
}

export function resolveRenderedTheme(theme, customTheme) {
  if (theme === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  if (theme === 'custom') {
    return sanitizeCustomTheme(customTheme).baseTheme;
  }

  return theme === 'dark' ? 'dark' : 'light';
}

export function applyThemeToDocument(theme, customTheme) {
  if (typeof window === 'undefined') {
    return resolveRenderedTheme(theme, customTheme);
  }

  const root = window.document.documentElement;
  const resolvedTheme = resolveRenderedTheme(theme, customTheme);

  root.classList.remove('light', 'dark');
  clearCustomThemeVariables(root);
  root.classList.add(resolvedTheme);
  root.dataset.themeMode = theme;
  syncThemeColorMeta(resolvedTheme);

  if (theme === 'custom') {
    applyCustomThemeVariables(root, sanitizeCustomTheme(customTheme));
  }

  return resolvedTheme;
}

export function applyCustomThemePreviewToDocument(customTheme) {
  if (typeof window === 'undefined') {
    return;
  }

  const root = window.document.documentElement;
  const sanitizedTheme = sanitizeCustomTheme(customTheme);

  root.classList.remove('light', 'dark');
  root.classList.add(sanitizedTheme.baseTheme);
  root.dataset.themeMode = 'custom';
  syncThemeColorMeta(sanitizedTheme.baseTheme);
  clearCustomThemeVariables(root);
  applyCustomThemeVariables(root, sanitizedTheme);
}

export function getThemeMenuSwatch(theme, customTheme) {
  if (theme === 'custom') {
    return sanitizeCustomTheme(customTheme).colors.primary;
  }

  return (BUILT_IN_THEME_PRESETS[theme] || BUILT_IN_THEME_PRESETS.dark).colors.primary;
}

export function parseColorInput(value, fallback) {
  return normalizeHexColor(value) || fallback;
}

export const PRESET_STORAGE_KEY = 'copymine-theme-preset';

export const NAMED_THEME_PRESETS = {
  pixelBlue: {
    label: { ru: 'Pixel Синий (Material You)', en: 'Pixel Blue (Material You)' },
    baseTheme: 'dark',
    colors: { ...DARK_PRESET_COLORS },
  },
  pixelMint: {
    label: { ru: 'Pixel Мята (Material You)', en: 'Pixel Mint (Material You)' },
    baseTheme: 'dark',
    colors: {
      background: '#0F1512', foreground: '#DFEAE3', card: '#1B221E', cardForeground: '#DFEAE3',
      popover: '#242C28', popoverForeground: '#DFEAE3', primary: '#89F8C7', primaryForeground: '#003824',
      secondary: '#24342C', secondaryForeground: '#CFE9D9', muted: '#171D1A', mutedForeground: '#BACAC0',
      accent: '#1F372B', accentForeground: '#A6F2CE', border: '#2E3833', input: '#333F39', ring: '#89F8C7',
    },
  },
  pixelLavender: {
    label: { ru: 'Pixel Лаванда (Material You)', en: 'Pixel Lavender (Material You)' },
    baseTheme: 'dark',
    colors: {
      background: '#141218', foreground: '#E6E0E9', card: '#211F26', cardForeground: '#E6E0E9',
      popover: '#2B2930', popoverForeground: '#E6E0E9', primary: '#D0BCFF', primaryForeground: '#381E72',
      secondary: '#332D41', secondaryForeground: '#E8DEF8', muted: '#1D1B20', mutedForeground: '#CAC4D0',
      accent: '#3B324B', accentForeground: '#EADDFF', border: '#36343B', input: '#3D3A43', ring: '#D0BCFF',
    },
  },
  pixelPeach: {
    label: { ru: 'Pixel Персик (Material You)', en: 'Pixel Peach (Material You)' },
    baseTheme: 'dark',
    colors: {
      background: '#181210', foreground: '#F1DFDA', card: '#251E1B', cardForeground: '#F1DFDA',
      popover: '#302825', popoverForeground: '#F1DFDA', primary: '#FFB59D', primaryForeground: '#5C1900',
      secondary: '#3D2C26', secondaryForeground: '#FFDBCF', muted: '#201A17', mutedForeground: '#D8C2BC',
      accent: '#463029', accentForeground: '#FFDBCF', border: '#3D332F', input: '#463A36', ring: '#FFB59D',
    },
  },
  pixelDaylight: {
    label: { ru: 'Pixel Светлый (Material You)', en: 'Pixel Daylight (Material You)' },
    baseTheme: 'light',
    colors: { ...LIGHT_PRESET_COLORS },
  },
  midnight: {
    label: { ru: 'Полночь', en: 'Midnight' },
    baseTheme: 'dark',
    colors: {
      background: '#0B1020', foreground: '#E8ECF8', card: '#111833', cardForeground: '#E8ECF8',
      popover: '#111833', popoverForeground: '#E8ECF8', primary: '#3B82F6', primaryForeground: '#FFFFFF',
      secondary: '#1B2547', secondaryForeground: '#E8ECF8', muted: '#1B2547', mutedForeground: '#9AA6C7',
      accent: '#1B2547', accentForeground: '#E8ECF8', border: '#1F2B52', input: '#1F2B52', ring: '#3B82F6',
    },
  },
  emerald: {
    label: { ru: 'Изумруд', en: 'Emerald' },
    baseTheme: 'dark',
    colors: {
      background: '#07110D', foreground: '#E6F4EC', card: '#0C1A14', cardForeground: '#E6F4EC',
      popover: '#0C1A14', popoverForeground: '#E6F4EC', primary: '#10B981', primaryForeground: '#04120C',
      secondary: '#13251C', secondaryForeground: '#E6F4EC', muted: '#13251C', mutedForeground: '#8FB3A0',
      accent: '#13251C', accentForeground: '#E6F4EC', border: '#173326', input: '#173326', ring: '#10B981',
    },
  },
  sunset: {
    label: { ru: 'Закат', en: 'Sunset' },
    baseTheme: 'dark',
    colors: {
      background: '#14090A', foreground: '#FBEDE6', card: '#1E0F10', cardForeground: '#FBEDE6',
      popover: '#1E0F10', popoverForeground: '#FBEDE6', primary: '#F97316', primaryForeground: '#1A0A00',
      secondary: '#2C1614', secondaryForeground: '#FBEDE6', muted: '#2C1614', mutedForeground: '#C09A8C',
      accent: '#2C1614', accentForeground: '#FBEDE6', border: '#3A1C14', input: '#3A1C14', ring: '#F97316',
    },
  },
  rose: {
    label: { ru: 'Роза', en: 'Rose' },
    baseTheme: 'dark',
    colors: {
      background: '#12080C', foreground: '#FBE9EE', card: '#1C0D14', cardForeground: '#FBE9EE',
      popover: '#1C0D14', popoverForeground: '#FBE9EE', primary: '#F43F5E', primaryForeground: '#FFFFFF',
      secondary: '#2A1520', secondaryForeground: '#FBE9EE', muted: '#2A1520', mutedForeground: '#C697A6',
      accent: '#2A1520', accentForeground: '#FBE9EE', border: '#3A1B2A', input: '#3A1B2A', ring: '#F43F5E',
    },
  },
  nord: {
    label: { ru: 'Норд', en: 'Nord' },
    baseTheme: 'dark',
    colors: {
      background: '#2E3440', foreground: '#ECEFF4', card: '#3B4252', cardForeground: '#ECEFF4',
      popover: '#3B4252', popoverForeground: '#ECEFF4', primary: '#88C0D0', primaryForeground: '#2E3440',
      secondary: '#434C5E', secondaryForeground: '#ECEFF4', muted: '#434C5E', mutedForeground: '#B8C0D0',
      accent: '#434C5E', accentForeground: '#ECEFF4', border: '#4C566A', input: '#4C566A', ring: '#88C0D0',
    },
  },
  dracula: {
    label: { ru: 'Дракула', en: 'Dracula' },
    baseTheme: 'dark',
    colors: {
      background: '#282A36', foreground: '#F8F8F2', card: '#343746', cardForeground: '#F8F8F2',
      popover: '#343746', popoverForeground: '#F8F8F2', primary: '#BD93F9', primaryForeground: '#1E1F29',
      secondary: '#44475A', secondaryForeground: '#F8F8F2', muted: '#44475A', mutedForeground: '#B6B9D0',
      accent: '#44475A', accentForeground: '#F8F8F2', border: '#44475A', input: '#44475A', ring: '#BD93F9',
    },
  },
  paper: {
    label: { ru: 'Бумага', en: 'Paper' },
    baseTheme: 'light',
    colors: {
      background: '#FBF8F3', foreground: '#1F1B16', card: '#F3EEE6', cardForeground: '#1F1B16',
      popover: '#FBF8F3', popoverForeground: '#1F1B16', primary: '#B45309', primaryForeground: '#FFFFFF',
      secondary: '#EFE8DC', secondaryForeground: '#2B241B', muted: '#EFE8DC', mutedForeground: '#6F6455',
      accent: '#EFE8DC', accentForeground: '#2B241B', border: '#E5DDD0', input: '#E5DDD0', ring: '#B45309',
    },
  },
  sky: {
    label: { ru: 'Небо', en: 'Sky' },
    baseTheme: 'light',
    colors: {
      background: '#F5FAFF', foreground: '#0B1B2B', card: '#EAF3FC', cardForeground: '#0B1B2B',
      popover: '#F5FAFF', popoverForeground: '#0B1B2B', primary: '#0284C7', primaryForeground: '#FFFFFF',
      secondary: '#E1EDF8', secondaryForeground: '#10263A', muted: '#E1EDF8', mutedForeground: '#51697F',
      accent: '#E1EDF8', accentForeground: '#10263A', border: '#D3E4F3', input: '#D3E4F3', ring: '#0284C7',
    },
  },
};

export function buildNamedPreset(presetId) {
  const preset = NAMED_THEME_PRESETS[presetId];
  if (!preset) return null;
  return sanitizeCustomTheme({ baseTheme: preset.baseTheme, colors: preset.colors });
}

export function readStoredPresetId() {
  try {
    const id = localStorage.getItem(PRESET_STORAGE_KEY);
    return id && NAMED_THEME_PRESETS[id] ? id : null;
  } catch {
    return null;
  }
}

export function writeStoredPresetId(id) {
  try {
    if (id) localStorage.setItem(PRESET_STORAGE_KEY, id);
    else localStorage.removeItem(PRESET_STORAGE_KEY);
  } catch { /* storage may be unavailable */ }
}
