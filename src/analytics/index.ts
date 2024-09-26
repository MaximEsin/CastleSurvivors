import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

initializeFaro({
  url: 'https://faro-collector-prod-eu-west-2.grafana.net/collect/8bd91c6e0a793b6e1fe5b210fa3a25aa',
  app: {
    name: 'Wolf of Wild Street',
    version: '1.0.0',
    environment: 'production',
  },

  instrumentations: [...getWebInstrumentations(), new TracingInstrumentation()],
});
