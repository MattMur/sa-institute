/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/14/13
 * Time: 12:57 AM
 * To change this template use File | Settings | File Templates.
 */


app.controller('LoginCntrl', function($scope, $http, md5) {

    $scope.login = function() {
        login($http, $scope.user, md5($scope.pass), null);
    };
});

app.controller('RegisterCntrl', function($scope, $http, md5) {

    $scope.register = function() {

        var user = angular.copy($scope.newUser);

        // Encrypt password
        user.password = md5(user.password);

        // Do PUT to register new user
        //console.log(JSON.stringify(user));
        $http.post('/api/users', user).success(function(data) {
            // Success. Now lets login with new user.
            login($http, user.email, user.password, null);
        }).error(function(data) {
            window.alert("Attempt to create new user failed. " + data);
        });
    };

});


// Custom method for logging in. Not a controller.
function login($http, user, pass, callback) {

    //var basicAuth = 'Basic ' + Base64.encode(user + ':' + pass);
    var loginData = { user:user, pass:pass };
    $http.post('/login', loginData)
        .success(function(data) {

            //Call callbackfunction
            if (callback) {
                callback(data);
            }

            //Set cookie so we remember who they are
            $.cookie('userid', data.id, { path: '/' });

            // Now that we are authenticated we redirect to studycard
            window.location = '/';

        }).error(function(data) {
            $http.defaults.headers.common['Authorization'] = null;
            window.alert("Login failed. " + data);
        });
}

app.controller('ForgotPassCntrl', function($scope, $http, md5) {

    $scope.sendEmail = function() {
        $http.post('/api/users/forgotpass', { email : $scope.email }).success(function(data) {
            //nothing
        }).error(function(error) {
            console.log(error);
            alert('Something went wrong sending email. Please contact administrator');
        });
        alert('An email has been sent to your inbox. Please check it for further instructions on how to reset your password.');
    };
});

app.controller('ResetPassCntrl', function($scope, $http, md5, $routeParams, $location) {
    $scope.resetPassword = function() {

        // check both passwords are the same
        if ($scope.pass1 === $scope.pass2) {
            var body = { pass : md5($scope.pass1), hash : $routeParams.id };
            $http.post('/api/users/resetpass', body).success(function(data) {
                alert(data); // Server will tell us if success or fail
                $location.path('/login.html').search('');
            }).error(function(error) {
               console.log(error);
                alert('Could not reset password. Please contact administrator');
            });
        } else {
            alert('Passwords do not match.');
        }
    };
});