export default () => ({
  port: parseInt(process.env.PORT ?? '3000'),
  inverterServiceUrl:
    process.env.INVERTER_SERVICE_URL ?? 'http://localhost:50051',
  authServiceUrl: process.env.AUTH_SERVICE_URL ?? 'http://localhost:50052',
});
