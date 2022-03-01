module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '16b0113ef5c15f43d95d0795131f2224'),
  },
});
