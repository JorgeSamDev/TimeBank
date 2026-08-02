'use server';

import { createClient } from '@/lib/supabase/server';

type ActionResult = {
  success: boolean;
  error?: string;
};

// Calcula el saldo actual sumando todas las transacciones del usuario
export async function getMyBalance(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return 0;
  }

  const { data, error } = await supabase
    .from('credit_transactions')
    .select('amount_hours')
    .eq('user_id', user.id);

  if (error || !data) {
    return 0;
  }

  return data.reduce((sum, tx) => sum + Number(tx.amount_hours), 0);
}

// Otorga crédito al subir un video (llamado desde createVideo)
export async function grantUploadCredit(userId: string, videoId: string, durationSeconds: number): Promise<void> {
  const supabase = await createClient();
  const hours = durationSeconds / 3600;

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount_hours: hours,
    type: 'video_upload',
    video_id: videoId,
  });
}
export async function chargeForView(videoId: string, durationSeconds: number): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Debes iniciar sesión' };
  }

  // Si ya pagó (o usó su vista gratis) por este video antes, no cobrar de nuevo.
  const { data: existingView } = await supabase
    .from('credit_transactions')
    .select('id')
    .eq('user_id', user.id)
    .eq('video_id', videoId)
    .in('type', ['video_view', 'free_view'])
    .maybeSingle();

  if (existingView) {
    return { success: true };
  }

  const costHours = durationSeconds / 3600;
  const balance = await getMyBalance();

  if (balance >= costHours) {
    await supabase.from('credit_transactions').insert({
      user_id: user.id,
      amount_hours: -costHours,
      type: 'video_view',
      video_id: videoId,
    });

    return { success: true };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('has_used_free_view')
    .eq('id', user.id)
    .single();

  if (profile && !profile.has_used_free_view) {
    await supabase.from('credit_transactions').insert({
      user_id: user.id,
      amount_hours: 0,
      type: 'free_view',
      video_id: videoId,
    });

    await supabase.from('profiles').update({ has_used_free_view: true }).eq('id', user.id);

    return { success: true };
  }

  return {
    success: false,
    error: `Necesitas ${costHours.toFixed(2)} horas de crédito. Tienes ${balance.toFixed(2)}.`,
  };
}