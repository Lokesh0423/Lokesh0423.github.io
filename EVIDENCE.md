# Portfolio evidence review

Reviewed on 18 October 2026. Case studies are personal portfolio/lab work, not employer production claims.

- https://github.com/Lokesh0423/secure-gitops-platform
- https://github.com/Lokesh0423/terraform-azure-infra
- https://github.com/Lokesh0423/azure-cicd-pipeline
- https://github.com/Lokesh0423/k8s-helm-charts
- https://github.com/Lokesh0423/nodejs-k8s-minikube-app

AWS EC2/Apache and S3 labs are based on user-provided practice history; no AWS repository or current live endpoint was verified.

The latest observed Secure GitOps run failed (15 September 2026). Successful historical runs exist (14 August 2026). CI success does not establish successful cloud deployment.

Azure screenshots prove a completed Build and Push to ACR stage and registry tags; they do not establish successful AKS promotion.

Terraform workflow is currently nested under environments/.github/workflows and is not automatically discoverable by GitHub Actions. Monitoring alert scope is a placeholder, and node autoscaling is not set in the committed AKS module.

The GitOps chart references helper and companion templates not present in the reviewed tree. Prometheus configuration and alert rules are present; Grafana dashboards and a live monitoring deployment were not verified.

The Minikube app has an undefined app reference in server.js despite successful historical image-build runs. No current runtime success is claimed.

## Local validation on 18 October 2026

The GitOps application at commit 4cffb6d08395ebdeb63fd50d90f5786418ef9239 passed its four endpoint tests locally. A 30-second localhost smoke run targeting 100 requests/second recorded 2924 successful requests, 0 observed errors, and client p95 latency of 2.30 ms. Raw latency samples independently reproduce the nearest-rank percentile, and the application counter equals the measured requests plus ten warm-up requests. These checks are scoped to a short local run, not a production or cloud deployment claim.
