/* Every surface has a job. Moving columns remain rooted below the viewport. */
(function(root){
  'use strict';
  const levels=[];
  const f=(x,y,w,id)=>[x,y,w,900-y,id];
  const c=(x,y,w)=>[x,0,w,y];
  const z=(x,y=100,w=50,h=430)=>({zone:[x,y,w,h]});
  const s=signal=>({signal});
  const h=(x,y,w=27,when=null,more={})=>({x,y,w,when,...more});
  const m=(id,when,path,delay=0)=>({id,when,path,delay,ease:true});
  const p=(id,x,y,to)=>({id,x,y,to});
  const k=(id,x,y,more={})=>({id,x,y:y-8,...more});
  function r(name,story,spawn,goal,blocks,spikes=[],motions=[],portals=[],buttons=[],more={}){
    const number=levels.length+1;
    levels.push({number,name,story,group:number<15?0:number<30?1:number<40?2:3,
      spawn,exit:[goal[0]-11,goal[1]-64],blocks:[[0,0,32,900],[928,0,32,900],c(32,96,896),...blocks],
      spikes,motions,portals,buttons,...more});
  }
  r('VERTRAUEN AUF PROBE','Erster Zahn ehrlich, Landung dahinter falsch.',[80,440],[858,440],
    [f(32,440,896)],[h(330,440),h(460,440,27,z(350),{delay:.22})]);
  r('ZU FRÜH GEFEIERT','Oben starten: Die erste Landung, nicht die Tür, ist gefährlich.',[82,280],[852,450],
    [f(32,280,250),f(282,450,646)],[h(345,450,36,z(248)),h(660,450)]);
  r('EIN SCHRITT ZURÜCK','Rückwärtsroute: Der Zahn wächst hinter dem Absprung.',[845,420],[75,420],
    [f(32,420,410),f(505,420,423)],[h(570,420,36,z(635))]);
  r('UNTER DER STIRN','Die niedrige Decke bestraft den großen Reflexsprung.',[80,430],[850,430],
    [f(32,430,896),c(320,385,200)],[h(365,430,27,z(295))]);
  r('DER ABSATZ LÜGT','Drei notwendige Stufen, die mittlere duldet keine Rast.',[85,465],[850,365],
    [f(32,465,300),f(332,415,260),f(592,365,336)],[h(470,415,36,z(420,390,85,26),{delay:.3})]);
  r('MITTEN IM VERDACHT','Start in der Mitte: Rechts ein Köder, links das Ziel.',[480,400],[80,450],
    [f(32,450,330),f(362,400,250),f(612,450,316)],[h(635,450),h(290,450,27,z(350))]);
  r('DIE PAUSE','Die unüberspringbare Barriere zieht sich nach kurzem Warten zurück.',[82,430],[850,430],
    [f(32,430,896),c(350,400,170)],[h(390,430,72,z(295),{initial:true,vanish:true,delay:.6})]);
  r('LAND NICHT GERADEAUS','Vom rechten Turm fallen, die direkte Landung vermeiden.',[842,270],[70,460],
    [f(32,460,666),f(698,270,230)],[h(630,460,54),h(240,460,27,z(300))]);
  r('DER ZWEITE RAND','Zwei Lücken: Erst die zweite Landekante wird scharf.',[74,420],[857,420],
    [f(32,420,255),f(350,420,240),f(653,420,275)],[h(677,420,36,z(550))]);
  r('BLEIB UNTEN','Die Mulde schützt. Ein unnötiger Sprung trifft die Decke.',[85,380],[850,380],
    [f(32,380,280),f(312,420,330),f(642,380,286),c(350,365,245)],
    [h(430,365,45,z(330),{dir:'down'})]);
  r('ZU LANG GEWARTET','Nach dem tiefen Fall wird der Rastplatz erst verzögert scharf.',[85,310],[850,450],
    [f(32,310,280),f(312,450,616)],[h(375,450,81,z(325,425,140,26),{delay:.5})]);
  r('EHRLICHE TREPPE','Links hinauf: Der sichtbare Zahn ist die einzige Gemeinheit.',[840,465],[80,365],
    [f(32,365,330),f(362,415,250),f(612,465,316)],[h(450,415,36)]);
  r('WANDNAH','Eng an der Startwand hinabfallen aktiviert seitliche Zähne.',[85,260],[850,460],
    [f(32,260,270),f(302,460,626)],[h(302,320,63,z(260),{dir:'right'}),h(720,460)]);
  r('DAS GELERNTE','Ehrlicher Zahn, falsche hohe Landung, dann wirklich freier Ausgang.',[80,445],[850,395],
    [f(32,445,420),f(452,395,476)],[h(270,445),h(510,395,36,z(420),{delay:.12})]);
  r('DER BODEN ATMET','Ein Bodenstück hebt unter den Füßen zur hohen Tür.',[80,450],[850,350],
    [f(32,450,300),f(332,450,250,'lift'),f(582,350,346)],[],[m('lift',{stand:'lift'},[[0,-100,1.5]])]);
  r('ZU HILFSBEREIT','Lift hält auf Zielhöhe und fährt danach zu den Deckenzähnen.',[82,450],[850,360],
    [f(32,450,300),f(332,450,240,'lift'),f(572,360,356),c(332,210,240)],
    [h(375,210,150,null,{dir:'down'})],[m('lift',{stand:'lift'},[[0,-90,1.4],[0,-90,.9],[0,-220,1.8]])]);
  r('DIE FÄHRE LÄSST LOS','Der Sockel trägt nach rechts; das niedrige Dach streift den Fahrer ab.',[95,420],[850,420],
    [f(32,420,245,'raft'),f(630,420,298),c(660,390,100)],[],[m('raft',{stand:'raft'},[[400,0,4.5]])]);
  r('TREPPE ABWÄRTS','Der vermeintliche Aufzug senkt in den unteren Gang.',[90,290],[845,440],
    [f(32,290,270),f(302,290,220,'drop'),f(522,440,406)],[h(610,440,36,z(520))],
    [m('drop',{stand:'drop'},[[0,150,1.8]])]);
  r('WAND AUS DEM BODEN','Der Boden hebt hinter dir und nimmt den Rückzug.',[80,435],[850,435],
    [f(32,435,300),f(332,435,75,'wall'),f(407,435,521)],[h(600,435)],
    [m('wall',z(440),[[0,-110,1.2]])]);
  r('DIE ANDERE RICHTUNG','Rechts starten, auf dem Sockel nach links fahren; verzögerter Start.',[840,410],[75,410],
    [f(32,410,290),f(680,410,248,'raft')],[h(200,410)],
    [m('raft',{stand:'raft'},[[-385,0,4.2]],.7)]);
  r('KEINE ZWEITE FAHRT','Nach dem Verlassen sinkt die hohe Startverbindung.',[84,325],[850,420],
    [f(32,325,240),f(272,325,210,'drop'),f(482,420,446)],[h(560,420,36,z(445))],
    [m('drop',z(495),[[0,155,1.3]])]);
  r('DAS FALSCHE STOCKWERK','Mittig starten: Lift zur linken Tür, Zahn am rechten Köder.',[455,455],[80,355],
    [f(32,355,320),f(352,455,245,'lift'),f(597,455,331)],[h(670,455)],
    [m('lift',{stand:'lift'},[[0,-100,1.7]])]);
  r('DIE BRÜCKE KOMMT','Eine rettende Säule taucht vollständig aus dem Schacht auf.',[82,390],[850,390],
    [f(32,390,290),f(322,550,310,'bridge'),f(632,390,296)],[],[m('bridge',z(255),[[0,-160,1.4]])]);
  r('DIE BRÜCKE GEHT','Die Bodenverbindung sinkt. Früh genug springen statt hinterherlaufen.',[82,410],[850,410],
    [f(32,410,325),f(357,410,100,'drop'),f(457,410,471)],[],[m('drop',z(295),[[0,170,1.2]],.2)]);
  r('HALTESTELLE','Fähre hält an der Kante und nimmt Wartende wieder zurück.',[80,430],[850,430],
    [f(32,430,265,'raft'),f(620,430,308)],[],[m('raft',{stand:'raft'},[[350,0,3.5],[350,0,.8],[0,0,3.5]])]);
  r('TREPPENWECHSEL','Zwei Bodenstufen heben sich zeitversetzt zur hohen Tür.',[82,460],[850,360],
    [f(32,460,250),f(282,460,220,'one'),f(502,460,200,'two'),f(702,360,226)],[],
    [m('one',z(230),[[0,-50,1]]),m('two',s('motion:one'),[[0,-100,1.5]],.65)]);
  r('NICHT AM RAND','Der rechte hohe Start sinkt. Ein Zahn wartet an der unteren Kante.',[840,280],[80,455],
    [f(32,455,625),f(657,280,271,'drop')],[h(600,455,36)],
    [m('drop',{stand:'drop'},[[0,175,2]])]);
  r('DIE TÜR SINKT','Der Zielkolben senkt die sichtbare Tür in den unteren Gang.',[80,330],[835,330],
    [f(32,330,340),f(372,435,300),f(672,330,256,'goal')],[],
    [m('goal',z(305),[[0,105,1.6]])],[],[],{exitOn:'goal'});
  r('ERST RETTEN DANN JAGEN','Versteckter Sockel schließt die Grube, hebt dann eine Stachelkante.',[80,410],[850,360],
    [f(32,410,280),f(312,550,290,'lift'),f(602,360,326)],
    [h(525,550,36,s('motion:lift'),{attach:'lift',delay:2.1})],
    [m('lift',z(245),[[0,-140,1.3],[0,-140,.8],[0,-190,1.2]])]);
  r('VERBINDUNG MIT UMWEG','Eine raumhohe Mauer trennt die sichtbare Tür; Portal als Umweg.',[80,430],[850,430],
    [f(32,430,896),c(450,430,45)],[],[],[p('A',320,430,'B'),p('B',630,430,'A')]);
  r('OBEN GELIEFERT','Auf hoher Terrasse ankommen. Die direkte Falllinie ist gefährlich.',[80,445],[850,445],
    [f(32,445,320),c(352,540,32),f(384,270,240),f(624,445,304)],
    [h(650,445,54)],[],[p('A',255,445,'B'),p('B',480,270,'A')]);
  r('ZURÜCK IST VORWÄRTS','Rechts unten starten, links oben ankommen und zur Tür hinabgehen.',[840,455],[80,455],
    [f(32,455,360),f(392,300,200),c(592,540,32),f(624,455,304)],
    [h(310,455,36)],[],[p('A',720,455,'B'),p('B',490,300,'A')]);
  r('DREI ADRESSEN','Drei Kammern. Das mittlere Portal muss bewusst erneut betreten werden.',[80,420],[850,420],
    [f(32,420,896),c(340,420,28),c(620,420,28)],[],[],
    [p('A',245,420,'B'),p('B',475,420,'C'),p('C',730,420,'A')]);
  r('DIE ANKUNFT HEBT','Portalboden wird zum Lift. Aussteigen, bevor er wieder sinkt.',[82,450],[850,350],
    [f(32,450,300),c(332,540,28),f(360,450,280,'lift'),f(640,350,288)],[],
    [m('lift',s('arrival:B'),[[0,-100,1.7],[0,-100,1],[0,0,1.7]])],
    [p('A',240,450,'B'),{...p('B',490,450,'A'),attach:'lift'}]);
  r('UMLEITUNG ZWEI','Mittlere Kammer: erst vom Portal weg, dann zurück; rechts wächst eine Falle.',[80,435],[850,435],
    [f(32,435,896),c(310,435,28),c(635,435,28)],
    [h(520,435,27,s('arrival:B'),{delay:.45})],[],
    [p('A',230,435,'B'),p('B',435,435,'C'),p('C',750,435,'A')]);
  r('DER FREIE AUSGANG','Das nahe Ziel verlangt erst den hohen Umweg in die linke Kammer.',[420,455],[850,455],
    [f(32,280,290),f(322,455,606),c(620,455,28)],[],[],
    [p('A',505,455,'B'),p('B',170,280,'C'),p('C',745,455,'A')]);
  r('KEIN SPRUNG NÖTIG','Das Ankunftsdach bestraft einen nervösen Sprung nach dem Transport.',[80,420],[850,420],
    [f(32,420,896),c(390,420,28),c(510,382,180)],
    [h(565,382,45,null,{dir:'down'})],[],[p('A',280,420,'B'),p('B',475,420,'A')]);
  r('ANKUNFT UNTERWEGS','Der Sockel fährt mitsamt Portal zur nächsten Seite.',[80,430],[850,430],
    [f(32,430,270),c(302,540,28),f(330,430,210,'raft'),f(730,430,198)],[],
    [m('raft',s('arrival:B'),[[220,0,3]])],
    [p('A',220,430,'B'),{...p('B',420,430,'A'),attach:'raft'}]);
  r('DIE LETZTE TELEPORTATION','Oben ankommen, links hinab; die Kante verlangt einen weiten Sprung.',[850,440],[80,440],
    [f(32,440,330),f(362,290,220),c(582,540,28),f(610,440,318)],
    [h(335,440,27)],[],[p('A',735,440,'B'),p('B',475,290,'A')]);
  r('DER KNOPF HILFT','Schalter hebt die einzige Stufe. Die Hilfe ist diesmal ehrlich.',[80,455],[850,355],
    [f(32,455,350),f(382,455,230,'lift'),f(612,355,316)],[],
    [m('lift',s('button:up'),[[0,-100,1.8]])],[],[k('up',230,455)]);
  r('KLEINE LÖSUNG','Klein durch den Tunnel, danach trotz kleiner Füße über die Lücke.',[80,430],[850,430],
    [f(32,430,640),f(705,430,223),c(340,416,245)],[],[],[],[k('small',220,430,{size:[.6,.6]})]);
  r('BREITE HILFE','Breite Füße überbrücken den Schlitz; dahinter ein ehrlicher Zahn.',[80,420],[850,420],
    [f(32,420,460),f(530,420,398)],[h(680,420)],[],[],[k('wide',260,420,{size:[1.8,1]})]);
  r('AUF KNOPFDRUCK ABWÄRTS','Oben links öffnet der Schalter eine Abfahrt zur unteren Tür.',[80,280],[850,450],
    [f(32,280,310),f(342,280,260,'drop'),f(602,450,326)],[h(680,450,27)],
    [m('drop',s('button:down'),[[0,170,2]])],[],[k('down',215,280)]);
  r('DER PREIS DER TÜR','Tür entriegeln hebt hinter dir eine Rückwegsperre.',[80,440],[850,440],
    [f(32,440,200),f(232,440,55,'wall'),f(287,440,641)],[h(610,440)],
    [m('wall',s('button:open'),[[0,-120,1.3]])],[],[k('open',395,440,{unlock:true})],{locked:true});
  r('BESTELLTE BRÜCKE','Von rechts den Knopf drücken: Die Brücke kommt aus der Tiefe.',[840,390],[80,390],
    [f(32,390,295),f(327,550,285,'bridge'),f(612,390,316)],[],
    [m('bridge',s('button:bridge'),[[0,-160,1.6]])],[],[k('bridge',765,390)]);
  r('NICHT ALLES DRÜCKEN','Der erste Knopf macht unnötig groß. Der zweite öffnet das Ziel.',[80,435],[850,435],
    [f(32,435,896),c(445,409,120)],[],[],[],
    [k('wrong',275,435,{size:[1.5,1.5]}),k('open',660,435,{unlock:true})],{locked:true});
  r('FALSCHE SICHERHEIT','Klein durch den Tunnel; der Zahn dahinter zieht sich verspätet zurück.',[840,425],[80,425],
    [f(32,425,896),c(425,411,240)],
    [h(340,425,45,s('button:small'),{initial:true,vanish:true,delay:1.4})],[],[],[k('small',760,425,{size:[.6,.6]})]);
  r('MITTELSTATION','Mittig starten, links den Knopf holen, rechts den hohen Ausgang erreichen.',[465,450],[850,350],
    [f(32,450,570),f(602,450,150,'lift'),f(752,350,176)],[],
    [m('lift',{...s('button:lift'),stand:'lift'},[[0,-100,1.5]])],[],[k('lift',155,450)]);
  r('ERST ANKOMMEN','Portal und Schalter haben getrennten Freiraum; der Schalter hebt den Zielweg.',[80,450],[850,350],
    [f(32,450,310),c(342,540,28),f(370,450,300),f(670,450,130,'lift'),f(800,350,128)],[],
    [m('lift',s('button:up'),[[0,-100,1.6]])],
    [p('A',235,450,'B'),p('B',455,450,'A')],[k('up',585,450)]);
  r('DIE LETZTE GESCHICHTE','Vom hohen Start hinab, Schalter holen, Portal zurück nach oben: letzter ehrlicher Sprung.',[80,280],[840,280],
    [f(32,280,270),f(302,450,320),c(622,540,28),f(650,280,278)],
    [h(780,280,27)],[],[p('A',520,450,'B'),p('B',705,280,'A')],[k('open',365,450,{unlock:true})],{locked:true});
  // Search hints describe necessary decisions, never change gameplay.
  const guides={17:[[510,402]],20:[[400,392]],36:[['arrival:B'],[230,260],['arrival:C']],48:[['button:lift']],50:[['button:open'],['arrival:B']]};
  for(const l of levels){l.guide=guides[l.number]||[];for(const hazard of l.spikes){hazard.baseX=hazard.x;hazard.baseY=hazard.y;}}
  const api={levels,groups:['STACHELN','BEWEGUNG','PORTALE','KNÖPFE']};
  if(typeof module!=='undefined')module.exports=api;else root.DevilLevels=api;
})(typeof globalThis!=='undefined'?globalThis:this);
