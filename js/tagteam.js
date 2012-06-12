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
        }).error(function() { alert("json error");});
	
        $("a[id^='hub']").live('tap',function(e) {
            $.saveInLocalStorage('currentHubId', $(this).attr('id').split('-')[1]);
        });
    },
    
    getItems:function() {
        $.getJSON('testitems.json', {}, function(json){  
            $.each(json.feed_items, function (key, val) {
                $("#items").append(
                    '<li><a id="item-'+key+
                    '" href="./cItem.html" class="ui-link-inherit">'+
                    '<h3 class="ui-li-heading">'+val.title+'</h3><p class="ui-li-desc">by '+           
                    val.authors+'</p></a></li>');          
            });
            $('#items').listview('refresh');      
            $("a[id^='item']").live('tap',function(e) {
                $.saveInLocalStorage('currentItem', json.feed_items[$(this).attr('id').split('-')[1]]);
            // alert(localStorage.getItem('currentItem').id);
            });
        });
    },
    
    getInputs:function() {
        $.getJSON('hub_feeds.json', {}, function(json){   
            $("#items").listview();
           
            $('#items').listview('refresh');      
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

$(document).ready(function(){
    $('[data-role=page]').live('pageshow', function () {
        switch ($(this).attr('id')) {
            case 'index':
                $.getHubs();
                break;
            case 'items_page':
                $.getItems();
                break;
        }
    });
});