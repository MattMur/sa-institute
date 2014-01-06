/**
 * Created by mattmurray on 10/17/13.
 */

// Create CSV file of email contacts, then download it.
app.factory('exportCSV', function() {
    return function(users, fileName) {
        if (typeof fileName !== 'string') return;
        if (!users || users.length == 0) return;
        var csv = "First Name,Last Name,E-mail Address,Mobile Phone\n";
        for (var i=0; i < users.length; i++) {
            csv += (users[i].first_name || '') +','
                + (users[i].last_name || '') +','
                + (users[i].email || '') +','
                + (users[i].phone || '');
            csv += '\n';
        }
        var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName+".csv");
    }

});

app.factory('uploadSyllabus', [ '$upload', function($upload) {

    return function(file, name, callback) {
        console.log('Uploading to server: ' +JSON.stringify(file));

        if (file) {
            $upload.upload({
                url: '/api/class/syllabus', //upload.php script, node.js route, or servlet url
                method: 'PUT',
                // headers: {'headerKey': 'headerValue'}, withCredential: true,
                data: {name: name},
                file: file,
                // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                fileFormDataName: 'syllabus'
                /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                //formDataAppender: function(formData, key, val){}
            }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(callback).error(function(err) {
                    alert('Could Not complete upload of syllabus. \n'+err);
                });
            //.then(success, error, progress);
        }
    }
}]);


app.factory('checkValidFileType', function() {

    return function(fileName, typeExpected) {
        var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
        console.log('Extention given: '+ext +'\nExpected: '+typeExpected);
        var regex = new RegExp('[\\.]?'+ext, 'i'); // Allow for optional '.' before extention
        var isValid = typeExpected.match(regex) ? true : false;
        console.log('isValid: '+isValid);
        return isValid;
    }
});

// Orders array of items into new array of array by week. Items must have property 'week_number'
app.factory('orderByWeek', function() {

    return function(items) {
        var index = -1, itemsByWeek = [], curWeek = 0, item;
        if (items.length > 0) {
            // File items into array by week_number
            for (var i = 0; i < items.length; i++) {

                item = items[i];
                //console.log('item#: ' + (i+1) + ' week: ' + item.week_number + ' currentWeek: '+curWeek);
                if (curWeek >= item.week_number) { // if current studycard belongs to current week
                    itemsByWeek[index].push(item); // Add studycard to that week's array
                } else {
                    // Else move to next week  (where we have card data for that week)
                    //console.log('Going to week ' + item.week_number);
                    var newWeek = [item]; // create new array for new week
                    newWeek.week_number = item.week_number;
                    curWeek = item.week_number;
                    itemsByWeek[++index] = newWeek;
                }
            }
        }
        //console.log('Items By Week:\n'+JSON.stringify(itemsByWeek));
        return itemsByWeek;
    }
});