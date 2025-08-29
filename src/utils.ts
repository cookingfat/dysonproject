import { Resources, ResourceType } from "./types";

/**
 * Formats a number into a more readable string with abbreviations (K, M, B, etc.).
 * @param num The number to format.
 * @returns A formatted string.
 */
export const formatNumber = (num: number): string => {
    if (num === null || num === undefined) return '0.00';
    if (num === 0) return '0.00';
    if (Math.abs(num) < 1000) return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    const abbreviations = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    if (tier >= abbreviations.length) {
        return num.toExponential(2);
    }

    const suffix = abbreviations[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;

    // Use toLocaleString for numbers less than 1K to get commas, but format others manually.
    if (scaled >= 1000) {
        return num.toLocaleString(undefined, { maximumFractionDigits: 0});
    }

    return scaled.toFixed(2) + suffix;
};

export const formatResourceCost = (cost: Partial<Resources>): string => {
    const RESOURCE_ICONS: Record<string, string> = {
        ore: '⛏️',
        energy: '⚡',
        parts: '⚙️',
        dyson_fragments: '🌌',
        research_points: '🔬',
        condensed_fragments: '💠',
        stellar_essence: '🌟',
        prestige_points: '✨'
    };

    return Object.entries(cost)
        .filter(([, amount]) => (amount ?? 0) > 0)
        .map(([res, amount]) => `${formatNumber(amount!)} ${RESOURCE_ICONS[res as ResourceType] || res}`)
        .join(' ');
};