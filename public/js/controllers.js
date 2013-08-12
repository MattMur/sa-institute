/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/3/13
 * Time: 5:21 PM
 * To change this template use File | Settings | File Templates.
 */

function LoginCntrl($scope, $http, $cookies) {
    $scope.login = function() {
        // Login function using Basic Auth
        var basicAuth = 'Basic ' + Base64.encode($scope.user + ':' + $scope.pass);
        $http({method:'POST', url:'http://localhost:8888/login', headers:{'Authorization' : basicAuth}})
            .success(function(data) {
                //Set cookie so we remember who they are
                $cookies.userid = data;
                //window.alert(JSON.stringify($cookies));

                // Now that we are authenticated we redirect to studycard
                window.location = 'http://localhost:8888/';

        }).error(function(data) {
            $http.defaults.headers.common['Authorization'] = null;
            window.alert("Login failed " + data);
        });
    }
}

function StudyCardCntrl($scope, $http, $location, $routeParams) {

    console.log('routeparams ' + JSON.stringify($routeParams));

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

// Controller used to display Welcome <User> and Logoff function
function UserCntrl($scope, $http, $cookies) {
    // get the current user from cookie
    console.log("Cookies: " + JSON.stringify($cookies));
    if ($cookies.userid) {
        var userid = $cookies.userid;

        // get user data
        $http.get('http://localhost:8888/api/users/' + userid)
            .success(function(data) {
                $scope.user = data;
                console.log(JSON.stringify($scope.user));
            })
            .error(function(data) {
                window.alert("Could not get user " + data);
            });
    }

    $scope.logoff = function() {
        $cookies.user = null;
        window.location = 'http://localhost:8888/logoff';
    }
}

/*var myApp = angular.module('myApp',[]);

myApp.controller('StudyCardCntrl', ['$scope', '$http', function($scope, $http) {
    $http.get('http://localhost:8888/teachers').success( function(data) {
        $scope.teachers = data;
        console.log(data);
    }).error(function (data) {
            console.log("The request failed" + data);
        });
}]);

    */