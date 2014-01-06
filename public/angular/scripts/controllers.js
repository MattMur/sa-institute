/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/3/13
 * Time: 5:21 PM
 */

// Menu in top nav bar
var MenuItem = function(name, href) {
    this.name = name;
    this.href = href;
};

// Controller used to display Welcome <User> and Logoff function
app.controller('RootCntrl', function($scope, $rootScope, $http, $cookies, $location) {
    var userMenuItems, adminMenuItems;

    // get the current user from cookie
    console.log("Cookies: " + JSON.stringify($.cookie()));
    if ($.cookie('userid')) {
        var userid = $.cookie('userid');

        var user = {};

        // get user data
        $http.get('/api/users/' + userid)
            .success(function(data) {
                // Set user data on the scope.
                // Since this is global scope to the app all other controllers will have access to it
                $rootScope.user = data;
                $rootScope.user['id'] = $.cookie('userid');
                console.log('User at RootLevel: ' + JSON.stringify(data));

                getUserSchedule($rootScope.user, function() {

                    // Contextual menu items based on Admin or Student
                    userMenuItems = [
                        new MenuItem('New Study Card', '/users/'+ $rootScope.user.id +'/studycard/new'),
                        new MenuItem('View Study Cards', '/users/'+ $rootScope.user.id +'/studycard'),
                        //new MenuItem('Syllabus', '/classes/'+ $rootScope.user.class_id +'/syllabus')
                    ];
                    adminMenuItems = [
                        new MenuItem('View Classes', '/admin/classes'),
                        new MenuItem('New Class', '/admin/classes/new'),
                        new MenuItem('Manage Users', '/admin/users')
                    ];
                    switchBetweenAdminStudent();
                });

            })
            .error(function(data) {
                window.alert("Could not get user " + data);
            });
    } else {
        console.log('Cookies were not set! Cannot get user');
    }
    
    // Given a user, find the classes they are currently enrolled in
    // Abstracted for possible reuse in other controllers
    function getUserSchedule(user, callback) {
        if (user.id){
            console.log("user.id: " + user.id);
            var url = '/api/users/' + user.id + '/classes?limit=1';
            $http.get(url).success( function(data) {
                if (data.length > 0) {
                    user['class'] = data[0];
                    callback();
                } else {
                    user['class'] = { name: 'Unregistered' };
                }
            }).error(function (data) {
                console.log("The request failed" + data);
                callback();
            });
        } else {
            user['class'] = { name: 'Unregistered' };
            callback();
        }     
    }

    $scope.logoff = function() {
        $.removeCookie('userid', { path:'/'})
        $rootScope.user = null;
        window.location = '/logoff';
    }

    //$scope.menuItems = userMenuItems;

    // Listen for even $routeChangeSuccess(url change), then change admin portal link
    $scope.$on('$routeChangeSuccess', function(){

        switchBetweenAdminStudent();
    });

    function switchBetweenAdminStudent() {
        $scope.isLocationAdmin = (/admin/).test($location.path());
        if ($scope.isLocationAdmin) {
            $scope.menuType = 'Admin';
            $scope.menuItems = adminMenuItems;
            console.log('set menu to admin');
        } else {
            $scope.menuType = 'Student';
            $scope.menuItems = userMenuItems;
            console.log('set menu to student');
        }
    }
});


app.controller('NewStudyCardCntrl', function ($scope, $http, $location, $routeParams) {

    //console.log('routeparams ' + JSON.stringify($routeParams));
    var today = Date.today().toString('yyyy-MM-dd');

    // Get all availible classes for current semester
    $http.get('/api/class?date='+today).success( function(data) {
        $scope.classes = data;
        console.log(data);
    }).error(function (data) {
       console.log("NewStudyCard request failed" + data);
    });

    //submit a new studycard from the form
    $scope.submit = function () {

        $scope.studycard.user_id = $routeParams.id; // Set the userId from routeParams
        $http.post('/api/studycards', $scope.studycard).success(function(data) {
            // After creating a new studycard route to home
            $location.path("/users/"+$routeParams.id);
        }).error(function(data) {
            window.alert("Attempt to create new studycard failed " + data);
        });
    }
});


app.controller('StudyCardsCntrl', function($scope, $http, $routeParams, orderByWeek) {
    $scope.isCollapsed = false;
    window.spinner.start();

    // Get all the classes for the user for current semester
    // We need to know what classes the user is enrolled in before we can get studycards
    var today = Date.today().toString('yyyy-MM-dd');
    $http.get('/api/users/'+$routeParams.id+'/classes?date='+today).success(function(classes) {
        if (classes) {
            //console.log(JSON.stringify(classes));

            if (classes.length == 1) {
                // Only one class so automatically retrieve studycards for that class
                getCardsForClass(classes[0]);
            } else if (classes.length > 1) {
                // Display the list of classes from scope
                $scope.classes = classes;
                spinner.stop();
            } else {
                // Display warning that user isn't enrolled in any classes. Automatic enrollment as soon as they submit studycard.
                $scope.noCards = true;
                spinner.stop();
            }
        }
    }).error(function(err) {
          spinner.stop();
          alert('Could not get studycards.\n'+err);
    });

    $scope.showClasses = function() {
        $scope.cards = null;
        $scope.noCards = false;
    };

    $scope.classSelect = getCardsForClass;

    function getCardsForClass(classObj) {
        // Get studycards for selected class
        var url = '/api/studycards?user='+ $routeParams.id+'&classid='+classObj.id;
        $http.get(url).success(function(studycards) {
            //console.log(JSON.stringify(studycards));
            if (studycards.length > 0) {
                $scope.cards = orderByWeek(studycards);
            } else {
                $scope.noCards = true;
            }
            spinner.stop();
        }).error(function(err) {
            spinner.stop();
            alert('Could not get studycards.\n'+err);
        });
    }
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

