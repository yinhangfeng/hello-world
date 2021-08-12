## Dockerfile

COPY 命令原路径是相对于 docker build 传入的 path 参数的，不能访问 path 的 parent 目录
如果想访问 Dockerfile 上一级的目录可以 -f 单独指定 Dockerfile
```
docker build -t xxx:x.x -f path/to/Dockerfile path
```

## 命令行

- 启动镜像运行可交互的 bash
```
docker run -it --name container_name xxx:x.x /bin/bash
```

如果 docker 内有 ENTRYPOINT 则可以通过 --entrypoint 覆盖原 ENTRYPOINT

```
docker run -it --entrypoint /bin/bash xxx:x.x
```

- 进入已存在的容器

首先启动容器
```
docker start container_name
```

```
docker exec -it container_name /bin/bash
```

```
docker attach container_name
```
