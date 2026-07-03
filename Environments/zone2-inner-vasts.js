/* ============================================================================
 * zone2-inner-vasts.js  —  ENGINE-READY environment for Three.js r128
 * ----------------------------------------------------------------------------
 * ZONE 2 — THE INNER VASTS  (S7L2 · Cells & Body Systems)
 * Theme: the player has SHRUNK DOWN and travels INSIDE an organism.
 * Strand/accent: cyan #4cc9f0.  Soft, translucent, lightly glowing organic look.
 *
 *   const z = InnerVastsForge.build();
 *   scene.add(z); z.animate(dt);
 *   z.organelles.nucleus / .mito / .chloro / .lyso / .membrane
 *   z.systems.vessel / .lung / .heart
 *   z.schoolhouse / z.bossArena / z.launchPad
 * ========================================================================== */
(function (global) {
  var ACCENT = 0x4cc9f0;  // cyan Strand
  var COL = {
    cyto:0x2a6f86, cytoD:0x215568, floor:0x1d4d5e, accent:ACCENT,
    membrane:0x6fd8ef, membraneD:0x3aa8c9, gold:0xe6b84c, white:0xf2f1ec, dark:0x14242c,
    nucleus:0x7c63ff, nucleolus:0x5a44c6, pore:0x9d8cff,
    mito:0xd86a5a, mitoCrista:0xb04838, mitoMembrane:0xe89a7a,
    chloro:0x43c785, chloroStack:0x2fa36b,
    lyso:0xe6b84c, lysoD:0xb98a3c,
    er:0x9a6acf, ribo:0xf2d9a0, golgiA:0xf0a85c, golgiB:0xe6884c,
    vacuole:0x4cc9f0,
    vessel:0xc24a6a, vesselWall:0xe07a92, plasma:0x9a2f4a, rbc:0xd8564c,
    lung:0xe0a8c0, lungD:0xc07a98, air:0xdff0f6,
    heart:0xc24a5a, heartD:0x9a2f44, valve:0xe8b48f,
    wood:0x7c5230, plank:0x9a6a3c, stone:0x9296a0, stoneD:0x6f7480
  };

  function build(opts){
    opts=opts||{};
    var THREE=global.THREE;
    var cache={};
    function mat(c){ if(!cache['m'+c]) cache['m'+c]=new THREE.MeshLambertMaterial({color:c}); return cache['m'+c]; }
    function glow(c,i){ var k='g'+c+(i||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:(i==null?0.5:i)}); return cache[k]; }
    function trans(c,o){ var k='t'+c+o; if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,transparent:true,opacity:o,side:THREE.DoubleSide}); return cache[k]; }
    function transGlow(c,o,e){ var k='tg'+c+o+(e||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:e||0.3,transparent:true,opacity:o,side:THREE.DoubleSide}); return cache[k]; }
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||10),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||12; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(6,seg-4)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||8),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,7,seg||18),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function disc(r,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CircleGeometry(r,seg||28),mat(c)); m.rotation.x=-Math.PI/2; m.position.set(x||0,y||0,z||0); return m; }

    var root=new THREE.Group();
    var pulse=[], bob=[], spin=[], flow=[];
    var organelles={}, systems={};

    // ---- CYTOPLASM FLOOR --------------------------------------------------
    root.add(CY(50,51,0.6,COL.floor,0,-0.3,0,48));
    var cyto=disc(48,COL.cyto,0,0.04,0,48); cyto.material=trans(COL.cyto,0.95); root.add(cyto);

    // ====================================================================
    //  CELL DISTRICT — giant organelles under a translucent membrane dome
    //  (placed on the -X half of the map)
    // ====================================================================
    var CELL=new THREE.Group(); CELL.position.set(-13,0,0); root.add(CELL);

    // translucent cell-membrane dome (phospholipid wall)
    var dome=new THREE.Mesh(new THREE.SphereGeometry(15,20,14,0,Math.PI*2,0,Math.PI/2), transGlow(COL.membrane,0.16,0.25));
    dome.position.y=0; CELL.add(dome);
    var membRing=TO(15,0.5,COL.membraneD,0,0.2,0,40); membRing.rotation.x=Math.PI/2; membRing.material=glow(COL.membraneD,0.35); CELL.add(membRing);
    pulse.push({mat:membRing.material,base:0.35,amp:0.18,spd:0.8,off:0});
    // membrane protein bumps around the rim
    for(var mp=0;mp<18;mp++){ var ma=mp/18*Math.PI*2; var bump=SP(0.5,mp%2?COL.membraneD:COL.gold,Math.cos(ma)*15,0.4,Math.sin(ma)*15,8); bump.scale.y=0.7; CELL.add(bump); }
    organelles.membrane=dome;

    // NUCLEUS (big, violet, with pores + nucleolus) — the landmark centerpiece
    var nuc=new THREE.Group(); nuc.position.set(0,4.5,0); CELL.add(nuc);
    var nucShell=SP(4,COL.nucleus,0,0,0,18); nucShell.material=transGlow(COL.nucleus,0.55,0.3); nuc.add(nucShell);
    nuc.add(SP(1.4,COL.nucleolus,0.5,0.3,0,12));
    for(var np=0;np<10;np++){ var na=np/10*Math.PI*2, nb=(np%3)*0.5; nuc.add(TO(0.35,0.12,COL.pore,Math.cos(na)*3.9,Math.sin(nb)*2,Math.sin(na)*3.9,10)); }
    bob.push({obj:nuc,baseY:4.5,amp:0.2,spd:0.5,off:0});
    organelles.nucleus=nuc;

    // MITOCHONDRIA (kidney-bean shape w/ cristae) ×2
    function mito(x,z,ry){
      var m=new THREE.Group(); m.position.set(x,2.2,z); m.rotation.y=ry||0;
      var body=SP(2.2,COL.mito,0,0,0,14); body.scale.set(1.6,0.9,1); m.add(body);
      var inner=SP(1.9,COL.mitoMembrane,0,0,0,12); inner.scale.set(1.5,0.8,0.9); inner.material=trans(COL.mitoMembrane,0.5); m.add(inner);
      // cristae folds
      for(var c=0;c<6;c++){ var cr=B(0.12,1.2,2.4,COL.mitoCrista,-2.2+c*0.8,0,0); cr.rotation.x=Math.sin(c)*0.3; m.add(cr); }
      bob.push({obj:m,baseY:2.2,amp:0.15,spd:0.7,off:x}); CELL.add(m); return m;
    }
    organelles.mito=mito(-8,6,0.5); mito(7,-7,-0.4);

    // CHLOROPLAST (green, with thylakoid stacks) — teaches plant cell
    var chl=new THREE.Group(); chl.position.set(8,2.2,5);
    var chlBody=SP(2.4,COL.chloro,0,0,0,14); chlBody.scale.set(1.7,0.8,1); chl.material=trans(COL.chloro,0.6); chlBody.material=transGlow(COL.chloro,0.7,0.2); chl.add(chlBody);
    for(var gr=0;gr<4;gr++){ var ga=gr/4*Math.PI*2; for(var st=0;st<3;st++){ chl.add(CY(0.5,0.5,0.18,COL.chloroStack,Math.cos(ga)*1.4,-0.3+st*0.35,Math.sin(ga)*0.8,10)); } }
    CELL.add(chl); bob.push({obj:chl,baseY:2.2,amp:0.12,spd:0.6,off:2}); organelles.chloro=chl;

    // LYSOSOME (small gold spheres) + VACUOLE (big cyan bubble)
    var lyso=SP(1.3,COL.lyso,-6,1.6,-6,12); lyso.material=glow(COL.lyso,0.3); CELL.add(lyso); bob.push({obj:lyso,baseY:1.6,amp:0.18,spd:1.1,off:1}); organelles.lyso=lyso;
    CELL.add(SP(0.9,COL.lysoD,-7.5,1.2,-4,10));
    var vac=SP(2.6,COL.vacuole,4,2.4,-7,14); vac.material=transGlow(COL.vacuole,0.4,0.25); CELL.add(vac); bob.push({obj:vac,baseY:2.4,amp:0.16,spd:0.5,off:3});

    // GOLGI (stacked folded sacs) + ER ribbon w/ ribosomes
    var golgi=new THREE.Group(); golgi.position.set(-4,1.8,7);
    for(var gs=0;gs<4;gs++){ var sac=TO(1.2-gs*0.18,0.22,gs%2?COL.golgiA:COL.golgiB,0,gs*0.45,0,16); sac.rotation.x=Math.PI/2.2; golgi.add(sac); }
    CELL.add(golgi);
    var er=new THREE.Group(); er.position.set(2,1.4,8);
    for(var e=0;e<5;e++){ var rib=B(3,0.2,0.5,COL.er,0,e*0.5,Math.sin(e)*0.6); er.add(rib); for(var rb=0;rb<4;rb++){ er.add(SP(0.12,COL.ribo,-1.2+rb*0.8,e*0.5,Math.sin(e)*0.6+0.35,6)); } }
    CELL.add(er);

    // floating cytoplasm motes
    for(var ci=0;ci<10;ci++){ var cm=SP(0.18,COL.membrane,(Math.random()-0.5)*22,1+Math.random()*7,(Math.random()-0.5)*22,6); cm.material=glow(COL.membrane,0.5); CELL.add(cm); bob.push({obj:cm,baseY:cm.position.y,amp:0.6,spd:0.5+Math.random(),off:ci}); }

    // ====================================================================
    //  BODY-SYSTEMS TRAVEL AREA — tissue → organ → system (on +X half)
    // ====================================================================
    var BODY=new THREE.Group(); BODY.position.set(16,0,2); root.add(BODY);

    // VESSEL corridor (a tube you travel through; red blood cells flow)
    var vessel=new THREE.Group(); vessel.position.set(-4,0,-9);
    var tube=new THREE.Mesh(new THREE.CylinderGeometry(3,3,16,16,1,true), trans(COL.vessel,0.4)); tube.rotation.z=Math.PI/2; tube.position.y=3; vessel.add(tube);
    for(var vr=0;vr<8;vr++){ var ring=TO(3,0.25,COL.vesselWall,-7+vr*2,3,0,16); ring.rotation.y=Math.PI/2; vessel.add(ring); }
    // RBCs flowing through
    for(var rc=0;rc<6;rc++){ var rbc=SP(0.6,COL.rbc,-7+rc*2.4,3,(Math.random()-0.5)*2,10); rbc.scale.set(1,0.45,1); vessel.add(rbc); flow.push({obj:rbc,axis:'x',min:-8,max:8,spd:2+Math.random(),base:3}); }
    BODY.add(vessel); systems.vessel=vessel;

    // LUNG chamber (cluster of alveoli sacs)
    var lung=new THREE.Group(); lung.position.set(4,0,3);
    var lungBody=SP(4,COL.lung,0,4,0,14); lungBody.material=trans(COL.lung,0.5); lung.add(lungBody);
    for(var al=0;al<12;al++){ var aa=al/12*Math.PI*2, ab=(al%3)*0.6; var sac=SP(1+(al%2)*0.4,COL.lungD,Math.cos(aa)*3.5,3+Math.sin(ab)*2.5,Math.sin(aa)*3.5,9); sac.material=trans(COL.lungD,0.7); lung.add(sac); bob.push({obj:sac,baseY:sac.position.y,amp:0.18,spd:1.2,off:al}); }
    BODY.add(lung); systems.lung=lung;

    // HEART chamber (pumping muscle w/ valve)
    var heart=new THREE.Group(); heart.position.set(2,0,12);
    var hBody=SP(3.5,COL.heart,0,4,0,14); hBody.scale.set(1,1.1,0.9); heart.add(hBody);
    heart.add(SP(2.2,COL.heartD,1.5,6,0,12)); heart.add(SP(1.8,COL.heartD,-1.6,6,0,12));
    var valve=TO(1.2,0.4,COL.valve,0,1.2,2,14); valve.rotation.x=Math.PI/2; heart.add(valve);
    // vessels off the top
    var aorta=CY(0.7,0.9,3,COL.vessel,0,7.5,-0.5,10); aorta.rotation.z=0.3; heart.add(aorta);
    BODY.add(heart); systems.heart=heart;
    pulse.push({obj:hBody,scale:true,base:1,amp:0.06,spd:2.2,off:0}); // heartbeat scale

    // signposts: tissue → organ → system
    function tube_arrow(x,z){ var s=new THREE.Group(); s.position.set(x,0,z); s.add(CY(0.1,0.12,2,COL.wood,0,1,0,6)); s.add(B(1.8,0.45,0.12,COL.accent,0,1.7,0)); root.add(s); }

    // ---- SCHOOLHOUSE (cyan-roofed, organic-trimmed) ----------------------
    function schoolhouse(x,z,ry){
      var s=new THREE.Group(); s.position.set(x,0,z); s.rotation.y=ry||0;
      s.add(B(5,3.2,4,COL.plank,0,1.6,0));
      var roof=CO(4.2,2.2,COL.membraneD,0,4.2,0,4); roof.rotation.y=Math.PI/4; s.add(roof);
      s.add(B(1.2,1.4,1.2,COL.wood,0,4.4,0));
      var spire=CO(0.9,1.4,COL.accent,0,5.6,0,4); spire.rotation.y=Math.PI/4; spire.material=glow(COL.accent,0.5); s.add(spire);
      s.add(SP(0.25,COL.gold,0,6.4,0,8));
      s.add(B(1.2,1.8,0.2,COL.dark,0,0.9,2.05));
      s.add(B(1.0,1.0,0.16,COL.white,-1.6,1.8,2.05)); s.add(B(1.0,1.0,0.16,COL.white,1.6,1.8,2.05));
      s.add(B(2.6,0.6,0.16,COL.gold,0,2.9,2.05));
      root.add(s); return s;
    }
    var school=schoolhouse(-5,33,Math.PI);

    // ---- BOSS ARENA — "The Contagion" (infected chamber, menacing not gory)
    function bossArena(x,z){
      var b=new THREE.Group(); b.position.set(x,0,z);
      var plat=CY(8,8.6,0.7,COL.stoneD,0,0.35,0,28); b.add(plat);
      var top=disc(7.4,COL.cytoD,0,0.72,0,28); b.add(top);
      var ring=TO(6.6,0.22,COL.accent,0,0.78,0,40); ring.material=glow(COL.accent,0.6); ring.rotation.x=Math.PI/2; b.add(ring);
      pulse.push({mat:ring.material,base:0.6,amp:0.25,spd:1.0,off:1});
      // sickly purple "infection" pods around the rim (the corruption motif)
      for(var p=0;p<7;p++){ var pa=p/7*Math.PI*2; var pod=SP(0.9,0x7c4acf,Math.cos(pa)*6.2,1.4,Math.sin(pa)*6.2,9); pod.material=glow(0x7c4acf,0.4); b.add(pod); var stalk=CY(0.18,0.22,1.4,0x5a3a9a,Math.cos(pa)*6.2,0.8,Math.sin(pa)*6.2,6); b.add(stalk); bob.push({obj:pod,baseY:1.4,amp:0.15,spd:1+p*0.1,off:p}); }
      // central viral capsid (icosahedron) hovering
      var capsid=new THREE.Mesh(new THREE.IcosahedronGeometry(1.8),glow(0x9a4acf,0.5)); capsid.position.y=3.5; b.add(capsid); spin.push({obj:capsid,spd:0.6}); bob.push({obj:capsid,baseY:3.5,amp:0.25,spd:0.8,off:0});
      // spike proteins
      for(var sk=0;sk<8;sk++){ var ska=sk/8*Math.PI*2; var spike=CO(0.18,0.6,0xc07aef,Math.cos(ska)*1.9,3.5,Math.sin(ska)*1.9,5); b.add(spike); }
      root.add(b); return b;
    }
    var arena=bossArena(0,-18);

    // ---- RAIL-RACER launch pad (bloodstream ride start) ------------------
    function launchPad(x,z,ry){
      var l=new THREE.Group(); l.position.set(x,0,z); l.rotation.y=ry||0;
      l.add(B(4,0.4,7,COL.stoneD,0,0.2,0));
      l.add(B(4.4,0.15,7.4,COL.accent,0,0.05,0));
      l.add(B(0.5,4,0.5,COL.wood,-2.2,2,-3)); l.add(B(0.5,4,0.5,COL.wood,2.2,2,-3));
      l.add(B(5,0.7,0.6,COL.gold,0,4,-3));
      // a vessel-mouth the racer dives into
      var mouth=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,2,16,1,true),trans(COL.vessel,0.5)); mouth.rotation.x=Math.PI/2; mouth.position.set(0,1.6,3); l.add(mouth);
      for(var c=0;c<5;c++){ var lt=SP(0.18,c%2?COL.accent:COL.gold,-1.6+c*0.8,4,-3,8); lt.material=glow(c%2?COL.accent:COL.gold,0.7); l.add(lt); pulse.push({mat:lt.material,base:0.7,amp:0.3,spd:2+c*0.2,off:c}); }
      root.add(l); return l;
    }
    var pad=launchPad(30,28,-0.7);

    // ---- animation + API --------------------------------------------------
    var clock=0;
    root.animate=function(dt){ dt=dt||0.016; clock+=dt;
      for(var i=0;i<pulse.length;i++){ var p=pulse[i];
        if(p.scale){ var sf=p.base+Math.sin(clock*p.spd+p.off)*p.amp; p.obj.scale.setScalar(sf); }
        else if(p.mat){ p.mat.emissiveIntensity=p.base+Math.sin(clock*p.spd+p.off)*p.amp; }
      }
      for(var j=0;j<bob.length;j++){ var b=bob[j]; b.obj.position.y=b.baseY+Math.sin(clock*b.spd+b.off)*b.amp; }
      for(var k=0;k<spin.length;k++){ spin[k].obj.rotation.y+=dt*spin[k].spd; }
      for(var f=0;f<flow.length;f++){ var fl=flow[f]; fl.obj.position.x+=dt*fl.spd; if(fl.obj.position.x>fl.max) fl.obj.position.x=fl.min; }
    };
    root.organelles=organelles; root.systems=systems; root.schoolhouse=school; root.bossArena=arena; root.launchPad=pad;
    root.cellDistrict=CELL; root.bodyDistrict=BODY; root.accent=ACCENT;
    return root;
  }

  global.InnerVastsForge={ build:build, ACCENT:ACCENT, COLORS:COL };
})(typeof window!=='undefined'?window:this);
