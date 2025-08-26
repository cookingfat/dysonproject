import React, { useState } from 'react';
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
  calculatedPPS: Record<string, Partial<Resources>>;
  calculatedCPS: Record<string, Partial<Resources>>;
  goal: number;
  resourceFlash: Set<ResourceType>;
}

const TabButton: React.FC<{ name: string; active: boolean; onClick: () => void }> = ({ name, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-8 py-2 text-lg font-bold transition-colors border-b-4 relative top-px ${
            active
                ? 'bg-[#0A0F1E]/50 text-cyan-300 border-cyan-400'
                : 'bg-transparent text-gray-400 hover:bg-[#0A0F1E]/70 hover:text-cyan-400 border-transparent'
        }`}
        style={{ clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0% 100%)' }}
        aria-selected={active}
        role="tab"
    >
        {name}
    </button>
);


const GameUI: React.FC<GameUIProps> = (props) => {
  const { 
      resources, upgrades, unlockedUpgrades, completedResearch, unlockedAchievements, onResourceClick, 
      onBuyUpgrade, onLevelUpUpgrade, onBuyResearch, dysonFragments, clickBonus, prestigePoints, prestigeBonusPerPoint, 
      onPrestige, rps, activeBoosts, cooldowns, onActivateAbility, onOpenOptions, calculatedPPS, calculatedCPS, goal, resourceFlash
  } = props;
  const [activeTab, setActiveTab] = useState<'upgrades' | 'research' | 'achievements'>('upgrades');
  const hasResearchLab = upgrades.some(u => u.id === 'research_lab' && u.owned > 0);
  const prestigeUnlocked = upgrades.some(u => u.id === 'fabricator' && u.owned > 0);
  const abilitiesUnlocked = upgrades.some(u => u.id === 'solar_panel' && u.owned > 0);

  return (
    <div className="h-full w-full max-w-7xl mx-auto flex flex-col p-4 gap-4">
      <Tooltip content="Options" position="left" className="fixed bottom-4 right-4 z-40">
        <button 
          onClick={onOpenOptions}
          className="w-14 h-14 bg-gray-800/80 backdrop-blur-sm border-2 border-cyan-500/50 rounded-full text-3xl flex items-center justify-center
                    hover:bg-cyan-700/80 hover:border-cyan-400 transition-all transform hover:scale-110 hover:rotate-12"
          aria-label="Open Options"
        >
          ⚙️
        </button>
      </Tooltip>

      <header className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4">
        <GoalProgress 
          current={dysonFragments}
          goal={goal}
        />
        <PrestigeManager 
          prestigePoints={prestigePoints}
          prestigeBonusPerPoint={prestigeBonusPerPoint}
          fragmentsReady={dysonFragments}
          onPrestige={onPrestige}
          isUnlocked={prestigeUnlocked}
        />
      </header>
      
      <main className="flex-grow min-h-0 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
        {/* Left Panel */}
        <div className="md:col-span-1 bg-black/30 backdrop-blur-sm p-4 rounded-md shadow-lg border border-gray-700/50 flex flex-col gap-4 clip-corner overflow-hidden">
          {/* Non-scrolling part: flex-shrink-0 ensures it doesn't get squished */}
          <div className="flex-shrink-0">
              <Clicker onClick={onResourceClick} clickBonus={clickBonus} />
          </div>

          {/* Scrolling part: flex-grow takes remaining space, overflow-y-auto enables scrolling */}
          <div className="w-full flex-grow overflow-y-auto">
              <div className="flex flex-col gap-4 items-center">
                  <ResourceDisplay resources={resources} rps={rps} resourceFlash={resourceFlash} activeBoosts={activeBoosts} />
                  {abilitiesUnlocked && (
                      <EventsManager 
                          activeBoosts={activeBoosts}
                          cooldowns={cooldowns}
                          resources={resources}
                          onActivateAbility={onActivateAbility}
                      />
                  )}
              </div>
          </div>
        </div>


        {/* Right Panel */}
        <div className="md:col-span-2 bg-black/30 backdrop-blur-sm rounded-md shadow-lg border border-gray-700/50 flex flex-col overflow-hidden clip-corner">
          
            <div className="flex-shrink-0 flex justify-center border-b-2 border-gray-700/50" role="tablist">
              <TabButton name="Upgrades" active={activeTab === 'upgrades'} onClick={() => setActiveTab('upgrades')} />
              {hasResearchLab && <TabButton name="Research" active={activeTab === 'research'} onClick={() => setActiveTab('research')} />}
              <TabButton name="Achievements" active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
            </div>
          
          <div className="flex-grow overflow-y-auto p-4">
            {activeTab === 'upgrades' && (
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
            {activeTab === 'research' && hasResearchLab && (
                <ResearchView
                    resources={resources}
                    completedResearch={completedResearch}
                    onBuy={onBuyResearch}
                />
            )}
             {activeTab === 'achievements' && (
                <AchievementsView
                    unlockedAchievements={unlockedAchievements}
                />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameUI;