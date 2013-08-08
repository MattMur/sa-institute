/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/3/13
 * Time: 5:21 PM
 * To change this template use File | Settings | File Templates.
 */
function StudyCardCntrl($scope, $http) {
    $http.get('http://localhost:8888/class').success( function(data) {
        $scope.classes = data;
        console.log(data);
    }).error(function (data) {
       console.log("The request failed" + data);
    });

    //submit a new studycard from the form
    $scope.submit = function () {
        //{"class":"1","frequency":"3","quality":"4","block":"","thoughts":" "}
        $scope.studycard.students_id = 2;
        $http.put('studycards', $scope.studycard).success(function(data) {
            window.location = "#submit";
        }).error(function(data) {
            window.alert("Attempt to create new studycard failed " + data);
        });
    }
}

/*var myApp = angular.module('myApp',[]);

myApp.controller('StudyCardCntrl', ['$scope', '$http', function($scope, $http) {
    $http.get('http://localhost:8888/teachers').success( function(data) {
        $scope.teachers = data;
        console.log(data);
    }).error(function (data) {
            console.log("The request failed" + data);
        });
}]);

    */