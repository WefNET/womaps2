declare var ol: any;

var bridges = [
    { "X1": 1174, "Y1": -6932, "X2": 1174, "Y2": -6974, "Width": 3, "Name": "Friendship Bridge", "Notes": null },
    { "X1": 1317, "Y1": -6664, "X2": 1317, "Y2": -6907, "Width": 3, "Name": "Newspring Bridge", "Notes": null },
    { "X1": 6954, "Y1": -2263, "X2": 6968, "Y2": -2263, "Width": 2, "Name": "Nexa Market Bridge", "Notes": null },
    { "X1": 6549, "Y1": -2112, "X2": 6590, "Y2": -2112, "Width": 1, "Name": "Rotgut's Bridge to Nowhere", "Notes": null },
    { "X1": 7658, "Y1": -3015, "X2": 7658, "Y2": -3114, "Width": 2, "Name": "Serpent's Back", "Notes": "JJ" },
    { "X1": 6497, "Y1": -2370, "X2": 6497, "Y2": -2432, "Width": 2, "Name": "Vortexxx Bridge", "Notes": null }
]

export interface BridgeModuleLayer {
    generateSource(): any;
    styleFunction(feature, resolution): any[];
}

export class BridgeLayer implements BridgeModuleLayer {
    generateSource() {
        var bridgeSources = new ol.source.Vector();

        for (let bridge of bridges) {

            var bridgeFeature = new ol.Feature({
                geometry: new ol.geom.LineString([[bridge.X1, bridge.Y1], [bridge.X2, bridge.Y2]]),
                name: bridge.Name,
                width: bridge.Width
            });

            bridgeSources.addFeature(bridgeFeature);
        }

        return bridgeSources
    }

    styleFunction(feature, resolution) {
        let fontSize: number = resolution <= 0.125 ? 16 : 12;

            var bridgeName = feature.get('name') != null ? feature.get('name') : '';
            var bWidth = feature.get('width') != null ? feature.get('width') : 2

            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        width: (4 / resolution) * bWidth,
                        color: "rgba(255, 0, 255, 0.4)",
                    }),
                    text: new ol.style.Text({
                        font: '' + fontSize + 'px Calibri,sans-serif',
                        text: resolution < 8 ? bridgeName : '',
                        textBaseline: 'middle',
                        textAlign: 'center',
                        fill: new ol.style.Fill({
                            color: "White"
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