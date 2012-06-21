$.extend({
    getHubs:function() {
        $.getJSON('testhubs.json', {}, function(json){
            $.each(json.hubs, function (key, val) {
                var desc = '';
                if (val.description != null) {
                    desc = val.description;
                }
                $("#hubs").append(
                    '<li><a href="hub.html" data-transition="slidedown" data-rel="dialog" '+
                    'id="hub-'+key+'" class="ui-link-inherit">'+'<h3 class="ui-li-heading">'+
                    val.title+'</h3><p class="ui-li-desc">'+desc+'</p></a></li>'); 
            });
            $('#hubs').listview('refresh');
        }).error(function() {
            alert("json error");
        });
	
        $("a[id^='hub']").live('tap',function(e) {
            $.setLocal('currentHubId', $(this).attr('id').split('-')[1]);
        });
    },
    
    getItems:function() {
        $.getJSON('testitems.json', {}, function(json){  
            $.each(json.feed_items, function (key, val) {
                var numbers = val.hub_ids.slice(',');
                for (var i=0; i<numbers.length; i++) {
                    if(numbers[i]==localStorage.getItem('currentHubId')) {
                        $("#items").append(
                            '<li><a id="item-'+key+
                            '" href="./cItem.html" class="ui-link-inherit">'+
                            '<h3 class="ui-li-heading">'+val.title+'</h3><p class="ui-li-desc">by '+           
                            val.authors+'</p></a></li>'); 
                        $("#item-"+key).live('tap',function(e) {
                            $.setLocal('currentItemId',key);
                        });
                    }
                }
            });
            $('#items').listview('refresh');    
        });
    },
    
    getInputs:function() {
        $.getJSON('hub_feeds.json', {}, function(json){   
            $("#inputs").listview();
            $.each(json.hub_feeds, function(key,val){
                if (val.hub.id == $.getLocal('currentHubId')) {
                    $('#inputs').append('<li><a href="acura.html"><img src="./css/icons/rss-01.png"></img>'+val.title+'<p class="ui-li-desc">'+val.description+'</p></a></li>');
                }
            });
            $('#inputs').listview('refresh');     
        });
    },
    
    getCurrentItem:function() {
        $.getJSON('testitems.json', {}, function(json){ 
            var cur = json.feed_items[$.getLocal('currentItemId')];
            $('#title').html(cur.title);
            $('#url').html(cur.url);
            $('#published').html(cur.date_published.slice("T"));
            $('#authors').html(cur.authors);
            var tags = cur.tags.tags.slice(',');
            $.each(tags, function(key,val){
                $('#tags').append(val);
                if (key == tags.count-1) {
                $('#tags').append("; ");
                }
            });
            
        })
    },
    
    setLocal:function(key,data) {
        if(typeof(localStorage) == 'undefined' ) {
            console.log('Your browser does not support localStorage()');
        }
        else {
            try {
                localStorage.setItem(key, data);
            }
            catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    console.log('No place in localstorage');
                }
            }
        }
    },
    
    getLocal:function(key) {
        try {
            return localStorage.getItem(key)
        } 
        catch (e) {
            console.log('Wrong key');
        }
    },
    
    debugInfo:function() {
        console.log('page: ' + $('[data-role=page]').attr('id'));
        console.log('hub id: ' +  $.getLocal('currentHubId'));
        console.log('---');
        console.log('cur item:' + $.getLocal('currentItemId'));
    }
});

$(document).ready(function(){
    $('[data-role=page]').live('pageshow', function () {
        switch ($(this).attr('id')) {
            case 'index':
                $.getHubs();
                break;
            case 'items_page':
                $.getItems();
                break;
            case 'inputs_page':
                $.getInputs();
                break;
            case 'current_item':
                $.getCurrentItem();
            
        }
        $.debugInfo();
    });
});