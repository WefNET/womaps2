import { ILandmark } from "../../../app.models";

declare var ol: any;

export interface LandmarkModuleLayer {
    generateSource(landmarks: ILandmark[]): any;
    styleFunction(feature, resolution): any[];
}

export class LandmarkLayer implements LandmarkModuleLayer {
    generateSource(landmarks: any[]) {
        var guardSources = new ol.source.Vector();

        for (let g of landmarks) {
            var landmarkFeature = new ol.Feature({
                geometry: new ol.geom.Point([g.X1, g.Y1]),
                type: g.LandmarkType,
                name: g.Name
            });

            guardSources.addFeature(landmarkFeature);
        }

        return guardSources;
    }

    styleFunction(feature, resolution) {
        console.log("Reso", resolution);
        var type = feature.get('type');
        let fontSize: number = 12 / resolution + 12;

        if (type === "GuardTowerFreedom") {
            return [ // gt
                new ol.style.Style({
                    image: new ol.style.RegularShape({
                        points: 30,
                        radius: 20 / resolution,
                        angle: Math.PI / 4,
                        fill: new ol.style.Fill({
                            color: 'rgba(12, 89, 29, 0.4)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(255, 255, 255, 0.05)',
                            width: 50 / resolution
                        }),
                    })
                })
            ]
        }
        else {
            return [
                new ol.style.Style({
                    text: new ol.style.Text({
                        font: "" + fontSize + "px 'IM Fell English SC', serif",
                        text: resolution <= 1 ? feature.get('name') : '',
                        textBaseline: 'middle',
                        textAlign: 'center',
                        fill: new ol.style.Fill({
                            color: "rgba(255, 0, 0, 0.9)"
                        }),
                    })
                })
            ]
        }
    }
}