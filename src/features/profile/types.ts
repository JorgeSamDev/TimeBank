export type ProfileVideo = {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  createdAt: string;
};

export type PublicProfile = {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  skills: string[];
  hours: number;
  rating: number;
  videos: ProfileVideo[];
};
