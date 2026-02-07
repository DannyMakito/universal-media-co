/**
 * Tasks Page - Dashboard Portal
 * 
 * A task management page with filtering by status and priority.
 * Features: search, status/priority filters, stats cards, interactive task list.
 * 
 * @added 2026-02-04
 * @route /dashboard/tasks
 */
"use client"

import { useState } from "react"
import {
    CheckSquare,
    Circle,
    Clock,
    Plus,
    Filter,
    Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

type TaskStatus = "todo" | "in-progress" | "done"
type TaskPriority = "low" | "medium" | "high"

interface Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    dueDate: string
    assignee: string
}

const initialTasks: Task[] = [
    {
        id: "1",
        title: "Design new landing page",
        description: "Create mockups for the new marketing landing page",
        status: "in-progress",
        priority: "high",
        dueDate: "2026-02-10",
        assignee: "John Doe",
    },
    {
        id: "2",
        title: "Review API documentation",
        description: "Update API docs with new endpoints",
        status: "todo",
        priority: "medium",
        dueDate: "2026-02-12",
        assignee: "Jane Smith",
    },
    {
        id: "3",
        title: "Fix authentication bug",
        description: "Users are being logged out unexpectedly",
        status: "done",
        priority: "high",
        dueDate: "2026-02-05",
        assignee: "Mike Johnson",
    },
    {
        id: "4",
        title: "Update dependencies",
        description: "Upgrade all npm packages to latest versions",
        status: "todo",
        priority: "low",
        dueDate: "2026-02-15",
        assignee: "Sarah Wilson",
    },
    {
        id: "5",
        title: "Write unit tests",
        description: "Add tests for the new user module",
        status: "in-progress",
        priority: "medium",
        dueDate: "2026-02-08",
        assignee: "John Doe",
    },
    {
        id: "6",
        title: "Setup CI/CD pipeline",
        description: "Configure GitHub Actions for automated deployment",
        status: "done",
        priority: "high",
        dueDate: "2026-02-03",
        assignee: "Mike Johnson",
    },
]

const statusConfig = {
    "todo": { label: "To Do", icon: Circle, color: "text-gray-500" },
    "in-progress": { label: "In Progress", icon: Clock, color: "text-blue-500" },
    "done": { label: "Done", icon: CheckSquare, color: "text-green-500" },
}

const priorityConfig = {
    "low": { label: "Low", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    "medium": { label: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
    "high": { label: "High", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all")

    const filteredTasks = tasks
        .filter((task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((task) => statusFilter === "all" || task.status === statusFilter)
        .filter((task) => priorityFilter === "all" || task.priority === priorityFilter)

    const toggleTaskStatus = (taskId: string) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                const nextStatus: Record<TaskStatus, TaskStatus> = {
                    "todo": "in-progress",
                    "in-progress": "done",
                    "done": "todo"
                }
                return { ...task, status: nextStatus[task.status] }
            }
            return task
        }))
    }

    const tasksByStatus = {
        todo: filteredTasks.filter(t => t.status === "todo"),
        "in-progress": filteredTasks.filter(t => t.status === "in-progress"),
        done: filteredTasks.filter(t => t.status === "done"),
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground">
                        Manage and track your tasks
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 w-full sm:w-[250px]"
                />
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TaskStatus | "all")}>
                    <SelectTrigger className="w-[140px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as TaskPriority | "all")}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            {/* Task Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                {(["todo", "in-progress", "done"] as TaskStatus[]).map((status) => {
                    const config = statusConfig[status]
                    const Icon = config.icon
                    return (
                        <Card key={status}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
                                <Icon className={`h-4 w-4 ${config.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{tasksByStatus[status].length}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Task List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Tasks</CardTitle>
                    <CardDescription>Click on a task to change its status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredTasks.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No tasks found</p>
                        ) : (
                            filteredTasks.map((task) => {
                                const statusInfo = statusConfig[task.status]
                                const StatusIcon = statusInfo.icon
                                const priorityInfo = priorityConfig[task.priority]

                                return (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => toggleTaskStatus(task.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Checkbox checked={task.status === "done"} />
                                            <div>
                                                <h3 className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                                                    {task.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">{task.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="outline" className={priorityInfo.color}>
                                                {priorityInfo.label}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                                                <span className="text-sm">{statusInfo.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
