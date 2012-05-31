$.extend({
    rootPath: function(){
	return '/';
    },
  
    getHubs:function() {
	$.getJSON('testhubs.json', {}, function(json){             
	    for (var key in json.hubs) {
		var val = json.hubs[key];
		var output = '<li><a href="#" data-transition="slidedown"'+
		'data-rel="dialog" id="hub-'+key+'" class="ui-link-inherit">' +
		'<h3 class="ui-li-heading">'+val.title+'</h3><p class="ui-li-desc">';               
		if (val.description != null) {
		    output+=val.description;
		}
		output += '</p></a></li>';
		$("#hubs").append(output);  
	    }
	    $('#hubs').listview('refresh');
	}); 
	
	$("a[id^='hub']").live('tap',function(event) {
	    $.saveInLocalStorage('currentHubId', $(this).attr('id').split('-')[1])
	});
    },
    
    getItems:function(from, to) {
	$.getJSON('testitems.json', {}, function(json){             
	    for (var key in json.hubs) {
		    //------------
		}
	});     
    },
    
    saveInLocalStorage:function(key,data) {
	if(typeof(localStorage) == 'undefined' ) {
	    alert('Your browser does not support localStorage()');
	}
	else {
	    try {
		localStorage.setItem(key, data);
	    }
	    catch (e) {
		if (e == QUOTA_EXCEEDED_ERR) {
		    alert('No place in localstorage');
		}
	    }
	}
    }
});