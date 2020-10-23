function init() {
    var me = this;
    me.navbarFadeInOnScroll();
};

function navbarFadeInOnScroll() {
    var navbar = document.getElementById('navBar');
    var navLogo = document.getElementById('brandLogo');

    window.onscroll = function() {
        var scrollPosition = window.scrollY;
        if (scrollPosition >= 1) {
            navbar.style.backgroundColor = '#D1C4E9';
            navLogo.style.color = '#fff';
        } else {
            navbar.style.backgroundColor = 'transparent';
            navLogo.style.color = '#D1C4E9';
            navbar.style.boxShadow = 'unset';
            navbar.style.webkitBoxShadow = 'unset';
        }
    };
    // window.addEventListener(scrollPosition, (event) => {
    //     if (scrollPosition > 5) {
    //         navbar.style.backgroundColor = "#D1C4E9";
    //     };
    // });
    
};

init();

