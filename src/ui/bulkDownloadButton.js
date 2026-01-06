import { t } from '../i18n/locales.js';
import { showDownloadModal } from './modal.js';

export function addBulkDownloadButton() {
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