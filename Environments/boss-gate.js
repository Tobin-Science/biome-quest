/* ============================================================================
 * boss-gate.js  —  ENGINE-READY boss gate for Three.js r128
 * ----------------------------------------------------------------------------
 * THE BOSS GATE — one HUGE, imposing structure that sits at the far end of a
 * stone bridge out of each zone. ONE gate reskinned per zone (accent color + a
 * small zone motif). When the player has mastered enough of the zone's
 * minigames the gate UNLOCKS; as they approach, the door OPENS and they walk
 * through the doorway to be teleported into the boss arena.
 *
 * Same conventions as the other builders: global, global THREE, Lambert,
 * low-poly, emissive glow, Chromebook-safe, school-appropriate.
 *
 *   const gate = BossGateForge.build({ accent:0x7c63ff, zone:'kingdom' });
 *   scene.add(gate);
 *   gate.setUnlocked(true);    // LOCKED (dim, chained, dark runes) <-> UNLOCKED (lit, inviting)
 *   gate.openDoor(t);          // t 0..1 drives the two door leaves closed -> open
 *   gate.animate(dt);          // idle rune glow / pulse
 *   gate.doorway               // Object3D at the center of the open doorway (walk-through point)
 *
 * Zones (motif on the keystone): kingdom · cells · genetics · ecology · evolution · finale
 * ========================================================================== */
