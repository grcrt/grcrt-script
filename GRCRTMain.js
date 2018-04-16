function _GRCRTMain(){
    this.Scripts_check_path = "https://{GRCRT_URL}/scripts/"
    this.Scripts_update_path = "https://{GRCRT_URL}/scripts/"
    this.Scripts_name = "Grepolis Report Converter Revolution Tools"
    this.Scripts_nameS = "GRCRTools"
    this.Scripts_url = "https://{GRCRT_URL}/"
    this.Scripts_link = "[url=" + this.Scripts_url + "]" + this.Scripts_name + "[/url]"
    this.securityData = ""
    this.Scripts_version = "{GRCRT_VERSION}"
    this.grcrt_window_icon = '<img src="https://cdn.grcrt.net/img/octopus.png" style="width: 20px;float:left;margin: -2px 5px 0px -5px;">'
    this.grcrt_domain = "https://www.grcrt.net/"
    this.grcrt_cdn = "https://cdn.grcrt.net/"
    this.Const = {
        IdWindowName: 'repConvWindow',
        IdWindowHelp: 'repConvWindowHelp',
        IdWindowView: 'repConvWindowView',
        IdWindowClone: 'repConvClone',
        IdParent: '#report_report',
        footer: this.Scripts_link + ' - ver. ' + this.Scripts_version + ' created by Potusek & Anpu',
        staticImg: this.Scripts_url + "img/",
        morale: "morale.png",
        luck: "luck.png",
        oldwall: "oldwall.png",
        nightbonus: "nightbonus.png",
        unitImg: this.Scripts_url + "static/",
        uiImg: this.Scripts_url + "ui/",
        wood: this.grcrt_cdn+"ui/3/wood.png",
        stone:this.grcrt_cdn+"ui/3/stone.png",
        iron: this.grcrt_cdn+"ui/3/iron.png",
        bunt: this.grcrt_cdn+"ui/c/revolt_arising.png",
        bunt2: this.grcrt_cdn+"ui/c/revolt_running.png",
        dataUrl: this.Scripts_url + "data/stats.php",
        dataDetailUrl: this.Scripts_url + "data/statsdetail.php",
        langUrl: this.Scripts_url + "scripts/",
        textareastyle: "width:805px; height:219px; font-size : 75%;",
        defAlarm : this.grcrt_cdn+"ui/s/alarm.mp3",
        defMute : this.grcrt_cdn+"ui/s/car_lock.mp3",
        defAlarmM : this.grcrt_cdn+"ui/s/alarm",
        defMuteM : this.grcrt_cdn+"ui/s/car_lock"
    }
    this.Debug = false
    this.LangLoaded = false
    this.StoreLoaded = true
    this.LangEnv = "en"
    this.LangAvailable = {'pl': 'PL', 'en': 'EN', 'de': 'DE', 'ro': 'RO', 'fr': 'FR', 'es': 'ES', 'nl': 'NL', 'it': 'IT', 'cs': 'CS', 'cz': 'CS'}
    this.Lang = {}
    this.HelpTabs = {}
    this.RepType = ""
    this.menu = {
        'about' :
            {
                'name' : 'HELPTAB1',
                'action' : "RepConvGRC.openGRCRT('HELPTAB1')"
            }
    }
    this.initArray = []
    this.wndArray = []
    //this.idle = {}
    if (typeof String.prototype.RCFormat == 'undefined') {
        String.prototype.RCFormat = function() {
            var args = arguments;
            return this.replace(/\{(\d+)\}/g, function() {
                return args[arguments[1]];
            });
        }
    }
    if (typeof String.prototype.stripTags == 'undefined') {
        String.prototype.stripTags = function() {
            tags = this;
            stripped = tags.replace(/<\/?[^>]+>/gi, '');
            return stripped;
        }
    }
    if (typeof String.prototype.wrapLine == 'undefined') {
        String.prototype.wrapLine = function(_length){
            var result = '', _pos;
            _string = this.replace(/\n/g,' ').replace(/\ \ /g,' ');
            while (_string.length > 0){
                _pos = (_string.length>_length)?_string.substring(0,_length).lastIndexOf(' '):-1;
                if(_pos == -1){
                    if(_string.length > 0 && _string.length <= _length){
                        _pos = _string.length;
                    } else {
                        _pos = _length;
                    }
                }
                result += ((result.length>0)?"\n":"") + _string.substring(0,_pos);
                _string = _string.substring(_pos+1,_string.length);
            }
            return result;
        }
    }
    if (typeof Array.prototype.kasuj == 'undefined') {
        Array.prototype.kasuj = function(s) {
            var i = this.indexOf(s);
            if (i != -1)
                this.splice(i, 1);
        }
    }
    if (typeof Object.size == 'undefined') {
        Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };
    }
    if(typeof Array.prototype.contains == 'undefined'){
        Array.prototype.contains = function(obj) {
            var i = this.length;
            while (i--) {
                if (this[i] == obj) {
                    return true;
                }
            }
            return false;
        }
    }    
    // FF + GM = *&@#%^$&@#%$)!
    if(!Array.prototype.searchFor){
        Array.prototype.searchFor=function(attr,value){
            return this.filter(function(el,index,array){
                return el[attr]==value;});
        };
    }
    if(!Array.prototype.clone){
        Array.prototype.clone=function(){
            return this.slice(0);
        };
    }
    if (!Array.prototype.remove) {
        Array.prototype.remove = function(from, to) {
            var rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        };
    }

    if (!Function.prototype.inherits){
        Function.prototype.inherits = function(a) {
            this.prototype = new a,
            this.prototype.constructor = this,
            this.prototype.parent = a.prototype
        };
    }
    if(typeof $.fn.justtext == 'undefined'){
        $.fn.justtext = function() {   
            return $(this)
                    .clone()
                    .children()
                    .remove()
                    .end()
                    .text();
        };
    }
    if(typeof $.md5 == 'undefined'){
        new _GRCRTmd5();
    }
    // /FF + GM = :)
    
    this.PublChanges = function(lang) {
        return this.getInfoFromWebsite('changesgrc');
    }
    this.getUrlForWebsite = function(module, hash) {
        return this.Scripts_url + Game.locale_lang + '/light/'+module+ (hash||'');
    }
    this.getInfoFromWebsite = function(module, hash) {
        var resultHTML = $('<div/>'),
        website = RepConv.getUrlForWebsite(module, hash);//this.Scripts_url+'light/'+module+'/' + Game.locale_lang + (hash||'');
        resultHTML
            .append(
                $('<iframe/>', {'src': website, 'style': 'width: 825px; height: 425px;', 'onload' : 'console.log(this)'})
            );
        return resultHTML.html();
    }
