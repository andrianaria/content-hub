import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, PlayCircle, User, LogOut } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const membershipLabels = {
    free: "Gratis",
    paket_a: "Paket A",
    paket_b: "Paket B",
    paket_c: "Paket C",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ContentHub</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/articles" className="text-sm font-medium hover:text-primary transition-colors">
              Artikel
            </Link>
            <Link href="/videos" className="text-sm font-medium hover:text-primary transition-colors">
              Video
            </Link>
            <Link href="/membership" className="text-sm font-medium hover:text-primary transition-colors">
              Membership
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary">{membershipLabels[session.membership_type]}</Badge>
            <form action="/api/auth/logout" method="POST">
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container py-8 px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Selamat datang, {session.name}!</h1>
          <p className="text-muted-foreground">Kelola akun dan akses konten premium Anda</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profil Saya
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Nama:</span>
                <p className="font-medium">{session.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p className="font-medium">{session.email}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Membership:</span>
                <Badge className="ml-2">{membershipLabels[session.membership_type]}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Articles Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Artikel
              </CardTitle>
              <CardDescription>Akses koleksi artikel premium</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/articles">Baca Artikel</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Videos Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlayCircle className="h-5 w-5 mr-2" />
                Video
              </CardTitle>
              <CardDescription>Tonton video tutorial berkualitas</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/videos">Tonton Video</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
