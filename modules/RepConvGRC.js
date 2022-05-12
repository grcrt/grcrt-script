function _RepConvGRC() {
    "use strict";
    
    var _IdS = 'grcrt';
    var windowIds = require("game/windows/ids");//||GameData.windows_factory.windows;
    var idleTimeout = 30;//*60;
    var idleInterval = 1000*60*15;
    var stopCount = 0;
    var wonders = {};
    var typUnits = {1: ['defAtt', 'losAtt'], 2: ['defDef', 'losDef']};

    function genCheckBox(pName, pChecked, pLabel) {
        return $('<div/>', {'class':'checkbox_new', 'style':'margin-bottom: 10px; display: block;'})
                .checkbox({
                    caption: RepConvTool.GetLabel(pLabel || pName),
                    checked: pChecked,
                    cid: pName
                });
    }

    function addReload(RCGP){
        (RCGP.getWindowVeryMainNode()).find($('div.ui-dialog-titlebar.ui-widget-header a.grc_reload')).remove();
        switch(RCGP.getController()){
            case "building_barracks":
            case "building_docks":
                if ((RCGP.getWindowVeryMainNode()).find($('div.ui-dialog-titlebar.ui-widget-header a.grc_reload')).length == 0){
                    (RCGP.getWindowVeryMainNode()).find($('div.ui-dialog-titlebar.ui-widget-header'))
                        .append(
                            $('<a/>',{'href':'#n','class':'grc_reload down_big reload', 'style':'float: right; height: 22px; margin: -1px 0 1px;','rel':RCGP.getID()})
                                .click(function(){
                                    switch(Layout.wnd.getWindowById($(this).attr('rel')).getController()){
                                        case "building_barracks":
                                            BarracksWindowFactory.openBarracksWindow();
                                            break;
                                        case "building_docks":
                                            DocksWindowFactory.openDocksWindow();
                                            break;
                                    }
                                })
                        );
                }
                break;
        }
    }
    function addSpell(RCGP){
        var _powers = {},
            _power_div = $('<div/>', {'class' : "powers_container clearfix"}),
            power_id = undefined,
            _god = undefined,
            _pow_ena = false;
        switch(RCGP.getController()){
            case "building_barracks":
                $.each(MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id}).getProductionOverview(), function(ind, elem){
                    if (ind == 'hera') {
                        power_id = 'fertility_improvement',
                        // _god = 'hera'
                        _powers[ind] = power_id
                    }
                    if (ind == 'ares') {
                        power_id = 'spartan_training',
                        // _god = 'hera'
                        _powers[ind] = power_id
                    }
                })
                _pow_ena = MM.checkAndPublishRawModel('Town',{id:Game.townId}).getBuildings().getBuildingLevel('barracks') > 0;
                break;
            case "building_docks":
                $.each(MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id}).getProductionOverview(), function(ind, elem){
                    if (ind == 'poseidon') {
                        power_id = 'call_of_the_ocean',
                        // _god = 'poseidon'
                        _powers[ind] = power_id
                    }
                })
                _pow_ena = MM.checkAndPublishRawModel('Town',{id:Game.townId}).getBuildings().getBuildingLevel('docks') > 0;
                break;
        }
        if (/*power_id != undefined*/ _pow_ena && $('#unit_order .grcrt_power').length == 0) {
            $.each(_powers, function(_god, power_id){
                var
                    casted_power = HelperPower.createCastedPowerModel(power_id, Game.townId),
                    _disable = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id}).get(_god+'_favor') < GameData.powers[power_id].favor,
                    _classAdd = (_disable) ? ' disabled' : '',
                    casted = HelperPower.createCastedPowerModel(power_id, Game.townId)
                    $.each(MM.checkAndPublishRawModel('Town',{id:Game.townId}).getCastedPowers(), function(ind,elem){
                        if(elem.getPowerId() == power_id){
                            casted = elem,
                            _classAdd = ' active_animation extendable animated_power_icon animated_power_icon_45x45';
                        }
                    })                    ;    
                $(_power_div)
                    .append(
                        $('<div/>', {'class' : "js-power-icon power_icon45x45 "+power_id+" power"+_classAdd, 'data-power_id' : power_id, 'rel' : _god})
                            .append(
                                $('<div/>', {'class' : "extend_spell"})
                                    .append(
                                        $('<div/>', {'class' : "gold"})
                                    )
                                    .append(
                                        $('<div/>', {'class' : "amount"})
                                    )
                            )
                            .append(
                                $('<div/>', {'class' : "js-caption"})
                            )
                            .on('mouseover', function(e) {
                                var _tooltipParam = {
                                    show_costs: true
                                }
                                if (typeof casted.getId != 'undefined') {
                                    _tooltipParam.casted_power_end_at = casted.getEndAt(),
                                    _tooltipParam.extendable = casted.isExtendable()
                                }
                                $(this).tooltip(TooltipFactory.createPowerTooltip(casted_power.getPowerId(), _tooltipParam)).showTooltip(e);
                            })
                            .on('click', function(e){
                                CM.unregister({main : RCGP.getContext().main, sub:"casted_powers"},'grcrt_power_'+casted.getId());
                                var
                                    _btn = CM.register(
                                        {main : RCGP.getContext().main, sub:"casted_powers"},
                                        'grcrt_power_'+casted.getId(),
                                        RCGP.getJQElement().find($('.grcrt_power .new_ui_power_icon .gold')).button()
                                    ),
                                    power = HelperPower.createCastedPowerModel(power_id, Game.townId);
                                if (casted.getId() == undefined) {
                                    power.cast();
                                } else {
                                    if (casted.isExtendable()) {
                                        BuyForGoldWindowFactory.openExtendPowerForGoldWindow(_btn, casted);
                                        $(this).addClass(_classAdd);
                                    }
                                }
                            })
                    );
                RCGP.getJQElement().find($('.game_inner_box'))
                    .append(
                        $('<div/>', {'class' : "grcrt_power"})
                            .append(
                                _power_div
                            )
                    )
            })
            $.each(_powers, function(_god, power_id){

//                if (_disable && !casted.isExtendable()) {
                    var
                        power = GameData.powers[power_id],
                        god = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id}).getCurrentProductionOverview()[_god],
                        _godCurr = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id})[_god+'_favor_delta_property'].calculateCurrentValue().unprocessedCurrentValue,
                        marg =33,
                        _elem =
                            $('<div/>',{
                                'style': 'margin-top:'+marg+'px;color:black;text-shadow: 2px 2px 2px gray;font-size:10px;z-index:3000;font-weight: bold;',
                                'name': 'counter'
                            });
                    CM.unregister({main : RCGP.getContext().main, sub:"casted_powers"},'grcrt_countdown');
                    CM.register({main : RCGP.getContext().main, sub:"casted_powers"}, 'grcrt_countdown', _elem.countdown2({
                                value : (((power.favor - _godCurr/*god.current*/) / god.production) * 60 * 60),
                                display: 'readable_seconds_with_days'
                            }).on('cd:finish', function() {
                                $(this).parent().removeClass('disabled'),
                                $(this).remove()
                            })
                    );
                    RCGP.getJQElement().find($('.power_icon45x45.power.'+power_id))
                        .append(
                            _elem
                        )
