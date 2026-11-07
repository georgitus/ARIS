/* ============================================================
   ARIS · PWA — lógica de la aplicación
   Router de vistas, sesión local, personalización, instalación
   y registro del service worker. Las interacciones de guía RCP,
   asistente de voz y filtros viven en app.js.
   ============================================================ */
(function () {
  "use strict";

  var VIEWS = ["bienvenida", "registro", "inicio", "sismo", "voz", "rcp", "alertas", "perfil"];
  var VIEWS_WITH_TABBAR = ["inicio", "alertas", "perfil"];
  var TAB_FOR_VIEW = { inicio: "#/inicio", alertas: "#/alertas", perfil: "#/perfil" };

  var app = document.getElementById("app");
  if (!app) return;

  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (error) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) { /* almacenamiento no disponible */ }
    },
    del: function (key) {
      try {
        localStorage.removeItem(key);
      } catch (error) { /* almacenamiento no disponible */ }
    }
  };

  var KEY_PROFILE = "aris:profile";
  var KEY_LAST_VIEW = "aris:last-view";
  var KEY_ALERTS_READ = "aris:alerts-read";

  /* ------------------------------------------------------------
     Helpers
     ------------------------------------------------------------ */
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function initials(name) {
    var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "AR";
    var first = parts[0].charAt(0);
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + last).toUpperCase();
  }

  function firstName(name) {
    var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    return parts.length ? parts[0] : "";
  }

  var toastTimer = null;
  function toast(message) {
    var toastEl = $("#toast");
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2600);
  }

  /* ------------------------------------------------------------
     Sesión
     ------------------------------------------------------------ */
  function getProfile() {
    return store.get(KEY_PROFILE, null);
  }

  function saveProfile(profile) {
    store.set(KEY_PROFILE, profile);
  }

  function hasProfile() {
    var profile = getProfile();
    return !!(profile && profile.name && profile.email);
  }

  /* ------------------------------------------------------------
     Router
     ------------------------------------------------------------ */
  var currentView = null;

  function viewFromHash() {
    var raw = location.hash.replace(/^#\/?/, "");
    return VIEWS.indexOf(raw) > -1 ? raw : null;
  }

  function setChrome(view) {
    // Tabbar compartida
    var tabbar = $("[data-tabbar]", app);
    if (tabbar) {
      var show = VIEWS_WITH_TABBAR.indexOf(view) > -1;
      tabbar.hidden = !show;
      if (show) {
        $$(".tab", tabbar).forEach(function (tab) {
          var isActive = tab.getAttribute("data-go") === TAB_FOR_VIEW[view];
          tab.classList.toggle("is-active", isActive);
          if (isActive) tab.setAttribute("aria-current", "page");
          else tab.removeAttribute("aria-current");
        });
      }
    }
  }

  function activate(view, options) {
    options = options || {};
    if (VIEWS.indexOf(view) === -1) view = "bienvenida";
    if (view === currentView && !options.force) return;

    currentView = view;

    $$(".screen", app).forEach(function (screen) {
      var isCurrent = screen.getAttribute("data-view") === view;
      screen.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        var scroller = $(".screen__scroll, .auth__scroll", screen);
        if (scroller) scroller.scrollTop = 0;
      }
    });

    setChrome(view);
    store.set(KEY_LAST_VIEW, view);

    var titles = {
      bienvenida: "ARIS — Tu aliado en emergencias",
      registro: "Crear cuenta · ARIS",
      inicio: "Inicio · ARIS",
      sismo: "Emergencia natural · ARIS",
      voz: "Asistencia por voz · ARIS",
      rcp: "Guía de RCP · ARIS",
      alertas: "Alertas · ARIS",
      perfil: "Mi perfil · ARIS"
    };
    document.title = titles[view] || "ARIS";
  }

  function navigate(view) {
    var target = "#/" + view;
    if (location.hash === target) activate(view, { force: true });
    else location.hash = target;
  }

  window.addEventListener("hashchange", function () {
    var view = viewFromHash();
    activate(view || defaultView());
  });

  function defaultView() {
    if (hasProfile()) {
      var last = store.get(KEY_LAST_VIEW, null);
      if (last && VIEWS.indexOf(last) > -1 && VIEWS_WITH_TABBAR.indexOf(last) > -1) {
        return last;
      }
      return "inicio";
    }
    return "bienvenida";
  }

  /* Arranque */
  var initial = viewFromHash() || defaultView();
  activate(initial, { force: true });

  /* ------------------------------------------------------------
     Splash / flujo de cuenta
     ------------------------------------------------------------ */
  var startBtn = $("[data-start]");
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      navigate(hasProfile() ? "inicio" : "registro");
    });
  }

  var haveAccountBtn = $("[data-have-account]");
  if (haveAccountBtn) {
    haveAccountBtn.addEventListener("click", function () {
      navigate(hasProfile() ? "inicio" : "registro");
    });
  }

  /* Registro */
  var registerForm = $("[data-register-form]");
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = $("#reg-name");
      var age = $("#reg-age");
      var email = $("#reg-email");
      var terms = $("input[type='checkbox']");

      if (!name.value.trim()) {
        toast("Ingresá tu nombre para continuar");
        name.focus();
        return;
      }
      if (!email.value.trim() || email.value.indexOf("@") < 0) {
        toast("Necesitamos un correo válido");
        email.focus();
        return;
      }
      if (terms && !terms.checked) {
        toast("Aceptá los términos para continuar");
        return;
      }

      saveProfile({
        name: name.value.trim(),
        age: (age && age.value.trim()) || "",
        email: email.value.trim(),
        createdAt: new Date().toISOString()
      });

      applyProfileToUI();
      navigate("inicio");
      toast("Cuenta creada. ¡Bienvenido/a!");
    });
  }

  document.addEventListener("submit", function (event) {
    if (event.target && event.target.hasAttribute("data-register-form")) {
      event.preventDefault();
    }
  });

  /* Salir de sesión */
  var logoutBtn = $("[data-logout]");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      store.del(KEY_PROFILE);
      navigate("bienvenida");
      toast("Sesión cerrada");
    });
  }

  /* ------------------------------------------------------------
     Personalización con los datos del perfil
     ------------------------------------------------------------ */
  function applyProfileToUI() {
    var profile = getProfile() || {};

    var name = profile.name || "Martina Gómez";

    $$("[data-user-name]").forEach(function (el) {
      el.textContent = name;
    });
    $$("[data-user-firstname]").forEach(function (el) {
      el.textContent = firstName(name);
    });
    $$("[data-user-email]").forEach(function (el) {
      el.textContent = profile.email || "martina.gomez@correo.com";
    });
    $$("[data-user-initials]").forEach(function (el) {
      el.textContent = initials(name);
    });
    $$("[data-user-meta]").forEach(function (el) {
      var age = profile.age ? " · " + profile.age + " años" : "";
      el.textContent = "Zona Norte" + age;
    });

    var homeGreeting = $("[data-home-greeting]");
    if (homeGreeting) {
      homeGreeting.textContent = "Hola, ¿cómo estás, " + firstName(name) + "?";
    }

    /* Fecha de hoy en español */
    $$("[data-today]").forEach(function (el) {
      try {
        var fmt = new Intl.DateTimeFormat("es-ES", {
          weekday: "long", day: "numeric", month: "long"
        });
        var text = fmt.format(new Date());
        text = text.charAt(0).toUpperCase() + text.slice(1);
        el.textContent = text;
      } catch (error) {
        el.textContent = new Date().toLocaleDateString();
      }
    });
  }
  applyProfileToUI();

  /* ------------------------------------------------------------
     Volver atrás
     ------------------------------------------------------------ */
  document.addEventListener("click", function (event) {
    var back = event.target.closest("[data-back]");
    if (!back) return;
    event.preventDefault();
    if (history.length > 1) history.back();
    else navigate(back.getAttribute("data-back") || "inicio");
  });

  /* ------------------------------------------------------------
     Botón SOS del centro del tabbar (el hash se encarga de navegar)
     ------------------------------------------------------------ */

  /* Acciones con aviso: [data-toast="mensaje"] */
  document.addEventListener("click", function (event) {
    var launcher = event.target.closest("[data-toast]");
    if (!launcher) return;
    event.preventDefault();
    toast(launcher.getAttribute("data-toast") || "Listo");
  });

  /* ------------------------------------------------------------
     Alertas: marcar leídas
     ------------------------------------------------------------ */
  function renderUnread() {
    var read = store.get(KEY_ALERTS_READ, false);
    var badges = $$("[data-unread-badge]");
    var cards = $$(".alert-card");

    if (read) {
      badges.forEach(function (el) {
        el.hidden = true;
      });
      cards.forEach(function (card) {
        card.classList.remove("is-unread");
        var dot = $(".alert-card__unread", card);
        if (dot) dot.hidden = true;
      });
    }
  }

  var markReadBtn = $("[data-mark-read]");
  if (markReadBtn) {
    markReadBtn.addEventListener("click", function () {
      store.set(KEY_ALERTS_READ, true);
      renderUnread();
      toast("Alertas marcadas como leídas");
    });
  }
  renderUnread();

  $$(".alert-card").forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.remove("is-unread");
      var dot = $(".alert-card__unread", card);
      if (dot) dot.hidden = true;

      var stillUnread = $$(".alert-card.is-unread").length;
      if (!stillUnread) {
        store.set(KEY_ALERTS_READ, true);
        $$("[data-unread-badge]").forEach(function (el) {
          el.hidden = true;
        });
      }
    });
  });

  /* ------------------------------------------------------------
     Notificaciones: pedir permiso real al activar el switch
     ------------------------------------------------------------ */
  var notifySwitch = $("[data-notify-switch] input");
  if (notifySwitch && "Notification" in window) {
    notifySwitch.addEventListener("change", function () {
      if (notifySwitch.checked) {
        Notification.requestPermission().then(function (permission) {
          if (permission !== "granted") {
            notifySwitch.checked = false;
            toast("Permiso de notificaciones denegado");
          } else {
            toast("Notificaciones activadas");
          }
        });
      }
    });
  }

  /* ------------------------------------------------------------
     Instalación de la PWA
     ------------------------------------------------------------ */
  var deferredPrompt = null;
  var installBanner = $("#install-banner");
  var installButtons = $$("[data-install]");

  function showBanner() {
    if (installBanner) installBanner.hidden = false;
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    var profile = getProfile();
    if (profile && profile.installBannerShown) return;
    showBanner();
  });

  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    if (installBanner) installBanner.hidden = true;
    toast("ARIS se instaló en tu dispositivo");
  });

  if (installBanner) {
    var accept = $(".install-banner__install", installBanner);
    var close = $(".install-banner__close", installBanner);

    if (accept) {
      accept.addEventListener("click", function () {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(function (choice) {
            if (choice && choice.outcome === "dismissed") {
              rememberDismiss();
            }
            deferredPrompt = null;
            installBanner.hidden = true;
          });
        } else {
          toast("Usá el menú del navegador → «Instalar app»");
          installBanner.hidden = true;
        }
      });
    }

    if (close) {
      close.addEventListener("click", function () {
        installBanner.hidden = true;
        rememberDismiss();
      });
    }
  }

  function rememberDismiss() {
    var profile = getProfile() || {};
    profile.installBannerShown = true;
    saveProfile(profile);
  }

  /* Asociación con el manifest (algunos navegadores la piden). */
  if ("setAppBadge" in navigator) {
    document.addEventListener("visibilitychange", function () {
      var unread = $$(".alert-card.is-unread").length;
      if (document.visibilityState === "visible" && unread) {
        navigator.setAppBadge(Math.min(unread, 99)).catch(function () {});
      } else if (document.visibilityState === "visible") {
        navigator.clearAppBadge().catch(function () {});
      }
    });
  }

  /* ------------------------------------------------------------
     Registro del service worker
     ------------------------------------------------------------ */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").then(function (registration) {
        registration.addEventListener("updatefound", function () {
          var installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", function () {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              toast("Nueva versión disponible — actualizá la app");
            }
          });
        });
      }).catch(function () {
        /* offline seguirá funcionando con la caché del navegador. */
      });
    });
  }
})();
