import React from 'react';
import { Upgrade, Resources, ActiveBoost, ResourceType } from '../types';
import ResourceDisplay from './ResourceDisplay';
import Clicker from './Clicker';
import UpgradeShop from './UpgradeShop';
import ResearchView from './ResearchView';
import GoalProgress from './GoalProgress';
import PrestigeManager from './PrestigeManager';
import AchievementsView from './AchievementsView';
import EventsManager from './EventsManager';
import Tooltip from './Tooltip';

interface GameUIProps {
  resources: Resources;
  upgrades: Upgrade[];
  unlockedUpgrades: Set<string>;
  completedResearch: Set<string>;
  unlockedAchievements: Set<string>;
  onResourceClick: () => void;
  onBuyUpgrade: (upgradeId: string) => void;
  onLevelUpUpgrade: (upgradeId: string) => void;
  onBuyResearch: (researchId: string) => void;
  dysonFragments: number;
  clickBonus: number;
  prestigePoints: number;
  prestigeBonusPerPoint: number;
  onPrestige: () => void;
  rps: Partial<Resources>;
  activeBoosts: ActiveBoost[];
  cooldowns: Record<string, number>;
  onActivateAbility: (abilityId: string) => void;
  onOpenOptions: () => void;
  onOpenHelp: () => void;
  calculatedPPS: Record<string, Partial<Resources>>;
  calculatedCPS: Record<string, Partial<Resources>>;
  goal: number;
  resourceFlash: Set<ResourceType>;
}

type MainViewTab = 'upgrades' | 'research' | 'achievements' | 'prestige';

