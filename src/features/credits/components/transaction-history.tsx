import type { CreditTransaction } from '../actions/credit.actions';

const TYPE_LABELS: Record<CreditTransaction['type'], string> = {
  video_upload: 'Subiste un video',
  video_view: 'Viste un video',
  free_view: 'Primera vista gratis',
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function TransactionHistory({ transactions }: { transactions: CreditTransaction[] }) {
  if (transactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Todavía no tienes movimientos de créditos.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {transactions.map((tx) => {
        const isPositive = tx.amountHours > 0;
        const isFree = tx.type === 'free_view';

        return (
          <div
            key={tx.id}
            className="glass flex items-center justify-between gap-3 rounded-xl p-3"
          >
            <div>
              <p className="text-sm text-[var(--tb-paper)]">{TYPE_LABELS[tx.type]}</p>
              {tx.videoTitle && <p className="text-xs text-muted-foreground">{tx.videoTitle}</p>}
              <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
            </div>
            <span
              className={`font-mono text-sm font-medium ${
                isFree ? 'text-muted-foreground' : isPositive ? 'text-[var(--tb-tide)]' : 'text-[var(--tb-ember)]'
              }`}
            >
              {isFree ? 'Gratis' : `${isPositive ? '+' : ''}${tx.amountHours.toFixed(4)} hrs`}
            </span>
          </div>
        );
      })}
    </div>
  );
}