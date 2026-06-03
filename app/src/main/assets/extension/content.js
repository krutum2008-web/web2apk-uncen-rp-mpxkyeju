// Part 1: Inject Anti-Popup CSS Armor immediately
const injectAntiPopupStyle = () => {
    if (document.getElementById('anti-popup-armor')) return;
    const style = document.createElement('style');
    style.id = 'anti-popup-armor';
    style.textContent = `
      div[data-sentry-component="DownloadAppPopup"],
      div[data-sentry-component="DownloadAppTopBar"],
      div[data-sentry-source-file="DownloadAppPopup.tsx"],
      div[data-sentry-source-file="DownloadAppTopBar.tsx"],
      .fixed.inset-0.z-\\[100\\] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
      }
    `;
    if (document.documentElement) {
        document.documentElement.appendChild(style);
    }
};

// Run Part 1 immediately when script touches the page
injectAntiPopupStyle();

// Part 2: Setup MutationObserver to watch and remove popups dynamically
const setupAntiPopupObserver = () => {
    const observer = new MutationObserver((mutations) => {
        const popup = document.querySelector('div[data-sentry-component="DownloadAppPopup"]');
        const topbar = document.querySelector('div[data-sentry-component="DownloadAppTopBar"]');
        
        if (popup) {
            popup.remove();
            if (document.body) {
                document.body.style.setProperty('overflow', 'auto', 'important');
            }
        }
        if (topbar) {
            topbar.remove();
        }
        
        injectAntiPopupStyle();
    });

    if (document.documentElement) {
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
};

// Run Part 2 based on document loading state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAntiPopupObserver);
} else {
    setupAntiPopupObserver();
}

