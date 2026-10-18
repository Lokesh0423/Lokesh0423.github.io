# Hands-on DevOps measurement protocol

This is a measurement plan, not a report of completed tests.

## 1. Make the system measurable

- Fix and start the actual application at a recorded Git commit.
- Confirm /health and /ready reflect the runtime behavior being tested.
- Install and validate a real Prometheus deployment and scrape target. The repository's prometheus.yaml is a configuration file, not an installable monitoring stack.
- Confirm the request counter and duration histogram have samples from the application, not only health checks or metrics scrapes.
- For Kubernetes CPU and memory, validate kubelet/cAdvisor collection and the pod/container labels first.
- Do not treat a configured limit, replica count or alert threshold as a measured result.

## 2. Record a comparable baseline

Record all of these before testing:

- Commit SHA and image digest
- Environment and region; local versus cloud
- Node and pod resources and replica count
- Load generator, request route, request rate/concurrency and test duration
- Cache state and warm-up period
- UTC start/end timestamps and PromQL window

Run a fixed workload for at least five minutes after warm-up. Preserve request rate, error rate, latency histogram, container CPU and memory. A low-load local test is a lab result, not a production SLA.

## 3. Change one thing and repeat

Make one documented change. Repeat with the same workload and environment. Keep the raw before and after exports, run links and screenshots, including failures.

Report the observed values, units, time windows, sample size and limitations. Only calculate an improvement when both measurements exist and are comparable.

## 4. Measure delivery separately

For each pipeline run, record:

- Workflow/pipeline and stage name
- Commit, runner and cache state
- Start/end timestamps and duration in seconds
- Run URL, outcome, retries and skipped deployment steps

Build duration and deployment duration are different measurements. For deployment duration, record deployment start through successful rollout completion. A green build with registry push skipped is not deployment evidence.

The portfolio currently has one original Azure DevOps screenshot showing a 60-second Build and Push to ACR stage on 13 June 2026. It is not a before/after benchmark.

## 5. Capture a controlled troubleshooting exercise

Use a local or isolated lab. Record the fault introduced, signal that detected it, investigation commands, root cause, fix, and verification. Measure detection and recovery times only if timestamps were actually captured. Do not invent outages or incident response metrics.

## Suggested evidence record

metric:
unit:
environment:
commit_sha:
image_digest:
workload:
warmup:
measurement_start_utc:
measurement_end_utc:
query:
baseline_value:
changed_value:
change_description:
sample_count:
run_or_artifact_url:
limitations:

## Reference

Prometheus instrumentation: https://prometheus.io/docs/practices/instrumentation/
Prometheus histograms: https://prometheus.io/docs/practices/histograms/


## Recorded local smoke check (18 October 2026)

A short local validation of secure-gitops-platform was run at commit
4cffb6d08395ebdeb63fd50d90f5786418ef9239. It used a single Linux Node.js
process for both the server and load generator, HTTP on loopback, ten warm-up
requests and a 30-second GET / workload targeting 100 requests/second.

This is a smoke test, not a capacity benchmark. No production/cloud latency,
availability, Kubernetes health or performance improvement is established.
CPU and memory allocation were not controlled. The latency percentile is a
client-side nearest-rank calculation, not a Prometheus query result.

Results are in local-smoke-results.json. Sorted completed-request latency
samples are in client-latencies.csv. Prometheus endpoint output is in
prometheus-smoke.prom. The reproduction script is measure-local.cjs.

To reproduce, obtain the pinned app source and its package-lock.json, install
its pinned dependencies using npm ci --ignore-scripts, put measure-local.cjs
in the app directory and run node measure-local.cjs. It opens only a temporary
127.0.0.1 listener and closes it after the run.

Separately, the app's four endpoint Jest tests passed locally with
npm test -- --runInBand. Those tests do not prove cloud deployment health.
