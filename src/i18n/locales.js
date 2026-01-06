// Localization
export const i18n = {
    en: {
        download: 'Download',
        downloading: 'Downloading...',
        downloaded: '✓ Downloaded',
        failed: '✗ Failed',
        downloadAllPhotos: 'Download All Photos',
        downloadPhotosTitle: 'Download Photos',
        importantWarning: '<strong>Important:</strong> Scroll down the profile page to load all photos you want to download before clicking "Start Download".',
        cancel: 'Cancel',
        startDownload: 'Start Download',
        stopDownload: 'Stop Download',
        close: 'Close',
        downloadCancelled: '⚠️ Download cancelled by user.',
        noImagesFound: '⚠️ No images found. Make sure you scrolled down to load photos, then try again.',
        foundImages: 'Found {count} images. Starting download...',
        downloadProgress: 'Downloaded {current} of {total} images ({success} successful, {failed} failed)...',
        downloadComplete: '✅ Download complete! {success} images downloaded successfully',
        downloadCompleteFailed: ', {failed} failed',
        downloadCancelledStats: '⚠️ Download cancelled. {success} images downloaded, {failed} failed.'
    },
    ru: {
        download: 'Скачать',
        downloading: 'Загрузка...',
        downloaded: '✓ Скачано',
        failed: '✗ Ошибка',
        downloadAllPhotos: 'Скачать все фото',
        downloadPhotosTitle: 'Скачать фото',
        importantWarning: '<strong>Важно:</strong> Прокрутите страницу профиля вниз, чтобы загрузить все фото, которые хотите скачать, перед нажатием "Начать скачивание".',
        cancel: 'Отмена',
        startDownload: 'Начать скачивание',
        stopDownload: 'Остановить',
        close: 'Закрыть',
        downloadCancelled: '⚠️ Загрузка отменена пользователем.',
        noImagesFound: '⚠️ Фото не найдены. Убедитесь, что вы прокрутили страницу для загрузки фото, затем попробуйте снова.',
        foundImages: 'Найдено {count} изображений. Начинаем загрузку...',
        downloadProgress: 'Загружено {current} из {total} изображений ({success} успешно, {failed} ошибок)...',
        downloadComplete: '✅ Загрузка завершена! {success} изображений скачано успешно',
        downloadCompleteFailed: ', {failed} ошибок',
        downloadCancelledStats: '⚠️ Загрузка отменена. {success} изображений скачано, {failed} ошибок.'
    }
};

export function t(key, params = {}) {
    const lang = navigator.language.startsWith('ru') ? 'ru' : 'en';
    let text = i18n[lang][key] || i18n.en[key];
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    return text;
}