// Values come from environment variables set in the Vercel project settings
// (NEXT_APP_FIREBASE_*), mapped in next.config.js.
export const vercelConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectID,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderID,
    appId: process.env.appID,
    measurementId: process.env.measurementID
}
