angular.module('instituteApp', ['ngCookies']).
    config(function($routeProvider, $locationProvider) {

        $routeProvider.when('/users/:id/studycard', {
            templateUrl:'/users/partials/cardsubmit.html',
            controller: StudyCardCntrl
        });
        $routeProvider.when('/users/:id/submit', {
            templateUrl:'/users/partials/thankyou.html'
        });
            //.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    });


angular.module('loginApp', ['ngCookies']).
    config(function($routeProvider, $locationProvider) {
        $routeProvider.when('/login.html', {
            templateUrl:'/partials/loginpart.html',
            controller: LoginCntrl
        });
        $routeProvider.when('/register.html', {
            templateUrl:'/partials/registerpart.html',
            controller: RegisterCntrl
        });
        //.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    });