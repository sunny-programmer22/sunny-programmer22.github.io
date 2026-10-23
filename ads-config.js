/**
 * ==============================================================================
 * TechPulse - HilltopAds Monetization Configuration & Integration Script
 * ==============================================================================
 * 
 * This file centralizes and manages all 6 HilltopAds monetization ad zones:
 *  - Zone 1: Popunder / OnClick Tag
 *  - Zone 2: In-Page Push (IPP) MultiTag
 *  - Zone 3: MultiTag Banners (728x90 Leaderboard & 300x250 Sidebar)
 *  - Zone 4: Video Slider MultiTag
 *  - Zone 5: Direct Link / SmartLink (Attached to high-intent CTA buttons)
 *  - Zone 6: Video VAST Ad Tag (Pre-roll / Mid-roll for HTML5 Video Player)
 * 
 * INSTRUCTIONS FOR USER:
 * 1. Log into your HilltopAds Publisher account (https://hilltopads.com).
 * 2. Add your website domain and generate ad codes for each desired format.
 * 3. Replace the placeholder values (zone IDs, script URLs, direct links) below.
 * 4. Toggle `isDemoMode: false` when you are ready to serve live production ads.
 * ==============================================================================
 */

const HILLTOP_ADS_CONFIG = {
  // Global switch: When true, shows informative placeholders & simulated previews.
  // Set to false in production once you fill in your real HilltopAds Zone IDs!
  isDemoMode: true,

  // ----------------------------------------------------------------------------
  // ZONE 1: Popunder / OnClick
  // Full-page monetized popunder triggered on the user's first click anywhere on the page
  // ----------------------------------------------------------------------------
  zone1_popunder: {
    enabled: true,
    zoneId: "YOUR_POPUNDER_ZONE_ID", // e.g. "123456"
    scriptUrl: "https://example-hilltopads-cdn.com/popunder.js", // Replace with HilltopAds script URL
    triggerOncePerSession: true,
    delaySeconds: 0
  },

  // ----------------------------------------------------------------------------
  // ZONE 2: In-Page Push (IPP) MultiTag
  // High-CTR native notifications appearing inside the page viewport
  // ----------------------------------------------------------------------------
  zone2_inPagePush: {
    enabled: true,
    zoneId: "YOUR_IPP_ZONE_ID", // e.g. "234567"
    scriptUrl: "https://example-hilltopads-cdn.com/ipp-multitag.js",
    position: "bottom-right", // "bottom-right" or "bottom-left"
    demoTitle: "⚡ Breaking AI Alert",
    demoMessage: "New open-source LLM beats proprietary models in coding benchmarks. Read analysis.",
    demoIcon: "⚡",
    demoTime: "Just now"
  },

  // ----------------------------------------------------------------------------
  // ZONE 3: MultiTag Banners
  // Intelligent auto-optimizing banner ad tags that maximize CPM
  // ----------------------------------------------------------------------------
  zone3_banners: {
    header_728x90: {
      enabled: true,
      zoneId: "YOUR_HEADER_BANNER_ZONE_ID", // e.g. "345678"
      containerId: "ad-zone-header-728x90",
      scriptUrl: "https://example-hilltopads-cdn.com/banner-728x90.js",
      dimensions: { width: 728, height: 90 }
    },
    sidebar_300x250: {
      enabled: true,
      zoneId: "YOUR_SIDEBAR_BANNER_ZONE_ID", // e.g. "345679"
      containerId: "ad-zone-sidebar-300x250",
      scriptUrl: "https://example-hilltopads-cdn.com/banner-300x250.js",
      dimensions: { width: 300, height: 250 }
    }
  },

  // ----------------------------------------------------------------------------
  // ZONE 4: Video Slider MultiTag
  // Floating slider video unit docked in the bottom corner of the viewport
  // ----------------------------------------------------------------------------
  zone4_videoSlider: {
    enabled: true,
    zoneId: "YOUR_VIDEO_SLIDER_ZONE_ID", // e.g. "456789"
    containerId: "ad-zone-video-slider",
    scriptUrl: "https://example-hilltopads-cdn.com/video-slider.js",
    position: "bottom-right",
    autoSlideDelayMs: 2500 // Slides in 2.5s after page load
  },

  // ----------------------------------------------------------------------------
  // ZONE 5: Direct Link / SmartLink
  // Monetized redirect link attached to contextual CTA buttons (Specs, Deals, etc.)
  // ----------------------------------------------------------------------------
  zone5_directLink: {
    enabled: true,
    smartLinkUrl: "https://hilltopads.com/smartlink?zone=YOUR_SMARTLINK_ZONE_ID", // Replace with your SmartLink URL
    // CSS selectors for buttons that route through this Direct Link:
    selectors: [
      ".smartlink-cta",
      "[data-ad-action='direct-link']",
      ".btn-download-specs",
      ".btn-claim-discount",
      ".btn-benchmark-dl"
    ],
    openInNewTab: true
  },

  // ----------------------------------------------------------------------------
  // ZONE 6: Video VAST (Linear Video Ad)
  // Standard VAST 2.0 / 3.0 / 4.0 tag for pre-roll ads in HTML5 Video Players
  // ----------------------------------------------------------------------------
  zone6_videoVAST: {
    enabled: true,
    vastTagUrl: "https://example-hilltopads-vast.com/vast.xml?zone=YOUR_VAST_ZONE_ID", // Replace with HilltopAds VAST Tag URL
    videoPlayerId: "techpulse-main-player",
    adOverlayId: "vast-ad-overlay",
    skipTimeSeconds: 5,
    adDurationSeconds: 15
  }
};

