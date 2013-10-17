/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 9/15/13
 * Time: 6:46 PM
 * To change this template use File | Settings | File Templates.
 */


app.controller('AdminViewTeachersCntrl', function ($scope, $http) {
    $http.get('/api/teachers').success(function(data) {
        $scope.teachers = data;
    }).error(function(data) {
            console.log("Teacher request failed" + data);
        });
});

app.controller('AdminViewStudentsCntrl', function ($scope, $http, $routeParams, exportCSV) {
    $scope.className = $routeParams.className.capitalize();
    $http.get('/api/class/'+$routeParams.classid+'/students').success(function(data) {
        $scope.students = data;
    }).error(function(data) {
        console.log("students request failed" + data);
    });

    $scope.exportCSV = function() {
        exportCSV($scope.students, 'InstituteContacts');
    };
});

app.controller('AdminViewClassesCntrl', function ($scope, $http) {
    var date = Date.today(), dateStr;

    // Query server for classes within selected date. Whenever the date changes we update.
    $scope.$watch('selectedDate', function(newDate) {
        console.log('SelectedDate modified. '+newDate+'\nUpdating class list...');
        $http.get('/api/class?date='+newDate).success(function(data) {
            $scope.classes = data;
        }).error(function(data) {
            console.log("Classes request failed" + data);
        });

        // Hide date selector if date is Today!
        var selDate = Date.parse(newDate);
        $scope.showDate = Date.compare(selDate.clearTime(), Date.today().clearTime()) != 0;
    });

    // Default date to today
    $scope.selectedDate = date.toString('yyyy-MM-dd');

    // Show date selector if they click "Today"
    $scope.selectDate = function() {
        $scope.showDate = true;
    };

    $scope.confirmDelete = function(classObj) {
        $scope.classToBeDeleted = classObj;
        $('#confirmModal').modal('show');
    };
    $scope.cancel = function() {
        $('#confirmModal').modal('hide');
    };

    $scope.deleteClass = function(classObj) {
        $http.delete('/api/class/'+ classObj.id).success(function(data) {
            //console.log('Deleted class ' + JSON.stringify(classObj));
            //remove class from array now that its gone
            removeItemFromArray(classObj, $scope.classes);
            console.log(JSON.stringify($scope.classes));
        }).error(function(data) {
            alert("Could not delete class");
        });
        $('#confirmModal').modal('hide');
    };
});

app.controller('AdminNewClassCntrl', function($scope, $http, $location) {

    $scope.action = "Add";  //title
    $scope.btnAction = "Submit";
    $scope.modalTitle = "Class Details";

    $scope.confirmSubmit = function() {
        //$('#myModal').modal();
        $('#confirmModal').modal('show');
    };
    $scope.cancel = function() {
        $('#confirmModal').modal('hide');
    };

    $scope.submit = function() {

        // You have to do this or else the animation won't finish and black tint will stay over page
        $("#confirmModal").on('hidden.bs.modal', function () {
            // Once the modal finishes hiding
            $http.post('/api/class', $scope.class).success(function(id) {
                // go back to classes after success
                $location.path('/admin/classes');
            }).error(function(error) {
                console.log("Create new class failed" + error);
            });
        });
        $("#confirmModal").modal('hide');
    };

});

app.controller('AdminEditClassCntrl', function($scope, $http, $routeParams, $location) {

    $scope.action = "Edit"; //title
    $scope.btnAction = "Save Changes";
    $scope.modalTitle = "Changes";

    $http.get('/api/class/'+$routeParams.classid).success(function(classObj) {

        // Format dates
        var dateformat = "yyyy-MM-ddTHH:mm:ss.000Z";
        classObj.startdate = Date.parseExact(classObj.startdate, dateformat).toString('yyyy-MM-dd');
        classObj.enddate = Date.parseExact(classObj.enddate, dateformat).toString('yyyy-MM-dd');

        console.log(JSON.stringify(classObj));
        $scope.class = classObj;

    }).error(function(data) {
        console.log("Class request failed" + data);
    });

    $scope.confirmSubmit = function() {
        //$('#myModal').modal();
        $('#confirmModal').modal('show');
    };
    $scope.cancel = function() {
        $('#confirmModal').modal('hide');
    };

    $scope.submit = function() {

        $("#confirmModal").on('hidden.bs.modal', function () {

            $http.put('/api/class/'+ $routeParams.classid, $scope.class).success(function(id) {
                // go back to classes after success
                $location.path('/admin/classes');
            }).error(function(error) {
                    console.log("Edit class failed\n" + error);
                });

        });
        $('#confirmModal').modal('hide');
    };

});


