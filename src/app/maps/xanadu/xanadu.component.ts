// import { Component, OnInit } from '@angular/core';
import { HostListener, AfterContentInit, AfterViewInit, Component, ElementRef, ViewChild, OnInit } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { DeedsService } from './../../services/deeds.service';

import { IDeed, IBoringDeed, IStartingDeed, ICanal, Constants, IBridge, ILandmark, ServerData, CustomColors } from './../../app.models';

// import { LandmarkLayer } from './layers/landmark.module'
// import { RoadLayer } from './layers/road.module'
import { StartingDeedLayer } from './layers/starting-towns.module'
import { BridgeLayer } from './layers/bridge-module'
import { CanalLayer } from './layers/canal-module'

// This is necessary to access ol3!
declare var ol: any;

@Component({
    selector: 'xanadu-map',
    templateUrl: 'xanadu.html',
    styleUrls: ['./../maps.css']
})

export class XanaduComponent implements OnInit, AfterViewInit {

    // This is necessary to access the html element to set the map target (after view init)!
    @ViewChild("mapElement") mapElement: ElementRef;

    canvas: any;
    context: any;
    pixelRatio: any;

    constants: Constants = new Constants();

    map: any;
    deeds: IBoringDeed[];
    canals: ICanal[];
    bridges: IBridge[];
    landmarks: ILandmark[];

    clickedUrlValue: string;
    startingX: string;
    startingY: string;
    startingZ: string;

    deedsLayer: any;
    staringTownsLayer: any;
    gridLayer: any;
    canalLayer: any;
    bridgeLayer: any;
    // landmarkLayer: any;

    oldTerrainRaster: any;
    oldTopoRaster: any;
    oldIsoRaster: any;

    newTerrainRaster: any;
    newTopoRaster: any;
    newIsoRaster: any;

    Jan18TerrainRaster: any;
    Jan18TopoRaster: any;
    Jan18IsoRaster: any;
    Jan18RouteRaster: any;

    currentRaster: string = this.constants.Jan18TerrainLayerName;

    customColors: any[] = CustomColors;
    deedColor: string;
    canalColor: string;
    bridgeColor: string = "rgba(255, 0, 255, 0.4)";

    showGrid: boolean = false;
    showDeeds: boolean = true;
    showStartingDeeds: boolean = true;
    showCanals: boolean = true;
    showBridges: boolean = true;

    dFill: any = this.constants.defaultTextFill;
    dText: any = this.constants.defaultTextStroke;

