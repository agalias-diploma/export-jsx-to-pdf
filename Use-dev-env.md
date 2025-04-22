# Some notes

## How to start dev environment in containers?

1. Docker Desktop is installed
2. Clone 2 repos in different dirs on the same level. So it should looks like this:
```
├── frontend/
│   ├── Dockerfile.dev
│   ├── docker-compose.yml
├── backend/
│   ├── Dockerfile.dev
```
3. `.env.dev` exists in root dirs of both /frontend and /backend repositories with needed variables:
    - For frontend:
    ```
    REACT_APP_API_URL=http://localhost:3000
    REACT_APP_WS_URL=ws://localhost:3000
    REACT_APP_ENV=development
    CLIENT_ID=<key>
    ```

    - backend:
    ```
    # AWS SECRETS
    AWS_ACCESS_KEY=
    AWS_SECRET_ACCESS_KEY=
    AWS_S3_BUCKET_REGION=
    AWS_BUCKET_NAME=

    # Google OAuth SECRETS
    CLIENT_ID=
    CLIENT_SECRET=
    GOOGLE_OAUTH_CALLBACK_URL=http://localhost:3000/auth/google/callback

    # MongoDB SECRETS
    DB_CONNECTION=

    # Frontend URL
    FRONTEND_URL=http://localhost:4000
    ```
4. Run `docker compose -f docker-compose-dev.yml up --build` command to build and start both frontend and backend

## This is how dev environment will looks like in the Docker containers

```shell
$ docker ps 
CONTAINER ID   IMAGE                        COMMAND                  CREATED              STATUS              PORTS                    NAMES
cecabe427827   export-jsx-to-pdf-backend    "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:3000->3000/tcp   backend-dev
3ec677298314   export-jsx-to-pdf-frontend   "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:4000->4000/tcp   frontend-dev
```

As a result:

```shell
backend-dev   | > nodemon ./bin/www
backend-dev   | 
backend-dev   | [nodemon] 2.0.22
backend-dev   | [nodemon] to restart at any time, enter `rs`
backend-dev   | [nodemon] watching path(s): *.*
backend-dev   | [nodemon] watching extensions: js,mjs,json
backend-dev   | [nodemon] starting `node ./bin/www`
backend-dev   | Starting the server...
frontend-dev  | Starting the development server...
frontend-dev  | 
backend-dev   | Connected to MongoDB Atlas
...

backend-dev   | OPTIONS /api/s3-files 204 0.892 ms - 0
backend-dev   | {
backend-dev   |   user: { id: '#######', email: 'test123@gmail.com' },
backend-dev   |   iat: 1745336778,
backend-dev   |   exp: 1745340378
backend-dev   | }
backend-dev   | GET /api/s3-files 200 379.886 ms - 428

frontend-dev  | 
frontend-dev  | webpack compiled with 1 warning
```

This allows developer to test the full behaviour of app locally in dev environment, by building Docker images and running them using docker-compose-dev.yml file. 