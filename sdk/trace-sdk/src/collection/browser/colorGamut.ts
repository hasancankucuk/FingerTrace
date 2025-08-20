export const getColorGamut = (): ColorGamut | undefined => {
    // Skip in test/non-browser environment
    if (typeof window === 'undefined' || !window.matchMedia) {
        return undefined;
    }

    for (const gamut of ['rec2020', 'p3', 'srgb'] as const) {
        if (window.matchMedia(`(color-gamut: ${gamut})`).matches) {
            return gamut;
        }
    }
    return undefined;
}