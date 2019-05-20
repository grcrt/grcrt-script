function _RepConvTool() {
    var _saveCount = 0;
    function clearCount(){
        _saveCount = 0;
    }
    this.checkSettings = function(){
        var defData = {}, setOK = true;
        defData[RepConv.CookieCmdImg] = true,
        defData[RepConv.CookieStatsGRCL] = 'potusek',
        defData[RepConv.CookieSounds] = { mute: false, volume: 100, url:'', loop:true};
        
        RepConv.settings = RepConv.settings || {}
        
        $.each(RepConv.sChbxs, function(opt, optData){
            if(RepConv.settings[opt] == undefined){
                RepConv.settings[opt] = JSON.parse(RepConvTool.getSettings(opt, optData.default)),
                setOK = false;
                RepConv.Debug && console.log(RepConv.CookieReportFormat)
            }
        })

        if(RepConv.settings[RepConv.CookieStatsGRCL] == undefined){
            RepConv.settings[RepConv.CookieStatsGRCL] = RepConvTool.getSettings(RepConv.CookieStatsGRCL, defData[RepConv.CookieStatsGRCL]),
            setOK = false;
            RepConv.Debug && console.log(RepConv.CookieStatsGRCL)
        }
        if(RepConv.settings[RepConv.CookieUnitsABH] == undefined){
            RepConv.settings[RepConv.CookieUnitsABH] = RepConvTool.getSettings(RepConv.CookieUnitsABH, "{}"),
            setOK = false;
            RepConv.Debug && console.log(RepConv.CookieUnitsABH)
        }
        if(RepConv.settings[RepConv.Cookie+'radar_cs'] == undefined){
            RepConv.settings[RepConv.Cookie+'radar_cs'] = RepConvTool.getSettings(RepConv.Cookie+'radar_cs', '06:00:00'),
            setOK = false;
            RepConv.Debug && console.log(RepConv.Cookie+'radar_cs')
        }
        if(RepConv.settings[RepConv.Cookie+'radar_points'] == undefined){
            RepConv.settings[RepConv.Cookie+'radar_points'] = JSON.parse(RepConvTool.getSettings(RepConv.Cookie+'radar_points', "0")),
            setOK = false;
            RepConv.Debug && console.log(RepConv.Cookie+'radar_points')
        }
        if(RepConv.settings[RepConv.CookieWall] == undefined){
            RepConv.settings[RepConv.CookieWall] = JSON.parse(RepConvTool.getItem(RepConv.CookieWall)) || [],
            setOK = false;
            RepConv.Debug && console.log(RepConv.CookieWall)
        }
        if(RepConv.settings[RepConv.Cookie] == undefined && RepConv.settings[RepConv.CookieWall].length > 0){
            RepConv.settings[RepConv.Cookie] = JSON.parse(RepConvTool.getItem(RepConv.Cookie)) || null,
            setOK = false;
            RepConv.Debug && console.log(RepConv.Cookie)
        }
        if(RepConv.settings[RepConv.CookieEmots] == undefined){
            RepConv.settings[RepConv.CookieEmots] = RepConvTool.getItem(RepConv.CookieEmots) || 'https://cdn.grcrt.net/emots2/237.gif\nhttps://cdn.grcrt.net/emots2/shake2.gif'
            setOK = false;
            RepConv.Debug && console.log(RepConv.CookieEmots)
        }
        if(RepConv.settings[RepConv.CookieSounds] == undefined){
            RepConv.settings[RepConv.CookieSounds] = JSON.parse(RepConvTool.getSettings(RepConv.CookieSounds, JSON.stringify(defData[RepConv.CookieSounds]))),
            setOK = false;
            RepConv.Debug && console.log(RepConv.CookieSounds)
        }

        if(!setOK){
            RepConv.Debug && console.log(_saveCount);
            RepConvTool.saveRemote();
            if (++_saveCount < 10) {
                setTimeout(function(){
                    RepConvTool.readRemote();
                },1000)
            } else {
                setTimeout(function(){
                    clearCount();
                },1000*60)
				setTimeout(function(){
					HumanMessage.error(RepConvTool.GetLabel('MSGHUMAN.ERROR'));
				},0)
            }
        } else {
            RepConv.active.power = RepConv.settings[RepConv.CookiePower],//, defData[RepConv.CookiePower]),
            RepConv.active.ftabs = RepConv.settings[RepConv.CookieForumTabs],//, defData[RepConv.CookieForumTabs]),
            RepConv.active.statsGRCL = RepConv.settings[RepConv.CookieStatsGRCL],//, defData[RepConv.CookieStatsGRCL]),
            RepConv.active.unitsCost = RepConv.settings[RepConv.CookieUnitsCost],//,defData[RepConv.CookieUnitsCost]),
            RepConv.active.reportFormat = RepConv.settings[RepConv.CookieReportFormat],//, defData[RepConv.CookieReportFormat]);
            RepConv.audioSupport && (RepConv.active.sounds = RepConv.settings[RepConv.CookieSounds]),
            this.useSettings()
        }
    }
    this.useSettings = function() {
        setTimeout(function(){
            var _posEmot = 0;

            RepConvAdds.emotsLists.usersaved = {
                    'img': 'emots2/wizard.gif',
                    'detail': []
            }
            if (RepConvTool.getItem(RepConv.CookieEmots)!=undefined) {
                $.each(RepConvTool.getItem(RepConv.CookieEmots).split('\n'), function(ind,elem){
                    RepConvAdds.emotsLists.usersaved.detail.push({'img':elem});
                })
            }
        }, 100);
        try{
            $('#grcrt_disable_quack').remove()
            if (RepConv.settings[RepConv.Cookie+'_idle']) {
                $('head').append($('<style/>',{'id':'grcrt_disable_quack'}).append('a.qt_activity {display: none !important;}'))
            }
        } catch(e){}
        $.Observer(GameEvents.grcrt.settings.load).publish();
        // load translate
        try {
            if (RepConv.settings[RepConv.Cookie+'_translate'] && RepConv.settings[RepConv.Cookie+'_translate'] != ''){
                var _lang = Game.locale_lang.substring(0,2);
                RepConvLangArray[_lang] = JSON.parse(RepConv.settings[RepConv.Cookie+'_translate']),
                RepConv.Lang = RepConvLangArray[_lang],
                RepConv.LangEnv = _lang;
            }
        } catch(e){}
        try{
            if(RepConv.settings[RepConv.Cookie+'_tacl']){
                $('#toolbar_activity_commands_list').addClass('grcrt_tacl')
                $('#grcrt_taclWrap').draggable().draggable('enable')
            } else {
                $('#toolbar_activity_commands_list').removeClass('grcrt_tacl')
                $('#grcrt_taclWrap').draggable().draggable('disable').removeAttr('style')
            }
        } catch(e){}
        
    }
    this.saveRemote = function(){
        RepConv.Debug && console.log('saveRemote');
        var __form = $('<form/>', {
            'action' : RepConv.grcrt_domain+'savedata.php',
            'method' : 'post',
            'target' : 'GRCSender'
        })
        .append($('<textarea/>',{'name': 'dest'}).text(RepConv.hash))
        .append($('<textarea/>',{'name': 'param'})
            .text(
                btoa(
                    JSON.stringify(RepConv.settings)
                        .replace(/[\u007f-\uffff]/g,
                                function(c) { 
                                        return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
                                }
                        )
                )
            )
        );
        $('#RepConvTMP').html(null),
        $('#RepConvTMP').append(__form),
        __form.submit(),
        this.useSettings();
    }
    this.readRemote = function(){
        RepConv.Debug && console.log('readRemote');
        $.ajax({
            type: "POST",
            url: RepConv.grcrt_domain+'readdata.php',
            data : { dest : RepConv.hash },
            dataType: "script",
            async : false
        })
        .done(function() {
            // RepConv.settings[RepConv.Cookie+'_wonder_trade'] = (RepConv.settings[RepConv.Cookie+'_wonder_trade']==undefined)?true:RepConv.settings[RepConv.Cookie+'_wonder_trade'];
            RepConv.settingsReaded = true,
            RepConvTool.checkSettings();
        })
    }
    this.setItem = function(item,value){
        RepConv.Debug && console.log('setItem('+item+')');
        if (typeof RepConv.settings == 'object') {
            RepConv.settings[item] = value,
            RepConvTool.saveRemote();
        }
    }
    this.getItem = function(item){
        RepConv.Debug && console.log('getItem('+item+')');
        if (typeof RepConv.settings == 'object') {
            if (typeof RepConv.settings[item] != 'undefined') {
                return RepConv.settings[item];
            }
        }
        if (typeof GM_getValue == 'function') {
            RepConv.Debug && console.log('... use GM');
            if (GM_getValue(item) == "undefined") {
                return null;
            }
            return GM_getValue(item);
        } else {
            RepConv.Debug && console.log('... use LS');
            if (localStorage.getItem(item) == "undefined") {
                return null;
            }
            return localStorage.getItem(item);
        }
    }
    this.removeItem = function(item){
        RepConv.Debug && console.log('removeItem('+item+')');
        if (typeof GM_deleteValue == 'function') {
            RepConv.Debug && console.log('... use GM');
            GM_deleteValue(item);
        } else {
            RepConv.Debug && console.log('... use LS');
            localStorage.removeItem(item);
        }
    }
    this.getSettings = function(item, defValue){
        if (RepConvTool.getItem(item) != null) {
            return RepConvTool.getItem(item);
        }
        if (localStorage.getItem(item) != null) {
            RepConvTool.setItem(item, localStorage.getItem(item));
            return RepConvTool.getItem(item);
        }
        RepConvTool.setItem(item, defValue);
        return RepConvTool.getItem(item);
    }
    this.GetLabel = function(label) {
        var _result,
        _labels = label.split('.'),
        _currLbls = RepConv.Lang;
        $.each(_labels, function(ind,lbl){
            if(ind+1 == _labels.length){
                if (_currLbls[lbl] != undefined) {
                    _result = _currLbls[lbl];
                }
            }
            _currLbls = _currLbls[lbl] || {};
        });
        return _result || this.getLabelLangArray(label);
    }
    this.GetLabel4Lang = function(label,lang) {
		var _result,
		_labels = label.split('.'),
		_currLbls = RepConvLangArray[lang];
		$.each(_labels, function(ind,lbl){
			if(ind+1 == _labels.length){
				if (_currLbls != undefined && _currLbls[lbl] != undefined) {
					_result = _currLbls[lbl];
				}
			}
			_currLbls = (_currLbls != undefined && _currLbls[lbl] != undefined) ? _currLbls[lbl] : {};
		});
        return _result || this.getLabelLangArray(label);
    }
    this.getLabelLangArray = function(label) {
		var _result,
		_labels = label.split('.'),
		_currLbls = RepConvLangArray.en;
		$.each(_labels, function(ind,lbl){
			if(ind+1 == _labels.length){
				if (_currLbls[lbl] != undefined) {
					_result = _currLbls[lbl];
				}
			}
			_currLbls = _currLbls[lbl] || {}
		});
        return _result || label;
    }
    this.getUnit = function(result, item, counts) {
        var list = -1;
        for (var ai = 0; ai < $(item).length; ai++) {
            if (ai % counts == 0) {
                if (list > -1) {
                    if (result[list].unit_list.length > 0) {
                        result[list].unit_img = RepConvTool.Adds((RepConv.Const.genImg).RCFormat(RepConvType.sign, result[list].unit_list), "img");
                    }
                }
                list++;
                result.Count = list;
            }
            if (result[list].unit_list.length > 0) {
                result[list].unit_list += ".";
            }
            var RCunit = RepConvTool.getUnitName($(item)[ai]);

            result[list].unit_list += RepConvTool.GetUnit(RCunit);
            result[list].unit_img += RepConvTool.GetUnit(RCunit);
            result[list].unit_send += RepConvTool.Unit($(item + ' span.place_unit_black')[ai].innerHTML, "000") + RepConvType.separator;
        }
        if (list > -1) {
            if (result[list].unit_list.length > 0) {
                result[list].unit_img = RepConvTool.Adds((RepConv.Const.genImg).RCFormat(RepConvType.sign, result[list].unit_list), "img");
            }
        }
        return result;
    },
    this.getUnitResource = function(result, item) {
        $.each($(item), function(ind, elem) {
            if (result.unit_list.length > 0) {
                result.unit_list += ".";
            }
            if (elem.childElementCount > 0) {
                var RCunit = RepConvTool.getUnitName(elem.children[0]);
                var RCcost = RepConvTool.GetUnitCost(RCunit);
                var RClost = elem.children[1].innerHTML.replace("-", "");
                if (RClost == "?") {
                    RClost = 0;
                } else {
                    result.w += RCcost.w * parseInt(RClost);
                    result.s += RCcost.s * parseInt(RClost);
                    result.i += RCcost.i * parseInt(RClost);
                    result.p += RCcost.p * parseInt(RClost);
                    result.f += RCcost.f * parseInt(RClost);
                }
            }
        });
        return result;
    }
    this.REPORTS = 'report'
    this.WALL = 'wall'
    this.AGORA = 'agora'
    this.COMMANDLIST = 'commandList'
    this.COMMAND = 'command'
    this.CONQUER = 'conquerold'
    this.groupsUnit = {
        defAtt: 'div#building_wall li:nth-child(4) div.list_item_left div.wall_unit_container div.wall_report_unit',
        defDef: 'div#building_wall li:nth-child(6) div.list_item_left div.wall_unit_container div.wall_report_unit',
        losAtt: 'div#building_wall li:nth-child(4) div.list_item_right div.wall_unit_container div.wall_report_unit',
        losDef: 'div#building_wall li:nth-child(6) div.list_item_right div.wall_unit_container div.wall_report_unit'
    }
    this.newVersion = function() {
        var lastVersion = "";
        if (RepConvTool.getItem(RepConv.CookieNew) != null) {
            lastVersion = RepConvTool.getItem(RepConv.CookieNew);
        }
        if (lastVersion != RepConv.Scripts_version) {
	    GRCRT_Notifications.addNotification(NotificationType.GRCRTWHATSNEW);
        }
    }
    this.Adds = function(value, adds) {
        if (value != undefined) {
            if (value.length > 0) {
                return "[" + adds + "]" + value + "[/" + adds + "]";
            }
        }
        return value;
    }
    this.AddSize = function(value, size) {
        if (value.length > 0 && $('#BBCODEA').attr('checked'))
            return "[size=" + size + "]" + value + "[/size]";
        return value;
    }
    this.AddFont = function(value, font) {
        if (value.length > 0 && font != "")
            return "[font=" + font + "]" + value + "[/font]";
        return value;
    }
    this.White = function(value, length) {
        //return RepConvTool.Color((RepConvType.blank).slice(1, length - value.length),'FFF');
        return (RepConvType.blank).slice(1, length - value.length);
    }
    this.Color = function(value, color) {
        return "[color=#" + color + "]" + value + "[/color]";
    }
    this.Unit = function(value, color) {
        RepConv.Debug && console.log(value);
        return RepConvTool.White(value, RepConvType.unitDigits) + value;
    }
    this.Value = function(value, len) {
        return RepConvTool.White(String(value), len) + String(value);
    }
    this.getUnitName = function(item) {
        if ($(item).attr('style') != null && $(item).attr('style').replace(/.*\/([a-z_]*)_[0-9]*x[0-9]*\.png.*/, '$1') != $(item).attr('style')) {
            return $(item).attr('style').replace(/.*\/([a-z_]*)_[0-9]*x[0-9]*\.png.*/, '$1');
        } else {
            for (var k in GameData.units) {
                if ($(item).hasClass(k)) {
                    return k.toString();
                }
            }
            for (var k in GameData.heroes) {
                if ($(item).hasClass(k)) {
                    return k.toString();
                }
            }
            for (var k in GameData.buildings) {
                if ($(item).hasClass('building_'+k)) {
                    return k.toString();
                }
            }
            for (var k in RepConv.academyCode) {
                if ($(item).hasClass(k)) {
                    return k.toString();
                }
            }
	    if ($(item).hasClass("unknown_naval")) {
		return "unknown_naval";
	    }
            return "unknown";
        }
    }
    this.getCommandIcon = function(item){
        for (var k in RepConv.commandImage){
            if ($(item).hasClass(RepConv.commandImage[k])) {
                return RepConvTool.Adds(RepConv.Const.uiImg + 'c/' + RepConv.commandImage[k] + '.png', 'img');
            }
        }
        return '';
    }
    this.getPowerIcon = function(item){
        if($(item).attr('data-power-id') != undefined){
	    var _lvl = '';
	    if($(item).attr('data-power-configuration') != undefined){
		_lvl = ($(item).attr('data-power-configuration').length>0)
			? '_l'+JSON.parse($(item).attr('data-power-configuration')).level
			: '';
	    }
            return RepConvTool.Adds(RepConv.Const.uiImg + 'pm/'  + $(item).attr('data-power-id') + _lvl +'.png', 'img');
        }
        for (var k in RepConv.powerImage){
            if ($(item).hasClass(RepConv.powerImage[k])) {
                return RepConvTool.Adds(RepConv.Const.uiImg + 'pm/'  + RepConv.powerImage[k] + '.png', 'img');
            }
        }
        return '';
    }
	this.GetUnit = function(attr) {
        return RepConv.unitsCode[attr] || "XX";
    }
    this.GetUnitCost = function(attr, ratio) {
        try {
	    _ratio = ratio || 1;
            return {
                w: Math.round(GameData.units[attr]['resources']['wood'] * _ratio),
                s: Math.round(GameData.units[attr]['resources']['stone'] * _ratio),
                i: Math.round(GameData.units[attr]['resources']['iron'] * _ratio),
                p: GameData.units[attr]['population'],
                f: Math.round(GameData.units[attr]['favor'] * _ratio)
            };
        } catch (ex) {
            return {w: 0, s: 0, i: 0, p: 0, f: 0};
        }
    }
	this.GetBuild = function(attr){
        return RepConv.buildCode[attr] || "XX";
    }
    this.GetImageCode = function(attr){
        return RepConv.buildCode[attr] || RepConv.unitsCode[attr] || RepConv.academyCode[attr] || "XX";
    }
    this.AddBtn = function(pId, pWndName) {
        var
            //WndName = (typeof pWndName != 'undefined') ? pWndName : '',
            WndName = pWndName || '',
            _btn = $('<div/>', {
            'class' : 'button_new',
            'id'    : pId + WndName,
            'name'  : RepConvTool.GetLabel(pId),
            'style' : "float: right; margin: 2px; ",
            'rel'   : '#' + WndName
            }).button({
                'caption' : RepConvTool.GetLabel(pId)
            });
            RepConv.Debug && console.log(WndName);
        return _btn;
    }
    this.TownObj = ''
    this.Ramka = function(title, body, height) {
        var
            tmpheight = height || 300,
            ramka = $('<div/>', {'class': 'game_border'})
                .append($('<div/>', {'class': 'game_border_top'}))
                .append($('<div/>', {'class': 'game_border_bottom'}))
                .append($('<div/>', {'class': 'game_border_left'}))
                .append($('<div/>', {'class': 'game_border_right'}))

                .append($('<div/>', {'class': 'game_border_corner corner1'}))
                .append($('<div/>', {'class': 'game_border_corner corner2'}))
                .append($('<div/>', {'class': 'game_border_corner corner3'}))
                .append($('<div/>', {'class': 'game_border_corner corner4'}))

                .append($('<div/>', {'class': 'game_header bold', 'style': 'height:18px;'})
                    .append($('<div/>', {'style': 'float:left; padding-right:10px;'}).html(title))
                );
        tmpheight -= 18; 	// nagłówek
        tmpheight -= (2 * 4); // marginesy
        tmpheight -= (2 * 4); // ramki górna i dolna
        $(ramka).append(
            $('<div/>', {'class':'grcrt_frame','style': 'overflow-x: hidden; padding-left: 5px; position: relative;'})
                .html(body)
                .height(tmpheight || 300)
        );
        $(ramka).append(
            $('<div/>', {'class': "game_list_footer", 'id': 'RepConvBtns', 'style': 'display: none;'})
        );
        return $('<div/>', {'class': 'inner_box'}).append(ramka);
    }
    this.RamkaLight = function(title, body) {
        var ramka = $('<div/>');
        $(ramka)
            .append($('<div/>', {'class': 'box top left'})
                .append($('<div/>', {'class': 'box top right'})
                    .append($('<div/>', {'class': 'box top center'}))
                )
            )
            .append($('<div/>', {'class': 'box middle left'})
                .append($('<div/>', {'class': 'box middle right'})
                    .append($('<div/>', {'class': 'box middle center'})
                        .append($('<span/>', {'class': 'town_name'}).html(title))	//small
                        .append($('<div/>', {'class': 'box_content'}).html(body))
                    )
                )
            )
            .append($('<div/>', {'class': 'box bottom left'})
                .append($('<div/>', {'class': 'box bottom right'})
                    .append($('<div/>', {'class': 'box bottom center'}))
                )
            );
        return ramka;
    }
    this.insertBBcode = function(startTag, endTag, elementid) {
        var input = elementid;
        $(input).focus();
        if (typeof document.selection != 'undefined') {
            var range = document.selection.createRange();
            var insText = range.text;
            range.text = startTag + insText + endTag;
            range = document.selection.createRange();
            if (insText.length == 0) {
                range.move('character', -endTag.length);
            } else {
                range.moveStart('character', startTag.length + insText.length + endTag.length);
            }
            range.select();
        } else if (typeof input.selectionStart != 'undefined') {
//                           console.log("AAinsertBBcode");
            input.focus();
            var start = input.selectionStart;
            var end = input.selectionEnd;
            var sts = input.scrollTop;
            var ste = input.scrollHeight;
            var insText = input.value.substring(start, end);
            input.value = input.value.substr(0, start) + startTag + insText + endTag + input.value.substr(end);
            var pos;
            if (insText.length == 0) {
                pos = start + startTag.length;
            } else {
                pos = start + startTag.length + insText.length + endTag.length;
            }
            input.selectionStart = pos;
            input.selectionEnd = pos;
            input.scrollTop = sts + input.scrollHeight - ste;
        }
    }
    this.addsEmots = function(RCGP, wraper, area) {
        if ((RCGP.getJQElement()).find('#emots_popup_' + RCGP.type).length == 0) {
            (RCGP.getJQElement()).find($('.bb_button_wrapper')).append(
                $('<div/>', {'id': 'emots_popup_' + RCGP.type, 'style': 'display:none; z-index: 5000;'}) /*, 'class' : 'bb_sizes'})*/
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
                            .append($('<div/>', {'class': 'bbcode_box content clearfix', 'style': 'overflow-y:auto !important; max-height: 185px;'}))
					).css({'position': 'absolute', 'top': '27px', 'left': '455px', 'width': '300px'})
			);
            $.each(RepConvAdds.emots, function(ind, emot) {
                ((RCGP.getJQElement()).find('#emots_popup_' + RCGP.type + ' .content'))
                    .append(
                        $('<img/>', {'src': emot.img, 'title': emot.title})
                            .click(function() {
                                RepConvTool.insertBBcode('[img]' + $(this).attr('src') + '[/img]', '', (RCGP.getJQElement()).find(area)[0]);
                                $('#emots_popup_' + RCGP.type).toggle();
                            })
                    );
	    });
            (RCGP.getJQElement()).find(wraper).append(
                $('<img/>', {'src': RepConv.Scripts_url + 'emots/usmiech.gif', 'style': 'cursor: pointer;'})
                    .click(function() {
                        $('#emots_popup_' + RCGP.type).toggle();
                    })
	    );
            (RCGP.getJQElement()).find(wraper).append(
                $('<img/>', {'src': RepConv.Const.uiImg + 'paste_report.png', 'style': 'cursor: pointer;'})
                    .click(function() {
                        if(RepConv.ClipBoard != undefined){
                            RepConvTool.insertBBcode(RepConv.ClipBoard, '', (RCGP.getJQElement()).find(area)[0])
                        }
                    })
		    .mousePopup(new MousePopup(RepConvTool.GetLabel('POPINSERTLASTREPORT')))
	    )
	}
    }
    this.loadPower = function() {
        if (RepConv.active.power) {
            RepConv.Debug && console.log('loadPower');
            $.each($('div.gods_spells_menu .god_container div.new_ui_power_icon div[name=counter]'), function(ind, elem) {
                $(elem).remove();
            });
            $.each($('div.gods_spells_menu .god_container div.new_ui_power_icon.disabled'), function(ind, elem) {
                power = GameData.powers[$(elem).attr('data-power_id')],
                god = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id}).getCurrentProductionOverview()[power.god_id],
                _godCurr = MM.checkAndPublishRawModel('PlayerGods', {id : Game.player_id})[power.god_id+'_favor_delta_property'].calculateCurrentValue().unprocessedCurrentValue,
                marg =27;
                if(god.production > 0){
                    $(elem).append(
                        $('<div/>',{
                            'style': 'margin-top:'+marg+'px;color:white;text-shadow: 1px 1px 1px black;font-size:7px;z-index:3000;',
                            'name': 'counter'
                        })
                        .countdown(
                            (Timestamp.server() + (((power.favor - _godCurr/*god.current*/) / god.production) * 60 * 60))
                        )
                    );
                }
            });
        }
    }
    this.BBC2HTML = function(S){
            if (S.indexOf('[') < 0) return S;
            
            function X(p, f) {return new RegExp(p, f)}
            function D(s) {return rD.exec(s)}
            function R(s) {return s.replace(rB, P)}
            function A(s, p) {for (var i in p) s = s.replace(X(i, 'g'), p[i]); return s;}
            function tableAdds(s) {
                    var x = s.replace('"','').split('\,');
                    var r = '';
                    $.each(x, function(xi, xe){
                            y = xe.split('\:');
                            r += ' '+y[0]+'="'+y[1]+'"';
                            //r = s.replace(X(i, 'g'), p[i]);
                    })
                    return r;
            }
            
            function P($0, $1, $2, $3) {
                    
              if ($3 && $3.indexOf('[') > -1) $3 = R($3);
              switch ($1) {
                    case 'url':
                    case 'anchor':
                    case 'email':
                            return '<a '+ L[$1] + ($2||$3) +'">'+ $3 +'</a>';
                    case 'img':
                            var d = D($2);
                            return '<img src="'+ $3 +'"'+ (d ? ' width="'+ d[1] +'" height="'+ d[2] +'"' : '') +' alt="'+ (d ? '' : $2) +'" />';
                    case 'flash':
                    case 'youtube':
                            var d = D($2)||[0, 425, 366];
                            return '<object type="application/x-shockwave-flash" data="'+ Y[$1] + $3 +'" width="'+ d[1] +'" height="'+ d[2] +'"><param name="movie" value="'+ Y[$1] + $3 +'" /></object>';
                    case 'float':
                            return '<span style="float: '+ $2 +'">'+ $3 +'</span>';
                    case 'left':
                    case 'right':
                    case 'center':
                    case 'justify':
                            return '<div style="text-align: '+ $1 +'">'+ $3 +'</div>';
                    case 'google':
                    case 'wikipedia':
                            return '<a href="'+ G[$1] + $3 +'">'+ $3 +'</a>';
                    case 'b':
                    case 'i':
                    case 'u':
                    case 's':
                    case 'sup':
                    case 'sub':
                    case 'h1':
                    case 'h2':
                    case 'h3':
                    case 'h4':
                    case 'h5':
                    case 'h6':
                    case 'table':
                    case 'tr':
                    case 'th':
                    case 'td':
                            var ddd = '';
                            if($2 != undefined){
                                    ddd = tableAdds($2);
                            }
                            return '<'+ $1 + ddd +'>'+ $3 +'</'+ $1 +'>';
                    case 'row': case 'r':case 'header':case 'head':case 'h':case 'col':case 'c': return '<'+ T[$1] +'>'+ $3 +'</'+ T[$1] +'>';
                    case 'acronym':case 'abbr': return '<'+ $1 +' title="'+ $2 +'">'+ $3 +'</'+ $1 +'>';
              }
              return '['+ $1 + ($2 ? '='+ $2 : '') +']'+ $3 +'[/'+ $1 +']';
            }
            
            var rB = X('\\[([a-z][a-z0-9]*)(?:=([^\\]]+))?]((?:.|[\r\n])*?)\\[/\\1]', 'g'), rD = X('^(\\d+)x(\\d+)$');
            var L = {url: 'href="', 'anchor': 'name="', email: 'href="mailto: '};
            var G = {google: 'http://www.google.com/search?q=', wikipedia: 'http://www.wikipedia.org/wiki/'};
            var Y = {youtube: 'http://www.youtube.com/v/', flash: ''};
            var T = {row: 'tr', r: 'tr', header: 'th', head: 'th', h: 'th', col: 'td', c: 'td'};
            var C = {notag: [{'\\[': '&#91;', ']': '&#93;'}, '', ''], code: [{'<': '&lt;'}, '<code><pre>', '</pre></code>']};
            C.php = [C.code[0], C.code[1]+ '&lt;?php ', '?>'+ C.code[2]];
            var F = {font: 'font-family:$1', size: 'font-size:$1px', color: 'color:$1'};
            var U = {c: 'circle', d: 'disc', s: 'square', '1': 'decimal', a: 'lower-alpha', A: 'upper-alpha', i: 'lower-roman', I: 'upper-roman'};
            var I = {}, B = {};
            
            for (var i in C) I['\\[('+ i +')]((?:.|[\r\n])*?)\\[/\\1]'] = function($0, $1, $2) {return C[$1][1] + A($2, C[$1][0]) + C[$1][2]};
            for (var i in F) {B['\\['+ i +'=([^\\]]+)]'] = '<span style="'+ F[i] +'">'; B['\\[/'+ i +']'] = '</span>';}
            B['\\[list]'] = '<ul>'; B['\\[list=(\\w)]'] = function($0, $1) {return '<ul style="list-style-type: '+ (U[$1]||'disc') +'">'}; B['\\[/list]'] = '</ul>'; B['\\[\\*]'] = '<li>';
            B['\\[quote(?:=([^\\]]+))?]'] = function($0, $1) {return '<div class="bb-quote">'+ ($1 ? $1 +' wrote' : 'Quote') +':<blockquote>'}; B['\\[/quote]'] = '</blockquote></div>';
            B['\\[(hr|br)]'] = '<$1 />'; B['\\[sp]'] = '&nbsp;';
            return R(A(A(S, I), B));
    }
    this.addLine = function(width){
	    return "[img]"+RepConv.Const.unitImg+width+".png[/img]";
    }
    this.Atob = function(value) {
        var href = value.split(/#/);
        return atob(href[1] || href[0]);
    }
    this.getCaller = function(caller){ 
        caller = caller.substr('function '.length);
        caller = caller.substr(0, caller.indexOf('('));
        return caller;
    }
    this.hexToRGB = function(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    }
    this.getPlayerColor = function(hash, __ally){
        var 
            _mmcc = MM.getOnlyCollectionByName("CustomColor"),
            _defc = require("helpers/default_colors"),
            _ffty = require("enums/filters"),
            _json = JSON.parse(RepConvTool.Atob(hash)),
            _color = undefined;
        if (_json.id == Game.player_id) {
            _color = _defc.getDefaultColorForPlayer(Game.player_id)
        }

        if(!_color){
            _color = _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES.PLAYER,_json.id) && _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES.PLAYER,_json.id).getColor()
        }

        if(!_color){
            if(RepConvTool.getPlayerData(_json.id) && RepConvTool.getPlayerData(_json.id).alliance_id){
                if(RepConvTool.getPlayerData(_json.id).alliance_id == Game.alliance_id){
                    _color = (
                            _mmcc.getCustomColorByIdAndType(_ffty.ALLIANCE_TYPES.OWN_ALLIANCE,RepConvTool.getPlayerData(_json.id).alliance_id) &&
                            _mmcc.getCustomColorByIdAndType(_ffty.ALLIANCE_TYPES.OWN_ALLIANCE,RepConvTool.getPlayerData(_json.id).alliance_id).getColor()
                            ||
                            _defc.getDefaultColorForAlliance(RepConvTool.getPlayerData(_json.id).alliance_id)
                        )
                } else {
                    _color = (
                        (
                            __ally[RepConvTool.getPlayerData(_json.id).alliance_id] && 
                            (
                                _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES[__ally[RepConvTool.getPlayerData(_json.id).alliance_id]],RepConvTool.getPlayerData(_json.id).alliance_id)  && 
                                _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES[__ally[RepConvTool.getPlayerData(_json.id).alliance_id]],RepConvTool.getPlayerData(_json.id).alliance_id).getColor()
                                ||
                                _defc.getDefaultColorForAlliance(RepConvTool.getPlayerData(_json.id).alliance_id)
                            )
                        )
                        ||
                        (
                            RepConvTool.getPlayerData(_json.id).alliance_id && 
                            (
                                _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES.ALLIANCE,RepConvTool.getPlayerData(_json.id).alliance_id) && 
                                _mmcc.getCustomColorByIdAndType(_ffty.FILTER_TYPES.ALLIANCE,RepConvTool.getPlayerData(_json.id).alliance_id).getColor()
                                ||
                                _defc.getDefaultColorForAlliance(RepConvTool.getPlayerData(_json.id).alliance_id)
                            )
                        )
                    )
                }
            } else {
                _color = _defc.getDefaultColorForPlayer(_json.id,Game.player_id)
                // console.log(RepConv.cachePlayers[_json.id].alliance_id+" = "+_color)
            }
        }
        return _color;
    }

    $('<iframe/>',{'id':'GRCSender','name':'GRCSender','style':'display:none'}).appendTo($('body'));
    
    function getServerData(){
        var txtFile, lineData, _players = {}, _alliances = {};
        if (typeof RepConv != "object"){
            setTimeout(function(){
                getServerData()
            },1000*10)
        } else {
            try{
                $.ajax({
                    'method':'get',
                    'url' : '/data/players.txt'
                })
                .done(function(dataResult){
                    try{
                        $.each(dataResult.split(/\r\n|\n/), function(line,data){
                            lineData = data.split(/,/);
                            _players[lineData[0]] = {
                                id : lineData[0],
                                name : decodeURIComponent(lineData[1]+'').replace(/\+/g, ' '),
                                alliance_id : lineData[2]
                            }
                        })
                        RepConv.cachePlayers = _players;
                    } catch(e) {
                        e.silent = true;
                        grcrtErrReporter(e);
                    }
                })
            } catch(e) {
                e.silent = true;
                grcrtErrReporter(e);
            }
            try{
                $.ajax({
                    'method':'get',
                    'url' : '/data/alliances.txt',
                })
                .done(function(dataResult){
                    try{
                        $.each(dataResult.split(/\r\n|\n/), function(line,data){
                            lineData = data.split(/,/);
                            _alliances[lineData[0]] = {
                                id : lineData[0],
                                name : decodeURIComponent(lineData[1]+'').replace(/\+/g, ' ')
                            }
                        })
                        RepConv.cacheAlliances = _alliances;
                    } catch(e) {
                        e.silent = true;
                        grcrtErrReporter(e);
                    }
                })
            } catch(e) {
                e.silent = true;
                grcrtErrReporter(e);
            }
            setTimeout(function(){
                getServerData()
            },1000*60*10)
        }
    }
    getServerData();

    this.getPlayerData = function(pId){
        try {
            return RepConv.cachePlayers[pId];
            // return JSON.parse(sessionStorage.getItem('P_'+pId));
        } catch(e){}
        return null;
        // return {id:null, name:null, alliance_id:null};
    }
    this.getAllianceData = function(aId){
        try {
            return RepConv.cacheAlliances[aId];
            // return JSON.parse(sessionStorage.getItem('A_'+aId));
        } catch(e){}
        return null;
        // return {id:null, name:null};
    }
}
