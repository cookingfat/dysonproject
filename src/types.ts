/**
 * Defines the types of resources available in the game.
 */
export type ResourceType = 'energy' | 'ore' | 'parts' | 'dyson_fragments' | 'research_points';

/**
 * A record mapping each resource type to its amount.
 */
export type Resources = Record<ResourceType, number>;

/**
 * Defines the type and value of a synergy bonus.
 * - `flat`: Adds a flat value to a stat. `per` defines how many source units are needed for one bonus increment.
 * - `percentage_of_source_output`: Adds a global bonus based on a percentage of a source building's resource output.
 */
export interface SynergyBonus {
    type: 'flat' | 'percentage_of_source_output';
    value: number;
    per?: number;
    sourceResource?: ResourceType;
}

/**
 * Defines a synergistic relationship between two upgrades.
 */
export interface Synergy {
    sourceId: string; // The ID of the upgrade providing the bonus
    targetStat: 'production' | 'consumption';
    targetResource: ResourceType;
    bonus: SynergyBonus;
}


/**
 * Represents a single upgrade or machine that the player can purchase.
 */
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  /** The current cost of the next purchase for each resource. */
  cost: Resources;
  /** The base cost of the upgrade. */
  baseCost: Resources;
  /** The multiplier applied to the cost after each purchase. */
  costMultiplier: number;
  /** The amount of each resource this upgrade generates per second. */
  production: Partial<Resources>;
  /** The amount of each resource this upgrade consumes per second. */
  consumption: Partial<Resources>;
  /** The number of this upgrade the player owns. */
  owned: number;
  /** Conditions that must be met for this upgrade to become available. */
  unlocksAt?: {
    /** Requires owning a certain number of other specified upgrades. */
    owned?: { [upgradeId: string]: number };
    /** Requires having a certain amount of specified resources. */
    resources?: Partial<Resources>;
  }
  /** Tags for grouping upgrades for bonuses from research. */
  tags?: string[];
  /** Defines synergistic bonuses this upgrade receives or provides. */
  synergies?: Synergy[];
  /** The current tier/level of the upgrade. */
  level: number;
  /** Special behaviors for certain upgrades. */
  specialEffect?: 'self_replicating';
}

/**
 * Represents the current view of the application.
 */
export type Scene = 'menu' | 'game';

export type BonusType = 'production_multiplier' | 'click_multiplier' | 'synergy_multiplier' | 'auto_click' | 'consumption_multiplier';

/**
 * Represents a single researchable technology.
 */
export interface Research {
  id: string;
  name:string;
  description: string;
  cost: {
    amount: number;
    resource: ResourceType;
  };
  /** The target of the bonus. Can be an upgrade ID, a tag, 'click', 'all', or 'synergy'. */
  target: string;
  /** The type of bonus. */
  type: BonusType;
  /** The multiplier value. e.g., 1.1 for +10%. */
  value: number;
  /** IDs of other research required to unlock this one. */
  prerequisites?: string[];
  /** Tags for categorization, e.g., 'exotic'. */
  tags?: string[];
}


/**
 * Game statistics, used for achievements.
 */
export type Stats = { [key: string]: number };

/**
 * A snapshot of the entire game state, used for checking achievements.
 */
export interface GameState {
    resources: Resources;
    upgrades: Upgrade[];
    stats: Stats;
    completedResearch: Set<string>;
    prestigePoints: number;
}


/**
 * Represents a single unlockable achievement.
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  /**
   * Function to check if the achievement is unlocked.
   * @param gameState - A snapshot of the current game state.
   * @returns `true` if conditions are met.
   */
  isUnlocked: (gameState: GameState) => boolean;
}

/**
 * Represents an active, temporary boost from an event or ability.
 */
export interface ActiveBoost {
  id: string; // Unique instance id, e.g., 'meteor_shower_167...'
  sourceId: string; // e.g., 'meteor_shower' or 'overcharge_power'
  name: string;
  description: string;
  target: string; // upgrade id or tag
  type: 'production_multiplier' | 'consumption_multiplier' | 'click_multiplier';
  value: number;
  expiresAt: number; // timestamp
}

export interface PlayerAbility {
    id: string;
    name: string;
    description: string;
    cost: Partial<Resources>;
    cooldown: number; // in seconds
}

export interface TimedBoostAbility extends PlayerAbility {
    type: 'timed_boost';
    duration: number; // in seconds
    boost: {
        target: string; // upgrade id or tag
        type: 'production_multiplier' | 'consumption_multiplier';
        value: number;
    };
}

export interface InstantGainAbility extends PlayerAbility {
    type: 'instant_gain';
    gain?: Partial<Resources>;
    gainSeconds?: Partial<Record<ResourceType, number>>;
}

export type AnyAbility = TimedBoostAbility | InstantGainAbility;


export interface RandomEvent {
    id: string;
    name: string;
    description: string;
    duration: number;
    boost: {
        target: string;
        type: 'production_multiplier';
        value: number;
    }
}

export interface ClickableEventConfig {
    id: string;
    name: string;
    description: string;
    duration: number; // boost duration in seconds
    lifespan: number; // how long it's on screen
    boost: {
        type: 'click_multiplier';
        value: number;
    }
}
