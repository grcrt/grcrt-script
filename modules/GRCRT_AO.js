function _GRCRT_AO() {
    "use strict";
    var _IdS = 'grcrt_ao';
    var
        _aoMargin = 3,
        _scroll = 'grcrt_ao_scroll',
        _step = 598,
        _scrollVisWidth = 600,
        _greenBox = $('<div/>')
                .append($('<div/>', {'class': 'grcrt_ao_bl'}))
                .append($('<div/>', {'class': 'grcrt_ao_green'}))
                .append($('<div/>', {'class': 'grcrt_ao_br'}))
                ,
        _grayBox = $('<div/>')
                .append($('<div/>', {'class': 'grcrt_ao_bl'}))
                .append($('<div/>', {'class': 'grcrt_ao_gray'}))
                .append($('<div/>', {'class': 'grcrt_ao_br'}))
                ,
        _redBox = $('<div/>')
                .append($('<div/>', {'class': 'grcrt_ao_bl'}))
                .append($('<div/>', {'class': 'grcrt_ao_red'}))
                .append($('<div/>', {'class': 'grcrt_ao_br'}))
                ,
        _progressBars = {}
                ,
        _scrollWidth = Object.size(GameData.researches)*(40+_aoMargin*2),
        _scrollLock = false,
        _towns = null,//MM.getCollections().Town[0],
        _researchMode = true,
        _researchQueue = {};

    function header(){
        _aoMargin = 3,
        _scroll = 'grcrt_ao_scroll',
        _step = 598,
        _scrollVisWidth = 600,
        _greenBox = $('<div/>')
                .append($('<div/>', {'class': 'grcrt_ao_bl'}))
                .append($('<div/>', {'class': 'grcrt_ao_green'}))
                .append($('<div/>', {'class': 'grcrt_ao_br'}))
                ,
        _grayBox = $('<div/>')
                .append($('<div/>', {'class': 'grcrt_ao_bl'}))
                .append($('<div/>', {'class': 'grcrt_ao_gray'}))
                .append($('<div/>', {'class': 'grcrt_ao_br'}))
                ,
        _redBox = $('<div/>')
                .append($('<div/>', {'class': 'grcrt_ao_bl'}))
                .append($('<div/>', {'class': 'grcrt_ao_red'}))
                .append($('<div/>', {'class': 'grcrt_ao_br'}))
                ,
        _progressBars = {}
                ,
        _scrollWidth = Object.size(GameData.researches)*(40+_aoMargin*2),
        _scrollLock = false,
        _towns = MM.getCollections().Town[0],
        _researchMode = true,
        _researchQueue = {};
        var
            _res = $('<div/>', {'class':_scroll})
                        .width(_scrollWidth),
            _hea = $('<div/>')
                    .css({
                        'clear': 'both',
                        'height': '40px',
                        'padding': '0',
                        'width': '100%',
                        'border-bottom': '1px solid #000',
                        'background': 'url('+Game.img()+'/game/overviews/fixed_table_header_bg.jpg) repeat-x 0 0'
                    })
                    .append(
                        $('<div/>',{
                            'class' : 'button_arrow left'
                        })
                        .css({
                            'position': 'absolute',
                            'top': '10px',
                            'left':'170px'
                        })
                        .bind('click', function(){
                            if ($('.'+_scroll).position().left > 0) {
                                $('.'+_scroll).css({'left':'0px'})
                            } else {
                                if ($('.'+_scroll).position().left != 0) {
                                    $('.'+_scroll).animate({left:'+='+_step+'px'},400)
                                } else {
                                    $('.'+_scroll).animate({left:'-='+(Math.floor(_scrollWidth/_scrollVisWidth)*_step)+'px'},400)
                                }
                            }
                        })
                    )
                    .append(
                        $('<div/>')
                            .css({
                                'overflow': 'hidden',
                                'position': 'absolute',
                                'left': '190px',
                            })
                            .width(_scrollVisWidth)
                            .append(_res)
                    )
                    .append(
                        $('<div/>',{
                            'class' : 'button_arrow right'
                        })
                        .css({
                            'position': 'absolute',
                            'top': '10px',
                            'right':'15px'
                        })
                        .click(function(){
                            if (
                                $('.'+_scroll).position().left < (Math.floor(_scrollWidth/_scrollVisWidth)*_step*(-1))
                                ||
                                $('.'+_scroll).position().left > 0
                            ) {
                                $('.'+_scroll).css({'left':'0px'})
                            } else {
                                if ( Math.ceil(Math.abs($('.'+_scroll).position().left)/_scrollVisWidth) == Math.floor(_scrollWidth/_scrollVisWidth) ){
                                    $('.'+_scroll).animate({left:'+='+(Math.floor(_scrollWidth/_scrollVisWidth)*_step)+'px'},400)
                                } else {
                                    $('.'+_scroll).animate({left:'-='+_step+'px'},400)
                                }
                            }
                        })
                    );
        $.each(GameData.researches, function(ind,elem){
            _res.append(
                $('<div/>', {'class': 'grcrt_ao_unit unit research_icon research40x40 '+GameDataResearches.getResearchCssClass(ind)})
                    //.append(
                    //    $('<span/>').html(elem.research_points)
                    //)
            )
        })
        return _hea;
    }
    function getResearchQueue(){
        _researchQueue = {};
        if (Object.size(MM.getModels().ResearchOrder)>0) {
            $.each(MM.getModels().ResearchOrder, function(ind,ord){
               _researchQueue[ord.getTownId()] = _researchQueue[ord.getTownId()] || {},
               _researchQueue[ord.getTownId()][ord.getType()] = ord;
            })
        }
    }
    function towns(pResearch){
        _researchMode = pResearch;
        var
            _list = $('<ul/>')
                        // .css({
                        //     'overflow-y': 'scroll',
                        //     'height': '485px',
                        // })
                        .addClass('academy')
                        .addClass("js-scrollbar-content"),
            _hea = $('<div/>',{'style':'position:relative; overflow-y:hidden; min-height:485px; max-height:485px;', 'class':"js-scrollbar-viewport"})
                    .append(_list),
            _odd = false,
            _Tdist = [];

        $.each(MM.getCollections().TownGroupTown[0].getTowns(MM.getCollections().TownGroup[0].getActiveGroupId()), function(idTown, elTownInGroup){
            var elTown = MM.getModels().Town[elTownInGroup.getTownId()]
            _Tdist.push({'id':elTown.id, 'name':elTown.getName()});
        })
        var swapped = false;
        do {
            swapped = false;
            for (var i=0; i < _Tdist.length-1; i++) {
                if (_Tdist[i].name > _Tdist[i+1].name) {
                    var temp = _Tdist[i];
                    _Tdist[i] = _Tdist[i+1];
                    _Tdist[i+1] = temp;
                    swapped = true;
                }
            }
        } while (swapped)            
        $.each(_Tdist, function(ind,_key){
            _towns.forEach(function(town){
                if (_key.id == town.id) {
                    var
                        _res = $('<div/>', {'class':_scroll})
                                .css({
                                    'display': 'inline-block',
                                    'position': 'relative',
                                    'left': '0px',
                                })
                                .width(Object.size(GameData.researches)*(40+_aoMargin*2)),
                        _town = $('<li/>',{
                            'class' : (_odd) ? "odd" : "even",
                            'style' : 'position: relative; min-height: 29px;'
                            
                        });
                        //_town_researches = town.getResearches(),
                        //_academyLvl = town.getBuildings().getBuildingLevel('academy');
                    getResearchQueue()
                    var a, b = GameData.researches,
                        //c = MM.getCollections().ResearchOrder[0].fragments[town.id],
                        d = town.getBuildings().getBuildingLevel('academy'),
                        e = availablePoints(town.id),
                        f = town.getResearches(),
                        g = (_researchQueue && _researchQueue[town.id] && Object.size(_researchQueue[town.id]) == GameDataConstructionQueue.getResearchOrdersQueueLength()) || false;
                        
                    _town
                        .append(
                            $('<div/>', {'class':"grcrt_ao_ta grcrt_ao_town"})
                                .append(
                                    $('<a/>',{
                                        'class' : 'gp_town_link',
                                        'href' : town.getLinkFragment(),
                                        'rel' : town.id
                                    }).html(town.getName())
                                )
                        )
                        .append(
                            $('<div/>', {'class':"grcrt_ao_ta grcrt_ao_ap", 'id':'grcrt_ao_'+town.id}).html(e)
                            //availablePoints(town)
                        )
                        .append(
                            $('<div/>')
                                .css({
                                    'overflow': 'hidden',
                                    'position': 'absolute',
                                    'left': (190-_aoMargin*2)+'px',
                                    'top':'3px',
                                    //'float':'left',
                                })
                                .width(_scrollVisWidth)
                                .append(_res)
                        )
                    $.each(GameData.researches, function(ind,elem){
                        var h = b[ind],
                            i = f.hasResearch(ind),
                            j = (_researchQueue && _researchQueue[town.id] && Object.size(_researchQueue[town.id]) == GameDataConstructionQueue.getResearchOrdersQueueLength()) || false,
                            det = fillBox(town.id, ind),
                            _btn = getBtn(town.id, ind);
                        _res.append(
                            $('<div/>', {
                                'class': 'textbox tech_tree_box '+ind,
                                'id':'grcrt_ao_'+town.id+'_'+ind
                            })
                            .data('town',town.id)
                            .append(det)
                            .append(_btn)
                            .hover(function(){$(this).find($('.button_downgrade,.button_upgrade')).slideDown()}, function(){$(this).find($('.button_downgrade,.button_upgrade')).slideUp()})
                            .tooltip(
                                (_researchMode || (!_researchMode && !i && !j)) ?
                                    GrcRTAcademyTooltipFactory.getResearchTooltip(h, d, e, i, j, g, town.id) :
                                    AcademyTooltipFactory.getRevertTooltip(h, MM.checkAndPublishRawModel('Player', {id: Game.player_id}).getCulturalPoints())
                            )
                        )
                    })
                    _odd = !_odd
                    _list.append(_town)
                }
            })
        });
        return _hea;
    }
    
    function availablePoints(townId){
        var town = MM.getCollections().Town[0].get(townId),
            _maxPoints = (town.getBuildings().getBuildingLevel('academy') * GameDataResearches.getResearchPointsPerAcademyLevel())
                        +(town.getBuildings().getBuildingLevel('library') * GameDataResearches.getResearchPointsPerLibraryLevel()),
            _availablePoints = _maxPoints,
            _townRes = town.getResources()
        $.each(GameData.researches, function(ind,elem){
            if (town.getResearches().get(ind)) {
                _availablePoints -= elem.research_points;
            }
        })
        getResearchQueue();
        //var _resOrder = MM.getCollections().ResearchOrder[0].fragments[townId];
        if (Object.size(_researchQueue)>0 && _researchQueue[townId]) {
            $.each(_researchQueue[townId], function(iRO, _ord){
                _availablePoints -= GameData.researches[iRO].research_points
            })
        }
        if (RepConv.Debug) console.log(_availablePoints);
        return _availablePoints;
    }
    function fillBox(townId, research) {
        if (RepConv.Debug) console.log('wypelnienie dla town_id ['+townId+'] => '+research);
        var
            town = _towns.get(townId),
            _green = town.getResearches().get(research),
            _result;
        if (GameData.researches[research].building_dependencies.academy <= town.getBuildings().getBuildingLevel('academy')) {
            if (_researchQueue && _researchQueue[town.id]  && _researchQueue[town.id][research]) {
                    //$.each(_resOrder.getOrders(), function(iRO, _ord){
                    var _ord = _researchQueue[town.id][research];
                        if (_ord.getType() == research) {
                            _progressBars[townId+'_'+research] = $('<div/>',{'class': "single-progressbar instant_buy js-item-progressbar type_unit_queue"})
                            .singleProgressbar({
                                template: "tpl_pb_single_nomax",
                                type: "time",
                                reverse_progress: !0,
                                liveprogress: !0,
                                liveprogress_interval: 1,
                                value: _ord.getRealTimeLeft(),
                                max: _ord.getDuration(),
                                countdown: !0,
                            }).on("pb:cd:finish", function() {
                                $(this).parent().html(_greenBox.html()),
                                this.destroy()
                            })
                            _result = _progressBars[townId+'_'+research];
                        }
                    //})
                    return _result || _greenBox.html();
            } else {
                //console.log('nie ma orda dla '+townId+'/'+research);
                return ((_green) ? _greenBox.html() : _redBox.html());
            }
        } else {
            return _grayBox.html();
        }
    }
    function getBtn(townId, research) {
        var
            town = _towns.get(townId),
            _green = town.getResearches().get(research),
            _result;
        if (GameData.researches[research].building_dependencies.academy <= town.getBuildings().getBuildingLevel('academy')) {
            if (_researchQueue && _researchQueue[town.id]  && _researchQueue[town.id][research]) {
                return '';
            } else {
                if (!_green && _researchMode) {
                    _result = $('<div/>', {'class':"btn_upgrade button_upgrade"})
                                .hide()
                                .data('town_id',townId)
                                .data('research',research)
                                .click(function(){
                                    var
                                        townId = $(this).data('town_id'),
                                        research = $(this).data('research');
                                    if (RepConv.Debug) console.log(townId+' => '+research);
                                    gpAjax.ajaxPost("frontend_bridge", "execute", {
                                                        "model_url":"ResearchOrder",
                                                        "action_name":"research",
                                                        "arguments":{"id":research},
                                                        "town_id":townId
                                                    }, !0, {
                                                        success: function(h, i) {
                                                            getResearchQueue();
                                                            $('#grcrt_ao_'+townId+'_'+research).html(fillBox(townId, research));
                                                            $('#grcrt_ao_'+townId).html(availablePoints(townId));
                                                        },
                                                        error: function(a, b) {
                                                            if (RepConv.Debug) console.log(a)
                                                            if (RepConv.Debug) console.log(b)
                                                        }
                                                    })
                                });
                } else if (_green && !_researchMode) {
                    _result = $('<div/>', {'class':"btn_downgrade button_downgrade"})
                                .hide()
                                .data('town_id',townId)
                                .data('research',research)
                                .click(function(){
                                    var btn = this;
                                    ConfirmationWindowFactory.openConfirmationResettingResearch(function(btn) {
                                        var
                                            townId = $(btn).data('town_id'),
                                            research = $(btn).data('research');
                                        if (RepConv.Debug) console.log('Potwierdzenie dla: '+townId+' => '+research);
                                        gpAjax.ajaxPost("frontend_bridge", "execute", {
                                                        "model_url":"ResearchOrder",
                                                        "action_name":"revert",
                                                        "arguments":{"id":research},
                                                        "town_id":townId
                                                        }, !0, {
                                                            success: function(h, i) {
                                                                getResearchQueue();
                                                                $('#grcrt_ao_'+townId+'_'+research).html(fillBox(townId, research));
                                                                $('#grcrt_ao_'+townId).html(availablePoints(townId));
                                                            },
                                                            error: function(a, b) {
                                                                if (RepConv.Debug) console.log(a)
                                                                if (RepConv.Debug) console.log(b)
                                                            }
                                                        })
                                    }.bind(btn, this))
                                });
                }
            }
        }
        return _result;
    }
    function getActiveGroupName(){
        var _res = '';
        MM.getCollections().TownGroup[0].forEach(function(group){
            if(group.getId() == MM.getCollections().TownGroup[0].getActiveGroupId()){
                _res = " ("+group.getName()+")";
            }
        })
        return _res;
    }

    // dodanie do menu
    RepConv.menu[4] =
        {
            'name' : 'AO.TITLE',
            'action' : "GRCRT_AO.windowOpen();",
            'class' : 'aom'
        }
    
    // ikona w menu
    $('head')
        .append(
            $('<style/>')
                .append(
                    '.grcrt.ao { background-position: -77px -80px; cursor: pointer;}'
                )
                .append(
                    '.grcrt_ao_unit { margin: 0 '+_aoMargin+'px !important;}'
                )
                .append(
                    '.'+_scroll+' {display: inline-block; position: relative; left: 0px;}'
                )
                .append(
                    '.grcrt_ao_scroll .textbox {margin: 0px '+_aoMargin+'px; width: 40px; float: left;}'
                )
                .append(
                    '.grcrt_ao_bl, .grcrt_ao_br, .grcrt_ao_green, .grcrt_ao_gray, .grcrt_ao_red {float: left; height: 24px; background: url('+RepConv.grcrt_cdn+'/img/survey_sprite.png) no-repeat scroll 0px -39px;}\n'+
                    '.grcrt_ao_bl, .grcrt_ao_br {width: 2px;}\n'+
                    '.grcrt_ao_green, .grcrt_ao_gray, .grcrt_ao_red {width: 36px;}\n'+
                    '.grcrt_ao_bl {background-position: 0px -39px;}\n'+
                    '.grcrt_ao_br {background-position: -360px -39px;}\n'+
                    '.grcrt_ao_green {background-position: -321px -39px;}\n'+
                    '.grcrt_ao_gray {background: gray;}\n'+
                    '.grcrt_ao_red {background-position: -2px -39px;}\n'+
                    '.grcrt_ao_ta {font-size: 10px; float:left; padding-top: 8px; }\n'+
                    '.grcrt_ao_town {width: 130px; max-width:130px; padding-left: 5px;}\n'+
                    '.grcrt_ao_ap {width: 40px; max-width:40px; text-align: right; background: url('+Game.img()+'/game/academy/points_25x25.png) no-repeat;}\n'+
                    '.grcrt_ao .single-progressbar .curr { font-size: 8px;}\n'+
                    '.grcrt_ao .button_upgrade, .grcrt_ao .button_downgrade {bottom: 1px !important; right: 1px !important;}\n'+
                    '.grcrt.aom {background: url('+Game.img()+'/game/academy/points_25x25.png) no-repeat;top: 4px !important; left: 4px !important;}\n'
                )
        )
    this.windowOpen = function(){
        try {
            (WM.getWindowByType(_IdS)[0]).close()
        } catch (e){}
        WF.open(_IdS)
    }
    // definicja okna
    RepConv.initArray.push('GRCRT_AO.init()');
    RepConv.wndArray.push(_IdS);
    this.init = function(){
        "use strict";
        _towns = MM.getCollections().Town[0],
        _scrollWidth = Object.size(GameData.researches)*(40+_aoMargin*2);
        new _GrcRTGameDataResearches(window);
        new _GrcRTAcademyTooltipFactory();
        new _grcrtWindowAO();
    }
    function _grcrtWindowAO(){
        "use strict";
        var _IdS = 'grcrt_ao';
        var _grcrtWinIds = require("game/windows/ids");
        _grcrtWinIds[_IdS.toUpperCase()] = _IdS,
        function() {
            "use strict";
            var a = window.GameControllers.TabController,
                b = window.GameModels.Progressable,
                _content = $('<div/>',{'id':'townsoverview'}),
                c = a.extend({
                    initialize: function(b) {
                        if (RepConv.Debug) console.time("initialize");
                        a.prototype.initialize.apply(this, arguments)
                        var
                            _wnd = this.getWindowModel(),
                            _$el = this.$el;//.css({'margin':'10px'});
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
                        this.bindEventListeners()
                        if (RepConv.Debug) console.timeEnd("initialize");
                    },
                    render: function() {
                        this.reRender()
                    },
                    reRender: function() {
                        if (RepConv.Debug) console.time("reRender");
                        var
                            _wnd = this.getWindowModel(),
                            _$el = this.$el;
                        this.getWindowModel().setTitle(RepConv.grcrt_window_icon + GameData.buildings.academy.name+getActiveGroupName()),
                        MM.getCollections().TownGroup[0].getTownGroups()
                        this.getWindowModel().showLoading()
                        setTimeout(function(){
                            if (RepConv.Debug) console.time("fill");
                            _wnd.setContent2(header()),
                            _wnd.appendContent(towns(_wnd.getActivePageNr()==0)),
                            _wnd.hideLoading()
                            if (RepConv.Debug) console.timeEnd("fill");
                            _$el.find(".js-scrollbar-viewport").skinableScrollbar({
                                orientation: "vertical",
                                template: "tpl_skinable_scrollbar",
                                skin: "narrow",
                                disabled: !1,
                                elements_to_scroll: _$el.find(".js-scrollbar-content"),
                                element_viewport: _$el.find(".js-scrollbar-viewport"),
                                scroll_position: 0,
                                min_slider_size: 16
                            })
                        },100)
                        if (RepConv.Debug) console.timeEnd("reRender");
                    },
                    bindEventListeners: function() {
                        this.$el.parents('.'+_IdS).on("click", ".js-wnd-buttons .help", this._handleHelpButtonClickEvent.bind(this))
                    },
                    _handleHelpButtonClickEvent: function() {
                        var a = this.getWindowModel().getHelpButtonSettings();
                        RepConvGRC.openGRCRT(a.action.tab,a.action.args);
                    }
                });
            //window.GameViews.RrcRTViewTSL = c
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
                var c = DM.getl10n(e.ACADEMY);
                return us.extend({
                    window_type: g,
                    minheight: 570,
                    maxheight: 580,
                    width: 822,
                    tabs: [{
                        type: f.RESEARCH,
                        title: c.tabs[0],
                        content_view_constructor: a['GrcRTView_'+_IdS],
                        hidden: !1
                    }, {
                        type: f.RESET,
                        title: c.tabs[1],
                        content_view_constructor: a['GrcRTView_'+_IdS],
                        hidden: !1
                    }],
                    max_instances: 1,
                    activepagenr: 0,
                    title: RepConv.grcrt_window_icon + GameData.buildings.academy.name
                }, b)
            }
        }()
    }

    function _GrcRTAcademyTooltipFactory() {
        "use strict";

        function a(a) {
            return '<img src="' + Game.img() + "/game/res/" + ("population" === a ? "pop" : a) + '.png" alt="' + e[a] + '" />'
        }

        function b(a) {
            return '<p style="width: 320px;">' + a.description + "</p>"
        }

        function c(b, c, e, townId) {
            var f, g, h, i = "",
                j = {},
                k = ITowns.getTown(townId),
                l = k.resources(),
                m = k.getProduction(),
                n = 0,
                o = !0,
                p = !0,
                q = j.upgrade_not_possible || !1,
                r = d(b, c, townId);
            for (f in r)
                if (r.hasOwnProperty(f)) {
                    if (g = r[f], i += a(f), "research_points" === f && g.amount > e) q = !0, o = !1;
                    if (g.amount > l[f])
                        if (q = !0, "time" !== f && "research_points" !== f)
                            if (p = !1, m[f] > 0)
                                if (h = parseInt(3600 * parseFloat((g.amount - l[f]) / m[f]), 10), h > n && h > 0) n = h;
                    if ("time" === f) g.amount = DateHelper.readableSeconds(g.amount);
                    i += "<span" + (g.amount > l[f] || "research_points" === f && o === !1 ? ' style="color:#B00"' : "") + ">" + g.amount + "</span>"
                }
            return {
                result: i,
                upgrade_not_possible: q,
                enough_resources: p,
                time_to_build: n
            }
        }

        function d(a, b, townId) {
            var c = GrcRTGameDataResearches.getResearchCosts(a, townId);
            return {
                wood: {
                    amount: Math.floor(c.wood, 10)
                },
                stone: {
                    amount: Math.floor(c.stone, 10)
                },
                iron: {
                    amount: Math.floor(c.iron, 10)
                },
                research_points: {
                    amount: a.research_points
                },
                time: {
                    amount: GameDataResearches.getResearchTime(a, b)
                }
            }
        }
        var e = DM.getl10n("tooltips", "academy"),
            f = {
                getResearchTooltip: function(a, d, f, g, h, i, townId) {
                    var j = "";
                    if (j += '<div class="academy_popup">', j += "<h4>" + a.name + "</h4>", j += b(a), g) j += "<h5>" + e.already_researched + "</h5>";
                    else if (h) j += "<h5>" + e.in_progress + "</h5>";
                    else {
                        var k = c(a, d, f, townId);
                        j += k.result + "<br/>";
                        var l = a.building_dependencies;
                        if (d < l.academy) j += "<h5>" + e.building_dependencies + "</h5>", j += '<span class="requirement">' + GameData.buildings.academy.name + " " + l.academy + "</span><br />";
                        if (!k.enough_resources) j += '<span class="requirement">' + e.not_enough_resources + '</span><br /><span class="requirement">' + s(e.enough_resources_in, DateHelper.formatDateTimeNice(Timestamp.server() + k.time_to_build, !1)) + "</span><br />";
                        if (i) j += '<span class="requirement">' + e.full_queue + "</span><br />"
                    }
                    return j += "</div>"
                //},
                //getRevertTooltip: function(a, b) {
                //    return window.AcademyTooltipFactory.getRevertTooltip(a,b);
                //    //var c = "<h4>" + "Reset the research" + "</h4>";
                //    //return c += "<p>" + "You can reset a research for one culture point. <br/> You can buy culture points at the Agora." + "<br/>", c += e.culture_points_text(b), c += "<p>" + "Reimbursement:" + " " + a.research_points + '<img src="' + Game.img() + '/game/res/research_points.png" alt="' + "Research points" + '" />'
                }
            };
        window.GrcRTAcademyTooltipFactory = f
    }


    function _GrcRTGameDataResearches(a) {
        "use strict";
        var b = {
            getResearchCostsById: function(a,townId) {
                var b = GameData.researches[a];
                return this.getResearchCosts(b,townId)
            },
            getResearchCosts: function(a,townId) {
                if(!(MM.getCollections().PlayerHero[0])){MM.createBackboneObjects({PlayerHeroes: null}, window.GameCollections, {})}
                var b, c;
                return b = a.resources, c = GeneralModifications.getResearchResourcesModification(townId), {
                    wood: Math.ceil(b.wood * c),
                    stone: Math.ceil(b.stone * c),
                    iron: Math.ceil(b.iron * c)
                }
            }
        },
        c = $.extend({},GameDataResearches,b);
        a.GrcRTGameDataResearches = c
    }    
}
