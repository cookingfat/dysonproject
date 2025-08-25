import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Scene, Upgrade, Resources, ResourceType, Stats, ActiveBoost } from './types';
import { UPGRADES_CONFIG, INITIAL_RESOURCES, RESEARCH_CONFIG } from './constants';
import { ACHIEVEMENTS_CONFIG } from './achievements';
import { ABILITIES_CONFIG, RANDOM_EVENTS_CONFIG, CLICKABLE_EVENTS_CONFIG } from './events';
import MainMenu from './components/MainMenu';
import GameUI from './components/GameUI';
import OfflineProgressModal from './components/OfflineProgressModal';
import ClickableEvent, { ClickableEventInstance } from './components/ClickableEvent';
import OptionsMenu from './components/OptionsMenu';
import { soundManager, SfxType } from './soundManager';


const SAVE_KEY = 'projectDysonSaveData_v1';

interface Notification {
  id: number;
  message: string;
}

const Notifications: React.FC<{ notifications: Notification[] }> = ({ notifications }) => (
  <div className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2" aria-live="polite">
    {notifications.map(notif => (
      <div key={notif.id} className="bg-cyan-500 text-gray-900 font-bold py-2 px-4 rounded-lg shadow-lg animate-notification">
        {notif.message}
      </div>
    ))}
  </div>
);

