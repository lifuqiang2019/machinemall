import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // console.log("Creating user object:", user);
                    // Better-auth might be stripping the password before this hook in email/password flow
                    // But usually it should handle hashing internally.
                    // If 'password' is not in 'user' object here, it means better-auth didn't pass it.
                    
                    // However, for email/password auth, better-auth should automatically hash password and store it.
                    // If we are using custom schema mapping, we might need to ensure 'password' field is correctly mapped.
                    // The issue might be that better-auth treats 'password' as an internal field and doesn't expose it in the 'user' object passed to hooks unless explicitly handled, 
                    // OR it expects the database adapter to handle it.
                    
                    return user;
                },
                after: async (user) => {
                    // console.log("User created:", user);
                }
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true // Auto sign in after registration
    },
    // Map to snake_case for Postgres compatibility
    user: {
        modelName: "user",
        fields: {
            emailVerified: "email_verified",
            createdAt: "created_at",
            updatedAt: "updated_at",
            password: "password"
        }
    },
    session: {
        modelName: "session",
        fields: {
            userId: "user_id",
            expiresAt: "expires_at",
            createdAt: "created_at",
            updatedAt: "updated_at",
            ipAddress: "ip_address",
            userAgent: "user_agent"
        }
    },
    account: {
        modelName: "account",
        fields: {
            userId: "user_id",
            accountId: "account_id",
            providerId: "provider_id",
            accessToken: "access_token",
            refreshToken: "refresh_token",
            accessTokenExpiresAt: "access_token_expires_at",
            refreshTokenExpiresAt: "refresh_token_expires_at",
            idToken: "id_token",
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    },
    verification: {
        modelName: "verification",
        fields: {
            expiresAt: "expires_at",
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    },
    emailAndPassword: {
        enabled: true
    },
    // Social providers can be added here
    socialProviders: {
        // Example: github: { clientId: ..., clientSecret: ... }
    }
});
