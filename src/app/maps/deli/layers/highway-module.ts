import { IHighway } from "../../../app.models";

declare var ol: any;


export interface HighwayModuleLayer {
    generateSource(highways: IHighway[]): any;
    styleFunction(feature, resolution): any[];
}

export class HighwayLayer implements HighwayModuleLayer {
    generateSource(highways: IHighway[]) {

        var roadsSource = new ol.source.Vector();

        for (let highway of highways) {

            // console.log("Highway coords", highway.Coordinates);

            var startingTownFeature = new ol.Feature({
                geometry: new ol.geom.LineString(highway.Coordinates),
                name: highway.Name
            });

            roadsSource.addFeature(startingTownFeature);
        }

        return roadsSource;
    }

    styleFunction(feature, resolution) {
        var name = feature.get('name');

        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "rgba(255, 255, 0, 0.4)",
                    width: 2 / resolution
                }),
                // fill: new ol.style.Fill({
                //     color: 'rgba(0, 0, 255, 0.1)'
                // }),
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