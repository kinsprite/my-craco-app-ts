function applyPolyfill() {
  const promise: any[] = [];

  if (!window.Set) {
    promise.push(import('core-js/es/map'), import('core-js/es/set'));
  }

  if (!window.requestAnimationFrame) {
    promise.push(import('raf').then(res => res.polyfill()));
  }

  if (!window.fetch) {
    promise.push(import('whatwg-fetch'));
  }

  return Promise.all(promise);
}

applyPolyfill().then(() => import('./indexStart'));

export {};
