Package.describe({
  name: 'quave:pwa',
  version: '1.0.1',
  summary: 'Utility package to configure PWA',
  git: 'https://github.com/quavedev/pwa',
});

Package.onUse(function(api) {
  api.versionsFrom('1.10.2');
  api.use(['ecmascript', 'webapp']);

  api.use('quave:settings@1.0.0');

  api.mainModule('pwa.js');
});
