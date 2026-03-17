$root = "c:\Users\hp\Desktop\New folder (13)\dating-app"
$runtime = Join-Path $root ".runtime"
$logs = Join-Path $runtime "logs"
$mongoData = Join-Path $runtime "mongo-data"
$pidFile = Join-Path $runtime "pids.json"

New-Item -ItemType Directory -Force $logs, $mongoData | Out-Null

$mongoLog = Join-Path $logs "mongod.log"
$serverOut = Join-Path $logs "server.out.log"
$serverErr = Join-Path $logs "server.err.log"
$clientOut = Join-Path $logs "client.out.log"
$clientErr = Join-Path $logs "client.err.log"

$mongoScript = Join-Path $root "scripts\start-local-mongo.ps1"

$mongo = Start-Process powershell `
  -WorkingDirectory $root `
  -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $mongoScript `
  -RedirectStandardOutput $mongoLog `
  -RedirectStandardError $mongoLog `
  -WindowStyle Hidden `
  -PassThru

$mongoUp = $false
for ($i = 0; $i -lt 20; $i++) {
  Start-Sleep -Seconds 1
  if ((Test-NetConnection -ComputerName 127.0.0.1 -Port 27017).TcpTestSucceeded) {
    $mongoUp = $true
    break
  }
}

if (-not $mongoUp) {
  Write-Error "MongoDB failed to start on 127.0.0.1:27017"
  exit 1
}

$server = Start-Process powershell `
  -WorkingDirectory (Join-Path $root "server") `
  -ArgumentList "-NoProfile", "-Command", "node src/server.js" `
  -RedirectStandardOutput $serverOut `
  -RedirectStandardError $serverErr `
  -WindowStyle Hidden `
  -PassThru

$client = Start-Process powershell `
  -WorkingDirectory (Join-Path $root "client") `
  -ArgumentList "-NoProfile", "-Command", "npm.cmd run dev -- --host 127.0.0.1 --port 5173" `
  -RedirectStandardOutput $clientOut `
  -RedirectStandardError $clientErr `
  -WindowStyle Hidden `
  -PassThru

$pids = @{
  mongo = $mongo.Id
  server = $server.Id
  client = $client.Id
}

$pids | ConvertTo-Json | Set-Content $pidFile

Write-Output "Mongo PID: $($mongo.Id)"
Write-Output "Server PID: $($server.Id)"
Write-Output "Client PID: $($client.Id)"
Write-Output "Logs: $logs"
Write-Output "App URL: http://127.0.0.1:5173"
