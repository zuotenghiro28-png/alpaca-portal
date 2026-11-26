// AIと旅する係長 ポータル

const ALPACA_CATALOG = [
  { src: "alpaca_05.png", mode: "walk", lines: ["いま向かってます", "定時で帰ります", "ちょっと見回り中"] },
  { src: "alpaca_10.png", mode: "slide", lines: ["本日は省エネです", "台車がいちばん楽", "自動化に任せてます"] },
  { src: "alpaca_08.png", mode: "idle", lines: ["本日も、なで待ち", "ちょっと休憩中", "ぼーっとしてます"] },
  { src: "alpaca_09.png", mode: "idle", lines: ["待ってないですよ。首は伸びたけど。", "17:30まだかな", "次の旅先を考えてます"] },
  { src: "alpaca_12.png", mode: "walk", lines: ["着きました。もふ", "荷物は少なめです", "そろそろ出かけます"] },
  { src: "alpaca_02.png", mode: "idle", lines: ["今日は無理せずに", "いったん座りましょう", "続きは明日でいいかも"] },
  { src: "alpaca_03.png", mode: "idle", lines: ["了解です。ぬくぬく", "ひざ掛けが欠かせません", "あたたかくしてどうぞ"] },
  { src: "alpaca_04.png", mode: "idle", lines: ["ちょっと考える顔です", "これGASで減らせそう", "うーん、なるほど"] },
  { src: "alpaca_01.png", mode: "idle", lines: ["ありがとう。しみた", "いつもお疲れさまです", "助かります"] },
  { src: "alpaca_06.png", mode: "idle", lines: ["ちょっと失礼します", "そっと見てます", "おじゃまします"] },
  { src: "alpaca_07.png", mode: "idle", lines: ["重さは気持ちです", "資料を読み込み中", "ちょっと一息"] },
  { src: "alpaca_11.png", mode: "idle", lines: ["おはよう。毛は元気", "まずはコーヒーから", "今日もぼちぼちで"] }
];

const OMIKUJI_STAMPS = [
  { src: "alpaca_01.png", quote: "「ありがとう。しみた」", note: "忙しくても、ひとこと感謝を返せると現場の空気が少しやわらぎます。" },
  { src: "alpaca_02.png", quote: "「今日は無理せずに」", note: "区切りのいいところで切り上げて、続きは明日の自分に任せましょう。" },
  { src: "alpaca_03.png", quote: "「了解です。ぬくぬく」", note: "温かい飲み物を1杯いれてから取りかかるくらいがちょうどいいです。" },
  { src: "alpaca_04.png", quote: "「ちょっと考える顔です」", note: "行き詰まったら、いま困っていることをそのままAIに書き出してみてください。" },
  { src: "alpaca_05.png", quote: "「いま向かってます」", note: "大きな改革より、今日の5分を減らす一歩からで十分進みます。" },
  { src: "alpaca_06.png", quote: "「ちょっと失礼します」", note: "全部を自分で抱え込まず、使えるテンプレートは遠慮なく借りましょう。" },
  { src: "alpaca_07.png", quote: "「重さは気持ちです」", note: "分厚い資料や議事録は、まずNotebookLMに読ませてから眺めると楽です。" },
  { src: "alpaca_08.png", quote: "「本日も、なで待ち」", note: "地味な改善ほど気づかれにくいので、自分で自分を労っておきましょう。" },
  { src: "alpaca_09.png", quote: "「待ってないですよ。首は伸びたけど。」", note: "確認待ちや転記待ちのスキマ時間は、GASに任せるとだいぶ気が楽になります。" },
  { src: "alpaca_10.png", quote: "「本日は省エネです」", note: "毎日全力だと持ちません。台車に乗るくらいの省エネ運転の日も大事です。" },
  { src: "alpaca_11.png", quote: "「おはよう。毛は元気」", note: "今日片づけることを3つだけ決めておくと、夕方バタバタしにくくなります。" },
  { src: "alpaca_12.png", quote: "「着きました。もふ」", note: "仕事が終わったら、浮いた時間でゆっくり好きな場所へ出かけましょう。" }
];

