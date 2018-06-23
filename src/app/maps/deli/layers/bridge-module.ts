import { IBridge } from "../../../app.models";

declare var ol: any;

export interface BridgeModuleLayer {
    generateSource(bridges: IBridge[]): any;
    styleFunction(feature, resolution): any[];
}

export class BridgeLayer implements BridgeModuleLayer {
    generateSource(bridges: IBridge[]) {
        var bridgeSources = new ol.source.Vector();

        for (let bridge of bridges) {

            var bridgeFeature = new ol.Feature({
                geometry: new ol.geom.LineString([[bridge.X1, bridge.Y1], [bridge.X2, bridge.Y2]]),
                name: bridge.Name,
            });

            bridgeSources.addFeature(bridgeFeature);
        }

        return bridgeSources
    }

    styleFunction(feature, resolution) {
        let fontSize: number = resolution <= 0.125 ? 16 : 12;

        var bridgeName = feature.get('name') != null ? feature.get('name') : '';
        var bWidth = 2;

        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 3 / resolution,
                    color: "rgba(255, 0, 255, 0.4)",
                }),
                text: new ol.style.Text({
                    font: '' + fontSize + 'px Calibri,sans-serif',
                    text: resolution < 2 ? bridgeName : '',
                    textBaseline: 'middle',
                    textAlign: 'center',
                    fill: new ol.style.Fill({
                        color: "rgba(255, 125, 255, 1)",
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'Black',
                        width: 1
                    })
                })
            }),
        ]
    }
}