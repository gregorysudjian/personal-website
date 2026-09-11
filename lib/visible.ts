/** Plays an animation only while its element is on screen, pausing it otherwise. */
export function playWhenVisible(el: Element, anim: { play: () => unknown; pause: () => unknown }, threshold = 0.2) {
  const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? anim.play() : anim.pause()), {
    threshold,
  });
  io.observe(el);
  return () => io.disconnect();
}
