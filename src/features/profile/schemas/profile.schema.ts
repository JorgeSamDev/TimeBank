import { z } from 'zod';

export const publicProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(30, 'El nombre de usuario debe tener máximo 30 caracteres')
    .regex(
      /^[a-z0-9_-]+$/,
      'Solo se permiten letras minúsculas, números, guiones y guiones bajos',
    ),
  bio: z.string().max(500, 'La biografía debe tener máximo 500 caracteres').optional(),
  city: z.string().max(100, 'La ciudad debe tener máximo 100 caracteres').optional(),
  avatarUrl: z.url('URL de imagen inválida').optional().or(z.literal('')),
  skills: z
    .array(z.string().min(1).max(40))
    .max(20, 'Puedes agregar máximo 20 habilidades')
    .default([]),
});

export type PublicProfileInput = z.infer<typeof publicProfileSchema>;

// Variante del schema para el formulario: las habilidades se capturan como
// texto separado por comas (más simple en la UI) en vez de un array.
export const publicProfileFormSchema = publicProfileSchema
  .omit({ skills: true })
  .extend({
    skillsText: z.string().optional().default(''),
  });

export type PublicProfileFormInput = z.infer<typeof publicProfileFormSchema>;

export const videoSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(100, 'Título muy largo'),
  videoUrl: z.url('URL de video inválida'),
  thumbnailUrl: z.url('URL de miniatura inválida').optional().or(z.literal('')),
});

export type VideoInput = z.infer<typeof videoSchema>;
