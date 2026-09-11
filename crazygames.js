(function (root) {
  "use strict";
  const local = root.localStorage;
  const keys = [
    "level-devil-unlocked", "tortuga-trials-progress", "level-devil-tracking",
    "level-devil-sound", "level-devil-auto-restart", "tortuga-shells",
    "tortuga-skins", "tortuga-equipped-skin", "tortuga-reward-cooldown"
  ];
  let sdk = null, storage = local, gameplay = false, platformMuted = false;
  const listeners = new Set();
  const api = {
    available: false,
    storage,
    get platformMuted() { return platformMuted; },
    onSettings(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    loadingDone() { call("game", "loadingStop"); },
    gameplayStart(context) {
      if (gameplay) return;
      gameplay = true;
      call("game", "gameplayStart");
      if (context) call("game", "setGameContext", context);
    },
    gameplayStop() {
      if (!gameplay) return;
      gameplay = false;
      call("game", "gameplayStop");
      call("game", "clearGameContext");
    },
    progress(value) { call("game", "reportGameCompletedPercentage", Math.max(0, Math.min(100, value))); },
    requestAd(type, hooks = {}) {
      if (!api.available || !sdk?.ad) return Promise.resolve({ finished: false, error: "unavailable" });
      return new Promise(resolve => {
        let settled = false;
        const done = result => { if (settled) return; settled = true; hooks.ended?.(); resolve(result); };
        try {
          sdk.ad.requestAd(type, {
            adStarted: () => { platformMuted = true; hooks.started?.(); },
            adFinished: () => { platformMuted = !!sdk.game?.settings?.muteAudio; done({ finished: true }); },
            adError: error => { platformMuted = !!sdk.game?.settings?.muteAudio; done({ finished: false, error }); }
          });
        } catch (error) { done({ finished: false, error }); }
      });
    }
  };
  function call(module, method, ...args) {
    if (!api.available) return;
    try { sdk?.[module]?.[method]?.(...args); } catch (error) { console.warn(`CrazyGames ${method}`, error); }
  }
  function notify(settings = {}) {
    platformMuted = !!settings.muteAudio;
    listeners.forEach(listener => listener(settings));
  }
  api.ready = (async () => {
    const host = root.location?.hostname || "";
    const localMode = host === "localhost" || host === "127.0.0.1" || new URLSearchParams(root.location?.search || "").has("useLocalSdk");
    const crazyMode = /(^|\.)crazygames\.com$/i.test(host);
    if (!localMode && !crazyMode) return;
    if (!root.CrazyGames?.SDK) return;
    try {
      sdk = root.CrazyGames.SDK;
      await sdk.init();
      if (sdk.environment === "disabled") return;
      api.available = true;
      call("game", "loadingStart");
      storage = sdk.data || local;
      for (const key of keys) {
        if (storage.getItem(key) == null && local.getItem(key) != null) storage.setItem(key, local.getItem(key));
      }
      api.storage = storage;
      notify(sdk.game?.settings);
      sdk.game?.addSettingsChangeListener?.(notify);
    } catch (error) {
      console.warn("CrazyGames SDK unavailable", error);
      sdk = null;
      api.available = false;
      api.storage = local;
    }
  })();
  root.TortugaCrazy = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
