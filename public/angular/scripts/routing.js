/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 9/12/13
 * Time: 7:14 PM
 * To change this template use File | Settings | File Templates.
 */

var app = angular.module('instituteApp', ['ngRoute', 'ui.bootstrap', 'angularFileUpload']);

app.config(function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl:'/angular/partials/welcome.html',
        controller: 'WelcomeCntrl'
    });
    $routeProvider.when('/login.html', {
        templateUrl:'/angular/partials/login/newlogin.html',
        controller: 'LoginCntrl'
    });
    $routeProvider.when('/register.html', {
        templateUrl:'/angular/partials/login/registerpart.html',
        controller: 'RegisterCntrl'
    });


    $routeProvider.when('/users/:id', {
        redirectTo: '/users/:id/studycards'
    });
    $routeProvider.when('/users/:id/studycards/new', {
        templateUrl:'/angular/partials/studycard/new.html',
        controller: 'NewStudyCardCntrl'
    });
    $routeProvider.when('/users/:id/studycards', {  // Displays overview of all studycards from all classes
        templateUrl:'/angular/partials/studycard/index.html',
        controller: 'StudyCardClasses'
    });
    $routeProvider.when('/users/:id/studycards/:className', {  // Drill down into specific class //query param sets classid
        templateUrl:'/angular/partials/studycard/show.html',
        controller: 'StudyCardsCntrl'
    });


    $routeProvider.when('/admin', {
        redirectTo: '/admin/classes'
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
        templateUrl:'/angular/partials/admin/viewstudycards.html',
        controller: 'AdminViewCardsCntrl'
    });
    $routeProvider.when('/admin/classes/:className/students', {
        templateUrl:'/angular/partials/admin/viewstudents.html',
        controller: 'AdminViewStudentsCntrl'
    });
    $routeProvider.when('/admin/classes/:className/comments', {
        templateUrl:'/angular/partials/admin/viewcomments.html',
        controller: 'AdminViewCommentsCntrl'
    });
    $routeProvider.when('/admin/users', {
        templateUrl:'/angular/partials/admin/manageusers.html',
        controller: 'AdminViewUsersCntrl'
    });


    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
});
