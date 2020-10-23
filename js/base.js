function init() {
    var me = this;
    me.navbarFadeInOnScroll();
    me.widgetsPopout();
};

function navbarFadeInOnScroll() {
    var navbar = document.getElementById('navBar');
    var widgets = document.getElementById('widgetSection');
    var navLogo = document.getElementById('brandLogo');
    navbar.style.backgroundColor = 'transparent';
    window.onscroll = function() {
        var scrollPosition = window.scrollY;
        if (scrollPosition >= 1) {
            navbar.classList.remove('transparent');
            navbar.style.backgroundColor = '#D1C4E9';
            widgets.style.backgroundColor = '#f06292';
            navLogo.style.color = '#fff';
        } else {
            navbar.style.backgroundColor = 'transparent';
            widgets.style.backgroundColor = 'transparent';
            navLogo.style.color = '#D1C4E9';
            navbar.style.boxShadow = 'unset';
            navbar.style.webkitBoxShadow = 'unset';
        }
    };
};

function widgetsPopout() {
    var widgets = document.getElementById('widgetSection');
    widgets.style.backgroundColor = 'green';
}

init();

