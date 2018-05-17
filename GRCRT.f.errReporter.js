function grcrtErrReporter(err){
	function sendErr(){
		// console.log(_json)
		var __form = $('<form/>', {
            'action' : RepConv.grcrt_domain+'scripts/errorLog.php?_='+Timestamp.server(),
            'method' : 'post',
            'target' : 'GRCRTErrorSender'
        })
        .append($('<textarea/>',{'name': '_json'})
            .text(
                JSON.stringify(_json)
            )
        );
        $('#GRCRTErrorSenderTMP').html('').append(__form);
        __form.submit();

	}
	var _json = {
		world : Game.world_id,
		time : (new Date()).toISOString(),
		userId : Game.player_id,
		version : RepConv.Scripts_version,
		browser : navigator.userAgent,
		error : {
			message : err.message,
			stack : err.stack
		}
	}
	if($('#GRCRTErrorSender').length == 0){
    	$('body').append($('<iframe/>',{'id':'GRCRTErrorSender','name':'GRCRTErrorSender','style':'display:none'}));
    	$('body').append($('<div/>',{'id':'GRCRTErrorSenderTMP'}).hide());
	}
	// console.log(_json)
	// console.log(JSON.stringify(_json))
	if(err.silent){
		sendErr()
	} else {
		console.log(_json);
		if(typeof Layout == "object" && typeof Layout.showConfirmDialog == "function"){
		Layout.showConfirmDialog(
						"GRCRTools oops!",
						'<div><img src="'+RepConv.grcrt_cdn+'img/octopus.png" style="float:left;padding-right: 10px"/><p style="padding:5px"><b>Found error</b><br/><pre>'+err+'</pre><br/>You want send?</p></div>', 
						function(){
							// console.log(_json)
							sendErr()
						}
					)
		} else {
			setTimeout(function(){
				grcrtErrReporter(err);
			},500);
		}
	}
}
