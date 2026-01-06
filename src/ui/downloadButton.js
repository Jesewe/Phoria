import { t } from '../i18n/locales.js';
import { downloadImage } from '../utils/download.js';
import { getUsername } from '../utils/username.js';
import { getPostId } from '../utils/postId.js';

export function addDownloadButtons() {
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