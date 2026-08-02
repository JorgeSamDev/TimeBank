'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Video } from '../types';
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
export async function getMyVideos(): Promise<Video[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('videos')
    .select('id, owner_id, title, description, category, video_url, thumbnail_url, duration_seconds, status, created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((v) => ({
    id: v.id,
    ownerId: v.owner_id,
    title: v.title,
    description: v.description,
    category: v.category,
    videoUrl: v.video_url,
    thumbnailUrl: v.thumbnail_url,
    durationSeconds: v.duration_seconds,
    status: v.status,
    createdAt: v.created_at,
  }));
}