
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IDeed, IBoringDeed, IStartingDeed, ServerData } from './../app.models'

@Injectable()
export class DeedsService {
    private _sheetXanaduDeeds: string = 'http://gsx2json.com/api?id=1q9moPkLlk1qX6RqdtD2znTkTOlkFTNUkaoO1y7BVLZ8&sheet=1&columns=false';
    private _v4SheetsAPIXanaduCombinedData: string = "https://sheets.googleapis.com/v4/spreadsheets/1q9moPkLlk1qX6RqdtD2znTkTOlkFTNUkaoO1y7BVLZ8/values:batchGet?ranges=Deeds!A2:C&ranges=Canals!A2:I&ranges=Bridges!A2:E&key=AIzaSyDi4nKWGegwmPuesj8GLa3kRaiFw0I-v2g";

    constructor(private _http: HttpClient) { }

    getXanaduDeeds() {
        return this._http.get(this._sheetXanaduDeeds)
    }

    getXanaduData() {
        return this._http.get(this._v4SheetsAPIXanaduCombinedData);
    }
}