app.controller('AdminViewCardsCntrl', function($scope, $http, $routeParams) {

    window.spinner.start();

    // Add classname to scope
    $scope.className = $routeParams.className.capitalize();
    $scope.weekAvg = []; // Array of week studycard averages

    // Get studycard from the specific class with start and end dates filter
    var url = '/api/studycards?classid='+ $routeParams.classid; // classid should be on query string
    $http.get(url).success( function(studycards) {
        var index = -1, studycard, studyCardsByWeek = [], curWeek = 0; // Array of Arrays of Studycards

        if (studycards.length > 0) {
            // File cards into StudyCardArray by weekNumber
            for (var i = 0; i < studycards.length; i++) {

                studycard = studycards[i];
                //console.log('card#: ' + (i+1) + ' week: ' + studycard.weekNum + ' currentWeek: '+curWeek);
                if (curWeek >= studycard.weekNum) { // if current studycard belongs to current week
                    studyCardsByWeek[index].push(studycard); // Add studycard to that week's array
                } else {
                    // Else move to next week  (where we have card data for that week)
                    //console.log('Going to week ' + studycard.weekNum);
                    var newWeek = [studycard]; // create new array for new week
                    newWeek.weekNum = studycard.weekNum;
                    curWeek = studycard.weekNum;
                    studyCardsByWeek[++index] = newWeek;
                }
            }
        }
        $scope.studyCardArray = studyCardsByWeek;
        $scope.classAverages = calculateAvg(studycards);

        // Calculate averages for each week
        for (var i = 0; i < studyCardsByWeek.length; i++) {
            // Only do calculations once. If there is a definition at that index then it is already done.
            if ($scope.weekAvg[i] === undefined) {
                if  ($scope.studyCardArray[i]) {
                    $scope.weekAvg[i] = calculateAvg(studyCardsByWeek[i]); // Calculate avg for specific week
                }
            }
        }

        window.spinner.stop();


    }).error(function (data) {
        console.log("StudyCards request failed" + data);
        window.spinner.stop();
    });

    // Return an object that has all the statistics on it
    var calculateAvg = function(studyCards) {
        if (studyCards) {
            var totalFreq = 0, totalQuality= 0, totalReadBlock = 0;

            for (var i=0; i < studyCards.length; i++) {
                totalFreq += studyCards[i].frequency;
                totalQuality += studyCards[i].quality;
                totalReadBlock += studyCards[i].assignedBlock; // JS converts true/false to 1/0 respectively
            }

            var averages = {};
            averages.numCards = studyCards.length;
            averages.frequency = Math.round((totalFreq / studyCards.length) *100)/100;
            averages.quality = Math.round( (totalQuality / studyCards.length) * 100) / 100;
            averages.percentRead = Math.round((totalReadBlock / studyCards.length) * 100);

            return averages;
        }

    };
});


app.controller('AdminViewCommentsCntrl', function($scope, $http, $routeParams) {
    $scope.className = $routeParams.className.capitalize();
    $http.get('/api/studycards/notes?classid='+$routeParams.classid).success(function(commentsJson) {

        console.log('Comments: ' + JSON.stringify(commentsJson));
        var index = -1, comment, commentsByWeek = [], curWeek = 0; // Array of Arrays of Studycards

        if (commentsJson.length > 0) {
            // File cards into StudyCardArray by weekNumber
            for (var i = 0; i < commentsJson.length; i++) {

                comment = commentsJson[i];
                //console.log('card#: ' + (i+1) + ' week: ' + studycard.weekNum + ' currentWeek: '+curWeek);
                if (curWeek >= comment.weekNum) { // if current studycard belongs to current week
                    commentsByWeek[index].push(comment); // Add comment to that week's array
                } else {
                    // Else move to next week  (where we have comment for that week)
                    var newWeek = [comment]; // create new array for new week
                    newWeek.weekNum = comment.weekNum;
                    curWeek = comment.weekNum;
                    commentsByWeek[++index] = newWeek;
                }
            }
            $scope.comments = commentsByWeek;
        }


    }).error(function(data) {

    });
});

