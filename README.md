# Unofficial Zalo App


## Build Instruction

### Install NPM package globally

``` bash
npm install -g electron electron-builder electron-packager electron-installer-debian
# or
yarn install -g  electron electron-builder electron-packager electron-installer-debian
```
``` bash
# install dependencies
npm install --save-dev
# or
yarn install -D
```

### Package application

#### For Windows

``` bash
npm run package-win
#or
yarn run package-win
```

#### For macOS
``` bash
npm run dist
#or 
yarn dist
```

#### For Ubuntu
``` bash
# x86
npm run package-linux
#or
yarn run package-linux


# x86 and x64
npm run package-linux-x64
# or
yarn run package-linux-x64
```

I develop this software for Linux, but if you want to build it for Windows and Mac, you can send me built file.

## Creating Issue Instruction

Please write as detail as you can.

Tips: You can assign label for issue.