//    err404 = 0,
    this.AQQ = {}
    this.currTown = ''
    this.active = {
        sounds: { mute: false, volume: 100, url:'', loop:true},
        power: true,
        ftabs: true,
        fcmdimg: true,
        statsGRC2: false,
        statsGRCL: 'potusek',
        unitsCost: true,
        oceanNumber: true,
        reportFormat: true,
        attack_count: 0
    }
    this.commandList = this._cookie + '_CmdList'
    this.command = this._cookie + '_Cmd_'
    this.addCmd = false
    this.unitsCode = {
        "sword" : "A1",
        "slinger" : "B1",
        "archer" : "C1",
        "hoplite" : "D1",
        "rider" : "E1",
        "chariot" : "F1",
        "catapult" : "G1",
        "big_transporter" : "A2",
        "bireme" : "B2",
        "attack_ship" : "C2",
        "demolition_ship" : "D2",
        "small_transporter" : "E2",
        "trireme" : "F2",
        "colonize_ship" : "G2",
        "zyklop" : "A3",
        "sea_monster" : "B3",
        "harpy" : "C3",
        "medusa" : "D3",
        "minotaur" : "E3",
        "manticore" : "F3",
        "centaur" : "G3",
        "pegasus" : "H3",
        "cerberus" : "I3",
        "fury" : "J3",
        "calydonian_boar" : "K3",
        "griffin" : "L3",
        "godsent" : "M3",
        "militia" : "A4",

        "atalanta" : "A5",
        "cheiron" : "B5",
        "ferkyon" : "C5",
        "helen" : "D5",
        "hercules" : "E5",
        "leonidas" : "F5",
        "orpheus" : "G5",
        "terylea" : "H5",
        "urephon" : "I5",
        "zuretha" : "J5",
        "andromeda" : "K5",
        "odysseus" : "L5",
        "iason" : "M5",
        "apheledes" : "N5",
        "democritus" : "O5",
        "hector" : "P5",

        "agamemnon" : "Q5",
        "aristotle" : "R5",
        "christopholus" : "S5",
        "deimos" : "T5",
        "ylestres" : "U5",
        "pariphaistes" : "V5",
        "pelops" : "W5",
        "rekonos" : "X5",
        "themistokles" : "Y5",
        "medea" : "Z5",

        "unknown_naval" : "XY",
        "unkown" : "XX",
        "unknown" : "XX",
    }
    this.buildCode = {
        "main" : "A9",
        "storage" : "B9",
        "hide" : "C9",
        "farm" : "D9",
        "place" : "E9",
        "lumber" : "F9",
        "stoner" : "G9",
        "ironer" : "H9",
        "market" : "I9",
        "docks" : "J9",
        "wall" : "K9",
        "academy" : "L9",
        "temple" : "M9",
        "barracks" : "N9",
        "theater" : "O9",
        "thermal" : "P9",
        "library" : "R9",
        "lighthouse" : "S9",
        "tower" : "T9",
        "statue" : "U9",
        "oracle" : "V9",
        "trade_office" : "W9"
    }
    this.academyCode = {
        "architecture" : "A7",
        "building_crane" : "B7",
        "cryptography" : "C7",
        "espionage" : "D7",
        "plow" : "E7",
        "stone_storm" : "F7",
        "temple_looting" : "G7",
        "berth" : "H7",
        "cartography" : "I7",
        "democracy" : "J7",
        "instructor" : "K7",
        "pottery" : "L7",
        "strong_wine" : "M7",
        "town_guard" : "N7",
        "booty" : "O7",
        "combat_experience" : "P7",
        "diplomacy" : "Q7",
        "mathematics" : "R7",
        "set_sail" : "S7",
        "take_over" : "T7",
        "breach" : "U7",
        "conscription" : "V7",
        "divine_selection" : "W7",
        "meteorology" : "X7",
        "shipwright" : "Y7",
        "take_over_old" : "Z7",
        "phalanx" : "D6",
        "ram" : "C6",
        "booty_bpv" : "H6",
    }
    this.commandImage = [            /* http://pl.cdn.grepolis.com/images/game/unit_overview/attack_types_32x32_2.46.png*/
        "abort",                /*{ background - position: 0 0;*/
        "attack_incoming",      /*{ background - position: -128px 0;*/
        "attack_land",          /*{ background - position: -160px 0;*/
        "attack_pillage",       /*{ background - position: -192px 0;*/
        "attack_sea",           /*{ background - position: -224px 0;*/
        "attack_spy",           /*{ background - position: -256px 0;*/
        "attack_takeover",      /*{ background - position: -288px 0;*/
        "attack",               /*{ background - position: -160px 0;*/
        "breakthrough",         /*{ background - position: -320px 0;*/
        "colonization_failed",  /*{ background - position: -352px 0;*/
        "colonization",         /*{ background - position: -384px 0;*/
        "conqueror",            /*{ background - position: -416px 0;*/
        "farm_attack",          /*{ background - position: -480px 0;*/
        "illusion",             /*{ background - position: -512px 0;*/
        "revolt_arising",       /*{ background - position: -544px 0;*/
        "revolt_running",       /*{ background - position: -576px 0;*/
        "revolt",               /*{ background - position: -608px 0;*/
        "siege",                /*{ background - position: -640px 0;*/
        "spying",               /*{ background - position: -672px 0;*/
        "support",              /*{ background - position: -704px 0;*/
        "trade",                /*{ background - position: -736px 0;*/
        "underattack_land",     /*{ background - position: -786px 0;*/
        "underattack_sea",       /*{ background - position: -800px 0;*/
        "foundation"
    ]
    this.powerImage = [
        "acumen",
        "attack_boost",
        "attack_penalty",
        "bolt",
        "building_order_boost",
        "call_of_the_ocean",
        "cap_of_invisibility",
        "cleanse",
        "defense_boost",
        "defense_penalty",
        "desire",
        "divine_sign",
        "earthquake",
        "effort_of_the_huntress",
        "fair_wind",
        "favor_boost",
        "favor_penalty",
        "fertility_improvement",
        "forced_loyalty",
        "happiness",
        "happy_folks",
        "hermes_boost",
        "illusion",
        "iron_production_penalty",
        "kingly_gift",
        "loyalty_loss",
        "myrmidion_attack",
        "natures_gift",
        "olympic_experience",
        "olympic_sword",
        "olympic_torch",
        "olympic_village",
        "patroness",
        "pest",
        "population_boost",
        "pumpkin",
        "resource_boost",
        "resurrection",
        "sea_storm",
        "starter_protection",
        "stone_production_penalty",
        "strength_of_heroes",
        "town_protection",
        "transformation",
        "trojan_defense",
        "underworld_treasures",
        "unit_movement_boost",
        "unit_order_boost",
        "unit_training_boost",
        "wedding",
        "wisdom",
        "wood_production_penalty"
    ]
    this.models = {}
    this.requests = {}
    this.__repconvValueArray = {}
    this.settings = {}
    this.Tracker =  function() {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-6635454-10', 'auto');
        ga('send', 'pageview');                
    }
    this.sChbxs = {};
    this.init = function() {
        if (typeof Game != 'object' && typeof MousePopup != 'function' && typeof GameEvents != 'object') {
            setTimeout(function(){RepConv.init();},1000);
        } else {
            try {
                GameEvents.grcrt = GameEvents.grcrt || {}, GameEvents.grcrt.settings = {load : "grcrt:settings:load", save : "grcrt:settings:save"},
                this.grcrtBrowser = grcrtBrowser,
                this.Scripts_url = "https://{GRCRT_URL}/",
                //this.grcrt_domain = "https://grepolis.potusek.eu/",
                this.grcrt_domain = "https://www.grcrt.net/",
                this.grcrt_cdn = "https://cdn.grcrt.net/",
                this.Scripts_link = "[url="+this.grcrt_domain+"]" + this.Scripts_name + "[/url]",
                this.Const.footer = this.Scripts_link + ' - ver. ' + this.Scripts_version + ' created by Potusek & Anpu',
                this.Const.staticImg = this.grcrt_cdn+"img/",
                this.Const.unitImg = this.grcrt_domain+"static/",
                this.Const.uiImg = this.grcrt_cdn+"ui/",
                this.Const.bunt = this.grcrt_cdn+"ui/c/revolt_arising.png",
                this.Const.bunt2 = this.grcrt_cdn+"ui/c/revolt_running.png",
                this.Const.langUrl = this.grcrt_cdn+"scripts/",
                this.Const.defAlarm = this.grcrt_cdn+"ui/s/alarm.mp3",
                this.Const.defMute = this.grcrt_cdn+"ui/s/car_lock.mp3",
        
                this._cookie = Game.player_name + "_" + Game.world_id,
                this.Cookie = this._cookie,
                this.CookieNew = this._cookie + "_new",
                this.CookiePower = this._cookie + "_power",
                this.CookieForumTabs = this._cookie + "_ftags",
                this.CookieCmdImg = this._cookie + "_cmdimg",
                this.CookieStatsGRC2 = this._cookie + "_statsGRC2",
                this.CookieStatsGRCL = this._cookie + "_statsGRCL",
                this.CookieUnitsCost = this._cookie + "_unitsCost",
                // this.CookieOceanNumber = this._cookie + "_oceanNumber",
                this.CookieReportFormat = this._cookie + "_repFormat",
                this.CookieUnitsRecr = this._cookie + "_unitsRecr",
                this.CookieUnitsABH = this._cookie + "_unitsRecrABH",
                this.CookieSounds = this._cookie + "_sounds",
                this.CookieEmots = this._cookie + "_emots",
                this.CookieWall = this._cookie + "_wall",
                this.hash = $.md5(this._cookie);
                
                this.sChbxs[RepConv.CookiePower]            = { label : 'CHKPOWERNAME'      , default : true},
                this.sChbxs[RepConv.CookieForumTabs]        = { label : 'CHKFORUMTABS'      , default : true},
                this.sChbxs[RepConv.CookieUnitsCost]        = { label : 'CHKUNITSCOST'      , default : true},
                this.sChbxs[RepConv.CookieReportFormat]     = { label : 'CHKREPORTFORMAT'   , default : true},
                this.sChbxs[RepConv.Cookie+'_idle']         = { label : 'STATS.CHKINACTIVE' , default : true},
                this.sChbxs[RepConv.Cookie+'_wonder_trade'] = { label : 'CHKWONDERTRADE'    , default : true},
                this.sChbxs[RepConv.Cookie+'_town_popup']   = { label : 'CHKTOWNPOPUP'      , default : true},
                this.sChbxs[RepConv.Cookie+'_mcol']         = { label : 'CHKMCOL'           , default : true},
                this.sChbxs[RepConv.Cookie+'_bupo']         = { label : 'CHKBUPO'           , default : true},

                RepConvLangArray = new _GRCRTRepConvLangArray()

                if (RepConvLangArray[Game.locale_lang.substring(0,2)] == undefined) {
                    this.LangEnv = 'en';
                } else {
                    this.LangEnv = Game.locale_lang.substring(0,2);
                }
                RepConvHelpTabs = {
                    HELPTAB1: this.getInfoFromWebsite('grc'),
                    HELPTAB2: this.getInfoFromWebsite('grchowto'),
                    HELPTAB3: this.getInfoFromWebsite('changesgrc'),
                    HELPTAB4: '',
                    HELPTAB5: ''
                };
                
                if ((this.LangEnv == "en") || (this.LangEnv == "zz")) {
                    this.LangEnv = "en";
                    this.LangLoaded = true;
                }
                
                if (RepConvLangArray[this.LangEnv] == undefined) {
                    this.LangEnv = "en";
                    this.LangLoaded = true;
                }
                
                
                this.Lang = RepConvLangArray[this.LangEnv];
                
                RepConvCommand = {};
                RepConvCommandList = Array();

                if (grcrtBrowser.chrome) {
/*ADD2MAIN1*/
                } else {
/*ADD2MAIN2*/
                }
                this.GA = 0;
                RepConvTool.readRemote();
                if (RepConv.Debug) console.log('...start init');
                setTimeout(function(){RepConvAdds.init();}, 100);
                setTimeout(function(){RepConv.Tracker();}, 100);
            } catch(e) {
                grcrtErrReporter(e);
            }
        }
    }
}

