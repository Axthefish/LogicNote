"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  FileText,
  PlusCircle,
  BrainCircuit,
  Sparkles,
  Lightbulb,
  Save,
  Settings2,
  Link2Icon,
  Palette,
  Brain,
  Archive,
  Tag,
  Trash2,
  FolderArchive,
  Sigma,
  Loader2,
  Info,
  ListTree,
  UserCircle,
  CreditCard,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NodeEditDialog, type NodeData } from "./node-edit-dialog"
import { GraphCanvas } from "@/components/graph/GraphCanvas"
import { toast } from "sonner"
import {
  analyzeText,
  saveText,
  listSavedTexts,
  deleteText,
  updateGraph,
  getGraph,
  listAllGraphs,
  updateNodeDetails,
  createKnowledgeSystem,
  listKnowledgeSystems,
  assignGraphToSystem,
  listGraphsBySystem,
  saveKnowledgeTags,
  loadKnowledgeTags,
  createKnowledgeTag,
  deleteKnowledgeTag,
  quickSaveText,
  loadQuickSave,
  TEXT_EXAMPLES,
} from "@/lib/api"
import { transformGraphData, type GraphDataType, type GraphNode } from "@/lib/graph-utils"

type View = "textInput" | "graphView"

interface SavedItem {
  id: string
  type: "text" | "graph-source"
  title: string
  date: string
  preview?: string
  content?: string
  icon: React.ElementType
}

interface KnowledgeSystem {
  id: string
  name: string
}

interface KnowledgeTag {
  id: string
  name: string
  description?: string
}

