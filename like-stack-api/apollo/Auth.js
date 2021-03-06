const { authenticate, createJwt } = require('../helpers/config-passport');
const cookieProdOptions =
  process.env.NODE_ENV === 'production'
    ? {
        secure: true,
        sameSite: 'None',
      }
    : {};

const ONE_HOUR = 1000 * 60 * 60;

class Auth {
  constructor({ req, res }) {
    this.req = req;
    this.res = res;
    this.isReady = false;
    this.hasSignedIn = false;
    this.accessTokenName = 'ip_at';
  }

  async authenticate() {
    const { req, res } = this;

    if (!req.headers.authorization) {
      const cookie = req.cookies[this.accessTokenName];
      if (cookie) req.headers.authorization = `bearer ${cookie}`;
    }
    const payload = await authenticate(req, res);
    if (payload) {
      this.payload = payload;
      this.hasSignedIn = true;
    }
  }

  signInWithJWT(user) {
    const token = createJwt({ uid: user.id });

    this.res.cookie(this.accessTokenName, token, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_HOUR * 3),
      ...cookieProdOptions,
    });
  }

  signOut() {
    this.res.clearCookie(this.accessTokenName, {
      httpOnly: true,
      ...cookieProdOptions,
    });
  }

  getUserId() {
    return this.payload.uid;
  }
}

module.exports = Auth;
