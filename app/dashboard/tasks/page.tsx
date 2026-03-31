/**
 * Admin Production Terminal - Media SaaS
 * 
 * A simplified workflow for managing client requests, editor assignments, and internal reviews.
 * 
 * @updated 2026-02-07 - UI Simplification & Overflow Fixes
 * @route /dashboard/tasks
 */
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
    Plus,
    Filter,
    Calendar,
    FolderOpen,
    AlertTriangle,
    Video,
    Smartphone,
    Monitor,
    Trash2,
    Zap,
    Briefcase,
    Check,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Play,
    DollarSign,
    Clock,
    UserPlus,
    X,
    Users,
    RotateCcw,
    FolderPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getQuotedOrders, createProject, getActiveProjects, getProjects, Project, updateProject, addProjectNote } from "@/lib/project-service"
import { Order } from "@/lib/order-service"

// --- Types ---

type EditorSpecialty = "Short-form" | "Long-form" | "VFX" | "Color Grading" | "Corporate" | "Management"

interface Editor {
    id: string
    name: string
    avatar: string
    specialties: EditorSpecialty[]
    currentlyEditing: number
    isAdmin?: boolean
}

// --- Initial Data ---

const INITIAL_EDITORS: Editor[] = [
    { id: "admin-1", name: "Admin (You)", avatar: "/avatars/admin.png", specialties: ["Management"], currentlyEditing: 0, isAdmin: true },
    { id: "e1", name: "John Doe", avatar: "/avatars/01.png", specialties: ["Short-form", "VFX"], currentlyEditing: 2 },
    { id: "e2", name: "Jane Smith", avatar: "/avatars/02.png", specialties: ["Corporate", "Color Grading"], currentlyEditing: 1 },
    { id: "e3", name: "Mike Johnson", avatar: "/avatars/03.png", specialties: ["Long-form", "VFX"], currentlyEditing: 3 },
]

// --- Components ---

