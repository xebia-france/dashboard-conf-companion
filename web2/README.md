# Dashboard for Conf Companion Data (Web app)

[Conf Companion](https://conf-companion.firebaseapp.com)

## How To

### Dependencies

``` bash
$ npm i
```

### Development with hot reload

```bash
$ npm run serve
```

### Production with optimisation (KED)

```bash
$ npm run build
```

### Deploy to Firebase Hosting

```bash
# You need to be logged
$ npx firebase login
# Deploy by flavor
$ npm run deploy:<flavor>
# Flavor can be found in package.json
```

> Application can be built by flavor check [package.json](./package.json); for example:

```bash
# Build Data X Day
$ npm run build:dataxday
# Deploy Data X Day
$ npm run deploy:dataxday
```
