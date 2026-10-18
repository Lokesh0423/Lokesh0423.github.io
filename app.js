'use strict';

const GH = 'https://github.com/Lokesh0423/';
const source = (repo, path) => `${GH}${repo}/blob/main/${path}`;
const projects = [
  {
    id:'secure-gitops-platform', number:'01', title:'Secure GitOps platform', category:'PLATFORM ENGINEERING / DEVSECOPS', visual:'gitops',
    description:'Connecting CI checks, declarative delivery and application metrics in one inspectable platform project.',
    tags:['Kubernetes','GitOps','CI/CD','Terraform','Monitoring'], stack:['AKS','Argo CD','Helm','Trivy','Prometheus'],
    outcome:'2 custom metric families · 4 API test cases · source available', evidenceLabel:'Source + historical CI run evidence',
    problem:'How can an application delivery path make security checks, deployment intent and operational signals visible in the same repository?',
    contribution:'I brought together a Node.js service, GitHub Actions, a Helm deployment, an Argo CD Application, Terraform modules and Prometheus configuration as a personal platform project.',
    decisions:[
      'Run lint and Jest tests before the image build and Trivy scan.',
      'Scan HIGH and CRITICAL OS vulnerabilities and upload a SARIF report.',
      'Gate registry push and Helm tag updates on the ACR_CONFIGURED repository variable.',
      'Declare Argo CD automated sync, pruning and self-heal in Git.',
      'Instrument request counts and duration histograms, alongside health and readiness endpoints.'
    ],
    results:[
      'The committed app defines 4 endpoints and 4 API test cases. All 4 endpoint tests passed in a local run on 18 October 2026. It exposes http_requests_total and http_request_duration_seconds with Prometheus client instrumentation.',
      'Four successful historical GitHub Actions runs were observed on 14 August 2026. The latest observed run, 15 September 2026, failed. Run links remain available for inspection.',
      'The repository includes 2 Gatekeeper policy files and 4 Prometheus alert rules. These counts describe the source, not proof of deployed enforcement or live alert delivery.'
    ],
    limits:'This is a personal project, not a claim of production operation. The current Helm chart references helper and companion templates absent from the reviewed tree. The Prometheus file is configuration, not an installable monitoring stack. Grafana dashboards and a working end-to-end AKS deployment were not verified. OS-only Trivy scanning leaves dependency coverage to validate separately.',
    architecture:[
      ['GitHub repository','Application, infrastructure and desired-state configuration live together.'],
      ['GitHub Actions','Lint → test → build → Trivy scan; registry publication is conditional.'],
      ['Helm values + Argo CD','An Application watches main and targets the app-prod namespace; chart completeness remains to validate.'],
      ['AKS workload intent','The deployment specifies probes, resource settings and a non-root security context.'],
      ['Prometheus instrumentation','The app exports counters and histograms; scrape and alert configuration is committed, with no live data claimed.']
    ],
    evidence:[
      ['CI pipeline and registry gate','.github/workflows/ci-cd.yaml'],
      ['Application metric instrumentation','app/src/index.js'],
      ['Four endpoint test cases','app/tests/app.test.js'],
      ['Argo CD sync policy','argocd/application.yaml'],
      ['Prometheus scrape configuration','monitoring/prometheus/prometheus.yaml'],
      ['Prometheus alert rules','monitoring/prometheus/alerts.yaml']
    ],
    extraLinks:[
      ['Successful historical CI run · 14 Aug 2026',`${GH}secure-gitops-platform/actions/runs/31822431826`,'Historical success; cloud delivery may be skipped'],
      ['Latest observed CI run · 15 Sep 2026',`${GH}secure-gitops-platform/actions/runs/34970445290`,'Failed; no current all-green claim']
    ]
  },
  {
    id:'azure-cicd-pipeline', number:'02', title:'From build to registry', category:'CONTINUOUS DELIVERY / AZURE', visual:'cicd',
    description:'A Docker delivery pipeline with real build-and-push screenshots and a separate three-stage deployment definition.',
    tags:['CI/CD','Kubernetes'], stack:['Azure DevOps','Docker','ACR','AKS'],
    outcome:'60-second build stage recorded · registry image tags captured', evidenceLabel:'Source + original pipeline screenshots',
    problem:'Make the path from application code to a versioned container image repeatable, then define how that image should progress through staging and production.',
    contribution:'I configured an Azure DevOps Docker build-and-push pipeline and committed a fuller Build → Staging → Production definition alongside Kubernetes deployment manifests.',
    decisions:[
      'Use the Azure DevOps Build ID as the image tag, alongside latest.',
      'Build a Docker image and push it to Azure Container Registry through an Azure service connection.',
      'Define staging before production, with production restricted to the main branch in the three-stage file.',
      'Include resource requests, limits and /health probes in the Kubernetes deployment.'
    ],
    results:[
      'The original screenshot dated 13 June 2026 shows the Build and Push to ACR stage completed in 1 minute 0 seconds. It is one historical observation, not a benchmark or speed improvement.',
      'A registry screenshot shows the nodejs-cicd-pipeline repository with two tags, latest and 4.',
      'The root pipeline currently defines Build only. The separate .azure-pipelines/azure-pipelines.yml file defines three stages. Screenshots do not establish successful staging or production deployments.'
    ],
    limits:'The multi-stage file still contains environment placeholders and references k8s/service.yaml, which is absent from the reviewed tree. The root build pipeline and deployment definition also use different image names. ACR push evidence is real; a successful AKS promotion is not claimed.',
    architecture:[
      ['Code push','main and develop are declared trigger branches.'],
      ['Build and push','The root pipeline installs dependencies, runs its test command, builds Docker and pushes to ACR.'],
      ['Registry artifacts','Historical screenshots show a completed stage and image tags.'],
      ['Staging intent','The separate three-stage definition applies Kubernetes manifests and waits for rollout; configuration gaps remain.'],
      ['Production intent','The full definition restricts production to main; no successful live promotion was independently verified.']
    ],
    evidence:[['Observed build pipeline','azure-pipelines.yml'],['Three-stage pipeline definition','.azure-pipelines/azure-pipelines.yml'],['Workload probes and resources','k8s/deployment.yaml'],['Original screenshot folder','docs/screenshots/docs/screenshots/README.md']],
    screenshots:[
      ['assets/azure-build-completed.png','Original Azure DevOps screenshot: Build and Push to ACR stage completed in 1m 0s.','Historical build-stage result · 13 June 2026. Not a deployment duration.'],
      ['assets/azure-registry-tags.png','Original Azure Container Registry screenshot showing nodejs-cicd-pipeline image tags latest and 4.','Image artifacts in ACR. Open the image for full resolution.']
    ]
  },
  {
    id:'k8s-helm-charts', number:'03', title:'One chart. Two environments.', category:'KUBERNETES / RELEASE CONFIGURATION', visual:'helm',
    description:'A reusable Helm chart with explicit staging and production values, health probes and resource settings.',
    tags:['Kubernetes'], stack:['Helm','Kubernetes','AKS'],
    outcome:'1 staging replica / 3 production replicas configured in Git', evidenceLabel:'Configuration evidence',
    problem:'Avoid duplicating Kubernetes manifests while keeping environment differences easy to review.',
    contribution:'I structured a Node.js Helm chart around shared templates and separate values files for staging and production, with resource requests and limits defined explicitly.',
    decisions:[
      'Keep Deployment, Service, Ingress, ConfigMap and optional HPA templates in one chart.',
      'Configure one replica and ClusterIP for staging; three replicas and LoadBalancer for production.',
      'Use /health liveness and readiness probes with different startup delays.',
      'Keep autoscaling optional rather than implying it is enabled in every environment.'
    ],
    results:[
      'One chart supplies both staging and production configuration. The committed values set replicaCount to 1 and 3 respectively.',
      'Staging CPU requests/limits are 100m/250m and memory requests/limits are 32Mi/64Mi. Production uses 250m/500m CPU and 64Mi/128Mi memory.',
      'Ingress and HPA templates are present, but their default enablement flags are false. These are configured capacities, not load-test outcomes.'
    ],
    limits:'The environment settings are inspectable in source. No throughput, uptime or successful live rollout is asserted. The related Minikube app currently needs a health-handler fix before runtime readiness can be established.',
    architecture:[['Shared Helm chart','One set of templates defines the Kubernetes resources.'],['Environment override','Staging or production values change replicas, service type and resources.'],['Rendered resources','Deployment, Service and ConfigMap, with optional Ingress and HPA.'],['Runtime verification','Render, lint and validate probes against the actual app before claiming a healthy rollout.']],
    evidence:[['Staging values','environments/staging/values.yaml'],['Production values','environments/production/values.yaml'],['Deployment template','charts/nodejs-app/templates/deployment.yaml'],['Optional autoscaler','charts/nodejs-app/templates/hpa.yaml']], environmentCompare:true
  },
  {
    id:'terraform-azure-infra', number:'04', title:'Infrastructure, expressed in code', category:'INFRASTRUCTURE AS CODE / AZURE', visual:'iac',
    description:'Modular Terraform for an Azure network, AKS cluster and monitoring resources, with dev and prod entry points.',
    tags:['Terraform','Kubernetes','Monitoring'], stack:['Terraform','Azure','AKS','Azure Monitor'],
    outcome:'3 resource modules · separate dev and prod entry points', evidenceLabel:'Configuration evidence',
    problem:'Make infrastructure structure reviewable and reusable instead of relying on portal-only setup.',
    contribution:'I separated networking, Kubernetes and monitoring into Terraform modules, then composed them from environment-level configuration.',
    decisions:[
      'Pass the VNet subnet output into the AKS module.',
      'Use a system-assigned AKS identity and environment tags.',
      'Declare a Log Analytics workspace with 30-day retention, an action group and a CPU alert.',
      'Keep dev and prod entry points so the infrastructure intent can be reviewed per environment.'
    ],
    results:[
      'Three modules are committed: vnet, aks and monitoring.',
      'The monitoring configuration declares 30-day Log Analytics retention and an 80% CPU alert threshold. These are settings, not recorded system performance.',
      'A validation workflow definition exists, but it is nested under environments/.github/workflows rather than the repository-root .github/workflows directory, so automatic execution is not established.'
    ],
    limits:'The alert scope contains a placeholder subscription ID; AKS autoscaling is not enabled in the committed node-pool block. No apply logs, cost savings, provisioning-time reduction or live monitoring results were verified.',
    architecture:[['Environment entry point','Choose dev or prod configuration.'],['VNet module','Declare network and subnet resources.'],['AKS module','Consume the subnet ID and declare the cluster and node pool.'],['Monitoring module','Declare Log Analytics and alerting resources; alert scope needs real resource binding.']],
    evidence:[['Root module composition','main.tf'],['AKS node pool and identity','modules/aks/main.tf'],['Monitoring retention and alert scope','modules/monitoring/main.tf'],['Current workflow location','environments/.github/workflows/terraform-ci.yml']]
  },
  {
    id:'nodejs-k8s-minikube-app', number:'05', title:'The local Kubernetes lab', category:'CONTAINERS / CONFIGURATION / LEARNING', visual:'local',
    description:'A local container lab exploring ConfigMaps, Secret references, probes and a GitHub Actions image-build workflow.',
    tags:['Kubernetes','CI/CD'], stack:['Docker','Minikube','Kubernetes','GitHub Actions'],
    outcome:'Historical image-build runs succeeded · runtime fix outstanding', evidenceLabel:'Source + historical image-build runs',
    problem:'Understand the handoff between a locally built image, Kubernetes runtime configuration and container delivery automation.',
    contribution:'I configured a two-replica deployment with ConfigMap and Secret references, a local-image pull policy and Docker Hub build-and-push automation.',
    decisions:[
      'Inject PORT and APP_ENV from a ConfigMap, and reference API_KEY and DB_PASS through a Kubernetes Secret.',
      'Set imagePullPolicy: Never for the locally loaded Minikube image.',
      'Define CPU/memory requests and limits and /health probes.',
      'Tag the CI-built image with the commit SHA for traceability.'
    ],
    results:[
      'The manifest defines 2 replicas, CPU requests/limits of 100m/250m and memory requests/limits of 64Mi/128Mi.',
      'Six inspected GitHub Actions image-build runs from 12 June 2026 completed successfully. The workflow uses npm test --if-present, so success is not proof that runtime tests were executed.',
      'Source review found server.js calls app.get even though app is not defined. This is a current runtime blocker; a successful application startup is not claimed.'
    ],
    limits:'This learning lab needs the undefined app reference fixed, then actual startup and probe validation. The local Kubernetes manifest and CI-published image use different image references, so automatic deployment from CI is not established.',
    architecture:[['Docker image','Build an image for local Minikube use.'],['Runtime configuration','ConfigMap and Secret references feed environment variables.'],['Kubernetes Deployment','Two replicas, probes and resource boundaries are defined.'],['Separate CI path','GitHub Actions builds and pushes SHA-tagged images; it does not prove a healthy local runtime.']],
    evidence:[['Application runtime source','server.js'],['ConfigMap, Secrets and health probes','kubernetes/deployment.yaml'],['Image build workflow','.github/workflows/ci.yml']],
    extraLinks:[['Historical successful image-build run',`${GH}nodejs-k8s-minikube-app/actions/runs/27421628860`,'12 June 2026 · build success, not runtime validation']]
  },
  {
    id:'aws-web-hosting-labs',number:'06',title:'AWS web hosting, hands-on',category:'AWS / LINUX / TROUBLESHOOTING',visual:'aws',
    description:'EC2 and S3 practice covering Apache hosting, SSH access and static-site object naming problems.',
    tags:['AWS'],stack:['EC2','S3','Linux','Apache','SSH'],outcome:'2 practice labs · user-reported learning evidence', evidenceLabel:'User-reported labs · no linked source repository',
    problem:'Learn the operational steps between creating AWS resources and reaching a working website, including the errors that interrupt that path.',
    contribution:'My recorded practice includes deploying an Apache site on EC2 and working through an S3 static-site setup. I investigated SSH key/path failures and S3 index-object naming issues.',
    decisions:[
      'For EC2 access failures, distinguish an inaccessible local PEM file from a rejected SSH identity.',
      'For S3 NoSuchKey responses, compare the configured index document with the exact uploaded object key.',
      'Recognize that index.html.txt and index.html are different object names.'
    ],
    results:[
      'An EC2 Apache website deployment is recorded in my practice history.',
      'S3 troubleshooting involved a NoSuchKey response and files uploaded with .txt extensions.',
      'These are two self-reported hands-on labs. No public AWS code repository, deployment screenshots, current live endpoint or performance measurements were verified.'
    ],
    limits:'The EC2 and S3 details come from practice history rather than repository evidence. S3 end-to-end success is not asserted. No uptime, CloudWatch monitoring coverage or cost improvements are claimed.',
    architecture:[['EC2 practice path','Local SSH client → EC2 Linux instance → Apache → website.'],['S3 practice path','HTML and asset object keys → configured index document → static website endpoint.'],['Troubleshooting boundary','Check local identity-file access, then remote authentication; compare requested object names with actual keys.']],evidence:[]
  }
];

