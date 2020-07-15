# tripper
Convert data from SharedStreet's trip-simulator into Kepler.gl input

## Installation
Clone the repo and install with `npm install`

## Usage
### 1. Generate Trips 
Generate GPS Temeletry with [trip-simulator](https://github.com/sharedstreets/trip-simulator). For detailed explanation see [Use](https://github.com/sharedstreets/trip-simulator#use).

```
trip-simulator \
  --config scooter \
  --pbf nash.osm.pbf \
  --graph nash.osrm \
  --agents 100 \
  --start 1563122921000 \
  --seconds 86400 \
  --traces ./traces.json \
  --probes ./probes.json \
  --changes ./changes.json \
  --trips ./trips.json
```

### 2. Convert simulated trips with tripper
Run tripper with `trips.json` as input file and specify an output filepath:

```
node tripper --input="./trips.json" --output="./parsed.json"
```

### 3. Use with kepler.gl
Upload `parsed.json` to [kepler.gl](https://kepler.gl/demo) or use with local instance.

