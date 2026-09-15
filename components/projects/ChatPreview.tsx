"use client";

import { useRef } from "react";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { t, type Locale } from "@/lib/i18n";
import { projects } from "@/content/site";
import Mark from "../Mark";

/* What the agent does after each message, shown in the side log (real tool names from the project). */
const LOG: string[][] = [
  ["webhook signature ✓", "get_business_info()"],
  ["reply sent"],
  ["check_availability(tue 10:00)", "create_booking(haircut)"],
  ["booking saved ✓"],
];

/** Demo: a customer chats with the WhatsApp agent, which answers and books a slot.
 *  Plays three times while on screen (held while the mouse is over it), then rests on the whole conversation. */
export default function ChatPreview({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const chat = projects.previews.chat;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const bubbles = q(".bubble");
      const logs = q(".log-step");
      if (window.matchMedia(REDUCED_MOTION).matches) return;

      // Messages join the conversation from the bottom, like a real chat.
      const typing = q(".typing");
      const reset = () => {
        gsap.set(bubbles, { display: "none" });
        gsap.set(typing, { display: "none" });
        gsap.set(logs, { autoAlpha: 0, y: 10 });
      };
      reset();

      const tl = gsap.timeline({
        repeat: 2,
        paused: true,
        onRepeat: reset,
        // The last round ends on the full conversation instead of an empty window.
        onComplete: () => gsap.to([...bubbles, ...logs], { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.04 }),
        defaults: { ease: "expo.out", duration: 0.7 },
      });
      chat.messages.forEach((m, i) => {
        if (m.from === "agent") {
          tl.set(typing, { display: "flex" }, "+=0.3")
            .fromTo(typing, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 })
            .set(typing, { display: "none" }, "+=1");
        } else if (i > 0) {
          tl.to({}, { duration: 1.1 });
        }
        tl.set(bubbles[i], { display: "block" });
        tl.fromTo(bubbles[i], { autoAlpha: 0, y: 14, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1 });
        tl.to(logs[i], { autoAlpha: 1, y: 0 }, "<0.15");
      });
      tl.to([...bubbles, ...logs], { autoAlpha: 0, duration: 0.5, stagger: 0.03, ease: "power2.in" }, "+=2.8");

      // Plays while on screen, holds while the mouse is over it.
      const el = root.current!;
      let visible = false;
      let hovered = false;
      const sync = () => (visible && !hovered ? tl.play() : tl.pause());
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      }, { threshold: 0.2 });
      io.observe(el);
      const hover = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        hovered = e.type === "pointerenter";
        sync();
      };
      el.addEventListener("pointerenter", hover);
      el.addEventListener("pointerleave", hover);
      return () => {
        io.disconnect();
        el.removeEventListener("pointerenter", hover);
        el.removeEventListener("pointerleave", hover);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="@container absolute inset-0 flex text-[13px]">
      {/* Screen readers get the whole conversation at once; the animated version below is visual only. */}
      <ol className="sr-only">
        {chat.messages.map((m, i) => (
          <li key={i}>
            {t(chat.speakers[m.from], locale)}: {t(m.text, locale)}
          </li>
        ))}
      </ol>
      {/* chat column */}
      <div className="flex min-w-0 flex-1 flex-col border-line @min-[520px]:border-r" aria-hidden="true">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-line bg-graphite text-paper">
            <Mark className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-paper">{t(chat.header, locale)}</p>
          </div>
          <span className="label-mono rounded-full border border-copper/40 px-2 py-1 text-[0.58rem] text-copper">
            {t(chat.badge, locale)}
          </span>
        </div>

        <div className="relative flex flex-1 flex-col justify-end gap-2.5 overflow-hidden p-4">
          {chat.messages.map((m, i) => (
            <div
              key={i}
              className={`bubble max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-snug ${
                m.from === "agent"
                  ? "self-start rounded-bl-sm border border-copper/30 bg-copper/10 text-paper"
                  : "self-end rounded-br-sm bg-graphite text-paper/90"
              }`}
            >
              {t(m.text, locale)}
            </div>
          ))}
          <div className="typing flex w-fit gap-1 self-start rounded-2xl rounded-bl-sm border border-copper/30 bg-copper/10 px-3.5 py-3">
            {[0, 1, 2].map((d) => (
              <span key={d} className="typing-dot h-1.5 w-1.5 rounded-full bg-copper" style={{ animationDelay: `${d * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>

      {/* agent log */}
      <div className="hidden w-[38%] flex-col @min-[520px]:flex" aria-hidden="true">
        <div className="label-mono border-b border-line px-4 py-[1.13rem] text-[0.6rem] text-mute">agent.log</div>
        <div className="flex flex-1 flex-col gap-3 p-4 font-mono text-[11px] leading-relaxed">
          {LOG.map((lines, i) => (
            <div key={i} className="log-step">
              {lines.map((line) => (
                <p key={line} className={line.includes("✓") ? "text-copper" : "text-paper/60"}>
                  <span className="text-mute">{String(i + 1).padStart(2, "0")} </span>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
