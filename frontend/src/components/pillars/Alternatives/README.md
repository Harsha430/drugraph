# Alternatives View

## Overview
The Alternatives View connects to the backend `/alternatives/{drug}/{condition}` endpoint to help users find alternative medications with minimal drug interactions.

## Features
- Search for alternative drugs based on:
  - Current drug name
  - Medical condition
  - Optional: Current medications list (to check for conflicts)
- Display alternatives sorted by conflict count
- Visual indicators for interaction severity:
  - Green: No conflicts
  - Yellow: 1-2 conflicts
  - Red: 3+ conflicts

## API Integration
- **Endpoint**: `GET /alternatives/{drug}/{condition}`
- **Query Parameters**: `current_meds` (optional, comma-separated)
- **Response**: List of alternative drugs with conflict counts

## Usage
1. Navigate to "ALTERNATIVES" in the sidebar
2. Enter the current drug name
3. Enter the condition being treated
4. Optionally add current medications (comma-separated)
5. Click "Find Alternatives"
6. Review results sorted by safety (lowest conflicts first)

## Files Added
- `AlternativesView.tsx` - Main component
- Updated `api.ts` - Added `getAlternatives()` method
- Updated `types/index.ts` - Added `AlternativeDrug` and `AlternativesResponse` types
- Updated `App.tsx` - Added routing for alternatives view
- Updated `Sidebar.tsx` - Added navigation item
