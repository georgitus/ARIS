/* ============================================================
   ARIS · UI Prototype — interacciones del prototipo
   ============================================================ */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     Escalado de las pantallas
     Las vistas están diseñadas a 390 × 844 px. Cada marco las
     escala de forma proporcional para que se vean idénticas en
     cualquier ancho de columna.
     ---------------------------------------------------------- */
  var SCREEN_WIDTH = 390;
  var phones = Array.prototype.slice.call(document.querySelectorAll(".phone"));

  function fitScreens() {
    phones.forEach(function (phone) {
      var viewport = phone.querySelector(".viewport");
      if (!viewport) return;
      var width = viewport.clientWidth;
      if (!width) return;
      phone.style.setProperty("--scale", String(width / SCREEN_WIDTH));
    });
  }

  if ("ResizeObserver" in window) {
    var observer = new ResizeObserver(fitScreens);
    phones.forEach(function (phone) {
      var viewport = phone.querySelector(".viewport");
      if (viewport) observer.observe(viewport);
    });
  }

  window.addEventListener("resize", fitScreens, { passive: true });
  window.addEventListener("load", fitScreens);
  fitScreens();

  /* ----------------------------------------------------------
     Mostrar / ocultar contraseña
     ---------------------------------------------------------- */
  document.querySelectorAll("[data-toggle-password]").forEach(function (button) {
    button.addEventListener("click", function () {
      var input = document.getElementById(button.getAttribute("aria-controls"));
      if (!input) return;

      var show = input.type === "password";
      input.type = show ? "text" : "password";
      button.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");

      var use = button.querySelector("use");
      if (use) use.setAttribute("href", show ? "#i-eye-off" : "#i-eye");
    });
  });

  /* ----------------------------------------------------------
     Formulario de registro (prototipo, sin envío)
     ---------------------------------------------------------- */
  document.querySelectorAll("[data-prototype-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  });

  /* ----------------------------------------------------------
     Guía paso a paso: RCP y otras maniobras
     ---------------------------------------------------------- */
  var guideScreen = document.querySelector(".screen--cpr");
  if (guideScreen) {
    var guideCard = guideScreen.querySelector("[data-guide]");
    var guideStage = guideScreen.querySelector("[data-guide-stage]");
    var guideLabel = guideScreen.querySelector("[data-guide-label]");
    var guideTitle = guideScreen.querySelector("[data-guide-title]");
    var guideMeta = guideScreen.querySelector("[data-guide-meta]");
    var guideDuration = guideScreen.querySelector("[data-guide-duration]");
    var guideTip = guideScreen.querySelector("[data-guide-tip]");
    var guideMetrics = guideScreen.querySelector("[data-guide-metrics]");
    var guideSteps = guideScreen.querySelector("[data-guide-steps]");
    var guideCount = guideScreen.querySelector("[data-guide-count]");
    var guideStepLabel = guideScreen.querySelector("[data-guide-step-label]");
    var guideProgress = guideScreen.querySelector("[data-guide-progress]");
    var guideCurrent = guideScreen.querySelector("[data-guide-current]");
    var guideTotal = guideScreen.querySelector("[data-guide-total]");
    var guidePlay = guideScreen.querySelector("[data-guide-play]");
    var guideToggle = guideScreen.querySelector("[data-guide-toggle]");
    var guideSoundBtn = guideScreen.querySelector("[data-guide-sound]");
    var guideNext = guideScreen.querySelector("[data-guide-next]");
    var guideNextLabel = guideScreen.querySelector("[data-guide-next-label]");
    var maneuverRow = guideScreen.querySelector(".maneuver-row");

    var SCENES = {
      check: `<svg viewBox="0 0 350 182" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M38 130h274" stroke="#2E5A82" stroke-opacity=".45" stroke-width="1.5"/>
          <rect x="118" y="88" width="96" height="26" rx="13" fill="#12324F" stroke="#6FA8D0" stroke-width="1.8"/>
          <circle cx="98" cy="100" r="13" fill="#12324F" stroke="#8FC8EC" stroke-width="1.8"/>
          <rect x="214" y="102" width="46" height="16" rx="8" fill="#12324F" stroke="#6FA8D0" stroke-width="1.8"/>
          <path class="scene-chest" d="M142 82q18-9 36 0" stroke="#38BDF8" stroke-width="2.2" opacity=".9"/>
          <circle cx="262" cy="54" r="11" fill="#12324F" stroke="#8FC8EC" stroke-width="1.8"/>
          <path d="M262 65v47M262 78l-46 14" stroke="#8FC8EC" stroke-width="2"/>
          <circle cx="213" cy="93" r="5" fill="#38BDF8"/>
          <path d="M262 112v18" stroke="#8FC8EC" stroke-width="2"/>
        </g>
      </svg>`,
      call: `<svg viewBox="0 0 350 182" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle class="scene-ring" cx="175" cy="82" r="54" stroke="#38BDF8" stroke-width="1.5" opacity=".6"/>
          <circle class="scene-ring scene-ring--2" cx="175" cy="82" r="72" stroke="#38BDF8" stroke-width="1.2" opacity=".35"/>
          <rect x="143" y="28" width="64" height="108" rx="14" fill="#0F2A47" stroke="#8FC8EC" stroke-width="2"/>
          <rect x="151" y="42" width="48" height="76" rx="6" fill="#0A192F" stroke="#2E5A82" stroke-width="1.2"/>
          <text x="175" y="86" text-anchor="middle" font-family="Inter, Segoe UI, sans-serif" font-size="24" font-weight="700" fill="#7DD3FC" stroke="none">911</text>
          <path d="M166 108h18" stroke="#5E8FB8" stroke-width="2"/>
          <circle cx="175" cy="124" r="2.5" fill="#5E8FB8"/>
          <rect x="200" y="108" width="30" height="30" rx="8" fill="#0F2A47" stroke="#38BDF8" stroke-width="1.5"/>
          <path d="M215 115v16M207 123h16" stroke="#38BDF8" stroke-width="2.4"/>
        </g>
      </svg>`,
      compress: `<svg viewBox="0 0 350 182" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M38 132h274" stroke="#2E5A82" stroke-opacity=".45" stroke-width="1.5"/>
          <rect x="118" y="90" width="96" height="26" rx="13" fill="#12324F" stroke="#6FA8D0" stroke-width="1.8"/>
          <circle cx="98" cy="102" r="13" fill="#12324F" stroke="#8FC8EC" stroke-width="1.8"/>
          <rect x="214" y="104" width="46" height="16" rx="8" fill="#12324F" stroke="#6FA8D0" stroke-width="1.8"/>
          <g class="scene-hands">
            <rect x="158" y="78" width="30" height="18" rx="8" fill="#38BDF8" fill-opacity=".22" stroke="#7DD3FC" stroke-width="1.8"/>
            <rect x="168" y="88" width="30" height="18" rx="8" fill="#38BDF8" fill-opacity=".16" stroke="#7DD3FC" stroke-width="1.8"/>
          </g>
          <path class="scene-arrow" d="M150 58v13m0 0-5-5m5 5 5-5" stroke="#38BDF8" stroke-width="2"/>
          <path class="scene-arrow scene-arrow--2" d="M200 58v13m0 0-5-5m5 5 5-5" stroke="#38BDF8" stroke-width="2"/>
          <path d="M46 150h50l8-9 9 19 9-13 5 3h50" stroke="#38BDF8" stroke-opacity=".32" stroke-width="1.5"/>
        </g>
      </svg>`,
      compressChild: `<svg viewBox="0 0 350 182" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M44 132h262" stroke="#2E5A82" stroke-opacity=".45" stroke-width="1.5"/>
          <rect x="132" y="96" width="72" height="22" rx="11" fill="#12324F" stroke="#6FA8D0" stroke-width="1.8"/>
          <circle cx="116" cy="106" r="11" fill="#12324F" stroke="#8FC8EC" stroke-width="1.8"/>
          <rect x="204" y="106" width="38" height="14" rx="7" fill="#12324F" stroke="#6FA8D0" stroke-width="1.8"/>
          <g class="scene-hands">
            <rect x="160" y="84" width="10" height="18" rx="5" fill="#38BDF8" fill-opacity=".25" stroke="#7DD3FC" stroke-width="1.6"/>
            <rect x="174" y="84" width="10" height="18" rx="5" fill="#38BDF8" fill-opacity=".25" stroke="#7DD3FC" stroke-width="1.6"/>
          </g>
          <path class="scene-arrow" d="M160 64v12m0 0-4-4m4 4 4-4" stroke="#38BDF8" stroke-width="2"/>
          <path class="scene-arrow scene-arrow--2" d="M186 64v12m0 0-4-4m4 4 4-4" stroke="#38BDF8" stroke-width="2"/>
        </g>
      </svg>`,
      continue: `<svg viewBox="0 0 350 182" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <g class="scene-cycle">
            <path d="M175 34a52 52 0 1 1-38 16" stroke="#38BDF8" stroke-width="2" opacity=".7"/>
            <path d="m128 44 9 6-10 6" stroke="#38BDF8" stroke-width="2"/>
          </g>
          <rect x="137" y="58" width="76" height="58" rx="10" fill="#0F2A47" stroke="#8FC8EC" stroke-width="2"/>
          <rect x="148" y="68" width="54" height="26" rx="5" fill="#0A192F" stroke="#2E5A82" stroke-width="1.2"/>
          <path class="scene-heart" d="M160 80h6l3-5 4 10 3-5h5" stroke="#38BDF8" stroke-width="2"/>
          <circle cx="175" cy="104" r="5" fill="#38BDF8" fill-opacity=".25" stroke="#38BDF8" stroke-width="1.5"/>
        </g>
      </svg>`,
      choke: `<svg viewBox="0 0 350 182" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="175" cy="42" r="14" fill="#12324F" stroke="#8FC8EC" stroke-width="2"/>
          <path d="M175 56v40M175 64l-23 12-6 20M175 64l23 12 6 20M175 96l-18 26M175 96l18 26" stroke="#8FC8EC" stroke-width="2.2"/>
          <circle cx="164" cy="58" r="4" fill="#38BDF8"/>
          <circle cx="186" cy="58" r="4" fill="#38BDF8"/>
          <path d="M150 50q-8 4-6 14M200 50q8 4 6 14" stroke="#38BDF8" stroke-width="2"/>
          <g class="scene-alarm" stroke="#F87171" stroke-width="2">
            <path d="M214 30v10M222 36l7-7M222 48l8 4"/>
          </g>
        </g>
      </svg>`,
      backblows: `<svg viewBox="0 0 350 182" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M40 134h270" stroke="#2E5A82" stroke-opacity=".45" stroke-width="1.5"/>
          <circle cx="138" cy="86" r="13" fill="#12324F" stroke="#8FC8EC" stroke-width="2"/>
          <path d="M150 94 208 66" stroke="#8FC8EC" stroke-width="2.2"/>
          <path d="M202 70 226 106M202 70 188 112" stroke="#8FC8EC" stroke-width="2.2"/>
          <g class="scene-hand">
            <rect x="186" y="60" width="28" height="16" rx="7" fill="#38BDF8" fill-opacity=".22" stroke="#7DD3FC" stroke-width="1.8"/>
            <path d="M214 52 232 38" stroke="#7DD3FC" stroke-width="2"/>
          </g>
          <g class="scene-impact" stroke="#38BDF8" stroke-width="2">
            <path d="M180 62h-8M180 70h-6M180 78h-8"/>
          </g>
        </g>
      </svg>`,
      thrusts: `<svg viewBox="0 0 350 182" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="175" cy="38" r="14" fill="#12324F" stroke="#8FC8EC" stroke-width="2"/>
          <path d="M175 52v46M175 60 150 74l-4 24M175 60l25 14 4 24M175 98l-18 28M175 98l18 28" stroke="#8FC8EC" stroke-width="2.2"/>
          <rect x="161" y="76" width="28" height="16" rx="7" fill="#38BDF8" fill-opacity=".22" stroke="#7DD3FC" stroke-width="1.8"/>
          <path class="scene-in" d="M126 84h18m0 0-5-5m5 5-5 5" stroke="#38BDF8" stroke-width="2"/>
          <path class="scene-in scene-in--2" d="M224 84h-18m0 0 5-5m-5 5 5 5" stroke="#38BDF8" stroke-width="2"/>
        </g>
      </svg>`,
      bleed: `<svg viewBox="0 0 350 182" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M94 62c34 6 52 18 76 34l52 34" stroke="#8FC8EC" stroke-width="14" stroke-opacity=".16"/>
          <path d="M94 62c34 6 52 18 76 34l52 34" stroke="#8FC8EC" stroke-width="2"/>
          <path d="M94 76c34 6 52 18 76 34l52 34" stroke="#8FC8EC" stroke-width="2"/>
          <path d="M170 96c8-2 14 2 16 8" stroke="#F87171" stroke-width="2.5"/>
          <circle class="scene-drop" cx="178" cy="112" r="2.5" fill="#F87171"/>
          <circle class="scene-drop scene-drop--2" cx="186" cy="120" r="2" fill="#F87171"/>
          <path d="M232 44 246 68h-28Z" stroke="#F87171" stroke-width="2"/>
          <path d="M232 54v6M232 64h.01" stroke="#F87171" stroke-width="2"/>
        </g>
      </svg>`,
      press: `<svg viewBox="0 0 350 182" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M92 66c34 6 52 18 76 34l52 34" stroke="#8FC8EC" stroke-width="14" stroke-opacity=".16"/>
          <path d="M92 66c34 6 52 18 76 34l52 34" stroke="#8FC8EC" stroke-width="2"/>
          <path d="M92 80c34 6 52 18 76 34l52 34" stroke="#8FC8EC" stroke-width="2"/>
          <rect x="158" y="86" width="40" height="24" rx="6" fill="#E2F2FF" fill-opacity=".12" stroke="#BFE4FF" stroke-width="1.6" transform="rotate(28 178 98)"/>
          <g class="scene-press">
            <rect x="162" y="70" width="30" height="20" rx="8" fill="#38BDF8" fill-opacity=".22" stroke="#7DD3FC" stroke-width="1.8"/>
            <path d="M192 78 212 62" stroke="#7DD3FC" stroke-width="2"/>
          </g>
          <path class="scene-arrow" d="M177 52v10m0 0-5-5m5 5 5-5" stroke="#38BDF8" stroke-width="2"/>
        </g>
      </svg>`,
      elevate: `<svg viewBox="0 0 350 182" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M104 120c40-4 62-16 82-36l26-28" stroke="#8FC8EC" stroke-width="14" stroke-opacity=".16"/>
          <path d="M104 120c40-4 62-16 82-36l26-28" stroke="#8FC8EC" stroke-width="2"/>
          <path d="M104 134c40-4 62-16 82-36l26-28" stroke="#8FC8EC" stroke-width="2"/>
          <circle cx="216" cy="52" r="7" fill="#12324F" stroke="#8FC8EC" stroke-width="2"/>
          <g class="scene-up">
            <path d="M250 96V56m0 0-8 9m8-9 8 9" stroke="#38BDF8" stroke-width="2.2"/>
          </g>
          <path d="M64 60c-6-8-18-4-18 4 0 8 10 12 18 18 8-6 18-10 18-18 0-8-12-12-18-4Z" stroke="#38BDF8" stroke-width="1.8" fill="#38BDF8" fill-opacity=".08"/>
        </g>
      </svg>`
    };

    var GUIDE = {
      adultos: {
        label: "RCP adultos",
        title: "RCP en adultos",
        meta: "Guía básica de reanimación",
        duration: "4 min",
        tip: "30 compresiones y 2 ventilaciones por ciclo.",
        metrics: [
          { icon: "i-activity", label: "Frecuencia", value: "100–120", unit: "compresiones / min" },
          { icon: "i-arrow-down", label: "Profundidad", value: "5–6", unit: "centímetros" }
        ],
        steps: [
          { scene: "check", title: "Verificá la respiración", text: "Observá el pecho durante 10 segundos.", seconds: 7 },
          { scene: "call", title: "Llamá al 911", text: "Pedí una ambulancia y un DEA.", seconds: 7 },
          { scene: "compress", title: "Iniciá las compresiones", text: "Centro del pecho, manos entrelazadas.", seconds: 10, beat: true },
          { scene: "continue", title: "Continuá hasta que llegue ayuda", text: "No interrumpas el ritmo.", seconds: 7 }
        ]
      },
      ninos: {
        label: "RCP niños",
        title: "RCP en niños",
        meta: "Reanimación pediátrica",
        duration: "3 min",
        tip: "15 compresiones y 2 ventilaciones por ciclo.",
        metrics: [
          { icon: "i-activity", label: "Frecuencia", value: "100–120", unit: "compresiones / min" },
          { icon: "i-arrow-down", label: "Profundidad", value: "4–5", unit: "centímetros" }
        ],
        steps: [
          { scene: "check", title: "Verificá si responde", text: "Estimulá al niño y observá si respira.", seconds: 7 },
          { scene: "call", title: "Llamá al 911", text: "Pedí una ambulancia y un DEA.", seconds: 7 },
          { scene: "compressChild", title: "Iniciá las compresiones", text: "Una o dos manos en el centro del pecho.", seconds: 10, beat: true },
          { scene: "continue", title: "Continuá hasta que llegue ayuda", text: "Mantené el ritmo sin interrupciones.", seconds: 7 }
        ]
      },
      atragantamiento: {
        label: "Atragantamiento",
        title: "Maniobra de desobstrucción",
        meta: "Atragantamiento en adultos",
        duration: "3 min",
        tip: "Alterná 5 golpes en la espalda con 5 compresiones abdominales.",
        metrics: [
          { icon: "i-activity", label: "Ciclos", value: "5 + 5", unit: "golpes y compresiones" },
          { icon: "i-alert", label: "Si no respira", value: "911", unit: "llamá de inmediato" }
        ],
        steps: [
          { scene: "choke", title: "Preguntá si se ahoga", text: "Si no puede hablar ni toser, actuá.", seconds: 7 },
          { scene: "backblows", title: "5 golpes en la espalda", text: "Entre los omóplatos, con la base de la mano.", seconds: 8 },
          { scene: "thrusts", title: "5 compresiones abdominales", text: "Hacia adentro y hacia arriba.", seconds: 8 },
          { scene: "call", title: "Repetí y llamá al 911", text: "Si pierde el conocimiento, iniciá RCP.", seconds: 7 }
        ]
      },
      hemorragia: {
        label: "Hemorragia",
        title: "Control de hemorragia",
        meta: "Herida con sangrado abundante",
        duration: "3 min",
        tip: "Mantené la presión directa y no retires el apósito empapado.",
        metrics: [
          { icon: "i-activity", label: "Presión", value: "10 min", unit: "sin interrupciones" },
          { icon: "i-arrow-down", label: "Prioridad", value: "1º", unit: "controlar el sangrado" }
        ],
        steps: [
          { scene: "bleed", title: "Detectá el sangrado", text: "Protegé la herida y prepará una gasa.", seconds: 7 },
          { scene: "press", title: "Presión directa", text: "Presioná firme con una gasa limpia.", seconds: 8 },
          { scene: "elevate", title: "Elevá la zona", text: "Por encima del corazón si es posible.", seconds: 7 },
          { scene: "call", title: "Mantené y buscá ayuda", text: "No retires el apósito. Llamá al 911.", seconds: 7 }
        ]
      }
    };

    var guideKey = "adultos";
    var guideData = GUIDE[guideKey];
    var guideStep = 0;
    var guideElapsed = 0;
    var guidePlaying = false;
    var guideTimer = null;
    var guideLastTick = 0;
    var guideSound = true;
    var guideAudio = null;
    var guideBeatTimer = null;

    function guideTotalSeconds() {
      return guideData.steps.reduce(function (total, step) {
        return total + step.seconds;
      }, 0);
    }

    function formatTime(value) {
      return Math.floor(value / 60) + ":" + String(value % 60).padStart(2, "0");
    }

    function renderGuideProgress() {
      var total = guideTotalSeconds();
      var done = 0;
      var index;
      for (index = 0; index < guideStep; index += 1) {
        done += guideData.steps[index].seconds;
      }
      var elapsed = Math.min(done + guideElapsed / 1000, total);
      var percent = total ? (elapsed / total) * 100 : 0;
      if (guideProgress) guideProgress.style.width = percent + "%";
      if (guideCurrent) guideCurrent.textContent = formatTime(Math.floor(elapsed));
    }

    function renderGuideSteps() {
      if (!guideSteps) return;
      guideSteps.innerHTML = guideData.steps.map(function (step, index) {
        return '<li class="cpr-step">' +
          '<button class="cpr-step__btn" type="button" data-step="' + index + '" aria-label="Ir al paso ' + (index + 1) + ': ' + step.title + '">' +
            '<span class="cpr-step__num">' + (index + 1) + '</span>' +
            '<span class="cpr-step__body">' +
              '<strong>' + step.title + '</strong>' +
              '<span class="cpr-step__text">' + step.text + '</span>' +
            '</span>' +
          '</button>' +
        '</li>';
      }).join("");
      updateGuideStepState();
    }

    function updateGuideStepState() {
      if (!guideSteps) return;
      Array.prototype.forEach.call(guideSteps.querySelectorAll(".cpr-step"), function (item, index) {
        var done = index < guideStep;
        var active = index === guideStep;
        item.classList.toggle("is-done", done);
        item.classList.toggle("is-active", active);
        var num = item.querySelector(".cpr-step__num");
        if (num) {
          if (done) {
            if (!num.querySelector("svg")) {
              num.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';
            }
          } else if (num.querySelector("svg")) {
            num.textContent = String(index + 1);
          }
        }
        var button = item.querySelector(".cpr-step__btn");
        if (button) {
          if (active) button.setAttribute("aria-current", "step");
          else button.removeAttribute("aria-current");
        }
      });
    }

    function renderGuideStep() {
      var step = guideData.steps[guideStep];
      if (!step) return;
      if (guideStage) guideStage.innerHTML = SCENES[step.scene] || "";
      if (guideStepLabel) {
        guideStepLabel.textContent = "Paso " + (guideStep + 1) + " de " + guideData.steps.length + " · " + step.title;
      }
      if (guideCount) guideCount.textContent = (guideStep + 1) + " de " + guideData.steps.length;
      if (guideNextLabel) {
        guideNextLabel.textContent = guideStep === guideData.steps.length - 1 ? "Reiniciar guía" : "Continuar guía";
      }
      updateGuideStepState();
      renderGuideProgress();
    }

    function renderGuideManeuver() {
      if (guideLabel) guideLabel.textContent = guideData.label;
      if (guideTitle) guideTitle.textContent = guideData.title;
      if (guideMeta) guideMeta.textContent = guideData.meta;
      if (guideDuration) guideDuration.textContent = guideData.duration;
      if (guideTip) guideTip.textContent = guideData.tip;
      if (guideTotal) guideTotal.textContent = formatTime(guideTotalSeconds());
      if (guideMetrics) {
        guideMetrics.innerHTML = guideData.metrics.map(function (metric) {
          return '<div class="metric">' +
            '<span class="metric__icon"><svg class="icon" aria-hidden="true"><use href="#' + metric.icon + '"/></svg></span>' +
            '<div class="metric__body">' +
              '<span>' + metric.label + '</span>' +
              '<strong>' + metric.value + '</strong>' +
              '<small>' + metric.unit + '</small>' +
            '</div>' +
          '</div>';
        }).join("");
      }
      renderGuideSteps();
      renderGuideStep();
    }

    function updateGuideControls() {
      var icon = guidePlaying ? "#i-pause" : "#i-play";
      var label = guidePlaying ? "Pausar guía" : "Reproducir guía";
      if (guideCard) guideCard.classList.toggle("is-playing", guidePlaying);
      [guidePlay, guideToggle].forEach(function (button) {
        if (!button) return;
        button.setAttribute("aria-label", label);
        var use = button.querySelector("use");
        if (use) use.setAttribute("href", icon);
      });
    }

    function stopGuideBeat() {
      if (guideBeatTimer) {
        clearInterval(guideBeatTimer);
        guideBeatTimer = null;
      }
    }

    function guideBeatClick() {
      if (!guideAudio || guideAudio.state !== "running") return;
      var now = guideAudio.currentTime;
      var osc = guideAudio.createOscillator();
      var gain = guideAudio.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.16, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
      osc.connect(gain);
      gain.connect(guideAudio.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }

    function startGuideBeat() {
      stopGuideBeat();
      var step = guideData.steps[guideStep];
      if (!guideSound || !guidePlaying || !step || !step.beat) return;
      var AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;
      if (!guideAudio) guideAudio = new AudioCtor();
      if (guideAudio.state === "suspended" && guideAudio.resume) guideAudio.resume();
      guideBeatClick();
      guideBeatTimer = setInterval(guideBeatClick, 545);
    }

    function pauseGuide() {
      if (!guidePlaying) return;
      guidePlaying = false;
      if (guideTimer) {
        clearInterval(guideTimer);
        guideTimer = null;
      }
      stopGuideBeat();
      updateGuideControls();
    }

    function tickGuide() {
      var now = Date.now();
      var delta = now - guideLastTick;
      guideLastTick = now;
      guideElapsed += delta;
      var step = guideData.steps[guideStep];
      if (guideElapsed >= step.seconds * 1000) {
        if (guideStep < guideData.steps.length - 1) {
          guideStep += 1;
          guideElapsed = 0;
          renderGuideStep();
          startGuideBeat();
        } else {
          guideElapsed = step.seconds * 1000;
          renderGuideProgress();
          pauseGuide();
          if (guideCard) guideCard.classList.add("is-complete");
          return;
        }
      }
      renderGuideProgress();
    }

    function startGuide() {
      if (guidePlaying) return;
      var last = guideData.steps.length - 1;
      if (guideStep === last && guideElapsed >= guideData.steps[last].seconds * 1000) {
        guideStep = 0;
        guideElapsed = 0;
        renderGuideStep();
      }
      guidePlaying = true;
      if (guideCard) guideCard.classList.remove("is-complete");
      updateGuideControls();
      document.dispatchEvent(new CustomEvent("aris:audio", { detail: "guide" }));
      guideLastTick = Date.now();
      guideTimer = setInterval(tickGuide, 100);
      startGuideBeat();
    }

    function toggleGuide() {
      if (guidePlaying) pauseGuide();
      else startGuide();
    }

    if (guidePlay) guidePlay.addEventListener("click", toggleGuide);
    if (guideToggle) guideToggle.addEventListener("click", toggleGuide);
    if (guideNext) {
      guideNext.addEventListener("click", function () {
        if (guideStep < guideData.steps.length - 1) {
          guideStep += 1;
          guideElapsed = 0;
          renderGuideStep();
          if (guidePlaying) startGuideBeat();
          else startGuide();
        } else {
          guideStep = 0;
          guideElapsed = 0;
          if (guideCard) guideCard.classList.remove("is-complete");
          renderGuideStep();
          startGuide();
        }
      });
    }

    if (guideSteps) {
      guideSteps.addEventListener("click", function (event) {
        var button = event.target.closest("[data-step]");
        if (!button) return;
        var index = parseInt(button.getAttribute("data-step"), 10);
        if (isNaN(index) || !guideData.steps[index]) return;
        guideStep = index;
        guideElapsed = 0;
        renderGuideStep();
        if (guidePlaying) startGuideBeat();
        else startGuide();
      });
    }

    if (maneuverRow) {
      maneuverRow.addEventListener("click", function (event) {
        var button = event.target.closest("[data-maneuver]");
        if (!button) return;
        var key = button.getAttribute("data-maneuver");
        if (!GUIDE[key] || key === guideKey) return;
        pauseGuide();
        guideKey = key;
        guideData = GUIDE[key];
        guideStep = 0;
        guideElapsed = 0;
        Array.prototype.forEach.call(maneuverRow.querySelectorAll("[data-maneuver]"), function (item) {
          var active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });
        if (guideCard) guideCard.classList.remove("is-complete");
        renderGuideManeuver();
        updateGuideControls();
      });
    }

    if (guideSoundBtn) {
      guideSoundBtn.addEventListener("click", function () {
        guideSound = !guideSound;
        guideSoundBtn.setAttribute("aria-pressed", guideSound ? "true" : "false");
        guideSoundBtn.setAttribute("aria-label", guideSound ? "Silenciar audio de la guía" : "Activar audio de la guía");
        var use = guideSoundBtn.querySelector("use");
        if (use) use.setAttribute("href", guideSound ? "#i-volume" : "#i-volume-off");
        var step = guideData.steps[guideStep];
        if (guideSound && guidePlaying && step && step.beat) startGuideBeat();
        else stopGuideBeat();
      });
    }

    document.addEventListener("aris:audio", function (event) {
      if (event.detail !== "guide" && guidePlaying) pauseGuide();
    });

    renderGuideManeuver();
    updateGuideControls();
  }

  /* ----------------------------------------------------------
     Opciones rápidas de voz
     ---------------------------------------------------------- */
  document.querySelectorAll(".quick-actions").forEach(function (group) {
    group.addEventListener("click", function (event) {
      var selected = event.target.closest(".quick-action");
      if (!selected) return;
      group.querySelectorAll(".quick-action").forEach(function (item) {
        var active = item === selected;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
    });
  });

  /* ----------------------------------------------------------
     Filtros de alertas
     ---------------------------------------------------------- */
  document.querySelectorAll(".filter-row").forEach(function (group) {
    group.addEventListener("click", function (event) {
      var selected = event.target.closest(".filter");
      if (!selected) return;
      group.querySelectorAll(".filter").forEach(function (item) {
        var active = item === selected;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", active ? "true" : "false");
      });
    });
  });

  /* ----------------------------------------------------------
     Asistente de voz: respuestas habladas
     ---------------------------------------------------------- */
  var voiceScreen = document.querySelector(".screen--voice");
  if (voiceScreen) {
    var voiceAudio = new Audio();
    voiceAudio.preload = "auto";

    var voiceTracks = {
      bienvenida: "audio/voz-bienvenida.mp3",
      sismo: "audio/voz-sismo.mp3",
      ambulancia: "audio/voz-ambulancia.mp3",
      rcp: "audio/voz-rcp.mp3",
      atrapado: "audio/voz-atrapado.mp3",
      alerta: "audio/voz-alerta.mp3",
      detener: "audio/voz-detener.mp3",
      reanudar: "audio/voz-reanudar.mp3"
    };

    var voiceTrack = "bienvenida";
    var voicePaused = false;
    var voiceSendTimer = null;

    var voicePlayBtn = voiceScreen.querySelector("[data-voice-play]");
    var voicePlayLabel = voiceScreen.querySelector("[data-voice-play-label]");
    var voicePlayIcon = voicePlayBtn ? voicePlayBtn.querySelector("use") : null;
    var voiceSendBtn = voiceScreen.querySelector("[data-voice-send]");
    var voiceSendLabel = voiceScreen.querySelector("[data-voice-send-label]");
    var voiceSendIcon = voiceSendBtn ? voiceSendBtn.querySelector("use") : null;
    var voiceStopBtn = voiceScreen.querySelector("[data-voice-stop]");
    var voiceStopLabel = voiceScreen.querySelector("[data-voice-stop-label]");
    var voiceStopIcon = voiceStopBtn ? voiceStopBtn.querySelector("use") : null;
    var voiceStatus = voiceScreen.querySelector("[data-voice-status]");
    var voiceTranscript = voiceScreen.querySelector("[data-voice-transcript]");
    var voiceTranscriptStatus = voiceScreen.querySelector("[data-voice-transcript-status]");

    function voiceIsPlaying() {
      return !voiceAudio.paused && !voiceAudio.ended;
    }

    function renderVoiceState() {
      var playing = voiceIsPlaying();
      voiceScreen.classList.toggle("is-speaking", playing);
      voiceScreen.classList.toggle("is-paused", voicePaused);

      if (voiceStatus) {
        voiceStatus.textContent = playing ? "Hablando" : (voicePaused ? "En pausa" : "Activo");
      }
      if (voiceTranscriptStatus) {
        voiceTranscriptStatus.textContent = playing
          ? "ARIS está respondiendo…"
          : (voicePaused ? "Escucha en pausa" : "Transcribiendo en tiempo real");
      }
      if (voicePlayLabel) {
        voicePlayLabel.textContent = playing ? "Reproduciendo…" : "Escuchar al asistente";
      }
      if (voicePlayIcon) {
        voicePlayIcon.setAttribute("href", playing ? "#i-pause" : "#i-volume");
      }
      if (voicePlayBtn) {
        voicePlayBtn.classList.toggle("is-playing", playing);
        voicePlayBtn.setAttribute("aria-label", playing ? "Pausar respuesta" : "Escuchar al asistente");
      }
      if (voiceStopLabel) {
        voiceStopLabel.textContent = voicePaused ? "Reanudar escucha" : "Detener escucha";
      }
      if (voiceStopIcon) {
        voiceStopIcon.setAttribute("href", voicePaused ? "#i-play" : "#i-stop");
      }
    }

    function playVoice(track) {
      var src = voiceTracks[track];
      if (!src) return;
      voiceTrack = track;
      voiceAudio.pause();
      voiceAudio.src = src;
      document.dispatchEvent(new CustomEvent("aris:audio", { detail: "voice" }));
      var promise = voiceAudio.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          renderVoiceState();
        });
      }
    }

    voiceAudio.addEventListener("play", renderVoiceState);
    voiceAudio.addEventListener("pause", renderVoiceState);
    voiceAudio.addEventListener("ended", renderVoiceState);

    document.addEventListener("aris:audio", function (event) {
      if (event.detail !== "voice" && !voiceAudio.paused) {
        voiceAudio.pause();
      }
    });

    if (voicePlayBtn) {
      voicePlayBtn.addEventListener("click", function () {
        if (voiceIsPlaying()) {
          voiceAudio.pause();
          return;
        }
        playVoice(voiceTrack);
      });
    }

    if (voiceStopBtn) {
      voiceStopBtn.addEventListener("click", function () {
        if (voicePaused) {
          voicePaused = false;
          playVoice("reanudar");
          return;
        }
        voiceAudio.pause();
        voicePaused = true;
        playVoice("detener");
      });
    }

    if (voiceSendBtn) {
      voiceSendBtn.addEventListener("click", function () {
        playVoice("alerta");
        if (voiceSendLabel) voiceSendLabel.textContent = "Alerta enviada";
        if (voiceSendIcon) voiceSendIcon.setAttribute("href", "#i-check");
        voiceSendBtn.classList.add("is-sent");
        if (voiceSendTimer) clearTimeout(voiceSendTimer);
        voiceSendTimer = setTimeout(function () {
          if (voiceSendLabel) voiceSendLabel.textContent = "Enviar alerta";
          if (voiceSendIcon) voiceSendIcon.setAttribute("href", "#i-send");
          voiceSendBtn.classList.remove("is-sent");
        }, 3200);
      });
    }

    voiceScreen.querySelectorAll(".quick-action[data-voice-track]").forEach(function (item) {
      item.addEventListener("click", function () {
        var track = item.getAttribute("data-voice-track");
        voicePaused = false;
        if (voiceTranscript) {
          voiceTranscript.textContent = "“" + item.textContent.trim() + "…”";
        }
        playVoice(track);
      });
    });

    renderVoiceState();
  }
})();
