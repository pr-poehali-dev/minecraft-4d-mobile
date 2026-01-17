import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface MainMenuProps {
  onNavigate: (screen: 'menu' | 'game' | 'inventory' | 'settings' | 'saves' | 'shop') => void;
}

const MainMenu = ({ onNavigate }: MainMenuProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-background to-slate-900">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-6xl font-bold mb-2 text-foreground drop-shadow-lg">
          MINECRAFT
        </h1>
        <p className="text-lg text-muted-foreground">Pocket Edition</p>
      </div>

      <div className="w-full max-w-md space-y-3 animate-scale-in">
        <Button 
          onClick={() => onNavigate('game')}
          className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          <Icon name="Play" className="mr-2" size={24} />
          Играть
        </Button>

        <Button 
          onClick={() => onNavigate('saves')}
          className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          <Icon name="Save" className="mr-2" size={24} />
          Сохранения
        </Button>

        <Button 
          onClick={() => onNavigate('shop')}
          className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          <Icon name="ShoppingBag" className="mr-2" size={24} />
          Магазин
        </Button>

        <Button 
          onClick={() => onNavigate('settings')}
          className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          <Icon name="Settings" className="mr-2" size={24} />
          Настройки
        </Button>
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        v1.0.0 • Mobile Edition
      </div>
    </div>
  );
};

export default MainMenu;
