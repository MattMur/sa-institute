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
        alert('Request for students failed.');
    });

    $scope.exportCSV = function() {
        exportCSV($scope.students, $scope.className+'Contacts');
    };
});

app.controller('AdminViewClassesCntrl', function ($scope, $http) {
    var date = Date.today();

    // Query server for classes within selected date. Whenever the date changes we update.
    $scope.$watch('selectedDate', function(newDate) { //FORMAT: YYYY-MM-DD
        console.log('SelectedDate modified. '+newDate+'\nUpdating class list...');
        $http.get('/api/class?date='+newDate).success(function(data) {
            $scope.classes = data;
        }).error(function(data) {
            console.log("Classes request failed" + data);
            alert('Request for classes failed.');
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
            $scope.classes.removeItem(classObj);
            console.log(JSON.stringify($scope.classes));
        }).error(function(data) {
            console.log(data);
            alert("Could not delete class");
        });
        $('#confirmModal').modal('hide');
    };
});


// Trying new signature format for module controllers. Is supposed to be more dynamic.
app.controller('AdminNewClassCntrl', ['$scope', '$http', '$location', 'uploadSyllabus', 'checkValidFileType',
    function($scope, $http, $location, uploadSyllabus, checkValidFileType) {
    $scope.action = "Add";  //title
    $scope.btnAction = "Submit";
    $scope.modalTitle = "Class Details";
    $scope.files = [];

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
            spinner.start();

            if ($scope.files.length > 0) {
                // Syllabus name derived from class name. Date as unique identifier. Used to retrieve file from S3 later.
                var date = Date.today().toString('M-dd-yyyy');
                $scope.class.syllabus = $scope.class.name.toCamel() + date + '-Syllabus.pdf';
            }

            // Once the modal finishes hiding
            $http.post('/api/class', $scope.class).success(function(id) {

                if ($scope.files.length > 0) {
                    // Attempt to upload syllabus
                    uploadSyllabus($scope.files[0], $scope.class.syllabus, function(data, status, headers, config) {
                        // go back to classes after success
                        spinner.stop();
                        $location.path('/admin/classes');
                    });
                } else {
                    // go back to classes after success
                    spinner.stop();
                    $location.path('/admin/classes');
                }

            }).error(function(error) {
                //console.log("Create new class failed" + error);
                console.log(error);
                alert('Error creating new class.');
                spinner.stop();
            });
        });
        $("#confirmModal").modal('hide');
    };

    $scope.onFileDrop = function($files) {
        //console.log('Dropped a file');
        //console.log("Files: "+ JSON.stringify($files[0].name));
        if(checkValidFileType($files[0].name, '.pdf')) {
            $scope.files = $files;
            $scope.hideFileSelect = true;
        } else {
            alert('Syllabus must be in .pdf format');
        }
    };

    $scope.onFileSelect = function($files) {
        //console.log("Files: "+ JSON.stringify($files[0].name));
        if(checkValidFileType($files[0].name, '.pdf')) {
            $scope.files = $files;
            $scope.hideDropBox = true;
        } else {
            alert('Syllabus must be in .pdf format');
        }
    };


}]);

app.controller('AdminEditClassCntrl', function($scope, $http, $routeParams, $location, uploadSyllabus, checkValidFileType) {

    $scope.action = "Edit"; //title
    $scope.btnAction = "Save Changes";
    $scope.modalTitle = "Changes";
    $scope.files = [];

    $http.get('/api/class/'+$routeParams.classid).success(function(classObj) {

        // Format dates
        var dateformat = "yyyy-MM-ddTHH:mm:ss.000Z";
        classObj.start_date = Date.parseExact(classObj.start_date, dateformat).toString('yyyy-MM-dd');
        classObj.end_date = Date.parseExact(classObj.end_date, dateformat).toString('yyyy-MM-dd');
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
            spinner.start();
            if ($scope.files.length > 0) {
                // Syllabus name derived from class name. Date as unique identifier. Used to retrieve file from S3 later.
                var date = Date.today().toString('M-dd-yyyy');
                $scope.class.syllabus = $scope.class.name.toCamel() + date + '-Syllabus.pdf';
            }

            $http.put('/api/class/'+ $routeParams.classid, $scope.class).success(function(id) {

                if ($scope.files.length > 0) {
                    // Attempt to upload syllabus
                    uploadSyllabus($scope.files[0], $scope.class.syllabus, function(data, status, headers, config) {
                        // go back to classes after success
                        spinner.stop();
                        $location.path('/admin/classes');
                    });
                } else {
                    // go back to classes after success
                    spinner.stop();
                    $location.path('/admin/classes');
                }
            }).error(function(error) {
                console.log("Edit class failed\n" + error);
                spinner.stop();
            });

        });
        $('#confirmModal').modal('hide');
    };

    $scope.onFileDrop = function($files) {
        //console.log('Dropped a file');
        //console.log("Files: "+ JSON.stringify($files[0].name));
        if(checkValidFileType($files[0].name, 'pdf')) {
            $scope.files = $files;
            $scope.hideFileSelect = true;
            $scope.class.syllabus = null; // clear previous syllabus
        } else {
            alert('Syllabus must be in .pdf format');
        }
    };

    $scope.onFileSelect = function($files) {
        //console.log("Files: "+ JSON.stringify($files[0].name));
        if(checkValidFileType($files[0].name, 'pdf')) {
            $scope.files = $files;
            $scope.hideDropBox = true;
            $scope.class.syllabus = null; // clear previous syllabus
        } else {
            alert('Syllabus must be in .pdf format');
        }
    };
});


