import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen } from "lucide-react"
import Link from "next/link"

interface LoginPageProps {
  searchParams: { error?: string }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const getErrorMessage = (error: string) => {
    switch (error) {
      case "missing_code":
        return "Kode otorisasi tidak ditemukan. Silakan coba lagi."
      case "oauth_failed":
        return "Login dengan Google gagal. Silakan coba lagi."
      default:
        return "Terjadi kesalahan. Silakan coba lagi."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold">
            <BookOpen className="h-8 w-8 text-primary" />
            <span>ContentHub</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Masuk ke Akun Anda</CardTitle>
            <CardDescription>Masukkan email dan password untuk mengakses konten premium</CardDescription>
          </CardHeader>
          <CardContent>
            {searchParams.error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{getErrorMessage(searchParams.error)}</AlertDescription>
              </Alert>
            )}

            <LoginForm />
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Belum punya akun? </span>
              <Link href="/register" className="text-primary hover:underline font-medium">
                Daftar sekarang
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