const layers = {
  source:{kicker:'01 / VERSIONED INTENT',body:'Application code, Helm values and infrastructure definitions are inspectable in the same repository. Git describes the intended system.',path:'README.md'},
  ci:{kicker:'02 / TEST, BUILD, SCAN',body:'GitHub Actions runs lint, tests and a Trivy OS scan. Registry push is conditional; a successful CI run does not automatically mean deployment.',path:'.github/workflows/ci-cd.yaml'},
  delivery:{kicker:'03 / DECLARATIVE DELIVERY',body:'The Argo CD Application watches the Helm path with pruning and self-heal configured. End-to-end delivery still requires chart and cluster validation.',path:'argocd/application.yaml'},
  observe:{kicker:'04 / SIGNALS FROM THE APP',body:'Request counters and latency histograms are instrumented in Node.js. Prometheus configuration and alerts exist; no live telemetry is connected here.',path:'app/src/index.js'}
};

const metrics = [
  {id:'rate',name:'Request rate',unit:'requests / second',status:'INSTRUMENTED IN SOURCE · LOCAL SNAPSHOT AVAILABLE',title:'How much traffic is the app serving?',
    description:'The application counter records requests by method, route and status code. A rate over time turns a cumulative count into traffic per second.',
    query:'sum(rate(http_requests_total{job="secure-gitops-app",route!~"/(metrics|health|ready)"}[5m]))',
    meaning:'Measures application traffic over a 5-minute window. Health checks and the metrics endpoint are excluded so monitoring traffic does not inflate the result.',
    next:'Run the app with a working Prometheus scrape, generate a fixed load for at least 5 minutes, then save the query result with workload, time range and commit SHA.',
    path:'app/src/index.js'},
  {id:'errors',name:'Error rate',unit:'% of requests',status:'INSTRUMENTED IN SOURCE · LOCAL SNAPSHOT AVAILABLE',title:'How much traffic is failing?',
    description:'The status_code label makes HTTP 5xx responses queryable. This is a server-error measure, not a measure of every failed user journey.',
    query:'100 * (sum(rate(http_requests_total{job="secure-gitops-app",route!~"/(metrics|health|ready)",status_code=~"5.."}[5m])) or vector(0))\n/ sum(rate(http_requests_total{job="secure-gitops-app",route!~"/(metrics|health|ready)"}[5m]))',
    meaning:'Divides the 5xx request rate by the total request rate. Evaluate only when traffic exists; no data or no traffic must not be reported as healthy.',
    next:'In a controlled local lab, exercise success and deliberate failure paths. Capture both windows with the same traffic profile. The current sample app needs a controlled 5xx path for this test.',
    path:'app/src/index.js'},
  {id:'latency',name:'p95 latency',unit:'seconds',status:'HISTOGRAM IN SOURCE · LOCAL CLIENT TIMING AVAILABLE',title:'How slow are the slower requests?',
    description:'The app defines http_request_duration_seconds as a histogram. Its buckets can estimate the 95th percentile rather than hiding slower requests in an average.',
    query:'histogram_quantile(0.95,\n  sum by (le) (rate(http_request_duration_seconds_bucket{job="secure-gitops-app",route!~"/(metrics|health|ready)"}[5m]))\n)',
    meaning:'Estimates the latency below which 95% of requests fall. Precision depends on the configured buckets; no samples means there is no meaningful percentile.',
    next:'Record a baseline under a fixed request rate and duration. Make one change, repeat the same load, and retain both query exports before claiming a latency improvement.',
    path:'app/src/index.js'},
  {id:'cpu',name:'Container CPU',unit:'CPU cores',status:'COLLECTOR REQUIRED · NOT MEASURED LIVE',title:'How much CPU is the workload consuming?',
    description:'Kubernetes resource requests and limits are configuration. Actual CPU consumption needs container telemetry, such as a working kubelet/cAdvisor scrape.',
    query:'sum(rate(container_cpu_usage_seconds_total{namespace="app-prod",container!="",container!="POD"}[5m]))',
    meaning:'This example sums CPU usage across application-namespace containers in cores. Compare actual use with requests and limits; a configured 500m limit is not a measured CPU result.',
    next:'Connect and validate the container metrics collector first. Record idle and fixed-load windows, identify the pod/container labels, and capture throttling separately if investigating CPU pressure.',
    path:'helm/charts/app/values.yaml'},
  {id:'memory',name:'Container memory',unit:'MiB',status:'COLLECTOR REQUIRED · NOT MEASURED LIVE',title:'How much memory is the workload using?',
    description:'Resource limits define a boundary. Working-set telemetry shows observed container memory use and helps investigate memory pressure.',
    query:'sum(container_memory_working_set_bytes{namespace="app-prod",container!="",container!="POD"}) / 1024 / 1024',
    meaning:'This example reports working-set memory across the namespace in MiB. Inspect individual containers and restart/OOM events before drawing conclusions from an aggregate.',
    next:'Validate kubelet/cAdvisor collection. Capture memory over a sustained, documented load test, alongside pod restarts and resource limits. Preserve the time series, not only one peak screenshot.',
    path:'helm/charts/app/values.yaml'},
  {id:'pipeline',name:'Pipeline duration',unit:'60 s recorded',status:'HISTORICAL SCREENSHOT · 13 JUN 2026',title:'One real timing. A clear boundary.',
    description:'The Azure DevOps screenshot records a completed Build and Push to ACR stage in 1 minute 0 seconds. It is the current timing evidence available in the repository.',
    query:'stage_duration_seconds = stage_completed_at - stage_started_at\n\nObserved stage: Build and Push to ACR\nRecorded duration: 60 seconds\nEvidence date: 13 June 2026',
    meaning:'This is a single build-stage observation. It does not measure application deployment, recovery time or a before/after performance improvement.',
    next:'Record several comparable runs with the same commit, runner, cache state and inputs. Keep all run links and report the median. Measure deployment start to rollout completion separately.',
    path:'azure-pipelines.yml',repo:'azure-cicd-pipeline',screenshot:true}
];

