$pidFile = "c:\Users\hp\Desktop\New folder (13)\dating-app\.runtime\pids.json"

if (-not (Test-Path $pidFile)) {
  Write-Output "No pid file found."
  exit 0
}

$pids = Get-Content $pidFile | ConvertFrom-Json

foreach ($name in "client", "server", "mongo") {
  $pid = $pids.$name
  if ($pid) {
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
  }
}

Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
Write-Output "Stopped local Spark stack."
