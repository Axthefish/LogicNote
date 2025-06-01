import { FUNCTION_URLS } from './firebase';
import { GraphDataType } from './graph-utils';

// Request Manager for cancellation
class RequestManager {
  private abortControllers: Map<string, AbortController> = new Map();

  createController(key: string): AbortController {
    // Cancel existing request if any
    this.cancel(key);
    
    const controller = new AbortController();
    this.abortControllers.set(key, controller);
    return controller;
  }

  cancel(key: string) {
    const controller = this.abortControllers.get(key);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(key);
    }
  }

  cancelAll() {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
  }
}

const requestManager = new RequestManager();

// Helper function for API calls with retry logic
async function fetchAPI(
  url: string, 
  options: RequestInit = {}, 
  config: { 
    retries?: number; 
    retryDelay?: number;
    requestKey?: string;
  } = {}
) {
  const { retries = 3, retryDelay = 1000, requestKey } = config;
  let lastError: Error | null = null;
  
  // Create abort controller if request key is provided
  const controller = requestKey ? requestManager.createController(requestKey) : undefined;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller?.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      // If aborted, don't retry
      if (error.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      
      lastError = error;
      
      // Don't retry on last attempt
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }
  
  console.error('API call failed after retries:', lastError);
  throw lastError;
}

// Export request manager for external use
export { requestManager };

// Text Analysis
export async function analyzeText(text: string, options: { useEnhanced?: boolean } = {}) {
  const { useEnhanced = false } = options;
  
  return fetchAPI(
    FUNCTION_URLS.ANALYZE_TEXT_URL,
    {
      method: 'POST',
      body: JSON.stringify({
        text,
        includeDetails: useEnhanced,
      }),
    },
    {
      requestKey: 'analyzeText', // Allow cancelling previous analysis
      retries: 2, // Fewer retries for long operations
    }
  );
}

