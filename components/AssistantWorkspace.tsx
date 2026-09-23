"use client";

import { useEffect, useState } from "react";
import AssistantChat, { createHelloMessage } from "@/components/AssistantChat";
import type { AssistantMessage, TripSlots } from "@/lib/assistant";
import {
  clearDraft,
  createThread,
  getActiveThreadId,
  getThread,
  isSignedIn,
  listThreads,
  loadDraft,
  saveDraft,
  saveThread,
  setActiveThreadId,
  subscribeAssistantChat,
  titleFromMessages,
  type ChatThread,
} from "@/lib/assistant-chat";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";

function ensureThread(emptyTitle: string, locale: "ru" | "en"): ChatThread {
  const activeId = getActiveThreadId();
  const existing = activeId ? getThread(activeId) : undefined;

  if (existing) {
    return existing;
  }

  const threads = listThreads();
  if (threads[0]) {
    setActiveThreadId(threads[0].id);
    return threads[0];
  }

  return createThread({
    messages: [createHelloMessage(locale)],
    title: emptyTitle,
  });
}

export default function AssistantWorkspace() {
  const { locale } = useLocale();
  const t = useT();
  const emptyTitle = t("assistant.newChat");
  const [signedIn, setSignedInState] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    createHelloMessage(locale),
  ]);
  const [slots, setSlots] = useState<TripSlots | null>(null);
  const [ready, setReady] = useState(false);

  const sync = () => {
    const signed = isSignedIn();
    setSignedInState(signed);

    if (!signed) {
      const draft = loadDraft();
      if (draft?.messages?.length) {
        setMessages(draft.messages);
        setSlots(draft.slots);
        clearDraft();
      } else {
        setMessages([createHelloMessage(locale)]);
        setSlots(null);
      }
      setActiveId(null);
      setReady(true);
      return;
    }

    const draft = loadDraft();
    if (draft?.messages?.length) {
      const thread = createThread({
        messages: draft.messages,
        slots: draft.slots,
        title: titleFromMessages(draft.messages, emptyTitle),
      });
      clearDraft();
      setActiveId(thread.id);
      setMessages(thread.messages);
      setSlots(thread.slots);
      setReady(true);
      return;
    }

    const thread = ensureThread(emptyTitle, locale);
    setActiveId(thread.id);
    setMessages(
      thread.messages.length ? thread.messages : [createHelloMessage(locale)],
    );
    setSlots(thread.slots);
    setReady(true);
  };

  useEffect(() => {
    sync();
    return subscribeAssistantChat(sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on mount / auth events
  }, []);

  useEffect(() => {
    setMessages((current) => {
      if (current.length === 1 && current[0]?.id === "hello") {
        return [createHelloMessage(locale)];
      }
      return current;
    });
  }, [locale]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const persist = (
    nextMessages: AssistantMessage[],
    nextSlots: TripSlots | null,
  ) => {
    setMessages(nextMessages);
    setSlots(nextSlots);

    if (!signedIn) {
      saveDraft({ messages: nextMessages, slots: nextSlots });
      return;
    }

    if (activeId && getThread(activeId)) {
      const saved = saveThread({
        id: activeId,
        title: titleFromMessages(nextMessages, emptyTitle),
        updatedAt: new Date().toISOString(),
        messages: nextMessages,
        slots: nextSlots,
      });
      setActiveId(saved.id);
      return;
    }

    const created = createThread({
      messages: nextMessages,
      slots: nextSlots,
      title: titleFromMessages(nextMessages, emptyTitle),
    });
    setActiveId(created.id);
  };

  if (!ready) {
    return (
      <div className="flex h-[calc(100dvh-var(--header-height))] items-center justify-center text-sand/50">
        {t("assistant.loading")}
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100dvh-var(--header-height))] w-full overflow-hidden">
      <div className="relative z-20 mx-auto flex h-full w-full max-w-[52rem] flex-col px-3 py-3 sm:max-w-[54rem] sm:px-5 sm:py-4 lg:max-w-[56rem]">
        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-line bg-panel-strong/97 shadow-elevated backdrop-blur-xl">
          <AssistantChat
            variant="page"
            messages={messages}
            slots={slots}
            onMessagesChange={persist}
            showFullChatOffer={false}
          />
        </div>
      </div>
    </div>
  );
}
