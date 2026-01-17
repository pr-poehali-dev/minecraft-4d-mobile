import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface SettingsProps {
  onNavigate: (screen: 'menu' | 'game' | 'inventory' | 'settings' | 'saves' | 'shop') => void;
}

const Settings = ({ onNavigate }: SettingsProps) => {
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(true);
  const [volume, setVolume] = useState([80]);
  const [sensitivity, setSensitivity] = useState([50]);

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
        <h1 className="text-2xl font-bold text-foreground">Настройки</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">Звук</h3>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-foreground">Звуковые эффекты</span>
            <Switch checked={sound} onCheckedChange={setSound} />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-foreground">Музыка</span>
            <Switch checked={music} onCheckedChange={setMusic} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Громкость</span>
              <span className="text-sm text-muted-foreground">{volume[0]}%</span>
            </div>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">Управление</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Чувствительность</span>
              <span className="text-sm text-muted-foreground">{sensitivity[0]}%</span>
            </div>
            <Slider
              value={sensitivity}
              onValueChange={setSensitivity}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">Графика</h3>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between">
              <span>Качество</span>
              <span className="text-muted-foreground">Высокое</span>
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>Дальность прорисовки</span>
              <span className="text-muted-foreground">16 чанков</span>
            </Button>
          </div>
        </Card>
      </div>

      <Button
        onClick={() => onNavigate('menu')}
        className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Сохранить настройки
      </Button>
    </div>
  );
};

export default Settings;
