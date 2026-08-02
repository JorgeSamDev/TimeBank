export type PublicProfile = {
  id: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  skills: string[];
  role?: 'user' | 'admin';
};