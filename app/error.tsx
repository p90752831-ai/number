'use client'
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card mx-auto mt-8 max-w-md text-center">
      <p className="text-xl font-bold">Something went wrong.</p>
      <p className="mt-2 text-mut">Check your connection and Supabase settings, then try again.</p>
      <button onClick={reset} className="btn-p mt-6">Try again</button>
    </div>
  )
}
