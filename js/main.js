$(document).ready(function () {

    function createMenuList(){

        let colors = ['#3BFF00', '#BDC3FF', '#ff6666', '#9381FF', '#66ffd9', '#66b3ff'];
        let alt_labels = ['thin_ice', 'one_year_middle','grey_ice','white_ice','d_one_year_middle','nilas'];
        let labels = ['Thin ice', 'Fixed one year middle ice', 'Grey ice', 'White ice','Drifting One year middle ice', 'Nilas'];
    
        
        for (var i = 0; i < colors.length; i++) {

            let element = document.createElement('li');
            element.innerHTML = '<li> <a href="#">'+
            '<div class="d-flex d-fill align-items-center">'+
                '<i style="background-color: '+colors[i]+' ;" class="sidebar-i"></i>'+
                '<span class="sidebar-span"> '+labels[i]+' </span> '+
                '<img src="images/uncheck.png" width="24" height="24" name="'+i+' " alt="'+alt_labels[i]+'" class="float-right eye_ico">'+
                '</div> </a> </li>';

                $('#homeSubmenu').append(element); 
            }
    }

    createMenuList();
    


    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });


    $('#legend-check').change(function() {
        if($(this).is(':checked')) {
           $('.legend').hide(1000);
        }
        else{
            $('.legend').show(1000);
        }
              
    });
    
});


