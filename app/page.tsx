"use client";

import { FormEvent, useEffect, useState } from "react";

type Letter = {
  id: string;
  content: string;
  createdAt: string;
};

type ApiResponse = {
  message?: string;
  data?: Array<{
    id: string;
    content: string;
    created_at: string;
  }>;
};

type CreateLetterResponse = {
  message?: string;
  data?: {
    id: string;
    content: string;
    created_at: string;
  };
};

export default function Page() {
  const [content, setContent] = useState("");
  const [searchText, setSearchText] = useState("");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [activeScreen, setActiveScreen] = useState<"hero" | "wall">("hero");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLetters, setIsLoadingLetters] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchLetters = async () => {
    setIsLoadingLetters(true);
    try {
      const response = await fetch("/api/letters", {
        method: "GET",
        cache: "no-store",
      });
      const result = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(result.message ?? "Không thể lấy dữ liệu thư.");
      }

      const mappedLetters = (result.data ?? []).map((item) => ({
        id: item.id,
        content: item.content,
        createdAt: item.created_at,
      }));

      setLetters(mappedLetters);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể tải dữ liệu thư.";
      setStatus({ type: "error", message });
    } finally {
      setIsLoadingLetters(false);
    }
  };

  useEffect(() => {
    void fetchLetters();
  }, []);

  const filteredLetters = letters.filter((letter) =>
    letter.content.toLowerCase().includes(searchText.toLowerCase().trim())
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!content.trim()) {
      setStatus({
        type: "error",
        message: "Bạn cần nhập nội dung thư trước khi gửi.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const result = (await response.json()) as CreateLetterResponse;

      if (!response.ok || !result.data) {
        throw new Error(result.message ?? "Không thể gửi thư lúc này.");
      }

      const newData = result.data;

      setLetters((prev) => [
        {
          id: newData.id,
          content: newData.content,
          createdAt: newData.created_at,
        },
        ...prev,
      ]);
      setContent("");
      setIsComposeOpen(false);
      setActiveScreen("wall");
      setStatus({
        type: "success",
        message: "Đã gửi thư vào tương lai thành công.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hero-user.png')" }}
    >
      {activeScreen === "hero" && (
        <section className="relative min-h-screen">
          <div className="absolute bottom-8 right-6 flex flex-row gap-3 md:bottom-10 md:right-10 md:gap-4">
            <button
              type="button"
              onClick={() => {
                setStatus(null);
                setIsComposeOpen(true);
              }}
              className="rounded-full border border-[#2e97ca] bg-[#3fb1ec] px-4 py-2 text-xs font-medium text-white shadow-[0_4px_0_rgba(39,108,145,0.28)] transition hover:-translate-y-0.5 hover:brightness-105 md:px-6 md:py-2.5 md:text-lg"
            >
              ✍ Viết một note mới
            </button>
            <button
              type="button"
              onClick={async () => {
                setStatus(null);
                await fetchLetters();
                setActiveScreen("wall");
              }}
              className="rounded-full border border-[#2e97ca] bg-[#3fb1ec] px-4 py-2 text-xs font-medium text-white shadow-[0_4px_0_rgba(39,108,145,0.28)] transition hover:-translate-y-0.5 hover:brightness-105 md:px-6 md:py-2.5 md:text-lg"
            >
              👀 Xem bức tường
            </button>
          </div>
        </section>
      )}

      {activeScreen === "wall" && (
        <section className="relative min-h-screen bg-black/20 px-6 pb-16 pt-10 backdrop-blur-[1.5px]">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveScreen("hero")}
              className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-blue-700"
            >
              ← Về trang đầu
            </button>
            <div className="flex items-center gap-3">
              <p className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-blue-700">
                {letters.length} note
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus(null);
                  setIsComposeOpen(true);
                }}
                className="rounded-full border border-[#2e97ca] bg-[#3fb1ec] px-7 py-3 text-lg font-medium text-white shadow-[0_5px_0_rgba(39,108,145,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                ✍ Viết note mới
              </button>
            </div>
          </div>

          <div className="mb-5">
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Tìm nhanh nội dung note..."
              className="w-full max-w-md rounded-xl border border-white/60 bg-white/90 px-4 py-2 text-sm text-slate-700 outline-none focus:border-blue-300"
            />
          </div>

          {isLoadingLetters ? (
            <p className="text-center text-lg text-white">Đang tải dữ liệu...</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredLetters.map((letter, index) => (
                <article
                  key={letter.id}
                  className="relative min-h-56 rounded-xl border border-[#ceb26f] bg-[#f3e5c7] p-4 shadow-[0_8px_15px_rgba(0,0,0,0.25)] transition hover:-translate-y-1"
                  style={{
                    transform: `rotate(${[-1.8, 1.2, -0.7, 1.7][index % 4]}deg)`,
                  }}
                >
                  <div className="absolute left-5 top-0 h-3 w-24 -translate-y-1/2 rounded-sm bg-[#b68860]" />
                  <p className="whitespace-pre-wrap text-lg text-slate-800">
                    {letter.content}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    {new Date(letter.createdAt).toLocaleString("vi-VN")}
                  </p>
                </article>
              ))}
            </div>
          )}

          {!isLoadingLetters && letters.length === 0 && (
            <p className="text-center text-lg text-white">
              Chưa có note nào, hãy viết note đầu tiên.
            </p>
          )}

          {!isLoadingLetters && letters.length > 0 && filteredLetters.length === 0 && (
            <p className="text-center text-lg text-white">
              Không tìm thấy note phù hợp.
            </p>
          )}

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] text-white/90">
            ĐÂY LÀ BỨC TƯỜNG CỦA TƯƠNG LAI
          </p>
        </section>
      )}

      {isComposeOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-3xl font-bold text-slate-800">✍ Viết một note mới</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <textarea
                id="content"
                rows={7}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Viết điều bạn muốn gửi cho tương lai..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              {status && (
                <p
                  className={`rounded-lg px-3 py-2 text-sm ${
                    status.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {status.message}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="w-1/2 rounded-lg border border-slate-300 px-4 py-3 text-lg font-medium text-slate-700"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 rounded-lg bg-blue-600 px-4 py-3 text-lg font-semibold text-white disabled:bg-blue-300"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
