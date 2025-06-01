import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  createKnowledgeSystem,
  listKnowledgeSystems,
  assignGraphToSystem,
  listGraphsBySystem,
  loadKnowledgeTags,
  createKnowledgeTag,
  saveKnowledgeTags,
} from '@/lib/api';

interface KnowledgeSystem {
  id: string;
  name: string;
}

interface KnowledgeTag {
  id: string;
  name: string;
  description?: string;
}

export function useKnowledgeManagement() {
  const [knowledgeSystems, setKnowledgeSystems] = useState<KnowledgeSystem[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string | undefined>();
  const [systemGraphs, setSystemGraphs] = useState<any[]>([]);
  const [knowledgeTags, setKnowledgeTags] = useState<KnowledgeTag[]>([]);

  const loadKnowledgeSystemsData = useCallback(async () => {
    try {
      const systems = await listKnowledgeSystems();
      setKnowledgeSystems(systems);
    } catch (error) {
      console.error('Error loading knowledge systems:', error);
    }
  }, []);

  const loadKnowledgeTagsData = useCallback(() => {
    const tags = loadKnowledgeTags();
    setKnowledgeTags(tags);
  }, []);

  const loadSystemGraphs = useCallback(async (systemId: string) => {
    try {
      const graphs = await listGraphsBySystem(systemId);
      setSystemGraphs(graphs);
    } catch (error) {
      console.error('Error loading system graphs:', error);
    }
  }, []);

  useEffect(() => {
    loadKnowledgeSystemsData();
    loadKnowledgeTagsData();
  }, [loadKnowledgeSystemsData, loadKnowledgeTagsData]);

  useEffect(() => {
    if (selectedSystem && selectedSystem !== 'none') {
      loadSystemGraphs(selectedSystem);
    } else {
      setSystemGraphs([]);
    }
  }, [selectedSystem, loadSystemGraphs]);

  const createSystem = useCallback(async (name: string) => {
    if (name.trim() === '') {
      toast.error('请输入系统名称');
      return null;
    }

    try {
      const newSystem = await createKnowledgeSystem(name.trim());
      setKnowledgeSystems(prev => [...prev, newSystem]);
      toast.success('知识体系创建成功！');
      return newSystem;
    } catch (error) {
      toast.error('创建失败');
      console.error(error);
      return null;
    }
  }, []);

  const createTag = useCallback((name: string, description?: string) => {
    if (name.trim() === '') {
      toast.error('请输入标签名称');
      return null;
    }

    const newTag = createKnowledgeTag(name.trim(), description?.trim());
    setKnowledgeTags(prev => [...prev, newTag]);
    toast.success('标签创建成功！');
    return newTag;
  }, []);

  const assignToSystem = useCallback(async (graphId: string, systemId: string) => {
    if (!systemId || systemId === 'none') {
      toast.error('请选择一个知识体系');
      return false;
    }

    try {
      await assignGraphToSystem(graphId, systemId);
      toast.success('已分配到知识体系');
      if (selectedSystem === systemId) {
        loadSystemGraphs(systemId);
      }
      return true;
    } catch (error) {
      toast.error('分配失败');
      console.error(error);
      return false;
    }
  }, [selectedSystem, loadSystemGraphs]);

  return {
    // Knowledge Systems
    knowledgeSystems,
    selectedSystem,
    setSelectedSystem,
    systemGraphs,
    createSystem,
    assignToSystem,
    
    // Knowledge Tags
    knowledgeTags,
    createTag,
    
    // Refresh functions
    loadKnowledgeSystemsData,
    loadKnowledgeTagsData,
  };
} 