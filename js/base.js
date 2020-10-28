function init() {
    var me = this;
    me.navbarFadeInOnScroll();
    me.shiftBgColor();
};

function navbarFadeInOnScroll() {
    var navbar = document.getElementById('navBar');
    var widgets = document.getElementById('widgetSection');
    var wItems = document.getElementsByClassName('widget-item');
    var navLogo = document.getElementById('brandLogo');
    navbar.style.backgroundColor = 'transparent';
    window.onscroll = function() {
        var scrollPosition = window.scrollY;
        if (scrollPosition > 1) {
            navbar.classList.remove('transparent');
            navbar.style.backgroundColor = '#D1C4E9';
            navLogo.style.color = '#fff';
        } if (scrollPosition === 0) {
            navbar.style.backgroundColor = 'transparent';
            widgets.style.backgroundColor = 'transparent';
            for(var i = 0; i < wItems.length; i++) {
                wItems[i].style.color = 'transparent';
                }

        }
    };
};

function widgetsPopout() {
    var widgets = document.getElementById('widgetSection');
    var wItems = document.getElementsByClassName('widget-item');
    var counter = 0;
    widgets.style.backgroundColor = '#f06292';
        for(var i = 0; i < wItems.length; i++) {
            wItems[i].style.color = 'white';
            }
    
    // This makes the text transparent
    // for(var i = 0; i < wItems.length; i++) {
    //     wItems[i].style.color = 'transparent';
    // }
}


function shiftBgColor() {
    var navBar = document.getElementById('navBar').style,
        f = false,
        c1 = '#ac9dc8',
        c2 = '#D1C4E9',
        c3 = '#42ffc1',
        transparent = 'transparent',
        intervalSec = 3500;

    window.onscroll() = function () {
        var scrollPosition = window.scrollY;
        if (scrollPosition >= 1) {
            setInterval(function () {
                var f = !f;
                navBar.backgroundColor = f ? c2 : c3;

            }, intervalSec);
        }
        else if (scrollPosition === 0) {
            intervalSec = 0;
            navBar.backgroundColor = transparent;
            setInterval(function () {
               var f = !f;
                navBar.backgroundColor = f ? c2 : c3;

            }, intervalSec);
        }
    }
}

init();

