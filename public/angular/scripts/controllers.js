/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/3/13
 * Time: 5:21 PM
 */

var MenuItem = function(name, href) {
    this.name = name;
    this.href = href;
};

// Controller used to display Welcome <User> and Logoff function
app.controller('RootCntrl', function($scope, $rootScope, $http, $cookies, $location) {
    var userMenuItems, adminMenuItems;

    // get the current user from cookie
    console.log("Cookies: " + JSON.stringify($cookies));
    if ($cookies.userid) {
        var userid = $cookies.userid;
        var user = {};

        // get user data
        $http.get('/api/users/' + userid)
            .success(function(data) {
                // Set user data on the scope.
                // Since this is global scope to the app all other controllers will have access to it
                $rootScope.user = data;
                $rootScope.user['id'] = $cookies.userid;
                getUserSchedule($rootScope.user, function() {

                    // Contextual menu items based on Admin or Student
                    userMenuItems = [
                        new MenuItem('New Study Card', '/users/'+ $rootScope.user.id +'/studycard/new'),
                        new MenuItem('View Study Cards', '/users/'+ $rootScope.user.id +'/studycard'),
                        new MenuItem('Syllabus', '/classes/'+ $rootScope.user.class_id +'/syllabus')
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
    }
    
    // Given a user, find the classes they are currently enrolled in
    // Abstracted for possible reuse in other controllers
    function getUserSchedule(user, callback) {
        if (user.class_id){
            console.log("user.class_id: " + user.class_id);
            var url = '/api/class/' + user.class_id;
            $http.get(url).success( function(data) {
                user['class'] = data;
                callback();
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
        $cookies.userid = null;
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
            // After creating a new studycard route to home
            // Add flash notice?
            $location.path("/users/"+$routeParams.id);
        }).error(function(data) {
            window.alert("Attempt to create new studycard failed " + data);
        });
    }
});


app.controller('StudyCardsCntrl', function($scope, $http, $routeParams) {
    $scope.isCollapsed = false;   
    function cardWeek(card){
            this.cards = new Array(card);
            card.inWeekArray = true;
            this.startDate = new Date(card['date']);
            // Set endDate == startDate + 7 days;
            // Use milliseconds so 9/30/13 + 7 days == 10/07/13 instead of 9/37/13
            this.endDate = new Date(this.startDate.getTime() + 7 * 1000 * 60 * 60 * 24);
            this.inRange = function(card){
                var checkDate = new Date(card['date']);
                // console.log("check date: " + JSON.stringify(checkDate));
                // Check if card['date'] falls in the date range of this week object
                if (checkDate.getTime() >= this.startDate.getTime() && checkDate.getTime() <= this.endDate.getTime()){
                    // console.log("Within range");
                    var duplicate = false;
                    var exception = {};
                    try{
                        // Check to see if card is already in this.cards
                        this.cards.forEach(function(otherCard){
                            if (card['id'] == otherCard['id']){
                                throw exception;
                            }
                        });
                    }catch(e){
                         // break loop card is allready present
                        duplicate = true;
                        // console.log("card already exists " + JSON.stringify(card));
                    };
                    // if card isn't allready in this.cards then append it
                    if (!duplicate){
                        // console.log("add card " + JSON.stringify(card));
                        this.cards.push(card);
                        // card is in a week array, don't create a unique week object for it
                        card.inWeekArray = true;
                    }
                }else{
                    // card is out of week range. Don't add to this.cards
                    // console.log("Out of range");
                }
            };
    }
    // function to sort cards by date
    function sortCardDate(card,otherCard){
        if(card.date < otherCard.date){
            return -1;
        }
        if(card.date > otherCard.date){
            return 1;
        }
        return 0;
    }
    // Get all availible study cards
    window.spinner.start();
    var url = '/api/studycards?user='+ $routeParams.id;
    $http.get(url).success( function(studycards) {
        if (studycards.length > 0) {
            studycards = studycards.sort(sortCardDate);
            var weeks = [];
            studycards.forEach(function(card){
                if (!card.inWeekArray){
                    // if card isn't allready in a week object then create a new week object for that card
                    var week = new cardWeek(card);
                    // loop threw all studycards and see if any were created the same week as the new week object
                    studycards.forEach(function(checkCard){
                        week.inRange(checkCard);
                    });
                    weeks.push(week);
                }
            });
            console.log("Weeks: " + JSON.stringify(weeks));

            $scope.weeks = weeks;
        
        }
        spinner.stop();
    }).error(function (data) {
        spinner.stop();
        // console.log("StudyCards request failed" + data);
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

