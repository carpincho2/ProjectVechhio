const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // Usar GOOGLE_CALLBACK_URL si está definida (producción), sino fallback a localhost
       
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
