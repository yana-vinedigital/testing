/*
 * Main
 */

window.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector("nav.header");

    document.onscroll = function() {
        if (document.body.scrollTop == 0) {
            nav.className = "header";
        }
        else {
            nav.className = "header stick";
        }
    };

    // Look for thank you page from Campaign Monitor
    if( window.location.search.substr(1) == "thanks" ){
        var content = "<p style='padding-top: 22px'>Thanks for signing up! We'll be in touch soon.</style></p>";
        document.getElementsByClassName('signup')[0].innerHTML = content;
    }
});
