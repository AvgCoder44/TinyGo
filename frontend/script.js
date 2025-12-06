// API Configuration - Worker backend URL
// Update this with your deployed worker URL
const API_BASE_URL = 'https://worker.tinygo.workers.dev';

// DOM Elements
const form = document.getElementById('url-form');
const urlInput = document.getElementById('long-url');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementById('error-message');
const resultContainer = document.getElementById('result-container');
const shortUrlElement = document.getElementById('short-url');
const originalUrlElement = document.getElementById('original-url');
const copyBtn = document.getElementById('copy-btn');
const toast = document.getElementById('toast');
const toggleCustomCodeBtn = document.getElementById('toggle-custom-code');
const customCodeContainer = document.getElementById('custom-code-container');
const customCodeInput = document.getElementById('custom-code');
const viewAnalyticsBtn = document.getElementById('view-analytics-btn');
const analyticsContainer = document.getElementById('analytics-container');
const analyticsContent = document.getElementById('analytics-content');
const closeAnalyticsBtn = document.getElementById('close-analytics-btn');
const refreshAnalyticsBtn = document.getElementById('refresh-analytics-btn');
let currentShortCode = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Focus input on load
    urlInput.focus();
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Copy button
    copyBtn.addEventListener('click', handleCopy);
    
    // View analytics button
    viewAnalyticsBtn.addEventListener('click', handleViewAnalytics);
    
    // Refresh analytics button
    refreshAnalyticsBtn.addEventListener('click', () => {
        if (currentShortCode) {
            handleViewAnalytics();
        }
    });
    
    // Close analytics button
    closeAnalyticsBtn.addEventListener('click', () => {
        analyticsContainer.classList.add('hidden');
    });
    
    // Toggle custom code input
    toggleCustomCodeBtn.addEventListener('click', () => {
        customCodeContainer.classList.toggle('hidden');
        if (!customCodeContainer.classList.contains('hidden')) {
            customCodeInput.focus();
        }
    });
    
    // Clear error on input
    urlInput.addEventListener('input', () => {
        hideError();
    });
    
    customCodeInput.addEventListener('input', () => {
        hideError();
    });
});

/**
 * Handle form submission
 */
