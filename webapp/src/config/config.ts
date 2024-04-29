
export { };

declare global {
    interface Window {
        config: {
            todoApiUrl: string;
            auth: {
                signInRedirectURL: string;
                signOutRedirectURL: string;
                clientID: string;
                baseUrl: string;
            };
        }
    }
}