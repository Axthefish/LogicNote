// App Constants and Configuration

// UI Constants
export const UI_CONFIG = {
  SIDEBAR: {
    MIN_SIZE: 15,
    MAX_SIZE: 30,
    DEFAULT_SIZE: 22,
    COLLAPSED_SIZE: 4,
  },
  GRAPH: {
    DEFAULT_HEIGHT: 500,
    MIN_HEIGHT: 300,
    MAX_HEIGHT: 800,
  },
  TEXT: {
    PREVIEW_LENGTH: 50,
    MIN_LENGTH: 10,
    MAX_LENGTH: 10000,
  },
  ANIMATION: {
    DURATION: 300,
    EASING: 'ease-in-out',
  },
} as const;

// Default Values
export const DEFAULTS = {
  GRAPH_NAME: '新知识图谱',
  RESULT_STATS: '准备就绪',
  USER_SIGNIFICANCE: '重要',
  NODE_LABEL: '新节点',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  QUICK_SAVE: 'logicNote_quickSave',
  KNOWLEDGE_TAGS: 'logicNote_knowledgeTags',
  USER_PREFERENCES: 'logicNote_preferences',
  SIDEBAR_STATE: 'logicNote_sidebarState',
} as const;

// API Configuration
export const API_CONFIG = {
  DEFAULT_RETRIES: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 30000,
  ANALYZE_TIMEOUT: 60000,
} as const;

// Graph Layout Names (for display)
export const LAYOUT_NAMES = {
  force: '力导向布局',
  circular: '环形布局',
  radial: '辐射布局',
  dagre: '层级布局',
} as const;

// Legend Configuration
export const LEGEND_CONFIG = [
  { color: 'bg-blue-500', label: '核心概念' },
  { color: 'bg-green-500', label: '主要方面' },
  { color: 'bg-orange-500', label: '相关细节' },
  { color: 'bg-gray-500', label: '其他' },
] as const;

// Date Format Options
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

// Error Messages
export const ERROR_MESSAGES = {
  EMPTY_TEXT: '请输入要分析的文本',
  EMPTY_SAVE: '请输入要保存的文本',
  ANALYSIS_FAILED: '生成图谱失败，请稍后重试',
  LOAD_FAILED: '加载失败',
  SAVE_FAILED: '保存失败',
  CREATE_FAILED: '创建失败',
  NETWORK_ERROR: '网络连接错误，请检查网络设置',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  GRAPH_GENERATED: '知识图谱生成成功！',
  TEXT_SAVED: '文本已保存！',
  QUICK_SAVED: '快速保存成功！',
  SYSTEM_CREATED: '知识体系创建成功！',
  TAG_CREATED: '标签创建成功！',
  NODE_SAVED: '节点详情已保存',
  ASSIGNED_TO_SYSTEM: '已分配到知识体系',
  EXAMPLE_LOADED: '示例已加载，点击生成知识图谱查看效果',
} as const;

// Info Messages
export const INFO_MESSAGES = {
  ADD_NODE: '请在图表中点击空白处添加新节点',
  ADD_EDGE: '请先选择源节点，然后选择目标节点来创建关系',
  DELETE_SELECTED: '请在图表中选择要删除的节点或边',
} as const; 