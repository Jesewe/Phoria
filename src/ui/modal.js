import { t } from '../i18n/locales.js';
import { startBulkDownload } from '../services/bulkDownloader.js';

export function showDownloadModal() {
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