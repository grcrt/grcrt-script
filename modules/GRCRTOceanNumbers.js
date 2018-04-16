function _GRCRTOceanNumbers(){
    function oceanNumbers(){
        if ($('#map_move_container').length == 0) {
            setTimeout(function(){
                oceanNumbers();
            }, 100);
        } else {
            if (!RepConv.active.oceanNumber) {
                $('div#grcrt_oceanNumbers').remove()
            } else {
                if ($('div#grcrt_oceanNumbers').length == 0) {
                    $('#map_move_container').append(
                        $('<div/>', {'id':'grcrt_oceanNumbers', 'style':'position:absolute; top:0; left:0;'})
                    );
                    var _mapSize = (require("map/helpers")||MapTiles).map2Pixel(100,100);//MapTiles.map2Pixel(100,100);
                    for(var _mapY=0; _mapY<10; _mapY++){
                        for(var _mapX=0; _mapX<10; _mapX++){
                            var _lt = (require("map/helpers")||MapTiles).map2Pixel(_mapX*100,_mapY*100);//MapTiles.map2Pixel(_mapX*100,_mapY*100);
                            $('div#grcrt_oceanNumbers').append(
                                $('<div/>', {'class':'RepConvON','style' : 'left:'+(_lt.x)+'px; top: '+(_lt.y)+'px; background-image: url('+RepConv.grcrt_cdn+'map/'+_mapX+_mapY+'.png);'})
                            );
                        }
                    }
                }
            }
        }
    }
    $.Observer(GameEvents.grcrt.settings.load)
        .subscribe('GRCRTOceanNumbers_settings_load', function() {
            oceanNumbers();
        });
}