// 1. ファーストビュー：アルパカたちの自然な行動AI
(function initPlayground() {
  const field = document.getElementById("alpacaField");
  const stage = document.getElementById("meadowStage");
  const hero = document.getElementById("heroPlayground");
  const countEl = document.getElementById("alpacaCount");
  const energyLabel = document.getElementById("energyLabel");
  const timeLabel = document.getElementById("timeLabel");
  const statusBanner = document.getElementById("statusBannerText");
  const btnAdd = document.getElementById("btnAddAlpaca");
  const btnEnergy = document.getElementById("btnEnergyMode");
  const btnTime = document.getElementById("btnTimeToggle");

  if (!field || !stage) return;

  let energySaving = false;
  let isSunset = false;
  const actors = [];

  function setActorPoseClass(actor, cls) {
    actor.el.classList.remove("is-walking", "is-sliding", "is-resting");
    actor.el.classList.add(cls);
  }

  function applyDepthTransform(actor) {
    const depthRatio = 1 - ((actor.yBottom - 12) / 100) * 0.2;
    const scale = Math.max(0.78, Math.min(1.04, depthRatio));
    actor.el.style.left = `${actor.x}px`;
    actor.el.style.bottom = `${actor.yBottom}px`;
    actor.el.style.zIndex = `${Math.round(140 - actor.yBottom)}`;
    actor.el.style.transform = `scale(${scale.toFixed(3)})`;
    actor.el.style.setProperty("--facing", String(actor.facing));
  }

  function spawnDots(x, yBottom) {
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span");
      dot.className = "pop-dot";
      dot.style.left = `${x + 30 + (Math.random() * 28 - 14)}px`;
      dot.style.bottom = `${yBottom + 80}px`;
      dot.style.setProperty("--dx", `${Math.round(Math.random() * 44 - 22)}px`);
      field.appendChild(dot);
      setTimeout(() => dot.remove(), 820);
    }
  }

  function speakActor(actor, customLine) {
    actor.el.classList.remove("is-jumping");
    void actor.el.offsetWidth;
    actor.el.classList.add("is-jumping");

    const line = customLine || actor.data.lines[Math.floor(Math.random() * actor.data.lines.length)];
    actor.bubble.textContent = line;
    actor.bubble.classList.add("show");
    clearTimeout(actor.bubbleTimer);
    actor.bubbleTimer = setTimeout(() => {
      actor.bubble.classList.remove("show");
    }, 2300);

    spawnDots(actor.x, actor.yBottom);
  }

  function pickNextDestination(actor, fieldW) {
    const margin = 24;
    const minX = margin;
    const maxX = Math.max(minX + 40, fieldW - 110);
    const span = 120 + Math.random() * 240;
    const sign = Math.random() > 0.5 ? 1 : -1;
    let tx = actor.x + sign * span;
    if (tx < minX) tx = minX + Math.random() * 140;
    if (tx > maxX) tx = maxX - Math.random() * 140;

    const ty = 14 + Math.random() * 88;
    actor.targetX = tx;
    actor.targetY = ty;
    actor.state = "move";
    actor.vx = 0;
    actor.vy = 0;
    setActorPoseClass(actor, actor.data.mode === "slide" ? "is-sliding" : "is-walking");
  }

  function spawnAlpaca(catalogIndex, startXPercent) {
    const data = ALPACA_CATALOG[catalogIndex % ALPACA_CATALOG.length];
    const el = document.createElement("div");
    el.className = "alpaca-actor";

    el.style.setProperty("--breath-dur", `${(2.6 + Math.random() * 1.8).toFixed(2)}s`);
    el.style.setProperty("--walk-dur", `${(0.46 + Math.random() * 0.22).toFixed(2)}s`);
    el.style.setProperty("--anim-delay", `${(-Math.random() * 3).toFixed(2)}s`);

    const wrap = document.createElement("div");
    wrap.className = "alpaca-sprite-wrap";

    const bubble = document.createElement("div");
    bubble.className = "alpaca-bubble";
    bubble.textContent = data.lines[0];

    const img = document.createElement("img");
    img.src = data.src;
    img.alt = "アルパカ係長";
    img.className = "alpaca-sprite";
    img.draggable = false;

    const shadow = document.createElement("div");
    shadow.className = "alpaca-shadow";

    wrap.appendChild(bubble);
    wrap.appendChild(img);
    wrap.appendChild(shadow);
    el.appendChild(wrap);
    field.appendChild(el);

    const fieldW = field.clientWidth || 960;
    const x = startXPercent !== undefined
      ? (fieldW * startXPercent) / 100
      : 40 + Math.random() * Math.max(120, fieldW - 140);
    const yBottom = 16 + Math.random() * 84;

    const isMover = data.mode === "walk" || data.mode === "slide";
    const baseSpeed = data.mode === "slide"
      ? 1.05 + Math.random() * 0.35
      : data.mode === "walk"
      ? 0.72 + Math.random() * 0.35
      : 0;

    const actor = {
      el,
      img,
      bubble,
      data,
      x,
      yBottom,
      vx: 0,
      vy: 0,
      facing: Math.random() > 0.5 ? 1 : -1,
      baseSpeed,
      state: isMover ? "rest" : "idle",
      stateTimer: 30 + Math.floor(Math.random() * 110),
      targetX: null,
      targetY: null,
      chatCooldown: 140 + Math.floor(Math.random() * 240),
      bubbleTimer: null
    };

    setActorPoseClass(actor, "is-resting");
    applyDepthTransform(actor);

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      speakActor(actor);
    });

    actors.push(actor);
    if (countEl) countEl.textContent = String(actors.length);
  }

  const initialIndices = [0, 1, 2, 3, 4, 5];
  const initialPercents = [9, 25, 41, 57, 73, 85];
  initialIndices.forEach((idx, i) => spawnAlpaca(idx, initialPercents[i]));

  // 床をクリックするとアルパカたちが寄ってくる
  stage.addEventListener("click", (e) => {
    if (e.target.closest(".stage-controls") || e.target.closest(".alpaca-actor")) return;
    const rect = field.getBoundingClientRect();
    if (e.clientY < rect.top) return;

    const clickX = Math.max(20, Math.min(rect.width - 96, e.clientX - rect.left - 36));
    const clickY = e.clientY - rect.top;
    const targetBottom = Math.max(14, Math.min(100, rect.height - clickY - 12));

    const ripple = document.createElement("span");
    ripple.className = "call-ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${clickY}px`;
    field.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);

    let called = false;
    actors.forEach((a) => {
      if (a.baseSpeed > 0) {
        a.targetX = Math.max(16, Math.min(rect.width - 104, clickX + (Math.random() * 70 - 35)));
        a.targetY = Math.max(14, Math.min(100, targetBottom + (Math.random() * 24 - 12)));
        a.state = "move";
        a.stateTimer = 0;
        setActorPoseClass(a, a.data.mode === "slide" ? "is-sliding" : "is-walking");
        if (!called) {
          speakActor(a, "いま向かってます");
          called = true;
        }
      } else {
        a.facing = clickX >= a.x ? 1 : -1;
        applyDepthTransform(a);
      }
    });
  });

  function tick() {
    const fieldW = field.clientWidth || 960;
    const speedFactor = energySaving ? 0.35 : 1;

    for (let i = 0; i < actors.length; i++) {
      const a = actors[i];
      if (a.chatCooldown > 0) a.chatCooldown--;

      if (a.baseSpeed > 0) {
        if (a.state === "move" && a.targetX !== null && a.targetY !== null) {
          const dx = a.targetX - a.x;
          const dy = a.targetY - a.yBottom;
          const dist = Math.hypot(dx, dy);

          if (dist < 10) {
            a.vx *= 0.7;
            a.vy *= 0.7;
            a.targetX = null;
            a.targetY = null;
            a.state = "rest";
            a.stateTimer = (energySaving ? 180 : 90) + Math.floor(Math.random() * 160);
            setActorPoseClass(a, "is-resting");
          } else {
            const slowDown = Math.min(1, dist / 65);
            const desiredSpeed = a.baseSpeed * speedFactor * (0.35 + 0.65 * slowDown);
            const desiredVx = (dx / dist) * desiredSpeed;
            const desiredVy = (dy / dist) * desiredSpeed * 0.45;

            const accel = a.data.mode === "slide" ? 0.045 : 0.08;
            a.vx += (desiredVx - a.vx) * accel;
            a.vy += (desiredVy - a.vy) * accel;

            a.x += a.vx;
            a.yBottom += a.vy;

            if (Math.abs(a.vx) > 0.08) {
              a.facing = a.vx > 0 ? 1 : -1;
            }
            applyDepthTransform(a);
          }
        } else {
          a.stateTimer--;
          if (a.stateTimer === 45 && Math.random() < 0.45) {
            a.facing *= -1;
            applyDepthTransform(a);
          }
          if (a.stateTimer <= 0) {
            if (!energySaving && Math.random() < 0.22) {
              a.el.classList.remove("is-hop");
              void a.el.offsetWidth;
              a.el.classList.add("is-hop");
            }
            pickNextDestination(a, fieldW);
          }
        }
      } else {
        a.stateTimer--;
        if (a.stateTimer <= 0) {
          a.stateTimer = 140 + Math.floor(Math.random() * 240);
          const roll = Math.random();
          if (roll < 0.45) {
            a.facing *= -1;
            applyDepthTransform(a);
          } else if (roll < 0.7 && !energySaving) {
            a.el.classList.remove("is-hop");
            void a.el.offsetWidth;
            a.el.classList.add("is-hop");
          }
        }
      }

      if (a.chatCooldown <= 0 && Math.random() < 0.0022) {
        for (let j = 0; j < actors.length; j++) {
          if (i === j) continue;
          const b = actors[j];
          const d = Math.hypot(a.x - b.x, a.yBottom - b.yBottom);
          if (d < 90 && !a.bubble.classList.contains("show")) {
            const line = a.data.lines[Math.floor(Math.random() * a.data.lines.length)];
            a.bubble.textContent = line;
            a.bubble.classList.add("show");
            clearTimeout(a.bubbleTimer);
            a.bubbleTimer = setTimeout(() => a.bubble.classList.remove("show"), 2000);
            a.chatCooldown = 440;
            break;
          }
        }
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  if (btnAdd) {
    btnAdd.addEventListener("click", (e) => {
      e.stopPropagation();
      if (actors.length >= 14) {
        btnAdd.textContent = "満員になりました（14）";
        return;
      }
      spawnAlpaca(actors.length % ALPACA_CATALOG.length);
      speakActor(actors[actors.length - 1]);
    });
  }

  if (btnEnergy) {
    btnEnergy.addEventListener("click", (e) => {
      e.stopPropagation();
      energySaving = !energySaving;
      if (energyLabel) energyLabel.textContent = energySaving ? "ON" : "OFF";
      actors.forEach((a) => {
        if (energySaving) {
          setActorPoseClass(a, "is-resting");
        } else if (a.state === "move") {
          setActorPoseClass(a, a.data.mode === "slide" ? "is-sliding" : "is-walking");
        }
      });
    });
  }

  if (btnTime && hero) {
    btnTime.addEventListener("click", (e) => {
      e.stopPropagation();
      isSunset = !isSunset;
      hero.classList.toggle("is-sunset", isSunset);
      if (timeLabel) timeLabel.textContent = isSunset ? "昼の空気に戻す" : "17:30の空気に変える";
      if (statusBanner) {
        statusBanner.textContent = isSunset
          ? "17:30 定時退社。浮いた時間で旅に出る。"
          : "製造業の現場DXと、定時退社の記録";
      }
      if (actors[0]) {
        speakActor(actors[0], isSunset ? "定時なので帰ります" : "おはよう。毛は元気");
      }
    });
  }
})();

// 2. 記事カテゴリフィルター
(function initArticleFilter() {
  const tabs = document.querySelectorAll(".tab-btn");
  const rows = document.querySelectorAll(".article-row");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;
      rows.forEach((row) => {
        const match = filter === "all" || row.dataset.category === filter;
        row.classList.toggle("is-hidden", !match);
      });
    });
  });
})();

