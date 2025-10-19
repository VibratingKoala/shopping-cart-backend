# shopping-cart-api

Minimal scaffold for the shopping cart technical assessment.

Quick start

1. Install dependencies:

```powershell
npm ci
```

2. Run tests:

```powershell
npm test
```

3. Build:

```powershell
npm run build
```

Notes
- Focused on domain-first design. Add controllers/server later in `src/infrastructure`.
- Dockerfiles under `infra/docker/` and Terraform placeholders under `infra/terraform/`.

What's included
- Domain value object example (Money) and unit tests.
- CI/CD workflow skeletons for GitHub Actions.
- Prod Dockerfile (multi-stage) and Terraform placeholders.

Next steps
- Implement Cart aggregate, use cases, adapters, and expand tests to reach >70% domain coverage.
