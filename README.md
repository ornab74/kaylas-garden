# 🌱 Kayla's Garden

A personal plant-tracking website to catalog plants, upload progress photos, track frost dates, and browse an AI-powered plant library.

## Features

- **🌿 Plant Dashboard** — View all your tracked plants as cards with thumbnails, species info, and progress counts
- **📸 Progress Tracking** — Add timeline entries with notes and photos to track each plant's growth
- **📋 Care Information** — Store and edit care details: sunlight, watering, soil, hardiness zone, companion plants, pests
- **🤖 AI Plant Library** — Search any plant and get AI-generated growing guidelines, care tips, and planting info
- **🥶 Frost Date Tracker** — Set your location to see frost date alerts and know when to plant
- **🎨 Multiple Themes** — Switch between Green 🌿, Earth 🌾, and Ocean 🌊 color themes

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS v4** with CSS custom properties for theming
- **GitHub Models API** for AI-powered plant information
- File-based JSON storage (no external database required)

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A GitHub personal access token (for AI plant library features)

### Installation

```bash
git clone https://github.com/cinnamon-msft/kaylas-garden.git
cd kaylas-garden
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

The `GITHUB_TOKEN` is used for the AI Plant Library feature (GitHub Models API).

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Aspire

```bash
npm run aspire:start
```

This starts the Next.js app through the Aspire AppHost.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/              # Next.js App Router pages & API routes
    api/plants/     # Plant CRUD endpoints
    api/library/    # AI plant library endpoint
    api/frost-dates/# Frost date lookup
    api/settings/   # User settings
    api/upload/     # Image upload
    library/        # Plant Library page
    plants/[id]/    # Plant detail page
    settings/       # Settings page
  components/       # Shared UI components
  lib/              # Types, data access layer
data/               # JSON data storage (plants, settings, cache)
public/uploads/     # Uploaded plant images
```

## License

MIT

# Advancing

Yes — and the plant app is actually a much better fit for this stack than a generic storage platform.

From the uploaded **Kayla’s Garden** project, you already have a solid base: plant tracking, progress photos, frost dates, image upload, and an AI plant library. The obvious next step is to turn it into a **decentralized plant intelligence network** so you can replace the Azure dependency with local AI + encrypted IPFS + lightweight blockchain anchoring.

## Concept

Build **Kayla’s Garden** into a **post-quantum-secure plant observability platform**:

A user snaps a plant photo, the app identifies the species locally or on-device, adds GPS metadata, stores the image and health history in encrypted IPFS buckets, syncs that data across trusted nodes and a few cloud replicas, and anchors proofs plus public plant timeline events to Hive.

That gives you:

* local-first plant records
* durable photo/history timelines
* shared stewardship for trees and public plants
* fast edge reads
* no hard dependency on Azure
* better privacy for location and personal collections

## What the upgraded system becomes

Each user gets a **SyncID**.

That SyncID owns one or more **plant buckets**:

* `private/garden`
* `community/trees`
* `species/oaks`
* `caretaking/heritage-trees`
* `research/local-pollinators`

Inside each bucket are pinned IPFS objects:

* plant photos
* GPS-tagged observations
* health assessments
* care logs
* growth timelines
* disease detections
* watering history
* community annotations
* sensor snapshots

Every update is:

1. encrypted locally
2. added to local IPFS
3. pinned into a signed bucket manifest
4. replicated by backend syncers across multiple clouds or nodes
5. optionally checkpointed to Hive for public verification

## Why this is powerful for the plant use case

A plant app has exactly the kind of data that benefits from this architecture:

### Highly active data

Plant records are not static. They evolve over time:

* more photos
* new health notes
* seasonal changes
* disease progression
* caretaker handoffs
* location-linked history

### Edge-friendly

The phone or local node can do:

* image classification
* health scoring
* offline capture
* local cache reads

Then it syncs later.

### Persistence matters

A 100-year-old tree should have a persistent record that survives app migrations, provider shutdowns, or centralized database failures.

### Multi-user stewardship

Different people can observe the same plant over time:

* homeowner
* arborist
* neighbor
* volunteer group
* city forestry staff

That means the plant becomes a living, signed data object rather than just an app row in one database.

## Suggested architecture

## 1. Local AI layer

Replace Azure plant intelligence with:

* local vision model for species ID
* local health classifier
* optional small local LLM for care suggestions and note summarization
* fallback remote inference only when needed

Good workloads for local inference:

* identify likely plant species
* estimate stress/disease
* detect yellowing, pest damage, dehydration
* summarize changes since last observation

