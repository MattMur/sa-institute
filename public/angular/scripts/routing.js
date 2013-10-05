/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 9/12/13
 * Time: 7:14 PM
 * To change this template use File | Settings | File Templates.
 */

var app = angular.module('instituteApp', ['ngCookies', 'ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider, $locationProvider) {

    // $routeProvider.when('/users/:id', {
    //     // templateUrl:'/angular/partials/usermain.html',
    //     controller: 'UserCntrl'
    // });
    $routeProvider.when('/users/:id/studycard/new', {
        templateUrl:'/angular/partials/studycard/new.html',
        controller: 'NewStudyCardCntrl'
    });
    $routeProvider.when('/users/:id/studycard/create', {
        templateUrl:'/angular/partials/studycard/create.html'
    });
    $routeProvider.when('/users/:id/studycard/', {
        templateUrl:'/angular/partials/studycard/index.html',
        controller: 'StudyCardsCntrl'
    });
    $routeProvider.when('/users/:id/studycard/:cardId', {
        templateUrl:'/angular/partials/studycard/show.html',
        controller: 'StudyCardDetailsCntrl'
    });
    /*$routeProvider.when('/admin', {
        templateUrl:'/angular/partials/admin/adminmain.html'
    });*/
    $routeProvider.when('/admin', {
        templateUrl:'/angular/partials/admin/viewclasses.html',
        controller: 'AdminViewClassesCntrl'
    });
    $routeProvider.when('/admin/classes/new', {
        templateUrl:'/angular/partials/admin/newclass.html',
        controller:'AdminNewClassCntrl'
    });
    $routeProvider.when('/admin/classes/:className/edit', {
        templateUrl:'/angular/partials/admin/newclass.html', // Reuse newclass html. Thanks Angular.
        controller:'AdminEditClassCntrl'
    });
    $routeProvider.when('/admin/classes/:className/studycards', {
        templateUrl:'/angular/partials/admin/viewstudycards.html',
        controller: 'AdminViewCardsCntrl'
    });
    $routeProvider.when('/admin/teachers', {
        templateUrl:'/angular/partials/admin/viewteachers.html',
        controller: 'AdminViewTeachersCntrl'
    });
    $routeProvider.when('/admin/classes/:className/students', {
        templateUrl:'/angular/partials/admin/viewstudents.html',
        controller: 'AdminViewStudentsCntrl'
    });



    $routeProvider.otherwise({redirectTo: '/users/:id'});
    $locationProvider.html5Mode(true);
});
