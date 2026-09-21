"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import AssistantChat, { createHelloMessage } from "@/components/AssistantChat";
import type { AssistantMessage, TripSlots } from "@/lib/assistant";
import {
  createThread,
  getActiveThreadId,
  getThread,
  isSignedIn,
  saveDraft,
  saveThread,
  titleFromMessages,
} from "@/lib/assistant-chat";
import {
  isJourneyStarted,
  isSakuraDismissed,
  markSakuraDismissed,
  subscribeJourney,
} from "@/lib/journey";

const MASCOT_SRC = "/mascot-sakura-v2.png";
const AVATAR_SRC = "/mascot-sakura-avatar-v2.jpg";
const INTRO_TIP = "Задай мне свой вопрос";

type Presence = "pending" | "waiting" | "intro" | "button";

function resolvePresence(): Presence {
  if (isSakuraDismissed()) {
    return "button";
  }

  if (isJourneyStarted()) {
    return "intro";
  }

  return "waiting";
}

export default function SakuraAssistant() {
  const pathname = usePathname();
  const panelId = useId();
  const [presence, setPresence] = useState<Presence>("pending");
  const [isOpen, setIsOpen] = useState(false);
  const [typedTip, setTypedTip] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([createHelloMessage()]);
  const [slots, setSlots] = useState<TripSlots | null>(null);

  useEffect(() => {
    const sync = () => {
      setPresence(resolvePresence());
    };

    sync();
    return subscribeJourney(sync);
  }, []);

  useEffect(() => {
    if (presence !== "intro") {
      setTypedTip("");
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedTip(INTRO_TIP);
      return;
    }

    setTypedTip("");
    let index = 0;
    let cancelled = false;
    let intervalId = 0;

    const timeoutId = window.setTimeout(() => {
      if (cancelled) {
        return;
      }

      intervalId = window.setInterval(() => {
        index += 1;
        setTypedTip(INTRO_TIP.slice(0, index));

        if (index >= INTRO_TIP.length) {
          window.clearInterval(intervalId);
        }
      }, 110);
    }, 650);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [presence]);

  useEffect(() => {
    if (!isOpen || presence !== "button") {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, presence]);

  const dismissIntro = (openChat: boolean) => {
    markSakuraDismissed();
    setPresence("button");
    setIsOpen(openChat);
  };

  const handleMessagesChange = (
    nextMessages: AssistantMessage[],
    nextSlots: TripSlots | null,
  ) => {
    setMessages(nextMessages);
    setSlots(nextSlots);

    if (!isSignedIn()) {
      saveDraft({ messages: nextMessages, slots: nextSlots });
      return;
    }

    const activeId = getActiveThreadId();
    const existing = activeId ? getThread(activeId) : undefined;

    if (existing) {
      saveThread({
        ...existing,
        title: titleFromMessages(nextMessages),
        messages: nextMessages,
        slots: nextSlots,
      });
      return;
    }

    createThread({
      messages: nextMessages,
      slots: nextSlots,
      title: titleFromMessages(nextMessages),
    });
  };

  if (pathname.startsWith("/assistant")) {
    return null;
  }

  if (presence === "pending" || presence === "waiting") {
    return null;
  }

  const showChat = presence === "button" && isOpen;

  return (
    <div
      className={`pointer-events-none fixed z-40 ${
        presence === "intro"
          ? "bottom-0 left-0"
          : showChat
            ? "bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-2 sm:left-4"
            : "bottom-[max(1.85rem,calc(env(safe-area-inset-bottom)+1.1rem))] left-2 sm:left-4"
      }`}
    >
      {presence === "button" && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Чат с Сакурой"
          aria-hidden={!showChat}
          {...(!showChat ? { inert: true } : {})}
          onWheel={(event) => {
            event.stopPropagation();
          }}
          className={`pointer-events-auto w-[min(22rem,calc(100vw-2rem))] origin-bottom-left transition duration-200 ease-out ${
            showChat
              ? "relative translate-y-0 scale-100 opacity-100"
              : "pointer-events-none absolute bottom-0 left-0 translate-y-3 scale-[0.98] opacity-0"
          }`}
        >
          <AssistantChat
            variant="dock"
            messages={messages}
            slots={slots}
            onMessagesChange={handleMessagesChange}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}

      {presence === "intro" ? (
        <div className="sakura-intro pointer-events-auto relative h-[min(36dvh,14.5rem)] w-[min(11.5rem,46vw)] sm:h-[min(52dvh,24rem)] sm:w-[min(18rem,42vw)] md:h-[min(56dvh,28rem)] md:w-[min(20rem,36vw)]">
          <span
            className="pointer-events-none absolute bottom-0 left-1/2 h-10 w-28 -translate-x-1/2 rounded-full bg-terracotta/40 blur-2xl sm:h-12 sm:w-40"
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={() => dismissIntro(true)}
            aria-label="Задать вопрос Сакуре"
            className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <Image
              src={MASCOT_SRC}
              alt="Сакура"
              fill
              priority
              sizes="(min-width: 768px) 320px, 46vw"
              className="object-contain object-bottom drop-shadow-[0_10px_28px_rgba(213,96,137,0.28)]"
            />
          </button>

          <div className="absolute bottom-[calc(100%-0.35rem)] left-1/2 w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2 sm:bottom-[58%] sm:left-[72%] sm:max-w-none sm:translate-x-0 md:left-[75%]">
            <div className="flex items-center gap-1 rounded-2xl border border-line bg-panel/95 py-2 pl-3.5 pr-1.5 shadow-[0_10px_28px_rgba(28,20,28,0.16)] backdrop-blur-md">
              <button
                type="button"
                onClick={() => dismissIntro(true)}
                className="min-w-0 whitespace-nowrap text-left font-heading text-[0.92rem] leading-none tracking-tight text-sand transition hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta sm:text-[1.05rem]"
              >
                <span>{typedTip}</span>
                {typedTip.length < INTRO_TIP.length && (
                  <span
                    className="sakura-caret ml-0.5 inline-block h-[0.9em] w-[1.5px] translate-y-[0.08em] bg-sand align-baseline"
                    aria-hidden="true"
                  />
                )}
                <span className="sr-only">{INTRO_TIP}</span>
              </button>

              <button
                type="button"
                onClick={() => dismissIntro(false)}
                aria-label="Скрыть Сакуру"
                className="flex h-8 w-8 shrink-0 items-center justify-center text-sand/45 transition hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                <span className="relative block h-3 w-3" aria-hidden="true">
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 rotate-45 rounded-full bg-current" />
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 -rotate-45 rounded-full bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : !showChat ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={false}
          aria-controls={panelId}
          aria-label="Открыть чат с Сакурой"
          className="pointer-events-auto relative block h-14 w-14 overflow-hidden rounded-full border border-line bg-[#1a1220] shadow-[0_10px_28px_rgba(213,96,137,0.28)] ring-1 ring-terracotta/70 transition hover:ring-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
        >
          <Image
            src={AVATAR_SRC}
            alt=""
            fill
            sizes="56px"
            className="object-cover object-center"
          />
        </button>
      ) : null}
    </div>
  );
}
