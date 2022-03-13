#!/bin/bash

scripts/deploy \
	-f manifests/cloud.yaml \
	-f manifests/gateway.dev.yaml \
	-f manifests/monitoring.yaml
