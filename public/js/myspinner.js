/**
 * Created by mattmurray on 1/12/14.
 */
// Create global spinner.. Accesible from ANYWHERE. boom.
window.spinner = new Spinner({
    lines: 9, // The number of lines to draw
    length: 7, // The length of each line
    width: 4, // The line thickness
    radius: 7, // The radius of the inner circle
    corners: 2, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#fff', // #rgb or #rrggbb or array of colors
    speed: 1.2, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
});

// Call 'start' method to have it added to center pannel automatically
window.spinner.start = function() {
    this.spin(document.getElementById('container'));
};