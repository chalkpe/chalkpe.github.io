$(document).ready(function(){
    $('#fullpage').fullpage({
        anchors:['cover', 'dimigo', 'profile', 'contact'],
        sectionsColor: ['#1ABD9D', '#E91E63', '#03a9f4', '#607D8B'],

        navigation: true, navigationPosition: 'right',
        navigationTooltips: ['ChalkPE', 'Dimigo', 'Profile', 'Contact'],

        loopBottom: true, css3: true, scrollingSpeed: 1000
    });

    $('#scroll-to-top').click(function(){
        $.fn.fullpage.moveTo('cover');
    })
});
