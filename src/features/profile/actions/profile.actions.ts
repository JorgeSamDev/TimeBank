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
// Sube el avatar del usuario logueado a Supabase Storage y actualiza avatar_url
export async function uploadAvatar(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const file = formData.get('avatar');

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: 'Selecciona una imagen válida' };
  }

  // Validaciones de seguridad: tipo y tamaño de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Solo se permiten imágenes JPG, PNG o WebP' };
  }

  const maxSizeBytes = 2 * 1024 * 1024; // 2 MB
  if (file.size > maxSizeBytes) {
    return { success: false, error: 'La imagen no debe superar 2MB' };
  }

  const extension = file.name.split('.').pop();
  const path = `${user.id}/avatar.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(path);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath('/dashboard/perfil');
  return { success: true };
}