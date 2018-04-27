declare var ol: any;

var canals = [
    { "X1": 2964, "Y1": -1066, "X2": 3023, "Y2": -1457, "Name": null, "IsCanal": true, "IsTunnel": true, "AllBoats": false, "Notes": "Knarr" },
    { "X1": 2722, "Y1": -481, "X2": 2746, "Y2": -662, "Name": null, "IsCanal": true, "IsTunnel": true, "AllBoats": false, "Notes": "Knarr" },
    { "X1": 2937, "Y1": -441, "X2": 2923, "Y2": -614, "Name": null, "IsCanal": true, "IsTunnel": true, "AllBoats": false, "Notes": "Knarr" },
    { "X1": 3947, "Y1": -5397, "X2": 3963, "Y2": -5878, "Name": null, "IsCanal": true, "IsTunnel": false, "AllBoats": false, "Notes": "Knarr" },
    { "X1": 7105, "Y1": -4289, "X2": 7105, "Y2": -4031, "Name": null, "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": null },
    { "X1": 2650, "Y1": -4050, "X2": 2650, "Y2": -3244, "Name": null, "IsCanal": true, "IsTunnel": true, "AllBoats": false, "Notes": "KNarr & Small Boats" },
    { "X1": 4784, "Y1": -995, "X2": 4784, "Y2": -994, "Name": null, "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": null },
    { "X1": 4921, "Y1": -995, "X2": 4921, "Y2": -994, "Name": null, "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": null },
    { "X1": 4986, "Y1": -846, "X2": 4986, "Y2": -887, "Name": null, "IsCanal": true, "IsTunnel": false, "AllBoats": false, "Notes": null },
    { "X1": 6731, "Y1": -1284, "X2": 6775, "Y2": -1931, "Name": null, "IsCanal": false, "IsTunnel": true, "AllBoats": false, "Notes": "Walking Only - No boats" },
    { "X1": 537, "Y1": -7032, "X2": 585, "Y2": -7056, "Name": null, "IsCanal": false, "IsTunnel": true, "AllBoats": false, "Notes": "Land Only" },
    { "X1": 2152, "Y1": -1934, "X2": 2646, "Y2": -1928, "Name": null, "IsCanal": true, "IsTunnel": true, "AllBoats": false, "Notes": "knarr and smaller" },
    { "X1": 1174, "Y1": -6975, "X2": 1174, "Y2": -7020, "Name": null, "IsCanal": false, "IsTunnel": true, "AllBoats": false, "Notes": null },
    { "X1": 5517, "Y1": -1412, "X2": 5351, "Y2": -1482, "Name": "Ageless Tunnel", "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": "[5517-1412.125] to  [5351, -1482.5]  the Ageless Tunnel ( heritage site )" },
    { "X1": 6898, "Y1": -2358, "X2": 6732, "Y2": -2356, "Name": "Amish Creeks", "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": null },
    { "X1": 6964, "Y1": -2075, "X2": 6964, "Y2": -2280, "Name": "Amish Sanctuary Canal", "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": "ALL Boats" },
    { "X1": 4439, "Y1": -3615, "X2": 3688, "Y2": -3408, "Name": "Darq Canal", "IsCanal": true, "IsTunnel": true, "AllBoats": false, "Notes": "Knarr and Land only" },
    { "X1": 6691, "Y1": -2715, "X2": 6710, "Y2": -2862, "Name": "Eden Tunnel", "IsCanal": false, "IsTunnel": true, "AllBoats": null, "Notes": null },
    { "X1": 2185, "Y1": -3218, "X2": 2659, "Y2": -3220, "Name": "Fogshore Canal", "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": null },
    { "X1": 6881, "Y1": -2511, "X2": 6824, "Y2": -2511, "Name": "Huser Canal", "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": null },
    { "X1": 4053, "Y1": -2470, "X2": 4145, "Y2": -2441, "Name": "MK Tunnel", "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": "Boats Only" },
    { "X1": 4171, "Y1": -2345, "X2": 4321, "Y2": -2255, "Name": "MK Tunnel", "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": "Boats Only" },
    { "X1": 6597, "Y1": -1931, "X2": 6891, "Y2": -1931, "Name": "S/W Tunnel", "IsCanal": true, "IsTunnel": true, "AllBoats": false, "Notes": null },
    { "X1": 4336, "Y1": -4775, "X2": 4336, "Y2": -4752, "Name": "Snowtech's Lake Connection", "IsCanal": true, "IsTunnel": true, "AllBoats": false, "Notes": null },
    { "X1": 4830, "Y1": -4775, "X2": 4318, "Y2": -4775, "Name": "Snowtech's Tunnel", "IsCanal": true, "IsTunnel": true, "AllBoats": false, "Notes": null },
    { "X1": 5231, "Y1": -3316, "X2": 5231, "Y2": -3049, "Name": "T&T Tunnel", "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": "Boats and Land" },
    { "X1": 1721, "Y1": -4834, "X2": 1296, "Y2": -4833, "Name": "West Hammer Lake Canal 1", "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": null },
    { "X1": 1033, "Y1": -4738, "X2": 311, "Y2": -4736, "Name": "West Hammer Lake Canal 2", "IsCanal": true, "IsTunnel": true, "AllBoats": true, "Notes": null },
    { "X1": 6377, "Y1": -2322, "X2": 5800, "Y2": -2322, "Name": "Tunnel of Doom", "IsCanal": false, "IsTunnel": true, "AllBoats": false, "Notes": "NEXA Alliance Community Project" }
]

export interface CanalModuleLayer {
    generateSource(): any;
    styleFunction(feature, resolution): any[];
}

export class CanalLayer implements CanalModuleLayer {
    generateSource() {
        var canalSources = new ol.source.Vector();

        for (let canal of canals) {
            var canalFeature = new ol.Feature({
                geometry: new ol.geom.LineString([[canal.X1, canal.Y1], [canal.X2, canal.Y2]]),
                name: canal.Name,
                isCanal: canal.IsCanal,
                isTunnel: canal.IsTunnel,
                allBoats: canal.AllBoats,
            });

            canalSources.addFeature(canalFeature);
        }

        return canalSources;
    }

    styleFunction(feature, resolution) {
        var isCanal = feature.get('isCanal');
        var isTunnel = feature.get('isTunnel');
        var allBoats = feature.get('allBoats')

        let fontSize: number = resolution <= 0.125 ? 16 : 12;

        let canalName = feature.get('name') != null ? feature.get('name') : '';
        let canalText: string = `${canalName} `;

        if (isCanal === true && isTunnel === true) {
            canalText += `(${isCanal === true ? 'Canal /' : ''} ${isTunnel === true ? 'Tunnel /' : ''} ${allBoats === true ? 'All Boats' : 'Knarrs only'})`;
        }
        else if (isCanal === true && isTunnel === false) {
            canalText += `(${isCanal === true ? 'Canal /' : ''} ${allBoats === true ? 'All Boats' : 'Knarrs only'})`;
        }
        else if (isCanal === false && isTunnel === true) {
            canalText += `(Tunnel)`;
        }

        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 11 / resolution,
                    color: "rgba(0, 191, 255, 0.4)",
                }),
                text: new ol.style.Text({
                    font: '' + fontSize + 'px Calibri,sans-serif',
                    text: resolution < 8 ? canalText : '',
                    textBaseline: 'middle',
                    textAlign: 'center',
                    // offsetY: 12,
                    fill: new ol.style.Fill({
                        // color: '#FFF'
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