/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 9/12/13
 * Time: 7:16 PM
 * To change this template use File | Settings | File Templates.
 */

// Directive for displaying the subtitle underneath 'San Antonio Institute'
app.directive('subtitle', function() {
    return {
        transclude: true, // make the element availible in this directive (used with ng-transclude)
        restrict: 'E',   // directive is an element
        replace: true,  // replace html (subtitle)
        template : '<div class="titleContainer">' +
            '<img class="titlearrow" src="/images/arrow_right.png" />' +
            '<h4 class="title" ng-transclude></h4>' +
            '</div>'
    }
});