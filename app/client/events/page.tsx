"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function ClientEventsPage() {
    const events = useQuery(api.events.getEvents)
    
    if (events === undefined) {
        return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
    }

    const activeEvents = events.filter(e => e.status === "active")

    return (
        <div className="flex-1 space-y-8 w-full max-w-2xl mx-auto p-4 md:p-8">
            <div className="space-y-12">
                {activeEvents.map(event => (
                    <EventClientCard key={event._id} event={event} />
                ))}
                
                {activeEvents.length === 0 && (
                    <div className="text-center p-12 border rounded-3xl bg-muted/10 shadow-sm">
                        <h3 className="text-lg font-medium">No active competitions</h3>
                        <p className="text-muted-foreground mt-2">Check back later for new events to win prizes!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function EventClientCard({ event }: any) {
    const stats = useQuery(api.events.getEventStats, { eventId: event._id })
    
    return (
        <Card className="rounded-[32px] overflow-hidden border-none bg-background shadow-md shadow-black/5 hover:shadow-lg transition-shadow duration-300">
            {/* Stats Header */}
            <div className="grid grid-cols-3 divide-x divide-border/40 py-5">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[28px] leading-none font-bold text-foreground">
                        {stats ? stats.yourEntries : "-"}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide mt-2">Your entries</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[28px] leading-none font-bold text-foreground">
                        {stats ? stats.totalEntries.toLocaleString() : "-"}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide mt-2">Total entries</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[28px] leading-none font-bold text-foreground">
                        {stats ? stats.daysLeft : "-"}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide mt-2">Days left</span>
                </div>
            </div>

            {/* Media Area */}
            <div className="w-full aspect-[4/3] relative bg-black/5 shadow-inner">
                {event.mediaUrl ? (
                    event.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                        <video src={event.mediaUrl} autoPlay loop muted className="w-full h-full object-cover rounded-t-[32px]" />
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={event.mediaUrl} alt={event.title} className="w-full h-full object-cover rounded-[16px] p-2" style={{ borderRadius: '24px' }} />
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-medium">
                        Media Unavailable
                    </div>
                )}
            </div>

            {/* Content Footer */}
            <div className="text-center p-8 space-y-4">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{event.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {event.description}
                </p>
            </div>
        </Card>
    )
}
