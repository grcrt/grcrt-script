function _GRCRT_Notifications(){
    // init
    this.version = "2.0";
    NotificationType.GRCRT="grcrt",
    NotificationType.GRCRTNEWVERSION="grcrtnewversion",
    NotificationType.GRCRTWHATSNEW="grcrtwhatsnew";
    NotificationType.GRCRTRELOAD="grcrtreload";

    $('head')
        .append(
            $('<style/>')
            .append('#notification_area .'+NotificationType.GRCRT+' .icon, '+
                    '#notification_area .'+NotificationType.GRCRTNEWVERSION+' .icon, '+
                    '#notification_area .'+NotificationType.GRCRTWHATSNEW+' .icon, '+
                    '#notification_area .'+NotificationType.GRCRTRELOAD+' .icon '+
                    '{ background: url('+RepConv.grcrt_cdn+'img/octopus.png) 4px 7px no-repeat !important; cursor: pointer;}'
            )
        )

    $.Observer(GameEvents.notification.push)
        .subscribe('GRCRT_Notif_notification_push',function(){
            GRCRT_Notifications.addOnClick();
	});

    $.Observer(GameEvents.notification.del_all)
        .subscribe('GRCRT_Notif_notification_del_all',function(){
	    GRCRT_Updater.checked = false;
	});

    $.Observer(GameEvents.notification.del)
        .subscribe('GRCRT_Notif_notification_del',function(){
            GRCRT_Notifications.addOnClick();
	});
	
	$.Observer(GameEvents.window.open)
	    .unsubscribe('GRCRT_Notif_window_open'),
	$.Observer(GameEvents.window.open)
	    .subscribe('GRCRT_Notif_window_open',function(){
                if (
                    GPWindowMgr.getOpenedWindows().length == 1 &&
                    GPWindowMgr.getOpenedWindows()[0].getType() == GPWindowMgr.TYPE_CONFIRM_DIALOG &&
                    $('.ui-widget-overlay').prev().hasClass('ui-dialog')
                    ) {
                    var _wnd = $('.ui-widget-overlay').prev()
                    $('.ui-widget-overlay').insertBefore(_wnd)
                }
	});
        
    // /init    
        
    this.addOnClick = function(){
        $.each($('#notification_area>.notification.'+NotificationType.GRCRTNEWVERSION), function(ind, elem){
            $(elem).unbind('click'),
            $(elem).bind('click',function(){
				$(this).find($('a.close')).click(),
				Layout.showConfirmDialog(
					"GRCRTools new version",
					'<div><img src="'+RepConv.grcrt_cdn+'img/octopus.png" style="float:left;padding-right: 10px"/><p style="padding:5px">'+RepConvTool.GetLabel('NEWVERSION.AVAILABLE')+': <b>'+RepConv.asv+'</b></p></div>', 
					function(){
						if (typeof GRCRTExtension == 'undefined') {
						try {
							location.href=RepConv.Scripts_update_path+"GrepolisReportConverterV2.user.js";
						} catch (e) {}
						GRCRT_Updater.reload = true;
						GRCRT_Notifications.addNotification(NotificationType.GRCRTRELOAD);
						} else if (typeof GRCRTExtension != 'undefined'){
						if (GRCRTExtension.getJSFile()) {
							GRCRT_Updater.reload = true;
							GRCRT_Notifications.addNotification(NotificationType.GRCRTRELOAD);
						}
						} else if (grcrtBrowser.safari) {
						GRCRT_Updater.reload = true;
						GRCRT_Notifications.addNotification(NotificationType.GRCRTRELOAD);
						}
					}, 
					RepConvTool.GetLabel('NEWVERSION.INSTALL'), 
					function(){
						GRCRT_Updater.checked = false;
					},
					RepConvTool.GetLabel('NEWVERSION.REMINDER')
				)
            })
        }),
        $.each($('#notification_area>.notification.'+NotificationType.GRCRTWHATSNEW), function(ind, elem){
            $(elem).unbind('click'),
            $(elem).bind('click',function(){
            $(this).find($('a.close')).click(),
            //RepConvAdds.Help('HELPTAB3');
				RepConvGRC.openGRCRT('HELPTAB3');
            })
        }),
        $.each($('#notification_area>.notification.'+NotificationType.GRCRTRELOAD), function(ind, elem){
            $(elem).unbind('click'),
            $(elem).bind('click',function(){
				$(this).find($('a.close')).click(),
				GRCRT_Updater.reload = false;
				Layout.showConfirmDialog(
					"GRCRTools new version",
					'<div><img src="'+RepConv.grcrt_cdn+'img/octopus.png" style="float:left;padding-right: 10px"/><p style="padding:5px">'+RepConvTool.GetLabel('NEWVERSION.REQRELOAD')+'</b></p></div>', 
					function(){
                        location.reload();
					}, 
					RepConvTool.GetLabel('NEWVERSION.RELOAD'), 
					function(){
                        GRCRT_Updater.reload = true;
					},
					RepConvTool.GetLabel('NEWVERSION.REMINDER')
				)
            })
        })
    }
    this.addNotification = function(typeNotification){
        if ($('#notification_area>.notification').length > 7) {
            setTimeout(function(){GRCRT_Notifications.addNotification(typeNotification)},10000);
        } else {
            switch(typeNotification){
                case NotificationType.GRCRTNEWVERSION:
                    if ($('#notification_area .'+typeNotification).length == 0) {
                        this.checked = true;
                        createNotification(typeNotification, RepConvTool.GetLabel('NEWVERSION.AVAILABLE'));
                    }
                    break;
                case NotificationType.GRCRTWHATSNEW:
                    if ($('#notification_area .'+typeNotification).length == 0) {
                        createNotification(typeNotification, RepConvTool.GetLabel('HELPTAB3'));
                        RepConvTool.setItem(RepConv.CookieNew, RepConv.Scripts_version);
                    }
                    break;
                case NotificationType.GRCRTRELOAD:
                    if ($('#notification_area .'+typeNotification).length == 0) {
                        createNotification(typeNotification, RepConvTool.GetLabel('NEWVERSION.REQRELOAD'));
                    }
            }
        }        
    }
    createNotification = function(typeNotification, textNotification){
        var _notifications = (typeof Layout.notify == 'undefined') ? new NotificationHandler() : Layout;
        _notifications.notify(
                $('#notification_area>.notification').length+1, 
                typeNotification, 
                "<span><b>"+RepConv.Scripts_name+"</b></span>"+textNotification+
                "<span class='small notification_date'>"+RepConv.Scripts_nameS + " " + RepConv.Scripts_version + " [" + RepConv.LangEnv + "]"+"</span>"
            )
    }
    //Notification.permission == "default" && Notification.requestPermission();
}