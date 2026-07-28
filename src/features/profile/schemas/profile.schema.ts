import { z } from 'zod';

export const editProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(30, 'El nombre de usuario debe tener máximo 30 caracteres')
    .regex(
      /^[a-z0-9_-]+$/,
      'Solo se permiten letras minúsculas, números, guiones y guiones bajos',
    ),
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  bio: z.string().max(500, 'La biografía debe tener máximo 500 caracteres').optional(),
  city: z.string().max(100, 'La ciudad debe tener máximo 100 caracteres').optional(),
  skills: z
    .array(z.string().min(1).max(40))
    .max(20, 'Puedes agregar máximo 20 habilidades')
    .default([]),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;