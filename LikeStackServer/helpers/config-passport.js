const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('config');

const verifyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.SECRET_JWT,
  algorithms: ['HS256'],
};

passport.use(
  new JwtStrategy(verifyOptions, (payload, done) => done(null, payload)),
);

exports.createJwt = payload =>
  jwt.sign(payload, config.SECRET_JWT, {
    algorithm: 'HS256',
    expiresIn: '60 minutes',
  });

exports.authenticate = (req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate('jwt', (err, payload) => {
      if (err) reject(err);
      resolve(payload);
    })(req, res);
  });
