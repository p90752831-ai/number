export default function SearchForm({ value = '' }: { value?: string }) {
  return (
    <form action="/search" className="flex w-full max-w-md gap-2">
      <div className="flex flex-1 items-center rounded-full border border-line bg-card px-5 focus-within:border-acc">
        <span className="num text-xl text-acc">#</span>
        <input name="n" defaultValue={value} inputMode="numeric" pattern="[0-9]*" maxLength={6} required placeholder="728"
          aria-label="Номер" className="num w-full bg-transparent px-2 py-3 text-xl outline-none placeholder:text-mut" />
      </div>
      <button className="btn-p">Найти</button>
    </form>
  )
}
