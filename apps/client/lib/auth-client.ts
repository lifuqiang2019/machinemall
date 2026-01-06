import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // Use the backend URL directly, better-auth needs to be exposed there
    baseURL: "http://localhost:3000/api/auth" 
});
