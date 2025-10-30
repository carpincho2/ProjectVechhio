const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

module.exports = function(passport) {
    console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);

    // Validar que las variables críticas estén definidas.
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
        console.error('ERROR: Faltan variables de entorno para Google OAuth. Asegura GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET y GOOGLE_CALLBACK_URL.');
        // En producción abortamos el inicio para evitar usar valores incorrectos.
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Missing required Google OAuth environment variables. Aborting startup.');
        }
    }

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Usar la URL de callback proveniente de las env vars. No hay fallback a localhost.
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
        // cuando se despliega detrás de proxies (render, heroku, etc.) ayuda a usar el protocolo correcto
        proxy: true
        
    },
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value
        };

        try {
            let user = await User.findOne({ where: { googleId: profile.id } });

            if (user) {
                done(null, user);
            } else {
                user = await User.findOne({ where: { email: profile.emails[0].value } });
                if (user) {
                    // Si el usuario existe con email pero no con googleId, lo actualizamos.
                    user.googleId = profile.id;
                    await user.save();
                    done(null, user);
                } else {
                    // Si no existe, lo creamos.
                    user = await User.create(newUser);
                    done(null, user);
                }
            }
        } catch (err) {
            done(err, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
