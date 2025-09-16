import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Article } from "@/lib/db"

interface ArticleCardProps {
  article: Article
  showFullContent?: boolean
}

export function ArticleCard({ article, showFullContent = false }: ArticleCardProps) {
  const formattedDate = new Date(article.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <Image
          src={
            article.thumbnail ||
            `/placeholder.svg?height=200&width=400&query=article about ${article.title.substring(0, 50)}`
          }
          alt={article.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {article.is_premium && (
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
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {showFullContent ? article.content : `${article.content.substring(0, 150)}...`}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/articles/${article.id}`}>{article.is_premium ? "Baca Premium" : "Baca Artikel"}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
