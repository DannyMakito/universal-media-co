"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { getEditorProjects, Project, updateProject, updateProjectStatus, addProjectNote } from "@/lib/project-service"
import { formatDate } from "@/lib/order-service"
import { toast } from "sonner"
import {
    Clock,
    CheckCircle2,
    FileText,
    AlertCircle,
    Play,
    RotateCcw,
    Send,
    FolderOpen,
    MessageSquare,
    ChevronRight,
    User
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig = {
    "todo": { label: "To Do", icon: Clock, color: "bg-gray-500", badgeVariant: "secondary" as const },
    "in-progress": { label: "In Progress", icon: Play, color: "bg-blue-500", badgeVariant: "default" as const },
    "in-review": { label: "In Review", icon: FileText, color: "bg-amber-500", badgeVariant: "outline" as const },
    "done": { label: "Completed", icon: CheckCircle2, color: "bg-green-500", badgeVariant: "outline" as const },
}

const statusFlow: Project["status"][] = ["todo", "in-progress", "in-review", "done"]

export default function EditorProjectsPage() {
    const { user } = useAuth()
    const [projects, setProjects] = useState<Project[]>([])
    const [isClient, setIsClient] = useState(false)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    
    // Progress update state
    const [progressValue, setProgressValue] = useState(0)
    const [statusLine, setStatusLine] = useState("")
    
    // Note state
    const [newNote, setNewNote] = useState("")

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (!isClient || !user?.id) return
        // For demo, we'll use a mock editor ID - in real app, this would come from user.id
        const editorId = user.id || "e1"
        setProjects(getEditorProjects(editorId))
    }, [isClient, user])

    const handleOpenDetail = (project: Project) => {
        setSelectedProject(project)
        setProgressValue(project.progress)
        setStatusLine(project.statusLine || "")
        setIsDetailOpen(true)
    }

    const handleUpdateProgress = () => {
        if (!selectedProject) return
        
        const updated = updateProject(selectedProject.id, {
            progress: progressValue,
            statusLine: statusLine
        })
        
        if (updated) {
            setProjects(prev => prev.map(p => p.id === selectedProject.id ? updated : p))
            setSelectedProject(updated)
            toast.success("Progress updated successfully")
        }
    }

    const handleStatusAdvance = () => {
        if (!selectedProject) return
        
        const currentIndex = statusFlow.indexOf(selectedProject.status)
        if (currentIndex < statusFlow.length - 1) {
            const nextStatus = statusFlow[currentIndex + 1]
            const updates: Partial<Project> = { status: nextStatus }
            
            if (nextStatus === "done") {
                updates.progress = 100
                updates.statusLine = "Completed"
            } else if (nextStatus === "in-review") {
                updates.statusLine = "Ready for Review"
            }
            
            const updated = updateProject(selectedProject.id, updates)
            if (updated) {
                setProjects(prev => prev.map(p => p.id === selectedProject.id ? updated : p))
                setSelectedProject(updated)
                toast.success(`Status updated to ${statusConfig[nextStatus].label}`)
            }
        }
    }

    const handleAddNote = () => {
        if (!selectedProject || !newNote.trim()) return
        
        const updated = addProjectNote(selectedProject.id, newNote)
        if (updated) {
            setProjects(prev => prev.map(p => p.id === selectedProject.id ? updated : p))
            setSelectedProject(updated)
            setNewNote("")
            toast.success("Note added")
        }
    }

    const handleWorkingDriveUpdate = (link: string) => {
        if (!selectedProject) return
        
        const updated = updateProject(selectedProject.id, {
            driveLinks: { ...selectedProject.driveLinks, working: link }
        })
        
        if (updated) {
            setProjects(prev => prev.map(p => p.id === selectedProject.id ? updated : p))
            setSelectedProject(updated)
        }
    }

    if (!isClient) {
        return <div className="text-center py-8">Loading projects...</div>
    }

    if (projects.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
                    <p className="text-muted-foreground">View and manage your assigned production projects.</p>
                </div>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Projects Assigned</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            You don't have any active projects assigned to you. Check back later or contact your admin.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
                <p className="text-muted-foreground">View and manage your assigned production projects.</p>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-4">
                {projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(project => {
                    const config = statusConfig[project.status]
                    const StatusIcon = config.icon

                    return (
                        <Card key={project.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold truncate">{project.title}</h3>
                                            <Badge variant={config.badgeVariant} className={cn("text-white", config.color)}>
                                                <StatusIcon className="mr-1 h-3 w-3" />
                                                {config.label}
                                            </Badge>
                                        </div>
                                        
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                <span>{project.clientName}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>Due: {project.dueDate ? formatDate(project.dueDate) : 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{project.internalNotes.length} notes</span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-muted-foreground">{project.statusLine || "Starting"}</span>
                                                <span className="text-muted-foreground">{project.progress}%</span>
                                            </div>
                                            <Progress value={project.progress} className="h-2" />
                                        </div>
                                    </div>

                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleOpenDetail(project)}
                                        className="shrink-0"
                                    >
                                        View Details
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Project Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                {selectedProject && (
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <Badge className={cn("text-white", statusConfig[selectedProject.status].color)}>
                                    {statusConfig[selectedProject.status].label}
                                </Badge>
                            </div>
                            <DialogTitle className="text-xl">{selectedProject.title}</DialogTitle>
                            <DialogDescription>
                                Client: {selectedProject.clientName} • Service: {selectedProject.service}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Project Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Deal Value:</span>
                                    <span className="ml-2 font-semibold text-green-600">${selectedProject.dealValue}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Due Date:</span>
                                    <span className="ml-2">{selectedProject.dueDate ? formatDate(selectedProject.dueDate) : 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Media Specs:</span>
                                    <span className="ml-2">{selectedProject.mediaSpecs.duration} • {selectedProject.mediaSpecs.ratio}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Created:</span>
                                    <span className="ml-2">{formatDate(selectedProject.createdAt)}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Project Description</Label>
                                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                    {selectedProject.description}
                                </p>
                            </div>

                            {/* Drive Links */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Raw Assets</Label>
                                    {selectedProject.driveLinks.raw ? (
                                        <a 
                                            href={selectedProject.driveLinks.raw} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <FolderOpen className="h-4 w-4" />
                                            Open Raw Assets
                                        </a>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">No link provided</span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Working Files</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Paste working drive link..."
                                            value={selectedProject.driveLinks.working}
                                            onChange={(e) => handleWorkingDriveUpdate(e.target.value)}
                                            className="text-sm h-8"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Progress Update */}
                            <div className="space-y-4 border-t pt-4">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Update Progress</Label>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Completion: {progressValue}%</span>
                                    </div>
                                    <Input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={progressValue}
                                        onChange={(e) => setProgressValue(parseInt(e.target.value))}
                                        className="h-6 cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Status Message</Label>
                                    <Input
                                        placeholder="e.g. Editing intro section..."
                                        value={statusLine}
                                        onChange={(e) => setStatusLine(e.target.value)}
                                        className="text-sm"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button 
                                        onClick={handleUpdateProgress}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Save Progress
                                    </Button>
                                    
                                    {selectedProject.status !== "done" && (
                                        <Button 
                                            onClick={handleStatusAdvance}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                                        >
                                            {selectedProject.status === "in-review" ? (
                                                <>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Mark Complete
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronRight className="mr-2 h-4 w-4" />
                                                    Advance to {statusConfig[statusFlow[statusFlow.indexOf(selectedProject.status) + 1]]?.label}
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Internal Notes */}
                            <div className="space-y-3 border-t pt-4">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Internal Notes</Label>
                                
                                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                    {selectedProject.internalNotes.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic">No notes yet</p>
                                    ) : (
                                        selectedProject.internalNotes.map((note, idx) => (
                                            <div key={idx} className="bg-muted/30 p-2 rounded text-sm">
                                                {note}
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Textarea
                                        placeholder="Add a note..."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="text-sm min-h-[60px]"
                                    />
                                    <Button 
                                        onClick={handleAddNote}
                                        disabled={!newNote.trim()}
                                        size="sm"
                                        className="shrink-0 h-auto"
                                    >
                                        <Send className="h-4 w-4 mr-1" />
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsDetailOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    )
}
