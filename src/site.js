const revealNodes = [...document.querySelectorAll(".reveal")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function showNode(node) {
  node.classList.add("is-visible");
}

function isNearViewport(node) {
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.9;
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealNodes.forEach(showNode);
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          showNode(entry.target);
          observer.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.16,
    },
  );

  revealNodes.forEach((node) => {
    if (isNearViewport(node)) {
      showNode(node);
      return;
    }

    observer.observe(node);
  });
}
