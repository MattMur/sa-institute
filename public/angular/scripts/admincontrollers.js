/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 9/15/13
 * Time: 6:46 PM
 * To change this template use File | Settings | File Templates.
 */

app.controller('AdminViewClassesCntrl', function ($scope, $http) {

    $http.get('/api/class').success(function(data) {
        $scope.classes = data;
    }).error(function(data) {
            console.log("Classes request failed" + data);
        });
});

app.controller('AdminViewTeachersCntrl', function ($scope, $http) {
    $http.get('/api/teachers').success(function(data) {
        $scope.teachers = data;
    }).error(function(data) {
            console.log("Teacher request failed" + data);
        });
});

app.controller('AdminViewStudentsCntrl', function ($scope, $http) {
    $http.get('/api/users').success(function(data) {
        $scope.students = data;
    }).error(function(data) {
            console.log("students request failed" + data);
        });
});

app.controller('AdminCardSelectCntrl', function($scope, $http, $routeParams) {

    var url = '/api/studycards?classname=' + $routeParams.className;

    $http.get(url).success(function(data) {

        // Check the results and parse them into groups by week
        if (data.length > 0) {

            // Find date of first card. Use this as basis for first week
            //var dateformat = "yyyy-MM-ddTHH:mm:ss.000Z";
            var studycard, cardDate, weekBegin, weekEnd, weekName = null;
            var studyCardArray = []; // Array of Arrays of Studycards
            //var weekNameKeys = []; // array of all the keys to 'weeks' dictionary. Needed so that all keys are in order.

            for (var i = 0; i < data.length; i++) {

                studycard = data[i];
                console.log('card#: ' + (i+1) + ' week: ' + studycard.weekNum);
                //cardDate = Date.parseExact(studycard.date, dateformat).last().day();

                // File cards into StudyCardArray by weekNumber
                if (studyCardArray.length == studycard.weekNum) {
                    studyCardArray[studycard.weekNum-1].push(studycard); // Add studycard to that week's array
                } else {
                    // Else move to next week  (where we have card data for that week)
                    console.log('Going to week ' + studycard.weekNum);
                    studyCardArray[studycard.weekNum-1] = [studycard]; // create new array for new week
                }

                // Compute average
            }
            $scope.studyCardArray = studyCardArray;
            //console.log(JSON.stringify(studyCardDict))
        }

    }).error(function(data) {
            console.log("class request failed" + data);
        });
});


app.controller('AdminViewCardsCntrl', function($scope, $http, $routeParams) {

    window.spinner.start();

    // Add classname to scope
    $scope.className = $routeParams.className.capitalize();
    $scope.weekAvg = []; // Array of week studycard averages

    // Get studycard from the specific class with start and end dates filter
    var url = '/api/studycards?classid='+ $routeParams.classid; // classid should be on query string
    $http.get(url).success( function(studycards) {
        if (studycards.length > 0) {
            var index = 0, studycard, studyCardArray = []; // Array of Arrays of Studycards

            // File cards into StudyCardArray by weekNumber
            for (var i = 0; i < studycards.length; i++) {

                studycard = studycards[i];
                //console.log('card#: ' + (i+1) + ' week: ' + studycard.weekNum);
                if (studyCardArray.length >= studycard.weekNum) { // if current studycard belongs to current week
                    studyCardArray[studycard.weekNum-1].push(studycard); // Add studycard to that week's array
                } else {
                    // Else move to next week  (where we have card data for that week)
                    //console.log('Going to week ' + studycard.weekNum);
                    var newWeek = [studycard]; // create new array for new week
                    newWeek.weekNum = studycard.weekNum;
                    studyCardArray[index++] = newWeek;
                }
            }
            $scope.studyCardArray = studyCardArray;
        }
        window.spinner.stop();
        $scope.classAverages = calculateAvg(studycards);

        // Calculate averages for each week
        for (var i = 0; i < $scope.studyCardArray.length; i++) {
            // Only do calculations once. If there is a definition at that index then it is already done.
            if ($scope.weekAvg[i] === undefined) {
                if  ($scope.studyCardArray[i]) {
                    $scope.weekAvg[i] = calculateAvg($scope.studyCardArray[i]); // Calculate avg for specific week
                }
            }
        }


    }).error(function (data) {
        console.log("StudyCards request failed" + data);
        window.spinner.stop();
    });


    // Return an object that has all the statistics on it
    var calculateAvg = function(studyCards) {
        var totalFreq = 0, totalQuality= 0, totalReadBlock = 0;

        for (var i=0; i < studyCards.length; i++) {
            totalFreq += studyCards[i].frequency;
            totalQuality += studyCards[i].quality;
            totalReadBlock += studyCards[i].assignedBlock; // JS converts true/false to 1/0 respectively
        }

        var averages = {};
        averages.numCards = studyCards.length;
        averages.frequency = Math.round((totalFreq / studyCards.length) *100)/100;
        averages.quality = Math.round( (totalQuality / studyCards.length) * 100) / 100;
        averages.percentRead = Math.round((totalReadBlock / studyCards.length) * 100);

        return averages;
    };

});

app.controller('AdminStudyCardsByClassCntrl', function($scope, $http, $routeParams) {

    // Get all classes that are within today's date range
    var url = '/api/class?ondate=' + Date.today().toString('yyyy-MM-dd');
    console.log(url);
    $http.get(url).success( function(classes) {
        console.log(classes);
        $scope.classes = classes;

    }).error(function (data) {
            console.log("StudyCards request failed" + data);
        });
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}