import { NODE_SIZES, NODE_COLORS, EDGE_STYLES } from './firebase';

// Type definitions
export interface GraphNode {
  id: string;
  label: string;
  nodeType?: string;
  userImportance?: number;
  userNotes?: string;
  applicabilityConditions?: string;
  userSignificance?: string;
  associatedTagIds?: string[];
  x?: number;
  y?: number;
  size?: number;
  style?: any;
  labelCfg?: any;
}

export interface GraphEdge {
  id?: string;
  source: string;
  target: string;
  label?: string;
  relationshipType?: string;
  style?: any;
  labelCfg?: any;
}

export interface GraphDataType {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Node styling functions
export function getNodeStyle(node: GraphNode) {
  const nodeType = node.nodeType || '其他L3以上';
  const baseSize = NODE_SIZES[nodeType as keyof typeof NODE_SIZES] || NODE_SIZES.DEFAULT;
  const baseColor = NODE_COLORS[nodeType as keyof typeof NODE_COLORS] || NODE_COLORS['其他L3以上'];
  
  // Adjust size based on user importance
  const size = node.userImportance ? baseSize + (node.userImportance * 5) : baseSize;
  
  // Highlight color if user marked as important
  const color = node.userSignificance === '核心' ? NODE_COLORS.USER_IMPORTANCE_HIGHLIGHT : baseColor;
  
  return {
    size,
    style: {
      fill: color,
      stroke: color,
      lineWidth: 2,
      fillOpacity: 0.9,
    },
    labelCfg: {
      style: {
        fontSize: Math.max(12, size / 5),
        fill: '#000',
        background: {
          fill: '#ffffff',
          stroke: '#ffffff',
          padding: [2, 4, 2, 4],
          radius: 2,
        },
      },
      position: 'bottom',
      offset: 5,
    },
  };
}

// Edge styling functions
export function getEdgeStyle(edge: GraphEdge) {
  const relationshipType = edge.relationshipType || '一般关联';
  const style = EDGE_STYLES[relationshipType as keyof typeof EDGE_STYLES] || EDGE_STYLES.DEFAULT;
  
  return {
    style: {
      stroke: style.stroke,
      lineDash: style.lineDash,
      lineWidth: 2,
      endArrow: {
        path: 'M 0,0 L 8,4 L 8,-4 Z',
        fill: style.stroke,
      },
    },
    labelCfg: {
      autoRotate: true,
      style: {
        fill: '#666',
        fontSize: 11,
        background: {
          fill: '#ffffff',
          stroke: '#ffffff',
          padding: [2, 4, 2, 4],
          radius: 2,
        },
      },
    },
  };
}

// Transform API response to G6 data format
export function transformGraphData(apiResponse: any): GraphDataType {
  const nodes: GraphNode[] = apiResponse.nodes.map((node: any) => ({
    id: node.id,
    label: node.label,
    nodeType: node.nodeType,
    userImportance: node.userImportance || 0,
    userNotes: node.userNotes,
    applicabilityConditions: node.applicabilityConditions,
    userSignificance: node.userSignificance,
    associatedTagIds: node.associatedTagIds || [],
    ...getNodeStyle(node),
  }));
  
  const edges: GraphEdge[] = apiResponse.edges.map((edge: any) => ({
    id: edge.id || `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    label: edge.label || edge.relationshipType,
    relationshipType: edge.relationshipType,
    ...getEdgeStyle(edge),
  }));
  
  return { nodes, edges };
}

// Layout configurations
export const LAYOUT_CONFIGS = {
  force: {
    type: 'force',
    linkDistance: 150,
    nodeStrength: -30,
    edgeStrength: 0.1,
    collideStrength: 0.8,
    preventOverlap: true,
    nodeSize: 60,
  },
  radial: {
    type: 'radial',
    unitRadius: 120,
    linkDistance: 150,
    preventOverlap: true,
    nodeSize: 60,
    strictRadial: false,
  },
  circular: {
    type: 'circular',
    radius: 300,
    divisions: 5,
    ordering: 'degree',
  },
  dagre: {
    type: 'dagre',
    rankdir: 'TB',
    nodesep: 40,
    ranksep: 100,
    controlPoints: true,
  },
};

// Graph manipulation functions
export function addNode(graph: any, node: Partial<GraphNode>) {
  const newNode: GraphNode = {
    id: node.id || `node-${Date.now()}`,
    label: node.label || '新节点',
    x: node.x || Math.random() * 500,
    y: node.y || Math.random() * 500,
    ...getNodeStyle(node as GraphNode),
    ...node,
  };
  
  graph.addItem('node', newNode);
  return newNode;
}

export function addEdge(graph: any, edge: Partial<GraphEdge>) {
  const newEdge: GraphEdge = {
    source: edge.source!,
    target: edge.target!,
    label: edge.label,
    relationshipType: edge.relationshipType || '一般关联',
    ...getEdgeStyle(edge as GraphEdge),
    ...edge,
  };
  
  graph.addItem('edge', newEdge);
  return newEdge;
}

export function updateNode(graph: any, nodeId: string, updates: Partial<GraphNode>) {
  const node = graph.findById(nodeId);
  if (!node) return;
  
  const currentModel = node.getModel() as GraphNode;
  const updatedNode = {
    ...currentModel,
    ...updates,
  };
  
  // Update styling based on new properties
  const newStyle = getNodeStyle(updatedNode);
  graph.updateItem(node, {
    ...updatedNode,
    ...newStyle,
  });
}

export function deleteSelectedItems(graph: any) {
  const selectedNodes = graph.findAllByState('node', 'selected');
  const selectedEdges = graph.findAllByState('edge', 'selected');
  
  // Remove edges first
  selectedEdges.forEach((edge: any) => {
    graph.removeItem(edge);
  });
  
  // Then remove nodes
  selectedNodes.forEach((node: any) => {
    graph.removeItem(node);
  });
}

// Export graph data for saving
export function exportGraphData(graph: any): GraphDataType {
  const nodes = graph.getNodes().map((node: any) => {
    const model = node.getModel() as GraphNode;
    return {
      id: model.id,
      label: model.label,
      nodeType: model.nodeType,
      userImportance: model.userImportance,
      userNotes: model.userNotes,
      applicabilityConditions: model.applicabilityConditions,
      userSignificance: model.userSignificance,
      associatedTagIds: model.associatedTagIds,
      x: model.x,
      y: model.y,
    };
  });
  
  const edges = graph.getEdges().map((edge: any) => {
    const model = edge.getModel() as GraphEdge;
    return {
      source: model.source,
      target: model.target,
      label: model.label,
      relationshipType: model.relationshipType,
    };
  });
  
  return { nodes, edges };
}

// Zoom and fit functions
export function fitView(graph: any) {
  graph.fitView(20);
}

export function zoomTo(graph: any, ratio: number) {
  graph.zoomTo(ratio);
}

export function focusNode(graph: any, nodeId: string) {
  const node = graph.findById(nodeId);
  if (!node) return;
  
  graph.focusItem(node, true, {
    easing: 'easeCubic',
    duration: 500,
  });
} 