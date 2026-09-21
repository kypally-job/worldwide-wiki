"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isSignedIn, setSignedIn, subscribeAssistantChat } from "@/lib/assistant-chat";

export default function AuthPage() {
  const [signedIn, setSignedInState] = useState(false);

  useEffect(() => {
    setSignedInState(isSignedIn());
    return subscribeAssistantChat(() => setSignedInState(isSignedIn()));
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-var(--header-height))] max-w-lg flex-col justify-center px-5 py-16 sm:px-6">
      <h1 className="font-heading text-[2rem] leading-none tracking-tight text-sand sm:text-[2.35rem]">
        Вход
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-sand/65">
        Полный кабинет подключим позже. Пока можно включить демо-вход: история чатов с
        ассистентом будет сохраняться на этом устройстве.
      </p>

      {signedIn ? (
        <div className="mt-8 space-y-3">
          <p className="text-[14px] text-terracotta">Вы вошли (демо).</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/assistant"
              className="rounded-lg bg-terracotta px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-terracotta-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
            >
              К ассистенту
            </Link>
            <button
              type="button"
              onClick={() => {
                setSignedIn(false);
                setSignedInState(false);
              }}
              className="rounded-lg border border-line px-4 py-2.5 text-[14px] text-sand/70 transition hover:border-terracotta/50 hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            >
              Выйти
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setSignedIn(true);
            setSignedInState(true);
          }}
          className="mt-8 w-fit rounded-lg bg-terracotta px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-terracotta-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
        >
          Войти (демо)
        </button>
      )}
    </div>
  );
}
