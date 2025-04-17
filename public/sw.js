// This will be replaced by Workbox during build
console.log('Service Worker: Installed');

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
});