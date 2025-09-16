import { getPaymentTransaction, getPaymentInstructions, PAYMENT_METHODS } from "@/lib/payment"
import { getSession } from "@/lib/auth"
import { getMembershipPlanById } from "@/lib/membership"
import { ContentHeader } from "@/components/content/content-header"
import { PaymentInstructions } from "@/components/payment/payment-instructions"
import { PaymentStatus } from "@/components/payment/payment-status"
import { notFound, redirect } from "next/navigation"

interface PaymentPageProps {
  params: Promise<{ transactionId: string }>
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { transactionId } = await params
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const transaction = await getPaymentTransaction(transactionId)

  if (!transaction || transaction.user_id !== session.id) {
    notFound()
  }

  const plan = getMembershipPlanById(transaction.plan_id)
  const paymentMethod = PAYMENT_METHODS.find((method) => method.id === transaction.payment_method)

  if (!plan || !paymentMethod) {
    notFound()
  }

  const instructions = getPaymentInstructions(
    transaction.payment_method,
    transaction.payment_code || "",
    transaction.amount,
  )

  return (
    <div className="min-h-screen bg-background">
      <ContentHeader user={session} title="Pembayaran" />

      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <PaymentStatus transaction={transaction} plan={plan} />
          <PaymentInstructions
            transaction={transaction}
            paymentMethod={paymentMethod}
            instructions={instructions}
            plan={plan}
          />
        </div>
      </div>
    </div>
  )
}
