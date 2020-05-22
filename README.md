# quave:pwa

`quave:pwa` is a Meteor package that allows you to configure your PWA.

## Why

PWA is a very simple way to provide a better experience for your users. Every website should provide a manifest compatible with PWA specifications.

We believe we are not reinventing the wheel in this package but what we are doing is like putting together the wheels in the vehicle :).

## Installation

```sh
meteor add quave:pwa
```

### Usage

In your settings

```json
  "packages": {
    "quave:pwa": {
      "name": "MyApp",
      "appleItunesAppId": "1514380385",
      "googlePlayAppId": "com.mysite.app",
      "lang": "pt-BR",
      "backgroundColor": "#6200A8",
      "themeColor": "white"
    }
  }
```

In your server

```javascript
import { Meteor } from 'meteor/meteor';

import { registerPwaManifestHandler } from 'meteor/quave:pwa';

Meteor.startup(() => {
  registerPwaManifestHandler();
});
```

In your `head` tag of your HTML add a link to this manifest:
```html
<head>
  ...
  <link rel="manifest" href="/pwa.json" />
  ...
</head>
```

That is it, now you can access http://localhost:3000/pwa.json to check your PWA Manifest. Also you can open Chrome DevTools > Application tab > Manifest to check if everything is working correctly.

## Advanced

If you want to provide configurations in runtime (in case you serve multiple apps from the same backend) you can use
`createResponderPwaManifest` function. See a full example from a market place that each store can have a native app.

```javascript
import { createResponderPwaManifest, MANIFEST_PATH } from 'meteor/quave:pwa';

import { StoresCollection } from '../../app/stores/data/StoresCollection';
import { getNativeStoresInfo } from './native';
import { getBaseUrlFromHeaders } from '../mode/modeCommon';

export const pwaJson = (req, res) => {
  const baseUrl = getBaseUrlFromHeaders(req.headers);
  const store = StoresCollection.findByFullUrl(baseUrl);
  const nativeStoresInfo = getNativeStoresInfo(store);

  createResponderPwaManifest(nativeStoresInfo)(req, res);
};

Meteor.startup(() => {
    WebApp.connectHandlers.use(
      MANIFEST_PATH,
      Meteor.bindEnvironment(pwaJson)
  );
});
```

### License

MIT
