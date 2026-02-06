/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_SITE_NAME: string
    readonly VITE_SITE_EMAIL: string
    readonly VITE_SUPPORT_EMAIL: string
    readonly VITE_ALLOWED_EMAILS: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
