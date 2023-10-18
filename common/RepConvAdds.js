function _RepConvAdds() {
    this.init = function() {
        if (typeof RepConv.settingsReaded == 'undefined' || typeof Layout == 'undefined') {
                if (RepConv.Debug) console.log("czekam....");
                setTimeout(function(){RepConvAdds.init();}, 100);
        } else {
            if (RepConv.Debug) console.log("init....");
            var _mapSize = (require("map/helpers")||MapTiles).map2Pixel(100,100);//MapTiles.map2Pixel(100,100);
            $('head')
                .append(
                $('<style/>')
                .append(
                    '.RepConvON {border: 1px solid #fff; position: absolute; display: block; z-index: 2; opacity: .1;width: '+_mapSize.x+'px; height: '+_mapSize.x+'px;}'+
                    '#RepConvSpanPrev .outer_border {border: 2px solid black; font-size: 95%;}'
                )
                .append(
                    '#ui_box.grcrt_ui_box .nui_units_box{ top:244px;}'+
                    '#ui_box.grcrt_ui_box .nui_right_box #grcrt_pl{ '+
                    ' top:156px; '+
                    //' background-position-y: -129px;'+
                    ' height: 30px;'+
                    ' line-height: 24px;'+
                    ' font-weight: 700;'+
                    ' color: rgb(255, 204, 102);'+
                    ' font-size: 11px;'+
                    ' text-align: center;'+
                    //' width: 145px;'+
                    '}'+
                    '#ui_box.grcrt_ui_box.city-overview-enabled .nui_units_box{ top:223px !important;}'+
                    '#ui_box.grcrt_ui_box.city-overview-enabled .nui_right_box #grcrt_pl{ top:135px;}'
                )
                // wygląd wyspy
                            .append('div.island_info_wrapper div.center1 {'+
                                    'top: 0px;'+
                                    'width: 435px;'+
                                    'float: left;'+
                                    'left: 270px;'+
                                '}'+
                                                    'div.island_info_towns {'+
                                    'margin-top: 25px;'+
                                '}'+
                                                    'div.island_info_wrapper .island_info_left .game_list {'+
                                    'height: 340px !important;'+
                                '}'+
                                                    'div.island_info_wrapper .island_info_right .game_list {'+
                                    'height: 370px;'+
                                '}'+
                                '#farm_town_overview_btn {'+
                                    'top: 75px !important'+
                                '}'
                            )
            );
            RepConv.audioSupport = (typeof Audio == "function");
        
            $('body').append($('<div/>',{'id':'RepConvTMP'}).hide());
    
            // TODO
            try{
                if (RepConv.Debug) console.log(RepConv.settings)
                RepConvTool.checkSettings(),
                RepConv.active.fcmdimg = false, //AQQ $.jStorage.get(RepConv.CookieCmdImg);
                RepConv.active.power = RepConvTool.getSettings(RepConv.CookiePower),//, defData[RepConv.CookiePower]),
                RepConv.active.ftabs = RepConvTool.getSettings(RepConv.CookieForumTabs),//, defData[RepConv.CookieForumTabs]),
                RepConv.active.statsGRCL = RepConvTool.getSettings(RepConv.CookieStatsGRCL),//, defData[RepConv.CookieStatsGRCL]),
                RepConv.active.unitsCost = RepConvTool.getSettings(RepConv.CookieUnitsCost),//,defData[RepConv.CookieUnitsCost]),
                RepConv.active.oceanNumber = RepConvTool.getSettings(RepConv.CookieOceanNumber),//, defData[RepConv.CookieOceanNumber]),
                RepConv.active.reportFormat = RepConvTool.getSettings(RepConv.CookieReportFormat),//, defData[RepConv.CookieReportFormat]);
                
                RepConvTool.useSettings();
            } catch (err){
                if (RepConv.Debug) console.log(err);
            }
            if (RepConv.Debug) console.log(RepConv.settings)
            // /TODO
            //// models
            //try{
            //    //RepConv.models.PlayerLedger = MM.checkAndPublishRawModel('PlayerLedger', {id: Game.player_id});
            //    //RepConv.models.PlayerGods = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id});
            //    //RepConv.models.CommandsMenuBubble = MM.checkAndPublishRawModel('CommandsMenuBubble', {id: Game.player_id})
            //    //RepConv.models.PremiumFeatures = MM.checkAndPublishRawModel('PremiumFeatures', {id : Game.player_id});
            //    //RepConv.models.Player = MM.checkAndPublishRawModel('Player', {id: Game.player_id});
            //} catch (err){
            //    if (RepConv.Debug) console.log(err);
            //}
            // /models
        
            if (RepConv.Debug) console.log('zmiana wyglądu');
            if (RepConv.Debug) console.log((location.pathname.indexOf("game") != -1));
            if (RepConv.Debug) console.log($('#ui_box div.bottom_ornament').length);
            if (location.pathname.indexOf("game") != -1) {
            //zmiana UI
            if ($('#grcrt_mnu_list').length == 0) {
                $('#ui_box div.bottom_ornament')
                    .before(
                        $('<div/>', {'id':'grcrt_mnu_list','class':"container_hidden", 'style':"position: absolute;right: -10px;bottom: 6px;"/*position:relative;"*/})
                            .append(
                                $('<div/>', {'class':"top"})
                            )
                            .append(
                                $('<div/>', {'class':"bottom"})
                            )
                            .append(
                                $('<div/>', {'class':"middle nui_main_menu", 'style':'top: 0px; width: 142px;'})
                                    .append(
                                        $('<div/>', {'class':"left"})
                                    )
                                    .append(
                                        $('<div/>', {'class':"right",'style':'z-index:10;'})
                                    )
                                    .append(
                                        $('<div/>', {'class':"content", 'style':"display:none; margin-top: 0; margin-bottom: 0;"})
                                            .append(
                                                $('<div/>', {'class':"units_wrapper clearfix"})
                                                    .append(
                                                        $('<ul/>')
                                                    )
                                            )
                                    )
                            )
                    ),
                $('#ui_box div.bottom_ornament')
                    .append(
                        $('<div/>',{
                            'id':'grcrt_mnu',
                            'style':'background: url('+RepConv.grcrt_cdn+'ui/layout_3.3.0.png) no-repeat; width: 142px; height: 75px;'
                        })
                            .append(
                                $('<div/>', {'class':"btn_settings circle_button", 'style':'top: 34px; right: 55px;'})
                                    .append(
                                        $('<div/>', {'class':"icon js-caption", 'style':''})
                                            .append(
                                                $('<img/>', {'src':RepConv.grcrt_cdn+'img/octopus.png', 'style':'width: 20px; margin: 5px;'})
                                            )
                                        )
                                    .mousePopup(new MousePopup(RepConv.Scripts_nameS + " " + RepConv.Scripts_version + " [" + RepConv.LangEnv + "]"))
                                        .click(function(){
                                            $('#grcrt_mnu_list li.main_menu_item').remove()
                                            if ($('#grcrt_mnu>div.btn_settings').hasClass('active checked')){
                                                $('#grcrt_mnu_list .content').slideUp(500, function() {
                                                    $('#grcrt_mnu_list').animate({
                                                        right: -10
                                                    }, 300
                                                    )
                                                })
                                            } else {
                                                $('.btn_gods_spells').hasClass('active') && $('.btn_gods_spells').click()
                                                $('#grcrt_mnu_list').animate({
                                                    right: 134
                                                }, 300, function() {
                                                    $('#grcrt_mnu_list .content').slideDown(500)
                                                })
                                            }
                                            $('#grcrt_mnu>div.btn_settings').toggleClass('active checked')
                                            // $('#grcrt_mnu_list').slideToggle(),
                                        })
                                    // )
                            )
                    ),
                fillGRCRTmenu()
                $('#grcrt_mnu_list>.bottom').css({
                    'background':$('.gods_spells_menu>.bottom').css('background'),
                    'height':$('.gods_spells_menu>.bottom').css('height'),
                    'position':$('.gods_spells_menu>.bottom').css('position'),
                    'bottom':'-27px'
                });
                addBtnGodsSpellsClick();
            }
            $('#ui_box')
                .append(
                $('<img/>', {
                    'src':RepConv.grcrt_cdn+'/img/rip-64w.png',
                    'id': 'grcgrc',
                    'style':'position:absolute;bottom:0px;left:0px;z-index:1000'})
                );
            // this.addPlayerLedger();
            }
        
            var RepConvOK = false;
                
            if(RepConv.audioSupport){
                RepConv.active.sounds = RepConvTool.getSettings(RepConv.CookieSounds),//, defData[RepConv.CookieSounds]);
                RepConv.audio = {};
                var
                    _aSound = $('<audio/>',{'preload':'auto'}),
                    _mSound = $('<audio/>',{'preload':'auto'})
                            .append($('<source/>',{'src':RepConv.Const.defMuteM+'.mp3'}))
                            .append($('<source/>',{'src':RepConv.Const.defMuteM+'.ogg'}))
                if (RepConv.active.sounds.url!='') {
                    $(_aSound).append($('<source/>',{'src':RepConv.active.sounds.url}))
                } else {
                    $(_aSound)
                        .append($('<source/>',{'src':RepConv.Const.defAlarmM+'.mp3'}))
                        .append($('<source/>',{'src':RepConv.Const.defAlarmM+'.ogg'}))
                }
                RepConv.audio.alarm = _aSound.get(0);
                RepConv.audio.mute = _mSound.get(0);
            }
            RepConv.Start = {};
            setTimeout(function(){RepConvTool.newVersion();}, 30000);
            // if(RepConv.active.oceanNumber){
            //     RepConvAdds.oceanNumbers();
            // }
            // GreTime's
            if($('#GTBTN').length == 0 && Game.market_id == "pl"){
                $('#main_menu').width(865)
                $('#main_menu div.border_right').css({'background': 'url("'+RepConv.grcrt_cdn+'images/prawy.png") no-repeat 0 13px', 'width': '77px'})
                $('#main_menu div.help').css('right','31px')
                $('#main_menu div.logout').css('right','31px')
                $('#main_menu div.options_container')
                    .append(
                    $('<div/>', {'id':'GTBTN','class':'small_option small_option_top_right help', 'style': "background: url("+RepConv.grcrt_cdn+"images/gt.png') no-repeat 0 0; right: 3px; top: 45px;"})
                        .mouseenter(function(){ $(this).css('background-position', '0 -62px');})
                        .mouseleave(function(){ $(this).css('background-position', '0 0');})
                        .click(function(){ $(this).css('background-position', '0 -31px'); window.open('http://gretimes.community.grepolis.pl/','_blank');})
                        .mousePopup(new MousePopup("GreTime's"))
                    )
            }
	    // /GreTime's
            // pozostałe funkcje inicjalizujące
            initWnd();
            //$.each(RepConv.wndArray, function(ind,elem){
            //    setTimeout(elem,10);
            //})
            //RepConv.wndArray
            //$.each(RepConv.initArray, function(ind,elem){
            //    setTimeout(elem,10);
            //})
            try {
                /* DIO workaround */
                $('#dio_available_units_style_addition')
                .text(
                    $('#dio_available_units_style_addition')
                    .text()
                    .replace(' .nui_main_menu','#ui_box>.nui_main_menu')
                )
            } catch (ex){
            }

        }
    }
    function initWnd(){
        if(require("game/windows/ids")== undefined){
            setTimeout(function(){
                initWnd();
            },100);
        } else {
            var _grcrtWinIds = require("game/windows/ids");
            $.each(RepConv.wndArray, function(ind,elem){
                _grcrtWinIds[elem.toUpperCase()] = elem;
            }),
            window.define("game/windows/ids", function(){return _grcrtWinIds}),
            $.each(RepConv.initArray, function(ind,elem){
                try{
                    setTimeout(elem,10);
                } catch(e){
                    grcrtErrReporter(e);
                }
            })
        }
    }
    function addBtnGodsSpellsClick(){
        if($('.btn_gods_spells>.icon.js-caption').length==0 || $('#grcrt_mnu>div.btn_settings').length==0){
            setTimeout(function(){
                addBtnGodsSpellsClick()
            },100)
        } else {
            $('.btn_gods_spells').on("click",function(){
                if(
                    !$('.btn_gods_spells').hasClass('active') &&
                    $('#grcrt_mnu>div.btn_settings').hasClass('active')
                ) {
                    $('#grcrt_mnu>div.btn_settings').click()
                }
            })
        }
    }
    this.emots = {}
    this.emotsDef = [
        {'img': RepConv.grcrt_cdn+'emots/usmiech.gif', 'title': ':)'},
        {'img': RepConv.grcrt_cdn+'emots/ostr.gif', 'title': ':>'},
        {'img': RepConv.grcrt_cdn+'emots/kwadr.gif', 'title': ':]'},
        {'img': RepConv.grcrt_cdn+'emots/smutny2.gif', 'title': ':('},
        {'img': RepConv.grcrt_cdn+'emots/yyyy.gif', 'title': ':|'},
        {'img': RepConv.grcrt_cdn+'emots/uoeee.gif', 'title': '<uoee>'},
        {'img': RepConv.grcrt_cdn+'emots/lol.gif', 'title': '<lol>'},
        {'img': RepConv.grcrt_cdn+'emots/rotfl.gif', 'title': '<rotfl>'},
        {'img': RepConv.grcrt_cdn+'emots/oczko.gif', 'title': ';)'},
        {'img': RepConv.grcrt_cdn+'emots/jezyk.gif', 'title': ':P'},
        {'img': RepConv.grcrt_cdn+'emots/jezyk_oko.gif', 'title': ';P'},
        {'img': RepConv.grcrt_cdn+'emots/stres.gif', 'title': '<stres>'},
        {'img': RepConv.grcrt_cdn+'emots/nerwus.gif', 'title': '<nerwus>'},
        {'img': RepConv.grcrt_cdn+'emots/zly.gif', 'title': ':['},
        {'img': RepConv.grcrt_cdn+'emots/w8.gif', 'title': '<w8>'},
        {'img': RepConv.grcrt_cdn+'emots/wesoly.gif', 'title': ':))'},
        {'img': RepConv.grcrt_cdn+'emots/bezradny.gif', 'title': '<bezradny>'},
        {'img': RepConv.grcrt_cdn+'emots/krzyk.gif', 'title': '<krzyk>'},
        {'img': RepConv.grcrt_cdn+'emots/szok.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/hura.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/boisie.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/prosi.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/nie.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/hejka.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/okok.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/cwaniak.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/haha.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/mysli.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/pocieszacz.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/foch.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/zmeczony.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/beczy.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/wysmiewacz.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/zalamka.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/buziak.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/buzki.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/dobani.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/dokuczacz.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/figielek.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/klotnia.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/paluszkiem.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/wnerw.gif', 'title': ''},
        {'img': RepConv.grcrt_cdn+'emots/zacieszacz.gif', 'title': ''},
    ],
    this.emotsLists = {
        'grcrt' : {
            'img': 'emots/usmiech.gif',
            'detail': [
                {'img': 'emots/usmiech.gif'},
                {'img': 'emots/ostr.gif'},
                {'img': 'emots/kwadr.gif'},
                {'img': 'emots/smutny2.gif'},
                {'img': 'emots/yyyy.gif'},
                {'img': 'emots/uoeee.gif'},
                {'img': 'emots/lol.gif'},
                {'img': 'emots/rotfl.gif'},
                {'img': 'emots/oczko.gif'},
                {'img': 'emots/jezyk.gif'},
                {'img': 'emots/jezyk_oko.gif'},
                {'img': 'emots/stres.gif'},
                {'img': 'emots/nerwus.gif'},
                {'img': 'emots/zly.gif'},
                {'img': 'emots/w8.gif'},
                {'img': 'emots/wesoly.gif'},
                {'img': 'emots/bezradny.gif'},
                {'img': 'emots/krzyk.gif'},
                {'img': 'emots/szok.gif'},
                {'img': 'emots/hura.gif'},
                {'img': 'emots/boisie.gif'},
                {'img': 'emots/prosi.gif'},
                {'img': 'emots/nie.gif'},
                {'img': 'emots/hejka.gif'},
                {'img': 'emots/okok.gif'},
                {'img': 'emots/cwaniak.gif'},
                {'img': 'emots/haha.gif'},
                {'img': 'emots/mysli.gif'},
                {'img': 'emots/pocieszacz.gif'},
                {'img': 'emots/foch.gif'},
                {'img': 'emots/zmeczony.gif'},
                {'img': 'emots/beczy.gif'},
                {'img': 'emots/wysmiewacz.gif'},
                {'img': 'emots/zalamka.gif'},
                {'img': 'emots/buziak.gif'},
                {'img': 'emots/buzki.gif'},
                {'img': 'emots/dobani.gif'},
                {'img': 'emots/dokuczacz.gif'},
                {'img': 'emots/figielek.gif'},
                {'img': 'emots/klotnia.gif'},
                {'img': 'emots/paluszkiem.gif'},
                {'img': 'emots/wnerw.gif'},
                {'img': 'emots/zacieszacz.gif'},
            ]
        },
        'girls' : {
            'img': 'emots2/girl_yawn.gif',
            'detail': [
                {'img': 'emots2/girl_angel.gif'},
                {'img': 'emots2/girl_angry.gif'},
                {'img': 'emots2/girl_baby.gif'},
                {'img': 'emots2/girl_beat.gif'},
                {'img': 'emots2/girl_beee.gif'},
                {'img': 'emots2/girl_blush2.gif'},
                {'img': 'emots2/girl_cavemanlarge.gif'},
                {'img': 'emots2/girl_comp.gif'},
                {'img': 'emots2/girl_cray2.gif'},
                {'img': 'emots2/girl_crazy.gif'},
                {'img': 'emots2/girl_cry5.gif'},
                {'img': 'emots2/girl_cute.gif'},
                {'img': 'emots2/girl_drink1.gif'},
                {'img': 'emots2/girl_drool.gif'},
                {'img': 'emots2/girl_elbowyes.gif'},
                {'img': 'emots2/girl_feminist.gif'},
                {'img': 'emots2/girl_haha.gif'},
                {'img': 'emots2/girl_hankycray.gif'},
                {'img': 'emots2/girl_hospital.gif'},
                {'img': 'emots2/girl_hysteric.gif'},
                {'img': 'emots2/girl_impossible.gif'},
                {'img': 'emots2/girl_in_love.gif'},
                {'img': 'emots2/girl_kiss2.gif'},
                {'img': 'emots2/girl_kiss3.gif'},
                {'img': 'emots2/girl_kiss5.gif'},
                {'img': 'emots2/girl_lol.gif'},
                {'img': 'emots2/girl_manicur.gif'},
                {'img': 'emots2/girl_party2.gif'},
                {'img': 'emots2/girl_peek-a-boo.gif'},
                {'img': 'emots2/girl_pinkglassesf.gif'},
                {'img': 'emots2/girl_shock3.gif'},
                {'img': 'emots2/girl_sigh.gif'},
                {'img': 'emots2/girl_spruce_up.gif'},
                {'img': 'emots2/girl_tender.gif'},
                {'img': 'emots2/girl_whistling.gif'},
                {'img': 'emots2/girl_wink.gif'},
                {'img': 'emots2/girl_witch.gif'},
                {'img': 'emots2/girl_yawn.gif'},
            ]
        },
        'anpu' : {
            'img': 'emots2/amem.gif',
            'detail': [
                {'img': 'emots2/acute.gif'},
                {'img': 'emots2/aggressive.gif'},
                {'img': 'emots2/air_kiss.gif'},
                {'img': 'emots2/amem.gif'},
                {'img': 'emots2/angel.gif'},
                {'img': 'emots2/angel.png'},
                {'img': 'emots2/angry.png'},
                {'img': 'emots2/bad.gif'},
                {'img': 'emots2/bb.gif'},
                {'img': 'emots2/beach.gif'},
                {'img': 'emots2/beee.gif'},
                {'img': 'emots2/beer.png'},
                {'img': 'emots2/big_boss.gif'},
                {'img': 'emots2/biggrin.gif'},
                {'img': 'emots2/biggrin.png'},
                {'img': 'emots2/blink.png'},
                {'img': 'emots2/blum3.gif'},
                {'img': 'emots2/blush.gif'},
                {'img': 'emots2/blush.png'},
                {'img': 'emots2/bomb.png'},
                {'img': 'emots2/boredom.gif'},
                {'img': 'emots2/bye2.gif'},
                {'img': 'emots2/bye.gif'},
                {'img': 'emots2/Clap.gif'},
                {'img': 'emots2/clapping.gif'},
                {'img': 'emots2/cool.gif'},
                {'img': 'emots2/cool.png'},
                {'img': 'emots2/coool.gif'},
                {'img': 'emots2/cray2.gif'},
                {'img': 'emots2/cray.gif'},
                {'img': 'emots2/crazy.gif'},
                {'img': 'emots2/cry.png'},
                {'img': 'emots2/cursing.gif'},
                {'img': 'emots2/dance1.gif'},
                {'img': 'emots2/dance2.gif'},
                {'img': 'emots2/dance3.gif'},
                {'img': 'emots2/dash.gif'},
                {'img': 'emots2/devil.png'},
                {'img': 'emots2/diablo.gif'},
                {'img': 'emots2/dirol.gif'},
                {'img': 'emots2/dj.gif'},
                {'img': 'emots2/dontknow.gif'},
                {'img': 'emots2/drinks.gif'},
                {'img': 'emots2/drool.png'},
                {'img': 'emots2/elvis.gif'},
                {'img': 'emots2/emoticon-0115-inlove.gif'},
                {'img': 'emots2/facepalm.gif'},
                {'img': 'emots2/friends.gif'},
                {'img': 'emots2/gamer4.gif'},
                {'img': 'emots2/getlost.png'},
                {'img': 'emots2/giggle.gif'},
                {'img': 'emots2/give_heart2.gif'},
                {'img': 'emots2/give_rose.gif'},
                {'img': 'emots2/good.gif'},
                {'img': 'emots2/Grandpa_Angry.gif'},
                {'img': 'emots2/greeting.gif'},
                {'img': 'emots2/grin.png'},
                {'img': 'emots2/hang2.gif'},
                {'img': 'emots2/happy.png'},
                {'img': 'emots2/help.gif'},
                {'img': 'emots2/hot.gif'},
                {'img': 'emots2/hrhr.gif'},
                {'img': 'emots2/hunter.gif'},
                {'img': 'emots2/ilovethis.gif'},
                {'img': 'emots2/inlove.png'},
                {'img': 'emots2/ireful1.gif'},
                {'img': 'emots2/king.gif'},
                {'img': 'emots2/kissed.png'},
                {'img': 'emots2/kissing.png'},
                {'img': 'emots2/kiss.png'},
                {'img': 'emots2/kolobok_superman.gif'},
                {'img': 'emots2/laugh.gif'},
                {'img': 'emots2/laughing.png'},
                {'img': 'emots2/lazy.gif'},
                {'img': 'emots2/lol27.gif'},
                {'img': 'emots2/lol.gif'},
                {'img': 'emots2/mail1.gif'},
                {'img': 'emots2/mamba.gif'},
                {'img': 'emots2/man_in_love.gif'},
                {'img': 'emots2/moil.gif'},
                {'img': 'emots2/mosking.gif'},
                {'img': 'emots2/music2.gif'},
                {'img': 'emots2/music.png'},
                {'img': 'emots2/nea.gif'},
                {'img': 'emots2/new_russian.gif'},
                {'img': 'emots2/offtopic.gif'},
                {'img': 'emots2/oldman.gif'},
                {'img': 'emots2/on_the_quiet.gif'},
                {'img': 'emots2/paint2.gif'},
                {'img': 'emots2/pardon.gif'},
                {'img': 'emots2/pirate.gif'},
                {'img': 'emots2/pleasantry.gif'},
                {'img': 'emots2/poo.png'},
                {'img': 'emots2/popcorm1.gif'},
                {'img': 'emots2/pouty.png'},
                {'img': 'emots2/prankster2.gif'},
                {'img': 'emots2/preved.gif'},
                {'img': 'emots2/punish.gif'},
                {'img': 'emots2/rofl.gif'},
                {'img': 'emots2/rolleyes.gif'},
                {'img': 'emots2/rolleyes.png'},
                {'img': 'emots2/rose.png'},
                {'img': 'emots2/sad.png'},
                {'img': 'emots2/sarcastic.gif'},
                {'img': 'emots2/sarcastic_hand.gif'},
                {'img': 'emots2/scare.gif'},
                {'img': 'emots2/scratch_one-s_head.gif'},
                {'img': 'emots2/secret.gif'},
                {'img': 'emots2/sensored.gif'},
                {'img': 'emots2/shake2.gif'},
                {'img': 'emots2/shocked.png'},
                {'img': 'emots2/shock.png'},
                {'img': 'emots2/shok.gif'},
                {'img': 'emots2/shout.gif'},
                {'img': 'emots2/sick.png'},
                {'img': 'emots2/sideways.png'},
                {'img': 'emots2/sleeping.gif'},
                {'img': 'emots2/sleep.png'},
                {'img': 'emots2/smile.png'},
                {'img': 'emots2/smoke.gif'},
                {'img': 'emots2/snog.gif'},
                {'img': 'emots2/sorry2.gif'},
                {'img': 'emots2/sorry.gif'},
                {'img': 'emots2/spiteful.gif'},
                {'img': 'emots2/stfu.png'},
                {'img': 'emots2/stop.gif'},
                {'img': 'emots2/stop.png'},
                {'img': 'emots2/teeth.png'},
                {'img': 'emots2/this.gif'},
                {'img': 'emots2/thumbdown.png'},
                {'img': 'emots2/thumbsup.png'},
                {'img': 'emots2/tongue.gif'},
                {'img': 'emots2/tongue.png'},
                {'img': 'emots2/training1.gif'},
                {'img': 'emots2/unsure.gif'},
                {'img': 'emots2/vava.gif'},
                {'img': 'emots2/victory.gif'},
                {'img': 'emots2/wacko.png'},
                {'img': 'emots2/wait.gif'},
                {'img': 'emots2/whip.gif'},
                {'img': 'emots2/whistling.gif'},
                {'img': 'emots2/wink.gif'},
                {'img': 'emots2/wink.png'},
                {'img': 'emots2/wizard.gif'},
                {'img': 'emots2/wrong.png'},
                {'img': 'emots2/yahoo.gif'},
                {'img': 'emots2/yawn.png'},
                {'img': 'emots2/yes.gif'},
                {'img': 'emots2/zloy.gif'},
            ]
        }
    }
    function fillGRCRTmenu(){
        $('head')
            .append(
                $('<style/>')
                    .append(
                        '.grcrt {background: url('+RepConv.grcrt_cdn+'ui/layout_3.3.0.png) -4px -80px no-repeat;}'
                    )
                    .append(
                        '#grcrt_mnu_list ul { height: auto !important;}'
                    )
                    .append(
                        '#grcrt_mnu_list li { width: 125px !important;}'
                    )
            ),
        $.each(RepConv.menu, function(indM, eleM){
            $('#grcrt_mnu_list ul')
            .append(
                $('<li/>')
                .append(
                    $('<span/>',{'class':"content_wrapper"})
                    .append(
                        $('<span/>',{'class':"button_wrapper"})
                        .append(
                            $('<span/>',{'class':"button"})
                            .append(
                                $('<span/>',{'class':"icon grcrt"+((eleM.class)?" "+eleM.class:"")})
                            )
                            .append(
                                $('<span/>',{'class':"indicator", 'style':"display: none;"})
                            )
                        )
                        .append(
                            $('<span/>',{'class':"name_wrapper", 'style':'width: 90px; height: 34px;'})
                            .append(
                                $('<span/>',{'class':"name"})
                                .html(RepConvTool.GetLabel(eleM.name))
                            )
                        )
                    )
                )
                .click(function(){
                    eval(eleM.action);
                })
                .attr('id',eleM.id)
            )
        })
    }
};
