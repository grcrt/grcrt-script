function _GRCRT_Recipes() {
    "use strict";
    var _IdS = 'grcrt_recipes';
    if (2<1){
        //if ( $('#happening_large_icon.easter').length!=0 ) { // tylko gdy event jest aktywny
            // dodanie do menu
        var _mtitle = 'Recipes';
        var _wtitle = 'Recipes';
        // try{
        //     _mtitle = DM.getl10n('easter_skin_incantation').easter.recipe_tab;
        // } catch(e) {}
        // try{
        //     _wtitle = DM.getl10n('easter_skin_incantation').easter.window_title +': '+DM.getl10n('easter_skin_incantation').easter.recipe_tab;
        // } catch(e) {}
        RepConv.menu.recipes =
            {
                'name' : _mtitle,//DM.getl10n('easter').alchemy.btn_recipe,
                'action' : "GRCRT_Recipes.windowOpen();",
                'class' : 'recip',
                'id' : _IdS
            }
        /* event - receptury */
        $.Observer(GameEvents.window.tab.rendered)
            .subscribe('GRCRTools_window_open_4event_man', function(a, b) {
                try{
                    var wnd = b.window_model;
                    if(wnd.getType() == require("game/windows/ids").EASTER /*&& Game.market_id != 'zz'*/){
                        // $('#window_'+wnd.getIdentifier()).ready(function() {
                            var WndName = wnd.getType()
                            $('#window_'+wnd.getIdentifier())
                                .find(
                                    $('div.easter_recipes')
                                ).append(
                                    (RepConvTool.AddBtn('BTNSEND', WndName)
                                        .setCaption('<img src="https://cdn.grcrt.net/img/octopus.png" style="width:20px; float: left;"/>&nbsp;Send recipes'))
                                        .css({'margin': '5px 40%', 'width': '160px'})
                                        .click(function() {
                                            var ___data = [];
                                            $.each(wnd.getData('collections').easter_recipes.getRecipes(), function(ii, recip){
                                                var a = recip.getRewardItem().getPowerId(), b = recip.getRewardItem().getSubtype(), c;
                                                if ("instant_resources" === a) c = "instant_resources_" + b;
                                                else if ("longterm_resource_boost" === a) c = "longterm_" + b + "_boost";
                                                else if ("resource_boost" === a) c = "resource_" + b;
                                                else if ("instant_currency" === a) c = b + "_generation";
                                                else if ("unit_training_boost" === a) c = b + "_generation";
                                                else if ("population_boost" === a) c = b + "_" + a;
                                                else if ("default" === b) c = a;
                                                ___data.push([recip.getRewardItem().getPowerId(), c, recip.getRewardItem().getLevel(), recip.getRecipeHash(), (Game.features.heroes_enabled)?'Y':'N', Game.world_id, Game.player_id, Game.market_id, (Game.market_id == 'zz')?1:0]);
                                            })
        
                                            _send = $.ajax({
                                                    'url' : RepConv.grcrt_domain+'event.php',
                                                    'method' : 'post',
                                                    'data' : {json:(JSON.stringify(___data))},
                                                    'cache':false,
                                                    'async':true
                                            })
                                            .done(function() {
                                                setTimeout(function(){
                                                    HumanMessage.success(RepConvTool.GetLabel('MSGHUMAN.OK'));
                                                },0)
                                            })
                                            .fail(function() {
                                                setTimeout(function(){
                                                    HumanMessage.error(RepConvTool.GetLabel('MSGHUMAN.ERROR'));
                                                },0)
                                            });
                                        })
                                )
                        // })
                    }
                } catch(e){
                    console.log(e)
                }
        });
        /* /event - receptury */

        // definicja okna
        RepConv.initArray.push('GRCRT_Recipes.init()');
        RepConv.wndArray.push(_IdS);
    }
    
    // ikona w menu
    $('head')
        .append(
            $('<style/>')
                .append(
                    // '.grcrt.recip { background:url('+RepConv.grcrt_cdn+'ui/recipes.png) -2px -2px no-repeat; cursor: pointer;}'+
                    '.easter_recipes #BTNSENDeaster { position: absolute !important; top: 0px !important; margin-top: 0px !important}'
                )
        )
    this.windowOpen = function(){
        // var win = window.open('https://www.grcrt.net/' + Game.locale_lang + '/module/recipes' + ((Game.market_id == 'zz')?'/beta':'') , '_blank');
        // win.focus();
        try {
            (WM.getWindowByType(_IdS)[0]).close()
        } catch (e){}
        WF.open(_IdS,{
            args: {
                'title': _wtitle,
                'url':'https://www.grcrt.net/' + Game.locale_lang + '/light/module/recipes' + ((Game.market_id == 'zz')?'/beta':'')
            }
        })
    }

    function menuShowHide(){
        if ( $('#happening_large_icon.easter').length==0 ) { // tylko gdy event jest aktywny
            $('#'+_IdS).hide();
            //console.log('kabel off');
        } else {
            $('#'+_IdS).show();
        }
        setTimeout(function(){
            menuShowHide()
        },1000*60*10)

    }

    this.init = function(){
        "use strict";
        new _grcrtWindowRecipes();
        setTimeout(function(){
            menuShowHide()
        },1000*30);

    }
    function _grcrtWindowRecipes(){
        "use strict";
        var _IdS = 'grcrt_recipes';
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
                                        'style': 'width: 965px; height: 530px; border: 0px; float: left;',
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
                        try {
                            _url = _args.url
                        } catch(e){}
                        // if(_args != null && this.getWindowModel().getActivePage().getType() == _args.page){
                        //     var _hash = _args.hash;
                        //     this.getWindowModel().setArguments(null)
                        //     _url = RepConv.getUrlForWebsite(this.getWindowModel().getActivePage().getType(), _hash)
                        // }
                        return _url;
                    }
                });
            window.GameViews['GrcRTViewEx_'+_IdS] = c
            //window.GameViews.RrcRTViewExtSite = c
        }(),
        function() {
            "use strict";
            var a = window.GameControllers.TabController,
                b = window.GameModels.Progressable,
                c = a.extend({
                    render: function() {
                        this.$el.html(RepConvGRC.settings()),
                        this.getWindowModel().hideLoading()
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
                        this.$el.html(RepConvTranslations.table()),
                        this.getWindowModel().hideLoading()
                    }
                });
            window.GameViews['GrcRTViewT_'+_IdS] = c
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
                    minheight: 575,
                    maxheight: 585,
                    width: 980,
                    tabs: [{
                        type: 'recipes',
                        title: _wtitle, //DM.getl10n('easter').window_title + ': ' + DM.getl10n('easter').alchemy.btn_recipe,
                        content_view_constructor: a['GrcRTViewEx_'+_IdS],
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