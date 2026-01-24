import type { CSSProperties } from 'react';

// Color Constants
export const Colors = {
  Green: "#22c55e",
  Red: "#ef4444",
  Black: "#000000",
  Gray: "#9CA3AF",
  White: "#FFFFFF"
};

// Static Style Objects (Used for inline styles)
export const appStyles = {
  errorFallback: {
    padding: '40px',
    textAlign: 'center'
  } as CSSProperties,

  loadingScreen: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-primary)',
    textAlign: 'center'
  } as CSSProperties,

  infoModalOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 1100
  } as CSSProperties,

  resetConfirmOverlay: {
    zIndex: 1200
  } as CSSProperties,

  equityChart: {
    overflow: 'visible'
  } as CSSProperties,

  // Theme Button Static Styles
  themeButtonSandstone: {
    background: 'linear-gradient(135deg, #F2EBE3 0%, #E5DDD3 100%)',
    color: '#C5A059',
    borderColor: '#C5A059',
  } as CSSProperties,

  themeButtonMidnight: {
    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    color: '#22D3EE',
  } as CSSProperties,

  themeButtonSolarized: {
    background: 'linear-gradient(135deg, #002b36 0%, #073642 100%)',
    color: '#b58900',
    borderColor: '#b58900',
  } as CSSProperties
};

// Global CSS as Template Literals
export const GLOBAL_STYLES = `
  :root {
    --bg-primary: #FFFFFF;
    --bg-secondary: #FAFAFA;
    --bg-tertiary: #F5F5F5;
    --color-text: #000000;
    --color-text-secondary: #666666;
    --color-text-tertiary: #999999;
    --color-border: #E5E5E5;
    --color-green: #0E7C7B;
    --color-red: #D62246;
    --safe-area-top: env(safe-area-inset-top, 0);
    --safe-area-bottom: env(safe-area-inset-bottom, 0);

    /* Responsive spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    /* Dynamic sizes */
    --header-height: clamp(8rem, 20vh, 12rem);
    --controls-height: 4rem;
  }


  * {
    box-sizing: border-box;
  }

  .mobile-shell {
    width: 100vw;
    height: 100vh;
    background: #F5F5F5;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
  }

  .app-container {
    width: 100%;
    max-width: min(430px, 100vw);
    height: 100vh;
    max-height: 100vh;
    background: var(--bg-secondary);
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 40px rgba(0,0,0,0.08);
    overflow: hidden;
  }
`;

export const LOADING_STYLES = `
  .loading-screen {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    text-align: center;
  }
  .spinner {
    color: var(--color-text);
    animation: spin 1s linear infinite;
    margin-bottom: 24px;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  h2 { font-weight: 700; margin-bottom: 8px; color: var(--color-text); }
  p { color: var(--color-text-secondary); font-size: 0.875rem; }
`;

