export default function SearchForm({ value = '' }: { value?: string }) {
  return (
    <form action="/search" className="flex w-full max-w-md gap-2">
      <div className="flex flex-1 items-center rounded-2xl border border-line bg-card px-4 focus-within:border-acc">
        <span className="text-xl font-extrabold text-acc">#</span>
        <input name="n" defaultValue={value} inputMode="numeric" pattern="[0-9]*" maxLength={6} required
          placeholder="728" aria-label="Number" className="w-full bg-transparent px-2 py-3 text-xl font-bold outline-none" />
      </div>
      <button className="btn-p">Find</button>
    </form>
  )
}
