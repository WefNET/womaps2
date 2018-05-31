# WurmOnline Maps dot com client-side code

This is the ver 2.3 of the WO Maps code base, by Jackjones for WefNET.

## Changes from 2.0

- Fixing map not filling screen vertically on tall layouts.
- Got rid of the ASP.NET MVC wrapper. This web site is hosted with client-side files only built from the Typescript you see here.
- Data is now saved and retrieved from a Google spreadsheet.
- Got rid of Material Design in favor of PrimeNG

## Boring stuff

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.2.

## Commands

The map accepts single press keyboard commands while viewing it in your computer browser:

**C** Cycles the core map layers: Terrain, Isometric, Topological and now Routes, back in time.

**S** Toggles the layer displaying starting towns.

**D** Toggles the layer displaying deeds.

**B** Toggles the layer displaying bridges.

**T** Toggles the layer displaying canals/tunnels.

**G** Toggles the grid.
