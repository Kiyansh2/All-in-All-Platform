const appInfo = {
  platform: {
    title: "All in All Platform",
    text: "One home for products that help people protect attention and build capability."
  },
  focus: {
    title: "All in All",
    text: "Blocks distractions and creates a doorway back to focused work."
  },
  coach: {
    title: "AI Coach",
    text: "Helps users pause, understand urges, and choose one better next action."
  },
  growth: {
    title: "LifeForge",
    text: "Turns protected time into habits, skills, goals, and visible progress."
  },
  money: {
    title: "MoneyWise",
    text: "Helps users learn money, plan goals, and think before spending."
  },
  ideas: {
    title: "IdeaForge",
    text: "Turns rough ideas into features, roadmaps, MVPs, and startup plans."
  }
};

const mobileToggle = document.getElementById("mobileToggle");
const navMenu = document.getElementById("navMenu");

if (mobileToggle && navMenu) {
  mobileToggle.addEventListener("click", () => {
    const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
    mobileToggle.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open", !expanded);
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
}

const visualCard = document.getElementById("visualCard");
const nodes = document.querySelectorAll(".orbit-node");

function selectNode(key) {
  const info = appInfo[key] || appInfo.platform;
  if (visualCard) {
    visualCard.innerHTML = `
      <small>Selected node</small>
      <strong>${info.title}</strong>
      <p>${info.text}</p>
    `;
  }
  nodes.forEach(node => node.classList.toggle("is-selected", node.dataset.app === key));
}

nodes.forEach(node => {
  node.addEventListener("mouseenter", () => selectNode(node.dataset.app));
  node.addEventListener("focus", () => selectNode(node.dataset.app));
  node.addEventListener("click", () => selectNode(node.dataset.app));
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    if (!target || el.dataset.done) return;
    el.dataset.done = "true";

    let current = 0;
    const steps = 32;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = String(target);
        clearInterval(timer);
      } else {
        el.textContent = String(Math.ceil(current));
      }
    }, 24);
  });
}, { threshold: 0.5 });

document.querySelectorAll("[data-count]").forEach(el => countObserver.observe(el));

document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("mousemove", event => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,.14), rgba(255,255,255,.04))`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.background = "";
  });
});

const canvas = document.getElementById("starfield");
const ctx = canvas?.getContext("2d");
let stars = [];
let rafId = null;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(110, Math.floor(window.innerWidth / 12));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.6 + 0.25,
    a: Math.random() * 0.55 + 0.12,
    s: Math.random() * 0.25 + 0.08
  }));
}

function drawStars() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const star of stars) {
    star.y += star.s;
    if (star.y > window.innerHeight + 5) {
      star.y = -5;
      star.x = Math.random() * window.innerWidth;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${star.a})`;
    ctx.fill();
  }
  rafId = requestAnimationFrame(drawStars);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && ctx && !reduceMotion) {
  resizeCanvas();
  drawStars();
  window.addEventListener("resize", resizeCanvas, { passive: true });
} else if (canvas) {
  canvas.remove();
}
