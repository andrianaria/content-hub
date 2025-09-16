import { getArticles } from "@/lib/content"
import { getSession } from "@/lib/auth"
import { ArticleCard } from "@/components/content/article-card"
import { ContentHeader } from "@/components/content/content-header"
import { BookOpen } from "lucide-react"
import { redirect } from "next/navigation"

export default async function ArticlesPage() {
  const [articles, session] = await Promise.all([getArticles(), getSession()])

  if (!session) {
    redirect("/login")
  }

  const freeArticles = articles.filter((article) => !article.is_premium)
  const premiumArticles = articles.filter((article) => article.is_premium)

  return (
    <div className="min-h-screen bg-background">
      <ContentHeader user={session} title="Artikel" />

      <div className="container py-8 px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <BookOpen className="h-8 w-8 mr-3 text-primary" />
            Koleksi Artikel
          </h1>
          <p className="text-muted-foreground">
            Temukan artikel berkualitas untuk mengembangkan skill dan pengetahuan Anda
          </p>
        </div>

        {/* Free Articles */}
        {freeArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Artikel Gratis</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Premium Articles */}
        {premiumArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Artikel Premium</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {articles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Belum ada artikel</h3>
            <p className="text-muted-foreground">Artikel akan segera tersedia. Pantau terus!</p>
          </div>
        )}
      </div>
    </div>
  )
}