async function handleSubmit(e) {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    const customCode = customCodeInput.value.trim();
    
    // Validate URL
    if (!isValidUrl(url)) {
        showError('Please enter a valid URL (e.g., https://example.com)');
        urlInput.focus();
        return;
    }
    
    // Validate custom code if provided
    if (customCode) {
        const customCodeRegex = /^[a-zA-Z0-9_-]{2,50}$/;
        if (!customCodeRegex.test(customCode)) {
            showError('Invalid custom code. Use 2-50 characters: a-z, A-Z, 0-9, -, _');
            customCodeInput.focus();
            return;
        }
    }
    
    // Reset state
    hideError();
    hideResult();
    setLoading(true);
    
    try {
        // Prepare request body
        const requestBody = { url };
        if (customCode) {
            requestBody.custom_code = customCode;
        }
        
        // Call API to shorten URL
        const response = await fetch(`${API_BASE_URL}/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to shorten URL');
        }
        
        // Display result
        displayResult(data.short_url, url, data.code);
        
    } catch (error) {
        console.error('Error shortening URL:', error);
        showError(error.message || 'Failed to shorten URL. Please try again.');
    } finally {
        setLoading(false);
    }
}

/**
 * Display the shortened URL result
 */
function displayResult(shortUrl, originalUrl, code) {
    shortUrlElement.href = shortUrl;
    shortUrlElement.textContent = shortUrl;
    originalUrlElement.textContent = originalUrl;
    resultContainer.classList.remove('hidden');
    
    // Store the code for analytics
    if (code) {
        currentShortCode = code;
    } else {
        // Extract code from URL
        const urlParts = shortUrl.split('/');
        currentShortCode = urlParts[urlParts.length - 1];
    }
    
    // Hide analytics when new URL is created
    analyticsContainer.classList.add('hidden');
    
    // Scroll to result smoothly
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hide result container
 */
function hideResult() {
    resultContainer.classList.add('hidden');
}

/**
 * Handle copy to clipboard
 */
async function handleCopy() {
    const shortUrl = shortUrlElement.textContent;
    
    try {
        await navigator.clipboard.writeText(shortUrl);
        
        // Update button state
        copyBtn.classList.add('copied');
        copyBtn.setAttribute('aria-label', 'Copied to clipboard!');
        
        // Show toast
        showToast('URL copied to clipboard!', 'success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.setAttribute('aria-label', 'Copy to clipboard');
        }, 2000);
        
    } catch (error) {
        console.error('Failed to copy:', error);
        
        // Fallback: Select text
        const range = document.createRange();
        range.selectNodeContents(shortUrlElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        showToast('Failed to copy. Text selected - press Ctrl+C to copy.', 'error');
    }
}

/**
 * Set loading state
 */
function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
        submitBtn.classList.add('loading');
    } else {
        submitBtn.classList.remove('loading');
    }
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.setAttribute('aria-live', 'polite');
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 3000);
}

/**
 * Handle view analytics
 */
async function handleViewAnalytics() {
    if (!currentShortCode) {
        showError('No code available for analytics');
        return;
    }
    
    // Show container if hidden
    if (analyticsContainer.classList.contains('hidden')) {
        analyticsContainer.classList.remove('hidden');
    }
    
    // Show loading state
    analyticsContent.innerHTML = '<div class="analytics-loading">Loading analytics...</div>';
    
    // Add spinning animation to refresh button
    refreshAnalyticsBtn.classList.add('spinning');
    
    try {
        console.log('Fetching analytics for code:', currentShortCode);
        const response = await fetch(`${API_BASE_URL}/stats/${currentShortCode}`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Analytics data received:', data);
        displayAnalytics(data);
        
    } catch (error) {
        console.error('Error loading analytics:', error);
        analyticsContent.innerHTML = `
            <div class="analytics-error">
                <p>Failed to load analytics: ${error.message}</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem; color: var(--text-secondary);">
                    Code: ${currentShortCode}
                </p>
            </div>
        `;
    } finally {
        // Remove spinning animation
        refreshAnalyticsBtn.classList.remove('spinning');
    }
}

/**
 * Display analytics data
 */
function displayAnalytics(data) {
    const { code, total_clicks, metadata } = data;
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };
    
    analyticsContent.innerHTML = `
        <div class="analytics-stats">
            <div class="stat-card">
                <div class="stat-icon">🔗</div>
                <div class="stat-info">
                    <div class="stat-label">Short Code</div>
                    <div class="stat-value">${code}</div>
                </div>
            </div>
            
            <div class="stat-card highlight">
                <div class="stat-icon">👆</div>
                <div class="stat-info">
                    <div class="stat-label">Total Clicks</div>
                    <div class="stat-value-wrapper">
                        <div class="stat-value large" id="total-clicks-value">${total_clicks || 0}</div>
                        <button class="stat-refresh-btn" id="refresh-clicks-btn" title="Refresh count">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 3V1M8 1L10 3M8 1L6 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3 8C3 10.7614 5.23858 13 8 13C9.65685 13 11.1566 12.1569 12 10.8889" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M13 8C13 5.23858 10.7614 3 8 3C6.34315 3 4.84344 3.84315 4 5.11111" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M13 8H15M13 8L11 6M3 8H1M3 8L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            ${metadata.created ? `
            <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-info">
                    <div class="stat-label">Created</div>
                    <div class="stat-value small">${formatDate(metadata.created)}</div>
                </div>
            </div>
            ` : ''}
            
            ${metadata.firstClick ? `
            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-info">
                    <div class="stat-label">First Click</div>
                    <div class="stat-value small">${formatDate(metadata.firstClick)}</div>
                </div>
            </div>
            ` : ''}
            
            ${metadata.lastClick ? `
            <div class="stat-card">
                <div class="stat-icon">🕐</div>
                <div class="stat-info">
                    <div class="stat-label">Last Click</div>
                    <div class="stat-value small">${formatDate(metadata.lastClick)}</div>
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    // Add event listener to refresh button
    const refreshClicksBtn = document.getElementById('refresh-clicks-btn');
    if (refreshClicksBtn) {
        refreshClicksBtn.addEventListener('click', async () => {
            // Add spinning animation
            refreshClicksBtn.classList.add('spinning');
            const totalClicksValue = document.getElementById('total-clicks-value');
            
            try {
                const response = await fetch(`${API_BASE_URL}/stats/${code}`);
                if (response.ok) {
                    const data = await response.json();
                    // Update only the clicks count
                    if (totalClicksValue) {
                        totalClicksValue.textContent = data.total_clicks || 0;
                    }
                }
            } catch (error) {
                console.error('Error refreshing clicks:', error);
            } finally {
                // Remove spinning animation after a short delay
                setTimeout(() => {
                    refreshClicksBtn.classList.remove('spinning');
                }, 500);
            }
        });
    }
}

/**
 * Validate URL
 */
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

