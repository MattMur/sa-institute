angular.module('instituteApp', ['ngCookies']).
    config(function($routeProvider, $locationProvider) {

        $routeProvider.when('/users/:id', {
            templateUrl:'/angular/partials/user.html',
            controller: UserCntrl
        });
        $routeProvider.when('/users/:id/newstudycard', {
            templateUrl:'/angular/partials/newstudycard.html',
            controller: NewStudyCardCntrl
        });
        $routeProvider.when('/users/:id/submit', {
            templateUrl:'/angular/partials/submitcard.html'
        });
        $routeProvider.when('/users/:id/studycards', {
            templateUrl:'/angular/partials/studycards.html',
            controller: StudyCardsCntrl
        });
        $routeProvider.when('/users/:id/studycards/:cardId', {
            templateUrl:'/angular/partials/studycarddetails.html',
            controller: StudyCardDetailsCntrl
        })
        $routeProvider.otherwise({redirectTo: '/users/:id'});
        $locationProvider.html5Mode(true);
    });


angular.module('loginApp', ['ngCookies']).
    config(function($routeProvider, $locationProvider) {
        $routeProvider.when('/login.html', {
            templateUrl:'/angular/partials/loginpart.html',
            controller: LoginCntrl
        });
        $routeProvider.when('/register.html', {
            templateUrl:'/angular/partials/registerpart.html',
            controller: RegisterCntrl
        });
        //.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    });