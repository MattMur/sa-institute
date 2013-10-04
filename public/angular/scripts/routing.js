/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 9/12/13
 * Time: 7:14 PM
 * To change this template use File | Settings | File Templates.
 */

var app = angular.module('instituteApp', ['ngCookies', 'ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider, $locationProvider) {

    $routeProvider.when('/users/:id', {
        templateUrl:'/angular/partials/usermain.html',
        controller: 'UserCntrl'
    });
    $routeProvider.when('/users/:id/newstudycard', {
        templateUrl:'/angular/partials/newstudycard.html',
        controller: 'NewStudyCardCntrl'
    });
    $routeProvider.when('/users/:id/submit', {
        templateUrl:'/angular/partials/submitcard.html'
    });
    $routeProvider.when('/users/:id/studycards', {
        templateUrl:'/angular/partials/studycards.html',
        controller: 'StudyCardsCntrl'
    });
    $routeProvider.when('/users/:id/studycards/:cardId', {
        templateUrl:'/angular/partials/studycarddetails.html',
        controller: 'StudyCardDetailsCntrl'
    });
    $routeProvider.when('/admin', {
        templateUrl:'/angular/partials/admin/adminmain.html'
    });
    $routeProvider.when('/admin/classes', {
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
        templateUrl:'/angular/partials/admin/adminstudycards.html',
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
