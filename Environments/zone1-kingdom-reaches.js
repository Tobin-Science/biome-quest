/* ============================================================================
 * zone1-kingdom-reaches.js  —  ENGINE-READY environment for Three.js r128
 * ----------------------------------------------------------------------------
 * ZONE 1 — THE KINGDOM REACHES  (S7L1 · Classification & the six kingdoms)
 * Theme: a crossroads where six biome-regions meet. Strand/accent: violet #7c63ff.
 *
 * Same conventions as the other builders (global, global THREE, Lambert,
 * low-poly, no shadows, Chromebook-safe, school-appropriate).
 *
 *   const z = KingdomReachesForge.build();
 *   scene.add(z);
 *   z.animate(dt);                 // steam, spores, water shimmer, portal pulse
 *   z.regions['fungi'].position;   // anchor of each kingdom region
 *   z.schoolhouse / z.bossArena / z.launchPad   // key landmarks
 *
 * Six regions (color-coded): fungi · monera · plant · animal · protist · archaea
 * ========================================================================== */
(function (global) {
  var ACCENT = 0x7c63ff;  // violet Strand
  var COL = {
    ground:0x4a7a44, groundD:0x3c6638, crossroad:0x8a8f6e, path:0x9a8a5c,
    stone:0x9296a0, stoneD:0x6f7480, wood:0x7c5230, woodD:0x553820, plank:0x9a6a3c,
    accent:ACCENT, gold:0xe6b84c, white:0xf2f1ec, dark:0x20242e,
    // fungi
    mushStem:0xece3d0, mushCapA:0xd8654c, mushCapB:0xc24a6a, spore:0xf2d9a0,
    // monera (algae/bacteria pool)
    algae:0x2fa36b, water:0x2f8f9e, scum:0x6fbf7a,
    // plant glade
    leaf:0x3f9e4a, leafD:0x2f7a39, flowerA:0xe6b84c, flowerB:0xd86a9a, stem:0x3a6e3a,
    // animal wild
    grass:0x6aa24a, rock:0x8a7f6c, log:0x6e4a28, hide:0xb98a52,
    // protist marsh
    marsh:0x4a7a6e, mud:0x5a5238, blob:0x6fb6a0, blobD:0x4a8f86,
    // archaea hot-spring
    spring:0xe6b84c, springRim:0xb98a3c, steamRock:0x8a6a52, steam:0xeef0ea
  };

  var REGION_DEFS = [
    { key:'fungi',   name:'Fungal Grove',     tint:0x6e5a3a },
    { key:'monera',  name:'Bacteria Pool',    tint:0x2f7a6a },
    { key:'plant',   name:'Plant Glade',      tint:0x3f8e44 },
    { key:'animal',  name:'Animal Wild',      tint:0x6a9a44 },
    { key:'protist', name:'Protist Marsh',    tint:0x4a7a6e },
    { key:'archaea', name:'Archaea Springs',  tint:0x9a7a3c }
  ];

  function build(opts){
    opts = opts || {};
    var THREE = global.THREE;
    var cache={};
    function mat(c){ if(!cache['m'+c]) cache['m'+c]=new THREE.MeshLambertMaterial({color:c}); return cache['m'+c]; }
    function glow(c,i){ var k='g'+c+(i||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:(i==null?0.55:i)}); return cache[k]; }
    function trans(c,o){ var k='t'+c+o; if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,transparent:true,opacity:o}); return cache[k]; }
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||9),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||10; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(6,seg-4)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||8),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,6,seg||18),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function disc(r,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CircleGeometry(r,seg||24),mat(c)); m.rotation.x=-Math.PI/2; m.position.set(x||0,y||0,z||0); return m; }

    var root=new THREE.Group();
    var pulse=[], bob=[], spin=[], steam=[];
    var regions={};

    // ---- BASE GROUND ------------------------------------------------------
    var groundR=34;
    root.add(CY(groundR, groundR+1, 0.6, COL.ground, 0,-0.3,0, 36));

    // central CROSSROADS plaza
    var plaza=disc(7, COL.crossroad, 0,0.05,0,28); root.add(plaza);
    var plazaRing=TO(6.6,0.18,COL.accent,0,0.12,0,40); plazaRing.material=glow(COL.accent,0.55); plazaRing.rotation.x=Math.PI/2; root.add(plazaRing);
    pulse.push({mat:plazaRing.material,base:0.55,amp:0.22,spd:1.3,off:0});
    // central waystone / six-kingdoms marker (hexagonal pillar w/ violet crystal)
    var way=new THREE.Group();
    way.add(CY(1.2,1.5,2.6,COL.stone,0,1.3,0,6));
    var crystal=new THREE.Mesh(new THREE.OctahedronGeometry(0.9),glow(COL.accent,0.85)); crystal.position.y=3.4; way.add(crystal);
    spin.push({obj:crystal,spd:0.8}); bob.push({obj:crystal,baseY:3.4,amp:0.18,spd:1.1,off:0});
    pulse.push({mat:crystal.material,base:0.85,amp:0.3,spd:1.5,off:0.5});
    root.add(way);

    // six radiating paths to the regions
    var R=20;
    for(var i=0;i<6;i++){
      var a=i/6*Math.PI*2;
      var path=B(2.4, 0.08, R-7, COL.path, 0, 0.04, 0);
      var pg=new THREE.Group(); pg.rotation.y=-a; pg.add(path); path.position.z=(R-7)/2+3.5; root.add(pg);
    }

    // ---- REGION BUILDERS --------------------------------------------------
    function regionBase(g, tint, rr){ g.add(disc(rr||6, tint, 0,0.06,0,22)); }

    function fungiGrove(g){
      regionBase(g, COL.ground, 6.5);
      // giant mushrooms
      [[0,0,2.4,COL.mushCapA],[ -2.6,1.2,1.7,COL.mushCapB],[2.4,-1.5,1.9,COL.mushCapA],[1.0,2.6,1.4,COL.mushCapB],[-1.8,-2.4,1.5,COL.mushCapA]].forEach(function(m,k){
        var stemH=m[2]*1.4;
        g.add(CY(m[2]*0.28,m[2]*0.34,stemH,COL.mushStem,m[0],stemH/2,m[1],8));
        var cap=SP(m[2],m[3],m[0],stemH+m[2]*0.3,m[1],10); cap.scale.y=0.6; g.add(cap);
        // spots
        for(var s=0;s<4;s++){ var sa=s/4*Math.PI*2; g.add(SP(m[2]*0.14,COL.spore,m[0]+Math.cos(sa)*m[2]*0.55,stemH+m[2]*0.42,m[1]+Math.sin(sa)*m[2]*0.55,6)); }
      });
      // drifting spores
      for(var sp=0;sp<6;sp++){ var spm=SP(0.1,COL.spore,(Math.random()-0.5)*8,2+Math.random()*2,(Math.random()-0.5)*8,6); spm.material=glow(COL.spore,0.6); g.add(spm); bob.push({obj:spm,baseY:spm.position.y,amp:0.6,spd:0.6+Math.random(),off:sp}); }
    }
    function bacteriaPool(g){
      regionBase(g, COL.groundD, 6.5);
      var pool=disc(5, COL.water, 0,0.1,0,26); pool.material=trans(COL.water,0.9); g.add(pool);
      var poolRing=TO(5,0.3,COL.algae,0,0.12,0,28); poolRing.rotation.x=Math.PI/2; g.add(poolRing);
      // algae scum islands + bacterial rods
      for(var k=0;k<7;k++){ var ka=k/7*Math.PI*2, kr=1.5+Math.random()*2.5; var blob=SP(0.5+Math.random()*0.4,COL.scum,Math.cos(ka)*kr,0.25,Math.sin(ka)*kr,8); blob.scale.y=0.4; g.add(blob); }
      for(var rod=0;rod<5;rod++){ var ra=rod/5*Math.PI*2; var c=CY(0.12,0.12,0.8,COL.algae,Math.cos(ra)*3,0.5,Math.sin(ra)*3,6); c.rotation.z=0.5; g.add(c); }
      pulse.push({mat:pool.material,base:0,amp:0,spd:0,off:0}); // (water shimmer handled via opacity tween below)
      steam.push({type:'shimmer',mat:pool.material});
    }
    function plantGlade(g){
      regionBase(g, 0x3f8e44, 6.5);
      // ferns (fan of leaves) + flowers
      for(var f=0;f<6;f++){ var fa=f/6*Math.PI*2, fr=2+ (f%2); var fx=Math.cos(fa)*fr, fz=Math.sin(fa)*fr;
        for(var b=0;b<5;b++){ var blade=CO(0.18,1.6,COL.leaf,fx,0.8,fz,5); blade.rotation.set((b-2)*0.18, b*1.2, (b-2)*0.2); g.add(blade); }
      }
      [[1.5,1.0,COL.flowerA],[-1.8,1.4,COL.flowerB],[0.5,-2.0,COL.flowerA],[-1.0,-1.2,COL.flowerB],[2.2,-0.8,COL.flowerB]].forEach(function(fl){
        g.add(CY(0.07,0.07,1.0,COL.stem,fl[0],0.5,fl[1],5));
        var head=SP(0.32,fl[2],fl[0],1.1,fl[1],8); head.scale.y=0.6; g.add(head);
        g.add(SP(0.12,COL.gold,fl[0],1.2,fl[1],6));
      });
      // central young tree
      g.add(CY(0.3,0.4,1.6,COL.wood,0,0.8,0,7));
      g.add(SP(1.6,COL.leafD,0,2.2,0,10));
    }
    function animalWild(g){
      regionBase(g, COL.grass, 6.5);
      // boulders, logs, burrow, tracks — school-safe "wild" set dressing
      [[2.2,1.4,1.0],[-2.6,0.8,1.3],[1.0,-2.4,0.9]].forEach(function(b){ var rk=SP(b[2],COL.rock,b[0],b[2]*0.6,b[1],8); rk.scale.y=0.7; g.add(rk); });
      var log=CY(0.4,0.4,3,COL.log,-1.0,0.4,1.5,8); log.rotation.z=Math.PI/2; log.rotation.y=0.5; g.add(log);
      // a friendly low-poly critter silhouette (rounded, cute)
      var crit=new THREE.Group(); crit.position.set(1.8,0,-1.4);
      crit.add(SP(0.6,COL.hide,0,0.6,0,10));
      crit.add(SP(0.4,COL.hide,0,0.9,0.5,9));
      crit.add(CO(0.12,0.3,COL.hide,0.15,1.25,0.5,6)); crit.add(CO(0.12,0.3,COL.hide,-0.15,1.25,0.5,6));
      crit.add(SP(0.05,COL.dark,0.13,0.95,0.85,6)); crit.add(SP(0.05,COL.dark,-0.13,0.95,0.85,6));
      g.add(crit); bob.push({obj:crit,baseY:0,amp:0.06,spd:2.2,off:0});
      // tall grass tufts
      for(var t=0;t<10;t++){ var ta=t/10*Math.PI*2, tr=3+Math.random(); for(var bl=0;bl<3;bl++){ var gb=CO(0.08,0.9,COL.grass,Math.cos(ta)*tr,0.45,Math.sin(ta)*tr,4); gb.rotation.z=(bl-1)*0.3; g.add(gb); } }
    }
    function protistMarsh(g){
      regionBase(g, COL.marsh, 6.5);
      var water=disc(5.5, COL.mud, 0,0.08,0,24); water.material=trans(0x3a6a5e,0.92); g.add(water);
      // amoeba/paramecium blobs floating
      for(var p=0;p<6;p++){ var pa=p/6*Math.PI*2, pr=1.5+Math.random()*2.5; var bx=Math.cos(pa)*pr, bz=Math.sin(pa)*pr;
        var blob=SP(0.5+Math.random()*0.5,p%2?COL.blob:COL.blobD,bx,0.4,bz,9); blob.scale.set(1.3,0.5,0.9); blob.material=glow(p%2?COL.blob:COL.blobD,0.3); g.add(blob);
        // cilia
        for(var c=0;c<8;c++){ var ca=c/8*Math.PI*2; g.add(CY(0.03,0.02,0.3,COL.blobD,bx+Math.cos(ca)*0.55,0.4,bz+Math.sin(ca)*0.55,4)); }
        bob.push({obj:blob,baseY:0.4,amp:0.1,spd:0.8+Math.random(),off:p});
      }
      // reeds
      for(var rd=0;rd<8;rd++){ var rda=rd/8*Math.PI*2; g.add(CY(0.06,0.06,1.8,COL.algae,Math.cos(rda)*4.5,0.9,Math.sin(rda)*4.5,5)); }
    }
    function archaeaSprings(g){
      regionBase(g, 0x6e5a3a, 6.5);
      // hot-spring pools with steam vents
      [[0,0,2.2],[2.4,1.6,1.2],[-2.2,-1.4,1.4]].forEach(function(s,k){
        var rim=TO(s[2],0.35,COL.springRim,s[0],0.18,s[1],18); rim.rotation.x=Math.PI/2; g.add(rim);
        var pool=disc(s[2], COL.spring, s[0],0.12,s[1],20); pool.material=glow(COL.spring,0.35); g.add(pool);
        // steam column
        for(var st=0;st<3;st++){ var pf=SP(0.4+st*0.15,COL.steam,s[0],0.6+st*0.7,s[1],8); pf.material=trans(COL.steam,0.34-st*0.08); g.add(pf); steam.push({type:'rise',obj:pf,baseY:0.6+st*0.7,top:0.6+st*0.7+1.6,spd:0.4+st*0.2,off:st+k}); }
      });
      // mineral rocks
      for(var mr=0;mr<5;mr++){ var ma=mr/5*Math.PI*2; var rk=B(0.8,0.6,0.8,COL.steamRock,Math.cos(ma)*4,0.3,Math.sin(ma)*4); rk.rotation.y=ma; g.add(rk); }
    }

    var builders={fungi:fungiGrove, monera:bacteriaPool, plant:plantGlade, animal:animalWild, protist:protistMarsh, archaea:archaeaSprings};
    REGION_DEFS.forEach(function(def,i){
      var a=i/6*Math.PI*2;
      var g=new THREE.Group(); g.position.set(Math.cos(a)*R, 0, Math.sin(a)*R);
      builders[def.key](g);
      // small region marker post with violet tag
      var mk=new THREE.Group(); mk.position.set(0,0,-7);
      mk.add(CY(0.12,0.14,1.8,COL.wood,0,0.9,0,6));
      mk.add(B(1.6,0.5,0.12,COL.plank,0,1.7,0));
      var gem=new THREE.Mesh(new THREE.OctahedronGeometry(0.2),glow(COL.accent,0.7)); gem.position.set(0,2.2,0); mk.add(gem); spin.push({obj:gem,spd:1});
      g.add(mk);
      root.add(g); regions[def.key]=g;
    });

    // ---- SCHOOLHOUSE (classroom entrance) --------------------------------
    function schoolhouse(x,z,ry){
      var s=new THREE.Group(); s.position.set(x,0,z); s.rotation.y=ry||0;
      s.add(B(5,3.2,4,COL.plank,0,1.6,0));
      var roof=CO(4.2,2.2,COL.woodD,0,4.2,0,4); roof.rotation.y=Math.PI/4; s.add(roof);
      // little bell tower
      s.add(B(1.2,1.4,1.2,COL.wood,0,4.4,0));
      var spire=CO(0.9,1.4,COL.accent,0,5.6,0,4); spire.rotation.y=Math.PI/4; spire.material=glow(COL.accent,0.45); s.add(spire);
      s.add(SP(0.25,COL.gold,0,6.4,0,8));
      // door + windows
      s.add(B(1.2,1.8,0.2,COL.woodD,0,0.9,2.05));
      s.add(B(1.0,1.0,0.16,COL.white,-1.6,1.8,2.05)); s.add(B(1.0,1.0,0.16,COL.white,1.6,1.8,2.05));
      // sign
      s.add(B(2.6,0.6,0.16,COL.gold,0,2.9,2.05));
      s.bossTag=true;
      root.add(s); return s;
    }
    var school=schoolhouse(-13,12,-0.5);

    // ---- BOSS ARENA staging area (Chimerus) ------------------------------
    function bossArena(x,z){
      var b=new THREE.Group(); b.position.set(x,0,z);
      var plat=CY(8,8.6,0.7,COL.stoneD,0,0.35,0,30); b.add(plat);
      var top=disc(7.4,COL.stone,0,0.72,0,30); b.add(top);
      // violet rune ring
      var ring=TO(6.6,0.22,COL.accent,0,0.78,0,40); ring.material=glow(COL.accent,0.6); ring.rotation.x=Math.PI/2; b.add(ring);
      pulse.push({mat:ring.material,base:0.6,amp:0.25,spd:1.1,off:1});
      // six totem pillars (one per kingdom) ringing the arena
      for(var p=0;p<6;p++){ var pa=p/6*Math.PI*2; var pil=CY(0.5,0.6,3.4,COL.stoneD,Math.cos(pa)*6.4,1.7,Math.sin(pa)*6.4,6); b.add(pil);
        var orb=new THREE.Mesh(new THREE.OctahedronGeometry(0.4),glow([COL.mushCapA,COL.algae,COL.leaf,COL.hide,COL.blob,COL.spring][p],0.6)); orb.position.set(Math.cos(pa)*6.4,3.7,Math.sin(pa)*6.4); b.add(orb); spin.push({obj:orb,spd:0.7}); }
      // central boss dais
      var dais=CY(2,2.4,0.5,COL.dark,0,1.0,0,12); b.add(dais);
      var beam=new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,5,12),trans(COL.accent,0.25)); beam.position.y=3.5; b.add(beam);
      b.bossTag=true;
      root.add(b); return b;
    }
    var arena=bossArena(15,-13);

    // ---- RAIL-RACER launch pad / start gate ------------------------------
    function launchPad(x,z,ry){
      var l=new THREE.Group(); l.position.set(x,0,z); l.rotation.y=ry||0;
      l.add(B(4,0.4,7,COL.stoneD,0,0.2,0));
      l.add(B(4.4,0.15,7.4,COL.accent,0,0.05,0));
      // start gate arch
      l.add(B(0.5,4,0.5,COL.wood,-2.2,2,-3));
      l.add(B(0.5,4,0.5,COL.wood,2.2,2,-3));
      var bar=B(5,0.7,0.6,COL.gold,0,4,-3); l.add(bar);
      // checkered launch lights
      for(var c=0;c<5;c++){ var lt=SP(0.18,c%2?COL.accent:COL.gold,-1.6+c*0.8,4,-3,8); lt.material=glow(c%2?COL.accent:COL.gold,0.7); l.add(lt); pulse.push({mat:lt.material,base:0.7,amp:0.3,spd:2+c*0.2,off:c}); }
      // launch chevrons on the pad
      for(var ch=0;ch<3;ch++){ var chev=CO(0.8,0.2,COL.gold,0,0.42,1.5+ch*1.6,3); chev.rotation.x=-Math.PI/2; l.add(chev); }
      l.bossTag=true;
      root.add(l); return l;
    }
    var pad=launchPad(14,14,-0.6);

    // perimeter conifers for framing
    for(var tr=0;tr<18;tr++){ var ta=tr/18*Math.PI*2+0.1, trd=groundR-3-(tr%3); var tg=new THREE.Group(); tg.position.set(Math.cos(ta)*trd,0,Math.sin(ta)*trd); tg.add(CY(0.2,0.3,1.2,COL.wood,0,0.6,0,6)); tg.add(CO(1.1,1.8,0x2f7a39,0,1.7,0,7)); tg.add(CO(0.8,1.3,0x3f9e4a,0,2.6,0,7)); tg.scale.setScalar(0.8+(tr%3)*0.2); root.add(tg); }

    // ---- animation + API --------------------------------------------------
    var clock=0;
    root.animate=function(dt){ dt=dt||0.016; clock+=dt;
      for(var i=0;i<pulse.length;i++){ var p=pulse[i]; if(p.mat&&p.spd) p.mat.emissiveIntensity=p.base+Math.sin(clock*p.spd+p.off)*p.amp; }
      for(var j=0;j<bob.length;j++){ var b=bob[j]; b.obj.position.y=b.baseY+Math.sin(clock*b.spd+b.off)*b.amp; }
      for(var k=0;k<spin.length;k++){ spin[k].obj.rotation.y+=dt*spin[k].spd; }
      for(var s=0;s<steam.length;s++){ var st=steam[s];
        if(st.type==='rise'){ st.obj.position.y+=dt*st.spd; if(st.obj.position.y>st.top){ st.obj.position.y=st.baseY; } var f=(st.obj.position.y-st.baseY)/(st.top-st.baseY); st.obj.material.opacity=0.34*(1-f); }
        else if(st.type==='shimmer'){ st.mat.opacity=0.82+Math.sin(clock*1.5)*0.08; }
      }
    };
    root.regions=regions; root.schoolhouse=school; root.bossArena=arena; root.launchPad=pad;
    root.crossroads=way; root.accent=ACCENT;
    return root;
  }

  global.KingdomReachesForge={ build:build, REGIONS:REGION_DEFS, ACCENT:ACCENT, COLORS:COL };
})(typeof window!=='undefined'?window:this);
