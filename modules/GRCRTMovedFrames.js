function _GRCRTMovedFrames(){
    "use strict";

    function activity_commands_list(){
        if($('#toolbar_activity_commands_list').length==0){
            setTimeout(function(){
                activity_commands_list()
            },500);
            return;
        }
        var
            tacl_id = '#toolbar_activity_commands_list',
            tacl_clk = '.activity.commands',
            target_tacl = document.querySelector(tacl_id);
        // command list
        if($('#grcrt_taclWrap').length==0){
            $('#toolbar_activity_commands_list').wrap($('<div/>',{'class':'grcrt_taclWrap', 'id':'grcrt_taclWrap'}))
            if(RepConv.settings[RepConv.Cookie+'_tacl']){
                $('#toolbar_activity_commands_list').addClass('grcrt_tacl')
                $('#grcrt_taclWrap').draggable().draggable('enable')
                var
                    observer_tacl = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            if($(target_tacl).hasClass('grcrt_tacl') && ($('#grcrt_taclWrap').attr('style') && $(target_tacl).css('display')=="none")){
                                $(tacl_clk).trigger('mouseenter')
                            }
                        });
                    });
                if($(tacl_id+">.js-dropdown-list>a.cancel").length == 0){
                    $(tacl_id+">.js-dropdown-list")
                        .append(
                            $('<a/>',{'href':'#n','class':'cancel', 'style':'display:none;'})
                                .click(function(){
                                    $('#grcrt_taclWrap').removeAttr('style')
                                })
                        )
                }
                observer_tacl.observe(target_tacl, { attributes: true, childList: false, characterData: false });
            } else {
                $('#toolbar_activity_commands_list').removeClass('grcrt_tacl')
                $('#grcrt_taclWrap').draggable().draggable('disable').removeAttr('style')
            }
        }
        if($(target_tacl).hasClass('grcrt_tacl') && ($('#grcrt_taclWrap').attr('style') /*&& $(target_tacl).css('display')=="none"*/)){
            $(tacl_clk).trigger('mouseenter')
        }
    }

    // function activity_trades_list(){
    //     if($('#toolbar_activity_trades_list').length==0){
    //         setTimeout(function(){
    //             activity_trades_list()
    //         },500);
    //         return;
    //     }
    //     var 
    //         tatl_id = '#toolbar_activity_trades_list',
    //         tatl_clk = '.activity.trades'
    //     if($('#grcrt_tatlWrap').length==0){
    //         $('#toolbar_activity_trades_list').wrap($('<div/>',{'class':'grcrt_tatlWrap', 'id':'grcrt_tatlWrap'}))
    //         if(RepConv.settings[RepConv.Cookie+'_tatl']){
    //             $('#toolbar_activity_trades_list').addClass('grcrt_tatl')
    //             $('#grcrt_tatlWrap').draggable().draggable('enable')
    //         } else {
    //             $('#toolbar_activity_trades_list').removeClass('grcrt_tatl')
    //             $('#grcrt_tatlWrap').draggable().draggable('disable').removeAttr('style')
    //         }
    //     }

    //     if($(tatl_clk).hasClass('active')){
    //         $(tatl_id)
    //             .append(
    //                 $('<a/>',{'href':'#n','class':'cancel', 'style':'display:none;'})
    //                     .click(function(){
    //                         $('#grcrt_tatlWrap').removeAttr('style')
    //                     })
    //             )
    //     } else {
    //         var
    //             target_tatl = document.querySelector(tatl_id),
    //             observer_tatl = new MutationObserver(function(mutations) {
    //                 mutations.forEach(function(mutation) {
    //                     if($(target_tatl).hasClass('grcrt_tatl') && ($('#grcrt_tatlWrap').attr('style') && $(target_tatl).css('display')=="none")){
    //                         $(tatl_clk).trigger('mouseenter')
    //                     }
    //                 });
    //             });
    //         $(tatl_id+">.js-dropdown-list")
    //             .append(
    //                 $('<a/>',{'href':'#n','class':'cancel', 'style':'display:none;'})
    //                     .click(function(){
    //                         $('#grcrt_tatlWrap').removeAttr('style')
    //                     })
    //             )
    //         observer_tatl.observe(target_tatl, { attributes: true, childList: false, characterData: false });
    //     }
    // }

    $('head')
        .append(
            $('<style/>')
                .append( // frozen lists
                    $('<style/>')
                        .append('.showImportant { bisplay: block !important}')

                        .append('#grcrt_taclWrap { left:312px; position: absolute; top: 29px;}')
                        .append('#grcrt_taclWrap>#toolbar_activity_commands_list { left: 0 !important; top: 0 !important;}')
                        .append('.grcrt_tacl { z-index:5000 !important;}')
                        .append('.grcrt_tacl>.js-dropdown-list>a.cancel { position: relative; float: right; margin-bottom: 11px;display:none; opacity: 0; visibility: hidden; transition: visibility 0s, opacity 0.5s linear;}')
                        .append('.grcrt_tacl>.js-dropdown-list:hover>a.cancel { display: block !important; visibility: visible; opacity: 0.5;}')
                        .append('.grcrt_tacl>.js-dropdown-list>a.cancel:hover { opacity: 1;}')

                        // .append('#grcrt_tatlWrap { left:340px; position: absolute; top: 29px;}')
                        // .append('#grcrt_tatlWrap>#toolbar_activity_trades_list { left: 0 !important; top: 0 !important;}')
                        // .append('.grcrt_tatl { z-index:5000 !important;}')
                        // .append('.grcrt_tatl>a.cancel { position: relative; float: right; margin-bottom: 11px;display:none; opacity: 0; visibility: hidden; transition: visibility 0s, opacity 0.5s linear;}')
                        // .append('.grcrt_tatl:hover>a.cancel { display: block !important; visibility: visible; opacity: 0.5;}')
                        // .append('.grcrt_tatl>a.cancel:hover { opacity: 1;}')
                        // .append('.grcrt_tatl>.js-dropdown-list>a.cancel { position: relative; float: right; margin-bottom: 11px;display:none; opacity: 0; visibility: hidden; transition: visibility 0s, opacity 0.5s linear;}')
                        // .append('.grcrt_tatl>.js-dropdown-list:hover>a.cancel { display: block !important; visibility: visible; opacity: 0.5;}')
                        // .append('.grcrt_tatl>.js-dropdown-list>a.cancel:hover { opacity: 1;}')


                        // .append('.grcrt_tarl>a.cancel,.grcrt_tacl>a.cancel,.grcrt_tatl>a.cancel { position: relative; float: right; margin-bottom: 0px;display:none; opacity: 0; visibility: hidden; transition: visibility 0s, opacity 0.5s linear;}')
                        // .append('.grcrt_tarl:hover>a.cancel,.grcrt_tacl:hover>a.cancel,.grcrt_tatl:hover>a.cancel { display: block !important; visibility: visible; opacity: 0.5;}')
                        // .append('.grcrt_tarl>a.cancel:hover,.grcrt_tacl>a.cancel:hover,.grcrt_tatl>a.cancel:hover { opacity: 1;}')
                        // .append('.grcrt_tacl>.js-dropdown-list:after {content: "___"; float: right; height: 30px; background: transparent url(https://cdn1.iconfinder.com/data/icons/interface-4/96/Cursor-Move-16.png) no-repeat top right; color: transparent;position:relative}')
                        // .append('.grcrt_tacl>.js-dropdown-list:after:hover {height: 30px;}')
                        // .append('.grcrt_tacl>.js-dropdown-item-list:after {content: "___"; float: right; height: 19px; background: transparent url(https://cdn1.iconfinder.com/data/icons/interface-4/96/Cursor-Move-16.png) no-repeat top right; color: transparent;position:relative}')
                        // .append('.grcrt_tacl>.js-dropdown-item-list:after:hover {height: 30px;}')
                )
        );

    RepConv.sChbxs[RepConv.Cookie+'_tacl'] = { label : 'CHKTACL', default : true}
    // RepConv.sChbxs[RepConv.Cookie+'_tatl'] = { label : 'CHKTATL', default : true}

    $.Observer(GameEvents.grcrt.settings.load)
        .subscribe('GRCRTMovedFrames_settings_load', function() {
            activity_commands_list();
            // activity_trades_list();
        });
    $.Observer(GameEvents.command.send_unit)
        .subscribe('GRCRTMovedFrames_command_send', function() {
            activity_commands_list();
            // activity_trades_list();
        });

}
