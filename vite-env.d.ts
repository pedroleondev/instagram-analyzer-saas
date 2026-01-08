interface ImportMetaEnv {
    readonly VITE_APIFY_API_TOKEN: string
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

// Declaração global para window.env
interface Window {
    env: {
        VITE_APIFY_API_TOKEN?: string;
        VITE_GEMINI_API_KEY?: string;
        VITE_SUPABASE_URL?: string;
        VITE_SUPABASE_KEY?: string;
        [key: string]: string | undefined;
    }
}


