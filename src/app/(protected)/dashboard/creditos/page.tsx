import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getMyTransactions, getMyBalance } from '@/features/credits/actions/credit.actions';
import { TransactionHistory } from '@/features/credits/components/transaction-history';
import { PageBackground } from '@/components/shared/page-background';

export default async function CreditsPage() {
  const [transactions, balance] = await Promise.all([getMyTransactions(), getMyBalance()]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10">
      <PageBackground src="/images/dashboard.jpg" />

      <Link
        href="/dashboard"
        className="glass flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--tb-mist)] hover:text-[var(--tb-paper)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al dashboard
      </Link>

      <div className="glass flex items-center justify-between rounded-2xl p-6">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--tb-paper)]">
            Tus créditos
          </h1>
          <p className="text-sm text-muted-foreground">Historial de horas ganadas y gastadas.</p>
        </div>
        <span className="font-mono text-2xl font-semibold text-[var(--tb-ember)]">
          {balance.toFixed(2)} hrs
        </span>
      </div>

      <TransactionHistory transactions={transactions} />
    </div>
  );
}