export function getPostId(element) {
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