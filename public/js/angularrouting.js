angular.module('instituteApp', ['ngCookies']).
    config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/users/:id/studycard', {templateUrl:'/users/partials/cardsubmit.html', controller: StudyCardCntrl})
            .when('/users/:id/submit', {templateUrl:'/users/partials/thankyou.html'})
            //.otherwise({redirectTo: '/'});
    });


angular.module('loginApp', ['ngCookies']);