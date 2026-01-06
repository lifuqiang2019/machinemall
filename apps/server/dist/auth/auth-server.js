"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const pg_1 = require("pg");
const api_1 = require("better-auth/api");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/machinemall",
});
exports.auth = (0, better_auth_1.betterAuth)({
    database: pool,
    emailAndPassword: {
        enabled: true,
        autoSignIn: true
    },
    user: {
        modelName: "user",
        fields: {
            emailVerified: "email_verified",
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
        before: (0, api_1.createAuthMiddleware)(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                const { email, code } = ctx.body;
                if (!code) {
                    throw new api_1.APIError("BAD_REQUEST", { message: "Verification code is required" });
                }
                const result = await pool.query(`SELECT * FROM verification_code WHERE email = $1`, [email]);
                const verificationEntry = result.rows[0];
                if (!verificationEntry) {
                    throw new api_1.APIError("BAD_REQUEST", { message: "Please request a verification code first" });
                }
                if (verificationEntry.code !== code) {
                    throw new api_1.APIError("BAD_REQUEST", { message: "Invalid verification code" });
                }
                if (new Date() > new Date(verificationEntry.expiresAt)) {
                    throw new api_1.APIError("BAD_REQUEST", { message: "Verification code expired" });
                }
                await pool.query(`DELETE FROM verification_code WHERE id = $1`, [verificationEntry.id]);
            }
        }),
    },
    trustedOrigins: ["http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
});
//# sourceMappingURL=auth-server.js.map