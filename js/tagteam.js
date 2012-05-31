$.extend({
    rootPath: function(){
        return '/';
    },
  
    getHubs:function() {
        $.getJSON('newjson.json', {}, function(json){             
            for (var key in json.hubs) {
                var val = json.hubs[key];
                var output = '<li><a href="hub.html?id='+key+'" data-transition="slidedown"'+
                            'data-rel="dialog" id="'+key+'" class="ui-link-inherit">' +
                            '<h3 class="ui-li-heading">'+val.title+'</h3><p class="ui-li-desc">';               
                if (val.description != null) {
                    output+=val.description;
                }
                output += '</p></a></li>';
                $("#hubs").append(output);  
            }
            $('#hubs').listview('refresh');
        });     
    }
});

$(document).ready(function(){   
    $.getHubs(); 
});