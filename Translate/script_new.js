// Modern AI Translator JavaScript
class AITranslator {    constructor() {
        this.apiKey = '';
        this.isTranslating = false;
        this.maxChunkSize = 2000;
        this.translationStartTime = null;
        this.abortController = null;
        this.languageNames = {
            'auto': 'Auto',
            'af': 'Afrikaans',
            'sq': 'Albanian',
            'am': 'Amharic',
            'ar': 'Arabic',
            'hy': 'Armenian',
            'az': 'Azerbaijani',
            'eu': 'Basque',
            'be': 'Belarusian',
            'bn': 'Bengali',
            'bs': 'Bosnian',
            'bg': 'Bulgarian',
            'ca': 'Catalan',
            'ceb': 'Cebuano',
            'ny': 'Chichewa',
            'zh': 'Chinese',
            'co': 'Corsican',
            'hr': 'Croatian',
            'cs': 'Czech',
            'da': 'Danish',
            'nl': 'Dutch',
            'en': 'English',
            'eo': 'Esperanto',
            'et': 'Estonian',
            'tl': 'Filipino',
            'fi': 'Finnish',
            'fr': 'French',
            'fy': 'Frisian',
            'gl': 'Galician',
            'ka': 'Georgian',
            'de': 'German',
            'el': 'Greek',
            'gu': 'Gujarati',
            'ht': 'Haitian Creole',
            'ha': 'Hausa',
            'haw': 'Hawaiian',
            'iw': 'Hebrew',
            'hi': 'Hindi',
            'hmn': 'Hmong',
            'hu': 'Hungarian',
            'is': 'Icelandic',
            'ig': 'Igbo',
            'id': 'Indonesian',
            'ga': 'Irish',
            'it': 'Italian',
            'ja': 'Japanese',
            'jw': 'Javanese',
            'kn': 'Kannada',
            'kk': 'Kazakh',
            'km': 'Khmer',
            'ko': 'Korean',
            'ku': 'Kurdish',
            'ky': 'Kyrgyz',
            'lo': 'Lao',
            'la': 'Latin',
            'lv': 'Latvian',
            'lt': 'Lithuanian',
            'lb': 'Luxembourgish',
            'mk': 'Macedonian',
            'mg': 'Malagasy',
            'ms': 'Malay',
            'ml': 'Malayalam',
            'mt': 'Maltese',
            'mi': 'Maori',
            'mr': 'Marathi',
            'mn': 'Mongolian',
            'my': 'Myanmar',
            'ne': 'Nepali',
            'no': 'Norwegian',
            'ps': 'Pashto',
            'fa': 'Persian',
            'pl': 'Polish',
            'pt': 'Portuguese',
            'pa': 'Punjabi',
            'ro': 'Romanian',
            'ru': 'Russian',
            'sm': 'Samoan',
            'gd': 'Scots Gaelic',
            'sr': 'Serbian',
            'st': 'Sesotho',
            'sn': 'Shona',
            'sd': 'Sindhi',
            'si': 'Sinhala',
            'sk': 'Slovak',
            'sl': 'Slovenian',
            'so': 'Somali',
            'es': 'Spanish',
            'su': 'Sundanese',
            'sw': 'Swahili',
            'sv': 'Swedish',
            'tg': 'Tajik',
            'ta': 'Tamil',
            'te': 'Telugu',
            'th': 'Thai',
            'tr': 'Turkish',
            'uk': 'Ukrainian',
            'ur': 'Urdu',
            'uz': 'Uzbek',
            'vi': 'Vietnamese',
            'cy': 'Welsh',
            'xh': 'Xhosa',
            'yi': 'Yiddish',
            'yo': 'Yoruba',
            'zu': 'Zulu'
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedApiKey();
        this.initTheme();
        this.animatePageLoad();
        this.loadSavedLanguages();
        this.loadSavedModel();
        this.loadSavedTone();
    }

    loadSavedTone() {
        const savedTone = localStorage.getItem('translationTone');
        if (savedTone) {
            document.getElementById('translationTone').value = savedTone;
        }
    }

