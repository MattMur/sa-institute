/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/3/13
 * Time: 5:21 PM
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
    $routeProvider.when('/admin/students', {
        templateUrl:'/angular/partials/admin/viewstudents.html',
        controller: 'AdminViewStudentsCntrl'
    });
    $routeProvider.when('/admin/classes', {
        templateUrl:'/angular/partials/admin/viewclasses.html',
        controller: 'AdminViewClassesCntrl'
    });
    $routeProvider.when('/admin/teachers', {
        templateUrl:'/angular/partials/admin/viewteachers.html',
        controller: 'AdminViewTeachersCntrl'
    });
    $routeProvider.when('/admin/classes/:className/studycards/select', {
        templateUrl:'/angular/partials/admin/studycardselect.html',
        controller: 'AdminCardSelectCntrl'
    });
    $routeProvider.when('/admin/classes/:className/studycards', {
        templateUrl:'/angular/partials/studycards.html',
        controller: 'AdminViewCardsCntrl'
    });
    $routeProvider.otherwise({redirectTo: '/users/:id'});
    $locationProvider.html5Mode(true);
});

app.controller('UserCntrl', function ($scope, $http) {
    //do we have a class id for our user?
    if ($scope.user.class_id) {
        var url = '/api/class/' + $scope.user.class_id;
        $http.get(url).success( function(data) {
            // add class to user scope
            $scope.user['class'] = data;
        }).error(function (data) {
            console.log("The request failed" + data);
        });
    } else {
        // User hasn't registered for a class yet
        $scope.user['class'] = { name: 'Unregistered' };
    }
});

// Controller used to display Welcome <User> and Logoff function
app.controller('RootCntrl', function($scope, $rootScope, $http, $cookies, $location) {

    // get the current user from cookie
    console.log("Cookies: " + JSON.stringify($cookies));
    if ($cookies.userid) {
        var userid = $cookies.userid;

        // get user data
        $http.get('/api/users/' + userid)
            .success(function(data) {
                // Set user data on the scope.
                // Since this is global scope to the app all other controllers will have access to it
                console.log(JSON.stringify($scope.user));
                $rootScope.user = data;
                $rootScope.user['id'] = $cookies.userid;
            })
            .error(function(data) {
                window.alert("Could not get user " + data);
            });
    }

    $scope.logoff = function() {
        $cookies.userid = null;
        $rootScope.user = null;
        window.location = '/logoff';
    }

    // Listen for even $routeChangeSuccess(url change), then change admin portal link
    $scope.$on('$routeChangeSuccess', function(){
        $scope.isLocationAdmin = (/admin/).test($location.path());
    });


});

app.controller('NewStudyCardCntrl', function ($scope, $http, $location, $routeParams) {

    //console.log('routeparams ' + JSON.stringify($routeParams));

    // Get all availible classes
    $http.get('/api/class').success( function(data) {
        $scope.classes = data;
        console.log(data);
    }).error(function (data) {
       console.log("NewStudyCard request failed" + data);
    });

    //submit a new studycard from the form
    $scope.submit = function () {

        $scope.studycard.students_id = $routeParams.id; // Set the userId from routeParams
        $http.post('/api/studycards', $scope.studycard).success(function(data) {
            $location.path("/users/"+$routeParams.id + "/submit");
        }).error(function(data) {
            window.alert("Attempt to create new studycard failed " + data);
        });
    }
});


app.controller('StudyCardsCntrl', function($scope, $http, $routeParams) {

    // Get all availible study cards
    var url = '/api/users/'+ $routeParams.id +'/studycards';
    $http.get(url).success( function(studycards) {
        if (studycards.length > 0) {
            var studycard, studyCardArray = []; // Array of Arrays of Studycards

            // File cards into StudyCardArray by weekNumber
            for (var i = 0; i < studycards.length; i++) {
                studycard = studycards[i];
                console.log('card#: ' + (i+1) + ' week: ' + studycard.weekNum);
                if (studyCardArray.length >= studycard.weekNum) {
                    studyCardArray[studycard.weekNum-1].push(studycard); // Add studycard to that week's array
                } else {
                    // Else move to next week  (where we have card data for that week)
                    console.log('Going to week ' + studycard.weekNum);
                    studyCardArray[studycard.weekNum-1] = [studycard]; // create new array for new week
                }
            }
            $scope.studyCardArray = studyCardArray;
        }
    }).error(function (data) {
        console.log("StudyCards request failed" + data);
    });
});


app.controller('StudyCardDetailsCntrl', function($scope, $http, $routeParams) {

    // Get all availible study cards
    $http.get('/api/studycards/' + $routeParams.cardId)
        .success( function(data) {
            $scope.studycard = data;
            console.log(data);
    }).error(function (data) {
            console.log("StudyCardDetails request failed" + data);
        });
});

