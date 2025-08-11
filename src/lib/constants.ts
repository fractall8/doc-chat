export const errorMessages: Record<string, string> = {
    OAuthSignin: "Error logging in via OAuth provider.",
    OAuthCallback: "Error receiving data from provider.",
    OAuthCreateAccount: "Failed to create account via OAuth.",
    EmailCreateAccount: "Failed to create account via Email.",
    Callback: "An error occurred in callback.",
    OAuthAccountNotLinked:
        "This email is already registered, but via another login method.",
    EmailSignin: "Failed to send magic link to this email.",
    CredentialsSignin: "Incorrect login or password.",
    default: "An unknown error occurred.",
};