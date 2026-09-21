import type { AssistantMessage, TripSlots } from "@/lib/assistant";

const THREADS_KEY = "worldwide-wiki-assistant-threads";
const ACTIVE_KEY = "worldwide-wiki-assistant-active";
const AUTH_KEY = "worldwide-wiki-signed-in";
const DRAFT_KEY = "worldwide-wiki-assistant-draft";
const EVENT = "ww-assistant-chat";

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: string;
  messages: AssistantMessage[];
  slots: TripSlots | null;
};

export type ChatDraft = {
  messages: AssistantMessage[];
  slots: TripSlots | null;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function emit() {
  window.dispatchEvent(new Event(EVENT));
}

function readThreads(): ChatThread[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(THREADS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as ChatThread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeThreads(threads: ChatThread[]) {
  window.localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  emit();
}

export function isSignedIn() {
  if (!canUseStorage()) {
    return false;
  }

  return window.localStorage.getItem(AUTH_KEY) === "1";
}

export function setSignedIn(value: boolean) {
  if (!canUseStorage()) {
    return;
  }

  if (value) {
    window.localStorage.setItem(AUTH_KEY, "1");
  } else {
    window.localStorage.removeItem(AUTH_KEY);
  }

  emit();
}

export function subscribeAssistantChat(onChange: () => void) {
  if (!canUseStorage()) {
    return () => undefined;
  }

  const handler = () => onChange();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function listThreads(): ChatThread[] {
  return readThreads().sort(
    (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
  );
}

export function getActiveThreadId(): string | null {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(ACTIVE_KEY);
}

export function setActiveThreadId(id: string | null) {
  if (!canUseStorage()) {
    return;
  }

  if (id) {
    window.localStorage.setItem(ACTIVE_KEY, id);
  } else {
    window.localStorage.removeItem(ACTIVE_KEY);
  }

  emit();
}

export function getThread(id: string) {
  return readThreads().find((thread) => thread.id === id);
}

export function createThread(
  seed?: Partial<Pick<ChatThread, "messages" | "slots" | "title">>,
): ChatThread {
  const thread: ChatThread = {
    id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: seed?.title?.trim() || "Новый чат",
    updatedAt: new Date().toISOString(),
    messages: seed?.messages ?? [],
    slots: seed?.slots ?? null,
  };

  writeThreads([thread, ...readThreads()]);
  setActiveThreadId(thread.id);
  return thread;
}

export function saveThread(thread: ChatThread) {
  const threads = readThreads();
  const index = threads.findIndex((item) => item.id === thread.id);
  const next = { ...thread, updatedAt: new Date().toISOString() };

  if (index >= 0) {
    threads[index] = next;
  } else {
    threads.unshift(next);
  }

  writeThreads(threads);
  setActiveThreadId(next.id);
  return next;
}

export function deleteThread(id: string) {
  const threads = readThreads().filter((thread) => thread.id !== id);
  writeThreads(threads);

  if (getActiveThreadId() === id) {
    setActiveThreadId(threads[0]?.id ?? null);
  }
}

export function titleFromMessages(messages: AssistantMessage[]) {
  const firstUser = messages.find((message) => message.role === "user");
  if (!firstUser) {
    return "Новый чат";
  }

  const text = firstUser.text.trim().replace(/\s+/g, " ");
  return text.length > 42 ? `${text.slice(0, 42)}…` : text;
}

export function shouldPersistHistory() {
  return isSignedIn();
}

export function saveDraft(draft: ChatDraft) {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function loadDraft(): ChatDraft | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as ChatDraft;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.removeItem(DRAFT_KEY);
}
