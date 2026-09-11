/* The 50 rooms are authored from LEVEL_MASTERPLAN.md. */
(function(root){'use strict';
const levels=[],f=(x,y,w,id)=>[x,y,w,900-y,id],c=(x,y,w,id)=>[x,0,w,y,id];
const z=(x,y=96,w=50,h=444)=>({zone:[x,y,w,h]}),s=signal=>({signal});
const h=(x,y,w=27,when=null,more={})=>({x,y,w,when,...more});
const m=(id,when,path,delay=0,more={})=>({id,when,path,delay,ease:true,...more});
const p=(id,x,y,targetX,targetY,more={})=>({id,x,y,targetX,targetY,...more});
const k=(id,x,y,more={})=>({id,x,y:y-8,...more});
function r(name,story,spawn,goal,blocks,spikes=[],motions=[],portals=[],buttons=[],more={}){const number=levels.length+1;levels.push({number,difficulty:1+9*(number-1)/49,name,story,group:Math.floor((number-1)/10),spawn,exit:[goal[0]-11,goal[1]-64],blocks:[[0,0,32,900],[928,0,32,900],c(32,96,896),...blocks],spikes,motions,portals,buttons,...more});}

// WELT I — spikes and expectation; fourteen unrelated silhouettes.
r('DER EHRLICHE ZAHN','Drei sichtbare Zähne erzwingen einen sauberen Sprungrhythmus.',[76,440],[866,440],[f(32,440,896)],[h(300,440),h(468,440),h(650,440)]);
r('NICHT VOR DER TÜR','Der erste Zahn wächst am Absprung; ein zweiter bewacht den langen Zielsteg.',[76,405],[866,405],[f(32,405,350),f(442,405,486)],[h(326,405,27,z(300,360,55,80),{delay:.14}),h(705,405,36)]);
r('DAS TIEFE U','Im tiefen Treppen-U folgen auf zwei versteckte Fallen noch sichtbare Zähne im Aufstieg.',[74,285],[866,285],[f(32,285,145),f(177,335,105),f(282,385,105),f(387,435,186),f(573,385,105),f(678,335,105),f(783,285,145)],[h(420,435,27,z(380,390,65,65),{delay:.12}),h(520,435,27,z(455,390,65,65),{delay:.5}),h(625,385,27)]);
r('KOPFSACHE','Im niedrigen Tunnel ist der frühe Sprung die Falle; draußen wartet der Gegentest.',[70,438],[868,438],[f(32,438,896),c(245,404,385)],[h(410,404,45,z(350,390,32,48),{dir:'down'}),h(720,438,36),h(820,438,27)]);
r('DIE INSEL','Die Insel verlangt eine präzise Landung, bevor die weite Zielkurve bestraft wird.',[70,410],[868,370],[f(32,410,215),[390,385,150,24,'island'],f(695,370,233)],[h(455,385,27),h(815,370,36,z(610,250,150,170),{delay:.1})],[],[],[],{functionalFloatIds:['island']});
r('FALSCHE RICHTUNG','Die auffällige Treppe rechts ist Köder; auch der echte Rückweg hat zwei Zähne.',[440,330],[78,455],[f(32,455,230),f(262,390,120),f(382,330,190),f(572,285,110),f(682,240,246)],[h(682,250,45,z(625,190,80,80),{dir:'left'}),h(315,390,27),h(145,455,27)]);
r('UM DEN TURM','Der Tunnel warnt früh; sichtbare Zähne sichern beide Ufer des Rückwegs.',[70,450],[870,450],[f(32,450,250),f(282,400,300),f(582,450,346),c(390,350,92)],[h(220,450,27),h(455,400,27,z(290,380,110,70),{delay:.06}),h(690,450,27)]);
r('FALLLINIE','Vom Hochturm führt eine schmale Falllinie zwischen drei versetzten Zähnen hinab.',[790,225],[78,468],[f(32,468,575),f(690,225,238)],[h(850,225,27),h(550,468,45,z(650,190,150,90)),h(300,468,36)]);
r('DREI PFEILER','Drei Pfeiler und drei unterschiedlich platzierte Zähne verlangen einen Lauf ohne Pause.',[70,435],[845,335],[f(32,435,225),f(310,385,190),f(555,335,373)],[h(180,435,27),h(430,385,27),h(590,335,27,z(525,290,90,70),{delay:.28})]);
r('THE LONG CLIMB','Four rising islands turn the last spike room into a clean eastward ascent.',[70,470],[866,305],[f(32,470,255),f(327,415,205),f(575,360,165),f(782,305,146)],[h(205,470,27),h(430,415,27,z(365,365,42,70)),h(665,360,27),h(815,305,27,z(760,255,42,70))]);
r('THE RETURN SWEEP','A collapsing upper hatch drops into a lower corridor where a wall sweeps the route home.',[70,270],[86,455],[[32,270,610,28],[642,270,80,28,'hatch'],f(722,455,206),f(32,455,610),[896,375,32,80,'sweeper']],[h(350,270,27),h(420,455,27),h(210,455,27,z(500,405,95,70))],[m('hatch',z(610,220,60,70),[[0,185,.75]]),m('sweeper',z(760,405,100,70),[[-250,0,1.5]],.15)]);
r('PISTON SHAFT','Two timed stone pistons squeeze the fall between three alternating side spikes.',[465,180],[690,468],[c(32,540,385),c(543,400,385),f(543,468,385),[350,235,32,45,'leftpiston'],[578,335,32,45,'rightpiston']],[h(417,245,54,null,{dir:'right'}),h(543,330,54,null,{dir:'left'}),h(417,410,54,null,{dir:'right'})],[m('leftpiston',{time:.25},[[105,0,.5],[105,0,.3],[0,0,.45]]),m('rightpiston',s('done:leftpiston'),[[-105,0,.5],[-105,0,.25],[0,0,.45]])]);
r('FALLING BRIDGE','Three bridge slabs collapse in a wave, leaving only a narrow moving escape window.',[80,350],[850,350],[f(32,350,210),[242,350,160,24,'bridge-a'],[402,350,160,24,'bridge-b'],[562,350,165,24,'bridge-c'],f(727,350,201)],[h(350,350,27,null,{attach:'bridge-a'}),h(535,350,27,null,{attach:'bridge-b'}),h(790,350,27)],[m('bridge-a',z(205,300,65,70),[[0,180,.75]],.65),m('bridge-b',s('motion:bridge-a'),[[0,180,.75]],1.15),m('bridge-c',s('motion:bridge-a'),[[0,180,.75]],1.65)]);
r('THE SWEEPER','A stone wall sweeps the middle terrace toward a tooth while the outer banks punish hesitation.',[70,455],[865,455],[f(32,455,260),f(340,405,270),f(680,455,248),[580,355,30,50,'sweeper']],[h(190,455),h(365,405,27),h(760,455,36)],[m('sweeper',z(420,350,80,75),[[-180,0,.78]],.08)]);

// WELT II — moving architecture.
r('THE SINKING FLOOR','The centre floor drops into the void while teeth on both banks force a committed crossing.',[70,430],[866,430],[f(32,430,355),f(387,430,150,'sink'),f(537,430,391),c(32,170,120),c(808,220,120)],[h(325,430,27),h(620,430,27)],[m('sink',{stand:'sink'},[[0,170,.9]],.18)],[],[],{deathY:540});
r('LIFT OR CEILING','A marked lift rises to the exit, but its tooth and a moving gate force an early dismount.',[84,485],[850,330],[f(32,485,150),f(182,485,150,'lift'),f(430,330,498),c(300,185,130),[400,250,30,80,'gate']],[h(282,485,27,null,{attach:'lift'}),h(560,330,27)],[m('lift',{stand:'lift'},[[0,-155,1.4],[0,-155,.6],[0,-260,1.2]]),m('gate',s('motion:lift'),[[0,-65,.72]],.25)]);
r('SPIKED FERRY','A reversing ferry carries its own tooth, then leaves one short chance to reach the guarded bank.',[78,385],[866,385],[f(32,385,210),[242,385,150,22,'ferry'],f(745,385,183)],[h(335,385,27,null,{attach:'ferry'}),h(800,385,27)],[m('ferry',{stand:'ferry'},[[330,0,2.05],[330,0,.28],[0,0,1.05]])]);
r('DIAGONAL DROP','The descending lift carries a tooth while a rising blocker opens the lower escape lane.',[720,235],[90,455],[[650,235,278,24,'downlift'],f(32,455,500),[500,375,32,80,'blocker']],[h(820,235,27,null,{attach:'downlift'}),h(210,455,27)],[m('downlift',{stand:'downlift'},[[-118,220,1.8]]),m('blocker',s('done:downlift'),[[0,-180,.45]],.08)]);
r('NO TURNING BACK','A floor wall seals the route behind you while a timed ceiling gate and two teeth demand a forward sprint.',[72,445],[850,350],[f(32,445,260),f(292,445,70,'wall'),f(362,400,280),f(642,350,286),c(362,330,280),[580,96,30,234,'gate']],[h(545,400,27),h(770,350,27)],[m('wall',z(375,370,85,100),[[0,-349,.72]],.12),m('gate',z(480,350,80,70),[[0,20,.55]],.4)]);
r('AGAINST THE CURRENT','A reversing carrier, an onboard tooth and a late pusher turn the empty crossing into a moving-wall sprint.',[78,300],[864,450],[[32,300,158,24],[232,300,260,20,'stream'],f(730,450,198),c(600,300,128),[730,410,38,40,'pusher']],[h(350,300,27,null,{attach:'stream'}),h(835,450,27)],[m('stream',{stand:'stream'},[[-42,0,1.35],[-42,0,.28],[238,150,1.35]]),m('pusher',s('done:stream'),[[55,0,.55]],.08)]);
r('ZWEI ETAGEN','Zwei Liftplatten tauschen versetzt ihre Höhen.',[74,455],[850,285],[f(32,455,230),f(262,455,170,'low'),f(520,350,165,'high'),f(685,285,243),c(255,265,220)],[],[m('low',z(205,400,70,80),[[0,-120,1.5],[0,-120,.35]]),m('high',s('motion:low'),[[-88,-65,1.35]],.45)]);
r('DIE TÜR FLIEHT','Ein fahrender Träger dockt an der Mittelinsel; danach steigen Tritt und Türinsel gemeinsam in die obere Nische.',[70,470],[850,330],[f(32,470,210),[270,470,160,22,'runner'],f(520,400,160),[700,390,90,20,'step'],f(810,330,118,'goal'),c(32,210,105),c(823,190,105)],[],[m('runner',{stand:'runner'},[[90,-70,1.35],[90,-70,.35]]),m('step',s('done:runner'),[[0,-50,.9]],.12),m('goal',s('done:runner'),[[-20,-30,1.05]],.28)],[],[],{exitOn:'goal'});
r('BRÜCKE AUF ZEIT','Die versenkten Segmente steigen als Welle; das längere offene Fenster erlaubt einen präzisen Lauf ohne Pixelperfektion.',[70,400],[866,400],[f(32,400,220),f(252,550,105,'b1'),f(357,550,105,'b2'),f(462,550,105,'b3'),f(567,550,105,'b4'),f(672,400,256)],[],[m('b1',z(195,350,70,75),[[0,-150,.55],[0,-150,.85],[0,20,.72]]),m('b2',z(195,350,70,75),[[0,-150,.55],[0,-150,.85],[0,20,.72]],.14),m('b3',z(195,350,70,75),[[0,-150,.55],[0,-150,.85],[0,20,.72]],.28),m('b4',z(195,350,70,75),[[0,-150,.55],[0,-150,.85],[0,20,.72]],.42)]);
r('DIE HELFENDE WAND','Die Platte hebt im L-Schacht und schiebt oben zur Nische.',[72,475],[805,260],[f(32,475,260,'helper'),f(680,260,248)],[],[m('helper',{stand:'helper'},[[0,-215,1.5],[355,-215,1.35]])]);
r('HALTESTELLE','Die Fähre dockt bündig an der Mittelinsel; von dort muss die weite Restlücke ohne Träger überwunden werden.',[70,410],[866,410],[f(32,410,190),[222,410,170,22,'ferry'],f(470,410,125),f(745,410,183),c(700,330,180)],[],[m('ferry',{stand:'ferry'},[[78,0,1.45]])]);
r('DOMINO-BODEN','Fünf absteigende Stufen kippen in der Reihenfolge 2–4–1–3–5.',[60,285],[850,465],[f(32,285,170,'d1'),f(202,330,170,'d2'),f(372,375,170,'d3'),f(542,420,170,'d4'),f(712,465,216,'d5')],[],[m('d2',z(160,240,65,80),[[0,150,.8]],2),m('d4',z(160,240,65,80),[[0,150,.8]],2.35),m('d1',z(160,240,65,80),[[0,150,.8]],2.7),m('d3',z(160,240,65,80),[[0,150,.8]],3.05),m('d5',z(160,240,65,80),[[0,150,.8]],3.4)]);
r('DIE ZANGE','Zwei feste Seitenwände schieben in einer Richtung auf den Zickzackturm zu.',[70,470],[735,270],[f(32,470,896),c(32,205,250,'leftjaw'),c(820,300,108,'rightjaw'),c(32,205,45),c(883,300,45),f(282,420,115),f(435,370,105),f(585,320,95),f(700,270,228)],[],[m('leftjaw',z(205,365,110,105),[[45,0,.68]],.1),m('rightjaw',s('motion:leftjaw'),[[-45,0,.65]],.12)]);
r('DER JÄGER LÜGT','Eine Verfolgerwand steigt ohne Halt diagonal über drei immer schmalere Terrassen und schiebt in die Abgründe.',[70,475],[860,275],[f(32,475,205),f(278,425,175),f(500,375,150),f(700,325,228),f(805,275,123),[32,375,38,100,'hunter']],[],[m('hunter',z(130,365,120,110),[[208,-50,1.5],[430,-100,1.5],[630,-150,1.4],[735,-200,.8]],.1)]);
r('DAS ZIMMER RUTSCHT','Im festen C-Rahmen verschiebt sich der zusammenhängende Innenkern.',[70,455],[830,310],[f(32,455,175),c(32,235,620),[207,410,325,24,'core'],f(652,360,108),f(760,310,168)],[],[m('core',z(165,360,80,90),[[120,0,1.5],[120,0,.35],[120,90,1.2]])]);

// WELT III — one-way entrances with invisible, freely positioned targets.
r('MITTELTURM','Das Querportal startet den Einsturz des rechten Ufers; das zweite Portal setzt auf einen Lift, der erst unter dem einsamen Turm hochfährt.',[70,470],[625,215],[f(32,470,200),[390,190,65,350],[455,190,90,24],[545,300,25,240],f(570,215,120),[455,470,90,22,'towerlift'],f(760,470,168,'bank')],[h(590,215,27,z(565,170,50,70)),h(795,470,27,s('arrival:cross'),{attach:'bank'})],[m('bank',s('arrival:cross'),[[0,150,.82]]),m('towerlift',s('arrival:top'),[[0,-255,2.05]],.18)],[p('cross',180,470,790,470),p('top',875,470,500,470,{attach:'bank'})]);
r('DER SENKRECHTE SCHLITZ','Ein Portal wirft in einen leeren Fallschacht; zwei starre Seitenkolben stoßen während des Falls nacheinander in entgegengesetzte Richtungen.',[430,160],[420,500],[c(32,540,350),c(578,540,350),[382,160,196,20],[382,305,98,20],[480,390,98,20],f(382,500,196),[350,245,32,52,'leftwall'],[578,345,32,37,'rightwall']],[h(525,390,27,z(510,345,42,70)),h(475,500,27,z(460,450,42,70))],[m('leftwall',s('arrival:drop'),[[92,0,.52]],.18),m('rightwall',s('motion:leftwall'),[[-92,0,.52]],.3)],[p('drop',520,160,414,305)]);
r('IMPULSINSEL','Das Portal schleudert auf eine einzelne Hochinsel; erst schiebt die Seitenwand den Absprung zusammen, danach sackt die Insel weg.',[70,460],[860,460],[f(32,460,260),[470,280,150,24,'sky'],f(730,460,198),[438,210,32,70,'skywall']],[h(560,280,27,s('arrival:impulse'),{attach:'sky'}),h(805,460,27,z(790,410,42,70))],[m('skywall',s('arrival:impulse'),[[115,0,.72]],.12),m('sky',s('done:skywall'),[[0,105,1.05]],.08)],[p('impulse',225,460,500,280,{targetVx:220})]);
r('DOPPELSTOCK','Oben nach rechts, unten ganz zurück und nach dem zweiten Portal wieder oben zur Tür; eine Rückwand jagt durch den unteren Gang.',[70,250],[850,250],[[32,250,680,24],f(260,470,668),[260,274,668,151],[896,400,32,70,'lowerwall']],[h(500,250,27,z(490,200,42,70)),h(610,470,27,z(595,425,42,65))],[m('lowerwall',s('arrival:down'),[[-470,0,2.4]],.1)],[p('down',655,250,850,470),p('back',330,470,760,250)]);
r('DAS TIEFE PORTAL-U','Im fast leeren U muss der Lift vollständig durchfahren werden; erst oben lässt sich das fahrende Portal hinter dem Zahn treffen.',[80,250],[850,250],[f(32,250,200),[410,500,140,24,'lift'],f(728,250,200),f(232,540,496)],[h(430,500,27,null,{attach:'lift'})],[m('lift',{stand:'lift'},[[0,-80,1.05],[0,-80,.45],[0,-250,1.7]])],[p('lift-entry',500,500,770,250,{attach:'lift'})]);
r('ZURÜCKGESCHICKT','Oberer Hinweg, mittlerer Gegenlauf und unterer Fluchtkorridor sind drei getrennte Akte; die Rückkehrklappe fällt und eine Wand drückt nach.',[70,250],[850,500],[[32,250,188,24],[220,250,100,24,'hatch'],[500,360,428,24],f(32,500,896),[32,430,32,46,'returnwall']],[h(410,500,27,s('arrival:return')),h(680,500,27,z(665,450,42,70))],[m('hatch',s('arrival:return'),[[0,226,.72]]),m('returnwall',s('arrival:return'),[[520,0,2.55]],.5)],[p('across',175,250,850,360),p('return',550,360,270,250)]);
r('DER SPIEGEL','Das Portal schleudert in den zweiten C-Arm; dessen schmaler Innenboden fährt vollständig sichtbar erst nach rechts und dann nach oben.',[70,445],[850,265],[f(32,445,300),c(32,265,300),c(332,540,48),[380,445,195,24,'mirrorfloor'],c(680,190,248),f(680,265,248)],[h(705,265,27,z(690,220,42,70))],[m('mirrorfloor',s('arrival:mirror'),[[105,0,1.0],[105,-180,1.45]],.18)],[p('mirror',245,445,520,445,{targetVx:180})]);
r('FALL-ZICKZACK','Jede Ankunft erzwingt die volle Breite des nächsten Absatzes, während Boden und Verfolgerwand bereits nachgeben.',[70,220],[850,460],[[32,220,280,24],c(312,380,70),[382,330,200,24,'middleledge'],c(582,400,70),f(652,460,276,'lowerledge'),[620,400,32,60,'zigwall']],[h(180,220,27),h(462,330,45,z(420,285,55,65),{attach:'middleledge'}),h(752,460,45,z(710,410,55,70),{attach:'lowerledge'})],[m('middleledge',s('arrival:middle'),[[0,155,.68]],.34),m('lowerledge',s('arrival:lower'),[[0,90,.52]],.16),m('zigwall',s('arrival:lower'),[[170,0,1.1]],.1)],[p('middle',255,220,405,330),p('lower',555,330,680,460)]);
r('BEWEGTE ADRESSE','Die lange Fähre startet beim Aufspringen; Zahn und Portal liegen am anderen Ende, sodass der Eintritt erst während der Fahrt erreichbar wird.',[70,440],[850,255],[f(32,440,190),[260,440,245,20,'ferry'],f(735,255,193)],[h(405,440,27,null,{attach:'ferry'})],[m('ferry',{stand:'ferry'},[[230,-35,1.9],[230,-185,1.1]],.12)],[p('moving',475,440,810,255,{attach:'ferry'})]);
r('DIE LETZTE ABKÜRZUNG','Zwei Portalnischen sind Köder; die tiefe Rückroute trägt zwei späte Zähne.',[800,235],[85,455],[f(32,455,260),f(350,390,150),f(520,325,170),f(735,235,193),[400,200,100,28],c(400,200,10)],[h(555,325,27,z(590,275,70,70)),h(385,390,27,z(420,340,70,70))],[],[p('high-decoy',890,235,760,235),p('low-decoy',450,200,790,235)]);

// WELT IV — buttons and consequences.
r('DER EHRLICHE KNOPF','Eine kleine Knopfempore hebt die Brücke aus einem monumentalen Schacht.',[70,285],[860,410],[[32,285,210,24],f(32,430,210),f(292,550,330,'bridge'),f(622,410,306),c(242,220,50),c(622,250,50)],[],[m('bridge',s('button:open'),[[0,-140,1.05]])],[],[k('open',150,285,{unlock:true})],{locked:true});
r('BRÜCKE GEGEN BODEN','Die Brücke wird beim Anlauf gerufen; ihr Schalter versenkt den Start und hebt erst die zweite Stufe zur Tür.',[70,480],[870,290],[f(32,480,220,'old'),f(280,550,250,'bridge'),f(560,400,150),[720,450,90,20,'step'],f(810,290,118),c(32,205,90),c(838,200,90)],[h(470,550,36,s('button:swap'),{attach:'bridge'}),h(650,400,27),h(850,290,27,s('button:swap'))],[m('bridge',z(185,420,80,90),[[0,-100,1.1]]),m('old',s('button:swap'),[[0,150,.72]],.12),m('step',s('button:swap'),[[0,-105,1.0]],.18)],[],[k('swap',365,550,{unlock:true,attach:'bridge'})],{locked:true});
r('KLEINER WEG, GROSSER SPRUNG','Klein durch 26 Pixel, normal groß über die Schlucht.',[70,430],[855,390],[f(32,430,400),c(185,404,247),f(432,440,188),f(680,390,248)],[],[],[],[k('small',115,430,{size:[.55,.55]}),k('normal',510,440,{size:[1,1]})]);
r('DER KNOPF ZIEHT UM','Der Knopf bewegt die ganze Türinsel nach unten-links; ein mitfahrender Zahn lässt nur die hintere Landekante frei.',[70,465],[770,250],[f(32,465,220),f(220,415,100),f(320,365,182),f(690,250,238,'goal')],[h(700,250,45,s('button:move'),{attach:'goal'})],[m('goal',s('button:move'),[[-155,170,1.5]])],[],[k('move',405,365,{unlock:true})],{locked:true,exitOn:'goal'});
r('DER RÜCKWEG','Oben zum Knopf, rechts fallen, unten zurück unter den Start.',[70,260],[85,455],[[32,260,735,28],f(735,455,193),f(32,455,650),c(735,390,32,'gate')],[],[m('gate',s('button:return'),[[0,-390,.75]])],[],[k('return',680,260,{unlock:true})],{locked:true});
r('ZWEI KNÖPFE, EINE LÜGE','Im Y-Raum gilt links öffnen, rechts die Platte heben.',[455,455],[468,455],[f(340,455,280),f(230,415,110),f(32,365,198),f(620,415,78),f(698,365,230),f(405,455,150,'lift')],[],[m('lift',s('button:right'),[[0,-185,1.4]])],[],[k('left',125,365,{unlock:true}),k('right',795,365)],{locked:true,exitOn:'lift'});
r('NICHT NOCH EINMAL','Der erste Größenknopf hilft; der zweite wird ausgelassen, während zwei späte Zähne die große Sprungkurve prüfen.',[70,440],[850,310],[f(32,440,568),f(600,410,110),f(710,360,90),f(800,310,128)],[h(455,440,36,z(440,390,42,70)),h(745,360,36,z(730,310,42,70))],[],[],[k('large',180,440,{size:[1.45,1.45]}),k('small',540,440,{size:[.55,.55]})]);
r('FAHRENDER SCHALTER','Der Schalter hebt die Fähre aus der unteren Kammer und schickt sie über die Stufenköpfe zum Portal; ein Zahn fährt auf dem Träger mit.',[170,285],[80,285],[f(32,450,215),[300,450,190,24,'ferry'],f(560,400,65),f(625,350,65),f(690,300,238),f(32,285,180)],[h(430,450,36,null,{attach:'ferry'})],[m('ferry',s('button:turn'),[[0,-200,1.2],[225,-200,1.8]])],[p('tower',820,300,105,285)],[k('turn',305,450,{unlock:true,attach:'ferry'})],{locked:true});
r('DIE TÜR WAR HINTER DIR','Der Knopf unten setzt drei schmale, bündige Trittsteine in die Lücken der Rücktreppe.',[70,245],[82,245],[f(32,245,190),f(250,330,150),f(430,395,150),f(610,465,318),f(580,540,30,'r1'),f(400,540,30,'r2'),f(222,540,28,'r3')],[h(520,395,27,s('button:return'),{delay:.6})],[m('r1',s('button:return'),[[0,-110,.75]],.05),m('r2',s('button:return'),[[0,-175,.75]],.3),m('r3',s('button:return'),[[0,-245,.75]],.55)],[],[k('return',780,465,{unlock:true})],{locked:true});
r('DREI GETRENNTE AKTE','Tiefe Knopfkammer, enger Vertikalschacht und hohe Türinsel sind drei getrennte Akte; Lift und Zielinsel tragen getrennte Zähne.',[70,480],[850,235],[f(32,480,230),c(262,430,52),[340,480,190,24,'lift'],c(530,430,52),f(700,235,228)],[h(470,480,36,s('button:lift'),{delay:1.1,attach:'lift'}),h(780,235,36,s('arrival:act-three'))],[m('lift',s('button:lift'),[[0,-185,1.05],[0,-185,.62]],1.2)],[p('act-three',455,480,790,235,{attach:'lift'})],[k('lift',135,480)]);
r('DER LETZTE AUFSTIEG','Vier Pflichtschalter führen über einen fahrenden Lift, zwei Portalflanken und eine fliegende Türplattform.',[70,480],[650,340],[f(32,480,238),[270,480,160,24,'lift'],[430,350,150,24],[430,374,4,166],[600,400,60,140],[700,460,228,24],[700,340,228,24],[580,340,120,24,'goal'],c(300,210,80)],[h(180,480,27,z(140,390,55,90)),h(220,480),h(380,480,27,null,{attach:'lift'}),h(445,350,27,z(405,260,55,90)),h(305,210,27,null,{dir:'down'}),h(750,460,27,z(710,370,55,90)),h(825,460),h(855,460,27,z(815,370,55,90)),h(840,340),h(780,340,27,z(805,250,55,90)),h(720,340),h(350,210,27,null,{dir:'down'})],[m('lift',{stand:'lift'},[[0,-130,1.45]],.08),m('goal',s('button:ride'),[[0,-30,.35],[120,-120,1.9]],.12)],[p('lower',545,350,730,460),p('upper',900,460,880,340)],[k('launch',110,480),k('left',480,350),k('lower',790,460),k('ride',590,340,{attach:'goal'})],{locked:true,requiredButtons:['launch','left','lower','ride'],exitOn:'goal',targetMinutes:7});

const englishCopy=[
['HONEST TEETH','Three visible spikes demand a clean jumping rhythm.'],
['NOT BY THE DOOR','The first spike rises at takeoff; another guards the long path to the door.'],
['THE DEEP U','Two hidden traps and a visible spike wait along the climb out of the deep U.'],
['HEADROOM','An early jump is the trap inside the low tunnel; another test waits outside.'],
['THE ISLAND','Land precisely on the island before the long curve toward the goal punishes haste.'],
['WRONG WAY','The obvious stairs are bait; the real route back carries two more spikes.'],
['AROUND THE TOWER','The tunnel warns early while visible spikes guard both sides of the return.'],
['DROP LINE','A narrow drop from the high tower threads between three offset spikes.'],
['THREE PILLARS','Three pillars and three differently placed spikes demand one continuous run.'],
['THE LONG CLIMB','Four rising islands turn the final spike room into a clean eastward ascent.'],
['THE RETURN SWEEP','A collapsing upper hatch drops into a lower corridor where a wall sweeps the route home.'],
['PISTON SHAFT','Two timed stone pistons squeeze the fall between three alternating side spikes.'],
['FALLING BRIDGE','Three bridge slabs collapse in a wave, leaving only a narrow moving escape window.'],
['THE SWEEPER','A stone wall sweeps the middle terrace toward a tooth while the outer banks punish hesitation.'],
['THE SINKING FLOOR','The centre floor drops into the void while teeth on both banks force a committed crossing.'],
['LIFT OR CEILING','A marked lift rises to the exit, but its tooth and a moving gate force an early dismount.'],
['SPIKED FERRY','A reversing ferry carries its own tooth, then leaves one short chance to reach the guarded bank.'],
['DIAGONAL DROP','The descending lift carries a tooth while a rising blocker opens the lower escape lane.'],
['NO TURNING BACK','A floor wall seals the route behind you while a timed ceiling gate demands a forward sprint.'],
['AGAINST THE CURRENT','A reversing carrier, an onboard tooth and a late pusher turn the crossing into a moving-wall sprint.'],
['TWO FLOORS','Two lift platforms exchange heights on staggered timings.'],
['THE DOOR ESCAPES','A moving carrier docks at the island before the step and door platform rise together.'],
['TIMED BRIDGE','Sunken segments rise in a wave with enough time for a precise, fair crossing.'],
['THE HELPFUL WALL','The platform lifts through the L-shaped shaft and pushes toward the upper alcove.'],
['LAST STOP','The ferry docks at the center island; the remaining gap must be crossed alone.'],
['DOMINO FLOOR','Five descending steps collapse in the order 2-4-1-3-5.'],
['THE PINCERS','Two solid side walls push toward the zigzag tower from one direction.'],
['THE HUNTER LIES','A relentless wall climbs three narrowing terraces and pushes toward the gaps.'],
['THE SLIDING ROOM','The connected inner core shifts inside a fixed C-shaped frame.'],
['CENTRAL TOWER','One portal drops the right bank; another lands on the lift below the lonely tower.'],
['THE VERTICAL SLOT','A portal drops you into a shaft while two side pistons strike in opposite directions.'],
['IMPULSE ISLAND','The portal launches you onto a high island before a wall closes in and the island sinks.'],
['DOUBLE DECKER','Run right above, all the way back below, then return upstairs through the second portal.'],
['THE DEEP PORTAL U','Ride the lift through its full route before reaching the moving portal behind the spike.'],
['SENT BACK','Three separate lanes form an outward run, a return run and a final escape corridor.'],
['THE MIRROR','The portal launches into the second C-arm as its inner floor moves right and then up.'],
['DROP ZIGZAG','Every arrival demands the full ledge while the floor and pursuing wall already move.'],
['MOVING ADDRESS','The ferry starts underfoot; its spike and portal can only be reached during the ride.'],
['THE LAST SHORTCUT','Two portal alcoves are bait; the deep return route holds two late spikes.'],
['THE HONEST BUTTON','A small button balcony raises a bridge from a monumental shaft.'],
['BRIDGE VERSUS FLOOR','The bridge answers your approach; its switch sinks the start and raises the next step.'],
['SMALL PATH, BIG JUMP','Shrink for the 26-pixel tunnel, then return to normal size for the gorge.'],
['THE BUTTON MOVES','The button moves the entire door island down and left while a spike rides along.'],
['THE WAY BACK','Reach the button above, fall on the right and return below the starting point.'],
['TWO BUTTONS, ONE LIE','In the Y-shaped room, the left button opens while the right one raises the platform.'],
['NOT AGAIN','The first size button helps; skip the second while two late spikes test the long jump.'],
['THE MOVING SWITCH','The switch lifts a ferry from below and sends it across the steps toward the portal.'],
['THE DOOR WAS BEHIND YOU','The lower button places three narrow steps into the gaps of the return staircase.'],
['THREE SEPARATE ACTS','A deep button chamber, tight shaft and high door island form three distinct acts.'],
['THE FINAL ASCENT','Four required switches lead across a moving lift, two portal flanks and a flying door platform.'],
];
englishCopy.forEach(([name,story],index)=>Object.assign(levels[index],{name,story}));

const guides={10:[[260,452],[370,397],[620,342],[820,287]],11:[[650,252],['done:hatch'],[760,437],[500,437],[250,437]],16:[['motion:lift'],[450,312]],18:[['done:downlift'],['done:blocker']],19:[[390,382],[600,382],[680,332]],20:[['done:stream'],['done:pusher']],22:[['done:runner']],24:[['motion:helper']],30:[['arrival:cross'],['arrival:top']],31:[['arrival:drop'],[540,390],[420,500]],32:[['arrival:impulse']],33:[['arrival:down'],['arrival:back']],34:[['arrival:lift-entry']],35:[['arrival:across'],['arrival:return']],36:[['arrival:mirror']],37:[['arrival:middle'],['arrival:lower']],38:[['arrival:moving']],39:[[700,280],[600,307]],40:[['button:open']],41:[['motion:bridge'],['button:swap'],['done:step']],42:[['button:small'],['button:normal']],43:[['button:move']],44:[['button:return'],[750,230],[760,437]],45:[['button:left'],['button:right']],46:[['button:large']],47:[['button:turn'],['arrival:tower']],48:[['button:return']],49:[['button:lift'],['arrival:act-three']],50:[['button:launch'],['motion:lift'],['button:left'],['arrival:lower'],['button:lower'],['arrival:upper'],['button:ride'],['done:goal']]};
const silhouettes=['flat-line','double-terrace','deep-step-u','low-tunnel','three-island','side-arm-plinth','tower-choice','isolated-high-tower','unequal-pillars','large-c','double-floor-return','vertical-shaft','single-bridge','descending-zigzag','hall-floor-hatch','lift-pit','two-bank-ferry','diagonal-descent','three-field-corridor','counterflow-bridge','offset-double-floor','fleeing-door-island','segment-wave','l-shaft-pusher','three-stop-archipelago','domino-stair','pincer-hall','three-rise-chase','moving-core-c','unequal-portal-rooms','tower-lower-niche','runup-open-chamber','three-s-rooms','portal-lift-pit','asymmetric-portal-u','mirrored-double-c','tower-fall-slot','moving-entry-bank','high-direct-shortcut','button-bridge-shaft','sinking-middle-hall','crawl-tunnel-gorge','balcony-door-island','looping-double-corridor','y-chamber','long-size-bridge','double-tower-ferry','reverse-rising-zigzag','three-act-rooms','tower-u-niche-finale'];
const directions=['east-flat','east-gap','down-up','east-low','island-east','west-drop','choice-over','fall-west','pillar-east','out-and-over','east-down-west','vertical-down','east-calm','up-down-east','east-sink','up-east','ferry-east','down-west','east-locked-back','west-then-east','up-switch','receding-east','wave-east','up-then-east','middle-transfer','stair-east','center-up','chase-up-east','core-east-up','teleport-east','portal-up-down','impulse-east','portal-s-east','portal-lift-up','portal-return-down','mirror-east','fall-slot-east','timed-portal-east','direct-west','button-east','bridge-swap-east','small-east-jump','door-down-left','east-down-west','left-right-up','size-east-up','ferry-right-portal-left','down-right-return','button-portal-east','fall-lift-portal-west'];
const triggers=['triple-visible-spike','edge-zone','u-sequence','jump','flight-arc','wrong-way-zone','tunnel-probe','tower-leave','target-land','inner-jump','far-end','visible-fall-zigzag','triple-bridge','last-edge','stand-sink','stand-lift','stand-ferry','stand-drop','mid-zone','stand-current','entry-zone','run-zone','shore-zone-wave','stand-helper','stand-stop','step-zone-order','climb-zone','chase-zone','core-zone','portal-entry','portal-height','portal-momentum','two-portals','portal-arrival-motion','return-arrival','mirror-arrival','portal-decoy','moving-portal-time','ignore-portals','button-honest','button-swap','two-size-buttons','button-move-goal','button-return','button-order','optional-button','moving-button','button-return-stair','button-lift-portal','button-lift-portal-final'];
const doors=['right-floor','right-terrace','right-high','right-tunnel','right-bank-high','left-low','right-low','left-low-niche','right-pillar','right-upper','left-lower','right-niche','right-bridge','right-low','right-hall','right-high','right-bank','left-low','right-step','right-bank','right-upper','right-moving-island','right-bank-wave','right-upper-niche','right-bank-overhang','right-bottom-step','top-center','right-top','right-anchor','right-room','right-lower-niche','right-open','right-island','right-lift-height','u-bottom','right-mirror','right-bottom','right-target-bank','left-low','right-bank','right-hall','right-gorge','moving-island','left-lower','top-center-y','right-high-niche','left-tower','left-start-high','right-island','left-upper-niche'];
// Reviewed approach direction for every position-triggered spike. Keeping this
// explicit avoids guessing from an overlapping zone's centre (which used to
// place room 2's trigger behind the spike).
const triggerApproaches={
  2:{0:'left'},3:{0:'left',1:'left'},4:{0:'left'},5:{1:'left'},6:{0:'left'},7:{1:'left'},
  8:{1:'right'},9:{2:'left'},10:{1:'left',3:'left'},11:{2:'right'},
  14:{1:'left'},19:{0:'left'},30:{0:'left'},
  31:{0:'right',1:'right'},32:{1:'left'},33:{0:'left',1:'right'},
  35:{1:'left'},36:{0:'left'},37:{1:'left',2:'left'},39:{0:'right',1:'right'},
  46:{0:'left',1:'left'},
  50:{0:'left',3:'left',5:'left',7:'left',9:'right'}
};
silhouettes.splice(29,10,'lone-center-monolith','needle-vertical-shaft','impulse-sky-island','stacked-return-corridors','deep-portal-lift-u','three-band-return-run','opposed-c-arms','portal-fall-zigzag','diagonal-moving-portal','high-direct-decoys');
directions.splice(29,10,'portal-bank-lift-east','fall-right-left','impulse-drop-east','east-west-east-chase','lift-up-portal-east','east-west-drop-east','portal-left-floor-up-east','east-west-east-collapse','ferry-up-portal','direct-west');
triggers.splice(29,10,'arrival-bank-then-lift','arrival-alternating-walls','arrival-sink-and-wall','arrival-chaser','stand-two-phase-lift','arrival-hatch-and-wall','arrival-moving-mirror','arrival-double-collapse','stand-moving-portal','ignore-portals');
for(const [i,l] of levels.entries()){
  l.guide=guides[l.number]||[];
  l.identity={silhouette:silhouettes[i],direction:directions[i],trigger:triggers[i],door:doors[i]};
  for(const [hazardIndex,hazard] of l.spikes.entries()){
    hazard.baseX=hazard.x;hazard.baseY=hazard.y;
    if(hazard.when&&!hazard.initial){
      hazard.speed=10+l.difficulty*.6;
      if(hazard.when.zone){
        hazard.when.column=true;
        hazard.delay=0;
        hazard.triggerFrom=triggerApproaches[l.number]?.[hazardIndex];
        if(hazard.triggerFrom!=='overhead'){
          const leftTip=hazard.x-(hazard.dir==='left'?9:0);
          const rightTip=hazard.x+hazard.w+(hazard.dir==='right'?9-hazard.w:0);
          const edgeGap=Math.round(46-l.difficulty*1.8);
          hazard.when.zone=hazard.triggerFrom==='left'
            ?[Math.max(32,leftTip-edgeGap-16),hazard.when.zone[1],16,hazard.when.zone[3]]
            :[Math.min(912,rightTip+edgeGap),hazard.when.zone[1],16,hazard.when.zone[3]];
        }
      }
    }
  }
}
const api={levels,groups:['SPIKES','MOVING WALLS','PORTALS','BUTTONS','FINAL TRIALS']};if(typeof module!=='undefined')module.exports=api;else root.DevilLevels=api;
})(typeof globalThis!=='undefined'?globalThis:this);