//                }
            })
        }
                
    }
    function addSettings(RCGP){
        if ((RCGP.getJQElement()).find('#GRCRTSetupLink').length == 0) {
            (RCGP.getJQElement()).find('.settings-menu ul').eq(2)
                .append(
                    $('<li>',{'class':'with-icon'})
                        .append(
                            $('<img/>', {
                                'class' : 'support-menu-item-icon',
                                'src'   : RepConv.grcrt_cdn+'img/octopus.png',
                                'style' : 'width: 15px;'
                            })
                        )
                        .append(
                            $('<a/>', {'id': 'GRCRTSetupLink', 'href':'#'})
                                .html(RepConv.Scripts_nameS)
                                .click(function() {
                                    RepConvGRC.openGRCRT('HELPTAB4');
                                })
                        )
                )
        }
        
    }
    function addBuildingPoints(RCGP){
        if (RepConv.settings[RepConv.Cookie+'_bupo']){
            $.each(RCGP.getJQElement().find($('.building>.image.bold')), function(ind, build){
              var 
                _name = $(build).parent().parent().attr('id').replace(/building_main_(.*)/,'$1'),
                _build = BuildingMain.buildings[_name],
                _pointsPlus = Math.round(_build.building.points*Math.pow(_build.building.points_factor,_build.next_level))-Math.round(_build.building.points*Math.pow(_build.building.points_factor,_build.level)),
                _pointsMinus = Math.round(_build.building.points*Math.pow(_build.building.points_factor,_build.current_level))-Math.round(_build.building.points*Math.pow(_build.building.points_factor,_build.current_level-1))+(_build.current_level==1?_build.building.points:0);
                $(build).find($('span.grcrtpoints')).remove()
                if(!_build.max_level){
                    $(build)
                        .append(
                            $('<span>',{'class':'grcrtpoints grcrt_plus grcrt_special'})
                                .html('+'+_pointsPlus+'p')
                        )
                        .css('letter-spacing','-1px')
                }
                $(build)
                    .append(
                        $('<span>',{'class':'grcrtpoints grcrt_special grcrt_minus'})
                            .html('-'+_pointsMinus+'p')
                    )
            })

            $.each(RCGP.getJQElement().find($('.building_special>div.image')), function(ind, build){
              var 
                _name = $(build).attr('id').replace(/special_building_(.*)/,'$1'),
                _build = BuildingMain.special_buildings_combined_group[_name],
                _pointsPlus = Math.round(_build.building.points*Math.pow(_build.building.points_factor,_build.next_level)),
                _pointsMinus = Math.round(_build.building.points*Math.pow(_build.building.points_factor,_build.current_level))*(-1);
                $(build).find($('div.grcrtpoints')).remove()
                if($(build).hasClass('special_build')){
                    if(!_build.max_level || _build.can_upgrade){
                        $(build)
                            .append(
                                $('<div>',{'class':'grcrtpoints grcrt_special'})
                                    .html('+'+_pointsPlus+'p')
                            )
                            .css('letter-spacing','-1px')
                    }
                }
            })
            orderPoints(RCGP);
        }
    }

    function orderPoints(RCGP){
        if (RepConv.settings[RepConv.Cookie+'_bupo']){
            var _orderItems = $('div.ui_construction_queue .ui_various_orders.type_building_queue');
            if (typeof RCGP != 'undefined' && RCGP.getJQElement()){
                _orderItems = RCGP.getJQElement();
            }
            if(_orderItems.length == 0){
                if($('.option.city_overview.circle_button.js-option.checked').length==1 && Game.player_settings.build_from_town_index_enabled){
                    setTimeout(function(){
                        orderPoints(RCGP);
                    },100)
                }
            } else {
                var _currLvl = {}
                $.each(GameData.buildings, function(_build, _buildDet){
                  _currLvl[_build] = MM.getModels().Town[Game.townId].buildings().getBuildingLevel(_build)
                })
                // $(_orderItems).find($('.grcrtpoints')).remove()
                if(MM.getModels().BuildingOrder){
                    $.each(MM.getModels().BuildingOrder, function(orderId, order){
                      if(order.getTownId()==Game.townId){
                        var
                            _build = GameData.buildings[order.getType()],
                            _pointsPlus = Math.round(_build.points*Math.pow(_build.points_factor,_currLvl[order.getType()]+1))-((_build.special)?0:Math.round(_build.points*Math.pow(_build.points_factor,_currLvl[order.getType()]))),
                            _pointsMinus = Math.round(_build.points*Math.pow(_build.points_factor,_currLvl[order.getType()]))-Math.round(_build.points*Math.pow(_build.points_factor,_currLvl[order.getType()]-1)),
                            _orderItem = $(_orderItems).find($('.order_id_'+order.getId()+' .item_icon.building_icon40x40.'+order.getType()+'.js-item-icon'));
                        $(_orderItem).find($('.grcrtpoints')).remove()
                        if(!order.hasTearDown()){
                            if($(_orderItem).find($('.grcrtpoints')).length==0){
                                $(_orderItem)
                                    .append(
                                        $('<div>',{'class':'grcrtpoints grcrt_order'})
                                            .html('+'+(
                                                $(_orderItem).find($('span.construction_queue_sprite')).hasClass('arrow_green_ver')
                                                ?_pointsPlus
                                                :_pointsMinus
                                                )+'p')
                                        )
                                _currLvl[order.getType()]++;
                            }
                        } else {
                            if($(_orderItem).find($('.grcrtpoints')).length==0){
                                $(_orderItem)
                                .append(
                                    $('<div>',{'class':'grcrtpoints grcrt_order grcrt_minus'})
                                        .html('-'+(
                                                $(_orderItem).find($('span.construction_queue_sprite')).hasClass('arrow_green_ver')
                                                ?_pointsPlus
                                                :_pointsMinus
                                            // _build.special?_pointsPlus:_pointsMinus
                                            )+'p')
                                    )
                                _currLvl[order.getType()]--;
                            }
                        }
                      }
                    })
                }
            }
        }
    }

    function wrapForumTabs(RCGP){ // forum sojuszu - zakładki w liniach
        if (RepConv.active.ftabs 
            && 
            RCGP.getWindowVeryMainNode().find($('div.menu_wrapper.minimize.menu_wrapper_scroll')).parent().find($('a.next')).length != 0
        ) {
            $('#grcrt_ft').text("")
            RCGP.getWindowVeryMainNode().addClass('grcrt_ft')
            var
                Q_DivWrapper    = RCGP.getWindowVeryMainNode().find($('div.menu_wrapper.minimize.menu_wrapper_scroll')),
                Q_DivWrapperUl  = RCGP.getWindowVeryMainNode().find($('div.menu_wrapper.minimize.menu_wrapper_scroll>ul')),
                Q_DivForm       = RCGP.getWindowVeryMainNode().find($('.gpwindow_content>.forum_content>.t0'));
            if (Q_DivWrapper.width() != Q_DivWrapperUl.width()) {
                Q_DivWrapper.width(
                    Q_DivWrapper.width() +
                    $(Q_DivWrapper).parent().find($('a.next')).width() +
                    $(Q_DivWrapper).parent().find($('a.prev')).width()
                ),
                Q_DivWrapperUl.width(Q_DivWrapper.width()),
                Q_DivWrapperUl.css('right', 0),
                $(Q_DivWrapper).find($('div.fade_left')).remove(),
                $(Q_DivWrapper).find($('div.fade_right')).remove(),
                $(Q_DivWrapper).parent().find($('a.next')).remove(),
                $(Q_DivWrapper).parent().find($('a.prev')).remove();
                
                var linia = 0, Q_Mnoznik = 1;

                $.each(RCGP.getWindowVeryMainNode().find($('ul.menu_inner>li')), function(il, li){
                    if(linia+$(li).width() > RCGP.getWindowVeryMainNode().find($('ul.menu_inner')).width()){
                        linia = 0, Q_Mnoznik++
                    } else {
                        linia+=$(li).width()
                    }
                })
                var
                    // Q_Mnoznik = $($('ul.menu_inner li')[$('ul.menu_inner li').length-1]).position().top / 22 + 1,//Math.ceil(Q_DivWrapperUl.width() / Q_DivWrapper.width());
                    Q_zindex = $('#gptop'+Q_Mnoznik).css('z-index');
                
                $('#grcrt_ft').text('.grcrt_ft .menu_wrapper { height: '+(Q_DivWrapper.height() * Q_Mnoznik)+'px !important;} .grcrt_ft .gpwindow_frame>.gpwindow_content { top: '+(Q_DivWrapper.height() * (Q_Mnoznik + 1))+'px !important;}'),
                // (RCGP.getJQElement()).find($('div.gpwindow_content')).css('top', Q_DivWrapper.height() * (Q_Mnoznik + 1)),
                // Q_DivWrapper.height(Q_DivWrapper.height() * Q_Mnoznik),
                RCGP.setHeight(RCGP.getOptions().maxHeight+22*(Q_Mnoznik - 1));
                //(RCGP.getJQElement()).height(
                //    Q_DivForm.height() + Q_DivWrapper.height() * (Q_Mnoznik) + 22
                //    //(RCGP.getJQElement()).height() + Q_DivWrapper.height() * (Q_Mnoznik - 1)
                //),
                if ((RCGP.getJQElement()).find($('div.gpwindow_top#gptop1')).length == 0) {
                    (RCGP.getJQElement()).find($('div.gpwindow_top')).attr('id', 'gptop1'),
                    (RCGP.getWindowVeryMainNode()).find($('div#gptop1')).css({'z-index': '10', 'height': '30px'});
                }
                for (var Q_top = 1; Q_top < Q_Mnoznik; Q_top++) {
                    (RCGP.getWindowVeryMainNode()).find($('div#gptop'+ (Q_top + 1))).remove(),
                    $('<div/>', {'class': 'gpwindow_top', 'id': 'gptop' + (Q_top + 1), 'style': 'top:' + (22 * Q_top) + 'px; z-index:'+(10-Q_top)})
                        .append($('<div/>', {'class': 'gpwindow_left corner'}))
                        .append($('<div/>', {'class': 'gpwindow_right corner'}))
                        .insertBefore((RCGP.getJQElement()).find($('div.gpwindow_content')));
                }
                for (var Q_top = Q_Mnoznik-1; Q_top > 0; Q_top--) {
                    $('#gptop'+Q_top).css('z-index', ++Q_zindex).css('height','30px'),
                    $('#gptop'+Q_top+" .corner").css('height','30px');
                }
                (RCGP.getWindowVeryMainNode()).find($('ul.menu_inner>li')).css('float', 'left');
                var _count = (RCGP.getWindowVeryMainNode()).find($('ul.menu_inner>li')).length
                $.each((RCGP.getWindowVeryMainNode()).find($('ul.menu_inner>li')), function(ind, elem) {
                    $(elem).attr('lp',--_count);
                })
                var _count = (RCGP.getWindowVeryMainNode()).find($('ul.menu_inner>li')).length
                for(var __nn = 1; __nn<_count; __nn++){
                    (RCGP.getWindowVeryMainNode()).find($('ul.menu_inner>li[lp='+__nn+']'))
                        .insertAfter((RCGP.getWindowVeryMainNode()).find($('ul.menu_inner>li[lp='+(__nn-1)+']')));
                }
            }
        }
    }

    function islandBBCode(RCGP){ // info o graczach na wyspie - dodanie listy miast w BBCode
        function addDetails(RCGP, itemId){
            if ((RCGP.getJQElement()).find($('#'+itemId+' li span.player_name a.gp_player_link')).length == 0) {
                $.each((RCGP.getJQElement()).find($('#'+itemId+' li span.player_name')), function(ind,elem){
                    $.each(_towns,function(itown,etown){
                        if(etown.player == $(elem).html()){
                            $(elem).html(
                                hCommon.player(
                                    btoa(
                                        JSON.stringify({"name":etown.player,"id":etown.pid})
                                            .replace(/[\u007f-\uffff]/g,
                                                function(c) { 
                                                  return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
                                                }
                                            )
                                    ),
                                    etown.player,
                                    etown.pid
                                )
                            )
                            // alliance
                            if (etown.player_alliance != null){
                                $(elem)
                                    .parent()
                                    .append(
                                        $('<span/>',{'class':'small alliance_name grcrt_brackets'})
                                            .html(
                                                hCommon.alliance(
                                                    'n',
                                                    RepConvTool.getAllianceData(RepConvTool.getPlayerData(etown.pid).alliance_id).name,
                                                    RepConvTool.getPlayerData(etown.pid).alliance_id
                                                )
                                            )
                                    )
                            }
                        }
                    })
                })
            }
        }
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
        if ((RCGP.getJQElement()).find($(WndId + 'RepConvTownButton')).length == 0) {
            // nazwy graczy jako linki
            var _towns = JSON.parse(RepConv.requests[RCGP.getController()].responseText).json.json.town_list;
            addDetails(RCGP, 'island_info_towns_left_sorted_by_name');
            addDetails(RCGP, 'island_info_towns_left_sorted_by_score');
            addDetails(RCGP, 'island_info_towns_left_sorted_by_player');
            // /nazwy graczy jako linki
            // new bbcode
            if ((RCGP.getJQElement()).find($('#BTNVIEWBB' + WndName)).length == 0) {
                (RepConvTool.AddBtn('BTNVIEWBB', WndName))
                    .css('margin','0')
                    .click(function() {
                        window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                    })
                    .insertBefore(WndId + ' div.island_info_towns.island_info_left div.game_border_top');
            }
            // /new bbcode
            //setTimeout(function(){
            if ((RepConv.settings[RepConv.Cookie+'_idle']||false) && RCGP.getJQElement().find($('.grcrt_idle')).length == 0 && RCGP.getJQElement().find($('.gp_player_link')).length != 0 ){
                $('<div/>',{'class':'grcrt_idle'}).insertBefore(RCGP.getJQElement().find($('li:not(.reservation_tool)')).find($('.gp_player_link'))),
                addIdleDays(RCGP);//getIdleData(RCGP);
            }
            //},200)
        }
    }
    function playerProfilBBCode(RCGP){ // info o graczu - dodanie listy miast w BBCode
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;

        // new bbcode
        if ((RCGP.getJQElement()).find($('#BTNVIEWBB' + WndName)).length == 0) {
            (RepConvTool.AddBtn('BTNVIEWBB', WndName))
                .css('margin','0')
                .click(function() {
                    window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                })
                .insertBefore(WndId + ' #player_towns div.game_border_top');
        }
        // /new bbcode

        // statystyki gracza
        if ( (RCGP.getJQElement()).find($(WndId+'RepConvStatsPlayer')).length == 0) {
            var
                // __tmp = ((RCGP.getContext().sub == "player_get_profile_html") ? btoa(JSON.stringify({id:RCGP.getOptions().player_id})) : $(elem).nextAll('.gp_player_link').attr('href')).split(/#/),
                // _player = (RCGP.getType() == Layout.wnd.TYPE_PLAYER_PROFILE_EDIT) ? Game.player_id : (RCGP.getContext().sub == "player_get_profile_html") ? ((RepConv.requests.player && RepConv.requests.player.url) ? JSON.parse(unescape(RepConv.requests.player.url).match(/({.*})/)[0]).player_id : RCGP.getOptions().player_id) : JSON.parse(atob(__tmp[1] || __tmp[0])).id,
                _player_name = RCGP.getJQElement().find($('#write_message_form input[name="recipients"]')).val(),
                _player = RepConvTool.getPlayerId4Name(_player_name),
                _link = $('<a/>',{
                            'href' : "#n",
                            'id' : WndName + 'RepConvStatsPlayer',
                            'player_id' : _player,
                            'player_name' : _player_name
                        })
                        .html($('<img/>',{src:RepConv.Const.staticImg+'/stats.png'}))
                        .mousePopup(new MousePopup(RepConvTool.GetLabel('STATS.PLAYER')));
            if ("https:" == window.location.protocol && (RepConv.active.statsGRCL != 'potusek')) {
                $(_link).attr({
                    'href' : getStatsLink('player', _player, _player_name),
                    'target' : '_blank'
                })
            } else {
               $(_link)
                   .click(function() {
                       showStats('player', $(this).attr('player_id'), $(this).attr('player_name'));
                   })
            }
            RCGP.getJQElement().find($('#write_message_form input[name="recipients"]')).parent().parent()
                .append(_link);
        }
        
        // radar dla miast gracza
        if ( (RCGP.getJQElement()).find($(WndId+'RepConvRadarPlayer')).length == 0) {
            var
                // __tmp = ((RCGP.getContext().sub == "player_get_profile_html") ? btoa(JSON.stringify({id:RCGP.getOptions().player_id})) : $(elem).nextAll('.gp_player_link').attr('href')).split(/#/),
                // _player = (RCGP.getType() == Layout.wnd.TYPE_PLAYER_PROFILE_EDIT) ? Game.player_id : (RCGP.getContext().sub == "player_get_profile_html") ? ((RepConv.requests.player && RepConv.requests.player.url) ? JSON.parse(unescape(RepConv.requests.player.url).match(/({.*})/)[0]).player_id : RCGP.getOptions().player_id) : JSON.parse(atob(__tmp[1] || __tmp[0])).id,
                _player_name = RCGP.getJQElement().find($('#write_message_form input[name="recipients"]')).val(),
                _player = RepConvTool.getPlayerId4Name(_player_name);
            RCGP.getJQElement()
                .find($('#player_info>h3'))
                    .before(
                        $('<div/>',{
                            'id':WndName+'RepConvRadarPlayer',
                            'style':'width: 23px; height: 23px; float: left;',
                            'class': 'grcrt radar'
                        })
                        .mousePopup(new MousePopup(RepConvTool.GetLabel('RADAR.TOWNFINDER')))
                        .click(function() {
                            GRCRT_Radar.windowOpen({player:{'id':_player,'name':_player_name}});
                        })
                    );
        }
        
        //idlePlayer(RCGP); // czas nieaktywności gracza
        if ((RepConv.settings[RepConv.Cookie+'_idle']||false) && RCGP.getJQElement().find($('.grcrt_idle')).length == 0){
            $('<div/>',{'class':'grcrt_idle'}).insertAfter(RCGP.getJQElement().find($('#player_info>h3')).next()),
            //$('<div/>',{'class':'grcrt_idle'}).insertBefore(RCGP.getJQElement().find($('#player_info>a'))),
            addIdleDays(RCGP);//getIdleData(RCGP)
        }
        
        
    }
    function allianceProfilBBCode(RCGP){ // info o graczach w sojuszu - dodanie listy w BBCode
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
        // new bbcode
        if ((RCGP.getJQElement()).find($('#BTNVIEWBB' + WndName)).length == 0) {
            (RepConvTool.AddBtn('BTNVIEWBB', WndName))
                .css('margin','0')
                .click(function() {
                    window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                })
                .insertBefore(WndId + ' #ally_towns div.game_border_top');
        // /new bbcode
            // lista mailingowa do wszystkich członków
            $('<a/>', {
                'href': "#",
                'style': "position:absolute; top:1px; right:90px;",
                'rel': WndId + 'RepConvTownArea',
                'parent': WndId + ' #player_towns'
            })
                .append(
                    $('<img/>', {
                        'id':'grcrt_ally_mass_mail',
                        'src':Game.img()+'/game/ally/mass_mail.png'
                    })
                )
                .click(function() {
                    //---------------
                    var _recipients = "";
                    $.each((RCGP.getJQElement()).find($('#ally_towns ul.members_list>li:nth-child(2) ul li')), function(ind, elem) {
                        if (JSON.parse(RepConvTool.Atob($(elem).find('a.gp_player_link').attr('href'))).name != Game.player_name) {
                            _recipients += JSON.parse(RepConvTool.Atob($(elem).find('a.gp_player_link').attr('href'))).name+";";//$(elem).find('a.gp_player_link').html()+";";
                        }
                    }),
                    Layout.newMessage.open({recipients: _recipients});
                })
                .insertBefore(WndId + ' #ally_towns div.game_border_top');
        }
        // statystyki sojuszu
        if ( (RCGP.getJQElement()).find($(WndId+'RepConvStatsAlly')).length == 0) {
            var
                _ally = JSON.parse(unescape(RepConv.requests.alliance.url).match(/({.*})/)[0]).alliance_id,
                _ally_name = RCGP.getOptions().title,
                _link = $('<a/>',{
                            'href' : "#n",
                            'id' : WndName + 'RepConvStatsAlly',
                            'ally_id'   : _ally,
                            'ally_name' : _ally_name,
                            'class' : 'button_new square',
                            'style' : 'width:26px; float: left;'
                        })
                        .data('ally_id', _ally)
                        .data('ally_name', _ally_name)
                        .html($('<img/>',{src:RepConv.Const.staticImg+'/stats.png'}))
                        .mousePopup(new MousePopup(RepConvTool.GetLabel('STATS.ALLY')))
            if ("https:" == window.location.protocol && (RepConv.active.statsGRCL != 'potusek')) {
                $(_link).attr({
                    'href' : getStatsLink('alliance', _ally, _ally_name),
                    'target' : '_blank'
                })
            } else {
               $(_link)
                   .click(function() {
                       showStats('alliance', $(this).data('ally_id'), $(this).data('ally_name'));
                   })
            }
            RCGP.getJQElement().find($('#alliance_points')).next()
                    .append(_link
                    );
        }
        // radar dla miast sojuszy
        if ( (RCGP.getJQElement()).find($(WndId+'RepConvRadarAlliance')).length == 0) {
            var
                _ally = JSON.parse(unescape(RepConv.requests.alliance.url).match(/({.*})/)[0]).alliance_id,
                _ally_name = RCGP.getOptions().title;//RCGP.getJQElement().find($('#player_info>h3')).html();
            RCGP.getJQElement()
                .find($('#player_info>h3'))
                    .before(
                        $('<div/>',{
                            'id':WndName+'RepConvRadarAlliance',
                            'style':'width: 23px; height: 23px; float: left;',
                            'class': 'grcrt radar'
                        })
                        .data('ally_id', _ally)
                        .data('ally_name', _ally_name)
                        .mousePopup(new MousePopup(RepConvTool.GetLabel('RADAR.TOWNFINDER')))
                        .click(function() {
                            GRCRT_Radar.windowOpen({alliance:{'id':$(this).data('ally_id'),'name':$(this).data('ally_name')}})
                        })
                    );
        }
        // nieaktywnosc graczy
        if ((RepConv.settings[RepConv.Cookie+'_idle']||false) && RCGP.getJQElement().find($('.grcrt_idle')).length == 0){
            $('<div/>',{'class':'grcrt_idle'}).insertAfter(RCGP.getJQElement().find($('.member_icon'))),
            addIdleDays(RCGP);//getIdleData(RCGP)
        }

    }
    function convertBTNconquestOld(RCGP){ // podbój miasta (stary)
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
        if ((RCGP.getJQElement()).find($('#BTNCONV' + WndName)).length == 0) {
            (RepConvTool.AddBtn('BTNCONV', WndName)).click(function() {
                window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                //_GRCRTRepConvData(RCGP);
            })
            .insertAfter((RCGP.getJQElement()).find($('div.gpwindow_content a.gp_town_link')).eq(0));
        }
    }
    function convertBTNReport(RCGP){ // przycisk dla raportu
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
        if ((RCGP.getJQElement()).find($('#report_arrow')).length > 0) {
            // przycisk "Konwertuj"
            if ((RCGP.getJQElement()).find($('#BTNCONV' + WndName)).length == 0) {
                (RCGP.getJQElement()).find($('#report_report div.game_list_footer'))
                    .append(
                        (RepConvTool.AddBtn('BTNCONV', WndName))
                            .click(function() {
                                window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                                //_GRCRTRepConvData(RCGP);
                            })
                    );
                // straty
                if(RepConv.active.unitsCost){
                    var RepType = ((RCGP.getJQElement()).find($('div#report_arrow img')).attr('src').replace(/.*\/([a-z_]*)\.png.*/, '$1'));
                    if ((RepType == "attack") && ((RCGP.getJQElement()).find($('div.support_report_summary')).length != 0)) {
                        RepType = "attackSupport";
                        RCGP.setHeight(539);
                    }
                    switch (RepType) {
                        case "attack"       :
                        case "take_over"    :
                        case "breach"   :
                        case "attackSupport" :
                            if ((RCGP.getJQElement()).find($('div.report_booty_bonus_fight')).length > 0) {
                                // zliczenie
                                var report = {
                                        'attacker' : {
                                                'unit_img' : '',
                                                'unit_send' : '',
                                                'unit_lost' : '',
                                                'unit_list' : '',
                                                'w' : 0,
                                                's' : 0,
                                                'i' : 0,
                                                'p' : 0,
                                                'f' : 0
                                        },
                                        'defender' : {
                                                'unit_img' : '',
                                                'unit_send' : '',
                                                'unit_lost' : '',
                                                'unit_list' : '',
                                                'w' : 0,
                                                's' : 0,
                                                'i' : 0,
                                                'p' : 0,
                                                'f' : 0
                                        }
                                };
                                report.attacker = RepConvTool.getUnitResource(
                                    report.attacker,
                                    (RCGP.getJQElement())
                                        .find($('div.report_side_attacker_unit'))
                                );
                                report.defender = RepConvTool.getUnitResource(
                                    report.defender,
                                    (RCGP.getJQElement())
                                        .find($(((RepType == "attackSupport") ? '.support_report_summary ' : '') + 'div.report_side_defender_unit'))
                                    );
                                $((RCGP.getJQElement()).find($('div.report_booty_bonus_fight'))[0])
                                    .append($('<hr/>'))
                                    .append(
                                        $('<table/>', {'style': 'width:100%; text-align:center; font-size:12px', 'class': 'grcrt_lost_res'})
                                            .append($('<tr/>', {'style': 'height:16px; padding:0px;'})
                                                .append($('<td/>', {'style': 'width:45%;'}).html(report.attacker.w))
                                                .append($('<td/>', {'style': 'height: 15px', 'class': 'resource_wood_icon'}))
                                                .append($('<td/>', {'style': 'width:45%;'}).html(report.defender.w))
                                            )
                                            .append($('<tr/>', {'style': 'height:16px; padding:0px;'})
                                                .append($('<td/>', {'style': 'width:45%;'}).html(report.attacker.s))
                                                .append($('<td/>', {'style': 'height: 15px', 'class': 'resource_stone_icon'}))
                                                .append($('<td/>', {'style': 'width:45%;'}).html(report.defender.s))
                                            )
                                            .append($('<tr/>', {'style': 'height:16px; padding:0px;'})
                                                .append($('<td/>', {'style': 'width:45%;'}).html(report.attacker.i))
                                                .append($('<td/>', {'style': 'height: 15px', 'class': 'resource_iron_icon'}))
                                                .append($('<td/>', {'style': 'width:45%;'}).html(report.defender.i))
                                            )
                                            .append($('<tr/>', {'style': 'height:16px; padding:0px;'})
                                                .append($('<td/>', {'style': 'width:45%;'}).html(report.attacker.f))
                                                .append($('<td/>', {'style': 'height: 14px', 'class': 'resource_favor_icon'}))
                                                .append($('<td/>', {'style': 'width:45%;'}).html(report.defender.f))
                                            )
                                            .append($('<tr/>', {'style': 'height:16px; padding:0px;'})
                                                .append($('<td/>', {'style': 'width:45%;'}).html(report.attacker.p))
                                                .append($('<td/>', {'style': 'width:20px; margin: 0px;', 'class': 'town_population'}))
                                                .append($('<td/>', {'style': 'width:45%;'}).html(report.defender.p))
                                            )
                                    );
                            }
                    }
                }
            }
        }
    }
    function convertBTNWall(RCGP){// przyciski dla murku
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;

        var typUnits = {1: ['defAtt', 'losAtt'], 2: ['defDef', 'losDef']};
        var saveBtn;
        function getWallValues(curTimestamp){
            var cookie = {'defAtt': {}, 'losAtt': {}, 'defDef': {}, 'losDef': {}, 'saved' : curTimestamp||Timestamp.server()};
            $.each(RCGP.getJQElement().find($('div#building_wall li.odd')), function(indLi, elemLi) {
                if (indLi > 0) {
                    // lewa strona
                    RepConv.Debug && console.log($(elemLi).find($('.list_item_left')).length);
                    $.each($(elemLi).find($('.list_item_left')), function(indGr, elemGr) {
                        RepConv.Debug && console.log(typUnits[indLi][indGr]);
                        RepConv.Debug && console.log(elemGr.getElementsByClassName('wall_report_unit').length);
                        $.each($(elemGr).find($('.grcrt_wall_units')), function(indUn, elemUn) {
                            var
                                unitName = $(elemUn).find($('.wall_report_unit')).data('type'),//RepConvTool.getUnitName($(elemUn).find($('.wall_report_unit'))),
                                unitKill = $(elemUn).find($('.wall_report_unit')).data('unit_count');
                                //$(elemUn).find($('.place_unit_black')).html();
                            cookie[typUnits[indLi][indGr]][unitName] = unitKill;
                        });
                    });
                    // prawa strona
                    RepConv.Debug && console.log($(elemLi).find($('.list_item_right')).length);
                    $.each($(elemLi).find($('.list_item_right')), function(indGr, elemGr) {
                        RepConv.Debug && console.log(typUnits[indLi][indGr]);
                        RepConv.Debug && console.log(elemGr.getElementsByClassName('wall_report_unit').length);
                        $.each($(elemGr).find($('.grcrt_wall_units')), function(indUn, elemUn) {
                            var
                                unitName = $(elemUn).find($('.wall_report_unit')).data('type'),//RepConvTool.getUnitName($(elemUn).find($('.wall_report_unit'))),
                                unitKill = $(elemUn).find($('.wall_report_unit')).data('unit_count');
                                //$(elemUn).find($('.place_unit_black')).html();
                            cookie[typUnits[indLi][indGr + 1]][unitName] = unitKill;
                        });
                    });
                }
            })
            return cookie;
        }
        var _curTimestamp = Timestamp.server(),
            _currWallValues = getWallValues(_curTimestamp),
            listSaved, listWall, delSaved;
        function saveWall() {
            try {
                RepConvTool.setItem(RepConv.Cookie, getWallValues(Timestamp.server()));
                // murki, stany
                var _walls = RepConvTool.getItem(RepConv.CookieWall) || [];
                if (_walls.length>10) {
                    _walls.remove(0,0);
                }
                _walls.push(RepConvTool.getItem(RepConv.Cookie));
                RepConvTool.setItem(RepConv.CookieWall, _walls);
                //
                setTimeout(function(){
                    HumanMessage.success(RepConvTool.GetLabel('MSGHUMAN.OK'));
                },0)
                if ($('#' + RepConv.Const.IdWindowClone).length == 1) {
                    $('#' + RepConv.Const.IdWindowClone).remove();
                }
                fillOptions(0,false),
                fillOptions(_curTimestamp,true),
                RCGP.reloadContent(),
                loadWall();
            } catch (err) {
                RepConv.Debug && console.log(err);
                setTimeout(function(){
                    HumanMessage.error(RepConvTool.GetLabel('MSGHUMAN.ERROR'));
                },0)
            }
        }

        function loadWall(loadTimeStamp){
            RepConv.Debug && console.log('Load wall...');
            if(RCGP.getJQElement().find($('#RepConvSaved')).length == 0){
                RCGP.getJQElement().find($('#building_wall div.game_border')).append($('<div/>',{'id':'RepConvSaved', 'style':'position: relative; float: left; margin: 5px; font-weight: bold;'}))
            }
            RCGP.getJQElement()
                .find($('.wall_unit_container>.wall_report_unit'))
                    .wrap($('<div/>',{'class':'grcrt_wall_units'}))
            if (RepConvTool.getItem(RepConv.Cookie) != null) {
                var
                    units = RepConvTool.getItem(RepConv.Cookie),
                    _walls = RepConvTool.getItem(RepConv.CookieWall) || [];
                if ((loadTimeStamp != undefined)) {
                    $.each(_walls, function(indW, elemW){
                        if (elemW.saved == loadTimeStamp) {
                            units = elemW;
                        }
                    })
                }
                //RCGP.getJQElement()
                //    .find($('.wall_unit_container>.wall_report_unit'))
                //        .wrap($('<div/>',{'class':'grcrt_wall_units'})),
                RCGP.getJQElement()
                    .find($('div.grcrt_wall_diff'))
                        .remove(),
                RCGP.getJQElement()
                    .find($('div.grcrt_wall_units'))
                        .append(
                            $('<div/>', {'class': 'grcrt_wall_diff'})
                                .html("-"));
    
                RepConv.Debug && console.log('Load wall...');
                var unitDiff;
                var hun = require("helpers/unit_numbers");
                $.each(RCGP.getJQElement().find($('div#building_wall li.odd')), function(indLi, elemLi) {
                    if (indLi > 0) {
                        // lewa strona
                        RepConv.Debug && console.log($(elemLi).find($('.list_item_left')).length);
                        $.each($(elemLi).find($('.list_item_left')), function(indGr, elemGr) {
                            RepConv.Debug && console.log(typUnits[indLi][indGr]);
                            RepConv.Debug && console.log(elemGr.getElementsByClassName('wall_report_unit').length);
                            $.each($(elemGr).find($('.grcrt_wall_units')), function(indUn, elemUn) {
                                var
                                    unitName = $(elemUn).find($('.wall_report_unit')).data('type'),//RepConvTool.getUnitName($(elemUn).find($('.wall_report_unit'))),
                                    unitKill = $(elemUn).find($('.wall_report_unit')).data('unit_count'),
                                    //$(elemUn).find($('.place_unit_black')).html(),
                                    unitSave = units[typUnits[indLi][indGr]][unitName];
                                RepConv.Debug && console.log(unitName + ' ' + unitSave + '/' + unitKill);
                                unitDiff = unitKill;
                                if (unitSave != undefined) {
                                    unitDiff = unitKill - unitSave;
                                }
                                RepConv.Debug && console.log('unitDiff = ' + unitDiff);
                                $(elemUn).find($('.grcrt_wall_diff')).html((unitDiff != 0) ? hun.shortenNumber(unitDiff) : '');
                            });
                        });
                        // prawa strona
                        RepConv.Debug && console.log($(elemLi).find($('.list_item_right')).length);
                        $.each($(elemLi).find($('.list_item_right')), function(indGr, elemGr) {
                            RepConv.Debug && console.log(typUnits[indLi][indGr]);
                            RepConv.Debug && console.log(elemGr.getElementsByClassName('wall_report_unit').length);
                            $.each($(elemGr).find($('.grcrt_wall_units')), function(indUn, elemUn) {
                                var
                                    unitName = $(elemUn).find($('.wall_report_unit')).data('type'),//RepConvTool.getUnitName($(elemUn).find($('.wall_report_unit'))),
                                    unitKill = $(elemUn).find($('.wall_report_unit')).data('unit_count'),
                                    //$(elemUn).find($('.place_unit_black')).html(),
                                    unitSave = units[typUnits[indLi][indGr + 1]][unitName];
                                RepConv.Debug && console.log(unitName + ' ' + unitSave + '/' + unitKill);
                                unitDiff = unitKill;
                                if (unitSave != undefined) {
                                    unitDiff = unitKill - unitSave;
                                }
                                RepConv.Debug && console.log('unitDiff = ' + unitDiff);
                                $(elemUn).find($('.grcrt_wall_diff')).html((unitDiff != 0) ? hun.shortenNumber(unitDiff) : '');
                            });
                        });
                    }
                });
                $('#RepConvSaved').html(RepConvTool.GetLabel('WALLSAVED')+((units.saved != undefined)?': '+readableUnixTimestamp(units.saved, 'player_timezone', {with_seconds: true, extended_date : true})/*formatDateTimeNice(units.saved, true)*/:'')).css('color','black');
                //$('.grcrt_wall_compare').show();
            } else {
                $('#RepConvSaved').html(RepConvTool.GetLabel('WALLNOTSAVED')).css('color','red');
                //$('.grcrt_wall_compare').hide();
            }
        }

        function loadStateWall(loadTimeStamp){
            RepConv.Debug && console.log('Load state wall...');
            var
                units = RepConvTool.getItem(RepConv.Cookie),
                _walls = RepConvTool.getItem(RepConv.CookieWall) || [];
            // var typUnits = {1: ['defAtt', 'losAtt'], 2: ['defDef', 'losDef']};
            if ((loadTimeStamp == _curTimestamp)) {
                units = _currWallValues;
            } else {
                $.each(_walls, function(indW, elemW){
                    if (elemW.saved == loadTimeStamp) {
                        units = elemW;
                    }
                })
            }
            var hun = require("helpers/unit_numbers");
            saveBtn.disable(!(loadTimeStamp == _curTimestamp));
            $.each(RCGP.getJQElement().find($('div#building_wall li.odd')), function(indLi, elemLi) {
                if (indLi > 0) {
                    // lewa strona
                    RepConv.Debug && console.log($(elemLi).find($('.list_item_left')).length);
                    $.each($(elemLi).find($('.list_item_left')), function(indGr, elemGr) {
                        RepConv.Debug && console.log(typUnits[indLi][indGr]);
                        RepConv.Debug && console.log(elemGr.getElementsByClassName('wall_report_unit').length);
                        $.each($(elemGr).find($('.grcrt_wall_units')), function(indUn, elemUn) {
                            var
                                unitName = $(elemUn).find($('.wall_report_unit')).data('type');
                                // RepConvTool.getUnitName($(elemUn).find($('.wall_report_unit')));
                            if(units[typUnits[indLi][indGr]][unitName]){
                                $(elemUn).find($('.wall_report_unit')).data('unit_count',units[typUnits[indLi][indGr]][unitName]),
                                $(elemUn).find($('.place_unit_black')).html(hun.shortenNumber(units[typUnits[indLi][indGr]][unitName])),
                                $(elemUn).find($('.place_unit_white')).html(hun.shortenNumber(units[typUnits[indLi][indGr]][unitName]));
                            }
                        });
                    });
                    // prawa strona
                    RepConv.Debug && console.log($(elemLi).find($('.list_item_right')).length);
                    $.each($(elemLi).find($('.list_item_right')), function(indGr, elemGr) {
                        RepConv.Debug && console.log(typUnits[indLi][indGr]);
                        RepConv.Debug && console.log(elemGr.getElementsByClassName('wall_report_unit').length);
                        $.each($(elemGr).find($('.grcrt_wall_units')), function(indUn, elemUn) {
                            var
                                unitName = RepConvTool.getUnitName($(elemUn).find($('.wall_report_unit')));
                            if(units[typUnits[indLi][indGr]][unitName]){
                                $(elemUn).find($('.wall_report_unit')).data('unit_count',units[typUnits[indLi][indGr + 1]][unitName]),
                                $(elemUn).find($('.place_unit_black')).html(hun.shortenNumber(units[typUnits[indLi][indGr + 1]][unitName])),
                                $(elemUn).find($('.place_unit_white')).html(hun.shortenNumber(units[typUnits[indLi][indGr + 1]][unitName]));
                            }
                        });
                    });
                }
            }),
            loadWall(listSaved.getValue());
        }
        
        function fillOptions(timestamp, current){
            var
                opt = [],
                _walls = RepConvTool.getItem(RepConv.CookieWall) || [];
            $.each(_walls, function(iii,www){
                if (www.saved > timestamp && www.saved < _curTimestamp) {
                    opt.push({'value':www.saved, 'name':readableUnixTimestamp(www.saved, 'player_timezone', {with_seconds: true, extended_date : true})})
                }
            })
            if (current) {
                opt.push({'value':_curTimestamp, 'name':readableUnixTimestamp(_curTimestamp, 'player_timezone', {with_seconds: true, extended_date : true})}),
                listWall.setOptions(opt),
                listWall.setValue(_curTimestamp)
            } else {
                listSaved.setOptions(opt),
                listSaved.setValue(((RepConvTool.getItem(RepConv.Cookie) != undefined)) ? RepConvTool.getItem(RepConv.Cookie).saved : 0)
            }
        }
        function list2compare(){
            listSaved =
                    register(
                        'grcrt_saved',
                        $('<div/>',{'id':'grcrtListSaved','class':'dropdown default'})
                .dropdown({
                    list_pos : 'left',
                    value : (RepConvTool.getItem(RepConv.Cookie) != undefined) ? RepConvTool.getItem(RepConv.Cookie).saved : '',
                                    class_name : 'grcrt_dd_list'
                })
                            .on("dd:change:value", function(e, new_val, old_val, _dd, data) {
                                fillOptions(new_val,true)
                loadWall(new_val);
                })
                            .on("dd:list:show", function() {
                                listWall.hide();
                })
                    ),
            listWall  = 
                    register(
                        'grcrt_wall',
                        $('<div/>',{'id':'grcrtListWall','class':'dropdown default'})
                .dropdown({
                                    list_pos : 'left',
                    value : (RepConvTool.getItem(RepConv.Cookie) != undefined) ? RepConvTool.getItem(RepConv.Cookie).saved : '',
                                    class_name : 'grcrt_dd_list'
                })
                            .on("dd:change:value", function(e, new_val, old_val, _dd, data) {
                                loadStateWall(new_val);
                                //loadWall(new_val);
                                //$('#statsGRCL').attr('value', new_val);
                })
                            .on("dd:list:show", function() {
                                listSaved.hide();
                })
                    ),
            delSaved =
                    register(
                        'grcrt_delsaved',
                        $('<a/>', {'class':'cancel', 'style':'float:right;'})
                            .button({
                                template: "empty"
                            }).on("btn:click", function() {
                                hOpenWindow.showConfirmDialog(RepConvTool.GetLabel('QUESTION'),RepConvTool.GetLabel('WALL.WANTDELETECURRENT'), function(){dellCurrentSavedWall()});
                                
                            })
                            .mousePopup(
                                new MousePopup(RepConvTool.GetLabel('WALL.DELETECURRENT'))
                            )
                    ),
            fillOptions(0,false),
            fillOptions(_curTimestamp,true),
            RCGP.getJQElement().find($('div#building_wall li')).eq(0)
                .append($('<hr/>'))
                .append(
                    $('<div/>',{'class':'grcrt_wall_compare'})
                        .append(
                            $('<div/>', {'class':'grcrt_wall_compare_dd', 'style':'width: 49%;'})
                            .append(delSaved)
                            .append(
                                $('<label/>', {'for': 'grcrtListSaved'}).text(RepConvTool.GetLabel('WALL.LISTSAVED'))
                            )
                            .append(listSaved)
                        )
                        .append(
                            $('<div/>', {'class':'grcrt_wall_compare_dd', 'style':'width: 49%;'})
                            .append(
                                $('<label/>', {'for': 'grcrtListWall'}).text(RepConvTool.GetLabel('WALL.LISTSTATE'))
                            )
                            .append(listWall)
                        )
                        .append(
                            $('<br/>', {'style':'clear:both'})
                        )
                )
        }
        
        function dellCurrentSavedWall(){
            /* RepConvTool.setItem(RepConv.CookieWall,(RepConvTool.getItem(RepConv.CookieWall+'_bck'))) */
            try {
                var
                    _value = CM.get({main:'GRCRT',sub:'grcrt_saved'},'grcrt_saved').getValue(),
                    _walls = RepConvTool.getItem(RepConv.CookieWall) || [];
                    
                $.each(_walls, function(iii,eee){
                    if(eee.saved == _value){
                        _walls.remove(iii,0);
                        return false;
                    }
                }),
                RepConvTool.setItem(RepConv.CookieWall, _walls),
                fillOptions(0,false),
                fillOptions(_curTimestamp,true),
                RCGP.reloadContent(),
                loadWall();
                setTimeout(function(){
                    HumanMessage.success(RepConvTool.GetLabel('MSGHUMAN.OK'));
                },0)
            } catch (err) {
                RepConv.Debug && console.log(err);
                setTimeout(function(){
                    HumanMessage.error(RepConvTool.GetLabel('MSGHUMAN.ERROR'));
                },0)
            }
        }
        
        if ((RCGP.getJQElement()).find($('#building_wall div.game_border #BTNCONV' + WndName)).length == 0) {
            (RCGP.getJQElement()).find('#building_wall ul.game_list').css('max-height', '455px');
            //konwersja
            (RepConvTool.AddBtn('BTNCONV', WndName)).click(function() {
                listSaved.hide(),
                listWall.hide(),
                window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                //_GRCRTRepConvData(RCGP);
            }).appendTo((RCGP.getJQElement()).find($('#building_wall div.game_border')));
        }
        if ((RCGP.getJQElement()).find($('#building_wall div.game_border #BTNSAVE' + WndName)).length == 0) {
            //zapis
            saveBtn = RepConvTool.AddBtn('BTNSAVE', WndName)
                        .on("btn:click", function(){
                            saveWall();
                        });
            (saveBtn).appendTo((RCGP.getJQElement()).find($('#building_wall div.game_border')));
            $.each(RCGP.getJQElement().find($('div#building_wall li.odd')), function(indLi, elemLi) {
                if ($(elemLi.previousElementSibling).find($('.wall_symbol')).length > 0) {
                    $(elemLi.previousElementSibling)
                        .css('cursor','pointer')
                        .click(function(){
                            $(elemLi).slideToggle(200);
                        })
                }
            });
            loadWall(),
            list2compare(),
            _currWallValues = getWallValues(_curTimestamp);
            RepConv.wall = _currWallValues;
        }
    }
    function convertBTNAgora(RCGP){ // przyciski dla placu
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;

    function getSupportPlayers(){
            var
                _players = {},
                tmp,
                TmpTextArray = {},
                currArray = 0,
                TmpTextTown = '',
                lp = 0,
                _player,
                TmpText;

            //Layout.showAjaxLoader();
            $.each((RCGP.getJQElement()).find($('.game_list li[id^="support_units_"] a.gp_player_link')), function(ind,elem){
                tmp = $(elem).attr('href').split(/#/),
                _player=JSON.parse(atob(tmp[1] || tmp[0]));
                if(Game.player_name != _player.name && _players[_player.id] == undefined){
                    _players[_player.id] = _player;
                }
            }),
            $.each(_players, function(ind,_player){
                var _json = {
                    "player_id" : _player.id,
                    "town_id" : Game.townId,
                    "nl_init": NotificationLoader.isGameInitialized()
                },
                _responseText,
                _getAllyReq = $.ajax({
                            url: '/game/player?action=get_profile_html&town_id='+Game.townId+
                                '&h='+Game.csrfToken+'&json='+JSON.stringify(_json),
                            async: false
                });
                try {
                    _responseText = (JSON.parse(_getAllyReq.responseText)).plain.html;
                } catch (exp){
                    _responseText = _getAllyReq.responseText;
                }
                _players[_player.id].alliance_name = ($(_responseText).children('a').attr('onclick') || '').replace(/.*\('(.*)'.*/,'$1');
            }),
            TmpTextTown = (RCGP.getJQElement()).find($('#defense_header')).html().stripTags()+':',
            TmpTextTown += '[town]' + Game.townId + '[/town]',
            TmpTextTown += '\n[table]\n',
            $.each(_players, function(ipa, _player){
                TmpText = '[*]' + (++lp) + '.[|]',
                TmpText += '[player]' + _player.name + '[/player][|]',
                TmpText += '[ally]' + _player.alliance_name + '[/ally]',
                TmpText += '[/*]\n';
                if ((TmpTextTown + TmpText).length > 3000) {
                    TmpTextArray[currArray] = TmpTextTown + '[/table]',
                    currArray++,
                    TmpTextTown = (RCGP.getJQElement()).find($('#defense_header')).html().stripTags()+':',
                    TmpTextTown += '[town]' + Game.townId + '[/town]',
                    TmpTextTown += '\n[table]\n',
                    TmpTextTown += TmpText;
                } else {
                    TmpTextTown += TmpText;
                }
            });
            Layout.hideAjaxLoader();
            TmpTextArray[currArray] = TmpTextTown + '[/table]';
            //---------------
            if (typeof RepConvParamWnd != 'undefined') {
                try {
                    RepConvParamWnd.close();
                } catch (exp) {
                }
                RepConvParamWnd = undefined;
            }
            window.RepConvParamWnd = Layout.dialogWindow.open('', RepConv.Scripts_name, 500, 580, null, false);
            RepConvParamWnd.setHeight(480);
            RepConvParamWnd.setPosition(["center", "center"]);
            RepConvParamWnd.appendContent($('<div/>', {'style': 'width:100%'}).html(RepConvTool.GetLabel('BBCODELIMIT')));
            $.each(TmpTextArray, function(ind, elem) {
                RepConvParamWnd.appendContent(
                    $('<textarea/>', {
                        'class': 'message_post_content',
                        'style': 'height: 160px; width: 98%; border: 1px solid #D1BF91',
                        'readonly': 'readonly'
                    })
                    .text(elem)
                    .click(function() {
                        this.select();
                    })
                );
            });
        }

        if (
            (RCGP.getJQElement()).find($('#place_defense #BTNCONV' + WndName)).length == 0
        ) {
            (RCGP.getJQElement()).find($('#place_defense div.game_list_footer'))
                .append(
                    (RepConvTool.AddBtn('BTNCONV', WndName))
                        .click(function() {
                            window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                            //_GRCRTRepConvData(RCGP);
                        })
                )
        }
        // lista wspomagających
        if (
            (RCGP.getJQElement()).find($('#place_defense #defense_header')).length > 0
            &&
            (RCGP.getJQElement()).find($('#place_defense #BTNSUPPLAYERS' + WndName)).length == 0
        ) {
            (RCGP.getJQElement()).find($('#place_defense div.game_list_footer'))
                .append(
                    (RepConvTool.AddBtn('BTNSUPPLAYERS', WndName)).click(function() {
                        //Layout.showAjaxLoader();
                        //setTimeout(function(){RepConvTool.getSupportPlayers(RCGP);},100);
                        getSupportPlayers();
                    })
                )
        }
    }
    function convertBTNcommandList(RCGP){ // przyciski listy rozkazów
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
        if (
            (RCGP.getJQElement()).find($('#dd_commands_command_type')).length > 0
            &&
            (RCGP.getJQElement()).find($('#BTNCONV' + WndName)).length == 0
           ){
                (RCGP.getJQElement()).find($('#game_list_footer'))
                    .append(
                        (RepConvTool.AddBtn('BTNCONV', WndName))
                        .click(function() {
                            window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                            //_GRCRTRepConvData(RCGP);
                        })
                    )
                if (CM.get(RCGP.getContext(),'dd_commands_command_type')) {
                    CM.get(RCGP.getContext(),'dd_commands_command_type')
                        .bind("dd:change:value",function(a,b,c,d){
                            commandFilter(RCGP, parseInt(cmGet('grcrt_townsDD').getValue()||'0'), RepConvGRC.townsCommand);
                        })
                }
                var
                    _commands = JSON.parse(RepConv.requests.town_overviews.responseText).json.data.commands,
                    _defOptions={name:RepConvTool.GetLabel('COMMAND.ALL'),value:0},
                    _FilterOptions=[{name:'enable',value:1},{name:'disable',value:0}],
                    _townsOptions=[_defOptions],
                    _townsDD,
                    _townsOptionsTmp = {};
                register(
                    'grcrt_townsDD',
                    $('<div/>',{'id':'grcrt_townsDD','class':'dropdown default','style':'margin-left:5px;width: 120px;'})
                        .dropdown({
                            list_pos : 'left',
                            value : _defOptions.value,
                            options : _townsOptions
                        })
                        .on("dd:change:value", function(e, new_val, old_val, _dd, data) {
                            commandFilter(RCGP, new_val, RepConvGRC.townsCommand);
                        })
                ),
                register(
                    'grcrt_FI',
                    $('<div/>',{'id':'grcrt_FI','class':'dropdown default','style':'margin-left:5px;width: 120px;'})
                        .dropdown({
                            list_pos : 'left',
                            value : 1,
                            options : _FilterOptions
                        })
                        .on("dd:change:value", function(e, new_val, old_val, _dd, data) {
                            RepConv.Debug && console.log('grcrt_FI'+new_val);
                            commandFilter(RCGP, parseInt(cmGet('grcrt_townsDD').getValue()||'0'), RepConvGRC.townsCommand);
                        })
                ),
                register(
                    'grcrt_FR',
                    $('<div/>',{'id':'grcrt_FR','class':'dropdown default','style':'margin-left:5px;width: 120px;'})
                        .dropdown({
                            list_pos : 'left',
                            value : 1,
                            options : _FilterOptions
                        })
                        .on("dd:change:value", function(e, new_val, old_val, _dd, data) {
                            RepConv.Debug && console.log('grcrt_FR'+new_val);
                            commandFilter(RCGP, parseInt(cmGet('grcrt_townsDD').getValue()||'0'), RepConvGRC.townsCommand);
                        })
                ),
                register(
                    'grcrt_FO',
                    $('<div/>',{'id':'grcrt_FO','class':'dropdown default','style':'margin-left:5px;width: 120px;'})
                        .dropdown({
                            list_pos : 'left',
                            value : 1,
                            options : _FilterOptions
                        })
                        .on("dd:change:value", function(e, new_val, old_val, _dd, data) {
                            RepConv.Debug && console.log('grcrt_FO'+new_val);
                            commandFilter(RCGP, parseInt(cmGet('grcrt_townsDD').getValue()||'0'), RepConvGRC.townsCommand);
                        })
                ),
                unRegister('grcrt_towns'),
                _townsDD =
                    register(
                        'grcrt_towns',
                        $('<div/>',{'id':'grcrt_towns','class':'dropdown default','style':'margin-left:5px;width: 140px;'})
                            .dropdown({
                                list_pos : 'left',
                                value : (!cmGet('grcrt_townsDD')) ? Options.value : cmGet('grcrt_townsDD').getValue(),
                                options : cmGet('grcrt_townsDD').getOptions()
                            })
                            .on("dd:change:value", function(e, new_val, old_val, _dd, data) {
                                cmGet('grcrt_townsDD').setValue(new_val),
                                refreshTownList(RCGP),
                                commandFilter(RCGP, new_val, RepConvGRC.townsCommand);
                            })
                    ),
                (RCGP.getJQElement()).find($('#game_list_header'))
                    .append(
                        $('<div/>',{'id':'grcrt_command_filter', 'style':'display: inline-block; float: right;'})
                            .append(
                                $('<span/>',{'class':"grcrt_filter"})
                                    .html(RCGP.getJQElement().find($('#command_filter>span')).html())
                            )
                            // .append(
                            //     $('<span/>',{'class':"overview_incoming icon grcrt_filter"})
                            //         .mousePopup(new MousePopup(RepConvTool.GetLabel('COMMAND.INCOMING')))
                            //         .addClass((parseInt(cmGet('grcrt_FI').getValue())==0)?'grcrt_disabled':'')
                            //         .click(function(){
                            //             $(this).toggleClass('grcrt_disabled'),
                            //             cmGet('grcrt_FI').setValue($(this).hasClass('grcrt_disabled')?'0':'1')
                            //         })
                            // )
                            .append(
                                $('<span/>',{'class':"overview_outgoing icon grcrt_filter"})
                                    .mousePopup(new MousePopup(RepConvTool.GetLabel('COMMAND.OUTGOING')))
                                    .addClass((parseInt(cmGet('grcrt_FO').getValue())==0)?'grcrt_disabled':'')
                                    .click(function(){
                                        $(this).toggleClass('grcrt_disabled'),
                                        cmGet('grcrt_FO').setValue($(this).hasClass('grcrt_disabled')?'0':'1')
                                    })
                            )
                            .append(
                                $('<span/>',{'class':"grcrt_return grcrt_filter"})
                                    .mousePopup(new MousePopup(RepConvTool.GetLabel('COMMAND.RETURNING')))
                                    .addClass((parseInt(cmGet('grcrt_FR').getValue())==0)?'grcrt_disabled':'')
                                    .click(function(){
                                        $(this).toggleClass('grcrt_disabled'),
                                        cmGet('grcrt_FR').setValue($(this).hasClass('grcrt_disabled')?'0':'1')
                                    })
                            )
                            // .append(
                            //     $('<label/>').text(RepConvTool.GetLabel('COMMAND.FORTOWN'))
                            // )
                            .append(_townsDD)
                    )
                if (parseInt(cmGet('grcrt_townsDD').getValue()) == 0) {
                    (RCGP.getJQElement()).find($('span.icon.grcrt_filter')).hide()
                }
                refreshTownList(RCGP),
                commandFilter(RCGP, parseInt(cmGet('grcrt_townsDD').getValue()||'0'), RepConvGRC.townsCommand);
        }
    }
    function refreshTownList(RCGP){
        var
            _commands = JSON.parse(RepConv.requests.town_overviews.responseText).json.data.commands,
            _defOptions={name:RepConvTool.GetLabel('COMMAND.ALL'),value:0},
            _townsOptions=[_defOptions],
            _townsOptionsTmp = {};
        RepConv.Debug && console.log('refreshTownList')
        RepConvGRC.townsCommand = {};
        (RCGP.getJQElement()).find($('span.icon.grcrt_filter')).hide()
        if (parseInt(cmGet('grcrt_townsDD').getValue()) != 0) {
            (RCGP.getJQElement()).find($('span.icon.grcrt_filter')).show()
            RepConv.Debug && console.log(cmGet('grcrt_townsDD').getOption('value',parseInt(cmGet('grcrt_townsDD').getValue())))
                var _town = cmGet('grcrt_townsDD').getOption('value',parseInt(cmGet('grcrt_townsDD').getValue()));
                _townsOptionsTmp[_town.value] = _town;
        }
        $.each(_commands,function(ind,elem){
            var
                _townO = {name:elem.origin_town_name,value:elem.origin_town_id},
                _townD = {name:elem.destination_town_name,value:elem.destination_town_id};
            if (RepConvGRC.townsCommand[_townO.value] == undefined) {
                RepConvGRC.townsCommand[_townO.value] = []
            }
            if (RepConvGRC.townsCommand[_townD.value] == undefined) {
                RepConvGRC.townsCommand[_townD.value] = []
            }
            _townsOptionsTmp[_townD.value] = _townD,
            _townsOptionsTmp[_townO.value] = _townO,
            RepConvGRC.townsCommand[_townO.value].push(elem),
            RepConvGRC.townsCommand[_townD.value].push(elem)
        }),
        $.each(_townsOptionsTmp,function(ind,elem){
            _townsOptions.push(elem);
        })
        if (cmGet('grcrt_townsDD')) {
            cmGet('grcrt_townsDD').setOptions(_townsOptions)
            if (cmGet('grcrt_towns')) {
                cmGet('grcrt_towns').setOptions(cmGet('grcrt_townsDD').getOptions())
            }
        }
    }
    function defCtx(id){
        return {main:'GRCRT',sub:id};
    }
    function register(id,component){
        if (!cmGet(id)) {
            RepConv.Debug && console.log('register: '+id);
            CM.register(defCtx(id),id,component)        
        }
        return cmGet(id);
    }
    function reRegister(id,component){
        var exists = cmGet(id), lastValue = (!exists) ? null : exists.getValue(), result = null;
        unRegister(id),
        result = register(id,component),
        $.each(result.getOptions(),function(ind,option){
            if(option.value == lastValue){
                result.setValue(lastValue)
            }
        })
        return result;
    }
    function unRegister(id){
        if (cmGet(id)) {
            RepConv.Debug && console.log('unregister: '+id);
            CM.unregister(defCtx(id),id);
        }
    }
    function cmGet(id){
        RepConv.Debug && console.log('get: '+id);
        return CM.get(defCtx(id),id);
    }
    function commandFilter(RCGP, new_val, commandArray){
        if (new_val == 0) {
            (RCGP.getJQElement()).find($('.place_command')).removeClass('grcrt_command');
            if (parseInt(cmGet('grcrt_FR').getValue())==0){
                $.each(commandArray, function(indca,town){
                    $.each(town, function(indt,elem){
                        if (elem.return) {
                            (RCGP.getJQElement()).find($('#command_'+elem.id)).addClass('grcrt_command');
                        }
                    })
                })
            }
        } else {
            try{
                (RCGP.getJQElement()).find($('.place_command')).addClass('grcrt_command');
                $.each(commandArray[new_val], function(ind,elem){
                    (RCGP.getJQElement()).find($('#command_'+elem.id)).addClass('grcrt_command');
                    if ((parseInt(cmGet('grcrt_FI').getValue())==1) && elem.destination_town_id == new_val && !elem.return) {
                        (RCGP.getJQElement()).find($('#command_'+elem.id)).removeClass('grcrt_command');
                    }
                    if ((parseInt(cmGet('grcrt_FR').getValue())==1) && elem.destination_town_id == new_val && elem.return) {
                        (RCGP.getJQElement()).find($('#command_'+elem.id)).removeClass('grcrt_command');
                    }
                    if ((parseInt(cmGet('grcrt_FR').getValue())==1) && elem.origin_town_id == new_val && elem.return) {
                        (RCGP.getJQElement()).find($('#command_'+elem.id)).removeClass('grcrt_command');
                    }
                    if ((parseInt(cmGet('grcrt_FO').getValue())==1) && elem.origin_town_id == new_val && !elem.return) {
                        (RCGP.getJQElement()).find($('#command_'+elem.id)).removeClass('grcrt_command');
                    }
                })
            }catch(err){}
        }
    }
    function convertBTNsingleCommand(RCGP){ // pojedyncze rozkazy
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
        if ((RCGP.getJQElement()).find($('div.command_info #BTNCONV' + WndName)).length == 0) {
            (RepConvTool.AddBtn('BTNCONV', WndName))
                .css({
                    'position': 'absolute',
                    'bottom' : '0px',
                    'right' : '0px'
                })
                .click(function() {
                    window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                    //_GRCRTRepConvData(RCGP);
                })
                .appendTo((RCGP.getJQElement()).find($('div.command_info')));
            if ((RCGP.getJQElement()).find($('div.command_info a.button')).length > 0) {
        (RCGP.getJQElement()).find($('div.command_info #BTNCONV' + WndName)).css('right', '125px');
        }
            //  co sowa widziala....
            $.each((RCGP.getJQElement()).find($('#casted_power_reports a')), function(ind, elem){
                    var _repId = $(elem).attr('onclick').replace(/.*\(([0-9]*)\).*/, '$1');
                    gpAjax.ajaxPost(
                        "report",
                        "view",
                        {
                            id : _repId
                        },
                        !0,
                        {
                            success: function(f, g, i, j) {
                                var _units;
                                $('#RepConvTMP').html(g.html);
                                if ($('#RepConvTMP').find($('#report_power_symbol.wisdom')).length ==1){
                                        _units = $('#RepConvTMP').find($('#right_side')),
                                        (RCGP.getJQElement()).find($('fieldset.command_info_units .index_unit')).hide(),
                                        (RCGP.getJQElement()).find($('fieldset.command_info_units'))
                                                .append($('<div/>', {'class':'grcrt_wisdom'})
                                                        .append($('<div/>', {'class': 'power_icon60x60 wisdom', 'style' : 'float:left'}))
                                                        .append(_units)
                                                )
                                        //        ,
                                        //$.jStorage.set(RepConv.Cookie+'_'+_repId,
                                        //                           (RCGP.getJQElement()).find($('fieldset.command_info_units .grcrt_wisdom')).html(),
                                        //                           {TTL: ((Timestamp.server()+60*60*144)*1000)});
                                }
                                $('#RepConvTMP').html(null);
                            }})
            });
            // /co sowa widziala....
    }
    }
    function convertBTNconquer(RCGP){ // zajmowanie miasta (stary system) AQQ
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
        if (
            (RCGP.getJQElement()).find($('#conqueror_units_in_town')).length > 0
            &&
            (RCGP.getJQElement()).find($('#conqueror_units_in_town #BTNCONV' + WndName)).length == 0
            ) {
                (RepConvTool.AddBtn('BTNCONV', WndName)).click(function() {
                    window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                    //_GRCRTRepConvData(RCGP);
                })
                .attr('style', 'position: absolute; right: 0px; top: 0px;')
                .appendTo(
                    (RCGP.getJQElement()).find($('#conqueror_units_in_town'))
                );
        }
        if (
            (RCGP.getJQElement()).find($('#unit_movements')).length > 0
            &&
            (RCGP.getJQElement()).find($('#unit_movements #BTNCONV' + WndName)).length == 0
            ) {
                (RepConvTool.AddBtn('BTNCONV', WndName)).click(function() {
                    window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                    //_GRCRTRepConvData(RCGP);
                })
                .attr('style', 'position: absolute; right: 20px; top: 0px;')
                .appendTo(
                    (RCGP.getJQElement()).find($('#unit_movements'))
                );
        }
    }
    function convertBTNSupportInCity(RCGP){
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
        if (
            RCGP.getContext().sub == "town_info_support"
            &&
            (RCGP.getJQElement()).find($('div.support_details_box .game_border #BTNCONV' + WndName)).length == 0
            ) {
                (RCGP.getJQElement())
                    .find($('div.support_details_box .game_border'))
                        .append(
                            (RepConvTool.AddBtn('BTNCONV', WndName)).click(function() {
                                //RepConvTool.parentId = this.getAttribute('rel');
                                //RepConv.Debug && console.log('GPW=' + RepConvTool.parentId);
                                window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                                //_GRCRTRepConvData(RCGP);
                            })
                            .css({'position': 'absolute','top': '-2px','right': '-2px'})
                        );
        }
        
    }
    function statsLink(RCGP){ // info o graczu - dodanie linku do statystyk
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
        // statystyki gracza
        if ( (RCGP.getJQElement()).find($(WndId+'RepConvStatsPlayer')).length == 0 && $(RCGP.getJQElement().find($('a.gp_player_link'))[0]).attr('href') != undefined) {
            var
                __tmp = $(RCGP.getJQElement().find($('a.gp_player_link'))[0]).attr('href').split(/#/),
                _player = JSON.parse(atob(__tmp[1] || __tmp[0])).id, //eval('tmpArray=' + atob(__tmp[1] || __tmp[0])).id,
                _player_name = encodeURIComponent($(RCGP.getJQElement().find($('a.gp_player_link'))[0]).html()),
                _link = $('<a/>',{
                            'href' : "#n",
                            'id' : WndName + 'RepConvStatsPlayer',
                            'player_id' : _player,
                            'player_name' : _player_name
                        })
                        .html($('<img/>',{src:RepConv.Const.staticImg+'/stats.png'}))
                        .mousePopup(new MousePopup(RepConvTool.GetLabel('STATS.PLAYER')))
            if ("https:" == window.location.protocol && (RepConv.active.statsGRCL != 'potusek')) {
                $(_link).attr({
                    'href' : getStatsLink('player', _player, _player_name),
                    'target' : '_blank'
                })
            } else {
               $(_link)
                   .click(function() {
                       showStats('player', $(this).attr('player_id'), $(this).attr('player_name'));
                   })
            }
            RCGP.getJQElement()
                .find($('a.color_table.assign_color'))
                    .parent()
                        .css('min-width','100px')
                        .append(_link);
        }
        // statystyki sojuszu
        if (
            (RCGP.getJQElement()).find($(WndId+'RepConvStatsAlly')).length == 0
            &&
            RCGP.getJQElement().find($('a.color_table.assign_ally_color')).parent().parent().children().eq(1).attr('onclick') != undefined)
        {
            var
                _ally = RCGP.getJQElement().find($('a.color_table.assign_ally_color')).parent().parent().children().eq(1).attr('onclick').replace(/.*\,([0-9]*)\)/,'$1'),
                _ally_name = RCGP.getJQElement().find($('a.color_table.assign_ally_color')).parent().parent().children().eq(1).html(),
                _link = $('<a/>',{
                            'href' : "#n",
                            'id'    : WndName + 'RepConvStatsAlly',
                            'ally_id'   : _ally,
                            'ally_name' : _ally_name
                        })
                        .html($('<img/>',{src:RepConv.Const.staticImg+'/stats.png'}))
                        .mousePopup(new MousePopup(RepConvTool.GetLabel('STATS.ALLY')))
            if ("https:" == window.location.protocol && (RepConv.active.statsGRCL != 'potusek')) {
                $(_link).attr({
                    'href' : getStatsLink('alliance', _ally, _ally_name),
                    'target' : '_blank'
                })
            } else {
               $(_link)
                   .click(function() {
                       showStats('alliance', $(this).attr('ally_id'), $(this).attr('ally_name'));
                   })
            }
            RCGP.getJQElement()
                .find($('a.color_table.assign_ally_color'))
                    .parent()
                        .css('min-width','100px')
                        .append(_link);
        }
        // statystyki miasta
        if (
            (RCGP.getJQElement()).find($(WndId+'RepConvStatsTown')).length == 0
            &&
            RCGP.getJQElement().find($('.town_bbcode_id')).length > 0
        ) {
            var
                _town = RCGP.getJQElement().find($('.town_bbcode_id')).attr('value').replace(/.*\]([0-9]*)\[.*/,'$1'),
                _link = $('<a/>',{
                            'href' : "#n",
                            'id'      : WndName + 'RepConvStatsTown',
                            'town_id' : _town,
                            'town_name': RCGP.getTitle(),
                            'style'   : "position: absolute; top: 1px; right: 2px;"
                        })
                        .html($('<img/>',{src:RepConv.Const.staticImg+'/stats.png'}))
                        .mousePopup(new MousePopup(RepConvTool.GetLabel('STATS.TOWN')))
            if ("https:" == window.location.protocol && (RepConv.active.statsGRCL != 'potusek')) {
                $(_link).attr({
                    'href' : getStatsLink('town', _town, null),
                    'target' : '_blank'
                })
            } else {
               $(_link)
                   .click(function() {
                       showStats('town', $(this).attr('town_id'), $(this).attr('town_name'));
                   })
            }
            RCGP.getJQElement()
                .find($('div.game_header.bold'))
                    .append(_link);
        }
        // radar dla miast gracza
        if (
            (RCGP.getJQElement()).find($(WndId+'RepConvRadarPlayer')).length == 0
            &&
            RCGP.getJQElement().find($('.town_bbcode_id')).length > 0
            ){
            var
                _attr = RCGP.getJQElement().find($('.info_jump_to_town')).attr('onclick'),
                _rgx = /\w+:\d+/g,
                _match,
                _town = {};
                _town['name'] = RCGP.getTitle();


                while (_match = _rgx.exec(_attr)){
                    _town[_match[0].split(":")[0]] = _match[0].split(":")[1]
                }
                RCGP.getJQElement()
                    .find($('[id*="RepConvStatsTown"]'))
                        .before(
                            $('<a/>',{
                                'href'    : "#n",
                                'id'      : WndName+'RepConvRadarPlayer',
                                'town_id' : _town.id,
                                'style'   : 'position: absolute; top: 1px; right: 30px;'
                            })
                            .html($('<img/>',{class:'grcrt radar',src:RepConv.grcrt_domain+'/ui/layout_3.3.0.png',style:'object-position: -77px -80px; width: 30px;'}))
                            .mousePopup(new MousePopup(RepConvTool.GetLabel('RADAR.TOWNFINDER')))
                            .click(function() {
                                // console.log(_town);
                                GRCRT_Radar.windowOpen({town:{'id':_town.id,'name':_town.name,'ix':_town.x,'iy':_town.y}});
                            })
                        );
        }
        // nieaktywnosc gracza
        if ((RepConv.settings[RepConv.Cookie+'_idle']||false) && RCGP.getJQElement().find($('.grcrt_idle')).length == 0 && RCGP.getJQElement().find($('.gp_player_link')).length != 0 ){
            $('<div/>',{'class':'grcrt_idle'}).insertBefore(RCGP.getJQElement().find($('li:not(.reservation_tool)')).find($('.gp_player_link'))),//RCGP.getJQElement().find($('.gp_player_link')))
            addIdleDays(RCGP);//getIdleData(RCGP)
        }
    }
    function showStats(what, who_id, who_name){
        var
            RepConvNode = $('<div/>', {'id': 'RepConvNode'});
        if (RepConv.active.statsGRCL == 'potusek') {
            WF.open("grcrt_stats",{
                args: {
                        'what': what,
                        'id': who_id,
                        'name': who_name
                    }
            })
        }
    }
    function getStatsLink(what, who_id, who_name){
        var website;
        if (RepConv.active.statsGRCL == 'grepointel') {
            if (what == 'player') {
                what = 'pn';
            } else if (what == 'alliance') {
                what = 'an'
            }
            website = 'http://grepointel.com/track.php?server='+Game.world_id+'&'+what+'='+who_name+'&rt=overview';
        } else {
            website = RepConv.Scripts_url + Game.locale_lang + '/' + what +'/' + Game.world_id + '/' + who_id ;
        }
        return website;
    }
    function addTradingSum(RCGP){
        if(
           (RCGP.getContext().sub == 'town_info_trading' || RCGP.getContext().sub == 'wonders_index')
           && RCGP.getJQElement().find($('.amounts .curr4')).length == 0
           ){
            //RCGP.getJQElement().find($('.amounts .curr4')).remove()
            RCGP.getJQElement().find($('.amounts .curr3'))
                .after($('<span/>',{'class':'curr4'}))
                .bind("DOMSubtreeModified",function(){
                    var _parent = $(this).parent();
                    if($(_parent).find($('.curr3')).text().length > 0 || $(_parent).find($('.curr2')).text().length > 0){
                        $(_parent).find($('.curr4')).html(' = '+eval(
                                        $(_parent).find($('.curr')).text()+
                                        $(_parent).find($('.curr2')).text()+
                                        $(_parent).find($('.curr3')).text()
                                        ));
                    } else {
                        $(_parent).find($('.curr4')).html('');
                    }
                });
            if(RCGP.getJQElement().find($('.content div#unit_order_booty')).length == 0){
                RCGP.getJQElement().find($('.content div#duration_container'))
                    .before(
                        $('<div/>',{'id':'unit_order_booty','style':'position: relative;top: -28px;cursor: pointer;'})
                        .click(function(){
                            $('#trade_type_wood input').select().val(Math.floor(ITowns.getTown(Game.townId).getAvailableTradeCapacity()/3)).blur()
                            $('#trade_type_stone input').select().val(Math.floor(ITowns.getTown(Game.townId).getAvailableTradeCapacity()/3)).blur()
                            $('#trade_type_iron input').select().val(Math.floor(ITowns.getTown(Game.townId).getAvailableTradeCapacity()/3)).blur()
                        })
                    )
            }
        }
            $.each(RCGP.getJQElement().find($('.amounts .curr4')), function(ind, elem){
                var _parent = $(elem).parent();
                if($(_parent).find($('.curr3')).text().length > 0 || $(_parent).find($('.curr2')).text().length > 0){
                    $(_parent).find($('.curr4')).html(' = '+eval(
                                    $(_parent).find($('.curr')).text()+
                                    $(_parent).find($('.curr2')).text()+
                                    $(_parent).find($('.curr3')).text()
                                    ));
                } else {
                    $(_parent).find($('.curr4')).html('');
                }
            });
    }

    function gcrWonderSend(RCGP){
        var _trade = MM.checkAndPublishRawModel('Town',{id:Game.townId}).getAvailableTradeCapacity();
        RepConv.Debug && console.log(_trade);
        try{
            wonders[WorldWonders.all_wonders[WorldWonders.wonder_nr].island_x+'_'+WorldWonders.all_wonders[WorldWonders.wonder_nr].island_y] = WorldWonders.wonder_nr;
            if ((RepConv.settings[RepConv.Cookie+'_wonder_trade'])&&(_trade > 0)) {
                WorldWonders.spinners.wood.setValue(_trade/3);
                WorldWonders.spinners.stone.setValue(_trade/3);
                WorldWonders.spinners.iron.setValue(_trade/3);
            }
        } catch (e){}
    }
    
    function posibleSpell(RCGP){
        if (RepConv.active.power) {
            switch (RCGP.getContext().sub) {
                case 'town_info_god':
                case 'command_info_god':
                    RCGP.getJQElement()
                        .find($('.choose_power.disabled'))
                            .css('opacity','0.4')
                            .attr('href',null)
                            .attr('onclick',null);

                    RepConv.Debug && console.log('loadPower');
                    $.each(RCGP.getJQElement().find($('.js-power-icon div[name=counter]')), function(ind, elem) {
                        $(elem).remove();
                    });
                    $.each(RCGP.getJQElement().find($('.js-power-icon.disabled')), function(ind, elem) {
                        var power = GameData.powers[$(elem).attr('data-power_id')],
                        //god = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id}).getCurrentProductionOverview()[power.god_id],
                        god = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id}).getCurrentProductionOverview()[power.god_id];
                        if ((RCGP.getJQElement().find($('.js-god-box.disabled.'+power.god_id)).length==0) && (god.production>0)) {
                            var _godCurr = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id})[power.god_id+'_favor_delta_property'].calculateCurrentValue().unprocessedCurrentValue,
                            marg = 32;
                            //marg += $(elem).hasClass('extendable')?5:0;
                            $(elem).append(
                                $('<div/>',{
                                    'style': 'margin-top:'+marg+'px;color:white;text-shadow: 1px 1px 1px black;font-size:10px;z-index:3000;font-weight: bold;',
                                    'name': 'counter'
                                })
                                .countdown(
                                    (Timestamp.server() + (((power.favor - _godCurr) / god.production) * 60 * 60))
                                )
                            )
                        }
                    });
                    break;
            }
        }
    }

    this.spellCountDownRefresh = function(){
        $.each(GPWindowMgr.getAllOpen(), function(ind, wnd){
            var _couter = CM.get({main : wnd.getID(), sub:"casted_powers"},'grcrt_countdown');
            if (_couter) {
                var
                    _parent = $(_couter).parent(),
                    power_id = $(_parent).attr('data-power_id'),
                    _god = $(_parent).attr('rel'),
                    power = GameData.powers[power_id],
                    god = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id}).getCurrentProductionOverview()[_god],
                    _godCurr = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id})[_god+'_favor_delta_property'].calculateCurrentValue().unprocessedCurrentValue;
                _couter.setValue((((power.favor - _godCurr/*god.current*/) / god.production) * 60 * 60));
            }
        })
    }

    function convertBTNAcademy(wnd){ // akademia
        var _content = $('#window_'+wnd.getIdentifier()).find('div.window_content');
        if ((_content).find($('#BTNCONV'+wnd.getIdentifier())).length == 0) {
            (_content)
                .append(
                    (RepConvTool.AddBtn('BTNCONV', wnd.getIdentifier())).click(function() {
                        RepConv.Debug && console.log(wnd.getType()+' [id:'+wnd.getIdentifier()+']');
                        window.GRCRTConvWnd = new _GRCRTConverterCtrl(wnd);
                    })
                    .css({'position': 'absolute', 'bottom': '15px', 'right': '15px'})
                )
        }
    }

    function convertBTNMain(RCGP){ // senat
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
        if ((RCGP.getJQElement()).find($('#BTNCONV' + WndName)).length == 0 && 2<1) {
            (RepConvTool.AddBtn('BTNCONV', WndName))
                .css({
                    'position': 'absolute',
                    'right': '20px',
                    'bottom': '30px'
                })
                .click(function() {
                    window.GRCRTConvWnd = new _GRCRTConverterCtrl(RCGP);
                })
                .insertAfter(WndId + ' #main_tasks');
        }
    }

    function convertBTNAgoraNew(wnd){ // przyciski dla nowego placu
        var _content = $('#window_'+wnd.getIdentifier()).find('div.window_content');
        if ((_content).find($('#BTNCONV'+wnd.getIdentifier())).length == 0) {
            (_content).find('div.buttons_bar')
                .append(
                    (RepConvTool.AddBtn('BTNCONV', wnd.getIdentifier())).click(function() {
                        RepConv.Debug && console.log(wnd.getType()+' [id:'+wnd.getIdentifier()+']');
                        window.GRCRTConvWnd = new _GRCRTConverterCtrl(wnd);
                    })
                    .css({'float': 'right'})
                )
        }
    }

    this.settings = function(){
        var
            result  = $('<div/>', {'style': 'padding: 5px'}),
            // resChk = $('<fieldset/>', {'style': 'float:left; width:375px; min-height: 250px;'}),
            // resEmo = $('<fieldset/>', {'style': 'float:right; width:370px; min-height: 250px;'})
            resChk  = $('<div/>',{'class':'game_list js-scrollbar-content', 'style':'width: 365px;'}),
            resChkP = $('<fieldset/>', {'style': 'float:left; width:375px; min-height: 250px; position: relative;'})
                .append(
                    $('<legend/>').html('GRCRTools '+RepConvTool.GetLabel('HELPTAB4'))
                )
                .append(
                    $('<div/>', {'style': 'width:375px; min-height: 235px; position: relative; overflow: hidden;', 'class':'js-scrollbar-viewport'})
                        .append(resChk)
                ),
            resEmo = $('<fieldset/>', {'style': 'float:right; width:370px; min-height: 250px;'})

        var chbx = {}
        $.each(RepConv.sChbxs, function(opt, optData){
            chbx[opt] = genCheckBox(opt, RepConv.settings[opt], optData.label)
        })

            // cPower = genCheckBox(RepConv.CookiePower, RepConv.active.power, 'CHKPOWERNAME'),
            // cFTabs = genCheckBox(RepConv.CookieForumTabs, RepConv.active.ftabs, 'CHKFORUMTABS'),
            // cUCost = genCheckBox(RepConv.CookieUnitsCost, RepConv.active.unitsCost, 'CHKUNITSCOST'),
            // cOcean = genCheckBox(RepConv.CookieOceanNumber, RepConv.active.oceanNumber, 'CHKOCEANNUMBER'),
            // cRForm = genCheckBox(RepConv.CookieReportFormat, RepConv.active.reportFormat, 'CHKREPORTFORMAT'),
            // cIdle  = genCheckBox(RepConv.Cookie+'_idle', RepConv.settings[RepConv.Cookie+'_idle'], 'STATS.CHKINACTIVE'),
            // cWTrad = genCheckBox(RepConv.Cookie+'_wonder_trade', RepConv.settings[RepConv.Cookie+'_wonder_trade'], 'CHKWONDERTRADE'),
            // cTnPop = genCheckBox(RepConv.Cookie+'_town_popup', RepConv.settings[RepConv.Cookie+'_town_popup'], 'CHKTOWNPOPUP'),
            // cbTacl = genCheckBox(RepConv.Cookie+'_tacl', RepConv.settings[RepConv.Cookie+'_tacl'], 'CHKTACL'),
            // cbMCol = genCheckBox(RepConv.Cookie+'_mcol', RepConv.settings[RepConv.Cookie+'_mcol'], 'CHKMCOL'),

            // cbBuPo = genCheckBox(RepConv.Cookie+'_bupo', RepConv.settings[RepConv.Cookie+'_bupo'], 'CHKBUPO'),

        var
            cSLoop = genCheckBox('GRCRTsoundLoop',RepConv.active.sounds.loop, 'CHKSOUNDLOOP'),
            cSMute = genCheckBox('GRCRTsoundMute',RepConv.active.sounds.mute, 'POPSOUNDMUTE'),
            sStats = $('<div/>',{'id':'statsGRC2Sel','class':'dropdown default','style':'margin-left:5px;width: 150px;'})
                .dropdown({
                    list_pos : 'left',
                    value : RepConv.active.statsGRCL,
                    options : [
                        {value: 'potusek', name: 'www.grcrt.net'},
                        {value: 'grepointel', name: "grepointel.com"}
                    ]
                })
        ;
        $.each(chbx, function(name,_chbx){
            $(resChk).append(_chbx)
        })
        $(resChk)
            // .append(cPower)
            // .append(cFTabs)
            // .append(cUCost)
            // .append(cOcean)
            // .append(cRForm )
            // .append(cIdle)
            // //.append(cOTrad)
            // .append(cWTrad)
            // .append(cTnPop)
            // .append(cbTacl)
            // .append(cbMCol)
            // .append(cbBuPo)
            .append(
                $('<div/>', {'style': 'padding: 5px'})
                    .append(
                        $('<label/>', {'for': 'statsGRCL'}).text(RepConvTool.GetLabel('STATSLINK'))
                    )
                    .append(sStats)
            )
        $(resEmo)
            .append(
                $('<legend/>').html(RepConvTool.GetLabel('EMOTS.LABEL'))
            )
            .append(
                $('<div/>').html(RepConvTool.GetLabel('EMOTS.MESS'))
            )
            .append(
                $('<textarea/>',{'id':'GRCRTEmots','style':'width: 360px; min-height: 200px;'})
                    .val(RepConvTool.getItem(RepConv.CookieEmots))
                    //.attr('value',RepConvTool.getItem(RepConv.CookieEmots))
            )
        $(result).append($(resChkP));
        $(result).append($(resEmo));
        $(result).append($('<br/>',{'style':'clear: both;'}));
        if (RepConv.audioSupport){
            //$(result).append($('<div/>',{'id':'grcrtVideoContainerTest'}));
            //grcrtYTPlayerTest = new YT.Player('grcrtVideoContainerTest', {
            //                        height: '390',
            //                        width: '640',
            //                        //videoId: 'Hrph2EW9VjY',
            //                        events: {
            //                          onError: onGrcrtYTPlayerError
            //                        }
            //                    });
            $(result)
                .append(
                    $('<fieldset/>',{'id':'GRCRT_Sounds'})
                        .append($('<legend/>').html(RepConvTool.GetLabel('SOUNDSETTINGS')))
                        .append(RepConvForm.soundSlider({'name':'sound','volume':RepConv.active.sounds.volume}))
                        .append(
                            cSLoop
                                .css({'float':'left', 'padding':'6px'})
                                .mousePopup(new MousePopup(RepConvTool.GetLabel('POPSOUNDLOOP')))
                        )
                        .append(
                            cSMute
                                .css({'float':'left', 'padding':'6px'})
                                .mousePopup(new MousePopup(RepConvTool.GetLabel('POPSOUNDMUTE')))
                        )
                        .append(
                            $('<img/>',{'id':'grcrt_play','src':RepConv.grcrt_cdn+'ui/button-play-4.png','style':'float:right;'})
                                .click(function(){
                                    //if ((RepConv.audio.test == undefined) || (RepConv.audio.test.ended) || (RepConv.audio.test.paused)){
                                    if ($('#grcrt_stop:hidden').length == 1) {
                                        _ytVideoIdTest =null;
                                        $('#grcrt_play').toggle();
                                        $('#grcrt_stop').toggle();
                                        var _aSound = $('<audio/>',{'preload':'auto'})
                                        if ($('#grcrt_sound_url').val()/*.attr('value')*/!='') {
                                            _ytVideoIdTest = (
                                                $('#grcrt_sound_url').val().indexOf('youtube')>-1 &&
                                                $('#grcrt_sound_url').val().replace(/.*v=(.[^&]*)/,'$1')
                                                ||
                                                $('#grcrt_sound_url').val().indexOf('youtu.be')>-1 &&
                                                $('#grcrt_sound_url').val().replace(/.*youtu.be\/(.[^?]*)/,'$1')
                                            );
                                            $(_aSound).append($('<source/>',{'src':$('#grcrt_sound_url').val()/*.attr('value')*/}))
                                        } else {
                                            $(_aSound)
                                                .append($('<source/>',{'src':RepConv.Const.defAlarmM+'.mp3'}))
                                                .append($('<source/>',{'src':RepConv.Const.defAlarmM+'.ogg'}))
                                        }
                                        if (_ytVideoIdTest == null || !_ytVideoIdTest) {
                                            RepConv.audio.test = _aSound.get(0);
                                            RepConv.audio.test.addEventListener("ended",function() {
                                                $('#grcrt_play').toggle(),
                                                $('#grcrt_stop').toggle();
                                            }),
                                            RepConv.audio.test.volume = RepConv.slider.getValue()/100,
                                            RepConv.audio.test.loop = false,
                                            RepConv.audio.test.play();
                                        } else {
                                            RepConv.Debug && console.log('ładuje '+_ytVideoIdTest);
                                            grcrtYTPlayerTest.loadVideoById({
                                                videoId:_ytVideoIdTest,
                                                events:{
                                                    onError: onGrcrtYTPlayerErrorTest,
                                                    onStateChange: onGrcrtYTPlayerStateChangeTest,
                                                    onReady: onGrcrtYTPlayerReadyTest
                                                }
                                            })
                                            .setVolume(RepConv.slider.getValue());
                                        }


                                    }
                                })
                                .mousePopup(new MousePopup(RepConvTool.GetLabel('POPSOUNDPLAY')))
                        )
                        .append(
                            $('<img/>',{'id':'grcrt_stop','src':RepConv.grcrt_cdn+'ui/button-stop-4.png','style':'float:right;'})
                                .hide()
                                .click(function(){
                                    //if ((RepConv.audio.test != undefined) || !(RepConv.audio.test.ended)){
                                    if (_ytVideoIdTest == null || !_ytVideoIdTest) {
                                        RepConv.audio.test.pause(),
                                        RepConv.audio.test.currentTime=0;
                                    } else {
                                        grcrtYTPlayerTest.stopVideo()
                                    }
                                    $('#grcrt_play').toggle();
                                    $('#grcrt_stop').toggle();
                                })
                                .mousePopup(new MousePopup(RepConvTool.GetLabel('POPSOUNDSTOP')))
                        )
                        .append($('<br/>', {'style': 'clear:both'}))
                        .append($('<div/>',{'style':'float:left;width:120px;'}).html(RepConvTool.GetLabel('SOUNDURL')))
                        .append(
                            RepConvForm.input({'name':'grcrt_sound_url', 'style':'float:left;width:600px;', 'value':RepConv.active.sounds.url})
                            .mousePopup(new MousePopup(RepConvTool.GetLabel('POPSOUNDURL')))
                        )
                        .append($('<div/>',{'style':'float:left;width:120px;'}).html("&nbsp;"))
                        .append($('<div/>',{'style':'float:left;width: 635px;font-size: 11px;font-style: italic;max-height: 27px;'}).html(RepConvTool.GetLabel('POPSOUNDEG')))
                )
        }
        $(result)
            .append(
                (RepConvTool.AddBtn('BTNSAVE')).click(function() {
                    try {
                        $.each(chbx, function(name,_chbx){
                            RepConv.settings[name] = _chbx.isChecked() ? !0 : !1
                        })
                        // RepConv.settings[RepConv.CookiePower] = cPower.isChecked() ? !0 : !1,
                        // RepConv.settings[RepConv.CookieForumTabs] = cFTabs.isChecked() ? !0 : !1,
                        // RepConv.settings[RepConv.CookieUnitsCost] = cUCost.isChecked() ? !0 : !1,
                        // RepConv.settings[RepConv.CookieOceanNumber] = cOcean.isChecked() ? !0 : !1,
                        // RepConv.settings[RepConv.Cookie+'_idle'] = cIdle.isChecked() ? !0 : !1,
                        // RepConv.settings[RepConv.Cookie+'_trade'] = cOTrad.isChecked() ? !0 : !1,
                        // RepConv.settings[RepConv.Cookie+'_wonder_trade'] = cWTrad.isChecked() ? !0 : !1,
                        // RepConv.settings[RepConv.Cookie+'_town_popup'] = cTnPop.isChecked() ? !0 : !1,
                        // RepConv.settings[RepConv.Cookie+'_tacl'] = cbTacl.isChecked() ? !0 : !1,
                        // RepConv.settings[RepConv.Cookie+'_mcol'] = cbMCol.isChecked() ? !0 : !1,
                        // RepConv.settings[RepConv.Cookie+'_bupo'] = cbBuPo.isChecked() ? !0 : !1,
                        // RepConv.settings[RepConv.CookieReportFormat] = cRForm.isChecked() ? !0 : !1,
                        RepConv.settings[RepConv.CookieStatsGRCL] = sStats.getValue(),
                        RepConv.settings[RepConv.CookieEmots] = $('#GRCRTEmots').val();//$('#GRCRTEmots').attr('value');

                        if (RepConv.audioSupport){
                            RepConv.settings[RepConv.CookieSounds] = {
                                mute : cSMute.isChecked() ? !0 : !1,
                                loop : cSLoop.isChecked() ? !0 : !1,
                                volume : RepConv.slider.getValue(),
                                url : $('#grcrt_sound_url').val()//.attr('value')
                            }

                            var _aSound = $('<audio/>',{'preload':'auto'})
                            if (RepConv.settings[RepConv.CookieSounds].url!='') {
                                $(_aSound).append($('<source/>',{'src':RepConv.settings[RepConv.CookieSounds].url}))
                            } else {
                                $(_aSound)
                                    .append($('<source/>',{'src':RepConv.Const.defAlarmM+'.mp3'}))
                                    .append($('<source/>',{'src':RepConv.Const.defAlarmM+'.ogg'}))
                            }
                            RepConv.audio.alarm = _aSound.get(0);
                        }                       
                        // TODO
                        RepConv.active.power = RepConvTool.getSettings(RepConv.CookiePower),
                        RepConv.active.ftabs = RepConvTool.getSettings(RepConv.CookieForumTabs),
                        RepConv.active.statsGRCL = RepConvTool.getSettings(RepConv.CookieStatsGRCL),
                        RepConv.active.unitsCost = RepConvTool.getSettings(RepConv.CookieUnitsCost),
                        RepConv.active.oceanNumber = RepConvTool.getSettings(RepConv.CookieOceanNumber),
                        RepConv.active.reportFormat = RepConvTool.getSettings(RepConv.CookieReportFormat),
                        RepConv.active.sounds = RepConvTool.getSettings(RepConv.CookieSounds);

                        RepConvTool.saveRemote(),
/*
                        $.each(chckboxs, function(ind, elem) {
                            if(elem.rel != 'statsGRCL'){
                                RepConv.active[elem.rel] = ($('#' + elem.name).attr('checked') != null);
                            } else {
                                RepConv.active[elem.rel] = ($('#statsGRCL').attr('value') == "on") ? RepConv.active.statsGRCL : $('#' + elem.name).attr('value');
                            }
                            RepConvTool.setItem(elem.cookie, RepConv.active[elem.rel]);
                        });
            // emotki           
            RepConvTool.setItem(RepConv.CookieEmots, $('#GRCRTEmots').attr('value'));
            var _posEmot = 0;
            RepConvAdds.emots = {}
            $.each(RepConvAdds.emotsDef, function(ind,emot){
                RepConvAdds.emots[_posEmot++] = emot
            })
            $.each(RepConvTool.getItem(RepConv.CookieEmots).split('\n'), function(ind,elem){
                RepConvAdds.emots[_posEmot++] = {'img':elem,'title':''};
            })
            // /emotki
            
            if (RepConv.audioSupport){
                            RepConv.active.sounds.mute = ($('#CHKSOUNDMUTE').attr('checked') != null),
                            RepConv.active.sounds.loop = ($('#CHKSOUNDLOOP').attr('checked') != null),
                            RepConv.active.sounds.volume = RepConv.slider.getValue(),//parseInt($('#grcrt_sound_value').attr('value'));
                            RepConv.active.sounds.url = $('#grcrt_sound_url').attr('value'),
                            RepConvTool.setItem(RepConv.CookieSounds, RepConv.active.sounds);

                            var _aSound = $('<audio/>',{'preload':'auto'})
                            if (RepConv.active.sounds.url!='') {
                                $(_aSound).append($('<source/>',{'src':RepConv.active.sounds.url}))
                            } else {
                                $(_aSound)
                                    .append($('<source/>',{'src':RepConv.Const.defAlarmM+'.mp3'}))
                                    .append($('<source/>',{'src':RepConv.Const.defAlarmM+'.ogg'}))
                            }
                            RepConv.audio.alarm = _aSound.get(0);
            }                       
*/
                        setTimeout(function(){
                            HumanMessage.success(RepConvTool.GetLabel('MSGHUMAN.OK'));
                        },0)
                    } catch (err) {
                        setTimeout(function(){
                            HumanMessage.error(RepConvTool.GetLabel('MSGHUMAN.ERROR'));
                        },0)
                    }
            })
        );
        return result;
    }

    function townPopup(){
        if (RepConv.settings[RepConv.Cookie+'_town_popup']){
            var acc = {}, 
                alliance_name = MM.checkAndPublishRawModel('Player',{id:Game.player_id}).getAllianceName(),
                heroes = MM.getCollections()['PlayerHero'][0], heroArray = {},
                i = DM.getl10n("heroes", "common")
            $.each(heroes.getHeroes(), function(idh, hhero){
                var o = GameData.heroes[hhero.getId()];
                heroArray[hhero.getOriginTownId()] = {
                    id: hhero.getId(),
                    level: hhero.getLevel(), 
                    name: hhero.getName(),
                    category: i.hero_of[o.category],
                    txt_lvl: i.level(hhero.getLevel())
                }
                
            })
            $.each(ITowns.towns, function(ind,town){
                var cc = town;
                cc.points = cc.getPoints(),
                cc.player_name = Game.player_name,
                cc.alliance_name = alliance_name,
                cc.tooltip = new MousePopup(WMap.createTownTooltip('town',cc)),
                cc.grcrt_hero = heroArray[cc.getId()],
                acc[ind]=cc
                
            })
            $.each($('#town_groups_list .item.town_group_town:not(.grcrtPopup)'), function(it,et){
                var cc = acc[$(et).data('townid')];
                // $(et).find($('.town_name')).mousePopup(new MousePopup(WMap.createTownTooltip('town',cc)))
                $(et).find($('.town_name')).mousePopup(cc.tooltip)
                $(et).addClass('grcrtPopup')
                if(cc.grcrt_hero){
                    $(et).prepend('<div class="grcrt_hero hero_icon hero25x25 '+cc.grcrt_hero.id+'"><div class="value">'+cc.grcrt_hero.level+'</div></div>')
                    $(et).find($('.grcrt_hero.hero_icon')).tooltip('<div class="ui_hero_tooltip_small"><div class="icon_border"><div class="icon hero50x50 ' + cc.grcrt_hero.id + '"></div></div><b>' + cc.grcrt_hero.name + '</b><br />' + cc.grcrt_hero.category + '<br /><br /><b>' + cc.grcrt_hero.txt_lvl + '</b><br /></div>')
                }
            })
            
        }
    }

    function emotsTabs(wndType, action){//insertArea){
        var content = $('<div/>', {'class': 'gpwindow_content', 'style': 'overflow-y:auto !important; max-height: 185px; min-height: 120px; top: 44px !important;'}),
            contentLinks = $('<ul/>', {'class':'menu_inner grcrt_menu_inner', 'style':'padding: 0px;left:0px;'}),
            tabs = 
            $('<div/>', {'id': 'emots_popup_' + wndType, 'style': 'display:none; z-index: 5000; min-height: 180px;max-height: 265px;','class':'grcrtbb'})
                .append(
                    $('<div/>', {'class': 'menu_wrapper', 'style':"left: -10px;"})
                        .append(contentLinks)
                )
                .append(
                    $('<div/>', {'class': 'gpwindow_left'})
                )
                .append(
                    $('<div/>', {'class': 'gpwindow_right'})
                )
                .append(
                    $('<div/>', {'class': 'gpwindow_bottom'})
                    .append(
                        $('<div/>', {'class': 'gpwindow_left corner'})
                    )
                    .append(
                        $('<div/>', {'class': 'gpwindow_right corner'})
                    )
                )
                .append(
                    $('<div/>', {'class': 'gpwindow_top'})
                    .append(
                        $('<div/>', {'class': 'gpwindow_left corner'})
                    )
                    .append(
                        $('<div/>', {'class': 'gpwindow_right corner'})
                    )
                )
                .append(content)
                .css({'position': 'absolute', 'top': '22px', 'left': '455px', 'width': '300px'}),

            contentDetail = $('<div/>'),
            first = true;

            $.each(RepConvAdds.emotsLists, function(group,property){
                contentLinks
                    .append(
                        $('<li/>', {'style':'float: left;padding: 0px;'})
                            .append(
                                $('<a/>',{'class':'grcrt_emots submenu_link'+(first?' active':''), 'href':'#n', 'data-group':group})
                                    .append(
                                        $('<span/>', {'class':"left"})
                                            .append(
                                                $('<span/>', {'class':"right"})
                                                    .append(
                                                        $('<span/>', {'class':"middle"})
                                                            .html($('<img/>' ,{'src':RepConv.grcrt_cdn+property.img}))
                                                    )
                                            )
                                    )
                                    .click(function(){
                                        if(!$(this).hasClass('active')){
                                            var group = $(this).data('group');
                                            $('#emots_popup_' + wndType+' a.submenu_link').removeClass('active')
                                            $('#emots_popup_' + wndType+' div.grcrt_emots_detail').hide()
                                            $(this).addClass('active')
                                            $('#emots_popup_' + wndType+' div.grcrt_emots_detail.e'+group).show()
                                        }
                                    })
                            )
                    );
                var tmp = $('<div/>',{'class':'grcrt_emots_detail e'+group,'style':'display:'+(first?'block':'none')});
                $.each(property.detail, function(ind, emots){
                    tmp.append(
                        $('<img/>', {'src': ((group != 'usersaved') ? RepConv.grcrt_cdn : '') +emots.img, 'style':'cursor: pointer;'})
                            .click(
                                action
                            )
                    )
                })
                contentDetail
                    .append(
                        tmp
                    )
                first = false
            })
            content.append(contentDetail)
        return tabs;
    }

    function addBtnPasteReportOld(RCGP, wraper, area) {
        if ((RCGP.getJQElement()).find('#emots_popup_' + RCGP.type).length == 0) {
            // emots
            (RCGP.getJQElement()).find($('.bb_button_wrapper')).append(
                emotsTabs(RCGP.type, 
                    // (RCGP.getJQElement()).find(area)
                    function() {
                        RepConvTool.insertBBcode('[img]' + $(this).attr('src') + '[/img]', '', (RCGP.getJQElement()).find(area)[0]);
                        (RCGP.getJQElement()).find($('#emots_popup_' + RCGP.type)).toggle();
                    }
                )
            ),
            // report pagination
            (RCGP.getJQElement()).find($('.bb_button_wrapper')).append(
                $('<div/>', {'id': 'reports_popup_' + RCGP.getType(), 'class' : 'grcrtbb_reports grcrtbb', 'style': 'display:none; z-index: 5000;'}) /*, 'class' : 'bb_sizes'})*/
                    .append(
                        $('<div/>', {'class': 'bbcode_box middle_center'})
                            .append($('<div/>', {'class': 'bbcode_box top_left'}))
                            .append($('<div/>', {'class': 'bbcode_box top_right'}))
                            .append($('<div/>', {'class': 'bbcode_box top_center'}))
                            .append($('<div/>', {'class': 'bbcode_box bottom_center'}))
                            .append($('<div/>', {'class': 'bbcode_box bottom_right'}))
                            .append($('<div/>', {'class': 'bbcode_box bottom_left'}))
                            .append($('<div/>', {'class': 'bbcode_box middle_left'}))
                            .append($('<div/>', {'class': 'bbcode_box middle_right'}))
                            .append(
                                $('<div/>', {'class': 'bbcode_box content clearfix', 'style': 'overflow-y:auto !important; max-height: 185px;'})
                                    .append($('<ul/>'))
                            )
                            
                    ).css({'position': 'absolute', 'top': '27px', 'left': '525px', 'width': '120px'})
            ),
            $.each(RepConv.__repconvValueArray, function(ind, line) {
                ((RCGP.getJQElement()).find('#reports_popup_' + RCGP.getType() + ' .content ul'))
                    .append(
                        $('<li/>')
                            .append(
                                $('<a/>', {'href':'#n'})
                                    .html('» '+DM.getl10n('COMMON','window_goto_page').page+' '+(ind+1)+'/'+Object.size(RepConv.__repconvValueArray))
                                    .click(function() {
                                        RepConvTool.insertBBcode(repsave(ind)+RepConv.__repconvValueArray[ind], '', (RCGP.getJQElement()).find(area)[0]),
                                        (RCGP.getJQElement()).find($('.grcrtbb')).hide();
                                    })
                            )
                    );
            }),
            // icon paste emot
            (RCGP.getJQElement()).find(wraper).append(
                $('<img/>', {'src': RepConv.Scripts_url + 'emots/usmiech.gif', 'style': 'cursor: pointer;'})
                    .click(function() {
                        (RCGP.getJQElement()).find($('.bb_button_wrapper>div[class^="bb"]')).remove(),
                        (RCGP.getJQElement()).find($('.grcrtbb')).hide(),
                        (RCGP.getJQElement()).find($('#emots_popup_' + RCGP.type)).toggle();
                    })
                    .mousePopup(new MousePopup(RepConvTool.GetLabel('POPINSERTEMOT')))
            ),
            // ikon paste converted report
            (RCGP.getJQElement()).find(wraper).append(
                $('<img/>', {'src': RepConv.Const.uiImg + 'paste_report.png', 'style': 'cursor: pointer;'})
                    .click(function() {
                        (RCGP.getJQElement()).find($('.bb_button_wrapper>div[class^="bb"]')).remove(),
                        (RCGP.getJQElement()).find($('.grcrtbb')).hide();
                        switch (Object.size(RepConv.__repconvValueArray)) {
                            case 0:
                                break;
                            case 1:
                                RepConvTool.insertBBcode(repsave(0)+RepConv.__repconvValueArray[0], '', (RCGP.getJQElement()).find($(area))[0]);
                                break;
                            default:
                                (RCGP.getJQElement()).find($('#reports_popup_' + RCGP.getType())).toggle();
                        }
                    })
                    .mousePopup(new MousePopup(RepConvTool.GetLabel('POPINSERTLASTREPORT')))
            )
        }
    }

    function addBtnPasteReport(wnd){ // notatnik
        $('#window_'+wnd.getIdentifier())
            .unbind("DOMSubtreeModified")
            .bind("DOMSubtreeModified",function(){
                var
                    _btns = $('#window_'+wnd.getIdentifier()).find($('div.bb_button_wrapper')),
                    _content = $('#window_'+wnd.getIdentifier()).find($('div.notes_container'));
                if (_btns.length > 0) {
                    if ($('#window_'+wnd.getIdentifier()).find($('div.notes_container #emots_popup_' + wnd.getType())).length == 0) {
                        $('#window_'+wnd.getIdentifier())
                            .unbind("DOMSubtreeModified"),
                        $(_btns).find($('.bbcode_option')).bind('click',function(){
                            $(_btns).find($('#emots_popup_' + wnd.getType())).hide()
                            $(_btns).find($('#reports_popup_' + wnd.getType())).hide()
                        }),
                        $(_btns).append(
                            emotsTabs(wnd.getType(), 
                                // $(_content).find($('textarea'))[0]
                                function(){
                                    RepConvTool.insertBBcode('[img]' + $(this).attr('src') + '[/img]', '', $(_content).find($('textarea'))[0]),
                                    $(_content).find($('textarea')).keyup(),
                                    $(_btns).find($('#emots_popup_' + wnd.getType())).toggle();
                                }

                            )
                        ),

                        $(_btns)
                            .append(
                                $('<div/>', {'id': 'reports_popup_' + wnd.getType(), 'class' : 'grcrtbb_reports grcrtbb', 'style': 'display:none; z-index: 5000;'}) /*, 'class' : 'bb_sizes'})*/
                                    .append(
                                        $('<div/>', {'class': 'bbcode_box middle_center'})
                                            .append($('<div/>', {'class': 'bbcode_box top_left'}))
                                            .append($('<div/>', {'class': 'bbcode_box top_right'}))
                                            .append($('<div/>', {'class': 'bbcode_box top_center'}))
                                            .append($('<div/>', {'class': 'bbcode_box bottom_center'}))
                                            .append($('<div/>', {'class': 'bbcode_box bottom_right'}))
                                            .append($('<div/>', {'class': 'bbcode_box bottom_left'}))
                                            .append($('<div/>', {'class': 'bbcode_box middle_left'}))
                                            .append($('<div/>', {'class': 'bbcode_box middle_right'}))
                                            .append(
                                                $('<div/>', {'class': 'bbcode_box content clearfix', 'style': 'overflow-y:auto !important; max-height: 185px;'})
                                                    .append($('<ul/>'))
                                            )
                                            
                                    ).css({'position': 'absolute', 'top': '27px', 'left': '525px', 'width': '120px'})
                            ),
                        $.each(RepConv.__repconvValueArray, function(ind, line) {
                            ($(_btns).find('#reports_popup_' + wnd.getType() + ' .content ul'))
                                .append(
                                    $('<li/>')
                                        .append(
                                            $('<a/>', {'href':'#n'})
                                                .html('» '+DM.getl10n('COMMON','window_goto_page').page+' '+(ind+1)+'/'+Object.size(RepConv.__repconvValueArray))
                                                .click(function() {
//console.log('pastor 1');
                                                    RepConvTool.insertBBcode(repsave(ind)+RepConv.__repconvValueArray[ind], '', $(_content).find($('textarea'))[0]),
                                                    $(_content).find($('textarea')).keyup(),
                                                    $(_btns).find($('.grcrtbb_reports')).hide();
                                                })
                                        )
                                );
                        }),
                        $(_btns)
                            .append(
                                $('<img/>', {'src': RepConv.Scripts_url + 'emots/usmiech.gif', 'style': 'cursor: pointer;'})
                                    .click(function() {
                                        $(_btns).find($('.bb_button_wrapper>div[class^="bb"]')).remove(),
                                        $(_btns).find($('.grcrtbb_reports')).hide(),
                                        $(_btns).find($('#emots_popup_' + wnd.getType())).toggle();
                                    })
                            )
                            .append(
                                $('<img/>', {'src': RepConv.Const.uiImg + 'paste_report.png', 'style': 'cursor: pointer;'})
                                    .click(function() {
                                        $(_btns).find($('.bb_button_wrapper>div[class^="bb"]')).remove(),
                                        $(_btns).find($('.grcrtbb_emots')).hide();
                                        switch (Object.size(RepConv.__repconvValueArray)) {
                                            case 0:
                                                break;
                                            case 1:
//console.log('pastor 2');
                                                RepConvTool.insertBBcode(repsave(0)+RepConv.__repconvValueArray[0], '', $(_content).find($('textarea'))[0]),
                                                $(_content).find($('textarea')).keyup();
                                                break;
                                            default:
                                                $(_btns).find($('#reports_popup_' + wnd.getType())).toggle();
                                        }
                                    })
                                    .mousePopup(new MousePopup(RepConvTool.GetLabel('POPINSERTLASTREPORT')))
                            ),
                        addBtnPasteReport(wnd)
                    }
                }
            });
    }
    function addBtnOlympusTempleInfo(wnd){
        $('#window_'+wnd.getIdentifier()).ready(function(){
            if($('#window_'+wnd.getIdentifier()).find($('#BTNCONV'+wnd.getIdentifier())).length == 0){
                (RepConvTool.AddBtn('BTNCONV', wnd.getIdentifier())).click(function() {
                    window.GRCRTConvWnd = new _GRCRTConverterCtrl(wnd);
                })
                .css({'top':'56px','right':'40px'})
                .insertBefore($('#window_'+wnd.getIdentifier()).find('.temple_image_wrapper'))
            }
        })
    }

    function addBtnCloseFarm(wnd){
        $('#window_'+wnd.getIdentifier()).ready(function(){
            $('#window_'+wnd.getIdentifier())
                .find($('.farm_towns .card_click_area'))
                    .on('click', function(){
                        $(this).closest('.classic_window').find($('.btn_wnd.close')).click()
                    })
        })
    }
    
    function repsave(idx) {
        if(RepConv.__repconvHtmlArray != null && RepConv.__repconvHtmlArray != undefined){
            var _send =
                $.ajax({
                    'url' : 'https://www.grcrt.net/repsave.php',
                    'method' : 'post',
                    'data' : {html:RepConv.__repconvHtmlArray[idx]},
                    'cache':false,
                    'async':false
                });
            return "[url=https://www.grcrt.net/repview.php?rep="+_send.responseJSON.filename+"]"+RepConvTool.GetLabel('MOBILEVERSION')+"[/url]\n\n";
        }
        return '';
    }

    function customFarmWindow(RCGP){
        (RCGP.getJQElement()).find($('#fto_town_list li')).attr('style', 'border-right:0px');// solid #D0BE97');
        (RCGP.getJQElement()).find($('#fto_town_list li.town' + Game.townId)).attr('style', 'border-right: 5px solid green');
        if (((RCGP.getJQElement()).find($('#fto_town_list li.town' + Game.townId + '.active'))).length == 0 && RepConv.currTown != Game.townId) {
            RepConv.currTown = Game.townId;
            ((RCGP.getJQElement()).find($('#fto_town_list li.town' + Game.townId))).click();
        }
    }

    function showTimeInTooltip(power_id){
        if (RepConv.active.power) {
            var _power = GameData.powers[power_id];
            setTimeout(function(){
                try{
                    var
                        _god = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id}).getCurrentProductionOverview()[_power.god_id],
                        _godCurr = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id})[_power.god_id+'_favor_delta_property'].calculateCurrentValue().unprocessedCurrentValue,
                        _coundown = (Timestamp.server() + (((_power.favor - _godCurr/*_god.current*/) / _god.production) * 60 * 60)),
                        marg =27;
                    $('#popup_content div#grcrt_pop_ads').remove();
                    //$('div.gods_area .god_container div.new_ui_power_icon[data-power_id='+_power.id+'] div[name=counter]').remove();
                    if((_power.favor - _god.current) > 0 && _god.production > 0){
                        $('#popup_content div.temple_power_popup')
                            .append(
                                $('<div/>',{'name': 'counter', 'id' : 'grcrt_pop_ads'})
                                    .css({'margin':'70px 10px 0 0','float':'right', 'text-shadow': '2px 2px 2px white','color':'black','font-weight':'bold','position':'absolute','top':'20px','right':'270px'})
                                    .countdown(_coundown)
                            )
                    }
                }catch(err){}
            },100)
        }
    }

    function getIdleData(){//RCGP){
        if ((RepConv.settings[RepConv.Cookie+'_idle']||false) && stopCount < 10) {
            if (!(RepConvGRC.idle) || (RepConvGRC.idle.time)+idleTimeout < Timestamp.server()) {
                RepConv.Debug && console.log('getIdleData - fetch');
                $.ajax({
                    url:'https://www.grcrt.net/json.php',
                    method:'get',
                    data : {'method':'getIdleJSON','world':Game.world_id},
                    cache: true
                })
                .done(function(json) {
                    stopCount = 0;
                    RepConvGRC.idle = json;
                    RepConvGRC.idle.time = Timestamp.server();
                })
                .fail(function(){
                    stopCount++;
                });
            }
            RepConv.Debug && console.log('getIdleData');
        }
    }

    function addIdleDays(RCGP){
        $.each(RCGP.getJQElement().find($('.grcrt_idle')), function(ind, elem){
            var
                __tmp = ((RCGP.getContext().sub == "player_get_profile_html") 
                    ? 
                        btoa(JSON.stringify({id:RCGP.getOptions().player_id})) 
                    : 
                        $(elem).nextAll('.gp_player_link').attr('href')).split(/#/),
                _player = (RCGP.getType() == Layout.wnd.TYPE_PLAYER_PROFILE_EDIT) 
                    ? Game.player_id 
                    : 
                        (RCGP.getContext().sub == "player_get_profile_html") 
                            ? 
                                /*((RepConv.requests.player && RepConv.requests.player.url) ? JSON.parse(unescape(RepConv.requests.player.url).match(/({.*})/)[0]).player_id : RCGP.getOptions().player_id)*/
                                RepConvTool.getPlayerId4Name(RCGP.getJQElement().find($('#write_message_form input[name="recipients"]')).val())
                            : JSON.parse(atob(__tmp[1] || __tmp[0])).id,
                _days = parseFloat(RepConvGRC.idle.JSON[_player]||'-1');
            $(elem).addClass('grcrt_idle_days'),
            $(elem).addClass('grcrt_idle_dg'),
            $(elem).html((parseInt(_days)<0)?"?":parseInt(_days)),
//            $(elem).attr('title',_days)
            $(elem).mousePopup(
                new MousePopup('<b>'+RepConvTool.GetLabel('STATS.INACTIVE')+
                               ': </b>'+(((parseInt(_days)<0)?"???":hours_minutes_seconds(parseInt(_days*24)*60*60)||'0'))+
                               '<br/><div style="font-size:75%">'+RepConvTool.GetLabel('STATS.INACTIVEDESC')+'</div>')
            );
            if (_days >= 7) {
                $(elem).toggleClass('grcrt_idle_dg grcrt_idle_dr')
            } else if (_days >= 2) {
                $(elem).toggleClass('grcrt_idle_dg grcrt_idle_dy')
            }
        })
    }
    
    function addMilitiaInfo(RCGP){
        (
            RCGP.getJQElement().find($('#farm_militia .game_footer #grcrt_militia')).length == 0 &&
            RCGP.getJQElement().find($('#farm_militia .game_footer #request_militia_button')).is(":visible") &&
            RCGP.getJQElement().find($('#farm_militia .game_footer #request_militia_button'))
                .before(
                    $('<div/>',{'class':'index_unit unit_icon40x40 militia','id':'grcrt_militia'})
                        .append(
                            $('<div/>',{'class':'value'})
                                .html(
                                    Math.min(MM.getCollections().Town[0].getCurrentTown().getBuildings().getBuildingLevel('farm'),25)*(MM.getCollections().Town[0].getCurrentTown().getResearches().get('town_guard')?15:10)
                                )
                                .css({
                                    'text-align': 'right',
                                    'font-family': 'Verdana',
                                    'font-weight': '700',
                                    'font-size': '12px',
                                    'margin': '1px',
                                    'color': '#fff',
                                    'text-shadow': '1px 1px 0 #000',
                                    'position':'absolute',
                                    'bottom':'1px',
                                    'right':'1px'
                                })
                        )
                ) &&
            RCGP.getJQElement().find($('#farm_militia .game_footer')).height(44)
        )
    }

    function colorizeMessageList(RCGP){
        var __ally = {}, what;
        if(RepConv.settings[RepConv.Cookie+'_mcol']){
            __ally[Game.alliance_id]='OWN_ALLIANCE';
            $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(ii,ee){
                if(!ee.getInvitationPending()){
                    switch (ee.getRelation()){
                        case "war":
                            what = "ENEMY";
                            break;
                        case "peace":
                            what = "PACT";
                            break;
                    }
                    __ally[(ee.getAlliance1Id() == Game.alliance_id) ? ee.getAlliance2Id() : ee.getAlliance1Id()] = what
                }
            })
    
            $.each(RCGP.getJQElement().find($('a.gp_player_link')), function(ii, item){
                var hash = $(item).attr('href')
                if(hash){
                    var _color = RepConvTool.getPlayerColor(hash,__ally);
                    if(_color){
            //          $(item).closest('li.message_item').css('border-left','10px solid #'+_color)
                        var _style = [
                            'background: '+RepConvTool.hexToRGB('#'+_color,0.4),
                            'background: -webkit-linear-gradient(left,'+RepConvTool.hexToRGB('#'+_color,0.1)+','+RepConvTool.hexToRGB('#'+_color,0.5)+')',
                            'background: -o-linear-gradient(right,'+RepConvTool.hexToRGB('#'+_color,0.1)+','+RepConvTool.hexToRGB('#'+_color,0.5)+')',
                            'background: -moz-linear-gradient(right,'+RepConvTool.hexToRGB('#'+_color,0.1)+','+RepConvTool.hexToRGB('#'+_color,0.5)+')',
                            'background: linear-gradient(to right,'+RepConvTool.hexToRGB('#'+_color,0.1)+','+RepConvTool.hexToRGB('#'+_color,0.5)+')'
                        ].join(';');
                        $(item).closest('li.message_item').attr('style',_style);
                        // .css({
                        //     'background': hexToRGB('#'+_color,0.4),
                        //     'background': '-webkit-linear-gradient(left,'+hexToRGB('#'+_color,0.1)+','+hexToRGB('#'+_color,0.5)+')',
                        //     'background': '-o-linear-gradient(right,'+hexToRGB('#'+_color,0.1)+','+hexToRGB('#'+_color,0.5)+')',
                        //     'background': '-moz-linear-gradient(right,'+hexToRGB('#'+_color,0.1)+','+hexToRGB('#'+_color,0.5)+')',
                        //     'background': 'linear-gradient(to right,'+hexToRGB('#'+_color,0.1)+','+hexToRGB('#'+_color,0.5)+')'
                        // })
                    }
                }
            })
        }
    }

    function colorizeMessageView(RCGP){
        var __ally = {}, what;
        if(RepConv.settings[RepConv.Cookie+'_mcol']){
            __ally[Game.alliance_id]='OWN_ALLIANCE';
            $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(ii,ee){
                if(!ee.getInvitationPending()){
                    switch (ee.getRelation()){
                        case "war":
                            what = "ENEMY";
                            break;
                        case "peace":
                            what = "PACT";
                            break;
                    }
                    __ally[(ee.getAlliance1Id() == Game.alliance_id) ? ee.getAlliance2Id() : ee.getAlliance1Id()] = what
                }
            })

            $.each(RCGP.getJQElement().find($('.message_poster a.gp_player_link')), function(ii, item){
                var hash = $(item).attr('href')
                if(hash){
                    var _color = RepConvTool.getPlayerColor(hash,__ally);
                    if(_color){
            //          $(item).closest('li.message_item').css('border-left','10px solid #'+_color)
                        var _style = [
                            'background: '+RepConvTool.hexToRGB('#'+_color,0.4),
                            'background: -webkit-linear-gradient(left,'+RepConvTool.hexToRGB('#'+_color,0.1)+','+RepConvTool.hexToRGB('#'+_color,0.5)+')',
                            'background: -o-linear-gradient(right,'+RepConvTool.hexToRGB('#'+_color,0.1)+','+RepConvTool.hexToRGB('#'+_color,0.5)+')',
                            'background: -moz-linear-gradient(right,'+RepConvTool.hexToRGB('#'+_color,0.1)+','+RepConvTool.hexToRGB('#'+_color,0.5)+')',
                            'background: linear-gradient(to right,'+RepConvTool.hexToRGB('#'+_color,0.1)+','+RepConvTool.hexToRGB('#'+_color,0.5)+')'
                        ].join(';');
                        $(item).closest('.message_poster').attr('style',_style);
                        // .css({
                        //     'background': hexToRGB('#'+_color,0.4),
                        //     'background': '-webkit-linear-gradient(left,'+hexToRGB('#'+_color,0.1)+','+hexToRGB('#'+_color,0.5)+')',
                        //     'background': '-o-linear-gradient(right,'+hexToRGB('#'+_color,0.1)+','+hexToRGB('#'+_color,0.5)+')',
                        //     'background': '-moz-linear-gradient(right,'+hexToRGB('#'+_color,0.1)+','+hexToRGB('#'+_color,0.5)+')',
                        //     'background': 'linear-gradient(to right,'+hexToRGB('#'+_color,0.1)+','+hexToRGB('#'+_color,0.5)+')'
                        // })
                    }
                }
            })
        }
    }

    /* Wonder shots */
    function secFromTime(_time_text){
        var _time_array = _time_text.split(/:/);
        return Number(_time_array[0])*60*60+Number(_time_array[1])*60+Number(_time_array[2])
    }

    function getWonderReq(){
        var _res = null
        $.each(decodeURIComponent(RepConv.requests.wonders.url).split(/&/), function(ii, par){
            if(par.indexOf('json=')>-1){
                _res = JSON.parse(par.split('json=')[1])
            }
        })
        return _res
    }

    function getWonderDet(){
        var _res = null, _wonderInf = getWonderReq(), _resData = JSON.parse(RepConv.requests.wonders.responseText).json.data;
        $.each(_resData.all_wonders, function(ii, wonder){
            if(wonder.island_x == _wonderInf.island_x && wonder.island_y == _wonderInf.island_y){
                _res = wonder;
                var 
                    _ts = _resData.stage_started_at,
                    _tkn = _resData.stage_started_at+secFromTime(_wnd_lvl[_res.expansion_stage].total),
                    _tkk = _resData.stage_completed_at,
                    _mSh = ((_tkn-_ts)/secFromTime(_wnd_lvl[_res.expansion_stage].reduc))/2,
                    _uSh = ((_tkn-_tkk)/secFromTime(_wnd_lvl[_res.expansion_stage].reduc)),
                    _lSh = ((_tkk-_resData.today)/secFromTime(_wnd_lvl[_res.expansion_stage].reduc));
                _res.shot_max = Math.min(Math.ceil(_lSh) ,Math.floor(_mSh-_uSh));// Math.min(_res.shot_max
            }
        })
        return _res;
    }


    var _wnd_lvl = {
        0 : { total: "01:57:00", reduc: "00:01:40"},
        1 : { total: "03:57:00", reduc: "00:02:30"},
        2 : { total: "07:37:00", reduc: "00:03:20"},
        3 : { total: "13:07:00", reduc: "00:04:10"},
        4 : { total: "20:33:00", reduc: "00:05:00"},
        5 : { total: "30:00:00", reduc: "00:05:50"},
        6 : { total: "41:34:00", reduc: "00:06:40"},
        7 : { total: "55:17:00", reduc: "00:07:30"},
        8 : { total: "71:13:00", reduc: "00:08:20"},
        9 : { total: "89:26:00", reduc: "00:09:10"}
    }

    function wonderShots(RCGP){
        try{
            if(RCGP.getJQElement().find($('.send_res>.single-progressbar.time-indicator')).length>0){
                var _wonderDet = getWonderDet(), _shotTime = 0;
                $.each(MM.checkAndPublishRawModel('PlayerGods',{id:Game.player_id}).getCurrentProductionOverview(), function(god, goddetail){
                  _shotTime = Math.max(_shotTime,((400-goddetail.current)/goddetail.production)*60*60)
                })

                
                RCGP.getJQElement().find($('.wonder_res_container>.trade>.send_res>.grcrt_shot')).remove()
                RCGP.getJQElement().find($('.wonder_res_container>.trade>.send_res')).append(
                    $('<div/>', {'class':'grcrt_shot', 'style':'position: absolute; right: 110px; top: 165px;'})
                        .append(
                            $('<div/>', {'class':'gods_favor_button_area', 'style':'left:0px; top:0px;'})
                                .append(
                                    $('<div/>', {'class':'gods_favor_amount ui-game-selectable'}).html(_wonderDet.shot_max)
                                )
                                .append(
                                    $('<div/>', {'class':'btn_gods_spells circle_button spells', 'style':'top: 2px; left: 4px; position: absolute;'})
                                        .append(
                                            $('<div/>', {'class':'icon js-caption'})
                                        )
                                )
                                .mousePopup(new MousePopup(RepConvTool.GetLabel('POPWONDERSHOT')))
                        )
                )
                var _elem = RCGP.getJQElement().find($('.wonder_res_container>.trade>.send_res .button.inactive .middle'))

                CM.unregister({main : RCGP.getContext().main, sub:"casted_powers"},'grcrt_countdown');
                if(_shotTime > 0){ // issue #48
                    CM.register({main : RCGP.getContext().main, sub:"casted_powers"}, 'grcrt_countdown', _elem.countdown2({
                                    value : _shotTime,
                                    display: 'readable_seconds_with_days'
                                }).on('cd:finish', function() {
                                    setTimeout(function(){RCGP.reloadContent()},100)
                                })
                    );
                }
                
            }
        }catch(e){}
    }
    /* /Wonder shots */
    function addBtnCompare(RCGP){
        if ((RCGP.getJQElement()).find($('#BTNCOMPARE')).length == 0) {
            RCGP.getJQElement().find($('.game_inner_box .game_header'))
                .append(
                    (RepConvTool.AddBtn('BTNCOMPARE'))
                        .attr('id','BTNCOMPARE')
                        .css({'margin': '0px', 'position': 'absolute', 'top': '0px', 'right': '1px'})
                        .click(function() {
                            var __ally = {leftAlly:[Game.alliance_id],rightAlly:[]}, what;
                            $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(ii,ee){
                                if(!ee.getInvitationPending()){
                                    switch (ee.getRelation()){
                                        case "war":
                                            what = "rightAlly";
                                            break;
                                        case "peace":
                                            what = "leftAlly";
                                            break;
                                    }
                                    __ally[what].push(((ee.getAlliance1Id() == Game.alliance_id) ? ee.getAlliance2Id() : ee.getAlliance1Id()))
                                }
                            })

                            WF.open("grcrt_analysis",{
                                args: {
                                    'website': RepConv.grcrt_domain + "ajax.php?modul=analysis&action=ally-compare-game&world="+Game.world_id+"&allyLeft="+__ally.leftAlly.toString()+"&allyRight="+__ally.rightAlly.toString(),
                                    'title': 'ALLYCOMPARETITLE'
                                    }
                            })
                        })
                )
        }
    }
    
    this.getGrcrtYTPlayer = function(){
        return grcrtYTPlayer;
    }
    this.getGrcrtYTPlayerTest = function(){
        return grcrtYTPlayerTest;
    }
    var _ytVideoId = null;
    var grcrtYTPlayer;
    var _ytVideoIdTest = null;
    var grcrtYTPlayerTest;


    window.onGrcrtYTPlayerError = function(event) {
        HumanMessage.error(RepConvTool.GetLabel('MSGHUMAN.YOUTUBEERROR'));
        RepConv.Debug && console.log('event eventuje [onGrcrtYTPlayerError]');
    }
    window.onGrcrtYTPlayerReady = function(event) {
        RepConv.Debug && console.log('event eventuje [onGrcrtYTPlayerReady]');
        event.target.playVideo();
    }
    window.onGrcrtYTPlayerStateChange = function(event){
        RepConv.Debug && console.log('event eventuje [onGrcrtYTPlayerStateChange]');
        RepConv.Debug && console.log(event);
        if (event.data == 0) {
            if (RepConv.settings[RepConv.CookieSounds].loop) {
                grcrtYTPlayer.playVideo();
            } else {
                $('#grcrtSound').hide();
            }
        }
    }
    window.onGrcrtYTPlayerErrorTest = function(event) {
        HumanMessage.error(RepConvTool.GetLabel('MSGHUMAN.YOUTUBEERROR'));
        RepConv.Debug && console.log('event eventuje [onGrcrtYTPlayerErrorTest]');
        event.target.stopVideo();
    }
    window.onGrcrtYTPlayerReadyTest = function(event) {
        RepConv.Debug && console.log('event eventuje [onGrcrtYTPlayerReadyTest]');
        event.target.playVideo();
    }
    window.onGrcrtYTPlayerStateChangeTest = function(event){
        RepConv.Debug && console.log('event eventuje [onGrcrtYTPlayerStateChange]');
        RepConv.Debug && console.log(event);
        if (event.data == 0) {
            $('#grcrt_play').toggle(),
            $('#grcrt_stop').toggle();
        }
    }
    function createYTPlayer(){
        if(typeof YT != 'object' || typeof YT.Player != 'function'){
            setTimeout(function(){
                createYTPlayer()
            },100)
        } else {
            grcrtYTPlayer = new YT.Player('grcrtVideoContainer', {
                                            height: '39',
                                            width: '64'
                                        });
            grcrtYTPlayerTest = new YT.Player('grcrtVideoContainerTest', {
                                    height: '39',
                                    width: '64'
                                });
        }
    }
    

    /////////////////
    // przycisk dla okien
    /////////////////
    function addOldBtns(RCGP){
        RepConv.AQQ = RCGP;
        switch (RCGP.getController()) {
            case "alliance" :
                switch (RCGP.getContext().sub) {
                    case "alliance_profile" :
                        allianceProfilBBCode(RCGP);
                        break;
                    case "alliance_create_application" :
                        addBtnPasteReportOld(RCGP, '.bb_button_wrapper', '#application_edit_message');
                        break;
                    case "alliance_alliance_pact" :
                        addBtnCompare(RCGP);
                        break;
                }
                break;

            case "alliance_forum" :
                addBtnPasteReportOld(RCGP, '.bb_button_wrapper', '#forum_post_textarea');
                //RepConvTool.addsEmots(RCGP, '.bb_button_wrapper', '#forum_post_textarea'); // emotki
                wrapForumTabs(RCGP); // forum sojuszu - zakładki w liniach
                break;
            case "building_barracks" : // baraki
            case "building_docks" : // doki
                addSpell(RCGP); // mozliwy czar 
                addReload(RCGP); // ikonka przeladowania okna
                break;
            case "building_main" :
                switch (RCGP.getContext().sub) {
                    case "building_main_index" :
                        addBuildingPoints(RCGP);
                        // convertBTNMain(RCGP);
                        break;
                }
                break;
            case "building_place" : // agora
                convertBTNAgora(RCGP);
                break;
            case "building_wall" : // mur
                convertBTNWall(RCGP);
                break;
            case "command_info" : // pojedynczy rozkaz
                switch (RCGP.getContext().sub) {
                    case "command_info_colonization_info":
                    case "command_info_info" :
                        convertBTNsingleCommand(RCGP);
                        posibleSpell(RCGP);
                        break;
                    case "command_info_conquest_info" :
                        convertBTNconquer(RCGP);
                        break;
                    case "command_info_conquest_movements" :
                        convertBTNconquer(RCGP);
                        break;
                }
                break;
            case "farm_town_overviews" :
                customFarmWindow(RCGP);
                break;
            case "island_info" :
                islandBBCode(RCGP); // bbcode dla miast na wyspie
                break;
            case "message" :
                var area = undefined;
                switch (RCGP.getContext().sub) {
                    case "message_new" :
                        area = '#message_new_message';
                        break;
                    case "message_view" :
                        area = '#message_reply_message';
                        colorizeMessageView(RCGP);
                        break;
                    case "message_forward" :
                        area = '#message_message';
                        break;
                    // case "message_index":
                    // case "message_create":
                    // case "message_reply":
                    // case "message_delete":
                    default:
                        colorizeMessageList(RCGP);
                        break;
                }
                if(area){
                    addBtnPasteReportOld(RCGP, '.bb_button_wrapper', area);
                }
                //RepConvTool.addsEmots(RCGP, '.bb_button_wrapper', area);
                break;
            case "player" :
                switch (RCGP.getContext().sub) {
                    case "player_get_profile_html" :
                        playerProfilBBCode(RCGP); // dodatki na profilu
                        break;
                    case "player_index" :
                        addSettings(RCGP); // dodanie linku do ustawien
                        break;
                }
                break;
            case "report" :
                switch (RCGP.getContext().sub) {
                    case "report_view" :
                        convertBTNReport(RCGP);
                        break;
                }
                break;
            case "town_info" : // informacja o miescie
                switch (RCGP.getContext().sub) {
                    case "town_info_info" :
                        statsLink(RCGP); // linki do statystyk
                        //idlePlayer(RCGP); // czas nieaktywności gracza
                        break;
                    case "town_info_support" :
                        convertBTNSupportInCity(RCGP); // konwersja jednostew w danym miescie
                        break;
                    case "town_info_trading":
                        RepConvABH.functCall(RCGP, false); // ABH
                        addTradingSum(RCGP);
                        break;
                    case "town_info_god" :
                        posibleSpell(RCGP); // mozliwe czary - czas do uzycia
                        break;
                }
                break;
            case "wonders" : // wysyłka surki na cudaka
                addTradingSum(RCGP);
                gcrWonderSend(RCGP);
                wonderShots(RCGP);
                //wonderLinks(RCGP);
                break;
            case "town_overviews" :
                switch (RCGP.getContext().sub) {
                    case "town_overviews_trade_overview" :
                        RepConvABH.functCall(RCGP, true); // ABH
                        break;
                    case "town_overviews_command_overview" :
                        convertBTNcommandList(RCGP); // konwersja listy rozkazow
                        break;
                }
                break;
            case "conquest_info":
                switch (RCGP.getContext().sub) {
                    case "conquest_info_getinfo" :
                        convertBTNconquestOld(RCGP);
                        break;
                }
                break;
            case "building_farm":
                addMilitiaInfo(RCGP);
                break;
        }
    }
    this.testAI = function(){
        RepConv.active.attack_count = -1;
        attackIncoming(1);
    }
    function attackIncoming(_ai){
        if(!RepConv.active.sounds.mute){
            RepConv.Debug && console.log('attackIncoming _ai='+_ai);
            if( _ai > RepConv.active.attack_count && $('#grcrtSound').css('display') == "none"){
                RepConv.audio = {};
                var
                    _aSound = $('<audio/>',{'preload':'auto'}),
                    _mSound = $('<audio/>',{'preload':'auto'})
                            .append($('<source/>',{'src':RepConv.Const.defMuteM+'.mp3'}))
                            .append($('<source/>',{'src':RepConv.Const.defMuteM+'.ogg'}))
                _ytVideoId = null
                if (RepConv.active.sounds.url!='') {
                    _ytVideoId = (
                        RepConv.active.sounds.url.indexOf('youtube')>-1 &&
                        RepConv.active.sounds.url.replace(/.*v=(.[^&]*)/,'$1')
                        ||
                        RepConv.active.sounds.url.indexOf('youtu.be')>-1 &&
                        RepConv.active.sounds.url.replace(/.*youtu.be\/(.[^?]*)/,'$1')
                    );

                    $(_aSound).append($('<source/>',{'src':RepConv.active.sounds.url}))
                } else {
                    $(_aSound)
                        .append($('<source/>',{'src':RepConv.Const.defAlarmM+'.mp3'}))
                        .append($('<source/>',{'src':RepConv.Const.defAlarmM+'.ogg'}))
                }
                RepConv.audio.mute = _mSound.get(0);
                if (_ytVideoId == null || !_ytVideoId) {
                    $('#grcrtSound').show(),
                    RepConv.audio.alarm = _aSound.get(0),
    
                    RepConv.audio.alarm.loop = RepConv.active.sounds.loop,
                    RepConv.audio.alarm.volume = RepConv.active.sounds.volume/100,
                    RepConv.audio.alarm.addEventListener('ended', function(){
                        $('#grcrtSound').hide();
                    }),
                    RepConv.audio.alarm.play();
                } else {
                    RepConv.Debug && console.log('ładuje '+_ytVideoId);
                    playYT();
                }
                var options = {
                    body: DM.getl10n('layout','toolbar_activities').incomming_attacks+" : "+(
                        // !require("data/features").isOldCommandVersion() 
                            // ? 
                            require("helpers/commands").getTotalCountOfIncomingAttacks() 
                            // : MM.checkAndPublishRawModel('CommandsMenuBubble', {id: Game.player_id}).getIncommingAttacksCommandsCount()
                        ),
                    icon: 'https://www.grcrt.net/img/octopus.png',
                }
            }
            if ( _ai == 0
                &&
                ($('#grcrtSound').css('display') != "none")
                &&
                RepConv.active.attack_count > -1
                ) {
                if (_ytVideoId == null || !_ytVideoId) {
                    RepConv.audio.alarm.pause(),
                    RepConv.audio.alarm.currentTime=0
                } else {
                    grcrtYTPlayer.stopVideo();
                }
                $('#grcrtSound').hide();
            }
            RepConv.active.attack_count = _ai;/*(
                                                !require("data/features").isOldCommandVersion() 
                                                    ? require("helpers/commands").getTotalCountOfIncomingAttacks() 
                                                    : MM.checkAndPublishRawModel('CommandsMenuBubble', {id: Game.player_id}).getIncommingAttacksCommandsCount()
                                            );*/
        }
    }

    function playYT(){
        if (typeof grcrtYTPlayer != 'object' || typeof grcrtYTPlayer.loadVideoById != 'function') {
            setTimeout(function(){playYT()},500)
        } else {
            $('#grcrtSound').show(300),
            grcrtYTPlayer.loadVideoById({
                videoId:_ytVideoId,
                loop:1,
                events:{
                    onError: onGrcrtYTPlayerError,
                    onStateChange: onGrcrtYTPlayerStateChange,
                    onReady: onGrcrtYTPlayerReady
                }
            })
            .setVolume(RepConv.active.sounds.volume);
        }
    }

    // function activity_commands_list(){
    //     if($('#toolbar_activity_commands_list').length==0){
    //         setTimeout(function(){
    //             activity_commands_list()
    //         },500);
    //         return;
    //     }
    //     // command list
    //     if($('#grcrt_taclWrap').length==0){
    //         $('#toolbar_activity_commands_list').wrap($('<div/>',{'class':'grcrt_taclWrap', 'id':'grcrt_taclWrap'}))
    //         if(RepConv.settings[RepConv.Cookie+'_tacl']){
    //             $('#toolbar_activity_commands_list').addClass('grcrt_tacl')
    //             $('#grcrt_taclWrap').draggable().draggable('enable')
    //         } else {
    //             $('#toolbar_activity_commands_list').removeClass('grcrt_tacl')
    //             $('#grcrt_taclWrap').draggable().draggable('disable').removeAttr('style')
    //         }
    //     }

    //     var 
    //         tacl_id = '#toolbar_activity_commands_list',
    //         tacl_clk = '.activity.commands',
    //         target_tacl = document.querySelector(tacl_id),
    //         observer_tacl = new MutationObserver(function(mutations) {
    //             mutations.forEach(function(mutation) {
    //                 if($(target_tacl).hasClass('grcrt_tacl') && ($('#grcrt_taclWrap').attr('style') && $(target_tacl).css('display')=="none")){
    //                     $(tacl_clk).trigger('mouseenter')
    //                 }
    //             });
    //         });
    //     $(tacl_id+">.js-dropdown-list")
    //         .append(
    //             $('<a/>',{'href':'#n','class':'cancel', 'style':'display:none;'})
    //                 .click(function(){
    //                     $('#grcrt_taclWrap').removeAttr('style')
    //                 })
    //         )
    //     observer_tacl.observe(target_tacl, { attributes: true, childList: false, characterData: false });
    //     // $(tacl_id).draggable().draggable('disable')
    // }

    function town_groups_list_chg(){
        if(uw.layout_main_controller && uw.layout_main_controller.sub_controllers){
            GameEvents.grcrt = GameEvents.grcrt || {}, GameEvents.grcrt.townGroupsList = "grcrt:townGroupsList"
            var _cpt = DM.getTemplate("COMMON", "town_groups_list")
                _cpt += "<script type=\"text/javascript\">;\n$.Observer(GameEvents.grcrt.townGroupsList).publish({townId:1});\n<\/script>",
                _cpta = {"COMMON":{"town_groups_list" : _cpt}},
                DM.loadData({templates:_cpta})
            $.Observer(GameEvents.grcrt.townGroupsList)
                .subscribe('GameEvents.grcrt.townGroupsList',function(a,b){
                    townPopup();
                })
            $.each(uw.layout_main_controller.sub_controllers, function(ic,cc){
                if(cc.name == "town_name_area"){
                    cc.controller.templates.town_groups_list = DM.getTemplate("COMMON", "town_groups_list")
                }
            })
        } else {
            setTimeout(function(){
                town_groups_list_chg()
            },500);
        }
    }

    function construction_queue_chg() {
        if(uw.layout_main_controller && uw.layout_main_controller.sub_controllers){
            var _cpt, _cpta;
            GameEvents.grcrt = GameEvents.grcrt || {}, GameEvents.grcrt.construction_queue = "grcrt:construction_queue",
            _cpt = DM.getTemplate("COMMON", "construction_queue"),
            _cpt.queue_instant_buy += "<script type=\"text/javascript\">;\n$.Observer(GameEvents.grcrt.construction_queue).publish();\n<\/script>",
            _cpta = {"COMMON":{"construction_queue" : _cpt}},
            DM.loadData({templates:_cpta}),
            
            $.Observer(GameEvents.grcrt.construction_queue)
                .subscribe('GRCRT_GRC_grcrt_construction_queue',function(a,b){
                        orderPoints();
                    })
            $.each(uw.layout_main_controller.sub_controllers, function(ic,cc){
                if(cc.name == "construction_queue_container"){
                    cc.controller.templates.town_groups_list = DM.getTemplate("COMMON", "construction_queue")
                }
            })
            orderPoints();
        } else {
            setTimeout(function(){
                construction_queue_chg()
            },500);
        }
    }
    
    /////////////////
    // nowe przycisk dla nowej wersji okien
    /////////////////
    this.addBTN = function(wnd){ // podbój miasta (stary)
        switch (wnd.getType()) {
            case windowIds.ACADEMY:
                convertBTNAcademy(wnd);
                break;
            case windowIds.NOTES:
                addBtnPasteReport(wnd);
                break;
            case windowIds.OLYMPUS_TEMPLE_INFO:
                addBtnOlympusTempleInfo(wnd);
                break;
        }
    }

    // nowe okno ustawień itp.
    this.openGRCRT = function(tab, _args){
        if (typeof window.GRCRTWnd != 'undefined') {
            try {
                window.GRCRTWnd.close();
            } catch (exp) {
            }
            window.GRCRTWnd = undefined;
        }
        window.GRCRTWnd = WF.open("grcrt", {
                args: _args
            })
        switch (tab) {
            case 'HELPTAB1':
                window.GRCRTWnd.setActivePageNr(0);
                break;
            case 'HELPTAB2':
                window.GRCRTWnd.setActivePageNr(1);
                break;
            case 'HELPTAB3':
                window.GRCRTWnd.setActivePageNr(2);
                break;
            case 'HELPTAB4':
                window.GRCRTWnd.setActivePageNr(3);
                break;
            case 'HELPTAB5':
                window.GRCRTWnd.setActivePageNr(4);
                break;
        }
    }
    // część stała, zawsze uruchamiana podczas tworzenia obiektu

    $(document)
        .ajaxComplete(function(e, xhr, settings) {
            //try {
            //    if (settings.url.indexOf("www.grcrt.net") == -1) {
            //        getIdleData();
            //    }
            //} catch(e) {}
            if (typeof settings != 'undefined') {
                var _tmp = settings.url.replace(/\/game\/(.*)\?.*/,'$1'),
                _type = (_tmp != 'frontend_bridge') ? _tmp : ((settings.url.indexOf("json")>-1) ? JSON.parse(unescape(settings.url).split('&')[3].split('=')[1]).window_type : _tmp);
                RepConv.requests[_type] = {
                        url : settings.url,
                        responseText : xhr.responseText
                }
                if (_tmp == 'frontend_bridge' ){
                    var wnd = (WM.getWindowByType(_type))[0];
                    if (!wnd) {
                        RepConv.Debug && console.log('typ wnd nieznany')
                    } else {
                        RepConv.WND=wnd
                        RepConv.Debug && console.log('dodanie przycisku dla "'+wnd.getType()+'"')
                        $('#window_'+wnd.getIdentifier()).ready(function() {
                            RepConv.Debug && console.log('dodanie przycisku dla "'+wnd.getType()+'" [id:'+wnd.getIdentifier()+']')
                            RepConvGRC.addBTN(wnd);
                        })
                    }
                } else {
                    //try {
                    if (settings.url.indexOf('game/wonders')>-1 &&
                        (
                            settings.url.indexOf('send_resources')>-1
                            ||
                            settings.url.indexOf('decrease_build_time_with_favor')>-1
                        ) && JSON.parse(xhr.responseText).json.success){
                        var json = JSON.parse(decodeURIComponent(settings.data).split('=')[1]);
                    // console.log(settings.data);
                    // RepConv.aqqaqq=settings.data;
                        // eval(decodeURIComponent(settings.data)),
                        RepConv.Debug && console.log(json);
                        json.wood = (settings.url.indexOf('decrease_build_time_with_favor')>-1) ? 0 : json.wood,
                        json.stone = (settings.url.indexOf('decrease_build_time_with_favor')>-1) ? 0 : json.stone,
                        json.iron = (settings.url.indexOf('decrease_build_time_with_favor')>-1) ? 0 : json.iron,
                        json.power = (settings.url.indexOf('decrease_build_time_with_favor')>-1) ? 400 : 0,
                        RepConv.Debug && console.log(json);
                    }
                    //} catch (e){}
                    $.each(Layout.wnd.getAllOpen(), function(ind, elem) {
                        RepConv.Debug && console.log('Dodanie przycisku dla starego okna o ID = ' + (elem).getID());
                        addOldBtns(Layout.wnd.GetByID((elem).getID()));
                    });
                    $.each(windowIds, function(iWnd, eWnd){
                        if(WM.isOpened(eWnd)){
                            var wnd = (WM.getWindowByType(eWnd))[0];
                            if (!wnd) {
                                RepConv.Debug && console.log('typ wnd nieznany')
                            } else {
                                RepConv.WND=wnd
                                RepConv.Debug && console.log('dodanie przycisku dla "'+wnd.getType()+'"')
                                $('#window_'+wnd.getIdentifier()).ready(function() {
                                    RepConv.Debug && console.log('dodanie przycisku dla "'+wnd.getType()+'" [id:'+wnd.getIdentifier()+']')
                                    RepConvGRC.addBTN(wnd);
                                })
                            }
                        }
                    })
                }
            }
            if($('#grcrt_pl').length == 1){
                RepConv.Debug && console.log('War='+RepConv.models.PlayerLedger.getCoinsOfWar());
                RepConv.Debug && console.log('Wisdom='+RepConv.models.PlayerLedger.getCoinsOfWisdom());
                $('#grcrt_pl_war').html(RepConv.models.PlayerLedger.getCoinsOfWar())
                $('#grcrt_pl_wis').html(RepConv.models.PlayerLedger.getCoinsOfWisdom())
            }
        })

    $.Observer(GameEvents.window.open)
        .subscribe('GRCRT_GRC_window_open',function(a,wnd){
            try{
                RepConv.WND=wnd
                RepConv.Debug && console.log('dodanie przycisku dla "'+wnd.getType()+'"')
                $('#window_'+wnd.getIdentifier()).ready(function() {
                    RepConv.Debug && console.log('dodanie przycisku dla "'+wnd.getType()+'" [id:'+wnd.getIdentifier()+']')
                    RepConvGRC.addBTN(wnd);
                })
            } catch(e){}
        });
    $.Observer(GameEvents.window.close)
        .subscribe('GRCRT_GRC_window_close',function(a,b,c){
            switch(b.type){
                case Layout.wnd.TYPE_TOWN_OVERVIEWS :
                    unRegister('grcrt_townsDD');
                    unRegister('grcrt_FI');
                    unRegister('grcrt_FR');
                    unRegister('grcrt_FO');
                    unRegister('grcrt_towns');
                    break;
                case Layout.wnd.TYPE_BUILDING :
                    if (b.window_obj.wnd.getContext().sub == 'building_wall_index') {
                        unRegister('grcrt_saved');
                        unRegister('grcrt_wall');
                        unRegister('grcrt_delsaved');
                    }
                    break;
            }
        });
    $.Observer(GameEvents.window.reload)
        .subscribe('GRCRT_GRC_window_reload',function(a,b,c){
            if ($('#grcrtListSaved').length == 0) {
                unRegister('grcrt_saved');
                unRegister('grcrt_delsaved');
            }
            if ($('#grcrtListWall').length == 0) {
                unRegister('grcrt_wall');
            }
        })

    $.Observer(GameEvents.ui.layout_gods_spells.state_changed)
        .subscribe('GRCRT_GRC_ui_layout_gods_spells_state_changed',function(){
            RepConvTool.loadPower();
        });
    $.Observer(GameEvents.ui.layout_gods_spells.rendered)
        .subscribe('GRCRT_GRC_ui_layout_gods_spells_rendered',function(){
            RepConvTool.loadPower();//,
            //RepConvTool.loadPower2popup();
        });
    $.Observer(GameEvents.window.daily_bonus.accept)
        .subscribe('GRCRT_GRC_window_daily_bonus_accept',function(){
            RepConvTool.loadPower();
        });
    $.Observer(GameEvents.bar.powers.render)
        .subscribe('GRCRT_GRC_bar_powers_render',function(){
            RepConvTool.loadPower();
        });
    $.Observer(GameEvents.town.town_switch)
        .subscribe('GRCRT_GRC_town_town_switch', function(){
            $('#GRCRT_block').show(),
            $('#GRCRT_block[rel='+Game.townId+']').hide()
        });
    $.Observer(GameEvents.favor.change)
        .subscribe('GRCRT_GRC_favor_change',function(){
            setTimeout(function(){ RepConvTool.loadPower(); },100);
        });
    var _cpt, _cpta;
    GameEvents.grcrt = GameEvents.grcrt || {}, GameEvents.grcrt.powertooltip = "grcrt:powertooltip",
    _cpt = DM.getTemplate("COMMON", "casted_power_tooltip"),
    _cpt += "<script type=\"text/javascript\">;\n$.Observer(GameEvents.grcrt.powertooltip).publish({power:'<%=power.id%>'});\n<\/script>",
    _cpta = {"COMMON":{"casted_power_tooltip" : _cpt}},
    DM.loadData({templates:_cpta}),
    
    $.Observer(GameEvents.grcrt.powertooltip)
        .subscribe('GRCRT_GRC_grcrt_powertooltip',function(a,b){
            showTimeInTooltip(b.power)
        })

    $('head')
        .append(
            $('<style/>')
                .append(
                    '.tripple-progress-progressbar .amounts {width: 300px; text-align: right;}'+
                    '.grcrt_menu_inner {position: absolute !important;}'
                )
        )
        .append(
            $('<style/>')
                .append(
                    '.grcrt_power {position: absolute; top: 35px; right: 85px; z-index: 5}\n'+
                    '.grcrt_power .new_ui_power_icon.active_animation .extend_spell {width: 56px; height: 56px; background-image: none;}\n'+
                    '.grcrt_command {display: none !important}\n'+
                    '.grcrt_return {width: 19px; height: 13px; display: inline-block; margin: 0 2px; vertical-align: middle; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAaCAYAAACHD21cAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggYFSEA10+XNgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAC+ElEQVQ4y42UUUhUaRiGnzPn6OjMhB0ZsliiacOIaI3YNiiwLtIkVt2rxbFGMXIuuig3sdBoRkejaS8yguhCiQRdzlwIlYtQM3ZRgQVRYATWtsvIbrFra55mG3OnOWf/vZjUzGP23X7fw/9+7/fyS1hUrK9RTOhJ3KqLUl+nZDVjs4J+vjnCng0pfomPs1gpVtDJSoFIv2FCNxcFbR9Dwe/z2PWjE2Gm+FQpH0JttYUUn/yLrGw7thwndx88INT4nZgZdqsuANavLUD68KUdwSR57i8QwFCwYIEN5tQLACL3DJQJPUnowCa2HnlEjmMZSpYdI52ipH2c/9LvePP65TyJdzuWMaGbKG7VRevlEe61yRSfTjOdfI1r+QquHoxjc6xCdu2chbYeuv1+dwVbqa9Tqti9mY5rguHTKzHe/cv0VAJhptkXGqbvxhP6bjyZczPHjVt1ZRaYgdt++p074TWk3v6DlOVg+9frqPl2C/t3r5kFM2dKzt2x1NcpxfoaRevlEW4FVpJ+9Qj4EpGe4pvD9+fA91KlxZLTvPMZV54X4yvbMNszEr/OuiotldXhh7/Nu+HMHRUr8JWyDV2eRNiW09r5mSHXNE0MDQ1RVFREPB5fOqsAkUhExGIxqqqqME0TXdeXBjVNE7FYjNraWs6eOoppmkuHPBKJiGg0it/vJ9TsZ2x6NdnZ2Ty+f52mpiaRn58/D/J4PEgz8mpqajj4Q4iNqzPuBYNBZFlGCIHdbp8HDgwMoOi6Tn19Pb5DJyjM+xvIgO3t7ZYSw+FwRqqqqnR1dXEhfJzzZ47xbNygsEChoaEBp9OJw+EAQJZlWlpa5szxer1SWVkZ/f39nOi4iCf3j0xKDINQs5/e3l4GBwetXfV6vVJJSQk9PT20nunm6Z8pcnNz+WrbXurq6qisrFz8s6qurpY0TRPd3d1cOhcgkUgghMAwDAKBwAJQskpONBqloqKC0dFRysvLkWV5gauWOdQ0TUxOTqKqKmNjYwv6Ho+H/wFcKEqd4DudIQAAAABJRU5ErkJggg==) no-repeat;}\n'+
                    '.grcrt_return.grcrt_disabled {background-position: 0 -13px !important;}\n'+
                    '.grcrt_filter {cursor: pointer;}\n'+
                    '.overview_outgoing.icon.grcrt_disabled {background-position: -12px -13px !important;}\n'+
                    '.overview_incoming.icon.grcrt_disabled {background-position: 0 -13px !important;}\n'+
                    '.grcrt_wall_units {width: 54px; height: 71px; float: left;}\n'+
                    '.grcrt_wall_diff {float: right; padding-right: 4px; font-weight: 700; letter-spacing: -1px; color: green;}\n'+
                    '.grcrt_wall_compare_dd {float: left; text-align: right;}\n'+
                    '.grcrt_dd_list {margin-left:5px; width: 125px !important;}\n'
                )
                .append(
                    '.grcrt_idle {min-width: 20px; min-height: 11px; background: url('+RepConv.grcrt_cdn+'ui/idle_loader2.gif) no-repeat; float: left; margin-right: 4px; margin-top: 3px;}\n'+
                    '.grcrt_idle_days { background: url('+RepConv.grcrt_cdn+'ui/idle.png) 0 0 no-repeat; color: white; text-align: center; font-size: 8px; vertical-align: middle; text-shadow: 1px 1px black; min-width: 20px; min-height: 11px; padding-top: 1px; cursor: help;}\n'+
                    '.grcrt_idle_dg {background-position: 0px 0px;}\n'+
                    '.grcrt_idle_dy {background-position: 0px -12px;}\n'+
                    '.grcrt_idle_dr {background-position: 0px -24px;}\n'
                )
                .append(
                    '.grcrt_lost_res {visibility: visible !important;}\n'
                )
                .append(
                    '.grcrtpoints {font-size: 10px; padding: 2px; color: greenyellow; text-shadow: 2px 2px 1px black; font-weight: bold; letter-spacing: -0.5px;}\n'+
                    '.grcrtpoints.grcrt_minus {color: #ff766c;}\n'+
                    '.grcrtpoints.grcrt_special {padding: 0; float: left; background: rgba(0, 0, 0, 0.5); width: 40px; height: 14px; text-align: center;}\n'+
                    '.grcrtpoints.grcrt_order {padding: 0; float: left; background: rgba(0, 0, 0, 0.5); width: 40px; height: 14px; text-align: center;}\n'+
                    '.build_cost_reduction_enabled_disabled .grcrt_plus { display:none}\n'+
                    '.build_cost_reduction_enabled .grcrt_minus { display:none}\n'
                )
                .append(
                    '.grcrt_brackets:before { content: "("}\n'+
                    '.grcrt_brackets:after { content: ")"}'
                )
                .append(
                    '.grcrt_hero { float: left; margin: 0 2px;}\n'+
                    '.grcrt_hero.hero_icon .value { color: white; float: right; text-shadow: 1px 1px 0 #000; padding-top: 5px;}'
                )
        )
        .append(
            $('<style/>', {'id':'grcrt_ft'})
        );
    // obsługa YT
    $('#ui_box')
        .append(
            $('<img/>', {
                'src':RepConv.grcrt_cdn+'img/mute.png',
                'id' : 'grcrtSound',
                'style': 'position:absolute; bottom: 45px; left: 15px;z-index: 1002;'
            })
            .mousePopup(new MousePopup(RepConvTool.GetLabel('POPDISABLEALARM')))
            .click(function() {
                if (_ytVideoId == null || !_ytVideoId) {
                    RepConv.audio.alarm.pause(),
                    RepConv.audio.alarm.currentTime=0,
                    RepConv.audio.mute.play();
                } else {
                    grcrtYTPlayer.stopVideo();
                }
                $('#grcrtSound').hide();
                if($('div.activity.attack_indicator').hasClass('active')){
                    attackIncoming(parseInt($('div.activity.attack_indicator div.count').html()))
                } else {
                    attackIncoming(0)
                }
            })
            .hide()
        );
    $('<div/>',{'id':'grcrtVideoContainers','style':'width:1px !important; height:1px !important'})
        .append($('<div/>',{'id':'grcrtVideoContainer'}))
        .append($('<div/>',{'id':'grcrtVideoContainerTest'}))
        .appendTo($('body'));

    $.getScript('https://www.youtube.com/iframe_api')
       .done(function( script, textStatus ) {
            setTimeout(function(){
                createYTPlayer();
            },100)
        });


    // obsługa nowych okien
    RepConv.initArray.push('RepConvGRC.init()');
    RepConv.wndArray.push(_IdS);
    RepConv.wndArray.push('grcrt_stats');
    RepConv.wndArray.push('grcrt_analysis');
    function addAttackObserver(){
        if($('div.activity.attack_indicator div.count').length == 0){
            setTimeout(function(){
                addAttackObserver();
            },100)
            RepConv.Debug && console.log('.')
        } else {
            var MutationObserver = window.MutationObserver;// || window.WebKitMutationObserver;                
            var observer_attack = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        RepConv.Debug && console.log('MutationObserver')
                        if($('div.activity.attack_indicator').hasClass('active')){
                            attackIncoming(parseInt($('div.activity.attack_indicator div.count').html()))
                        } else {
                            attackIncoming(0)
                        }
                    });
                });
            observer_attack.observe(document.querySelector('div.activity.attack_indicator'), { attributes: true, childList: true, characterData: true });
            if($('div.activity.attack_indicator').hasClass('active')){
                attackIncoming(parseInt($('div.activity.attack_indicator div.count').html()))
            }

        }

    }
    this.init = function(){
        "use strict";
        try{
            if (typeof $.fn.spinner != 'undefined') {
                (function($){
                    if(!RepConv.oldSpinner){
                        RepConv.oldSpinner = $.fn.spinner;
                        $.fn.spinner = function(){
                            var ret = RepConv.oldSpinner.apply(this, arguments);
                            ret.on('keyup','input',function(event){
                                if (event.keyCode == 38)        { ret.stepUp()
                                } else if (event.keyCode == 40) { ret.stepDown()
                                }
                            })
                            return ret;
                        };
                    }
                })(jQuery);
            }
        } catch (e) {console.err(e)}
        new _grcrtWindowGrcRT();
        new _grcrtWindowStats();
        new _grcrtWindowAnalysis();
        // $.Observer(require("data/events").attack.incoming)
        //     .subscribe('GameEvents.grcrt.attackIncomming',function(a,b){
        //         console.log('GameEvents.grcrt.attackIncomming '+b.count) /* AQQ */
        //         attackIncoming(b.count);
        //     });
        if(require("helpers/commands").getTotalCountOfIncomingAttacks() > 0) {
            attackIncoming(require("helpers/commands").getTotalCountOfIncomingAttacks());
        }
        if (RepConv.idleInterval == undefined) {
            getIdleData();
            RepConv.idleInterval = setInterval(function(){getIdleData();},idleInterval);
        }
        if (RepConv.idleAttackInterval == undefined) {
            RepConv.idleAttackInterval = setInterval(function(){
                void gpAjax.ajaxGet("notify", "fetch", {no_sysmsg: !1}, !1, function() {})
            },1000*10);
        }
        town_groups_list_chg();
        // activity_commands_list();
        construction_queue_chg();
        addAttackObserver();
    }
    // -- okienka
    function _grcrtWindowStats(){
        "use strict";
        var _IdS = 'grcrt_stats';
        var _grcrtWinIds = require("game/windows/ids");
        _grcrtWinIds[_IdS.toUpperCase()] = _IdS,
        function() {
            "use strict";
            var a = window.GameControllers.TabController,
                b = window.GameModels.Progressable,
                c = a.extend({
                    render: function() {
                        var
                            _args = this.getWindowModel().getArguments(),
                            website = RepConv.grcrt_domain + Game.locale_lang+'/light/'+_args.what+'/' + Game.world_id + '/' + _args.id,
                            e = this.getWindowModel().getIdentifier();
                        this.getWindowModel().showLoading(),
                        this.getWindowModel().setTitle( RepConv.grcrt_window_icon + 
                            RepConvTool.GetLabel('STATS.'+((_args.what.toUpperCase()=='ALLIANCE')?'ALLY':_args.what.toUpperCase()))+' - '+_args.name
                        ),
                        this.$el.html(
                            $('<div/>')
                                .append(
                                    $('<iframe/>', {
                                        'src': website,
                                        'style': 'width: 995px; height: 625px; border: 0px',
                                        }
                                    ).bind('load', function() {
                                        $.each(WM.getWindowByType(_IdS), function(ii,ee){
                                            if (ee.getIdentifier() == e) {
                                                ee.hideLoading();
                                            }
                                        })
                                    })
                                )
                            );
                    }
                });
            window.GameViews['GrcRTView_'+_IdS] = c
        }(),
        function(){//a, b, c, d) {
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
                    minheight: 660,
                    maxheight: 680,
                    width: 1010,
                    tabs: [{
                        type: f.INDEX,
                        title: RepConvTool.GetLabel('HELPTAB1'),
                        content_view_constructor: a['GrcRTView_'+_IdS],//.RrcRTViewStats,//RrcRTView1,
                        hidden: !0
                    }],
                    max_instances: 5,
                    activepagenr: 0,
                    minimizable: !0,
                    resizable: !1,
                    title: RepConv.grcrt_window_icon + RepConv.Scripts_nameS + '  ver.' + RepConv.Scripts_version
                }, b)
            }
        }()
    }
    // ----------------------------
    function _grcrtWindowAnalysis(){
        "use strict";
        var _IdS = 'grcrt_analysis';
        var _grcrtWinIds = require("game/windows/ids");
        _grcrtWinIds[_IdS.toUpperCase()] = _IdS,
        function() {
            "use strict";
            var a = window.GameControllers.TabController,
                b = window.GameModels.Progressable,
                c = a.extend({
                    render: function() {
                        var
                            _args = this.getWindowModel().getArguments(),
                            website = _args.website,
                            e = this.getWindowModel().getIdentifier();
                        this.getWindowModel().showLoading(),
                        this.getWindowModel().setTitle( RepConv.grcrt_window_icon + 
                            RepConvTool.GetLabel(_args.title)
                        ),
                        this.$el.html(
                            $('<div/>')
                                .append(
                                    $('<iframe/>', {
                                        'src': website,
                                        'style': 'width: 995px; height: 625px; border: 0px',
                                        }
                                    ).bind('load', function() {
                                        $.each(WM.getWindowByType(_IdS), function(ii,ee){
                                            if (ee.getIdentifier() == e) {
                                                ee.hideLoading();
                                            }
                                        })
                                        //(WM.getWindowByType(_IdS)[0]).hideLoading();
                                    })
                                )
                            );
                    }
                });
            window.GameViews['GrcRTView_'+_IdS] = c
        }(),
        function(){//a, b, c, d) {
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
                    minheight: 660,
                    maxheight: 680,
                    width: 1010,
                    tabs: [{
                        type: f.INDEX,
                        title: RepConvTool.GetLabel('HELPTAB1'),
                        content_view_constructor: a['GrcRTView_'+_IdS],//.RrcRTViewStats,//RrcRTView1,
                        hidden: !0
                    }],
                    max_instances: 5,
                    activepagenr: 0,
                    minimizable: !0,
                    resizable: !1,
                    title: RepConv.grcrt_window_icon + RepConv.Scripts_nameS + '  ver.' + RepConv.Scripts_version
                }, b)
            }
        }()
    }
    // ----------------------------
    function _grcrtWindowGrcRT(){
        "use strict";
        var _IdS = 'grcrt';
        var _grcrtWinIds = require("game/windows/ids");
        _grcrtWinIds[_IdS.toUpperCase()] = _IdS,
        function() {
            "use strict";
            var a = window.GameControllers.TabController,
                b = window.GameModels.Progressable,
                c = a.extend({
                    render: function() {
                        this.getWindowModel().showLoading(),
                        this.$el.html(
                            $('<div/>')
                                .append(
                                    $('<iframe/>', {
                                        'src': this.whatLoading(),
                                        'style': 'width: 815px; height: 430px; border: 0px; float: left;',
                                        }
                                    ).bind('load', function() {
                                        (WM.getWindowByType(_IdS)[0]).hideLoading();
                                    })
                                )
                            );
                    },
                    whatLoading: function(){
                var
                            _args = this.getWindowModel().getArguments(),
                _url = RepConv.getUrlForWebsite(this.getWindowModel().getActivePage().getType());
                if(_args != null && this.getWindowModel().getActivePage().getType() == _args.page){
                            var _hash = _args.hash;
                            this.getWindowModel().setArguments(null)
                            _url = RepConv.getUrlForWebsite(this.getWindowModel().getActivePage().getType(), _hash)
                        }
                        return _url;
                    }
                });
            window.GameViews['GrcRTViewEx_'+_IdS] = c
        }(),
        function() {
            "use strict";
            var a = window.GameControllers.TabController,
                b = window.GameModels.Progressable,
                c = a.extend({
                    render: function() {
                        this.$el.html(RepConvGRC.settings()),
                        this.getWindowModel().hideLoading(),
                        this.unregisterComponent("grcrt_settings_scrollbar"),
                        this.registerComponent("grcrt_settings_scrollbar", 
                            this.$el.find(".js-scrollbar-viewport").skinableScrollbar({
                                orientation: "vertical",
                                template: "tpl_skinable_scrollbar",
                                skin: "narrow",
                                disabled: !1,
                                elements_to_scroll: this.$el.find(".js-scrollbar-content"),
                                element_viewport: this.$el.find(".js-scrollbar-viewport"),
                                scroll_position: 0,
                                min_slider_size: 16
                            })
                        )
                    },
                    registerViewComponents: function() {
                        if (RepConv.Debug) console.log('registerViewComponents')
                    },
                    unregisterViewComponents: function() {
                        if (RepConv.Debug) console.log('unregisterViewComponents')
                        this.unregisterComponent("grcrt_settings_scrollbar")
                    },
                    destroy: function() {
                        if (RepConv.Debug) console.log('destroy')
                        this.unregisterViewComponents(),
                        this.unregisterListeners()
                    },
                    registerComponent: function(a, b, c) {
                        var d = {
                            main: this.getWindowModel().getType(),
                            sub: c || this.getWindowModel().getIdentifier()
                        };
                        return CM.register(d, a, b);
                    },
                    unregisterComponent: function(a, b) {
                        var c = {
                            main: this.getWindowModel().getType(),
                            sub: b || this.getWindowModel().getIdentifier()
                        };
                        CM.unregister(c, a);
                    }
                });
            window.GameViews['GrcRTViewS_'+_IdS] = c
        }(),
        function() {
            "use strict";
            var a = window.GameControllers.TabController,
                b = window.GameModels.Progressable,
                c = a.extend({
                    render: function() {
                        this.$el.html(GRCRT_Translations.table()),
                        this.getWindowModel().hideLoading()
                    }
                });
        window.GameViews['GrcRTViewT_'+_IdS] = c
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
                    minheight: 475,
                    maxheight: 630,
                    width: 830,
                    tabs: [{
                        type: 'grcrt',//f.INDEX,
                        title: RepConvTool.GetLabel('HELPTAB1'),
                        content_view_constructor: a['GrcRTViewEx_'+_IdS],//.RrcRTViewExtSite,
                        hidden: !1
                    }, {
                        type: 'howtogrcrt',//f.INDEX,
                        title: RepConvTool.GetLabel('HELPTAB2'),
                        content_view_constructor: a['GrcRTViewEx_'+_IdS],//.RrcRTViewExtSite,
                        hidden: !1
                    }, {
                        type: 'changesgrcrt',//f.INDEX,
                        title: RepConvTool.GetLabel('HELPTAB3'),
                        content_view_constructor: a['GrcRTViewEx_'+_IdS],//.RrcRTViewExtSite,
                        hidden: !1
                    }, {
                        type: f.INDEX,
                        title: RepConvTool.GetLabel('HELPTAB4'),
                        content_view_constructor: a['GrcRTViewS_'+_IdS],//.RrcRTView4,
                        hidden: !1
                    }, {
                        type: 'module/donations',//f.INDEX,
                        title: RepConvTool.GetLabel('HELPTAB6'),
                        content_view_constructor: a['GrcRTViewEx_'+_IdS],//.RrcRTViewExtSite,
                        hidden: !1
                    }, {
                        type: f.INDEX,
                        title: RepConvTool.GetLabel('HELPTAB5'),
                        content_view_constructor: a['GrcRTViewT_'+_IdS],//.RrcRTView5,
                        hidden: !1
                    }],
                    max_instances: 1,
                    activepagenr: 0,
                    minimizable: !0,
                    resizable: !1,
                    title: RepConv.grcrt_window_icon + RepConv.Scripts_nameS + '  ver.' + RepConv.Scripts_version
                }, b)
            }
        }()
    }
}