    visibleSidebar1: boolean = false;

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {

        // c or C
        if (event.keyCode === 99 || event.keyCode === 67) {
            this.hideAllLayers();
            // ...
            if (this.currentRaster === this.constants.Jan18RoutesLayerName) {
                this.oldTerrainRaster.setVisible(true);
                this.currentRaster = this.constants.Nov16TerrainLayerName;
            } else if (this.currentRaster === this.constants.Nov16TerrainLayerName) {
                this.oldIsoRaster.setVisible(true);
                this.currentRaster = this.constants.Nov16IsoLayerName;
            } else if (this.currentRaster === this.constants.Nov16IsoLayerName) {
                this.oldTopoRaster.setVisible(true);
                this.currentRaster = this.constants.Nov16TopoLayerName;
            } else if (this.currentRaster === this.constants.Nov16TopoLayerName) {
                this.newTerrainRaster.setVisible(true);
                this.currentRaster = this.constants.TerrainLayerName;
            } else if (this.currentRaster === this.constants.TerrainLayerName) {
                this.newIsoRaster.setVisible(true);
                this.currentRaster = this.constants.IsoLayerName;
            } else if (this.currentRaster === this.constants.IsoLayerName) {
                this.newTopoRaster.setVisible(true);
                this.currentRaster = this.constants.TopoLayerName;
            }
            else if (this.currentRaster === this.constants.TopoLayerName) {
                this.Jan18TerrainRaster.setVisible(true);
                this.currentRaster = this.constants.Jan18TerrainLayerName;
            }
            else if (this.currentRaster === this.constants.Jan18TerrainLayerName) {
                this.Jan18IsoRaster.setVisible(true);
                this.currentRaster = this.constants.Jan18IsoLayerName;
            }
            else if (this.currentRaster === this.constants.Jan18IsoLayerName) {
                this.Jan18TopoRaster.setVisible(true);
                this.currentRaster = this.constants.Jan18TopoLayerName;
            }
            else {
                this.Jan18RouteRaster.setVisible(true);
                this.currentRaster = this.constants.Jan18RoutesLayerName;
            }
        }

        // g or G
        if (event.keyCode === 103 || event.keyCode === 71) {
            this.toggleLayer(null, this.constants.GridLayerName);
        }

        // s or S
        if (event.keyCode === 115 || event.keyCode === 83) {
            this.toggleLayer(null, this.constants.StarterDeedsLayerName);
        }

        // d or D
        if (event.keyCode === 100 || event.keyCode === 68) {
            this.toggleLayer(null, this.constants.DeedLayerName);
        }

        // b or B
        if (event.keyCode === 98 || event.keyCode === 66) {
            this.toggleLayer(null, this.constants.BridgeLayerName);
        }

        // t or T
        if (event.keyCode === 116 || event.keyCode === 84) {
            this.toggleLayer(null, this.constants.CanalLayerName);
        }
    }

    constructor(private deedsService: DeedsService, private route: ActivatedRoute, private title: Title) {
        title.setTitle("Xanadu - WurmOnlineMaps.com")
    }

    ngOnInit(): void {
        console.log("Custom Styles", this.constants.defaultTextFill)

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.pixelRatio = ol.has.DEVICE_PIXEL_RATIO;

        console.log("PixelRatio", this.pixelRatio);

        this.route
            .queryParams
            .subscribe(params => {
                this.startingX = params["x"];
                this.startingY = params["y"];
                this.startingZ = params["z"];
            });

        // this.deedsService.getData()
        //     .subscribe(data => {
        //         this.renderOpenLayers(data);
        //     })

        this.deedsService.getXanaduDeeds()
            .subscribe(data => {
                this.deeds = data['rows']

                console.log("Deeds", this.deeds);
                this.renderOpenLayers();
            })
    }

