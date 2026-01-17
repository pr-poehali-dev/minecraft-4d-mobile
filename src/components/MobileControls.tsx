import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MobileControlsProps {
  onMove: (dx: number, dz: number) => void;
  onJump: () => void;
  onAction: () => void;
}

const MobileControls = ({ onMove, onJump, onAction }: MobileControlsProps) => {
  const [joystickActive, setJoystickActive] = useState(false);

  const handleTouchStart = (dx: number, dz: number) => {
    setJoystickActive(true);
    onMove(dx, dz);
  };

  const handleTouchEnd = () => {
    setJoystickActive(false);
  };

  return (
    <>
      <div className="absolute bottom-8 left-8">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 bg-background/40 backdrop-blur rounded-full border-2 border-border" />
          
          <button
            onTouchStart={() => handleTouchStart(0, -1)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchStart(0, -1)}
            onMouseUp={handleTouchEnd}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-secondary/80 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <Icon name="ChevronUp" size={24} className="text-foreground" />
          </button>

          <button
            onTouchStart={() => handleTouchStart(0, 1)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchStart(0, 1)}
            onMouseUp={handleTouchEnd}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-secondary/80 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <Icon name="ChevronDown" size={24} className="text-foreground" />
          </button>

          <button
            onTouchStart={() => handleTouchStart(-1, 0)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchStart(-1, 0)}
            onMouseUp={handleTouchEnd}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-secondary/80 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <Icon name="ChevronLeft" size={24} className="text-foreground" />
          </button>

          <button
            onTouchStart={() => handleTouchStart(1, 0)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchStart(1, 0)}
            onMouseUp={handleTouchEnd}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-secondary/80 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <Icon name="ChevronRight" size={24} className="text-foreground" />
          </button>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/60 rounded-full" />
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col gap-4">
        <Button
          onTouchStart={onJump}
          onMouseDown={onJump}
          size="lg"
          className="w-16 h-16 rounded-full bg-accent/80 backdrop-blur hover:bg-accent text-accent-foreground active:scale-95 transition-transform"
        >
          <Icon name="MoveUp" size={28} />
        </Button>

        <Button
          onTouchStart={onAction}
          onMouseDown={onAction}
          size="lg"
          className="w-16 h-16 rounded-full bg-primary/80 backdrop-blur hover:bg-primary text-primary-foreground active:scale-95 transition-transform"
        >
          <Icon name="Hand" size={28} />
        </Button>
      </div>
    </>
  );
};

export default MobileControls;
