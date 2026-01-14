import { MarketRoutes } from '@/lib/routes'
import Link from 'next/link'

export default async function NotFound({ params }: { params: { id: string } }) {
  const { id } = params || {}
  // const headersList = await headers();
  // const domain = headersList.get('host');
  // const data = await getSiteData(domain);

  if (!id) {
    return (
      <div>
        <h2>Not Found</h2>
        <p>Could not find the requested resource</p>
        <p>
          View <Link href='/blog'>all posts</Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2>Not Found</h2>
      <p>Box avec l'ID: {id} n'existe pas</p>
      <Link href={MarketRoutes.offres}>voir les autres offres</Link>
    </div>
  )
}
