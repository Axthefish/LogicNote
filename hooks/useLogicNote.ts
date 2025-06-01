import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  analyzeText,
  saveText,
  listSavedTexts,
  listAllGraphs,
  getGraph,
  updateGraph,
  quickSaveText,
  loadQuickSave,
} from '@/lib/api';
import { transformGraphData, type GraphDataType } from '@/lib/graph-utils';

interface SavedItem {
  id: string;
  type: 'text' | 'graph-source';
  title: string;
  date: string;
  preview?: string;
  content?: string;
  icon: any;
}

export function useLogicNote() {
  const [isLoading, setIsLoading] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [currentGraphId, setCurrentGraphId] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphDataType | null>(null);
  const [savedTexts, setSavedTexts] = useState<SavedItem[]>([]);
  const [graphOriginalTexts, setGraphOriginalTexts] = useState<SavedItem[]>([]);
  const [resultStats, setResultStats] = useState('准备就绪');
  const [graphName, setGraphName] = useState('新知识图谱');

  const loadSavedData = useCallback(async () => {
    try {
      // Load saved texts
      const texts = await listSavedTexts();
      const savedTextItems: SavedItem[] = texts.map((text: any) => ({
        id: text.id,
        type: 'text' as const,
        title: text.title,
        date: new Date(text.createdAt).toLocaleDateString(),
        preview: text.content.substring(0, 50) + '...',
        content: text.content,
        icon: null,
      }));

      // Load quick save
      const quickSave = loadQuickSave();
      if (quickSave) {
        savedTextItems.unshift({
          id: quickSave.id,
          type: 'text',
          title: quickSave.title,
          date: new Date(quickSave.timestamp).toLocaleDateString(),
          preview: quickSave.content.substring(0, 50) + '...',
          content: quickSave.content,
          icon: null,
        });
      }

      setSavedTexts(savedTextItems);

      // Load graphs
      const graphs = await listAllGraphs();
      const graphItems: SavedItem[] = graphs.map((graph: any) => ({
        id: graph.id,
        type: 'graph-source' as const,
        title: graph.name || `图谱 - ${graph.id}`,
        date: new Date(graph.createdAt).toLocaleDateString(),
        preview: graph.sourceText?.substring(0, 50) + '...',
        icon: null,
      }));
      setGraphOriginalTexts(graphItems);
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  useEffect(() => {
    loadSavedData();
  }, [loadSavedData]);

  const loadGraph = useCallback(async (graphId: string) => {
    try {
      setIsLoading(true);
      const graphResponse = await getGraph(graphId);
      const transformed = transformGraphData(graphResponse);
      setGraphData(transformed);
      setCurrentGraphId(graphId);
      setGraphName(graphResponse.name || `图谱 - ${graphId}`);
      setResultStats(`已加载图谱: ${transformed.nodes.length}个概念, ${transformed.edges.length}个关系`);
    } catch (error) {
      toast.error('加载图谱失败');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateGraph = useCallback(async () => {
    if (!textContent.trim()) {
      toast.error('请输入要分析的文本');
      return false;
    }

    setIsLoading(true);
    setResultStats('分析中，请稍候...');
    
    try {
      const result = await analyzeText(textContent);
      const transformed = transformGraphData(result);
      setGraphData(transformed);
      setCurrentGraphId(result.graphId);
      setGraphName(result.name || '新知识图谱');
      setResultStats(`分析完成: ${transformed.nodes.length}个概念, ${transformed.edges.length}个关系`);
      toast.success('知识图谱生成成功！');
      return true;
    } catch (error) {
      toast.error('生成图谱失败，请稍后重试');
      console.error(error);
      setResultStats('分析失败');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [textContent]);

  const saveCurrentText = useCallback(async () => {
    if (!textContent.trim()) {
      toast.error('请输入要保存的文本');
      return;
    }

    try {
      await saveText(`文本-${new Date().toLocaleDateString()}`, textContent);
      toast.success('文本已保存！');
      loadSavedData();
    } catch (error) {
      toast.error('保存失败');
      console.error(error);
    }
  }, [textContent, loadSavedData]);

  const quickSave = useCallback(() => {
    if (!textContent.trim()) {
      toast.error('请输入要保存的文本');
      return;
    }

    quickSaveText(textContent);
    toast.success('快速保存成功！');
    loadSavedData();
  }, [textContent, loadSavedData]);

  const updateGraphData = useCallback(async (newGraphData: GraphDataType) => {
    if (!currentGraphId) return;
    
    setGraphData(newGraphData);
    
    try {
      await updateGraph(currentGraphId, newGraphData);
    } catch (error) {
      console.error('Error updating graph:', error);
    }
  }, [currentGraphId]);

  return {
    // State
    isLoading,
    textContent,
    setTextContent,
    currentGraphId,
    graphData,
    savedTexts,
    graphOriginalTexts,
    resultStats,
    graphName,
    setGraphName,
    
    // Actions
    loadGraph,
    generateGraph,
    saveCurrentText,
    quickSave,
    updateGraphData,
    loadSavedData,
  };
} 