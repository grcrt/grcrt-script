function _GRCRTInnoFix() {
	$('head')
		.append(
			$('<style/>')
				// size images bbcode
				.append('.bbcodes.monospace img {\n'+
						'max-width: none;\n'+
						'}'
				)
				// // size units value
				// .append('.olympus_temple_info .unit .value {\n'+
				// 		'font-size: 10px;\n'+
				// 		'}'
				// )
		)
	$.Observer(GameEvents.window.reload).subscribe("grcrt_trade", function(a, b) {
		$.each($('div[class*=trade_tab_target]'), function(ii, trade){
		    var c = $(trade).find($('#way_duration')).addClass('way_duration').removeAttr('id').tooltip(DM.getl10n("farm_town").way_duration).text().replace("~","").split(":"),
		        d=parseInt(c[0])*60*60+parseInt(c[1])*60+parseInt(c[2])
		    $(trade).find($('#arrival_time')).addClass('arrival_time').removeAttr('id').text(d).updateTime().tooltip(DM.getl10n("farm_town").arrival_time)
		})
	})
}