function _grcrtAppendScript(name, code){
    var s = document.createElement('script');
    s.type='text/javascript';
    s.id=name;
    s.textContent = code;
    document.body.appendChild(s);
}


// try {
    var matched, grcrtBrowser;

    uaMatch = function( ua ) {
        ua = ua.toLowerCase();

      	var match = /(opr)[\/]([\w.]+)/.exec( ua ) ||
      		/(chrome)[ \/]([\w.]+)/.exec( ua ) ||
      		/(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
      		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
      		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
      		/(msie) ([\w.]+)/.exec( ua ) ||
      		ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
      		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
      		[];

      	var platform_match = /(ipad)/.exec( ua ) ||
      		/(iphone)/.exec( ua ) ||
      		/(android)/.exec( ua ) ||
      		/(windows phone)/.exec( ua ) ||
      		/(win)/.exec( ua ) ||
      		/(mac)/.exec( ua ) ||
      		/(linux)/.exec( ua ) ||
      		/(cros)/i.exec( ua ) ||
      		[];

      	return {
      		browser: match[ 3 ] || match[ 1 ] || "",
      		version: match[ 2 ] || "0",
      		platform: platform_match[ 0 ] || ""
      	};
      };

    matched = uaMatch( window.navigator.userAgent );
    grcrtBrowser = {msie : false, safari : false};

    if ( matched.browser ) {
          grcrtBrowser[ matched.browser ] = true;
          grcrtBrowser.version = matched.version;
          grcrtBrowser.versionNumber = parseInt(matched.version);
    }

    if ( matched.platform ) {
          grcrtBrowser[ matched.platform ] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile grcrtBrowser
    if ( grcrtBrowser.android || grcrtBrowser.ipad || grcrtBrowser.iphone || grcrtBrowser[ "windows phone" ] ) {
          grcrtBrowser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop grcrtBrowser
    if ( grcrtBrowser.cros || grcrtBrowser.mac || grcrtBrowser.linux || grcrtBrowser.win ) {
          grcrtBrowser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based grcrtBrowsers
    if ( grcrtBrowser.chrome || grcrtBrowser.opr || grcrtBrowser.safari ) {
          grcrtBrowser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if ( grcrtBrowser.rv )
    {
          var ie = "msie";

          matched.browser = ie;
          grcrtBrowser[ie] = true;
    }

    // Opera 15+ are identified as opr
    if ( grcrtBrowser.opr )
    {
          var opera = "opera";

          matched.browser = opera;
          grcrtBrowser[opera] = true;
    }

    // Stock Android grcrtBrowsers are marked as Safari on Android.
    if ( grcrtBrowser.safari && grcrtBrowser.android )
    {
          var android = "android";

          matched.browser = android;
          grcrtBrowser[android] = true;
    }

    // Assign the name and platform variable
    grcrtBrowser.name = matched.browser;
    grcrtBrowser.platform = matched.platform;
    uw = window;
    if (grcrtBrowser.mozilla || typeof GM == 'object') {
        grcrtBrowser.mozilla = true;
        _grcrtAppendScript("grcrtBrowser","uw = (typeof unsafeWindow == 'undefined') ? window : unsafeWindow; grcrtBrowser = "+JSON.stringify(grcrtBrowser)+";");
        _grcrtAppendScript("grcrtErrReporter",grcrtErrReporter.toString());
/*ADD2MAIN3*/
        _grcrtAppendScript("GRCRTMain",_GRCRTMain.toString());
        _grcrtAppendScript("GRCRTrunner","RepConv = new _GRCRTMain();RepConv.init();");
    } else {
        // uw = (typeof unsafeWindow == 'undefined') ? window : unsafeWindow;
        $(document).ready(function() {
            if (!window.TempBarData) {
                $.Observer(GameEvents.game.start)
                    .subscribe('GRCRT_Main_game_start',function(){
                        if ((typeof RepConv == 'undefined') || (grcrtBrowser.safari && typeof RepConv.init == 'undefined')){//(typeof RepConv == 'undefined') {
                            if (grcrtBrowser.chrome) {
                                RepConv = new _GRCRTMain();
                            } else {
                                uw.RepConv = new _GRCRTMain();
                            }
                            RepConv.init();
                        //} else {
                        //    HumanMessage.error("GRCRT is running more than once!")
                        }
                    });
            } else {
                if ((typeof RepConv == 'undefined') || (grcrtBrowser.safari && typeof RepConv.init == 'undefined')){//(typeof RepConv == 'undefined') {
                    if (grcrtBrowser.chrome) {
                        RepConv = new _GRCRTMain();
                    } else {
                        uw.RepConv = new _GRCRTMain();
                    }
                    RepConv.init();
                //} else {
                //    HumanMessage.error("GRCRT is running more than once!")
                }
            }
        });
    }
// } catch(e) {
//     grcrtErrReporter(e);
// }