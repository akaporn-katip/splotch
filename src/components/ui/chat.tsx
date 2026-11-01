import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Label } from "./form";
import { Button, IconButton } from "./primitives";
import { ArrowRight, Send } from "./icons";

/**
 * A conversation printed as a strip of speech balloons. Headless where it
 * matters: the messages come in as props or children, a sent message goes out
 * through `onSend`, and nothing here talks to a network.
 *
 * The thread is a live log. It stays pinned to the newest balloon while the
 * reader is at the bottom, lets go the moment they scroll up to read back, and
 * offers a way down again. A message the reader sends themselves always pins it.
 */

/** How close to the bottom (px) still counts as "reading the newest". */
const PIN_SLACK = 24;

/* ------------------------------------------------------------------ thread */

export type ChatThreadProps = {
  children: ReactNode;
  /** Accessible name of the log. Defaults to "Messages". */
  label?: string;
  /** Text of the button that returns a reader who scrolled up. */
  jumpLabel?: string;
  className?: string;
};

export function ChatThread({
  children,
  label = "Messages",
  jumpLabel = "Jump to newest",
  className,
}: ChatThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  const lastTop = useRef(0);
  const [behind, setBehind] = useState(false);

  function toEnd() {
    const log = scrollRef.current;
    if (!log) return;
    // Straight to the end, never smooth: a smooth scroll fires scroll events on
    // the way down that read as "not at the bottom" and would unpin the thread.
    log.scrollTop = log.scrollHeight;
    lastTop.current = log.scrollTop;
    pinned.current = true;
    setBehind(false);
  }

  function handleScroll() {
    const log = scrollRef.current;
    if (!log) return;
    const atEnd = log.scrollHeight - log.scrollTop - log.clientHeight <= PIN_SLACK;
    if (atEnd) {
      pinned.current = true;
      setBehind(false);
    } else if (log.scrollTop < lastTop.current) {
      // Only a move *up* lets go. The log shrinking under a growing composer
      // also leaves a gap at the end, but it never moves scrollTop, and a scroll
      // event from our own last jump can arrive after that shrink.
      pinned.current = false;
    }
    lastTop.current = log.scrollTop;
  }

  // The first print opens on the newest message, not on the oldest.
  useLayoutEffect(() => {
    toEnd();
  }, []);

  useEffect(() => {
    const log = scrollRef.current;
    const content = contentRef.current;
    if (!log || !content) return;

    // Growth of any kind — a new balloon, an avatar image arriving, a reflow —
    // keeps a pinned thread at the end, and so does the log itself shrinking
    // (a composer growing line by line beneath it). An unpinned thread is left
    // where the reader put it.
    const resize = new ResizeObserver(() => {
      if (pinned.current) toEnd();
    });
    resize.observe(content);
    resize.observe(log);

    // Messages may arrive wrapped (list items, day groups), so look below the
    // added node, and count only real messages — not text churn inside one.
    const added = new MutationObserver((records) => {
      const elements = records
        .flatMap((record) => Array.from(record.addedNodes))
        .filter((node): node is HTMLElement => node instanceof HTMLElement);
      const find = (selector: string) =>
        elements.some((element) => element.matches(selector) || element.querySelector(selector));
      if (!find("[data-chat-message]")) return;
      if (find('[data-chat-own="true"]') || pinned.current) toEnd();
      else setBehind(true);
    });
    added.observe(content, { childList: true, subtree: true });

    return () => {
      resize.disconnect();
      added.disconnect();
    };
  }, []);

  return (
    <div className={cx("relative flex min-h-0 flex-1 flex-col", className)}>
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label={label}
        // A scrolling region has to be reachable by keyboard to be scrollable by it.
        tabIndex={0}
        onScroll={handleScroll}
        className="skin min-h-0 flex-1 overflow-y-auto overscroll-contain bg-paper-2 px-3 py-4 [outline-offset:-4px]! sm:px-4"
      >
        <div ref={contentRef} className="flex flex-col gap-5">
          {children}
        </div>
      </div>

      {behind && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <Button
            size="sm"
            tone="ink"
            onClick={toEnd}
            className="pointer-events-auto min-h-11"
          >
            {jumpLabel}
            <ArrowRight size={14} className="rotate-90" />
          </Button>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- message */

export type ChatMessageProps = {
  children: ReactNode;
  /** Sent by the reader: printed in the spot ink, on the right. */
  own?: boolean;
  /** Sender name. Printed above the balloon; defaults to "You" for own messages. */
  name?: string;
  /** Any node — usually an `<Avatar size={36} />`. Hidden from assistive tech, the name carries it. */
  avatar?: ReactNode;
  /** A Date is printed as a short local time; a string is printed as given. */
  time?: Date | string;
  /** Any BCP 47 tag for the printed time. Defaults to the runtime locale. */
  locale?: string;
  className?: string;
};

export function ChatMessage({
  children,
  own = false,
  name,
  avatar,
  time,
  locale,
  className,
}: ChatMessageProps) {
  const sender = name ?? (own ? "You" : undefined);
  const printedTime =
    time instanceof Date
      ? new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(time)
      : time;

  return (
    <div
      data-chat-message=""
      data-chat-own={own ? "true" : "false"}
      className={cx(
        "flex max-w-full items-end gap-2.5",
        own ? "flex-row-reverse self-end pl-8" : "self-start pr-8",
        className,
      )}
    >
      {avatar && (
        <span aria-hidden="true" className="mb-[-2px] shrink-0">
          {avatar}
        </span>
      )}

      <div className={cx("flex min-w-0 flex-col gap-1", own ? "items-end" : "items-start")}>
        {(sender || printedTime) && (
          <p className="label flex items-baseline gap-2 px-1 text-[0.6rem] text-ink/70">
            {sender && <span className="text-ink">{sender}</span>}
            {printedTime && (
              <time
                dateTime={time instanceof Date ? time.toISOString() : undefined}
                className="tabular-nums"
              >
                {printedTime}
              </time>
            )}
          </p>
        )}
        <div
          className={cx(
            "balloon mb-2.5 max-w-[34ch] whitespace-pre-wrap break-words text-[0.9375rem] leading-snug",
            own ? "balloon-own text-on-accent" : "text-ink",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- composer */

export type ChatComposerProps = {
  /** Called with the message as typed (trimmed of outer whitespace). */
  onSend: (text: string) => void;
  /** Controlled draft. Leave unset and the composer keeps and clears its own. */
  value?: string;
  onValueChange?: (text: string) => void;
  /** The textarea's label. Always a real `<label>`; `hideLabel` keeps it for assistive tech only. */
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  /** Accessible name of the send button. */
  sendLabel?: string;
  hint?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
};

export function ChatComposer({
  onSend,
  value,
  onValueChange,
  label = "Message",
  hideLabel = false,
  placeholder = "Write a message",
  sendLabel = "Send",
  hint = "Enter sends. Shift+Enter starts a new line.",
  disabled,
  id,
  className,
}: ChatComposerProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  const [own, setOwn] = useState("");
  const controlled = value !== undefined;
  const draft = controlled ? value : own;
  const blank = draft.trim().length === 0;

  function setDraft(next: string) {
    if (!controlled) setOwn(next);
    onValueChange?.(next);
  }

  function send() {
    if (blank || disabled) return;
    onSend(draft.trim());
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send();
  }

  function handleKeys(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    // An input method is still composing a character: Enter belongs to it.
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    event.preventDefault();
    send();
  }

  return (
    <form onSubmit={handleSubmit} className={cx("w-full", className)}>
      <Label htmlFor={fieldId} className={cx(hideLabel && "sr-only")}>
        {label}
      </Label>
      <div className={cx("flex items-end gap-2.5", !hideLabel && "mt-1.5")}>
        <textarea
          id={fieldId}
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeys}
          placeholder={placeholder}
          disabled={disabled}
          aria-describedby={hintId}
          enterKeyHint="send"
          className="field max-h-40 min-w-0 flex-1 resize-none [field-sizing:content]"
        />
        <IconButton
          type="submit"
          tone="solid"
          label={sendLabel}
          disabled={disabled || blank}
        >
          <Send size={18} />
        </IconButton>
      </div>
      {hint && (
        <p id={hintId} className="mt-1.5 text-[0.8125rem] leading-snug text-ink/75">
          {hint}
        </p>
      )}
    </form>
  );
}

/* -------------------------------------------------------------- assembled */

/** One message as data, for the assembled `<Chat messages={…} />`. */
export type ChatEntry = {
  id: string;
  text: ReactNode;
  own?: boolean;
  name?: string;
  avatar?: ReactNode;
  time?: Date | string;
};

export type ChatProps = {
  messages: ChatEntry[];
  onSend: (text: string) => void;
  /** Accessible name of the thread. */
  label?: string;
  /** Printed in the thread when there are no messages yet. */
  empty?: ReactNode;
  locale?: string;
  className?: string;
  /** Passed through to the composer. */
  composer?: Omit<ChatComposerProps, "onSend">;
};

/**
 * The thread and the composer on one panel. Compose `ChatThread`, `ChatMessage`
 * and `ChatComposer` directly for anything this shape does not fit.
 */
export function Chat({
  messages,
  onSend,
  label,
  empty = "No messages yet. Say the first thing.",
  locale,
  className,
  composer,
}: ChatProps) {
  return (
    <div
      className={cx(
        "panel flex h-96 w-full flex-col overflow-hidden text-ink",
        className,
      )}
    >
      <ChatThread label={label}>
        {messages.length === 0 ? (
          <p className="self-center py-6 text-center text-[0.875rem] text-ink/75">{empty}</p>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              own={message.own}
              name={message.name}
              avatar={message.avatar}
              time={message.time}
              locale={locale}
            >
              {message.text}
            </ChatMessage>
          ))
        )}
      </ChatThread>
      <div className="border-t-2 border-ink bg-paper p-3">
        <ChatComposer onSend={onSend} {...composer} />
      </div>
    </div>
  );
}
