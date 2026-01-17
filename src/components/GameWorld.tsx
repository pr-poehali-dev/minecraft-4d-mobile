import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import MobileControls from '@/components/MobileControls';

interface GameWorldProps {
  onNavigate: (screen: 'menu' | 'game' | 'inventory' | 'settings' | 'saves' | 'shop') => void;
  gameMode: 'survival' | 'creative';
  onToggleMode: () => void;
}

type BlockType = 'grass' | 'stone' | 'log' | 'leaves' | 'water' | 'air';

interface Block {
  type: BlockType;
  x: number;
  y: number;
  z: number;
}

const GameWorld = ({ onNavigate, gameMode, onToggleMode }: GameWorldProps) => {
  const [selectedBlock, setSelectedBlock] = useState<BlockType>('grass');
  const [world, setWorld] = useState<Block[]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, z: 0 });
  const [showInventory, setShowInventory] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const initialWorld: Block[] = [];
    for (let x = -5; x <= 5; x++) {
      for (let z = -5; z <= 5; z++) {
        initialWorld.push({ type: 'grass', x, y: 0, z });
        if (Math.random() > 0.7) {
          initialWorld.push({ type: 'stone', x, y: -1, z });
        }
      }
    }

    for (let i = 0; i < 5; i++) {
      const treeX = Math.floor(Math.random() * 10) - 5;
      const treeZ = Math.floor(Math.random() * 10) - 5;
      initialWorld.push({ type: 'log', x: treeX, y: 1, z: treeZ });
      initialWorld.push({ type: 'log', x: treeX, y: 2, z: treeZ });
      initialWorld.push({ type: 'leaves', x: treeX, y: 3, z: treeZ });
      initialWorld.push({ type: 'leaves', x: treeX + 1, y: 3, z: treeZ });
      initialWorld.push({ type: 'leaves', x: treeX - 1, y: 3, z: treeZ });
      initialWorld.push({ type: 'leaves', x: treeX, y: 3, z: treeZ + 1 });
      initialWorld.push({ type: 'leaves', x: treeX, y: 3, z: treeZ - 1 });
    }

    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        if (Math.abs(x) + Math.abs(z) < 3) {
          initialWorld.push({ type: 'water', x: x + 8, y: 0, z: z + 8 });
        }
      }
    }

    setWorld(initialWorld);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const blockColors: Record<BlockType, string> = {
      grass: '#10B981',
      stone: '#6B7280',
      log: '#92400E',
      leaves: '#059669',
      water: '#0EA5E9',
      air: 'transparent'
    };

    const scale = 30;
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    world
      .sort((a, b) => (a.z + a.x) - (b.z + b.x))
      .forEach(block => {
        const screenX = offsetX + (block.x - block.z) * scale * 0.866;
        const screenY = offsetY + (block.x + block.z) * scale * 0.5 - block.y * scale;

        ctx.fillStyle = blockColors[block.type];
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(screenX, screenY - scale * 0.5);
        ctx.lineTo(screenX + scale * 0.866, screenY);
        ctx.lineTo(screenX, screenY + scale * 0.5);
        ctx.lineTo(screenX - scale * 0.866, screenY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (block.type !== 'water') {
          ctx.fillStyle = blockColors[block.type];
          const brightness = 0.8;
          ctx.fillStyle = `rgba(${parseInt(blockColors[block.type].slice(1, 3), 16) * brightness},${parseInt(blockColors[block.type].slice(3, 5), 16) * brightness},${parseInt(blockColors[block.type].slice(5, 7), 16) * brightness},1)`;
          
          ctx.beginPath();
          ctx.moveTo(screenX, screenY - scale * 0.5);
          ctx.lineTo(screenX + scale * 0.866, screenY);
          ctx.lineTo(screenX + scale * 0.866, screenY - scale);
          ctx.lineTo(screenX, screenY - scale * 1.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = `rgba(${parseInt(blockColors[block.type].slice(1, 3), 16) * 0.6},${parseInt(blockColors[block.type].slice(3, 5), 16) * 0.6},${parseInt(blockColors[block.type].slice(5, 7), 16) * 0.6},1)`;
          
          ctx.beginPath();
          ctx.moveTo(screenX, screenY - scale * 0.5);
          ctx.lineTo(screenX - scale * 0.866, screenY);
          ctx.lineTo(screenX - scale * 0.866, screenY - scale);
          ctx.lineTo(screenX, screenY - scale * 1.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      });
  }, [world]);

  const handleMove = (dx: number, dz: number) => {
    setPlayerPos(prev => ({ ...prev, x: prev.x + dx, z: prev.z + dz }));
  };

  const handleJump = () => {
    setPlayerPos(prev => ({ ...prev, y: prev.y + 1 }));
    setTimeout(() => {
      setPlayerPos(prev => ({ ...prev, y: Math.max(0, prev.y - 1) }));
    }, 300);
  };

  const handlePlaceBlock = () => {
    if (gameMode === 'creative') {
      const newBlock: Block = {
        type: selectedBlock,
        x: playerPos.x,
        y: playerPos.y + 1,
        z: playerPos.z
      };
      setWorld(prev => [...prev, newBlock]);
    }
  };

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" />

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <Button
          onClick={() => onNavigate('menu')}
          variant="secondary"
          size="sm"
          className="bg-background/80 backdrop-blur"
        >
          <Icon name="Menu" size={20} />
        </Button>

        <div className="flex gap-2">
          <Badge 
            variant={gameMode === 'survival' ? 'default' : 'secondary'}
            className="px-3 py-1 bg-background/80 backdrop-blur text-foreground"
          >
            {gameMode === 'survival' ? '⚔️ Выживание' : '🔨 Творчество'}
          </Badge>
          <Button
            onClick={onToggleMode}
            size="sm"
            variant="secondary"
            className="bg-background/80 backdrop-blur"
          >
            <Icon name="RefreshCw" size={16} />
          </Button>
        </div>

        <Button
          onClick={() => setShowInventory(!showInventory)}
          variant="secondary"
          size="sm"
          className="bg-background/80 backdrop-blur"
        >
          <Icon name="Package" size={20} />
        </Button>
      </div>

      {showInventory && (
        <div className="absolute top-16 right-4 bg-background/95 backdrop-blur p-4 rounded-lg border border-border">
          <h3 className="text-sm font-semibold mb-2 text-foreground">Инвентарь</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['grass', 'stone', 'log', 'leaves', 'water'] as BlockType[]).map(type => (
              <button
                key={type}
                onClick={() => setSelectedBlock(type)}
                className={`w-12 h-12 rounded border-2 transition-all ${
                  selectedBlock === type ? 'border-primary scale-110' : 'border-border'
                }`}
                style={{
                  backgroundColor: {
                    grass: '#10B981',
                    stone: '#6B7280',
                    log: '#92400E',
                    leaves: '#059669',
                    water: '#0EA5E9'
                  }[type]
                }}
              />
            ))}
          </div>
        </div>
      )}

      <MobileControls
        onMove={handleMove}
        onJump={handleJump}
        onAction={handlePlaceBlock}
      />
    </div>
  );
};

export default GameWorld;
