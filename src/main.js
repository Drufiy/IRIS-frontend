import "./styles.css";

const states = [
  {
    label: "LISTENING",
    detail: "capturing wake word and intent",
    theme: "theme-listening",
  },
  {
    label: "REASONING",
    detail: "routing through memory and agents",
    theme: "theme-reasoning",
  },
  {
    label: "ACTING",
    detail: "executing across desktop and browser",
    theme: "theme-acting",
  },
];

const stateText = document.querySelector("[data-state-text]");
const stateStatus = document.querySelector("[data-state-status]");
const commandLabel = document.querySelector("[data-command-label]");
const commandText = document.querySelector("[data-command-text]");
const shell = document.querySelector(".site-shell");

let currentState = 0;

const commands = [
  {
    label: "route",
    text: "deepseek routing active",
  },
  {
    label: "action",
    text: "launching browser and loading repo",
  },
  {
    label: "memory",
    text: "saving context for next interaction",
  },
];

let currentCommand = 0;

function applySignalState(index) {
  const next = states[index];
  if (!stateText || !stateStatus || !shell) return;

  stateText.textContent = next.label;
  stateStatus.textContent = next.detail;

  shell.classList.remove("theme-listening", "theme-reasoning", "theme-acting");
  shell.classList.add(next.theme);
}

applySignalState(currentState);

function applyCommand(index) {
  const next = commands[index];
  if (!commandLabel || !commandText) return;

  commandLabel.textContent = next.label;
  commandText.textContent = next.text;
}

applyCommand(currentCommand);

window.setInterval(() => {
  currentState = (currentState + 1) % states.length;
  applySignalState(currentState);

  currentCommand = (currentCommand + 1) % commands.length;
  applyCommand(currentCommand);
}, 2400);

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
