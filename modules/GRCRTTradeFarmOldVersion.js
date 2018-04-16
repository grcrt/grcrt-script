function _GRCRTTradeFarmOldVersion(){
    //'use strict';
    this.grcrtratio = function(ratio){
        var
            bb = ratio.split(":"),
	    cc = bb[0]/bb[1],
            res = Math.round((cc)*100)/100;
        if (res >= 1) {
            return '<span style="color:green; font-weight: bold">1:'+res+'</span>'
        } else {
            return '<span style="color:red; font-weight: bold">1:'+res+'</span>'
        }
    }

    function islandView(RCGP){ // info o graczach na wyspie - dodanie listy miast w BBCode
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
        $.each(RCGP.getJQElement().find($('.fp_property>.popup_ratio')).parent(), function(ind, elem){
            if ($(elem).hasClass('grcrt_trade')) {
            } else {
				if ($(elem).children(0).eq(0).hasClass("you_pay")) {
				} else {
					var
						p0 = $(elem).children(0).eq(0).attr('class'),
						p2 = $(elem).children(0).eq(2).attr('class');
					$(elem).children(0).eq(0).attr('class',p2),
					$(elem).children(0).eq(2).attr('class',p0)
				}
                $(elem).children(0).eq(1).html(GRCRTTradeFarmOldVersion.grcrtratio($(elem).children(0).eq(1).html())),
                $(elem).addClass('grcrt_trade')
            }
        })
    }
    
    function grcrttrade(RCGP){ // info o graczach na wyspie - dodanie listy miast w BBCode
        var
            WndName = (RCGP).getName(),
            WndId = '#' + WndName;
	if (RCGP.getJQElement().find($(".grcrt_trin")).length == 0) {
	    var
	    	dest = RCGP.getJQElement().find($(".trade_slider_box>a.button")).attr('onclick').replace(/.*'([0-9]*)'.*/,'$1'),
		farm = WMap.mapData.getFarmTown(dest),
		ratio = Math.round(farm.ratio*100)/100,
		spin_block = false,
		sp_trade_slider_input, sp_trade_slider_output,
		nn;
		
	    RCGP.getJQElement().find($('.trade_slider_count>input.trade_slider_input')).before($('<div/>',{'class':'grcrt_trin spinner'}))
	    RCGP.getJQElement().find($('.trade_slider_count>input.trade_slider_output')).before($('<div/>',{'class':'grcrt_trout spinner'}))
	    sp_trade_slider_input = RCGP.getJQElement().find($(".grcrt_trin"))
		.spinner({
		    value: 100,
		    step: 100,
		    max: Math.min(ITowns.getTown(Game.townId).getAvailableTradeCapacity(),2000),
		    min: 100
		})
		.on("sp:change:value", function() {
		    if (!spin_block) {
			spin_block = true;
			RCGP.getJQElement().find($('.trade_slider_count>input.trade_slider_input')).select().val(sp_trade_slider_input.getValue()).blur()
			sp_trade_slider_output.setValue(ratio*sp_trade_slider_input.getValue())
			RCGP.getJQElement().find($('.trade_slider_count>input.trade_slider_output')).select().val(sp_trade_slider_output.getValue()).blur()
			spin_block = false;
		    }
		})
	    
	    sp_trade_slider_output = RCGP.getJQElement().find($(".grcrt_trout"))
		.spinner({
		    value: Math.round(ratio*100),
		    step: 100,
		    max: Math.round(ratio*Math.min(ITowns.getTown(Game.townId).getAvailableTradeCapacity(),2000)),
		    min: Math.round(ratio*100)
		})
		.on("sp:change:value", function() {
		    if (!spin_block) {
			spin_block = true;
			RCGP.getJQElement().find($('.trade_slider_count>input.trade_slider_output')).select().val(sp_trade_slider_output.getValue()).blur()
			sp_trade_slider_input.setValue(sp_trade_slider_output.getValue()/ratio)
			RCGP.getJQElement().find($('.trade_slider_count>input.trade_slider_input')).select().val(sp_trade_slider_input.getValue()).blur()
			spin_block = false;
		    }
		})
	    sp_trade_slider_input.setValue(Math.min(ITowns.getTown(Game.townId).getAvailableTradeCapacity(),sp_trade_slider_input.getMax()));

	    //RCGP.getJQElement().find($(".grcrt_trin")).css(RCGP.getJQElement().find($('.trade_slider_count>input.trade_slider_output')).position())
	    //RCGP.getJQElement().find($(".grcrt_trout")).css(RCGP.getJQElement().find($('.trade_slider_count>input.trade_slider_input')).position())
	    
	    RCGP.getJQElement().find($(".grcrt_trin")).css({top:110, left: 96})
	    RCGP.getJQElement().find($(".grcrt_trout")).css({top:110, left: 165})
	    RCGP.getJQElement().find($("input.trade_slider_input")).hide()
	    RCGP.getJQElement().find($("input.trade_slider_output")).hide()
	    RCGP.getJQElement().find($("div.left_container")).hide()
	    RCGP.getJQElement().find($("div.right_container")).hide()
	    RCGP.getJQElement().find($("div.trade_slider_slider")).hide()
	    RCGP.getJQElement().find($("form.trade_slider_count img.demand")).css({left: 24})
	    RCGP.getJQElement().find($("form.trade_slider_count img.offer")).css({left: 151})
	    RCGP.getJQElement().find($("form.trade_slider_count span.offer_header")).css({left: 228, right: 'auto'})
	    RCGP.getJQElement().find($("form.trade_slider_count span.demand_header")).css({left: 'auto', right: 228})
	    RCGP.getJQElement().find($(".trade_slider_box>a.button")).css({bottom:21})
	    
	    if (ratio >= 1) {
		nn = '<span style="color:rgb(0, 224, 28)">1:'+ratio+'</span>'
	    } else {
		nn = '<span style="color:rgb(247, 59, 34)">1:'+ratio+'</span>'
	    }

	    RCGP.getJQElement().find($(".trade_ratio:not(.trade_ratio_back)")).html(nn)
	    RCGP.getJQElement().find($(".trade_ratio.trade_ratio_back")).html(nn.stripTags());
	}
    }
    
    /////////////////
    // przycisk dla okien
    /////////////////
    function addOldBtns(RCGP){
        RepConv.AQQ = RCGP;
	if (RepConv.settings[RepConv.Cookie+'_trade']) {
	    switch (RCGP.getController()) {
		case "farm_town_info" :
		    switch (RCGP.getContext().sub) {
			case "farm_town_info_trading" :
			    grcrttrade(RCGP);
			    break;
		    }
		    break;
		case "farm_town_overviews" :
		    switch (RCGP.getContext().sub) {
			case "farm_town_overviews_index" :
			    islandView(RCGP);
			    break;
		    }
		    break;
		case "island_info" :
		    islandView(RCGP); // bbcode dla miast na wyspie
		    break;
	    }
	}
    }
    
    this.init = function(){
        if (typeof GameData.FarmMouseOverTemplate == 'undefined') {
            setTimeout(function(){GRCRTTradeFarmOldVersion.init()},500);
        } else {
	    if (GameData.FarmMouseOverTemplate.indexOf('you_pay') == -1) {
		if (RepConv.settings[RepConv.Cookie+'_trade'] == 'undefined') {
		    RepConvTool.setItem(RepConv.Cookie+'_trade', true);
		}
		if (RepConv.settings[RepConv.Cookie+'_trade']) {
		    if (typeof GameData.FarmMouseOverTemplateGRCRT == 'undefined' || GameData.FarmMouseOverTemplateOrg != GameData.FarmMouseOverTemplate) {
			GameData.FarmMouseOverTemplateOrg = GameData.FarmMouseOverTemplate
			GameData.FarmMouseOverTemplateGRCRT = GameData.FarmMouseOverTemplate.replace(/offer/,'dem_and').replace(/demand/,'offer').replace(/dem_and/,'demand').replace(/ ratio /,'GRCRTTradeFarmOldVersion.grcrtratio(ratio)'),
			GameData.FarmMouseOverTemplate = GameData.FarmMouseOverTemplateGRCRT
		    }
		} else {
		    if (typeof GameData.FarmMouseOverTemplateGRCRT != 'undefined') {
			GameData.FarmMouseOverTemplate = GameData.FarmMouseOverTemplateOrg;
		    }
		}
	    } else {
		RepConv.settings[RepConv.Cookie+'_trade'] = false;
	    }
        }
    }

    $(document)
        .ajaxComplete(function(e, xhr, settings) {
            if (typeof settings != 'undefined') {
                var _tmp = settings.url.replace(/\/game\/(.*)\?.*/,'$1'),
                _type = (_tmp != 'frontend_bridge') ? _tmp : ((settings.url.indexOf("json")>-1) ? JSON.parse(unescape(settings.url).split('&')[3].split('=')[1]).window_type : _tmp);
                RepConv.requests[_type] = {
                        url : settings.url,
                        responseText : xhr.responseText
                }
                $.each(Layout.wnd.getAllOpen(), function(ind, elem) {
                    if (RepConv.Debug) console.log('Dodanie przycisku dla starego okna o ID = ' + (elem).getID());
                    addOldBtns(Layout.wnd.GetByID((elem).getID()));
                });
            }
        })
    //
    RepConv.initArray.push('GRCRTTradeFarmOldVersion.init()');
    // obsługa ładowania ustawień
    $.Observer(GameEvents.grcrt.settings.load)
        .subscribe('GRCRToldTravel',function(){
	    	GRCRTTradeFarmOldVersion.init();
		});
}


/*

grcrtratio = function(ratio){
    var
	bb = ratio.split(":"),
	res = Math.round((bb[0]/bb[1])*100)/100;
    if (res >= 1) {
	return '<span style="color:green; font-weight: bold">1:'+res+'</span>'
    } else {
	return '<span style="color:red; font-weight: bold">1:'+res+'</span>'
    }
}

if (typeof GameData.FarmMouseOverTemplateGRCRT == 'undefined' || GameData.FarmMouseOverTemplateOrg != GameData.FarmMouseOverTemplate) {
    GameData.FarmMouseOverTemplateOrg = GameData.FarmMouseOverTemplate
    GameData.FarmMouseOverTemplateGRCRT = GameData.FarmMouseOverTemplate.replace(/offer/,'dem_and').replace(/demand/,'offer').replace(/dem_and/,'demand').replace(/ ratio /,'grcrtratio(ratio)'),
    GameData.FarmMouseOverTemplate = GameData.FarmMouseOverTemplateGRCRT
}


 */

