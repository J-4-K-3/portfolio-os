# G.R.O.A.

**Global Risk Observation & Analysis** is a web platform for bringing crisis, earthquake, weather, and related risk information into one place. It helps people explore developing situations through alerts, maps, regional information, and practical emergency resources.

## What I built

- A React application with routed pages for alerts, maps, regions, weather, crises, news, reporting, and emergency resources.
- Data integrations that transform information from external providers into a consistent format for the interface.
- Appwrite integration for application data and supporting backend features.
- Data seeding and synchronization tooling, including duplicate handling and cleanup routines.
- Time and date utilities for presenting provider timestamps consistently.
- A Vent Space prototype with a frontend service boundary for matching, messaging, and reporting flows.

## Selected engineering work

External data sources include ReliefWeb, USGS earthquake data, and weather services. The application also contains integrations for sources such as NASA EONET and GDACS. The integration layer handles request failures and transforms source records for display. Some feeds use fallback or sample data, so the interface should not be treated as an authoritative emergency service.

## Technology

React, JavaScript, Vite, React Router, Appwrite, Leaflet / React Leaflet, Framer Motion, and external data APIs.

## Code samples

The portfolio VS Code workspace includes four selected files from the project:

| File | Lines | What it demonstrates |
| --- | --- |
| `src/App.jsx` | 150 | Application setup, route composition, metadata, and visit tracking |
| `src/lib/Appwrite.js` | 31 | Appwrite client setup using build-time environment configuration |
| `src/lib/time.js` | 136 | Timestamp parsing, relative-time formatting, and invalid-date fallbacks |
| `src/lib/ventService.js` | 123 | A frontend service contract for Vent Space, with simulated responses |

These are selected source files, not a complete runnable copy of G.R.O.A. The Vent Space service is explicitly a prototype: matching and message methods return mock results rather than connecting users to a live real-time service.

## Status and safety

My CV lists G.R.O.A. as a deployed web application. Data freshness and availability depend on upstream providers and configured services. G.R.O.A. is a software project showcase, not an official warning channel or a replacement for local emergency services. For real emergencies, follow guidance from local authorities.

## Portfolio navigation

Open **Files > Innoxation > Projects > GROA** to browse this project. Open the README or any source sample to inspect it in VS Code.