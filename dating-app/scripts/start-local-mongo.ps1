$mongoExe = "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
$dbPath = "c:\Users\hp\Desktop\New folder (13)\dating-app\.runtime\mongo-data"
$logPath = "c:\Users\hp\Desktop\New folder (13)\dating-app\.runtime\logs\mongod.log"

& $mongoExe --dbpath $dbPath --bind_ip 127.0.0.1 --port 27017 --logpath $logPath
