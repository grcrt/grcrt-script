function _GRCRT_Translations() {
    this.RepConvLangArrayNew = {};//RepConvLangArray.en;
    //this._lang = Game.locale_lang.substring(0,2);
    RepConv.CookieTranslate = RepConv.Cookie+'_translate';
    this.table = function() {
        var
            result = $('<div/>', {'id':'grcrttranslate','style': 'padding: 5px'}),
            langs = [],
            destUrl = RepConv.Scripts_update_path+'translation.php',
            destFrame = $('<iframe/>',{/*'src':destUrl,*/'id':'transSender','name':'transSender','style':'display:none'});
        $(result)
            .append(
                $('<h4/>', {'style':'float:left;'}).html(RepConvTool.GetLabel('LANGS.LANG')+' '+Game.locale_lang.substring(0,2))
            )
            .append(
                $('<form/>',{'action':destUrl,'method':'post','target':'transSender','id':'transForm','style':'display:none'})
                .append(
                    $('<input/>',{'name':'player'}).attr('value',Game.player_name)
                )
                .append(
                    $('<input/>',{'name':'lang'}).attr('value',Game.locale_lang.substring(0,2))
                )
                .append(
                    $('<textarea/>',{'name':'translations','id':'trans2send'}).text(RepConvTool.getItem(RepConv.CookieTranslate))
                )
            )
            .append(
                $(destFrame)
            )
            .append(
                (RepConvTool.AddBtn('LANGS.SEND'))
                    .click(function() {
                        try {
                            GRCRT_Translations.sendTranslate();
                            HumanMessage.success(RepConvTool.GetLabel('MSGHUMAN.OK'));
                        } catch(e) {
                            HumanMessage.error(RepConvTool.GetLabel('MSGHUMAN.ERROR'));
                        }
                    })
            )
            .append(
                (RepConvTool.AddBtn('LANGS.SAVE'))
                    .click(function() {
                        try {
                            //GRCRT_Translations.
                            saveTranslate();
                            HumanMessage.success(RepConvTool.GetLabel('MSGHUMAN.OK'));
                        } catch(e) {
                            HumanMessage.error(RepConvTool.GetLabel('MSGHUMAN.ERROR'));
                        }
                    })
            )
            .append(
                (RepConvTool.AddBtn('LANGS.RESET'))
                    .click(function() {
                        Layout.showConfirmDialog(
                            "GRCRTools",
                            '<div><img src="'+RepConv.grcrt_domain+'img/octopus.png" style="float:left;padding-right: 10px"/><p style="padding:5px">'+RepConvTool.GetLabel('LANGS.REMOVE')+'</p></div>', 
                            function(){
                                RepConvLangArray = new _GRCRTRepConvLangArray()
                                if (RepConvLangArray[Game.locale_lang.substring(0,2)] == undefined) {
                                    RepConv.LangEnv = 'en';
                                } else {
                                    RepConv.LangEnv = Game.locale_lang.substring(0,2);
                                }
                                if (RepConvLangArray[RepConv.LangEnv] == undefined) {
                                    RepConv.LangEnv = "en";
                                    RepConv.LangLoaded = true;
                                }
                                RepConv.Lang = RepConvLangArray[RepConv.LangEnv],
                                RepConvTool.setItem(RepConv.CookieTranslate,''),
                                GRCRT_Translations.changeLang(Game.locale_lang.substring(0,2))
                            }, 
                            RepConvTool.GetLabel('MSGRTYES'), 
                            null,
                            RepConvTool.GetLabel('MSGRTNO'))
                    })
            )
            .append(
                $('<br/>', {'style': 'clear:both'})
            )
            .append(
                $('<div/>',{'style':'height: 32px;'}).html(RepConvTool.GetLabel4Lang('AUTHOR',Game.locale_lang.substring(0,2)))
            )
	    // tabelkomania
	    .append(
            this.changeLang(Game.locale_lang.substring(0,2))
	    )
	    // /tabelkomania
        return result;
    }
    //this.saveTranslate = function(){
    function saveTranslate(){
        RepConvTool.setItem(RepConv.CookieTranslate, JSON.stringify(GRCRT_Translations.RepConvLangArrayNew)),
        RepConvLangArray[Game.locale_lang.substring(0,2)] = GRCRT_Translations.RepConvLangArrayNew,
        RepConv.Lang = GRCRT_Translations.RepConvLangArrayNew;
    }
    this.sendTranslate = function(){
        //this.
        saveTranslate(),
        $('#trans2send').text(RepConvTool.getItem(RepConv.CookieTranslate)),
        $('#transForm').submit();
    }
    this.changeLang = function(_lang){
        var _result = $('<div/>',{'id':'grcrttrrows'});
        RepConvLangArray[_lang] = RepConvLangArray[_lang] || RepConvLangArray.en,
        this.RepConvLangArrayNew = $.extend({}, RepConvLangArray[_lang]);
	
        function _addRow(label){
            $(_result)
            .append(
                $('<div/>',{'class':'grcrtLangRow'})
                .append(
                    $('<textarea/>',{
                    'class':'grcrtLangEN',
                    'id':'en_'+(label.replace(/\./g,'_')),
                    'readonly':'readonly'
                    }).html(RepConvTool.GetLabel4Lang(label,'en'))
                )
                .append(
                    $('<textarea/>',{'class':'grcrtLangTranslate'/*,'id':(label.replace(/\./g,'_'))*/, 'rel':label})
                    .text(RepConvTool.GetLabel4Lang(label,_lang))
                    .css('background-color',
                        (RepConvTool.GetLabel4Lang(label,'en') == RepConvTool.GetLabel4Lang(label,_lang) && _lang!= 'en')
                        ? 'lightcoral' : 'white'
                    )
                    .change(function(){
                        console.log('aqq');
                        function gentree(_tree, _label, _value) {
                            console.log(_value);
                        var _lab = _label.split('.'), _tr = _label.split('.');
                        if (_tr.length == 1) {
                            _tree[_tr[0]] = _value;
                        } else {
                            _tree[_tr[0]] = _tree[_tr[0]] || {},
                            _lab.remove(0),
                            _tree[_tr[0]] = gentree(_tree[_tr[0]], _lab.join('.'),_value);
                        }
                        return _tree;
                        }
                        GRCRT_Translations.RepConvLangArrayNew = gentree(GRCRT_Translations.RepConvLangArrayNew, $(this).attr('rel'), $(this).val()/*attr('value')*/);
                    })
                )
                .append(
                    $('<br/>',{'style':'clear:both'})
                )
            )
            //console.log(_lang+":"+label);
        }
        
        function _labels(langArray, langLabel){
            langLabel += (langLabel.length == 0)?"":".";
            $.each(langArray, function(ind,elem){
                if (typeof elem == 'object') {
                    _labels(elem,langLabel+ind);
                } else {
                    if (elem.length >0 && langLabel+ind != "AUTHOR") {
                        _addRow(langLabel+ind);
                    }
                    
                }
            })
        }
        _labels(RepConvLangArray['en'],""),
        $('#grcrttrrows').remove(),
        $('#grcrttranslate').append(_result);
        return _result;
    }
    
    // init
    $('head')
        .append(
            $('<style/>')
                .append('#grcrttrrows {'+
                        'height: 360px;'+
                        'overflow: auto;'+
                    '}'
                )
                .append('.grcrtLangRow {'+
                        'border-top: solid 1px grey;'+
                    '}'
                )
                .append('.grcrtLangEN {'+
                        'float: left;'+
                        'width: 370px;'+
                        'margin-top: 2px;'+
                        'background-color: transparent;'+
                        'border: 0px;'+
                    '}'
                )
                .append('.grcrtLangTranslate {'+
                        'width: 400px;'+
                        'resize: vertical;'+
                        'height: 100%;'+
                        'margin-left: 5px;'+
                    '}'
                )
	    )
    // /init
    if (RepConvTool.getItem(RepConv.CookieTranslate) != null) {
		RepConvLangArray[Game.locale_lang.substring(0,2)] = JSON.parse(RepConvTool.getItem(RepConv.CookieTranslate)),
		RepConv.Lang = RepConvLangArray[Game.locale_lang.substring(0,2)];
    }
}