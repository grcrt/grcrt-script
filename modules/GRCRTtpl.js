function _GRCRTtpl() {
    "use strict";
    var
        _spliter = '=#=#=',
        _site2site = ' (##/##)',
        templ = {};
    this.rct = {};
    this.rcts = {
        A: {
            outside: false,
            town: "town",
            ghost_town: "town",
            farm_town: "town",
            player: "player",
            ally: "ally",
            island: "island",
            temple: "temple",
            tag: "quote",
            fonttag: "monospace",
            blank: "..........", //				"          ",
            separator: ".",
            separator3: "...",
            unitDigits: 7,
            sign: "u",
            textTown: "",
            textPlayer: "",
            textAlly: "",
            unitSize: "8",
            getTown: 'id',
            getIsland: 'id',
            morale: RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.morale, "img") + ' ',
            luck: RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.luck, "img") + ' ',
            nightbonus: RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.nightbonus, "img") + ' ',
            oldwall: RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.oldwall, "img") + ' ',
            genImg: RepConv.grcrt_domain+"static/{0}{1}_37_5.png",
            genImgS : 42,
            genImgM : 5,
            nullImg: RepConv.grcrt_domain+'static/{0}_{1}_{2}.png',
            doubleline: '[color=#0000ff]======================================================================================================[/color]',
            singleline: '[color=#0000ff]------------------------------------------------------------------------------------------------------[/color]',
            tplTableBegin: '[table]',
            tplTableEnd: '[/table]',
            tplRowBegin: '',
            tplRowEnd: '',
            tplColBegin: '[*]',
            tplColEnd: '[/*]',
            tplColSpan2: '[*]',
            tplColSpan3: '[*]',
            tplColSpan4: '[*]',
            tplColSep: '[|]',
            tplGenImg: RepConv.grcrt_domain+'static/{0}{1}_45_4.png',
            tplTableNBBegin: '',
            tplTableNBEnd: '',
            tplFontBegin: '[font=monospace]',
            tplFontEnd: '[/font]',
            tplSize9: '[size=9]',
            tplSizeEnd: '[/size]',
            unitWall : 15,
            unitWall2 : 7,
            tplBlank : '\xa0',
            charLimit : 8000, //5200
            tagLimit : 500,
            spoiler : 'spoiler'
        },
        E: {
            outside: true,
            town: "b",
            ghost_town: "b",
            farm_town: "b",
            player: "b",
            ally: "b",
            island: "b",
            temple: "b",
            tag: "code",
            fonttag: "Courier New",
            blank: "          ",
            separator: " ",
            separator3: "   ",
            unitDigits: 7,
            sign: "f",
            textTown: RepConvTool.GetLabel('TOWN'),
            textPlayer: RepConvTool.GetLabel('PLAYER'),
            textAlly: RepConvTool.GetLabel('ALLY'),
            unitSize: "8",
            getTown: 'name',
            getIsland: 'name',
            morale: "",
            luck: "",
            nightbonus: "",
            oldwall: "",
            genImg: RepConv.grcrt_domain+"static/{0}{1}_45_4.png",
            genImgS : 45,
            genImgM : 4,
            nullImg: RepConv.grcrt_domain+'static/{0}_{1}_{2}.png',
            doubleline: '[color=#0000ff]=========================================================[/color]',
            singleline: '[color=#0000ff]---------------------------------------------------------[/color]',
            tplTableBegin: '[table="width: 710, class: outer_border"]',
            tplTableEnd: '[/table]',
            tplRowBegin: '[tr]',
            tplRowEnd: '[/tr]',
            tplColBegin: '[td]',
            tplColEnd: '[/td]',
            tplColSpan2: '[td="colspan: 2"]',
            tplColSpan3: '[td="colspan: 3"]',
            tplColSpan4: '[td="colspan: 4"]',
            tplColSep: '[/td][td]',
            tplGenImg: RepConv.grcrt_domain+'static/{0}{1}_45_4.png',
            tplTableNBBegin: '[tr][td="colspan: 3"]',
            tplTableNBEnd: '[/td][/tr]',
            tplFontBegin: '[font=Courier New]',
            tplFontEnd: '[/font]',
            tplSize9: '',
            tplSizeEnd: '',
            unitWall : 15,
            unitWall2 : 7,
            tplBlank : '\xa0',
            charLimit : 99999, //4800
            tagLimit : 99999,
            spoiler : 'spr'
        },
        I: {
            outside: false,
            town: "town",
            ghost_town: "town",
            farm_town: "town",
            player: "player",
            ally: "ally",
            island: "island",
            temple: "temple",
            tag: "quote",
            fonttag: "monospace",
            blank: "..........", //             "          ",
            separator: ".",
            separator3: "...",
            unitDigits: 7,
            sign: "u",
            textTown: "",
            textPlayer: "",
            textAlly: "",
            unitSize: "8",
            getTown: 'name',
            getIsland: 'name',
            morale: RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.morale, "img") + ' ',
            luck: RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.luck, "img") + ' ',
            nightbonus: RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.nightbonus, "img") + ' ',
            oldwall: RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.oldwall, "img") + ' ',
            genImg: RepConv.grcrt_domain+"static/{0}{1}_37_5.png",
            genImgS : 42,
            genImgM : 5,
            nullImg: RepConv.grcrt_domain+'static/{0}_{1}_{2}.png',
            doubleline: '[color=#0000ff]======================================================================================================[/color]',
            singleline: '[color=#0000ff]------------------------------------------------------------------------------------------------------[/color]',
            tplTableBegin: '[table]',
            tplTableEnd: '[/table]',
            tplRowBegin: '',
            tplRowEnd: '',
            tplColBegin: '[*]',
            tplColEnd: '[/*]',
            tplColSpan2: '[*]',
            tplColSpan3: '[*]',
            tplColSpan4: '[*]',
            tplColSep: '[|]',
            tplGenImg: RepConv.grcrt_domain+'static/{0}{1}_45_4.png',
            tplTableNBBegin: '',
            tplTableNBEnd: '',
            tplFontBegin: '[font=monospace]',
            tplFontEnd: '[/font]',
            tplSize9: '[size=9]',
            tplSizeEnd: '[/size]',
            unitWall : 15,
            unitWall2 : 7,
            tplBlank : '\xa0',
            charLimit : 8000, //5200
            tagLimit : 500,
            spoiler : 'spoiler'
        },
    };

    templ.txt = {
            head : '[b]<%=GRCRTtpl.AddSize(time+title,9)%>'+_site2site+'[/b]\\n',
            foot : '<%=RepConv.Const.footer%>',
            duble : '<%=GRCRTtpl.rct.doubleline%>\\n',
            single : '<%=GRCRTtpl.rct.singleline%>\\n',
            attacker : ''+
'[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel(\'ATTACKER\'),10)%>[/b]: '+
'<%=attacker.town%> '+
'<%=attacker.player%> '+
'<%=attacker.ally%> '+
'<%=GRCRTtpl.AddSize(morale+\' \'+luck,8)%>\\n'+
'',
            attUnit : ''+
'<%=attacker.full.img_url%><%=powerAtt%>\\n'+
'',
            defender : ''+
'[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel(\'DEFENDER\'),10)%>[/b]: '+
'<%=defender.town%> '+
'<%=defender.player%> '+
'<%=defender.ally%> '+
'<%if(Object.size(oldwall)>0){%>'+
'<%=GRCRTtpl.AddSize(oldwall[0]+\' \'+nightbonus,8)%>'+
'<%}%>\\n'+
'',
            defUnit : ''+
'<%=defender.full.img_url%><%=powerDef%>\\n'+
'',
            spyUnit : ''+
'<%if (defender.title != null){%>'+
'<%=defender.title%>\\n'+
'<%=defender.full.img_url%>\\n'+
'<%}%>'+
'',
            spyBuild : ''+
'<%if (build.title != null){%>'+
'<%=build.title%>\\n'+
'<%=build.full.img_url%>\\n'+
'<%}%>'+
'',
            spyIron : ''+
'<%=iron.title%>\\n'+
'<%if(iron.count!=""){%>'+
'<%=RepConvTool.Adds(RepConv.Const.unitImg+"iron.png","img")%> <%=GRCRTtpl.AddSize(iron.count,8)%>\\n'+
'<%}%>'+
'',
            spyResource : ''+
'<%if (resources.title != ""){%>'+
'<%=GRCRTtpl.AddSize(resources.title,8)%>\\n'+
'<%=resources.img_url%>\\n'+
'<%}%>'+
'',
            spyGod : ''+
'<%if (god.title != ""){%>'+
'<%=GRCRTtpl.AddSize(god.title,8)%>\\n'+
'<%=god.img_url%>\\n'+
'<%}%>'+
'',
            resource : ''+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'<%=GRCRTtpl.AddSize(resources.title,9)%>\\n'+
'<%=resources.img_url%>\\n'+
'',
            resource2 : ''+
'<%=GRCRTtpl.AddSize(resources.title,9)%>\\n'+
'<%=resources.count.length%>'+
'',
            bunt : ''+
'<%if ( bunt.length > 0){%>'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'<%=RepConvTool.Adds(RepConv.Const.bunt,"img")%> <%=bunt%>\\n'+
'<%}%>'+
'',
            units_cost : ''+
'<%=GRCRTtpl.rct.separator3%><%=RepConvTool.Adds(RepConv.Const.unitImg+GRCRTtpl.rct.sign+"Z1Z2Z3Z4Z5.png","img")%><%=GRCRTtpl.rct.separator3%>[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel(\'LOSSES\'),9)%>[/b]\\n'+
'<%if ( attacker.w != undefined ){%>'+
'<%=GRCRTtpl.AddSize(GRCRTtpl.Value(attacker.w,10)+GRCRTtpl.Value(attacker.s,10)+GRCRTtpl.Value(attacker.i,10)+GRCRTtpl.Value(attacker.p,10)+GRCRTtpl.Value(attacker.f,10)+" [b]"+RepConvTool.GetLabel(\'ATTACKER\')+"[/b]",8)%>\\n'+
'<%}%>'+
'<%=GRCRTtpl.AddSize(GRCRTtpl.Value(defender.w,10)+GRCRTtpl.Value(defender.s,10)+GRCRTtpl.Value(defender.i,10)+GRCRTtpl.Value(defender.p,10)+GRCRTtpl.Value(defender.f,10)+" [b]"+RepConvTool.GetLabel(\'DEFENDER\')+"[/b]",8)%>\\n'+
'',
            commandLine : ''+
'<%for(ind in linia){%>'+
'<%  if (ind > 0){%>'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'<%  }%>'+
'<%  if (linia[ind].title.length>0) {%>'+
'<%=linia[ind].title%>\\n'+
'<%  } else {%>'+
'<%=linia[ind].img%> <%=linia[ind].time%> <%=linia[ind].townIdA.full%> <%=linia[ind].inout%> <%=linia[ind].townIdB.full%>\\n'+
'<%=linia[ind].img_url%>  <%=linia[ind].power%>\\n'+
'<%  }%>'+
_spliter+
'<%}%>'+
'',
            conquerold : ''+
'[b]<%=GRCRTtpl.AddSize(title+time,9)%>[/b]\\n'+
'<%=GRCRTtpl.rct.doubleline%>\\n'+
'<%=defender.town%> <%=defender.player%>\\n'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'<%=attacker.units_title%>\\n'+
'<%=attacker.full.img_url%>\\n'+
'',
            supUnit : ''+
'<%=attacker.full.img_url%>\\n'+
'',
            command : ''+
'<%=attacker.town%> <%=attacker.player%>\\n'+
'<%=detail.time_title%> <%=detail.time_time%>\\n'+
'<%=attacker.units_title%>\\n'+
'<%  if (attacker.full.img_url != \'\') {%>'+
'<%=attacker.full.img_url%> <%=detail.power_img%>\\n'+
'<%  }else{%>'+
'<%=RepConvTool.GetLabel(\'NOTUNIT\')%>\\n'+
'<%  }%>'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'<%=defender.town%> <%=defender.player%>\\n'+
'<%  if(resources.title!=null){%>'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'<%=GRCRTtpl.AddSize(resources.title,9)%>\\n'+
'<%=resources.img_url%>\\n'+
'<%  }%>'+
'',
            agoraLine : ''+
'<%for(ind in linia){%>'+
'<%  if (ind > 0){%>'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'<%  }%>'+
'<%=linia[ind].title%>\\n'+
'<%=linia[ind].img_url%>\\n'+
_spliter+
'<%}%>'+
'',
            powerDet : ''+
'<%=power%>\\n'+
'<%=efekt.title%>\\n'+
'<%if (efekt.detail != null){%>'+
'<%=efekt.detail.wrapLine(25)%>\\n'+
'<%}%>'+
'<%if (type == 1){%>'+
'<%}else if (type == 2){%>'+
'<%=resources.full.img_url%>\\n'+
'<%}else if (type == 3){%>'+
'<%=resources.img_url%>\\n'+
'<%}else if (type == 4){%>'+
'<%}else if (type == 5){%>'+
'<%=resources.img_url%>\\n'+
'<%}%>'+
'',
            wallHead : ''+
'<%=title%>\\n'+
'',
            wallDet : ''+
'<%if (defeated.title != ""){%>'+
'<%=GRCRTtpl.AddSize(defeated.title,10)%>\\n'+
'<%  if(defeated.titleAttacker != ""){%>'+
'<%=GRCRTtpl.AddSize(defeated.titleAttacker,8)%>\\n'+
'<%    for(ind in defeated.attacker){%>'+
'<%=defeated.attacker[ind].img_url%>\\n'+
'<%    }%>'+
'<%  }%>'+
'<%  if(defeated.titleDefender != ""){%>'+
'<%=GRCRTtpl.AddSize(defeated.titleDefender,8)%>\\n'+
'<%    for(ind in defeated.defender){%>'+
'<%=defeated.defender[ind].img_url%>\\n'+
'<%    }%>'+
'<%  }%>'+
'<%}%>'+
'<%if (losses.title != ""){%>'+
'<%  if (defeated.title != ""){%>'+
'<%=GRCRTtpl.rct.doubleline%>\\n'+
'<%  }%>'+
'<%=GRCRTtpl.AddSize(losses.title,10)%>\\n'+
'<%  if(losses.titleAttacker != ""){%>'+
'<%=GRCRTtpl.AddSize(losses.titleAttacker,8)%>\\n'+
'<%    for(ind in losses.attacker){%>'+
'<%=losses.attacker[ind].img_url%>\\n'+
'<%    }%>'+
'<%  }%>'+
'<%  if(losses.titleDefender != ""){%>'+
'<%=GRCRTtpl.AddSize(losses.titleDefender,8)%>\\n'+
'<%    for(ind in losses.defender){%>'+
'<%=losses.defender[ind].img_url%>\\n'+
'<%    }%>'+
'<%  }%>'+
'<%}%>'+
'',
            detail : ''+
'<%=detail%>\\n'+
'',
            conquest : ''+
'[b]<%=GRCRTtpl.AddSize(title,9)%>[/b]\\n'+
'<%=defender.town%> (<%=time%>)\\n'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel(\'ATTACKER\'),10)%>[/b]: '+
'<%=attacker.town%> '+
'<%=attacker.player%> '+
'<%=attacker.ally%> '+
'<%=GRCRTtpl.AddSize(morale+\' \'+luck,8)%>\\n'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'<%=attacker.units_title%>\\n'+
'<%for(ind in attacker.splits){%>'+
'<%=  attacker.splits[ind].img_url%>\\n'+
'<%}%>'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'',
        olympus : ''+
'[b]<%=GRCRTtpl.AddSize(title,9)%>[/b]\\n'+
'<%=temple.god.img_url%> <%=temple.god.name%>\\n' +
'[i]<%=temple.buff%>[/i]\\n'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'<%=temple.name%> \\n'+
'<%  if (temple.owner!="") {%>'+
'<%=temple.owner%> \\n'+
'<%}%>'+
'[img]https://cdn.grcrt.net/ui/attack.png[/img] <%=movements_count.attack%>     '+
'[img]https://cdn.grcrt.net/ui/support.png[/img] <%=movements_count.support%>\\n'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'',
            conquestTroopsHead : ''+
'[b]<%=GRCRTtpl.AddSize(command.title,9)%>[/b]'+_site2site+'\\n'+
'',
            conquestTroops : ''+
'<%for(ind in linia){%>'+
'<%=GRCRTtpl.rct.singleline%>\\n'+
'<%=linia[ind].img%> <%=linia[ind].inout%> (<%=linia[ind].time%>) <%=linia[ind].text%>\\n'+
_spliter+
'<%}%>'+
'',
            academy : ''+
'<%for(ind in linia){%>'+
'<%=RepConvTool.Adds((GRCRTtpl.rct.tplGenImg).RCFormat(GRCRTtpl.rct.sign, linia[ind].unit_list), "img")%>\\n'+
'\\n'+
'<%}%>'+
'[b]<%=GRCRTtpl.AddSize(points,9)%>[/b]\\n'+
'',
            ownTropsInTheCity : ''+
'<%=defender.full.img_url%>\\n'+
'',
            ownTropsInOlympus : ''+
'<%=defender.full.img_url %>\\n'+
'<% if ( addInfo != "" ) { %>'+
'<%=addInfo %>\\n'+
'<% } %>'+
'',

            revoltTool : ''+
'[quote][table]\\n'+
'[*][|]<%=defender.town%>[/*]\\n'+
'[*]<%=RepConvTool.Adds(RepConv.Const.bunt2,"img")%>[||]<%=GRCRTtpl.AddSize(rtrevolt,11)%>[/*]\\n'+
'[/table]\\n'+
'[table]\\n'+
'[*]<%=GRCRTtpl.AddSize(rtlabels.wall,10)%>[||] <%=GRCRTtpl.AddSize(rtwall.toString(),11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.ram,10)%>[||] <%=GRCRTtpl.AddSize(rtram,11)%> [/*]\\n'+
'[*]<%=GRCRTtpl.AddSize(rtlabels.tower,10)%>[||] <%=GRCRTtpl.AddSize(rttower,11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.phalanx,10)%>[||] <%=GRCRTtpl.AddSize(rtphalanx,11)%> [/*]\\n'+
'[*]<%=GRCRTtpl.AddSize(rtlabels.god,10)%>[||] <%=GRCRTtpl.AddSize(rtgod||\'\',11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.captain,10)%>[||] <%=GRCRTtpl.AddSize(rtpremium.captain,11)%> [/*]\\n'+
'[*]<%=GRCRTtpl.AddSize(rtlabels.cstime,10)%>[||] <%=GRCRTtpl.AddSize(rtcstime,11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.commander,10)%>[||] <%=GRCRTtpl.AddSize(rtpremium.commander,11)%> [/*]\\n'+
'[*]<%=GRCRTtpl.AddSize(rtlabels.online,10)%>[||] <%=GRCRTtpl.AddSize(rtonline,11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.priest,10)%>[||] <%=GRCRTtpl.AddSize(rtpremium.priest,11)%> [/*]\\n'+
'[/table][/quote]\\n'+
'\\n'+
'',
        bbcode_ipa : ''+
'<%=GRCRTtpl.AddSize(header,9)%>'+_site2site+'\\n'+
_spliter+
'<%for(ind in linia){%>'+
'<%=ind%> <%=linia[ind].col1%>. <%=linia[ind].col2%> <%=linia[ind].col3%> <%=linia[ind].col4%>\\n'+
_spliter+
'<%}%>'+
'',

    }
    templ.tbl = {
        title : '[b]<%=GRCRTtpl.AddSize(time+title,9)%>'+_site2site+'[/b]\\n',
        foot : '[center]<%=RepConv.Const.footer%>[/center]',
        commandLine : ''+
'<%for(ind in linia){%>'+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%  if (linia[ind].title.length>0) {%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'[b]<%=GRCRTtpl.AddSize(linia[ind].title,10)%>[/b]'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%  } else {%>'+
'<%=linia[ind].img%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=GRCRTtpl.rct.tplFontBegin%>'+
'<%=linia[ind].townIdA.full%> <%=linia[ind].inout%> <%=linia[ind].townIdB.full%>\\n'+
'<%=linia[ind].time%><%=GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=linia[ind].power%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=linia[ind].img_url%>\\n'+
'<%  }%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
_spliter+
'<%}%>'+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=RepConvTool.addLine(35)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.addLine(380)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.addLine(25)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.addLine(265)%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'',
        conquest : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan4%>'+
'<%=GRCRTtpl.rct.tplFontBegin %>'+
'[b]<%=title%>[/b]\\n'+
'<%=defender.town%> (<%=time%>)\\n'+
'[b]<%=RepConvTool.GetLabel(\'ATTACKER\')%>[/b]: '+
'<%=attacker.player%> '+
'<%=GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan4%>'+
'<%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %>'+
'<%=attacker.title%>\\n'+
'<%for(ind in attacker.splits){%>'+
'<%=  attacker.splits[ind].img_url%>\\n'+
'<%}%>'+
'<%=RepConvTool.addLine(698)%>'+
'<%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'',
        olympus : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=GRCRTtpl.rct.tplFontBegin %>'+
'[b]<%=title%>[/b]\\n'+
'<%=temple.god.img_url%> <%=temple.god.name%>\\n' +
'[i]<%=temple.buff%>[/i]\\n'+
'<%=GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=GRCRTtpl.rct.tplFontBegin %>'+
'<%=temple.name%> \\n'+
'<%  if (temple.owner!="") {%>'+
'<%=temple.owner%> \\n'+
'<%}%>'+
'[img]https://cdn.grcrt.net/ui/attack.png[/img] <%=movements_count.attack%>     '+
'[img]https://cdn.grcrt.net/ui/support.png[/img] <%=movements_count.support%>\\n'+
'<%=GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %>'+
'<%=RepConvTool.addLine(345)%>'+
'<%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %>'+
'<%=RepConvTool.addLine(345)%>'+
'<%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'',
        t3col : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=RepConvTool.addLine(245)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.addLine(190)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.addLine(245)%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'',
        t2col : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan2%>'+
'<%=RepConvTool.addLine(472)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.addLine(218)%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'',
        head_players : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize('+
    '((attacker.town != undefined) ? attacker.town+\'\\n\' : \'\')+'+
    '((attacker.player != undefined) ? attacker.player+\'\\n\' : \'\')+'+
    '((attacker.ally != undefined) ? attacker.ally+\'\\n\' : \'\')'+
',10), GRCRTtpl.rct.fonttag)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.AddFont(\'[img]\'+RepConv.grcrt_cdn+\'ui/ragB.png[/img][img]\'+RepConv.grcrt_cdn+\'ui/5/\'+reportImage+\'.png[/img][img]\'+RepConv.grcrt_cdn+\'ui/ragE.png[/img]\', GRCRTtpl.rct.fonttag)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize('+
    '((defender.town != undefined) ? defender.town+\'\\n\' : \'\')+'+
    '((defender.player != undefined) ? defender.player+\'\\n\' : \'\')+'+
    '((defender.ally != undefined) ? defender.ally+\'\\n\' : \'\')'+
',10), GRCRTtpl.rct.fonttag)%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'',
        attacker_adds : ''+
'<%if(powerAtt.length>0){%>'+
'<%=powerAtt%>\\n'+
'<%}%>'+
'<%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%>\\n'+
'<%=morale%>\\n'+
'<%=luck%>\\n'+
'<%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>'+
'',
        attacker_units : ''+
'<%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%>'+
'<%for(idx in attacker.splits){%>'+
'<%=attacker.splits[idx].img_url %>\\n'+
'<%}%>'+
'<%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>'+
'',
        defender_adds : ''+
'<%if(powerDef.length>0){%>'+
'<%=powerDef%>\\n'+
'<%}%>'+
'<%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%>\\n'+
'<%for(idx in oldwall){%>'+
'<%=oldwall[idx]%> \\n'+
'<%}%>'+
'<%=nightbonus%> \\n'+
'<%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>'+
'',
        defender_units : ''+
'<%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%>'+
'<%for(idx in defender.splits){%>'+
'<%=defender.splits[idx].img_url %>\\n'+
'<%}%>'+
'<%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>'+
'',
        resources : ''+
'[center]<%=GRCRTtpl.rct.tplFontBegin%>'+
'[b]<%=GRCRTtpl.AddSize(resources.title.wrapLine(25),10)%>[/b]\\n'+
'<%=resources.img_url %>'+
'<%=GRCRTtpl.rct.tplFontEnd%>[/center]\\n'+
'',
        revolt : ''+
'[center]<%=GRCRTtpl.rct.tplFontBegin%>\\n'+
'[b]<%=GRCRTtpl.AddSize(bunt.wrapLine(25),10)%>[/b]\\n'+
'<%=GRCRTtpl.rct.tplFontEnd%>[/center]'+
'',
        units_cost : ''+
'[center]<%=GRCRTtpl.rct.tplFontBegin%>\\n'+
'<%=GRCRTtpl.Value(attacker.w.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%> [img]<%= RepConv.grcrt_cdn %>ui/wood.png[/img] <%=GRCRTtpl.Value(defender.w.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n'+
'<%=GRCRTtpl.Value(attacker.s.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%> [img]<%= RepConv.grcrt_cdn %>ui/stone.png[/img] <%=GRCRTtpl.Value(defender.s.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n'+
'<%=GRCRTtpl.Value(attacker.i.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%> [img]<%= RepConv.grcrt_cdn %>ui/iron.png[/img] <%=GRCRTtpl.Value(defender.i.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n'+
'<%=GRCRTtpl.Value(attacker.f.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%> [img]<%= RepConv.grcrt_cdn %>ui/power.png[/img] <%=GRCRTtpl.Value(defender.f.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n'+
'<%=GRCRTtpl.Value(attacker.p.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%> [img]<%= RepConv.grcrt_cdn %>ui/pop.png[/img] <%=GRCRTtpl.Value(defender.p.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>'+
'<%=GRCRTtpl.rct.tplFontEnd%>[/center]\\n'+
'',
        revoltTool : ''+
'<%=GRCRTtpl.rct.tplTableBegin + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=RepConvTool.Adds(RepConv.Const.bunt2,"img")%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%  if(GRCRTtpl.rct.outside){%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(defender.town,11)+\'\\n\'+GRCRTtpl.AddSize(rtrevolt,10)+\'\\n\', GRCRTtpl.rct.fonttag)%>'+
'<%  }else{%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(defender.town,11)+\'\\n\'+GRCRTtpl.AddSize(rtrevolt,10)+\'\\n\'+RepConvTool.addLine(200), GRCRTtpl.rct.fonttag)%>'+
'<%  }%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.Adds(RepConv.Const.unitImg+GRCRTtpl.rct.sign+"G2_32_5.png","img")%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%  if(GRCRTtpl.rct.outside){%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.cstime,10)+\'\\n\'+GRCRTtpl.AddSize(rtcstime,11)+\'\\n\', GRCRTtpl.rct.fonttag)%>'+
'<%  }else{%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.cstime,10)+\'\\n\'+GRCRTtpl.AddSize(rtcstime,11)+\'\\n\'+RepConvTool.addLine(120), GRCRTtpl.rct.fonttag)%>'+
'<%  }%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.Adds(RepConv.Const.uiImg + \'c/attack.png\',"img")%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%  if(GRCRTtpl.rct.outside){%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.attack,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+\'\\n\', GRCRTtpl.rct.fonttag)%>'+
'<%  }else{%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.attack,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+\'\\n\'+RepConvTool.addLine(40), GRCRTtpl.rct.fonttag)%>'+
'<%  }%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.Adds(RepConv.Const.uiImg + \'c/support.png\',"img")%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%  if(GRCRTtpl.rct.outside){%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.support,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+\'\\n\', GRCRTtpl.rct.fonttag)%>'+
'<%  }else{%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.support,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+\'\\n\'+RepConvTool.addLine(40), GRCRTtpl.rct.fonttag)%>'+
'<%  }%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%  if(GRCRTtpl.rct.outside){%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.online,10)+\'\\n[b]\'+GRCRTtpl.AddSize(rtonline,11)+\'[/b]\'+\'\\n\', GRCRTtpl.rct.fonttag)%>'+
'<%  }else{%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.online,10)+\'\\n[b]\'+GRCRTtpl.AddSize(rtonline,11)+\'[/b]\'+\'\\n\'+RepConvTool.addLine(98), GRCRTtpl.rct.fonttag)%>'+
'<%  }%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + GRCRTtpl.rct.tplTableEnd%>'+
'<%=GRCRTtpl.rct.tplTableBegin + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=RepConvTool.AddFont(RepConvTool.Adds(RepConv.Const.unitImg+GRCRTtpl.rct.sign+rtimg+"_45_7.png","img")+" "+'+
    'RepConvTool.Adds(RepConv.Const.uiImg+"5/"+rtgodid+".png","img")+'+
    'GRCRTtpl.AddSize((rtgod||\'\').replace(/\\./g,GRCRTtpl.rct.tplBlank),15)+\'\\n\'+'+
    'RepConvTool.addLine(698), GRCRTtpl.rct.fonttag)%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + GRCRTtpl.rct.tplTableEnd%>'+
'',
        supUnit : ''+
'<%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%>'+
'<%for(idx in attacker.splits){%>'+
'<%=attacker.splits[idx].img_url %>\\n'+
'<%}%>'+
'<%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>'+
'',
        powerDet : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(\'[b]\'+powerinfo.name.wrapLine(26)+\'[/b]\\n\\n\'+powerinfo.description.wrapLine(31),11)+\'\\n\'+RepConvTool.addLine(245), GRCRTtpl.rct.fonttag)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=GRCRTtpl.rct.tplFontBegin%>'+
'[center]<%=RepConvTool.Adds(RepConv.Const.uiImg + \'8/\' + powerinfo.id + \'.png\',"img") %>[/center]\\n'+
'<%=RepConvTool.addLine(190)%>'+
'<%=GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%>'+
'<%if (efekt.detail != null){%>'+
'[b]<%=efekt.detail.wrapLine(25)%>[/b]\\n'+
'<%}%>'+
'<%if (type == 1){%>'+
'<%}else if (type == 2){%>'+
'<%  for(idx in resources.splits){%>'+
'<%=resources.splits[idx].img_url %>\\n'+
'<%  }%>'+
'<%}else if (type == 3){%>'+
'<%=resources.img_url%>\\n'+
'<%}else if (type == 4){%>'+
'<%}else if (type == 5){%>'+
'<%=resources.img_url%>\\n'+
'<%}%>'+
'<%=RepConvTool.addLine(245)%>'+
'<%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %>'+
'',
        detail : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan3%>'+
'<%=detail%>\\n'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %>'+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan3%>'+
'<%=RepConvTool.addLine(698)%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %>'+
'',
        command : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan3%>'+
'<%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%>'+
'<%=detail.time_title%> <%=detail.time_time%>\\n'+
'<%=attacker.units_title%>\\n'+
'<%  if (attacker.full.img_url != \'\') {%>'+
'<%=attacker.full.img_url%> <%=detail.power_img%>\\n'+
'<%  }else{%>'+
'<%=RepConvTool.GetLabel(\'NOTUNIT\')%>\\n'+
'<%  }%>'+
'<%  if(resources.title!=null){%>'+
'<%=GRCRTtpl.rct.tplFontBegin%>'+
'[b]<%=GRCRTtpl.AddSize(resources.title.wrapLine(25),10)%>[/b]'+
'<%    if ((resources.img_url||\'\').length > 0){%>'+
'\\n<%=resources.img_url %>'+
'<%    }%>'+
'<%=GRCRTtpl.rct.tplFontEnd%>'+
'<%  }%>'+
'<%=RepConvTool.addLine(698)%>'+
'<%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %>'+
'',
        spyUnit : ''+
'<%if (defender.title != null){%>'+
'[b]<%=defender.title%>[/b]\\n'+
'<%      for(idx in defender.splits){%>'+
'<%=defender.splits[idx].img_url %>\\n'+
'<%      }%>'+
'<%}%>'+
'',
        spyBuild : ''+
'<%if (build.title != null){%>'+
'[b]<%=build.title%>[/b]\\n'+
'<%      for(idx in build.splits){%>'+
'<%=build.splits[idx].img_url %>\\n'+
'<%      }%>'+
'<%}%>'+
'',
        spyIron : ''+
'[b]<%=iron.title%>[/b]\\n'+
'<%if(iron.count!=""){%>'+
'<%=RepConvTool.Adds(RepConv.Const.uiImg + "5/coins.png", "img")%> [b]<%=GRCRTtpl.AddSize(iron.count,12)%>[/b]\\n'+
'<%}%>'+
'',
        spyResource : ''+
'<%if (resources.title != ""){%>'+
'\\n\\n[b]<%=resources.title%>[/b]\\n'+
'<%=resources.img_url%>\\n'+
'<%}%>'+
'',
        spyGod : ''+
'<%if (god.title != ""){%>'+
'\\n\\n[b]<%=god.title%>[/b]\\n'+
'<%=god.img_url%>\\n'+
'<%}%>'+
'',
        agoraLine : ''+
'<%for(ind in linia){%>'+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9%>'+
'<%=linia[ind].title%>\\n'+
'<%=RepConvTool.addLine(698)%>\\n'+
'<%=linia[ind].img_url%>'+
'<%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
_spliter+
'<%}%>'+
'',
        academy : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + GRCRTtpl.rct.tplFontBegin%>'+
'<%for(ind in linia){%>'+
'<%=RepConvTool.Adds((GRCRTtpl.rct.tplGenImg).RCFormat(GRCRTtpl.rct.sign, linia[ind].unit_list), "img")%>\\n'+
'<%}%>'+
'<%=RepConvTool.addLine(698)%>\\n'+
'[b]<%=GRCRTtpl.AddSize(points,9)%>[/b]'+
'<%=GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'',
        ownTropsInTheCity : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + GRCRTtpl.rct.tplFontBegin%>'+
'<%=RepConvTool.addLine(698)%>\\n'+
'<%=defender.full.img_url %>\\n'+
'<%=GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'',
        ownTropsInOlympus : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan2 + GRCRTtpl.rct.tplFontBegin%>'+
'<%=RepConvTool.addLine(698)%>\\n'+
'<%=defender.full.img_url %>\\n'+
'<% if ( addInfo != "" ) { %>'+
'<%=addInfo %>\\n'+
'<% } %>\\n'+
'<%=GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'',
        wallDet : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin %>'+
'[b]<%=GRCRTtpl.AddSize(title,12)%>[/b]\\n'+
'<%=RepConvTool.addLine(340)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.addLine(25)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.addLine(340)%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=  GRCRTtpl.AddSize(defeated.title,12) + GRCRTtpl.rct.tplColSep + GRCRTtpl.rct.tplColSep + GRCRTtpl.AddSize(losses.title,12)%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'<%  if(defeated.titleAttacker != "" || losses.titleAttacker != ""){%>'+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=  GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %>'+
'<%    if(defeated.titleAttacker != ""){%>'+
'[b]<%=defeated.titleAttacker%>[/b]\\n'+
'<%      for(ind = 0; ind < Math.max(Object.size(defeated.attacker), Object.size(losses.attacker)); ind++){%>'+
'<%        if(defeated.attacker[ind] != undefined){%>'+
'<%=  defeated.attacker[ind].img_url%>\\n'+
'<%        } else {%>'+
'<%=  emptyline%>'+
'<%        }%>'+
'<%      }%>'+
'<%    }%>'+
'<%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %>'+
'<%    if(losses.titleAttacker != ""){%>'+
'[b]<%=losses.titleAttacker%>[/b]\\n'+
'<%      for(ind = 0; ind < Math.max(Object.size(defeated.attacker), Object.size(losses.attacker)); ind++){%>'+
'<%        if(losses.attacker[ind] != undefined){%>'+
'<%=  losses.attacker[ind].img_url%>\\n'+
'<%        } else {%>'+
'<%=  emptyline%>'+
'<%        }%>'+
'<%      }%>'+
'<%    }%>'+
'<%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'<%  }%>'+
'<%  if(defeated.titleDefender != "" || losses.titleDefender != ""){%>'+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %>'+
'<%    if(defeated.titleDefender != ""){%>'+
'[b]<%=defeated.titleDefender%>[/b]\\n'+
'<%      for(ind = 0; ind < Math.max(Object.size(defeated.defender), Object.size(losses.defender)); ind++){%>'+
'<%        if(defeated.defender[ind] != undefined){%>'+
'<%=  defeated.defender[ind].img_url%>\\n'+
'<%        } else {%>'+
'<%=  emptyline%>'+
'<%        }%>'+
'<%      }%>'+
'<%    }%>'+
'<%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %>'+
'<%    if(losses.titleDefender != ""){%>'+
'[b]<%=losses.titleDefender%>[/b]\\n'+
'<%      for(ind = 0; ind < Math.max(Object.size(defeated.defender), Object.size(losses.defender)); ind++){%>'+
'<%        if(losses.defender[ind] != undefined){%>'+
'<%=  losses.defender[ind].img_url%>\\n'+
'<%        } else {%>'+
'<%=  emptyline%>'+
'<%        }%>'+
'<%      }%>'+
'<%    }%>'+
'<%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'<%  }%>'+
'',
        conquestTroopsHead : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=RepConvTool.addLine(32)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=GRCRTtpl.rct.tplFontBegin %>'+
'[b]<%=GRCRTtpl.AddSize(command.title,10)%>[/b]'+_site2site+'\\n'+
'<%=RepConvTool.addLine(304)%>'+
'<%=GRCRTtpl.rct.tplFontEnd %>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.addLine(32)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.addLine(304)%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'',
        conquestTroops : ''+
'<%for(xx = 0; xx < Object.size(linia); xx+=2){%>'+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%>'+
'<%=linia[xx].img%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(\'(\'+linia[xx].time+\')\\n\'+linia[xx].text,8), GRCRTtpl.rct.fonttag)%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%  if(Object.size(linia[xx+1])>0){%>'+
'<%=linia[xx+1].img%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%=RepConvTool.AddFont(GRCRTtpl.AddSize(\'(\'+linia[xx+1].time+\')\\n\'+linia[xx+1].text,8), GRCRTtpl.rct.fonttag)%>'+
'<%  } else {%>'+
'<%=GRCRTtpl.rct.tplColSep%>'+
'<%  }%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
_spliter+
'<%}%>'+
'',
        conquerold : ''+
'<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan4%>'+
'<%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %>'+
'[b]<%=title%>[/b]\\n'+
'<%=defender.town%> <%=time%>\\n'+
'<%=attacker.units_title%>\\n'+
'<%=attacker.full.img_url%>\\n'+
'<%=RepConvTool.addLine(698)%>'+
'<%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%>'+
'<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>'+
'',
        bbcode_ipa : ''+
'<%=GRCRTtpl.AddSize(header,9)%>'+_site2site+'\\n'+
'<%=GRCRTtpl.rct.tplTableBegin%>'+
_spliter+
'<%for(ind in linia){%>'+
'<%=GRCRTtpl.rct.tplRowBegin%><%=GRCRTtpl.rct.tplColBegin%><%=ind%>.<%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col1%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col2%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col3%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col4%><%=GRCRTtpl.rct.tplColEnd%><%=GRCRTtpl.rct.tplRowEnd%>'+
_spliter+
'<%}%>'+
'<%=GRCRTtpl.rct.tplTableEnd%>'+
'',

    }
    
    this.reportText = function(pReportType, pReport) {
//        if (RepConv.Debug) console.log(RepConvTool.getCaller(arguments.callee.toString()));
        var result, printFooter = true;

        result = templ.txt.head +
                templ.txt.duble;
        switch (pReportType) {
            case "command" 		:
                result +=
                    templ.txt.command;
                break;
            case "conquer" 		:
            case "illusion" 		:
                result +=
                    templ.txt.attacker +
                    templ.txt.single +
                    templ.txt.defender +
                    templ.txt.single +
                    templ.txt.detail;
                break;
            case "raise" 		:
            case "breach" 		:
            case "attack" 		:
            case "take_over" 	:
                result +=
                    templ.txt.attacker +
                    templ.txt.attUnit +
                    templ.txt.single +
                    templ.txt.defender +
                    templ.txt.defUnit +
                    templ.txt.resource +
                    ((pReport.bunt != "") ? templ.txt.bunt : '')+
                    templ.txt.single +
                    ((pReport.showCost) ? templ.txt.units_cost : '');
                break;
            case "conqueroldtroops" :
                result =
                    templ.txt.conquestTroopsHead +
                    ((Object.size(pReport.linia)>0) ?
                        _spliter +
                        templ.txt.conquestTroops
                    : '' )
                    ;
                break;
            case "commandList" 	:
                result +=
                    _spliter+
                    templ.txt.commandLine;
                break;
            case "conquerold"	:
                result =
                    templ.txt.conquerold;
                break;
            case "support" 	:
                result +=
                    templ.txt.attacker +
                    templ.txt.defender +
                    templ.txt.single +
                    templ.txt.supUnit;
                break;
            case "attackSupport":
                result +=
                    templ.txt.attacker +
                    templ.txt.single +
                    templ.txt.defender +
                    templ.txt.defUnit +
                    templ.txt.single +
                    ((pReport.showCost) ? templ.txt.units_cost : '');
                break;
            case "agoraD" 	:
            case "agoraS" 	:
                result +=
                    _spliter +
                    templ.txt.agoraLine;
                break;
            case "espionage" 	:
                result +=
                    templ.txt.attacker +
                    templ.txt.single +
                    templ.txt.defender +
                    templ.txt.spyUnit +
                    templ.txt.spyBuild +
                    templ.txt.spyIron +
                    templ.txt.spyResource +
                    templ.txt.spyGod;
                break;
            case "powers"	:
                result +=
                    templ.txt.attacker +
                    templ.txt.single +
                    templ.txt.defender +
                    templ.txt.powerDet;
                break;
            case "wall"		:
                result =
                    templ.txt.wallHead +
                    templ.txt.duble +
                    templ.txt.wallDet;
                break;
            case "found"	:
                result +=
                    templ.txt.attacker +
                    templ.txt.defender +
                    templ.txt.single +
                    templ.txt.detail;
                break;
            case "conquest"	:
                result =
                    templ.txt.conquest +
                    templ.txt.conquestTroopsHead +
                    ((Object.size(pReport.linia)>0) ?
                        _spliter +
                        templ.txt.conquestTroops
                    : '' )
                    ;
                break;
            case "academy"	:
                result +=
                    templ.txt.academy;
                break;
            case "ownTropsInTheCity" :
                result +=
                    templ.txt.ownTropsInTheCity;
                break;
            case "bbcode_island" :
            case "bbcode_player" :
            case "bbcode_alliance" :
                result = templ.txt.bbcode_ipa;
                printFooter = false;
                break;
            case "olympus_temple_info" :
                result =
                    templ.txt.olympus +
                    templ.txt.ownTropsInOlympus +
                    templ.txt.conquestTroopsHead +
                    ((Object.size(pReport.linia)>0) ?
                        _spliter +
                        templ.txt.conquestTroops
                    : '' )
                  ;
                break;
        }
        result += (printFooter) ?
            templ.txt.duble +
            templ.txt.foot
            : '';
		
        result = RepConvTool.Adds(RepConvTool.AddFont(result, GRCRTtpl.rct.fonttag), GRCRTtpl.rct.tag);
        result = (((pReport.showRT || false) && pReport.rtrevolt != '') ? templ.txt.revoltTool:"") + result;
        return tmpl(result, pReport)
    }

    this.reportHtml = function(pReportType, pReport) {
//        if (RepConv.Debug) console.log(RepConvTool.getCaller(arguments.callee.toString()));
        var
            result = '',
            __rowRes = 0;

        result = templ.tbl.title;
        switch (pReportType) {
            case "command" 		:
                result +=
                    GRCRTtpl.rct.tplTableBegin +
                        templ.tbl.t3col +
                        templ.tbl.head_players +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                        templ.tbl.foot +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) +
                        templ.tbl.command +
                    GRCRTtpl.rct.tplTableEnd;
                break;
            case "take_over" 	:
                result =
                    (((pReport.showRT || false) && pReport.rtrevolt != '') ? templ.tbl.revoltTool : '') +
                    result;
            case "raise" 		:
            case "breach" 		:
            case "attack" 		:
                result +=
                    GRCRTtpl.rct.tplTableBegin +
                        templ.tbl.t3col +
                        templ.tbl.head_players +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                        templ.tbl.foot +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) +
                        GRCRTtpl.rct.tplRowBegin +
                        GRCRTtpl.rct.tplColBegin +
                        templ.tbl.attacker_adds +
                        templ.tbl.attacker_units +
                        GRCRTtpl.rct.tplColSep +
                        templ.tbl.resources +
                        ((pReport.bunt != "") ? templ.tbl.revolt : '')+
                        ((pReport.showCost) ? templ.tbl.units_cost : '') +
                        GRCRTtpl.rct.tplColSep +
                        templ.tbl.defender_adds +
                        templ.tbl.defender_units +
                        GRCRTtpl.rct.tplColEnd +
                        GRCRTtpl.rct.tplRowEnd +
                        templ.tbl.t3col +
                    GRCRTtpl.rct.tplTableEnd;
                break;
            case "conqueroldtroops" :
                result =
                    GRCRTtpl.rct.tplTableBegin +
                        templ.tbl.conquestTroopsHead+
                        ((Object.size(pReport.linia)>0) ?
                        _spliter+
                        templ.tbl.conquestTroops
                        : '' )+
                        //_spliter+
                        //templ.tbl.conquestTroops +
                    GRCRTtpl.rct.tplTableEnd +
                    templ.tbl.foot;
                break;
            case "commandList" 	:
                result +=
                    GRCRTtpl.rct.tplTableBegin +
                        _spliter+
                        templ.tbl.commandLine +
                    GRCRTtpl.rct.tplTableEnd +
                    templ.tbl.foot;
                break;
            case "conquerold"	:
                result =
                    GRCRTtpl.rct.tplTableBegin +
                        templ.tbl.conquerold +
                    GRCRTtpl.rct.tplTableEnd +
                    templ.tbl.foot;
                break;
            case "support" 	:
                result +=
                    GRCRTtpl.rct.tplTableBegin +
                        templ.tbl.t3col +
                        templ.tbl.head_players +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                        templ.tbl.foot +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) +
                        GRCRTtpl.rct.tplRowBegin +
                            GRCRTtpl.rct.tplColSpan3 +
                            templ.tbl.supUnit +
                            GRCRTtpl.rct.tplColEnd +
                        GRCRTtpl.rct.tplRowEnd +
                        templ.tbl.t3col +
                    GRCRTtpl.rct.tplTableEnd;
                break;
            case "attackSupport":
                result +=
                    GRCRTtpl.rct.tplTableBegin +
                    templ.tbl.t3col +
                    templ.tbl.head_players +
                    ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                    templ.tbl.foot +
                    ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) +
                    GRCRTtpl.rct.tplRowBegin +
                        GRCRTtpl.rct.tplColBegin +
                        GRCRTtpl.rct.tplColSep +
                        ((pReport.showCost) ? templ.tbl.units_cost : '') +
                        GRCRTtpl.rct.tplColSep +
                        templ.tbl.defender_units +
                        GRCRTtpl.rct.tplColEnd +
                    GRCRTtpl.rct.tplRowEnd +
                    templ.tbl.t3col +
                    GRCRTtpl.rct.tplTableEnd;
                break;
            case "agoraD" 	:
            case "agoraS" 	:
                result +=
                    GRCRTtpl.rct.tplTableBegin +
                    _spliter +
                    templ.tbl.agoraLine +
                    ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                    templ.tbl.foot +
                    ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd + GRCRTtpl.rct.tplTableEnd : '');
                break;
            case "espionage" 		:
                result +=
                    GRCRTtpl.rct.tplTableBegin +
                        templ.tbl.t3col +
                        templ.tbl.head_players +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                        templ.tbl.foot +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) +
                        GRCRTtpl.rct.tplRowBegin +
                            GRCRTtpl.rct.tplColSpan2 +
                            GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9 +
                                templ.tbl.spyUnit +
                                templ.tbl.spyBuild +
                            GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd +
                            GRCRTtpl.rct.tplColSep +
                            GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9 +
                                templ.tbl.spyIron +
                                templ.tbl.spyResource +
                                templ.tbl.spyGod +
                            GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd +
                            GRCRTtpl.rct.tplColEnd +
                        GRCRTtpl.rct.tplRowEnd +
                        templ.tbl.t2col +
                    GRCRTtpl.rct.tplTableEnd;
                break;
            case "powers"			:
                result +=
                    GRCRTtpl.rct.tplTableBegin +
                        templ.tbl.t3col +
                        templ.tbl.head_players +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                        templ.tbl.foot +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) +
                        templ.tbl.powerDet +
                    GRCRTtpl.rct.tplTableEnd;
                break;
            case "wall"			:
                result =
                    this.rct.tplTableBegin +
                    templ.tbl.wallDet +
                    this.rct.tplTableEnd +
                    templ.tbl.foot;
                break;
            case "conquer" 		:
            case "illusion" 	:
            case "found"		:
                result +=
                    GRCRTtpl.rct.tplTableBegin +
                        templ.tbl.t3col +
                        templ.tbl.head_players +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                            templ.tbl.foot +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) +
                        templ.tbl.detail +
                    GRCRTtpl.rct.tplTableEnd;
                break;
            case "conquest"	    :
                result =
                    GRCRTtpl.rct.tplTableBegin +
                        templ.tbl.conquest +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplRowBegin+GRCRTtpl.rct.tplColSpan4 : GRCRTtpl.rct.tplTableEnd) +
                        templ.tbl.foot +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) +
                        templ.tbl.conquestTroopsHead+
                        ((Object.size(pReport.linia)>0) ?
                        _spliter+
                        templ.tbl.conquestTroops
                        : '' )+
                    GRCRTtpl.rct.tplTableEnd;
                break;
            case "academy"	:
                result +=
                    GRCRTtpl.rct.tplTableBegin +
                        templ.tbl.academy +
                        ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                        templ.tbl.foot +
                    ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd+GRCRTtpl.rct.tplTableEnd : '');
                break;
            case "ownTropsInTheCity" :
                result +=
                    GRCRTtpl.rct.tplTableBegin +
                    templ.tbl.ownTropsInTheCity +
                    ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                    templ.tbl.foot +
                    ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd+GRCRTtpl.rct.tplTableEnd : '');
                break;
            case "bbcode_island" :
            case "bbcode_player" :
            case "bbcode_alliance" :
                result = templ.tbl.bbcode_ipa;
                break;
            case "olympus_temple_info" :
                result =
                    GRCRTtpl.rct.tplTableBegin +
                    templ.tbl.olympus + 
                    ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                    templ.tbl.foot +
                    ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) +
                    GRCRTtpl.rct.tplRowBegin +
                    templ.tbl.ownTropsInOlympus +
                    GRCRTtpl.rct.tplRowEnd +
                    ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) +
                    ((GRCRTtpl.rct.outside) ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) +
                        templ.tbl.conquestTroopsHead+
                        ((Object.size(pReport.linia)>0) ?
                        _spliter+
                        templ.tbl.conquestTroops
                        : '' )+
                    GRCRTtpl.rct.tplTableEnd;
                break;

        }
        return tmpl(RepConvTool.Adds(result, GRCRTtpl.rct.tag), pReport);
    }

    this.report = function(pType, pReportType, pReport) {
        var result;
        if (pType == 'txt') {
            result = this.reportText(pReportType, pReport);
        } else {
            result = this.reportHtml(pReportType, pReport);
        }
        if (RepConv.Debug) console.log(result);
        var
            _table = result.split(_spliter),
            _head = _table[0],
            _footer = _table[_table.length-1],
            _result = {'splits':[],'single':[]},
            _tmp = _head;
            
        for ( var idx = 1; idx < _table.length-1; idx++){
            if (
                ((_tmp + _table[idx] + _footer).match(/\[/g) || []).length >= this.rct.tagLimit
                ||
                (_tmp + _table[idx] + _footer).length >= this.rct.charLimit
               ) {
                _result.splits.push(_tmp + _footer),
                _tmp = _head;
            }
            _tmp += _table[idx];
        }
        if (_tmp != _head) {
            _result.splits.push(_tmp + _footer)
        }
        if (_table.length == 1) {
            _result.splits.push(result.replace(' (##/##)',''))
        }
        $.each(_result.splits, function(ind,page){
            _result.splits[ind]=page.replace('##/##', (ind+1)+'/'+Object.size(_result.splits));
        });
        _result.single=result.replace(' (##/##)','').split(_spliter).join('');
        // _result.single[0] = _result.single[0].replace(' (##/##)','');
        if (RepConv.Debug) console.log(_result);
        return _result;//result.split(_spliter);
    }
    
    this.AddSize = function(value, size) {
        if (value && value.length > 0 && this.rcts.A == this.rct)
            return "[size=" + size + "]" + value + "[/size]";
        return value;
    }

    this.White = function(value, length) {
	return (this.rct.blank).slice(1, length - value.length);
    }
    this.Color = function(value, color) {
        return "[color=#" + color + "]" + value + "[/color]";
    }
    this.Unit = function(value, color) {
        if (RepConv.Debug) console.log(value);
        return this.White(value, this.rct.unitDigits) + value;
    }
    this.Value = function(value, len) {
        return this.White(String(value), len) + String(value);
    }

    function tmpl(str, data){
        RepConv._tmpl={'str':str,'data':data};
        var pattern = /((^|%>)[^\t]*)'/g; //weird mcafee heuristics
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(str) :
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +
                // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +
                // Convert the template into pure JavaScript
                str.replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(pattern, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'")
                + "');}return p.join('');");
        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    }

    this.tmpl = function(str, data){
        return tmpl(str, data);
    }
    
    
    // style dla modułu
    $('head')
        .append(
            $('<style/>')
                .append(
                    '.grcrt_frame .checkbox_new {display: block;}'
                )
                //.append(
                //    '#RepConvDivPrev img[src*="_img_cache_"] {'+
                //    'min-width: 16px;'+
                //    'min-height: 16px;'+
                //    'background: url('+RepConv.grcrt_domain+'ui/idle_loader2.gif) no-repeat;'+
                //    '}'
                //)
        )
    // obsługa nowych okien
    RepConv.initArray.push('GRCRTtpl.init()');
    RepConv.wndArray.push('grcrt_convert');
    this.init = function(){
        "use strict";
        new _grcrtWindowConvert();
    }
    // -- okienko
    function _grcrtWindowConvert(){
          "use strict";
          var _IdS = 'grcrt_convert';
          var _grcrtWinIds = require("game/windows/ids");
          _grcrtWinIds[_IdS.toUpperCase()] = _IdS,
          function() {
              "use strict";
              var a = window.GameControllers.TabController,
                  b = window.GameModels.Progressable,
                  c = a.extend({
                      render: function() {
                          var
                              _wnd = this.getWindowModel(),
                              _$el = this.$el,
                              _content = $('<div/>').css({'margin':'10px'});
                          this.$el.html(_content)
                          _wnd.hideLoading();
                          if (!(_wnd.getJQElement)) {
                              _wnd.getJQElement = function() {
                                  return _content;
                              }
                          }
                          if (!(_wnd.appendContent)) {
                              _wnd.appendContent = function(a) {
                                  return _content.append(a);
                              }
                          }
                      }
                  });
              window.GameViews['GrcRTView_'+_IdS] = c
              //window.GameViews.RrcRTViewConverter = c
          }(),
          function(){//a, b, c, d) {
              "use strict";
              var a = window.GameViews,
                  b = window.GameCollections,
                  c = window.GameModels,
                  d = window.WindowFactorySettings,
                  e = require("game/windows/ids"),
                  f = require("game/windows/tabs"),
                  g = e[_IdS.toUpperCase()];
              d[g] = function(b) {
                  b = b || {};
                  return us.extend({
                      window_type: g,
                      minheight: 575,
                      maxheight: 595,
                      width: 870,
                      tabs: [{
                          type: f.INDEX,
                          title: 'none',
                          content_view_constructor: a['GrcRTView_'+_IdS],//.RrcRTViewConverter,
                          hidden: !0
                      }],
                      max_instances: 1,
                      activepagenr: 0,
                      minimizable: !1,
                      resizable: !1,
                      title: RepConv.grcrt_window_icon + RepConv.Scripts_name
                  }, b)
              }
          }()
      }

}
