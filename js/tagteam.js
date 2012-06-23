$.extend({
    root:function() {
        return 'http://tagteam.harvard.edu';
    },
    
    links:function(args) {
        return {
            'hub':  $.root()+'/hubs.json?callback=?',
            'items':$.root()+'/hubs/'+$.getLocal('cHubId')+'/items.json?callback=?'
        }
    },
    
    getHubs:function() {
        $.getJSON($.links().hub, {}, function(json){ 
            $.each(json.hubs, function (key, val) {
                var desc = '';
                if (val.description != null) {
                    desc = val.description;
                }
                $("#hubs").append(
                    '<li><a href="hub.html" data-transition="slidedown" data-rel="dialog" '+
                    'id="hub-'+val.id+'" class="ui-link-inherit">'+'<h3 class="ui-li-heading">'+
                    val.title+'</h3><p class="ui-li-desc">'+desc+'</p></a></li>'); 
            });
            $('#hubs').listview('refresh');
        });
	
        $("a[id^='hub']").live('tap',function(e) {
            $.setLocal('cHubId', $(this).attr('id').split('-')[1]);
        });
    },
    
    getItems:function() {
        var hub = $.getLocal('cHubId');
        $.getJSON($.links().items, {}, function(json){  
            $.each(json.feed_items, function (key, item) {
                var numbers = item.hub_ids.slice(',');
                for (var i=0; i<numbers.length; i++) {
                    if(numbers[i]==hub) {
                        $("#items").append(
                            '<li><a id="item-'+item.id+
                            '" href="./cItem.html" class="ui-link-inherit">'+
                            '<h3 class="ui-li-heading">'+item.title+'</h3><p class="ui-li-desc">by '+           
                            item.authors+'</p></a></li>'); 
                        $("#item-"+key).live('tap',function(e) {
                            $.setLocal('cItemId',key);
                        });
                    }
                }
            });
            $('#items').listview('refresh');    
        });
    },
    
    getInputs:function() {
        $.getJSON('hub_feeds.json', {}, function(json){   
            $("#inputs").empty();
            $.each(json.hub_feeds, function(key,val){
                if (val.hub.id == $.getLocal('cHubId')) {
                    $('#inputs').append('<li><a href="acura.html"><img src="./css/icons/rss-01.png"></img>'+val.title+'<p class="ui-li-desc">'+val.description+'</p></a></li>');
                }
            });
            $('#inputs').listview('refresh');     
        });
    },
    
    getCurrentItem:function() {
        $.getJSON($.links().items, {}, function(json){ 
            var item = json.feed_items[$.getLocal('cItemId')];
            $('#itemid').html('Item '+item.id);
            $('#title').html(item.title);
            $('#published').html(item.date_published.replace('T',' '));
            $('#updated').html(item.last_updated.replace('T',' '))
            $('#authors').html(item.authors);
            $('#url').attr('href',item.url); 
            var tags = item.tags.tags.slice(',');
            $('#tags').empty();
            $.each(tags, function(key,val){
                $('#tags').append('<li><a href="index.html">'+val+'</a></li>');
            });
            $('#tags').listview('refresh'); 
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
        console.log('hub id: ' +  $.getLocal('cHubId'));
        console.log('---');
        console.log('cur item:' + $.getLocal('cItemId'));
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