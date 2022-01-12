# bdjuno-healthcheck-scheduler
![image](https://user-images.githubusercontent.com/93503020/149148146-a02a132a-09dc-4d24-9205-153664584d90.png)
### Instruction
BDJuno allows users to use data according to their purpose by parsing data saved on the chain.
Parsed data is saved on Postgresql(database) and through GraphQL users can inquire data to use them in a manner that suits their purpose.
However, we've come across some problems on BDJuno and in order to solve this, this application monitors BDJuno using two different methods.

The two different methods are as follows.

1. We inquire the height and check the change in height of the most recent block saved on the DB using GraphQL API.
2. Then we check whether the BDJuno process is working.

If any error occurs, that error is reported to the Telegram of the dev team and immediately restarts the service using REST API.

### How to Install & run
1. Node Installation
```bash
Node version must be higher than 14.18.3.
```

2. Setting configuration
```bash
cp config.json.sample config.json 
vim config.json
```
```bash
{
  "HASURA_ADMIN_SECRET": "Your_hasura_admin_secret_key",
  "GRAPHQL_URL": "hasura_install_address:8080/v1/graphql",
  "TOKEN": "numbering:telegram_key_string",
  "CHAT_ID": "chat_bot_numbering_id"
}
```

3. Register BDJuno service
```bash
$ sudo tee /etc/systemd/system/bdjuno.service > /dev/null <<EOF
[Unit]
Description=BDJuno parser
After=network-online.target

[Service]
User=firma
ExecReload=pkill '/usr/local/bin/bdjuno parse' & /usr/local/bin/bdjuno parse
ExecStart=/usr/local/bin/bdjuno parse
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

4. Start
```bash
node app.js
```

### REST API
It is an API that can check the status of the application and start or stop scheduling to monitor BDJuno.
#### 1. Health Check
```bash
"/health"
```
##### Method
```bash
curl -X GET http://localhost:4000/health
```
##### Return Type
```bash
"healthcheck"
```

#### 2. Schedule
```bash
# Hasura
"/hasura/schedule/start"
"/hasura/schedule/stop"
# Bash
"/bash/schedule/start"
"/bash/schedule/stop"
# Service
"/bash/service/restart"
```
##### Method
```bash
curl -X GET http://localhost:4000/hasura/schedule/start
```
##### Return Type
```bash
{
  code: 200 or 201,
  type: "hasura" or "bash" or "service",
  message: string
}
```
