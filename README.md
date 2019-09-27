# Schmemorize

Memory game built with vanilla javascript

## Dev mode

### Installing

run the following commands

```bash
yarn
cd server && yarn
```

### Running a local version of the game

From the root of the project:

```bash
yarn start
```

## Prod mode

PS: You should have docker

Run

```
docker build -t schmemorize . && docker run -p 8111:8111 schmemorize
```

Now you can access the game through [Here](http://localhost:8111)
