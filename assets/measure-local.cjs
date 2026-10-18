'use strict';
const fs=require('fs'),http=require('http');
const {performance}=require('perf_hooks');
const app=require('./src/index');
const SHA='4cffb6d08395ebdeb63fd50d90f5786418ef9239';
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const quantile=(a,q)=>a[Math.max(0,Math.ceil(a.length*q)-1)];
(async()=>{
 const server=http.createServer(app);await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port;
 const port=server.address().port;
 try{
  const health=await fetch(url+'/health');if(health.status!==200)throw Error('Health check failed');
  for(let i=0;i<10;i++){const r=await fetch(url+'/');await r.text();}
  const startedUTC=new Date().toISOString(),start=performance.now();
  const durationMs=30000,targetRps=100,maxInflight=20;
  let inflight=0,attempted=0,errors=0,serverErrors=0,ok=0,skippedTicks=0;
  const timings=[];
  const ticker=setInterval(()=>{
   if(performance.now()-start>=durationMs)return;
   if(inflight>=maxInflight){skippedTicks++;return;}
   attempted++;inflight++;
   const t=performance.now();
   fetch(url+'/').then(async r=>{await r.text();if(r.status>=200&&r.status<300)ok++;else errors++;if(r.status>=500)serverErrors++;timings.push(performance.now()-t);}).catch(()=>{errors++;}).finally(()=>{inflight--;});
  },1000/targetRps);
  await delay(durationMs);clearInterval(ticker);while(inflight)await delay(10);
  const elapsedSeconds=(performance.now()-start)/1000,endedUTC=new Date().toISOString();
  timings.sort((a,b)=>a-b);
  fs.writeFileSync('client-latencies.csv','sorted_sample,latency_ms\n'+timings.map((v,i)=>`${i+1},${v}`).join('\n')+'\n');
  const raw=await (await fetch(url+'/metrics')).text();fs.writeFileSync('prometheus-smoke.prom',raw);
  const result={
   label:'Local smoke measurement, not a cloud capacity benchmark',
   repository:'https://github.com/Lokesh0423/secure-gitops-platform',commit_sha:SHA,measured_at:startedUTC,
   environment:{platform:process.platform,node:process.version,execution:'Single Node.js process serving the app and running the load generator on localhost',resource_limits:'Not controlled; no dedicated CPU or memory reservation',transport:'HTTP loopback, no TLS or external network'},
   workload:{route:'/',method:'GET',warmup_requests:10,target_requests_per_second:targetRps,scheduling_interval_ms:10,duration_seconds:30,max_inflight:maxInflight},
   observations:{started_at:startedUTC,ended_at:endedUTC,elapsed_seconds:elapsedSeconds,attempted_requests:attempted,successful_2xx:ok,non_2xx_or_network_errors:errors,server_5xx:serverErrors,skipped_scheduling_ticks:skippedTicks,completed_requests_per_second:(ok+errors)/elapsedSeconds,percentile_method:'nearest rank on sorted completed-request client durations',client_latency_ms:{p50:quantile(timings,.5),p95:quantile(timings,.95),max:timings.at(-1)}},
   limitations:['One short local run; no production reliability, uptime or maximum throughput is established.','Client and server share a process and host; CPU/memory allocation and noise were not controlled.','Client latency percentiles are computed from completed HTTP samples, not a Prometheus query.','This was a success-path smoke test, not a deliberate error, recovery or resilience exercise.','No Prometheus server, Grafana dashboard or Kubernetes cluster was connected; raw /metrics exposition was captured.','No before/after performance improvement is claimed.']
  };
  fs.writeFileSync('local-smoke-results.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1);});
