export interface IDeed {
    ID: number;
    Server: number;
    X: number;
    Y: number;
    Name: string;
    Notes: string;
}

export class IBoringDeed {
    name: string;
    x: number;
    y: number
}

export interface ServerData {
    Deeds: IDeed[];
    Canals: ICanal[];
    Bridges: IBridge[];
    Landmarks: ILandmark[];
}

export enum LandmarkType {
    GuardTower,
    BodyOfWater
}

export interface IStartingDeed {
    Name: string;
    X: number;
    Y: number;
}

export class ICanal {
    ID: number;
    Server: number;
    X1: number;
    Y1: number;
    X2: number;
    Y2: number;
    Name: string;
    IsCanal: boolean;
    IsTunnel: boolean;            
    AllBoats: boolean;
    Notes: string;
}

export class IBridge {
    Name: string;
    X1: number;
    Y1: number;
    X2: number;
    Y2: number;
}

export interface ILandmark {
    ID: number;
    LandmarkType: LandmarkType;
    Server: number;
    X1: number;
    Y1: number;
    Name: string;
    Notes: string;
}

declare var ol: any;

export class Constants {
    StarterDeedsLayerName: string = "Starter Deeds Layer";
    DeedLayerName: string = "Deeds Layer";
    GridLayerName: string = "Grid Layer";
    GuardTowerLayerName: string = "Guard Tower Layer";
    CanalLayerName: string = "Canal Layer";
    BridgeLayerName: string = "Bridge Layer";
    Nov16TerrainLayerName: string = "Terrain (2016 Nov)";
    Nov16IsoLayerName: string = "Isometric (2016 Nov)";
    Nov16TopoLayerName: string = "Topological (2016 Nov)";
    TerrainLayerName: string = "Terrain (2017 Aug)";
    IsoLayerName: string = "Isometric (2017 Aug)";
    TopoLayerName: string = "Topological (2017 Aug)";
    Jan18TerrainLayerName: string = "Terrain (2018 Jan)";
    Jan18IsoLayerName: string = "Isometric (2018 Jan)";
    Jan18TopoLayerName: string = "Topological (2018 Jan)";
    Jan18RoutesLayerName: string = "Routes (2018 Jan)";

    defaultTextFill: any = new ol.style.Fill({
        // color: '#FFF'
        color: "White"
    });

    defaultTextStroke: any = new ol.style.Stroke({
        color: 'Black',
        width: 1
    });
}

export var CustomColors =  [
    {
        code: "rgba(255, 0, 0, 0.4)",
        name: "Red (Default)"
    },
    {
        code: "rgba(0, 255, 0, 0.4)",
        name: "Green"
    },
    {
        code: "rgba(0, 0, 255, 0.4)",
        name: "Blue"
    },
    {
        code: "rgba(0, 191, 255, 0.4)",
        name: "Cesium"
    },
    {
        code: "rgba(179, 170, 0, 0.4)",
        name: "Puke Green"
    },
    {
        code: "rgba(139, 69, 19, 0.4)",
        name: "Saddle Brown"
    },
    {
        code: "rgba(255, 255, 0, 0.4)",
        name: "Old Yeller"
    },
    {
        code: "rgba(255, 0, 255, 0.4)",
        name: "Fuchsia"
    },
    {
        code: "rgba(75, 0, 130, 0.4)",
        name: "Mood Indigo"
    },
    {
        code: "rgba(0, 0, 0, 0.4)",
        name: "Negroni"
    },

]