export const UI_STYLES = `
  .header {
    padding: calc(var(--safe-area-top) + var(--spacing-md)) 5% var(--spacing-md);
    background: var(--bg-primary);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
    z-index: 10;
    min-height: fit-content;
  }

  .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .header-left-section { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
  .app-title { font-size: clamp(1.1rem, 4vw, 1.4rem); font-weight: 700; letter-spacing: -0.02em; color: var(--color-text); font-family: 'Cormorant Garamond', serif; margin: 0; line-height: 1.2; }
  .app-subtitle { font-size: clamp(0.65rem, 2.5vw, 0.75rem); color: var(--color-text-secondary); font-weight: 600; margin: 0; }
  .btn-profile { background: var(--bg-tertiary); border: none; padding: 0.3125rem; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .btn-profile:active { background: var(--color-border); }
  .header-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
  .btn-icon { background: transparent; border: none; padding: 0.5rem; margin: -0.5rem -0.25rem 0 0; cursor: pointer; border-radius: 50%; flex-shrink: 0; }
  .btn-icon:active { background: var(--bg-tertiary); }
  
  .stats-grid { display: grid; grid-template-columns: 1.2fr 1fr 0.8fr; gap: 2%; margin-top: var(--spacing-md); }
  .stat-card { padding: 8px; background: var(--bg-tertiary); border-radius: 0.75rem; border: 1px solid var(--color-border); }
  .stat-label { font-size: clamp(0.6rem, 2vw, 0.65rem); font-weight: 700; color: var(--color-text-tertiary); display: block; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-value { font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 800; color: var(--color-text); }
  .header-meta { margin-top: var(--spacing-sm); display: flex; justify-content: space-between; align-items: center; font-size: clamp(0.65rem, 2.5vw, 0.75rem); font-weight: 600; color: var(--color-text-secondary); }
  .header.compact { padding: calc(var(--safe-area-top) + var(--spacing-sm)) 4% var(--spacing-sm); }
  .header.compact .stats-grid { margin-top: 0; }
  
  .main-content { flex: 1; display: flex; flex-direction: column; padding: 0; min-height: 0; overflow: hidden; }
  .main-content.fullscreen-mode { padding-top: var(--safe-area-top); }

  /* Broke Card */
  .broke-card {
    margin: 16px;
    padding: 32px 24px;
    background: var(--bg-primary);
    border: 2px dashed var(--color-border);
    border-radius: 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .broke-emoji {
    font-size: 4rem;
    line-height: 1;
    margin-bottom: 8px;
    animation: bounce 1s ease infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .broke-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-red);
    margin: 0;
  }

  .broke-balance {
    font-size: 1rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .broke-balance span {
    font-weight: 800;
    color: var(--color-text);
  }

  .broke-message {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 8px 0 16px 0;
  }

  .broke-btn {
    height: 52px !important;
    margin-top: 8px !important;
    font-size: 0.95rem !important;
  }

  /* Trade Amount Section */
  .trade-amount-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .trade-amount-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .trade-amount-controls { display: flex; align-items: center; gap: 8px; }
  
  .amount-btn, .amount-btn-max {
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: var(--bg-tertiary);
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .amount-btn { width: 36px; }
  .amount-btn-max { padding: 0 12px; font-size: 0.7rem; font-weight: 700; }
  .amount-btn:active, .amount-btn-max:active { background: var(--color-border); transform: scale(0.95); }
  .amount-btn:disabled, .amount-btn-max:disabled { opacity: 0.3; cursor: not-allowed; }

  .amount-input-wrapper {
    display: flex;
    align-items: center;
    background: var(--bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0 10px;
    height: 36px;
  }

  .currency-symbol { font-size: 0.85rem; font-weight: 700; color: var(--color-text-secondary); margin-right: 4px; }
  .amount-input { width: 80px; border: none; background: transparent; font-size: 0.9rem; font-weight: 700; color: var(--color-text); text-align: right; font-family: inherit; }
  .amount-input:focus { outline: none; }
  .amount-input::-webkit-outer-spin-button, .amount-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .amount-input[type=number] { -moz-appearance: textfield; }

  .chart-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    overflow: hidden;
    position: relative;
    min-height: 0;
    padding-bottom: calc(var(--controls-height) * 2 + var(--safe-area-bottom) + 2rem);
  }
  
  .scroll-chart-container { flex: 1; padding: 0 4%; min-height: 0; overflow: hidden; position: relative; }
  
  /* Zoom Controls - Floating */
  .zoom-controls-floating {
    position: absolute;
    top: 8px;
    left: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 100;
  }

  .zoom-btn-mini {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    color: var(--color-text);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  [data-theme="dark"] .zoom-btn-mini {
    background: rgba(60, 60, 60, 0.95);
    border: 1px solid rgba(100, 100, 100, 0.5);
    color: #FFFFFF;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }

  .zoom-btn-mini:active { background: var(--bg-tertiary); transform: scale(0.95); }
  [data-theme="dark"] .zoom-btn-mini:active { background: rgba(80, 80, 80, 0.95); }
  .zoom-btn-mini:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Info Button - Floating */
  .info-btn-floating {
    position: absolute;
    bottom: 8px;
    left: 8px;
    z-index: 100;
  }

  .positions-container { display: flex; flex-direction: column; margin: 0 4%; flex-shrink: 0; background: var(--bg-primary); border: 1px solid var(--color-border); border-radius: 0.75rem; overflow: hidden; }
  .positions-header { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; cursor: pointer; background: var(--bg-tertiary); }
  .positions-header:active { background: var(--color-border); }
  .positions-summary { display: flex; align-items: center; gap: 0.75rem; }
  .positions-count { font-size: 0.75rem; font-weight: 700; color: var(--color-text); }
  .positions-total-pl-group { display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem; }
  .positions-total-pl { font-size: 0.8rem; font-weight: 800; }
  .positions-total-pl-percent { font-size: 0.65rem; font-weight: 600; }
  .positions-toggle { background: none; border: none; padding: 4px; cursor: pointer; color: var(--color-text-secondary); display: flex; align-items: center; justify-content: center; }
  
  .positions-list { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.5rem; }
  .position-bar { background: var(--bg-primary); padding: 0.5rem 0.75rem; border-radius: 0.75rem; display: flex; justify-content: space-between; align-items: center; border: 2px solid var(--color-border); flex-shrink: 0; }
  .position-bar.long { border-color: var(--color-green); }
  .position-bar.short { border-color: var(--color-red); }
  .pos-info { display: flex; align-items: center; gap: 0.5rem; }
  .pos-details { display: flex; flex-direction: column; gap: 0.1rem; }
  .pos-entry { font-size: clamp(0.7rem, 2vw, 0.75rem); font-weight: 600; color: var(--color-text); }
  .pos-amount { font-size: clamp(0.6rem, 1.8vw, 0.65rem); color: var(--color-text-secondary); }
  
  .pos-badge { padding: 0.2rem 0.4rem; border-radius: 0.4rem; font-size: clamp(0.55rem, 1.8vw, 0.6rem); font-weight: 800; color: #FFF; }
  .long .pos-badge { background: var(--color-green); }
  .short .pos-badge { background: var(--color-red); }
  
  .pos-right { display: flex; align-items: center; gap: 0.5rem; }
  .pos-pl-container { display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem; }
  .pos-pl-percent { font-size: clamp(0.6rem, 1.8vw, 0.65rem); font-weight: 600; }
  .pos-close-btn { background: var(--bg-secondary); border: 1px solid var(--color-border); border-radius: 0.4rem; padding: 0.3rem; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary); transition: all 0.2s; }
  .pos-close-btn:hover { background: var(--color-red); color: #FFF; border-color: var(--color-red); }
  .pos-close-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .controls {
    position: fixed;
    bottom: calc(var(--controls-height) + var(--safe-area-bottom));
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: min(430px, 100vw);
    padding: 10px 16px;
    background: var(--bg-primary);
    border-top: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 50;
    height: var(--controls-height);
  }

  .action-buttons-single-row { display: flex; gap: 8px; width: 100%; align-items: center; }

  .btn {
    flex: 1;
    height: 44px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.65rem;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transition: all 0.15s ease;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    position: relative;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.12);
  }

  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent);
    border-radius: 10px 10px 0 0;
    pointer-events: none;
  }

  .btn:active { transform: translateY(2px); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.12); }
  .btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none !important; }

  .btn-buy {
    background: linear-gradient(to bottom, #26d366, #1fa94d);
    color: white;
    box-shadow: 0 4px 10px rgba(34, 197, 94, 0.35), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 -2px 0 rgba(0, 0, 0, 0.2);
  }
  .btn-buy:active { background: linear-gradient(to bottom, #1fa94d, #1a9043); box-shadow: 0 2px 5px rgba(34, 197, 94, 0.25), 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.25); }

  .btn-sell {
    background: linear-gradient(to bottom, #f04444, #d93939);
    color: white;
    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.35), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 -2px 0 rgba(0, 0, 0, 0.2);
  }
  .btn-sell:active { background: linear-gradient(to bottom, #d93939, #c93030); box-shadow: 0 2px 5px rgba(239, 68, 68, 0.25), 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.25); }

  .btn-skip, .btn-stop {
    background: linear-gradient(to bottom, #fafafa, #e5e5e5);
    color: var(--color-text-secondary);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08), inset 0 -2px 0 rgba(0, 0, 0, 0.08);
  }

  [data-theme="dark"] .btn-skip, [data-theme="dark"] .btn-stop { background: linear-gradient(to bottom, #3a3a3a, #2a2a2a); color: var(--color-text); }
  .btn-skip:active, .btn-stop:active { background: linear-gradient(to bottom, #e5e5e5, #d4d4d4); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08), inset 0 1px 3px rgba(0, 0, 0, 0.15); }
  [data-theme="dark"] .btn-skip:active, [data-theme="dark"] .btn-stop:active { background: linear-gradient(to bottom, #2a2a2a, #1a1a1a); }

  /* Theme Specific Button Overrides */
  :root[style*="--bg-primary: #F2EBE3"] .btn-buy { background: linear-gradient(to bottom, #2D7A5A, #246B4D); box-shadow: 0 4px 10px rgba(45, 122, 90, 0.35); }
  :root[style*="--bg-primary: #F2EBE3"] .btn-sell { background: linear-gradient(to bottom, #C85A54, #B24A45); box-shadow: 0 4px 10px rgba(200, 90, 84, 0.35); }

  .btn-close-all { background: #000000; color: white; }
  
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: min(430px, 100vw);
    height: calc(var(--controls-height) + var(--safe-area-bottom));
    background: var(--bg-primary);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    padding: 8px 2% 0;
    padding-bottom: var(--safe-area-bottom);
    z-index: 1000;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    background: transparent;
    border: none;
    padding: 6px 2px;
    cursor: pointer;
    color: var(--color-text-tertiary);
    transition: all 0.15s;
  }
  .nav-item.active { color: var(--color-text); }
  .nav-item span { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }

  /* Tab Content Wrapper */
  .tab-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 4%;
    overflow-y: auto;
    padding-bottom: calc(var(--controls-height) + var(--safe-area-bottom) + 1rem);
  }

  .tab-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .tab-header h2 { font-size: 1.5rem; font-weight: 800; color: var(--color-text); margin: 0.5rem 0 0.25rem 0; }
  .tab-subtitle { font-size: 0.85rem; color: var(--color-text-secondary); margin: 0; }

  .profile-header-inline { text-align: center; padding: 20px 0; margin-bottom: 1rem; }
  .profile-header-inline h2 { font-size: 1.5rem; font-weight: 800; color: var(--color-text); margin: 0.75rem 0 0.25rem 0; }
  .member-since { font-size: 0.85rem; color: var(--color-text-secondary); font-weight: 500; margin: 0; }

  /* Modal Overlay */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(8px); display: flex; align-items: flex-end; justify-content: center; z-index: 1000; }
  
  .game-over-modal {
    background: var(--bg-primary);
    width: 100%;
    max-width: 100%;
    border-radius: 24px 24px 0 0;
    padding: 32px 24px calc(var(--safe-area-bottom) + 24px);
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    text-align: center;
  }
  
  .title-section { margin-bottom: 30px; }
  .summary-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.6; margin-bottom: 8px; font-weight: 600; }
  .trading-title { font-size: 2.2rem; line-height: 1.1; font-family: 'Cormorant Garamond', serif; font-weight: 700; color: var(--color-text); margin: 0; }
  
  .stats-row { display: flex; justify-content: center; align-items: center; gap: 16px; margin-bottom: 30px; padding: 16px; background: var(--bg-tertiary); border-radius: 0.75rem; border: 1px solid var(--color-border); }
  .mini-stat { display: flex; flex-direction: column; align-items: center; }
  .mini-stat .label { font-size: 0.6rem; font-weight: 700; color: var(--color-text-tertiary); letter-spacing: 0.5px; margin-bottom: 2px; text-transform: uppercase; }
  .mini-stat .value { font-size: 1.1rem; font-weight: 800; }
  .pos { color: var(--color-green); }
  .neg { color: var(--color-red); }
  .mini-divider { width: 1px; height: 24px; background: var(--color-border); }

  .reveal-section-compact { margin-bottom: 24px; padding: 16px; background: rgba(0,0,0,0.02); border-radius: 0.75rem; }
  .stock-reveal { font-size: 1.4rem; font-weight: 900; margin: 0 0 4px 0; color: var(--color-text); }
  .stock-name-reveal { font-size: 0.85rem; color: var(--color-text-secondary); margin: 0 0 8px 0; }
  .date-reveal { font-size: 0.75rem; color: var(--color-text-tertiary); margin: 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

  .btn-primary { background: var(--color-text); color: var(--bg-primary); height: 72px; font-size: 1.1rem; font-weight: 700; border-radius: 0.75rem; margin-top: 10px; width: 100%; border: none; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: all 0.15s; }
  .btn-primary:active { background: var(--color-text-secondary); }

  .theme-selector { background: var(--bg-tertiary); border: 1px solid var(--color-border); border-radius: 0.75rem; padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
  .theme-selector-header { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; font-weight: 600; color: var(--color-text); }
  .theme-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 10px 4px;
    background: var(--bg-primary);
    border: 2px solid var(--color-border);
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--color-text-secondary);
  }
  .theme-option span { font-size: 0.55rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .profile-action-btn:active { 
    background: var(--color-border); 
    transform: scale(0.98); 
  }
  
  .theme-option:hover {
    border-color: var(--color-text-tertiary);
  }

  .theme-option.active { 
    border-color: var(--color-green); 
    color: var(--color-green); 
    background: rgba(14, 124, 123, 0.1); 
    box-shadow: 0 4px 12px rgba(14, 124, 123, 0.15);
  }
  
  .theme-option:active {
    transform: scale(0.95);
  }

  /* Smooth theme transitions */
  .mobile-shell, .app-container, .header, .main-content, .bottom-nav, .controls, .modal-overlay, .game-over-modal, .info-modal, .stat-card, .position-bar, .positions-container, .btn, .nav-item {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }
`;

