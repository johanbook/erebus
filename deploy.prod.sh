#!/bin/bash

scripts/deploy \
	-f manifests/analytics.yaml \
	-f manifests/cloud.yaml \
	-f manifests/monitoring.yaml \
	-f manifests/gateway.prod.yaml