const fixes = [
  {category:'SECURITY SCANNING',title:'When the dependency scanner crashed',symptom:'The project documentation records a Trivy node-pkg analyzer crash in the CI environment.',change:'The committed scan is scoped to OS vulnerabilities with vuln-type: os, while still failing on HIGH and CRITICAL findings.',boundary:'This is a practical scanner workaround. Node dependency scanning is not established by this workflow and must be verified separately.',path:'.github/workflows/ci-cd.yaml'},
  {category:'APPLICATION TESTS',title:'When Jest would not exit cleanly',symptom:'The portfolio notes record a test-server hang caused by starting a listener when importing the app.',change:'The app is exported for testing, while app.listen runs only inside a require.main === module guard.',boundary:'All four endpoint tests passed locally on 18 October 2026. The source shows the guard; this local check does not establish cloud availability.',path:'app/src/index.js'},
  {category:'CI PERMISSIONS',title:'Making the security report inspectable',symptom:'The recorded pipeline troubleshooting included SARIF output and workflow permission corrections.',change:'The scan writes trivy-results.sarif; the build job declares security-events: write, and the upload step uses if: always().',boundary:'The configuration supports report upload. A failed scanner that produces no file can still leave the upload without an artifact; current dashboard ingestion is not claimed.',path:'.github/workflows/ci-cd.yaml'},
  {category:'DELIVERY GUARDRAILS',title:'Decoupling CI from registry availability',symptom:'Registry publishing should not be attempted when the ACR environment has not been configured.',change:'ACR login, image push and Helm tag updates are conditional on main and ACR_CONFIGURED == true.',boundary:'CI can succeed while registry push and deployment-related changes are skipped. That distinction matters when presenting results.',path:'.github/workflows/ci-cd.yaml'}
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ext = 'target="_blank" rel="noopener noreferrer"';
let activeFilter='All', searchTerm='', selectedMetric='rate', activeProject=null, lastFocus=null, activeCaseTab='overview';

function setLayer(id){
  const layer=layers[id];
  if(!layer)return;
  $$('.flow-node').forEach(button=>{button.classList.toggle('active',button.dataset.layer===id);button.setAttribute('aria-pressed',String(button.dataset.layer===id));});
  $('#layer-detail').innerHTML=`<p class="layer-kicker">${layer.kicker}</p><p>${layer.body}</p><a href="${source('secure-gitops-platform',layer.path)}" ${ext}>${esc(layer.path)} <span aria-hidden="true">↗</span></a>`;
}

function projectVisual(p){
  const status=p.visual==='cicd'?'Historical evidence':p.visual==='aws'?'Practice history':'Source walkthrough';
  let graphic='';
  if(p.visual==='gitops')graphic='<div class="platform-map"><div class="platform-node"><span>01 / SOURCE</span><b>{ git }</b><small>Versioned configuration</small></div><div class="platform-node"><span>02 / VALIDATE</span><b>[ CI + Trivy ]</b><small>Test and image scan</small></div><div class="platform-node"><span>04 / OBSERVE</span><b>/metrics</b><small>Prometheus instrumentation</small></div><div class="platform-node"><span>03 / RECONCILE</span><b>&lt; Argo CD &gt;</b><small>Helm desired state</small></div></div>';
  if(p.visual==='cicd')graphic='<div class="pipeline-proof"><img src="assets/azure-build-completed.png" alt="" width="500" height="400"><div><span class="proof-label">ORIGINAL RUN EVIDENCE</span><b>Build. Push. Recorded.</b><small>Azure DevOps · 13 Jun 2026</small><span class="proof-timing">1m 0s <i>build stage</i></span></div></div>';
  if(p.visual==='helm')graphic='<span class="mini-node">Shared chart</span><span>→</span><span class="mini-node">staging · 1</span><span>/</span><span class="mini-node">prod · 3</span>';
  if(p.visual==='iac')graphic='<span class="mini-node">VNet</span><span>+</span><span class="mini-node">AKS</span><span>+</span><span class="mini-node">Monitor</span>';
  if(p.visual==='local')graphic='<span class="mini-node">Docker</span><span>→</span><span class="mini-node">Minikube</span><span>←</span><span class="mini-node">Config</span>';
  if(p.visual==='aws')graphic='<span class="mini-node">EC2 + Apache</span><span>/</span><span class="mini-node">S3 static site</span>';
  const caption={gitops:'DECLARATIVE DELIVERY / APPLICATION SIGNALS',cicd:'ORIGINAL SCREENSHOTS INSIDE THE CASE STUDY',helm:'CONFIGURATION VALUES, NOT LOAD-TEST RESULTS',iac:'THREE MODULES / TWO ENVIRONMENT ENTRY POINTS',local:'IMAGE-BUILD EVIDENCE / RUNTIME VALIDATION PENDING',aws:'TWO LABS / SSH & OBJECT-KEY TROUBLESHOOTING'}[p.visual];
  return `<div class="project-visual visual-${p.visual}" aria-hidden="true"><div class="visual-top"><span>PROJECT / ${p.number}</span><span class="visual-status"><i></i>${status}</span></div><div class="diagram-mini">${graphic}</div><span class="visual-caption">${caption}</span></div>`;
}

function renderFilters(){
  const filters=['All','Kubernetes','CI/CD','GitOps','Terraform','AWS','Monitoring'];
  $('#project-filters').innerHTML=filters.map(name=>`<button class="filter ${name===activeFilter?'active':''}" data-filter="${name}" aria-pressed="${name===activeFilter}">${name}<sup>${name==='All'?projects.length:projects.filter(p=>p.tags.includes(name)).length}</sup></button>`).join('');
}

function renderProjects(){
  const selected=projects.filter(p=>(activeFilter==='All'||p.tags.includes(activeFilter))&&`${p.title} ${p.description} ${p.stack.join(' ')} ${p.tags.join(' ')}`.toLowerCase().includes(searchTerm));
  $('#project-count').textContent=`${selected.length} of ${projects.length} case studies${activeFilter==='All'?'':` · ${activeFilter}`}`;
  $('#empty-state').hidden=selected.length>0;
  $('#project-grid').innerHTML=selected.map(p=>`<article class="project-card ${p.id==='secure-gitops-platform'?'featured':''}">${projectVisual(p)}<div class="project-body"><p class="card-category">${p.category}</p><h3>${p.title}</h3><p class="project-description">${p.description}</p><div class="tags">${p.stack.map(t=>`<span class="tag">${t}</span>`).join('')}</div><p class="card-outcome">${p.outcome}</p><div class="card-bottom"><button class="case-link" data-open="${p.id}" aria-label="Read case study: ${p.title}">Explore case study <span aria-hidden="true">↗</span></button>${p.id==='aws-web-hosting-labs'?'<span class="source-link">Practice notes</span>':`<a class="source-link" href="${GH+p.id}" ${ext} aria-label="Source repository: ${p.title}">Source ↗</a>`}</div></div></article>`).join('');
}

function renderMetric(id){
  selectedMetric=id;
  const m=metrics.find(x=>x.id===id);
  $('#metric-select').innerHTML=metrics.map(x=>`<button data-metric="${x.id}" class="${x.id===id?'active':''}" aria-pressed="${x.id===id}"><span>${x.name}</span><span aria-hidden="true">${x.id===id?'↗':'→'}</span></button>`).join('');
  $('#metric-content').innerHTML=`<p class="metric-status">${m.status}</p><div class="metric-header"><h3>${m.title}</h3><span>${m.unit}</span></div><p>${m.description}</p><pre class="code-block"><code>${esc(m.query)}</code></pre><div class="metric-details"><div><h4>WHAT IT TELLS US</h4><p>${m.meaning}</p></div><div><h4>NEXT HANDS-ON MEASUREMENT</h4><p>${m.next}</p></div></div><div class="metric-source"><a href="${source(m.repo||'secure-gitops-platform',m.path)}" ${ext}>Inspect source ↗</a>${m.screenshot?'<a href="assets/azure-build-completed.png" target="_blank" rel="noopener noreferrer">View original timing evidence ↗</a>':'<a href="https://prometheus.io/docs/practices/histograms/" target="_blank" rel="noopener noreferrer">Prometheus measurement reference ↗</a>'}<a href="assets/measurement-protocol.md" download>Hands-on measurement checklist ↓</a></div>`;
}

function renderFixes(){
  $('#fix-list').innerHTML=fixes.map(f=>`<details class="fix"><summary><span class="fix-category">${f.category}</span><h3>${f.title}</h3><span class="expand" aria-hidden="true">+</span></summary><div class="fix-content"><p><strong>The symptom.</strong> ${f.symptom}</p><p><strong>The change.</strong> ${f.change}</p><p><strong>The boundary.</strong> ${f.boundary}</p><a href="${source('secure-gitops-platform',f.path)}" ${ext}>Inspect the relevant source ↗</a></div></details>`).join('');
}

const dialog=$('#case-dialog');

function setCaseTab(tab){
  activeCaseTab=tab;
  $$('.case-tab').forEach(button=>{const selected=button.dataset.tab===tab;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});
  const p=activeProject;
  const panel=$('#case-panel');
  panel.setAttribute('aria-labelledby',`case-tab-${tab}`);
  if(tab==='overview')panel.innerHTML=`<div class="case-columns"><div><h3>The problem</h3><p>${p.problem}</p><h4>My contribution</h4><p>${p.contribution}</p></div><div><h3>Engineering choices</h3><ul>${p.decisions.map(d=>`<li>${d}</li>`).join('')}</ul></div></div><div class="results"><h3>Results I can point to</h3>${p.results.map(r=>`<p>${r}</p>`).join('')}</div><div class="scope-note"><p><strong>Scope & validation boundary.</strong> ${p.limits}</p></div>`;
  if(tab==='architecture')panel.innerHTML=`<h3>Follow the system</h3><p class="arch-note">A walkthrough of the committed design. This diagram does not indicate a live deployment.</p>${p.environmentCompare?'<div class="env-switch" role="group" aria-label="Compare environment configuration"><button class="active" data-env="staging" aria-pressed="true">Staging</button><button data-env="production" aria-pressed="false">Production</button></div><div id="env-values" class="env-values" aria-live="polite"></div>':''}<div class="arch-path">${p.architecture.map((n,i)=>`<div class="arch-node"><span>0${i+1}</span><div><h4>${n[0]}</h4><p>${n[1]}</p></div></div>`).join('')}</div><div class="scope-note"><p><strong>What remains to validate.</strong> ${p.limits}</p></div>`;
  if(tab==='evidence')panel.innerHTML=`<h3>Go straight to the evidence</h3><p>${p.id==='aws-web-hosting-labs'?'These labs are based on my recorded AWS practice. No public source repository or current runtime proof was verified.':'Source links open the repository’s main branch. Historical run links and screenshots are dated observations; current code and current runtime health can differ.'}</p><div class="evidence-list">${p.evidence.map(e=>`<a class="evidence-item" href="${source(p.id,e[1])}" ${ext}><div><strong>${e[0]}</strong><small>${esc(e[1])}</small></div><span aria-hidden="true">↗</span></a>`).join('')}${(p.extraLinks||[]).map(e=>`<a class="evidence-item" href="${e[1]}" ${ext}><div><strong>${e[0]}</strong><small>${e[2]}</small></div><span aria-hidden="true">↗</span></a>`).join('')}</div>${p.screenshots?`<div class="case-screenshots">${p.screenshots.map(s=>`<figure><a href="${s[0]}" ${ext}><img src="${s[0]}" alt="${s[1]}" loading="lazy" width="500" height="300"></a><figcaption>${s[2]}</figcaption></figure>`).join('')}</div>`:''}<div class="scope-note"><p><strong>Evidence reviewed:</strong> 18 October 2026. All case studies describe personal projects or labs. No client production metrics, uptime guarantees or unverified improvement percentages are claimed.</p></div>`;
  if(p.environmentCompare&&tab==='architecture')setEnvironment('staging');
}

function setEnvironment(name){
  const v=name==='staging'?{replicas:'1',service:'ClusterIP',cpu:'100m / 250m',memory:'32Mi / 64Mi'}:{replicas:'3',service:'LoadBalancer',cpu:'250m / 500m',memory:'64Mi / 128Mi'};
  $$('[data-env]').forEach(b=>{const on=b.dataset.env===name;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
  $('#env-values').innerHTML=`<div><small>Replicas</small><b>${v.replicas}</b><span>${v.service}</span></div><div><small>CPU</small><b>${v.cpu}</b><span>request / limit</span></div><div><small>Memory</small><b>${v.memory}</b><span>request / limit</span></div>`;
}

function openCase(id,updateURL=true){
  const p=projects.find(x=>x.id===id);if(!p)return;
  if(!dialog.open)lastFocus=document.activeElement;
  activeProject=p;
  $('#case-content').innerHTML=`<div class="case-header"><p class="eyebrow">PROJECT ${p.number} / ${p.category}</p><h2 id="case-title">${p.title}</h2><p>${p.description}</p><div class="tags">${p.stack.map(t=>`<span class="tag">${t}</span>`).join('')}</div></div><div class="case-meta">${p.id==='aws-web-hosting-labs'?`<a class="btn btn-dark" href="${GH}" ${ext}>GitHub profile ↗</a>`:`<a class="btn btn-dark" href="${GH+p.id}" ${ext}>View source repository ↗</a>`}<span class="evidence-label">${p.evidenceLabel}</span><button class="btn btn-outline" id="copy-case">Copy case-study link ⧉</button><span id="case-copy-status" role="status"></span></div><div class="case-tabs" role="tablist" aria-label="Case study sections">${['overview','architecture','evidence'].map(t=>`<button class="case-tab" role="tab" id="case-tab-${t}" aria-controls="case-panel" aria-selected="${t==='overview'}" data-tab="${t}">${t.charAt(0).toUpperCase()+t.slice(1)}</button>`).join('')}</div><div id="case-panel" class="case-panel" role="tabpanel" tabindex="0"></div>`;
  setCaseTab('overview');
  if(!dialog.open)dialog.showModal();
  dialog.scrollTop=0;
  $('#close-case').focus({preventScroll:true});
  if(updateURL&&location.hash!==`#project/${id}`)history.pushState({project:id},'',`#project/${id}`);
}

function closeCase(updateURL=true){
  if(!dialog.open)return;
  dialog.close();
  if(updateURL&&location.hash.startsWith('#project/'))history.replaceState(null,'','#work');
  activeProject=null;
  if(lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});
}

function syncRoute(){
  const match=location.hash.match(/^#project\/([a-z0-9-]+)$/);
  if(match)openCase(match[1],false);else if(dialog.open)closeCase(false);
}

async function copyText(text,statusElement,success){
  try{await navigator.clipboard.writeText(text);statusElement.textContent=success;}
  catch{statusElement.textContent=text;}
}

document.addEventListener('click',event=>{
  const open=event.target.closest('[data-open]');if(open){openCase(open.dataset.open);return;}
  const layer=event.target.closest('[data-layer]');if(layer){setLayer(layer.dataset.layer);return;}
  const filter=event.target.closest('[data-filter]');if(filter){activeFilter=filter.dataset.filter;renderFilters();renderProjects();$(`[data-filter="${activeFilter}"]`).focus({preventScroll:true});return;}
  const metric=event.target.closest('[data-metric]');if(metric){renderMetric(metric.dataset.metric);$(`[data-metric="${selectedMetric}"]`).focus({preventScroll:true});return;}
  const tab=event.target.closest('[data-tab]');if(tab){setCaseTab(tab.dataset.tab);tab.focus({preventScroll:true});return;}
  const env=event.target.closest('[data-env]');if(env){setEnvironment(env.dataset.env);return;}
  if(event.target.closest('#close-case')){closeCase();return;}
  if(event.target.closest('#copy-case')){copyText(`${location.origin}${location.pathname}#project/${activeProject.id}`,$('#case-copy-status'),'Link copied');return;}
  if(event.target.closest('#copy-email')){copyText('lokeshkumargaddala0423@gmail.com',$('#copy-status'),'Email address copied');return;}
  if(event.target.closest('#reset-filters')){activeFilter='All';searchTerm='';$('#project-search').value='';renderFilters();renderProjects();return;}
});
$('#project-search').addEventListener('input',event=>{searchTerm=event.target.value.trim().toLowerCase();renderProjects();});
dialog.addEventListener('cancel',event=>{event.preventDefault();closeCase();});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeCase();}});
dialog.addEventListener('keydown',event=>{
  const tab=event.target.closest('[role="tab"]');if(!tab||!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
  event.preventDefault();const tabs=$$('.case-tab');let i=tabs.indexOf(tab);i=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setCaseTab(tabs[i].dataset.tab);tabs[i].focus();
});
$('.menu-toggle').addEventListener('click',()=>{const button=$('.menu-toggle');const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));button.setAttribute('aria-label',expanded?'Open navigation':'Close navigation');button.textContent=expanded?'☰':'×';$('#mobile-nav').hidden=expanded;});
$('#mobile-nav').addEventListener('click',event=>{if(event.target.closest('a')){$('#mobile-nav').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Open navigation');$('.menu-toggle').textContent='☰';}});
window.addEventListener('hashchange',syncRoute);
window.addEventListener('popstate',syncRoute);
const localMeasurement = {"label":"Local smoke measurement, not a cloud capacity benchmark","repository":"https://github.com/Lokesh0423/secure-gitops-platform","commit_sha":"4cffb6d08395ebdeb63fd50d90f5786418ef9239","measured_at":"2026-10-18T10:30:16.763Z","environment":{"platform":"linux","node":"v24.19.0","execution":"Single Node.js process serving the app and running the load generator on localhost","resource_limits":"Not controlled; no dedicated CPU or memory reservation","transport":"HTTP loopback, no TLS or external network"},"workload":{"route":"/","method":"GET","warmup_requests":10,"target_requests_per_second":100,"scheduling_interval_ms":10,"duration_seconds":30,"max_inflight":20},"observations":{"started_at":"2026-10-18T10:30:16.763Z","ended_at":"2026-10-18T10:30:46.763Z","elapsed_seconds":30.00064924,"attempted_requests":2924,"successful_2xx":2924,"non_2xx_or_network_errors":0,"server_5xx":0,"skipped_scheduling_ticks":0,"completed_requests_per_second":97.4645574036917,"percentile_method":"nearest rank on sorted completed-request client durations","client_latency_ms":{"p50":1.5832960000007006,"p95":2.304575999998633,"max":76.11950499999875}},"limitations":["One short local run; no production reliability, uptime or maximum throughput is established.","Client and server share a process and host; CPU/memory allocation and noise were not controlled.","Client latency percentiles are computed from completed HTTP samples, not a Prometheus query.","This was a success-path smoke test, not a deliberate error, recovery or resilience exercise.","No Prometheus server, Grafana dashboard or Kubernetes cluster was connected; raw /metrics exposition was captured.","No before/after performance improvement is claimed."]};

const localObservations=localMeasurement.observations;
projects[0].outcome='Historical Jest hang reproduced · original fix verified locally';
projects[0].results.unshift(`During portfolio verification on 18 October 2026, a 30-second localhost smoke run completed ${localObservations.successful_2xx.toLocaleString('en-US')} successful GET / requests with ${localObservations.non_2xx_or_network_errors} observed request errors. The measured client p95 was ${localObservations.client_latency_ms.p95.toFixed(2)} ms. This is a short local check, not a cloud performance or uptime claim.`);
projects[0].extraLinks.push(['Recorded local smoke measurement · 18 Oct 2026','assets/local-smoke-results.json','Commit, workload, observed results and limitations'],['Raw completed-request latency samples','assets/client-latencies.csv','Sorted client durations in milliseconds'],['Raw Prometheus endpoint output','assets/prometheus-smoke.prom','Exposition capture; no Prometheus server was connected'],['Reproduce the local smoke measurement','assets/measure-local.cjs','Run with the pinned app source and dependencies'],['Local endpoint test results','assets/endpoint-test-results.json','4 / 4 passed at the pinned source commit']);
function renderLocalMeasurement(){
 const o=localObservations;
 $('#local-measurement').innerHTML=`<div class="local-measurement-top"><p class="eyebrow"><span class="dot"></span>RECORDED LOCAL CHECK · 18 OCT 2026</p><a href="${GH}secure-gitops-platform/tree/${localMeasurement.commit_sha}/app" ${ext}>Source commit ${localMeasurement.commit_sha.slice(0,7)} ↗</a></div><h3>Supporting check: HTTP requests on localhost.</h3><div class="measurement-values"><div><b>${o.attempted_requests.toLocaleString('en-US')}</b><span>requests in a 30-second run</span></div><div><b>${o.completed_requests_per_second.toFixed(1)} / s</b><span>observed completed request rate</span></div><div><b>${o.client_latency_ms.p95.toFixed(2)} ms</b><span>p95 client latency · localhost</span></div><div><b>${o.non_2xx_or_network_errors}</b><span>HTTP failures in this success-path run</span></div></div><p>Captured during portfolio verification, using the actual app at a pinned commit. Target: 100 requests/second after 10 warm-up requests. Linux · Node ${localMeasurement.environment.node} · HTTP loopback · client and server in one process. All four endpoint tests also passed locally.</p><p><strong>Scope:</strong> one short success-path smoke test with uncontrolled host resources. This does not establish production availability, maximum capacity, cloud latency or a performance improvement. The p95 value comes from client timing samples; Prometheus exposition was captured separately.</p><div class="measurement-links"><a href="assets/local-smoke-results.json" ${ext}>Full results ↗</a><a href="assets/client-latencies.csv" download>Latency samples ↓</a><a href="assets/prometheus-smoke.prom" download>Prometheus output ↓</a><a href="assets/measure-local.cjs" download>Reproduction script ↓</a></div>`;
}

projects[0].results.unshift('A local reproduction on 18 October 2026 compared the historical app before and after commit c6c9e9d. Both revisions passed all four endpoint tests. Before the fix, Jest reported TCPSERVERWRAP and the process remained open until an 8-second harness timeout. After the fix, the same test command exited with code 0 and no open-handle warning. This confirms the import-side-effect fix locally; it is not a production recovery measurement.');
projects[0].extraLinks.push(['Original Jest listener fix commit','https://github.com/Lokesh0423/secure-gitops-platform/commit/c6c9e9db63c516a7d2c2b2709925257eff496fd7','Exact historical source change'],['Before-fix local test output','assets/jest-before.txt','Four tests pass; TCP listener keeps the process open'],['After-fix local test output','assets/jest-after.txt','Four tests pass; clean exit with code 0'],['Historical bug reproduction record','assets/jest-reproduction.json','Pinned before/after revisions and validation limits']);


renderFilters();renderProjects();renderMetric('rate');renderFixes();setLayer('source');syncRoute();
renderLocalMeasurement();
// Pointer lighting is decorative and never represents live system status.
const blueprintPanel=document.querySelector('.blueprint');
if(blueprintPanel&&window.matchMedia&&window.matchMedia('(pointer:fine)').matches){
 blueprintPanel.addEventListener('pointermove',event=>{const r=blueprintPanel.getBoundingClientRect();blueprintPanel.style.setProperty('--pointer-x',`${event.clientX-r.left}px`);blueprintPanel.style.setProperty('--pointer-y',`${event.clientY-r.top}px`);});
}
const progressBar=document.querySelector('#scroll-progress');
function updateScrollProgress(){if(!progressBar)return;const max=document.documentElement.scrollHeight-window.innerHeight;progressBar.style.transform=`scaleX(${max>0?window.scrollY/max:0})`;}
window.addEventListener('scroll',updateScrollProgress,{passive:true});updateScrollProgress();

