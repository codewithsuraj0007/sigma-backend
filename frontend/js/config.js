/**
 * config.js - Global Configuration for Sigma Developer Portfolio
 * Production-ready: uses relative paths on Netlify/Vercel, localhost for local dev.
 *
 * HOW IT WORKS:
 *  - Local dev  → http://localhost:3000/api/...  (hits your local Express server)
 *  - Netlify    → /api/...  (hits /.netlify/functions/* via redirect in netlify.toml)
 *  - Vercel     → /api/...  (hits /api/* serverless functions via vercel.json)
 *
 * NO hardcoded production URL needed — relative paths always work on the deployed domain.
 */

const CONFIG = {
    // 2. AUTOMATIC API URL DETECTION
    get API_URL() {
        const isLocal = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
        
        // Local dev: use local Express server
        // Production (Netlify / Vercel): use relative path (empty string)
        //   → "/api/chat" is served by serverless functions on the same domain
        return isLocal ? 'http://localhost:3000' : '';
    }
};

// Freeze the config to prevent accidental changes at runtime
Object.freeze(CONFIG);
window.CONFIG = CONFIG;
