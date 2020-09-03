function _GRCRTMouseWheelZoom(){
    var _cookieBullEye = RepConv._cookie + "_mouseWheelZoomBullEye";
    var _2bindBullEye = '#main_area, .viewport.js-city-overview-viewport, .viewport.js-city-overview-buildings-container';
    this._whellWorkBullEye = false;

    var BullEyeItems = {
        'i1' : 'strategic_map',
        'i2' : 'island_view',
        'i3' : 'city_overview'
    }, BullEyeFlow = {};

    BullEyeFlow[BullEyeItems.i1] = { 'next' : BullEyeItems.i2, 'prev' : BullEyeItems.i3 };
    BullEyeFlow[BullEyeItems.i2] = { 'next' : BullEyeItems.i3, 'prev' : BullEyeItems.i1 };
    BullEyeFlow[BullEyeItems.i3] = { 'next' : BullEyeItems.i1, 'prev' : BullEyeItems.i2 };

    RepConv.sChbxs[_cookieBullEye] = {
        label : 'CHKMOUSEWHEELZOOMBULLEYE',
        default : true
    }

    $.Observer(GameEvents.grcrt.settings.load)
        .subscribe('GRCRTmouseWheelZoomBullEye_settings_load', function() {
            mouseWheelZoomBullEye();
    });

    function mouseWheelZoomBullEye() {
        if (!RepConv.settings[_cookieBullEye]) {
            $(_2bindBullEye).unbind('mousewheel');
        } else {
            $(_2bindBullEye).bind('mousewheel', function (event, delta) {
                event.stopPropagation();
                if(GRCRTMouseWheelZoom._whellWorkBullEye){
                    return false;
                }
                GRCRTMouseWheelZoom._whellWorkBullEye = true;
                var current = $('.bull_eye_buttons .checked').get(0).getAttribute("name"), switch_to;
                switch_to = (delta < 0) ? BullEyeFlow[current].next : BullEyeFlow[current].prev;
                $('.bull_eye_buttons .'+switch_to).click();
                setTimeout(function(){
                    GRCRTMouseWheelZoom._whellWorkBullEye = false;
                },250);

                return false;
            });
        }
    }
}
