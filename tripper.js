const fs = require("fs");
const JSONStream = require("JSONStream");
const es = require("event-stream");
const path = require("path");
const byline = require("byline");
const through2 = require("through2");
const chalk = require("chalk");
const figlet = require("figlet");
const argv = require("minimist")(process.argv.slice(2));

console.log(
    chalk.yellow(
        figlet.textSync("tripper", { horizontalLayout: "full" })
    )
);


if (!argv.input || !argv.output) {
    console.log( "\n" + chalk.gray.bold.bgYellow("Error") + " Specify input and output file, e.g. " + chalk.cyan("node tripper --input=\"./trips.json\" --output=\"./parsed.json\""));
    process.exit();
}

const input = path.join(__dirname, argv.input);

let trips = [];

fs.createReadStream(input)
    .pipe(byline.createStream())
    .pipe(
        through2((chunk, enc, next) => {
            try {
                const data = JSON.parse(chunk.toString());

                let coordinates = [];

                data.route.features.forEach( (feature) => {
                    coordinates.push([feature.geometry.coordinates[0], feature.geometry.coordinates[1], 0, 1563122921000 + feature.properties.timestamp]);
                });
    
                let trip = {
                    "vehicle_id": data.vehicle_id,
                    "trip_duration": data.trip_duration,
                    "trip_distance": data.trip_distance,
                    "start_time": data.start_time,
                    "end_time": data.end_time,
                    "geojson": {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": coordinates
                        }
                    }
                };
                
                trips.push(trip);
                next();
            } catch (e) {
                console.log(e);
                next();
            }
        })
    )
    .on("finish", () => {
        fs.writeFileSync(path.join(__dirname, argv.output), JSON.stringify(trips));
        console.log("\n" + chalk.bold.bgGreen("Success") + " Generated file " + chalk.underline(path.join(__dirname, argv.output)));
    });