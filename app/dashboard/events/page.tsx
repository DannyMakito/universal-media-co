"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Trophy, Plus } from "lucide-react"

export default function AdminEventsPage() {
    const events = useQuery(api.events.getEvents)
    const createEvent = useMutation(api.events.createEvent)
    const generateUploadUrl = useMutation(api.events.generateUploadUrl)
    const generateWinner = useMutation(api.events.generateWinner)
    
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [mediaUrl, setMediaUrl] = useState("")
    const [amountPerEntry, setAmountPerEntry] = useState(1000)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        try {
            let mediaStorageId = undefined
            if (selectedFile) {
                const uploadUrl = await generateUploadUrl()
                const result = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": selectedFile.type },
                    body: selectedFile,
                })
                const { storageId } = await result.json()
                mediaStorageId = storageId
            }
            
            await createEvent({
                title,
                description,
                mediaUrl: mediaUrl || undefined,
                mediaStorageId,
                startDate: new Date(startDate).getTime(),
                endDate: new Date(endDate).getTime(),
                amountPerEntry,
            })
            
            toast.success("Event created successfully")
            setIsCreateOpen(false)
        } catch (error: any) {
            toast.error(error.message || "Failed to create event")
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return (
        <div className="flex-1 space-y-6 w-full max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Competitions & Events</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full">
                            <Plus className="mr-2 h-4 w-4" /> Create Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Competition</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateEvent} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={description} onChange={e => setDescription(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Amount Per Entry (e.g. 1000 for R1000)</Label>
                                <Input type="number" value={amountPerEntry} onChange={e => setAmountPerEntry(Number(e.target.value))} required />
                            </div>
                            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                                <h3 className="font-semibold text-sm">Media Settings</h3>
                                <div className="space-y-2">
                                    <Label>Upload Image/Video</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="file" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                                        {selectedFile && <Button type="button" variant="ghost" onClick={() => setSelectedFile(null)}>Clear</Button>}
                                    </div>
                                </div>
                                <div className="text-center text-sm text-muted-foreground">OR</div>
                                <div className="space-y-2">
                                    <Label>External Media URL</Label>
                                    <Input type="url" placeholder="https://..." value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} disabled={!!selectedFile} />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Event"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="grid gap-6">
                {events?.map(event => (
                    <EventAdminCard key={event._id} event={event} generateWinner={generateWinner} />
                ))}
                {events?.length === 0 && (
                    <div className="text-center p-12 border rounded-xl bg-muted/10">
                        <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium">No competitions yet</h3>
                        <p className="text-muted-foreground">Create your first event to start generating entries.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function EventAdminCard({ event, generateWinner }: any) {
    const winners = useQuery(api.events.getEventWinners, { eventId: event._id })
    const [isGenerating, setIsGenerating] = useState(false)
    
    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            await generateWinner({ eventId: event._id })
            toast.success("Winner generated successfully!")
        } catch (error: any) {
            toast.error(error.message || "Failed to generate winner")
        } finally {
            setIsGenerating(false)
        }
    }
    
    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {event.mediaUrl && (
                    <div className="md:w-1/3 aspect-video relative bg-black flex items-center justify-center overflow-hidden">
                        {event.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                            <video src={event.mediaUrl} autoPlay loop muted className="w-full h-full object-cover" />
                        ) : (
                            <img src={event.mediaUrl} alt={event.title} className="w-full h-full object-cover" />
                        )}
                    </div>
                )}
                <div className="flex-1 p-6 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            <div className="text-sm text-muted-foreground mt-1">
                                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
                            {event.status}
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed">{event.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg inline-flex">
                        <span>💰 1 entry per R{event.amountPerEntry} spent</span>
                    </div>
                    
                    <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">Winners</h4>
                        <div className="space-y-2 mb-4">
                            {winners?.map((w: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">🏆</div>
                                        <span className="font-medium">{w.client?.name}</span>
                                    </div>
                                    <span className="text-muted-foreground">{new Date(w.generatedAt).toLocaleString()}</span>
                                </div>
                            ))}
                            {winners?.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">No winners generated yet.</p>
                            )}
                        </div>
                        
                        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full md:w-auto">
                            <Trophy className="mr-2 h-4 w-4" />
                            {isGenerating ? "Drawing..." : "Draw Winner Randomly"}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
