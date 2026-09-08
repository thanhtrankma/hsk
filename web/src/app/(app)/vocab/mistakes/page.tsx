export default function VocabMistakesPage() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-ink-100 text-3xl">
          🐼
        </div>
        <h1 className="mt-4 text-xl font-extrabold text-ink-800">Chưa có lỗi nào!</h1>
        <p className="mt-2 text-sm text-ink-500">
          Mỗi khi bạn trả lời sai một từ (trong quiz, luyện nghe hay ôn tập), từ đó sẽ được lưu vào đây để
          luyện lại. Trả lời đúng là nó tự biến mất.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button className="rounded-full bg-jade-500 px-5 py-2 text-sm font-bold text-white">
            Luyện nghe
          </button>
          <button className="rounded-full border border-ink-200 px-5 py-2 text-sm font-bold text-ink-700">
            Ôn tập
          </button>
        </div>
      </div>
    </div>
  );
}
