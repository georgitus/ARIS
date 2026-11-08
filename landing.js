/* ============================================================
   ARIS · Landing Hero — Interacciones & Instalación PWA
   ============================================================ */

(function () {
  "use strict";

  var deferredPrompt = null;
  var btnInstall = document.getElementById("btn-install");
  var modal = document.getElementById("install-modal");
  var modalBackdrop = document.getElementById("modal-backdrop");
  var modalClose = document.getElementById("modal-close");

  // Escuchar el evento nativo de instalación PWA
  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    if (btnInstall) {
      btnInstall.classList.add("btn--highlight");
    }
  });

  function showModal() {
    if (!modal) return;
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }

  function hideModal() {
    if (!modal) return;
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  if (btnInstall) {
    btnInstall.addEventListener("click", function () {
      if (deferredPrompt) {
        // Disparar prompt nativo si está disponible (Android Chrome / Edge / etc.)
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (choice) {
          if (choice.outcome === "accepted") {
            hideModal();
          }
          deferredPrompt = null;
        });
      } else {
        // Mostrar modal con instrucciones para iOS / Safari / Chrome desktop
        showModal();
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", hideModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", hideModal);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal && !modal.hasAttribute("hidden")) {
      hideModal();
    }
  });

  // Notificar si ya está instalada
  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    hideModal();
  });
})();
