angular.module('instituteApp', []).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {templateUrl:'partials/cardsubmit.html', controller: StudyCardCntrl}).
            when('/submit', {templateUrl:'partials/thankyou.html'}).
            otherwise({redirectTo: '/'});
    }]);