const App: React.FC = () => {
  const [scene, setScene] = useState<Scene>('menu');
  const [resources, setResources] = useState<Resources>(INITIAL_RESOURCES);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(UPGRADES_CONFIG);
  const [unlockedUpgrades, setUnlockedUpgrades] = useState<Set<string>>(new Set(['auto_miner']));
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [completedResearch, setCompletedResearch] = useState<Set<string>>(new Set());
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [bonuses, setBonuses] = useState({ click: 1, production: new Map<string, number>(), consumption: new Map<string, number>(), synergy: 1, autoClick: 0, prestige: 1 });
  const [prestigePoints, setPrestigePoints] = useState(0);
  const [stats, setStats] = useState<Stats>({ total_clicks: 0, total_prestiges: 0, sra_progress: 0 });
  const [rps, setRps] = useState<Partial<Resources>>({});
  const [offlineGains, setOfflineGains] = useState<Partial<Resources> | null>(null);
  const [activeBoosts, setActiveBoosts] = useState<ActiveBoost[]>([]);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [activeClickable, setActiveClickable] = useState<ClickableEventInstance | null>(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [volume, setVolume] = useState({ master: 0.8, music: 0.5, sfx: 0.7 });
  const isLoaded = useRef(false);
  const gameTickCallback = useRef<() => void>(() => {});

  const addNotification = useCallback((message: string) => {
    const newNotification = { id: Date.now(), message };
    setNotifications(prev => {
        const newNotifs = [...prev, newNotification];
        if (newNotifs.length > 3) {
            return newNotifs.slice(newNotifs.length - 3);
        }
        return newNotifs;
    });
    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3900);
  }, []);

  // Load game from localStorage
  useEffect(() => {
    if (isLoaded.current) return;
    
    const savedDataRaw = localStorage.getItem(SAVE_KEY);
    if (savedDataRaw) {
      try {
        const savedData = JSON.parse(savedDataRaw);
        
        // Offline Progress Calculation
        const lastSaveTime = savedData.lastSaveTime || Date.now();
        const offlineSeconds = Math.min(Math.floor((Date.now() - lastSaveTime) / 1000), 8 * 60 * 60); // Max 8 hours
        const savedRps = savedData.rps || {};
        let totalGains: Partial<Resources> = {};
        if (offlineSeconds > 10) { // Only calculate if offline for more than 10s
            for (const key in savedRps) {
                const rpsVal = savedRps[key as ResourceType] || 0;
                if (rpsVal > 0) { // Only gain resources, don't lose them
                    totalGains[key as ResourceType] = (totalGains[key as ResourceType] || 0) + rpsVal * offlineSeconds;
                }
            }
            const startingResources = savedData.resources || INITIAL_RESOURCES;
            const newResources = {...startingResources};
            for(const key in totalGains) {
                newResources[key as ResourceType] = (newResources[key as ResourceType] || 0) + totalGains[key as ResourceType]!;
            }
            setResources(newResources);
            if(Object.keys(totalGains).length > 0) {
               setOfflineGains(totalGains);
            }
        } else {
            if (savedData.resources) setResources(savedData.resources);
        }

        if (savedData.unlockedUpgrades) setUnlockedUpgrades(new Set(savedData.unlockedUpgrades));
        if (savedData.completedResearch) setCompletedResearch(new Set(savedData.completedResearch));
        if (savedData.unlockedAchievements) setUnlockedAchievements(new Set(savedData.unlockedAchievements));
        if (savedData.prestigePoints) setPrestigePoints(savedData.prestigePoints);
        if (savedData.stats) setStats(savedData.stats);
        if (savedData.cooldowns) setCooldowns(savedData.cooldowns);
        if (savedData.volume) {
            if(typeof savedData.volume.master === 'number' && typeof savedData.volume.music === 'number' && typeof savedData.volume.sfx === 'number') {
                setVolume(savedData.volume);
            }
        }

        if (savedData.upgrades) {
          const loadedUpgrades = UPGRADES_CONFIG.map(configUpgrade => {
            const savedUpgrade = savedData.upgrades.find((u: { id: string }) => u.id === configUpgrade.id);
            if (savedUpgrade) {
              let currentCost = { ...configUpgrade.baseCost };
              if (savedUpgrade.owned > 0) {
                  for (const key in currentCost) {
                    const resource = key as ResourceType;
                    if (configUpgrade.baseCost[resource] > 0) {
                       currentCost[resource] = Math.ceil(configUpgrade.baseCost[resource] * Math.pow(configUpgrade.costMultiplier, savedUpgrade.owned));
                    }
                  }
              }
              return { ...configUpgrade, owned: savedUpgrade.owned, cost: currentCost, level: savedUpgrade.level || 1 };
            }
            return configUpgrade;
          });
          setUpgrades(loadedUpgrades);
        }
      } catch (e) {
        console.error("Failed to load saved game:", e);
        localStorage.removeItem(SAVE_KEY);
      }
    }
    isLoaded.current = true;
  }, []);

  // Save game to localStorage periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const dataToSave = {
        resources,
        upgrades: upgrades.map(u => ({ id: u.id, owned: u.owned, level: u.level })),
        unlockedUpgrades: Array.from(unlockedUpgrades),
        completedResearch: Array.from(completedResearch),
        unlockedAchievements: Array.from(unlockedAchievements),
        prestigePoints,
        stats,
        rps,
        cooldowns,
        volume,
        lastSaveTime: Date.now(),
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [resources, upgrades, unlockedUpgrades, completedResearch, unlockedAchievements, prestigePoints, stats, rps, cooldowns, volume]);
  
  // Effect to handle starting music
  useEffect(() => {
    if (scene === 'game') {
      soundManager.playMusic();
    }
  }, [scene]);

  // Effect to handle volume changes
  useEffect(() => {
    soundManager.setMasterVolume(volume.master);
    soundManager.setMusicVolume(volume.music);
    soundManager.setSfxVolume(volume.sfx);
  }, [volume]);

  // Effect to calculate research & active bonuses
  useEffect(() => {
    const newBonuses = {
        click: 1,
        production: new Map<string, number>(),
        consumption: new Map<string, number>(),
        synergy: 1,
        autoClick: 0,
        prestige: 1,
    };

    let prestigeBonusPerPoint = 0.1;

    completedResearch.forEach(researchId => {
        const research = RESEARCH_CONFIG.find(r => r.id === researchId);
        if (!research) return;

        if (research.type === 'click_multiplier') newBonuses.click *= research.value;
        else if (research.type === 'production_multiplier') {
            if(research.target === 'prestige') {
                prestigeBonusPerPoint += research.value;
            } else {
                const currentMultiplier = newBonuses.production.get(research.target) || 1;
                newBonuses.production.set(research.target, currentMultiplier * research.value);
            }
        }
        else if (research.type === 'consumption_multiplier') {
            const currentMultiplier = newBonuses.consumption.get(research.target) || 1;
            newBonuses.consumption.set(research.target, currentMultiplier * research.value);
        }
        else if (research.type === 'synergy_multiplier') newBonuses.synergy *= research.value;
        else if (research.type === 'auto_click') newBonuses.autoClick += research.value;
    });
    
    activeBoosts.forEach(boost => {
        if (boost.type === 'click_multiplier') {
            newBonuses.click *= boost.value;
        }
    });

    newBonuses.prestige = prestigeBonusPerPoint;
    setBonuses(newBonuses);
  }, [completedResearch, activeBoosts]);

  // Define the game tick logic.
  useEffect(() => {
    gameTickCallback.current = () => {
        // Clear expired boosts
        setActiveBoosts(prev => prev.filter(b => Date.now() < b.expiresAt));

        const netChangePerTick: Partial<Resources> = {};
        for(const res in INITIAL_RESOURCES) netChangePerTick[res as ResourceType] = 0;

        // Auto-clicker bonus
        if (bonuses.autoClick > 0) {
            netChangePerTick.ore = (netChangePerTick.ore || 0) + (bonuses.autoClick * bonuses.click) / 10;
        }

        const productionFromUpgrade = new Map<string, Partial<Resources>>();
        const prestigeBonus = bonuses.prestige / 100;
        const globalProductionMultiplier = 1 + (prestigePoints * prestigeBonus);

        // Pass 1: Base production with bonuses
        upgrades.forEach(u => {
            if (u.owned <= 0) return;
            const finalUnitProduction = { ...(u.production) };
            let researchMultiplier = bonuses.production.get('all') || 1;
            researchMultiplier *= bonuses.production.get(u.id) || 1;
            if (u.tags) u.tags.forEach(tag => { researchMultiplier *= (bonuses.production.get(tag) || 1); });

            let boostMultiplier = 1;
            activeBoosts.forEach(boost => {
                if (boost.type !== 'production_multiplier') return;
                const isTagTarget = u.tags?.includes(boost.target);
                const isIdTarget = u.id === boost.target;
                if(isTagTarget || isIdTarget) {
                    boostMultiplier *= boost.value;
                }
            });
            
            const levelBonus = 1 + (u.level - 1) * 0.1; // +10% per level

            const totalProduction: Partial<Resources> = {};
            Object.entries(finalUnitProduction).forEach(([res, amount]) => {
                totalProduction[res as ResourceType] = amount * u.owned * researchMultiplier * globalProductionMultiplier * boostMultiplier * levelBonus;
            });
            productionFromUpgrade.set(u.id, totalProduction);
        });

        // Pass 2: Synergies
        upgrades.forEach(u => {
            if (u.owned <= 0 || !u.synergies) return;
            const upgradeTotalProduction = productionFromUpgrade.get(u.id) || {};

            u.synergies.forEach(syn => {
                if (syn.targetStat !== 'production') return;

                if (syn.bonus.type === 'flat' && syn.bonus.per) {
                    const sourceUpgrade = upgrades.find(up => up.id === syn.sourceId);
                    if (sourceUpgrade && sourceUpgrade.owned > 0) {
                        const bonusAmount = Math.floor(sourceUpgrade.owned / syn.bonus.per) * syn.bonus.value * bonuses.synergy * u.owned;
                        upgradeTotalProduction[syn.targetResource] = (upgradeTotalProduction[syn.targetResource] || 0) + bonusAmount;
                    }
                } else if (syn.bonus.type === 'percentage_of_source_output' && syn.bonus.sourceResource) {
                    const sourceProductionMap = productionFromUpgrade.get(syn.sourceId);
                    if (sourceProductionMap) {
                        const sourceResourceOutput = sourceProductionMap[syn.bonus.sourceResource] || 0;
                        const bonusAmount = sourceResourceOutput * syn.bonus.value * bonuses.synergy;
                         netChangePerTick[syn.targetResource] = (netChangePerTick[syn.targetResource] || 0) + bonusAmount / 10;
                    }
                }
            });
            productionFromUpgrade.set(u.id, upgradeTotalProduction);
        });

        // Pass 3: Consumption & Final Net Change
        const totalProductionThisTick: Partial<Stats> = {};
        const activeUpgradesThisTick = new Set<string>();

        upgrades.forEach(u => {
            if (u.owned > 0) {
                let consumptionMultiplier = bonuses.consumption.get('all') || 1;
                consumptionMultiplier *= bonuses.consumption.get(u.id) || 1;
                if (u.tags) u.tags.forEach(tag => { consumptionMultiplier *= (bonuses.consumption.get(tag) || 1); });
                
                activeBoosts.forEach(boost => {
                    if (boost.type !== 'consumption_multiplier') return;
                    const isTagTarget = u.tags?.includes(boost.target);
                    if(boost.target === 'all' || isTagTarget || u.id === boost.target) {
                        consumptionMultiplier *= boost.value;
                    }
                });

                const canAfford = Object.entries(u.consumption).every(([res, amount]) => resources[res as ResourceType] >= (amount * u.owned * consumptionMultiplier) / 10);
                if (canAfford) {
                    activeUpgradesThisTick.add(u.id);
                    const upgradeProduction = productionFromUpgrade.get(u.id) || {};
                    Object.entries(upgradeProduction).forEach(([res, amount]) => {
                        netChangePerTick[res as ResourceType] = (netChangePerTick[res as ResourceType] ?? 0) + amount / 10;
                        const statKey = `total_${res}`;
                        totalProductionThisTick[statKey] = (totalProductionThisTick[statKey] || 0) + amount / 10;
                    });
                    Object.entries(u.consumption).forEach(([res, amount]) => {
                        netChangePerTick[res as ResourceType] = (netChangePerTick[res as ResourceType] ?? 0) - (amount * u.owned * consumptionMultiplier) / 10;
                    });
                }
            }
        });

        // Pass 4: Special Effects
        const selfReplicator = upgrades.find(u => u.id === 'self_replicating_assembler');
        let newSraProgress: number | undefined;

        if (selfReplicator && selfReplicator.owned > 0 && activeUpgradesThisTick.has('self_replicating_assembler')) {
            const partsConsumed = (selfReplicator.consumption.parts || 0) * selfReplicator.owned;
            const progressPerTick = (partsConsumed / selfReplicator.baseCost.parts!) / 10;
            newSraProgress = (stats.sra_progress || 0) + progressPerTick;
        }
        
        setResources(prev => {
            const newResources = { ...prev };
            for (const key in newResources) {
                const resource = key as ResourceType;
                newResources[resource] = Math.max(0, newResources[resource] + (netChangePerTick[resource] ?? 0));
            }
            return newResources;
        });
        
        setStats(prev => {
            const newStats = { ...prev };
            // Add production deltas to totals
            for(const key in totalProductionThisTick) {
                newStats[key] = (prev[key] || 0) + totalProductionThisTick[key]!;
            }
            // Update sra_progress state if it changed
            if (newSraProgress !== undefined) {
                newStats.sra_progress = newSraProgress;
            }
            return newStats;
        });

        const newRps: Partial<Resources> = {};
        for (const key in netChangePerTick) newRps[key as ResourceType] = (netChangePerTick[key as ResourceType] ?? 0) * 10;
        setRps(newRps);
    }
  }, [resources, upgrades, bonuses, prestigePoints, activeBoosts, stats.sra_progress]);

  // Main game loop timer.
  useEffect(() => {
    const gameTick = setInterval(() => { gameTickCallback.current?.(); }, 100);
    return () => clearInterval(gameTick);
  }, []);
  
  // Effect for Self-Replicating Assembler creating new units
  useEffect(() => {
    const progress = stats.sra_progress || 0;
    if (progress >= 1) {
        const newUnits = Math.floor(progress);
        const sra = upgrades.find(u => u.id === 'self_replicating_assembler');
        if (sra) {
            const newOwned = sra.owned + newUnits;
            const newCost = { ...sra.baseCost };
            for (const key in newCost) {
                const resource = key as ResourceType;
                if (sra.baseCost[resource] > 0) {
                    newCost[resource] = Math.ceil(sra.baseCost[resource] * Math.pow(sra.costMultiplier, newOwned));
                }
            }
            setUpgrades(prev => prev.map(u => 
                u.id === 'self_replicating_assembler' 
                ? { ...u, owned: newOwned, cost: newCost } 
                : u
            ));
            setStats(prev => ({ ...prev, sra_progress: prev.sra_progress - newUnits }));
            addNotification(`+${newUnits} Self-Replicating Assembler`);
        }
    }
  }, [stats.sra_progress, upgrades, addNotification]);

  // Effect to check for new unlocks
  useEffect(() => {
    const newUnlocked = new Set(unlockedUpgrades);
    let changed = false;
    UPGRADES_CONFIG.forEach(upgrade => {
      if (!newUnlocked.has(upgrade.id) && upgrade.unlocksAt) {
        const conditionsMet = Object.entries(upgrade.unlocksAt.owned || {}).every(([reqId, reqAmount]) => {
            const owned = upgrades.find(u => u.id === reqId)?.owned || 0;
            return owned >= reqAmount;
        }) && Object.entries(upgrade.unlocksAt.resources || {}).every(([res, reqAmount]) => resources[res as ResourceType] >= (reqAmount || 0));
        
        if (conditionsMet) {
          newUnlocked.add(upgrade.id);
          addNotification(`Unlocked: ${upgrade.name}`);
          changed = true;
        }
      }
    });
    if (changed) setUnlockedUpgrades(newUnlocked);
  }, [resources, upgrades, unlockedUpgrades, addNotification]);

  // Effect to check for new achievements
  useEffect(() => {
    const gameState = { resources, upgrades, stats, completedResearch, prestigePoints };
    let changed = false;
    ACHIEVEMENTS_CONFIG.forEach(ach => {
        if (!unlockedAchievements.has(ach.id) && ach.isUnlocked(gameState)) {
            unlockedAchievements.add(ach.id);
            addNotification(`Achievement: ${ach.name}`);
            changed = true;
        }
    });
    if(changed) setUnlockedAchievements(new Set(unlockedAchievements));
  }, [resources, upgrades, stats, completedResearch, prestigePoints, unlockedAchievements, addNotification]);

  // Effect for random events
  useEffect(() => {
      const eventInterval = setInterval(() => {
          const isRandomEventActive = activeBoosts.some(b => RANDOM_EVENTS_CONFIG.find(e => e.id === b.sourceId));
          if(isRandomEventActive) return;

          // Approx 1% chance every 5 seconds -> once every ~8 minutes
          if (Math.random() < 0.01) {
              const event = RANDOM_EVENTS_CONFIG[Math.floor(Math.random() * RANDOM_EVENTS_CONFIG.length)];
              const newBoost: ActiveBoost = {
                  id: `${event.id}_${Date.now()}`,
                  sourceId: event.id,
                  name: event.name,
                  description: event.description,
                  expiresAt: Date.now() + event.duration * 1000,
                  type: event.boost.type,
                  value: event.boost.value,
                  target: event.boost.target,
              };
              setActiveBoosts(prev => [...prev, newBoost]);
              addNotification(`Event: ${event.name}!`);
          }
      }, 5000);

      return () => clearInterval(eventInterval);
  }, [activeBoosts, addNotification]);

  // Effect for clickable events
  useEffect(() => {
      const hasFactory = upgrades.some(u => u.tags?.includes('factory') && u.owned > 0);
      if (!hasFactory) return;

      const eventInterval = setInterval(() => {
          if (activeClickable) return;

          // ~2% chance every 4 seconds -> one every ~3.3 minutes
          if (Math.random() < 0.02) {
              const eventConfig = CLICKABLE_EVENTS_CONFIG[Math.floor(Math.random() * CLICKABLE_EVENTS_CONFIG.length)];
              
              const newClickable: ClickableEventInstance = {
                  ...eventConfig,
                  instanceId: Date.now(),
                  x: 10 + Math.random() * 80, // % from left
                  y: 20 + Math.random() * 60, // % from top to avoid headers/footers
              };
              setActiveClickable(newClickable);

              setTimeout(() => {
                  setActiveClickable(prev => (prev?.instanceId === newClickable.instanceId ? null : prev));
              }, eventConfig.lifespan * 1000);
          }
      }, 4000);
      return () => clearInterval(eventInterval);
  }, [upgrades, activeClickable]);

  const handleStartGame = useCallback(() => setScene('game'), []);

  const handleResourceClick = useCallback(() => {
    soundManager.playMusic(); // Attempt to start music on first click as a fallback
    soundManager.playSoundEffect('click');
    const clickAmount = 1 * bonuses.click;
    setResources(prev => ({ ...prev, ore: prev.ore + clickAmount }));
    setStats(prev => ({ 
        ...prev, 
        total_ore: (prev.total_ore || 0) + clickAmount,
        total_clicks: (prev.total_clicks || 0) + 1,
    }));
  }, [bonuses.click]);

  const handleBuyUpgrade = useCallback((upgradeId: string) => {
    setUpgrades(prevUpgrades => {
      const u = prevUpgrades.find(u => u.id === upgradeId);
      if (!u) return prevUpgrades;
      const canAfford = Object.entries(u.cost).every(([res, amt]) => resources[res as ResourceType] >= amt);
      if (!canAfford) return prevUpgrades;
      
      soundManager.playSoundEffect('buy');

      setResources(prevRes => {
          const newRes = {...prevRes};
          Object.entries(u.cost).forEach(([res, amt]) => { newRes[res as ResourceType] -= amt });
          return newRes;
      });
      
      return prevUpgrades.map(up => {
        if (up.id === upgradeId) {
          const newOwned = up.owned + 1;
          const newCost = { ...up.baseCost };
          for (const key in newCost) {
            const resource = key as ResourceType;
            if (up.baseCost[resource] > 0) {
                newCost[resource] = Math.ceil(up.baseCost[resource] * Math.pow(up.costMultiplier, newOwned));
            }
          }
          return { ...up, owned: newOwned, cost: newCost };
        }
        return up;
      });
    });
  }, [resources]);

  const handleLevelUpUpgrade = useCallback((upgradeId: string) => {
    const u = upgrades.find(up => up.id === upgradeId);
    if (!u || u.owned < 1) return;

    const levelUpCost: Partial<Resources> = {};
    const costFactor = 3 * u.level;
    const keyResources: ResourceType[] = ['parts', 'energy', 'ore'];
    
    keyResources.forEach(res => {
        if (u.baseCost[res] > 0) {
            levelUpCost[res] = (levelUpCost[res] || 0) + u.baseCost[res] * costFactor;
        }
    });

    if (Object.keys(levelUpCost).length === 0) { // Fallback for simple upgrades
        levelUpCost.parts = 50 * u.level;
        levelUpCost.energy = 25 * u.level;
    }

    const canAfford = Object.entries(levelUpCost).every(([res, amt]) => resources[res as ResourceType] >= amt!);
    if (!canAfford) return;
    
    soundManager.playSoundEffect('level-up');

    setResources(prev => {
        const newRes = {...prev};
        Object.entries(levelUpCost).forEach(([res, amt]) => { newRes[res as ResourceType] -= amt! });
        return newRes;
    });
    
    setUpgrades(prev => prev.map(upg => upg.id === upgradeId ? {...upg, level: upg.level + 1} : upg));
    addNotification(`${u.name} leveled up to Mk. ${u.level + 1}!`);
  }, [resources, upgrades, addNotification]);

  const handleBuyResearch = useCallback((researchId: string) => {
    const research = RESEARCH_CONFIG.find(r => r.id === researchId);
    if (!research || completedResearch.has(researchId)) return;
    
    if (resources[research.cost.resource] < research.cost.amount) return;
    const prerequisitesMet = !research.prerequisites || research.prerequisites.every(reqId => completedResearch.has(reqId));
    if (!prerequisitesMet) return;

    soundManager.playSoundEffect('research');
    setResources(prev => ({ ...prev, [research.cost.resource]: prev[research.cost.resource] - research.cost.amount }));
    setCompletedResearch(prev => new Set(prev).add(researchId));
    addNotification(`Research complete: ${research.name}`);
  }, [resources, completedResearch, addNotification]);

  const handlePrestige = useCallback(() => {
    if (resources.dyson_fragments < 1) return;
    const fragmentsToBank = Math.floor(resources.dyson_fragments);
    
    setPrestigePoints(prev => prev + fragmentsToBank);
    setStats(prev => ({ ...prev, total_prestiges: (prev.total_prestiges || 0) + 1, sra_progress: 0 }));
    setResources(INITIAL_RESOURCES);
    setUpgrades(UPGRADES_CONFIG);
    setUnlockedUpgrades(new Set(['auto_miner']));
    setCompletedResearch(new Set());
    addNotification(`Prestiged for ${fragmentsToBank} bonus points!`);
  }, [resources.dyson_fragments, addNotification]);

  const handleClickableEvent = useCallback((event: ClickableEventInstance) => {
    setActiveClickable(null);

    const newBoost: ActiveBoost = {
        id: `${event.id}_${Date.now()}`,
        sourceId: event.id,
        name: event.name,
        description: event.description,
        expiresAt: Date.now() + event.duration * 1000,
        type: event.boost.type,
        value: event.boost.value,
        target: 'click', // Explicitly target clicks
    };
    setActiveBoosts(prev => [...prev, newBoost]);
    addNotification(`Bonus: ${event.name}!`);
  }, [addNotification]);
  
  const handleActivateAbility = useCallback((abilityId: string) => {
    const ability = ABILITIES_CONFIG.find(a => a.id === abilityId);
    if (!ability) return;

    if ((cooldowns[abilityId] || 0) > Date.now()) return;

    const canAfford = Object.entries(ability.cost).every(([res, amt]) => resources[res as ResourceType] >= (amt ?? 0));
    if(!canAfford) return;
    
    // Play sound
    const ABILITY_SOUND_MAP: Record<string, SfxType> = {
        'overcharge_power': 'overcharge',
        'ore_rush': 'orerush',
        'efficiency_drive': 'efficiency',
        'rapid_research': 'research',
    };
    const soundToPlay = ABILITY_SOUND_MAP[abilityId];
    if (soundToPlay) {
        soundManager.playSoundEffect(soundToPlay);
    }


    // Deduct cost
    setResources(prev => {
        const newRes = { ...prev };
        for (const res in ability.cost) {
            newRes[res as ResourceType] -= ability.cost[res as ResourceType] ?? 0;
        }
        return newRes;
    });

    // Set cooldown
    setCooldowns(prev => ({...prev, [abilityId]: Date.now() + ability.cooldown * 1000 }));
    
    // Apply effect
    if (ability.type === 'instant_gain') {
        const instantAbility = ability;
        setResources(prev => {
            const newRes = { ...prev };
            if (instantAbility.gain) {
                for(const res in instantAbility.gain) {
                     newRes[res as ResourceType] += instantAbility.gain[res as ResourceType] ?? 0;
                }
            }
            if (instantAbility.gainSeconds) {
                for (const res in instantAbility.gainSeconds) {
                    const resource = res as ResourceType;
                    const seconds = instantAbility.gainSeconds[resource] ?? 0;
                    const gainAmount = (rps[resource] || 0) * seconds;
                    newRes[resource] += gainAmount;
                }
            }
            return newRes;
        });
        addNotification(`${ability.name} activated!`);
    } else if (ability.type === 'timed_boost') {
        const timedAbility = ability;
        const newBoost: ActiveBoost = {
            id: `${timedAbility.id}_${Date.now()}`,
            sourceId: timedAbility.id,
            name: timedAbility.name,
            description: timedAbility.description,
            expiresAt: Date.now() + timedAbility.duration * 1000,
            type: timedAbility.boost.type,
            value: timedAbility.boost.value,
            target: timedAbility.boost.target,
        }
        setActiveBoosts(prev => [...prev, newBoost]);
        addNotification(`${ability.name} activated!`);
    }

  }, [resources, cooldowns, rps, addNotification]);
  
  const handleCloseOfflineModal = () => setOfflineGains(null);
  
  const handleVolumeChange = useCallback((type: 'master' | 'music' | 'sfx', value: number) => {
      setVolume(prev => ({...prev, [type]: value }));
  }, []);

  return (
    <div className="h-full w-full text-white font-sans relative">
      <Notifications notifications={notifications} />
      {offlineGains && <OfflineProgressModal gains={offlineGains} onClose={handleCloseOfflineModal} />}
      {activeClickable && <ClickableEvent event={activeClickable} onClick={handleClickableEvent} />}
      {isOptionsOpen && <OptionsMenu onClose={() => setIsOptionsOpen(false)} volume={volume} onVolumeChange={handleVolumeChange} />}
      {scene === 'menu' && <MainMenu onStartGame={handleStartGame} onOpenOptions={() => setIsOptionsOpen(true)} />}
      {scene === 'game' && (
        <GameUI 
          resources={resources} 
          upgrades={upgrades} 
          unlockedUpgrades={unlockedUpgrades}
          completedResearch={completedResearch}
          unlockedAchievements={unlockedAchievements}
          onResourceClick={handleResourceClick}
          onBuyUpgrade={handleBuyUpgrade}
          onLevelUpUpgrade={handleLevelUpUpgrade}
          onBuyResearch={handleBuyResearch}
          dysonFragments={resources.dyson_fragments}
          clickBonus={bonuses.click}
          prestigePoints={prestigePoints}
          prestigeBonusPerPoint={bonuses.prestige}
          onPrestige={handlePrestige}
          rps={rps}
          activeBoosts={activeBoosts}
          cooldowns={cooldowns}
          onActivateAbility={handleActivateAbility}
          onOpenOptions={() => setIsOptionsOpen(true)}
        />
      )}
    </div>
  );
};

export default App;
