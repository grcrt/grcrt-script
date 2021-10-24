function _RepConvForm(){
    this.button = function(label) {
	return $('<div/>')
	    .append(
			($('<a/>', {'class': "button", 'href': "#", 'style': 'display:inline-block; vertical-align: middle;'}))
				.append(($('<span/>', {'class': "left"}))
					.append(($('<span/>', {'class': "right"}))
						.append(
							$('<span/>', {'class': "middle"}).text(label)
						)
					)
				)
	    )
	    .html();
    }
    this.checkbox = function(params){
		var
			//chkbxOn = '-353px -48px',
			//chkbxOff = '-367px -48px',
			result =
			$('<div/>', {'class':'checkbox_new'+((params.checked)?' checked':''), 'style': 'padding: 5px;'+(params.style||'')})
				.append(
					$('<input/>', {'type': 'checkbox', 'name': params.name, 'id': params.name, 'checked': params.checked, 'style': 'display: none;'})
				)
				.append(
					$('<div/>', {
						'class': 'cbx_icon',
						//'style': 'background-repeat: no-repeat; width: 14px; height: 14px; margin-right: 3px;',
						'rel': params.name
					})
					//.css('background-position', ((params.checked) ? chkbxOn : chkbxOff))
				)
				.append(
					$('<div/>', {'class': 'cbx_caption'}).text(RepConvTool.GetLabel(params.name))
				)
				.bind('click', function() {
					$(this).toggleClass('checked');
					//$(this).css('background-position', !$('#' + this.getAttribute('rel')).attr('checked') ? chkbxOn : chkbxOff);
					$(this).find($('input[type="checkbox"]')).attr('checked', $(this).hasClass('checked'));
					//$('#' + this.getAttribute('rel')).attr('checked', !$('#' + this.getAttribute('rel')).attr('checked'));
				})
				;
		if(params.cb != undefined){
			$(result)
				.append(
					$('<br/>', {'style': 'clear:both'})
				)		
		}
		if (params.sample != undefined){
			$(result)
				.append(
					$('<div/>', {'style': 'display:' + ((params.sample.org != '' || params.sample.grc != '') ? 'block' : 'none')})
					.append(params.sample.org)
					.append(params.sample.grc)
					.append($('<br/>'))
					.append($('<br/>', {'style': 'clear:both'}))
				)
		}
		return $(result);
    }
	this.input = function(params){
		var result =
			$('<div/>',{'class':'textbox', 'style':params.style})
				.append($('<div/>',{'class':'left'}))
				.append($('<div/>',{'class':'right'}))
				.append($('<div/>',{'class':'middle'})
					.append(
						$('<div/>',{'class':'ie7fix'})
							.append(
								$('<input/>', {'type':'text','tabindex':'1', 'id' : params.name, 'value':params.value})
									.attr('size',params.size||10)
							)
					)
					
				)
		return result;
	}
	this.inputMinMax = function(params){
	    var result =
		$('<div/>', {'class':'textbox'})
		    .append(    
			$('<span/>',{'class':'grcrt_spinner_btn grcrt_spinner_down', 'rel': params.name})
			    .click(function(){
				var _input = $(this).parent().find('#'+$(this).attr('rel')) ;
				if (parseInt($(_input).attr('min'))<parseInt($(_input).attr('value'))) {
					$(_input).attr('value', parseInt($(_input).attr('value'))-1);
				}
			    })
		    )
		    .append(
			$('<div/>',{'class':'textbox', 'style':params.style})
				.append($('<div/>',{'class':'left'}))
				.append($('<div/>',{'class':'right'}))
				.append($('<div/>',{'class':'middle'})
					.append(
					$('<div/>',{'class':'ie7fix'})
						.append(
							$('<input/>', {
							    'type':'text',
							    'tabindex':'1',
							    'id' : params.name,
							    'value' : params.value,
							    'min' : params.min,
							    'max' : params.max
							}) //http://forum.pl.grepolis.com/showthread.php?6153-Grepolis-Report-Converter})
							.attr('size',params.size||10)
							.css('text-align','right')
						)
					)
				)
		    )
		    .append(    
			$('<span/>',{'class':'grcrt_spinner_btn grcrt_spinner_up', 'rel': params.name})
			    .click(function(){
				var _input = $(this).parent().find('#'+$(this).attr('rel')) ;
				if (parseInt($(_input).attr('max'))>parseInt($(_input).attr('value'))) {
					$(_input).attr('value', parseInt($(_input).attr('value'))+1);
				}
			    })
		    )
	    return result;
	}
	this.unitMinMax = function(params){
	    var result =
		$('<div/>',{'class':"grcrt_abh_unit_wrapper"})
		    .append(
			$('<div/>',{'class':"grcrt_abh_selected_unit unit_icon40x40 unit selected"})
			    .append(
				$('<span/>',{
						'class':'value grcrt_spiner',
						'min': params.min,
						'max': params.max,
						'id' : params.name
					    })
				    .html(params.value)
			    )
			    .addClass(params.unit)
			    .attr('rel', (RepConvABH.savedArr[params.tTown] != null) ? RepConvABH.savedArr[params.tTown].unit : '')
			    .attr('wndId', params.wndId)
			    .mousePopup(new MousePopup(RepConvTool.GetLabel('ABH.RESWND.IMGTOOLTIP')))
		    )
		    .append(
			$('<div/>')
			    .append(
				$('<span/>',{'class':'grcrt_target_btn grcrt_target_down', 'rel': params.name})
				    .click(function(){
					var _input = $(this).parent().parent().find('#'+$(this).attr('rel')+'.value');
					if (parseInt($(_input).attr('min'))<parseInt($(_input).html())) {
						$(_input).html(parseInt($(_input).html())-1);
					}
				    })
			    )
			    .append(
				$('<span/>',{'class':'grcrt_target_btn grcrt_target_up', 'rel': params.name})
				    .click(function(){
					var _input = $(this).parent().parent().find('#'+$(this).attr('rel')+'.value') ;
					if (parseInt($(_input).attr('max'))>parseInt($(_input).html())) {
						$(_input).html(parseInt($(_input).html())+1);
					}
				    })
			    )
		    )
	    return result;
	}
    this.soundSlider = function(params){
		var result = 
			$('<div/>', {'id':'grcrt_'+params.name+'_config'})
			.append(
				$('<div/>', {'class':'slider_container'})
				.append($('<div/>',{'style':'float:left;width:120px;'}).html(RepConvTool.GetLabel('SOUNDVOLUME')))
				.append(RepConvForm.input({'name':'grcrt_'+params.name+'_value', 'style':'float:left;width:33px;'}).hide())
				.append(
					$('<div/>', {'class':'windowmgr_slider','style':'width: 200px;float: left;'})
					.append(
						$('<div/>', {'class':'grepo_slider sound_volume'})
					)				
				)
			)
		//$(result)
			.append(
				$('<script/>', {'type' : 'text/javascript'}).text(''+
				'RepConv.slider = $(\'#grcrt_'+params.name+'_config .sound_volume\').grepoSlider({\n'+
						'min: 0,\n'+
						'max: 100,\n'+
						'step: 5,\n'+
						'value: parseInt('+params.volume+'),\n'+
						'template: \'tpl_grcrt_slider\'\n'+
						'}).on(\'sl:change:value\', function (e, _sl, value) {\n'+
						'$(\'#grcrt_'+params.name+'_value\').attr(\'value\',value);\n'+
						'if (RepConv.audio.test != undefined){\n'+
						'RepConv.audio.test.volume = value/100;\n'+
						'}\n'+
						'RepConvGRC.getGrcrtYTPlayerTest().setVolume(value)\n'+
						'}),\n'+
						'$(\'#grcrt_'+params.name+'_config .button_down\').css(\'background-position\',\'-144px 0px;\'),\n'+
						'$(\'#grcrt_'+params.name+'_config .button_up\').css(\'background-position\',\'-126px 0px;\')\n'+
						'')
			)
		return result;
    }
    // init
    $('head')
	.append(
	    $('<style/>')
		.append('.grcrt_spinner_btn {'+
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
		.append('.grcrt_spinner_down {'+
			    'background-position:-20px 0px;'+
			'}'
		)
		.append('.grcrt_spinner_down:hover {'+
			    'background-position: -20px -21px;'+
			'}'
		)
		.append('.grcrt_spinner_up:hover {'+
			    'background-position: 0 -21px;'+
			'}'
		)
	)
	.append(
	    $('<script/>', {'id':'tpl_grcrt_slider', 'type':'text/template'})
		.text(
		    '<div class="button_down left js-button-left" style="background-position: -144px 0px;"></div>\n'+
			'<div class="bar js-slider js-slider-handle-container">\n'+
			    '<div class="border_l"></div>\n'+
			    '<div class="border_r"></div>\n'+
			    '<div class="slider_handle js-slider-handle"></div>\n'+
			'</div>\n'+
		    '<div class="button_up right js-button-right" style="background-position: -126px 0px;"></div>\n'
		)
	)
    // /init
};
