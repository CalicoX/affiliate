/** @returns {() => void} */
export function mount() {
  let teardown = null;
  try {
/**
 * Responsive FX guard — tablet / phone
 * Sets html classes + early flags heavy modules can read.
 */
(function () {
  "use strict";

  var mq1024 = window.matchMedia("(max-width: 1024px)");
  var mq768 = window.matchMedia("(max-width: 768px)");
  var mq640 = window.matchMedia("(max-width: 640px)");
  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mqCoarse = window.matchMedia("(pointer: coarse)");

  function apply() {
    var root = document.documentElement;
    var t = mq1024.matches;
    var m = mq768.matches;
    var s = mq640.matches;
    var reduce = mqReduce.matches || m;
    root.classList.toggle("is-bp-1024", t);
    root.classList.toggle("is-bp-768", m);
    root.classList.toggle("is-bp-640", s);
    root.classList.toggle("is-reduce-fx", reduce);
    root.classList.toggle("is-touch", mqCoarse.matches);
    /* Global flag for shaders / AI lab */
    window.__reduceFx = reduce;
    window.__isMobileLayout = m;
  }

  apply();
  if (mq1024.addEventListener) {
    mq1024.addEventListener("change", apply);
    mq768.addEventListener("change", apply);
    mq640.addEventListener("change", apply);
    mqReduce.addEventListener("change", apply);
    mqCoarse.addEventListener("change", apply);
  } else if (mq1024.addListener) {
    mq1024.addListener(apply);
    mq768.addListener(apply);
    mq640.addListener(apply);
    mqReduce.addListener(apply);
    mqCoarse.addListener(apply);
  }

  teardown = function () {
    if (mq1024.removeEventListener) {
      mq1024.removeEventListener("change", apply);
      mq768.removeEventListener("change", apply);
      mq640.removeEventListener("change", apply);
      mqReduce.removeEventListener("change", apply);
      mqCoarse.removeEventListener("change", apply);
    } else if (mq1024.removeListener) {
      mq1024.removeListener(apply);
      mq768.removeListener(apply);
      mq640.removeListener(apply);
      mqReduce.removeListener(apply);
      mqCoarse.removeListener(apply);
    }
  };
})();

  } catch (err) {
    console.warn("[fx:responsive-fx.js]", err);
  }
  return function dispose() {
    if (typeof teardown === "function") {
      try {
        teardown();
      } catch {
        /* ignore */
      }
      teardown = null;
    }
  };
}
