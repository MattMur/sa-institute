/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/3/13
 * Time: 5:21 PM
 * To change this template use File | Settings | File Templates.
 */



function LoginCntrl($scope, $http, $cookies, $location) {

    $(document).ready(function() {
        $(".username").focus(function() {
            $(".user-icon").css("left","-48px");
        });
        $(".username").blur(function() {
            $(".user-icon").css("left","0px");
        });

        $(".password").focus(function() {
            $(".pass-icon").css("left","-48px");
        });
        $(".password").blur(function() {
            $(".pass-icon").css("left","0px");
        });
    });

    $scope.login = function() {
        login($http, $scope.user, $scope.pass, function(data) {
            //Set cookie so we remember who they are
            $cookies.userid = data;
        });
    };

    $scope.changeToRegister = function() {
        $location.path('register.html');
    };
}

function RegisterCntrl($scope, $http, $cookies, $location) {

    $scope.register = function() {
        // Do PUT to register new user
        var user = $scope.newUser;
        console.log(JSON.stringify(user));
        $http.put('/api/users', user).success(function(data) {
            // Success. Now lets login with new user.
            login($http, user.email, user.password, function() {
                //Set cookie so we remember who they are
                $cookies.userid = data;
            });
        }).error(function(data) {
            window.alert("Attempt to create new user failed " + data);
        });
    };

    $scope.changeToLogin = function() {
        $location.path('login.html');
    };
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
        $cookies.userid = null;
        window.location = 'http://localhost:8888/logoff';
    }
}


// Custom method for logging in. NOT a controller.
function login($http, user, pass, success) {

    //var basicAuth = 'Basic ' + Base64.encode(user + ':' + pass);
    var loginData = { user:user, pass:pass };
    $http.post('http://localhost:8888/login', loginData)
        .success(function(data) {

            //Call callbackfunction
            success(data);

            // Now that we are authenticated we redirect to studycard
            window.location = 'http://localhost:8888/';

        }).error(function(data) {
            $http.defaults.headers.common['Authorization'] = null;
            window.alert("Login failed " + data);
        });
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