app.controller('AdminViewClassesCntrl', function ($scope, $http) {

    $http.get('/api/class').success(function(data) {
        $scope.classes = data;
    }).error(function(data) {
        console.log("Classes request failed" + data);
    });
});

app.controller('AdminViewTeachersCntrl', function ($scope, $http) {
    $http.get('/api/teachers').success(function(data) {
        $scope.teachers = data;
    }).error(function(data) {
            console.log("Teacher request failed" + data);
        });
});

app.controller('AdminViewStudentsCntrl', function ($scope, $http) {
    $http.get('/api/users').success(function(data) {
        $scope.students = data;
    }).error(function(data) {
            console.log("students request failed" + data);
        });
});

app.controller('AdminCardSelectCntrl', function($scope, $http, $routeParams) {

    var url = '/api/studycards?classname=' + $routeParams.className;

    $http.get(url).success(function(data) {

        // Check the results and parse them into groups by week
        if (data.length > 0) {

            // Find date of first card. Use this as basis for first week
            //var dateformat = "yyyy-MM-ddTHH:mm:ss.000Z";
            var studycard, cardDate, weekBegin, weekEnd, weekName = null;
            var studyCardArray = []; // Array of Arrays of Studycards
            //var weekNameKeys = []; // array of all the keys to 'weeks' dictionary. Needed so that all keys are in order.

            for (var i = 0; i < data.length; i++) {

                studycard = data[i];
                console.log('card#: ' + (i+1) + ' week: ' + studycard.weekNum);
                //cardDate = Date.parseExact(studycard.date, dateformat).last().day();

                // File cards into StudyCardArray by weekNumber
                if (studyCardArray.length == studycard.weekNum) {
                    studyCardArray[studycard.weekNum-1].push(studycard); // Add studycard to that week's array
                 } else {
                     // Else move to next week  (where we have card data for that week)
                     console.log('Going to week ' + studycard.weekNum);
                     studyCardArray[studycard.weekNum-1] = [studycard]; // create new array for new week
                 }

                // Compare if two dates are in the same week;
                /*if (weekBegin && cardDate.between(weekBegin, weekEnd)) {
                    studyCardDict[weekName].push(studycard); // Add studycard to week
                } else {
                    // move to next week  (where we have card data for that week)
                    console.log('Going to next week');
                    weekBegin = cardDate.is().wed() ? cardDate.clearTime() : cardDate.last().wed().clearTime();
                    weekEnd = weekBegin.clone().next().week();
                    weekName = weekBegin.toString('MMM dd');
                    studyCardDict[weekName] = [studycard]; // create new array for new week
                    weekNameKeys.push(weekName);  // Add the next week name key
                    console.log('startWeek:'+weekBegin + ' endWeek:' + weekEnd);
                }
                */
            }
            $scope.studyCardArray = studyCardArray;
            //console.log(JSON.stringify(studyCardDict))
        }

    }).error(function(data) {
        console.log("class request failed" + data);
    });
});


app.controller('AdminViewCardsCntrl', function($scope, $http, $routeParams) {

    // Get studycard from the specific class with start and end dates filter
    var url = '/api/studycards?classname='+ $routeParams.className
        + '&startdate='+ $routeParams.startdate
        + '&enddate='+ $routeParams.enddate;
    $http.get(url).success( function(studycards) {
        $scope.studycards = studycards;
    }).error(function (data) {
            console.log("StudyCards request failed" + data);
        });
});



app.filter('weekRange', function() {
    return function(input) {  // Input should be array of date strings
        var dateformat = "yyyy-MM-ddTHH:mm:ss.000Z";
        var weekRng;
        //console.log('input: '+input);
        var start = Date.parseExact(input, dateformat);
        var end = Date.parseExact(input, dateformat);
        if (!start) { // Check to make sure the parsing worked
            //console.log('first try is null');
            start = Date.parse(input);
            end = Date.parse(input);
            if (!start) return ''; // quit if we still can't parse
        }
        //console.log('start ' +start+ ' end ' +end);

        start.last().week().addDays(1); // 6 days ago is the start of the week range (ex. thur - wednesday)
        //end.last().wed();

        // If the dates are in same month then condense
        end = start.same().month(end) ? end.toString('dd') : end = end.toString('MMM dd');

        // Combine to get week range
        weekRng = start.toString('MMM dd') + '-' + end;
        return weekRng;
    }
});

app.filter('yesno', function() {
   return function(input) {
       return input ? 'Yes' : 'No';
   }
});

app.filter('truefalse', function() {
    return function(input) {
        return input ? 'True' : 'False';
    }
});
