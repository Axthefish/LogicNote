import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  // Note: In production, API key should only be used on server-side
  // Consider using API routes or server components for security
});

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Send a message to Claude AI
 * @param messages - Array of messages in the conversation
 * @param options - Additional options for the API call
 * @returns Claude's response
 */
export async function sendMessageToClaude(
  messages: ClaudeMessage[],
  options: {
    model?: string;
    max_tokens?: number;
    temperature?: number;
    system?: string;
  } = {}
): Promise<ClaudeResponse> {
  try {
    const response = await anthropic.messages.create({
      model: options.model || 'claude-3-opus-20240229',
      max_tokens: options.max_tokens || 4096,
      temperature: options.temperature || 0.7,
      system: options.system,
      messages: messages,
    });

    return {
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      usage: response.usage,
    };
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error('Failed to get response from Claude');
  }
}

/**
 * Analyze text and extract knowledge graph using Claude
 * @param text - Text to analyze
 * @returns Structured knowledge graph data
 */
export async function analyzeTextWithClaude(text: string): Promise<any> {
  const systemPrompt = `You are a knowledge graph extraction expert. Analyze the given text and extract:
1. Core concepts (核心概念)
2. Main aspects (主要方面)
3. Related details (相关细节)
4. Relationships between concepts

Return the result in JSON format with nodes and edges arrays.`;

  const response = await sendMessageToClaude(
    [{ role: 'user', content: `Please analyze this text and extract a knowledge graph:\n\n${text}` }],
    { system: systemPrompt }
  );

  try {
    return JSON.parse(response.content);
  } catch (error) {
    console.error('Error parsing Claude response:', error);
    throw new Error('Failed to parse knowledge graph data');
  }
}

/**
 * Generate insights or explanations for a concept
 * @param concept - The concept to explain
 * @param context - Additional context
 * @returns Explanation or insights
 */
export async function generateConceptInsights(
  concept: string,
  context?: string
): Promise<string> {
  const prompt = context
    ? `Explain the concept "${concept}" in the context of: ${context}`
    : `Provide insights and explanation for the concept: ${concept}`;

  const response = await sendMessageToClaude([
    { role: 'user', content: prompt }
  ], {
    max_tokens: 1000,
    temperature: 0.7,
  });

  return response.content;
}

/**
 * Check if Claude API is properly configured
 * @returns Boolean indicating if API is ready
 */
export function isClaudeAPIConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
} 