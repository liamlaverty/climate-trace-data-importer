# (Unofficial) Climate Trace Data Importer
Imports inventory datasets from the [ClimateTrace](https://climatetrace.org/) repositories into a Postgres/PostGIS database

Companion application to https://github.com/liamlaverty/climate-trace-data-downloader

## Copyright Note 

This repository uses the MIT License. The emissions inventory downloaded from ClimateTrace have different licenses, see https://climatetrace.org/faq for details

## What Does It Do?

* Reads through all ClimateTrace data inventory files, and imports into a PostGis database
* Once complete, the database should contain data for the following:
  * National emissions summary from 2015 onwards
  * Sector emissions summary
  * Physical asset emissions records from 2015

## Usage

* run `npm install`
* run `npm install typescript --save-dev` to add typescript to your local env
* run `tsc` to build
* Configure the app by copying `.env_example` into `.env`, and editing the file
* run `node .\dist\app.js` to run 


## Debugging 
* run `npm install`

* run `tsc` to build

## Deploying
Application can be found in the `src` folder, and the built application can be found in `dist`. When deploying, it's important to have `/data-files/` available in the directory above `dist`

### Folder structure

```
-> data-files/
-- --> data/
-> dist/
-- --> app.js
```

### Expected Data

Before running, the `.env` file's `DATA_PACKAGE_FILE_PATH` path should point to a folder with the following structure:

```
~/data_packages/climate_trace/
 -> /country_packages/
   -> /forest_sectors/
     -> /ABW/
     -> /AFG/
     -> /AGO/
   -> /non_forest_sectors/
     -> /ABW/
     -> /AFG/
     -> /AGO/
 -> /sector_packages/
   -> /agriculture/
   -> /buildings/
   -> /plus /
```

### Expected Database

The application's `.env` file should point to a **PostGIS** database with the following tables: 
- `asset_emissions`
- `country_emissions`

Column definitions can be found in `~/src/db/table-connectors/**/*.ts`
