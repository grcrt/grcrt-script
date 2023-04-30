function _GRCRT_Radar() {
    "use strict";

    GameEvents.grcrt = GameEvents.grcrt || {},
    GameEvents.grcrt.radar = {
        find_btn : "grcrt:radar:find_btn",
        display_towns : "grcrt:radar:display_towns"
    };
    var _IdS = 'grcrt_radar';
    var
        // radius = WMap.getChunkSize()*7,
        _tList,
        _Tlist,
        _Tdist,
        curTown,
        curTownX,
        curTownY,
        curChunk,
        __player = null,
        __ally = null,
        __town = null,
        default_timeCS, default_points,
        rGhostAll,
        chunk = {},
        margin = null, /*Math.ceil((GameData.units.colonize_ship2.speed*12)/WMap.getChunkSize()),*/
        checker = (require("map/helpers")||WMap).getTownType,
        resData = {},
        _unitSpeed,
        btn_find = RepConvTool.AddBtn('RADAR.BTNFIND'),
        tabAlliances,
        _Thtml,
        _ThtmlPage;
    var sp_cs_lifetime, sp_town_points, sp_player_idle, dd_units, dd_town_lists;
    var cbx_meteorology, cbx_cartography, cbx_set_sail, cbx_unit_movement_boost, cbx_lighthouse, hero_picker, hero_bonus = 0;
    var _adds = null;
    var _pagination;
    var _grcrtData = [];
    var __allyColors = {};

    function genCheckBox(pName, pChecked) {
        return $('<div/>', {'class':'checkbox_new'})
        .checkbox({
            caption: '',
            checked: pChecked,
            cid: pName
        }).on("cbx:check", function(){
            setUnitSpeed()
            // console.log(pName)
        });
    }

    function getHeroesObjForHeroPicker() {
        var a = DM.getl10n("place", "simulator"),
            b = [{
                info: a.unassign,
                value: ""
            }],
            runtimes = [];
        $.each(require("enums/runtime_info"), function(key,value){ runtimes.push(value)});
        if (GameData.heroes) {
            $.each(GameData.heroes, function(a, c) {
                var d = {
                    value: a,
                    level: c.name,
                    hero_level: 1
                };
                ($.inArray(a,runtimes,0)>-1 && b.push(d))
            });
        }
        return b;
    }

    function getTooltip(a) {
        if(GameData.researches[a]){
            return "<b>" + GameData.researches[a].name + "</b><br/><br/>" + GameData.researches[a].description;
        } else if (GameData.buildings[a]) {
            return "<b>" + GameData.buildings[a].name + "</b><br/><br/>" + GameData.buildings[a].description;
        } else {
            return us.template(DM.getTemplate("COMMON", "casted_power_tooltip"), $.extend({}, GameDataPowers.getTooltipPowerData(GameData.powers[a], {percent: 30,lifetime: 1800,level: 1}, '1'), null));
        }
    }

    function getMargin(){
        if(margin == null){
            margin = Math.ceil((GameData.units.colonize_ship.speed*12)/WMap.getChunkSize())
        }
        return margin;
    }

    function getAdds(){
        if(_adds == null){
            _adds = "meteorology lighthouse cartography unit_movement_boost"+(GameData.buildings.academy.max_level==30 ? "" : " set_sail");
        }
        return _adds;
    }
    //this.getChunks = function(){
    //    return chunk;
    //}
    //this.getMargin = function(){
    //    return margin;
    //}
    // 
    //this.setMargin = function(value){
    //    margin = value;
    //}
    // 
    //this.getResData = function(){
    //    return resData;
    //}
    // 
    // this.getDdTownList = function(){
    //    return dd_town_lists;
    // }

    this.getSpCs = function(){
        return sp_cs_lifetime;
    }

    this.getThtmlPage = function(){
        return _ThtmlPage;
    }
    this.getThtml = function(){
        return _Thtml;
    }


    this.setPlayer = function(player_id, player_name){
        setPlayer(player_id, player_name);
    }
    this.setAlly = function(alliance_id, alliance_name){
        setAllliance(alliance_id, alliance_name);
    }
    this.setGhost = function(){
        setGhost()
    }
    this.setCurrentTown = function(){
        setCurrentTown();
    }
    this.getFirstTown = function(){
        genTownList(),
        generateTime();
        return _Tlist[_Tdist[0]] || null;
    }
    //this.getTList = function() {
    //    return _tList;
    //}

    function activeDeactiveShowCities(){
        if (__town != null){
            dd_town_lists.setExclusions([''])
        } else if(rGhostAll && rGhostAll.getValue() == 'RGHOST' || __player != null || __ally != null){
            dd_town_lists.setValue('all'),
            dd_town_lists.setExclusions(['player','alliance','allypacts','pacts','enemies'])
        } else {
            dd_town_lists.setExclusions([''])
        }
    }
    function setPlayer(player_id, player_name){
        __player = {'id' : player_id, 'name' : player_name},
        __ally = null;
        __town = null;
    }
    function setAllliance(alliance_id, alliance_name){
        __player = null,
        __ally = {'id' : alliance_id, 'name' : alliance_name};
        __town = null;
    }
    function setTown(town_id, town_name, town_ix, town_iy){
        __player = null,
        __ally = null;
        __town = {'id' : town_id, 'name' : town_name, 'ix' : town_ix, 'iy' : town_iy};
    }
    function setGhost(){
        __player = null,
        __ally = null;
        __town = null;
    }
    function getUnitSpeed4Town(townId){
        // var _speed = 0
if (RepConv.Debug) console.group("getUnitSpeed4Town")
if (RepConv.Debug) console.log(townId)
        var bonus = 0,boost=0;
        bonus += (GameData.units[dd_units.getValue()].is_naval && MM.getModels().Town[townId].getResearches().get('cartography'))?GameData.research_bonus.cartography_speed:0
        bonus += (GameData.buildings.academy.max_level>30 && dd_units.getValue()=="colonize_ship" && MM.getModels().Town[townId].getResearches().get('set_sail'))?GameData.research_bonus.colony_ship_speed:0
        bonus += (GameData.units[dd_units.getValue()].is_naval && MM.getModels().Town[townId].getBuildings().get('lighthouse')==1)?GameData.additional_runtime_modifier.lighthouse_speed_bonus:0
        bonus += (!GameData.units[dd_units.getValue()].is_naval && MM.getModels().Town[townId].getResearches().get('meteorology'))?GameData.research_bonus.meteorology_speed:0
        boost += (cbx_unit_movement_boost.isChecked() && !$('.grcrt_modifiers .modifier_icon.unit_movement_boost').hasClass('inactive'))?0.3:0
if (RepConv.Debug) console.log("bonus="+bonus)
if (RepConv.Debug) console.log("boost="+boost)
if (RepConv.Debug) console.log('result = '+GameData.units[dd_units.getValue()].speed*(1+bonus))*(1+hero_bonus+boost)
if (RepConv.Debug) console.groupEnd()
        return (GameData.units[dd_units.getValue()].speed*(1+bonus))*(1+hero_bonus+boost)
        // *(1+(cbx_unit_movement_boost.isChecked() && !$('.grcrt_modifiers .modifier_icon.unit_movement_boost').hasClass('inactive'))?0.3:0)
    }
    function getUnitSpeed(){
        var bonus = 0,boost=0;
if (RepConv.Debug) console.group("getUnitSpeed")
        bonus += (GameData.units[dd_units.getValue()].is_naval && cbx_cartography.isChecked() && !$('.grcrt_modifiers .modifier_icon.cartography').hasClass('inactive'))?GameData.research_bonus.cartography_speed:0
        bonus += (GameData.buildings.academy.max_level>30 && dd_units.getValue()=="colonize_ship" && cbx_set_sail.isChecked() && !$('.grcrt_modifiers .modifier_icon.set_sail').hasClass('inactive'))?GameData.research_bonus.colony_ship_speed:0
        bonus += (GameData.units[dd_units.getValue()].is_naval && cbx_lighthouse.isChecked() && !$('.grcrt_modifiers .modifier_icon.lighthouse').hasClass('inactive'))?GameData.additional_runtime_modifier.lighthouse_speed_bonus:0
        bonus += (!GameData.units[dd_units.getValue()].is_naval && cbx_meteorology.isChecked() && !$('.grcrt_modifiers .modifier_icon.meteorology').hasClass('inactive'))?GameData.research_bonus.meteorology_speed:0
        boost += (cbx_unit_movement_boost.isChecked() && !$('.grcrt_modifiers .modifier_icon.unit_movement_boost').hasClass('inactive'))?0.3:0
if (RepConv.Debug) console.log("bonus="+bonus)
if (RepConv.Debug) console.log("boost="+boost)
if (RepConv.Debug) console.log('result = '+GameData.units[dd_units.getValue()].speed*(1+bonus))*(1+hero_bonus+boost)
if (RepConv.Debug) console.groupEnd()
        return (GameData.units[dd_units.getValue()].speed*(1+bonus))*(1+hero_bonus+boost)
        // return (GameData.units[dd_units.getValue()].speed*(1+bonus))
        // *(1+(cbx_unit_movement_boost.isChecked() && !$('.grcrt_modifiers .modifier_icon.unit_movement_boost').hasClass('inactive'))?0.3:0)
    }
    function setUnitSpeed(){
if (RepConv.Debug) console.group("setUnitSpeed")
        if(__town != null){
            // curTown = MM.getModels().Town[Game.townId],
            curTownX = __town.ix,
            curTownY = __town.iy,
            curChunk = WMap.toChunk(curTownX,curTownY).chunk,
            resData[__town.id] = {},//resData[__town.id]||{},
            _unitSpeed = getUnitSpeed()//GameData.units[dd_units.getValue()].speed
if (RepConv.Debug) console.log("__town "+_unitSpeed)
        } else {
            // var bonus = 0;
            curTown = MM.getModels().Town[Game.townId],
            curTownX = curTown.get('island_x'),
            curTownY = curTown.get('island_y'),
            curChunk = WMap.toChunk(curTownX,curTownY).chunk,
            resData[Game.townId] = {},//resData[Game.townId]||{},
            _unitSpeed = getUnitSpeed4Town(Game.townId) //GameData.units[dd_units.getValue()].speed*(1+bonus)
if (RepConv.Debug) console.log("! __town "+_unitSpeed)
        }
if (RepConv.Debug) console.groupEnd()
        $('.grcrt_modifiers .modifier_icon').removeClass('inactive')
        cbx_meteorology.enable()
        cbx_cartography.enable()
        cbx_set_sail.enable()
        cbx_lighthouse.enable()
        if(GameData.units[dd_units.getValue()].is_naval){
            $('.grcrt_modifiers .modifier_icon.meteorology').addClass('inactive')
            cbx_meteorology.disable()
        } else {
            $('.grcrt_modifiers .modifier_icon.cartography').addClass('inactive')
            $('.grcrt_modifiers .modifier_icon.set_sail').addClass('inactive')
            $('.grcrt_modifiers .modifier_icon.lighthouse').addClass('inactive')
            cbx_cartography.disable()
            cbx_set_sail.disable()
            cbx_lighthouse.disable()
        }

        var pk = GameData.units.colonize_ship.speed;
        var maxH = Math.max(4,Math.floor(-1.875*1/pk*GameData.units[dd_units.getValue()].speed+25.875))*60*60
// console.log(maxH);
        sp_cs_lifetime.setMax(DateHelper.readableSeconds(maxH))
        if(sp_cs_lifetime.getTimeValueAsSeconds()>maxH){
            sp_cs_lifetime.setValue(DateHelper.readableSeconds(maxH))
        }
    }
    function ddCitiesList(){
        tabAlliances = {
            'all'       : {name: RepConvTool.GetLabel('COMMAND.ALL'), value: []},
            'player'    : {name: DM.getl10n('custom_colors').your_cities, value: [Game.player_id]},
            'alliance'  : {name: DM.getl10n('custom_colors').your_alliance, value: [MM.checkAndPublishRawModel('Player',{id:Game.player_id}).getAllianceId()]},
            'allypacts' : {name: DM.getl10n('custom_colors').your_alliance+" + "+DM.getl10n('custom_colors').pacts, value: [MM.checkAndPublishRawModel('Player',{id:Game.player_id}).getAllianceId()]},
            'pacts'     : {name: DM.getl10n('custom_colors').pacts, value: []},
            'enemies'   : {name: DM.getl10n('custom_colors').enemies, value: []},

        }
        if(MM.checkAndPublishRawModel('Player',{id:Game.player_id}).getAllianceId() != null){
            tabAlliances['alliance'] = {name:DM.getl10n('custom_colors').your_alliance, value: [MM.checkAndPublishRawModel('Player',{id:Game.player_id}).getAllianceId()]}
            var what;
            $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(ii,ee){
                if(!ee.getInvitationPending()){
                    switch (ee.getRelation()){
                        case "war":
                            what = "enemies";
                            break;
                        case "peace":
                            what = "pacts";
                            break;
                    }
                    if(what == "pacts"){
                        tabAlliances.allypacts.value.push(((ee.getAlliance1Id() == Game.alliance_id) ? ee.getAlliance2Id() : ee.getAlliance1Id()))
                    }
                    tabAlliances[what].value.push(((ee.getAlliance1Id() == Game.alliance_id) ? ee.getAlliance2Id() : ee.getAlliance1Id()))
                }
            })
        }
        var _result = [];
        $.each(tabAlliances, function(ind,elem){
            _result.push({'name':elem.name,'value':ind});
        })
        return _result;
    }
    function setCurrentTown(){
        _tList = [],
        _Tlist = {},
        _Tdist = [],
        setUnitSpeed()
        // setTimeout(function(){
        //     checkReload()
        // },500)
        
    }
    function hex2rgba(hex,opacity){
        hex = hex.replace('#','');
        var
            r = parseInt(hex.substring(0,2), 16),
            g = parseInt(hex.substring(2,4), 16),
            b = parseInt(hex.substring(4,6), 16),
            result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
        return result;
    }
    function getServerData(){//checkReload(){
        $.ajax({
            type: "GET",
            url: RepConv.grcrt_domain+'json_rpc.php',
            data : { 
                'method' : 'getTown4Radar',
                'world' : Game.world_id,
                'town_id' : (__town) ? __town.id : Game.townId,
                'margin' : sp_cs_lifetime.getTimeValueAsSeconds()*_unitSpeed/50
            },
            dataType: "json",
            async : false,
            cache: true
        })
        .done(function(data) {
            _grcrtData = data
        })
/*
        var gChunks=[], wmapChanged = false;
        var chunksArray = [];

        for(var xx = curChunk.x-getMargin(); xx <= curChunk.x+getMargin(); xx++){
            for(var yy = curChunk.y-getMargin(); yy <= curChunk.y+getMargin(); yy++){
                try {
                    if (RepConv.Debug) console.log('G:'+xx+':'+yy+' - '+WMap.mapData.getChunk(xx,yy).chunk.timestamp);
                    if (RepConv.Debug) console.log('D:'+xx+':'+yy+' - '+chunk[xx+'_'+yy].timestamp);
                    wmapChanged = WMap.mapData.getChunk(xx,yy).chunk.timestamp > chunk[xx+'_'+yy].timestamp
                } catch (ex){
                    wmapChanged = true
                }
                if (RepConv.Debug) console.log('wmapChanged:'+wmapChanged);
                if (!chunk[xx+'_'+yy] || chunk[xx+'_'+yy].timestamp+60*1000 < Timestamp.server() || wmapChanged) {
                    gChunks.push({x:xx,y:yy,timestamp:0})
                }
                if (gChunks.length > 10){
                    // var c = {
                    //     chunks: gChunks
                    // };
                    // var defer = $.Deferred();
                    // WMap.ajaxloader.ajaxGet("map_data", "get_chunks", c, !0, function(res, c) {
                    //     $.each(res.data, function(ii, data){
                    //         chunk[data.chunk.x+'_'+data.chunk.y] = {
                    //             timestamp: data.chunk.timestamp,
                    //             towns: data.towns
                    //         }
                    //     })
                    // })
                    chunksArray.push(gChunks);
                    gChunks = []
                }
            }
        }
        if (gChunks.length > 0){
            // var c = {
            //     chunks: gChunks
            // };
            // WMap.ajaxloader.ajaxGet("map_data", "get_chunks", c, !0, function(res, c) {
            //     $.each(res.data, function(ii, data){
            //         chunk[data.chunk.x+'_'+data.chunk.y] = {
            //             timestamp: data.chunk.timestamp,
            //             towns: data.towns
            //         }
            //     })
            // })
            chunksArray.push(gChunks);
        }
        setTimeout(function(){
            getChunks(chunksArray);
        },10);
*/
    }

    // function getChunks(chunksArray){
    //     var c = {
    //         chunks: chunksArray[0]
    //     };
    //     WMap.ajaxloader.ajaxGet("map_data", "get_chunks", c, !0, function(res, c) {
    //         $.each(res.data, function(ii, data){
    //             chunk[data.chunk.x+'_'+data.chunk.y] = {
    //                 timestamp: data.chunk.timestamp,
    //                 towns: data.towns
    //             }
    //         })
    //     })
    //     chunksArray.remove(0,0);
    //     if(chunksArray.length>0){
    //         setTimeout(function(){
    //             getChunks(chunksArray);
    //         },300);
    //     }
    // }

    function getData(){
        resData[curTownId()] = {}
        if (Object.size(resData[curTownId()]) == 0) {
            // $.each(chunk, function(indd,data){
                $.each(_grcrtData.towns, function(indt,town){
                    if (checker(town) == 'town') {
                        resData[curTownId()][town.id] = town;
                    }
                })
            // })
        }
        return resData[curTownId()];
    }
    function curTownId(){
        if(__town != null)
            return __town.id;
        return Game.townId;
    }
    function getTownModel(){
        var townModel;
        if(__town == null){
            var 
                __tmp = MM.getModels().Town[Game.townId],
                chunks = WMap.toChunk(__tmp.get('island_x'),__tmp.get('island_y')).chunk,
                data = _grcrtData;//chunk[chunks.x+'_'+chunks.y];
            $.each(data.towns, function(indt,town){
                if (checker(town) == 'town'){
                    if(town.id == __tmp.id) {
                        townModel = generateTown(town);
                    }
                }
            })
            // return MM.getModels().Town[Game.townId];
        } else {
            var 
                chunks = WMap.toChunk(__town.ix,__town.iy).chunk,
                data = _grcrtData;//chunk[chunks.x+'_'+chunks.y];
if (RepConv.Debug) console.group("__town")
if (RepConv.Debug) console.log(__town)
if (RepConv.Debug) console.groupEnd()
            $.each(data.towns, function(indt,town){
                if (checker(town) == 'town'){
                    if(town.id == __town.id) {
                        townModel = generateTown(town);
                    }
                }
            })
        }
        // console.groupEnd()
        return townModel;
    }
    function generateTown(a) {
        if (checker(a) != 'town') {
            return null;
        }
        var elTown = {
                    'id' : a.id,
                    'ix' : a.x,
                    'iy' : a.y,
                    'abs_x' : a.abs_x,
                    'abs_y' : a.abs_y,
                    'name' : a.name,
                    'player_id' : a.player_id,
                    'player_name' : a.player_name,
                    'alliance_id' : a.alliance_id,
                    'alliance_name' : a.alliance_name,
                    'points' : a.points,
                    'reservation' : a.reservation,
                    'href' : "#" +
                        btoa(
                                JSON.stringify({
                                    'id': parseInt(a.id),
                                    'ix': a.x,
                                    'iy': a.y,
                                    'tp': ((null !== a.player_id) ? 'town' : 'ghost_town'),
                                    'name': a.name
                                })
                                .replace(/[\u007f-\uffff]/g,
                                    function(c) { 
                                      return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
                                    }
                                )
                        ),
                    // 'popup' : (!WMap.createTownPopup)?WMap.createTownTooltip('town',a):WMap.createTownPopup('town',a),
                    'flag_type' : a.flag_type,
                    'fc' : getPlayerColor(a.player_id, a.alliance_id)
        }
//         a.id += "", a.id = a.id.replace("=", "");
//         var d = (require("map/helpers")).map2Pixel(a.x, a.y)
//         elTown.abs_x = d.x+a.ox,
//         elTown.abs_y = d.y+a.oy
        return elTown;
    }

    function genTownList() {
        var what;
        __allyColors[Game.alliance_id]='OWN_ALLIANCE';
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
                __allyColors[(ee.getAlliance1Id() == Game.alliance_id) ? ee.getAlliance2Id() : ee.getAlliance1Id()] = what
            }
        })
        if (__player != null) {
if (RepConv.Debug) console.log('genPlayer();')
            genPlayer();
        } else if (__ally != null) {
if (RepConv.Debug) console.log('genAlly();')
            genAlly();
        } else if (__town != null) {
if (RepConv.Debug) console.log('genTown();')
            genTown();
        } else if (rGhostAll.getValue() != 'RGHOST'){
if (RepConv.Debug) console.log('genAll();')
            genAll();
        } else {
if (RepConv.Debug) console.log('genGhost();')
            genGhost();
        }
        return true;
    }

    function genPlayer() {
        _tList = []
        $.each(getData(), function(ind, elem){
            var res = generateTown(elem);
            if (res != null && res.player_id == __player.id) {
                _tList.push(res);
            }
        })
    }

    function genAlly() {
        _tList = []
        $.each(getData(), function(ind, elem){
            var res = generateTown(elem);
            if (res != null && res.alliance_id == __ally.id) {
                _tList.push(res);
            }
        })
    }

    function genTown() {
        _tList = []
        $.each(getData(), function(ind, elem){
            var res = generateTown(elem);
            if (res != null && res.id != __town.id) {
                _tList.push(res);
            }
        })
    }

    function genAll() {
        _tList = []
        $.each(getData(), function(ind, elem){
            var res = generateTown(elem);
            if (elem.id != Game.townId && res != null) {
                _tList.push(res);
            }
        })
    }

    function genGhost() {
        _tList = []
        $.each(getData(), function(ind, elem){
            var res = generateTown(elem);
            if (res != null && res.player_id == null) {
                _tList.push(res);
            }
        })
    }

    this.getTownList = function(){
       return _Tlist;
    }
    
    function generateTime(){
        var
            _curTown,
            _offset = 900/Game.game_speed,
            idCurTown = curTownId(),
            elCurTown = getTownModel(), //MM.getModels().Town[idCurTown],
            elTown = {},
            _MDTown,
            ___unitSpeed,
            __timeInSec;
        _Tlist = {},
        _Tdist = []
        $.each(_tList, function(indTown, elTown){
            var _dist = Math.floor( 
                            $.toe.calc.getDistance(
                                {'x': elCurTown.abs_x, 'y': elCurTown.abs_y},
                                {'x': elTown.abs_x, 'y': elTown.abs_y}
                            )
                        )
            if(
                (
                    elCurTown.ix != elTown.ix
                    ||
                    elCurTown.iy != elTown.iy
                )
                &&
                !(GameData.units[dd_units.getValue()].flying || GameData.units[dd_units.getValue()].is_naval)){
            } else {
                ___unitSpeed = (MM.getModels().Town[elTown.id]) ? getUnitSpeed4Town(elTown.id) : _unitSpeed,
                __timeInSec = Math.round(50*_dist/___unitSpeed+_offset)
if (RepConv.Debug) console.log("generateTime ___unitSpeed="+___unitSpeed+" vs _unitSpeed="+_unitSpeed)
                if (_Tlist[__timeInSec] == undefined){
                    _Tlist[__timeInSec] = {'time':0, 'towns' : []};
                    _Tdist.push(__timeInSec)
                }
                _Tlist[__timeInSec]['towns'].push(elTown),
                _Tlist[__timeInSec].timeInSec = Math.round(50*_dist/___unitSpeed+_offset),
                _Tlist[__timeInSec].time = DateHelper.readableSeconds(_Tlist[__timeInSec].timeInSec)
            }
        })
        var swapped;
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
        return true;
    }
        
    function displayTownListHeader(){
        var n = DM.getl10n('map');
        function e(a) {
            if (!a.reservation){
                return "";
            }
            if ("added" === a.reservation.state) {
                if ("ally" === a.reservation.type) {
                    return n.can_reserve;
                } else {
                    return n.reserved_by_alliance;
                }
            } else if ("reserved" === a.reservation.state){
                var _icon = '<span class="reservation_tool icon small '+a.reservation.state+' '+a.reservation.type+'"></span>';
                if ("own" === a.reservation.type){
                    return _icon+n.reserved_for_you;
                } else if ("ally" === a.reservation.type) {
                    return _icon+n.reserved_for(a.reservation.player_link);
                } else {
                    return _icon+n.reserved_for_alliance(a.reservation.player_link, a.reservation.alliance_link);
                }
            }
        }
        _pagination = $('<div/>', {'class':"grcrt_pagination"})
        $('#grcrt_radar_result')
            .html("")
            .append(
                $('<div/>', {'class' : "game_header bold", 'style':"height:18px;"})
                    .append(
                        $('<div/>', {'class':'grcrt_rr_town', 'style':"float:left;"})
                            .html(RepConvTool.GetLabel('RADAR.TOWNNAME'))
                    )
                    .append(
                        $('<div/>', {'class':'grcrt_rr_cs_time', 'style':"float:left; text-align: center; width: 220px"})
                            .html(RepConvTool.GetLabel('RADAR.UNITTIME'))
                    )
                    .append(
                        $('<div/>', {'class':'grcrt_rr_player', 'style':"float:left;"})
                            .html(RepConvTool.GetLabel('RADAR.TOWNOWNER'))
                    )
                    .append(
                        $('<div/>', {'class':'grcrt_rr_player', 'style':"float:left;"})
                            .html(RepConvTool.GetLabel('RADAR.TOWNRESERVED'))
                    )
            )
            .append(
                $('<div/>', {'style': 'min-height: 350px; max-height: 350px; overflow-y: hidden; overflow-x: hidden; border: 1px solid grey; position: relative;', 'class':'js-scrollbar-viewport'})
                    .append(
                        $('<ul/>',{'class':'game_list js-scrollbar-content', 'style':'width: 100%;'})
                    )
            )
            .append(_pagination)

        // $('#grcrt_radar_result ul.game_list').bind('mousewheel', function(e){
        //     console.log($(this).offset().top)
        // })
        var _qq = 0, __owner, _show = true, __addons;
        _ThtmlPage = 0, _Thtml={}
        $.each(_Tdist, function(ind,_key){
            if (sp_cs_lifetime.getTimeValueAsSeconds() >= _Tlist[_key].timeInSec) {
                $.each(_Tlist[_key].towns, function(iiT,eeT){
                    if (
                        sp_town_points.getValue() <= eeT.points
                        &&
                        (
                            parseFloat(RepConvGRC.idle.JSON[eeT.player_id]) >= sp_player_idle.getValue()
                            &&
                            ((__player != null) || (__ally != null) || (__town != null) || (rGhostAll.getValue() != 'RGHOST'))
                            ||
                            (rGhostAll && rGhostAll.getValue() == 'RGHOST')
                        )
                    ) {
                        switch (dd_town_lists.getValue()){
                            // case 'all':
                            //     _show = true;
                            //     break;
                            case 'player':
                                _show = eeT.player_id == Game.player_id
                                break;
                            case 'alliance':
                                _show = tabAlliances[dd_town_lists.getValue()].value.contains(eeT.alliance_id||0);
                                break;
                            case 'allypacts':
                                _show = tabAlliances[dd_town_lists.getValue()].value.contains(eeT.alliance_id||0);
                                break;
                            case 'pacts':
                                _show = tabAlliances[dd_town_lists.getValue()].value.contains(eeT.alliance_id||0);
                                break;
                            case 'enemies':
                                _show = tabAlliances[dd_town_lists.getValue()].value.contains(eeT.alliance_id||0);
                                break;
                            default:
                                _show = true;
                        }

                        if(_show){
                            if(_qq%20==0){
                                // _ThtmlPage++;
                                _Thtml[(_qq/20).toString()]=[];
                            }
                            eeT.timeInSec = _Tlist[_key].timeInSec
                            eeT.time = _Tlist[_key].time
//                            eeT.fc = getPlayerColor(eeT.player_id, eeT.alliance_id)//(eeT.href,__allyColors)
                            _Thtml[Math.floor(_qq++/20).toString()].push(eeT);
                        }
                    }
                })
            }
        })
        $.Observer(GameEvents.grcrt.radar.display_towns).publish()
    }


    function pagination(){
        var _pmin = 1, _pmax = Object.size(_Thtml), _btn = true;
        _pagination
            .html("")
        $.each(_Thtml, function(ii,elem){

            if(parseInt(ii)+1 == _pmin || parseInt(ii)+1 == _pmax || parseInt(ii) == _ThtmlPage-1 || parseInt(ii) == _ThtmlPage || parseInt(ii) == _ThtmlPage+1){
                _btn = true
                if(_ThtmlPage==(parseInt(ii))){
                    _pagination
                        .append(
                            $('<strong/>', {'class':'paginator_bg', 'id':'paginator_selected'}).html(parseInt(ii)+1)
                        )

                } else {
                    _pagination
                        .append(
                            $('<a/>', {'class':'paginator_bg','href':'#n'}).html(parseInt(ii)+1).click(function(){
                                _ThtmlPage = parseInt($(this).html())-1;
                                $.Observer(GameEvents.grcrt.radar.display_towns).publish()
                                // displayTownList()
                            })
                        )
                }
            } else if (_btn) {
                _btn = false
                _pagination
                    .append(
                        $('<strong/>', {'class':'paginator_bg', 'id':'paginator_inactive'}).html("...")
                    )
            }
        })
    }

    function displayTownList(){
        if(_ThtmlPage>=Object.size(_Thtml)){
            return;
        }
        var n = DM.getl10n('map');
        var _qq = 0, __owner, __addons;
        function e(a) {
            if (!a.reservation){
                return "";
            }
            if ("added" === a.reservation.state) {
                if ("ally" === a.reservation.type) {
                    return n.can_reserve;
                } else {
                    return n.reserved_by_alliance;
                }
            } else if ("reserved" === a.reservation.state){
                var _icon = '<span class="reservation_tool icon small '+a.reservation.state+' '+a.reservation.type+'"></span>';
                if ("own" === a.reservation.type){
                    return _icon+n.reserved_for_you;
                } else if ("ally" === a.reservation.type) {
                    return _icon+n.reserved_for(a.reservation.player_link);
                } else {
                    return _icon+n.reserved_for_alliance(a.reservation.player_link, a.reservation.alliance_link);
                }
            }
        }
        // _ThtmlPage = 0, _Thtml={}
        $('#grcrt_radar_result ul').html("");
        $.each(_Thtml[_ThtmlPage.toString()], function(ind,eeT){
            __owner = (eeT.player_id == null)
                        ? DM.getl10n('common','ghost_town')
                        : '<img src="'+Game.img()+'/game/icons/player.png" />' + hCommon.player(
                            btoa(
                                JSON.stringify({"name":eeT.player_name,"id":eeT.player_id})
                                    .replace(/[\u007f-\uffff]/g,
                                        function(c) { 
                                          return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
                                        }
                                    )
                            ),
                            eeT.player_name,
                            eeT.player_id
                        ),
            __owner += (eeT.alliance_id == undefined)
                        ? ''
                        : '<br/>'+'<img src="'+Game.img()+'/game/icons/ally.png" />'+hCommon.alliance('n',eeT.alliance_name, eeT.alliance_id)
            __addons = ''
            if(MM.getModels().Town[eeT.id]){
                __addons += (GameData.units[dd_units.getValue()].is_naval && MM.getModels().Town[eeT.id].getResearches().get('cartography'))?'<div class="grcrt_bonuses grcrt_cartography"></div>':'',
                __addons += (dd_units.getValue()=="colonize_ship" && MM.getModels().Town[eeT.id].getResearches().get('set_sail'))?'<div class="grcrt_bonuses grcrt_set_sail"></div>':'',
                __addons += (GameData.units[dd_units.getValue()].is_naval && MM.getModels().Town[eeT.id].getBuildings().get('lighthouse')==1)?'<div class="grcrt_bonuses grcrt_lighthouse"></div>':'',
                __addons += !(GameData.units[dd_units.getValue()].is_naval && MM.getModels().Town[eeT.id].getResearches().get('meteorology'))?'<div class="grcrt_bonuses grcrt_meteorology"></div>':''
            }
            $('#grcrt_radar_result ul')
                .append(
                    $('<li/>', {'class':((++_qq%2)?'even':'odd')})
                        .append(
                            $('<div/>', {'class':"grcrt_rr_town"})
                                .append(
                                    $('<a/>', {
                                        'class':"gp_town_link",
                                        'href': eeT.href
                                    }).html(eeT.name)
                                )
                                .append(
                                    $('<br/>')
                                )
                                .append(
                                    $('<span/>',{'class':''}).html(
                                        '<img src="'+Game.img()+'/game/icons/points.png" /> '+n.points(eeT.points)
                                                                   //$('#RepConvTMP tr>td').eq(2).html()+$('#RepConvTMP tr>td').eq(3).html()
                                    )//'('+eeT.points+')')
                                )
                                .append(__addons)
                                .css('border-left','5px solid #' + (eeT.fc || "f00"))
                                .css('background-color', hex2rgba(eeT.fc || "f00",10))
                        )
                        .append(
                            $('<div/>',{'class':'grcrt_rr_cs_time'})
                                .append(
                                    $('<span/>',{'class':'way_duration'})
                                        .html('~'+eeT.time) //+'<br/>'+_key)
                                )
                        )
                        .append(
                            $('<div/>',{'class':'grcrt_rr_cs_time'})
                            .append(
                                $('<span/>',{'class':'arrival_time', 'data-sec':eeT.timeInSec})
                            )
                        )
                        .append(
                            $('<div/>',{'class':'player_name grcrt_rr_player'})
                                .html(__owner)
                        )
                        .append(
                            $('<div/>',{'class':'player_name grcrt_rr_player'})
                                .html(
                                    e(eeT)
                                )
                        )
                        .append(
                            $('<br/>',{'style':'clear:both'})
                        )
                )
        })
        $.each(getAdds().split(" "), function(i,o){
            $('#grcrt_radar_result ul .grcrt_'+o+':not(.grcrt_done)').tooltip(getTooltip(o)).addClass('grcrt_done')
        })
        $.each($(".grcrt_rr_cs_time .arrival_time:not(.grcrt_done)"), function(i,elem){
           $(elem).text($(elem).data('sec')+"").updateTime().addClass('grcrt_done')
        })
        // _scrollBar();
        pagination();
    }
    
    function whatFinder(){
        if (__player != null) {
            return '<img src="' + Game.img() + '/game/icons/player.png" />' +
                    hCommon.player(
                                    btoa(
                                        JSON.stringify({"name":__player.name,"id":__player.id})
                                            .replace(/[\u007f-\uffff]/g,
                                                function(c) { 
                                                  return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
                                                }
                                            )
                                    ),
                                    __player.name,
                                    __player.id
                                );
        } else if (__ally != null) {
            return '<img src="' + Game.img() + '/game/icons/ally.png" />' +
                    hCommon.alliance('n',__ally.name, __ally.id);
        } else if (__town != null) {
            return '<div style="float:right">'+
                   '<img src="' + Game.img() + '/game/icons/town.png" style="float:left"/>' +
                   '<a class="gp_town_link" href="'+btoa(JSON.stringify({
                        'id':__town.id,
                        'ix':__town.ix,
                        'iy':__town.iy,
                        'tp':'town',
                        'name':__town.name
                    }))+'">'+__town.name+'</a>'+
                   '</div>';
        } else {
            rGhostAll = $('<div/>',{
                            'class':'radiobutton',
                            'id' : 'grcrt_rghost'
                        })
                        .radiobutton({
                            value: 'RGHOST',
                            template: "tpl_radiobutton",
                            options: [{
                                value: 'RGHOST',
                                name: DM.getl10n('common','ghost_town')
                            }, {
                                value: 'RALL',
                                name: RepConvTool.GetLabel('RADAR.ALL')
                            }]
                        })
                        .on("rb:change:value", function(a, d, e) {
                            activeDeactiveShowCities()
                        })
            return rGhostAll;
            //return DM.getl10n('common','ghost_town');
        }
    }

    function getPlayerColor(player_id, alliance_id){
        var 
            _mmcc = MM.getOnlyCollectionByName("CustomColor"),
            _defc = require("helpers/default_colors"),
            _ffty = require("enums/filters"),
            // _json = JSON.parse(RepConvTool.Atob(hash)),
            _color = undefined;
        if (player_id == Game.player_id) {
            _color = _defc.getDefaultColorForPlayer(Game.player_id)
        }
        if(!_color && !player_id && !alliance_id){
            _color = '666666';
        }

        if(!_color){
            _color = _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES.PLAYER,player_id) && _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES.PLAYER,player_id).getColor()
        }

        if(!_color){
            if(player_id && alliance_id){
                if(alliance_id == Game.alliance_id){
                    _color = (
                            _mmcc.getCustomColorByIdAndType(_ffty.ALLIANCE_TYPES.OWN_ALLIANCE,alliance_id) &&
                            _mmcc.getCustomColorByIdAndType(_ffty.ALLIANCE_TYPES.OWN_ALLIANCE,alliance_id).getColor()
                            ||
                            _defc.getDefaultColorForAlliance(alliance_id)
                        )
                } else {
                    _color = (
                        (
                            __allyColors[alliance_id] && 
                            (
                                _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES[__allyColors[alliance_id]],alliance_id)  && 
                                _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES[__allyColors[alliance_id]],alliance_id).getColor()
                                ||
                                _defc.getDefaultColorForAlliance(alliance_id)
                            )
                        )
                        ||
                        (
                            alliance_id && 
                            (
                                _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES.ALLIANCE,alliance_id) && 
                                _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES.ALLIANCE,alliance_id).getColor()
                                ||
                                _defc.getDefaultColorForAlliance(alliance_id)
                            )
                        )
                    )
                }
            } else {
                _color = _defc.getDefaultColorForPlayer(player_id,Game.player_id)
            }
        }
        return _color;
    }

    function header(){
        cbx_meteorology = genCheckBox('grcrt_rr_meteorology', (__town==null && MM.getModels().Town[Game.townId].getResearches().get('meteorology'))),
        cbx_cartography = genCheckBox('grcrt_rr_cartography', (__town==null && MM.getModels().Town[Game.townId].getResearches().get('cartography'))), 
        cbx_set_sail = genCheckBox('grcrt_rr_set_sail', (__town==null && MM.getModels().Town[Game.townId].getResearches().get('set_sail'))), 
        cbx_unit_movement_boost = genCheckBox('grcrt_rr_unit_movement_boost', false), 
        cbx_lighthouse = genCheckBox('grcrt_rr_lighthouse', (__town==null && MM.getModels().Town[Game.townId].getBuildings().get('lighthouse')==1));
        hero_picker = (GameDataHeroes.areHeroesEnabled())
                        ? $('<div/>',{'class':'modifier hero_modifier', 'style':'margin-right: 0px; margin-top: 1px;'})
                            .heroPicker({
                                options: getHeroesObjForHeroPicker(),
                                should_have_remove_and_change_btn: !1,
                                should_have_level_btn: !0,
                                confirmation_window: null
                            })
                            .on("hd:change:value", function(a, b, c) {
                                hero_bonus = (b!="") ? GameData.heroes[b].description_args[1].value : 0,
                                setUnitSpeed()
                            })
                            .on("sp:change:value", function(a, b, c) {
                                hero_bonus = GameData.heroes[hero_picker.getValue()].description_args[1].value + GameData.heroes[hero_picker.getValue()].description_args[1].level_mod * b,
                                setUnitSpeed()
                            }).css({'width':'75px','text-align': 'left'})
                        : null;


        return $('<div/>')
                    .append(
                        $('<div/>', {'style':'float: left; padding: 3px 5px; margin: 2px;'})
                            .append(
                                $('<span/>').html(RepConvTool.GetLabel('RADAR.FIND')+': ')
                            )
                            .append(
                                whatFinder()
                            )
                    )
                    .append(
                        $('<div/>', {'style':'float:right; margin: 5px 10px 0 0'})
                            .append(
                                (RepConvTool.AddBtn('RADAR.BTNSAVEDEFAULT'))
                                    .click(function(){
                                        try{
                                            default_timeCS = sp_cs_lifetime.getValue(),
                                            default_points = sp_town_points.getValue(),
                                            RepConvTool.setItem(RepConv.Cookie+'radar_cs', default_timeCS),
                                            RepConvTool.setItem(RepConv.Cookie+'radar_points', default_points);
                                            setTimeout(function(){
                                                HumanMessage.success(RepConvTool.GetLabel('MSGHUMAN.OK'));
                                            },0);
                                        } catch (err) {
//                                            if (RepConv.Debug) console.log(RepConvTool.getCaller(arguments.callee.toString()));
                                            setTimeout(function(){
                                                HumanMessage.error(RepConvTool.GetLabel('MSGHUMAN.ERROR'));
                                            },0)
                                        }
                                    })
                            )
                            .append(
                                (btn_find)
                                    .click(function(){
                                        $.Observer(GameEvents.grcrt.radar.find_btn).publish()
                                    })
                            )
                    )
                    .append($('<br/>',{'style':'clear:both'}))
                    .append(
                        $('<div/>', {'id':'grcrt_rr_unit', 'class':'unit_icon50x50 colonize_ship', 'style':'margin:2px 5px 0 5px; cursor: pointer;'})
                    )
                    .append(
                        $('<div/>',{'style':'float:left'})
                            .append(
                                $('<div/>', {'style':'padding: 3px 5px; margin: 2px;'})
                                    .html(RepConvTool.GetLabel('RADAR.MAXUNITTIME'))
                            )
                            .append(
                                $('<div/>', {'id': 'grcrt_cs_time','class':'spinner','style':'width: 100px; float: right; margin: 2px;'})
                            )
                    )
                    .append(
                        $('<div/>',{'style':'float:left'})
                            .append(
                                $('<div/>', {'style':'padding: 3px 5px; margin: 2px;'})
                                    .html(RepConvTool.GetLabel('RADAR.TOWNPOINTS'))
                            )
                            .append(
                                $('<div/>', {
                                    'id': 'grcrt_town_points',
                                    'class':'spinner_horizontal',
                                    'style':'width: 100px; float: right; margin: 2px;'
                                })
                            )
                    )
                    .append(
                        $('<div/>',{'style':'float:left'})
                            .append(
                                $('<div/>', {'style':'padding: 3px 5px; margin: 2px;'})
                                    .html(RepConvTool.GetLabel('STATS.INACTIVE'))
                            )
                            .append(
                                $('<div/>', {
                                    'id': 'grcrt_player_idle',
                                    'class':'spinner_horizontal',
                                    'style':'width: 80px; float: right; margin: 2px;'
                                })
                            )
                    )
                    .append(
                        $('<div/>',{'style':'float:left'})
                            .append(
                                $('<div/>', {'style':'padding: 3px 5px; margin: 2px;'})
                                    .html(RepConvTool.GetLabel('RADAR.SHOWCITIES'))
                            )
                            .append(
                                $('<div/>', {
                                    'id': 'grcrt_town_lists',
                                    'class':'dropdown default',
                                    'style':'width: 155px; float: right; margin: 2px 2px 0px 2px;'
                                })
                            )
                    )
                    .append(
                        $('<div/>', {'class':"runtime_info grcrt_modifiers", 'style':"float: left;"})
                            .append(
                                $('<div/>', {'class':"modifiers_container", 'style':"max-width: 315px;margin-top: 0px;margin-left: 0px;"})
                                    .append(
                                        $('<div/>', {'class':"other_modifiers"})
                                            .append(
                                                hero_picker
                                            )
                                            .append(
                                                $('<div/>', {'class':"modifier", 'style':"margin-right: 5px;"})
                                                    .append(
                                                        $('<div/>', {'class':"modifier_icon research_icon research40x40 meteorology"})
                                                    )
                                                    .append(
                                                        cbx_meteorology
                                                    )
                                            )
                                            .append(
                                                $('<div/>', {'class':"modifier", 'style':"margin-right: 5px;"})
                                                    .append(
                                                        $('<div/>', {'class':"modifier_icon research_icon research40x40 cartography"})
                                                    )
                                                    .append(
                                                        cbx_cartography
                                                    )
                                            )
                                            .append(
                                                $('<div/>', {'class':"modifier", 'style':"margin-right: 5px;"+(GameData.buildings.academy.max_level==30 ? "display:none;":"")})
                                                    .append(
                                                        $('<div/>', {'class':"modifier_icon research_icon research40x40 set_sail"})
                                                    )
                                                    .append(
                                                        cbx_set_sail
                                                    )
                                            )
                                            .append(
                                                $('<div/>', {'class':"modifier", 'style':"margin-right: 5px;"})
                                                    .append(
                                                        $('<div/>', {'class':"modifier_icon power power_icon45x45 unit_movement_boost"})
                                                    )
                                                    .append(
                                                        cbx_unit_movement_boost
                                                    )
                                            )
                                            .append(
                                                $('<div/>', {'class':"modifier", 'style':"margin-right: 5px;"})
                                                    .append(
                                                        $('<div/>', {'class':"modifier_icon building_icon40x40 lighthouse"})
                                                    )
                                                    .append(
                                                        cbx_lighthouse
                                                    )
                                            )
                                    )
                            )
                    )
                    .append(
                        $('<br/>', {'style':'clear: both'})
                    )
                    .append(
                        $('<div/>', {'id':'grcrt_radar_result','style':'overflow: hidden; margin-top: 10px;'})
                    );
    }
    this.windowOpen = function(_args){
        try {
            (WM.getWindowByType(_IdS)[0]).close()
        } catch (e){}
        WF.open(_IdS,{
            args: _args
        })
    }
    // dodanie do menu
    RepConv.menu[1] =
        {
            'name' : 'RADAR.TOWNFINDER',
            'action' : "GRCRT_Radar.windowOpen();",
            'class' : 'radar'
        }
    
    // ikona w menu
    $('head')
        .append(
            $('<style/>')
                .append(
                    '.grcrt.radar { background-position: -77px -80px; cursor: pointer;}'
                )
        )
    // style dla modułu
    $('head')
        .append(
            $('<style/>')
                .append(
                    '.grcrt_rr_town, .grcrt_rr_player {float: left; width: 240px; max-width: 240px;}'
                )
                .append(
                    '.grcrt_rr_points {float: left; width: 40px; text-align: right;}'
                )
                .append(
                    '.grcrt_rr_cs_time {float: left; width: 105px; text-align: right; margin-right: 5px;}'
                )
                .append(
                    '.grcrt_rr_town img, .grcrt_rr_player img {float: left;}'
                )
                .append(
                    '#grcrt_rr_unit {position: relative; display: block; float: left; text-align: right; border: 1px solid #724B08;}'
                )
                .append(
                    '.option.unit_icon40x40 { float: left; position: relative; border: 1px solid #724B08; margin: 1px;}'
                )
                .append(
                    '.option.unit_icon40x40.selected {border: 2px solid red; margin: 0px;}'
                )
                .append(
                    '.grcrt_bonuses {background: url(https://www.grcrt.net/static/uX7%7C.S9%7C.I7%7C.S7%7C_20_0.png) 0px 0px;width: 20px; height: 20px; float: right; margin: 0 2px 2px 0;border: 1px solid #8c7878;cursor: pointer;}'
                )
                .append(
                    '.grcrt_meteorology {background-position: 0 0;}'
                )
                .append(
                    '.grcrt_lighthouse {background-position: -20px 0;}'
                )
                .append(
                    '.grcrt_cartography {background-position: -40px 0;}'
                )
                .append(
                    '.grcrt_set_sail {background-position: -60px 0;}'
                )
                .append(
                    '#grcrt_town_lists_list .option.disabled {color: gray !important;}'
                )
                .append(
                    '.grcrt_pagination {padding: 5px;height: 20px;}'
                )
                .append(
                    '#grcrt_cs_time>.body>input {text-align:center !important; left: 5px;}'
                )
        )
        $('#tpl_grcrt_units_list').remove()
        $('<script/>',{'type':"text/template",'id':"tpl_grcrt_units_list"}).text(''+
        '<div class="dropdown-list sandy-box js-dropdown-list" style="max-width: 240px !important;">'+
            '<div class="corner_tl"></div>'+
            '<div class="corner_tr"></div>'+
            '<div class="corner_bl"></div>'+
            '<div class="corner_br"></div>'+
            '<div class="border_t"></div>'+
            '<div class="border_b"></div>'+
            '<div class="border_l"></div>'+
            '<div class="border_r"></div>'+
            '<div class="middle"></div>'+
            '<div class="content js-dropdown-item-list">'+
                '<% var i, l = options.length, option;'+
                'for (i = 0; i < l; i++) {'+
                'option = options[i]; %>'+
                '<div class="option unit_icon40x40 <%= option.value %>" name="<%= option.value %>"></div>'+
                '<% } %>'+
            '</div>'+
        '</div>'
        ).appendTo($('head'))


    // obsługa nowych okien
    RepConv.initArray.push('GRCRT_Radar.init()');
    RepConv.wndArray.push(_IdS);
    
    this.init = function(){
        "use strict";
        new _grcrtWindowRadar();
    }
    function _grcrtWindowRadar(){
        var _grcrtWinIds = require("game/windows/ids");
        _grcrtWinIds[_IdS.toUpperCase()] = _IdS,
        function() {
            "use strict";
            var a = window.GameControllers.TabController,
                b = window.GameModels.Progressable,
                c = a.extend({
                    initialize: function() {
                        if (RepConv.Debug) console.log('initialize')
                        a.prototype.initialize.apply(this, arguments),
                        default_timeCS = RepConvTool.getSettings(RepConv.Cookie+'radar_cs', '06:00:00'),
                        default_points = parseInt(RepConvTool.getSettings(RepConv.Cookie+'radar_points', 0)),
                        this.unregisterListeners()
                        this._radarMode(),
                        this.registerListeners(),
                        this.render(),
                        this._setCurrentTown(),
                        this.registerViewComponents()
                    },
                    unregisterListeners: function() {
                        if (RepConv.Debug) console.log('initialize')
                        $.Observer(GameEvents.town.town_switch)
                            .unsubscribe('GRCRT_Radar_town_town_switch'),
                        $.Observer(GameEvents.grcrt.radar.find_btn)
                            .unsubscribe('GRCRT_Radar_grcrt_radar_find_btn')
                        $.Observer(GameEvents.grcrt.radar.display_towns)
                            .unsubscribe('GRCRT_Radar_grcrt_radar_display_towns')
                    },
                    registerListeners: function() {
                        if (RepConv.Debug) console.log('registerListeners')
                        $.Observer(GameEvents.town.town_switch)
                            .subscribe('GRCRT_Radar_town_town_switch', this._setCurrentTown.bind(this))
                        $.Observer(GameEvents.grcrt.radar.find_btn)
                            .subscribe('GRCRT_Radar_grcrt_radar_find_btn', this._findTowns.bind(this))
                        $.Observer(GameEvents.grcrt.radar.display_towns)
                            .subscribe('GRCRT_Radar_grcrt_radar_display_towns', this._displayTowns.bind(this))
                    },
                    render: function() {
                        if (RepConv.Debug) console.log('render');
                        var opt = []
                        $.each(GameData.units, function(ii, unit){
                            if(unit.speed>0){
                              opt.push({value:ii})
                            }
                        })
                        this.$el.html(
                            header()
                            ),
                        dd_units = $("#grcrt_rr_unit").dropdown({
                            list_pos: "center",
                            // hover: !0,
                            type: "image",
                            value: "colonize_ship",
                            template: "tpl_grcrt_units_list",
                            options: opt
                        }).on("dd:change:value", function(b, c, d, e, f) {
                            $("#grcrt_rr_unit").toggleClass(d)
                            $("#grcrt_rr_unit").toggleClass(c)
                            setUnitSpeed()
                        })
                        $.each(getAdds().split(" "), function(i,o){
                            $('.grcrt_modifiers .modifier_icon.'+o).tooltip(getTooltip(o))
                        })

                        sp_cs_lifetime = $("#grcrt_cs_time").spinnerHorizontal({
                                                                value: default_timeCS,
                                                                step: "00:30:00",
                                                                max: "48:00:00",
                                                                min: "00:30:00",
                                                                type: "time"
                                                            }),
                        sp_town_points = $("#grcrt_town_points").spinnerHorizontal({
                                                    value: default_points,
                                                    step: 500,
                                                    max: 18000,
                                                    min: 0
                                                }),
                        sp_player_idle = $("#grcrt_player_idle").spinnerHorizontal({
                                                    value: 0,
                                                    step: 1,
                                                    max: 999,
                                                    min: 0
                                                });
                        dd_town_lists = $("#grcrt_town_lists").dropdown({
                                                    value: 'all',
                                                    options: ddCitiesList(),
                                                    // disable: (rGhostAll && rGhostAll.getValue() == 'RGHOST' || __player != null),
                                                // }).on("dd:change:value", function(a, b, c) {
                                                //     that.townList()
                                                });
                        activeDeactiveShowCities()
                        return this
                    },
                    reRender: function() {
                        //this.getWindowModel().hideLoading()
                    },
                    registerViewComponents: function() {
                        if (RepConv.Debug) console.log('registerViewComponents')
                    },
                    unregisterViewComponents: function() {
                        if (RepConv.Debug) console.log('unregisterViewComponents')
                        this.unregisterComponent("grcrt_radar_scrollbar")
                    },
                    destroy: function() {
                        if (RepConv.Debug) console.log('destroy')
                        this.unregisterViewComponents(),
                        this.unregisterListeners()
                    },
                    _setCurrentTown: function(){
                        var _wnd = this.getWindowModel();
                        this.getWindowModel().showLoading();
                        setTimeout(function(){
                            setCurrentTown(),
                            _wnd.hideLoading()
                        },10)
                    },
                    _findTowns: function(){
                        $.Observer(GameEvents.grcrt.radar.find_btn)
                            .unsubscribe('GRCRT_Radar_grcrt_radar_find_btn')
                        var _wnd = this.getWindowModel(),
                        that = this;
                        if(!this.working){
                            this.getWindowModel().showLoading();
                            setTimeout(function(){
                                that.working = true;
                                $('#grcrt_radar_result').html(""),
                                getServerData(),
                                genTownList(),
                                generateTime(),
                                displayTownListHeader(),
                                that.unregisterListeners(),
                                that.registerListeners(),
                                _wnd.hideLoading(),
                                that.working = false;
                            },500)
                        }
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
                    },
                    _displayTowns: function(){
                        this.getWindowModel().showLoading(),
                        this.unregisterComponent("grcrt_radar_scrollbar"),
                        displayTownList(),
                        this.registerComponent("grcrt_radar_scrollbar", 
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
                        ),
                        this.getWindowModel().hideLoading();
                    },
                    _radarMode: function(){
                        try{
                            var _args = this.getWindowModel().getArguments();
                            if (_args == undefined) {
                                setGhost()
                            } else {
                                if (_args.player != undefined) {
                                    setPlayer(_args.player.id, _args.player.name)
                                } else if (_args.alliance != undefined) {
                                    setAllliance(_args.alliance.id, _args.alliance.name)
                                } else if (_args.town != undefined) {
                                    setTown(_args.town.id, _args.town.name, _args.town.ix, _args.town.iy)
                                }
                            }
                        } catch(e){
                            setGhost()
                        }
                    },
                    toWork: false
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
                    minheight: 550,
                    maxheight: 570,
                    width: 975,
                    tabs: [{
                        type: f.INDEX,
                        title: 'none',
                        content_view_constructor: a['GrcRTView_'+_IdS],//.RrcRTViewRadar,
                        hidden: !0
                    }],
                    max_instances: 1,
                    activepagenr: 0,
                    minimizable: !0,
                    resizable: !1,
                    title: RepConv.grcrt_window_icon + RepConvTool.GetLabel('RADAR.TOWNFINDER'),
                    special_buttons: {
                        help: {
                            action: {
                                type: "external_link",
                                url: RepConv.Scripts_url+'module/grchowto#radar'
                            }
                        }
                    }
                }, b)
            }
        }()
    }
}
