'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { editProfileSchema, type EditProfileInput } from '../schemas/profile.schema';
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
    .from('profiles')
    .select('id, username, full_name, avatar_url, bio, city, skills')
    .eq('username', username)
    .maybeSingle();

  if (error || !profile) {
    return null;
  }

  return {
    id: profile.id,
    username: profile.username,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    city: profile.city,
    skills: profile.skills ?? [],
  };
}

// Obtiene el perfil del usuario logueado (para precargar el formulario de edición)
export async function getMyProfile(): Promise<PublicProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, bio, city, skills')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    username: profile.username,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    city: profile.city,
    skills: profile.skills ?? [],
  };
}

// Actualiza el perfil del usuario logueado
export async function updateProfile(input: EditProfileInput): Promise<ActionResult> {
  const parsed = editProfileSchema.safeParse(input);

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

  const { username, fullName, bio, city, skills } = parsed.data;

  const { error } = await supabase
    .from('profiles')
    .update({
      username,
      full_name: fullName,
      bio: bio || null,
      city: city || null,
      skills,
    })
    .eq('id', user.id);

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