import { getVideos } from "@/lib/content"
import { getSession } from "@/lib/auth"
import { VideoCard } from "@/components/content/video-card"
import { ContentHeader } from "@/components/content/content-header"
import { PlayCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default async function VideosPage() {
  const [videos, session] = await Promise.all([getVideos(), getSession()])

  if (!session) {
    redirect("/login")
  }

  const freeVideos = videos.filter((video) => !video.is_premium)
  const premiumVideos = videos.filter((video) => video.is_premium)

  return (
    <div className="min-h-screen bg-background">
      <ContentHeader user={session} title="Video" />

      <div className="container py-8 px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <PlayCircle className="h-8 w-8 mr-3 text-primary" />
            Koleksi Video
          </h1>
          <p className="text-muted-foreground">
            Tonton video tutorial berkualitas untuk pembelajaran yang lebih interaktif
          </p>
        </div>

        {/* Free Videos */}
        {freeVideos.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Video Gratis</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Premium Videos */}
        {premiumVideos.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Video Premium</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {videos.length === 0 && (
          <div className="text-center py-12">
            <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Belum ada video</h3>
            <p className="text-muted-foreground">Video akan segera tersedia. Pantai terus!</p>
          </div>
        )}
      </div>
    </div>
  )
}