app.controller('AdminViewUsersCntrl', function($scope, $http, exportCSV) {

    $http.get('/api/users').success(function(users) {
        // Divide into groups by access lvl
        $scope.admin = [];
        $scope.students = [];
        for (var i = 0; i < users.length; i++) {
            if (users[i].accesslvl == 2) {
                $scope.admin.push(users[i]);
            } else {
                $scope.students.push(users[i]);
            }
        }
    }).error(function(err) {
        alert('Could not retrieve user data');
    });

    $scope.promoteModal = function(user) {
        $scope.selectedUser = user;
        $scope.modalTitle = 'Promotion';
        $scope.modalMessage = '<p>Are you sure you want to promote <strong>'+user.firstname+' '+user.lastname+'</strong> to admin?</p>';
        $scope.modalBtnAction = 'Promote'; $scope.modalMore = "to admin";
        $('#modalBtn').removeClass('btn-danger').addClass('btn-success');
        $scope.modalAction = promote;
        $('#confirmModal').modal('show');
    };

    $scope.demoteModal = function(user) {
        $scope.selectedUser = user;
        $scope.modalTitle = 'Demotion';
        $scope.modalMessage = '<p>Are you sure you want to demote <strong>'+user.firstname+' '+user.lastname+'</strong> to student?</p>';
        $scope.modalBtnAction = 'Demote'; $scope.modalMore = "to student";
        $('#modalBtn').removeClass('btn-danger').addClass('btn-success');
        $scope.modalAction = demote;
        $('#confirmModal').modal('show');
    };

    $scope.deleteModal = function(user) {
        $scope.selectedUser = user;
        $scope.modalTitle = 'Delete';
        $scope.modalMessage = '<p>Are you sure you want to delete <strong>'+user.firstname+' '+user.lastname+'</strong>?</p>';
        $scope.modalBtnAction = 'Delete'; $scope.modalMore = "";
        $('#modalBtn').removeClass('btn-success').addClass('btn-danger');
        $scope.modalAction = deleteUser;
        $('#confirmModal').modal('show');
    };

    var promote = function(user) {
        user.accesslvl = 2;  // Give user admin access. This is uploaded to server as put request.
        $http.put('/api/users/'+user.id, user).success(function(data) {
            $scope.students.removeItem(user);
            $scope.admin.push(user);
            $('#confirmModal').modal('hide');
        }).error(function() {
            $('#confirmModal').modal('hide');
            alert('Could not give user admin privileges');
        });
    };
    var demote = function(user) {
        user.accesslvl = 1;  // Give user lvl 1 access. This is uploaded to server as put request.
        $http.put('/api/users/'+user.id, user).success(function(data) {
            $scope.students.push(user);
            $scope.admin.removeItem(user);
            $('#confirmModal').modal('hide');
        }).error(function() {
            $('#confirmModal').modal('hide');
            alert('Could not demote user');
        });
    };
    var deleteUser = function(user) {
        $http.delete('/api/users/'+user.id).success(function(data) {
            if (user.accesslvl == 2) {
                $scope.admin.removeItem(user);
            } else {
                $scope.students.removeItem(user);
            }
            $('#confirmModal').modal('hide');
        }).error(function() {
            $('#confirmModal').modal('hide');
            alert('Could not delete user');
        });
    };

    $scope.cancel = function() {
        $('#confirmModal').modal('hide');
    };

    $scope.exportCSV = function() {
        exportCSV($scope.students, 'InstituteContacts');
    };
});


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


Array.prototype.removeItem =  function (item) {
    for(var i=0; i < this.length; i++) {
        if (angular.equals(this[i], item)) {
            this.splice(i, 1);
            break;
        }
    }
}