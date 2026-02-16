/**
 * Admin Production Terminal - Media SaaS
 * 
 * A simplified workflow for managing client requests, editor assignments, and internal reviews.
 * 
 * @updated 2026-02-07 - UI Simplification & Overflow Fixes
 * @route /dashboard/tasks
 */
"use client"

import { useState } from "react"
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
    RotateCcw
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

// --- Types ---

type TaskStatus = "incoming" | "todo" | "in-progress" | "in-review" | "done"
type Urgency = "Standard" | "Rush" | "ASAP"
type EditorSpecialty = "Short-form" | "Long-form" | "VFX" | "Color Grading" | "Corporate" | "Management"

interface Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    clientName: string
    dealValue: number
    editorPayout: number
    briefAnchor: string
    urgency: Urgency
    driveLinks: {
        raw: string
        working: string
    }
    mediaSpecs: {
        duration: string
        ratio: "9:16" | "16:9"
    }
    addons: string[]
    assigneeIds: string[]
    progress: number
    dueDate: string
    internalNotes: string[]
    readyForClient: boolean
    thumbnail?: string
    statusLine?: string
}

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

const INITIAL_TASKS: Task[] = [
    {
        id: "req-1",
        title: "5 Shorts for TikTok",
        description: "5 Shorts for TikTok, use captions, high energy, fast cuts. Client needs them to look like Alex Hormozi style.",
        status: "incoming",
        clientName: "TurboGaming",
        dealValue: 500,
        editorPayout: 150,
        briefAnchor: "High energy TikTok style",
        urgency: "Rush",
        driveLinks: { raw: "https://drive...", working: "" },
        mediaSpecs: { duration: "0:60", ratio: "9:16" },
        addons: ["Captions"],
        assigneeIds: [],
        progress: 0,
        dueDate: "2026-02-09",
        internalNotes: [],
        readyForClient: false,
    },
    {
        id: "1",
        title: "MrBeast Style Retention Edit",
        description: "High-paced retention edit for a 15 min gaming video.",
        status: "in-progress",
        clientName: "TurboGaming",
        dealValue: 1200,
        editorPayout: 450,
        briefAnchor: "Make it feel like MrBeast style.",
        urgency: "Standard",
        driveLinks: { raw: "https://drive...", working: "https://drive..." },
        mediaSpecs: { duration: "15:00", ratio: "16:9" },
        addons: ["4K Export"],
        assigneeIds: ["e1"],
        progress: 65,
        statusLine: "Editing Intro",
        dueDate: "2026-02-10",
        internalNotes: [],
        readyForClient: false,
    },
]

// --- Components ---