/**
 * Main Controller: Initialized when DOM is ready
 */
class HilltopAdsManager {
  constructor(config) {
    this.config = config;
    this.popunderFired = false;
  }

  init() {
    console.log("[HilltopAds] Initializing Ad Manager with config:", this.config);

    this.initZone1Popunder();
    this.initZone2InPagePush();
    this.initZone3Banners();
    this.initZone4VideoSlider();
    this.initZone5DirectLinks();
    this.initZone6VideoVAST();
    this.setupConfigModalTrigger();
  }

  /**
   * ============================================================================
   * ZONE 1: Popunder / OnClick Implementation
   * ============================================================================
   */
  initZone1Popunder() {
    const cfg = this.config.zone1_popunder;
    if (!cfg || !cfg.enabled) return;

    if (!this.config.isDemoMode && cfg.zoneId !== "YOUR_POPUNDER_ZONE_ID") {
      // PRODUCTION MODE: Dynamically inject HilltopAds Popunder Tag
      console.log("[HilltopAds] Injecting production Popunder tag:", cfg.zoneId);
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `${cfg.scriptUrl}?zone=${encodeURIComponent(cfg.zoneId)}`;
      script.async = true;
      document.head.appendChild(script);
    } else {
      // DEMO / SIMULATION MODE: Bind click listener to demonstrate where it triggers
      console.log("[HilltopAds] Popunder running in Demo Mode.");
      const triggerPopunderDemo = (e) => {
        // Do not trigger if clicking an interactive control or modal
        if (e.target.closest("button, a, input, select, textarea, .config-modal, .interactive-btn")) {
          return;
        }
        if (cfg.triggerOncePerSession && sessionStorage.getItem("techpulse_popunder_shown")) {
          return;
        }

        sessionStorage.setItem("techpulse_popunder_shown", "true");
        this.showToastNotification(
          "Zone 1: Popunder Triggered",
          "In production, HilltopAds Popunder (Zone ID: " + cfg.zoneId + ") opens a high-CPM advertiser window behind your browser on the first user interaction.",
          "info"
        );
        document.removeEventListener("click", triggerPopunderDemo);
      };

      document.addEventListener("click", triggerPopunderDemo);
    }
  }

