# climate-trace-data-importer
Imports inventory datasets from the ClimateTrace repositories into a postgresql database

Companion application to https://github.com/liamlaverty/climate-trace-data-downloader


## Usage

* run `npm install`
* run `npm install typescript --save-dev` to add typescript to your local env
* run `tsc` to build
* Configure the app by copying `./data-files/importer-settings.example.json` into `./data-files/importer-settings.json`, and editing the file
* run `node .\dist\app.js` to run 


## Debugging 
* run `npm install`

* run `tsc` to build

## Deploying
Application can be found in the `src` folder, and the built application can be found in `dist`. When deploying, it's important to have `/data-files/` available in the directory above `dist`

### Folder structure

```
-> data-files/
-- --> importer-settings.json
-- --> data/
-> dist/
-- --> app.js
```

### Expected Data

Before running, the `importer-settings.json` path should point to a folder with the following structure:

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