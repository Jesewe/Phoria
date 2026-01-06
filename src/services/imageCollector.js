import { getPostId } from '../utils/postId.js';

export function getAllPostImages() {
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