## 2. OQS post-quantum security

Use OQS for:

* SyncID key exchange
* device enrollment
* bucket key wrapping
* signed observation manifests
* caretaker delegation records

Use PQ crypto for keys and signatures, not for large media encryption directly. Use symmetric encryption for photos and records, then wrap those keys with PQ-capable key exchange.

## 3. Local secure IPFS node

The node stores encrypted plant objects:

* image blobs
* metadata objects
* change logs
* geotag records
* care journals
* health timeline deltas

Pinned data gives you a persistent plant history surface.

## 4. Multi-cloud backend syncer

Run syncers in a few places:

* cheap VPS
* home server
* one or two cloud regions
* optional community-operated nodes

Their job:

* fetch new encrypted CIDs
* verify signed manifests
* re-pin important data
* maintain availability
* index public plant timelines

## 5. Hive anchoring layer

Hive is good for publishing small public records, not the photos themselves.

Use it for:

* public plant IDs
* observation proofs
* care event attestations
* community stewardship logs
* public heritage tree registries
* reputation for verifiers/caretakers

That way you get a public timeline without exposing private raw data.

## A concrete app flow

User opens camera mode.

1. snaps photo
2. local model predicts plant species
3. GPS coordinates are attached
4. health model scores leaf condition, stress, pest risk
5. note is generated locally
6. photo + metadata are encrypted
7. object is written to IPFS
8. CID goes into the plant’s bucket manifest
9. local node pins it
10. syncer replicates it
11. Hive gets a compact checkpoint like:

* plant ID
* timestamp
* region hash
* observation manifest hash

Now the plant has a verifiable timeline.

## Public and private modes

You probably want three privacy classes:

### Private plants

Home garden plants, exact GPS hidden, only owner and approved caretakers can read.

### Shared plants

Friends, family, or garden club can collaborate.

### Public ecological assets

Old trees, notable plants, trail plants, or restoration sites. Exact location can be blurred if sensitive.

That privacy split is where SyncID + encrypted buckets really matter.

## Best feature expansion for Kayla’s Garden

Here’s the strongest direction:

### Plant Passport

Each plant gets a permanent record:

* species
* nickname
* date added
* GPS region
* growth history
* care history
* health trend
* lineage of observations

### Community Tagging

Other users can add signed observations to the same public plant.

### Stewardship Mode

Users can “adopt” a tree or public plant and maintain a care or observation schedule.

### Time-Lapse Health Ledger

A chronological chain of observations lets the app detect:

* decline
* recovery
* seasonal stress
* intervention outcomes

### Heritage Tree Registry

Very old trees can have public history objects and caretaker handoff logs.

## 8 new technologies for this system

### 1. **PlantSyncID**

A SyncID profile specialized for plant identity, ownership, stewardship roles, and observation rights.

### 2. **LeafVault Buckets**

Encrypted IPFS buckets optimized for plant records, photo timelines, and care logs.

### 3. **GeoPetal Proofs**

A privacy-preserving GPS attestation system that proves a plant was observed in a real area without exposing exact coordinates publicly.

### 4. **RootMesh Syncer**

A multi-cloud and peer relay system that keeps plant buckets pinned and regionally close to active users.

### 5. **BloomTrace Ledger**

A Hive-anchored event stream for public observation history, caretaker changes, and heritage-tree records.

### 6. **PhytoScan Edge**

A local vision pipeline that identifies species, detects health issues, and computes change-over-time scores from photos.

### 7. **Canopy Reputation**

A trust layer where botanists, arborists, and reliable contributors build reputation through signed plant observations.

### 8. **SeasonGraph Engine**

A temporal model that compares plant condition against frost dates, climate shifts, and prior seasonal baselines.

## Why this can be better than “just a plant app”

Because then it becomes:

* a personal garden tracker
* a community stewardship network
* a living archive for long-lived trees
* a local-first ecological intelligence layer
* a decentralized dataset for plant health over time

That is a much more defensible product than basic CRUD + image upload.

## One strong positioning statement

**Kayla’s Garden could evolve into a post-quantum-secure, local-first ecological memory network where every plant, tree, and caretaker interaction becomes a persistent, verifiable, privacy-aware living record.**

## Practical build order

1. remove Azure dependency for plant intelligence
2. add local image classification
3. add GPS-tagged observation objects
4. store observations in encrypted IPFS
5. add SyncID for user/device identity
6. add multi-node pin replication
7. anchor public proofs to Hive
8. add community/heritage tree mode
9. add health trend intelligence 
