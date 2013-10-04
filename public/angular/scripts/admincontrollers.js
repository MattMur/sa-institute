/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 9/15/13
 * Time: 6:46 PM
 * To change this template use File | Settings | File Templates.
 */


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

app.controller('AdminViewClassesCntrl', function ($scope, $http) {

    $http.get('/api/class').success(function(data) {
        $scope.classes = data;
    }).error(function(data) {
            console.log("Classes request failed" + data);
    });

    $scope.confirmDelete = function(classObj) {
        $scope.classToBeDeleted = classObj;
        $('#confirmModal').modal('show');
    };
    $scope.cancel = function() {
        $('#confirmModal').modal('hide');
    };

    $scope.deleteClass = function(classObj) {
        $http.delete('/api/class/'+ classObj.id).success(function(data) {
            //console.log('Deleted class ' + JSON.stringify(classObj));
            //remove class from array now that its gone
            for(var i=0; i < $scope.classes.length; i++) {
                if (angular.equals($scope.classes[i], classObj)) {
                    $scope.classes.splice(i, 1);
                    break;
                }
            }

        }).error(function(data) {
            alert("Could not delete class");
        });
        $('#confirmModal').modal('hide');
    };

});

app.controller('AdminNewClassCntrl', function($scope, $http, $location) {

    $scope.action = "Add";  //title
    $scope.confirmSubmit = function() {
        //$('#myModal').modal();
        $('#confirmModal').modal('show');
    };
    $scope.cancel = function() {
        $('#confirmModal').modal('hide');
    };

    $scope.submit = function() {
        $http.post('/api/class', $scope.class).success(function(id) {
            // go back to classes after success
            $location.path('/admin/classes');
        }).error(function(error) {
            console.log("Create new class failed" + error);
        });
        $('#confirmModal').modal('hide');

    };

});

app.controller('AdminEditClassCntrl', function($scope, $http, $routeParams) {

    $scope.action = "Edit"; //title

    $http.get('/api/class/'+$routeParams.classid).success(function(classObj) {

        // Format dates
        var dateformat = "yyyy-MM-ddTHH:mm:ss.000Z";
        classObj.startdate = Date.parseExact(classObj.startdate, dateformat).toString('yyyy-MM-dd');
        classObj.enddate = Date.parseExact(classObj.enddate, dateformat).toString('yyyy-MM-dd');

        console.log(JSON.stringify(classObj));
        $scope.class = classObj;

    }).error(function(data) {
        console.log("Class request failed" + data);
    });

    $scope.confirmSubmit = function() {
        //$('#myModal').modal();
        $('#confirmModal').modal('show');
    };
    $scope.cancel = function() {
        $('#confirmModal').modal('hide');
    };

    $scope.submit = function() {
        $http.put('/api/class/'+ $routeParams.classid, $scope.class).success(function(id) {
            // go back to classes after success
            $location.path('/admin/classes');
        }).error(function(error) {
                console.log("Edit class failed" + error);
            });
        $('#confirmModal').modal('hide');

    };

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






String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}