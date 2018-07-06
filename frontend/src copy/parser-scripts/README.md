README

** TEST **

```test-geopirelli-germanymap```
this test how many difference there are between
germany.pirelli.geo.market.json ( the geo market from pirelli)
AND
germany.new.json (our topojson map)

If any difference, please add in 
filter.pirelli-geo.maps.markets.json
*(this json will be used to transpile map info to pirelli data and avoid any missing for different naming)


```test-postcode-match```
Here we test if all the pirelli postcode in
germany.pirelli.geo.market.json ( the geo market from pirelli)
have a correspondent in 
postleitzahlen.4.7.json ( the topojson we use to have all the postcode info )

** CREATE DATA **
```postcode-parser.js```
Here we create the germany.postcode.map.markets.json
This is the file we use in the backend to read postcodes by landkreiser.
What we do is opening the topojson to feature, and looping through the array of postcodes, we use
germany.pirelli.geo.market.json ( the geo market from pirelli)
to add the corresponding landkreiser ( info that is missing from the topojson file)

```germany-structure.from-geo-pirelli.js```
Here we create a dictionary with this hierarchy:
Germany
	land
		landkreis
			[array of postcode per landkreis]
this file will be exported as germany-structure.markets.json and will be used to create fake data

** CREATE FAKE DATA **
```fake_data_germany.js```
Here we create 2 dataset. one
Germany.data.json (all global data, til landkreiser level)
All landkreiser .json with specific data for action list, client page etc


