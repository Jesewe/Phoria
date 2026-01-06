import { BUTTON_CHECK_INTERVAL, BULK_BUTTON_DELAY } from './config.js';
import { addDownloadButtons } from './ui/downloadButton.js';
import { addBulkDownloadButton } from './ui/bulkDownloadButton.js';

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