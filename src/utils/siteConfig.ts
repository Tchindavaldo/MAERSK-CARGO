// Utility to get site configuration from environment variables
export const getSiteName = (): string => {
    return import.meta.env.VITE_SITE_NAME || 'MAERSKAIRCARGO';
};

export const getSiteConfig = () => {
    return {
        name: getSiteName(),
        email: import.meta.env.VITE_SITE_EMAIL || 'contact@maerskaircargo.com',
        supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@maerskaircargo.com',
    };
};
