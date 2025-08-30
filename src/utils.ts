import { Resources, ResourceType } from "./types";

/**
 * Formats a number into a more readable string with abbreviations (K, M, B, etc.).
 * @param num The number to format.
 * @returns A formatted string.
 */
export const formatNumber = (num: number): string => {
    if (num === null || num === undefined) return '0';
    if (num === 0) return '0';

    if (Math.abs(num) < 1000) {
        if (Number.isInteger(num)) {
            return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
        }
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
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

const RESOURCE_ORDER: ResourceType[] = [
    'ore',
    'energy',
    'parts',
    'research_points',
    'dyson_fragments',
    'condensed_fragments',
    'stellar_essence',
];

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

    const sortedCostEntries = Object.entries(cost)
        .filter(([, amount]) => (amount ?? 0) > 0)
        .sort(([resA], [resB]) => {
            const indexA = RESOURCE_ORDER.indexOf(resA as ResourceType);
            const indexB = RESOURCE_ORDER.indexOf(resB as ResourceType);
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });

    return sortedCostEntries
        .map(([res, amount]) => `${formatNumber(amount!)} ${RESOURCE_ICONS[res as ResourceType] || res}`)
        .join(' ');
};