import { Achievement, GameState } from './types';
import { RESEARCH_CONFIG, UPGRADES_CONFIG } from './constants';

const getOwned = (gs: GameState, id: string) => gs.upgrades.find(u => u.id === id)?.owned || 0;

const allBuildingIds = UPGRADES_CONFIG.map(u => u.id);
const allStandardResearchIds = RESEARCH_CONFIG.filter(r => !r.tags?.includes('exotic')).map(r => r.id);

export const ACHIEVEMENTS_CONFIG: Achievement[] = [
  // --- CLICKING ---
  {
    id: 'first_click',
    name: 'The First Spark',
    description: 'Manually mine your first ore.',
    isUnlocked: (gs) => (gs.stats.total_clicks || 0) >= 1,
  },
  {
    id: 'clicks_100',
    name: 'Getting the Hang of It',
    description: 'Click the mine ore button 100 times.',
    isUnlocked: (gs) => (gs.stats.total_clicks || 0) >= 100,
  },
  {
    id: 'clicks_1k',
    name: 'Repetitive Strain Injury',
    description: 'Click 1,000 times.',
    isUnlocked: (gs) => (gs.stats.total_clicks || 0) >= 1_000,
  },
  {
    id: 'clicks_10k',
    name: 'Carpal Tunnel Syndrome',
    description: 'Click 10,000 times.',
    isUnlocked: (gs) => (gs.stats.total_clicks || 0) >= 10_000,
  },
  {
    id: 'clicks_100k',
    name: 'Master Clicker',
    description: 'Click 100,000 times.',
    isUnlocked: (gs) => (gs.stats.total_clicks || 0) >= 100_000,
  },

  // --- PRODUCTION & RESOURCES ---
  {
    id: 'total_ore_1k',
    name: 'Ore Hoarder',
    description: 'Amass a total of 1,000 ore through any means.',
    isUnlocked: (gs) => (gs.stats.total_ore || 0) >= 1_000,
  },
  {
    id: 'total_ore_1m',
    name: 'Mountain of Ore',
    description: 'Amass a total of 1,000,000 ore.',
    isUnlocked: (gs) => (gs.stats.total_ore || 0) >= 1_000_000,
  },
  {
    id: 'total_ore_1b',
    name: 'Planetary Core',
    description: 'Amass a total of 1,000,000,000 ore.',
    isUnlocked: (gs) => (gs.stats.total_ore || 0) >= 1_000_000_000,
  },
  {
    id: 'total_parts_1k',
    name: 'Tinkerer',
    description: 'Amass a total of 1,000 parts.',
    isUnlocked: (gs) => (gs.stats.total_parts || 0) >= 1_000,
  },
  {
    id: 'total_parts_1m',
    name: 'Master Fabricator',
    description: 'Amass a total of 1,000,000 parts.',
    isUnlocked: (gs) => (gs.stats.total_parts || 0) >= 1_000_000,
  },
  {
    id: 'total_energy_1m',
    name: 'High Voltage',
    description: 'Produce a total of 1,000,000 energy.',
    isUnlocked: (gs) => (gs.stats.total_energy || 0) >= 1_000_000,
  },
  {
    id: 'first_fragment',
    name: 'A Piece of the Sun',
    description: 'Produce your first Dyson Sphere Fragment.',
    isUnlocked: (gs) => (gs.stats.total_dyson_fragments || 0) >= 1,
  },

  // --- BUILDING & OWNERSHIP ---
  {
    id: 'buy_autominer',
    name: 'Hands Free',
    description: 'Purchase your first Auto-Miner.',
    isUnlocked: (gs) => getOwned(gs, 'auto_miner') >= 1,
  },
  {
    id: 'own_10_autominer',
    name: 'Miner Militia',
    description: 'Own 10 Auto-Miners.',
    isUnlocked: (gs) => getOwned(gs, 'auto_miner') >= 10,
  },
  {
    id: 'own_100_solar',
    name: 'Solar Farm',
    description: 'Own 100 Solar Panels.',
    isUnlocked: (gs) => getOwned(gs, 'solar_panel') >= 100,
  },
  {
    id: 'unlock_solar',
    name: 'Let There Be Light',
    description: 'Unlock Solar Panels.',
    isUnlocked: (gs) => gs.upgrades.some(u => u.id === 'solar_panel' && u.owned > 0),
  },
  {
    id: 'unlock_smelter',
    name: 'Industrial Revolution',
    description: 'Build your first Smelter.',
    isUnlocked: (gs) => getOwned(gs, 'smelter') >= 1,
  },
  {
    id: 'unlock_fabricator',
    name: 'Cosmic Engineer',
    description: 'Build your first Part Fabricator.',
    isUnlocked: (gs) => getOwned(gs, 'fabricator') >= 1,
  },
  {
    id: 'own_10_fusion_reactors',
    name: 'Star Power',
    description: 'Own 10 Fusion Reactors.',
    isUnlocked: (gs) => getOwned(gs, 'fusion_reactor') >= 10,
  },
  {
    id: 'own_one_of_each',
    name: 'Diversified Portfolio',
    description: 'Own at least one of every type of building.',
    isUnlocked: (gs) => allBuildingIds.every(id => getOwned(gs, id) >= 1),
  },
  {
    id: 'upgrade_mk5',
    name: 'Mark V',
    description: 'Level up any building to Mk. V.',
    isUnlocked: (gs) => gs.upgrades.some(u => u.level >= 5),
  },
  {
    id: 'upgrade_mk10',
    name: 'Perfect Ten',
    description: 'Level up any building to Mk. X.',
    isUnlocked: (gs) => gs.upgrades.some(u => u.level >= 10),
  },

  // --- RESEARCH ---
  {
    id: 'research_something',
    name: 'Brain Power',
    description: 'Complete your first research.',
    isUnlocked: (gs) => gs.completedResearch.size > 0,
  },
  {
    id: 'full_gear_research',
    name: 'Well Oiled Machine',
    description: 'Complete all "Gears" research.',
    isUnlocked: (gs) => ['gears_1', 'gears_2', 'gears_3', 'gears_4', 'gears_5'].every(id => gs.completedResearch.has(id)),
  },
   {
    id: 'exotic_research',
    name: 'Forbidden Knowledge',
    description: 'Complete your first piece of Exotic Research.',
    isUnlocked: (gs) => {
        const exoticResearchIds = RESEARCH_CONFIG.filter(r => r.tags?.includes('exotic')).map(r => r.id);
        return exoticResearchIds.some(id => gs.completedResearch.has(id));
    }
  },
  {
    id: 'all_standard_research',
    name: 'Master Scholar',
    description: 'Complete all standard research.',
    isUnlocked: (gs) => allStandardResearchIds.every(id => gs.completedResearch.has(id)),
  },

  // --- PRESTIGE ---
  {
    id: 'first_prestige',
    name: 'A New Beginning',
    description: 'Prestige for the first time.',
    isUnlocked: (gs) => (gs.stats.total_prestiges || 0) >= 1,
  },
  {
    id: 'prestige_10_times',
    name: 'Time Loop',
    description: 'Prestige 10 times.',
    isUnlocked: (gs) => (gs.stats.total_prestiges || 0) >= 10,
  },
  {
    id: 'prestige_100_points',
    name: 'Percentile',
    description: 'Reach 100 Prestige Points.',
    isUnlocked: (gs) => gs.prestigePoints >= 100,
  },
  {
    id: 'prestige_1k_points',
    name: 'Prestige Worldwide',
    description: 'Accumulate 1,000 Prestige Points.',
    isUnlocked: (gs) => gs.prestigePoints >= 1000,
  },
];
