# Configs
welp 🈵
## NPM ⚙️
```bash
npm i
npm update
npm outdated
npm i package@latest && npm run dev
```


## NGROK 🔗
### Chocolatey 🪟
```bash
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
#### check for installation
```bash
choco
```
#### Choco installation
```bash
choco install ngrok
ngrok config add-authtoken xxx
```

### Local Installation
#### download and unzip to folder ~/ngrok
www.ngrok.com

``` bash
# run first time
./ngrok config add-authtoken <authtoken>
```
<h5>Share Access to Local Web Server:</h5>

``` bash
./ngrok <protocol> <port>

# eg

/ngrok http 3000
```

### free version should return something like

``` bash
Session Status                online

Account                       example@gmail.com (Plan: Free)
Version                       3.4.0
Region                        region (re)
Latency                       50ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://xxxx-xx-xx-xx-xxx.ngrok-free.app -> http://localhost:3000  
```
