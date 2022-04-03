function _RepConvABH(){
    "use strict";
	var
		_IdS = 'grcrt_abh',
		_units = {
			'land_unit' : ['slinger','hoplite','rider','catapult','sword','archer','chariot'],
			'sea_unit' : ['big_transporter','small_transporter','bireme','attack_ship','demolition_ship','trireme','colonize_ship']
		},
		premium = {
			selectedFrom : {'id':null},
			selectedTo   : {'id':null},
			resPerUnit   : {},
			targetTown   : '',
			pckgSize     : 0
		}
	;
    function _btn(){
        RepConv.menu[2] =
            {
                'name' : 'ABH.WND.WINDOWTITLE',
                'action' : "RepConvABH.showView()",
                'class' : 'abh'
            }
        $('head')
            .append(
                $('<style/>')
                    .append(
                        '.grcrt.abh { background-position: -42px -80px;}'
                    )
            )
    }
    function _addStyle(){
        // dodanie wbudowanego css
        $('head')
            .append(
                $('<style/>')
                    .append(
                        '.grcrt_target_btn {'+
                            'background-image: url("'+RepConv.Const.uiImg+'pm.png");'+
                            'height:20px;'+
                            'width:20px;'+
                            'margin-top: 1px;'+
                            'vertical-align: top;'+
                            'display:inline-block;'+
                            'cursor:pointer;'+
                            'background-position:0px 0px;'+
                        '}'
                    )
                    .append(
                        '.grcrt_target_down {'+
                            'background-position:-20px 0px;'+
                        '}'
                    )
                    .append(
                        '.grcrt_target_down:hover {'+
                            'background-position: -20px -21px;'+
                        '}'
                    )
                    .append(
                        '.grcrt_target_up:hover {'+
                            'background-position: 0 -21px;'+
                        '}'
                    )
                    .append(
                        '.grcrt_abh_unit_wrapper {'+
                            'position: absolute;'+
                            'top: 190px;'+
                            'left: 35px;'+
                            'cursor:pointer;'+
                        '}'
                    )
                    .append(
                        '#trade_overview_wrapper .grcrt_abh_unit_wrapper {'+
                            'position: absolute;'+
                            'top: 5px;'+
                            'left: 10px;'+
                            'cursor:pointer;'+
                        '}'
                    )
                    .append(
                        '.grcrt_abh_unit_wrapper .grcrt_abh_selected_unit {'+
                            'margin: 0px;'+
                        '}'
                    )
                    .append(
                        'div#trade_tab div.grcrt_abh_res_left {'+
                            'position: absolute;'+
                            'left: 10px;'+
                            'bottom: 5px;'+
                            'width: 100%;'+
                            'font-size:0.7em'+
                        '}'
                    )
                    .append(
                        'div#trade_tab div.grcrt_abh_res_left div.amount {'+
                            'width: 40px;'+
                            'margin-right: 20px;'+
                            'text-align: right;'+
                            'float: left;'+
                        '}'
                    )
                    .append(
                        'div#trade_tab div.content {'+
                            'min-height: 340px;'+
                        '}'
                    )
                    .append(
                        'div#trade_duration div.grcrt_abh_res_left {'+
                            'position: absolute;'+
                            'left: 250px;'+
                            'bottom: 3px;'+
                            'width: 100%;'+
                        '}'
                    )
                    .append(
                        'div#trade_duration div.grcrt_abh_res_left div.amount {'+
                            'width: 40px;'+
                            'margin-right: 20px;'+
                            'text-align: right;'+
                            'float: left;'+
                        '}'
                    )
                    .append('.GRCRT_abh_pop_count, .GRCRT_abh_unit_count, .GRCRT_abh_unit_type, .GRCRT_abh_has_curator, .GRCRT_abh_has_research, .GRCRT_abh_what_research, .GRCRT_abh_max_to_build {'+
                            'font-weight: bold;'+
                            'margin:0 3px;'+
                        '}'
                    )
                    .append('.GRCRT_abh_pop_img {'+
                            'background:url("'+RepConv.Const.uiImg+'3/pop.png") no-repeat scroll center top rgba(0, 0, 0, 0);'+
                            'width:30px;'+
                            'height:30px;'+
                            'display: inline-block;'+
                            'vertical-align: middle;'+
                        '}'
                    )
                    .append('#GRCRT_wrpr {'+
                            'float:left;'+
                        '}'
                    )
                    .append('#GRCRT_abh_settings {'+
                            'float:left;'+
                            'width: 400px;'+
                            'text-align: center;'+
                        '}'
                    )
                    .append('.GRCRT_abh_spacer {'+
                            'clear:both;'+
                        '}'
                    )
                    .append('.GRCRT_abh_spcr_img {'+
                            'background:url("'+RepConv.Const.uiImg+'div_hor.png") no-repeat scroll center top rgba(0, 0, 0, 0);'+
                            'width:auto,;'+
                            'height:25px;'+
                            'display: block;'+
                            'margin-bottom: 10px;'+
                            'position:relative;'+
                            'top: 5px;'+
                            'background-size:90% ;'+
                        '}'
                    )
                    .append('#GRCRT_wrpr {'+
                            'height: 283px;'+
                        '}'
                    )
                    .append('.GRCRT_abh_column {'+
                            'border-left: 2px groove #D6B468;'+
                            'float: left;'+
                            'height: 100%;'+
                            'background:url("'+Game.img(true)+'/game/border/even.png") 0 0 repeat;'+
                            'width: 62px;' +
                            'padding: 7px 6px 5px 9px;'+
                        '}'
                    )
	    );
    }
    function _view(){
        var contentLeft = $('<div/>',{'id':"GRCRT_wrpr", 'style':"margin:0 0 0 -7px;", 'class':'tech_tree_box'}),
        contentRight = $('<div/>',{'id':"GRCRT_abh_settings"})
            .append(
                $('<div/>',{'class' : "GRCRT_abh_spacer"})
                    .append(
                        $('<span/>',{'class' : "GRCRT_abh_spcr_img"})
                    )
            )
            .append(
                $('<div/>',{'class' : "GRCRT_abh_pop"})
                    .append(
                        $('<span/>')
                            .html(RepConvTool.GetLabel('ABH.WND.DESCRIPTION1').replace('[population]','<span class="GRCRT_abh_pop_img"></span><span class="GRCRT_abh_pop_count"></span>'))
                    )
                    .append(
                        $('<br/>')
                    )
                    .append(
                        $('<span/>')
                            .html(RepConvTool.GetLabel('ABH.WND.DESCRIPTION2').replace('[max_units]','<span class="GRCRT_abh_unit_count"></span><span class="GRCRT_abh_unit_type"></span>'))
                    )
                    .append(
                        $('<br/>')
                    )
                    .append(
                        $('<span/>', {'id':'GRCRT_abh_has_research'})
                            .html(RepConvTool.GetLabel('ABH.WND.DESCRIPTION3').replace('[yesno]','<span class="GRCRT_abh_has_research"></span>').replace('[research]','<span class="GRCRT_abh_what_research"></span>'))
                    )
                    .append(
                        $('<br/>')
                    )
                    .append(
                        $('<span/>')
                            .html(RepConvTool.GetLabel('ABH.WND.DESCRIPTION4').replace('[max_queue]','<span class="GRCRT_abh_max_to_build"></span>'))
                    )
            )
            .append(
                $('<div/>',{'class' : "GRCRT_abh_spacer"})
                    .append(
                        $('<span/>',{'class' : "GRCRT_abh_spcr_img"})
                    )
            )
            .append(
                $('<div/>',{'class' : "GRCRT_abh_target"})
                    .append(
                        $('<span/>')
                            .html(RepConvTool.GetLabel('ABH.WND.TARGET')+' <span class="GRCRT_abh_input"></span>')
                    )
            )
            .append(
                $('<div/>',{'class' : "GRCRT_abh_spacer"})
                    .append(
                        $('<span/>',{'class' : "GRCRT_abh_spcr_img"})
                    )
            )
            .append(
                $('<div/>',{'class' : "GRCRT_abh_pckg"})
                    .append(
                        $('<span/>')
                            .html(RepConvTool.GetLabel('ABH.WND.PACKAGE')+' <span class="GRCRT_abh_input"></span>')
                    )
            )
            .append(
                $('<div/>',{'class' : "GRCRT_abh_spacer"})
                    .append(
                        $('<span/>',{'class' : "GRCRT_abh_spcr_img"})
                    )
            )
            .append(
                $('<div/>',{'class' : "GRCRT_abh_buttons"})
                    .append(
                        $('<span/>')
                    )
            ),
        cntnt = new Array(),
        _maxRow = 4;
        $.each(_units, function(iGrp, eGrp){
            var _column = $('<div/>',{'class':"GRCRT_abh_column"}),
            _currRow = 0;
            $.each(eGrp, function(iUnit, eUnit){
                if (_currRow == _maxRow) {
                    $(contentLeft)
                        .append(_column),
                    _column = $('<div/>',{'class':"GRCRT_abh_column"}),
                    _currRow = 0;
                }
                $(_column)
                    .append(
                        $('<div/>',{'class':"research_box"})
                            .append(
                                $('<span/>',{'class':"research_icon research inactive"+eUnit, 'name' : eUnit})
                                    .addClass(eUnit)
                                    .addClass(iGrp)
                            )
                    )
                _currRow++;
            })
            if(_currRow > 0){
                $(contentLeft)
                    .append(_column)
            }
        })
        cntnt.push(RepConvTool.Ramka(RepConvTool.GetLabel('ABH.WND.UNITFRAME'),contentLeft, 318));
        cntnt.push(contentRight);
        return cntnt;
        
    }
    this.showView = function(){

        var abhUnit = (RepConvABH.savedArr === null)? null :((RepConvABH.savedArr[Game.townId] === undefined) ? null : RepConvABH.savedArr[Game.townId].unit);

		try {
			(WM.getWindowByType(_IdS)[0]).close()
		} catch (e){}
		window.GRCRTabhWnd = WF.open(_IdS);
        //if (typeof GRCRTabhWnd != 'undefined') {
        //    try {
        //        GRCRTabhWnd.close();
        //    } catch (exp) {
        //    }
        //    GRCRTabhWnd = undefined;
        //}
        //
        //GRCRTabhWnd = GPWindowMgr.Create(GPWindowMgr.TYPE_GRCRT_ABH) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_GRCRT_ABH)
        //Layout.dialogWindow.open('', RepConvTool.GetLabel('ABH.WND.WINDOWTITLE'), 750, 380, '', false),
        GRCRTabhWnd.setContent2(_view()),
        //GRCRTabhWnd.setPosition(['center', 'center']),
        (GRCRTabhWnd.getJQElement()).find($('.grcrt_frame')).css({'position':'','padding-left':'5px','overflow': 'hidden'}).addClass("academy"),
        (GRCRTabhWnd.getJQElement()).find($('.inner_box')).css({'width':'322px','float':'left','margin-right':'20px'}),
        
        $(RepConvForm.inputMinMax({'name':'GRCRT_abh_target_input','value':'0','size':'2','min':'0','max':'0'})).appendTo(".GRCRT_abh_target .GRCRT_abh_input"),
        $(RepConvForm.inputMinMax({'name':'GRCRT_abh_pckg_input','value':'0','size':'1','min':'0','max':'0'})).appendTo(".GRCRT_abh_pckg .GRCRT_abh_input"),

        $(RepConvForm.button(RepConvTool.GetLabel('ABH.WND.BTNSAVE')))
            .click(
                function(){
                    var storeArr = RepConvABH.savedArr || {},
                    thisTown = Game.townId;
                    storeArr[thisTown] = {
                        'unit'        : $(this).attr('unit'),
                        'target'      : parseInt($('#GRCRT_abh_target_input').val()),
                        'target_left' : parseInt($('#GRCRT_abh_target_input').val()),
                        'factor'      : parseFloat($(this).attr('factor')),
                        'package'     : parseInt($('#GRCRT_abh_pckg_input').val()),
                    },
                    RepConvABH.savedArr = storeArr,
                    RepConvTool.setItem(RepConv.CookieUnitsABH,JSON.stringify(RepConvABH.savedArr));
                    if (RepConv.Debug) console.log(JSON.stringify(storeArr));
                    //GRCRTabhWnd.close();
					setTimeout(function(){
						HumanMessage.success(RepConvTool.GetLabel('ABH.WND.SETTINGSAVED').replace('[city]',Game.townName))
					},0)
                }
            )
            .appendTo("#GRCRT_abh_settings .GRCRT_abh_buttons")
            .css("margin", "auto"),
        $(RepConvForm.button(RepConvTool.GetLabel('ABH.WND.BTNRESET')))
            .click(
                function(){
                    var storeArr = RepConvABH.savedArr || {},
                    thisTown = Game.townId;
                    delete storeArr[thisTown]
                    RepConvABH.savedArr = storeArr,
                    RepConvTool.setItem(RepConv.CookieUnitsABH,JSON.stringify(RepConvABH.savedArr));
                    if (RepConv.Debug) console.log(JSON.stringify(storeArr));
                    //GRCRTabhWnd.close();
                    (GRCRTabhWnd.getJQElement()).find($('.tech_tree_box span.research_icon')).addClass('inactive is_researched grcrt_set')
                    setTimeout(function(){
                        HumanMessage.success(RepConvTool.GetLabel('ABH.WND.SETTINGSAVED').replace('[city]',Game.townName))
                    },0)
                }
            )
            .appendTo("#GRCRT_abh_settings .GRCRT_abh_buttons")
            .css("margin", "auto"),
        fillForm(abhUnit);
    }
    function onClick(that){
        var grcrt_unit = $(that).attr('name'),
        old_unit = (GRCRTabhWnd.getJQElement()).find($('grcrt_set')).attr('name');
        $('.grcrt_set').toggleClass('inactive is_researched grcrt_set'),
        $(that).addClass('grcrt_set');
        
        fillForm(grcrt_unit);
    }
    function fillForm(grcrt_unit){
        if(RepConv.Debug) console.log(grcrt_unit);
        var _town = ITowns.getTown(Game.townId), _research = _town.researches(), _buildings = _town.buildings(), __aviable, that, __unit, what_research;
        $.each(_units, function(iGrp, eGrp){
            $.each(eGrp, function(iUnit, eUnit){
                __aviable = (_research.get(eUnit)
                                ||
                                (eUnit == 'sword' && _buildings.get('barracks')>0)
                                ||
                                (eUnit == 'big_transporter' && _buildings.get('docks')>0)
                                ),
                __unit = (GRCRTabhWnd.getJQElement()).find($('#GRCRT_wrpr span[name="'+eUnit+'"]'))
                $(__unit)
                    .css('cursor',(__aviable)?'pointer':'not-allowed')
                    .removeClass('not_available')
                    .removeClass('grcrt_set')
                    .removeClass('inactive')
                    .removeClass('is_researched')
                    .mousePopup(new MousePopup(RepConvTool.GetLabel((__aviable)?'ABH.WND.TOOLTIPOK':'ABH.WND.TOOLTIPNOTOK')))
                    .addClass('inactive')
                    .addClass((__aviable)?'':'not_available')
                    .hover(function(){
                        if(!($(this).hasClass('grcrt_set')) && !($(this).hasClass('not_available'))) {
                                $(this).toggleClass('inactive is_researched');
                            }
                        })
                    .click(function(){
                        if (!($(this).hasClass('not_available'))) {
                            onClick(this);
                        }
                    }),
                $(__unit).parent().css('opacity',(__aviable)?'':'.3')
            })
        }),
        (GRCRTabhWnd.getJQElement()).find($('grcrt_set')).toggleClass('inactive is_researched grcrt_set'),
        that = (GRCRTabhWnd.getJQElement()).find($('#GRCRT_wrpr span[name="'+grcrt_unit+'"]')),
        $(that).addClass('grcrt_set').toggleClass('inactive is_researched');
        if ($(that).hasClass('land_unit') || $(that).hasClass('sea_unit')) {
            what_research = ($(that).hasClass('land_unit')) ? GameData.researches['conscription']:'';
            what_research = ($(that).hasClass('sea_unit')) ? GameData.researches['mathematics']:'';
            (GRCRTabhWnd.getJQElement()).find($('.GRCRT_abh_what_research')).text(what_research.name);
        }else{
            what_research='no_research';
        };
        if (what_research=="no_research") {
            (GRCRTabhWnd.getJQElement()).find($('.GRCRT_abh_has_research')).text(RepConvTool.GetLabel("ABH.WND.NORESEARCH"));
        }else{
            if (ITowns.getTown(Game.townId).researches().get(what_research.id)) {
                (GRCRTabhWnd.getJQElement()).find($('.GRCRT_abh_has_research')).text(RepConvTool.GetLabel("ABH.WND.HASRESEARCH"));
            }else{
                (GRCRTabhWnd.getJQElement()).find($('.GRCRT_abh_has_research')).text(RepConvTool.GetLabel("ABH.WND.NORESEARCH"));
            }
        };
        if (grcrt_unit != null) {
            $('#GRCRT_abh_has_research').show()
        } else {
            $('#GRCRT_abh_has_research').hide()
        }

        var
			curr_pop = ITowns.getTown(parseInt(Game.townId)).getAvailablePopulation(),
			max_avail = (grcrt_unit!=null) ? Math.floor(curr_pop/GameData.units[grcrt_unit]['population']) : 0,
			grcrt_unit_local = (grcrt_unit!=null) ? GameData.units[grcrt_unit].name : '???',
			storage_size = MM.checkAndPublishRawModel('Town', {id : Game.townId}).get('storage'),
			max_orders = 7,
			price_res_factor = (grcrt_unit!=null) ? RecruitUnits.getResearchModificationFactor(Game.townId,grcrt_unit) : 0,
			price_per_unit = (grcrt_unit!=null) ? RepConvTool.GetUnitCost(grcrt_unit, price_res_factor) : {w:0,s:0,i:0},
			price_per_unit_array = [price_per_unit.w, price_per_unit.s, price_per_unit.i],
			max_to_build = (grcrt_unit!=null) ? Math.floor(storage_size/Math.max.apply(Math,price_per_unit_array)) : 0,
			queue_list = (grcrt_unit!=null) ? _queue_list(max_orders, max_to_build, max_avail) : '',
			build_target = (grcrt_unit!=null) ? (max_orders*max_to_build>max_avail)?max_avail:(max_orders*max_to_build) : 0;
       
        (GRCRTabhWnd.getJQElement()).find($('#GRCRT_abh_settings .GRCRT_abh_buttons .button'))
            .attr('unit', grcrt_unit),
        (GRCRTabhWnd.getJQElement()).find($('#GRCRT_abh_settings .GRCRT_abh_buttons .button'))
            .attr('factor', price_res_factor),
        (GRCRTabhWnd.getJQElement()).find($('.GRCRT_abh_pop_count'))
            .text(curr_pop),
        (GRCRTabhWnd.getJQElement()).find($('.GRCRT_abh_unit_count'))
            .text(max_avail),
        (GRCRTabhWnd.getJQElement()).find($('.GRCRT_abh_unit_type'))
            .text(grcrt_unit_local),
        (GRCRTabhWnd.getJQElement()).find($('.GRCRT_abh_max_to_build'))
            .text(build_target),
        (GRCRTabhWnd.getJQElement()).find($('#GRCRT_abh_target_input'))
            .attr('max',build_target)
            .attr('value',build_target),
        (GRCRTabhWnd.getJQElement()).find($('.GRCRT_abh_max_to_build_detail'))
            .text(queue_list),
        (GRCRTabhWnd.getJQElement()).find($('#GRCRT_abh_pckg_input'))
            .attr('max',Math.floor(max_to_build*0.34))
            .attr('value',Math.floor(max_to_build*0.34));

    }
    function _queue_list(max_orders, max_to_build, max_avail){
        var queue_list = '';
        if ( (max_orders*max_to_build) > max_avail ) {
            queue_list = '('+ ((max_to_build > max_avail)?(''):(Math.floor(max_avail/max_to_build) +'x' + max_to_build + ', ')) + '1x' + max_avail % max_to_build + ')';
        }else{
            queue_list = '('+ max_orders +'x' + max_to_build + ')';
        };
        return queue_list;
    }
    function premiumFrom(RCGP){
        if ((RCGP.getJQElement()).find($('#trade_selected_from .gp_town_link')).length == 0) {
            premium.selectedFrom = {'id':null},
            premium.pckgSize = '0',
            premium.resPerUnit = RepConvTool.GetUnitCost('x');
            
        } else {
            premium.selectedFrom = JSON.parse(RepConvTool.Atob((RCGP.getJQElement()).find($('#trade_selected_from .gp_town_link')).attr('href')));
            if (RepConvABH.savedArr[premium.selectedTo.id] === undefined) {
                // todo
            } else {
                premium.pckgSize = _maxUnitsToBuild(premium.selectedTo.id, true, premium.selectedFrom.id, RCGP)
                premium.resPerUnit = RepConvTool.GetUnitCost(RepConvABH.savedArr[premium.selectedTo.id].unit,
                                                                        parseFloat(RepConvABH.savedArr[premium.selectedTo.id].factor));
                //premiumUnit(RCGP);
            }
        }
        premiumUnit(RCGP);
        
    }
    function premiumTo(RCGP){
        premium.selectedTo =
            ((RCGP.getJQElement()).find($('#trade_selected_to .gp_town_link')).length == 0)
                ? {'id':null}
                : JSON.parse(RepConvTool.Atob((RCGP.getJQElement()).find($('#trade_selected_to .gp_town_link')).attr('href')));

        if (RepConvABH.savedArr[premium.selectedTo.id] === undefined) {
            (RCGP.getJQElement()).find($('.grcrt_abh_unit_wrapper')).remove();
        } else {
            //$('.abh_res_left').remove();
            premium.pckgSize = (premium.selectedFrom.id == null)
                    ? 0
                    : _maxUnitsToBuild(premium.selectedTo.id, true, premium.selectedFrom.id, RCGP),
            premium.resPerUnit = (premium.selectedFrom.id == null)
                    ? RepConvTool.GetUnitCost('x')
                    : RepConvTool.GetUnitCost(RepConvABH.savedArr[premium.selectedTo.id].unit,
                                              parseFloat(RepConvABH.savedArr[premium.selectedTo.id].factor)), 
            premiumUnit(RCGP);
        }
    }
    function premiumUnit(RCGP){
        var
			targetTown = premium.selectedTo.id,
			resPerUnit = premium.resPerUnit;
        
        (RCGP.getJQElement()).find($('.grcrt_abh_unit_wrapper')).remove(),
        (RCGP.getJQElement()).find($("#trade_duration .grcrt_abh_res_left")).remove();
        if(premium.selectedTo.id == null){
            // nic nie robie!
        } else {
            (RCGP.getJQElement()).find($("#trade_options"))
                .append(
                    RepConvForm.unitMinMax({
                        'name' : 'unit_slider_'+RCGP.getID(),
                        'wndId': RCGP.getID(),
                        'min'  : '0',
                        'max'  : premium.pckgSize,
                        'value': premium.pckgSize,
                        'tTown': premium.selectedTo.id,
                        'unit' : (premium.selectedTo.id == null) ? 'x' : RepConvABH.savedArr[premium.selectedTo.id].unit
                    })
                ),
            (RCGP.getJQElement()).find($(".grcrt_abh_selected_unit")).click(function(){
                _Resources($(this).attr("rel"), true, $(this).attr("wndid"));
            }),
            (RCGP.getJQElement()).find($("#trade_duration"))
                .append($('<div/>',{'class':'grcrt_abh_res_left'})
                    .append($('<div/>',{'style':"display:inline-flex"})
                        .append(
                            $('<div/>')
                                .append($('<div/>',{'class':'resource_wood_icon res_icon'}))
                                .append(
                                    $('<div/>',{'class':'amount'})
                                        .text(
                                            Math.round(
                                                premium.resPerUnit.w *
                                                RepConvABH.savedArr[premium.selectedTo.id].target_left/* *
                                                RepConvABH.savedArr[premium.selectedTo.id].factor*/
                                            )
                                        )
                                )
                        )
                        .append(
                            $('<div/>')
                                .append($('<div/>',{'class':'resource_stone_icon res_icon'}))
                                .append(
                                    $('<div/>',{'class':'amount'})
                                        .text(
                                            Math.round(
                                                premium.resPerUnit.s *
                                                RepConvABH.savedArr[premium.selectedTo.id].target_left/* *
                                                RepConvABH.savedArr[premium.selectedTo.id].factor*/
                                            )
                                        )
                                )
                        )
                        .append(
                            $('<div/>')
                                .append($('<div/>',{'class':'resource_iron_icon res_icon'}))
                                .append(
                                    $('<div/>',{'class':'amount'})
                                        .text(
                                            Math.round(
                                                premium.resPerUnit.i *
                                                RepConvABH.savedArr[premium.selectedTo.id].target_left/* *
                                                RepConvABH.savedArr[premium.selectedTo.id].factor*/
                                            )
                                        )
                                )
                        )
                        .append(
                            $('<div/>',{'class':'grcrt_abh_caption'})
                                .html(
                                    '<span class="target_left">' +
                                    RepConvABH.savedArr[premium.selectedTo.id].target_left +
                                    '</span>/' +
                                    RepConvABH.savedArr[premium.selectedTo.id].target +
                                    ' ' +
                                    GameData.units[RepConvABH.savedArr[premium.selectedTo.id].unit].name_plural
                                )
                        )
                    )
                );
        }
    }
    this.functCall = function(RCGP,prem){

        if ((RCGP.getJQElement()).find($('.grcrt_abh_selected_unit')).length == 0) {
            if(prem){
                // zmiany na mieście "Z"
                $('#trade_selected_from').bind("DOMSubtreeModified",function(){
                    premiumFrom(RCGP);
                });

                // zmiany na mieście "DO"
                $('#trade_selected_to').bind("DOMSubtreeModified",function(){
                    premiumTo(RCGP);
                });
            
                $('#trade_buttons .confirm').click(function(){
                    if (premium.selectedFrom.id != null && premium.selectedTo.id != null)  {
                        RepConvABH.savedArr[premium.selectedTo.id].target_left =
                            parseInt(RepConvABH.savedArr[premium.selectedTo.id].target_left) -
                            parseInt((RCGP.getJQElement()).find($(".grcrt_abh_selected_unit .value")).text()),
                        _res = {
                            wood  : parseInt((RCGP.getJQElement()).find($(".grcrt_abh_res_left .wood .amount")).text()),
                            stone : parseInt((RCGP.getJQElement()).find($(".grcrt_abh_res_left .stone .amount")).text()),
                            iron  : parseInt((RCGP.getJQElement()).find($(".grcrt_abh_res_left .iron .amount")).text())
                        },
                    
                        (RCGP.getJQElement()).find($(".grcrt_abh_res_left .wood .amount"))
                            .text(_res.wood - parseInt((RCGP.getJQElement()).find($("#trade_overview_type_wood")).val())),
                        (RCGP.getJQElement()).find($(".grcrt_abh_res_left .stone .amount"))
                            .text(_res.stone - parseInt((RCGP.getJQElement()).find($("#trade_overview_type_stone")).val())),
                        (RCGP.getJQElement()).find($(".grcrt_abh_res_left .iron .amount"))
                            .text(_res.iron - parseInt((RCGP.getJQElement()).find($("#trade_overview_type_iron")).val())),
                        (RCGP.getJQElement()).find($(".grcrt_abh_res_left .target_left"))
                            .text(RepConvABH.savedArr[premium.selectedTo.id].target_left),
                    
                        RepConvTool.setItem(RepConv.CookieUnitsABH,JSON.stringify(RepConvABH.savedArr));
                    }                
                });
        //
            } else {
                //grcrt_target_up
                var
					targetTown = RCGP.getHandler().target_id,
	                resPerUnit = RepConvTool.GetUnitCost((RepConvABH.savedArr == null || RepConvABH.savedArr[targetTown] === undefined) ? 'x' : RepConvABH.savedArr[targetTown].unit), 
					pckgSize = (RepConvABH.savedArr == null || RepConvABH.savedArr[targetTown] === undefined) ? '0' : _maxUnitsToBuild(targetTown, prem, Game.townId, RCGP);
                if (RepConvABH.savedArr != null && RepConvABH.savedArr[targetTown] != undefined) {
                    (RCGP.getJQElement()).find($("#trade .content"))
                        .append(
                            RepConvForm.unitMinMax({
                                'name' : 'unit_slider_'+RCGP.getID(),
                                'wndId': RCGP.getID(),
                                'min'  : '0',
                                'max'  : pckgSize,
                                'value': pckgSize,
                                'tTown': targetTown,
                                'unit' : RepConvABH.savedArr[targetTown].unit
                            })
                        )
                        .append($('<div/>',{'class':'grcrt_abh_res_left'/*,'style':"position:absolute; left:10px; bottom:5px; width:100%;font-size:0.7em"*/})
                            .append($('<div/>',{'style':"margin:auto;"})
                                .append(
                                    $('<div/>',{'class':'grcrt_abh_caption'}).html('<span class="target_left">' + RepConvABH.savedArr[targetTown].target_left + '</span>/' + RepConvABH.savedArr[targetTown].target + ' '+ GameData.units[RepConvABH.savedArr[targetTown].unit].name_plural)
                                )
                            )
                            .append($('<div/>',{'style':"display:inline-flex"})
                                .append(
                                    $('<div/>')
                                        .append($('<div/>',{'class':'resource_wood_icon res_icon'}))
                                        .append($('<div/>',{'class':'amount wood'}).text(Math.round(resPerUnit.w*RepConvABH.savedArr[targetTown].target_left/**RepConvABH.savedArr[targetTown].factor*/)))
                                )
                                .append(
                                    $('<div/>')
                                        .append($('<div/>',{'class':'resource_stone_icon res_icon'}))
                                        .append($('<div/>',{'class':'amount stone'}).text(Math.round(resPerUnit.s*RepConvABH.savedArr[targetTown].target_left/**RepConvABH.savedArr[targetTown].factor*/)))
                                )
                                .append(
                                    $('<div/>')
                                        .append($('<div/>',{'class':'resource_iron_icon res_icon'}))
                                        .append($('<div/>',{'class':'amount iron'}).text(Math.round(resPerUnit.i*RepConvABH.savedArr[targetTown].target_left/**RepConvABH.savedArr[targetTown].factor*/)))
                                )
                            )
                        );

                        (RCGP.getJQElement()).find($('.btn_trade_button')).bind('click', function(){
                        
                            RepConvABH.savedArr[targetTown].target_left = RepConvABH.savedArr[targetTown].target_left - parseInt($(".grcrt_abh_selected_unit .value").text());
                            
                            var
                                wood  = parseInt((RCGP.getJQElement()).find($(".grcrt_abh_res_left .wood.amount")).text()),
                                stone = parseInt((RCGP.getJQElement()).find($(".grcrt_abh_res_left .stone.amount")).text()),
                                iron  = parseInt((RCGP.getJQElement()).find($(".grcrt_abh_res_left .iron.amount")).text());
                        
                            (RCGP.getJQElement()).find($(".grcrt_abh_res_left .wood.amount")).text(wood - parseInt((RCGP.getJQElement()).find($("#trade_type_wood input")).val()));
                            (RCGP.getJQElement()).find($(".grcrt_abh_res_left .stone.amount")).text(stone - parseInt((RCGP.getJQElement()).find($("#trade_type_stone input")).val()));
                            (RCGP.getJQElement()).find($(".grcrt_abh_res_left .iron.amount")).text(iron - parseInt((RCGP.getJQElement()).find($("#trade_type_iron input")).val()));
                            (RCGP.getJQElement()).find($(".grcrt_abh_res_left .target_left")).text(RepConvABH.savedArr[targetTown].target_left);
                        
                            RepConvTool.setItem(RepConv.CookieUnitsABH,JSON.stringify(RepConvABH.savedArr));
                        
                        });
        
                        (RCGP.getJQElement()).find($(".grcrt_abh_selected_unit")).click(function(){
                            _Resources($(this).attr("rel"), false, $(this).attr("wndid"));
                        });
                }
            }
        }
    }
    function _availRes(prem, RCGP){
        var avail_res = {
            w : parseInt(
                    $.trim(
                        (prem)
                            ? $('#trade_selected_from .resource_wood_icon').text()
                            : $('#ui_box .ui_resources_bar .wood .amount').text()
                    )
                ),
            s : parseInt(
                    $.trim(
                        (prem)
                            ? $('#trade_selected_from .resource_stone_icon').text()
                            : $('#ui_box .ui_resources_bar .stone .amount').text()
                    )
                ),
            i : parseInt(
                    $.trim(
                        (prem)
                            ? $('#trade_selected_from .resource_iron_icon').text()
                            : $('#ui_box .ui_resources_bar .iron .amount').text()
                    )
                ),
            t : parseInt(
                    $.trim(
                        (prem)
                            ? $('#trade_selected_from .trade_capacity').text()
                            : (RCGP.getJQElement()).find($('#big_progressbar .max')).text()
                    )
                )
        }
        return avail_res;
    }
    function _maxUnitsToBuild(town, prem, target, RCGP){
        var
			factor = (RepConvABH.savedArr[town] === undefined)? 1 : RepConvABH.savedArr[town].factor,
	        avail_res = _availRes(prem, RCGP),
			// pobieranie kosztu wybranej jednostki
			resPerUnit = RepConvTool.GetUnitCost(RepConvABH.savedArr[town].unit, factor),
			// sprawdzanie maksymalnej możliwej ilość wg handlarza
			unitRes = resPerUnit.w + resPerUnit.s + resPerUnit.i,
			tradeCap = MM.getModels().Town[target].getAvailableTradeCapacity(),//ITowns.getTown(target).getAvailableTradeCapacity(),
			max_possib = Math.floor(tradeCap/unitRes),
			// sprawdzenie maksymalnej możliwej ilości wg surowców
			possib_unit_res = [
				Math.floor(avail_res.w/resPerUnit.w),
				Math.floor(avail_res.s/resPerUnit.s),
				Math.floor(avail_res.i/resPerUnit.i)
			],
			// najmniejsza możliwa ilość jednostek
			possib_unit = Math.min.apply(Math,possib_unit_res),
			max_to_build = Math.min.apply(Math,[possib_unit, max_possib, RepConvABH.savedArr[town].package]);
		return max_to_build;
    }
    function _Resources(unit, prem, wndId){
        var _GPWindow = Layout.wnd.GetByID(wndId),
        _target = _GPWindow.getHandler().target_id,
        _factor = (RepConvABH.savedArr[_target] === undefined)? 1 : RepConvABH.savedArr[_target].factor,
        
        // pobieranie ilości dostępnych surek 
        avail_res = _availRes(prem, _GPWindow),

        // pobieranie kosztu wybranej jednostki
        resPerUnit = (prem)?premium.resPerUnit:RepConvTool.GetUnitCost(unit, _factor),

        _chosen_qty = parseInt((_GPWindow.getJQElement()).find($(".grcrt_abh_selected_unit span.value")).html()),

        unit_wood  = _chosen_qty*resPerUnit.w,
        unit_stone = _chosen_qty*resPerUnit.s,
        unit_iron  = _chosen_qty*resPerUnit.i;

        if (prem){
            (_GPWindow.getJQElement()).find($("#trade_overview_type_wood")).select().val(unit_wood).blur();
            (_GPWindow.getJQElement()).find($("#trade_overview_type_stone")).select().val(unit_stone).blur();
            (_GPWindow.getJQElement()).find($("#trade_overview_type_iron")).select().val(unit_iron).blur();
        };
        if (!prem) {
            (_GPWindow.getJQElement()).find($("#trade_type_wood input")).select().val(unit_wood).blur();
            (_GPWindow.getJQElement()).find($("#trade_type_stone input")).select().val(unit_stone).blur();
            (_GPWindow.getJQElement()).find($("#trade_type_iron input")).select().val(unit_iron).blur();
        };
    }
    //this.GRCRTabhWnd = undefined
    this.savedArr = {}
    _addStyle()
    _btn()
    //this.savedArr = JSON.parse(RepConvTool.getSettings(RepConv.CookieUnitsABH,"{}")||"{}"),
    $.Observer(GameEvents.town.town_switch)
        .subscribe('GRCRT_ABH_town_town_switch',function(e,data){
            var abhUnit = (RepConvABH.savedArr === null) ? null : ((RepConvABH.savedArr[Game.townId] === undefined) ? null : RepConvABH.savedArr[Game.townId].unit);
            if (typeof GRCRTabhWnd != 'undefined') {
                fillForm(abhUnit);
            }
        });

    $.Observer(GameEvents.grcrt.settings.load)
        .subscribe('GRCRT_ABH_settings_load', function() {
            RepConvABH.savedArr = JSON.parse(RepConvTool.getSettings(RepConv.CookieUnitsABH,"{}"))
        });
    

    // obsługa nowych okien
    RepConv.initArray.push('RepConvABH.init()');
    RepConv.wndArray.push(_IdS);
    this.init = function(){
        "use strict";
        new _grcrtWindowABH();
    }
    // -- okienko
    function _grcrtWindowABH(){
        "use strict";
        var _IdS = 'grcrt_abh';
        var _grcrtWinIds = require("game/windows/ids");
        _grcrtWinIds[_IdS.toUpperCase()] = _IdS,
        function() {
            "use strict";
            var a = window.GameControllers.TabController,
                b = window.GameModels.Progressable,
                c = a.extend({
                    initialize: function() {
                        a.prototype.initialize.apply(this, arguments)
                        var
                            _wnd = this.getWindowModel(),
                            _$el = this.$el,
                            _content = $('<div/>').css({'margin':'10px'});
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
                    },
                    render: function() {
                    },
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
                    minheight: 380,
                    maxheight: 390,
                    width: 780,
                    tabs: [{
                        type: f.INDEX,
                        title: 'none',
                        content_view_constructor: a['GrcRTView_'+_IdS],//.RrcRTViewABH,
                        hidden: !0
                    }],
                    max_instances: 1,
                    activepagenr: 0,
                    minimizable: !0,
                    resizable: !1,
                    title: RepConv.grcrt_window_icon + RepConvTool.GetLabel('ABH.WND.WINDOWTITLE'),
                    special_buttons: {
                        help: {
                            action: {
                                type: "external_link",
                                url: RepConv.Scripts_url+'module/grchowto#2'
                            }
                        }
                    }
                }, b)
            }
        }()
    }
}
