function init() {
    var me = this;
    me.navbarFadeInOnScroll();
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

init();

