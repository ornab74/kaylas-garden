# Kayla's Garden

Kayla's Garden is now a single-file Python `customtkinter` desktop runtime centered on local-first plant intelligence.

The core app lives in [main.py](./main.py). It tracks plant passports, observations, health records, diagnosis notes, shared techniques, LiteRT-LM prompt flows, encrypted local storage, optional IPFS publishing, optional Hive checkpoint preparation, and optional OQS post-quantum guidance.

Azure has been removed.

## What It Does

- Local-first plant passports with notes, care profile fields, tags, and coarse GeoPetal proofs
- Observation capture with GPS, image tagging, plant profile updates, and encrypted LeafVault storage
- LiteRT-LM prompt flows for:
  - observation analysis
  - care briefs
  - Chat With A Plant
  - plant problem diagnosis
  - health check-ins
- Gemma 4 vision-ready chat flow that can use:
  - a newly selected plant image
  - or a decrypted historical plant image from the local vault when available
- Shared technique cards that can be queued for IPFS/Hive-style replication
- Managed Kubo/IPFS daemon controls that stay off until users explicitly enable them
- Garden insights including a watchlist, activity timeline, and greenhouse digest
- Encrypted AES-GCM network secret storage for IPFS and Hive identities
- Community pin groups, comments, and peer co-pin requests for faster IPFS access
- Local-first by default, with cloud mode explicitly opt-in
- Optional IPFS Kubo HTTPX client
- Optional Hive JSON-RPC checkpoint preparation
- Optional OQS advisory, repo references, build script, and requirements file

## Runtime Modes

### Local-first

Default mode. Everything works without network services:

- encrypted local storage
- synthetic CIDs when IPFS is off
- prepared Hive checkpoint payloads without broadcast
- local sync queue files
- heuristic fallbacks when LiteRT-LM is unavailable

### Cloud mode

Cloud behavior is off until you enable it in the app or settings:

- `network_mode = "cloud"`
- `cloud_mode = true`
- `ipfs_enabled = true` to activate Kubo RPC publishing
- `hive_enabled = true` to prepare Hive network checkpoints
- `hive_broadcast_enabled = true` only when you have a real signing/broadcast path

## Main Features

### Plant Passports

Each plant gets a passport with:

- plant name and species
- hardiness zone
- privacy class
- profile summary
- sunlight, watering, and soil guidance
- tags
- observation timeline

### Observation Studio

An observation can include:

- note text
- GPS coordinates
- plant image
- manual tags

The runtime then:

1. derives a GeoPetal proof
2. runs prompt-driven plant analysis
3. updates the plant profile
4. seals JSON and image assets into LeafVault
5. assigns a CID or synthetic CID
6. prepares a Hive checkpoint payload
7. queues a RootMesh sync job

### Chat With A Plant

The Guide tab and `plant-guide` CLI command create a long-context plant-specific response using:

- the plant passport
- observation history
- health check-ins
- shared techniques
- historical image inventory
- an optional current image
- or a prior decrypted plant image when one exists

This flow is designed for Gemma 4 vision through LiteRT-LM, with a local fallback when the model is missing.

### Plant Diagnosis

The Care Lab can create a diagnosis record that includes:

- urgency
- likely causes
- care actions
- prevention tips
- narrative analysis
- encrypted metadata asset
- prepared Hive checkpoint payload

### Health Check-Ins

Health check-ins create revisit-friendly records with:

- overall status
- vigor score
- hydration score
- pest and disease pressure
- action items
- narrative summary

### Shared Techniques

Technique cards let users record reusable plant knowledge:

- title
- plant scope
- problem focus
- summary
- step list
- tags
- privacy class

These are stored locally first and can be queued for IPFS/Hive style distribution when cloud mode is enabled.

### Encrypted Network Vault

The Settings tab now includes an AES-GCM secret vault for sensitive network identity material such as:

- IPFS user id
- pin surface or pinning service label
- pin surface token / bearer token
- Hive username
- Hive posting key

These are stored separately from plain runtime settings in an encrypted file and are masked in status views.

### Community Pin Surface

The Community tab lets growers build a cooperative plant network with:

- active peer plant users
- shared pin groups
- group comments
- peer co-pin requests for specific CIDs

That gives the app a local-first collaboration surface for asking peers to keep important plant timelines warm and easier to fetch over IPFS.

### Insights Workboard

The Insights tab adds a higher-level garden operations view with:

- a plant watchlist ranked by current priority
- a cross-plant activity timeline
- a greenhouse digest that combines care signals with infrastructure state

### Managed IPFS Daemon

The Settings tab can manage a local Kubo daemon, but only after the user explicitly enables it.

That managed path includes:

- optional managed binary installation
- optional repo initialization
- start and stop controls
- persistent repo and log paths inside the runtime root
- daemon status reporting without forcing cloud mode on

## Storage Model

The runtime creates a self-contained storage root:

- encrypted vault state
- settings file
- model cache
- encrypted LeafVault assets
- anchor queue files
- sync queue files

By default, the desktop app uses:

