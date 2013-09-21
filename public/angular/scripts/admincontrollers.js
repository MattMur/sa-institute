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

    // Add classname to scope
    $scope.className = $routeParams.className;

    // Get studycard from the specific class with start and end dates filter
    var url = '/api/studycards?classid='+ $routeParams.classid; // classid should be on query string
    $http.get(url).success( function(studycards) {
        if (studycards.length > 0) {
            var studycard, studyCardArray = []; // Array of Arrays of Studycards

            // File cards into StudyCardArray by weekNumber
            for (var i = 0; i < studycards.length; i++) {
                studycard = studycards[i];
                console.log('card#: ' + (i+1) + ' week: ' + studycard.weekNum);
                if (studyCardArray.length >= studycard.weekNum) {
                    studyCardArray[studycard.weekNum-1].push(studycard); // Add studycard to that week's array
                } else {
                    // Else move to next week  (where we have card data for that week)
                    console.log('Going to week ' + studycard.weekNum);
                    studyCardArray[studycard.weekNum-1] = [studycard]; // create new array for new week
                }
            }
            $scope.studyCardArray = studyCardArray;
        }

        $scope.averages = calculateAvg(studycards);


    }).error(function (data) {
        console.log("StudyCards request failed" + data);
    });

    var calculateAvg = function(studyCards) {
        var totalFreq = 0, totalQuality= 0, totalReadBlock = 0;

        for (var studyCard in studyCards) {
            totalFreq += studyCard.frequency;
            totalQuality += studyCard.quality;
            totalReadBlock += studyCard.assignedBlock; // JS converts true/false to 1/0 respectively
        }

        var averages = {};
        averages.frequency = totalFreq / studyCards.length;
        averages.quality = totalQuality / studyCards.length;
        averages.percentRead = totalReadBlock / studyCards.length;
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