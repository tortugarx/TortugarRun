/* Hand-authored rooms. Categories unlock a vocabulary, not a checklist. */
(function (root) {
  "use strict";
  const b = (x,y,w,h,id) => [x,y,w,h,id];
  const floor = (x=32,y=420,w=896) => b(x,y,w,540-y);
  const z = (x,y=100,w=40,h=400) => ({zone:[x,y,w,h]});
  const stand = id => ({stand:id});
  const signal = name => ({signal:name});
  const sp = (x,y=420,w=27,when=z(x-42),extra={}) => ({x,y,w,when,...extra});
  const on = (x,y=420,w=27,dir="up") => sp(x,y,w,null,{dir});
  const mv = (id,when,path,delay=0,loop=false) => {
    let px=0,py=0;
    return {id,when,delay,loop,ease:true,path:path.map(([x,y,t])=>{
      const duration=x===px&&y===py?t:t*0.68;
      px=x;py=y;return [x,y,duration];
    })};
  };
  const portal = (id,x,y,to,extra={}) => ({id,x,y,to,...extra});
  const button = (id,x,y,extra={}) => ({id,x,y:y-8,...extra});
  const L=[];
  function room(name,blocks,spikes=[],motions=[],portals=[],buttons=[],extra={}) {
    const n=L.length+1, group=n<15?0:n<30?1:n<40?2:3;
    L.push({name,group,number:n,spawn:[64,420],exit:[864,356],
      blocks:[b(0,0,32,540),b(928,0,32,540),b(32,0,896,104),...blocks],
      spikes,motions,portals,buttons,...extra});
  }
  // 01–14: only spikes. Every piece of terrain stays put.
  room("LETZTER SCHRITT",[floor()],[sp(820,420,27,z(793))]);
  room("SCHON WIEDER?",[floor(32,420,718),floor(750,395,178)],
    [sp(716,420,27,z(673))],[],[],[],{exit:[864,331]});
  room("LANDUNG GEBUCHT",[floor(32,420,388),floor(480,420,448)],
    [sp(529,420,36,z(435,300,90,200))]);
  room("KOPF HOCH",[floor(),b(330,330,230,30)],
    [on(390),sp(480,360,36,{...z(330,350,180,70),jump:true},{dir:"down"})]);
  room("NACHZÜGLER",[floor(),b(758,394,90,26)],
    [sp(246,420,36,z(300)),sp(490,420,36,z(545)),sp(706,420,27,z(662))]);
  room("UNTEN WARTET'S",[floor(32,330,160),floor(192,365,120),floor(312,400,120),floor(432,435,128),floor(560,400,120),floor(680,365,120),floor(800,330,128)],
    [on(474,435),sp(734,365,27,z(685))],[],[],[],{spawn:[64,330],exit:[864,266]});
  room("DIE FREIE MITTE",[floor()],
    [on(320,420,36),on(490,420,36),sp(407,420,36,z(390,392,70,28),{delay:0.22})]);
  room("UM DIE ECKE",[floor(32,340,290),floor(322,420,606),b(32,260,250,26),b(355,104,31,242)],
    [sp(386,365,27,z(285,300,150,130),{dir:"right"}),sp(454,420,27,z(402))],[],[],[],{spawn:[64,340]});
  room("TÜR LINKS",[floor(32,420,350),floor(382,442,150),floor(532,420,396)],
    [sp(554,420,27,z(593))],[],[],[],{spawn:[860,420],exit:[64,356]});
  room("NICHT STEHEN BLEIBEN",[floor(32,420,220),floor(252,395,150),floor(402,420,150),floor(552,395,150),floor(702,420,226)],
    [sp(597,395,54,z(574,365,110,32),{delay:0.20})]);
  room("DER RÜCKZIEHER",[floor()],
    [sp(340,420,54,z(290),{initial:true,retractFor:0.65}),sp(457,420,27,z(399))]);
  room("ZAHN IM SCHACHT",[floor(32,230,240),floor(302,470,350),floor(652,435,120),floor(772,400,156),b(585,104,36,250)],
    [sp(585,355,65,z(310,240,270,190),{dir:"left"}),on(490,470,54)],[],[],[],{spawn:[64,230],exit:[864,336]});
  room("DOPPELT GEMOPPELT",[floor(),b(290,395,115,25),b(555,395,125,25),b(530,322,180,27)],
    [sp(327,395,27,z(270)),sp(599,349,36,z(535),{dir:"down"})]);
  room("ENDLICH DURCH",[floor(),b(420,393,100,27)],
    [sp(245,420,27,z(205)),sp(457,393,27,z(428,370,80,25),{delay:0.25}),sp(820,420,27,z(780))]);
  // 15–29: map pieces can carry, lift and push, never deal damage.
  room("PLATZ DA",[floor(32,420,578),floor(698,420,230),b(270,440,32,110,"push")],
    [sp(790,420,27,z(750))],[mv("push",z(328),[[0,-130,0.22],[340,-130,3.2]])]);
  room("HOCH HINAUS",[floor(32,420,240),b(272,420,150,24,"lift"),floor(422,385,130),floor(552,350,376),b(250,235,185,25)],
    [on(280,260,135,"down")],[mv("lift",stand("lift"),[[0,-175,2.2]])],[],[],{exit:[864,286]});
  room("DER FREUNDLICHE BODEN",[floor(32,420,240),floor(585,420,343),b(110,445,320,22,"bridge")],
    [on(750,350,40,"left")],[mv("bridge",z(208),[[162,-25,0.6],[162,-25,2.6],[405,-25,3.2]])]);
  room("SEITENSCHUB",[floor(32,420,488),floor(604,420,324),b(270,334,235,28),b(205,440,40,100,"push")],
    [on(728)],[mv("push",z(280),[[0,-120,0.2],[250,-120,2.6]])]);
  room("UNTER DIR WEG",[floor(32,340,210),b(242,340,280,20,"slide"),floor(360,450,175),floor(535,415,115),floor(650,380,115),floor(765,345,163)],
    [on(555,415,27)],[mv("slide",z(380),[[-260,0,1.1]])],[],[],{spawn:[64,340],exit:[864,281]});
  room("RETTUNG MIT ZÄHNEN",[floor(32,300,240),floor(535,325,393),b(275,520,260,25,"rescue"),b(270,195,270,22)],
    [on(280,217,240,"down"),on(580,325,27)],[mv("rescue",z(252,230,130,260),[[0,-160,0.45],[0,-160,0.8],[0,-300,1.5]])],[],[],{spawn:[64,300],exit:[864,261]});
  room("TREPPENWITZ",[floor(),b(270,395,125,25,"step1"),b(395,370,125,50,"step2"),b(520,345,125,75,"step3"),b(270,275,375,20)],
    [on(290,295,330,"down")],[mv("step1",z(355),[[0,-160,1.1]]),mv("step2",z(355),[[0,-160,1.1]]),mv("step3",z(355),[[0,-160,1.1]])]);
  room("NICHT QUETSCHEN",[floor(32,420,390),floor(486,420,442),b(225,420,120,25,"left"),b(555,380,80,40,"right")],
    [on(423,515,62)],[mv("left",z(340),[[125,-32,1.5]]),mv("right",z(340),[[-105,0,1.5]])]);
  room("DIE TÜR FÄHRT MIT",[floor(32,420,485),b(537,420,45,25),b(620,420,250,28,"island")],
    [],[mv("island",z(440),[[55,0,0.65],[55,0,0.7],[-45,0,1.3]])],[],[],{exit:[800,356],exitOn:"island"});
  room("DECKE ALS FÄHRE",[floor(32,385,240),floor(700,385,228),b(272,170,430,24,"ferry"),b(420,105,210,22)],
    [on(330,515,250),on(430,127,190,"down")],[mv("ferry",z(150),[[0,230,0.45],[0,230,4.0],[0,-20,2]])],[],[],{spawn:[64,385],exit:[864,321]});
  room("GEGENVERKEHR",[floor(),b(180,330,530,20),b(735,385,95,35),b(820,350,108,70),b(585,385,55,35,"lower"),b(340,305,60,25,"upper")],
    [on(290),on(420,330,27)],[mv("lower",z(270),[[-270,0,2.8]]),mv("upper",z(740),[[320,0,3.5]])],[],[],{exit:[200,266]});
  room("DER FALSCHE SCHUTZ",[floor(32,420,270),b(302,420,180,25,"lift"),floor(482,380,446),b(300,270,180,24)],
    [on(493,396,24,"left"),on(310,294,160,"down")],[mv("lift",stand("lift"),[[0,-145,2.1]])],[],[],{exit:[864,316]});
  room("DOMINO-BODEN",[floor(32,420,180),b(212,420,180,24,"d1"),b(392,420,40,24),b(432,420,170,24,"d2"),b(602,420,40,24),b(642,420,165,24,"d3"),floor(807,420,121)],
    [sp(847,420,27,z(795))],[mv("d1",stand("d1"),[[0,200,1.6]],0.85),mv("d2",signal("motion:d1"),[[0,200,1.6]],1.75),mv("d3",signal("motion:d1"),[[0,200,1.6]],2.4)]);
  room("WAND ODER WEG",[floor(32,300,245),floor(650,385,278),b(200,405,380,26,"catch")],
    [on(340,515,210),on(800,385,27)],[mv("catch",z(252,220,130,240),[[110,0,0.5],[110,0,0.8],[340,0,3]])],[],[],{spawn:[64,300],exit:[864,321]});
  room("ALLES GEGEN DICH",[floor(32,390,200),floor(310,390,200),b(510,390,170,24,"lift"),floor(680,355,248),b(110,435,30,90,"push"),b(740,440,40,55,"last")],
    [on(858,355,27)],[mv("push",z(155),[[0,-130,0.25],[110,-130,1.5]]),mv("lift",stand("lift"),[[0,-65,1.2]]),mv("last",z(795,270,90,160),[[0,-115,0.25],[55,-115,0.8]])],[],[],{spawn:[64,390],exit:[880,291]});
  // 30–39: independent directed endpoints, all drawn with the same palette.
  room("FALSCHER ANSCHLUSS",[floor(32,420,270),floor(530,450,100),floor(760,420,168)],
    [],[],[portal("A",235,420,"C"),portal("B",800,420,"A"),portal("C",490,395,"B",{vx:90})]);
  room("NAH IST NICHT VERBUNDEN",[floor(32,420,430),b(32,300,430,20),b(580,104,32,436),floor(612,420,316)],
    [sp(305,300,45,signal("arrival:C"))],[],[portal("A",200,420,"C"),portal("B",375,420,"D"),portal("C",240,300,"A"),portal("D",700,420,"B")]);
  room("ANKUNFT VON OBEN",[floor(32,420,245),b(320,104,25,230),floor(345,440,240),floor(585,405,150),floor(735,370,193)],
    [on(510,440,54)],[],[portal("A",220,420,"B"),portal("B",545,205,"A")],[],{exit:[864,306]});
  room("RÜCKFAHRKARTE",[b(32,300,230,24,"start"),b(262,300,90,24),floor(32,450,450),floor(740,420,188)],
    [],[mv("start",signal("arrival:C"),[[-200,0,1.2]])],[portal("A",350,450,"C"),portal("B",790,420,"A"),portal("C",260,270,"B")],[],{spawn:[64,300]});
  room("DIE ANKUNFT FÄHRT",[floor(32,420,270),b(510,420,175,24,"arrival"),floor(685,390,243),b(450,310,235,22)],
    [on(480,332,200,"down")],[mv("arrival",signal("arrival:B"),[[0,-125,1.4]],0.28)],[portal("A",225,420,"B"),portal("B",575,420,"A")],[],{exit:[864,326]});
  room("UMLEITUNG",[floor(),b(290,104,30,316),b(640,104,30,316),b(580,380,40,40,"nudge")],
    [on(360,420,27)],[mv("nudge",signal("arrival:B"),[[-70,0,0.8]],0.4)],[portal("A",230,420,"B"),portal("B",535,420,"C"),portal("C",740,420,"A")]);
  room("DER KÖDER ÜBER DEM LOCH",[floor(32,420,250),floor(710,385,218),b(450,515,200,25,"rescue"),b(440,200,220,24)],
    [on(460,224,180,"down")],[mv("rescue",signal("arrival:C"),[[0,-110,0.4],[0,-110,0.9],[0,-295,1.6]])],[portal("A",220,420,"C"),portal("B",270,420,"A"),portal("C",560,335,"A")],[],{exit:[864,321]});
  room("FALSCHE SEITE",[floor(),b(32,300,896,22),b(876,230,30,70)],
    [on(876,260,35,"left")],[],[portal("A",790,420,"B"),portal("B",830,300,"A",{vx:160})],[],{exit:[64,236]});
  room("VIER FALSCHE FREUNDE",[floor(),b(32,300,896,24),b(470,104,28,436),b(270,285,60,15,"nudge")],
    [sp(680,420,45,signal("arrival:C"))],[mv("nudge",signal("arrival:B"),[[-50,0,0.8]])],[portal("A",280,420,"C"),portal("B",220,300,"D"),portal("C",740,420,"B"),portal("D",735,300,"A")],[],{exit:[864,236]});
  room("NOCH EIN PORTAL",[floor(32,420,230),b(350,325,170,24),floor(690,420,238)],
    [sp(850,420,27,z(805))],[],[portal("A",200,420,"B"),portal("B",430,325,"C"),portal("C",795,420,"A")]);
  // 40–50: each button has explicit effects, no random size or destination.
  room("ZU GROSS GEFREUT",[floor(32,420,480),floor(545,420,383),b(300,355,95,32)],
    [on(310,387,75,"down")],[],[],[button("grow",410,420,{size:[1.5,1.5],anchor:"left"})]);
  room("KLEIN, ABER TOT",[floor(32,420,600),floor(650,420,278),b(290,320,290,85)],
    [sp(750,420,27,z(710))],[],[],[button("small",215,420,{size:[0.6,0.6]})]);
  room("BREITSEITE",[floor(32,360,330),floor(395,360,325),floor(720,450,208),b(742,104,30,292),b(310,300,140,41)],
    [on(840,450,27)],[],[],[button("wide",240,360,{size:[1.8,1]}),button("thin",590,360,{size:[0.7,1]})],{spawn:[64,360],exit:[864,386]});
  room("SCHMALER GRAT",[floor(32,280,320),b(395,104,24,285),floor(352,450,26),floor(395,450,170),floor(565,415,120),floor(685,380,120),floor(805,345,123)],
    [],[],[],[button("thin",260,280,{size:[0.55,1]})],{spawn:[64,280],exit:[864,281]});
  room("TÜR AUF, FALLE AN",[floor(),b(120,445,35,110,"push")],
    [on(795,420,36)],[mv("push",signal("button:open"),[[0,-135,0.25],[570,-135,4.2]])],[],[button("open",250,420,{unlock:true})],{locked:true});
  room("BODEN BESTELLT",[floor(32,420,250),floor(690,420,238),b(690,445,410,24,"bridge"),b(285,285,400,22)],
    [on(300,307,370,"down")],[mv("bridge",signal("button:bridge"),[[-410,-25,0.9],[-410,-25,2.4],[-410,-150,1.2]])],[],[button("bridge",215,420)]);
  room("DER FALSCHE KNOPF",[floor(),b(740,315,30,105,"gate")],
    [on(412,420,27)],[mv("gate",signal("button:right"),[[0,-115,0.5]])],[],[button("wrong",390,420,{size:[1.5,1.5]}),button("right",505,420,{unlock:true})],{locked:true});
  room("ERST BREIT, DANN KLEIN",[floor(32,420,330),floor(395,420,533),b(615,320,190,85)],
    [on(850,420,27)],[],[],[button("wide",235,420,{size:[1.8,1]}),button("small",540,420,{size:[0.6,0.6]})]);
  room("WANDTAUSCH",[floor(32,420,610),b(642,420,160,24,"bottom"),floor(802,420,126),b(160,325,560,22),b(720,385,90,35),b(810,350,118,70),b(395,250,28,75,"gate")],
    [on(655,515,140)],[mv("bottom",signal("button:swap"),[[150,0,1]]),mv("gate",signal("button:swap"),[[0,-115,0.5]])],[],[button("swap",845,350,{unlock:true})],{exit:[190,261],locked:true});
  room("FALSCHE LIEFERUNG",[floor(32,420,255),b(325,104,25,436),floor(350,420,200),b(650,455,100,24,"landing"),floor(755,420,173),b(785,320,115,85)],
    [on(710,515,45)],[mv("landing",signal("button:delivery"),[[-80,0,0.5]])],[portal("A",225,420,"B"),portal("B",405,420,"C"),portal("C",660,325,"A")],[button("delivery",475,420,{size:[0.6,0.6]})]);
  room("JETZT ABER WIRKLICH",[floor(32,420,330),floor(395,420,533),b(32,270,305,22),b(370,270,230,22),b(600,440,145,24,"lift"),b(745,305,183,24),b(600,150,145,24),b(150,180,120,75),b(775,340,25,80,"gate")],
    [on(610,174,125,"down"),sp(103,270,18,z(158,230,65,45))],[mv("lift",signal("arrival:C"),[[0,-135,0.7],[0,-135,1.4],[0,-285,2]]),mv("gate",signal("button:wide"),[[0,-235,0.4]])],[portal("A",850,420,"C"),portal("B",825,305,"A"),portal("C",655,250,"B")],[button("wide",230,420,{size:[1.8,1]}),button("small",780,305,{size:[0.6,0.6],unlock:true})],{exit:[64,206],locked:true});
  // Carved room silhouettes: explicit ceiling profiles, never random decoration.
  // Entries are [left, right, bottom]; the space above joins the upper wall.
  const ceilings = [
    [[32,660,285],[660,928,245]],
    [[32,300,255],[300,750,290],[750,928,235]],
    [[32,350,275],[570,928,260]],
    [[32,270,255],[330,560,330],[620,928,250]],
    [[32,185,285],[185,610,245],[610,928,270]],
    [[32,192,190],[192,312,220],[312,680,260],[680,800,220],[800,928,190]],
    [[32,265,270],[265,560,320],[560,928,240]],
    [[32,282,260],[386,560,245],[560,928,285]],
    [[32,340,280],[340,570,325],[570,928,245]],
    [[32,252,275],[252,402,255],[402,552,290],[552,702,250],[702,928,280]],
    [[32,250,275],[250,560,325],[560,730,260],[730,928,285]],
    [[32,240,120],[302,465,235],[652,772,275],[772,928,245]],
    [[32,240,270],[290,405,275],[555,710,220],[755,928,285]],
    [[32,330,275],[420,520,255],[610,928,290]],
    [[32,245,260],[698,928,270]],
    [[32,240,270],[552,928,195]],
    [[32,200,265],[630,928,255]],
    [[32,180,250],[270,505,250],[650,928,265]],
    [[32,210,185],[535,650,245],[650,765,215],[765,928,190]],
    [[32,240,145],[580,928,175]],
    [[32,210,245],[730,928,275]],
    [[32,200,270],[350,550,235],[690,928,270]],
    [[32,380,265],[760,928,180]],
    [[32,220,230],[750,928,235]],
    [[32,135,225],[180,530,180],[650,928,190]],
    [[32,250,275],[540,928,225]],
    [[32,185,285],[235,395,235],[435,600,280],[660,805,225],[835,928,285]],
    [[32,230,140],[710,928,235]],
    [[32,110,220],[350,475,240],[830,928,210]],
    [[32,280,265],[545,630,290],[760,928,255]],
    [[32,440,160],[612,928,260]],
    [[32,275,265],[735,928,210]],
    [[32,230,160],[400,480,290],[740,928,260]],
    [[32,280,275],[745,928,225]],
    [[32,290,260],[320,640,280],[670,928,245]],
    [[32,280,270],[745,928,225]],
    [[32,500,155],[570,850,175]],
    [[32,400,145],[550,928,155]],
    [[32,262,265],[350,520,175],[690,928,255]],
    [[32,230,275],[300,395,250],[570,928,275]],
    [[32,245,255],[290,580,320],[650,928,275]],
    [[32,235,200],[310,450,225],[485,715,190],[772,928,280]],
    [[32,325,135],[445,565,285],[565,685,250],[685,805,215],[805,928,190]],
    [[32,190,260],[330,570,285],[680,928,250]],
    [[32,250,275],[730,928,260]],
    [[32,285,270],[330,680,285],[810,928,260]],
    [[32,275,270],[420,570,285],[615,805,320],[835,928,265]],
    [[32,140,220],[180,350,160],[470,650,170],[835,928,195]],
    [[32,285,265],[350,530,265],[785,900,245]],
    [[32,120,110],[370,560,120],[800,928,145]]
  ];
  ceilings.forEach((profile,i)=>profile.forEach(([x,end,y])=>L[i].blocks.push(b(x,104,end-x,y-104))));

  // Replace repeated overhead crushers with traps on the route or carrier.
  const removeBeam = (n,x,y) => { L[n-1].blocks=L[n-1].blocks.filter(r=>r[0]!==x||r[1]!==y); };
  for(const [n,x,y] of [[16,250,235],[20,270,195],[21,270,275],[24,420,105],[26,300,270],[34,450,310],[36,440,200],[45,285,285],[50,600,150]]) removeBeam(n,x,y);
  L[15].spikes=[sp(572,350,36,z(485,270,100,130),{delay:0.12})];
  L[19].spikes=[on(580,325,27),sp(430,520,45,signal("motion:rescue"),{attach:"rescue",delay:0.8})];
  L[20].spikes=[sp(425,420,45,signal("motion:step2"),{delay:0.45}),sp(660,420,27,z(590),{delay:0.18})];
  L[23].spikes=[on(330,515,250),sp(525,170,54,signal("motion:ferry"),{initial:true,vanish:true,delay:0.6,attach:"ferry"})];
  L[25].spikes=[sp(515,380,36,z(445,280,85,160),{delay:0.12})];
  L[33].spikes=[sp(620,420,36,signal("arrival:B"),{attach:"arrival",delay:0.32})];
  L[35].spikes=[sp(600,515,36,signal("arrival:C"),{attach:"rescue",delay:0.7})];
  L[44].spikes=[sp(950,445,45,signal("button:bridge"),{attach:"bridge",delay:1.3})];
  L[49].spikes=[sp(103,270,18,z(158,230,65,45)),sp(745,305,27,signal("arrival:C"),{delay:0.75})];

  // Different floor silhouettes: a terraced mound, basin, sunken passage and drop-in.
  const replaceFloor = (n,segments) => {
    const l=L[n-1];
    l.blocks=l.blocks.filter(r=>!(r[0]===32&&r[1]===420&&r[2]===896));
    l.blocks.push(...segments.map(([x,y,w])=>floor(x,y,w)));
  };
  replaceFloor(5,[[32,420,290],[322,400,115],[437,380,120],[557,400,115],[672,420,256]]);
  L[4].spikes[1].y=380;
  replaceFloor(7,[[32,420,248],[280,455,310],[590,420,338]]);
  L[6].spikes.forEach(h=>h.y=455);
  replaceFloor(11,[[32,420,218],[250,445,330],[580,410,348]]);
  L[10].spikes.forEach(h=>h.y=445); L[10].exit=[864,346];
  L[39].blocks=L[39].blocks.filter(r=>!(r[0]===32&&r[1]===420&&r[2]===480));
  L[39].blocks.push(floor(32,380,180),floor(212,420,300)); L[39].spawn=[64,380];

  // Distinct spike behaviours: pursuit, false gaps, retracting barriers, ambushes.
  L[2].spikes[0].path=[[72,0,0.45],[0,0,0.7]];
  L[4].spikes[0].path=[[40,0,0.4]];
  L[6].spikes[0]=sp(320,455,36,z(280),{initial:true,vanish:true});
  L[6].spikes[1]=sp(490,455,36,z(400),{initial:true,vanish:true,delay:0.22});
  L[8].spikes[0].path=[[-65,0,0.45]];
  L[10].spikes[0].retractFor=1.1;
  L[12].spikes[0].path=[[36,0,0.3],[-18,0,0.5]];
  L[13].spikes[0].when=z(280); // The first apparent obstacle is harmless until passed.
  L[13].spikes[2].path=[[-65,0,0.45]];
  L[16].spikes=[sp(730,420,36,z(635),{path:[[-90,0,0.55],[50,0,0.7]]})];
  L[18].spikes[0]=sp(555,415,27,z(420,350,180,120),{initial:true,vanish:true,delay:0.5});
  L[27].spikes[1]=sp(800,385,27,z(690),{path:[[-65,0,0.4]]});
  L[34].spikes.push(sp(590,420,27,signal("arrival:B"),{delay:0.6}));
  L[39].spikes.push(sp(475,420,27,signal("button:grow"),{delay:0.3}));
  L[43].spikes[0]=sp(795,420,36,signal("button:open"),{initial:true,vanish:true,delay:0.7});
  L[45].buttons[0].x=365; // Keep the button distinct from the adjacent spike strip.
  L[48].exit=[892,356]; // Door sits past the low tunnel, not inside its ceiling.
  L[33].portals[1].attach="arrival";
  L[34].motions[0].path=[[-24,0,0.45]];
  L[37].motions[0].path=[[-30,0,0.45]];
  L[49].motions[0].path=[[0,-135,0.48],[0,-135,1.4],[120,-135,0.6]];
  L[49].motions[1].path=[[0,100,0.28]];
  L[45].spikes.push(sp(465,420,27,signal("button:wrong"),{delay:0.1}));
  L[46].spikes[0]=sp(850,420,27,signal("button:small"),{initial:true,vanish:true,delay:0.4});
  // Keep spike attachment offsets immutable across simulation ticks.
  for (const l of L) for (const h of l.spikes) { h.baseX=h.x; h.baseY=h.y; }
  const api={levels:L,groups:["SPIKES","MOVING MAP","PORTALS","BUTTONS"]};
  if(typeof module!=="undefined") module.exports=api; else root.DevilLevels=api;
})(typeof globalThis!=="undefined"?globalThis:this);
