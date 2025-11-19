/**
 * Calculates the WCAG contrast ratio between two HEX colors.
 *
 * @param {string} color1 - First HEX color (e.g. "#ffffff").
 * @param {string} color2 - Second HEX color (e.g. "#000000").
 * @returns {number} The contrast ratio between the two colors.
 */
function getContrastRatio(color1, color2) {
    /**
     * 
     * @param {string} hex 
     */
    const luminance = (hex) => {
        const normalized = hex.replace('#', '');

        const r = parseInt(normalized.substring(0, 2), 16) / 255;
        const g = parseInt(normalized.substring(2, 4), 16) / 255;
        const b = parseInt(normalized.substring(4, 6), 16) / 255;

        /**
         * 
         * @param {number} channel 
         * @returns 
         */
        const transform = (channel) =>
            channel <= 0.03928
                ? channel / 12.92
                : Math.pow((channel + 0.055) / 1.055, 2.4);

        const R = transform(r);
        const G = transform(g);
        const B = transform(b);

        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };

    const L1 = luminance(color1);
    const L2 = luminance(color2);

    const brightest = Math.max(L1, L2);
    const darkest = Math.min(L1, L2);

    return (brightest + 0.05) / (darkest + 0.05);
}

/**
 *  Returns the contrast color (Black/White) based on the given HEX color.
 * @param {string} hexColor 
 * @returns 
 */
function getContrastColor(hexColor) {
    const contrastRatio = getContrastRatio(hexColor, '#ffffff');
    return contrastRatio < 3.1 ? '#000000' : '#ffffff';
}

const SleekUtils = {
    getContrastRatio,
    getContrastColor,

}

const Sleek = window.Sleek || {}
Sleek.utils = SleekUtils
window.Sleek = Sleek