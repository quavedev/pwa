import { getSettings } from 'meteor/quave:settings';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

const PACKAGE_NAME = 'quave:pwa';
const settings = getSettings({ packageName: PACKAGE_NAME });

export const MANIFEST_PATH = settings.manifestPath || '/pwa.json';

export const getGoolePlayAppUrl = ({ googlePlayAppId } = settings || {}) => {
  if (!googlePlayAppId) {
    return null;
  }
  return `https://play.google.com/store/apps/details?id=${googlePlayAppId}`;
};

export const getAppleItunesAppUrl = ({ appleItunesAppId } = settings || {}) => {
  if (!appleItunesAppId) {
    return null;
  }
  return `https://itunes.apple.com/app/id${appleItunesAppId}`;
};

export const getPwaSettings = (data = {}) => {
  const {
    appleItunesAppId,
    googlePlayAppId,
    gcmSenderId,
    backgroundColor = 'white',
    themeColor,
    startUrl = '/',
    display = 'standalone',
    orientation = 'portrait',
    lang = 'en-US',
    name,
    shortName = name,
    description = name,
    icons = [],
    preferRelatedApplications,
  } = data;

  return {
    background_color: backgroundColor,
    theme_color: themeColor,
    start_url: startUrl,
    display,
    orientation,
    lang,
    name,
    short_name: shortName,
    description,
    icons: icons.filter(icon => !!icon.src),
    gcm_sender_id: gcmSenderId,
    prefer_related_applications:
      preferRelatedApplications == null
        ? !!(googlePlayAppId || appleItunesAppId)
        : preferRelatedApplications,
    related_applications: [
      googlePlayAppId && {
        platform: 'play',
        url: getGoolePlayAppUrl(data),
        id: googlePlayAppId,
      },
      appleItunesAppId && {
        platform: 'itunes',
        url: getAppleItunesAppUrl(data),
        id: appleItunesAppId,
      },
    ].filter(Boolean),
  };
};

export const respondPwaManifest = (req, res, customSettings = {}) => {
  const data = { ...settings, ...customSettings };
  if (!data.name) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(405);
    res.end(
      `<h1>${PACKAGE_NAME} PWA not configured, add to your settings.packages.[quave:pwa] the desired PWA keys</h1>`
    );
    return;
  }

  res.setHeader('Content-Type', 'javascript/json');
  res.writeHead(200);
  res.end(JSON.stringify(getPwaSettings(data)));
};

export const createResponderPwaManifest = customSettings => (req, res) =>
  respondPwaManifest(req, res, customSettings);

export const registerPwaManifestHandler = customSettings => {
  WebApp.connectHandlers.use(
    MANIFEST_PATH,
    Meteor.bindEnvironment((req, res) =>
      respondPwaManifest(req, res, customSettings)
    )
  );
};
