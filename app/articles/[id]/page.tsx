import { getArticleById, canUserAccessContent, recordContentAccess } from "@/lib/content"
import { getSession } from "@/lib/auth"
import { ContentHeader } from "@/components/content/content-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

interface ArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params
  const articleId = Number.parseInt(id)

  if (isNaN(articleId)) {
    notFound()
  }

  const [article, session] = await Promise.all([getArticleById(articleId), getSession()])

  if (!article) {
    notFound()
  }

  const accessCheck = await canUserAccessContent(session, "article", article.is_premium)

  if (accessCheck.canAccess && session && session.membership_type !== "free") {
    await recordContentAccess(session.id, "article", article.id)
  }

  const formattedDate = new Date(article.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <ContentHeader user={session} title="Artikel" />

      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/articles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Artikel
            </Link>
          </Button>
        </div>

        <article className="max-w-4xl mx-auto">
          {article.thumbnail && (
            <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
              <Image src={article.thumbnail || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {formattedDate}
              </div>
              {article.is_premium && (
                <Badge variant="secondary">
                  <Lock className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{article.title}</h1>
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
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">{article.content}</div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
