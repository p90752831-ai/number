export type Profile = { id: string; number: number; name: string | null; bio: string | null; avatar_url: string | null; is_private: boolean }
export type LinkKind = 'telegram' | 'instagram' | 'vk' | 'website' | 'other'
export type Link = { id?: string; kind: LinkKind; label: string | null; url: string; visibility: 'public' | 'followers' }
export type Follow = { id: string; follower: string; following: string; status: 'pending' | 'accepted' }
export type Author = { number: number; name: string | null; avatar_url: string | null }
export type Post = { id: string; user_id: string; body: string; image_url: string | null; created_at: string; updated_at: string; profiles: Author | null }
export type Comment = { id: string; post_id: string; user_id: string; body: string; created_at: string; profiles: Author | null }
