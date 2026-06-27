const canonicalRouteMap = new Map([
  ['/privacy.html', '/privacy'],
  ['/privacy/app-1.html', '/privacy/stock-manager'],
  ['/privacy/app-2.html', '/privacy/daily-hadith'],
  ['/privacy/app-3.html', '/privacy/tinysteps'],
  ['/privacy/app-4.html', '/privacy/arrow-escape'],
  ['/products/stockflow-inventory', '/products/stock-manager'],
  ['/projects/stockflow-inventory', '/products/stock-manager'],
  ['/projects/stock-manager', '/products/stock-manager'],
  ['/projects/arrow-escape', '/products/arrow-escape'],
  ['/projects/daily-hadith', '/products/daily-hadith'],
  ['/projects/tinysteps', '/products/tinysteps'],
]);

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
const canonicalPath = canonicalRouteMap.get(currentPath);

if (canonicalPath && canonicalPath !== currentPath) {
  window.location.replace(`${canonicalPath}${window.location.search}${window.location.hash}`);
}
