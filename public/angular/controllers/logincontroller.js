/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/14/13
 * Time: 12:57 AM
 * To change this template use File | Settings | File Templates.
 */

var app = angular.module('loginApp', ['ngCookies']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/login.html', {
        templateUrl:'/angular/partials/loginpart.html',
        controller: 'LoginCntrl'
    });
    $routeProvider.when('/register.html', {
        templateUrl:'/angular/partials/registerpart.html',
        controller: 'RegisterCntrl'
    });
    //.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
});

app.controller('LoginCntrl', function($scope, $http, $cookies, $location) {

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
});

app.controller('RegisterCntrl', function($scope, $http, $cookies, $location) {

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
});


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