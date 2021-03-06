/**
 * An object used to get page information from the server
 */
export class Page {
    //The number of elements in the page
    public limit: number = 20;
    //The total number of elements
    public totalElements: number = 0;
    //The total number of pages
    public totalPages: number = 0;
    //The current page number
    public pageNumber: number = 0;

    public sort: String = '';
    public sortDir: String = '';
    public filterClub: String;
    public filterTeam: String;

    constructor() { }
}