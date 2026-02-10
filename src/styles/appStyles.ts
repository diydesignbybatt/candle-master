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

  crisisBannerWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  } as CSSProperties,

  crisisBannerText: {
    background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    color: '#fff',
    fontSize: '1.15rem',
    fontWeight: 900,
    padding: '16px 32px',
    borderRadius: '0.75rem',
    boxShadow: '0 8px 32px rgba(220, 38, 38, 0.5)',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
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
    --safe-area-top: 0px;
    --safe-area-bottom: 0px;

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
    background: var(--bg-secondary);
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
  
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2%; margin-top: var(--spacing-md); }
  .stat-card { padding: 8px; background: var(--bg-tertiary); border-radius: 0.75rem; border: 1px solid var(--color-border); }
  .stat-label { font-size: clamp(0.6rem, 2vw, 0.65rem); font-weight: 700; color: var(--color-text-tertiary); display: block; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-value { font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 800; color: var(--color-text); }
  .header-meta { margin-top: var(--spacing-sm); display: flex; justify-content: space-between; align-items: center; font-size: clamp(0.7rem, 2.8vw, 0.8rem); font-weight: 700; color: var(--color-text); }
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
    margin-bottom: 8px;
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
    padding-bottom: calc(var(--controls-height) * 2 + var(--safe-area-bottom) * 0.6 + 2rem);
  }
  
  .scroll-chart-container { flex: 1; padding: 0 4%; min-height: 0; overflow: visible; position: relative; }

  .chart-footer {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--color-text-tertiary);
    letter-spacing: 0.5px;
    opacity: 0.5;
    pointer-events: none;
    z-index: 50;
    white-space: nowrap;
  }

  .chart-footer .separator {
    opacity: 0.5;
  }

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

  /* Music toggle on chart */
  .music-toggle-mini { margin-top: 4px; color: var(--color-text-secondary); opacity: 0.6; }
  .music-toggle-mini.music-on { color: #C5A059; opacity: 1; }
  [data-theme="dark"] .music-toggle-mini.music-on { color: #FFD700; }

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
    bottom: calc(var(--controls-height) + var(--safe-area-bottom) * 0.6);
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

  .action-buttons-single-row { display: flex; gap: 6px; width: 100%; align-items: center; overflow: hidden; }
  .action-buttons-single-row.has-close-all { gap: 4px; }
  .action-buttons-single-row.has-close-all .btn { font-size: 0.55rem; gap: 2px; min-width: 0; }
  .action-buttons-single-row.has-close-all .btn svg { flex-shrink: 0; }

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

  /* Midnight Theme - Neon/Cyber style */
  :root[style*="--bg-primary: #0F172A"] .btn-buy {
    background: linear-gradient(to bottom, #00E5CC, #00B8A3);
    box-shadow: 0 4px 15px rgba(0, 229, 204, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.3);
    color: #0F172A;
    text-shadow: none;
  }
  :root[style*="--bg-primary: #0F172A"] .btn-buy:active {
    background: linear-gradient(to bottom, #00B8A3, #009688);
    box-shadow: 0 2px 8px rgba(0, 229, 204, 0.3), inset 0 1px 3px rgba(0, 0, 0, 0.4);
  }
  :root[style*="--bg-primary: #0F172A"] .btn-sell {
    background: linear-gradient(to bottom, #FF4081, #E91E63);
    box-shadow: 0 4px 15px rgba(255, 64, 129, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.3);
    color: #FFFFFF;
  }
  :root[style*="--bg-primary: #0F172A"] .btn-sell:active {
    background: linear-gradient(to bottom, #E91E63, #C2185B);
    box-shadow: 0 2px 8px rgba(255, 64, 129, 0.3), inset 0 1px 3px rgba(0, 0, 0, 0.4);
  }

  /* Solarized Theme - Classic terminal style */
  :root[style*="--bg-primary: #002b36"] .btn-buy {
    background: linear-gradient(to bottom, #2aa198, #268b84);
    box-shadow: 0 4px 12px rgba(42, 161, 152, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.25);
    color: #002b36;
    font-weight: 700;
  }
  :root[style*="--bg-primary: #002b36"] .btn-buy:active {
    background: linear-gradient(to bottom, #268b84, #1f7872);
    box-shadow: 0 2px 6px rgba(42, 161, 152, 0.3), inset 0 1px 3px rgba(0, 0, 0, 0.35);
  }
  :root[style*="--bg-primary: #002b36"] .btn-sell {
    background: linear-gradient(to bottom, #cb4b16, #b84313);
    box-shadow: 0 4px 12px rgba(203, 75, 22, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.25);
    color: #fdf6e3;
  }
  :root[style*="--bg-primary: #002b36"] .btn-sell:active {
    background: linear-gradient(to bottom, #b84313, #a13b10);
    box-shadow: 0 2px 6px rgba(203, 75, 22, 0.3), inset 0 1px 3px rgba(0, 0, 0, 0.35);
  }

  .btn-close-all { background: #000000; color: white; }
  
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: min(430px, 100vw);
    height: calc(var(--controls-height) + var(--safe-area-bottom) * 0.6);
    background: var(--bg-primary);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 2%;
    padding-bottom: calc(var(--safe-area-bottom) * 0.6);
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

  /* Nav Icon Wrapper for PRO badge */
  .nav-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pro-badge-icon {
    position: absolute;
    top: -4px;
    left: -6px;
    color: #C5A059;
    filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2));
  }

  [data-theme="dark"] .pro-badge-icon {
    color: #FFD700;
  }

  /* Tab Content Wrapper */
  .tab-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 4%;
    overflow-y: auto;
    padding-bottom: calc(var(--controls-height) + var(--safe-area-bottom) + 1rem);
  }

  .tab-content-wrapper.academy-mode {
    padding-top: calc(var(--safe-area-top) + 1rem);
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
  .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .modal-overlay.bottom-sheet { align-items: flex-end; }
  
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
  
  .title-section { margin-bottom: 30px; display: flex; flex-direction: column; align-items: center; }

  .character-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--color-border);
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    margin-bottom: 16px;
    background: var(--bg-tertiary);
  }
  .character-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .character-quote {
    font-size: 1.15rem;
    line-height: 1.4;
    font-style: italic;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
    max-width: 280px;
  }
  
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

  .event-reveal-badge {
    margin-bottom: 16px;
    padding: 12px 20px;
    background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
    border-radius: 0.75rem;
    text-align: center;
  }
  .event-reveal-text {
    font-size: 0.95rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.3px;
  }

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

  /* PRO Promotion Banner */
  .promo-banner {
    position: fixed;
    bottom: calc(var(--controls-height) * 2 + var(--safe-area-bottom) * 0.6);
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: min(430px, 100vw);
    height: 24px;
    background: linear-gradient(90deg, var(--color-green) 0%, #0a9d9c 50%, var(--color-green) 100%);
    overflow: hidden;
    z-index: 45;
    cursor: pointer;
    transition: filter 0.2s;
  }

  .promo-banner:active {
    filter: brightness(1.1);
  }

  .promo-marquee {
    display: flex;
    width: max-content;
    animation: marquee 20s linear infinite;
  }

  .promo-text {
    display: inline-block;
    padding: 0 60px;
    font-size: 0.7rem;
    font-weight: 600;
    color: #FFFFFF;
    white-space: nowrap;
    line-height: 24px;
    letter-spacing: 0.5px;
  }

  .promo-highlight {
    color: #FFD700;
    font-weight: 800;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    letter-spacing: 1px;
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  /* Pause animation on hover for readability */
  .promo-banner:hover .promo-marquee {
    animation-play-state: paused;
  }

  /* PRO Status Badge */
  .pro-status-badge {
    position: fixed;
    bottom: calc(var(--controls-height) * 2 + var(--safe-area-bottom) * 0.6);
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: min(430px, 100vw);
    height: 24px;
    background: var(--bg-tertiary);
    border-top: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    z-index: 45;
    color: var(--color-text-secondary);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .pro-status-badge svg {
    color: #C5A059 !important;
    fill: #C5A059 !important;
  }

  /* Theme-specific PRO badge styling */
  [data-theme="dark"] .pro-status-badge svg {
    color: #FFD700 !important;
    fill: #FFD700 !important;
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

  /* Reset Confirmation Modal - Beautiful Card Style */
  .reset-confirm-modal {
    background: var(--bg-primary);
    width: 90%;
    max-width: 340px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    border: 1px solid var(--color-border);
  }

  .reset-modal-icon {
    font-size: 3rem;
    text-align: center;
    padding: 24px 24px 0;
  }

  .reset-modal-title {
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--color-text);
    text-align: center;
    margin: 12px 0 20px;
    padding: 0 24px;
  }

  .reset-modal-content {
    padding: 0 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .reset-info-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--bg-tertiary);
    border-radius: 12px;
    border: 1px solid var(--color-border);
    font-size: 0.9rem;
    color: var(--color-text);
    line-height: 1.4;
  }

  .reset-info-item strong {
    font-weight: 700;
    color: var(--color-text);
  }

  .reset-info-item.highlight {
    background: linear-gradient(135deg, rgba(14, 124, 123, 0.12) 0%, rgba(14, 124, 123, 0.05) 100%);
    border-color: rgba(14, 124, 123, 0.3);
  }

  .reset-info-item.warning {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.05) 100%);
    border-color: rgba(239, 68, 68, 0.3);
  }

  .reset-info-item.warning strong {
    color: var(--color-red);
  }

  .reset-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .reset-modal-actions {
    display: flex;
    gap: 12px;
    padding: 0 24px 24px;
  }

  .btn-reset-cancel {
    flex: 1;
    height: 48px;
    border-radius: 12px;
    border: 1px solid var(--color-border);
    background: var(--bg-tertiary);
    color: var(--color-text);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-reset-cancel:active {
    transform: scale(0.97);
    background: var(--color-border);
  }

  .btn-reset-confirm {
    flex: 1;
    height: 48px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, var(--color-red) 0%, #e63950 100%);
    color: white;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(214, 34, 70, 0.3);
  }

  .btn-reset-confirm:active {
    transform: scale(0.97);
  }

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

  .profile-avatar-large { width: 80px; height: 80px; background: var(--bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; overflow: hidden; }
  .profile-avatar-large .profile-photo { width: 100%; height: 100%; object-fit: cover; }

  .guest-badge {
    display: inline-block;
    padding: 4px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-secondary);
  }
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

  .pro-only-badge {
    flex: 0 !important;
    background: linear-gradient(135deg, #C5A059 0%, #E6C775 100%);
    color: white;
    font-size: 0.65rem;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(197, 160, 89, 0.3);
  }

  [data-theme="dark"] .pro-only-badge {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  }

  .toggle-switch { width: 44px; height: 24px; background: var(--color-border); border-radius: 12px; position: relative; transition: background 0.3s; flex-shrink: 0; }
  .toggle-switch.active { background: var(--color-green); }
  .toggle-switch.active.pro { background: linear-gradient(135deg, #C5A059 0%, #E6C775 50%, #C5A059 100%); }
  .toggle-knob { width: 20px; height: 20px; background: #FFF; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: left 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  .toggle-switch.active .toggle-knob { left: 22px; }

  /* PRO Toggle Button */
  .profile-action-btn.pro-toggle.is-pro {
    background: linear-gradient(135deg, rgba(197, 160, 89, 0.15) 0%, rgba(230, 199, 117, 0.1) 100%);
    border-color: #C5A059;
  }

  .profile-action-btn.pro-toggle.is-pro svg {
    color: #C5A059;
  }

  [data-theme="dark"] .profile-action-btn.pro-toggle.is-pro {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%);
    border-color: #FFD700;
  }

  [data-theme="dark"] .profile-action-btn.pro-toggle.is-pro svg {
    color: #FFD700;
  }

  /* Link Account Button */
  .profile-action-btn.link-account-btn {
    flex-wrap: wrap;
    background: linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(66, 133, 244, 0.05) 100%);
    border-color: #4285F4;
  }

  .profile-action-btn.link-account-btn svg {
    color: #4285F4;
  }

  .link-benefit {
    width: 100%;
    font-size: 0.7rem;
    color: var(--color-text-tertiary);
    font-weight: 500;
    margin-top: 2px;
    margin-left: 32px;
  }

  /* Sign Out Button */
  .profile-action-btn.sign-out-btn {
    color: var(--color-red);
  }

  .profile-action-btn.sign-out-btn svg {
    color: var(--color-red);
  }

  /* Chart Pattern Detail Modal */
  .academy-card.clickable {
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
  }

  .academy-card.clickable:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .academy-card.clickable:active {
    transform: scale(0.98);
  }

  .pattern-tap-hint {
    font-size: 0.65rem;
    color: var(--color-green);
    font-weight: 600;
    margin-top: 8px;
    opacity: 0.8;
  }

  .pattern-detail-modal {
    background: var(--bg-primary);
    width: 100%;
    max-width: 400px;
    border-radius: 16px;
    overflow: hidden;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }

  .pattern-modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0,0,0,0.5);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    z-index: 10;
    transition: background 0.2s;
  }

  .pattern-modal-close:hover {
    background: rgba(0,0,0,0.7);
  }

  .pattern-modal-image {
    width: 100%;
    aspect-ratio: 600 / 360;
    background: var(--bg-secondary);
  }

  .pattern-modal-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .pattern-modal-content {
    padding: 24px;
    overflow-y: auto;
  }

  .pattern-modal-content h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-text);
    margin-bottom: 8px;
  }

  .pattern-modal-desc {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .pattern-modal-details {
    background: var(--bg-tertiary);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid var(--color-border);
  }

  .pattern-modal-details p {
    font-size: 0.9rem;
    color: var(--color-text);
    line-height: 1.6;
    margin-bottom: 12px;
  }

  .pattern-modal-details p:last-child {
    margin-bottom: 0;
  }

  /* Risk Management Section */
  .risk-section {
    padding-bottom: 20px;
  }

  .risk-category-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 0 2px;
  }

  .risk-category-grid-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 14px 6px 12px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    min-height: 100px;
  }

  .risk-category-grid-card:active {
    transform: scale(0.96);
    background: var(--bg-secondary);
  }

  .risk-grid-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #D4A017;
    margin-bottom: 4px;
  }

  .risk-grid-title {
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--color-text);
    margin: 0;
    line-height: 1.2;
  }

  .risk-grid-subtitle {
    font-size: 0.6rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.2;
  }

  .risk-grid-count {
    background: var(--bg-primary);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.6rem;
    font-weight: 700;
    color: var(--color-text-secondary);
    margin-top: 2px;
  }

  .risk-carousel-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .risk-back-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text);
    transition: all 0.15s;
  }

  .risk-back-btn:active {
    background: var(--color-border);
  }

  .risk-carousel-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .risk-carousel-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .risk-carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bg-primary);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.15s;
  }

  .risk-carousel-arrow.left { left: -8px; }
  .risk-carousel-arrow.right { right: -8px; }
  .risk-carousel-arrow:hover { background: var(--bg-tertiary); }
  .risk-carousel-arrow:disabled { opacity: 0.3; cursor: not-allowed; }

  .risk-carousel-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    gap: 0;
    width: 100%;
  }

  .risk-carousel-track::-webkit-scrollbar { display: none; }

  .risk-guide-card {
    flex: 0 0 100%;
    min-width: 100%;
    scroll-snap-align: start;
    background: var(--bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
    box-sizing: border-box;
  }

  .risk-guide-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #D4A017;
    margin-bottom: 12px;
  }

  .risk-guide-title {
    font-size: 1rem;
    font-weight: 800;
    color: var(--color-text);
    text-align: center;
    margin: 0 0 12px 0;
  }

  .risk-guide-subtitle {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    text-align: center;
    margin: 0 0 12px 0;
    font-weight: 600;
  }

  .risk-guide-content {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin: 0 0 12px 0;
  }

  .risk-guide-bullets {
    margin: 0 0 12px 0;
    padding-left: 20px;
  }

  .risk-guide-bullets li {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: 4px;
  }

  .risk-dos-donts {
    background: var(--bg-primary);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .risk-dos-donts p {
    font-size: 0.75rem;
    margin: 0;
    line-height: 1.5;
  }

  .risk-dos-donts .dont {
    color: var(--color-red);
    margin-bottom: 6px;
  }

  .risk-dos-donts .do {
    color: var(--color-green);
  }

  .risk-examples, .risk-leverage {
    background: var(--bg-primary);
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 12px;
  }

  .risk-example-row, .risk-leverage-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid var(--color-border);
  }

  .risk-example-row:last-child, .risk-leverage-row:last-child {
    border-bottom: none;
  }

  .risk-example-row .ratio, .risk-leverage-row .lev {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .risk-example-row .desc, .risk-leverage-row .impact {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
  }

  .risk-warnings {
    margin-bottom: 12px;
  }

  .risk-warnings p {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin: 0 0 4px 0;
    line-height: 1.4;
  }

  .risk-keypoint {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 8px;
    padding: 12px;
    font-size: 0.8rem;
    color: var(--color-text);
    line-height: 1.4;
  }

  .risk-keypoint strong {
    color: var(--color-green);
  }

  .risk-carousel-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
  }

  .risk-carousel-dots .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-border);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s;
  }

  .risk-carousel-dots .dot.active {
    background: var(--color-text);
    transform: scale(1.25);
  }

  .risk-swipe-hint {
    text-align: center;
    font-size: 0.7rem;
    color: var(--color-text-tertiary);
    margin: 8px 0 0 0;
  }

  /* Scale In/Out specific styles */
  .risk-scale-explanation {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 12px;
  }

  .risk-scale-explanation .scale-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    border-radius: 8px;
  }

  .risk-scale-explanation .scale-item.scale-in {
    background: rgba(14, 124, 123, 0.1);
    border: 1px solid rgba(14, 124, 123, 0.3);
  }

  .risk-scale-explanation .scale-item.scale-out {
    background: rgba(214, 34, 70, 0.1);
    border: 1px solid rgba(214, 34, 70, 0.3);
  }

  .risk-scale-explanation .scale-label {
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--color-text);
  }

  .risk-scale-explanation .scale-desc {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
  }

  .risk-scale-explanation .scale-visual {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-text);
    font-family: monospace;
    margin-top: 4px;
  }

  .risk-benefits {
    background: var(--bg-primary);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .risk-benefits .benefits-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 8px 0;
  }

  .risk-benefits .benefit-item {
    font-size: 0.7rem;
    color: var(--color-green);
    margin: 0 0 4px 0;
    line-height: 1.4;
  }

  .risk-scale-example {
    background: var(--bg-primary);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .risk-scale-example .example-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 10px 0;
    text-align: center;
  }

  .risk-scale-example .example-steps {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 10px;
  }

  .risk-scale-example .step-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    background: var(--bg-tertiary);
    border-radius: 6px;
  }

  .risk-scale-example .step-action {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .risk-scale-example .step-percent {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
  }

  .risk-scale-example .step-price {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .risk-scale-example .example-result {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--color-green);
    text-align: center;
    margin: 0;
  }

  .risk-pullback-info {
    background: var(--bg-primary);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .risk-pullback-info .pullback-intro {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 8px 0;
  }

  .risk-pullback-info .pullback-reason {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    margin: 0 0 4px 0;
    padding-left: 4px;
  }

  .risk-quality-checklist {
    background: rgba(14, 124, 123, 0.1);
    border: 1px solid rgba(14, 124, 123, 0.3);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .risk-quality-checklist .checklist-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 8px 0;
  }

  .risk-quality-checklist .checklist-item {
    font-size: 0.7rem;
    margin: 0 0 4px 0;
    line-height: 1.4;
  }

  .risk-quality-checklist .checklist-item.good {
    color: var(--color-green);
  }

  .risk-red-flags {
    background: rgba(214, 34, 70, 0.1);
    border: 1px solid rgba(214, 34, 70, 0.3);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .risk-red-flags .flags-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-red);
    margin: 0 0 8px 0;
  }

  .risk-red-flags .flag-item {
    font-size: 0.7rem;
    color: var(--color-red);
    margin: 0 0 4px 0;
    line-height: 1.4;
  }

  .risk-rules {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 12px;
  }

  .risk-rules .rules-never {
    background: rgba(214, 34, 70, 0.1);
    border: 1px solid rgba(214, 34, 70, 0.3);
    border-radius: 8px;
    padding: 12px;
  }

  .risk-rules .rules-always {
    background: rgba(14, 124, 123, 0.1);
    border: 1px solid rgba(14, 124, 123, 0.3);
    border-radius: 8px;
    padding: 12px;
  }

  .risk-rules .rules-label {
    font-size: 0.75rem;
    font-weight: 800;
    margin: 0 0 8px 0;
  }

  .risk-rules .rules-never .rules-label {
    color: var(--color-red);
  }

  .risk-rules .rules-always .rules-label {
    color: var(--color-green);
  }

  .risk-rules .rule-item {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    margin: 0 0 4px 0;
    padding-left: 8px;
    line-height: 1.4;
  }

  .risk-pro-tips {
    background: var(--bg-tertiary);
    border-radius: 10px;
    padding: 12px 14px;
    margin-top: 14px;
  }

  .pro-tips-label {
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--color-accent);
    margin: 0 0 8px 0;
    letter-spacing: 0.03em;
  }

  .pro-tip-item {
    font-size: 0.72rem;
    color: var(--color-text-secondary);
    margin: 0 0 6px 0;
    line-height: 1.4;
    padding-left: 4px;
  }

  /* PRO Upgrade Modal */
  .upgrade-modal {
    background: var(--bg-primary);
    width: 90%;
    max-width: 320px;
    border-radius: 20px;
    padding: 32px 24px;
    text-align: center;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .upgrade-modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--bg-tertiary);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: all 0.2s;
  }

  .upgrade-modal-close:hover {
    background: var(--color-border);
    color: var(--color-text);
  }

  .upgrade-modal-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, #C5A059 0%, #E6C775 50%, #C5A059 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    box-shadow: 0 8px 24px rgba(197, 160, 89, 0.4);
  }

  [data-theme="dark"] .upgrade-modal-icon {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
    box-shadow: 0 8px 24px rgba(255, 215, 0, 0.3);
  }

  .upgrade-modal-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-text);
    margin: 0 0 4px 0;
  }

  .upgrade-modal-subtitle {
    font-size: 0.75rem;
    font-weight: 700;
    color: #C5A059;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 16px 0;
  }

  [data-theme="dark"] .upgrade-modal-subtitle {
    color: #FFD700;
  }

  .upgrade-modal-desc {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .upgrade-benefits-list {
    list-style: none;
    padding: 0;
    margin: 0 0 8px 0;
    text-align: left;
    width: 100%;
  }

  .upgrade-benefits-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    font-size: 0.9rem;
    color: var(--color-text);
    border-bottom: 1px solid var(--color-border);
  }

  .upgrade-benefits-list li:last-child {
    border-bottom: none;
  }

  .benefit-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    min-width: 28px;
    color: var(--color-accent, #C5A059);
  }

  .upgrade-modal-btn {
    width: 100%;
    height: 52px;
    background: linear-gradient(135deg, #C5A059 0%, #E6C775 50%, #C5A059 100%);
    border: none;
    border-radius: 12px;
    color: #FFFFFF;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(197, 160, 89, 0.4);
  }

  .upgrade-modal-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(197, 160, 89, 0.5);
  }

  .upgrade-modal-btn:active {
    transform: translateY(0);
  }

  [data-theme="dark"] .upgrade-modal-btn {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
    color: #1a1a1a;
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }

  /* Pricing Cards */
  .pricing-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 16px;
    width: 100%;
  }

  .pricing-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 16px 10px;
    border-radius: 14px;
    border: 2px solid var(--color-border, rgba(128,128,128,0.2));
    background: var(--bg-secondary, #f5f5f5);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .pricing-card:hover {
    border-color: #C5A059;
    transform: translateY(-2px);
  }

  .pricing-card:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .pricing-card-best {
    border-color: #C5A059;
    background: linear-gradient(180deg, rgba(197,160,89,0.08) 0%, transparent 100%);
  }

  .pricing-best-badge {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #C5A059, #E6C775);
    color: #fff;
    font-size: 0.55rem;
    font-weight: 800;
    padding: 2px 10px;
    border-radius: 20px;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .pricing-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-text-secondary, #888);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pricing-price {
    font-size: 1.4rem;
    font-weight: 900;
    color: var(--color-text, #333);
  }

  .pricing-period {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--color-text-secondary, #888);
  }

  .pricing-original {
    font-size: 0.7rem;
    color: var(--color-text-secondary, #888);
    text-decoration: line-through;
  }

  .pricing-btn-text {
    margin-top: 6px;
    font-size: 0.72rem;
    font-weight: 800;
    color: #C5A059;
    padding: 6px 0;
    width: 100%;
    text-align: center;
    border-top: 1px solid var(--color-border, rgba(128,128,128,0.15));
  }

  .pro-badge-label {
    font-size: 0.6rem;
    font-weight: 800;
    color: #C5A059;
    background: rgba(197,160,89,0.15);
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.05em;
  }

  /* PRO Plan Badge (Monthly / Lifetime) */
  .profile-action-btn.pro-toggle.is-pro span {
    flex: 1;
  }
  .pro-plan-badge {
    flex: 0 0 auto !important;
    margin-left: auto;
    font-size: 0.7rem;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, #C5A059, #E6C775);
    padding: 4px 14px;
    border-radius: 20px;
    letter-spacing: 0.03em;
    box-shadow: 0 2px 8px rgba(197,160,89,0.3);
  }
  .pro-badge-icon {
    color: #FFFDE7;
    font-size: 1.1em;
    font-weight: 900;
  }

  /* PRO Upgrade CTA Button (Free users) */
  .pro-upgrade-cta {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border: 2px solid #C5A059;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(197,160,89,0.12) 0%, rgba(230,199,117,0.08) 100%);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
    font-weight: 700;
    color: #C5A059;
  }
  .pro-upgrade-cta:hover {
    background: linear-gradient(135deg, rgba(197,160,89,0.2) 0%, rgba(230,199,117,0.15) 100%);
    box-shadow: 0 4px 16px rgba(197,160,89,0.25);
    transform: translateY(-1px);
  }
  .pro-upgrade-cta:active {
    transform: scale(0.98);
  }
  .pro-upgrade-cta svg {
    color: #C5A059;
  }
  .pro-cta-arrow {
    margin-left: auto;
    font-size: 1.2rem;
    opacity: 0.7;
  }

  /* Test PRO Toggle */
  .test-pro-toggle {
    cursor: pointer;
    border: 1px dashed var(--color-border) !important;
    background: var(--bg-tertiary) !important;
    opacity: 0.7;
  }
  .test-pro-toggle svg { color: var(--color-text-secondary); }
  .test-pro-toggle.test-pro-active {
    border-color: #C5A059 !important;
    border-style: dashed !important;
  }
  .test-pro-toggle.test-pro-active svg { color: #C5A059; }
  .test-pro-label {
    margin-left: auto;
    font-size: 0.55rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: var(--color-text-tertiary);
    background: var(--color-border);
    padding: 2px 8px;
    border-radius: 4px;
  }

  [data-theme="dark"] .pro-upgrade-cta {
    border-color: #FFD700;
    color: #FFD700;
    background: linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(255,215,0,0.05) 100%);
  }
  [data-theme="dark"] .pro-upgrade-cta svg {
    color: #FFD700;
  }
  [data-theme="dark"] .pro-plan-badge {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #1a1a1a;
  }

  /* Stripe Return Message */
  .stripe-message {
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10001;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    max-width: 90%;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }

  .stripe-message.cancel {
    background: var(--bg-secondary, #f5f5f5);
    color: var(--color-text, #333);
    border: 1px solid var(--color-border, rgba(128,128,128,0.2));
  }

  /* Thank You Modal */
  .thankyou-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 10002;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .thankyou-modal {
    background: var(--bg-primary, #fff);
    border-radius: 24px;
    padding: 40px 32px;
    max-width: 360px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
  }

  .thankyou-sparkles {
    font-size: 2.5rem;
    margin-bottom: 8px;
    animation: sparkle-pulse 1.5s ease-in-out infinite;
  }

  @keyframes sparkle-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
  }

  .thankyou-mascot {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 16px auto;
    display: block;
    box-shadow: 0 4px 16px rgba(197,160,89,0.3);
    border: 3px solid #C5A059;
  }

  .thankyou-title {
    font-family: 'Geist', 'Inter', -apple-system, sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--color-text, #333);
    margin: 0 0 4px 0;
    letter-spacing: -0.03em;
  }

  .thankyou-subtitle {
    font-size: 1.1rem;
    font-weight: 700;
    color: #C5A059;
    margin: 0 0 12px 0;
  }

  .thankyou-desc {
    font-size: 0.9rem;
    color: var(--color-text-secondary, #666);
    margin: 0 0 24px 0;
    line-height: 1.5;
  }

  .thankyou-btn {
    width: 100%;
    padding: 14px 24px;
    border: none;
    border-radius: 14px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    background: linear-gradient(135deg, #C5A059, #E6C775);
    color: #fff;
    box-shadow: 0 4px 16px rgba(197,160,89,0.4);
    transition: all 0.2s;
  }

  .thankyou-btn:active {
    transform: scale(0.97);
  }
`;

// Tablet Landscape Layout Styles
export const TABLET_STYLES = `
  /* Tablet Layout - Only for landscape mode on tablets */
  .tablet-layout {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: var(--bg-primary);
    margin: 0;
    padding: 0;
  }

  /* Tablet Header - All controls in one row */
  .tablet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    padding-top: calc(env(safe-area-inset-top, 0px) + 8px);
    background: var(--bg-primary);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
  }

  .tablet-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .tablet-stat {
    background: var(--bg-secondary);
    padding: 8px 16px;
    border-radius: 8px;
    min-width: 110px;
  }

  .tablet-stat-label {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    display: block;
    margin-bottom: 2px;
  }

  .tablet-stat-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .tablet-stat.positive .tablet-stat-value { color: var(--color-green); }
  .tablet-stat.negative .tablet-stat-value { color: var(--color-red); }

  .tablet-meta {
    display: flex;
    flex-direction: row;
    gap: 12px;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    white-space: nowrap;
    font-weight: 500;
  }

  .tablet-header-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  /* Tablet Trade Amount */
  .tablet-trade-amount {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--bg-secondary);
    padding: 4px 6px;
    border-radius: 6px;
  }

  .tablet-trade-amount-label {
    font-size: 0.65rem;
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  .tablet-amount-btn {
    width: 26px;
    height: 26px;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    background: var(--bg-primary);
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .tablet-amount-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tablet-amount-input {
    width: 70px;
    height: 26px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    text-align: center;
    font-weight: 600;
    font-size: 0.85rem;
    background: var(--bg-primary);
    color: var(--color-text-primary);
  }

  /* Tablet Action Buttons */
  .tablet-actions {
    display: flex;
    gap: 4px;
  }

  .tablet-btn {
    padding: 6px 12px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.75rem;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 3px;
    transition: transform 0.1s, opacity 0.2s;
    white-space: nowrap;
  }

  .tablet-btn:active { transform: scale(0.95); }
  .tablet-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .tablet-btn-long { background: var(--color-green); color: white; }
  .tablet-btn-short { background: var(--color-red); color: white; }
  .tablet-btn-skip { background: var(--bg-secondary); color: var(--color-text-primary); border: 1px solid var(--color-border); }
  .tablet-btn-stop { background: var(--bg-secondary); color: var(--color-text-primary); border: 1px solid var(--color-border); }

  /* Tablet Positions Row */
  .tablet-positions-row {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--color-border);
    gap: 12px;
    flex-shrink: 0;
  }

  .tablet-positions-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  .tablet-positions-grid {
    display: flex;
    flex: 1;
    gap: 8px;
  }

  .tablet-position-card {
    flex: 1;
    background: var(--bg-primary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;
  }

  .tablet-position-card.long { border-left: 3px solid var(--color-green); }
  .tablet-position-card.short { border-left: 3px solid var(--color-red); }
  .tablet-position-card.empty {
    border: 1px dashed var(--color-border);
    justify-content: center;
    color: var(--color-text-secondary);
    font-size: 0.75rem;
  }

  .tablet-pos-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .tablet-pos-type {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .tablet-pos-type.long { color: var(--color-green); }
  .tablet-pos-type.short { color: var(--color-red); }

  .tablet-pos-entry {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
  }

  .tablet-pos-pl {
    font-size: 0.85rem;
    font-weight: 700;
  }

  .tablet-pos-close {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: var(--bg-secondary);
    color: var(--color-text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
  }

  .tablet-pos-close:hover { background: var(--color-red); color: white; }

  .tablet-close-all-btn {
    padding: 8px 16px;
    border-radius: 8px;
    background: #000;
    color: white;
    font-weight: 700;
    font-size: 0.8rem;
    border: none;
    cursor: pointer;
    white-space: nowrap;
  }

  /* Tablet Main Content */
  .tablet-main {
    flex: 1;
    display: flex;
    position: relative;
    overflow: hidden;
  }

  .tablet-chart-area {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .tablet-chart-container {
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  /* Tablet Floating Controls (zoom, indicators) */
  .tablet-floating-left {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 10;
  }

  .tablet-floating-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: var(--bg-primary);
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .tablet-floating-btn.active {
    background: #f59e0b;
    color: white;
    border-color: #f59e0b;
  }

  .tablet-floating-btn:disabled { opacity: 0.5; }

  /* Tablet Bottom Section */
  .tablet-bottom {
    flex-shrink: 0;
  }

  .tablet-promo-banner {
    height: 28px;
    background: linear-gradient(90deg, var(--color-green) 0%, #0a9d9c 50%, var(--color-green) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .tablet-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 24px;
    border-radius: 8px;
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }

  .tablet-nav-item.active {
    color: var(--color-accent);
  }

  .tablet-nav-item span {
    font-size: 0.75rem;
    font-weight: 600;
  }

  .tablet-nav-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tablet-pro-badge {
    position: absolute;
    top: -4px;
    right: -8px;
    color: #f59e0b;
  }

  .tablet-bottom-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 8px);
    background: var(--bg-primary);
    border-top: 1px solid var(--color-border);
    gap: 16px;
  }
`;
