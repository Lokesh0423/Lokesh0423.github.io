# Reproduce the historical Jest listener fix

This is a local comparison of historical source, not the original CI logs.

Repository: https://github.com/Lokesh0423/secure-gitops-platform
Before app revision: df1bf436786d95c7a895cecd33164d176e683d67
Fixed app revision: c6c9e9db63c516a7d2c2b2709925257eff496fd7

1. Use isolated copies of `app/` at the two revisions. Install the same dependency versions in both copies. The portfolio verification reused the installed dependencies from its existing local application test environment.
2. In each app directory, run:

```sh
PORT=0 node node_modules/jest/bin/jest.js --runInBand --detectOpenHandles --no-coverage
```

3. Before the fix, all four endpoint tests pass, but Jest reports a TCPSERVERWRAP handle at app.listen. The verification harness terminates the process after an eight-second timeout.
4. After the fix, all four endpoint tests pass and the process exits normally with code 0.

The eight-second timeout is a harness setting, not an application recovery measurement. The comparison does not establish production availability, cloud latency or any percentage performance gain. The September Trivy scan failure is a separate unresolved issue.