const GameUI: React.FC<GameUIProps> = (props) => {
  const { 
      resources, upgrades, unlockedUpgrades, completedResearch, unlockedAchievements, onResourceClick, 
      onBuyUpgrade, onLevelUpUpgrade, onBuyResearch, dysonFragments, clickBonus, prestigePoints, prestigeBonusPerPoint, 
      onPrestige, rps, activeBoosts, cooldowns, onActivateAbility, onOpenOptions, onOpenHelp, calculatedPPS, calculatedCPS, goal, resourceFlash
  } = props;
  
  const [mainViewTab, setMainViewTab] = React.useState<MainViewTab>('upgrades');
  const [researchTabNotified, setResearchTabNotified] = React.useState(false);
  
  const hasResearchLab = upgrades.some(u => u.id === 'research_lab' && u.owned > 0);
  const prestigeUnlocked = upgrades.some(u => u.id === 'fabricator' && u.owned > 0);
  const abilitiesUnlocked = upgrades.some(u => u.id === 'solar_panel' && u.owned > 0);

  const canResearch = hasResearchLab;
  const showResearchGlow = canResearch && !researchTabNotified;
  const canPrestigeNow = dysonFragments >= 1;
  
  React.useEffect(() => {
    // If a tab becomes locked (e.g., after prestige), switch to upgrades tab
    if (!canResearch && mainViewTab === 'research') {
        setMainViewTab('upgrades');
    }
    if (!prestigeUnlocked && mainViewTab === 'prestige') {
      setMainViewTab('upgrades');
    }
    // Reset notification on prestige
    if (!canResearch) {
      setResearchTabNotified(false);
    }
  }, [canResearch, prestigeUnlocked, mainViewTab]);

  const handleTabClick = (tab: MainViewTab) => {
    setMainViewTab(tab);
    if (tab === 'research') {
        setResearchTabNotified(true);
    }
  };


  return (
    <div className="h-full w-full max-w-screen-2xl mx-auto flex flex-col p-4 gap-4">
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
        <Tooltip content="How to Play" position="left">
          <button 
            onClick={onOpenHelp}
            className="w-14 h-14 bg-gray-800/80 backdrop-blur-sm border-2 border-purple-500/50 rounded-full text-3xl flex items-center justify-center
                      hover:bg-purple-700/80 hover:border-purple-400 transition-all transform hover:scale-110"
            aria-label="Open How to Play guide"
          >
            ?
          </button>
        </Tooltip>
        <Tooltip content="Options" position="left">
          <button 
            onClick={onOpenOptions}
            className="w-14 h-14 bg-gray-800/80 backdrop-blur-sm border-2 border-cyan-500/50 rounded-full text-3xl flex items-center justify-center
                      hover:bg-cyan-700/80 hover:border-cyan-400 transition-all transform hover:scale-110 hover:rotate-12"
            aria-label="Open Options"
          >
            ⚙️
          </button>
        </Tooltip>
      </div>
      
      <main className="flex-grow min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel: Actions & Resources */}
        <div className="lg:col-span-1 bg-black/30 backdrop-blur-sm p-4 rounded-md shadow-lg border border-gray-700/50 flex flex-col gap-2 clip-corner">
          <div className="flex-shrink-0">
            <GoalProgress 
                current={dysonFragments}
                goal={goal}
            />
          </div>
          <div className="flex-shrink-0">
              <Clicker onClick={onResourceClick} clickBonus={clickBonus} activeBoosts={activeBoosts} />
          </div>

          <ResourceDisplay resources={resources} rps={rps} resourceFlash={resourceFlash} activeBoosts={activeBoosts} />
          
          {abilitiesUnlocked && (
            <EventsManager 
                cooldowns={cooldowns}
                resources={resources}
                onActivateAbility={onActivateAbility}
                hasResearchLab={hasResearchLab}
            />
          )}
        </div>

        {/* Right Panel: Tabbed Content */}
        <div className="lg:col-span-2 bg-black/30 backdrop-blur-sm rounded-md shadow-lg border border-gray-700/50 flex flex-col overflow-hidden clip-corner">
            {/* Tab Header */}
            <div className="flex-shrink-0 flex border-b-2 border-gray-700/50">
                <button
                    onClick={() => handleTabClick('upgrades')}
                    className={`flex-1 p-3 text-lg font-bold transition-colors uppercase tracking-wider
                        ${mainViewTab === 'upgrades' ? 'bg-cyan-900/40 text-cyan-200' : 'bg-transparent text-gray-400 hover:bg-gray-800/50'}`}
                    aria-current={mainViewTab === 'upgrades'}
                >
                    Upgrades
                </button>
                {canResearch && (
                    <button
                        onClick={() => handleTabClick('research')}
                        className={`flex-1 p-3 text-lg font-bold transition-colors uppercase tracking-wider
                            ${mainViewTab === 'research' ? 'bg-cyan-900/40 text-cyan-200' : 'bg-transparent text-gray-400 hover:bg-gray-800/50'}
                            ${showResearchGlow ? 'animate-throb' : ''}`}
                        aria-current={mainViewTab === 'research'}
                    >
                        Research
                    </button>
                )}
                <button
                    onClick={() => handleTabClick('achievements')}
                    className={`flex-1 p-3 text-lg font-bold transition-colors uppercase tracking-wider
                        ${mainViewTab === 'achievements' ? 'bg-cyan-900/40 text-cyan-200' : 'bg-transparent text-gray-400 hover:bg-gray-800/50'}`}
                    aria-current={mainViewTab === 'achievements'}
                >
                    Achievements
                </button>
                {prestigeUnlocked && (
                     <button
                        onClick={() => handleTabClick('prestige')}
                        className={`flex-1 p-3 text-lg font-bold transition-colors uppercase tracking-wider
                            ${mainViewTab === 'prestige' ? 'bg-purple-900/40 text-purple-200' : 'bg-transparent text-gray-400 hover:bg-gray-800/50'}
                            ${canPrestigeNow ? 'animate-throb-purple' : ''}`}
                        aria-current={mainViewTab === 'prestige'}
                    >
                        Prestige
                    </button>
                )}
            </div>
            
            {/* Tab Content */}
            <div className="flex-grow overflow-y-auto overflow-x-hidden p-4">
                {mainViewTab === 'upgrades' && (
                    <UpgradeShop 
                        resources={resources}
                        upgrades={upgrades}
                        unlockedUpgrades={unlockedUpgrades}
                        onBuy={onBuyUpgrade}
                        onLevelUp={onLevelUpUpgrade}
                        calculatedPPS={calculatedPPS}
                        calculatedCPS={calculatedCPS}
                    />
                )}
                {mainViewTab === 'research' && canResearch && (
                    <ResearchView
                        resources={resources}
                        completedResearch={completedResearch}
                        onBuy={onBuyResearch}
                    />
                )}
                {mainViewTab === 'achievements' && (
                    <AchievementsView
                        unlockedAchievements={unlockedAchievements}
                    />
                )}
                {mainViewTab === 'prestige' && prestigeUnlocked && (
                    <PrestigeManager 
                        prestigePoints={prestigePoints}
                        prestigeBonusPerPoint={prestigeBonusPerPoint}
                        fragmentsReady={dysonFragments}
                        onPrestige={onPrestige}
                        isUnlocked={prestigeUnlocked}
                    />
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default GameUI;