# Erebus

**This project is no longer maintained as Docker Swarm has been deprecated**

**Erebus** was my humble home cluster. It was intended as a opinionated
framework for running Docker containers using
[Docker Swarm](https://docs.docker.com/engine/swarm/). Target systems were small
to medium-sized setups where a full-blown Kubernetes cluster did not make sense.

## Technologies

The project utilizes the following technologies:

- Docker for container virtualization
- [Docker Swarm](https://docs.docker.com/engine/swarm/) as orchestration
  framework
- NFS for shared storage volumes
- [Traefik](https://doc.traefik.io/traefik/) as API gateway
- Prometheus and Node-exporter for monitoring node hardware metrics
- Loki for container log collection and aggregation
- [Grafana](https://grafana.com/) for viewing logs and metrics. Default
  dashboards include hardware metrics monitoring and request statistics for
  Traefik
- Nodejs to validate secrets

The cluster also uses Docker networks to segment service communication such that
only containers are divided into groups and inter-group communication is
limited.

## Deployment

Erebus is designed to run on multiple nodes using Docker Swarm. Before starting
installation and deployment, it is assumed that each node fulfills the
following:

- Running a Linux OS
- Has Docker installed
- There are firewall openings as specified in `scripts/setup-firewall` for
  inter-node communication
- Nodes are already connected in a Docker Swarm cluster

### Installing Loki plugin

The
[Loki Docker plugin](https://grafana.com/docs/loki/latest/clients/docker-driver/)
should be installed on each node. For Raspberry ARM CPUs, this requires the
plugin to be compiled manually. This can be done on any machine via running

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

### Setup NFS share

The cluster uses a NFS share for sharing data. On the leader node, run

```sh
./scripts/setup-nfs-server
```

On each client, run

```sh
./scripts/setup-nfs-client
```

Create the required folders using

```sh
DATA_STORAGE_PATH=/srv/nfs/ ./scripts/create-config-folders
```

### Creating variables

Create a variables file using `touch variables.json` and populate with the
necessary data. See `variables.schema.json` for which properties can be
specified and which are required.

### Launching the cluster

Start the Loki instance on a node using `scripts/start-loki`. Once Loki is
running, run `deploy.dev.sh` or `deploy.prod.sh` to launch the cluster (or use
the `scripts/deploy` script directly).

## Backing up and restoring db

Database can be backed up using

```sh
docker exec -it <container_name>  pg_dumpall --username <username > postgres.dump
```

Restoring

```sh
cat postgres.dump | docker exec -i <container_name> psql -U <username> postgres
```

If someone decides on using this as a template, I would advice on automating a
database backup against an offsite object storage.
