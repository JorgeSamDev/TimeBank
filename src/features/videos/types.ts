export type Video = {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  category: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number;
  status: 'active' | 'reported' | 'removed';
  createdAt: string;
};