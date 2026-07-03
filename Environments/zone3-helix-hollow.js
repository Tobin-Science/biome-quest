/* ============================================================================
 * zone3-helix-hollow.js  —  ENGINE-READY environment for Three.js r128
 * ----------------------------------------------------------------------------
 * ZONE 3 — THE HELIX HOLLOW  (S7L3 · Reproduction & Inheritance)
 * Theme: a glowing genetics garden.  Strand/accent: bright-green #43c785.
 *
 *   const z = HelixHollowForge.build();
 *   scene.add(z); z.animate(dt);
 *   z.helixArch / z.traitBeds / z.schoolhouse / z.bossArena / z.launchPad
 * ========================================================================== */
(function (global) {
  var ACCENT = 0x43c785;  // bright-green Strand
  var COL = {
    ground:0x2f6e4a, groundD:0x255a3c, path:0x8a9a6c, plaza:0x7c9a78,
    accent:ACCENT, gold:0xe6b84c, white:0xf2f1ec, dark:0x16241c,
    wood:0x7c5230, woodD:0x553820, plank:0x9a6a3c, stone:0x9296a0, stoneD:0x6f7480,
    // helix base-pair colors (A-T, C-G)
    baseA:0x4cc9f0, baseT:0xe6b84c, baseC:0x43c785, baseG:0xe07a92,
    strand:0xeef0ea, strandGlow:0x9be8c0,
    // trait beds
    soil:0x5a4030, bedRim:0x7c5230, leaf:0x3f9e4a, leafTall:0x2f7a39,
    flowerR:0xe05a6a, flowerW:0xf2f1ec, flowerP:0xd86a9a, flowerY:0xe6b84c,
    // chromosomes
    chromA:0x7c63ff, chromB:0xe07a92,
    // replicator boss
    mirror:0xbfe6d2, mirrorD:0x6fbf9a
  };

  function build(opts){
    opts=opts||{};
    var THREE=global.THREE;
    var cache={};
    function mat(c){ if(!cache['m'+c]) cache['m'+c]=new THREE.MeshLambertMaterial({color:c}); return cache['m'+c]; }
    function glow(c,i){ var k='g'+c+(i||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:(i==null?0.55:i)}); return cache[k]; }
    function trans(c,o){ var k='t'+c+o; if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,transparent:true,opacity:o,side:THREE.DoubleSide}); return cache[k]; }
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||9),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||10; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(6,seg-4)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||8),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,7,seg||18),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function disc(r,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CircleGeometry(r,seg||28),mat(c)); m.rotation.x=-Math.PI/2; m.position.set(x||0,y||0,z||0); return m; }

    var root=new THREE.Group();
    var pulse=[], bob=[], spin=[];
    var traitBeds=[];

    // ---- GROUND -----------------------------------------------------------
    root.add(CY(44,45,0.6,COL.ground,0,-0.3,0,44));
    var plaza=disc(8,COL.plaza,0,0.05,0,30); root.add(plaza);
    var plazaRing=TO(7.5,0.18,COL.accent,0,0.1,0,40); plazaRing.material=glow(COL.accent,0.6); plazaRing.rotation.x=Math.PI/2; root.add(plazaRing);
    pulse.push({mat:plazaRing.material,base:0.6,amp:0.22,spd:1.2,off:0});

    // ====================================================================
    //  SIGNATURE LANDMARK — a giant luminous DOUBLE HELIX archway
    // ====================================================================
    function helix(cx,cz,height,radius,turns,ry){
      var g=new THREE.Group(); g.position.set(cx,0,cz); g.rotation.y=ry||0;
      var steps=Math.round(turns*10);
      var prevA=null, prevB=null;
      for(var s=0;s<=steps;s++){
        var t=s/steps, ang=t*turns*Math.PI*2, y=t*height+0.5;
        var ax=Math.cos(ang)*radius, az=Math.sin(ang)*radius;
        var bx=Math.cos(ang+Math.PI)*radius, bz=Math.sin(ang+Math.PI)*radius;
        var a=SP(0.42,COL.strand,ax,y,az,8); a.material=glow(COL.strandGlow,0.45); g.add(a);
        var b=SP(0.42,COL.strand,bx,y,bz,8); b.material=glow(COL.strandGlow,0.45); g.add(b);
        // base-pair rung every other step
        if(s%2===0){
          var pair=[[COL.baseA,COL.baseT],[COL.baseC,COL.baseG]][s/2%2];
          var mid=B(radius*0.95,0.16,0.16,pair[0],0,y,0); mid.position.set((ax+bx)/2,y,(az+bz)/2); mid.lookAt(new THREE.Vector3(bx,y,bz)); g.add(mid);
          var half=B(radius*0.48,0.18,0.18,pair[1],0,y,0); half.position.set(ax*0.5,y,az*0.5); half.lookAt(new THREE.Vector3(0,y,0)); g.add(half);
        }
      }
      bob.push({obj:g,baseY:0,amp:0,spd:0,off:0});
      spin.push({obj:g,spd:0.18,axis:'y'});
      return g;
    }
    // central tall helix tower + flanking helix arches forming a walkway gate
    var mainHelix=helix(0,0,10,2.2,3,0); root.add(mainHelix);
    var topGem=new THREE.Mesh(new THREE.OctahedronGeometry(1.1),glow(COL.accent,0.8)); topGem.position.set(0,11.5,0); root.add(topGem); spin.push({obj:topGem,spd:0.6}); bob.push({obj:topGem,baseY:11.5,amp:0.25,spd:0.9,off:0}); pulse.push({mat:topGem.material,base:0.8,amp:0.3,spd:1.4,off:0});
    helix(-9,-3,7,1.6,2.5,0.4); helix(9,-3,7,1.6,2.5,-0.4);

    // base-pair lattice set-dressing posts (paired shapes)
    for(var bp=0;bp<6;bp++){ var ba=bp/6*Math.PI*2; var lat=new THREE.Group(); lat.position.set(Math.cos(ba)*13,0,Math.sin(ba)*13);
      lat.add(CY(0.12,0.16,3,COL.wood,0,1.5,0,6));
      var pairCol=[[COL.baseA,COL.baseT],[COL.baseC,COL.baseG]][bp%2];
      lat.add(SP(0.4,pairCol[0],-0.4,3.2,0,8)); lat.add(SP(0.4,pairCol[1],0.4,3.2,0,8));
      lat.add(B(0.9,0.12,0.12,COL.white,0,3.2,0));
      root.add(lat);
    }

    // ====================================================================
    //  TRAIT BEDS — tidy breeding plots showing inherited traits
    // ====================================================================
    function traitBed(x,z,ry, flowerCol, tall){
      var g=new THREE.Group(); g.position.set(x,0,z); g.rotation.y=ry||0;
      // raised bed frame
      g.add(B(5,0.5,3,COL.bedRim,0,0.25,0));
      g.add(B(4.6,0.4,2.6,COL.soil,0,0.45,0));
      // rows of plants showing the same inherited trait
      for(var r=0;r<3;r++){ for(var c=0;c<4;c++){
        var px=-1.6+c*1.05, pz=-0.8+r*0.8;
        g.add(CY(0.06,0.08,tall?1.4:0.8,COL.leafTall,px,0.6+(tall?0.7:0.4),pz,5));
        var head=SP(tall?0.32:0.26,flowerCol,px,tall?1.7:1.1,pz,8); head.scale.y=0.7; g.add(head);
        g.add(SP(0.1,COL.gold,px,tall?1.78:1.18,pz,6));
      }}
      // little label placard
      g.add(CY(0.08,0.1,1.2,COL.wood,2.8,0.6,0,5));
      var plac=B(1.3,0.7,0.1,COL.plank,2.8,1.3,0); g.add(plac);
      var gem=new THREE.Mesh(new THREE.OctahedronGeometry(0.16),glow(COL.accent,0.6)); gem.position.set(2.8,1.85,0); g.add(gem); spin.push({obj:gem,spd:1});
      root.add(g); traitBeds.push(g); return g;
    }
    traitBed(-15,8,0.2,COL.flowerR,false);
    traitBed(-15,2,0.2,COL.flowerW,true);
    traitBed(15,8,-0.2,COL.flowerP,false);
    traitBed(15,2,-0.2,COL.flowerY,true);
    // a couple of "creature pens" showing inherited coat colors
    function pen(x,z,coat){
      var g=new THREE.Group(); g.position.set(x,0,z);
      var penRing=TO(2.2,0.12,COL.wood,0,0.4,0,18); penRing.rotation.x=Math.PI/2; g.add(penRing);
      for(var p=0;p<3;p++){ var pa=p/3*Math.PI*2; var crit=new THREE.Group(); crit.position.set(Math.cos(pa)*1,0,Math.sin(pa)*1);
        crit.add(SP(0.4,coat,0,0.45,0,9)); crit.add(SP(0.26,coat,0,0.7,0.32,8));
        crit.add(SP(0.04,COL.dark,0.1,0.74,0.55,6)); crit.add(SP(0.04,COL.dark,-0.1,0.74,0.55,6));
        g.add(crit); bob.push({obj:crit,baseY:0,amp:0.05,spd:2+p,off:p});
      }
      root.add(g);
    }
    pen(-9,13,0x8a5a36); pen(9,13,0xe8d8b8);

    // ---- SCHOOLHOUSE ------------------------------------------------------
    function schoolhouse(x,z,ry){
      var s=new THREE.Group(); s.position.set(x,0,z); s.rotation.y=ry||0;
      s.add(B(5,3.2,4,COL.plank,0,1.6,0));
      var roof=CO(4.2,2.2,COL.leafTall,0,4.2,0,4); roof.rotation.y=Math.PI/4; s.add(roof);
      s.add(B(1.2,1.4,1.2,COL.wood,0,4.4,0));
      var spire=CO(0.9,1.4,COL.accent,0,5.6,0,4); spire.rotation.y=Math.PI/4; spire.material=glow(COL.accent,0.5); s.add(spire);
      s.add(SP(0.25,COL.gold,0,6.4,0,8));
      s.add(B(1.2,1.8,0.2,COL.woodD,0,0.9,2.05));
      s.add(B(1.0,1.0,0.16,COL.white,-1.6,1.8,2.05)); s.add(B(1.0,1.0,0.16,COL.white,1.6,1.8,2.05));
      s.add(B(2.6,0.6,0.16,COL.gold,0,2.9,2.05));
      root.add(s); return s;
    }
    var school=schoolhouse(-5,30,Math.PI);

    // ---- BOSS ARENA — "The Replicator" (mirrored/repeating geometry) -----
    function bossArena(x,z){
      var b=new THREE.Group(); b.position.set(x,0,z);
      var plat=CY(8,8.6,0.7,COL.stoneD,0,0.35,0,28); b.add(plat);
      var top=disc(7.4,COL.mirror,0,0.72,0,28); top.material=glow(COL.mirror,0.15); b.add(top);
      var ring=TO(6.6,0.22,COL.accent,0,0.78,0,40); ring.material=glow(COL.accent,0.6); ring.rotation.x=Math.PI/2; b.add(ring);
      pulse.push({mat:ring.material,base:0.6,amp:0.25,spd:1.0,off:1});
      // mirrored repeating pillars (clone motif) — concentric paired rings
      for(var p=0;p<8;p++){ var pa=p/8*Math.PI*2; var pil=CY(0.4,0.5,3,COL.mirrorD,Math.cos(pa)*6.2,1.5,Math.sin(pa)*6.2,6); b.add(pil);
        var clone=CY(0.3,0.4,2.2,COL.mirror,Math.cos(pa)*4.2,1.1,Math.sin(pa)*4.2,6); clone.material=trans(COL.mirror,0.6); b.add(clone);
      }
      // central pair of identical hovering capsids (the "splitting" boss)
      var c1=new THREE.Mesh(new THREE.IcosahedronGeometry(1.4),glow(COL.accent,0.5)); c1.position.set(-1.4,3.5,0); b.add(c1); spin.push({obj:c1,spd:0.7}); bob.push({obj:c1,baseY:3.5,amp:0.2,spd:0.9,off:0});
      var c2=new THREE.Mesh(new THREE.IcosahedronGeometry(1.4),glow(COL.accent,0.5)); c2.position.set(1.4,3.5,0); b.add(c2); spin.push({obj:c2,spd:-0.7}); bob.push({obj:c2,baseY:3.5,amp:0.2,spd:0.9,off:Math.PI});
      root.add(b); return b;
    }
    var arena=bossArena(16,-13);

    // ---- RAIL-RACER launch pad (glide along a giant helix) ---------------
    function launchPad(x,z,ry){
      var l=new THREE.Group(); l.position.set(x,0,z); l.rotation.y=ry||0;
      l.add(B(4,0.4,7,COL.stoneD,0,0.2,0));
      l.add(B(4.4,0.15,7.4,COL.accent,0,0.05,0));
      l.add(B(0.5,4,0.5,COL.wood,-2.2,2,-3)); l.add(B(0.5,4,0.5,COL.wood,2.2,2,-3));
      l.add(B(5,0.7,0.6,COL.gold,0,4,-3));
      // a short helix ramp the racer glides onto
      var ramp=helix(0,5,5,1.2,1.5,0); ramp.scale.setScalar(0.7); l.add(ramp);
      for(var c=0;c<5;c++){ var lt=SP(0.18,c%2?COL.accent:COL.gold,-1.6+c*0.8,4,-3,8); lt.material=glow(c%2?COL.accent:COL.gold,0.7); l.add(lt); pulse.push({mat:lt.material,base:0.7,amp:0.3,spd:2+c*0.2,off:c}); }
      root.add(l); return l;
    }
    var pad=launchPad(-27,-20,0.6);

    // perimeter trees
    for(var tr=0;tr<16;tr++){ var ta=tr/16*Math.PI*2+0.2, trd=32-(tr%3); var tg=new THREE.Group(); tg.position.set(Math.cos(ta)*trd,0,Math.sin(ta)*trd); tg.add(CY(0.2,0.3,1.2,COL.wood,0,0.6,0,6)); tg.add(SP(1.4,COL.leafTall,0,2,0,9)); tg.add(SP(1.0,COL.leaf,0.5,2.6,0.3,8)); tg.scale.setScalar(0.85+(tr%3)*0.2); root.add(tg); }

    // ---- animation + API --------------------------------------------------
    var clock=0;
    root.animate=function(dt){ dt=dt||0.016; clock+=dt;
      for(var i=0;i<pulse.length;i++){ var p=pulse[i]; if(p.mat) p.mat.emissiveIntensity=p.base+Math.sin(clock*p.spd+p.off)*p.amp; }
      for(var j=0;j<bob.length;j++){ var b=bob[j]; if(b.amp) b.obj.position.y=b.baseY+Math.sin(clock*b.spd+b.off)*b.amp; }
      for(var k=0;k<spin.length;k++){ var s=spin[k]; s.obj.rotation.y+=dt*s.spd; }
    };
    root.helixArch=mainHelix; root.traitBeds=traitBeds; root.schoolhouse=school; root.bossArena=arena; root.launchPad=pad; root.accent=ACCENT;
    return root;
  }

  global.HelixHollowForge={ build:build, ACCENT:ACCENT, COLORS:COL };
})(typeof window!=='undefined'?window:this);
