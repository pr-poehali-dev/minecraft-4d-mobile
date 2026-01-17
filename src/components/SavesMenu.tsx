import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface SavesMenuProps {
  onNavigate: (screen: 'menu' | 'game' | 'inventory' | 'settings' | 'saves' | 'shop') => void;
}

const SavesMenu = ({ onNavigate }: SavesMenuProps) => {
  const saves = [
    { name: 'Мой мир', mode: 'Выживание', time: '2 часа назад', image: '🌲' },
    { name: 'Творческий мир', mode: 'Творчество', time: '5 часов назад', image: '🏗️' },
    { name: 'Остров', mode: 'Выживание', time: '1 день назад', image: '🏝️' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => onNavigate('menu')}
          variant="ghost"
          size="sm"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Сохранения</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {saves.map((save, index) => (
          <Card key={index} className="p-4 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center text-3xl">
                {save.image}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{save.name}</h3>
                <p className="text-sm text-muted-foreground">{save.mode}</p>
                <p className="text-xs text-muted-foreground mt-1">{save.time}</p>
              </div>
              <Button
                onClick={() => onNavigate('game')}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Icon name="Play" size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Button
        className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Icon name="Plus" className="mr-2" />
        Создать новый мир
      </Button>
    </div>
  );
};

export default SavesMenu;
