
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IDeed, IBoringDeed, IStartingDeed, ServerData } from './../app.models'

@Injectable()
export class DeedsService {
    private _sheetXanaduDeeds: string = 'http://gsx2json.com/api?id=1q9moPkLlk1qX6RqdtD2znTkTOlkFTNUkaoO1y7BVLZ8&sheet=1&columns=false';

    constructor(private _http: HttpClient) { }

    getXanaduDeeds() {
        return this._http.get(this._sheetXanaduDeeds)
    }
}
