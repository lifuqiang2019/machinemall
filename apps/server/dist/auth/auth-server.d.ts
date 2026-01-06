export declare const auth: import("better-auth", { with: { "resolution-mode": "import" } }).Auth<{
    database: any;
    emailAndPassword: {
        enabled: true;
        autoSignIn: true;
    };
    user: {
        modelName: string;
        fields: {
            emailVerified: string;
            createdAt: string;
            updatedAt: string;
        };
        additionalFields: {
            role: {
                type: "string";
                required: false;
                defaultValue: string;
            };
        };
    };
    account: {
        modelName: string;
        fields: {
            userId: string;
            accountId: string;
            providerId: string;
            accessToken: string;
            refreshToken: string;
            accessTokenExpiresAt: string;
            refreshTokenExpiresAt: string;
            idToken: string;
            createdAt: string;
            updatedAt: string;
        };
    };
    session: {
        modelName: string;
        fields: {
            userId: string;
            expiresAt: string;
            ipAddress: string;
            userAgent: string;
            createdAt: string;
            updatedAt: string;
        };
    };
    hooks: {
        before: (inputContext: import("better-auth", { with: { "resolution-mode": "import" } }).MiddlewareInputContext<import("better-auth", { with: { "resolution-mode": "import" } }).MiddlewareOptions>) => Promise<void>;
    };
    trustedOrigins: string[];
}>;
