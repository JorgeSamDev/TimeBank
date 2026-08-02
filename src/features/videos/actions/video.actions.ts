'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createVideoSchema, type CreateVideoInput } from '../schemas/video.schema';

type ActionResult = {
  success: boolean;
  error?: string;
  videoId?: string;
};

// Guarda la metadata del video DESPUÉS de que el archivo ya se subió
// directo a Supabase Storage desde el navegador.
export async function createVideo(input: CreateVideoInput): Promise<ActionResult> {
  const parsed = createVideoSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: 'Datos inválidos' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { title, description, category, videoUrl, thumbnailUrl, durationSeconds } = parsed.data;

  const { data, error } = await supabase
    .from('videos')
    .insert({
      owner_id: user.id,
      title,
      description: description || null,
      category,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl || null,
      duration_seconds: durationSeconds,
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true, videoId: data.id };
}