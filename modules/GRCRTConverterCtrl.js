function _GRCRTConverterCtrl(wnd) {
    "use strict";

    //this.getRSD = function(){
    //    return rShowDiff;
    //}

    // funkcje reuzywalne
    function getWindowType(RCGP) {
        if (typeof RCGP.getController == 'undefined') {
            return RCGP.getType()
        }
        switch (RCGP.getController()) {
            case "building_place" : // agora
                switch (RCGP.getContext().sub) {
                    case "building_place_index" :
                        return "agoraD";
                    case "building_place_units_beyond" :
                        return "agoraS";
                }
                break;
            case "building_wall" : // mur
                return "wall";
            case "command_info" : // pojedynczy rozkaz
                switch (RCGP.getContext().sub) {
		    case "command_info_colonization_info":
                    case "command_info_info" :
                        return "command";
                    case "command_info_conquest_info" :
                        return "conquerold";
                    case "command_info_conquest_movements" :
                        return "conqueroldtroops";
                }
                break;
            case "report" :
                switch (RCGP.getContext().sub) {
                    case "report_view" :
                        var _res = getType(_content.find($('div#report_arrow img')).attr('src'));
                        if ((_res == "attack") && (_content.find($('div.support_report_summary')).length != 0)) {
                            _res = "attackSupport";
                        }
                        return _res;
                }
                break;
            case "town_info" : // informacja o miescie
                switch(RCGP.getContext().sub){
                    case "town_info_support" :
                        return "ownTropsInTheCity";
                }
                break;
            case "town_overviews" :
                return "commandList";
            case "conquest_info" : // informacja o miescie
                return "conquest";
            case "island_info" :
                switch (RCGP.getContext().sub) {
                    case "island_info_index":
                        return "bbcode_island";
                }
            case "player" :
                switch (RCGP.getContext().sub) {
                    case "player_get_profile_html" :
                        return "bbcode_player"
                }
                break;
            case "alliance" :
                switch (RCGP.getContext().sub) {
                    case "alliance_profile" :
                        return "bbcode_alliance"
                }
                break;
            case "building_main" :
                return "main";
                break;
        }
        return '';
    }

    function genCheckBox(pName, pChecked, pLabel) {
        return $('<div/>', {'class':'checkbox_new'})
		.checkbox({
		    caption: RepConvTool.GetLabel(pLabel || pName),
		    checked: pChecked,
		    cid: pName
		}).on("cbx:check", function(){
		    readyGenerate();
		});
    }
    function genId(value) {
        return $.md5(value);
        //return Math.random().toString(36).substr(2)+Timestamp.server().toString(36);
    }
    function genImages(result, pSize, pMargin, fontSize){
        $.each(result, function(ii,ee){
            genImage(ee, pSize, pMargin, fontSize);
        })
    }
    function genImage(element, pSize, pMargin, fontSize){
        if (typeof element.ua != 'undefined') {
            if (element.ua.length > 0) {
                var
                    _pSize = pSize || GRCRTtpl.rct.genImgS,
                    _pMargin = pMargin || GRCRTtpl.rct.genImgM,
                    _fontSize = fontSize || 11*(GRCRTtpl.rct.genImgS/50),
                    _md5 = genId(imgCache(element.ua, _pSize, _pMargin, _fontSize));
                element.img_url = RepConvTool.Adds(getUrlMD5(_md5),'img');
                RepConv.Debug && console.log(_md5);
                $.ajax({
                    type: "POST",
                    url: RepConv.grcrt_domain+'imgdata.php',
                    data : { param : btoa(imgCache(element.ua, _pSize, _pMargin, _fontSize)), dest : _md5 },
                    dataType: "script",
                    async : false
                });
            }
        }
    }
    function getType(_where){
        RepConv.Debug && console.log("getType");
        var
            _whats = [
                "raise",
                "conquer",
                "illusion",
                "breach",
                "attack",
                "take_over",
                "conqueroldtroops",
                "commandList",
                "conquerold",
                "support",
                "attackSupport",
                "agoraD",
                "agoraS",
                "espionage",
                "powers",
                "wall",
                "found",
                "conquest",
                "academy",
                "main",
                "ownTropsInTheCity"
            ],
            _res = null;
        $.each(_whats, function(ind,_what){
            if (_where.indexOf(_what)>-1) {
                _res = _what;
            }
        })
    	return _res;
    }
    function imgCache(pua, size, margin, fontSize){
        var
            _json = {
                ua : pua,
                s : size,
                m : margin,
                fs : fontSize || 11*(GRCRTtpl.rct.genImgS/50)
            },
            _hash = JSON.stringify(_json);
        return _hash;
    }
    function getUrlMD5(source){
        return RepConv.grcrt_domain+"_img_cache_/"+source.substr(0,2)+"/"+source+".png";
    }
    function BBC2HTML(S){
        if (S.indexOf('[') < 0) return S;
        function X(p, f) {return new RegExp(p, f)}
        function D(s) {return rD.exec(s)}
        function R(s) {return s.replace(rB, P)}
        function A(s, p) {for (var i in p) s = s.replace(X(i, 'g'), p[i]); return s;}
        function tableAdds(s) {
                var x = s.replace('"','').split('\,');
                var r = '';
                $.each(x, function(xi, xe){
                    var y = xe.split('\:');
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
    function bbcode2html(value, destination) {
        RepConv.Debug && console.log("bbcode2html");
        var params = {message: value};
        RepConv.Debug && console.log(value.length);
        //$(destination).html(RepConvTool.GetLabel('MSG413ERR'));
        var _method = 'post';
        gpAjax._ajax(
            'message',
            'preview',
            params,
            true,
            function(data) {
                RepConv.Debug && console.log(data.message);
                $(destination).html(data.message);
            },
            _method);
    }
    function bbcode2img(value, destination) {
        RepConv.Debug && console.log("bbcode2img");
        var _send =
            $.ajax({
                'url' : RepConv.grcrt_domain+'bbcode2html.php?ModPagespeed=off',
                'method' : 'post',
                'data' : {html:RepConv.__repconvValueBBCode},
                'cache':false,
                'async':false
            });
        /*return "[img]"+RepConv.grcrt_domain+"repimg.php?rep="+_send.responseJSON.filename+"[/img]\n\n";*/
        return "[img]"+RepConv.grcrt_domain+"_rep_img_/"+_send.responseJSON.filename.substr(0,2)+"/"+_send.responseJSON.filename+".png[/img]\n\n";
    }
    function setTextArea(repconvValue) {
        if ($('#repConvArea').length == 1) {
            $('#repConvArea').remove();
        }
        if ($('#RepConvDivPrev').length == 1) {
            $('#RepConvDivPrev').remove();
        }
        var bbcodeAsImg = (rBbcode.getValue() == 'BBCODEI') ? bbcode2img(repconvValue, bbCodeViewS) : null;
        var bbCode =
            $('<textarea/>', {
                    'style': RepConv.Const.textareastyle,
                    'id': 'repConvArea',
                    'readonly': 'readonly',
                    //'value': repconvValue
            })
            .text((rBbcode.getValue() == 'BBCODEI') ? bbcodeAsImg : repconvValue)
            .click(function() {
                this.select();
            })
            .height(_ramkaHeight - 6)
            .hide();
        var bbCodeViewS = $('<span/>', {'class': "monospace", 'id': 'RepConvSpanPrev'});
        var bbCodeView =
            $('<div/>', {
                'style': 'background-color: #fff; height: 225px; width: 753px; overflow-y: scroll; font-size: 100%;',// padding: 0 15px',
                'id': 'RepConvDivPrev',
                'class': 'quote_message small '
            })
	    .width((rBbcode.getValue() == 'BBCODEA') ? 805 : 777)
	    .css('padding',(rBbcode.getValue() == 'BBCODEA') ? '0px' : '0 15px')
            .height(_ramkaHeight)
            .append(bbCodeViewS);
        if( rBbcodeType.getValue() == 'BBCODEH' && rBbcode.getValue() == 'BBCODEE'){
            $(bbCodeViewS).append(BBC2HTML(repconvValue));
        } else {
            bbcode2html((rBbcode.getValue() == 'BBCODEI') ? bbcodeAsImg : repconvValue, bbCodeViewS);
            if(rBbcode.getValue() == 'BBCODEI'){
                RepConv.__repconvValueArray = [bbcodeAsImg];
                RepConv.__repconvHtmlArray = null;
            }
        }
        $('#RepConvAreas div.box_content').append(bbCode),
        $('#RepConvAreas div.box_content').append(bbCodeView);
            if (rBbcode.getValue() != 'BBCODEE') {
                RepConv.ClipBoard = repconvValue;
                $('#RepConvBtns div.RepConvMsg')
                    .html(RepConvTool.GetLabel('MSGCOPYREPORT').replace('[paste_icon]','<img src="'+RepConv.Const.uiImg+'paste_report.png'+'" style="vertical-align: text-top;"/>'))
                    .fadeOut(50)
                    .fadeIn(500);
            }
    }
    function storeHtml(__repconvValueArray,_dest){
        if(( rBbcodeType.getValue() != 'BBCODEH' || rBbcode.getValue() != 'BBCODEE') && rBbcode.getValue() != 'BBCODEI'){
            RepConv['__repconvHtmlArray'+_dest] = []
            $.each(__repconvValueArray, function(ind,repconvValue){
                var _res = $('<div/>');
                var params = {message: repconvValue};
                RepConv.Debug && console.log(repconvValue.length);
                gpAjax._ajax(
                    'message',
                    'preview',
                    params,
                    true,
                    function(data) {
                        RepConv.Debug && console.log(data.message);
                        RepConv['__repconvHtmlArray'+_dest].push(data.message);
                    },
                    'post');
            })
        }
    }
    function __getReportTitle(){
        RepConv.Debug && console.log("__getReportTitle");
        report.title = _content.find($('#report_report_header')).html().stripTags().replace('&nbsp;', ' ').trim();
    }
    function __getReportTime(){
        RepConv.Debug && console.log("__getReportTime");
        report.time = '(' + _content.find($('#report_date')).html() + ') ';
    }
    function __getReportType(){
        RepConv.Debug && console.log("__getReportType");
        __getReportMorale();
    }
    function __getReportMorale(){
        RepConv.Debug && console.log("__getReportMorale");
        report.morale = (_content.find($('span.fight_bonus.morale')).length == 0)
			? ''
			: GRCRTtpl.rct.morale + _content.find($('span.fight_bonus.morale')).html().stripTags().trim();
    }
    function __getReportLuck(){
        RepConv.Debug && console.log("__getReportLuck");
        report.luck = (_content.find($('span.fight_bonus.luck')).length == 0)
			? ''
			: GRCRTtpl.rct.luck + _content.find($('span.fight_bonus.luck')).html().stripTags().trim();
        if (report.luck.indexOf("-") > -1) {
            report.luck = "[color=#b50307]" + report.luck + "[/color]";
        }
    }
    function __getReportOldWall(){
        RepConv.Debug && console.log("__getReportOldWall");
        report.oldwall = {};
        if (_content.find($('span.fight_bonus.oldwall')).length == 0) {
            report.oldwall[0] = '';
        } else {
            $.each(_content.find($('span.fight_bonus.oldwall')), function(ind,elem){
            report.oldwall[ind] = $(elem).html().stripTags().trim();
            })
        }
    }
    function __getReportNightBonus(){
        RepConv.Debug && console.log("__getReportNightBonus");
        report.nightbonus = (_content.find($('span.fight_bonus.nightbonus')).length == 0)
			? ''
			: GRCRTtpl.rct.nightbonus + _content.find($('span.fight_bonus.nightbonus')).html().stripTags().trim();
    }
    function __getReportResources(){
        RepConv.Debug && console.log("__getReportResources");
        var _UA = {};
        report.resources = __initResources(),
        report.resources.title = ((_content.find($('div#resources h4')).length == 0)
                ? _content.find($('div#resources p')).html()
                : _content.find($('div#resources h4')).html())||' ',
        $.each(_content.find($('div#resources li.res_background div')), function(indR, elemR){
            switch(elemR.className){
            case "wood_img":
                        _UA = {
                            i : 'S1',
                            b : $(elemR).nextAll().text()
                        },
                        report.resources.ua.push(_UA),
                report.resources.wood = $(elemR).nextAll().text();
                //report.resources.count += RepConvTool.Unit(report.resources.wood, "000") + GRCRTtpl.rct.separator;
                break;
            case "stone_img":
                        _UA = {
                            i : 'S2',
                            b : $(elemR).nextAll().text()
                        },
                        report.resources.ua.push(_UA),
                report.resources.stone = $(elemR).nextAll().text();
                //report.resources.count += RepConvTool.Unit(report.resources.stone, "000") + GRCRTtpl.rct.separator;
                break;
            case "iron_img":
                        _UA = {
                            i : 'S3',
                            b : $(elemR).nextAll().text()
                        },
                        report.resources.ua.push(_UA),
                report.resources.iron = $(elemR).nextAll().text();
                //report.resources.count += RepConvTool.Unit(report.resources.iron, "000") + GRCRTtpl.rct.separator;
                break;
            case "favor_img":
                        _UA = {
                            i : 'S4',
                            b : $(elemR).nextAll().text()
                        },
                        report.resources.ua.push(_UA),
                report.resources.power = $(elemR).nextAll().text();
                //report.resources.count += RepConvTool.Unit(report.resources.power, "000") + GRCRTtpl.rct.separator;
                break;
            }
        })
        genImage(report.resources, 30, GRCRTtpl.rct.genImgM+5, 7.5)
    }
    function __getReportResources2(){
        RepConv.Debug && console.log("__getReportResources2");
        var _UA = {};
        report.resources = __initResources(),
        report.resources.title = _content.find($('#right_side>h4')).eq(1).html()||' ',
        $.each(_content.find($('#right_side>div.spy_success_left_align')).eq(1).find($('li.res_background div')), function(indR, elemR){
            switch(elemR.className){
            case "wood_img":
                        _UA = {
                            i : 'S1',
                            b : $(elemR).nextAll().text()
                        },
                        report.resources.ua.push(_UA),
                report.resources.wood = $(elemR).nextAll().text();
                //report.resources.count += RepConvTool.Unit(report.resources.wood, "000") + GRCRTtpl.rct.separator;
                break;
            case "stone_img":
                        _UA = {
                            i : 'S2',
                            b : $(elemR).nextAll().text()
                        },
                        report.resources.ua.push(_UA),
                report.resources.stone = $(elemR).nextAll().text();
                //report.resources.count += RepConvTool.Unit(report.resources.stone, "000") + GRCRTtpl.rct.separator;
                break;
            case "iron_img":
                        _UA = {
                            i : 'S3',
                            b : $(elemR).nextAll().text()
                        },
                        report.resources.ua.push(_UA),
                report.resources.iron = $(elemR).nextAll().text();
                //report.resources.count += RepConvTool.Unit(report.resources.iron, "000") + GRCRTtpl.rct.separator;
                break;
            case "favor_img":
                        _UA = {
                            i : 'S4',
                            b : $(elemR).nextAll().text()
                        },
                        report.resources.ua.push(_UA),
                report.resources.power = $(elemR).nextAll().text();
                //report.resources.count += RepConvTool.Unit(report.resources.power, "000") + GRCRTtpl.rct.separator;
                break;
            }
        })
        genImage(report.resources, 30, GRCRTtpl.rct.genImgM+5, 7.5)
    }
    function __getReportBunt(){
        RepConv.Debug && console.log("__getReportBunt");
        report.bunt = '';
        if ((_content.find($('div#resources h4')).length == 0) && (_content.find($('div#resources>span')).length == 1)) {
            report.bunt = _content.find($('div#resources>span')).html().stripTags();
        } else if ((_content.find($('div#resources>h4')).length == 1) && (_content.find($('div#resources>span')).length == 2)) {
            report.bunt = _content.find($('div#resources>span')).eq(1).html().stripTags();
        } else if ((_content.find($('div#resources>h4')).length == 1) && (_content.find($('div#resources>span')).length == 1)) {
            report.bunt = _content.find($('div#resources>span')).eq(0).html().stripTags();
        }
    }
    function revoltClosestCS (_playerId, _townDefender) {
        var _sesItem = 'CS_'+_playerId+'_'+_townDefender.id;
        if (sessionStorage.getItem(_sesItem) && JSON.parse(sessionStorage.getItem(_sesItem)).timestamp+60*10 > Timestamp.server()) {
            return JSON.parse(sessionStorage.getItem(_sesItem)).CsTime;
        }
        var
            _townsCS = {},
            _json = {
                'player_id' : _playerId,
                'town_id' : Game.townId,
                'nl_init' : NotificationLoader.isGameInitialized()
            },
            _getAllyReq = $.ajax({
                            url: '/game/player?action=get_profile_html&town_id='+Game.townId+
                                    '&h='+Game.csrfToken+'&json='+JSON.stringify(_json),
                            async: false
                        }),
            _minCsTime = null,
            _minVector = Math.floor(Math.sqrt(Math.pow(100,2)+Math.pow(100,2))),
            _aq = $('<pre/>').append(JSON.parse(_getAllyReq.responseText).plain.html);
        $.each(_aq.find('.gp_town_link'), function(ind, elem){
            var
                _town = JSON.parse(RepConvTool.Atob($(elem).attr('href'))),
            _vector = Math.floor(Math.sqrt(Math.pow(_townDefender.ix-_town.ix,2)+Math.pow(_townDefender.iy-_town.iy,2)));
            _minVector = Math.min(_minVector, _vector);
            if (_townsCS[_vector] == undefined){
                _townsCS[_vector] = {}
            }
            if (_townsCS[_vector][_town.id] == undefined){
                _townsCS[_vector][_town.id] = {};
            }
            _townsCS[_vector][_town.id]['id'] = _town.id,
            _townsCS[_vector][_town.id]['name'] = _town.name
        }),
        $.each(_townsCS[_minVector], function(townId,elem){
            _json = {
                'id' : townId,
                'town_id' : _townDefender.id,
                'nl_init' : NotificationLoader.isGameInitialized()
            }
            $.ajax({
                url: '/game/town_info?town_id='+_townDefender.id+'&action=attack&h='+Game.csrfToken+'&json='+JSON.stringify(_json),
                async : false,
                complete : function(xhr){
                    var _csTime = JSON.parse(xhr.responseText).json.json.units.colonize_ship.duration_without_bonus;
                    _minCsTime = Math.min(_minCsTime || _csTime, _csTime)
                }
            })
        })
        sessionStorage.setItem(_sesItem,JSON.stringify({timestamp:Timestamp.server()+60*10,CsTime:_minCsTime}));
        return _minCsTime;
    }
    function __initUnit(){
        RepConv.Debug && console.log("__initUnit");
        return {
            'unit_img'  : '',
            'unit_send' : '',
            'unit_lost' : '',
            'unit_list' : '',
                'unit_diff' : '',
            'ua'        : [],
                'img_url'   : RepConvTool.GetLabel('NOTUNIT')
        };
    }
    function __initUnitDetail(){
        RepConv.Debug && console.log("__initUnitDetail");
        return {
            'unit_img' : '',
            'unit_send' : '',
            'unit_lost' : '',
            'unit_list' : '',
                'unit_diff' : '',
            'w' : 0,
            's' : 0,
            'i' : 0,
            'p' : 0,
            'f' : 0,
            'ua' : []
        };
    }
    function __initResources(){
        RepConv.Debug && console.log("__initResources");
        return {
            'title' : '',
            'detail' : '',
            'image' : '',
            'count' : '',
            'wood' : '0',
            'stone' : '0',
            'iron' : '0',
            'power' : '0',
                'ua' : []
        };
    }
    function __getUnitDetail2Way(site, item, itemcount) {
        RepConv.Debug && console.log("__getUnitDetail2Way");
        var colCount = 0, rowNumber = 0;
        itemcount = typeof itemcount !== 'undefined' ? itemcount : 5;
        report[site].full = __initUnit(),
        report[site].splits = {},
        report[site].splits[1] = __initUnit();
        $.each(_content.find($(item)), function(ind, elem) {
            if (elem.childElementCount > 0) {
                var
        		    RCunit = RepConvTool.getUnitName($(elem).find('.report_unit')),
        		    //RCunit = RepConvTool.getUnitName(elem.children[0]),
        		    RCcost = RepConvTool.GetUnitCost(RCunit),
        		    RClost = $(elem).find('.report_losts').html().replace("-", ""),
        		    _UA = {};
                if (RClost == "?") {
                    RClost = 0;
                } else {
                    report[site].w += RCcost.w * parseInt(RClost);
                    report[site].s += RCcost.s * parseInt(RClost);
                    report[site].i += RCcost.i * parseInt(RClost);
                    report[site].p += RCcost.p * parseInt(RClost);
                    report[site].f += RCcost.f * parseInt(RClost);
                }
                if (colCount%itemcount == 0){
                    colCount=0,
                    rowNumber++;
                }
                if( report[site].splits[rowNumber] == undefined){
                    report[site].splits[rowNumber] = __initUnit();
                }
                _UA = {
                    i : RepConvTool.GetUnit(RCunit),
                    b : $(elem).find('.report_unit>span').html(),
                    r : RClost
                }
                report[site].full.ua.push(_UA),
                report[site].splits[rowNumber].ua.push(_UA)
                colCount++;
            }
        }),
        genImage(report[site].full),
        genImages(report[site].splits)
    }
    function __getUnitDetail1Way(site, item, itemcount) {
        RepConv.Debug && console.log("__getUnitDetail1Way");
        var colCount = 0, rowNumber = 0;
        itemcount = typeof itemcount !== 'undefined' ? itemcount : 5;
        report[site].full = __initUnit(),
        report[site].splits = {},
        report[site].splits[1] = __initUnit();
        $.each(_content.find($(item)), function(ind, elem) {
            var
                RCunit = RepConvTool.getUnitName($(elem)),
                RCcost = RepConvTool.GetUnitCost(RCunit),
                _UA = {};
            if (colCount%itemcount == 0){
                colCount=0,
                rowNumber++;
            }
            if( report[site].splits[rowNumber] == undefined){
                report[site].splits[rowNumber] = __initUnit();
            }
            _UA = {
                i : RepConvTool.GetUnit(RCunit),
                b : ($(elem).children('div.value').length >0 ? $(elem).children('div.value') : $(elem).children('span')).html()
            }
            report[site].full.ua.push(_UA),
            report[site].splits[rowNumber].ua.push(_UA)
            colCount++;
        }),
        genImage(report[site].full),
        genImages(report[site].splits)
    }
    function __getBuildDetail1Way(site, item, itemcount) {
        RepConv.Debug && console.log("__getBuildDetail1Way");
        var colCount = 0, rowNumber = 0;
        itemcount = typeof itemcount !== 'undefined' ? itemcount : 5;
        report[site].full = __initUnit(),
        report[site].splits = {}
        $.each(_content.find($(item)), function(ind, elem) {
            var
                RCunit = RepConvTool.getUnitName($(elem)),
                RCcost = RepConvTool.GetUnitCost(RCunit),
                _UA = {};
            if (colCount%itemcount == 0){
                colCount=0,
                rowNumber++;
            }
            if( report[site].splits[rowNumber] == undefined){
                report[site].splits[rowNumber] = __initUnit();
            }
            _UA = {
                i : RepConvTool.GetBuild(RCunit),
                b : $(elem).children('span').html()
            }
            report[site].full.ua.push(_UA),
            report[site].splits[rowNumber].ua.push(_UA)
            colCount++;
        }),
        genImage(report[site].full),
        genImages(report[site].splits)
    }
    function getPlayerInfo(item) {
        RepConv.Debug && console.log("getPlayerInfo");
        //var result =
	return {
	    town : _getTown(item),
	    player : _getPlayer(item),
	    ally : _getAlly(item),
	    townName : _getTownName(item),
	    playerName : _getPlayerName(item)
	}
    }
    function getPlayerInfo2(result, item) {
        RepConv.Debug && console.log("getPlayerInfo2");
        if (result == undefined){
            result = {};
    	}
        // var isTownNotTemple = "town"
        // );
        result.town       = _getTown(item);
        result.town_type  = _getTownType(item);
        result.player     = (result.town_type == "town" || _reportType == "powers" ) ? _getPlayer(item) : "";
        result.ally       = (result.town_type == "town" || _reportType == "powers") ? _getAlly(item) : _getAllyFromOwner(item);
        result.townName   = _getTownName(item);
        result.playerName = _getPlayerName(item);
        // result.island       = _getIsland(item);
        return result;
    }
    function _getTownName(item) {
        RepConv.Debug && console.log("_getTownName");
        if ($(item).find($('li.town_name a')).length > 0) {
            return $(item).find($('li.town_name a')).html().trim();
        }
        return '';
    }
    function _getPlayerName(item) {
        RepConv.Debug && console.log("_getPlayerName");
        if ($(item).find($('li.town_owner a')).length > 0) {
            return $(item).find($('li.town_owner a')).html().trim();
        }
        return '';
    }
    function _getTown(item) {
        RepConv.Debug && console.log("_getTown");
        if ($(item).find($('li.town_name a,.gp_town_link')).length > 0 && (rBbcode.getValue() != 'BBCODEI')) {
            return RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(item).find($('li.town_name a,.gp_town_link')).attr('href')))[GRCRTtpl.rct.getTown]+'', GRCRTtpl.rct[_getTownType(item)]);
        } else if ($(item).find($('li.town_name a,.gp_town_link')).length > 0 && (rBbcode.getValue() == 'BBCODEI')) {
            return RepConvTool.Adds($(item).find($('li.town_name a,.gp_town_link')).text().trim(), GRCRTtpl.rct[_getTownType(item)]);
        } else if ($(item).find($('li.town_name')).length > 0) {
            return RepConvTool.Adds($(item).find($('li.town_name')).html().trim(), GRCRTtpl.rct.town);
        } else if($(item).find($('a.gp_island_link')).length > 0 && (rBbcode.getValue() != 'BBCODEI')){
            return RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(item).find($('a.gp_island_link')).attr('href')))[GRCRTtpl.rct.getIsland]+'', GRCRTtpl.rct.island);
        } else if($(item).find($('a.gp_island_link')).length > 0 && (rBbcode.getValue() == 'BBCODEI')){
            return RepConvTool.Adds($(item).find($('a.gp_island_link')).text().trim(), GRCRTtpl.rct.island);
        }
        return '';
    }
    function _getTownType(item) {
        RepConv.Debug && console.log("_getTownType");
        if ($(item).find($('li.town_name a,.gp_town_link')).length > 0) {
            return JSON.parse(RepConvTool.Atob($(item).find($('li.town_name a,.gp_town_link')).attr('href'))).tp;
        } else if ($(item).find($('li.town_name a.gp_town_link')).length > 0) {
            return JSON.parse(RepConvTool.Atob($(item).find($('li.town_name a.gp_town_link')).attr('href'))).tp;
        } else if ($(item).find($('li.town_name')).length > 0) {
            return RepConvTool.Adds($(item).find($('li.town_name')).html().trim(), GRCRTtpl.rct.town);
        }
        return '';
    }
    function _getPlayer(item) {
        RepConv.Debug && console.log("_getPlayer");
        if ($(item).find($('li.town_owner a,.gp_player_link')).length > 0) {
            return RepConvTool.Adds($(item).find($('li.town_owner a,.gp_player_link')).html(), GRCRTtpl.rct.player);
        } else {
            return RepConvTool.Adds(($(item).find($('li.town_owner')).html()||'').trim(), GRCRTtpl.rct.player);
        }
    }
    function _getAlly(item) {
        RepConv.Debug && console.log("_getAlly");
        if ($(item).find($('li.town_owner_ally a')).length > 0) {
            return RepConvTool.Adds($(item).find($('li.town_owner_ally a')).attr('onclick').replace(/.*'(.*)'.*/,'$1'), GRCRTtpl.rct.ally);
        }
        return '';
    }
    function _getAllyFromOwner(item) {
        RepConv.Debug && console.log("_getAllyFromOwner");
        if ($(item).find($('li.town_owner a')).length > 0 && $(item).find($('li.town_owner a')).attr('onclick')) {
            return RepConvTool.Adds($(item).find($('li.town_owner a')).attr('onclick').replace(/.*'(.*)'.*/,'$1'), GRCRTtpl.rct.ally);
        }
        return '';
    }

    function hideValues(){
        try {
            report.showCost = cShowCost.isChecked() || false;
        } catch (ex){}            

        if (cHidAt.isChecked()) {
            try {
                report.attacker.town = RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), GRCRTtpl.rct.town);
                report.title = report.title.replace(" (" + report.attacker.playerName + ")", "");
                report.title = report.title.replace(report.attacker.townName, report.attacker.playerName);
            } catch(ex){}
        }
        if (cHidDe.isChecked()) {
            try {
                report.defender.town = RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), GRCRTtpl.rct.town);
                report.title = report.title.replace(" (" + report.defender.playerName + ")", "");
                report.title = report.title.replace(report.defender.townName, report.defender.playerName);
            } catch(ex){}
        }
        if (!(cResource.isChecked() || cRaw.isChecked()) && _reportType != "powers" && _reportType != "raise") {
            try {
                report.resources.img_url = RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), 'i');
            } catch(ex){}
        }
        if (!cUSC.isChecked()) {
            try {
                report.iron.count = RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), 'i');
            } catch(ex){}
        }
    }
    


