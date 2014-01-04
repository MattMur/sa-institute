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