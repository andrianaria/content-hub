import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Lock, PlayCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Video } from "@/lib/db"

interface VideoCardProps {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  const formattedDate = new Date(video.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
        <Image
          src={
            video.thumbnail ||
            `/placeholder.svg?height=200&width=400&query=video thumbnail for ${video.title.substring(0, 50)}`
          }
          alt={video.title}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <PlayCircle className="h-12 w-12 text-white" />
        </div>

        {video.is_premium && (
          <Badge className="absolute top-2 right-2 bg-secondary">
            <Lock className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )}
      </div>

      <CardHeader className="flex-1">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          {formattedDate}
        </div>
        <CardTitle className="line-clamp-2">{video.title}</CardTitle>
        {video.description && <CardDescription className="line-clamp-3">{video.description}</CardDescription>}
      </CardHeader>

      <CardContent className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/videos/${video.id}`}>{video.is_premium ? "Tonton Premium" : "Tonton Video"}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