export default function LogicNotePage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState<View>("textInput")
  const [graphName, setGraphName] = useState("新知识图谱")
  const [resultStats, setResultStats] = useState("准备就绪")
  const [isLoading, setIsLoading] = useState(false)
  const [textContent, setTextContent] = useState("")
  const [currentGraphId, setCurrentGraphId] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<GraphDataType | null>(null)

  const [isNodeEditDialogOpen, setIsNodeEditDialogOpen] = useState(false)
  const [currentNodeData, setCurrentNodeData] = useState<NodeData | null>(null)

  const [savedTexts, setSavedTexts] = useState<SavedItem[]>([])
  const [graphOriginalTexts, setGraphOriginalTexts] = useState<SavedItem[]>([])
  
  const [knowledgeSystems, setKnowledgeSystems] = useState<KnowledgeSystem[]>([])
  const [selectedSystem, setSelectedSystem] = useState<string | undefined>()
  const [newSystemName, setNewSystemName] = useState("")
  const [systemGraphs, setSystemGraphs] = useState<any[]>([])

  const [knowledgeTags, setKnowledgeTags] = useState<KnowledgeTag[]>([])
  const [newTagName, setNewTagName] = useState("")
  const [newTagDescription, setNewTagDescription] = useState("")

  // Load initial data
  useEffect(() => {
    loadSavedData()
    loadKnowledgeSystemsData()
    loadKnowledgeTagsData()
  }, [])

  const loadSavedData = async () => {
    try {
      // Load saved texts
      const texts = await listSavedTexts()
      const savedTextItems: SavedItem[] = texts.map((text: any) => ({
        id: text.id,
        type: "text" as const,
        title: text.title,
        date: new Date(text.createdAt).toLocaleDateString(),
        preview: text.content.substring(0, 50) + "...",
        content: text.content,
        icon: FileText,
      }))

      // Load quick save
      const quickSave = loadQuickSave()
      if (quickSave) {
        savedTextItems.unshift({
          id: quickSave.id,
          type: "text",
          title: quickSave.title,
          date: new Date(quickSave.timestamp).toLocaleDateString(),
          preview: quickSave.content.substring(0, 50) + "...",
          content: quickSave.content,
          icon: FileText,
        })
      }

      setSavedTexts(savedTextItems)

      // Load graphs
      const graphs = await listAllGraphs()
      const graphItems: SavedItem[] = graphs.map((graph: any) => ({
        id: graph.id,
        type: "graph-source" as const,
        title: graph.name || `图谱 - ${graph.id}`,
        date: new Date(graph.createdAt).toLocaleDateString(),
        preview: graph.sourceText?.substring(0, 50) + "...",
        icon: Brain,
      }))
      setGraphOriginalTexts(graphItems)
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }

  const loadKnowledgeSystemsData = async () => {
    try {
      const systems = await listKnowledgeSystems()
      setKnowledgeSystems(systems)
    } catch (error) {
      console.error("Error loading knowledge systems:", error)
    }
  }

  const loadKnowledgeTagsData = () => {
    const tags = loadKnowledgeTags()
    setKnowledgeTags(tags)
  }

  const loadSystemGraphs = async (systemId: string) => {
    try {
      const graphs = await listGraphsBySystem(systemId)
      setSystemGraphs(graphs)
    } catch (error) {
      console.error("Error loading system graphs:", error)
    }
  }

  useEffect(() => {
    if (selectedSystem && selectedSystem !== "none") {
      loadSystemGraphs(selectedSystem)
    } else {
      setSystemGraphs([])
    }
  }, [selectedSystem])

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)
  
  const switchToGraphView = (graphId?: string) => {
    setCurrentView("graphView")
    if (graphId) {
      loadGraph(graphId)
    }
  }
  
  const switchToTextInputView = () => {
    setCurrentView("textInput")
    setResultStats("准备就绪")
  }

  const loadGraph = async (graphId: string) => {
    try {
      setIsLoading(true)
      const graphResponse = await getGraph(graphId)
      const transformed = transformGraphData(graphResponse)
      setGraphData(transformed)
      setCurrentGraphId(graphId)
      setGraphName(graphResponse.name || `图谱 - ${graphId}`)
      setResultStats(`已加载图谱: ${transformed.nodes.length}个概念, ${transformed.edges.length}个关系`)
    } catch (error) {
      toast.error("加载图谱失败")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateGraph = async () => {
    if (!textContent.trim()) {
      toast.error("请输入要分析的文本")
      return
    }

    setIsLoading(true)
    setResultStats("分析中，请稍候...")
    
    try {
      const result = await analyzeText(textContent)
      const transformed = transformGraphData(result)
      setGraphData(transformed)
      setCurrentGraphId(result.graphId)
      setGraphName(result.name || "新知识图谱")
      switchToGraphView()
      setResultStats(`分析完成: ${transformed.nodes.length}个概念, ${transformed.edges.length}个关系`)
      toast.success("知识图谱生成成功！")
    } catch (error) {
      toast.error("生成图谱失败，请稍后重试")
      console.error(error)
      setResultStats("分析失败")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveText = async () => {
    if (!textContent.trim()) {
      toast.error("请输入要保存的文本")
      return
    }

    try {
      await saveText(`文本-${new Date().toLocaleDateString()}`, textContent)
      toast.success("文本已保存！")
      loadSavedData()
    } catch (error) {
      toast.error("保存失败")
      console.error(error)
    }
  }

  const handleQuickSave = () => {
    if (!textContent.trim()) {
      toast.error("请输入要保存的文本")
      return
    }

    quickSaveText(textContent)
    toast.success("快速保存成功！")
    loadSavedData()
  }

  const handleCreateSystem = async () => {
    if (newSystemName.trim() === "") return
    
    try {
      const newSystem = await createKnowledgeSystem(newSystemName.trim())
      setKnowledgeSystems([...knowledgeSystems, newSystem])
      setNewSystemName("")
      toast.success("知识体系创建成功！")
    } catch (error) {
      toast.error("创建失败")
      console.error(error)
    }
  }

  const handleCreateTag = () => {
    if (newTagName.trim() === "") return
    
    const newTag = createKnowledgeTag(newTagName.trim(), newTagDescription.trim())
    setKnowledgeTags([...knowledgeTags, newTag])
    setNewTagName("")
    setNewTagDescription("")
    toast.success("标签创建成功！")
  }

  const handleNodeClick = (node: GraphNode) => {
    setCurrentNodeData({
      id: node.id,
      userNotes: node.userNotes || "",
      applicabilityConditions: node.applicabilityConditions || "",
      userSignificance: node.userSignificance || "重要",
      associatedTagIds: node.associatedTagIds || [],
    })
    setIsNodeEditDialogOpen(true)
  }

  const handleSaveNodeDetails = async (updatedData: NodeData) => {
    if (!currentGraphId) return

    try {
      await updateNodeDetails(currentGraphId, updatedData.id, {
        userNotes: updatedData.userNotes,
        applicabilityConditions: updatedData.applicabilityConditions,
        userSignificance: updatedData.userSignificance,
        associatedTagIds: updatedData.associatedTagIds,
      })
      
      // Update local graph data
      if (graphData) {
        const updatedNodes = graphData.nodes.map(node => 
          node.id === updatedData.id 
            ? { ...node, ...updatedData }
            : node
        )
        setGraphData({ ...graphData, nodes: updatedNodes })
      }
      
      toast.success("节点详情已保存")
    } catch (error) {
      toast.error("保存失败")
      console.error(error)
    }
    
    setIsNodeEditDialogOpen(false)
  }

  const handleGraphUpdate = async (newGraphData: GraphDataType) => {
    if (!currentGraphId) return
    
    setGraphData(newGraphData)
    
    try {
      await updateGraph(currentGraphId, newGraphData)
    } catch (error) {
      console.error("Error updating graph:", error)
    }
  }

  const handleAssignToSystem = async () => {
    if (!currentGraphId || !selectedSystem || selectedSystem === "none") {
      toast.error("请选择一个知识体系")
      return
    }

    try {
      await assignGraphToSystem(currentGraphId, selectedSystem)
      toast.success("已分配到知识体系")
      loadSystemGraphs(selectedSystem)
    } catch (error) {
      toast.error("分配失败")
      console.error(error)
    }
  }

  const handleAddNewNode = () => {
    toast.info("请在图表中点击空白处添加新节点")
  }

  const handleAddNewEdge = () => {
    toast.info("请先选择源节点，然后选择目标节点来创建关系")
  }

  const handleDeleteSelected = () => {
    toast.info("请在图表中选择要删除的节点或边")
  }

  const loadExample = (exampleKey: keyof typeof TEXT_EXAMPLES) => {
    setTextContent(TEXT_EXAMPLES[exampleKey])
    toast.success("示例已加载，点击生成知识图谱查看效果")
  }

  const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center space-x-2">
      <span className={`h-3 w-3 rounded-sm ${color}`} />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-muted/40">
        <ResizablePanelGroup direction="horizontal" className="h-full max-h-screen">
          <ResizablePanel
            collapsible
            collapsedSize={4}
            minSize={15}
            maxSize={30}
            defaultSize={22}
            onCollapse={() => setIsSidebarCollapsed(true)}
            onExpand={() => setIsSidebarCollapsed(false)}
            className={`transition-all duration-300 ease-in-out bg-background ${
              isSidebarCollapsed ? "min-w-[50px]" : "min-w-[320px]"
            }`}
          >
            <div className="flex flex-col h-full">
              <div
                className={`flex items-center h-16 px-4 border-b ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}
              >
                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-7 w-7 text-primary" />
                    <h1 className="text-xl font-bold text-primary">LogicNote</h1>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className={isSidebarCollapsed ? "block" : "hidden md:block"}
                >
                  {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
              </div>

              <ScrollArea className="flex-grow">
                <Accordion type="multiple" defaultValue={["textLibrary"]} className="w-full px-2 py-4">
                  {/* Text Library Section */}
                  <AccordionItem value="textLibrary">
                    <AccordionTrigger className={`py-3 ${isSidebarCollapsed ? "justify-center" : ""}`}>
                      <div className="flex items-center">
                        <Archive className={`h-5 w-5 ${!isSidebarCollapsed ? "mr-3" : ""}`} />
                        {!isSidebarCollapsed && "文本库"}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2 space-y-3">
                      {!isSidebarCollapsed && (
                        <>
                          <div>
                            <h4 className="mb-1 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                              💾 快速保存
                            </h4>
                            {savedTexts.map((item) => (
                              <Button
                                key={item.id}
                                variant="ghost"
                                className="w-full h-auto py-2 justify-start text-left"
                                onClick={() => {
                                  setTextContent(item.content || '')
                                  switchToTextInputView()
                                }}
                              >
                                <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                                <div className="flex flex-col overflow-hidden">
                                  <span className="text-sm font-medium truncate">{item.title}</span>
                                  <span className="text-xs text-muted-foreground truncate">
                                    {item.preview || item.date}
                                  </span>
                                </div>
                              </Button>
                            ))}
                            {savedTexts.length === 0 && (
                              <p className="px-2 text-xs text-muted-foreground">暂无快速保存</p>
                            )}
                          </div>
                          <Separator />
                          <div>
                            <h4 className="mb-1 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                              🧠 图谱原文
                            </h4>
                            {graphOriginalTexts.map((item) => (
                              <Button
                                key={item.id}
                                variant="ghost"
                                className="w-full h-auto py-2 justify-start text-left"
                                onClick={() => switchToGraphView(item.id)}
                              >
                                <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                                <div className="flex flex-col overflow-hidden">
                                  <span className="text-sm font-medium truncate">{item.title}</span>
                                  <span className="text-xs text-muted-foreground truncate">
                                    {item.preview || item.date}
                                  </span>
                                </div>
                              </Button>
                            ))}
                            {graphOriginalTexts.length === 0 && (
                              <p className="px-2 text-xs text-muted-foreground">暂无图谱原文</p>
                            )}
                          </div>
                        </>
                      )}
                      {isSidebarCollapsed && (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div className="flex justify-center py-2">
                              <Archive className="h-5 w-5" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right">文本库</TooltipContent>
                        </Tooltip>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Knowledge System Management Section */}
                  <AccordionItem value="knowledgeSystems">
                    <AccordionTrigger className={`py-3 ${isSidebarCollapsed ? "justify-center" : ""}`}>
                      <div className="flex items-center">
                        <ListTree className={`h-5 w-5 ${!isSidebarCollapsed ? "mr-3" : ""}`} />
                        {!isSidebarCollapsed && "知识体系管理"}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2 space-y-3 px-2">
                      {!isSidebarCollapsed && (
                        <>
                          <Input
                            placeholder="新知识体系名称..."
                            value={newSystemName}
                            onChange={(e) => setNewSystemName(e.target.value)}
                          />
                          <Button onClick={handleCreateSystem} className="w-full">
                            <PlusCircle className="w-4 h-4 mr-2" /> 创建体系
                          </Button>
                          <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择知识体系" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-- 无 --</SelectItem>
                              {knowledgeSystems.map((system) => (
                                <SelectItem key={system.id} value={system.id}>
                                  {system.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <h5 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mt-2">
                            体系中的图表
                          </h5>
                          <ScrollArea className="h-24">
                            {/* Placeholder for graphs in system */}
                            <p className="text-xs text-muted-foreground p-2">暂无图表</p>
                          </ScrollArea>
                        </>
                      )}
                      {isSidebarCollapsed && (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div className="flex justify-center py-2">
                              <ListTree className="h-5 w-5" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right">知识体系管理</TooltipContent>
                        </Tooltip>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Knowledge Tags Section */}
                  <AccordionItem value="knowledgeTags">
                    <AccordionTrigger className={`py-3 ${isSidebarCollapsed ? "justify-center" : ""}`}>
                      <div className="flex items-center">
                        <Tag className={`h-5 w-5 ${!isSidebarCollapsed ? "mr-3" : ""}`} />
                        {!isSidebarCollapsed && "知识标签"}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2 space-y-3 px-2">
                      {!isSidebarCollapsed && (
                        <>
                          <Input
                            placeholder="新标签名称..."
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                          />
                          <Textarea
                            placeholder="标签描述 (可选)"
                            rows={2}
                            value={newTagDescription}
                            onChange={(e) => setNewTagDescription(e.target.value)}
                          />
                          <Button onClick={handleCreateTag} className="w-full">
                            <PlusCircle className="w-4 h-4 mr-2" /> 创建标签
                          </Button>
                          <h5 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mt-2">
                            我的知识标签
                          </h5>
                          <ScrollArea className="h-32">
                            {knowledgeTags.map((tag) => (
                              <div key={tag.id} className="p-2 hover:bg-muted rounded text-sm">
                                {tag.name}
                                {tag.description && (
                                  <p className="text-xs text-muted-foreground truncate">{tag.description}</p>
                                )}
                              </div>
                            ))}
                            {knowledgeTags.length === 0 && (
                              <p className="text-xs text-muted-foreground p-2">暂无标签</p>
                            )}
                          </ScrollArea>
                        </>
                      )}
                      {isSidebarCollapsed && (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div className="flex justify-center py-2">
                              <Tag className="h-5 w-5" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right">知识标签</TooltipContent>
                        </Tooltip>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>

              {!isSidebarCollapsed && <Separator />}
              <div className={`p-4 border-t ${isSidebarCollapsed ? "hidden" : ""}`}>
                <Button variant="outline" className="w-full">
                  <Settings2 className="w-4 h-4 mr-2" />
                  设置
                </Button>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={78}>
            <div className="flex flex-col h-full">
              <header className="flex items-center justify-between h-16 px-6 border-b bg-background">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                  <h2 className="text-lg font-semibold">
                    {currentView === "textInput" ? "发现你思维中的隐藏连接" : graphName}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="hidden sm:flex items-center">
                    <Info size={14} className="mr-1.5" /> {resultStats}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" alt="User" />
                          <AvatarFallback>用户</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href="#">
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>个人资料</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/payment">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>订阅与计费</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="#">
                            <Settings2 className="mr-2 h-4 w-4" />
                            <span>设置</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/login">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>登出</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>

              <main className="flex-1 p-6 overflow-y-auto">
                {currentView === "textInput" ? (
                  <div className="max-w-3xl mx-auto space-y-6">
                    <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                          <Lightbulb className="w-6 h-6 mr-2" />
                          30秒体验
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          粘贴任何文字（笔记、文章、想法），AI 会帮你发现其中意想不到的知识关联，形成可视化的思维网络。
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Brain className="w-5 h-5 mr-2 text-muted-foreground" />
                          粘贴你的文字，或者：
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea
                          placeholder="例如：量子计算是利用量子力学原理进行信息处理的技术。与传统计算机使用比特（0或1）不同，量子计算机使用量子比特，可以同时处于多个状态的叠加..."
                          rows={6}
                          className="text-base"
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                        />
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button size="lg" className="flex-1" onClick={handleGenerateGraph} disabled={isLoading}>
                            {isLoading ? (
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                              <Sigma className="w-5 h-5 mr-2" />
                            )}
                            生成知识图谱
                          </Button>
                          <Button
                            variant="secondary"
                            size="lg"
                            className="flex-1 sm:flex-none"
                            onClick={handleSaveText}
                          >
                            <Save className="w-5 h-5 mr-2" />
                            保存文本
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="text-center mt-8">
                      <Button
                        variant="link"
                        onClick={() => loadExample('quantum')}
                      >
                        <Sparkles className="w-4 h-4 mr-2" /> 试试示例（30秒体验）
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <Input
                            placeholder="为当前图命名..."
                            className="max-w-xs text-lg font-semibold"
                            value={graphName}
                            onChange={(e) => setGraphName(e.target.value)}
                          />
                          <Button size="sm" variant="outline">
                            <Save className="w-4 h-4 mr-2" /> 保存图名称
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button variant="outline" onClick={handleAddNewNode}>
                            <PlusCircle className="w-4 h-4 mr-2" /> 添加节点
                          </Button>
                          <Button variant="outline" onClick={handleAddNewEdge}>
                            <Link2Icon className="w-4 h-4 mr-2" /> 添加关系
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteSelected}>
                            <Trash2 className="w-4 h-4 mr-2" /> 删除选中
                          </Button>
                          <Button variant="outline" onClick={handleAssignToSystem}>
                            <FolderArchive className="w-4 h-4 mr-2" /> 分配到体系
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {graphData ? (
                          <GraphCanvas 
                            data={graphData}
                            onNodeClick={handleNodeClick}
                            onGraphUpdate={handleGraphUpdate}
                            height={500}
                          />
                        ) : (
                          <div className="w-full h-[500px] bg-muted rounded-md flex items-center justify-center border relative">
                            <Loader2 className="w-12 h-12 text-muted-foreground/30 animate-spin" />
                            <p className="absolute mt-20 text-muted-foreground">加载中...</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Accordion type="single" collapsible defaultValue="legend">
                      <AccordionItem value="legend">
                        <AccordionTrigger className="text-base font-semibold">
                          <div className="flex items-center">
                            <Palette className="w-5 h-5 mr-2 text-muted-foreground" />
                            图例说明
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-background rounded-md border">
                            <LegendItem color="bg-blue-500" label="核心概念" />
                            <LegendItem color="bg-green-500" label="主要方面" />
                            <LegendItem color="bg-orange-500" label="相关细节" />
                            <LegendItem color="bg-gray-500" label="其他" />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {currentNodeData && (
        <NodeEditDialog
          isOpen={isNodeEditDialogOpen}
          onClose={() => setIsNodeEditDialogOpen(false)}
          nodeData={currentNodeData}
          knowledgeTags={knowledgeTags}
          onSave={handleSaveNodeDetails}
        />
      )}
    </TooltipProvider>
  )
} 