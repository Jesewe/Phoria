import { t } from '../i18n/locales.js';
import { downloadImage } from '../utils/download.js';
import { getUsername } from '../utils/username.js';
import { getAllPostImages } from './imageCollector.js';
import { DOWNLOAD_DELAY } from '../config.js';

export async function startBulkDownload(modal, cancelDownloadRef) {
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