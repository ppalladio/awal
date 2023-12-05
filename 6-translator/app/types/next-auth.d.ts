// next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
    interface User {
        // Add the custom fields
        score?: number;
    }
    interface Session {
        user?: User;
    }
}
