export const USERSCRIPT_METADATA = {
    name: 'Phoria',
    namespace: 'https://github.com/Jesewe/Phoria',
    version: '1.0.0',
    description: 'Download Instagram photos with ease',
    'description:ru': 'Скачивайте фото из Instagram легко',
    author: 'Jesewe',
    license: 'MIT',
    homepageURL: 'https://github.com/Jesewe/Phoria',
    supportURL: 'https://github.com/Jesewe/Phoria/issues',
    downloadURL: 'https://raw.githubusercontent.com/Jesewe/Phoria/main/dist/Phoria.user.js',
    updateURL: 'https://raw.githubusercontent.com/Jesewe/Phoria/main/dist/Phoria.user.js',
    icon: 'https://raw.githubusercontent.com/Jesewe/Phoria/main/src/img/icon.ico',
    match: 'https://www.instagram.com/*',
    grant: [
        'unsafeWindow',
        'GM_addStyle',
        'GM_deleteValue',
        'GM_listValues',
        'GM_setValue',
        'GM_getValue',
        'GM_xmlhttpRequest',
        'GM_notification',
        'GM_info',
        'window.focus'
    ],
    connect: 'instagram.com',
    'run-at': 'document-idle',
    noframes: true
};

export const DOWNLOAD_DELAY = 800; // Delay between downloads in ms
export const BUTTON_CHECK_INTERVAL = 2000; // Interval to check for new images
export const BULK_BUTTON_DELAY = 1000; // Delay before adding bulk download button