export default function Marketplace() {
  return (
    <div className="flex flex-col gap-8 pt-6">
      <div className="up">
        <p className="text-sm font-bold tracking-widest text-acc">NUMBER MARKETPLACE</p>
        <h1 className="mt-3 text-5xl font-extrabold leading-tight tracking-tighter sm:text-7xl">Beautiful numbers.<br />One day.</h1>
        <p className="mt-4 max-w-md text-mut">Coming soon. Nothing can be bought or sold yet — this page is a preview of a possible future.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[7, 77, 111, 777, 1337, 10000].map(n => (
          <div key={n} className="card flex flex-col items-center gap-3 opacity-80">
            <div className="big text-5xl">#{n}</div>
            <span className="rounded-full border border-line px-3 py-1 text-xs text-mut">Coming soon</span>
          </div>
        ))}
      </div>
    </div>
  )
}
