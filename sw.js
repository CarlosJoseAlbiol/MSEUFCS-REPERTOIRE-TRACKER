/* MSEUF Concert Singers – Service Worker for Notifications */
 
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
 
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'MSEUF Concert Singers', {
      body:    data.body    || 'Rehearsal reminder',
      icon:    data.icon    || '/logo.png',
      badge:   data.badge   || '/logo.png',
      tag:     data.tag     || 'rehearsal',
      vibrate: [200, 100, 200],
      data:    data.url ? { url: data.url } : {}
    })
  );
});
 
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(clients.openWindow(url));
});
 
