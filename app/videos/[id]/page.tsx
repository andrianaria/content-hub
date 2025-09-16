import { getVideoById, canUserAccessContent, recordContentAccess } from "@/lib/content"
import { getSession } from "@/lib/auth"
import { ContentHeader } from "@/components/content/content-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Lock, ArrowLeft, PlayCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface VideoPageProps {
  params: Promise<{ id: string }>
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params
  const videoId = Number.parseInt(id)

  if (isNaN(videoId)) {
    notFound()
  }

  const [video, session] = await Promise.all([getVideoById(videoId), getSession()])

  if (!video) {
    notFound()
  }

  const accessCheck = await canUserAccessContent(session, "video", video.is_premium)

  if (accessCheck.canAccess && session && session.membership_type !== "free") {
    await recordContentAccess(session.id, "video", video.id)
  }

  const formattedDate = new Date(video.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <ContentHeader user={session} title="Video" />

      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/videos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Video
            </Link>
          </Button>
        </div>

        <article className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {formattedDate}
              </div>
              {video.is_premium && (
                <Badge variant="secondary">
                  <Lock className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{video.title}</h1>
          </div>

          {!accessCheck.canAccess ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <Lock className="h-5 w-5 mr-2" />
                  Konten Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>{accessCheck.reason}</AlertDescription>
                </Alert>
                <div className="flex gap-4">
                  {!session ? (
                    <>
                      <Button asChild>
                        <Link href="/login">Masuk</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/register">Daftar</Link>
                      </Button>
                    </>
                  ) : (
                    <Button asChild>
                      <Link href="/membership">Upgrade Membership</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Video Player */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Video Player akan ditampilkan di sini</p>
                  <Button asChild>
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      Tonton di Platform Eksternal
                    </a>
                  </Button>
                </div>
              </div>

              {/* Video Description */}
              {video.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Deskripsi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{video.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
