import {
    Pipe,
    PipeTransform
} from '@angular/core';

@Pipe({
    name: 'searchVideoTimeline'
})
export class SearchVideoTimelinePipe implements PipeTransform {

    public transform(value, keys: string, term: any) {
        let team = term[0];//team
        let event = term[1];//event
        let search = term[2];//search field
        console.log('team', team);
        console.log('event', event);
        console.log('search', search);

        let fData = (value || []).filter((item) => {
            if (event && event.length) {
                if (event.indexOf(item['key']) > -1) {
                    return true
                } else return false
            } else if (search) {
                if (item['key'].toLowerCase().indexOf(search.toLowerCase()) != -1)
                    return true
                else {
                    let valF = false;
                    item['values'].filter((val) => {
                        if (val.team.toLowerCase().indexOf(search.toLowerCase()) != -1) {
                            valF = true;
                        }
                    })
                    return valF;
                }
            }
            else return true
        });
        // console.log(fData);
        return fData;
    }
}
