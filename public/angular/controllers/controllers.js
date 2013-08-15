/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/3/13
 * Time: 5:21 PM
 * To change this template use File | Settings | File Templates.
 */

function UserCntrl($scope, $routeParams) {
    $scope.user = { class:"Revelations", id : $routeParams.id };
}

function NewStudyCardCntrl($scope, $http, $location, $routeParams) {

    //console.log('routeparams ' + JSON.stringify($routeParams));

    // Get all availible classes
    $http.get('http://localhost:8888/api/class').success( function(data) {
        $scope.classes = data;
        console.log(data);
    }).error(function (data) {
       console.log("The request failed" + data);
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


function StudyCardsCntrl($scope, $http) {

    // Get all availible study cards
    $http.get('http://localhost:8888/api/studycards').success( function(data) {
        $scope.studycards = data;
        console.log(data);
    }).error(function (data) {
        console.log("The request failed" + data);
    });
}


function StudyCardDetailsCntrl($scope, $http, $routeParams) {

    // Get all availible study cards
    $http.get('http://localhost:8888/api/studycards/' + $routeParams.cardId)
        .success( function(data) {
            $scope.studycard = data;
            console.log(data);
    }).error(function (data) {
            console.log("The request failed" + data);
        });
}

// Controller used to display Welcome <User> and Logoff function
function MenuCntrl($scope, $http, $cookies) {

    // get the current user from cookie
    console.log("Cookies: " + JSON.stringify($cookies));
    if ($cookies.userid) {
        var userid = $cookies.userid;

        // get user data
        $http.get('http://localhost:8888/api/users/' + userid)
            .success(function(data) {
                $scope.user = data;
                //console.log(JSON.stringify($scope.user));
            })
            .error(function(data) {
                window.alert("Could not get user " + data);
            });
    }

    $scope.logoff = function() {
        $cookies.userid = null;
        window.location = 'http://localhost:8888/logoff';
    }
}
