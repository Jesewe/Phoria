// ==UserScript==
// @name         Phoria
// @namespace    https://github.com/Jesewe/Phoria
// @version      1.0.0
// @description  Download Instagram photos with ease
// @description:ru Скачивайте фото из Instagram легко
// @author       Jesewe
// @license      MIT
// @homepageURL  https://github.com/Jesewe/Phoria
// @supportURL   https://github.com/Jesewe/Phoria/issues
// @downloadURL  https://raw.githubusercontent.com/Jesewe/Phoria/main/dist/Phoria.user.js
// @updateURL    https://raw.githubusercontent.com/Jesewe/Phoria/main/dist/Phoria.user.js
// @icon         https://raw.githubusercontent.com/Jesewe/Phoria/main/src/img/icon.ico
// @match        https://www.instagram.com/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_info
// @grant        window.focus
// @connect      instagram.com
// @run-at       document-idle
// @noframes     true
// ==/UserScript==

// config.js
const USERSCRIPT_METADATA = {
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

const DOWNLOAD_DELAY = 800; // Delay between downloads in ms
const BUTTON_CHECK_INTERVAL = 2000; // Interval to check for new images
const BULK_BUTTON_DELAY = 1000; // Delay before adding bulk download button

// i18n/locales.js
// Localization
const i18n = {
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

function t(key, params = {}) {
    const lang = navigator.language.startsWith('ru') ? 'ru' : 'en';
    let text = i18n[lang][key] || i18n.en[key];
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    return text;
}

// utils/download.js
async function downloadImage(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        return true;
    } catch (error) {
        console.error('Error downloading image:', error);
        return false;
    }
}

// utils/username.js
function getUsername() {
    // Try to get from URL first
    const pathMatch = window.location.pathname.match(/^\/([^\/]+)/);
    if (pathMatch && pathMatch[1]) {
        const path = pathMatch[1];
        // Filter out common Instagram paths that are not usernames
        if (!['p', 'reel', 'reels', 'explore', 'stories', 'direct', 'accounts', 'settings'].includes(path)) {
            return path;
        }
    }

    // Try to get from page meta tags or headers
    const metaTag = document.querySelector('meta[property="og:title"]');
    if (metaTag && metaTag.content) {
        const username = metaTag.content.split('(')[0].trim().replace('@', '');
        if (username) return username;
    }

    // Try to get from header
    const headerText = document.querySelector('header h2, header h1');
    if (headerText && headerText.textContent) {
        const username = headerText.textContent.trim();
        if (username) return username;
    }

    return 'unknown';
}

// utils/postId.js
function getPostId(element) {
    // Try to find post link in parent elements
    let postLink = element.closest('a[href*="/p/"]');
    if (!postLink) {
        // Search in siblings
        const parent = element.parentElement;
        if (parent) {
            postLink = parent.querySelector('a[href*="/p/"]');
        }
    }

    // Search in article parent
    if (!postLink) {
        const article = element.closest('article');
        if (article) {
            postLink = article.querySelector('a[href*="/p/"]');
        }
    }

    if (postLink) {
        const match = postLink.href.match(/\/p\/([^\/]+)/);
        if (match) return match[1];
    }

    // Try to get from current URL if we're on a post page
    const urlMatch = window.location.pathname.match(/\/p\/([^\/]+)/);
    if (urlMatch) return urlMatch[1];

    // Fallback to random string
    return Math.random().toString(36).substring(2, 11);
}

// services/imageCollector.js
function getAllPostImages() {
    const postData = [];

    // Find all article elements (posts)
    const articles = document.querySelectorAll('article');

    articles.forEach(article => {
        // Find images within each article
        const images = article.querySelectorAll('img[srcset]:not([width="32"]):not([height="32"])');
        images.forEach(img => {
            let src = img.src;
            const srcset = img.getAttribute('srcset');
            if (srcset) {
                const sources = srcset.split(',').map(s => s.trim().split(' '));
                const highestRes = sources[sources.length - 1][0];
                src = highestRes;
            }

            const postId = getPostId(img);

            // Avoid duplicates
            if (!postData.find(p => p.src === src)) {
                postData.push({ src, postId });
            }
        });
    });

    // Also get images from grid view
    const gridLinks = document.querySelectorAll('a[href*="/p/"]');
    gridLinks.forEach(link => {
        const img = link.querySelector('img');
        if (!img) return;

        let src = img.src;
        const srcset = img.getAttribute('srcset');
        if (srcset) {
            const sources = srcset.split(',').map(s => s.trim().split(' '));
            const highestRes = sources[sources.length - 1][0];
            src = highestRes;
        }

        // Get post ID from link
        const match = link.href.match(/\/p\/([^\/]+)/);
        const postId = match ? match[1] : Math.random().toString(36).substring(2, 11);

        // Avoid duplicates and small images
        if (!postData.find(p => p.src === src) && !src.includes('44x44') && !src.includes('150x150')) {
            postData.push({ src, postId });
        }
    });

    return postData;
}

// services/bulkDownloader.js
async function startBulkDownload(modal, cancelDownloadRef) {
    const progressContainer = modal.querySelector('#progress-container');
    const progressBar = modal.querySelector('#progress-bar');
    const progressText = modal.querySelector('#progress-text');
    const downloadBtn = modal.querySelector('#download-btn');
    const cancelBtn = modal.querySelector('#cancel-btn');

    progressContainer.style.display = 'block';
    downloadBtn.disabled = true;
    downloadBtn.style.opacity = '0.5';

    // Update cancel button functionality during download
    cancelBtn.textContent = t('stopDownload');
    cancelBtn.onclick = (e) => {
        e.stopPropagation();
        cancelDownloadRef.value = true;
        progressText.textContent = t('downloadCancelled');
        cancelBtn.textContent = t('close');
        cancelBtn.onclick = () => {
            document.body.removeChild(modal.parentElement);
        };
    };

    // Collect all images
    let postData = getAllPostImages();

    if (postData.length === 0) {
        progressText.textContent = t('noImagesFound');
        downloadBtn.textContent = t('close');
        downloadBtn.disabled = false;
        downloadBtn.style.opacity = '1';
        downloadBtn.onclick = () => {
            document.body.removeChild(modal.parentElement);
        };
        cancelBtn.style.display = 'none';
        return;
    }

    progressText.textContent = t('foundImages', { count: postData.length });

    const username = getUsername();
    let successCount = 0;
    let failCount = 0;

    // Download images with delay to avoid rate limiting
    for (let i = 0; i < postData.length; i++) {
        if (cancelDownloadRef.value) {
            progressText.textContent = t('downloadCancelledStats', { success: successCount, failed: failCount });
            break;
        }

        const post = postData[i];

        try {
            const filename = `${username}_${post.postId}.jpg`;
            const success = await downloadImage(post.src, filename);

            if (success) {
                successCount++;
            } else {
                failCount++;
            }

            // Update progress
            const progress = ((i + 1) / postData.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = t('downloadProgress', {
                current: i + 1,
                total: postData.length,
                success: successCount,
                failed: failCount
            });

            // Delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, DOWNLOAD_DELAY));
        } catch (error) {
            console.error('Error downloading image:', error);
            failCount++;
        }
    }

    if (!cancelDownloadRef.value) {
        let completeText = t('downloadComplete', { success: successCount });
        if (failCount > 0) {
            completeText += t('downloadCompleteFailed', { failed: failCount });
        }
        progressText.textContent = completeText + '.';
    }

    downloadBtn.textContent = t('close');
    downloadBtn.disabled = false;
    downloadBtn.style.opacity = '1';
    downloadBtn.onclick = () => {
        document.body.removeChild(modal.parentElement);
    };
    cancelBtn.style.display = 'none';
}

// ui/downloadButton.js
function addDownloadButtons() {
    // Select images likely to be post photos (have srcset, not small icons)
    const images = document.querySelectorAll('img[srcset]:not([width="32"]):not([height="32"])');

    images.forEach(img => {
        // Check if button already added
        if (!img.dataset.downloadAdded) {
            // Create download button
            const button = document.createElement('button');
            button.textContent = t('download');
            button.style.position = 'absolute';
            button.style.top = '10px';
            button.style.right = '10px';
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.padding = '5px 10px';
            button.style.cursor = 'pointer';
            button.style.zIndex = '1000';
            button.style.borderRadius = '5px';

            // On click, download the highest resolution image from srcset
            button.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();

                let src = img.src;
                const srcset = img.getAttribute('srcset');
                if (srcset) {
                    const sources = srcset.split(',').map(s => s.trim().split(' '));
                    const highestRes = sources[sources.length - 1][0];
                    src = highestRes;
                }

                button.textContent = t('downloading');
                button.disabled = true;

                const username = getUsername();
                const postId = getPostId(img);
                const filename = `${username}_${postId}.jpg`;

                const success = await downloadImage(src, filename);

                if (success) {
                    button.textContent = t('downloaded');
                    setTimeout(() => {
                        button.textContent = t('download');
                        button.disabled = false;
                    }, 2000);
                } else {
                    button.textContent = t('failed');
                    setTimeout(() => {
                        button.textContent = t('download');
                        button.disabled = false;
                    }, 2000);
                }
            };

            // Make parent relative for positioning
            const parent = img.parentElement;
            if (parent) {
                const computedStyle = window.getComputedStyle(parent);
                if (computedStyle.position === 'static') {
                    parent.style.position = 'relative';
                }
                parent.appendChild(button);
            }

            img.dataset.downloadAdded = 'true';
        }
    });
}

// ui/bulkDownloadButton.js
function addBulkDownloadButton() {
    // Check if we're on a profile page
    const isProfilePage = window.location.pathname.match(/^\/[^\/]+\/?$/);
    if (!isProfilePage) return;

    // Check if button already exists
    if (document.querySelector('#bulk-download-btn')) return;

    // Find header section to add button
    const header = document.querySelector('header');
    if (!header) return;

    // Create container for button
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.marginTop = '16px';
    buttonContainer.style.marginBottom = '16px';

    // Create bulk download button
    const bulkButton = document.createElement('button');
    bulkButton.id = 'bulk-download-btn';
    bulkButton.textContent = t('downloadAllPhotos');
    bulkButton.style.backgroundColor = '#0095f6';
    bulkButton.style.color = 'white';
    bulkButton.style.border = 'none';
    bulkButton.style.padding = '8px 16px';
    bulkButton.style.borderRadius = '8px';
    bulkButton.style.cursor = 'pointer';
    bulkButton.style.fontSize = '14px';
    bulkButton.style.fontWeight = '600';

    bulkButton.onclick = () => showDownloadModal();

    buttonContainer.appendChild(bulkButton);
    header.parentElement.insertBefore(buttonContainer, header.nextSibling);
}

// ui/modal.js
function showDownloadModal() {
    // Create cancel download reference object (to pass by reference)
    const cancelDownloadRef = { value: false };

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'download-modal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '10000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    // Create modal content
    const modal = document.createElement('div');
    modal.style.backgroundColor = 'white';
    modal.style.padding = '30px';
    modal.style.borderRadius = '12px';
    modal.style.maxWidth = '400px';
    modal.style.width = '90%';
    modal.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';

    modal.innerHTML = `
        <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #262626;">${t('downloadPhotosTitle')}</h2>
        <p style="margin: 0 0 20px 0; color: #737373; line-height: 1.5;">
            ⚠️ ${t('importantWarning')}
        </p>

        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="cancel-btn" style="padding: 10px 20px; border: none; background-color: #efefef; color: #262626; border-radius: 6px; cursor: pointer; font-weight: 600;">
                ${t('cancel')}
            </button>
            <button id="download-btn" style="padding: 10px 20px; border: none; background-color: #0095f6; color: white; border-radius: 6px; cursor: pointer; font-weight: 600;">
                ${t('startDownload')}
            </button>
        </div>

        <div id="progress-container" style="display: none; margin-top: 20px;">
            <p id="progress-text" style="margin: 0 0 10px 0; color: #262626; font-weight: 600;">Downloading...</p>
            <div style="width: 100%; height: 6px; background-color: #efefef; border-radius: 3px; overflow: hidden;">
                <div id="progress-bar" style="width: 0%; height: 100%; background-color: #0095f6; transition: width 0.3s;"></div>
            </div>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Handle cancel
    const cancelBtn = modal.querySelector('#cancel-btn');
    cancelBtn.onclick = (e) => {
        e.stopPropagation();
        cancelDownloadRef.value = true;
        document.body.removeChild(overlay);
    };

    // Handle download
    modal.querySelector('#download-btn').onclick = () => {
        startBulkDownload(modal, cancelDownloadRef);
    };

    // Close on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            cancelDownloadRef.value = true;
            document.body.removeChild(overlay);
        }
    };
}

// main.js
(function() {
    'use strict';

    // Run initially after page load
    window.addEventListener('load', () => {
        addDownloadButtons();
        setTimeout(addBulkDownloadButton, BULK_BUTTON_DELAY);
    });

    // Use MutationObserver to detect new images (e.g., scrolling loads more posts)
    const observer = new MutationObserver(() => {
        addDownloadButtons();
        addBulkDownloadButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also run periodically in case of dynamic changes
    setInterval(() => {
        addDownloadButtons();
        addBulkDownloadButton();
    }, BUTTON_CHECK_INTERVAL);
})();

