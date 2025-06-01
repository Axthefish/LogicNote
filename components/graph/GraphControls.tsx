import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RefreshCcw,
  GitBranch,
  Circle,
  Wind,
} from 'lucide-react';
import { LAYOUT_CONFIGS } from '@/lib/graph-utils';

interface GraphControlsProps {
  currentLayout: keyof typeof LAYOUT_CONFIGS;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onLayoutChange: (layout: keyof typeof LAYOUT_CONFIGS) => void;
}

export const GraphControls = memo(function GraphControls({
  currentLayout,
  onZoomIn,
  onZoomOut,
  onFitView,
  onLayoutChange,
}: GraphControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-2 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          title="放大"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          title="缩小"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onFitView}
          title="适应视图"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Layout Controls */}
      <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-2 flex flex-col gap-1">
        <Button
          variant={currentLayout === 'force' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onLayoutChange('force')}
          title="力导向布局"
        >
          <Wind className="h-4 w-4" />
        </Button>
        <Button
          variant={currentLayout === 'circular' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onLayoutChange('circular')}
          title="环形布局"
        >
          <Circle className="h-4 w-4" />
        </Button>
        <Button
          variant={currentLayout === 'radial' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onLayoutChange('radial')}
          title="辐射布局"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button
          variant={currentLayout === 'dagre' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onLayoutChange('dagre')}
          title="层级布局"
        >
          <GitBranch className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}); 