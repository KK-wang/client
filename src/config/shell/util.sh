#!/usr/bin/env bash

# 该脚本的执行需要 root 权限，同时需要安装 jq 工具，该脚本用于获取通过 pod name 获取 pod metrics。

# I.通过 pod name 获取 pod pid。
pod_name=$1
docker_storage_location=`docker info  | grep 'Docker Root Dir' | awk '{print $NF}'`
docker_short_id=""
while [[ ${docker_short_id} == "" ]];
do
  docker_short_id=`docker ps | grep ${pod_name} | grep -v pause | awk '{print $1}'`
  sleep 1s
done
docker_long_id=`docker inspect ${docker_short_id} | jq ".[0].Id" | tr -d '"'`
pod_pid=`cat ${docker_storage_location}/containers/${docker_long_id}/config.v2.json | jq ".State.Pid"`

# II.创建 pod running 的记录文件夹以及相应的 logs。
if [ ! -d pod_running_logs ]; then
  mkdir pod_running_logs
fi
touch ./pod_running_logs/${pod_name}.log

# III.获取 cpu 和 mem 信息。
cat /proc/meminfo | grep MemTotal >> ./pod_running_logs/${pod_name}.log
lscpu | grep CPU\(s\) | head -n 1 >> ./pod_running_logs/${pod_name}.log

# IV.记录 logs。
while [[ `ps -p ${pod_pid} | grep ${pod_pid}` != "" ]];
do
  ps -aux | grep ${pod_pid} | grep -v grep >> ./pod_running_logs/${pod_name}.log
  sleep 2.5s
done