// Text Management
export async function saveText(title: string, content: string) {
  return fetchAPI(FUNCTION_URLS.SAVE_TEXT_URL, {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
}

export async function listSavedTexts() {
  return fetchAPI(FUNCTION_URLS.LIST_SAVED_TEXTS_URL);
}

export async function deleteText(textId: string) {
  return fetchAPI(FUNCTION_URLS.DELETE_TEXT_URL, {
    method: 'DELETE',
    body: JSON.stringify({ textId }),
  });
}

// Graph Management
export async function updateGraph(graphId: string, graphData: GraphDataType) {
  return fetchAPI(FUNCTION_URLS.UPDATE_GRAPH_URL, {
    method: 'POST',
    body: JSON.stringify({
      graphId,
      nodes: graphData.nodes,
      edges: graphData.edges,
    }),
  });
}

export async function getGraph(graphId: string) {
  return fetchAPI(FUNCTION_URLS.GET_GRAPH_URL, {
    method: 'POST',
    body: JSON.stringify({ graphId }),
  });
}

export async function listAllGraphs() {
  return fetchAPI(FUNCTION_URLS.LIST_ALL_GRAPHS_URL);
}

// Node Management
export async function updateNodeLabel(graphId: string, nodeId: string, newLabel: string) {
  return fetchAPI(FUNCTION_URLS.UPDATE_NODE_LABEL_URL, {
    method: 'POST',
    body: JSON.stringify({ graphId, nodeId, newLabel }),
  });
}

export async function updateNodeDetails(
  graphId: string,
  nodeId: string,
  details: {
    userNotes?: string;
    applicabilityConditions?: string;
    userSignificance?: string;
    associatedTagIds?: string[];
  }
) {
  return fetchAPI(FUNCTION_URLS.UPDATE_NODE_DETAILS_URL, {
    method: 'POST',
    body: JSON.stringify({
      graphId,
      nodeId,
      ...details,
    }),
  });
}

// Knowledge System Management
export async function createKnowledgeSystem(name: string, description?: string) {
  return fetchAPI(FUNCTION_URLS.CREATE_KNOWLEDGE_SYSTEM_URL, {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
}

export async function listKnowledgeSystems() {
  return fetchAPI(FUNCTION_URLS.LIST_KNOWLEDGE_SYSTEMS_URL);
}

export async function assignGraphToSystem(graphId: string, systemId: string) {
  return fetchAPI(FUNCTION_URLS.ASSIGN_GRAPH_TO_SYSTEM_URL, {
    method: 'POST',
    body: JSON.stringify({ graphId, systemId }),
  });
}

export async function listGraphsBySystem(systemId: string) {
  return fetchAPI(FUNCTION_URLS.LIST_GRAPHS_BY_SYSTEM_URL, {
    method: 'POST',
    body: JSON.stringify({ systemId }),
  });
}

// Goal Management
export async function createGoal(title: string, description?: string) {
  return fetchAPI(FUNCTION_URLS.CREATE_GOAL_URL, {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  });
}

export async function listGoals() {
  return fetchAPI(FUNCTION_URLS.LIST_GOALS_URL);
}

export async function updateGoal(goalId: string, updates: { title?: string; description?: string; completed?: boolean }) {
  return fetchAPI(FUNCTION_URLS.UPDATE_GOAL_URL, {
    method: 'POST',
    body: JSON.stringify({ goalId, ...updates }),
  });
}

export async function deleteGoal(goalId: string) {
  return fetchAPI(FUNCTION_URLS.DELETE_GOAL_URL, {
    method: 'DELETE',
    body: JSON.stringify({ goalId }),
  });
}

// Knowledge Tag Management (Client-side for now)
interface KnowledgeTag {
  id: string;
  name: string;
  description?: string;
}

const KNOWLEDGE_TAGS_KEY = 'logicNote_knowledgeTags';

export function saveKnowledgeTags(tags: KnowledgeTag[]) {
  localStorage.setItem(KNOWLEDGE_TAGS_KEY, JSON.stringify(tags));
}

export function loadKnowledgeTags(): KnowledgeTag[] {
  try {
    const stored = localStorage.getItem(KNOWLEDGE_TAGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading knowledge tags:', error);
    return [];
  }
}

export function createKnowledgeTag(name: string, description?: string): KnowledgeTag {
  const tag: KnowledgeTag = {
    id: `tag_${Date.now()}`,
    name,
    description,
  };
  
  const tags = loadKnowledgeTags();
  tags.push(tag);
  saveKnowledgeTags(tags);
  
  return tag;
}

export function deleteKnowledgeTag(tagId: string) {
  const tags = loadKnowledgeTags();
  const filtered = tags.filter(tag => tag.id !== tagId);
  saveKnowledgeTags(filtered);
}

// Text Examples
export const TEXT_EXAMPLES = {
  quantum: `量子计算是利用量子力学原理进行信息处理的技术。与传统计算机使用比特（0或1）不同，量子计算机使用量子比特，可以同时处于多个状态的叠加。

量子计算的核心特性包括叠加态和纠缠态。叠加态允许量子比特同时表示0和1，而纠缠态使得多个量子比特之间产生强关联。这些特性使量子计算机在某些特定问题上具有指数级的计算优势。

量子计算的潜在应用领域包括密码破解、药物发现、材料科学、人工智能和金融建模。然而，构建稳定的量子计算机面临诸多挑战，如量子退相干、错误率高和需要极低温环境等。`,

  marketing: `市场营销是企业为了满足消费者需求并实现盈利目标而进行的一系列活动。它涵盖了从市场研究、产品开发到推广和销售的整个过程。

现代市场营销强调以客户为中心，通过深入了解目标受众的需求和偏好来制定策略。数字化转型使得精准营销成为可能，企业可以通过大数据分析来预测消费者行为。

营销组合包括产品、价格、渠道和促销四大要素。成功的营销策略需要这四个要素的有机结合，并根据市场变化灵活调整。`,

  psychology: `认知心理学研究人类如何获取、处理和存储信息。它探讨感知、注意、记忆、思维、语言和问题解决等心理过程。

工作记忆是认知系统的核心组成部分，负责暂时存储和操作信息。研究表明，工作记忆容量有限，通常只能同时处理7±2个信息单元。

认知偏差是人类思维中普遍存在的系统性错误。确认偏差使人倾向于寻找支持自己观点的信息，而忽视相反的证据。了解这些偏差有助于改善决策质量。`,
};

// Quick save functionality
const QUICK_SAVE_KEY = 'logicNote_quickSave';

export function quickSaveText(content: string) {
  const quickSave = {
    id: `quick_${Date.now()}`,
    title: `快速保存-${new Date().toLocaleDateString()}`,
    content,
    timestamp: new Date().toISOString(),
  };
  
  localStorage.setItem(QUICK_SAVE_KEY, JSON.stringify(quickSave));
  return quickSave;
}

export function loadQuickSave() {
  try {
    const stored = localStorage.getItem(QUICK_SAVE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading quick save:', error);
    return null;
  }
} 