import { useState } from 'react';
import MainMenu from '@/components/MainMenu';
import GameWorld from '@/components/GameWorld';
import Inventory from '@/components/Inventory';
import Settings from '@/components/Settings';
import SavesMenu from '@/components/SavesMenu';
import Shop from '@/components/Shop';

type Screen = 'menu' | 'game' | 'inventory' | 'settings' | 'saves' | 'shop';
type GameMode = 'survival' | 'creative';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('survival');

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const toggleGameMode = () => {
    setGameMode(prev => prev === 'survival' ? 'creative' : 'survival');
  };

  return (
    <div className="w-full h-screen bg-background overflow-hidden font-['Rubik',sans-serif]">
      {currentScreen === 'menu' && <MainMenu onNavigate={handleNavigate} />}
      {currentScreen === 'game' && (
        <GameWorld 
          onNavigate={handleNavigate} 
          gameMode={gameMode}
          onToggleMode={toggleGameMode}
        />
      )}
      {currentScreen === 'inventory' && <Inventory onNavigate={handleNavigate} />}
      {currentScreen === 'settings' && <Settings onNavigate={handleNavigate} />}
      {currentScreen === 'saves' && <SavesMenu onNavigate={handleNavigate} />}
      {currentScreen === 'shop' && <Shop onNavigate={handleNavigate} />}
    </div>
  );
};

export default Index;
