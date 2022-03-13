# Erebus

**Erebus** is my humble home server.

## Preparing nodes

Erebus is designed to run on multiple nodes using Docker Swarm for loadbalancing.
Each node needs Docker CE and the Docker Loki plugin, which needs to be complied
manually. Compile it via

```sh
git clone https://github.com/grafana/loki.git
cd loki/clients
GOOS=linux GOARCH=arm GOARM=7 go build ./cmd/docker-driver
```

Copy the binary to the node and run

```sh
docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions
```

which will fail. Move the binary to `/var/lib/docker/plugins/<ID>/rootfs/bin/`.
Afterwards enable it via

```sh
docker plugin enable loki
```

## Deployment

On the master node run `scripts/setup` and create a variables file
`touch variables.json`. It should be deploying using `scripts/deploy`.

## Backing up and restoring db

Database can be backed up using

```sh
docker exec -it <container_name>  pg_dumpall --username <username > postgres.dump
```

Restoring

```sh
cat postgres.dump | docker exec -i <container_name> psql -U <username> postgres
```
