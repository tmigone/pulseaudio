# Testing

Unit tests:
- run against data snapshots extracted from requests made to a PulseAudio server running v13
- run with `npm run test`

E2E tests:
- run against live PulseAudio servers, either v13 or v15. See [Testing-e2e-setup.md](Testing-e2e-setup.md) for instructions on how to setup the environment.
- run with `npm run test:e2e`