'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';

type ActionResult = {
  success: boolean;
  error?: string;
};

export type ReportedVideo = {
  videoId: string;
  title: string;
  ownerUsername: string | null;
  status: string;
  reportCount: number;
  reasons: string[];
};

// Obtiene videos que tienen al menos un reporte, agrupados
export async function getReportedVideos(): Promise<ReportedVideo[]> {
  const admin = await requireAdmin();
  if (!admin) return [];

  const supabase = createAdminClient();

  const { data: reports } = await supabase
    .from('video_reports')
    .select('video_id, reason, videos(id, title, status, profiles(username))');

  if (!reports) return [];

  const activeReports = reports.filter((r) => {
    const video = Array.isArray(r.videos) ? r.videos[0] : r.videos;
    return video?.status === 'active';
  });

  const grouped = new Map<string, ReportedVideo>();

  for (const report of activeReports) {
    const video = Array.isArray(report.videos) ? report.videos[0] : report.videos;
    if (!video) continue;

    const owner = Array.isArray(video.profiles) ? video.profiles[0] : video.profiles;

    const existing = grouped.get(video.id);
    if (existing) {
      existing.reportCount += 1;
      existing.reasons.push(report.reason);
    } else {
      grouped.set(video.id, {
        videoId: video.id,
        title: video.title,
        ownerUsername: owner?.username ?? null,
        status: video.status,
        reportCount: 1,
        reasons: [report.reason],
      });
    }
  }

  return Array.from(grouped.values()).sort((a, b) => b.reportCount - a.reportCount);
}

// Elimina (oculta) un video reportado
export async function removeVideo(videoId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) {
    return { success: false, error: 'No autorizado' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('videos').update({ status: 'removed' }).eq('id', videoId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/reportes');
  revalidatePath('/catalogo');
  return { success: true };
}

// Descarta los reportes de un video (lo deja activo, borra los reportes)
export async function dismissReports(videoId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) {
    return { success: false, error: 'No autorizado' };
  }

  const supabase = createAdminClient();

  const { error: statusError } = await supabase
    .from('videos')
    .update({ status: 'active' })
    .eq('id', videoId);

  if (statusError) {
    return { success: false, error: statusError.message };
  }

  const { error: deleteError } = await supabase.from('video_reports').delete().eq('video_id', videoId);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  revalidatePath('/admin/reportes');
  return { success: true };
}