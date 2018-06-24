# Dashboard for Conf Companion Data (Web app) 

[Conf Companion](https://conf-companion.firebaseapp.com)

## How To

### Dependencies

``` bash
$ npm i
```

### Development with hot reload

```bash
$ npm run dev
```

### Production with optimisation

```bash
$ npm run build
```

### Production with optimisation + analyzer report

```bash
$ npm run build --report
```

### UT

```bash
$ npm run unit
```

### UT + TI

```bash
$ npm test
```

### Deploy to Firebase Hosting

```bash
# You need to be logged
$ node_modules/.bin/firebase login
# Deploy
$ npm run deploy
```

> Application can be built by flavor check [package.json](./package.json); for example:

```bash
# Build Data X Day
$ npm run build:dataxday
# Deploy Data X Day
$ npm run deploy:dataxday
```
