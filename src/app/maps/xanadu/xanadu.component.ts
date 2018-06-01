import { HostListener, AfterContentInit, AfterViewInit, Component, ElementRef, ViewChild, OnInit } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Dropdown } from 'primeng/dropdown';

import { DeedsService } from './../../services/deeds.service';

import { IDeed, IBoringDeed, IStartingDeed, ICanal, Constants, IBridge, ILandmark, ServerData, CustomColors } from './../../app.models';

// import { LandmarkLayer } from './layers/landmark.module'
// import { RoadLayer } from './layers/road.module'
import { StartingDeedLayer } from './layers/starting-towns.module';
import { BridgeLayer } from './layers/bridge-module';
import { CanalLayer } from './layers/canal-module';
import { GridLayer} from './layers/grid.module';
import { LandmarkLayer} from './layers/landmark-module';

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

    deeds: IBoringDeed[] = [];
    canals: ICanal[] = [];
    bridges: IBridge[] = [];
    landmarks: ILandmark[] = [];

    clickedUrlValue: string = "Single click anywhere on map to get shareable link";
    startingX: string;
    startingY: string;
    startingZ: string;

    deedsLayer: any;
    staringTownsLayer: any;
    gridLayer: any;
    canalLayer: any;
    bridgeLayer: any;
    landmarkLayer: any;

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

    drawingSource: any;
    drawingVector: any;
    displayDrawingTools: boolean = false;
    draw: any;
    snap: any;
    tools = [
        { label: 'None', value: 'None' },
        { label: 'Point', value: 'Point' },
        { label: 'LineString', value: 'LineString' },
        { label: 'Polygon', value: 'Polygon' },
        { label: 'Circle', value: 'Circle' },
        { label: 'Clear All', value: 'Clear' }
    ];

    displayAnchorTools: boolean = false;

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

        this.deedsService.getXanaduData()
            .subscribe(data => {
                var deeds = data["valueRanges"][0].values;

                deeds.forEach(deed => {
                    var d = new IBoringDeed();

                    d.name = deed[0];
                    d.x = deed[1];
                    d.y = deed[2];

                    this.deeds.push(d);
                });

                var canals = data["valueRanges"][1].values;

                canals.forEach(canal => {
                    var c = new ICanal();

                    // ["Ageless Tunnel", "5517", "-1412", "5351", "-1482", "TRUE", "TRUE", "TRUE"]
                    c.Name = canal[0];
                    c.X1 = canal[1];
                    c.Y1 = canal[2];
                    c.X2 = canal[3];
                    c.Y2 = canal[4];
                    c.IsCanal = canal[5] == "TRUE";
                    c.IsTunnel = canal[6] == "TRUE";
                    c.AllBoats = canal[7] == "TRUE";

                    this.canals.push(c);
                });

                var bridges = data["valueRanges"][2].values;

                bridges.forEach(bridge => {
                    var b = new IBridge();

                    b.Name = bridge[0];
                    b.X1 = bridge[1];
                    b.Y1 = bridge[2];
                    b.X2 = bridge[3];
                    b.Y2 = bridge[4];

                    this.bridges.push(b);
                });

                var landmarks = data["valueRanges"][3].values;

                landmarks.forEach(mark => {
                    var l = new ILandmark();

                    l.Name = mark[0];
                    l.X1 = mark[1];
                    l.Y1 = mark[2];
                    l.LandmarkType = mark[3];

                    this.landmarks.push(l);
                });

                // console.log("New Deeds", this.deeds);
                // console.log("New Canals", this.canals);
                // console.log("New Bridges", this.bridges);
                console.log("New Landmarks", this.landmarks);

                this.renderOpenLayers();
            })
    }

    renderOpenLayers(): void {
        console.log("Rendering function called");

        var controls = [
            new ol.control.MousePosition({
                undefinedHTML: 'outside',
                coordinateFormat: function (coordinate) {
                    return ol.coordinate.format(coordinate, '{x}, {y}', 0);
                }
            }),
            new ol.control.Zoom(),
            new ol.control.FullScreen(),
        ];

        // les bridges
        var bridgeModule = new BridgeLayer();

        this.bridgeLayer = new ol.layer.Vector({
            source: bridgeModule.generateSource(this.bridges),
            name: this.constants.BridgeLayerName,
            style: bridgeModule.styleFunction
        });

        // canal passages
        var canalModule = new CanalLayer();

        this.canalLayer = new ol.layer.Vector({
            source: canalModule.generateSource(this.canals),
            name: this.constants.CanalLayerName,
            style: canalModule.styleFunction
        })

        var gridModule = new GridLayer();

        this.gridLayer = new ol.layer.Vector({
            source: gridModule.generateSource(),
            name: this.constants.GridLayerName,
            style: gridModule.styleFunction
        })

        // landmark layer
        
        var lml = new LandmarkLayer();

        this.landmarkLayer = new ol.layer.Vector({
          source: lml.generateSource(this.landmarks),
          name: this.constants.LandmarkLayerName,
          style: lml.styleFunction
        })

        // starter towns
        var sdm = new StartingDeedLayer();

        this.staringTownsLayer = new ol.layer.Vector({
            source: sdm.generateSource(),
            name: this.constants.StarterDeedsLayerName,
            style: sdm.styleFunction
        });

        var deedsSrc = new ol.source.Vector();

        var deedStyleFunction = function (feature, resolution) {
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

        this.drawingSource = new ol.source.Vector();
        this.drawingVector = new ol.layer.Vector({
            name: "Drawing Layer",
            source: this.drawingSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
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
                this.landmarkLayer,
                this.bridgeLayer,
                this.canalLayer,
                this.deedsLayer,
                this.staringTownsLayer,
                this.drawingVector
            ],
            target: 'map',
            controls: controls,
            view: new ol.View({
                zoom: this.startingZ != null ? this.startingZ : 2,
                center: [this.startingX != null ? this.startingX : 4096, this.startingY != null ? this.startingY : -4096],
                maxResolution: mapTileGrid.getResolution(mapMinZoom)
            })
        });

        // var modify = new ol.interaction.Modify({ source: this.drawingSource });
        // this.map.addInteraction(modify);

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
                console.log("Feature Geometry", feature.getGeometry());
            });

            console.log("Clicked Url", this.clickedUrlValue);

        }.bind(this));
    }

    // After view init the map target can be set!
    ngAfterViewInit() {
        //this.map.setTarget(this.mapElement.nativeElement.id);
    }

    setMap() {
        //this.map.setTarget(this.mapElement.nativeElement.id);
    }

    addInteractions = function (selectedDrawingTool: string) {

        this.draw = new ol.interaction.Draw({
            source: this.drawingSource,
            type: selectedDrawingTool
            // type: "LineString"
        });

        this.map.addInteraction(this.draw);
        this.snap = new ol.interaction.Snap({ source: this.drawingSource });

        console.log("Draw", this.draw);
        console.log("Snap", this.snap);

        this.map.addInteraction(this.snap);
    }

    showDrawingTools() {
        this.displayDrawingTools = !this.displayDrawingTools;
    }

    selectTool(event: Event) {
        this.map.removeInteraction(this.draw);
        this.map.removeInteraction(this.snap);

        let tool: string = this.tools[event["index"]].value;

        if (tool === "None") {
            // oh well
        }
        else {
            if (tool === "Clear") {
                this.drawingSource.clear();


            }
            else {
                this.addInteractions(tool);
            }
        }
    }

    showAnchorTools() {
        this.displayAnchorTools = !this.displayAnchorTools;
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