    loadSavedModel() {
        const savedModel = localStorage.getItem('aiModel');
        if (savedModel) {
            document.getElementById('aiModel').value = savedModel;
        }
    }

    loadSavedLanguages() {
        const savedTargetLang = localStorage.getItem('targetLanguage');
        if (savedTargetLang) {
            document.getElementById('targetLang').value = savedTargetLang;
        }
    }

    bindEvents() {
        // API Key events
        document.getElementById('saveApiKey').addEventListener('click', () => this.saveApiKey());
        document.getElementById('toggleApiKey').addEventListener('click', () => this.toggleApiKeyVisibility());
        document.getElementById('getApiKey').addEventListener('click', () => this.openApiKeyPage());
        document.getElementById('forgetApiKey').addEventListener('click', () => this.forgetApiKey());
        document.getElementById('apiKeyInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveApiKey();
        });        // Translation events
        document.getElementById('translateBtn').addEventListener('click', () => this.translate());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopTranslation());
        document.getElementById('inputText').addEventListener('input', () => this.updateCharCount());
        document.getElementById('inputText').addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.translate();
            }
        });

        // Language controls
        document.getElementById('swapLanguages').addEventListener('click', () => this.swapLanguages());
        document.getElementById('clearInput').addEventListener('click', () => this.clearInput());
        document.getElementById('sourceLang').addEventListener('change', () => this.validateLanguageSelection());
        document.getElementById('targetLang').addEventListener('change', () => {
            this.validateLanguageSelection();
            localStorage.setItem('targetLanguage', document.getElementById('targetLang').value);
        });

        // Model selection
        document.getElementById('aiModel').addEventListener('change', () => {
            localStorage.setItem('aiModel', document.getElementById('aiModel').value);
        });

        // Tone selection
        document.getElementById('translationTone').addEventListener('change', () => {
            localStorage.setItem('translationTone', document.getElementById('translationTone').value);
        });

        // Output controls
        document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('speakBtn').addEventListener('click', () => this.speakText());

        // Theme toggle
        document.getElementById('theme-icon').addEventListener('click', () => this.toggleTheme());

        // Auto-resize textarea
        this.autoResizeTextarea();
    }

    // API Key Management
    saveApiKey() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            this.showNotification('Please enter your API key', 'error');
            return;
        }

        if (!this.validateApiKey(apiKey)) {
            this.showNotification('Invalid API key format', 'error');
            return;
        }

        this.apiKey = apiKey;
        sessionStorage.setItem('googleApiKey', apiKey);
        
        this.showNotification('API key saved successfully!', 'success');
        
        // Animate transition to main content
        setTimeout(() => {
            this.showMainContent();
        }, 1000);
    }

    forgetApiKey() {
        this.apiKey = '';
        sessionStorage.removeItem('googleApiKey');
        document.getElementById('apiKeyInput').value = '';
        
        // Hide main content and show API key section
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('apiKeySection').style.display = 'flex';
        
        this.showNotification('API key forgotten', 'success');
    }

    openApiKeyPage() {
        window.open('https://aistudio.google.com/app/apikey', '_blank');
    }

    validateLanguageSelection() {
        const sourceLang = document.getElementById('sourceLang').value;
        const targetLang = document.getElementById('targetLang').value;
        
        // Prevent same language selection (except auto)
        if (sourceLang !== 'auto' && sourceLang === targetLang) {
            this.showNotification('Source and target languages cannot be the same', 'warning');
            // Reset target language to English
            document.getElementById('targetLang').value = 'en';
        }
    }

    getSelectedModel() {
        return document.getElementById('aiModel').value;
    }

    getApiUrl() {
        const model = this.getSelectedModel();
        const modelEndpoints = {
            'gemini-2.0-flash': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
            'gemini-2.5-flash': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
            'gemini-2.5-flash-lite': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent'
        };
        return `${modelEndpoints[model]}?key=${this.apiKey}`;
    }

    validateApiKey(apiKey) {
        // Basic validation for Google API key format
        return apiKey.length >= 35 && /^AIza[0-9A-Za-z-_]{35,}$/.test(apiKey);
    }

    toggleApiKeyVisibility() {
        const input = document.getElementById('apiKeyInput');
        const icon = document.getElementById('toggleApiKey').querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    loadSavedApiKey() {
        const savedKey = sessionStorage.getItem('googleApiKey');
        if (savedKey) {
            this.apiKey = savedKey;
            document.getElementById('apiKeyInput').value = savedKey;
            this.showMainContent();
        }
    }

    showMainContent() {
        const apiSection = document.getElementById('apiKeySection');
        const mainContent = document.getElementById('mainContent');
        
        apiSection.style.animation = 'fadeInUp 0.5s ease-out reverse';
        
        setTimeout(() => {
            apiSection.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.animation = 'fadeInUp 0.6s ease-out';
        }, 500);
    }    // Translation Functions
    async translate() {
        if (this.isTranslating) return;

        const inputText = document.getElementById('inputText').value.trim();
        if (!inputText) {
            this.showNotification('Please enter text to translate', 'warning');
            return;
        }

        if (!this.apiKey) {
            this.showNotification('API key not found', 'error');
            return;
        }

        this.startTranslation();

        try {
            const sourceLang = document.getElementById('sourceLang').value;
            const targetLang = document.getElementById('targetLang').value;

            // Create abort controller for this translation
            this.abortController = new AbortController();

            // Split text into chunks for long texts
            const chunks = this.splitTextIntoChunks(inputText);
            let translatedChunks = [];
            let alternativeChunks = [];
            let detectedLanguage = null;

            for (let i = 0; i < chunks.length; i++) {
                // Check if translation was stopped
                if (this.abortController.signal.aborted) {
                    throw new Error('Translation stopped by user');
                }
                
                this.updateTranslationProgress((i / chunks.length) * 100);
                
                const result = await this.translateChunk(chunks[i], sourceLang, targetLang);
                translatedChunks.push(result.text);
                alternativeChunks.push(...result.alternatives);
                
                if (result.detectedLanguage && !detectedLanguage) {
                    detectedLanguage = result.detectedLanguage;
                }
            }

            const finalTranslation = translatedChunks.join(' ');
            this.displayTranslation(finalTranslation, detectedLanguage, alternativeChunks);

        } catch (error) {
            console.error('Translation error:', error);
            if (error.message === 'Translation stopped by user') {
                this.showNotification('Translation stopped', 'info');
                document.getElementById('outputText').textContent = 'Translation was stopped.';
            } else {
                this.showNotification('Translation failed. Please try again.', 'error');
            }
        } finally {
            this.endTranslation();
        }
    }

    splitTextIntoChunks(text) {
        if (text.length <= this.maxChunkSize) {
            return [text];
        }

        const chunks = [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        let currentChunk = '';

        for (const sentence of sentences) {
            if ((currentChunk + sentence).length > this.maxChunkSize && currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = sentence;
            } else {
                currentChunk += (currentChunk ? '. ' : '') + sentence;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }    async translateChunk(text, sourceLang, targetLang) {
        const url = this.getApiUrl();
        const prompt = this.createTranslationPrompt(text, sourceLang, targetLang);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            }),
            signal: this.abortController.signal
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        let responseText = data.candidates[0].content.parts[0].text.trim();
        
        // More robust JSON extraction
        const jsonStartIndex = responseText.indexOf('{');
        const jsonEndIndex = responseText.lastIndexOf('}') + 1;
        
        if (jsonStartIndex !== -1 && jsonEndIndex !== 0) {
            responseText = responseText.substring(jsonStartIndex, jsonEndIndex);
        }

        try {
            const translationData = JSON.parse(responseText);
            return {
                text: translationData.main_translation || '',
                alternatives: translationData.alternatives || [],
                detectedLanguage: sourceLang === 'auto' ? this.detectLanguageFromResponse(translationData.main_translation) : null
            };
        } catch (error) {
            console.error("Failed to parse translation JSON:", error);
            // If parsing fails, treat the entire response as the main translation.
            return {
                text: responseText,
                alternatives: [],
                detectedLanguage: sourceLang === 'auto' ? this.detectLanguageFromResponse(responseText) : null
            };
        }
    }

    createTranslationPrompt(text, sourceLang, targetLang) {
        const sourceLanguageName = sourceLang === 'auto' ? 'automatically detected language' : this.languageNames[sourceLang] || sourceLang;
        const targetLanguageName = this.languageNames[targetLang] || targetLang;
        const translationTone = document.getElementById('translationTone').value;
        
        return `Translate the following text from ${sourceLanguageName} to ${targetLanguageName} in a ${translationTone} tone. Provide the main translation and three alternative translations. Format the output as a JSON object with two keys: "main_translation" and "alternatives". The "alternatives" key should contain an array of three strings. Only provide the JSON object without any additional text, explanations, or formatting:

${text}`;
    }

    detectLanguageFromResponse(text) {
        // Simple language detection based on character patterns
        if (/[\u4e00-\u9fff]/.test(text)) return 'Chinese';
        if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'Japanese';
        if (/[\u0600-\u06ff]/.test(text)) return 'Arabic';
        if (/[\u0400-\u04ff]/.test(text)) return 'Russian';
        return 'Unknown';
    }    startTranslation() {
        this.isTranslating = true;
        this.translationStartTime = Date.now();
        
        const btn = document.getElementById('translateBtn');
        const stopBtn = document.getElementById('stopBtn');
        const btnText = btn.querySelector('.btn-text');
        const loader = btn.querySelector('.loader');
        
        btn.disabled = true;
        btnText.style.display = 'none';
        loader.style.display = 'block';
        stopBtn.style.display = 'block';
        
        document.getElementById('outputText').innerHTML = 'Translating...';
    }

    stopTranslation() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    endTranslation() {
        this.isTranslating = false;
        const btn = document.getElementById('translateBtn');
        const stopBtn = document.getElementById('stopBtn');
        const btnText = btn.querySelector('.btn-text');
        const loader = btn.querySelector('.loader');
        
        btn.disabled = false;
        btnText.style.display = 'inline';
        loader.style.display = 'none';
        stopBtn.style.display = 'none';
        
        if (this.translationStartTime) {
            const duration = ((Date.now() - this.translationStartTime) / 1000).toFixed(1);
            const durationElement = document.getElementById('translationDuration');
            if (durationElement) {
                durationElement.textContent = `Completed in ${duration}s`;
            }
        }
    }

    updateTranslationProgress(progress) {
        // You can implement a progress bar here if needed
        console.log(`Translation progress: ${progress.toFixed(1)}%`);
    }    displayTranslation(translation, detectedLang, alternatives = []) {
        const outputText = document.getElementById('outputText');
        const detectedLangElement = document.getElementById('detectedLang');
        const alternativesSection = document.getElementById('alternativesSection');
        const alternativesList = document.getElementById('alternativesList');
        
        outputText.textContent = translation;
        
        if (detectedLang) {
            detectedLangElement.textContent = `Detected: ${detectedLang}`;
        } else {
            detectedLangElement.textContent = '';
        }

        if (alternatives.length > 0) {
            alternativesList.innerHTML = '';
            alternatives.forEach(alt => {
                const altElement = document.createElement('div');
                altElement.className = 'alternative-item';
                altElement.textContent = alt;
                altElement.addEventListener('click', () => {
                    const currentMainTranslation = outputText.textContent;
                    outputText.textContent = altElement.textContent;
                    altElement.textContent = currentMainTranslation;
                });
                alternativesList.appendChild(altElement);
            });
            alternativesSection.style.display = 'block';
        } else {
            alternativesSection.style.display = 'none';
        }

        // Show translation duration
        if (this.translationStartTime) {
            const duration = ((Date.now() - this.translationStartTime) / 1000).toFixed(1);
            const durationElement = document.getElementById('translationDuration');
            if (durationElement) {
                durationElement.textContent = `Completed in ${duration}s`;
                durationElement.style.display = 'block';
            }
        }
    }

    // UI Helper Functions
    updateCharCount() {
        const input = document.getElementById('inputText');
        const charCount = document.getElementById('charCount');
        const current = input.value.length;
        const max = input.maxLength;
        
        charCount.textContent = `${current} / ${max}`;
        
        if (current > max * 0.9) {
            charCount.style.color = 'var(--error-color)';
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
    }

    swapLanguages() {
        const sourceLang = document.getElementById('sourceLang');
        const targetLang = document.getElementById('targetLang');
        
        if (sourceLang.value === 'auto') {
            this.showNotification('Cannot swap with auto-detect', 'warning');
            return;
        }
        
        const temp = sourceLang.value;
        sourceLang.value = targetLang.value;
        targetLang.value = temp;
        
        // Also swap the text
        const inputText = document.getElementById('inputText').value;
        const outputText = document.getElementById('outputText').textContent;
        
        if (outputText && outputText !== 'Translation will appear here...') {
            document.getElementById('inputText').value = outputText;
            document.getElementById('outputText').textContent = inputText;
            this.updateCharCount();
        }
    }    clearInput() {
        document.getElementById('inputText').value = '';
        document.getElementById('outputText').textContent = 'Translation will appear here...';
        document.getElementById('detectedLang').textContent = '';
        document.getElementById('alternativesSection').style.display = 'none';
        const durationElement = document.getElementById('translationDuration');
        if (durationElement) {
            durationElement.textContent = '';
            durationElement.style.display = 'none';
        }
        this.updateCharCount();
    }

    async copyToClipboard() {
        const outputText = document.getElementById('outputText').textContent;
        
        if (!outputText || outputText === 'Translation will appear here...') {
            this.showNotification('No text to copy', 'warning');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(outputText);
            this.showNotification('Text copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            this.showNotification('Failed to copy text', 'error');
        }
    }

    speakText() {
        const outputText = document.getElementById('outputText').textContent;
        const targetLang = document.getElementById('targetLang').value;
        
        if (!outputText || outputText === 'Translation will appear here...') {
            this.showNotification('No text to speak', 'warning');
            return;
        }
        
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(outputText);
            utterance.lang = this.getVoiceLang(targetLang);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            
            speechSynthesis.speak(utterance);
            this.showNotification('Speaking...', 'info');
        } else {
            this.showNotification('Speech synthesis not supported', 'error');
        }
    }

    getVoiceLang(langCode) {
        const voiceMap = {
            'en': 'en-US',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'it': 'it-IT',
            'pt': 'pt-PT',
            'ru': 'ru-RU',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'zh': 'zh-CN',
            'ar': 'ar-SA',
            'tr': 'tr-TR'
        };
        return voiceMap[langCode] || 'en-US';
    }

    // Theme Management
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.getElementById('theme-icon');
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Animation Functions
    animatePageLoad() {
        const elements = document.querySelectorAll('.api-key-card, .translator-card, .feature-card');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    

    autoResizeTextarea() {
        const textarea = document.getElementById('inputText');
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });
    }    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        const icon = notification.querySelector('i');
        
        // Clear any existing timeouts for this notification
        if (notification.timeoutId) {
            clearTimeout(notification.timeoutId);
        }
        
        // Set message and icon based on type
        notificationText.textContent = message;
        
        const iconMap = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle'
        };
        
        icon.className = iconMap[type] || iconMap['success'];
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.style.display = 'flex';
        notification.style.animation = 'slideInRight 0.3s ease-out';
        
        // Hide after 4 seconds
        notification.timeoutId = setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 4000);
    }
}

// Initialize the translator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AITranslator();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
    
    .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .model-tone-selectors {
        display: flex;
        gap: 1rem;
    }

    select {
        transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    select:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
    }

    .alternative-separator {
        border-top: 1px solid var(--border-color);
        opacity: 0.5;
        margin: 1rem 0;
    }

    .alternatives-title {
        font-size: 0.9rem;
        color: var(--text-secondary);
        opacity: 0.7;
        margin-bottom: 0.5rem;
    }

    .alternatives-section {
        background-color: rgba(0, 0, 0, 0.05);
        padding: 0.5rem 1rem 1rem 1rem;
        border-radius: 8px;
        margin-top: 1rem;
    }

    .alternative-item {
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 5px;
        transition: background-color 0.2s ease;
    }

    .alternative-item:hover {
        background-color: rgba(0, 0, 0, 0.08);
    }
`;
document.head.appendChild(style);