app.controller('AdminViewCardsCntrl', function($scope, $http, $routeParams, orderByWeek, calculateAvg) {

    window.spinner.start();

    // Add classname to scope
    $scope.className = $routeParams.className.capitalize();
    $scope.weekAvg = []; // Array of week studycard averages

    // Get studycard from the specific class with start and end dates filter
    var url = '/api/studycards?classid='+ $routeParams.classid; // classid should be on query string
    $http.get(url).success( function(studycards) {

        $scope.studyCardArray = orderByWeek(studycards);
        $scope.classAverages = calculateAvg(studycards);

        // Calculate averages for each week
        for (var i = 0; i < $scope.studyCardArray.length; i++) {
            // Only do calculations once. If there is a definition at that index then it is already done.
            if ($scope.weekAvg[i] === undefined) {
                if  ($scope.studyCardArray[i]) {
                    $scope.weekAvg[i] = calculateAvg($scope.studyCardArray[i]); // Calculate avg for specific week
                }
            }
        }
        window.spinner.stop();

    }).error(function (data) {
        console.log("StudyCards request failed" + data);
        alert("StudyCards request failed. " + data);
        window.spinner.stop();
    });

});


app.controller('AdminViewCommentsCntrl', function($scope, $http, $routeParams) {
    $scope.className = $routeParams.className.capitalize();
    $http.get('/api/studycards/notes?classid='+$routeParams.classid).success(function(commentsJson) {

        console.log('Comments: ' + JSON.stringify(commentsJson));
        var index = -1, comment, commentsByWeek = [], curWeek = 0; // Array of Arrays of Studycards

        if (commentsJson.length > 0) {
            // File cards into StudyCardArray by week_numberber
            for (var i = 0; i < commentsJson.length; i++) {

                comment = commentsJson[i];
                //console.log('card#: ' + (i+1) + ' week: ' + studycard.week_number + ' currentWeek: '+curWeek);
                if (curWeek >= comment.week_number) { // if current studycard belongs to current week
                    commentsByWeek[index].push(comment); // Add comment to that week's array
                } else {
                    // Else move to next week  (where we have comment for that week)
                    var newWeek = [comment]; // create new array for new week
                    newWeek.week_number = comment.week_number;
                    curWeek = comment.week_number;
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
            if (users[i].access_level == 2) {
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
        $scope.modalMessage = '<p>Are you sure you want to promote <strong>'+user.first_name+' '+user.last_name+'</strong> to admin?</p>';
        $scope.modalBtnAction = 'Promote'; $scope.modalMore = "to admin";
        $('#modalBtn').removeClass('btn-danger').addClass('btn-success');
        $scope.modalAction = promote;
        $('#confirmModal').modal('show');
    };

    $scope.demoteModal = function(user) {
        $scope.selectedUser = user;
        $scope.modalTitle = 'Demotion';
        $scope.modalMessage = '<p>Are you sure you want to demote <strong>'+user.first_name+' '+user.last_name+'</strong> to student?</p>';
        $scope.modalBtnAction = 'Demote'; $scope.modalMore = "to student";
        $('#modalBtn').removeClass('btn-danger').addClass('btn-success');
        $scope.modalAction = demote;
        $('#confirmModal').modal('show');
    };

    $scope.deleteModal = function(user) {
        $scope.selectedUser = user;
        $scope.modalTitle = 'Delete';
        $scope.modalMessage = '<p>Are you sure you want to delete <strong>'+user.first_name+' '+user.last_name+'</strong>?</p>';
        $scope.modalBtnAction = 'Delete'; $scope.modalMore = "";
        $('#modalBtn').removeClass('btn-success').addClass('btn-danger');
        $scope.modalAction = deleteUser;
        $('#confirmModal').modal('show');
    };

    var promote = function(user) {
        user.access_level = 2;  // Give user admin access. This is uploaded to server as put request.
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
        user.access_level = 1;  // Give user lvl 1 access. This is uploaded to server as put request.
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
            if (user.access_level == 2) {
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