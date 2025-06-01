/**
 * Client-side functions to interact with Claude API through our API route
 * This ensures the API key is never exposed to the client
 */

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
  system?: string;
}

/**
 * Send messages to Claude through our API route
 * @param messages - Array of messages in the conversation
 * @param options - Additional options for the API call
 * @returns Claude's response
 */
export async function sendMessageToClaudeAPI(
  messages: ClaudeMessage[],
  options: ClaudeOptions = {}
) {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, options }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

/**
 * Check if Claude API is configured on the server
 * @returns Configuration status
 */
export async function checkClaudeAPIStatus() {
  try {
    const response = await fetch('/api/claude');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking Claude API status:', error);
    return { configured: false, message: 'Failed to check API status' };
  }
}

/**
 * Analyze text using Claude for knowledge graph extraction
 * @param text - Text to analyze
 * @returns Structured knowledge graph data
 */
export async function analyzeTextForKnowledgeGraph(text: string) {
  const systemPrompt = `You are a knowledge graph extraction expert. Analyze the given text and extract:
1. Core concepts (核心概念) - The main topics or central ideas
2. Main aspects (主要方面) - Key components or dimensions of the core concepts  
3. Related details (相关细节) - Supporting information and specifics
4. Relationships between concepts - How different concepts connect

Return the result in JSON format with the following structure:
{
  "nodes": [
    {
      "id": "unique_id",
      "label": "concept name",
      "category": "核心概念|主要方面|相关细节",
      "importance": 1-5,
      "description": "brief description"
    }
  ],
  "edges": [
    {
      "source": "node_id",
      "target": "node_id", 
      "relationship": "relationship type",
      "description": "relationship description"
    }
  ]
}`;

  const response = await sendMessageToClaudeAPI(
    [{ role: 'user', content: `Please analyze this text and extract a knowledge graph:\n\n${text}` }],
    { 
      system: systemPrompt,
      temperature: 0.3, // Lower temperature for more consistent structured output
      max_tokens: 4000
    }
  );

  try {
    return JSON.parse(response.content);
  } catch (error) {
    console.error('Error parsing Claude response:', error);
    throw new Error('Failed to parse knowledge graph data');
  }
}

/**
 * Generate insights for a concept using Claude
 * @param concept - The concept to explain
 * @param context - Additional context
 * @returns Insights and explanation
 */
export async function generateConceptInsights(
  concept: string,
  context?: string
) {
  const prompt = context
    ? `请详细解释概念"${concept}"，在以下背景下：${context}。请提供深入的见解、应用场景和相关知识。`
    : `请详细解释概念"${concept}"。请提供深入的见解、应用场景、优缺点和相关知识。`;

  const response = await sendMessageToClaudeAPI(
    [{ role: 'user', content: prompt }],
    {
      max_tokens: 1500,
      temperature: 0.7,
      system: '你是一个知识解释专家，善于用清晰易懂的语言解释复杂概念。请用中文回答。'
    }
  );

  return response.content;
}

/**
 * Enhance text analysis with additional insights
 * @param text - Original text
 * @param currentAnalysis - Current analysis result
 * @returns Enhanced analysis
 */
export async function enhanceTextAnalysis(
  text: string,
  currentAnalysis: any
) {
  const prompt = `Based on the following text and its initial analysis, please provide:
1. Additional hidden relationships between concepts
2. Potential applications or implications
3. Questions for deeper exploration
4. Connections to broader knowledge domains

Original text: ${text}

Current analysis has found ${currentAnalysis.nodes?.length || 0} concepts and ${currentAnalysis.edges?.length || 0} relationships.

Please provide your insights in a structured format.`;

  const response = await sendMessageToClaudeAPI(
    [{ role: 'user', content: prompt }],
    {
      max_tokens: 2000,
      temperature: 0.8,
      system: 'You are an expert at finding deeper connections and insights in knowledge graphs. Respond in Chinese.'
    }
  );

  return response.content;
} 