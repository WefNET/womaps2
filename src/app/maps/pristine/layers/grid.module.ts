declare var ol: any;

export interface GridModuleLayer {
    generateSource(): any;
    styleFunction(feature, resolution): any[];
}

export class GridLayer implements GridModuleLayer {
    generateSource() {
        var gridSrc = new ol.source.Vector();

        var gridJSON = [];

        // horiz
        for (var x = 0; x < 20; x++) {
            var y = -((x * 102) + 87);
            gridJSON.push({
                "StartX": 0, "StartY": y, "EndX": 2048, "EndY": y
            });

            var horizLineFeature = new ol.Feature({
                geometry: new ol.geom.LineString([[0, y], [2048, y]]),
                name: ""
            });

            gridSrc.addFeature(horizLineFeature);
        }

        // vertical
        for (var y = 0; y < 20; y++) {
            var x = (y * 102) + 92;
            gridJSON.push({
                "StartX": x, "StartY": 0, "EndX": x, "EndY": -2084
            });

            var vertLineFeature = new ol.Feature({
                geometry: new ol.geom.LineString([[x, 0], [x, -2048]]),
                name: ""
            });

            gridSrc.addFeature(vertLineFeature);
        }

        // grid text
        var gridPoints = [];
        var gridX = ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U"];

        for (var x = 0; x < 20; x++) {
            var yC = -((x * 102) + 87)

            for (var y = 0; y < 20; y++) {
                var xC = (y * 102) + 92;

                var yDisplay = y + 7;
                var gridID = gridX[x] + " " + yDisplay;
                gridPoints.push({ "cX": xC, "cY": yC, "GridID": gridID });

                var gridNameFeature = new ol.Feature({
                    geometry: new ol.geom.Point([xC - 51, yC + 51]),
                    name: gridID
                });

                gridSrc.addFeature(gridNameFeature);
            }
        }

        return gridSrc;
    }

    styleFunction(feature, resolution) {

        var fontSize = (14 / resolution) + 16;

        if (resolution >= 4) {
            fontSize = 10;
        }

        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(103, 207, 230, 0.6)',
                    width: 2
                }),
                text: new ol.style.Text({
                    font: '' + fontSize + 'px Calibri,sans-serif',
                    text: feature.get('name'),
                    textBaseline: 'middle',
                    textAlign: 'center',
                    fill: new ol.style.Fill({
                        color: 'rgba(103, 207, 230, 0.6)',
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(103, 207, 230, 0.6)',
                        width: 1,
                    })
                })
            })
        ]
    }
}