```text
.kaylas-garden-runtime/
```

You can point commands at another root with `--root`.

## Requirements

Minimum:

- Python 3.11+

Recommended local modules:

- `customtkinter`
- `httpx`
- `cryptography`

Optional local AI / security modules:

- LiteRT-LM runtime compatible with the Gemma 4 LiteRT model
- `oqs` / `liboqs-python`

The runtime degrades gracefully if some optional modules are missing.

## Running The App

Launch the desktop app:

```bash
python3 main.py
```

Use a custom runtime root:

```bash
python3 main.py --root /tmp/kaylas-garden-dev
```

## Useful CLI Commands

Bootstrap repo data into the encrypted runtime:

```bash
python3 main.py bootstrap
```

Create a plant passport:

```bash
python3 main.py add-plant --name "Rosemary Pot" --species "Salvia rosmarinus"
```

Record an observation:

```bash
python3 main.py observe \
  --plant-id <plant-id> \
  --note "Aphids on the top shoots and the new growth is curling." \
  --lat 42.36 \
  --lon -71.05 \
  --image /path/to/plant.jpg \
  --tags aphids,deck
```

Generate a care brief:

```bash
python3 main.py care-brief --plant-id <plant-id> --question "What should I watch next?"
```

Chat with a plant:

```bash
python3 main.py plant-guide \
  --plant-id <plant-id> \
  --question "Compare this week to prior plant photos and tell me what changed."
```

Run a diagnosis:

```bash
python3 main.py diagnose \
  --plant-id <plant-id> \
  --note "Lower leaves are yellowing and the soil stays wet for days." \
  --tags yellowing,wet-soil
```

Save a health check-in:

```bash
python3 main.py health-checkin \
  --plant-id <plant-id> \
  --note "New growth looks better, but the root zone still dries slowly."
```

Publish a technique card:

```bash
python3 main.py share-technique \
  --plant-id <plant-id> \
  --title "Let rosemary dry a bit deeper" \
  --problem-focus "Wet roots in containers" \
  --summary "Waiting for the pot to lighten reduced stress." \
  --steps "Check pot weight|Check moisture below the surface|Water deeply only when the pot lightens" \
  --tags rosemary,watering \
  --privacy shared
```

Check network and OQS state:

```bash
python3 main.py network-status
python3 main.py secret-status
python3 main.py ipfs-daemon-status
python3 main.py oqs-status
python3 main.py oqs-search --query ML
```

Garden operations views:

```bash
python3 main.py activity
python3 main.py watchlist
python3 main.py garden-digest
python3 main.py community-summary
```

## LiteRT-LM And Gemma 4

`main.py` is already wired for a LiteRT-LM model catalog and a Gemma 4 LiteRT model entry.

The app supports:

- model status inspection
- model download workflow
- model hash verification
- CPU/GPU backend selection
- native image input when the LiteRT build supports it

Related commands:

```bash
python3 main.py model-status
python3 main.py verify-model
python3 main.py download-model
```

## IPFS And Hive

### IPFS

The runtime includes a fuller HTTPX Kubo client for:

- `add`
- MFS mirroring
- status reporting

It stays inactive until cloud mode and `ipfs_enabled` are turned on.

There is also an optional managed daemon path for users who want the app to maintain a local Kubo binary and repo directly. The helper script for that is [scripts/install_kubo.sh](./scripts/install_kubo.sh).

### Hive

The runtime includes a Hive JSON-RPC client for:

- account-aware checkpoint preparation
- local queueing
- custom-json operation construction

Broadcast stays off unless you explicitly enable it and provide a real signed transaction path.

## OQS Post-Quantum Notes

OQS references are included in the runtime, plus local build helpers:

- [requirements-oqs.txt](./requirements-oqs.txt)
- [scripts/build_oqs.sh](./scripts/build_oqs.sh)

Official upstream repositories:

- `liboqs`: https://github.com/open-quantum-safe/liboqs
- `liboqs-python`: https://github.com/open-quantum-safe/liboqs-python

## Files To Know

- [main.py](./main.py): single-file app, runtime, CLI, UI, prompt system, IPFS/Hive/OQS integration
- [scripts/build_oqs.sh](./scripts/build_oqs.sh): local OQS build helper
- [scripts/install_kubo.sh](./scripts/install_kubo.sh): optional managed Kubo install helper
- [requirements-oqs.txt](./requirements-oqs.txt): OQS-related Python dependency hints

## Current Status

This repo is intentionally local-first and resilient when optional dependencies are missing.

That means:

- if LiteRT-LM is unavailable, the app falls back to heuristic plant guidance
- if `httpx` is unavailable, cloud transport stays inactive
- if `cryptography` is unavailable, the runtime stays functional but marks storage as degraded
- if OQS is unavailable, the app exposes fallback security guidance and build instructions

## Direction

Kayla's Garden is now positioned as a private-first plant intelligence studio:

- desktop-first
- local model capable
- vision-aware
- encrypted by design
- IPFS/Hive ready
- community-shareable without requiring a centralized cloud dependency