export default function TasksPage() {
    const { role } = useAuth()
    const isAdmin = role === 'admin'

    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false)
    const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false)

    const [feedbackTaskId, setFeedbackTaskId] = useState<string | null>(null)
    const [feedbackText, setFeedbackText] = useState("")

    const [progressTaskId, setProgressTaskId] = useState<string | null>(null)
    const [progressValue, setProgressValue] = useState(0)
    const [progressStatusLine, setProgressStatusLine] = useState("")

    const [newTodoTitle, setNewTodoTitle] = useState("")
    const [newTodoDesc, setNewTodoDesc] = useState("")

    const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
    const [internalForwardingNote, setInternalForwardingNote] = useState("")

    const incomingTasks = tasks.filter(t => t.status === "incoming")
    const activeTasks = tasks.filter(t => t.status !== "incoming" && t.status !== "done")

    // --- Actions ---

    const handleCreateSelfTodo = () => {
        if (!newTodoTitle.trim()) {
            toast.error("Please enter a title.")
            return
        }

        const newTask: Task = {
            id: `self-${Date.now()}`,
            title: newTodoTitle,
            description: newTodoDesc,
            status: "todo",
            clientName: "Internal",
            dealValue: 0,
            editorPayout: 0,
            briefAnchor: "Admin Self-Todo",
            urgency: "Standard",
            driveLinks: { raw: "", working: "" },
            mediaSpecs: { duration: "N/A", ratio: "16:9" },
            addons: [],
            assigneeIds: ["admin-1"],
            progress: 0,
            dueDate: new Date().toISOString().split('T')[0],
            internalNotes: [],
            readyForClient: false,
            statusLine: "Getting Started"
        }

        setTasks(prev => [newTask, ...prev])
        setIsTodoDialogOpen(false)
        setNewTodoTitle("")
        setNewTodoDesc("")
        toast.success("Task added to your todo list.")
    }

    const handleToggleExpand = (id: string, currentAssignees: string[]) => {
        if (expandedTaskId === id) {
            setExpandedTaskId(null)
            setSelectedAssignees([])
        } else {
            setExpandedTaskId(id)
            setSelectedAssignees(currentAssignees)
        }
    }

    const toggleAssignee = (editorId: string) => {
        setSelectedAssignees(prev =>
            prev.includes(editorId) ? prev.filter(id => id !== editorId) : [...prev, editorId]
        )
    }

    const handleForwardToProduction = (taskId: string) => {
        if (selectedAssignees.length === 0) {
            toast.error("Please assign at least one member.")
            return
        }

        setTasks(prev => prev.map(t =>
            t.id === taskId
                ? {
                    ...t,
                    status: "todo",
                    assigneeIds: selectedAssignees,
                    internalNotes: internalForwardingNote ? [...t.internalNotes, internalForwardingNote] : t.internalNotes,
                    statusLine: "Waiting to Start"
                }
                : t
        ))
        setExpandedTaskId(null)
        setInternalForwardingNote("")
        toast.success("Task assigned and forwarded.")
    }

    const handleCancelRequest = (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId))
        setExpandedTaskId(null)
        toast.info("Request cancelled.")
    }

    const handleDeleteTask = (taskId: string) => {
        if (confirm("Permanently delete this task?")) {
            setTasks(prev => prev.filter(t => t.id !== taskId))
            toast.error("Task deleted.")
        }
    }

    const handleOpenProgressDialog = (task: Task) => {
        setProgressTaskId(task.id)
        setProgressValue(task.progress)
        setProgressStatusLine(task.statusLine || "")
        setIsProgressDialogOpen(true)
    }

    const submitProgressUpdate = () => {
        if (!progressTaskId) return
        setTasks(prev => prev.map(t =>
            t.id === progressTaskId
                ? { ...t, progress: progressValue, statusLine: progressStatusLine }
                : t
        ))
        setIsProgressDialogOpen(false)
        toast.success("Progress updated.")
    }

    const handleReviewDecision = (id: string, decision: 'approve' | 'revise' | 'done') => {
        if (decision === 'approve') {
            setTasks(prev => prev.map(t => t.id === id ? { ...t, readyForClient: true } : t))
            toast.success("Approved for client.")
        } else if (decision === 'done') {
            setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'done', progress: 100, readyForClient: true, statusLine: "Completed" } : t))
            toast.success("Task marked as done.")
        } else {
            setFeedbackTaskId(id)
            setIsFeedbackOpen(true)
        }
    }

    const submitFeedback = () => {
        if (!feedbackTaskId) return
        setTasks(prev => prev.map(t =>
            t.id === feedbackTaskId
                ? {
                    ...t,
                    status: "in-progress",
                    progress: 80,
                    statusLine: "Revising...",
                    internalNotes: [...t.internalNotes, feedbackText]
                }
                : t
        ))
        setIsFeedbackOpen(false)
        setFeedbackText("")
        setFeedbackTaskId(null)
    }

    return (
        <div className="space-y-8 max-w-full overflow-hidden">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Production Board</h1>
                <p className="text-sm text-muted-foreground">Manage client requests and track production progress.</p>
            </div>

            {/* Incoming Section */}
            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Incoming Requests</h2>
                    <Badge variant="secondary" className="ml-2 h-5 text-[10px]">{incomingTasks.length}</Badge>
                </div>

                <div className="space-y-2">
                    {incomingTasks.map(task => {
                        const isExpanded = expandedTaskId === task.id
                        return (
                            <Card key={task.id} className={cn(
                                "border-muted overflow-hidden transition-all",
                                isExpanded ? "ring-1 ring-primary shadow-lg" : "hover:border-primary/50"
                            )}>
                                <div className="p-3 flex items-center justify-between gap-4 cursor-pointer" onClick={() => handleToggleExpand(task.id, task.assigneeIds)}>
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <Badge className={cn(
                                            "min-w-[60px] justify-center text-[9px] uppercase font-bold",
                                            task.urgency === 'ASAP' ? "bg-red-500" : task.urgency === 'Rush' ? "bg-orange-500" : "bg-blue-500"
                                        )}>
                                            {task.urgency}
                                        </Badge>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold truncate">{task.title}</h3>
                                            <p className="text-[11px] text-muted-foreground truncate italic opacity-70">{task.clientName}</p>
                                        </div>
                                        <div className="text-sm font-bold text-green-600">${task.dealValue}</div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleCancelRequest(task.id); }}>
                                            <Trash2 size={16} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); window.open(task.driveLinks.raw, '_blank'); }}>
                                            <FolderOpen size={16} />
                                        </Button>
                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="p-4 bg-muted/20 border-t space-y-4 animate-in slide-in-from-top-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Description</Label>
                                                    <p className="text-sm text-balance leading-snug">{task.description}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Extra Instructions</Label>
                                                    <Textarea
                                                        placeholder="Add specific notes for the editors..."
                                                        className="text-xs min-h-[80px]"
                                                        value={internalForwardingNote}
                                                        onChange={(e) => setInternalForwardingNote(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 bg-background p-4 rounded-lg border border-primary/10">
                                                <div className="flex items-center gap-2 text-primary">
                                                    <UserPlus size={16} />
                                                    <Label className="text-[11px] font-bold uppercase tracking-wider">Assign Team</Label>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                                                    {INITIAL_EDITORS.map(editor => {
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
                                                                    <div className="text-[10px] font-bold truncate">{editor.name.split(' ')[0]}</div>
                                                                    <div className="text-[8px] opacity-70">Editing: {editor.currentlyEditing}</div>
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                                <Button className="w-full h-9 text-xs font-bold gap-2" onClick={() => handleForwardToProduction(task.id)}>
                                                    <Plus size={14} /> Assign & Forward
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* Kanban Pipeline */}
            <section className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Production Pipeline</h2>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {["todo", "in-progress", "in-review", "done"].map(status => (
                        <div key={status} className="flex-1 min-w-[280px] max-w-[320px] bg-muted/30 rounded-xl p-3 space-y-3 border h-[calc(100vh-400px)] overflow-y-auto">
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
                                    {status === 'done'
                                        ? tasks.filter(t => t.status === 'done').length
                                        : activeTasks.filter(t => t.status === status).length
                                    }
                                </Badge>
                            </div>

                            {(status === 'done' ? tasks.filter(t => t.status === 'done') : activeTasks.filter(t => t.status === status)).map(task => (
                                <Card key={task.id} className={cn(
                                    "border-none shadow-sm hover:shadow-md transition-all overflow-hidden",
                                    task.status === 'done' && "opacity-70 grayscale-[0.5]"
                                )}>
                                    {isAdmin && (
                                        <div className="px-3 py-1.5 bg-black/[0.03] flex justify-between items-center text-[9px] font-bold border-b">
                                            <span className="text-green-600">Profit: ${task.dealValue - task.editorPayout}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleDeleteTask(task.id)} className="text-red-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={10} />
                                                </button>
                                                <span className="text-muted-foreground uppercase opacity-50">${task.dealValue}</span>
                                            </div>
                                        </div>
                                    )}

                                    {task.status === 'in-review' && task.thumbnail && (
                                        <div className="aspect-video bg-black relative group cursor-pointer" onClick={() => toast.info("Playing Preview...")}>
                                            <img src={task.thumbnail} alt="Preview" className="w-full h-full object-cover opacity-60" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Play size={24} className="text-white fill-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-3 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-xs font-bold leading-none truncate">{task.title}</h4>
                                            <div className="flex -space-x-1.5">
                                                {task.assigneeIds.map(id => (
                                                    <div key={id} className="h-5 w-5 rounded-full border border-background bg-muted flex items-center justify-center text-[7px] font-bold uppercase transition-transform hover:scale-110" title={INITIAL_EDITORS.find(e => e.id === id)?.name}>
                                                        {INITIAL_EDITORS.find(e => e.id === id)?.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[9px] font-bold uppercase">
                                                <button
                                                    onClick={() => task.status !== 'done' && handleOpenProgressDialog(task)}
                                                    className={cn("truncate text-left transition-colors", task.status !== 'done' && "text-primary hover:underline")}
                                                >
                                                    {task.statusLine || "Starting"}
                                                </button>
                                                <span className="text-muted-foreground">{task.progress}%</span>
                                            </div>
                                            <Progress value={task.progress} className="h-1" />
                                        </div>

                                        {task.status === 'in-review' && (
                                            <div className="flex gap-1.5 pt-1">
                                                <Button size="sm" className="h-7 text-[9px] flex-1 font-bold bg-green-600 hover:bg-green-700" onClick={() => handleReviewDecision(task.id, 'done')}>
                                                    <Check size={12} className="mr-1" /> Complete
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-7 text-[9px] flex-1 font-bold border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleReviewDecision(task.id, 'revise')}>
                                                    <ArrowLeft size={12} className="mr-1" /> Revise
                                                </Button>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-muted text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                                            <div className="flex items-center gap-2">
                                                {task.mediaSpecs.ratio === '9:16' ? <Smartphone size={10} /> : <Monitor size={10} />}
                                                <span>{task.dueDate.split('-').slice(1).join('/')}</span>
                                            </div>
                                            {task.readyForClient && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none h-4 text-[8px]">SUBMITTED</Badge>}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

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
