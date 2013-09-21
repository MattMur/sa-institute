/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/3/13
 * Time: 5:21 PM
 */

app.controller('UserCntrl', function ($scope, $http) {
    //do we have a class id for our user?
    if ($scope.user.class_id) {
        var url = '/api/class/' + $scope.user.class_id;
        $http.get(url).success( function(data) {
            // add class to user scope
            $scope.user['class'] = data;
        }).error(function (data) {
            console.log("The request failed" + data);
        });
    } else {
        // User hasn't registered for a class yet
        $scope.user['class'] = { name: 'Unregistered' };
    }
});

// Controller used to display Welcome <User> and Logoff function
app.controller('RootCntrl', function($scope, $rootScope, $http, $cookies, $location) {

    // get the current user from cookie
    console.log("Cookies: " + JSON.stringify($cookies));
    if ($cookies.userid) {
        var userid = $cookies.userid;

        // get user data
        $http.get('/api/users/' + userid)
            .success(function(data) {
                // Set user data on the scope.
                // Since this is global scope to the app all other controllers will have access to it
                $rootScope.user = data;
                $rootScope.user['id'] = $cookies.userid;
            })
            .error(function(data) {
                window.alert("Could not get user " + data);
            });
    }

    $scope.logoff = function() {
        $cookies.userid = null;
        $rootScope.user = null;
        window.location = '/logoff';
    }

    // Listen for even $routeChangeSuccess(url change), then change admin portal link
    $scope.$on('$routeChangeSuccess', function(){
        $scope.isLocationAdmin = (/admin/).test($location.path());
    });


});

app.controller('NewStudyCardCntrl', function ($scope, $http, $location, $routeParams) {

    //console.log('routeparams ' + JSON.stringify($routeParams));

    // Get all availible classes
    $http.get('/api/class').success( function(data) {
        $scope.classes = data;
        console.log(data);
    }).error(function (data) {
       console.log("NewStudyCard request failed" + data);
    });

    //submit a new studycard from the form
    $scope.submit = function () {

        $scope.studycard.students_id = $routeParams.id; // Set the userId from routeParams
        $http.post('/api/studycards', $scope.studycard).success(function(data) {
            $location.path("/users/"+$routeParams.id + "/submit");
        }).error(function(data) {
            window.alert("Attempt to create new studycard failed " + data);
        });
    }
});


app.controller('StudyCardsCntrl', function($scope, $http, $routeParams) {

    // Get all availible study cards
    var url = '/api/studycards?user='+ $routeParams.id;
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
    }).error(function (data) {
        console.log("StudyCards request failed" + data);
    });
});


app.controller('StudyCardDetailsCntrl', function($scope, $http, $routeParams) {

    // Get all availible study cards
    $http.get('/api/studycards/' + $routeParams.cardId)
        .success( function(data) {
            $scope.studycard = data;
            console.log(data);
    }).error(function (data) {
            console.log("StudyCardDetails request failed" + data);
        });
});

