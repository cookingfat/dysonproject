import { AnyAbility, RandomEvent, ClickableEventConfig } from './types';

export const ABILITIES_CONFIG: AnyAbility[] = [
    {
        id: 'overcharge_power',
        name: 'Overcharge',
        description: 'Spend 50 energy to double the output of all power generators for 30 seconds.',
        cost: { energy: 50 },
        cooldown: 300, // 5 minutes
        type: 'timed_boost',
        duration: 30,
        boost: {
            target: 'power',
            type: 'production_multiplier',
            value: 2,
        }
    },
    {
        id: 'ore_rush',
        name: 'Ore Rush',
        description: 'Instantly gain 30 seconds worth of your current ore production.',
        cost: { energy: 100 },
        cooldown: 180, // 3 minutes
        type: 'instant_gain',
        gainSeconds: { ore: 30 }
    },
    {
        id: 'efficiency_drive',
        name: 'Efficiency Drive',
        description: 'Reduces the resource consumption of all machines by 75% for 20 seconds.',
        cost: { parts: 50 },
        cooldown: 420, // 7 minutes
        type: 'timed_boost',
        duration: 20,
        boost: {
            target: 'all',
            type: 'consumption_multiplier',
            value: 0.25
        }
    },
    {
        id: 'rapid_research',
        name: 'Rapid Research',
        description: 'Instantly gain 60 seconds worth of your current research point production.',
        cost: { energy: 500 },
        cooldown: 600, // 10 minutes
        type: 'instant_gain',
        gainSeconds: { research_points: 60 }
    }
];

export const RANDOM_EVENTS_CONFIG: RandomEvent[] = [
    {
        id: 'meteor_shower',
        name: 'Meteor Shower',
        description: 'A meteor shower increases the output of all mining machines by 3x for 60 seconds!',
        duration: 60,
        boost: {
            target: 'miner',
            type: 'production_multiplier',
            value: 3
        }
    },
    {
        id: 'solar_flare',
        name: 'Solar Flare',
        description: 'Intense solar activity doubles the output of all power generators for 45 seconds!',
        duration: 45,
        boost: {
            target: 'power',
            type: 'production_multiplier',
            value: 2
        }
    }
];

export const CLICKABLE_EVENTS_CONFIG: ClickableEventConfig[] = [
    {
        id: 'rich_vein',
        name: 'Rich Vein',
        description: 'A rich vein of ore! Clicks are 10x more powerful for 20 seconds.',
        duration: 20, // boost duration
        lifespan: 10, // time on screen
        boost: {
            type: 'click_multiplier',
            value: 10
        }
    }
];