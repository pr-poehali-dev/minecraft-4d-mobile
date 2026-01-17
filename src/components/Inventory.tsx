import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface InventoryProps {
  onNavigate: (screen: 'menu' | 'game' | 'inventory' | 'settings' | 'saves' | 'shop') => void;
}

const Inventory = ({ onNavigate }: InventoryProps) => {
  const blocks = [
    { name: 'Земля', type: 'grass', color: '#10B981', count: 64 },
    { name: 'Камень', type: 'stone', color: '#6B7280', count: 32 },
    { name: 'Брёвна', type: 'log', color: '#92400E', count: 16 },
    { name: 'Листва', type: 'leaves', color: '#059669', count: 24 },
    { name: 'Вода', type: 'water', color: '#0EA5E9', count: 8 },
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
        <h1 className="text-2xl font-bold text-foreground">Инвентарь</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {blocks.map((block, index) => (
            <Card key={index} className="p-4 bg-card border-border">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-border"
                  style={{ backgroundColor: block.color }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{block.name}</h3>
                  <p className="text-sm text-muted-foreground">x{block.count}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onNavigate('game')}
        className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Icon name="Play" className="mr-2" />
        Вернуться в игру
      </Button>
    </div>
  );
};

export default Inventory;
