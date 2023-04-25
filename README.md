qh-static-server 随启随用的静态文件服务器 （借鉴于朴灵大佬的anywhere）
==============================

Running static file server anywhere. 

可在任意目录下启动，将目录文件变成文件服务器在同一局域网内访问与下载

## Installation

Install it as a command line tool via `npm -g`.

```sh
npm install qh-static-server -g
```

## Execution 

```sh
$ qh-static-server
// or with port
$ qh-static-server -p 8000
// or start it but silent(don't open browser)
$ qh-static-server -s
// or with hostname
$ qh-static-server -h localhost -p 8888

```

## Help  
```sh 
If you want check Help option, use --help not -h!!

```

## License
The MIT license.
