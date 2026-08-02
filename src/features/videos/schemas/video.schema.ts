import { z } from 'zod';

export const VIDEO_CATEGORIES = [
  'musica',
  'cocina',
  'idiomas',
  'tecnologia',
  'deporte',
  'arte',
  'negocios',
  'bienestar',
  'otro',
] as const;

export const createVideoSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
  description: z.string().max(1000, 'La descripción debe tener máximo 1000 caracteres').optional(),
  category: z.enum(VIDEO_CATEGORIES, { message: 'Selecciona una categoría válida' }),
  videoUrl: z.url('URL de video inválida'),
  thumbnailUrl: z.url('URL de miniatura inválida').optional(),
  durationSeconds: z
    .number()
    .int()
    .positive('La duración debe ser mayor a 0'),
});

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type VideoCategory = (typeof VIDEO_CATEGORIES)[number];