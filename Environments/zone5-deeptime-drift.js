/* ============================================================================
 * zone5-deeptime-drift.js  —  ENGINE-READY environment for Three.js r128
 * ----------------------------------------------------------------------------
 * ZONE 5 — THE DEEPTIME DRIFT  (S7L5 · Evolution & Natural Selection)
 * Theme: a shifting strata-of-time canyon.  Strand/accent: steel #b7c0cc.
 * Ancient, weathered, awe-inspiring; cool palette.
 *
 *   const z = DeeptimeDriftForge.build();
 *   scene.add(z); z.animate(dt);
 *   z.canyon / z.warmZone / z.coldZone
 *   z.schoolhouse / z.bossArena / z.launchPad
 * ========================================================================== */
(function (global) {
  var ACCENT = 0xb7c0cc;  // steel Strand
  var COL = {
    accent:ACCENT, gold:0xe6b84c, white:0xf2f1ec, dark:0x1a1f26,
    wood:0x6e4a28, woodD:0x4a3220, plank:0x8a6238, stone:0x8a8f9a, stoneD:0x5f656e,
    // strata layers (deepest = oldest, bottom)
    strata1:0x6e5a48, strata2:0x8a6a4a, strata3:0xa8895c, strata4:0x9296a0, strata5:0xb7c0cc, strata6:0xcfd6dd,
    fossil:0xe8e0cc, fossilD:0xc8bfa6, amber:0xe6a23c, amberGlow:0xf0b85c,
    // warm climate half
    warmGround:0xb87a4a, warmRock:0xc89464, warmPlant:0x9a9a3c, warmSky:0xe0a060,
    // cold climate half
    coldGround:0xc6d2da, coldRock:0x9aa6b2, coldIce:0xbfe0ee, coldConifer:0x3a6e5a,
    // everchanging boss
    morphA:0x7c63ff, morphB:0x4cc9f0, morphC:0x43c785, morphCore:0xb7c0cc
  };

  function build(opts){
    opts=opts||{};
    var THREE=global.THREE;
    var cache={};
    function mat(c){ if(!cache['m'+c]) cache['m'+c]=new THREE.MeshLambertMaterial({color:c}); return cache['m'+c]; }
    function glow(c,i){ var k='g'+c+(i||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:(i==null?0.5:i)}); return cache[k]; }
    function trans(c,o){ var k='t'+c+o; if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,transparent:true,opacity:o,side:THREE.DoubleSide}); return cache[k]; }
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||9),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||10; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(6,seg-4)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||8),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,7,seg||18),mat(c)); m.position.set(x||0,y||0,z||0); return m; }

    var root=new THREE.Group();
    var pulse=[], bob=[], spin=[], morph=[];

    // ---- BASE GROUND (squared up so the radial station ring + pad fit) ----
    root.add(B(70,0.6,70,COL.strata1,0,-0.3,0));

    // ====================================================================
    //  SIGNATURE LANDMARK — layered STRATA CANYON with embedded fossils
    //  Two stepped walls flanking a central canyon floor (runs along X).
    // ====================================================================
    var canyon=new THREE.Group(); root.add(canyon);
    var strataCols=[COL.strata1,COL.strata2,COL.strata3,COL.strata4,COL.strata5,COL.strata6];
    function canyonWall(side){ // side = +1 (far) or -1 (near)
      var wall=new THREE.Group();
      for(var L=0;L<6;L++){
        var w=34 - L*1.2;            // narrower as it rises
        var depth=4 - L*0.3;
        var layer=B(w,2.2,depth,strataCols[L],0,1.1+L*2.0,side*(8+L*0.6));
        wall.add(layer);
        // a few jutting rocks per layer for weathered look
        for(var r=0;r<3;r++){ var rx=(Math.random()-0.5)*w*0.8; wall.add(B(1.2+Math.random(),1.6,1.2,strataCols[L],rx,1.1+L*2.0,side*(8+L*0.6)+side*depth*0.4)); }
      }
      // embedded fossils in the lower (older) layers
      for(var f=0;f<5;f++){ var fx=(Math.random()-0.5)*26, fl=Math.floor(Math.random()*3);
        // ammonite spiral (torus) or bone (capsule-ish)
        if(f%2===0){ var am=TO(0.6,0.18,COL.fossil,fx,1.5+fl*2.0,side*(8+fl*0.6)-side*1.6,16); am.material=glow(COL.fossil,0.12); wall.add(am); }
        else { var bone=CY(0.18,0.18,1.6,COL.fossilD,fx,1.5+fl*2.0,side*(8+fl*0.6)-side*1.6,6); bone.rotation.z=Math.PI/2.4; wall.add(bone); wall.add(SP(0.3,COL.fossilD,fx-0.8,1.5+fl*2.0,side*(8+fl*0.6)-side*1.6,8)); }
      }
      // amber pockets (glowing) in mid layers
      for(var a=0;a<3;a++){ var ax=(Math.random()-0.5)*24; var amb=SP(0.4,COL.amber,ax,3+a*1.5,side*(8+1.5)-side*1.6,8); amb.material=glow(COL.amberGlow,0.5); wall.add(amb); pulse.push({mat:amb.material,base:0.5,amp:0.2,spd:1.5+a,off:a}); }
      // push the whole strata wall out to the zone rim so it frames the zone instead of crowding the spawn (Derek 2026-06-30)
      wall.position.z = side*22;
      canyon.add(wall);
    }
    canyonWall(1); canyonWall(-1);
    // canyon floor (sandy basin, stretched to reach the now-distant walls) with footprint trail + a tall hoodoo spire
    var floor=B(34,0.2,58,COL.strata3,0,0.1,0); canyon.add(floor);
    for(var fp=0;fp<8;fp++){ var foot=B(0.6,0.06,0.9,COL.strataD||0x5a4a38,-12+fp*3,0.18,(fp%2?1:-1)*1.2); canyon.add(foot); }
    var hoodoo=new THREE.Group(); hoodoo.position.set(-8,0,0);
    [0,1,2,3].forEach(function(s){ hoodoo.add(B(2-s*0.3,2,2-s*0.3,strataCols[s+1],0,1+s*2,0)); });
    hoodoo.add(SP(1.4,COL.strata5,0,9,0,9)); canyon.add(hoodoo);

    // ====================================================================
    //  CLIMATE HALVES — warm zone (-x) vs cold zone (+x) for selection games
    // ====================================================================
    // WARM ZONE
    var warm=new THREE.Group(); warm.position.set(-24,0,-8); root.add(warm);
    var warmFloor=B(18,0.2,20,COL.warmGround,0,0.05,0); warm.add(warmFloor);
    for(var w=0;w<5;w++){ var rock=SP(1+Math.random()*0.8,COL.warmRock,(Math.random()-0.5)*14,0.5,(Math.random()-0.5)*16,8); rock.scale.y=0.7; warm.add(rock); }
    for(var wp=0;wp<6;wp++){ // hardy desert plants
      var dp=new THREE.Group(); dp.position.set((Math.random()-0.5)*14,0,(Math.random()-0.5)*16);
      dp.add(CY(0.25,0.3,1.2,COL.warmPlant,0,0.6,0,6)); dp.add(SP(0.5,COL.warmPlant,0,1.3,0,7)); warm.add(dp);
    }
    var warmSun=SP(1.4,COL.warmSky,6,8,-6,12); warmSun.material=glow(COL.warmSky,0.6); warm.add(warmSun); pulse.push({mat:warmSun.material,base:0.6,amp:0.12,spd:0.6,off:0});

    // COLD ZONE
    var cold=new THREE.Group(); cold.position.set(24,0,-8); root.add(cold);
    var coldFloor=B(18,0.2,20,COL.coldGround,0,0.05,0); cold.add(coldFloor);
    for(var c=0;c<6;c++){ var t=new THREE.Group(); t.position.set((Math.random()-0.5)*14,0,(Math.random()-0.5)*16); t.add(CY(0.18,0.26,0.9,COL.woodD,0,0.45,0,6)); t.add(CO(0.9,1.5,COL.coldConifer,0,1.3,0,7)); t.add(CO(0.6,1.0,COL.coldConifer,0,2.0,0,7)); cold.add(t); }
    for(var ci=0;ci<4;ci++){ var ice=CO(0.7,1.8,COL.coldIce,(Math.random()-0.5)*14,0.9,(Math.random()-0.5)*16,5); ice.material=trans(COL.coldIce,0.7); cold.add(ice); }
    for(var sn=0;sn<5;sn++){ var drift=SP(1.4,COL.white,(Math.random()-0.5)*14,0.2,(Math.random()-0.5)*16,8); drift.scale.y=0.3; cold.add(drift); }

    // ---- DEEP-TIME PROPS (museum-style, not scary) -----------------------
    // a mounted dinosaur skeleton (museum stand) — friendly, plant-eater pose
    function skeleton(x,z,ry){
      var s=new THREE.Group(); s.position.set(x,0,z); s.rotation.y=ry||0;
      s.add(B(3,0.3,1.5,COL.stoneD,0,0.15,0)); // base
      // body spine + ribs
      var spine=CY(0.16,0.16,3,COL.fossil,0,2.2,0,6); spine.rotation.z=Math.PI/2; s.add(spine);
      for(var r=0;r<5;r++){ var rib=TO(0.5,0.06,COL.fossil,-1.2+r*0.6,2.0,0,12); rib.rotation.y=Math.PI/2; s.add(rib); }
      // long neck up + small head
      var neck=CY(0.13,0.16,2.2,COL.fossil,1.6,3,0,6); neck.rotation.z=-0.7; s.add(neck);
      s.add(SP(0.3,COL.fossil,2.6,4,0,8));
      // tail
      var tail=CY(0.13,0.16,2.4,COL.fossil,-1.8,2.6,0,6); tail.rotation.z=0.7; s.add(tail);
      // legs
      [-0.8,0.8].forEach(function(lx){ s.add(CY(0.13,0.13,2,COL.fossil,lx,1.1,0.4,6)); s.add(CY(0.13,0.13,2,COL.fossil,lx,1.1,-0.4,6)); });
      root.add(s); return s;
    }
    skeleton(4,-6,0.4);
    // giant ammonite display + footprint slab + amber pillar
    var ammo=TO(1.6,0.5,COL.fossil,-6,1.6,8,20); ammo.material=glow(COL.fossil,0.1); root.add(ammo);
    var amberPillar=new THREE.Group(); amberPillar.position.set(8,0,8);
    amberPillar.add(CY(0.6,0.7,2,COL.stoneD,0,1,0,8));
    var amberBlock=new THREE.Mesh(new THREE.OctahedronGeometry(0.9),glow(COL.amberGlow,0.5)); amberBlock.position.y=2.6; amberBlock.material=trans(COL.amber,0.7); amberPillar.add(amberBlock); spin.push({obj:amberBlock,spd:0.5}); root.add(amberPillar);

    // ---- SCHOOLHOUSE ------------------------------------------------------
    function schoolhouse(x,z,ry){
      var s=new THREE.Group(); s.position.set(x,0,z); s.rotation.y=ry||0;
      s.add(B(5,3.2,4,COL.plank,0,1.6,0));
      var roof=CO(4.2,2.2,COL.stoneD,0,4.2,0,4); roof.rotation.y=Math.PI/4; s.add(roof);
      s.add(B(1.2,1.4,1.2,COL.wood,0,4.4,0));
      var spire=CO(0.9,1.4,COL.accent,0,5.6,0,4); spire.rotation.y=Math.PI/4; spire.material=glow(COL.accent,0.5); s.add(spire);
      s.add(SP(0.25,COL.gold,0,6.4,0,8));
      s.add(B(1.2,1.8,0.2,COL.woodD,0,0.9,2.05));
      s.add(B(1.0,1.0,0.16,COL.white,-1.6,1.8,2.05)); s.add(B(1.0,1.0,0.16,COL.white,1.6,1.8,2.05));
      s.add(B(2.6,0.6,0.16,COL.gold,0,2.9,2.05));
      root.add(s); return s;
    }
    var school=schoolhouse(0,15,Math.PI);

    // ---- BOSS ARENA — "The Everchanging" (subtly shifts/adapts) ----------
    function bossArena(x,z){
      var b=new THREE.Group(); b.position.set(x,0,z);
      var plat=CY(8,8.6,0.7,COL.stoneD,0,0.35,0,28); b.add(plat);
      var top=new THREE.Mesh(new THREE.CircleGeometry(7.4,28),mat(COL.strata4)); top.rotation.x=-Math.PI/2; top.position.y=0.72; b.add(top);
      var ring=TO(6.6,0.22,COL.accent,0,0.78,0,40); ring.material=glow(COL.accent,0.6); ring.rotation.x=Math.PI/2; b.add(ring);
      pulse.push({mat:ring.material,base:0.6,amp:0.25,spd:1.0,off:1});
      // strata pillars that "shift" — each cycles through morph colors
      for(var p=0;p<6;p++){ var pa=p/6*Math.PI*2; var pil=CY(0.5,0.6,3.2,COL.morphA,Math.cos(pa)*6.2,1.6,Math.sin(pa)*6.2,6); var pm=glow(COL.morphA,0.4); pil.material=pm; b.add(pil); morph.push({mat:pm,off:p}); }
      // central morphing core — geometry that pulses, color shifts
      var core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7),glow(COL.morphCore,0.5)); core.position.y=3.6; b.add(core); spin.push({obj:core,spd:0.5}); bob.push({obj:core,baseY:3.6,amp:0.25,spd:0.8,off:0});
      morph.push({mat:core.material,off:0,core:true,obj:core});
      root.add(b); return b;
    }
    var arena=bossArena(0,-16);

    // ---- RAIL-RACER launch pad (drill-pod descent through strata) --------
    function launchPad(x,z,ry){
      var l=new THREE.Group(); l.position.set(x,0,z); l.rotation.y=ry||0;
      l.add(B(4,0.4,7,COL.stoneD,0,0.2,0));
      l.add(B(4.4,0.15,7.4,COL.accent,0,0.05,0));
      l.add(B(0.5,4,0.5,COL.wood,-2.2,2,-3)); l.add(B(0.5,4,0.5,COL.wood,2.2,2,-3));
      l.add(B(5,0.7,0.6,COL.gold,0,4,-3));
      // a drill-pod (cone nose down) ready to descend
      var pod=new THREE.Group(); pod.position.set(0,1.6,2.5);
      pod.add(CY(0.9,0.9,1.6,COL.stone,0,0,0,12));
      var drill=CO(0.9,1.4,COL.accent,0,-1.4,0,8); drill.rotation.x=Math.PI; pod.add(drill);
      pod.add(TO(1.0,0.12,COL.gold,0,0.4,0,16)); l.add(pod);
      bob.push({obj:pod,baseY:1.6,amp:0.12,spd:1.5,off:0});
      for(var c=0;c<5;c++){ var lt=SP(0.18,c%2?COL.accent:COL.gold,-1.6+c*0.8,4,-3,8); lt.material=glow(c%2?COL.accent:COL.gold,0.7); l.add(lt); pulse.push({mat:lt.material,base:0.7,amp:0.3,spd:2+c*0.2,off:c}); }
      root.add(l); return l;
    }
    var pad=launchPad(0,28,Math.PI);

    // ---- animation + API --------------------------------------------------
    var clock=0;
    var morphPalette=[COL.morphA,COL.morphB,COL.morphC,COL.morphCore];
    var tmp=new THREE.Color(), ca=new THREE.Color(), cb=new THREE.Color();
    root.animate=function(dt){ dt=dt||0.016; clock+=dt;
      for(var i=0;i<pulse.length;i++){ var p=pulse[i]; if(p.mat) p.mat.emissiveIntensity=p.base+Math.sin(clock*p.spd+p.off)*p.amp; }
      for(var j=0;j<bob.length;j++){ var b=bob[j]; if(b.amp) b.obj.position.y=b.baseY+Math.sin(clock*b.spd+b.off)*b.amp; }
      for(var k=0;k<spin.length;k++){ spin[k].obj.rotation.y+=dt*spin[k].spd; }
      // "everchanging" color morph
      for(var mI=0;mI<morph.length;mI++){ var m=morph[mI];
        var phase=(clock*0.4+m.off)%morphPalette.length; var i0=Math.floor(phase), f=phase-i0;
        ca.setHex(morphPalette[i0%morphPalette.length]); cb.setHex(morphPalette[(i0+1)%morphPalette.length]);
        tmp.copy(ca).lerp(cb,f); m.mat.color.copy(tmp); m.mat.emissive.copy(tmp);
        if(m.core && m.obj){ var sc=1+Math.sin(clock*1.3)*0.08; m.obj.scale.setScalar(sc); }
      }
    };
    root.canyon=canyon; root.warmZone=warm; root.coldZone=cold; root.schoolhouse=school; root.bossArena=arena; root.launchPad=pad; root.accent=ACCENT;
    return root;
  }

  global.DeeptimeDriftForge={ build:build, ACCENT:ACCENT, COLORS:COL };
})(typeof window!=='undefined'?window:this);
