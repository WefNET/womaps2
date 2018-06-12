declare var ol: any;

var startingTowns = [
    {
        "Name": "Greendog",
        "Coords": [[630, -1079], [630, -1120], [670, -1120], [670, -1079]]
    },
];

export interface StartingTownModuleLayer {
    generateSource(): any;
    styleFunction(feature, resolution): any[];
}

export class StartingDeedLayer implements StartingTownModuleLayer {
    generateSource() {

        var startingTownsSource = new ol.source.Vector();

        for (let town of startingTowns) {

            var startingTownFeature = new ol.Feature({
                geometry: new ol.geom.Polygon([town.Coords]),
                name: town.Name
            });

            startingTownsSource.addFeature(startingTownFeature);
        }
        
        return startingTownsSource
    }

    styleFunction(feature, resolution) {
        var name = feature.get('name');

        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'blue',
                    width: 3
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.1)'
                }),
                text: new ol.style.Text({
                    font: '14px Calibri,sans-serif',
                    text: name,
                    exceedLength: true,
                    textBaseline: 'middle',
                    textAlign: 'center',
                    fill: new ol.style.Fill({
                        color: '#FFF'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#000',
                        width: 1,
                        offsetY: 1,
                        offsetX: 2
                    })
                })
            })
        ]
    }
}