import { betterAuth } from "better-auth";

export const auth = betterAuth({
    // For now, we'll keep it simple as requested
    emailAndPassword: {
        enabled: true
    },
    // Social providers can be added here
    socialProviders: {
        // Example: github: { clientId: ..., clientSecret: ... }
    }
});
