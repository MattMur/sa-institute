/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/3/13
 * Time: 5:21 PM
 * To change this template use File | Settings | File Templates.
 */

function UserCntrl($scope, $http, $routeParams) {
    //do we have a class id for our user?
    if ($scope.user.class_id) {
        var url = 'http://localhost:8888/api/class/' + $scope.user.class_id;
        $http.get(url).success( function(data) {
            // add class to user scope
            $scope.user['class'] = data;
        }).error(function (data) {
            console.log("The request failed" + data);
        });
    } else {
        // Set the class name as 'unregistered'
        $scope.user['class'] = { name: 'Unregistered' };
    }



}

function NewStudyCardCntrl($scope, $http, $location, $routeParams) {

    //console.log('routeparams ' + JSON.stringify($routeParams));

    // Get all availible classes
    $http.get('http://localhost:8888/api/class').success( function(data) {
        $scope.classes = data;
        console.log(data);
    }).error(function (data) {
       console.log("NewStudyCard request failed" + data);
    });

    //submit a new studycard from the form
    $scope.submit = function () {

        $scope.studycard.students_id = $routeParams.id; // Set the userId from routeParams
        $http.put('/api/studycards', $scope.studycard).success(function(data) {
            $location.path("/users/"+$routeParams.id + "/submit");
        }).error(function(data) {
            window.alert("Attempt to create new studycard failed " + data);
        });
    }
}


function StudyCardsCntrl($scope, $http, $routeParams) {

    // Get all availible study cards
    var url = 'http://localhost:8888/api/users/'+ $routeParams.id +'/studycards';
    $http.get(url).success( function(studycards) {
        $scope.studycards = studycards;

        //2013-08-16T01:18:51.000Z
        var dateformat = "yyyy-MM-ddTHH:mm:ss.000Z";

        // get week range from each date
        // We assume class is Wednesday. Is this always right???
        for (var i = 0; i < studycards.length; i++) {
            var day2 = Date.parseExact(studycards[i].date, dateformat).last().wed();
            var day1 = Date.parseExact(studycards[i].date, dateformat).last().wed().last().week();

            // If the dates are in same month then condense
            var day2 = day1.same().month(day2) ? day2.toString('dd') : day2 = day2.toString('MMM dd');

            // Combine to get week range
            var weekRng = day1.toString('MMM dd') + '-' + day2;
            $scope.studycards[i].weekRange = weekRng;
        }
        //console.log(JSON.stringify($scope.studycards));
    }).error(function (data) {
        console.log("StudyCards request failed" + data);
    });
}


function StudyCardDetailsCntrl($scope, $http, $routeParams) {

    // Get all availible study cards
    $http.get('http://localhost:8888/api/studycards/' + $routeParams.cardId)
        .success( function(data) {
            $scope.studycard = data;
            console.log(data);
    }).error(function (data) {
            console.log("StudyCardDetails request failed" + data);
        });
}

// Controller used to display Welcome <User> and Logoff function
function RootCntrl($scope, $http, $cookies) {

    // get the current user from cookie
    console.log("Cookies: " + JSON.stringify($cookies));
    if ($cookies.userid) {
        var userid = $cookies.userid;

        // get user data
        $http.get('http://localhost:8888/api/users/' + userid)
            .success(function(data) {
                // Set user data on the scope.
                // Since this is global scope to the app all other controllers will have access to it
                $scope.user = data;
                $scope.user['id'] = $cookies.userid;
                console.log(JSON.stringify($scope.user));
            })
            .error(function(data) {
                window.alert("Could not get user " + data);
            });
    }

    $scope.logoff = function() {
        $cookies.userid = null;
        $scope.user = null;
        window.location = 'http://localhost:8888/logoff';
    }
}
