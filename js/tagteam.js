$(document).ready(function(){   
    function getHubs() {
        $.getJSON('newjson.json', {}, function(json){  
            var str=''; 
           
            for (var key in json.hubs) {
                var val = json.hubs[key];
                var output = '<li><a href="hub.html?id='+key+'" id="'+key+'" class="ui-link-inherit">'
                +'<h3 class="ui-li-heading">'+val.title+'</h3><p class="ui-li-desc">';
                            
                if (val.description != null) {
                    output+=val.description;
                }
                
                output += '</p></a></li>';
                
                $("#hubs").append(output);
                
            }
            $('#hubs').listview('refresh');
        });     
    } 
    
    
    function sizeButtons() {
        $('#ui-bar ui-bar-c').height($('document').height() / 3);
    }
    
        getHubs();
        sizeButtons();
        
        
});