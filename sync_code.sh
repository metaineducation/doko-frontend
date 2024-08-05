#!/bin/bash
set -e

sudo rm -rf dist
#已当前目录（$(pwd)）映射到(/src)容器的 src目录下, -w  指定执行命令的目录 为 /src
docker run --rm -v $(pwd):/src -w /src node:17-buster bash -c "npm install && yarn build"
docker-compose down -v
docker-compose up -d