/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 9/12/13
 * Time: 7:15 PM
 * To change this template use File | Settings | File Templates.
 */

app.filter('weekRange', function() {
    return function(input) {  // Input should be array of date strings
        var dateformat = "yyyy-MM-ddTHH:mm:ss.000Z";
        var weekRng;
        //console.log('input: '+input);
        var start = Date.parseExact(input, dateformat);
        var end = Date.parseExact(input, dateformat);
        if (!start) { // Check to make sure the parsing worked
            //console.log('first try is null');
            start = Date.parse(input);
            end = Date.parse(input);
            if (!start) return ''; // quit if we still can't parse
        }
        //console.log('start ' +start+ ' end ' +end);

        start.last().week().addDays(1); // 6 days ago is the start of the week range (ex. thur - wednesday)
        //end.last().wed();

        // If the dates are in same month then condense
        end = start.same().month(end) ? end.toString('dd') : end = end.toString('MMM dd');

        // Combine to get week range
        weekRng = start.toString('MMM dd') + '-' + end;
        return weekRng;
    }
});

app.filter('yesno', function() {
    return function(input) {
        return input ? 'Yes' : 'No';
    }
});

app.filter('truefalse', function() {
    return function(input) {
        return input ? 'True' : 'False';
    }
});