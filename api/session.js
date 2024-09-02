// api/session.js
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

export default function withSession(handler) {
    const pgSession = connectPgSimple(session);

    return (req, res) => {
        session({
            store: new pgSession({
                conObject: {
                    connectionString: process.env.POSTGRES_URL,
                },
            }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: process.env.NODE_ENV === 'production' },
        })(req, res, () => handler(req, res));
    };
}
