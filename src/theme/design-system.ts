/**
 * Shadcn/UI Design System for React Native
 * Based on shadcn/ui spacing and design principles
 */

// Spacing Scale (following shadcn/ui convention)
export const spacing = {
    0: 0,
    0.5: 2,    // 0.125rem
    1: 4,      // 0.25rem
    1.5: 6,    // 0.375rem
    2: 8,      // 0.5rem
    2.5: 10,   // 0.625rem
    3: 12,     // 0.75rem
    3.5: 14,   // 0.875rem
    4: 16,     // 1rem
    5: 20,     // 1.25rem
    6: 24,     // 1.5rem
    7: 28,     // 1.75rem
    8: 32,     // 2rem
    9: 36,     // 2.25rem
    10: 40,    // 2.5rem
    11: 44,    // 2.75rem
    12: 48,    // 3rem
    14: 56,    // 3.5rem
    16: 64,    // 4rem
    20: 80,    // 5rem
    24: 96,    // 6rem
};

// Border Radius (shadcn/ui style)
export const radius = {
    none: 0,
    sm: 6,     // 0.375rem
    md: 8,     // 0.5rem
    lg: 12,    // 0.75rem
    xl: 16,    // 1rem
    '2xl': 20, // 1.25rem
    '3xl': 24, // 1.5rem
    full: 9999,
};

// Typography Scale
export const fontSize = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
};

// Line Heights
export const lineHeight = {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
};

// Colors (matching your theme)
export const colors = {
    primary: '#E07A5F',
    primaryLight: '#fff1ed',
    secondary: '#f97316',
    tertiary: '#3b82f6',

    slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
    },

    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',

    white: '#ffffff',
    black: '#000000',
};

// Component Variants (shadcn/ui style)
export const buttonVariants = {
    default: {
        bg: colors.primary,
        text: colors.white,
        padding: { vertical: spacing[2.5], horizontal: spacing[4] },
        radius: radius.lg,
    },
    outline: {
        bg: 'transparent',
        text: colors.slate[700],
        borderColor: colors.slate[200],
        borderWidth: 1,
        padding: { vertical: spacing[2.5], horizontal: spacing[4] },
        radius: radius.lg,
    },
    ghost: {
        bg: 'transparent',
        text: colors.slate[700],
        padding: { vertical: spacing[2.5], horizontal: spacing[4] },
        radius: radius.lg,
    },
};

// Card Variants
export const cardVariants = {
    default: {
        bg: colors.white,
        padding: spacing[6],
        radius: radius['3xl'],
        borderColor: colors.slate[50],
        borderWidth: 1,
        shadow: 'sm',
    },
    compact: {
        bg: colors.white,
        padding: spacing[4],
        radius: radius['2xl'],
        borderColor: colors.slate[50],
        borderWidth: 1,
        shadow: 'sm',
    },
};

// Consistent spacing for icon-text combinations
export const iconTextSpacing = spacing[2]; // 8px between icon and text

// Consistent spacing for sections
export const sectionSpacing = {
    vertical: spacing[6],    // 24px between major sections
    horizontal: spacing[6],  // 24px horizontal padding
};
