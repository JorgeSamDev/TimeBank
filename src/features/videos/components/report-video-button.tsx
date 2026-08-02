'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { reportVideo } from '../actions/video.actions';

export function ReportVideoButton({ videoId }: { videoId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (reason.trim().length < 5) {
      setError('Describe brevemente el motivo (mínimo 5 caracteres)');
      return;
    }

    setStatus('sending');
    setError(null);

    const result = await reportVideo(videoId, reason.trim());

    if (!result.success) {
      setError(result.error ?? 'Error al reportar');
      setStatus('error');
      return;
    }

    setStatus('sent');
  }

  if (status === 'sent') {
    return <p className="text-sm text-muted-foreground">Gracias, revisaremos este video.</p>;
  }

  if (!isOpen) {
    return (
      <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        Reportar video
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="¿Por qué reportas este video?"
        rows={3}
        disabled={status === 'sending'}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={handleSubmit} disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando...' : 'Enviar reporte'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}