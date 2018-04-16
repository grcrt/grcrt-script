function _GRCRTInnoFix() {
	// $('head')
	// 	.append(
	// 		$('<style/>')
	// 			// quest send unit
	// 			.append('.island_quests .details_window .collect_units .lbl_troops_rallied {\n'+
	// 						'line-height: 14px;\n'+
	// 					'}'
	// 			)
	// 			// simulator
	// 			.append('.place_sim_wrap_mods {\n'+
	// 						'min-width: 304px;\n'+
	// 					'}'
	// 			)
	// 	)
	$.Observer(GameEvents.window.reload).subscribe("grcrt_trade", function(a, b) {
		$.each($('div[class*=trade_tab_target]'), function(ii, trade){
		    var c = $(trade).find($('#way_duration')).addClass('way_duration').removeAttr('id').tooltip(DM.getl10n("farm_town").way_duration).text().replace("~","").split(":"),
		        d=parseInt(c[0])*60*60+parseInt(c[1])*60+parseInt(c[2])
		    $(trade).find($('#arrival_time')).addClass('arrival_time').removeAttr('id').text(d).updateTime().tooltip(DM.getl10n("farm_town").arrival_time)
		})
	})
}
