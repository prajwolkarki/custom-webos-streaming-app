/**
 * HTTP Request Handler
 * Wrapper around fetch with error handling and timeout
 */

class RequestHandler {
    constructor() {
        this.defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        this.timeout = 10000; // 10 seconds
    }

    async get(url, options = {}) {
        return this.request('GET', url, null, options);
    }

    async post(url, data, options = {}) {
        return this.request('POST', url, data, options);
    }

    async request(method, url, data = null, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const fetchOptions = {
                method: method,
                headers: { ...this.defaultHeaders, ...options.headers },
                signal: controller.signal,
                ...options
            };

            if (data && method !== 'GET') {
                fetchOptions.body = JSON.stringify(data);
            }

            const response = await fetch(url, fetchOptions);
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Check content type
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return await response.text();
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }

            console.error('[RequestHandler] Request failed:', error);
            throw error;
        }
    }
}

const request = new RequestHandler();
