export function getUsername() {
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