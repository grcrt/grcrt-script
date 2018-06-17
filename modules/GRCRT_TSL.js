// Towns Sorted List
function _GRCRT_TSL() {
    "use strict";

    var _IdS = 'grcrt_tsl';
	var imgSprites = {
        // tsl: this.Const.uiImg + "tsl_sprite.png"
        tsl: RepConv.grcrt_cdn+"ui/tsl_sprite.png"
    }
	this.createWindow = function() {
		try {
			(WM.getWindowByType(_IdS)[0]).close()
		} catch (e){}
		window.GRCRTtslWnd = WF.open(_IdS);
    }


    // dodanie do menu
    RepConv.menu[3] = {
		'name' : 'TSL.WND.WINDOWTITLE',
		'action' : "GRCRT_TSL.createWindow();",
		'class' : 'tsl'
	}
    
    // ikona w menu
    $('head')
        .append(
            $('<style/>')
                .append(
                    '.grcrt.tsl { background-position: -113px -80px; cursor: pointer;}'
                )
        )


    // style dla modułu
    // zmiana miasta
    $('head')
        .append(
            $('<style/>')
                .append(
                    '#grcrtTslGroup {'+
                        'width: 190px;'+
                    '}'
                )
                .append(
                    '#townsSortedList {'+
                        'height: 100%;'+
                        'overflow-y: auto;'+
                        'font-size: 11px;'+
                        'font-family: Verdana;'+
                        'font-weight: 700;'+
                    '}'
                )
                .append(
                    '#TSLhead {'+
                        'height: 30px;'+
                        'width: 100%;'+
                        'position: relative;'+
                        'background: url('+imgSprites.tsl+') 0 0 repeat-x;'+
                    '}'
                )
                .append(
                    '#townsSortedListDetail {'+
                        'height: 365px;'+
                        'overflow-x: hidden;'+
                        'overflow-y: scroll;'+
						'margin-left: 5px;'+
                    '}'
                )
                .append(
                    '.TSLwrapper {'+
                        'height: 16px;'+
                        'width: 160px;'+
                        'position: absolute;'+
                        'top: 0;'+
                        'right: 0;'+
                        'bottom: 0;'+
                        'left: 0;'+
                        'margin: auto;'+
                    '}'
                )
                .append(
                    '.TSLicon {'+
                        'width: 18px;'+
                        'height: 16px;'+
                        'background: url('+imgSprites.tsl+') -44px -31px no-repeat;'+
                        'display: inline-block;'+
                    '}' 
                )
                .append(
                    '#grcrtTslTownsList .js-scrollbar-content {'+
                        'padding-left: 5px;'+
                    '}'
                )
                .append(
                    '.TSLcityName {'+
                        'display: inline-block;'+
                        'vertical-align: top;'+
                        'color: #FFF;'+
                        'width: 124px;'+
                        'text-align: center;'+
                    '}'
                )
                .append(
                    '.TSLitem {'+
                        'cursor: pointer;'+
                        'color: #423515;'+
                        'line-height: 22px;'+
                        'position: relative;'+
                    '}'
                )
                .append(
                    '.TSLitem:hover {'+
                        'background-color: rgba(0, 0, 0, 0.1);'+
                    '}'
                )
                .append(
                    '.TSLitem:hover::before {'+
                        'content: "";'+
                        'display: inline-block;'+
                        'border: 4px solid transparent;'+
                        'border-left: 7px solid #423515;'+
                        'padding-right: 2px;'+
                    '}'
                )
                .append(
                    '.TSLitem:hover::after {'+
                        'content: "";'+
                        'display: inline-block;'+
                        'background: url('+imgSprites.tsl+') -44px -68px no-repeat;'+
                        'width: 15px;'+
                        'height: 19px;'+
                        'padding-right: 10px;'+
                        'position: absolute;'+
                        'right: 20px;'+
                    '}'
                )
                .append(
                    '.tsl_set {'+
                        'content: "";'+
                        'display: inline-block;'+
                        'border: 4px solid transparent;'+
                        'border-left: 7px solid #423515;'+
                        'padding-right: 10px;'+
                        'background-color: rgba(0, 0, 0, 0.1);'+
                        'width: 213px;'+
                        'padding-left: 5px;'+
                    '}'
                )
        );
	// $('#townsSortedList > #townsSortedListDetail > div[townid]').click(function(){
 //        HelperTown.townSwitch($(this).attr("townid"));
 //        onClick(this);
	// });
    // obsługa nowych okien
    RepConv.initArray.push('GRCRT_TSL.init()');
    RepConv.wndArray.push(_IdS);
    this.init = function(){
       "use strict";
	   new _grcrtWindowTSL();
    }
    // -- okienko
    function _grcrtWindowTSL(){
        "use strict";
        var _IdS = 'grcrt_tsl';
        var _grcrtWinIds = require("game/windows/ids");
        _grcrtWinIds[_IdS.toUpperCase()] = _IdS,
        function() {
            "use strict";
            var a = window.GameControllers.TabController,
                b = window.GameModels.Progressable,
                c = a.extend({
                    listGroup: null,
                    initialize: function(b) {
                        a.prototype.initialize.apply(this, arguments)
                        var
                            _wnd = this.getWindowModel(),
                            _$el = this.$el,
                            _content = $('<div/>')
                                .append(
                                    $('<div/>',{'style':'padding:5px'})
                                        .append(
                                            $('<div/>',{'id':'grcrtTslGroup','class':'dropdown default'})
                                        )
                                        .append(
                                            $('<a/>', {'id':'grcrtTslReload', 'href':"#n", 'class':"grc_reload down_big reload", 'style':"float: right; height: 22px; margin: -1px 0 1px;"})
                                        )
                                )
                                .append(
                                    $('<div/>',{'id':'grcrtTslTownsList'})
                                )
                        this.$el.html(_content)
                        _wnd.hideLoading();


                        if (!(_wnd.getJQElement)) {
                            _wnd.getJQElement = function() {
                                return _content;
                            }
                        }
                        if (!(_wnd.appendContent)) {
                            _wnd.appendContent = function(a) {
                                return _content.append(a);
                            }
                        }
                        if (!(_wnd.setContent2)) {
                            _wnd.setContent2 = function(a) {
                                return _content.html(a);
                            }
                        }
                        //this.bindEventListeners()
                        this.initializeComponents()
                        this.renderList()
                    },
                    registerComponent: function(a, b, c) {
                        var d = {
                            main: this.cm_context.main,
                            sub: c || this.cm_context.sub
                        };
                        return CM.register(d, a, b)
                    },
                    unregisterComponents: function(a) {
                        var b = {
                            main: this.getMainContext(),
                            sub: a || this.getSubContext()
                        };
                        CM.unregisterSubGroup(b)
                    },
                    destroy: function() {
                        this.unregisterComponents()
                    },
                    close: function() {
                        this.unregisterComponents()
                    },
                    initializeComponents: function() {
                        var a = this.$el, that = this;
                        // var opt = []
                        // $.each(MM.getCollections().TownGroup[0].getTownGroups(), function(idxG, group){
                        //     opt.push({value:group.getId(),name:group.getName()})
                        // })
                        this.listGroup = this.registerComponent("grcrtTslGroup", 
                            a.find("#grcrtTslGroup").dropdown({
                            value: MM.getCollections().TownGroup[0].getActiveGroupId(),
                            options: MM.getCollections().TownGroup[0].getTownGroupsForDropdown(),
                            disabled: !MM.getModels().PremiumFeatures[Game.player_id].isActivated("curator")
                        }).on("dd:change:value", function(a, b, c) {
                            that.townList()
                        }));
                        this.registerComponent("grcrtTslReload", a.find("#grcrtTslReload")
                                .button({})
                                .on("btn:click", function() {
                                    that.renderList();
                                }));
                        // if(!MM.getModels().PremiumFeatures[Game.player_id].isActivated("curator")){
                        //     this.listGroup.disable();
                        // }
                    },
                    render: function() {
                    },
                    renderList: function() {
                        var list = this.$el.find($('#grcrtTslTownsList'));
                        list.html("");
                        list.append(
                            $('<div/>',{
                                'id' : 'TSLhead'
                            })
                            .append(
                                $('<span/>', {
                                    'class':'TSLwrapper'
                                })
                                .append(
                                    $('<span/>', {
                                        'class': 'TSLicon' 
                                    })
                                )
                                .append(
                                    $('<span/>', {
                                        'class': 'TSLcityName',
                                        'style': (Game.townName.length > 14)?('font-size: 8px;'):'',
                                        'townid': Game.townId
                                    })
                                    .append(
                                        $('<a/>',{'class':'gp_town_link','style':'color: white','href':'#'+MM.getModels().Town[Game.townId].getLinkFragment()})
                                            .html(Game.townName)
                                    )
                                    //.text(Game.townName)
                                )
                                .append(
                                    $('<span/>', {
                                        'class': 'TSLicon' 
                                    })
                                )
                            )
                            .append(
                                $('<div/>', {'id':'TSLTownList'})
                            )
                        )
                        this.townList();
                    },
                    townList: function(){
                        function calculate(){
                            var
                                _unitSpeed = GameData.units.attack_ship.speed, 
                                _offset = 900/Game.game_speed,
                                elCurTown = MM.getModels().Town[Game.townId],
                                swapped,
                                elTown;
                            $.each(MM.getCollections().TownGroupTown[0].getTowns(parseInt(that.listGroup.getValue())), function(idTown, elTownInGroup){
                                elTown = MM.getModels().Town[elTownInGroup.getTownId()]
                                if(elCurTown.getId() != elTown.getId()){
                                    var _dist = $.toe.calc.getDistance({'x': elCurTown.get('abs_x'), 'y': elCurTown.get('abs_y')},{'x': elTown.get('abs_x'), 'y': elTown.get('abs_y')})
                                    if (_Tlist[_dist] == undefined){
                                        _Tlist[_dist] = {'time':0, 'towns' : []};
                                        _Tdist.push(_dist);
                                    }
                                    _Tlist[_dist]['towns'].push({"id":elTown.getId(), "name":elTown.getName()}),
                                    _Tlist[_dist].timeInSec = Math.round(50*_dist/_unitSpeed)+_offset,
                                    _Tlist[_dist].time = readableUnixTimestamp(_Tlist[_dist].timeInSec, 'no_offset', {with_seconds: true});
                                }
                            })
                            do {
                                swapped = false;
                                for (var i=0; i < _Tdist.length-1; i++) {
                                    if (_Tdist[i] > _Tdist[i+1]) {
                                        var temp = _Tdist[i];
                                        _Tdist[i] = _Tdist[i+1];
                                        _Tdist[i+1] = temp;
                                        swapped = true;
                                    }
                                }
                            } while (swapped);
                        }

                        var 
                            list = this.$el.find($('#grcrtTslTownsList')),
                            _Tlist = {},
                            _Tdist = [],
                            that = this,
                            viewport = $('<div/>', {'style': 'height: 334px;overflow-y: hidden; overflow-x: hidden; position: relative;', 'class':'js-scrollbar-viewport'}),
                            content = $('<div/>',{'class':'js-scrollbar-content', 'style':'width: 100%;'});
                        calculate();
                        this.$el.find($('#grcrtTslTownsList .js-scrollbar-viewport')).remove()
                        list.append(
                            viewport.append(content)
                        )
                        $.each(_Tdist, function(ind,_key){
                            $.each(_Tlist[_key].towns, function(iiT,eeT){
                                content.append(
                                    $('<div/>',{
                                        'class' : 'TSLitem', 
                                        'townid': eeT.id
                                    }).text(eeT.name)
                                );
                            })
                        });
                        viewport.skinableScrollbar({
                                    orientation: "vertical",
                                    template: "tpl_skinable_scrollbar",
                                    skin: "narrow",
                                    disabled: !1,
                                    elements_to_scroll: that.$el.find(".js-scrollbar-content"),
                                    element_viewport: that.$el.find(".js-scrollbar-viewport"),
                                    scroll_position: 0,
                                    min_slider_size: 16
                                })
                        $('#grcrtTslTownsList .js-scrollbar-content > div[townid]').click(function(){
                            HelperTown.townSwitch($(this).attr("townid"));
                            that.onClick(this);
                        });
                    },
                    onClick: function(that){
                        var tsl_item = $(that).attr('townid'),
                        prev_item = (GRCRTtslWnd.getJQElement()).find($('.tsl_set'));
                        $(prev_item).toggleClass('tsl_set'),
                        $(that).addClass('tsl_set');
                    }
                 });
            window.GameViews['GrcRTView_'+_IdS] = c
        }(),
        function(){
            "use strict";
            var a = window.GameViews,
                b = window.GameCollections,
                c = window.GameModels,
                d = window.WindowFactorySettings,
                e = require("game/windows/ids"),
                f = require("game/windows/tabs"),
                g = e[_IdS.toUpperCase()];
            d[g] = function(b) {
                b = b || {};
                return us.extend({
                    window_type: g,
                    minheight: 440,
                    maxheight: 440,
                    width: 250,
                    tabs: [{
                        type: f.INDEX,
                        title: 'none',
                        content_view_constructor: a['GrcRTView_'+_IdS],//.RrcRTViewTSL,
                        hidden: !0
                    }],
                    max_instances: 1,
                    activepagenr: 0,
                    minimizable: !0,
                    resizable: !1,
                    title: RepConv.grcrt_window_icon + window.ellipsis(RepConvTool.GetLabel('TSL.WND.WINDOWTITLE'),18),
                    special_buttons: {
                        help: {
                            action: {
                                type: "external_link",
                                url: RepConv.Scripts_url+'module/grchowto#tsl'
                            }
                        }
                    }
                }, b)
            }
        }()
    }
}
