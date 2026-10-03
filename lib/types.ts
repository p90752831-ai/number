export type ExtraLink = { label: string; url: string }
export type Profile = {
  id: string; number: number; name: string | null; username: string | null; bio: string | null
  avatar_url: string | null; telegram: string | null; instagram: string | null; vk: string | null
  website: string | null; links: ExtraLink[] | null
}