(function (global) {

  var ZONE_ACCENT = {
    kingdom:0x7c63ff, cells:0x4cc9f0, genetics:0x43c785,
    ecology:0x2fa36b, evolution:0xb7c0cc, finale:0xe6b84c
  };

  function build(opts){
    opts = opts || {};
    var THREE = global.THREE;
    var zone = opts.zone || 'kingdom';
    var ACCENT = (opts.accent != null) ? opts.accent : (ZONE_ACCENT[zone] || 0x7c63ff);

    var cache={};
    function mat(c){ if(!cache['m'+c]) cache['m'+c]=new THREE.MeshLambertMaterial({color:c}); return cache['m'+c]; }
    function glow(c,i){ var m=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:(i==null?0.55:i)}); return m; }
    function trans(c,o,e){ return new THREE.MeshLambertMaterial({color:c,transparent:true,opacity:o,emissive:c,emissiveIntensity:e||0,side:THREE.DoubleSide}); }
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||12),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||12; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(6,seg-4)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,7,seg||28),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function OCT(r,c,x,y,z){ var m=new THREE.Mesh(new THREE.OctahedronGeometry(r),mat(c)); m.position.set(x||0,y||0,z||0); return m; }

    var STONE=0x6f7480, STONED=0x565b66, STONEL=0x848a96, DARK=0x2a2e38, IRON=0x3a3f4a;

    var root=new THREE.Group();
    // arrays of things the lock/unlock + animation touches
    var runeMats=[];     // glowing rune materials (lit accent when unlocked, dim grey when locked)
    var lockGroup=new THREE.Group();   // chains + padlocks, shown only when LOCKED
    var glowMats=[];     // ambient accent glow (doorway, keystone) intensified when unlocked
    var pulseRunes=[];   // rune pulse animation
    var bob=[], spin=[];

    var GATE_W=22, GATE_H=22, THICK=4;   // overall gate footprint
    var DOOR_W=4.6, DOOR_H=16.6, DOOR_GAP_Y=0.6;

    // ---- BUTTRESS FOUNDATION / steps at the bridge end -------------------
    root.add(B(GATE_W+6, 1.4, THICK+6, STONED, 0, -0.7, 0));
    root.add(B(GATE_W+2, 0.8, THICK+3, STONE,  0, 0.0, 1.0));

    // ---- TWO COLOSSAL PYLON TOWERS flanking the doorway -----------------
    function pylon(side){
      var x=side*(DOOR_W+3.4);
      var g=new THREE.Group(); g.position.set(x,0,0);
      g.add(B(6, GATE_H, THICK, STONE, 0, GATE_H/2, 0));
      g.add(B(6.8, 1.4, THICK+0.8, STONED, 0, GATE_H-0.7, 0));        // capital
      g.add(B(6.6, 0.9, THICK+0.6, STONEL, 0, 1.2, 0));               // base course
      // carved vertical rune channel up the inner face
      var ch=B(0.9, GATE_H-6, 0.4, ACCENT, side*-2.4, GATE_H/2, THICK/2+0.05); var chm=glow(ACCENT,0.0); ch.material=chm; g.add(ch); runeMats.push(chm); pulseRunes.push({mat:chm,off:side>0?0:0.8});
      // rune studs climbing the face
      for(var s=0;s<5;s++){ var st=OCT(0.5, ACCENT, side*-2.4, 4+s*3.3, THICK/2+0.2); var sm=glow(ACCENT,0.0); st.material=sm; g.add(st); runeMats.push(sm); pulseRunes.push({mat:sm,off:s*0.5+side}); }
      // a brazier orb atop each tower
      var orb=SP(0.9, ACCENT, 0, GATE_H+1.2, 0, 12); var om=glow(ACCENT,0.0); orb.material=om; g.add(orb); runeMats.push(om); glowMats.push({mat:om,lo:0.0,hi:0.8}); bob.push({obj:orb,baseY:GATE_H+1.2,amp:0.25,spd:0.8,off:side});
      root.add(g);
    }
    pylon(-1); pylon(1);

    // ---- LINTEL + ARCH crowning the doorway -----------------------------
    root.add(B(GATE_W, 3.0, THICK+0.6, STONE, 0, GATE_H-1.5, 0));
    root.add(B(GATE_W+1.5, 1.2, THICK+1.2, STONED, 0, GATE_H+0.4, 0));
    // keystone block (holds the zone motif)
    var keystone=B(4.2, 4.2, THICK+1.0, STONEL, 0, GATE_H-1.0, 0); root.add(keystone);
    // tympanum panel filling the arch between the door tops and the lintel
    var tymY=(DOOR_GAP_Y+DOOR_H + (GATE_H-3))/2;
    root.add(B(DOOR_W*2+0.4, (GATE_H-3)-(DOOR_GAP_Y+DOOR_H), 1.0, STONED, 0, tymY, -0.3));
    var tymArch=new THREE.Mesh(new THREE.TorusGeometry(DOOR_W-0.4,0.3,7,24,Math.PI), mat(ACCENT)); tymArch.position.set(0, DOOR_GAP_Y+DOOR_H-0.2, 0.4); var tam=glow(ACCENT,0); tymArch.material=tam; root.add(tymArch); runeMats.push(tam); pulseRunes.push({mat:tam,off:0.5});

    // ---- ZONE MOTIF on the keystone -------------------------------------
    var motif=new THREE.Group(); motif.position.set(0, GATE_H-1.0, THICK/2+0.6); root.add(motif);
    function motifPiece(mesh, glowI){ var m=glow(ACCENT, 0); mesh.material=m; motif.add(mesh); runeMats.push(m); glowMats.push({mat:m,lo:0.0,hi:glowI==null?0.7:glowI}); return mesh; }
    (function buildMotif(){
      if(zone==='kingdom'){          // six-fold totem ring
        var hex=new THREE.Mesh(new THREE.TorusGeometry(1.5,0.18,6,6), mat(ACCENT)); motifPiece(hex,0.7);
        for(var i=0;i<6;i++){ var a=i/6*Math.PI*2; motifPiece(OCT(0.34,ACCENT,Math.cos(a)*1.5,Math.sin(a)*1.5,0.1),0.7); }
      } else if(zone==='cells'){     // cell with nucleus
        motifPiece(new THREE.Mesh(new THREE.TorusGeometry(1.5,0.2,8,24), mat(ACCENT)),0.7);
        motifPiece(SP(0.7,ACCENT,0,0,0.1,12),0.7);
        for(var c=0;c<5;c++){ var ca=c/5*Math.PI*2; motifPiece(SP(0.22,ACCENT,Math.cos(ca)*0.95,Math.sin(ca)*0.95,0.15,8),0.7); }
      } else if(zone==='genetics'){  // double-helix glyph
        for(var h=0;h<7;h++){ var f=h/6, ang=f*Math.PI*1.6, y=(f-0.5)*3.0;
          motifPiece(SP(0.26,ACCENT,Math.cos(ang)*1.1,y,0.1,8),0.7);
          motifPiece(SP(0.26,ACCENT,Math.cos(ang+Math.PI)*1.1,y,0.1,8),0.7);
          if(h%2===0){ var rung=CY(0.1,0.1,2.2,ACCENT,0,y,0.1,5); rung.rotation.z=Math.PI/2; motifPiece(rung,0.6); }
        }
      } else if(zone==='ecology'){   // leaf / food-web node
        var leaf=SP(1.4,ACCENT,0,0,0.1,12); leaf.scale.set(0.7,1.3,0.4); motifPiece(leaf,0.7);
        var vein=CY(0.1,0.1,2.4,ACCENT,0,0,0.25,5); motifPiece(vein,0.6);
        for(var v=0;v<4;v++){ var vy=(v-1.5)*0.55; var vn=CY(0.07,0.07,0.9,ACCENT,0,vy,0.25,5); vn.rotation.z=(v%2?1:-1)*0.9; motifPiece(vn,0.5); }
      } else if(zone==='evolution'){ // ammonite fossil spiral
        for(var sgi=0;sgi<10;sgi++){ var sa=sgi/10*Math.PI*2.4, sr=0.25+sgi*0.16; motifPiece(SP(0.12+sgi*0.025,ACCENT,Math.cos(sa)*sr,Math.sin(sa)*sr,0.1,8),0.65); }
      } else {                       // finale — crown / radiant tree
        var trunk=CY(0.22,0.32,1.6,ACCENT,0,-0.8,0.1,8); motifPiece(trunk,0.7);
        motifPiece(SP(1.0,ACCENT,0,0.7,0.1,12),0.7);
        for(var k=0;k<5;k++){ var ka=Math.PI*0.15 + k/4*Math.PI*0.7; motifPiece(SP(0.28,ACCENT,Math.cos(ka)*1.3,0.7+Math.sin(ka)*1.1,0.2,8),0.7); }
      }
    })();

    // ---- THE TWO DOOR LEAVES (swing open on outer hinges) ----------------
    var doorY = DOOR_GAP_Y + DOOR_H/2;
    function leaf(side){
      // hinge pivot sits at the OUTER vertical edge of each leaf
      var hinge=new THREE.Group(); hinge.position.set(side*DOOR_W, 0, 0); root.add(hinge);
      var leafG=new THREE.Group(); hinge.add(leafG);
      // panel grows inward from the hinge toward the centre
      leafG.add(B(DOOR_W, DOOR_H, 0.7, IRON, -side*DOOR_W/2, doorY, 0));
      // iron banding
      for(var b=0;b<3;b++){ leafG.add(B(DOOR_W, 0.5, 0.85, 0x4a505c, -side*DOOR_W/2, DOOR_GAP_Y+2.5+b*4.0, 0)); }
      // vertical planks
      for(var p=0;p<3;p++){ leafG.add(B(0.25, DOOR_H-1, 0.8, STONED, -side*(0.8+p*1.5), doorY, 0)); }
      // a glowing rune sigil at the centre seam of each leaf
      var sig=OCT(0.85, ACCENT, -side*(DOOR_W-0.7), doorY, 0.5); var sm=glow(ACCENT,0); sig.material=sm; leafG.add(sig); runeMats.push(sm); pulseRunes.push({mat:sm,off:side>0?0.3:1.1});
      // heavy ring handle near the seam
      var handle=TO(0.6,0.13,0x20242c,-side*(DOOR_W-0.7), doorY-1.2, 0.45, 16); leafG.add(handle);
      return hinge;
    }
    var leafL=leaf(-1), leafR=leaf(1);

    // ---- DOORWAY interior glow (the teleport threshold) ------------------
    var thresh=new THREE.Mesh(new THREE.PlaneGeometry(DOOR_W*2-0.4, DOOR_H), trans(ACCENT,0.0,0.5)); thresh.position.set(0, doorY, -0.2); root.add(thresh);
    var threshMat=thresh.material; glowMats.push({mat:threshMat,lo:0.0,hi:0.45,opLo:0.0,opHi:0.5});
    // doorway threshold ring on the ground
    var thRing=TO(2.6,0.18,ACCENT,0,0.2,0,28); thRing.rotation.x=Math.PI/2; var thrm=glow(ACCENT,0); thRing.material=thrm; root.add(thRing); runeMats.push(thrm); glowMats.push({mat:thrm,lo:0.0,hi:0.6}); pulseRunes.push({mat:thrm,off:0});

    // ---- LOCKED state: chains + padlocks crossing the doors --------------
    root.add(lockGroup);
    // big central padlock
    var lockBody=B(2.2,2.6,0.9,IRON,0,doorY,0.7); lockGroup.add(lockBody);
    lockGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.9,0.22,8,18,Math.PI), mat(0x20242c)));
    var shackle=new THREE.Mesh(new THREE.TorusGeometry(0.9,0.22,8,18,Math.PI), mat(0x20242c)); shackle.position.set(0,doorY+1.3,0.7); lockGroup.add(shackle);
    var keyhole=SP(0.35,0x12151b,0,doorY-0.2,1.2,8); lockGroup.add(keyhole);
    // crossing chains
    function chain(x1,y1,x2,y2){
      var a=new THREE.Vector3(x1,y1,0.75), b=new THREE.Vector3(x2,y2,0.75); var mid=a.clone().add(b).multiplyScalar(0.5); var len=a.distanceTo(b);
      var links=Math.round(len/0.7);
      for(var i=0;i<links;i++){ var f=i/(links-1); var lx=x1+(x2-x1)*f, ly=y1+(y2-y1)*f; var lk=TO(0.26,0.09,0x33373f,lx,ly,0.78,10); lk.rotation.x=Math.PI/2; lk.rotation.z=(i%2)*Math.PI/2; lockGroup.add(lk); }
    }
    chain(-DOOR_W+0.5, doorY+4.5, DOOR_W-0.5, doorY-4.5);
    chain(-DOOR_W+0.5, doorY-4.5, DOOR_W-0.5, doorY+4.5);
    chain(-DOOR_W+0.6, doorY+2.2, DOOR_W-0.6, doorY+2.2);
    // dark "dead rune" plates on the doors (visible only when locked)
    var deadRunes=[];
    for(var dr=0;dr<4;dr++){ var dx=(dr%2?1:-1)*(DOOR_W-1.4); var dy=doorY-3+ (dr<2?5:0); var dp=OCT(0.6, 0x2a2e38, dx, dy, 0.75); lockGroup.add(dp); }

    // =====================================================================
    //  STATE + API
    // =====================================================================
    var unlocked=false, doorT=0;
    var cAccent=new THREE.Color(ACCENT), cDim=new THREE.Color(0x3a3f4a);

    function applyUnlock(){
      // runes: lit accent when unlocked, dim grey when locked
      for(var i=0;i<runeMats.length;i++){ var m=runeMats[i]; m.color.copy(unlocked?cAccent:cDim); m.emissive.copy(unlocked?cAccent:cDim); m.emissiveIntensity = unlocked?0.55:0.04; }
      for(var g=0;g<glowMats.length;g++){ var gm=glowMats[g]; gm.mat.emissiveIntensity = unlocked?gm.hi:gm.lo; if(gm.opHi!=null) gm.mat.opacity = unlocked?gm.opHi:gm.opLo; }
      lockGroup.visible = !unlocked;
    }
    applyUnlock();

    var DOOR_MAX = Math.PI*0.62;   // ~112° swing
    function applyDoor(){
      // doors only actually move once unlocked; clamp closed while locked
      var t = unlocked ? doorT : 0;
      leafL.rotation.y =  t*DOOR_MAX;
      leafR.rotation.y = -t*DOOR_MAX;
    }
    applyDoor();

    // ---- doorway anchor (walk-through / teleport point) -----------------
    var doorway=new THREE.Object3D(); doorway.position.set(0, 0, -THICK/2-0.5); root.add(doorway);

    // ---- animation --------------------------------------------------------
    var clock=0;
    root.animate=function(dt){ dt=dt||0.016; clock+=dt;
      if(unlocked){
        for(var i=0;i<pulseRunes.length;i++){ var p=pulseRunes[i]; p.mat.emissiveIntensity=0.55+Math.sin(clock*1.3+p.off)*0.22; }
        threshMat.opacity=0.5+Math.sin(clock*1.1)*0.12;
      }
      for(var b=0;b<bob.length;b++){ var bb=bob[b]; bb.obj.position.y=bb.baseY+Math.sin(clock*bb.spd+bb.off)*bb.amp; }
      for(var s=0;s<spin.length;s++){ spin[s].obj.rotation.y+=dt*spin[s].spd; }
    };

    root.setUnlocked=function(v){ unlocked=!!v; applyUnlock(); applyDoor(); };
    root.openDoor=function(t){ doorT=Math.max(0,Math.min(1,t)); applyDoor(); };
    root.isUnlocked=function(){ return unlocked; };
    root.doorway=doorway; root.accent=ACCENT; root.zone=zone;
    return root;
  }

  global.BossGateForge={ build:build, ZONE_ACCENT:ZONE_ACCENT };
})(typeof window!=='undefined'?window:this);
