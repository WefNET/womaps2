import { ICanal } from "../../../app.models";

declare var ol: any;

export interface CanalModuleLayer {
    generateSource(canals: ICanal[]): any;
    styleFunction(feature, resolution): any[];
}

export class CanalLayer implements CanalModuleLayer {
    generateSource(canals: ICanal[]) {
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