export const MODAL_STYLES = `
  .info-modal { background: var(--bg-primary); width: 100%; max-width: 360px; border-radius: 0.75rem; border: 1px solid var(--color-border); max-height: calc(100vh - 80px); display: flex; flex-direction: column; overflow: hidden; }
  .info-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 24px 16px; border-bottom: 1px solid var(--color-border); position: sticky; top: 0; background: var(--bg-primary); z-index: 10; }
  .info-header h2 { font-size: 1.5rem; font-weight: 800; color: var(--color-text); }
  .info-content { display: flex; flex-direction: column; gap: 20px; padding: 24px; overflow-y: auto; flex: 1; }
  .info-item h3 { font-size: 1rem; font-weight: 700; color: var(--color-text); margin-bottom: 6px; }
  .info-item p, .info-item ul { font-size: 0.9rem; color: var(--color-text-secondary); margin: 0; line-height: 1.5; }
  .info-item ul { padding-left: 20px; margin-top: 4px; }
  .info-item.intro { background: linear-gradient(135deg, rgba(14, 124, 123, 0.1) 0%, rgba(14, 124, 123, 0.05) 100%); padding: 16px; border-radius: 0.75rem; border: 1px solid rgba(14, 124, 123, 0.3); }
  .info-item.intro h3 { color: var(--color-green); }

  .academy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .academy-card { background: var(--bg-tertiary); border-radius: 0.75rem; padding: 16px; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid var(--color-border); }
  
  .academy-svg-wrapper {
    width: 120px;
    height: 75px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .academy-svg {
    width: 100%;
    height: 100%;
  }

  .academy-img-wrapper {
    width: 100%;
    aspect-ratio: 600 / 360;
    margin-bottom: 12px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--bg-secondary);
  }

  .academy-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .academy-info h3 { font-size: 0.9rem; font-weight: 700; color: var(--color-text); margin-bottom: 4px; }
  .academy-info p { font-size: 0.7rem; color: var(--color-text-secondary); line-height: 1.3; }

  .academy-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    padding: 4px;
    background: var(--bg-tertiary);
    border-radius: 12px;
    border: 1px solid var(--color-border);
  }

  .academy-tab {
    flex: 1;
    padding: 10px 16px;
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .academy-tab.active {
    background: var(--bg-primary);
    color: var(--color-text);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .academy-tab:not(.active):hover {
    color: var(--color-text);
    background: var(--bg-secondary);
  }

  .history-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--bg-tertiary); border-radius: 0.75rem; border: 1px solid var(--color-border); }
  .history-title { font-size: 1rem; font-weight: 700; color: var(--color-text); display: block; margin-bottom: 4px; font-family: 'Cormorant Garamond', serif; }
  .history-date { font-size: 0.75rem; color: var(--color-text-secondary); }
  .history-return { font-size: 1.1rem; font-weight: 800; }
  .history-return.pos { color: var(--color-green); }
  .history-return.neg { color: var(--color-red); }

  .history-list-inline {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
    padding-bottom: 32px;
  }

  .equity-chart-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
    margin: 0 auto 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  .equity-stats {
    display: flex;
    justify-content: center;
    gap: 32px;
    width: 100%;
    margin-bottom: 8px;
  }

  .equity-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .equity-label {
    font-size: 0.7rem;
    color: var(--color-text-tertiary);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .equity-value {
    font-size: 1.25rem;
    font-weight: 800;
  }

  .equity-value.pos { color: var(--color-green); }
  .equity-value.neg { color: var(--color-red); }

  .profile-avatar-large { width: 80px; height: 80px; background: var(--bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
  .profile-balance-card { background: var(--bg-tertiary); border: 1px solid var(--color-border); border-radius: 0.75rem; padding: 24px; margin-bottom: 24px; display: flex; flex-direction: column; align-items: center; }
  .balance-label { font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .balance-amount { font-size: 2rem; font-weight: 900; color: var(--color-text); margin-bottom: 4px; }
  
  .profile-actions { 
    display: flex; 
    flex-direction: column; 
    gap: 12px; 
    width: 100%;
  }
  
  .profile-action-btn { 
    width: 100%;
    background: var(--bg-tertiary); 
    border: 1px solid var(--color-border); 
    border-radius: 0.75rem; 
    padding: 16px 20px; 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    cursor: pointer; 
    transition: all 0.15s; 
    font-size: 0.95rem; 
    font-weight: 600; 
    color: var(--color-text);
    text-align: left;
  }
  
  .profile-action-btn span {
    flex: 1;
  }
  
  .toggle-switch { width: 44px; height: 24px; background: var(--color-border); border-radius: 12px; position: relative; transition: background 0.3s; flex-shrink: 0; }
  .toggle-switch.active { background: var(--color-green); }
  .toggle-knob { width: 20px; height: 20px; background: #FFF; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: left 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  .toggle-switch.active .toggle-knob { left: 22px; }
`;
