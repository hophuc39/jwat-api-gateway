export default () => ({
  port: parseInt(process.env.PORT ?? '3000'),
  inverterServiceUrl:
    process.env.INVERTER_SERVICE_URL ?? 'http://localhost:50051',
  authServiceUrl: process.env.AUTH_SERVICE_URL ?? 'http://localhost:50052',
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  },
  jwttoken: process.env,
});
