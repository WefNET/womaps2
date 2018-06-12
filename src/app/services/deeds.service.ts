
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DeedsService {
    private v4API = "https://sheets.googleapis.com/v4/spreadsheets";
    private xanaduSheetId = "1q9moPkLlk1qX6RqdtD2znTkTOlkFTNUkaoO1y7BVLZ8";
    private deliSheetId = "1MrF3IBS6988rsFecQhWqwzkQpRfKAoDZ1anmjVuAylw";
    private q1 = "ranges=Deeds!A2:C";
    private q2 = "ranges=Canals!A2:I";
    private q3 = "ranges=Bridges!A2:E";
    private q4 = "ranges=Landmarks!A2:D";
    private q5 = "ranges=Highways!A2:B";
    private yourMotherSmokesCrack = "AIzaSyDi4nKWGegwmPuesj8GLa3kRaiFw0I-v2g";

    private _v4SheetsAPIXanaduCombinedData: string = `${this.v4API}/${this.xanaduSheetId}/values:batchGet?${this.q1}&${this.q2}&${this.q3}&${this.q4}&key=${this.yourMotherSmokesCrack}`;
    private _v4SheetsAPIDeliCombinedData: string = `${this.v4API}/${this.deliSheetId}/values:batchGet?${this.q1}&${this.q2}&${this.q3}&${this.q4}&${this.q5}&key=${this.yourMotherSmokesCrack}`;

    constructor(private http: HttpClient) { }

    getXanaduData() {
        return this.http.get(this._v4SheetsAPIXanaduCombinedData);
    }

    getDeliData() {
        return this.http.get(this._v4SheetsAPIDeliCombinedData);
    }
}
    