  /**
   * ============================================================================
   * ZONE 2: In-Page Push (IPP) MultiTag Implementation
   * ============================================================================
   */
  initZone2InPagePush() {
    const cfg = this.config.zone2_inPagePush;
    if (!cfg || !cfg.enabled) return;

    if (!this.config.isDemoMode && cfg.zoneId !== "YOUR_IPP_ZONE_ID") {
      // PRODUCTION MODE: In-Page Push MultiTag script injection
      console.log("[HilltopAds] Injecting production In-Page Push MultiTag:", cfg.zoneId);
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `${cfg.scriptUrl}?zone=${encodeURIComponent(cfg.zoneId)}`;
      script.async = true;
      document.body.appendChild(script);
    } else {
      // DEMO MODE: Render a simulated sleek In-Page Push Notification Card
      setTimeout(() => {
        const ippContainer = document.getElementById("ad-zone-inpage-push");
        if (!ippContainer) return;

        ippContainer.innerHTML = `
          <div class="ipp-card" id="ipp-demo-card">
            <div class="ipp-header">
              <span class="ipp-badge"><span class="pulse-dot"></span> In-Page Push MultiTag (Zone 2)</span>
              <button class="ipp-close" id="ipp-close-btn" aria-label="Close notification">&times;</button>
            </div>
            <div class="ipp-body">
              <div class="ipp-icon">${cfg.demoIcon}</div>
              <div class="ipp-content">
                <h4 class="ipp-title">${cfg.demoTitle}</h4>
                <p class="ipp-desc">${cfg.demoMessage}</p>
                <div class="ipp-meta">
                  <span class="ipp-time">${cfg.demoTime}</span>
                  <a href="${this.config.zone5_directLink.smartLinkUrl}" target="_blank" rel="noopener" class="ipp-cta">Read Story &rarr;</a>
                </div>
              </div>
            </div>
            <div class="ipp-footer-info">
              <span>HilltopAds MultiTag Placeholder &bull; Zone ID: <code>${cfg.zoneId}</code></span>
            </div>
          </div>
        `;

        ippContainer.classList.add("ipp-visible");

        const closeBtn = document.getElementById("ipp-close-btn");
        if (closeBtn) {
          closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            ippContainer.classList.remove("ipp-visible");
            setTimeout(() => ippContainer.remove(), 400);
          });
        }
      }, 3000);
    }
  }

  /**
   * ============================================================================
   * ZONE 3: MultiTag Banners (728x90 Header & 300x250 Sidebar)
   * ============================================================================
   */
  initZone3Banners() {
    const banners = this.config.zone3_banners;
    if (!banners) return;

    // Header 728x90 Leaderboard Banner
    if (banners.header_728x90 && banners.header_728x90.enabled) {
      const cfg = banners.header_728x90;
      const container = document.getElementById(cfg.containerId);
      if (container) {
        if (!this.config.isDemoMode && cfg.zoneId !== "YOUR_HEADER_BANNER_ZONE_ID") {
          // Inject production banner
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = `${cfg.scriptUrl}?zone=${encodeURIComponent(cfg.zoneId)}`;
          script.async = true;
          container.innerHTML = "";
          container.appendChild(script);
        } else {
          // Format visual placeholder
          this.renderBannerPlaceholder(container, "Zone 3: MultiTag Leaderboard Banner", "728x90", cfg.zoneId, "Header Leaderboard Placement (High Viewability)");
        }
      }
    }

    // Sidebar 300x250 Medium Rectangle Banner
    if (banners.sidebar_300x250 && banners.sidebar_300x250.enabled) {
      const cfg = banners.sidebar_300x250;
      const container = document.getElementById(cfg.containerId);
      if (container) {
        if (!this.config.isDemoMode && cfg.zoneId !== "YOUR_SIDEBAR_BANNER_ZONE_ID") {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = `${cfg.scriptUrl}?zone=${encodeURIComponent(cfg.zoneId)}`;
          script.async = true;
          container.innerHTML = "";
          container.appendChild(script);
        } else {
          this.renderBannerPlaceholder(container, "Zone 3: MultiTag Banner", "300x250", cfg.zoneId, "Sidebar Sticky Placement (High Engagement)");
        }
      }
    }
  }

  renderBannerPlaceholder(container, title, size, zoneId, note) {
    container.innerHTML = `
      <div class="ad-placeholder-box size-${size.replace("x", "-")}">
        <div class="ad-tag-label">
          <span class="ad-chip">SPONSORED</span>
          <span class="ad-zone-name">${title} [${size}]</span>
          <span class="ad-zone-id">Zone ID: <code>${zoneId}</code></span>
        </div>
        <div class="ad-placeholder-inner">
          <div class="ad-icon-graphic">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div class="ad-text-content">
            <strong>HilltopAds MultiTag Dynamic Banner</strong>
            <p>${note}</p>
            <small class="ad-replace-hint">Ready for live code: Set your Zone ID in <code>ads-config.js</code></small>
          </div>
          <button class="ad-quick-config-btn" onclick="openAdsConfigModal()">Configure ID</button>
        </div>
      </div>
    `;
  }

  /**
   * ============================================================================
   * ZONE 4: Video Slider MultiTag
   * ============================================================================
   */
  initZone4VideoSlider() {
    const cfg = this.config.zone4_videoSlider;
    if (!cfg || !cfg.enabled) return;

    const sliderContainer = document.getElementById(cfg.containerId);
    if (!sliderContainer) return;

    if (!this.config.isDemoMode && cfg.zoneId !== "YOUR_VIDEO_SLIDER_ZONE_ID") {
      // In production, inject HilltopAds Video Slider script
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `${cfg.scriptUrl}?zone=${encodeURIComponent(cfg.zoneId)}`;
      script.async = true;
      sliderContainer.appendChild(script);
    } else {
      // DEMO MODE: Slide in interactive video slider preview after delay
      setTimeout(() => {
        sliderContainer.innerHTML = `
          <div class="video-slider-box" id="video-slider-box">
            <div class="slider-header">
              <div class="slider-meta">
                <span class="ad-chip">VIDEO AD</span>
                <span class="slider-title">Zone 4: Video Slider MultiTag</span>
              </div>
              <div class="slider-controls">
                <button class="slider-btn-minimize" id="slider-min-btn" title="Minimize">&minus;</button>
                <button class="slider-btn-close" id="slider-close-btn" title="Close">&times;</button>
              </div>
            </div>
            <div class="slider-video-wrapper">
              <div class="slider-media-screen">
                <div class="slider-radar-animation">
                  <div class="radar-circle"></div>
                  <div class="radar-pulse"></div>
                  <span class="radar-icon">▶</span>
                </div>
                <div class="slider-video-overlay">
                  <span class="slider-tag">Featured Tech Showcase</span>
                  <h5 class="slider-headline">Next-Gen GPU Architecture Breakthrough</h5>
                  <p class="slider-sub">Auto-optimizing video outstream format</p>
                </div>
              </div>
            </div>
            <div class="slider-footer">
              <span class="slider-zone-tag">HilltopAds Zone: <code>${cfg.zoneId}</code></span>
              <a href="${this.config.zone5_directLink.smartLinkUrl}" target="_blank" rel="noopener" class="slider-cta-btn">Learn More &rarr;</a>
            </div>
          </div>
        `;
        sliderContainer.classList.add("slider-active");

        const closeBtn = document.getElementById("slider-close-btn");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            sliderContainer.classList.remove("slider-active");
          });
        }

        const minBtn = document.getElementById("slider-min-btn");
        if (minBtn) {
          let isMin = false;
          minBtn.addEventListener("click", () => {
            isMin = !isMin;
            sliderContainer.classList.toggle("slider-minimized", isMin);
            minBtn.innerHTML = isMin ? "&#43;" : "&minus;";
          });
        }
      }, cfg.autoSlideDelayMs || 2500);
    }
  }

  /**
   * ============================================================================
   * ZONE 5: Direct Link / SmartLink (CTAs)
   * ============================================================================
   */
  initZone5DirectLinks() {
    const cfg = this.config.zone5_directLink;
    if (!cfg || !cfg.enabled) return;

    const selectors = cfg.selectors.join(", ");
    const ctaButtons = document.querySelectorAll(selectors);

    ctaButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        if (this.config.isDemoMode && cfg.smartLinkUrl.includes("YOUR_SMARTLINK_ZONE_ID")) {
          this.showToastNotification(
            "Zone 5: SmartLink / Direct Link Clicked",
            `This CTA button is wired to HilltopAds SmartLink. When you replace YOUR_SMARTLINK_ZONE_ID with your actual Hilltop Direct Link, visitors will seamlessly route to the highest paying offer for their country & device.`,
            "success"
          );
        } else {
          // Open real smart link
          if (cfg.openInNewTab) {
            window.open(cfg.smartLinkUrl, "_blank", "noopener,noreferrer");
          } else {
            window.location.href = cfg.smartLinkUrl;
          }
        }
      });
    });
  }

  /**
   * ============================================================================
   * ZONE 6: Video VAST (Linear Video Ad for HTML5 Video Player)
   * ============================================================================
   */
  initZone6VideoVAST() {
    const cfg = this.config.zone6_videoVAST;
    if (!cfg || !cfg.enabled) return;

    const player = document.getElementById(cfg.videoPlayerId);
    const overlay = document.getElementById(cfg.adOverlayId);
    const playTrigger = document.getElementById("vast-play-btn");

    if (!player || !overlay) return;

    let vastAdPlayed = false;

    const startVastAd = () => {
      if (vastAdPlayed) {
        player.play();
        return;
      }

      overlay.classList.add("vast-active");
      let timeLeft = cfg.skipTimeSeconds;
      let totalAdTime = cfg.adDurationSeconds;

      const countdownEl = overlay.querySelector(".vast-countdown");
      const skipBtn = overlay.querySelector(".vast-skip-btn");
      const progressBar = overlay.querySelector(".vast-progress-fill");

      if (countdownEl) countdownEl.textContent = `Ad: 0:${totalAdTime < 10 ? '0' + totalAdTime : totalAdTime}`;
      if (skipBtn) {
        skipBtn.disabled = true;
        skipBtn.textContent = `Skip in ${timeLeft}s`;
      }

      const interval = setInterval(() => {
        timeLeft--;
        totalAdTime--;

        if (countdownEl) {
          countdownEl.textContent = `Ad: 0:${totalAdTime < 10 ? '0' + totalAdTime : totalAdTime}`;
        }

        if (progressBar) {
          const percent = ((cfg.adDurationSeconds - totalAdTime) / cfg.adDurationSeconds) * 100;
          progressBar.style.width = `${percent}%`;
        }

        if (timeLeft <= 0 && skipBtn) {
          skipBtn.disabled = false;
          skipBtn.innerHTML = `Skip Ad &#10148;`;
          skipBtn.classList.add("can-skip");
        }

        if (totalAdTime <= 0) {
          endVastAd();
        }
      }, 1000);

      const endVastAd = () => {
        clearInterval(interval);
        overlay.classList.remove("vast-active");
        vastAdPlayed = true;
        player.play().catch(() => {});
        this.showToastNotification(
          "VAST Ad Finished",
          "Main video content is now streaming. In production, HilltopAds VAST Tag serves linear pre-roll and mid-roll video creatives.",
          "info"
        );
      };

      if (skipBtn) {
        skipBtn.onclick = (e) => {
          e.stopPropagation();
          if (timeLeft <= 0) {
            endVastAd();
          }
        };
      }
    };

    if (playTrigger) {
      playTrigger.addEventListener("click", () => {
        startVastAd();
      });
    }

    player.addEventListener("play", (e) => {
      if (!vastAdPlayed) {
        e.preventDefault();
        player.pause();
        startVastAd();
      }
    });
  }

  /**
   * Quick Config Modal & Toast Helpers
   */
  setupConfigModalTrigger() {
    window.openAdsConfigModal = () => {
      const modal = document.getElementById("ads-config-modal");
      if (modal) modal.classList.add("modal-open");
    };

    window.closeAdsConfigModal = () => {
      const modal = document.getElementById("ads-config-modal");
      if (modal) modal.classList.remove("modal-open");
    };
  }

  showToastNotification(title, message, type = "info") {
    let container = document.getElementById("ad-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "ad-toast-container";
      container.className = "ad-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `ad-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-header">
        <span class="toast-indicator"></span>
        <strong>${title}</strong>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
      </div>
      <p class="toast-body">${message}</p>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 6000);
  }
}

// Auto-initialize when page is ready
document.addEventListener("DOMContentLoaded", () => {
  window.techPulseAds = new HilltopAdsManager(HILLTOP_ADS_CONFIG);
  window.techPulseAds.init();
});
