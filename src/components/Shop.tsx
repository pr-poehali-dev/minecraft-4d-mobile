import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ShopProps {
  onNavigate: (screen: 'menu' | 'game' | 'inventory' | 'settings' | 'saves' | 'shop') => void;
}

const Shop = ({ onNavigate }: ShopProps) => {
  const items = [
    { name: 'Набор блоков', price: 99, icon: '📦', description: 'Базовый набор блоков для строительства' },
    { name: 'Скин "Рыцарь"', price: 149, icon: '🛡️', description: 'Эксклюзивный скин рыцаря' },
    { name: 'Мир "Замок"', price: 199, icon: '🏰', description: 'Готовый мир с замком' },
    { name: 'Текстуры HD', price: 249, icon: '🎨', description: 'Улучшенные текстуры высокого разрешения' },
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
        <h1 className="text-2xl font-bold text-foreground">Магазин</h1>
        <div className="flex items-center gap-2 bg-card px-3 py-1 rounded-lg border border-border">
          <Icon name="Coins" size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">1,250</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {items.map((item, index) => (
          <Card key={index} className="p-4 bg-card border-border">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center text-3xl shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
                    <Icon name="Coins" size={12} className="mr-1" />
                    {item.price}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
              >
                Купить
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-accent/20 rounded-lg border border-accent/30">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="Sparkles" size={20} className="text-accent" />
          <span className="font-semibold text-foreground">Совет</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Зарабатывайте монеты, играя в режиме выживания и выполняя задания!
        </p>
      </div>
    </div>
  );
};

export default Shop;