export default function TasksPage() {
    const { role } = useAuth()
    const isAdmin = role === 'admin'

    const [projects, setProjects] = useState<Project[]>([])
    const [quotedOrders, setQuotedOrders] = useState<Order[]>([])
    const [isClient, setIsClient] = useState(false)
    
    // Dialog states
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
    
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false)
    const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false)

    const [feedbackProjectId, setFeedbackProjectId] = useState<string | null>(null)
    const [feedbackText, setFeedbackText] = useState("")

    const [progressProjectId, setProgressProjectId] = useState<string | null>(null)
    const [progressValue, setProgressValue] = useState(0)
    const [progressStatusLine, setProgressStatusLine] = useState("")

    const [newTodoTitle, setNewTodoTitle] = useState("")
    const [newTodoDesc, setNewTodoDesc] = useState("")

    const [internalForwardingNote, setInternalForwardingNote] = useState("")

    // Load projects and quoted orders on client side
    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (!isClient) return
        setProjects(getActiveProjects())
        setQuotedOrders(getQuotedOrders())
    }, [isClient])

    const activeProjects = projects.filter(p => p.status !== "done")
    const doneProjects = projects.filter(p => p.status === "done")

    // --- Actions ---

    const handleCreateProject = () => {
        if (!selectedOrderId) {
            toast.error("Please select an order.")
            return
        }
        if (selectedAssignees.length === 0) {
            toast.error("Please assign at least one editor.")
            return
        }

        const project = createProject(selectedOrderId, selectedAssignees)
        if (project) {
            setProjects(getActiveProjects())
            setQuotedOrders(getQuotedOrders())
            setIsCreateProjectOpen(false)
            setSelectedOrderId(null)
            setSelectedAssignees([])
            toast.success("Project created and added to production pipeline.")
        } else {
            toast.error("Failed to create project.")
        }
    }

    const handleCreateSelfTodo = () => {
        if (!newTodoTitle.trim()) {
            toast.error("Please enter a title.")
            return
        }

        const newProject: Project = {
            id: `self-${Date.now()}`,
            orderId: `self-${Date.now()}`,
            title: newTodoTitle,
            description: newTodoDesc,
            clientName: "Internal",
            clientEmail: "",
            dealValue: 0,
            status: "todo",
            assigneeIds: ["admin-1"],
            progress: 0,
            dueDate: new Date().toISOString().split('T')[0],
            driveLinks: { raw: "", working: "" },
            mediaSpecs: { duration: "N/A", ratio: "16:9" },
            internalNotes: [],
            statusLine: "Getting Started",
            readyForClient: false,
            createdAt: new Date().toISOString(),
            service: "internal",
        }

        const allProjects = [...projects, newProject]
        // Save to localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("universal_media_projects", JSON.stringify(allProjects))
        }
        setProjects(allProjects)
        setIsTodoDialogOpen(false)
        setNewTodoTitle("")
        setNewTodoDesc("")
        toast.success("Task added to your todo list.")
    }

    const handleToggleExpand = (id: string, currentAssignees: string[]) => {
        if (expandedProjectId === id) {
            setExpandedProjectId(null)
            setSelectedAssignees([])
        } else {
            setExpandedProjectId(id)
            setSelectedAssignees(currentAssignees)
        }
    }

    const toggleAssignee = (editorId: string) => {
        setSelectedAssignees(prev =>
            prev.includes(editorId) ? prev.filter(id => id !== editorId) : [...prev, editorId]
        )
    }

    const handleForwardToProduction = (projectId: string) => {
        if (selectedAssignees.length === 0) {
            toast.error("Please assign at least one member.")
            return
        }

        const updated = updateProject(projectId, {
            status: "todo",
            assigneeIds: selectedAssignees,
            internalNotes: internalForwardingNote ? [...(projects.find(p => p.id === projectId)?.internalNotes || []), internalForwardingNote] : undefined,
            statusLine: "Waiting to Start"
        })
        
        if (updated) {
            setProjects(getActiveProjects())
            setExpandedProjectId(null)
            setInternalForwardingNote("")
            toast.success("Task assigned and forwarded.")
        }
    }

    const handleDeleteProject = (projectId: string) => {
        if (confirm("Permanently delete this project?")) {
            const allProjects = getProjects().filter(p => p.id !== projectId)
            if (typeof window !== "undefined") {
                localStorage.setItem("universal_media_projects", JSON.stringify(allProjects))
            }
            setProjects(getActiveProjects())
            toast.error("Project deleted.")
        }
    }

    const handleOpenProgressDialog = (project: Project) => {
        setProgressProjectId(project.id)
        setProgressValue(project.progress)
        setProgressStatusLine(project.statusLine || "")
        setIsProgressDialogOpen(true)
    }

    const submitProgressUpdate = () => {
        if (!progressProjectId) return
        const updated = updateProject(progressProjectId, { 
            progress: progressValue, 
            statusLine: progressStatusLine 
        })
        if (updated) {
            setProjects(getActiveProjects())
            setIsProgressDialogOpen(false)
            toast.success("Progress updated.")
        }
    }

    const handleReviewDecision = (id: string, decision: 'approve' | 'revise' | 'done') => {
        if (decision === 'approve') {
            updateProject(id, { readyForClient: true })
            setProjects(getActiveProjects())
            toast.success("Approved for client.")
        } else if (decision === 'done') {
            updateProject(id, { status: 'done', progress: 100, readyForClient: true, statusLine: "Completed" })
            setProjects(getActiveProjects())
            toast.success("Project marked as done.")
        } else {
            setFeedbackProjectId(id)
            setIsFeedbackOpen(true)
        }
    }

    const submitFeedback = () => {
        if (!feedbackProjectId) return
        const project = projects.find(p => p.id === feedbackProjectId)
        if (project) {
            const notes = [...project.internalNotes, feedbackText]
            updateProject(feedbackProjectId, {
                status: "in-progress",
                progress: 80,
                statusLine: "Revising...",
                internalNotes: notes
            })
            setProjects(getActiveProjects())
            setIsFeedbackOpen(false)
            setFeedbackText("")
            setFeedbackProjectId(null)
        }
    }

    const getProjectsByStatus = (status: Project["status"]) => {
        if (status === "done") return doneProjects
        return activeProjects.filter(p => p.status === status)
    }

    return (
        <div className="space-y-8 max-w-full overflow-hidden">
            {/* Header with Create Project Button */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Production Board</h1>
                    <p className="text-sm text-muted-foreground">Manage client requests and track production progress.</p>
                </div>
                {isAdmin && quotedOrders.length > 0 && (
                    <Button 
                        onClick={() => setIsCreateProjectOpen(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                    >
                        <FolderPlus size={18} />
                        Create Project
                        {quotedOrders.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 text-[10px]">
                                {quotedOrders.length}
                            </Badge>
                        )}
                    </Button>
                )}
            </div>

            {/* Kanban Pipeline */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Production Pipeline</h2>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {(["todo", "in-progress", "in-review", "done"] as const).map(status => (
                        <div key={status} className="flex-1 min-w-[280px] max-w-[320px] bg-muted/30 rounded-xl p-3 space-y-3 border h-[calc(100vh-300px)] overflow-y-auto">
                            <div className="flex items-center justify-between pb-1 px-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest">{status.replace('-', ' ')}</h3>
                                    {status === 'todo' && isAdmin && (
                                        <button
                                            onClick={() => setIsTodoDialogOpen(true)}
                                            className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                                        >
                                            <Plus size={10} />
                                        </button>
                                    )}
                                </div>
                                <Badge variant="outline" className="h-4 text-[9px] px-1">
                                    {getProjectsByStatus(status).length}
                                </Badge>
                            </div>

                            {getProjectsByStatus(status).map(project => (
                                <Card key={project.id} className={cn(
                                    "border-none shadow-sm hover:shadow-md transition-all overflow-hidden",
                                    project.status === 'done' && "opacity-70 grayscale-[0.5]"
                                )}>
                                    {isAdmin && (
                                        <div className="px-3 py-1.5 bg-black/[0.03] flex justify-between items-center text-[9px] font-bold border-b">
                                            <span className="text-green-600">${project.dealValue}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleDeleteProject(project.id)} className="text-red-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={10} />
                                                </button>
                                                <span className="text-muted-foreground uppercase opacity-50">{project.clientName}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-3 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-xs font-bold leading-none truncate">{project.title}</h4>
                                            <div className="flex -space-x-1.5">
                                                {project.assigneeIds.map(id => (
                                                    <div key={id} className="h-5 w-5 rounded-full border border-background bg-muted flex items-center justify-center text-[7px] font-bold uppercase transition-transform hover:scale-110" title={INITIAL_EDITORS.find(e => e.id === id)?.name}>
                                                        {INITIAL_EDITORS.find(e => e.id === id)?.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[9px] font-bold uppercase">
                                                <button
                                                    onClick={() => project.status !== 'done' && handleOpenProgressDialog(project)}
                                                    className={cn("truncate text-left transition-colors", project.status !== 'done' && "text-primary hover:underline")}
                                                >
                                                    {project.statusLine || "Starting"}
                                                </button>
                                                <span className="text-muted-foreground">{project.progress}%</span>
                                            </div>
                                            <Progress value={project.progress} className="h-1" />
                                        </div>

                                        {project.status === 'in-review' && (
                                            <div className="flex gap-1.5 pt-1">
                                                <Button size="sm" className="h-7 text-[9px] flex-1 font-bold bg-green-600 hover:bg-green-700" onClick={() => handleReviewDecision(project.id, 'done')}>
                                                    <Check size={12} className="mr-1" /> Complete
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-7 text-[9px] flex-1 font-bold border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleReviewDecision(project.id, 'revise')}>
                                                    <ArrowLeft size={12} className="mr-1" /> Revise
                                                </Button>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-muted text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                                            <div className="flex items-center gap-2">
                                                {project.mediaSpecs.ratio === '9:16' ? <Smartphone size={10} /> : <Monitor size={10} />}
                                                <span>{project.dueDate ? project.dueDate.split('-').slice(1).join('/') : 'N/A'}</span>
                                            </div>
                                            {project.readyForClient && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none h-4 text-[8px]">SUBMITTED</Badge>}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* Create Project Dialog */}
            <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2 text-orange-500">
                            <FolderPlus size={18} />
                            Create Project from Quoted Order
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Select a quoted order and assign editors to create a new production project.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                        {/* Order Selection */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Select Quoted Order</Label>
                            {quotedOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No quoted orders available.</p>
                            ) : (
                                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                    {quotedOrders.map(order => (
                                        <button
                                            key={order.id}
                                            onClick={() => setSelectedOrderId(order.id)}
                                            className={cn(
                                                "w-full p-3 rounded-lg border text-left transition-all",
                                                selectedOrderId === order.id
                                                    ? "bg-orange-50 border-orange-500"
                                                    : "bg-muted/30 border-transparent hover:border-muted"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold">{order.title}</p>
                                                    <p className="text-xs text-muted-foreground">{order.clientName} • {order.service}</p>
                                                </div>
                                                <span className="text-sm font-bold text-green-600">${order.quote?.price}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Editor Assignment */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Assign Editors</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {INITIAL_EDITORS.filter(e => !e.isAdmin).map(editor => {
                                    const isSelected = selectedAssignees.includes(editor.id)
                                    return (
                                        <button
                                            key={editor.id}
                                            onClick={() => toggleAssignee(editor.id)}
                                            className={cn(
                                                "flex items-center gap-2 p-2 rounded-md border text-left transition-all",
                                                isSelected ? "bg-primary text-white border-primary" : "bg-muted/50 border-transparent hover:border-primary/20"
                                            )}
                                        >
                                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                                                {editor.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[10px] font-bold truncate">{editor.name}</div>
                                                <div className="text-[8px] opacity-70">{editor.specialties.join(', ')}</div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" size="sm" onClick={() => setIsCreateProjectOpen(false)}>Cancel</Button>
                        <Button 
                            size="sm" 
                            onClick={handleCreateProject} 
                            className="bg-orange-500 hover:bg-orange-600 px-6"
                            disabled={!selectedOrderId || selectedAssignees.length === 0}
                        >
                            Create Project
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revision Dialog */}
            <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" />
                            Return for Revision
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Provide specific feedback to the production team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Feedback Note</Label>
                        <Textarea
                            placeholder="State what needs to be fixed..."
                            className="text-sm min-h-[120px]"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" size="sm" onClick={() => setIsFeedbackOpen(false)}>Cancel</Button>
                        <Button size="sm" onClick={submitFeedback} className="bg-amber-600 hover:bg-amber-700 px-6">Send to Team</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Admin Self-Todo Dialog */}
            <Dialog open={isTodoDialogOpen} onOpenChange={setIsTodoDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2 text-primary">
                            <Plus size={18} />
                            Create Self-Todo
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a task to your own production queue.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="todo-title" className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Task Title</Label>
                            <Input
                                id="todo-title"
                                placeholder="e.g. Review GlobalTech draft..."
                                className="text-sm"
                                value={newTodoTitle}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodoTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="todo-desc" className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Description</Label>
                            <Textarea
                                id="todo-desc"
                                placeholder="Details about this task..."
                                className="text-sm min-h-[100px]"
                                value={newTodoDesc}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTodoDesc(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" size="sm" onClick={() => setIsTodoDialogOpen(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleCreateSelfTodo} className="bg-primary hover:bg-primary/90 px-6">Create Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Progress Update Dialog */}
            <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2 text-primary">
                            <RotateCcw size={18} />
                            Update Progress
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Manually adjust task completion and status message.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Completion: {progressValue}%</Label>
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
                            <Label htmlFor="status-line" className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Status Line</Label>
                            <Input
                                id="status-line"
                                placeholder="e.g. Exporting draft..."
                                className="text-sm"
                                value={progressStatusLine}
                                onChange={(e) => setProgressStatusLine(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" size="sm" onClick={() => setIsProgressDialogOpen(false)}>Cancel</Button>
                        <Button size="sm" onClick={submitProgressUpdate} className="bg-primary hover:bg-primary/90 px-6">Save Updates</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
