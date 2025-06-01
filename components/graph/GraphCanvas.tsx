"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as G6 from '@antv/g6';
import { toast } from 'sonner';
import { GraphControls } from './GraphControls';
import {
  LAYOUT_CONFIGS,
  addNode,
  addEdge,
  updateNode,
  deleteSelectedItems,
  exportGraphData,
  fitView,
  zoomTo,
  focusNode,
  type GraphNode,
  type GraphEdge,
  type GraphDataType,
} from '@/lib/graph-utils';

interface GraphCanvasProps {
  data?: GraphDataType;
  onNodeClick?: (node: GraphNode) => void;
  onEdgeClick?: (edge: GraphEdge) => void;
  onGraphUpdate?: (data: GraphDataType) => void;
  height?: number;
}

export function GraphCanvas({
  data,
  onNodeClick,
  onEdgeClick,
  onGraphUpdate,
  height = 500,
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [currentLayout, setCurrentLayout] = useState<keyof typeof LAYOUT_CONFIGS>('force');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Initialize graph
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.scrollWidth;
    const actualHeight = height;

    const graph = new G6.Graph({
      container: containerRef.current,
      width,
      height: actualHeight,
      layout: LAYOUT_CONFIGS[currentLayout],
      defaultNode: {
        type: 'circle',
        size: 40,
        style: {
          fill: '#5B8FF9',
          stroke: '#5B8FF9',
          lineWidth: 2,
        },
        labelCfg: {
          style: {
            fill: '#000',
            fontSize: 12,
          },
        },
      },
      defaultEdge: {
        type: 'line',
        style: {
          stroke: '#e2e2e2',
          lineWidth: 2,
        },
      },
      nodeStateStyles: {
        selected: {
          stroke: '#f00',
          lineWidth: 3,
        },
        hover: {
          fillOpacity: 0.8,
        },
      },
      edgeStateStyles: {
        selected: {
          stroke: '#f00',
          lineWidth: 3,
        },
        hover: {
          stroke: '#1890ff',
        },
      },
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          'click-select',
          'drag-node',
          {
            type: 'tooltip',
            formatText(model: any) {
              const text = model.label || model.id;
              return text;
            },
          },
          {
            type: 'edge-tooltip',
            formatText(model: any) {
              const text = model.label || '关系';
              return text;
            },
          },
        ],
      },
    } as any);

    // Event handlers
    graph.on('node:click', (evt: any) => {
      const node = evt.item;
      const model = node.getModel() as GraphNode;
      setSelectedNode(model.id);
      onNodeClick?.(model);
    });

    graph.on('edge:click', (evt: any) => {
      const edge = evt.item;
      const model = edge.getModel() as GraphEdge;
      onEdgeClick?.(model);
    });

    graph.on('canvas:click', () => {
      setSelectedNode(null);
    });

    // Handle graph changes
    graph.on('afteradditem', () => {
      if (onGraphUpdate) {
        onGraphUpdate(exportGraphData(graph));
      }
    });

    graph.on('afterremoveitem', () => {
      if (onGraphUpdate) {
        onGraphUpdate(exportGraphData(graph));
      }
    });

    graph.on('afterupdateitem', () => {
      if (onGraphUpdate) {
        onGraphUpdate(exportGraphData(graph));
      }
    });

    graphRef.current = graph;

    // Load initial data
    if (data) {
      (graph as any).read(data);
    }

    // Handle window resize
    const handleResize = () => {
      const width = containerRef.current?.scrollWidth || 500;
      (graph as any).changeSize(width, actualHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      graph.destroy();
    };
  }, [currentLayout, height]);

  // Update data when props change
  useEffect(() => {
    if (graphRef.current && data) {
      (graphRef.current as any).read(data);
    }
  }, [data]);

  // Control functions
  const handleZoomIn = useCallback(() => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.getZoom();
      zoomTo(graphRef.current, currentZoom * 1.2);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.getZoom();
      zoomTo(graphRef.current, currentZoom * 0.8);
    }
  }, []);

  const handleFitView = useCallback(() => {
    if (graphRef.current) {
      fitView(graphRef.current);
    }
  }, []);

  const handleLayoutChange = useCallback((layout: keyof typeof LAYOUT_CONFIGS) => {
    if (graphRef.current) {
      setCurrentLayout(layout);
      graphRef.current.updateLayout(LAYOUT_CONFIGS[layout]);
    }
  }, []);

  const handleAddNode = useCallback(() => {
    if (graphRef.current) {
      const newNode = addNode(graphRef.current, {
        label: '新节点',
      });
      toast.success(`节点 "${newNode.label}" 已成功添加到图表中。`);
    }
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (graphRef.current) {
      deleteSelectedItems(graphRef.current);
      toast.success("选中的项目已被删除。");
    }
  }, []);

  return (
    <div className="relative">
      <GraphControls
        currentLayout={currentLayout}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        onLayoutChange={handleLayoutChange}
      />

      <div
        ref={containerRef}
        className="w-full bg-muted rounded-md border"
        style={{ height: `${height}px` }}
      />
    </div>
  );
} 