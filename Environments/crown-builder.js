/* ============================================================================
 * crown-builder.js  —  ENGINE-READY environment for Three.js r128
 * ----------------------------------------------------------------------------
 * THE CROWN — the gated FINALE ZONE: the luminous canopy of the World Tree
 * coming back to life. Tone: HOPEFUL restoration (the Tree is waking), epic.
 * Strand colors echo the five zones the player cleared.
 *
 *   const c = CrownForge.build();
 *   scene.add(c); c.animate(dt);
 *   c.setRestoration(0..1);   // 0 = dim/withered, 1 = full radiant glow
 *   c.beacons[i] / c.bossArena
 *
 * The five Strand-beacon colors (same as the zones / the intro cutscene):
 *   violet #7c63ff · cyan #4cc9f0 · bright-green #43c785 · emerald #2fa36b · steel #b7c0cc
 * ========================================================================== */
(function (global) {
  var STRANDS = [0x7c63ff, 0x4cc9f0, 0x43c785, 0x2fa36b, 0xb7c0cc];
  var COL = {
    bark:0x5a3f28, barkD:0x3f2c1c, canopyA:0x2fa36b, canopyB:0x43c785, canopyC:0x6fe0a0,
    core:0xffe39a, gold:0xe6b84c, leaf:0x8fe6b0, leafBright:0xc8f5da,
    platform:0x9a7a4c, platformGlow:0xe6b84c, stone:0x8a8f9a, dark:0x14241c, white:0xf2f1ec
  };

  function build(opts){
    opts=opts||{};
    var THREE=global.THREE;
    var cache={};
    function mat(c){ if(!cache['m'+c]) cache['m'+c]=new THREE.MeshLambertMaterial({color:c}); return cache['m'+c]; }
    function glow(c,i){ var k='g'+c+(i||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:(i==null?0.6:i)}); return cache[k]; }
    function trans(c,o,e){ var k='t'+c+o+(e||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:e||0,transparent:true,opacity:o,side:THREE.DoubleSide}); return cache[k]; }
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||10),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||12; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(6,seg-4)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||9),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,7,seg||24),mat(c)); m.position.set(x||0,y||0,z||0); return m; }

    var root=new THREE.Group();
    var pulse=[], bob=[], spin=[], shafts=[], glows=[];   // glows = materials whose intensity scales w/ restoration
    var beacons=[];
    var restoration={v:0.35};   // current restoration level (0..1)

    function regGlow(m, lo, hi){ glows.push({mat:m, lo:lo, hi:hi}); return m; }

    // ---- CANOPY PLATFORM (the upper boughs you stand on) -----------------
    var plat=new THREE.Group(); root.add(plat);
    var deck=CY(20,21,1.2,COL.platform,0,0,0,40); plat.add(deck);
    var deckGlowMat=regGlow(glow(COL.platformGlow,0.3),0.05,0.6);
    var deckRing=TO(19,0.4,COL.platformGlow,0,0.7,0,48); deckRing.material=deckGlowMat; deckRing.rotation.x=Math.PI/2; plat.add(deckRing);
    pulse.push({mat:deckGlowMat,base:0.3,amp:0.12,spd:0.8,off:0,restGlow:true});
    // radiating bough struts under the deck (suggests we're up in the tree)
    for(var b=0;b<8;b++){ var ba=b/8*Math.PI*2; var bough=CY(0.8,1.4,14,COL.bark,0,-3,0,7); var bg=new THREE.Group(); bg.rotation.y=-ba; bg.rotation.x=0.5; bough.position.set(0,-3,7); bg.add(bough); plat.add(bg); }
    // leafy clusters spilling over the platform edge
    for(var lc=0;lc<14;lc++){ var la=lc/14*Math.PI*2; var leaf=SP(2.2+(lc%3)*0.6,lc%2?COL.canopyA:COL.canopyB,Math.cos(la)*19,-0.5,Math.sin(la)*19,9); leaf.scale.y=0.7; plat.add(leaf);
      var bright=SP(1.0,COL.leafBright,Math.cos(la)*19,0.4,Math.sin(la)*19,7); bright.material=regGlow(glow(COL.canopyC,0.2),0.0,0.5); plat.add(bright); }

    // ---- THE WORLD TREE CROWN (great glowing core rising through center) -
    var trunk=CY(2.4,3.2,10,COL.bark,0,4,0,12); plat.add(trunk);
    var coreOrb=SP(2.4,COL.core,0,9,0,16); var coreMat=regGlow(glow(COL.core,0.5),0.2,1.1); coreOrb.material=coreMat; plat.add(coreOrb);
    pulse.push({mat:coreMat,base:0.5,amp:0.2,spd:1.0,off:0,restGlow:true});
    bob.push({obj:coreOrb,baseY:9,amp:0.3,spd:0.6,off:0});
    // upper canopy blobs around the core — glowing leaves
    var canopyDefs=[[0,12,0,5,COL.canopyB],[3.5,13,2,3.6,COL.canopyA],[-3.5,13,-2,3.6,COL.canopyC],[1.5,15,-2.5,3.8,COL.canopyA],[-1.5,15,2.5,3.6,COL.canopyB],[0,17,0,3.4,COL.canopyC]];
    canopyDefs.forEach(function(d,i){ var blob=SP(d[3],d[4],d[0],d[1],d[2],12); blob.scale.y=0.85; plat.add(blob); bob.push({obj:blob,baseY:d[1],amp:0.18,spd:0.5+0.1*i,off:i*0.8}); });

    // ---- LIGHT SHAFTS (thin translucent cones beaming down) --------------
    for(var s=0;s<6;s++){ var sa=s/6*Math.PI*2; var shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.4,3.2,18,10,1,true), trans(COL.core,0.1,0.4)); shaft.position.set(Math.cos(sa)*8,9,Math.sin(sa)*8); shaft.rotation.z=Math.cos(sa)*0.15; shaft.rotation.x=Math.sin(sa)*0.15; plat.add(shaft); var sm=regGlow(shaft.material,0.0,0.2); shafts.push({mat:shaft.material,base:0.1}); }

    // ---- DRIFTING MOTES (gold light specks rising) -----------------------
    for(var mo=0;mo<24;mo++){ var ma=Math.random()*Math.PI*2, mr=Math.random()*18; var mote=SP(0.12+Math.random()*0.1,COL.gold,Math.cos(ma)*mr,1+Math.random()*16,Math.sin(ma)*mr,6); mote.material=regGlow(glow(COL.gold,0.4),0.1,0.9); plat.add(mote); bob.push({obj:mote,baseY:mote.position.y,amp:0.8+Math.random(),spd:0.4+Math.random()*0.6,off:mo}); }

    // ---- FIVE STRAND-BEACONS around the rim ------------------------------
    STRANDS.forEach(function(col,i){
      var a=-Math.PI/2 + i*(Math.PI*2/5);
      var g=new THREE.Group(); g.position.set(Math.cos(a)*15,0.6,Math.sin(a)*15);
      // pedestal
      g.add(CY(1.0,1.3,2.2,COL.stone,0,1.1,0,8));
      // floating beacon crystal
      var crystal=new THREE.Mesh(new THREE.OctahedronGeometry(1.0), glow(col,0.7)); crystal.position.y=3.6; g.add(crystal);
      spin.push({obj:crystal,spd:0.7}); bob.push({obj:crystal,baseY:3.6,amp:0.2,spd:0.9,off:i});
      var cMat=regGlow(crystal.material,0.25,1.0); pulse.push({mat:cMat,base:0.7,amp:0.25,spd:1.2,off:i,restGlow:true});
      // beacon light beam up
      var beam=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,8,10,1,true), trans(col,0.12,0.5)); beam.position.y=7.5; g.add(beam); regGlow(beam.material,0.0,0.4);
      // ring at the base
      var ring=TO(1.4,0.12,col,0,0.3,0,24); ring.material=glow(col,0.5); ring.rotation.x=Math.PI/2; g.add(ring); regGlow(ring.material,0.1,0.7);
      plat.add(g); beacons.push(g);
    });

    // ---- FINAL BOSS ARENA — "The Withering" (central, restorable) --------
    var arena=new THREE.Group(); arena.position.set(0,0.6,0); root.add(arena);
    // the arena sits as an inner ring on the platform around the trunk
    var aRing=TO(7,0.3,COL.platformGlow,0,0.3,0,48); var aRingMat=regGlow(glow(COL.platformGlow,0.2),0.0,0.8); aRing.material=aRingMat; aRing.rotation.x=Math.PI/2; arena.add(aRing);
    pulse.push({mat:aRingMat,base:0.2,amp:0.15,spd:1.1,off:0,restGlow:true});
    // withered tendrils around the arena that "heal" (color lerps grey→green w/ restoration)
    var tendrils=[];
    for(var t=0;t<8;t++){ var ta=t/8*Math.PI*2; var tg=new THREE.Group(); tg.position.set(Math.cos(ta)*6.5,0,Math.sin(ta)*6.5); tg.rotation.y=-ta;
      var stalk=CY(0.18,0.28,2.6,0x6e6a58,0,1.3,0,6); stalk.rotation.x=-0.3; tg.add(stalk);
      var bud=SP(0.6,0x6e6a58,0,2.6,0.6,8); tg.add(bud);
      arena.add(tg); tendrils.push({stalk:stalk.material,bud:bud.material}); }
    // central boss "Withering" mass — dim dodecahedron that brightens as restored
    var wither=new THREE.Mesh(new THREE.DodecahedronGeometry(2.0), glow(0x4a4838,0.15)); wither.position.y=4.5; arena.add(wither);
    spin.push({obj:wither,spd:0.3}); bob.push({obj:wither,baseY:4.5,amp:0.25,spd:0.5,off:0});

    // ---- distant vistas (low ghostly tree silhouettes on the horizon) ----
    for(var v=0;v<5;v++){ var va=v/5*Math.PI*2+0.3; var vg=new THREE.Group(); vg.position.set(Math.cos(va)*44,-4,Math.sin(va)*44);
      vg.add(CY(1.2,1.8,8,COL.barkD,0,4,0,6)); var vc=SP(5,COL.canopyA,0,11,0,9); vc.material=trans(COL.canopyA,0.45); vg.add(vc); vg.scale.setScalar(1.4); root.add(vg); }

    // ---- animation + API --------------------------------------------------
    var clock=0;
    var cGrey=new THREE.Color(0x6e6a58), cGreen=new THREE.Color(0x43c785), cBudG=new THREE.Color(0x8fe6b0), tmpC=new THREE.Color();
    var cWitherDim=new THREE.Color(0x4a4838), cWitherBright=new THREE.Color(0xc8f5da);
    function applyRestoration(){
      var r=restoration.v;
      for(var i=0;i<glows.length;i++){ var g=glows[i]; g.mat.emissiveIntensity=g.lo+(g.hi-g.lo)*r; }
      // heal tendrils
      for(var t=0;t<tendrils.length;t++){ tmpC.copy(cGrey).lerp(cGreen,r); tendrils[t].stalk.color.copy(tmpC); tmpC.copy(cGrey).lerp(cBudG,r); tendrils[t].bud.color.copy(tmpC); }
      // brighten the withering core
      tmpC.copy(cWitherDim).lerp(cWitherBright,r); wither.material.color.copy(tmpC); wither.material.emissive.copy(tmpC); wither.material.emissiveIntensity=0.15+0.7*r;
    }
    applyRestoration();

    root.animate=function(dt){ dt=dt||0.016; clock+=dt;
      for(var i=0;i<pulse.length;i++){ var p=pulse[i]; if(p.mat){ var baseI=p.restGlow? (p.base*(0.4+0.6*restoration.v)) : p.base; p.mat.emissiveIntensity=baseI+Math.sin(clock*p.spd+p.off)*p.amp*(0.4+0.6*restoration.v); } }
      for(var j=0;j<bob.length;j++){ var b=bob[j]; b.obj.position.y=b.baseY+Math.sin(clock*b.spd+b.off)*b.amp; }
      for(var k=0;k<spin.length;k++){ spin[k].obj.rotation.y+=dt*spin[k].spd; }
    };
    root.setRestoration=function(v){ restoration.v=Math.max(0,Math.min(1,v)); applyRestoration(); };
    root.getRestoration=function(){ return restoration.v; };
    root.beacons=beacons; root.bossArena=arena; root.STRANDS=STRANDS;
    return root;
  }

  global.CrownForge={ build:build, STRANDS:STRANDS, COLORS:COL };
})(typeof window!=='undefined'?window:this);
