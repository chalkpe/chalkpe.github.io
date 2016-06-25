$(document).ready(function(){
    $('#fullpage').fullpage({
        anchors:['cover', 'dimigo', 'profile', 'contact'],
        sectionsColor: ['#1ABD9D', '#E91E63', '#3F51B5', '#607D8B'],

        navigation: true, navigationPosition: 'right',
        navigationTooltips: ['ChalkPE', 'Dimigo', 'Profile', 'Contact']
    });

    $('#scroll-to-top').click(function(){
        $.fn.fullpage.moveTo('cover');
    })
});
