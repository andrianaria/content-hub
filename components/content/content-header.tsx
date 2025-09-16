import { Button } from "@/components/ui/button"
import { BookOpen, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { SessionUser } from "@/lib/auth"

interface ContentHeaderProps {
  user: SessionUser | null
  title: string
}

export function ContentHeader({ user, title }: ContentHeaderProps) {
  const membershipLabels = {
    free: "Gratis",
    paket_a: "Paket A",
    paket_b: "Paket B",
    paket_c: "Paket C",
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">ContentHub</span>
        </Link>

        {user && (
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
        )}

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Badge variant="secondary">{membershipLabels[user.membership_type]}</Badge>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <form action="/api/auth/logout" method="POST">
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
