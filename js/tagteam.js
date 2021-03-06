/*
 *  tags-items
 *  inputs-items
 *  inputs (page)
 *
 */

$.extend({
    link: function() {
        return 'http://tagteam.harvard.edu/';
    },

    root:function () {
        return $.link()+'hubs';
    },


    links:function (arg1,arg2) {
        return {
            hub         :$.root() + '.json?callback=?',
            items       :$.root() + '/' + $.local.get('cHubId') + '/items.json?callback=?',
            inputs      :$.root() + '/' + $.local.get('cHubId') + '/hub_feeds.json?callback=?',
            tags        :$.root() + '/' + $.local.get('cHubId') + '/tags.json?callback=?',
            tags_items  :$.root() + '/' + $.local.get('cHubId') + '/tag/json/' + arg1 + '?callback=?',
            inputs_items:$.root() + '/' + $.local.get('cHubId') + '',
            remixes     :$.root() + '/' + $.local.get('cHubId') + '/republished_feeds.json?callback=?', /*args = feed ID*/
            bookmarks   :$.root() + '/' + $.local.get('cHubId') + '/bookmark_collections.json?callback=?',
            content     :$.link()+'/hub_feeds/'+arg1+'/feed_items/'+arg2+'/content.json?callback=?',
            related     :$.link()+'/hub_feeds/'+arg1+'/feed_items/'+arg2+'/related.json?callback=?'
        }
    },

    getHubs:function (link) {
        /*Clearing localstorage if we are on the main page*/
        localStorage.clear();
        $.getJSON(link, {}, function (json) {
            $('#hubs').empty();
            $.each(json.hubs, function (key, val) {
                var desc = '';
                if (val.description != null) {
                    desc = val.description;
                }
                $("#hubs").append(
                    '<li><a href="hub.html" data-transition="slidedown" data-rel="dialog" ' +
                        'id="hub-' + val.id + '" class="ui-link-inherit">' + '<h3 class="ui-li-heading">' +
                        val.title + '</h3><p class="ui-li-desc">' + desc + '</p></a></li>');
            });
            $('#hubs').listview('refresh');
        });

        $("a[id^='hub']").live('tap', function (e) {
            $.local.set('cHubId', $(this).attr('id').split('-')[1]);
        });
    },

    getItems:function (mode,link) {
        var hub = $.local.get('cHubId');
        $.getJSON(link, {}, function (json) {
            $("#items").empty();
            $.each(json.feed_items, function (key, item) {
                //if ((key >= $.item_range[0]) && (key <= $.item_range[1])) {
                var numbers = item.hub_ids.slice(',');
                for (var i = 0; i < numbers.length; i++) {
                    if (numbers[i] == hub) {
                        var author =  'by ' + item.authors;
                        if ((item.authors == '') || (item.authors == null)) {
                            author = ' &nbsp; ';
                        }
                        $("#items").append(
                            '<li><a id="item-' + item.id +
                                '" href="./cItem.html" class="ui-link-inherit">' +
                                '<h3 class="ui-li-heading">' + item.title + '</h3><p class="ui-li-desc">'+
                                author + '</p></a></li>');
                        $("#item-" + item.id).live('tap', function () {

                            $.local.set('cItem', $.stringify(item));
                            $.local.set('cItemId', key);
                        });
                    }
                }
                //}
            });
            $('#items').listview('refresh');
        });
    },

    getInputs:function (link) {
        $.getJSON(link, {}, function (json) {
            $("#inputs").empty();
            $.each(json.hub_feeds, function (key, val) {
                if (val.hub.id == $.local.get('cHubId')) {
                    $('#inputs').append('<li><a href="#"><!--<img src="./css/icons/rss.png">Img</img>-->' + val.title +
                        '<p class="ui-li-desc" style="margin-top: 10px !important;">' + val.description + '</p></a></li>');
                }
            });
            $('#inputs').listview('refresh');
        });
    },

    getTags:function (link) {
        $.getJSON(link, {}, function (json) {
            $("#tags").empty();
            $.each(json.tags, function (key, val) {
                $('#tags').append('<li id="tag-' + val.id + '"><a href="items.html">' + val.name + '</a></li>');
                $('#tag-' + val.id).live('tap', function (e) {
                    $.local.set('tagItems', true);
                    $.local.set('tagName', val.name);
                });
            });
            $('#tags').listview('refresh');
        });
    },

    getRemixes:function(link) {
        $.getJSON(link, {}, function (json) {
            $("#remixes").empty();
            $.each(json.republished_feeds, function (key, val) {
                    $('#remixes').append('<li><a id="remix-'+val.id+'" href="./items.html" class="ui-link-inherit">'+
                        '<h3 class="ui-li-heading">'+val.title+'/'+val.hub.title+'</h3><p class="ui-li-desc">'+
                        val.input_sources.length + ' input(s). 0 removal(s).</p></a></li>');
            });
            $('#remixes').listview('refresh');
        });
    },

    getCurrentItem:function (link) {
        var item = $.parseJSON($.local.get('cItem')); //json.feed_items[$.local.get('cItemId')];
        $.getJSON($.links(item.hub_feed_ids[0],item.id).content, {}, function(json){
            $('#itemid').html('Item ' + item.id);
                $('#title').html(item.title);
                $('#published').html(item.date_published.replace('T', ' ').slice(0, item.date_published.length - 9));
                $('#updated').html(item.last_updated.replace('T', ' ').slice(0, item.last_updated.length - 9));
                $('#authors').html(item.authors);
                $('#cont').html(json.feed_item.content);
                $('#url').attr('href', item.url);
                $('#tags').empty();
                    if (item.tags.length > 0) {
                        $.each(item.tags.tags, function (key, val) {
                            $('#tag_list').append('<li  id="tag-' + key + '"><a href="items.html"">' + val + '</a></li>');
                            $('#tag-' + key).live('tap', function () {
                                $.local.set('tagItems', true);
                                $.local.set('tagName', val);
                            });
                        });
                    }
                $('#tag_list').listview('refresh');
                $.getJSON($.links(item.hub_feed_ids[0],item.id).related, {}, function(rel) {
                    $('#related-items').empty();
                    $.each(rel.feed_items, function(k,v){
                        $('#related-items').append('<li><a  id="rel-'+ v.id+'" href="./cItem.html">'+v.title+'</a></li>');
                        $("#rel-" + v.id).live('tap', function () {
                            $.local.set('cItem', $.stringify(v));
                            $.local.set('cItemId', k);
                            window.location.reload();
                        });
                    });
                    $('#related-items').listview('refresh');
                });
        });
    },

    getBookmarks : function (link) {
        $.getJSON(link, {}, function (json) {
            $("#bookmarks").empty();
            $.each(json.hub_feeds, function (key, val) {
                $('#bookmarks').append('<li><a href="#" class="ui-link-inherit">' +
                    '<img src="./css/icons/bm.png">Img</img>' +
                    '<h3 class="ui-li-heading">'
                    +val.title+'</h3><p class="ui-li-desc">'+
                     val.description + '</p></a></li>');
            });
            $('#bookmarks').listview('refresh');
        })
    },

    local: {
        set: function (key, data) {
            if (typeof(localStorage) == 'undefined') {
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

        get:function (key) {
            try {
                return localStorage.getItem(key)
            }
            catch (e) {
                console.log('Wrong key');
            }
        },

        remove:function (key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    console.log('Cant delete "' + key + '" item');
                }
            }
        }

    },

    stringify: function (jsonData,tabMultiple) {
        var tab = "";
        if(!tabMultiple)
            tabMultiple = 1;
        var strJsonData = '{';
        var itemCount = 0;
        for (var item in jsonData) {
            if (itemCount > 0) {
                strJsonData += ',';
            }
            temp = jsonData[item];
            if (typeof(temp) == 'object') {
                tabMultiple++;
                s = $.stringify(temp,tabMultiple);
                tabMultiple--;
            }
            else{
                tabMultiple--;
                s = '"' + temp + '"';
            }
            strJsonData += tab + '"' + item + '":' + s;
            itemCount++;
        }
        strJsonData += tab + '}';
        return strJsonData;
    },

    debugInfo:function () {
        console.log('page: ' + $('[data-role=page]').attr('id'));
        for (var key in localStorage){
            console.log(key, " = ", localStorage[key]);
        }
        console.log('tagname - ' + $.local.get('tagName') + ';' +
            ' ||| LINK:' + $.links(($.local.get('tagName'))).tags_items);
        console.log('---');
        console.log($.local.get('cItem'));
        console.log('---');
    }
});

$(document).ready(function () {
    $('[data-role=page]').live('pageshow', function () {
        switch ($(this).attr('id')) {
            case 'index':
                $.getHubs($.links().hub);
                break;
            case 'items_page':
                if ($.local.get('tagItems') == 'true') {
                    $.getItems("",$.links(($.local.get('tagName'))).tags_items);
                    $.local.remove('tagItems');
                } else {
                    $.getItems("",$.links().items);
                }
                break;
            case 'inputs_page':
                $.getInputs($.links().inputs);
                break;
            case 'current_item':
                $.getCurrentItem($.links().items);
                break;
            case 'tags_page':
                $.getTags($.links().tags);
                break;
            case 'remix_page':
                $.getRemixes($.links().remixes);
                break;
            case 'bookmarks_page':
                $.getBookmarks($.links().bookmarks);
                break;
        }
        $.debugInfo();
    });
});