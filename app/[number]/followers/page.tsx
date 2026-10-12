import FollowListPage from '@/components/FollowListPage'
export default async function Page({ params }: { params: { number: string } }) {
  return await FollowListPage({ number: params.number, kind: 'followers' })
}