// -- konwersje obiektow
    function _academy(){
        function getResearchesInColumns() {
            var a = GameData.researches,
                b = getResearchOrders(),
                c = getAcademyLevel(),
                d = getAvailableResearchPoints(),
                e = getTownResearches(),
                f = [];
            for (var g in a)
                if (a.hasOwnProperty(g)) {
                    var h = a[g],
                        i = h.building_dependencies,
                        j = Math.ceil(i.academy / 3),
                        k = e.hasResearch(g),
                        l = b.isResearchInQueue(g),
                        m = b.isResearchQueueFull(),
                        n = hasEnoughResources(g),
                        o = c >= i.academy,
                        p = d >= h.research_points;
                    if (!f[j - 1]) f[j - 1] = [];
                    f[j - 1].push({
                        research_id: g,
                        column_number: j,
                        is_researched: k,
                        in_progress: l,
                        can_be_bought: o && !k && !l && !m && n && p,
                        academy_lvl: i.academy
                    })
                }
            return f
        }
        function hasEnoughResources(a) {
            var b = GameData.researches[a],
            c = b.resources,
            d = getTownResources();
            for (var e in c)
            if (c.hasOwnProperty(e))
                if (c[e] > d[e]) return false;
            return true
            }
        function getResearchOrders() {
            return wnd.data.collections.research_orders
        }
        function getTownResearches() {
            return ITowns.getCurrentTown().getResearches()
        }
        function getTownBuildings() {
            return ITowns.getCurrentTown().getBuildings() //this.getCollection("towns").getCurrentTown().getBuildings()
        }
        function getTownResources() {
                return ITowns.getCurrentTown().resources()
        }
        function getAcademyLevel() {
            return getTownBuildings().getBuildingLevel("academy")
        }
        function getLibraryLevel() {
            return getTownBuildings().getBuildingLevel("library")
        }
        function hasAcademy() {
            return getAcademyLevel() > 0
        }
        function hasLibrary() {
            return 1 === getLibraryLevel()
        }
        function getAdditionalResearchPoints() {
            return hasLibrary() ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0
        }
        function getSpentResearchPoints() {
            var a = GameData.researches,
            b = getTownResearches(),
            c = getResearchOrders(),
            d = 0;
            for (var e in a)
            if (a.hasOwnProperty(e)) {
                var f = a[e];
                if (b.hasResearch(e) || c.isResearchInQueue(e)) d += f.research_points
            }
            return d
        }
        function getMaxResearchPoints() {
            return GameDataBuildings.getBuildingMaxLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel() + getAdditionalResearchPoints()
        }
        function getMaxResearchPointsWithoutLibrary() {
            return GameDataBuildings.getBuildingMaxLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel()
        }
        function getCurrentResearchPoints() {
            return getAcademyLevel() * GameDataResearches.getResearchPointsPerAcademyLevel() + getAdditionalResearchPoints()
        }
        function getAvailableResearchPoints() {
            return getCurrentResearchPoints() - getSpentResearchPoints()
        }
        var
            tech_tree = getResearchesInColumns(),
            max_row = 0,
            academy_lvl = getAcademyLevel();
        $.each(tech_tree, function(ind,elem){
            max_row = Math.max(max_row, elem.length);
        }),
        report.title = GameData.buildings.academy.name+' ('+RepConvTool.Adds((GRCRTtpl.rct.outside) ? Game.townName : Game.townId.toString(), GRCRTtpl.rct.town)+')',
        report.time = '',
        report.linia = {},
        $.each(tech_tree, function(ind,elem){
            for(var _row = 0; _row < max_row; _row++){
                if (report.linia[_row] == undefined) {
                    report.linia[_row] = {'unit_list':'', 'unit_name' : ''}
                }
                var tech = (elem[_row] != undefined) ? RepConvTool.GetImageCode(GameDataResearches.getResearchCssClass(elem[_row].research_id)) : ''
                tech = (elem[_row] != undefined && !(elem[_row].is_researched || elem[_row].in_progress)) ? tech.toLowerCase() : tech,
                report.linia[_row].unit_list += (report.linia[_row].unit_list.length>0) ? '.' : '',
                report.linia[_row].unit_list += tech,
                report.linia[_row].unit_list += (elem[_row] != undefined && ((elem[_row].academy_lvl > academy_lvl || tech == tech.toUpperCase()))) ? "|-" : "|"
            }
        }),
        report.points = DM.getl10n('academy','research_points') + ': '+getAvailableResearchPoints() + "/" + getMaxResearchPoints();
    }

    function _main(){
        function getResearchesInColumns() {
            var a = GameData.researches,
                b = getResearchOrders(),
                c = getAcademyLevel(),
                d = getAvailableResearchPoints(),
                e = getTownResearches(),
                f = [];
            for (var g in a)
                if (a.hasOwnProperty(g)) {
                    var h = a[g],
                        i = h.building_dependencies,
                        j = Math.ceil(i.academy / 3),
                        k = e.hasResearch(g),
                        l = b.isResearchInQueue(g),
                        m = b.isResearchQueueFull(),
                        n = hasEnoughResources(g),
                        o = c >= i.academy,
                        p = d >= h.research_points;
                    if (!f[j - 1]) f[j - 1] = [];
                    f[j - 1].push({
                        research_id: g,
                        column_number: j,
                        is_researched: k,
                        in_progress: l,
                        can_be_bought: o && !k && !l && !m && n && p,
                        academy_lvl: i.academy
                    })
                }
            return f
        }
        function hasEnoughResources(a) {
            var b = GameData.researches[a],
            c = b.resources,
            d = getTownResources();
            for (var e in c)
            if (c.hasOwnProperty(e))
                if (c[e] > d[e]) return false;
            return true
            }
        function getResearchOrders() {
            return wnd.data.collections.research_orders
        }
        function getTownResearches() {
            return ITowns.getCurrentTown().getResearches()
        }
        function getTownBuildings() {
            return ITowns.getCurrentTown().getBuildings()
        }
        function getTownResources() {
                return ITowns.getCurrentTown().resources()
        }
        function getAcademyLevel() {
            return getTownBuildings().getBuildingLevel("academy")
        }
        function getLibraryLevel() {
            return getTownBuildings().getBuildingLevel("library")
        }
        function hasAcademy() {
            return getAcademyLevel() > 0
        }
        function hasLibrary() {
            return 1 === getLibraryLevel()
        }
        function getAdditionalResearchPoints() {
            return hasLibrary() ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0
        }
        function getSpentResearchPoints() {
            var a = GameData.researches,
            b = getTownResearches(),
            c = getResearchOrders(),
            d = 0;
            for (var e in a)
            if (a.hasOwnProperty(e)) {
                var f = a[e];
                if (b.hasResearch(e) || c.isResearchInQueue(e)) d += f.research_points
            }
            return d
        }
        function getMaxResearchPoints() {
            return GameDataBuildings.getBuildingMaxLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel() + getAdditionalResearchPoints()
        }
        function getMaxResearchPointsWithoutLibrary() {
            return GameDataBuildings.getBuildingMaxLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel()
        }
        function getCurrentResearchPoints() {
            return getAcademyLevel() * GameDataResearches.getResearchPointsPerAcademyLevel() + getAdditionalResearchPoints()
        }
        function getAvailableResearchPoints() {
            return getCurrentResearchPoints() - getSpentResearchPoints()
        }
        report.title = GameData.buildings.main.name+' ('+RepConvTool.Adds((GRCRTtpl.rct.outside) ? Game.townName : Game.townId.toString(), GRCRTtpl.rct.town)+')',
        report.time = '',
        report.linia = {},
        $.each(tech_tree, function(ind,elem){
            for(var _row = 0; _row < max_row; _row++){
                if (report.linia[_row] == undefined) {
                    report.linia[_row] = {'unit_list':'', 'unit_name' : ''}
                }
                var tech = (elem[_row] != undefined) ? RepConvTool.GetImageCode(GameDataResearches.getResearchCssClass(elem[_row].research_id)) : ''
                tech = (elem[_row] != undefined && !(elem[_row].is_researched || elem[_row].in_progress)) ? tech.toLowerCase() : tech,
                report.linia[_row].unit_list += (report.linia[_row].unit_list.length>0) ? '.' : '',
                report.linia[_row].unit_list += tech,
                report.linia[_row].unit_list += (elem[_row] != undefined && ((elem[_row].academy_lvl > academy_lvl || tech == tech.toUpperCase()))) ? "|-" : "|"
            }
        }),
        report.points = DM.getl10n('academy','research_points') + ': '+getAvailableResearchPoints() + "/" + getMaxResearchPoints();
    }
    
    function _commandList() {
        report.title = _content.find($('div.game_header')).html().stripTags();
        report.time = '';
        report.linia = {};
        if (_content.find($('#tab_all ul#command_overview li')).length > 0) {
            var ind = -1;
            $.each(_content.find($('#tab_all ul#command_overview li')), function(indx, parent) {
                if ($(parent).css('display')!='none') {
                    ind++,
                    report.linia[ind] = {
                        title:'',
                        img:null,
                        townIdA:null,
                        townIdB:null,
                        islandB:null,
                        inout:null,
                        power:'',
                        unit_img:'',
                        unit_send:'',
                        unit_list:'',
                        spy:'',
                        time:''
                    };
                    if($(parent).find($('h4')).length > 0){
                        report.linia[ind].title = '[b]'+$(parent).find($('h4')).html().stripTags()+'[/b]';
                    } else if($(parent).find($('span.italic')).length > 0){
                        report.linia[ind].title = '[i]'+$(parent).find($('span.italic')).html().stripTags()+'[/i]';
                    } else if($(parent).hasClass('place_command')){
                        report.linia[ind].img = RepConvTool.getCommandIcon($(parent).find('div.cmd_img'));
                        report.linia[ind].townIdB = '';
                        report.linia[ind].islandB = '';
                        // nowa wersja czytacza co to wlasciwie jest
                        var
                            _cmdLine = $(parent).find($('span.cmd_span')),
                            _cmdLIco = $(_cmdLine).find($('span.icon')),
                            _cmdSiLe = $(_cmdLIco).prevAll(),
                            _cmdSiRi = $(_cmdLIco).nextAll();
                        report.linia[ind].inout = RepConvTool.Adds(RepConv.Const.staticImg + (($(_cmdLine).find('.overview_incoming').length == 0) ? 'out' : 'in') + '.png', 'img');
                        report.linia[ind].townIdA = {};
                        switch(_cmdSiLe.length){
                            case 2:
                            case 1:
                                $.each(_cmdSiLe, function(ics, ecs){
                                    if(ecs.className == 'gp_town_link'){
                                        if(JSON.parse(RepConvTool.Atob(ecs.hash)).tp == 'town'){
                                            report.linia[ind].townIdA.town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob(ecs.hash))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town);
                                            report.linia[ind].townIdA.townId = JSON.parse(RepConvTool.Atob(ecs.hash)).id;
                                            report.linia[ind].townIdA.townJSON = JSON.parse(RepConvTool.Atob(ecs.hash));
                                            report.linia[ind].townIdA.townType = JSON.parse(RepConvTool.Atob(ecs.hash)).tp;
                                        } else {
                                            report.linia[ind].townIdA.town = RepConvTool.Adds(ecs.text, GRCRTtpl.rct[JSON.parse(RepConvTool.Atob(ecs.hash)).tp]);
                                        }
                                    } else if(ecs.className == 'gp_player_link'){
                                        report.linia[ind].townIdA.player = RepConvTool.Adds(ecs.text, GRCRTtpl.rct.player);
                                    }
                                })
                                report.linia[ind].townIdA.full = report.linia[ind].townIdA.town;
                                if(report.linia[ind].townIdA.player != undefined){
                                    report.linia[ind].townIdA.full += ' ('+report.linia[ind].townIdA.player+')';
                                }
                                break;
                            case 0:
                                report.linia[ind].townIdA.full = '',
                                $.each(_cmdLine[0].firstChild.data.split('\n'), function(indData,elemData){
                                    report.linia[ind].townIdA.full += " "+elemData.trim(),
                                    report.linia[ind].townIdA.full = report.linia[ind].townIdA.full.trim();
                                })
                                break
                        }
                        report.linia[ind].townIdB = {};
                        report.linia[ind].islandB = {};
                        switch(_cmdSiRi.length){
                            case 2:
                            case 1:
                                report.linia[ind].townIdB.town = '';
                                $.each(_cmdSiRi, function(ics, ecs){
                                    if(ecs.className == 'gp_town_link'){
                                        if(JSON.parse(RepConvTool.Atob(ecs.hash)).tp == 'town'){
                                            report.linia[ind].townIdB.town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob(ecs.hash))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town);
                                        } else {
                                            report.linia[ind].townIdB.town = RepConvTool.Adds(ecs.text, GRCRTtpl.rct[JSON.parse(RepConvTool.Atob(ecs.hash)).tp]);
                                        }
                                    } else if(ecs.className == 'gp_player_link'){
                                        report.linia[ind].townIdB.player = RepConvTool.Adds(ecs.text, GRCRTtpl.rct.player);
                                        report.linia[ind].townIdB.playerId = JSON.parse(RepConvTool.Atob(ecs.hash)).id;
                                    } else if(ecs.className == 'gp_island_link'){
                                        report.linia[ind].islandB.island = RepConvTool.Adds((JSON.parse(RepConvTool.Atob(ecs.hash))[GRCRTtpl.rct.getIsland]||ecs.text).toString(), GRCRTtpl.rct.island);
                                        report.linia[ind].islandB.islandId = JSON.parse(RepConvTool.Atob(ecs.hash)).id;
                                    }
                                })
                                if(report.linia[ind].townIdB.town != undefined){
                                    report.linia[ind].townIdB.full = report.linia[ind].townIdB.town;
                                }
                                if(report.linia[ind].islandB.island != undefined){
                                    report.linia[ind].townIdB.full = report.linia[ind].islandB.island;
                                }
                                if(report.linia[ind].townIdB.player != undefined){
                                    report.linia[ind].townIdB.full += ' ('+report.linia[ind].townIdB.player+')';
                                }
                                break
                            case 0:
                            report.linia[ind].townIdB.full = '',
                            $.each(_cmdLine[0].lastChild.data.split('\n'), function(indData,elemData){
                                report.linia[ind].townIdB.full += " "+elemData.trim(),
                                report.linia[ind].townIdB.full = report.linia[ind].townIdB.full.trim();
                            })
                            break
                        }
                        // /nowa wersja czytacza co to wlasciwie jest
                        report.linia[ind].time = $(parent).find('.troops_arrive_at').html();//getFromPopup($(parentId+' .countdown'));
                        report.linia[ind].power = RepConvTool.getPowerIcon($(parent).find('div.casted_power'));
                        if ($(parent).attr('data-command_type') == 'attack_spy'){
                            if (cDetail.isChecked()) {
                                report.linia[ind].img_url = RepConvTool.Adds(RepConv.Const.unitImg + "iron.png", "img") + '  ' + $(parent).find('span.resource_iron_icon').html();
                            } else {
                                report.linia[ind].img_url = RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), 'i');
                            }
                        } else if (
                            $(parent).attr('id').replace(/.*_(revolt).*/,'$1') == "revolt"
                            &&
                            report.linia[ind].townIdA.townId != undefined
                            ){
                            // info o buncie
                            if (cDetail.isChecked()) {
                                var __rttown = ITowns.getTown(report.linia[ind].townIdA.townId);
                                if (__rttown  != undefined) {
                                    report.linia[ind].unit_list = 'A6',
                                    report.linia[ind].unit_list += "|"+__rttown.buildings().getBuildingLevel("wall").toString(),
                                    report.linia[ind].unit_list += (
                                        (__rttown.buildings().getBuildingLevel("tower") == 1 )
                                            ? '.B6' : '.b6') + '|-',
                                    report.linia[ind].unit_list += (
                                        (__rttown.researches().get("ram") )
                                            ? '.C6' : '.c6') + '|-',
                                    report.linia[ind].unit_list += (
                                        (__rttown.researches().get("phalanx") )
                                            ? '.D6' : '.d6') + '|-',
                                    report.linia[ind].unit_list += (
                                        (MM.checkAndPublishRawModel('PremiumFeatures', {id : Game.player_id}).get('captain') > Timestamp.server())
                                            ? '.E6' : '.e6') + '|-',
                                    report.linia[ind].unit_list += (
                                        (MM.checkAndPublishRawModel('PremiumFeatures', {id : Game.player_id}).get('commander') > Timestamp.server())
                                            ? '.F6' : '.f6') + '|-',
                                    report.linia[ind].unit_list += (
                                        (MM.checkAndPublishRawModel('PremiumFeatures', {id : Game.player_id}).get('priest') > Timestamp.server())
                                            ? '.G6' : '.g6') + '|-';
                                    if (report.linia[ind].unit_list.length > 0) {
                                        report.linia[ind].img_url = RepConvTool.Adds((RepConv.grcrt_domain+"static/{0}{1}_32_2.png").RCFormat(GRCRTtpl.rct.sign, report.linia[ind].unit_list), "img");
                                        report.linia[ind].img_url += RepConvTool.Adds((RepConv.grcrt_cdn+"ui/3/{0}.png").RCFormat((__rttown.god() || 'nogod')), "img");
                                        report.linia[ind].rt = 'x';
                                    }
                                    try{
                                        report.linia[ind].img_url += '\n'+
                                        RepConvTool.GetLabel('MSGRTCSTIME') +': '+
                                        '~' + readableUnixTimestamp(
                                            parseInt(
                                            revoltClosestCS(report.linia[ind].townIdB.playerId,
                                                    report.linia[ind].townIdA.townJSON
                                                    )
                                            ), 'no_offset')
                                        
                                    } catch(e){}
                                }
                            }
                        } else {
                            if (cDetail.isChecked()) {
                                report.linia[ind]['ua'] = [],
                                $.each($(parent).find('div.command_overview_units div.place_unit'), function(ind2, elem) {
                                    var
                                    RCunit = RepConvTool.getUnitName($(elem)),
                                    _UA = {
                                           i : RepConvTool.GetUnit(RCunit),
                                           b : $(elem).find($('span.place_unit_black')).html()
                                    }
                                    report.linia[ind]['ua'].push(_UA);
                                });
                            } else {
                                report.linia[ind].img_url = RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), 'i');
                            }
                        }
                    }
                }
            });
        }
        // console.log(report);
        genImages(report.linia, 25, 2, 8)
    }

    function _conquerOld() {
        RepConv.Debug && console.log("_conquerOld");
        report.title = _content.find($('#conqueror_units_in_town>span')).html();
        report.time = _content.find($('div.clearfix'))[0].innerHTML.stripTags().trim().replace(/\n/gi, '').replace(/.*(\(.*\)).*/, '$1');
        report.attacker = {};
        report.defender = {};

        report.defender.town = RepConvTool.Adds((JSON.parse(RepConvTool.Atob(_content.find($('div.clearfix a.gp_town_link')).attr('href'))))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct[JSON.parse(RepConvTool.Atob(_content.find($('div.clearfix a.gp_town_link')).attr('href'))).tp]);
        report.defender.townName = _content.find($('div.clearfix a.gp_town_link')).html();
        report.defender.player = RepConvTool.Adds(_content.find($('div.clearfix a.gp_player_link')).html(), GRCRTtpl.rct.player);
        report.defender.playerName = _content.find($('div.clearfix a.gp_player_link')).html();

        if (report.defender.player == null) {
            report.defender.player = "";
            report.defender.playerName = "";
        }

        if (cHidAt.isChecked()){//$('#MSGHIDDE').attr('checked')) {
            report.defender.town = RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), GRCRTtpl.rct.town);
        }

        report.attacker.units_title = _content.find($('div.clearfix div.bold')).html();
        if (cAttUnit.isChecked()) {
            __getUnitDetail1Way('attacker', 'div.index_unit', 11);
        }else{
            report.attacker.full = {'img_url' : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), 'i') };
        }
        RepConv.Debug && console.log(report);
    }
    function _conquerTroops() {
        report.title = _content.parent().find($('.ui-dialog-title')).html();
        report.type = '';//_content.find($('#report_arrow img')).attr('src').replace(/.*\/([a-z_]*)\..*/, '$1');
        report.time = '';//_content.find($('div#conquest')).html();
        report.power = '';
        report.morale = '';
        report.luck = '';
        report.oldwall = {};
        report.nightbonus = '';
        report.attacker = {};
        report.defender = {};
        report.command = {};
        report.command.title = _content.find($('div.tab_content>span')).clone();//.html();
        $(report.command.title).children().remove();
        report.command.title = $(report.command.title).html();

        if (_content.find($('ul#unit_movements')).length == 0) {
            report.command.title = "\n[i]" + $_content.find($('.gpwindow_content>span')).html() + "[/i]";
        } else {
            report.linia = {};
            $.each(_content.find($('ul#unit_movements>li')), function(ind, elem) {
                report.linia[ind] = {};
                report.linia[ind].inout = RepConvTool.Adds(RepConv.Const.staticImg + (($(elem).attr('class').replace(/.*(incoming).*/, '$1').length == 0) ? 'out' : 'in') + '.png', 'img');
                report.linia[ind].img = RepConvTool.Adds($(elem).find($('img.command_type')).attr('src'), 'img');
                var
                    _tbtime = $(elem).find('div>span.eta').html().split(':'),
                    _sec = (parseInt(_tbtime[0])*60*60+parseInt(_tbtime[1])*60+parseInt(_tbtime[2])),
                    _time = readableUnixTimestamp(Timestamp.server()+parseInt(_sec), 'player_timezone', {with_seconds: true, extended_date : true})//formatDateTimeNice(Timestamp.server()+parseInt(_sec), true)
                report.linia[ind].time = _time;
                report.linia[ind].text = RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(elem).find($('a.gp_town_link')).attr('href')))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct[JSON.parse(RepConvTool.Atob($(elem).find($('a.gp_town_link')).attr('href'))).tp]);
                ind++;
            });
        }
    }
    function _support() {
        __getReportTitle();
        __getReportType();
        __getReportTime();
        __getReportMorale();
        __getReportLuck();
        __getReportOldWall();
        __getReportNightBonus();

        report.attacker = __initUnitDetail();
		
        report.attacker = getPlayerInfo2(report.attacker, _content.find($('#report_sending_town')));
        report.defender = getPlayerInfo2(report.defender, _content.find($('#report_receiving_town')));
        report.power = (_content.find($('div.report_power')).length == 0) ? ''
                : RepConvTool.Adds(RepConv.Const.staticImg + _content.find($('div.report_power')).attr('id') + '_30x30.png', "img");


        if ( cAttUnit.isChecked() ) {// $('#MSGATTUNIT').attr('checked')) {
            __getUnitDetail1Way('attacker', 'div.report_unit', 10);
            //report.attacker = getUnit(report.attacker, 'div.report_unit');
        }else{
            report.attacker.full = {'img_url' : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), 'i') };
        }
    }

    function _detail() {
        __getReportTitle();
        __getReportType()
        __getReportTime()
        report.morale = '';
        report.luck = '';
        report.oldwall = {};
        report.nightbonus = '';
        report.attacker = getPlayerInfo2(report.attacker, _content.find($('#report_sending_town')));
        report.defender = getPlayerInfo2(report.defender, _content.find($('#report_receiving_town')));
        var town = _content.find($('#report_game_body p a.gp_town_link')).length == 0
                ? ''
                : RepConvTool.Adds((JSON.parse(RepConvTool.Atob((_content.find($('#report_game_body p a.gp_town_link')).attr('href')))))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct[JSON.parse(RepConvTool.Atob((_content.find($('#report_game_body p a.gp_town_link')).attr('href')))).tp]);
        var player = (_content.find($('#report_game_body p a.gp_player_link')).length == 0) ? ''
                : RepConvTool.Adds(_content.find($('#report_game_body p a.gp_player_link')).html(), GRCRTtpl.rct.player);
        report.detail = _content.find($('#report_game_body p')).html().trim()
				.replace(/<a[^\/]*gp_player_link[^\/]*\/a>/, player)
				.replace(/<a[^\/]*gp_town_link[^\/]*\/a>/, town)
    }

    function _conquest() {
        report.title = _content.closest($('.js-window-main-container')).find($('.ui-dialog-title')).html(),
        report.type = '';//_content.find($('#report_arrow img')).attr('src').replace(/.*\/([a-z_]*)\..*/, '$1');
        var
            _tbtime = _content.find($('div#conquest')).html().split(':'),
            _sec = (parseInt(_tbtime[0])*60*60+parseInt(_tbtime[1])*60+parseInt(_tbtime[2])),
            _time = readableUnixTimestamp(Timestamp.server()+parseInt(_sec), 'player_timezone', {with_seconds: true, extended_date : true})//formatDateTimeNice(Timestamp.server()+parseInt(_sec), true)
        report.time = _time;
        //report.time = _content.find($('div#conquest')).html();
        report.power = '';
        report.morale = '';
        report.luck = '';
        report.oldwall = {};
        report.nightbonus = '';
        report.attacker = {};
        report.defender = {};
        report.command = {};
        report.attacker.title = $(_content.find($('h4'))[0]).html();
        report.attacker.player = RepConvTool.Adds(_content.find($('a.gp_player_link')).html(), GRCRTtpl.rct.player);
        report.defender.town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob(_content.find($('a.gp_town_link')).attr('href')))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct[JSON.parse(RepConvTool.Atob(_content.find($('a.gp_town_link')).attr('href'))).tp]);
        if (cHidAt.isChecked()){//$('#MSGHIDDE').attr('checked')) {
            report.defender.town = RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), GRCRTtpl.rct.town);
        }

        report.attacker.units_title = _content.find($('div.clearfix div.bold')).html();
        if (cAttUnit.isChecked()) {
            __getUnitDetail1Way('attacker', 'div.report_unit', 11);
        }else{
            report.attacker.full = {'img_url' : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), 'i') };
        }
        
        report.command.title = $(_content.find($('h4'))[1]).html();
        report.linia = {};
        if (_content.find($('ul#unit_movements')).length == 0) {
            report.command.title = "\n[i]" + (_content.find($('.conquest_info_wrapper>span')).html()||'') + "[/i]";
        } else {
            report.linia = {};
            $.each(_content.find($('ul#unit_movements>li')), function(ind, elem) {
                report.linia[ind] = {};
                report.linia[ind].inout = RepConvTool.Adds(RepConv.Const.staticImg + (($(elem).attr('class').replace(/.*(incoming).*/, '$1').length == 0) ? 'out' : 'in') + '.png', 'img');
                report.linia[ind].img = RepConvTool.Adds($(elem).find($('img.command_type')).attr('src'), 'img');
                var
                        _tbtime = $(elem).find('div>span.eta').html().split(':'),
                        _sec = (parseInt(_tbtime[0])*60*60+parseInt(_tbtime[1])*60+parseInt(_tbtime[2])),
                        _time = readableUnixTimestamp(Timestamp.server()+parseInt(_sec), 'player_timezone', {with_seconds: true, extended_date : true})//formatDateTimeNice(Timestamp.server()+parseInt(_sec), true)
                    report.linia[ind].time = _time;
                    //report.linia[ind].time = $(elem).find('div>span.eta').html();
                var
                    _cmd_town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob($($($(elem).find('div')[2]).html()).eq(3).attr('href')))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town),
                    _cmd_player = RepConvTool.Adds(JSON.parse(RepConvTool.Atob($($($(elem).find('div')[2]).html()).eq(5).attr('href'))).name, GRCRTtpl.rct.player),
                    _cmd_ally = '('+RepConvTool.Adds($($($(elem).find('div')[2]).html()).eq(7).html(), GRCRTtpl.rct.ally)+')' || '';
                report.linia[ind].text = '';
                $.each($($($(elem).find('div')[2]).html().replace(/.*<span.*span>(.*)/, '$1')), function(icmd, ecmd){
                    //console.log(icmd)
                    //console.log($(ecmd).text())
                    if ($(ecmd).hasClass('gp_town_link')) {
                    report.linia[ind].text += " "+_cmd_town;
                    } else if ($(ecmd).hasClass('gp_player_link')) {
                    report.linia[ind].text += "\n"+_cmd_player;
                    } else if ($(ecmd).attr('onclick') != undefined) {
                    report.linia[ind].text += " "+_cmd_ally;
                    } else if ($(ecmd).text().replace(/(\(|\))/,'').trim().length > 0) {
                    report.linia[ind].text += " "+$(ecmd).text().trim();
                    }
                })
                ind++;
            });
        }
    }
    
    function _agora() {
        report.title = _content.find($('#place_defense .game_header')).html().stripTags() +
            " " + RepConvTool.Adds((GRCRTtpl.rct.outside) ? Game.townName : Game.townId.toString(), GRCRTtpl.rct.town);
        report.time = '';
        report.linia = {};
        $.each(_content.find($('li.place_units')), function(ind, parent) {
            var town = '', player = '';
            if ($(parent).children('h4').children('a.gp_town_link').length > 0) {
                town = RepConvTool.Adds((JSON.parse(RepConvTool.Atob($(parent).children('h4').children('a.gp_town_link').attr('href'))))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct[JSON.parse(RepConvTool.Atob($(parent).children('h4').children('a.gp_town_link').attr('href'))).tp]);
            }
            if ($(parent).children('h4').children('a.gp_player_link').length > 0) {
                player = RepConvTool.Adds($(parent).children('h4').children('a.gp_player_link').html(), GRCRTtpl.rct.player);
            }
            if ( cHidAt.isChecked() || cHidDe.isChecked()){// $('#MSGHIDAT').attr('checked')||$('#MSGHIDDE').attr('checked')) {
                town = RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), GRCRTtpl.rct.town);
            }
            report.linia[ind] = {};
            report.linia[ind].titleOrg = $(parent).children('h4').html();
            if (player != ''){
                report.linia[ind].title = $(parent).children('h4').html().replace(/(.*)<a.*\/a>.*(<a.*\/a>).*/, '$1') + town + " (" + player + ")";
            } else {
                report.linia[ind].title = $(parent).children('h4').html().replace(/(.*)<a.*\/a>/, '$1') + town;    
            }
            if (cDefUnit.isChecked() || cAttUnit.isChecked()) {
                report.linia[ind]['ua'] = [],
                $.each($(parent).find($('.place_unit')), function(ind2, elem) {
                    var
                        RCunit = RepConvTool.getUnitName($(elem)),
                        _UA = {
                            i : RepConvTool.GetUnit(RCunit),
                            b : $(elem).find($('span')).html()
                        }
                    report.linia[ind]['ua'].push(_UA);
                })
            } else {
                report.linia[ind].img_url = RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), 'i');
            }
        });
        if (cDefUnit.isChecked() || cAttUnit.isChecked()) {
            genImages(report.linia)
        }
    }

    function _wall() {
        function getUnitWall(result, item) {
            RepConv.Debug && console.log("getUnitWall");
            var
                line = -1,
                count = 0,
                tmp = [];
    
            $.each($(item).find($('div.wall_report_unit')), function(ind, elem) {
                var
                    RCunit = RepConvTool.getUnitName($(elem)),
                    _UA = {};
                switch(rShowDiff.getValue()){
                    case 'MSGDIFF1':
                        _UA = {
                               i : RepConvTool.GetUnit(RCunit),
                               b : $(elem).find($('span.place_unit_black')).html()
                        }
                        tmp.push(_UA)
                        break;
                    case 'MSGDIFF2':
                        _UA = {
                               i : RepConvTool.GetUnit(RCunit),
                               b : $(elem).find($('span.place_unit_black')).html(),
                               g : $(elem).parent().find($('div.grcrt_wall_diff')).html()
                        }
                        tmp.push(_UA)
                        break;
                    case 'MSGDIFF3':
                        if ($(elem).parent().find($('div.grcrt_wall_diff')).html() != '') {
                            _UA = {
                                   i : RepConvTool.GetUnit(RCunit),
                                   g : $(elem).parent().find($('div.grcrt_wall_diff')).html()
                            }
                            tmp.push(_UA)
                        }
                        break;
                }
            }),
            $.each(tmp, function(ind, elem) {
                if (count % ( (rBbcodeType.getValue() == 'BBCODEP') ? GRCRTtpl.rct.unitWall : GRCRTtpl.rct.unitWall2) == 0) {
                    line++,
                    result[line] = {'ua' : []};
                }
                result[line].ua.push(elem),
                count++;
            }),
            genImages(result);
        }
        
        report.title = _content.find($('.game_header')).html().stripTags();
        report.defeated = {};
        report.losses = {};
        report.defeated.title = '';
        report.defeated.titleAttacker = '';
        report.defeated.titleDefender = '';
        report.losses.title = '';
        report.losses.titleAttacker = '';
        report.losses.titleDefender = '';
        report.defeated.attacker = {};
        report.defeated.defender = {};
        report.losses.attacker = {};
        report.losses.defender = {};

        if ( cAsAttDef.isChecked() || cAsDefDef.isChecked() ) {
            report.defeated.title = _content.find($('div.list_item_left h3')).html();
            if ( cAsAttDef.isChecked() ) {
                report.defeated.titleAttacker = $(_content.find($('div.list_item_left h4'))[0]).html().stripTags().trim();
                getUnitWall(report.defeated.attacker, _content.find($('div.list_item_left .wall_unit_container'))[0]);
            }
            if ( cAsDefDef.isChecked() ) {
                report.defeated.titleDefender = $(_content.find($('div.list_item_left h4'))[1]).html().stripTags().trim();
                getUnitWall(report.defeated.defender, _content.find($('div.list_item_left .wall_unit_container'))[1]);
            }
        }

        if ( cAsAttLos.isChecked() || cAsDefLos.isChecked() ) {
            report.losses.title = _content.find($('div.list_item_right h3')).html();
            if ( cAsAttLos.isChecked() ) {
                report.losses.titleAttacker = $(_content.find($('div.list_item_right h4'))[0]).html().stripTags().trim();
                getUnitWall(report.losses.attacker, _content.find($('div.list_item_right .wall_unit_container'))[0]);
            }
            if ( cAsDefLos.isChecked() ) {
                report.losses.titleDefender = $(_content.find($('div.list_item_right h4'))[1]).html().stripTags().trim();
                getUnitWall(report.losses.defender, _content.find($('div.list_item_right .wall_unit_container'))[1]);
            }
        }
        var _emptyline = 'emptyline_'+GRCRTtpl.rct.genImgS+'_'+GRCRTtpl.rct.genImgM;
        report.emptyline = RepConvTool.Adds(getUrlMD5(_emptyline),'img');
        $.ajax({
            type: "POST",
            url: RepConv.grcrt_domain+'imgdata.php',
            data : { param : btoa(imgCache([{i:'null',b:''}],GRCRTtpl.rct.genImgS,GRCRTtpl.rct.genImgM)), dest : _emptyline },
            dataType: "script",
            async : false
        });
        
        RepConv.Debug && console.log(report);
    }

    function _revolt(){
        RepConv.Debug && console.log("_revolt");
        if (cRtShow.isChecked()){
            if (
                ('[town]' + Game.townId + '[/town]' == report.defender.town)
                ||
                (Game.townName  == report.defender.townName)
            ) {
                report.rtrevinfo = MM.getCollections().MovementsRevoltDefender[0], //MM.checkAndPublishRawModel('CommandsMenuBubble', {id: Game.player_id}).get('revolts').in_current_town,
                report.rtrevccount = report.rtrevinfo.length,//.count,
                report.rtrevolt = '',
                report.rtcstime = '~' + readableUnixTimestamp(
					    parseInt(
						revoltClosestCS(JSON.parse(RepConvTool.Atob(_content.find($('#report_sending_town .gp_player_link')).attr('href'))).id,
								JSON.parse(RepConvTool.Atob(_content.find($('#report_receiving_town .gp_town_link')).attr('href')))
								)
						), 'no_offset');
                try {
                    $.each(report.rtrevinfo.models, function(ind,elem){
                        if (Timestamp.server() < elem.getFinishedAt()){
                            var _rvt = readableUnixTimestamp(elem.getStartedAt(), 'player_timezone', {extended_date: true, with_seconds: true});
                            if(report.rtrevolt > _rvt || report.rtrevolt ==''){
                                report.rtrevolt = readableUnixTimestamp(elem.getStartedAt(), 'player_timezone', {
                                    extended_date: true,
                                    with_seconds: true
                                })
                            }
                        }
                    })
            	} catch (ex) {
            	    //brak buntu - już wygasł
            	    report.rtrevolt = '';
            	}
            }else{
                cRtShow.check(false);
                report.rtrevolt = '';
            };
        } else {
            report.rtrevolt = '';
        }

        report.rttownId = parseInt(Game.townId);
       
        // trochę czytelniej pewnie będzie, gdy "złapiesz" miasto na wskaźnik
        var __rttown = ITowns.getTown(report.rttownId);
        report.rtwall   = ITowns.getTown(report.rttownId).buildings().getBuildingLevel("wall"),
        report.rtimg = 'A6',
        report.rtimg += "|"+report.rtwall.toString()
        var __status = {'ok' : '.....☒.', 'bad' : '.....☐.'}//✖
        if (ITowns.getTown(report.rttownId).buildings().getBuildingLevel("tower") == 1 ){
            report.rttower  = RepConvTool.GetLabel('MSGRTYES');
            report.rtimg += '.B6';
            report.rtdetail += __status.ok;
        }
        else{
            report.rttower = RepConvTool.GetLabel('MSGRTNO');
            report.rtimg += '.b6';
            report.rtdetail += __status.bad;
        }
        report.rtimg += '|-';
        report.rtgod    = DM.getl10n('layout').powers_menu.gods[ITowns.getTown(report.rttownId).god()]
        report.rtgodid = ITowns.getTown(report.rttownId).god() || 'nogod';

        report.rtonline = ( cRtOnline.isChecked() /*$('#MSGRTONLINE').attr('checked')*/) ? RepConvTool.GetLabel('MSGRTYES') : RepConvTool.GetLabel('MSGRTNO');

        if (ITowns.getTown(report.rttownId).researches().get("ram")) {
            report.rtram = RepConvTool.GetLabel('MSGRTYES');
            report.rtimg += '.C6';
            report.rtdetail += __status.ok;
        } else {
            report.rtram = RepConvTool.GetLabel('MSGRTNO');
            report.rtimg += '.c6';
            report.rtdetail += __status.bad;
        }
        report.rtimg += '|-';

        if (ITowns.getTown(report.rttownId).researches().get("phalanx")) {
            report.rtphalanx = RepConvTool.GetLabel('MSGRTYES');
            report.rtimg += '.D6';
            report.rtdetail += __status.ok;
        } else {
            report.rtphalanx = RepConvTool.GetLabel('MSGRTNO');
            report.rtimg += '.d6';
            report.rtdetail += __status.bad;
        }
        report.rtimg += '|-';

        report.rtpremium = new Array();
        if (MM.checkAndPublishRawModel('PremiumFeatures', {id : Game.player_id}).get('captain') > Timestamp.server()) {
            report.rtpremium['captain'] = RepConvTool.GetLabel('MSGRTYES');
            report.rtimg += '.E6';
            report.rtdetail += __status.ok;
        } else {
            report.rtpremium['captain'] = RepConvTool.GetLabel('MSGRTNO');
            report.rtimg += '.e6';
            report.rtdetail += __status.bad;
        }
        report.rtimg += '|-';

        if (MM.checkAndPublishRawModel('PremiumFeatures', {id : Game.player_id}).get('commander') > Timestamp.server()) {
            report.rtpremium['commander'] = RepConvTool.GetLabel('MSGRTYES');
            report.rtimg += '.F6';
            report.rtdetail += __status.ok;
        } else {
            report.rtpremium['commander'] = RepConvTool.GetLabel('MSGRTNO');
            report.rtimg += '.f6';
            report.rtdetail += __status.bad;
        }
        report.rtimg += '|-';

        if (MM.checkAndPublishRawModel('PremiumFeatures', {id : Game.player_id}).get('priest') > Timestamp.server()) {
            report.rtpremium['priest'] = RepConvTool.GetLabel('MSGRTYES');
            report.rtimg += '.G6';
            report.rtdetail += __status.ok;
        } else {
            report.rtpremium['priest'] = RepConvTool.GetLabel('MSGRTNO');
            report.rtimg += '.g6';
            report.rtdetail += __status.bad;
        }
        report.rtimg += '|-';

        report.rtlabels = new Array();
        report.rtlabels['wall'] = GameData.buildings.wall.name;
        report.rtlabels['tower'] = GameData.buildings.tower.name;
        report.rtlabels['god'] = RepConvTool.GetLabel('MSGRTGOD');
        report.rtlabels['cstime'] = RepConvTool.GetLabel('MSGRTCSTIME');
        report.rtlabels['online'] = RepConvTool.GetLabel('MSGRTONL');
        report.rtlabels['ram'] = GameData.researches.ram.name;
        report.rtlabels['phalanx'] = GameData.researches.phalanx.name;
        report.rtlabels['captain'] = Game.premium_data.captain.name;
        report.rtlabels['commander'] = Game.premium_data.commander.name;
        report.rtlabels['priest'] = Game.premium_data.priest.name;
		
        // przybywające ataki,wsparcia
        report.unit_movements = { 'support':0, 'attack':0}
        if(MM.getCollections().Support && MM.getCollections().Support[0] && MM.getCollections().Support[0].getIncomingSupportsForTown(Game.townId)){
            report.unit_movements.support = MM.getCollections().Support[0].getIncomingSupportsForTown(Game.townId).getIncoming();
            // $.each(MM.getCollections().Support[0].getIncomingSupportsForTown(Game.townId), function(ind, command){
            //     report.unit_movements.support += ((command.getIncoming()==1) ? 1 : 0)
            // })
        }
        if(MM.getCollections().Attack && MM.getCollections().Attack[0] && MM.getCollections().Attack[0].getIncomingAttacksForTown(Game.townId)){
            report.unit_movements.attack = MM.getCollections().Attack[0].getIncomingAttacksForTown(Game.townId).getIncoming();
            // $.each(MM.getCollections().Attack[0].getIncomingAttacksForTown(Game.townId), function(ind, command){
            //     report.unit_movements.attack += ((command.getIncoming()==1) ? 1 : 0)
            // })
        }
    }

    function _fight() {
        RepConv.Debug && console.log("_fight");
        __getReportTitle();
        __getReportType();
        __getReportTime();
        __getReportMorale();
        __getReportLuck();
        __getReportOldWall();
        __getReportNightBonus();

        report.attacker = __initUnitDetail();
        report.defender = __initUnitDetail();

        report.attacker = getPlayerInfo2(report.attacker, _content.find($('#report_sending_town')));
        report.defender = getPlayerInfo2(report.defender, _content.find($('#report_receiving_town')));

        report.powerAtt = '';
        $.each(_content.find($('div.report_side_attacker div.report_power,div.report_side_attacker div.report_alliance_power')), function(indPower, elemPower){
            report.powerAtt += RepConvTool.getPowerIcon($(elemPower));
        });
        report.powerDef = '';
        $.each(_content.find($('div.report_side_defender div.report_power,div.report_side_defender div.report_alliance_power')), function(indPower, elemPower){
            report.powerDef += RepConvTool.getPowerIcon($(elemPower));
        });

        if (_reportType == "attackSupport") {
            if (cDefUnit.isChecked()){
                __getUnitDetail2Way('defender', 'div.report_side_attacker_unit');
            } else {
                report.defender.full = {img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}
                report.defender.splits = {1:{img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}}
                report.powerDef = '';
            }
        } else {
            if (cAttUnit.isChecked()){
                __getUnitDetail2Way('attacker', 'div.report_side_attacker_unit');
            } else {
                report.attacker.full = {img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}
                report.attacker.splits = {1:{img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}}
                report.powerAtt = '';
            }
            if (cDefUnit.isChecked()){
                __getUnitDetail2Way('defender', 'div.report_side_defender_unit');
            } else {
                report.defender.full = {img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}
                report.defender.splits = {1:{img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}}
                report.powerDef = '';
            }
        }
        __getReportResources();
        __getReportBunt();
    }

    function _attackSupport(){
        RepConv.Debug && console.log("_attackSupport");
        __getReportTitle();
        __getReportType();
        __getReportTime();
        __getReportMorale();
        __getReportLuck();
        __getReportOldWall();
        __getReportNightBonus();

        report.attacker = __initUnitDetail();
        report.defender = __initUnitDetail();

        report.attacker = getPlayerInfo2(report.attacker, _content.find($('#report_sending_town')));
        report.defender = getPlayerInfo2(report.defender, _content.find($('#report_receiving_town')));

        report.powerAtt = '';
        report.powerDef = '';


        if (cDefUnit.isChecked()){//$('#MSGDEFUNIT').attr('checked')) {
            __getUnitDetail2Way('defender', 'div.support_report_summary div.report_units.report_side_defender div.report_side_defender_unit');
        } else {
            report.defender.full = {img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}
            report.defender.splits = {1:{img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}}
        }
        report.bunt = '';
    }

    function _raise() {
        RepConv.Debug && console.log("_raise");
        __getReportTitle();
        __getReportType();
        __getReportTime();
        __getReportMorale();
        __getReportLuck();
        __getReportOldWall();
        __getReportNightBonus();

        report.attacker = __initUnitDetail();
        report.defender = __initUnitDetail();

        report.attacker = getPlayerInfo2(report.attacker, _content.find($('#report_sending_town')));
        report.defender = getPlayerInfo2(report.defender, _content.find($('#report_receiving_town')));

        report.powerAtt = '';
        $.each(_content.find($('div.report_side_attacker div.report_power,div.report_side_attacker div.report_alliance_power')), function(indPower, elemPower){
            report.powerAtt += RepConvTool.getPowerIcon($(elemPower));
        });
        report.powerDef = '';
        $.each(_content.find($('div.report_side_defender div.report_power,div.report_side_defender div.report_alliance_power')), function(indPower, elemPower){
            report.powerDef += RepConvTool.getPowerIcon($(elemPower));
        });

        if (cAttUnit.isChecked()){
            __getUnitDetail2Way('attacker', '#left_side div.report_side_attacker_unit');
        } else {
            report.attacker.full = {img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}
            report.attacker.splits = {1:{img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}}
            report.powerAtt = '';
        }
        if (cDefUnit.isChecked()){
            __getUnitDetail2Way('defender', '#right_side div.report_side_attacker_unit');
        } else {
            report.defender.full = {img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}
            report.defender.splits = {1:{img_url : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), "i")}}
            report.powerDef = '';
        }
        __getReportResources();
        __getReportBunt();
    }

    function _powers() {
        //cRaw.check(true);
        __getReportTitle();
        __getReportTime();
        report.attacker = getPlayerInfo2(report.attacker, _content.find($('#report_sending_town')));
        report.defender = getPlayerInfo2(report.defender, _content.find($('#report_receiving_town')));
        report.morale = '';
        report.luck = '';
        report.oldwall = {};
        report.nightbonus = '';

        report.efekt = {};
        report.type = -1;
        report.resources = {};
        report.power = RepConvTool.Adds(RepConv.Const.staticImg + _content.find($('div#report_power_symbol')).attr('class').replace(/power_icon86x86 (.*)/, '$1') + '_30x30.png', "img");

        report.powerinfo = {};
        report.powerinfo.id = _content.find($('div#report_power_symbol')).attr('class').replace(/power_icon86x86 (.*)/, '$1').split(' ')[0];
        switch (report.powerinfo.id) {
            case "happiness"		        :
            case "fertility_improvement"        :
            case "bolt"			        :
            case "earthquake"		        :
            case "call_of_the_ocean"	        :
            case "town_protection"	        :
            case "cap_of_invisibility"	        :
                report.type = 1;
                break;

            case 'sea_storm'		        :
            case 'divine_sign'		        :
            case 'wisdom'		        :
            case 'transformation'	        :
            case 'patroness'		        :
            case "resurrection"		        :
            case "chain_lightning"              :
            case "demoralizing_plague"	        :
            case "sudden_aid"                   :
            case "demoralized_army"             :
            case "ares_sacrifice"               :
                report.type = 2;
                break;

            case 'kingly_gift'		        :
            case 'wedding'		        :
            case "underworld_treasures"	        :	// Hades srebro - źle działa
            case "wedding_of_the_aristocrats"   :
            case "natures_gift"                 :
                report.type = 3;
                break;

            case 'fair_wind'		        :
            case 'strength_of_heroes'	        :
            case 'desire'		        :
            case "pest"			        :
            case "summoning_of_the_nereids"     :
            case "help_of_the_nereids"          :
                report.type = 4;
                break;

            case "cleanse"          :
                report.type = 5;
                break;
            case "olympus_mortal_curse"          :
                report.defender.player = _getPlayer(_content.find($('#report_sending_town')));
                report.defender.ally   = _getAlly(_content.find($('#report_sending_town')));
                report.type = 2;
                break;
        }
        report.powerinfo.name = GameData.powers[report.powerinfo.id].name,//;
        report.powerinfo.description = _content.find($('div#left_side>p')).html().stripTags(),//report_power_symbol GameData.powers[report.powerinfo.id].description;
        report.efekt.title = _content.find($('div#left_side h4')).html();
        switch (report.type) {
            case 1:
                report.efekt.detail = _content.find($('#right_side p')).html().stripTags().trim();
                break;
            case 2:
                report.efekt.detail = _content.find($('#right_side h4')).html();
                report.resources = __initUnitDetail();
                __getUnitDetail1Way('resources', '#right_side div.report_unit', 5);
                break;
            case 3:
                report.efekt.detail = _content.find($('#report_result')).html();
                __getReportResources();
                break;
            case 5:
                if (_content.find($('.power_icon')).length > 0) {
                    var whatclean = _content.find($('.power_icon')).attr('name');
                    report.efekt.detail = GameData.powers[whatclean].name,
                    report.resources = __initUnitDetail(),
                    report.resources.img_url = RepConvTool.Adds(RepConv.Const.uiImg + '8/' + whatclean + '.png',"img");
                //} else {
                //    report.resources.img_url = '';
                }
                break;
        }
    }

    function _espionage() {
        var newForm = (_content.find('div#spy_buildings>div.spy_success_left_align').length != 0);
        __getReportTitle(),
        __getReportTime(),
        report.morale = '',
        report.luck = '',
        report.oldwall = {},
        report.nightbonus = '',

        report.attacker = __initUnitDetail(),
        report.defender = __initUnitDetail(),

        report.attacker = getPlayerInfo2(report.attacker, _content.find($('#report_sending_town'))),
        report.defender = getPlayerInfo2(report.defender, _content.find($('#report_receiving_town'))),

        report.defender.title = _content.find($('div#left_side>h4')).html() || _content.find($('div#left_side>p')).html(),
        report.defender.success = _content.find($('div#left_side>h4')).length != 0,
        __getUnitDetail1Way('defender', newForm ? 'div#left_side>div.spy_success_left_align>div.report_unit' : 'div#left_side>div.report_unit', 9),

        report.build = {},
        report.build.title = _content.find($('div#spy_buildings>h4')).html(),
        __getBuildDetail1Way('build', newForm ? 'div#spy_buildings>div.spy_success_left_align>div.report_unit' : 'div#spy_buildings>div.report_unit', 9),

        report.iron = {};
        if (_content.find($('div#right_side>h4')).length > 0) {
            report.iron.title = _content.find($('div#right_side>h4'))[0].innerHTML;
        } else if (_content.find($('div#right_side>p')).length > 0) {
            report.iron.title = _content.find($('div#right_side>p'))[0].innerHTML.replace(/(.*:).*/, '$1');
        } else {
            report.iron.title = _content.find($('div#report_game_body>div>p')).html().trim();
        }

        report.iron.count = (_content.find($('div#right_side')).length > 0)
                ? _content.find($('#payed_iron span')).html()
                || (_content.find($('div#right_side>.spy_success_left_align')) && _content.find($('div#right_side>.spy_success_left_align')).eq(0).text().trim())
                || _content.find($('div#right_side>p'))[0].innerHTML.replace(/.*:([0-9]*)/, '$1').trim()
                : '',
        (newForm ? __getReportResources2() : (__getReportResources(), report.resources.title = _content.find($('#right_side>#resources')).prev().html()))
        if (report.iron.count != '') {
            report.iron.count = RepConvTool.AddSize(report.iron.count,8);
        }
        try {
            report.god = {
                title : (newForm ? _content.find($('#right_side>h4')).eq(2).html() : ""),
                img_url : (newForm ? RepConvTool.Adds((RepConv.grcrt_cdn+"ui/3/{0}.png").RCFormat((_content.find($('div#right_side>.spy_success_left_align')).eq(2).find($('.god_display .god_mini')).attr('class').split(/\s+/)[1] || 'nogod')), "img") : "")
            }
        } catch (__err){
            report.god = {
                title : "",
                img_url : ""
            }
        }
    }


    function _command() {
        report.title = _window.parent().parent().find($('span.ui-dialog-title')).html(),
        report.time = '',
        report.back = (_content.find($('.command_icon_wrapper img')).length == 1),
        report.detail = {},
        report.attacker = __initUnitDetail(),
        report.defender = __initUnitDetail(),
        report.ret = (_content.find($('div.return')).length > 0),
        report.farm = 	(
			    (
				_content.find($('.command_icon_wrapper img')).length > 1
				&&
				_content.find($('.command_icon_wrapper img')).attr('src').match(/.*\/(farm).*/)
			    )
			    ||
			    _content.find($('div.report_town_bg_quest')).length == 1
			) ? true : false;

        if (!report.back) {
                report.attacker = getPlayerInfo2(report.attacker, _content.find($('div.attacker')))
        }

        report.defender = getPlayerInfo2(report.defender, _content.find($('div.defender')))

        report.detail.time_title = _content.find($('fieldset.command_info_time legend')).html(),
        report.detail.time_time = _content.find($('fieldset.command_info_time .arrival_time')).html(),

        report.attacker.units_title = 
                (_content.find($('.grcrt_wisdom')).length == 0)
                ? _content.find($('fieldset.command_info_units legend')).html()
                : _content.find($('fieldset.command_info_units .grcrt_wisdom h4')).html()
        
        //__getUnitDetail1Way('attacker', 'div.index_unit', 5);

        //cast_power
        report.detail.power_title = _content.find($('fieldset.command_info_casted_powers legend')).html();
        report.detail.power_img = '';
        if ( cAttUnit.isChecked() ) {// $('#MSGATTUNIT').attr('checked')) {
            __getUnitDetail1Way('attacker', (
                (_content.find($('.grcrt_wisdom')).length == 0)
                    ? 'div.index_unit'
                    : 'div.report_unit'
                ), 5);
            //report.attacker = getUnit(report.attacker, 'div.report_unit');
            $.each(_content.find($('fieldset.command_info_casted_powers div.index_town_powers')), function(indPower, elemPower){
                report.detail.power_img += RepConvTool.getPowerIcon($(elemPower));
            });
            if (_content.find($('.grcrt_wisdom')).length != 0) {
                report.detail.power_img = RepConvTool.Adds(RepConv.Const.uiImg + 'pm/wisdom.png', 'img');
            }
        }else{
            report.attacker.full = {'img_url' : RepConvTool.Adds(RepConvTool.GetLabel('HIDDEN'), 'i') };
        }
        report.resources = __initResources(),
        report.resources.title = (_content.find($('fieldset.command_info_res legend')).length == 0)
			? ''
			: _content.find($('fieldset.command_info_res legend')).html(),
        $.each(_content.find($('div#command_booty li.res_background div')), function(indR, elemR){
            var _UA = {};
            switch(elemR.className){
                case "wood_img":
                    _UA = {
                        i : 'S1',
                        b : $(elemR).nextAll().text()
                    },
                    report.resources.ua.push(_UA),
                    report.resources.wood = $(elemR).nextAll().text();
                    //report.resources.count += RepConvTool.Unit(report.resources.wood, "000") + GRCRTtpl.rct.separator;
                    break;
                case "stone_img":
                    _UA = {
                        i : 'S2',
                        b : $(elemR).nextAll().text()
                    },
                    report.resources.ua.push(_UA),
                    report.resources.stone = $(elemR).nextAll().text();
                    //report.resources.count += RepConvTool.Unit(report.resources.stone, "000") + GRCRTtpl.rct.separator;
                    break;
                case "iron_img":
                    _UA = {
                        i : 'S3',
                        b : $(elemR).nextAll().text()
                    },
                    report.resources.ua.push(_UA),
                    report.resources.iron = $(elemR).nextAll().text();
                    //report.resources.count += RepConvTool.Unit(report.resources.iron, "000") + GRCRTtpl.rct.separator;
                    break;
                case "favor_img":
                    _UA = {
                        i : 'S4',
                        b : $(elemR).nextAll().text()
                    },
                    report.resources.ua.push(_UA),
                    report.resources.power = $(elemR).nextAll().text();
                    //report.resources.count += RepConvTool.Unit(report.resources.power, "000") + GRCRTtpl.rct.separator;
                    break;
            }
        })
        genImage(report.resources, 30, GRCRTtpl.rct.genImgM+5, 10)
        report.bunt = '';
        try {
            report.reportImage = _content.find($('.command_icon_wrapper img')).attr('src').replace(/.*\/([^\/]*)\.png/,'$1')
        } catch (__err){}
    }

    function _ownTropsInTheCity(){
        report.title = (GRCRTtpl.rct.outside)
            ? RepConvTool.Adds(_content.closest($('.ui-dialog-title')).html(), GRCRTtpl.rct.town)
            : RepConvTool.Adds(wnd.getHandler().target_id.toString(), GRCRTtpl.rct.town),
        report.title += ": "+_content.find($('.support_details_box .game_header')).html().stripTags(),
        report.time = '',
        report.defender = {};
        report.defender.full = __initUnit(),
        report.defender.full.img_url = _content.find($('.no_results')).html();
        __getUnitDetail1Way('defender', '.support_details_box .units_list .unit_icon25x25', 11);
        if (report.defender.full.ua.length == 0) {
            report.defender.full.img_url = _content.find($('.no_results')).html();
        }
    }

    function _bbcodeIsland(){
        function _islandRow(item) {
            RepConv.Debug && console.log("_islandRow");
            var _det = $(item).children();

            var res = {
                'col1'  : RepConvTool.Adds(JSON.parse(RepConvTool.Atob(_det.eq(0).attr('href')))[GRCRTtpl.rct.getTown].toString(),GRCRTtpl.rct.town),
                'col2'  : _det.eq(1).html(),
                'col3'  : ($(_det).eq(2).children('a.gp_player_link').length>0)
                            ? RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(_det).eq(2).children('a.gp_player_link').attr('href'))).name, GRCRTtpl.rct.player)
                            : $(_det).eq(2).justtext()
            }
            if(($(_det).eq(2).children('a.gp_player_link').length>0)){
                var _player = JSON.parse(RepConvTool.Atob($(_det).eq(2).children('a.gp_player_link').attr('href')));
                if (RepConvTool.getPlayerData(_player.id)) {
                    if (RepConvTool.getPlayerData(_player.id).alliance_id != ""){
                        res['col4'] = RepConvTool.Adds(RepConvTool.getAllianceData(RepConvTool.getPlayerData(_player.id).alliance_id).name, GRCRTtpl.rct.ally);
                    }
                }
            }
            return res;

        }
        var _idx = 0;
        report.title =
            wnd.getTitle()+' ('+ (
            (GRCRTtpl.rct.outside)
                ? RepConvTool.Adds(wnd.getJQElement().find($('.island_info>h4')).html(), GRCRTtpl.rct.island)
                : RepConvTool.Adds(wnd.getHandler().island.id.toString(), GRCRTtpl.rct.island)
            )+')',
        report.time = '',
        report.header = (GRCRTtpl.rct.outside)
                ? RepConvTool.Adds(wnd.getJQElement().find($('.island_info>h4')).html(), GRCRTtpl.rct.island)
                : RepConvTool.Adds(wnd.getHandler().island.id.toString(), GRCRTtpl.rct.island),
        report.header += "\n",
        report.header += wnd.getJQElement().find($('.islandinfo_coords')).justtext().trim()+"\n",
        report.header += wnd.getJQElement().find($('.islandinfo_free')).justtext().trim(),
        report.linia = {},
        $.each(wnd.getJQElement().find($('.island_info_left .game_list:visible li')), function(ind,elem){
            report.linia[++_idx] = _islandRow(elem);
        })
    }
    
    function _bbcodePlayer(){
        function _townsRow(item) {
            RepConv.Debug && console.log("_townsRow");
            var _det = $(item).children();
            return {
                'col1'  : RepConvTool.Adds(JSON.parse(RepConvTool.Atob(_det.eq(1).attr('href')))[GRCRTtpl.rct.getTown].toString(),GRCRTtpl.rct.town),
                'col2'  : _det.eq(2).html().split('\|')[0].trim(),
                'col3'  : _det.eq(2).html().split('\|')[1].trim()
            }
        }
        var _idx = 0;
        report.title = wnd.getTitle(),
        report.time = '',
        report.header = RepConvTool.Adds(wnd.getJQElement().find($('#player_info h3')).justtext(), GRCRTtpl.rct.player),
        report.header += (
            (wnd.getJQElement().find($('#player_info>a')).length>0)
                ? ' ('+RepConvTool.Adds(wnd.getJQElement().find($('#player_info>a')).attr('onclick').replace(/.*\('(.*)'.*/,'$1'), GRCRTtpl.rct.ally)+')'
                : ''
            ),
        report.linia = {},
        $.each(wnd.getJQElement().find($('#player_towns ul.game_list li')), function(ind,elem){
            report.linia[++_idx] = _townsRow(elem);
        })
    }

    function _bbcodeAlliance(){
        function _playersRow(item) {
            RepConv.Debug && console.log("_playersRow");
            //var _det = $(item).children();
            return {
                'col1'  : RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(item).find('a.gp_player_link').attr('href'))).name,GRCRTtpl.rct.player),
                'col2'  : $(item).find('div.small-descr').html().replace(/^\s*|\s(?=\s)|\t|\s*$/g, "").split(',')[0].trim(),
                'col3'  : $(item).find('div.small-descr').html().replace(/^\s*|\s(?=\s)|\t|\s*$/g, "").split(',')[1].trim()
            }
        }
        var _idx = 0;
        report.title = wnd.getTitle(),
        report.time = '',
        report.header = RepConvTool.Adds(wnd.getTitle(), GRCRTtpl.rct.ally),
        report.linia = {},
        $.each(wnd.getJQElement().find($('#ally_towns ul.members_list>li:nth-child(2) ul li')), function(ind,elem){
            report.linia[++_idx] = _playersRow(elem);
        })
    }

    function _olympus(){
        var temple = MM.getCollections().Temple[0].getTempleById(wnd.attributes.args.target_id);
        RepConv.TEMPL = MM.getCollections().Temple[0].getTempleById(wnd.attributes.args.target_id);
        report.title = wnd.getTitle();
        report.type = '';
        report.time = '';
        report.power = '';
        report.morale = '';
        report.luck = '';
        report.oldwall = {};
        report.nightbonus = '';
        report.attacker = {};
        report.defender = {};
        report.command = {};

        __getUnitDetail1Way('defender', 'div.troops_support>div.unit_slots>div.unit', 9);

        report.temple = {
            owner : (temple.getAllianceName()) ? RepConvTool.Adds(olympOwner.isChecked() ? temple.getAllianceName() : RepConvTool.GetLabel('HIDDEN'), GRCRTtpl.rct.ally) : "",
            god   : {
                img_url : RepConvTool.Adds((RepConv.grcrt_cdn+"ui/3/{0}.png").RCFormat((temple.getGod() || 'nogod')), "img"),
                name : DM.getl10n('layout').powers_menu.gods[temple.getGod() || 'nogod']
            },
            name  : RepConvTool.Adds(((GRCRTtpl.rct.outside || (rBbcode.getValue() == 'BBCODEI')) ? temple.getName() : temple.getId())+"", GRCRTtpl.rct.temple),
            buff : ''

        };
        report.addInfo = _content.find($('div.state_text')).text();
        report.movements_count = {
            attack : _content.find($('.troops_movements_count>.incoming_attacks>.value')).html(),
            support : _content.find($('.troops_movements_count>.incoming_support>.value')).html()
        }

        $.each(temple.getBuff(), function (ii,ee){
            var tmp = GameDataPowers.getTooltipPowerData(GameData.powers[ii], ee, 0);
            report.temple.buff += ((report.temple.buff != '') ? "\n" : "")+tmp.i_descr;
        })
        
        report.linia = {};

        var ti = MM.getModels().TempleInfo[wnd.attributes.args.target_id];

        if (ti.getMovements().length == 0) {
            report.command.title = "\n[i]" + (_content.find($('.troops_movements>.content>.centered_text')).html()||'') + "[/i]";
        } else {
            $.each(ti.getMovements(), function(ind, elem) {
                report.linia[ind] = {};
                report.linia[ind].inout = RepConvTool.Adds(RepConv.Const.staticImg + 'in' + '.png', 'img');
                report.linia[ind].img = RepConvTool.Adds('https://cdn.grcrt.net/ui/c/'+elem.type+'.png', 'img');
                var
                        // _tbtime = $(elem).find('div>span.eta').html().split(':'),
                        // _sec = (parseInt(_tbtime[0])*60*60+parseInt(_tbtime[1])*60+parseInt(_tbtime[2])),
                        _time = readableUnixTimestamp(elem.arrival_at, 'player_timezone', {with_seconds: true, extended_date : true})//formatDateTimeNice(Timestamp.server()+parseInt(_sec), true)
                    report.linia[ind].time = _time;
                var
                    _cmd_town = RepConvTool.Adds( elem['origin_town_'+GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town),
                    _cmd_player = RepConvTool.Adds(elem.sender_name, GRCRTtpl.rct.player),
                    _cmd_ally = '';
                report.linia[ind].text = '';
                // $.each($($($(elem).find('div')[2]).html().replace(/.*<span.*span>(.*)/, '$1')), function(icmd, ecmd){
                //     if ($(ecmd).hasClass('gp_town_link')) {
                    report.linia[ind].text += " "+_cmd_town;
                    // } else if ($(ecmd).hasClass('gp_player_link')) {
                    report.linia[ind].text += " ("+_cmd_player+")";
                    // } else if ($(ecmd).attr('onclick') != undefined) {
                    // report.linia[ind].text += " "+_cmd_ally;
                    // } else if ($(ecmd).text().replace(/(\(|\))/,'').trim().length > 0) {
                    // report.linia[ind].text += " "+$(ecmd).text().trim();
                    // }
                // })
                // ind++;
            });
        }

    }
    // ========================================================================================================

    function _generateReport(){
        RepConv.Debug && console.log("_generateReport");
	//try {
	    $('#RepConvBtns div.RepConvMsg').html('');
	    if (rBbcode.getValue() == 'BBCODEE') {
            GRCRTtpl.rct = GRCRTtpl.rcts.E;
            btnBBCode.show();
	    } else if (rBbcode.getValue() == 'BBCODEI') {
            GRCRTtpl.rct = GRCRTtpl.rcts.I;
            btnBBCode.show();
        } else {
            GRCRTtpl.rct = GRCRTtpl.rcts.A;
            btnBBCode.hide();
	    }
	    btnGenerate.hide();
	    RepConv.Debug && console.log('btns');
	    switch (_reportType) {
            case "command" 	:
                _command();
                break;
            case "breach" 	:
            case "attack" 	:
                _fight();
                break;
            case "take_over" 	:
                _fight(),
                report.showRT = cRtShow.isChecked();
                if (cRtShow.isChecked()){
                    _revolt();
                }
                break;
            case "attackSupport":
                _attackSupport();
                break;
            case "espionage"	:
                _espionage();
                break;
            case "commandList" 	:
                _commandList();
                break;
            case "conqueroldtroops" :
                _conquerTroops();
                break;
            case "conquerold"	:
                _conquerOld();
                break;
            case "support"	:
                _support();
                break;
            case "agoraS"	:
            case "agoraD"	:
                _agora();
                break;
            case "powers" 	:
                _powers();
                break;
            case "raise" 	:
                _raise();
                break;
            case "wall" 	:
                _wall();
                break;
            case "illusion"	:
            case "conquer"	:
            case "found"	:
                _detail();
                break;
            case "conquest"	:
                _conquest();
                break;
            case "academy"	:
                _academy();
                break;
            case "ownTropsInTheCity":
                _ownTropsInTheCity();
                break;
            case "bbcode_island" :
                _bbcodeIsland();
                break;
            case "bbcode_player" :
                _bbcodePlayer();
                break;
            case "bbcode_alliance" :
                _bbcodeAlliance();
                break;
            case "main" :
                _main();
                break;
            case "olympus_temple_info" :
                _olympus();
                break;
	    }
	    RepConv.Debug && console.log(report);
        hideValues();
        
        try {
            report.reportImage = getType(_content.find($('div#report_arrow img')).attr('src'))
        } catch (__err){}
            
	    __repconvValueArray = GRCRTtpl.report(
			(rBbcodeType.getValue() == 'BBCODEP') ? 'txt' : 'tbl',
			_reportType,
			report),//tmpl(GRCRTtpl.templateText(_reportType), report);
	    __currRow = 0,
	    __rowRes = Object.size(__repconvValueArray.splits)-1,
            RepConv.__repconvValueArray = __repconvValueArray.splits,
            RepConv.__repconvValueBBCode = __repconvValueArray.single,
            storeHtml(__repconvValueArray.splits,'')
            // storeHtml(__repconvValueArray.single,'I'),
	    $('#grcrt_pagination').show(),
	    __pagination();
        if(rBbcode.getValue() == 'BBCODEI'){
            $('#grcrt_pagination').hide()
        }

    }
    function __pagination(){
        if(rBbcode.getValue() != 'BBCODEA'){
            btnBBCode.show()
        }
        btnView.hide(),
        $('#grcrt_pagination').show(),
        $('#grcrt_pagination .pages').html((__currRow+1)+"/"+(__rowRes+1)),
        btnLeft.disable(__currRow==0),
        btnRight.disable(__currRow==__rowRes),
        repconvValue = __repconvValueArray.splits[__currRow],
        setTextArea(repconvValue);
    }
    
    function optionsReport() {
        var
	    tag1 = $('<div/>', {'id': 'publish_report_options1'}),
	    tag2 = $('<div/>', {'id': 'publish_report_options2'}),
	    tag3 = $('<div/>', {'id': 'publish_report_options3'}),
	    tag4 = $('<div/>', {'id': 'publish_report_options4'}),
	    chbxlist1 = {},
	    chbxlist2 = {},//['MSGHIDAT', 'MSGHIDDE'];
	    chbxlist3 = {},
	    ramka1 = RepConvTool.RamkaLight(RepConvTool.GetLabel('MSGQUEST'), tag1),
	    ramka2 = RepConvTool.RamkaLight(RepConvTool.GetLabel('MSGHIDAD'), tag2),
	    ramka3 = RepConvTool.RamkaLight(RepConvTool.GetLabel('MSGRTLBL'), tag4);
        
        function addChbx2Tag(pList, pTag, pChecked){
            $.each(pList, function(ind, elem) {
                switch (elem) {
                    case 'MSGATTUNIT':
                        cAttUnit = genCheckBox(elem, pChecked),
                        pTag.append(cAttUnit);
                        break;
                    case 'MSGRESOURCE':
                        cResource = genCheckBox(elem, pChecked),
                        pTag.append(cResource);
                        break;
                    case 'MSGHIDAT':
                        cHidAt = genCheckBox(elem, pChecked),
                        pTag.append(cHidAt);
                        break;
                    case 'MSGHIDDE':
                        cHidDe = genCheckBox(elem, pChecked),
                        pTag.append(cHidDe);
                        break;
                    case 'MSGDEFUNIT':
                        cDefUnit = genCheckBox(elem, pChecked),
                        pTag.append(cDefUnit);
                        break;
                    case 'MSGRTSHOW':
                        cRtShow = genCheckBox(elem, pChecked),
                        cRtShow.on("cbx:check", function(){
                            if (!cRtShow.isChecked()) {
                                cRtOnline.check(false);
                            }
                        });
                        pTag.append(cRtShow);
                        break;
                    case 'MSGRTONLINE':
                        cRtOnline = genCheckBox(elem, pChecked),
                        pTag.append(cRtOnline);
                        break;
                    case 'MSGUNITS':
                        cUnits = genCheckBox(elem, pChecked),
                        pTag.append(cUnits);
                        break;
                    case 'MSGBUILD':
                        cBuild = genCheckBox(elem, pChecked),
                        pTag.append(cBuild);
                        break;
                    case 'MSGUSC':
                        cUSC = genCheckBox(elem, pChecked),
                        pTag.append(cUSC);
                        break;
                    case 'MSGRAW':
                        cRaw = genCheckBox(elem, pChecked),
                        pTag.append(cRaw);
                        break;
                    case 'MSGDETAIL':
                        cDetail = genCheckBox(elem, pChecked),
                        pTag.append(cDetail);
                        break;
                    case 'MSGSHOWCOST':
                        cShowCost = genCheckBox(elem, pChecked),
                        pTag.append(cShowCost);
                        break;
                    default:
                        RepConv.Debug && console.log(elem);
                }
            });
        }
        $(ramka2).attr('style', 'width: 50%; float:right;');
        $(ramka3).attr('style', 'clear: both; top: 10px');

        RepConv.Debug && console.log('_reportType=' + _reportType);
        switch (_reportType) {
            case "command" 		:
                _labelArray = "attack";
                chbxlist1 = ['MSGATTUNIT', 'MSGRESOURCE'];
                chbxlist2 = ['MSGHIDAT', 'MSGHIDDE'];
                break;
            case "breach"       :
            case "attack"       :
                _labelArray = "attack";
                chbxlist1 = ['MSGATTUNIT', 'MSGDEFUNIT', 'MSGRESOURCE','MSGSHOWCOST'];
                chbxlist2 = ['MSGHIDAT', 'MSGHIDDE', ''];
                break;
            case "take_over"    :
                _labelArray = "attack";
                chbxlist1 = ['MSGATTUNIT', 'MSGDEFUNIT', 'MSGRESOURCE','MSGSHOWCOST'];
                chbxlist2 = ['MSGHIDAT', 'MSGHIDDE', ''];
                __getReportBunt();
                if ((getPlayerInfo(_content.find($('#report_receiving_town'))).playerName == Game.player_name) && report.bunt != ''){
                    chbxlist3 = ['MSGRTSHOW', 'MSGRTONLINE'];
                }
                break;
            case "espionage"    :
                _labelArray = "espionage";
                chbxlist1 = ['MSGUNITS', 'MSGBUILD', 'MSGUSC', 'MSGRAW'];
                chbxlist2 = ['MSGHIDAT', 'MSGHIDDE', '', ''];
                break;
            case "commandList" 	:
                _labelArray = "attack";
                chbxlist1 = ['MSGDETAIL'];
                chbxlist2 = {};
                break;
            case "conquer"		:
            case "illusion"		:
                _labelArray = "attack";
                chbxlist1 = {};
                chbxlist2 = ['MSGHIDAT', 'MSGHIDDE'];
        		break;
            case "conquest"	:
            case "conquerold"	:
                _labelArray = "attack";
                chbxlist1 = ['MSGATTUNIT'];
                chbxlist2 = ['MSGHIDDE'];
                break;
            case "attackSupport":
                _labelArray = "attack";
                chbxlist1 = ['MSGDEFUNIT', 'MSGSHOWCOST'];
                chbxlist2 = ['MSGHIDAT', 'MSGHIDDE'];
                break;
            case "support":
                _labelArray = "support";
                chbxlist1 = ['MSGATTUNIT', ''];
                chbxlist2 = ['MSGHIDAT', 'MSGHIDDE'];
                break;
            case "agoraD"		:
                _labelArray = "support";
                chbxlist1 = ['MSGDEFUNIT'];
                chbxlist2 = ['MSGHIDAT'];
                break;
            case "agoraS"		:
                _labelArray = "support";
                chbxlist1 = ['MSGATTUNIT'];
                chbxlist2 = ['MSGHIDDE'];
                break;
            case "powers":
                _labelArray = "attack";
                chbxlist1 = {};
                chbxlist2 = ['MSGHIDDE'];
                break;
            case "raise" 		:
                _labelArray = "attack";
                chbxlist1 = ['MSGATTUNIT', 'MSGDEFUNIT'];
                chbxlist2 = ['MSGHIDAT', 'MSGHIDDE'];
                break;
            case "found"		:
                _labelArray = "attack";
                chbxlist1 = {};
                chbxlist2 = ['MSGHIDAT'];
                break;
            case "conqueroldtroops" :
                _labelArray = "attack";
                chbxlist1 = {};
                chbxlist2 = {};
                break;
            //case "bbcode_island" :
            //    _labelArray = "attack";
            //    chbxlist1 = {};
            //    chbxlist2 = {};
            //    break;
    	    default:
                _labelArray = "attack";
                chbxlist1 = {};
                chbxlist2 = {};
                break;
        }
        switch (Math.max(chbxlist1.length || 0, chbxlist2.length || 0)) {
            case 0:
                _ramkaHeight = 330;
                break;
            case 1:
                _ramkaHeight = 269;
                break;
            case 2:
                _ramkaHeight = 265;
                break;
            case 3:
                _ramkaHeight = 250;
                break;
            case 4:
                _ramkaHeight = 233;
                break;
        }
        _ramkaHeight -= (chbxlist3.length>0) ? 71 : 0;

        RepConv.Lang.ATTACKER = RepConvTool.GetLabel('LABELS.'+_labelArray+'.ATTACKER');
        RepConv.Lang.DEFENDER = RepConvTool.GetLabel('LABELS.'+_labelArray+'.DEFENDER');
        RepConv.Lang.MSGHIDAT = RepConvTool.GetLabel('LABELS.'+_labelArray+'.MSGHIDAT');
        RepConv.Lang.MSGHIDDE = RepConvTool.GetLabel('LABELS.'+_labelArray+'.MSGHIDDE');
        RepConv.Lang.MSGATTUNIT = RepConvTool.GetLabel('LABELS.'+_labelArray+'.MSGATTUNIT');
        RepConv.Lang.MSGDEFUNIT = RepConvTool.GetLabel('LABELS.'+_labelArray+'.MSGDEFUNIT');
        RepConv.Debug && console.log(RepConv.Lang.ATTACKER);
        RepConv.Debug && console.log(RepConv.Lang.LABELS[_labelArray].ATTACKER);
        RepConv.Debug && console.log(_labelArray);

        addChbx2Tag(chbxlist1, tag1, true)
        addChbx2Tag(chbxlist2, tag2, false)
        addChbx2Tag(chbxlist3, tag4, true)

        try {
            var _townDefender = JSON.parse(RepConvTool.Atob(_content.find($('#report_receiving_town .gp_town_link')).attr('href')))
            tag4.append(
                $('<div/>',{
                    'id':'GRCRT_block',
                    'rel':_townDefender.id
                })
                .css('position','absolute')
                .css('top','18px')
                .css('background-color','rgb(255, 0, 0)')
                .css('width','801px')
                .css('height','32px')
                .css('color','white')
                .css('font-weight','bold')
                .css('padding','2px')
                .css('text-align','center')
                .css('display', ((_townDefender.id == Game.townId) ? 'none' : 'block'))
                .html(RepConvTool.GetLabel('MSGRTERR')+_townDefender.name))
        } catch (ex){}

        if ((chbxlist1.length > 0) && (chbxlist2.length > 0)) {
            $(ramka1).attr('style', 'width: 50%; float:left;');
            $(ramka2).attr('style', 'width: 50%; float:left;');
        } else if (chbxlist1.length > 0) {
            $(ramka1).attr('style', 'clear: both; top: 10px;');
            $(ramka2).attr('style', 'display: none');
        } else if (chbxlist2.length > 0) {
            $(ramka1).attr('style', 'display: none');
            $(ramka2).attr('style', 'clear: both; top: 10px;');
        } else {
            $(ramka1).attr('style', 'display: none');
            $(ramka2).attr('style', 'display: none');
        }

        _formbody.append(ramka1);
        _formbody.append(ramka2);
        
        if (chbxlist3.length > 0 && ((_content.find($('#report_receiving_town .gp_player_link')).html()) == Game.player_name) ) {
            _formbody.append(ramka3);
        }
    }

    function optionsWall() {
        cAsAttDef = genCheckBox('MSGASATTDEF', true, 'MSGASATT'),
        cAsDefDef = genCheckBox('MSGASDEFDEF', true, 'MSGASDEF'),
        cAsAttLos = genCheckBox('MSGASATTLOS', true, 'MSGASATT'),
        cAsDefLos = genCheckBox('MSGASDEFLOS', true, 'MSGASDEF'),
        rShowDiff = $('<div/>',{'class':'radiobutton'})
                    .radiobutton({
                        value: 'MSGDIFF2',
                        template: "tpl_radiobutton",
                        options: [{
                            value: 'MSGDIFF1',
                            name: RepConvTool.GetLabel('MSGDIFF1')
                        }, {
                            value: 'MSGDIFF2',
                            name: RepConvTool.GetLabel('MSGDIFF2')
                        }, {
                            value: 'MSGDIFF3',
                            name: RepConvTool.GetLabel('MSGDIFF3')
                        }]
                    })
                    .on("rb:change:value", function() {
                        RepConv.Debug && console.log('rShowDiff='+rShowDiff.getValue());
                        readyGenerate();
                    })
        ;
        var tag = $('<div/>')
                .append(
                    $('<fieldset/>', {'id': 'publish_report_options_group_1L', 'style': 'width:46%; float: left; border : 0px;'})
                        .append($('<legend/>').html(RepConvTool.GetLabel('MSGDEFSITE')))
                        .append(cAsAttDef)
                        .append(cAsDefDef)
                )
                .append(
                    $('<fieldset/>', {'id': 'publish_report_options_group_1R', 'style': 'width:46%; float: right; border : 0px;'})
                        .append($('<legend/>').html(RepConvTool.GetLabel('MSGLOSSITE')))
                        .append(cAsAttLos)
                        .append(cAsDefLos)
                )
                .append(
                    $('<div/>', {'style': 'width: 100%; text-align: center; clear: both;'})
                        .append(rShowDiff)
                );
        if (_window.find($('div.grcrt_wall_diff')).length == 0) {
            rShowDiff.setValue('MSGDIFF1'),
            rShowDiff.disable();
        }
        var ramka = RepConvTool.RamkaLight(RepConvTool.GetLabel('MSGQUEST'), tag, 125);
        _formbody.append(ramka);
    }
    function optionsOlymp() {
        // olympOwner = genCheckBox('OLYMPOWNER', true), 
        // olympTroop = genCheckBox('OLYMPTROOP', true), 
        // olympAcCom = genCheckBox('OLYMPACCOM', false), 
        // olympDesc = genCheckBox('OLYMPDESC', true);
        var tag = $('<div/>')
                    .append(olympOwner)
                    .append(olympDesc)
                    .append(olympTroop)
                    .append(olympAcCom)
                ;
        var ramka = RepConvTool.RamkaLight(RepConvTool.GetLabel('MSGQUEST'), tag, 125);
        _formbody.append(ramka);
    }

    function readyGenerate(){
        try{
            if ($('#repConvArea').length == 1) {
                $('#repConvArea').remove();
            }
            if ($('#RepConvDivPrev').length == 1) {
                $('#RepConvDivPrev').remove();
            }
            $('#RepConvBtns div.RepConvMsg').html(''),
            btnGenerate.show()
            btnView.hide(),
            btnBBCode.hide(),
            $('#grcrt_pagination').hide();
        } catch (ex){
            RepConv.Debug && console.log(ex);
        }
    }

    function publBB() {
        // rBbcode = $('<div/>',{'class':'radiobutton'})
        //             .radiobutton({
        //                 value: 'BBCODEA',
        //                 template: "tpl_radiobutton",
        //                 options: [{
        //                     value: 'BBCODEA',
        //                     name: RepConvTool.GetLabel('BBALLY')
        //                 }, {
        //                     value: 'BBCODEE',
        //                     name: RepConvTool.GetLabel('BBFORUM')
        //                 }, {
        //                     value: 'BBCODEI',
        //                     name: RepConvTool.GetLabel('BBIMG')
        //                 }]
        //             })
        //             .on("rb:change:value", function() {
        //                 RepConv.Debug && console.log('rBbcode='+rBbcode.getValue());
        //                 readyGenerate();
        //             }),
        // rBbcodeType = $('<div/>',{'class':'radiobutton'})
        //             .radiobutton({
        //                 value: (RepConv.active.reportFormat) ? 'BBCODEH' : 'BBCODEP',
        //                 template: "tpl_radiobutton",
        //                 options: [{
        //                     value: 'BBCODEP',
        //                     name: RepConvTool.GetLabel('BBTEXT')
        //                 }, {
        //                     value: 'BBCODEH',
        //                     name: RepConvTool.GetLabel('BBHTML')
        //                 }]

        //             })
        //             .on("rb:change:value", function() {
        //                 RepConv.Debug && console.log('rBbcodeType='+rBbcodeType.getValue());
        //                 readyGenerate();
        //             })

                
        var
            tag = $('<div/>')
                .append(
                    rBbcode
                )
                .append(
                    rBbcodeType
                ),
            ramka = RepConvTool.RamkaLight(RepConvTool.GetLabel('MSGFORUM'), tag, 120);
        $(ramka).attr('style', 'clear: both; top: 10px');
        _formbody.append(ramka);
    }

    function btns() {
        btnGenerate = RepConvTool.AddBtn('BTNGENER'),
        btnView = RepConvTool.AddBtn('BTNVIEW'),
        btnBBCode = RepConvTool.AddBtn('BTNVIEWBB'),
        btnLeft = $('<div/>', {'class' : 'button_arrow left'}).button(),
        btnRight = $('<div/>', {'class' : 'button_arrow right'}).button();
        var repconvValue = '';
        //strzałki
        $('<div/>',{'id':'grcrt_pagination','class':'slider grepo_slider'})
            .css({'width':'70px','float':'right','padding':'2px 5px','text-align':'center', 'display': 'inline-block'})
            .append(
            btnLeft
                        .css('float','left')
                .click(function(){
                if(__currRow > 0){
                    __currRow--,
                    __pagination();
                }
                })
            )
            .append($('<div/>',{'class':"pages", 'style':'float: left; width: 40px; padding-top: 3px;'}).html(""))
            .append(
            btnRight
                    .css('float','left')
                .click(function(){
                if(__currRow < __rowRes){
                    __currRow++,
                    __pagination();
                }
                })
            )
            .hide()
            .appendTo((window.RepConvOptionsWnd.getJQElement()).find($('#RepConvBtns')));

        btnGenerate
            .click(function() {
                btnBBCode.show();
                btnView.hide();
                _generateReport();
            })
            .appendTo((window.RepConvOptionsWnd.getJQElement()).find($('#RepConvBtns')));

        btnView
            .hide()
            .click(function() {
                if ($('#repConvArea').length > 0) {
                    $('#repConvArea').slideToggle(),//.toggle(200);
                    $('#RepConvDivPrev').slideToggle(),//.toggle(200);
                    btnBBCode.show(),
                    btnView.hide();
                }
            })
            .appendTo((window.RepConvOptionsWnd.getJQElement()).find($('#RepConvBtns')));

        btnBBCode
            .hide()
            .click(function() {
                if ($('#repConvArea').length > 0) {
                    $('#repConvArea').slideToggle(),//.toggle(200);
                    $('#RepConvDivPrev').slideToggle(),//.toggle(200);
                    btnView.show(),
                    btnBBCode.hide();
                }
            })
            .appendTo((window.RepConvOptionsWnd.getJQElement()).find($('#RepConvBtns')));

        $('<div/>', {'class': "RepConvMsg", 'style': "float: left; margin: 5px;"})
            .appendTo((window.RepConvOptionsWnd.getJQElement()).find($('#RepConvBtns')));//'#RepConvBtns');
            (window.RepConvOptionsWnd.getJQElement()).find($('#RepConvBtns')).css('display', 'block');
    }
    
    if(typeof wnd == 'object'){
        RepConv.Debug && console.log('wnd.type=' + wnd.getType());
        var
            _newWindow = (typeof wnd.getID == 'undefined'),
            _window = (_newWindow) ? $('#window_'+wnd.getIdentifier()) : $('#gpwnd_'+wnd.getID()),
            _content = (_newWindow) ? _window.find('div.window_content') : _window,
            _reportType = getWindowType(wnd),
            _reportImage = '',
            _breakline = $('<br/>', {'style': 'clear:both;'}),
            _formbody = $('<div/>', {'style': 'margin-top: 3px'}),
            _labelArray = "attack",
            _ramkaHeight = 225,
            report = {},
            rBbcode = $('<div/>',{'class':'radiobutton'})
                        .radiobutton({
                            value: 'BBCODEA',
                            template: "tpl_radiobutton",
                            options: [{
                                value: 'BBCODEA',
                                name: RepConvTool.GetLabel('BBALLY')
                            }, {
                                value: 'BBCODEE',
                                name: RepConvTool.GetLabel('BBFORUM')
                            }, {
                                value: 'BBCODEI',
                                name: RepConvTool.GetLabel('BBIMG')
                            }]
                        })
                        .on("rb:change:value", function() {
                            RepConv.Debug && console.log('rBbcode='+rBbcode.getValue());
                            readyGenerate();
                        }),
            rBbcodeType = $('<div/>',{'class':'radiobutton'})
                        .radiobutton({
                            value: (RepConv.active.reportFormat) ? 'BBCODEH' : 'BBCODEP',
                            template: "tpl_radiobutton",
                            options: [{
                                value: 'BBCODEP',
                                name: RepConvTool.GetLabel('BBTEXT')
                            }, {
                                value: 'BBCODEH',
                                name: RepConvTool.GetLabel('BBHTML')
                            }]

                        })
                        .on("rb:change:value", function() {
                            RepConv.Debug && console.log('rBbcodeType='+rBbcodeType.getValue());
                            readyGenerate();
                        }),
            // rBbcode, rBbcodeType,
            cAsAttDef, cAsDefDef, cAsAttLos, cAsDefLos, rShowDiff,
            cAttUnit = genCheckBox('MSGATTUNIT', false),
            cDefUnit = genCheckBox('MSGDEFUNIT', false),
            cShowCost = genCheckBox('MSGSHOWCOST', false),
            cResource = genCheckBox('MSGRESOURCE', false),
            cHidAt = genCheckBox('MSGHIDAT', false),
            cHidDe = genCheckBox('MSGHIDDE', false),
            cUnits = genCheckBox('MSGUNITS', false),
            cBuild = genCheckBox('MSGBUILD', false),
            cUSC = genCheckBox('MSGUSC', false),
            cRaw = genCheckBox('MSGRAW', false),
            cDetail = genCheckBox('MSGDETAIL', false),
            cRtShow = genCheckBox('MSGRTSHOW', false),
            cRtOnline = genCheckBox('MSGRTONLINE', false),
            //cSpoiler = genCheckBox('MSGSPOILER', false),
            btnGenerate, btnView, btnBBCode, btnLeft, btnRight,
            repconvValue, __repconvValueArray,
            __currRow = 0, __rowRes = 0,
            olympOwner = genCheckBox('OLYMPOWNER', true), 
            olympTroop = genCheckBox('OLYMPTROOP', true), 
            olympAcCom = genCheckBox('OLYMPACCOM', true), 
            olympDesc = genCheckBox('OLYMPDESC', true);
        try {
            (WM.getWindowByType("grcrt_convert")[0]).close()
        } catch (e){}
        window.RepConvOptionsWnd = WF.open("grcrt_convert");
        RepConv.Debug && console.log('Typ=' + _reportType);
        switch (_reportType) {
            case "command" 		:
            case "breach" 		:
            case "attack" 		:
            case "attackSupport"	:
            case "raise" 		:
            case "take_over" 	:
            case "commandList" 	:
            case "conquerold"	:
            case "conqueroldtroops" :
            case "support"		:
            case "agoraD"		:
            case "agoraS"		:
            case "powers"		:
            case "espionage"	:
            case "conquer"		:
            case "found"		:
            case "illusion"		:
            case "conquest"		:
            case "academy" 		:
            case "main"         :
            case "ownTropsInTheCity":
            case "bbcode_island"    :
            case "bbcode_player"    :
            case "bbcode_alliance"  :
                optionsReport();
                break;
            case "wall"	:
                optionsWall();
                _ramkaHeight = 220;
                break;
            case "olympus_temple_info" :
                optionsOlymp();
                _ramkaHeight = 220;
                break;
        }
        publBB();
        var _ramka = RepConvTool.RamkaLight(RepConvTool.GetLabel('MSGBBCODE'), '');
        $(_ramka).attr('id', 'RepConvAreas');
        $(_formbody).append(_ramka);
        window.RepConvOptionsWnd.appendContent(RepConvTool.Ramka(RepConvTool.GetLabel('MSGTITLE'), _formbody, 485));
        window.RepConvOptionsWnd.getJQElement().find($('#publish_report_options1,#publish_report_options2')).height(window.RepConvOptionsWnd.getJQElement().find($('#publish_report_options1,#publish_report_options2')).height())
        $('#RepConvAreas div.box_content').height(_ramkaHeight);
        btns();

        ((_newWindow) ? _window.find($('.btn_wnd.close')) : wnd.getJQCloseButton()) 
            .bind('click', function(event) {
                try {
                    window.RepConvOptionsWnd.close();
                } catch (exp) {
                }
                window.RepConvOptionsWnd = undefined;
            });
    }
}
