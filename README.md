Densan Launcher
===============

北海道科学大学電子計算機研究部が学祭で展示しているゲームとそのランチャーです。

Windows にて `launcher-win32-ia32/launcher.exe` を実行すると起動します。

for Developer
-------------
* `npm i`
* `npm i -g electron-prebuilt electron-packager`

Development
-----------
開発中は terminal で次のコマンドを叩いて起動します。

```
electron .
```

Package
-------
配布時は次のコマンドでパッケージングします。(Windows 32bit の例)

```
electron-packager ./ launcher --platform=win32 --arch=ia32 --version=0.33.2
```
