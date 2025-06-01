"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

export interface NodeData {
  id: string
  userNotes?: string
  applicabilityConditions?: string
  userSignificance?: string
  associatedTagIds?: string[]
}

interface NodeEditDialogProps {
  isOpen: boolean
  onClose: () => void
  nodeData: NodeData | null
  knowledgeTags: { id: string; name: string; description?: string }[]
  onSave: (data: NodeData) => void
}

export function NodeEditDialog({ isOpen, onClose, nodeData, knowledgeTags, onSave }: NodeEditDialogProps) {
  const [userNotes, setUserNotes] = useState("")
  const [applicabilityConditions, setApplicabilityConditions] = useState("")
  const [userSignificance, setUserSignificance] = useState("重要")
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  useEffect(() => {
    if (nodeData) {
      setUserNotes(nodeData.userNotes || "")
      setApplicabilityConditions(nodeData.applicabilityConditions || "")
      setUserSignificance(nodeData.userSignificance || "重要")
      setSelectedTagIds(nodeData.associatedTagIds || [])
    }
  }, [nodeData])

  const handleSave = () => {
    if (nodeData) {
      onSave({
        ...nodeData,
        userNotes,
        applicabilityConditions,
        userSignificance,
        associatedTagIds: selectedTagIds,
      })
    }
    onClose()
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>编辑节点</DialogTitle>
          <DialogDescription>添加您对这个概念的理解和关联。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="userNotes">📝 我的理解</Label>
            <Textarea
              id="userNotes"
              placeholder="这个概念让我想到什么？我的理解是..."
              className="h-32"
              value={userNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserNotes(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="applicabilityConditions">🔍 相关知识</Label>
            <Textarea
              id="applicabilityConditions"
              placeholder="这让我联想到什么？在什么情况下会想起这个？"
              className="h-24"
              value={applicabilityConditions}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApplicabilityConditions(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>⭐ 重要程度</Label>
            <RadioGroup value={userSignificance} onValueChange={setUserSignificance}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="核心" id="core" />
                <Label htmlFor="core" className="cursor-pointer">
                  🔥 核心想法 - 经常思考
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="重要" id="important" />
                <Label htmlFor="important" className="cursor-pointer">
                  ⭐ 重要概念 - 值得深入
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="相关" id="related" />
                <Label htmlFor="related" className="cursor-pointer">
                  💡 相关信息 - 有用参考
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="待定" id="pending" />
                <Label htmlFor="pending" className="cursor-pointer">
                  ❓ 还在思考 - 不确定
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label>🏷️ 知识标签</Label>
            <ScrollArea className="h-40 w-full rounded-md border p-4">
              {knowledgeTags.length === 0 ? (
                <p className="text-sm text-muted-foreground">暂无标签</p>
              ) : (
                <div className="space-y-2">
                  {knowledgeTags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag.id}
                        checked={selectedTagIds.includes(tag.id)}
                        onCheckedChange={() => handleTagToggle(tag.id)}
                      />
                      <Label
                        htmlFor={tag.id}
                        className="text-sm font-normal cursor-pointer flex-1"
                        title={tag.description}
                      >
                        {tag.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave}>💾 保存更改</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 