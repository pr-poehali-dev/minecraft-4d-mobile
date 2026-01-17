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

type BlockType = 'grass' | 'stone' | 'log' | 'leaves' | 'water' | 'dirt' | 'air';

interface Block {
  type: BlockType;
  x: number;
  y: number;
  z: number;
  breaking?: number;
}

const GameWorld = ({ onNavigate, gameMode, onToggleMode }: GameWorldProps) => {
  const [selectedBlock, setSelectedBlock] = useState<BlockType>('grass');
  const [world, setWorld] = useState<Block[]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 1, z: 0 });
  const [showInventory, setShowInventory] = useState(false);
  const [targetBlock, setTargetBlock] = useState<Block | null>(null);
  const [camera, setCamera] = useState({ angleX: 0.5, angleY: 0.3, distance: 15 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const breakingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initialWorld: Block[] = [];
    
    for (let x = -8; x <= 8; x++) {
      for (let z = -8; z <= 8; z++) {
        initialWorld.push({ type: 'grass', x, y: 0, z });
        initialWorld.push({ type: 'dirt', x, y: -1, z });
        if (Math.random() > 0.6) {
          initialWorld.push({ type: 'stone', x, y: -2, z });
        }
      }
    }

    for (let i = 0; i < 8; i++) {
      const treeX = Math.floor(Math.random() * 14) - 7;
      const treeZ = Math.floor(Math.random() * 14) - 7;
      const treeHeight = 4 + Math.floor(Math.random() * 2);
      
      for (let y = 1; y <= treeHeight; y++) {
        initialWorld.push({ type: 'log', x: treeX, y, z: treeZ });
      }
      
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          for (let dy = 0; dy <= 2; dy++) {
            if (Math.abs(dx) + Math.abs(dz) + dy < 4) {
              initialWorld.push({ 
                type: 'leaves', 
                x: treeX + dx, 
                y: treeHeight + dy, 
                z: treeZ + dz 
              });
            }
          }
        }
      }
    }

    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        if (x * x + z * z < 12) {
          initialWorld.push({ type: 'water', x: x + 10, y: 0, z: z + 10 });
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

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F2FE');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const blockTextures: Record<BlockType, { top: string; side: string; front: string }> = {
      grass: { top: '#10B981', side: '#059669', front: '#047857' },
      dirt: { top: '#92400E', side: '#78350F', front: '#78350F' },
      stone: { top: '#9CA3AF', side: '#6B7280', front: '#4B5563' },
      log: { top: '#92400E', side: '#78350F', front: '#78350F' },
      leaves: { top: '#10B981', side: '#059669', front: '#047857' },
      water: { top: '#0EA5E9', side: '#0284C7', front: '#0369A1' },
      air: { top: 'transparent', side: 'transparent', front: 'transparent' }
    };

    const scale = 25;
    const offsetX = canvas.width / 2 - playerPos.x * scale * Math.cos(camera.angleX);
    const offsetY = canvas.height / 2 + playerPos.z * scale * Math.sin(camera.angleX);

    const sortedBlocks = [...world].sort((a, b) => {
      const distA = (a.x - playerPos.x) ** 2 + (a.z - playerPos.z) ** 2 + (a.y - playerPos.y) ** 2;
      const distB = (b.x - playerPos.x) ** 2 + (b.z - playerPos.z) ** 2 + (b.y - playerPos.y) ** 2;
      return distB - distA;
    });

    sortedBlocks.forEach(block => {
      const relX = block.x - playerPos.x;
      const relZ = block.z - playerPos.z;
      const relY = block.y - playerPos.y;

      const rotatedX = relX * Math.cos(camera.angleX) - relZ * Math.sin(camera.angleX);
      const rotatedZ = relX * Math.sin(camera.angleX) + relZ * Math.cos(camera.angleX);

      const screenX = offsetX + rotatedX * scale;
      const screenY = offsetY - relY * scale - rotatedZ * scale * 0.5;

      const colors = blockTextures[block.type];
      
      ctx.save();
      
      if (block === targetBlock) {
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
      }

      if (block.breaking !== undefined) {
        const crack = 1 - (block.breaking / 100);
        ctx.globalAlpha = crack;
      }

      ctx.fillStyle = colors.top;
      ctx.beginPath();
      ctx.moveTo(screenX, screenY);
      ctx.lineTo(screenX + scale * 0.866, screenY + scale * 0.5);
      ctx.lineTo(screenX, screenY + scale);
      ctx.lineTo(screenX - scale * 0.866, screenY + scale * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (block.type !== 'water') {
        ctx.fillStyle = colors.side;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(screenX + scale * 0.866, screenY + scale * 0.5);
        ctx.lineTo(screenX + scale * 0.866, screenY + scale * 1.5);
        ctx.lineTo(screenX, screenY + scale);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = colors.front;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(screenX - scale * 0.866, screenY + scale * 0.5);
        ctx.lineTo(screenX - scale * 0.866, screenY + scale * 1.5);
        ctx.lineTo(screenX, screenY + scale);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      if (block.breaking !== undefined && block.breaking > 0) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        const crackCount = Math.floor(block.breaking / 20);
        for (let i = 0; i < crackCount; i++) {
          ctx.beginPath();
          ctx.moveTo(screenX + (Math.random() - 0.5) * scale, screenY + Math.random() * scale);
          ctx.lineTo(screenX + (Math.random() - 0.5) * scale, screenY + Math.random() * scale);
          ctx.stroke();
        }
      }

      ctx.restore();
    });

    const playerScreenX = offsetX;
    const playerScreenY = offsetY - playerPos.y * scale;
    
    ctx.fillStyle = '#8B5CF6';
    ctx.strokeStyle = '#6D28D9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(playerScreenX - 8, playerScreenY - 20, 16, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#D8B4FE';
    ctx.beginPath();
    ctx.rect(playerScreenX - 6, playerScreenY - 26, 12, 8);
    ctx.fill();
    ctx.stroke();

  }, [world, playerPos, camera, targetBlock]);

  const findBlockAtPosition = (x: number, y: number, z: number): Block | null => {
    return world.find(b => b.x === x && b.y === y && b.z === z) || null;
  };

  const handleMove = (dx: number, dz: number) => {
    const newX = playerPos.x + dx;
    const newZ = playerPos.z + dz;
    
    const blockBelow = findBlockAtPosition(newX, playerPos.y - 1, newZ);
    if (blockBelow || playerPos.y === 0) {
      setPlayerPos({ ...playerPos, x: newX, z: newZ });
    }
  };

  const handleJump = () => {
    const blockAbove = findBlockAtPosition(playerPos.x, playerPos.y + 1, playerPos.z);
    if (!blockAbove) {
      setPlayerPos(prev => ({ ...prev, y: prev.y + 1 }));
      setTimeout(() => {
        setPlayerPos(prev => {
          const blockBelow = findBlockAtPosition(prev.x, prev.y - 1, prev.z);
          if (!blockBelow && prev.y > 0) {
            return { ...prev, y: prev.y - 1 };
          }
          return prev;
        });
      }, 400);
    }
  };

  const handleBreakBlock = () => {
    if (!targetBlock) {
      const frontBlock = findBlockAtPosition(
        Math.round(playerPos.x + Math.cos(camera.angleX)),
        playerPos.y,
        Math.round(playerPos.z + Math.sin(camera.angleX))
      );
      if (frontBlock) {
        setTargetBlock(frontBlock);
      }
      return;
    }

    if (breakingIntervalRef.current) {
      clearInterval(breakingIntervalRef.current);
    }

    setWorld(prev => prev.map(b => 
      b === targetBlock ? { ...b, breaking: 0 } : b
    ));

    breakingIntervalRef.current = setInterval(() => {
      setWorld(prev => {
        const block = prev.find(b => b === targetBlock);
        if (!block) return prev;

        const newBreaking = (block.breaking || 0) + 10;
        
        if (newBreaking >= 100) {
          if (breakingIntervalRef.current) {
            clearInterval(breakingIntervalRef.current);
          }
          setTargetBlock(null);
          return prev.filter(b => b !== targetBlock);
        }

        return prev.map(b => 
          b === targetBlock ? { ...b, breaking: newBreaking } : b
        );
      });
    }, 100);
  };

  const handlePlaceBlock = () => {
    if (gameMode === 'creative' && selectedBlock) {
      const placeX = Math.round(playerPos.x + Math.cos(camera.angleX) * 2);
      const placeZ = Math.round(playerPos.z + Math.sin(camera.angleX) * 2);
      const placeY = playerPos.y;

      const existing = findBlockAtPosition(placeX, placeY, placeZ);
      if (!existing) {
        const newBlock: Block = {
          type: selectedBlock,
          x: placeX,
          y: placeY,
          z: placeZ
        };
        setWorld(prev => [...prev, newBlock]);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (breakingIntervalRef.current) {
        clearInterval(breakingIntervalRef.current);
      }
    };
  }, []);

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
          <h3 className="text-sm font-semibold mb-2 text-foreground">Блоки</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['grass', 'dirt', 'stone', 'log', 'leaves', 'water'] as BlockType[]).map(type => (
              <button
                key={type}
                onClick={() => setSelectedBlock(type)}
                className={`w-12 h-12 rounded border-2 transition-all ${
                  selectedBlock === type ? 'border-primary scale-110' : 'border-border'
                }`}
                style={{
                  backgroundColor: {
                    grass: '#10B981',
                    dirt: '#92400E',
                    stone: '#6B7280',
                    log: '#78350F',
                    leaves: '#059669',
                    water: '#0EA5E9'
                  }[type]
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-8 h-8 border-2 border-white rounded-full opacity-50" />
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <MobileControls
        onMove={handleMove}
        onJump={handleJump}
        onAction={handlePlaceBlock}
        onBreak={handleBreakBlock}
      />
    </div>
  );
};

export default GameWorld;
