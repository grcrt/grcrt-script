function _GRCRT_Updater(){
    this.checkTime = 1000*60*15
    this.checked = false;
    this.reload = false;
    this.checkUpdate = function(){
        if (!this.checked) {
            $.ajax({type: "GET",
                    url: RepConv.Scripts_check_path+"checkVersion.php",
                    dataType: "script",
                    async: true,
                    complete: function() {
                        if((RepConv.asv || RepConv.Scripts_version) != RepConv.Scripts_version){
                            if (typeof GRCRTools == 'undefined' && (typeof GRCRTLoader == 'undefined')) {
                                GRCRT_Notifications.addNotification(NotificationType.GRCRTNEWVERSION);
                            } else {
                                GRCRT_Updater.reload = true;
                                GRCRT_Notifications.addNotification(NotificationType.GRCRTRELOAD);
                            }
                        };
                    }
                });
        } else if (this.reload) {
            GRCRT_Notifications.addNotification(NotificationType.GRCRTRELOAD);
        }
    }
    if (RepConv.updateInterval == undefined) {
        RepConv.updateInterval = setInterval(function(){GRCRT_Updater.checkUpdate();},this.checkTime);
    }
}