// 3. 今日のひとこと
(function initOmikuji() {
  const btn = document.getElementById("btnOmikuji");
  const img = document.getElementById("omikujiImg");
  const quote = document.getElementById("omikujiQuote");
  const msg = document.getElementById("omikujiMsg");
  if (!btn || !img || !quote || !msg) return;

  let lastIdx = 1;
  let isRolling = false;

  btn.addEventListener("click", () => {
    if (isRolling) return;
    isRolling = true;
    btn.disabled = true;
    img.classList.add("shuffling");

    let ticks = 0;
    const timer = setInterval(() => {
      const r = Math.floor(Math.random() * OMIKUJI_STAMPS.length);
      img.src = OMIKUJI_STAMPS[r].src;
      ticks++;
      if (ticks >= 5) {
        clearInterval(timer);
        let idx = Math.floor(Math.random() * OMIKUJI_STAMPS.length);
        if (idx === lastIdx) idx = (idx + 1) % OMIKUJI_STAMPS.length;
        lastIdx = idx;

        const item = OMIKUJI_STAMPS[idx];
        img.src = item.src;
        quote.textContent = item.quote;
        msg.textContent = item.note;
        img.classList.remove("shuffling");

        btn.disabled = false;
        isRolling = false;
      }
    }, 70);
  });
})();

// 4. スクロール連動
(function initScrollEffects() {
  const floatingBtn = document.getElementById("floatingNoteBtn");

  window.addEventListener("scroll", () => {
    if (floatingBtn) floatingBtn.classList.toggle("show", window.scrollY > 480);
  }, { passive: true });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
