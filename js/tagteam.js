$.extend({
    rootPath: function(){
	return '/';
    },
  
    getHubs:function() {
	$.getJSON('testhubs.json', {}, function(json){             
	    for (var key in json.hubs) {
		var val = json.hubs[key];
		var output = '<li><a href="hub.html" data-transition="slidedown"'+
		'data-rel="dialog" id="hub-'+key+'" class="ui-link-inherit">' +
		'<h3 class="ui-li-heading">'+val.title+'</h3><p class="ui-li-desc">';               
		if (val.description != null) {
		    output += val.description;
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
    
    getItems:function() {
	$.getJSON('testitems.json', {}, function(json){             
	    for (var key in json.feed_items) {
		var val = json.feed_items[key];
		var output = '<li><a href="cItem.html" class="ui-link-inherit">' +
		'<h3 class="ui-li-heading">'+val.title+'</h3><p class="ui-li-desc">by ' +             
		val.authors +'</p></a></li>';
		$("#items_list").append(output);  
	    }
	    $('#items_list').listview('refresh');
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