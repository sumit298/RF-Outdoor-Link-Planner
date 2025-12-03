# RF Link Planner

A simple tool for planning radio frequency links between towers. Click on the map to add towers, configure their frequencies, and create links between them.

## What it does

Basically, you can:
- Click anywhere on the map to drop a tower
- Set each tower's frequency (has to match to create links)
- Toggle "Link Mode" and click two towers to connect them
- See the Fresnel zone when you select a link
- Get basic info like distance and location names

## How to use it

**Adding towers:**
1. Just click anywhere on the map
2. A config panel opens - set the tower name and frequency
3. Location gets filled automatically from OpenStreetMap

**Creating links:**
1. Hit "Link Mode" in the sidebar
2. Click first tower (it highlights)
3. Click second tower - if frequencies match, link appears
4. If frequencies don't match, you get an error

**Viewing Fresnel zones:**
1. Click any existing link on the map
2. Red ellipse shows up - that's your Fresnel zone
3. Link info panel shows distance and frequency
4. The zone calculation uses proper RF formulas based on frequency and distance

**Managing stuff:**
- Click towers to edit frequency/name
- Delete towers (removes their links too)
- Delete individual links from the info panel
- Sidebar shows all your towers

## How I built it

Kept it simple with React + Vite. Used Leaflet for the map because it's lightweight and free. All the RF calculations are proper - Haversine formula for distance, actual Fresnel zone math, etc.

The whole thing is just a few components:
- Map handles clicks and shows towers/links
- Sidebar lists your towers and has the link button
- Config panels pop up when you click stuff
- Utils folder has the RF math

No fancy state management - just useState in the main App component. Works fine for something this size.

## Running it

```bash
npm install
npm run dev
```

## Design choices

I focused on making it actually work rather than being perfect. The code is clean and does what it needs to do. Some things I kept simple:

- All state lives in App.jsx (no Redux/Zustand needed)
- Components are small and focused
- Real-time validation (can't link different frequencies)
- Automatic location names from OpenStreetMap
- Visual feedback for everything

The RF calculations are legit - proper wavelength, Fresnel zone radius, and distance formulas. It'll give you realistic results for planning microwave links.

## About Fresnel zones

The app automatically calculates and shows Fresnel zones when you click a link. Here's what's happening:

- **Frequency matters** - Higher frequency = smaller Fresnel zone
- **Distance matters** - Longer links = bigger zones
- **Shape is an ellipse** - Widest at the midpoint between towers
- **Real math** - Uses actual RF engineering formulas, not approximations

The zone shows where obstacles (buildings, trees, hills) would interfere with your signal. You want at least 60% clearance for a good link. The visualization helps you spot potential problems before installing equipment.
