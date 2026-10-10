'use client'
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mt-8 text-center">
      <p className="text-xl font-bold">Что-то пошло не так.</p>
      <p className="mt-2 text-mut">Проверьте соединение и попробуйте ещё раз.</p>
      <button onClick={reset} className="btn-p mt-6">Повторить</button>
    </div>
  )
}
