/**
 * webOS Service Integration
 * Optional: Integrate with webOS platform APIs
 */

class WebOSService {
    constructor() {
        this.isWebOS = Helpers.isWebOS();
        this.initialized = false;
    }

    init() {
        if (!this.isWebOS) {
            console.log('[WebOSService] Not running on webOS');
            return;
        }

        try {
            // Initialize webOS service bridge if available
            if (typeof webOS !== 'undefined' && webOS.service) {
                this.initialized = true;
                console.log('[WebOSService] Initialized');

                // Request system settings
                this.requestSystemSettings();
            }
        } catch (error) {
            console.error('[WebOSService] Failed to initialize:', error);
        }
    }

    /**
     * Request system settings
     */
    requestSystemSettings() {
        if (!this.initialized) return;

        // Get system locale
        if (typeof webOS !== 'undefined' && webOS.service.request) {
            webOS.service.request('luna://com.webos.settingsservice', {
                method: 'getSystemSettings',
                parameters: {
                    keys: ['localeInfo', 'country']
                },
                onSuccess: (response) => {
                    console.log('[WebOSService] System settings:', response);
                },
                onFailure: (error) => {
                    console.error('[WebOSService] Failed to get settings:', error);
                }
            });
        }
    }

    /**
     * Get device info
     * @returns {Object|null}
     */
    getDeviceInfo() {
        if (!this.isWebOS) return null;

        try {
            if (typeof webOS !== 'undefined' && webOS.deviceInfo) {
                return webOS.deviceInfo();
            }
        } catch (error) {
            console.error('[WebOSService] Failed to get device info:', error);
        }
        return null;
    }

    /**
     * Set screen saver state
     * @param {boolean} enabled 
     */
    setScreenSaver(enabled) {
        if (!this.initialized) return;

        try {
            if (typeof webOS !== 'undefined' && webOS.service.request) {
                webOS.service.request('luna://com.webos.service.tvpower', {
                    method: 'power/requestScreenSaver',
                    parameters: {
                        enabled: enabled
                    }
                });
            }
        } catch (error) {
            console.error('[WebOSService] Failed to set screen saver:', error);
        }
    }

    /**
     * Register for system events
     */
    registerSystemEvents() {
        if (!this.isWebOS) return;

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('[WebOSService] App hidden');
                // Pause video, save state
            } else {
                console.log('[WebOSService] App visible');
                // Resume if needed
            }
        });
    }
}

const webOSService = new WebOSService();
