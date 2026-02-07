import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

const tasks = [
    { id: 1, title: "Edit main brand video - Final cut", project: "Acme Corp Campaign", priority: "High", due: "Today", completed: false },
    { id: 2, title: "Color grade social media clips", project: "TechStart Package", priority: "Medium", due: "Tomorrow", completed: false },
    { id: 3, title: "Add motion graphics to intro", project: "Acme Corp Campaign", priority: "High", due: "Feb 8", completed: false },
    { id: 4, title: "Export 4K and 1080p versions", project: "TechStart Package", priority: "Low", due: "Feb 9", completed: true },
    { id: 5, title: "Review client feedback notes", project: "FreshFood Launch", priority: "Medium", due: "Feb 10", completed: false },
]

export default function EditorTasksPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                <p className="text-muted-foreground">Your assigned tasks and to-dos</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Tasks</CardTitle>
                    <CardDescription>Manage your workload</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div key={task.id} className={`flex items-start gap-4 rounded-lg border border-border p-4 ${task.completed ? 'opacity-60' : ''}`}>
                                <Checkbox checked={task.completed} className="mt-1" />
                                <div className="flex-1 space-y-1">
                                    <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                                    <p className="text-sm text-muted-foreground">{task.project}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"}>
                                        {task.priority}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">Due: {task.due}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
