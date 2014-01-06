/**
 * Created by mattmurray on 1/6/14.
 */

// Random Global Object Extentions
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Convert a string with spaces to Camel Case
String.prototype.toCamel = function(){
    return this.replace(/\s(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
};

Array.prototype.removeItem =  function (item) {
    for(var i=0; i < this.length; i++) {
        if (angular.equals(this[i], item)) {
            this.splice(i, 1);
            break;
        }
    }
}
