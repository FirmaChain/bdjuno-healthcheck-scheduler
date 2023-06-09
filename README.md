# bdjuno-healthcheck-scheduler
![image](https://user-images.githubusercontent.com/93503020/149148146-a02a132a-09dc-4d24-9205-153664584d90.png)

<br/>

## Instruction
BDJuno allows users to use data according to their purpose by parsing data saved on the chain. Parsed data is saved on Postgresql(database) and through GraphQL users can inquire data to use them in a manner that suits their purpose. However, we've come across some problems on BDJuno and in order to solve this, this application monitors BDJuno.

<br/>

**Monitoring methods are as follows.**
- We inquire the height and check the change in height of the most recent block saved on the DB using GraphQL API.

<br/>

If any error occurs, that error is reported to the Telegram of the dev team and immediately restarts the service using **TELEGRAM COMMAND**.

<br/>

## How to install & set config
### 1. Node Installation
```bash
Node version must be higher than 16.19.0
```

<br/>

### 2. .env.production
The **.env.production** file configures your application's environment.

<br/>

Prepare the file first.
```bash
cp .env.sample .env.production
vim .env.production
```

<br/>

Configure the environment after checking the description of each environment variable.
```bash
PORT=4000
: Application Port

HASURA_ADMIN_SECRET=myhasuraKey%%
: Your_hasura_admin_secret_key

GRAPH_QL_URL=hasura_address:8080/v1/graphql
: url address of graph ql to request height

INTERVAL_SECONDS=300  (5 minutes)
: How often to check the height (seconds)

WARNING_STACK=5
: Warning Maximum Number

QUEUE_FILE_NAME=heightQueue.txt
: If there is no change in height, save it to the queue and send the stored height as an alert.

HEALTH_BOT_TOKEN=numbering:telegram_key_string
: Tokens in the health check bot

HEALTH_BOT_CHATID=chat_bot_numbering_id
: The ID of the Telegram chat room

NOTIFICATION_BOT_TOKEN=numbering:telegram_key_string
: Tokens in the notification bot

NOTIFICATION_BOT_CHATID=chat_bot_numbering_id
: The ID of the Telegram chat room
```

<br/>

### 3. telegraf.constant.ts
Telegram bots help you control status check applications through simple commands.

<br/>

Prepare the telegraf.constant.ts file.
```bash
cp telegraf.constant.sample.ts telegraf.constant.ts
```

<br/>

Check the description of each command and configure the commands.
```bash
export const COMMAND_LIST = "/";
: Output GUIDE_DESC.

export const COMMAND_HEALTH_START = "";
: Initiates an interval to check the status. It also launches the BDJuno service.

export const COMMAND_HEALTH_STOP = "";
: Stops the interval during which the status check is performed. It also stops the BDJuno service.

export const COMMAND_HEALTH_RESTART = "";
: Restart the interval for which you want to check the status. It also restarts the BDJuno service.

export const COMMAND_HEALTH_JOB_NAME = "";
: Queries the name of the currently running interval. If it is not running, '[]' is output.

export const COMMAND_CLEAN_QUEUE = "";
: Clean up the contents of the queue file.

export const GUIDE_DESC = "";
: I recommend that you write down a description of the commands.

```

### 4. Register BDJuno service
This application must be reprinted from the registration of BDJuno into the service.
Use after modifying the location of User and BD Juno Deamon.

```bash
$ sudo tee /etc/systemd/system/bdjuno.service > /dev/null <<EOF
[Unit]
Description=BDJuno parser
After=network-online.target

[Service]
User="Your user name"
ExecReload=pkill '/usr/local/bin/bdjuno start' & /usr/local/bin/bdjuno start
ExecStart=/usr/local/bin/bdjuno start
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

<br/>

## How to run
```bash
npm run start
```

</br>

## REST API
API to check the status of the application.

```bash
# Path
/health

# How to request
curl -X GET http://localhost:4000/health

# Return
"OK"
```