/**
 * Upcube Avatar Cloud — Embed SDK (Demo Foundation)
 *
 * This is a demo scaffold for the Upcube Avatar Cloud embeddable widget SDK.
 * It demonstrates the structure of a production embed script but does NOT:
 *   - Call any real APIs or backends
 *   - Establish WebRTC or WebSocket connections
 *   - Perform real session token exchange
 *   - Render a functional avatar widget
 *   - Expose or handle secrets
 *
 * In production, this file would be replaced with a properly built,
 * minified, and versioned SDK bundle served from a CDN.
 *
 * ⚠️ Do not use this file in production.
 */

(function () {
  "use strict";

  var CONFIG_ID = "upcube-embed-config";
  var ROOT_ID = "upcube-avatar-cloud-root";
  var SDK_VERSION = "0.0.0-demo";

  function log(message) {
    console.log("[Upcube Embed SDK v" + SDK_VERSION + "]", message);
  }

  function warn(message) {
    console.warn("[Upcube Embed SDK v" + SDK_VERSION + "]", message);
  }

  function readConfig() {
    var el = document.getElementById(CONFIG_ID);
    if (!el) {
      warn(
        "Config element #" + CONFIG_ID + " not found. Widget will not render.",
      );
      return null;
    }

    try {
      var config = JSON.parse(el.textContent || "{}");
      return config;
    } catch (e) {
      warn("Failed to parse embed config JSON: " + e.message);
      return null;
    }
  }

  function validateOrigin(config) {
    if (
      !config ||
      !config.allowedDomains ||
      config.allowedDomains.length === 0
    ) {
      warn("No allowed domains configured. Widget will not validate.");
      return false;
    }

    var hostname = window.location.hostname;
    var localhostOk =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "";

    var allowed = config.allowedDomains.some(function (domain) {
      return hostname === domain || hostname.endsWith("." + domain);
    });

    if (!allowed && !localhostOk) {
      warn(
        "Domain " +
          hostname +
          " is not in the allowed domains list. Widget will not render.",
      );
      return false;
    }

    if (localhostOk && !allowed) {
      log(
        "Localhost detected — allowed domains check relaxed for development." +
          " Allowed domains: " +
          config.allowedDomains.join(", "),
      );
    }

    return true;
  }

  function renderPlaceholder(config) {
    var root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      document.body.appendChild(root);
    }

    var positionClass = "";
    if (config && config.position === "bottom-left") {
      positionClass = "upcube-embed-bottom-left";
    } else if (config && config.position === "inline") {
      positionClass = "upcube-embed-inline";
    } else {
      positionClass = "upcube-embed-bottom-right";
    }

    root.innerHTML =
      '<div class="upcube-embed-container ' +
      positionClass +
      '" style="position:' +
      (config && config.position === "inline" ? "relative" : "fixed") +
      ";bottom:24px;" +
      (config && config.position === "bottom-left"
        ? "left:24px"
        : "right:24px") +
      ';z-index:9999;max-width:380px;width:100%;font-family:system-ui,sans-serif">' +
      '<div style="border:2px dashed rgba(124,111,240,0.4);border-radius:16px;padding:24px;background:rgba(3,7,18,0.95);color:#f9fafb;text-align:center;backdrop-filter:blur(12px)">' +
      '<div style="font-size:40px;margin-bottom:12px">👤</div>' +
      '<div style="font-size:14px;font-weight:600;margin-bottom:4px">Ethen Avatar Widget</div>' +
      '<div style="font-size:12px;color:rgba(249,250,251,0.5)">Demo SDK foundation — no backend connection active</div>' +
      '<div style="margin-top:12px;font-size:11px;color:rgba(249,250,251,0.35)">' +
      "Agent: " +
      (config ? config.agentId || "not configured" : "not configured") +
      "<br>" +
      "Mode: " +
      (config ? config.defaultMode || "text" : "text") +
      "</div>" +
      "</div></div>";

    log(
      "Widget placeholder rendered at position: " +
        (config ? config.position : "bottom-right"),
    );
  }

  function init() {
    log("Embed SDK demo foundation initializing...");

    var config = readConfig();

    if (!config) {
      log("No config found — widget will not render.");
      return;
    }

    log(
      "Config loaded: agentId=" +
        config.agentId +
        ", mode=" +
        config.defaultMode,
    );

    if (!validateOrigin(config)) {
      return;
    }

    log(
      "Domain " +
        window.location.hostname +
        " validated. Rendering widget placeholder.",
    );

    renderPlaceholder(config);

    log("Embed SDK demo foundation initialized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
