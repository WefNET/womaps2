
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DeedsService {
    private v4API = "https://sheets.googleapis.com/v4/spreadsheets";
    private sheetId = "1q9moPkLlk1qX6RqdtD2znTkTOlkFTNUkaoO1y7BVLZ8";
    private q1 = "ranges=Deeds!A2:C";
    private q2 = "ranges=Canals!A2:I";
    private q3 = "ranges=Bridges!A2:E";
    private q4 = "ranges=Landmarks!A2:D";
    private yourMotherSmokesCrack = "AIzaSyDi4nKWGegwmPuesj8GLa3kRaiFw0I-v2g";

    private _v4SheetsAPIXanaduCombinedData: string = `${this.v4API}/${this.sheetId}/values:batchGet?${this.q1}&${this.q2}&${this.q3}&${this.q4}&key=${this.yourMotherSmokesCrack}`;

    constructor(private http: HttpClient) { }

    getXanaduData() {
        return this.http.get(this._v4SheetsAPIXanaduCombinedData);
    }
}
    