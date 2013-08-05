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