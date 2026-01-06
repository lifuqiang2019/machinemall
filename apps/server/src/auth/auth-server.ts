import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { APIError, createAuthMiddleware } from "better-auth/api";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/machinemall",
});

export const auth = betterAuth({
    database: pool,
    emailAndPassword: {
        enabled: true,
        autoSignIn: true 
    },
    user: {
        modelName: "user", // Ensure it maps to 'user' table
        fields: {
            emailVerified: "email_verified", // Map camelCase to snake_case column
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user"
            }
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
    session: {
        modelName: "session",
        fields: {
            userId: "user_id",
            expiresAt: "expires_at",
            ipAddress: "ip_address",
            userAgent: "user_agent",
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    },
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                const { email, code } = ctx.body;
                
                if (!code) {
                    throw new APIError("BAD_REQUEST", { message: "Verification code is required" });
                }

                // Query verification_code table using raw SQL since we are in better-auth context
                const result = await pool.query(
                    `SELECT * FROM verification_code WHERE email = $1`,
                    [email]
                );
                
                const verificationEntry = result.rows[0];

                if (!verificationEntry) {
                    throw new APIError("BAD_REQUEST", { message: "Please request a verification code first" });
                }

                if (verificationEntry.code !== code) {
                    throw new APIError("BAD_REQUEST", { message: "Invalid verification code" });
                }

                if (new Date() > new Date(verificationEntry.expiresAt)) {
                    throw new APIError("BAD_REQUEST", { message: "Verification code expired" });
                }

                // Verification passed!
                // We can optionally delete the code here or let it expire.
                // Let's delete it to prevent reuse.
                await pool.query(
                    `DELETE FROM verification_code WHERE id = $1`,
                    [verificationEntry.id]
                );

                // For emailVerified, better-auth might not allow setting it in the before hook directly on ctx.data?
                // Actually, ctx.body is read-only usually or changing it doesn't affect internal logic?
                // The documentation says "Use them to modify requests, pre validate data, or return early."
                // If we want to set emailVerified, we might need databaseHooks.user.create.before
                // But let's stick to validation first.
                // If we want to skip email verification flow (if enabled), we should ensure emailVerified is true.
                
                // Let's check if we can return modified context.
                // The example shows returning { data: ... } for database hooks.
                // For middleware hooks, we might modify ctx.body if allowed, or it just passes through.
                
                // However, if we just want to VALIDATE, this is enough.
                // If better-auth requires email verification (we didn't enable it explicitly with requireEmailVerification: true),
                // then users are created as verified or unverified based on default?
                // Default is usually unverified if emailVerification plugin is on?
                // But we only enabled emailAndPassword.
                
                // Let's keep it simple: just validation.
            }
        }),
    },
    trustedOrigins: ["http://localhost:3001", "http://localhost:5173", "http://localhost:5174"], // Add trusted origin for frontend
});