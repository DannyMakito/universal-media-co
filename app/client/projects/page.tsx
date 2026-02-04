import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Eye, MessageSquare, Download } from "lucide-react"

const projects = [
    { id: 1, name: "Brand Video Campaign", description: "Full brand awareness video package", progress: 75, status: "In Progress", lastUpdate: "2 hours ago", deliverables: 5, comments: 12 },
    { id: 2, name: "Social Media Package", description: "15 social media clips for Q1", progress: 90, status: "Review", lastUpdate: "30 min ago", deliverables: 15, comments: 8 },
    { id: 3, name: "Product Launch Video", description: "Hero video for new product line", progress: 30, status: "In Progress", lastUpdate: "1 day ago", deliverables: 2, comments: 5 },
]

export default function ClientProjectsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
                <p className="text-muted-foreground">View and manage your project details</p>
            </div>

            <div className="grid gap-6">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle>{project.name}</CardTitle>
                                    <CardDescription>{project.description}</CardDescription>
                                </div>
                                <Badge variant={project.status === "Review" ? "default" : "secondary"}>{project.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2" />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <span>{project.deliverables} deliverables</span>
                                    <span>{project.comments} comments</span>
                                    <span>Updated {project.lastUpdate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm">
                                        <Eye className="mr-1 h-4 w-4" />View
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <MessageSquare className="mr-1 h-4 w-4" />Comment
                                    </Button>
                                    {project.progress === 100 && (
                                        <Button variant="ghost" size="sm">
                                            <Download className="mr-1 h-4 w-4" />Download
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