    renderOpenLayers(): void {
        console.log("Rendering function called");

        // this.deeds = data;
        // this.canals = data.Canals;
        // this.bridges = data.Bridges;
        // this.landmarks = data.Landmarks;

        var controls = [
            // new ol.control.Attribution(),
            new ol.control.MousePosition({
                undefinedHTML: 'outside',
                coordinateFormat: function (coordinate) {
                    return ol.coordinate.format(coordinate, '{x}, {y}', 0);
                }
            }),
            new ol.control.Zoom(),
            new ol.control.FullScreen(),
        ];

        // les bridge
        var bridgeModule = new BridgeLayer();

        this.bridgeLayer = new ol.layer.Vector({
            source: bridgeModule.generateSource(),
            name: this.constants.BridgeLayerName,
            style: bridgeModule.styleFunction
        });

        // canal passages
        var canalModule = new CanalLayer();

        this.canalLayer = new ol.layer.Vector({
            source: canalModule.generateSource(),
            name: this.constants.CanalLayerName,
            style: canalModule.styleFunction
        })

        // guard tower feature
        var gts = [
            [6323, -2046],
            [6533, -1986],
            [6472, -2015],
            [6584, -1992]
        ];

        let lms = [
            {
                ID: 0,
                LandmarkType: 0,
                Server: 0,
                X1: 6323,
                Y1: -2046,
                Name: "Who cares?",
                Notes: ""
            },
            {
                ID: 1,
                LandmarkType: 1,
                Server: 0,
                X1: 6535,
                Y1: -1935,
                Name: "Lake Awesome",
                Notes: ""
            },
            {
                ID: 2,
                LandmarkType: 1,
                Server: 0,
                X1: 6643,
                Y1: -2428,
                Name: "Summerholt Lake",
                Notes: ""
            },
        ]

        // var lml = new LandmarkLayer();

        // this.landmarkLayer = new ol.layer.Vector({
        //   source: lml.generateSource(lms),
        //   name: this.constants.GuardTowerLayerName,
        //   style: lml.styleFunction
        // })

        // var rml = new RoadLayer();

        // var roadLayer = new ol.layer.Vector({
        //     source: rml.generateSource(),
        //     name: "Roads",
        //     style: rml.styleFunction
        // })

        // grid layer stuff
        var gridSrc = new ol.source.Vector();

        var gridLineStyleFunction = function (feature, resolution) {
            // console.log("Resolution", resolution);

            var fontSize = (14 / resolution) + 16;

            if (resolution >= 16) {
                fontSize = 8;
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
        };

        // grid lines 
        var gridJSON = [];

        // horiz
        for (var x = 0; x < 20; x++) {
            var y = -((x * 410) + 362);
            gridJSON.push({
                "StartX": 0, "StartY": y, "EndX": 8192, "EndY": y
            });

            var horizLineFeature = new ol.Feature({
                geometry: new ol.geom.LineString([[0, y], [8192, y]]),
                name: ""
            });

            gridSrc.addFeature(horizLineFeature);
        }

        // vertical
        for (var y = 0; y < 20; y++) {
            var x = (y * 410) + 362;
            gridJSON.push({
                "StartX": x, "StartY": 0, "EndX": x, "EndY": -8192
            });

            var vertLineFeature = new ol.Feature({
                geometry: new ol.geom.LineString([[x, 0], [x, -8192]]),
                name: ""
            });

            gridSrc.addFeature(vertLineFeature);
        }

        // grid text
        var gridPoints = [];
        var gridX = ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U"];

        for (var x = 0; x < 20; x++) {
            var yC = -(x * 410) + 50;

            for (var y = 0; y < 20; y++) {
                var xC = (y * 410) - 40;

                var yDisplay = y + 7;
                var gridID = gridX[x] + " " + yDisplay;
                gridPoints.push({ "cX": xC, "cY": yC, "GridID": gridID });

                var gridNameFeature = new ol.Feature({
                    geometry: new ol.geom.Point([xC + 205, yC - 205]),
                    name: gridID
                });

                gridSrc.addFeature(gridNameFeature);
            }
        }

        this.gridLayer = new ol.layer.Vector({
            source: gridSrc,
            name: this.constants.GridLayerName,
            style: gridLineStyleFunction
        });

        // starter towns
        var sdm = new StartingDeedLayer();

        this.staringTownsLayer = new ol.layer.Vector({
            source: sdm.generateSource(),
            name: this.constants.StarterDeedsLayerName,
            style: sdm.styleFunction
        });

        var deedsSrc = new ol.source.Vector();

        var deedStyleFunction = function (feature, resolution) {
            // console.log("Resolution", resolution);      

            let fontSize: number = resolution <= 0.125 ? 16 : 12;
            let name: string = feature.get('name');
            let notes: string = feature.get('notes');
            let isMarket: boolean = notes != null ? notes.toLowerCase().indexOf("market") >= 0 : false;

            return [
                new ol.style.Style({
                    image: new ol.style.RegularShape({
                        points: 4,
                        radius: (11 / resolution) + 4,
                        angle: Math.PI / 4,
                        fill: new ol.style.Fill({
                            color: "rgba(255, 0, 0, 0.4)"
                        }),
                        stroke: new ol.style.Stroke({
                            color: isMarket ? "White" : "transparent",
                            width: isMarket ? 3 : 0,
                        })
                    }),
                    text: new ol.style.Text({
                        font: '' + fontSize + 'px Calibri,sans-serif',
                        text: resolution < 4 ? feature.get('name') : '',
                        textBaseline: 'middle',
                        textAlign: 'center',
                        fill: new ol.style.Fill({
                            color: "White"
                        }),
                        stroke: new ol.style.Stroke({
                            color: "Black",
                            width: 1
                        })
                    })
                })
            ]
        }.bind(this);

        for (let deed of this.deeds) {
            if (deed.name == "Summerholt" ||
                deed.name == "Greymead" ||
                deed.name == "Whitefay" ||
                deed.name == "Glasshollow" ||
                deed.name == "Newspring" ||
                deed.name == "Esteron" ||
                deed.name == "Linton" ||
                deed.name == "Lormere" ||
                deed.name == "Vrock Landing") {
                continue;
            }

            var deedFeature = new ol.Feature({
                geometry: new ol.geom.Point([deed.x, deed.y]),
                name: deed.name,
            });

            deedsSrc.addFeature(deedFeature);
        }

        this.deedsLayer = new ol.layer.Vector({
            source: deedsSrc,
            name: this.constants.DeedLayerName,
            style: deedStyleFunction
        });

        // oh shit the real map code kinda starts here!
        var mapExtent = [0.00000000, -8192.00000000, 8192.00000000, 0.00000000];
        var mapMinZoom = 0;
        var mapMaxZoom = 5;
        var mapMaxResolution = 1.00000000;
        var tileExtent = [0.00000000, -8192.00000000, 8192.00000000, 0.00000000];

        var mapResolutions = [];

        for (var z = 0; z <= mapMaxZoom; z++) {
            mapResolutions.push(Math.pow(2, mapMaxZoom - z) * mapMaxResolution);
        }

        var mapTileGrid = new ol.tilegrid.TileGrid({
            extent: tileExtent,
            minZoom: mapMinZoom,
            resolutions: mapResolutions
        });

        this.oldTerrainRaster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: "http://jackswurmtools.com/Content/tiles/xan-1611/terra/{z}/{x}/{y}.png",
                tileGrid: mapTileGrid,
            }),
            name: this.constants.Nov16TerrainLayerName,
        });

        this.oldIsoRaster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: "http://jackswurmtools.com/Content/tiles/xan-1611/iso/{z}/{x}/{y}.png",
                tileGrid: mapTileGrid,
            }),
            name: this.constants.Nov16IsoLayerName,
        });

        this.oldTopoRaster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: "http://jackswurmtools.com/Content/tiles/xan-1611/topo/{z}/{x}/{y}.png",
                tileGrid: mapTileGrid,
            }),
            name: this.constants.Nov16TopoLayerName,
        });

        this.newTerrainRaster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: "http://jackswurmtools.com/Content/tiles/xan-1708/terrain/{z}/{x}/{y}.png",
                tileGrid: mapTileGrid,
            }),
            name: this.constants.TerrainLayerName,
        });

        this.newIsoRaster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: "http://jackswurmtools.com/Content/tiles/xan-1708/iso/{z}/{x}/{y}.png",
                tileGrid: mapTileGrid,
            }),
            name: this.constants.IsoLayerName,
        });

        this.newTopoRaster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: "http://jackswurmtools.com/Content/tiles/xan-1708/topo/{z}/{x}/{y}.png",
                tileGrid: mapTileGrid,
            }),
            name: this.constants.TopoLayerName,
        });

        this.Jan18IsoRaster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: "http://jackswurmtools.com/Content/tiles/xan-1801/iso/{z}/{x}/{y}.png",
                tileGrid: mapTileGrid,
            }),
            name: this.constants.Jan18IsoLayerName,
        });

        this.Jan18TopoRaster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: "http://jackswurmtools.com/Content/tiles/xan-1801/topo/{z}/{x}/{y}.png",
                tileGrid: mapTileGrid,
            }),
            name: this.constants.Jan18TopoLayerName,
        });

        this.Jan18TerrainRaster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: "http://jackswurmtools.com/Content/tiles/xan-1801/terrain/{z}/{x}/{y}.png",
                tileGrid: mapTileGrid,
            }),
            name: this.constants.Jan18TerrainLayerName,
        });

        this.Jan18RouteRaster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: "http://jackswurmtools.com/Content/tiles/xan-1801/routes/{z}/{x}/{y}.png",
                tileGrid: mapTileGrid,
            }),
            name: this.constants.Jan18RoutesLayerName,
        });

        this.hideAllLayers();
        this.Jan18TerrainRaster.setVisible(true);

        this.map = new ol.Map({
            layers: [
                this.newTerrainRaster,
                this.newIsoRaster,
                this.newTopoRaster,
                this.oldTerrainRaster,
                this.oldIsoRaster,
                this.oldTopoRaster,
                this.Jan18IsoRaster,
                this.Jan18TopoRaster,
                this.Jan18TerrainRaster,
                this.Jan18RouteRaster,
                // roadLayer,
                this.bridgeLayer,
                this.canalLayer,
                this.deedsLayer,
                this.staringTownsLayer,
            ],
            target: 'map',
            controls: controls,
            view: new ol.View({
                zoom: this.startingZ != null ? this.startingZ : 2,
                center: [this.startingX != null ? this.startingX : 4096, this.startingY != null ? this.startingY : -4096],
                maxResolution: mapTileGrid.getResolution(mapMinZoom)
            })
        });

        this.map.on('singleclick', function (evt) {
            console.log("Event", evt);

            var coord = evt["coordinate"];
            console.log("Coords", coord)

            console.log("Map", evt.map);

            let zoom = evt.map.getView().getZoom();
            console.log("Zoom", zoom);

            var x = parseInt(coord[0]);
            var y = parseInt(coord[1]);

            this.clickedUrlValue = `http://wurmonlinemaps.com/xanadu?x=${x}&y=${y}&z=${zoom}`;

            console.log("Event target", evt.target);

            evt.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                //do something
                console.log("Feature at pixel", feature);
                console.log("Feature Goom", feature.getGeometry());
            });

            console.log("Clicked Url", this.clickedUrlValue);

            // prompt("Return URL:", this.clickedUrlValue);
        });
    }

    // After view init the map target can be set!
    ngAfterViewInit() {
        //this.map.setTarget(this.mapElement.nativeElement.id);
    }

    setMap() {
        //this.map.setTarget(this.mapElement.nativeElement.id);
    }

    toggleLayer(event: any, layerName: string) {

        let group = this.map.getLayerGroup();
        let layers = group.getLayers();

        let layerExists: boolean = false;

        layers.forEach(layer => {
            let name = layer.get('name');

            if (name == layerName) {
                layerExists = true;
            }
        });

        if (layerExists) {
            switch (layerName) {
                case this.constants.DeedLayerName:
                    {
                        this.map.removeLayer(this.deedsLayer);
                        this.showDeeds = false;
                        break;
                    }
                case this.constants.StarterDeedsLayerName:
                    {
                        this.map.removeLayer(this.staringTownsLayer);
                        this.showStartingDeeds = false;
                        break;
                    }
                case this.constants.GridLayerName:
                    {
                        this.map.removeLayer(this.gridLayer);
                        this.showGrid = !this.showGrid;
                        break;
                    }
                case this.constants.CanalLayerName:
                    {
                        this.map.removeLayer(this.canalLayer);
                        this.showCanals = false;
                        break;
                    }
                case this.constants.BridgeLayerName:
                    {
                        this.map.removeLayer(this.bridgeLayer);
                        this.showBridges = false;
                        break;
                    }
                default: {
                    console.log("Layer name not found for removal process.", layerName);
                }
            }
        }
        else {
            switch (layerName) {
                case this.constants.DeedLayerName:
                    {
                        this.map.addLayer(this.deedsLayer);
                        this.showDeeds = true;
                        break;
                    }
                case this.constants.StarterDeedsLayerName:
                    {
                        this.map.addLayer(this.staringTownsLayer);
                        this.showStartingDeeds = true;
                        break;
                    }
                case this.constants.GridLayerName:
                    {
                        this.map.addLayer(this.gridLayer);
                        this.showGrid = true;
                        break;
                    }
                case this.constants.CanalLayerName:
                    {
                        this.map.addLayer(this.canalLayer);
                        this.showCanals = true;
                        break;
                    }
                case this.constants.BridgeLayerName:
                    {
                        this.map.addLayer(this.bridgeLayer);
                        this.showBridges = true;
                        break;
                    }
                default: {
                    console.log("Layer name not found for add process,", layerName);
                }
            }
        }
    }

    gotoDeed(event: any, id: number) {

        let deed = this.deeds[id];

        console.log("Find a deed, deed found:", deed);

        var extent = [deed.x - 100, deed.y - 100, deed.x + 100, deed.y + 100];
        console.log("Find a deed Extent:", extent);
        var view = this.map.getView();
        console.log("Find a deed View:", view);
        var size = this.map.getSize();
        console.log("Find a deed Size:", size);

        view.fit(extent, size);
    }


    selectchange(args) {

        let deed = this.deeds[args.target.value];

        console.log("Find a deed, deed found:", deed);

        var extent = [deed.x - 100, deed.y - 100, deed.x + 100, deed.y + 100];
        console.log("Find a deed Extent:", extent);
        var view = this.map.getView();
        console.log("Find a deed View:", view);
        var size = this.map.getSize();
        console.log("Find a deed Size:", size);

        view.fit(extent, size);
    }

    mainLayer(id: number) {
        this.hideAllLayers();

        if (id === 0) {
            this.oldTerrainRaster.setVisible(true);
            this.currentRaster = this.constants.Nov16TerrainLayerName;
        } else if (id === 1) {
            this.oldIsoRaster.setVisible(true);
            this.currentRaster = this.constants.Nov16IsoLayerName;
        } else if (id === 2) {
            this.oldTopoRaster.setVisible(true);
            this.currentRaster = this.constants.Nov16TopoLayerName;
        } else if (id === 3) {
            this.newTerrainRaster.setVisible(true);
            this.currentRaster = this.constants.TerrainLayerName;
        } else if (id === 4) {
            this.newIsoRaster.setVisible(true);
            this.currentRaster = this.constants.IsoLayerName;
        } else if (id === 5) {
            this.newTopoRaster.setVisible(true);
            this.currentRaster = this.constants.TopoLayerName;
        } else if (id === 6) {
            this.Jan18TerrainRaster.setVisible(true);
            this.currentRaster = this.constants.Jan18TerrainLayerName;
        } else if (id === 7) {
            this.Jan18IsoRaster.setVisible(true);
            this.currentRaster = this.constants.Jan18IsoLayerName;
        } else if (id === 8) {
            this.Jan18TopoRaster.setVisible(true);
            this.currentRaster = this.constants.Jan18TopoLayerName;
        } else if (id === 9) {
            this.Jan18RouteRaster.setVisible(true);
            this.currentRaster = this.constants.Jan18RoutesLayerName;
        }

    }

    hideAllLayers() {
        this.newIsoRaster.setVisible(false);
        this.newTopoRaster.setVisible(false);
        this.newTerrainRaster.setVisible(false);
        this.oldTerrainRaster.setVisible(false);
        this.oldIsoRaster.setVisible(false);
        this.oldTopoRaster.setVisible(false);
        this.Jan18IsoRaster.setVisible(false);
        this.Jan18TerrainRaster.setVisible(false);
        this.Jan18TopoRaster.setVisible(false);
        this.Jan18RouteRaster.setVisible(false);
    }
} // end comp