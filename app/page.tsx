import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, BookOpen, Users, Star } from "lucide-react"
import Link from "next/link"
import { ContentHeader } from "@/components/content/content-header"
import { getSession } from "@/lib/auth"

export default async function HomePage() {
  const session = await getSession()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ContentHeader user={session} title="ContentHub" />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Platform Konten Premium untuk
            <span className="text-primary"> Pengembangan Skill</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Akses ribuan artikel dan video berkualitas tinggi untuk mengembangkan kemampuan programming, design, dan
            digital marketing Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/articles">Jelajahi Artikel</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/videos">Tonton Video</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Mengapa Memilih ContentHub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Artikel Berkualitas</CardTitle>
                <CardDescription>
                  Artikel mendalam yang ditulis oleh praktisi berpengalaman di bidangnya
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <PlayCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Video Tutorial</CardTitle>
                <CardDescription>Video pembelajaran step-by-step yang mudah diikuti dan dipraktikkan</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Komunitas Aktif</CardTitle>
                <CardDescription>Bergabung dengan komunitas learner yang saling mendukung dan berbagi</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Pilih Paket Membership</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Paket A */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-center">Paket A</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">Rp 99.000</span>
                  <span className="text-muted-foreground">/bulan</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Akses 5 artikel premium
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Akses 5 video tutorial
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Support email
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/register?plan=paket_a">Pilih Paket A</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Paket B */}
            <Card className="relative border-primary">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Populer</Badge>
              <CardHeader>
                <CardTitle className="text-center">Paket B</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">Rp 199.000</span>
                  <span className="text-muted-foreground">/bulan</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Akses 10 artikel premium
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Akses 10 video tutorial
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Akses komunitas Discord
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/register?plan=paket_b">Pilih Paket B</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Paket C */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-center">Paket C</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">Rp 299.000</span>
                  <span className="text-muted-foreground">/bulan</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Akses unlimited artikel
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Akses unlimited video
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    1-on-1 mentoring session
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Sertifikat completion
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/register?plan=paket_c">Pilih Paket C</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ContentHub</span>
              </div>
              <p className="text-muted-foreground">
                Platform pembelajaran online terbaik untuk mengembangkan skill digital Anda.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Konten</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/articles" className="hover:text-primary">
                    Artikel
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="hover:text-primary">
                    Video
                  </Link>
                </li>
                <li>
                  <Link href="/membership" className="hover:text-primary">
                    Membership
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Perusahaan</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Kontak
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary">
                    Karir
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Bantuan</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/faq" className="hover:text-primary">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-primary">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ContentHub. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
