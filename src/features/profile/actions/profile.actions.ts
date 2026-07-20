'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  publicProfileSchema,
  videoSchema,
  type PublicProfileInput,
  type VideoInput,
} from '../schemas/profile.schema';
import type { PublicProfile } from '../types';

type ActionResult = {
  success: boolean;
  error?: string;
};

// Obtiene un perfil público por su username (para la página /perfil/[username])
export async function getPublicProfileByUsername(
  username: string,
): Promise<PublicProfile | null> {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from('public_profiles')
    .select('id, username, avatar_url, bio, city, skills, hours, rating')
    .eq('username', username)
    .maybeSingle();

  if (error || !profile) {
    return null;
  }

  const { data: videos } = await supabase
    .from('profile_videos')
    .select('id, title, video_url, thumbnail_url, created_at')
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false });

  return {
    id: profile.id,
    username: profile.username,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    city: profile.city,
    skills: profile.skills ?? [],
    hours: Number(profile.hours),
    rating: Number(profile.rating),
    videos: (videos ?? []).map((v) => ({
      id: v.id,
      title: v.title,
      videoUrl: v.video_url,
      thumbnailUrl: v.thumbnail_url,
      createdAt: v.created_at,
    })),
  };
}

// Obtiene el perfil público del usuario logueado (para precargar el formulario de edición)
export async function getMyPublicProfile(): Promise<PublicProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('public_profiles')
    .select('id, username, avatar_url, bio, city, skills, hours, rating')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  const { data: videos } = await supabase
    .from('profile_videos')
    .select('id, title, video_url, thumbnail_url, created_at')
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false });

  return {
    id: profile.id,
    username: profile.username,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    city: profile.city,
    skills: profile.skills ?? [],
    hours: Number(profile.hours),
    rating: Number(profile.rating),
    videos: (videos ?? []).map((v) => ({
      id: v.id,
      title: v.title,
      videoUrl: v.video_url,
      thumbnailUrl: v.thumbnail_url,
      createdAt: v.created_at,
    })),
  };
}

// Crea o actualiza (upsert) el perfil público del usuario logueado
export async function upsertPublicProfile(input: PublicProfileInput): Promise<ActionResult> {
  const parsed = publicProfileSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: 'Datos inválidos' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Debes iniciar sesión' };
  }

  const { username, bio, city, avatarUrl, skills } = parsed.data;

  const { error } = await supabase.from('public_profiles').upsert({
    id: user.id,
    username,
    bio: bio || null,
    city: city || null,
    avatar_url: avatarUrl || null,
    skills,
  });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Ese nombre de usuario ya está en uso' };
    }
    return { success: false, error: error.message };
  }

  revalidatePath(`/perfil/${username}`);
  revalidatePath('/dashboard/perfil');

  return { success: true };
}

// Agrega un video al perfil público del usuario logueado
export async function addProfileVideo(input: VideoInput): Promise<ActionResult> {
  const parsed = videoSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: 'Datos inválidos' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Debes iniciar sesión' };
  }

  const { title, videoUrl, thumbnailUrl } = parsed.data;

  const { error } = await supabase.from('profile_videos').insert({
    profile_id: user.id,
    title,
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/perfil');

  return { success: true };
}

// Elimina un video del perfil público del usuario logueado
export async function deleteProfileVideo(videoId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Debes iniciar sesión' };
  }

  const { error } = await supabase
    .from('profile_videos')
    .delete()
    .eq('id', videoId)
    .eq('profile_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/perfil');

  return { success: true };
}
