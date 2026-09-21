"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  answerFromSiteData,
  createGreeting,
  type AssistantMessage,
  type TripSlots,
} from "@/lib/assistant";
import { saveDraft } from "@/lib/assistant-chat";

const AVATAR_SRC = "/mascot-sakura-avatar-v2.jpg";

type AssistantChatProps = {
  variant: "dock" | "page";
  messages: AssistantMessage[];
  slots: TripSlots | null;
  onMessagesChange: (messages: AssistantMessage[], slots: TripSlots | null) => void;
  onClose?: () => void;
  showFullChatOffer?: boolean;
};

export default function AssistantChat({
  variant,
  messages,
  slots,
  onMessagesChange,
  onClose,
  showFullChatOffer = true,
}: AssistantChatProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [draft, setDraft] = useState("");

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (variant === "page") {
      inputRef.current?.focus();
    }
  }, [variant]);

  const send = (textRaw: string) => {
    const text = textRaw.trim();

    if (!text) {
      return;
    }

    const userMessage: AssistantMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };

    const history = [...messages, userMessage].map((message) => ({
      role: message.role,
      text: message.text,
    }));

    const reply = answerFromSiteData(text, {
      history,
      slots,
      messageCount: messages.length + 1,
    });

    const assistantMessage: AssistantMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: reply.text,
      href: reply.href,
      hrefLabel: reply.hrefLabel,
      offerFullChat: reply.offerFullChat,
    };

    onMessagesChange([...messages, userMessage, assistantMessage], reply.slots ?? slots);
    setDraft("");
  };

  const isPage = variant === "page";

  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden ${
        isPage
          ? "bg-transparent"
          : "rounded-2xl border border-line bg-panel-strong/97 shadow-elevated backdrop-blur-xl"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-line-soft px-3.5 py-3 sm:px-4">
        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#1a1220] ring-1 ring-terracotta/40">
          <Image
            src={AVATAR_SRC}
            alt=""
            fill
            sizes="40px"
            className="object-cover object-center"
          />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-[1.15rem] leading-none tracking-tight text-sand">
            Сакура
          </p>
          <p className="mt-1 text-[12px] text-sand/50">WW Ассистент</p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть чат"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-sand/45 transition hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <span className="relative block h-3.5 w-3.5" aria-hidden="true">
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 rotate-45 bg-current" />
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        ) : null}
      </div>

      <div
        ref={listRef}
        className={`hide-scrollbar flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain px-3.5 py-3 sm:px-4 ${
          isPage ? "" : "max-h-72"
        }`}
      >
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-2">
            <div
              className={`max-w-[92%] rounded-2xl px-3 py-2 text-[14px] leading-6 ${
                message.role === "user"
                  ? "ml-auto bg-terracotta text-white"
                  : "bg-surface-chip text-sand/85"
              }`}
            >
              <p className="whitespace-pre-line">{message.text}</p>
              {message.href ? (
                <Link
                  href={message.href}
                  className="mt-1.5 inline-flex font-medium text-terracotta underline-offset-2 hover:underline"
                >
                  {message.hrefLabel}
                </Link>
              ) : null}
            </div>

            {showFullChatOffer &&
            message.role === "assistant" &&
            message.offerFullChat &&
            !isPage ? (
              <Link
                href="/assistant"
                onClick={() => {
                  saveDraft({ messages, slots });
                }}
                className="inline-flex max-w-[92%] items-center justify-center rounded-xl border border-terracotta/40 bg-terracotta/10 px-3 py-2 text-[13px] font-medium text-terracotta transition hover:bg-terracotta/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                Открыть полный чат
              </Link>
            ) : null}
          </div>
        ))}
      </div>

      <form
        className="flex items-center gap-2 border-t border-line-soft px-3 py-2.5 sm:px-4"
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Сообщение ассистенту
        </label>
        <input
          id={inputId}
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder='Например, "Хочу отдохнуть на море"'
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-sand outline-none placeholder:text-[11px] placeholder:text-sand/40"
        />
        <button
          type="submit"
          aria-label="Отправить"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-terracotta text-white transition hover:bg-terracotta-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[17px] w-[17px] -translate-x-px"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 2 11 13" />
            <path d="m22 2-7 20-4-9-9-4 20-7Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export function createHelloMessage(): AssistantMessage {
  const greeting = createGreeting();

  return {
    id: "hello",
    role: "assistant",
    text: greeting.text,
  };
}
