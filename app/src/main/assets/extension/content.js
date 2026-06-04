// Part 1: Phantom Cloak Settings (100% Invisible & Click-Through)
const injectPhantomStyle = () => {
    if (document.getElementById('anti-popup-armor')) return;
    const style = document.createElement('style');
    style.id = 'anti-popup-armor';
    style.textContent = `
      div[data-sentry-component="DownloadAppPopup"],
      div[data-sentry-component="DownloadAppTopBar"],
      div[data-sentry-source-file="DownloadAppPopup.tsx"],
      div[data-sentry-source-file="DownloadAppTopBar.tsx"],
      .fixed.inset-0.z-\\[100\\] {
        opacity: 0.001 !important;
        pointer-events: none !important;
        user-select: none !important;
        background: transparent !important;
      }
      body.keyboard-active {
        padding-bottom: 40vh !important;
      }
    `;
    if (document.documentElement) {
        document.documentElement.appendChild(style);
    }
};

// Run Part 1 instantly
injectPhantomStyle();

// Part 2: Soft Keep-Alive Observer (No element removal, just unlock scrolling if locked)
const setupPhantomObserver = () => {
    const observer = new MutationObserver((mutations) => {
        if (document.body && document.body.style.overflow === 'hidden') {
            document.body.style.setProperty('overflow', 'auto', 'important');
        }
        injectPhantomStyle();
    });

    if (document.documentElement) {
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPhantomObserver);
} else {
    setupPhantomObserver();
}

// Part 3: Viewport Keyboard Fix
if (window.visualViewport) {
    const originalHeight = window.visualViewport.height;
    window.visualViewport.addEventListener('resize', () => {
        const currentHeight = window.visualViewport.height;
        const chatInputContainer = document.querySelector('div.fixed.bottom-0') || document.querySelector('footer') || document.body.lastElementChild;
        
        if (originalHeight - currentHeight > 150) {
            document.body.classList.add('keyboard-active');
            if (chatInputContainer) {
                chatInputContainer.scrollIntoView({ block: 'end', behavior: 'smooth' });
            }
        } else {
            document.body.classList.remove('keyboard-active');
        }
    });
}

