/* ============================================================================
 * zone4-web-of-wilds.js  —  ENGINE-READY environment for Three.js r128
 * ----------------------------------------------------------------------------
 * ZONE 4 — THE WEB OF WILDS  (S7L4 · Ecology & Ecosystems)
 * Theme: several biomes side by side.  Strand/accent: emerald #2fa36b.
 *
 *   const z = WebOfWildsForge.build();
 *   scene.add(z); z.animate(dt);
 *   z.biomes.rainforest/.savanna/.tundra/.marine
 *   z.pyramid / z.schoolhouse / z.bossArena / z.launchPad
 * ========================================================================== */
(function (global) {
  var ACCENT = 0x2fa36b;  // emerald Strand
  var COL = {
    accent:ACCENT, gold:0xe6b84c, white:0xf2f1ec, dark:0x16241c,
    wood:0x7c5230, woodD:0x553820, plank:0x9a6a3c, stone:0x9296a0, stoneD:0x6f7480,
    // rainforest
    rfGround:0x1f5a32, rfTrunk:0x5a3f28, rfCanopy:0x2f8f4a, rfCanopyD:0x227a3a, rfVine:0x43c785, rfFlower:0xe05a6a,
    // savanna
    svGround:0xb89a52, svGrass:0xcaa85c, svTrunk:0x8a6238, svAcacia:0x6e9a4a, svRock:0xa89878,
    // tundra
    tnGround:0xd8e0e6, tnSnow:0xf2f5f8, tnConifer:0x2f6e54, tnTrunk:0x4a3a2c, tnRock:0x9aa0a8, tnIce:0xbfe0ee,
    // marine / freshwater
    water:0x2f8fae, waterD:0x1f6a86, sand:0xd8c89a, coralA:0xe0884c, coralB:0xd86a9a, reed:0x3f9e4a, fish:0xe6b84c,
    // trophic pyramid tiers (producers→apex)
    tier1:0x43c785, tier2:0xe6b84c, tier3:0xe0884c, tier4:0xc24a5a,
    // blight boss
    blight:0x6e6a58, blightD:0x4a4838, blightVein:0x9a8f5a, blightSpore:0x8a9a5a
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
    function quad(rx,rz,c,x,y,z){ var m=new THREE.Mesh(new THREE.PlaneGeometry(rx,rz),mat(c)); m.rotation.x=-Math.PI/2; m.position.set(x||0,y||0,z||0); return m; }

    var root=new THREE.Group();
    var pulse=[], bob=[], spin=[], flow=[];
    var biomes={};

    // ---- BASE GROUND (a square split into 4 biome quadrants) -------------
    var S=18; // half-size
    root.add(B(56,0.6,56,0x2a3a2c,0,-0.3,0)); // base ground enlarged to hold school/pad/arena (sit at r~23)

    // helper conifer/broadleaf
    function broadleaf(g,x,z,trunkC,leafC,scale){ var t=new THREE.Group(); t.position.set(x,0,z); t.add(CY(0.25,0.35,1.6*scale,trunkC,0,0.8*scale,0,6)); t.add(SP(1.3*scale,leafC,0,2.0*scale,0,9)); t.add(SP(1.0*scale,leafC,0.6*scale,2.5*scale,0.3*scale,8)); g.add(t); return t; }
    function conifer(g,x,z,trunkC,leafC,scale){ var t=new THREE.Group(); t.position.set(x,0,z); t.add(CY(0.18,0.26,1.0*scale,trunkC,0,0.5*scale,0,6)); t.add(CO(1.0*scale,1.6*scale,leafC,0,1.4*scale,0,7)); t.add(CO(0.7*scale,1.2*scale,leafC,0,2.2*scale,0,7)); g.add(t); return t; }

    // ===== QUADRANT 1: TROPICAL RAINFOREST (-x,-z) ========================
    var rf=new THREE.Group(); rf.position.set(-S/2,0,-S/2); root.add(rf); biomes.rainforest=rf;
    rf.add(quad(S,S,COL.rfGround,0,0.05,0));
    for(var i=0;i<7;i++){ var rx=(Math.random()-0.5)*S*0.8, rz=(Math.random()-0.5)*S*0.8;
      var tr=broadleaf(rf,rx,rz,COL.rfTrunk,i%2?COL.rfCanopy:COL.rfCanopyD,1.4+(i%3)*0.4);
      // hanging vines
      rf.add(CY(0.05,0.05,1.5,COL.rfVine,rx+0.5,2.5,rz,4));
    }
    for(var f=0;f<6;f++){ rf.add(SP(0.3,COL.rfFlower,(Math.random()-0.5)*S*0.8,0.6,(Math.random()-0.5)*S*0.8,8)); }
    // mist
    for(var m=0;m<4;m++){ var mist=quad(6,6,COL.white,(Math.random()-0.5)*8,0.6,(Math.random()-0.5)*8); mist.material=trans(0xcfeede,0.18); rf.add(mist); }

    // ===== QUADRANT 2: SAVANNA / GRASSLAND (+x,-z) ========================
    var sv=new THREE.Group(); sv.position.set(S/2,0,-S/2); root.add(sv); biomes.savanna=sv;
    sv.add(quad(S,S,COL.svGround,0,0.05,0));
    // acacia trees (flat-top)
    for(var a=0;a<4;a++){ var ax=(Math.random()-0.5)*S*0.7, az=(Math.random()-0.5)*S*0.7; var ac=new THREE.Group(); ac.position.set(ax,0,az);
      ac.add(CY(0.3,0.4,2.4,COL.svTrunk,0,1.2,0,6)); var crown=SP(1.8,COL.svAcacia,0,3,0,10); crown.scale.set(1.3,0.4,1.3); ac.add(crown); sv.add(ac); }
    // grass tufts + rocks
    for(var gt=0;gt<14;gt++){ for(var bl=0;bl<3;bl++){ sv.add(CO(0.07,0.8,COL.svGrass,(Math.random()-0.5)*S*0.85,0.4,(Math.random()-0.5)*S*0.85,4)); } }
    for(var rk=0;rk<4;rk++){ var rock=SP(0.7,COL.svRock,(Math.random()-0.5)*S*0.7,0.4,(Math.random()-0.5)*S*0.7,8); rock.scale.y=0.6; sv.add(rock); }

    // ===== QUADRANT 3: TUNDRA / TAIGA (-x,+z) =============================
    var tn=new THREE.Group(); tn.position.set(-S/2,0,S/2); root.add(tn); biomes.tundra=tn;
    var tnFloor=quad(S,S,COL.tnGround,0,0.05,0); tn.add(tnFloor);
    for(var c=0;c<7;c++){ conifer(tn,(Math.random()-0.5)*S*0.8,(Math.random()-0.5)*S*0.8,COL.tnTrunk,COL.tnConifer,1.2+(c%3)*0.4); }
    // snow caps on the conifers via small white cones + ice shards + snow drifts
    for(var sd=0;sd<5;sd++){ var drift=SP(1.2,COL.tnSnow,(Math.random()-0.5)*S*0.8,0.2,(Math.random()-0.5)*S*0.8,8); drift.scale.y=0.3; tn.add(drift); }
    for(var ic=0;ic<3;ic++){ var ice=CO(0.6,1.6,COL.tnIce,(Math.random()-0.5)*S*0.6,0.8,(Math.random()-0.5)*S*0.6,5); ice.material=trans(COL.tnIce,0.7); tn.add(ice); }

    // ===== QUADRANT 4: MARINE / FRESHWATER EDGE (+x,+z) ===================
    var mr=new THREE.Group(); mr.position.set(S/2,0,S/2); root.add(mr); biomes.marine=mr;
    mr.add(quad(S,S,COL.sand,0,0.04,0));
    var sea=quad(S*0.9,S*0.7,COL.water,1,0.1,1); sea.material=trans(COL.water,0.85); mr.add(sea);
    // coral + reeds + fish
    for(var co=0;co<6;co++){ var cx=(Math.random()-0.5)*S*0.6+1, cz=(Math.random()-0.5)*S*0.5+1;
      var coral=new THREE.Group(); coral.position.set(cx,0,cz);
      for(var br=0;br<3;br++){ var stalk=CY(0.1,0.14,0.9+Math.random()*0.6,co%2?COL.coralA:COL.coralB,(br-1)*0.3,0.5,0,5); stalk.rotation.z=(br-1)*0.3; coral.add(stalk); }
      mr.add(coral); }
    for(var rd=0;rd<8;rd++){ mr.add(CY(0.06,0.06,1.4,COL.reed,(Math.random()-0.5)*S*0.7+1,0.7,(Math.random()-0.5)*S*0.6+1,5)); }
    for(var fi=0;fi<5;fi++){ var fish=SP(0.3,COL.fish,(Math.random()-0.5)*S*0.6+1,0.5,(Math.random()-0.5)*S*0.5+1,8); fish.scale.set(1.4,0.7,0.6); mr.add(fish); flow.push({obj:fish,axis:'x',min:-7,max:9,spd:1+Math.random(),base:0.5}); }

    // ===== CENTER: TROPHIC PYRAMID landmark + matter-cycle loop ===========
    var pyr=new THREE.Group(); root.add(pyr);
    var tierCols=[COL.tier1,COL.tier2,COL.tier3,COL.tier4];
    var tierW=[6,4.6,3.2,1.8];
    for(var ti=0;ti<4;ti++){ var tier=B(tierW[ti],1.2,tierW[ti],tierCols[ti],0,0.6+ti*1.25,0); pyr.add(tier);
      var edge=B(tierW[ti]+0.1,0.12,tierW[ti]+0.1,COL.white,0,0.6+ti*1.25+0.6,0); edge.material=glow(tierCols[ti],0.3); pyr.add(edge);
    }
    var apex=new THREE.Mesh(new THREE.OctahedronGeometry(0.9),glow(COL.accent,0.7)); apex.position.y=6.5; pyr.add(apex); spin.push({obj:apex,spd:0.6}); bob.push({obj:apex,baseY:6.5,amp:0.2,spd:1,off:0}); pulse.push({mat:apex.material,base:0.7,amp:0.3,spd:1.3,off:0});
    // matter-cycle loop markers (a ring of arrows around the pyramid)
    for(var lp=0;lp<6;lp++){ var la=lp/6*Math.PI*2; var arrow=CO(0.4,0.9,COL.accent,Math.cos(la)*7,0.6,Math.sin(la)*7,4); arrow.material=glow(COL.accent,0.4); arrow.rotation.set(Math.PI/2,0,-la); pyr.add(arrow); }

    // ---- SCHOOLHOUSE ------------------------------------------------------
    function schoolhouse(x,z,ry){
      var s=new THREE.Group(); s.position.set(x,0,z); s.rotation.y=ry||0;
      s.add(B(5,3.2,4,COL.plank,0,1.6,0));
      var roof=CO(4.2,2.2,COL.rfCanopyD,0,4.2,0,4); roof.rotation.y=Math.PI/4; s.add(roof);
      s.add(B(1.2,1.4,1.2,COL.wood,0,4.4,0));
      var spire=CO(0.9,1.4,COL.accent,0,5.6,0,4); spire.rotation.y=Math.PI/4; spire.material=glow(COL.accent,0.5); s.add(spire);
      s.add(SP(0.25,COL.gold,0,6.4,0,8));
      s.add(B(1.2,1.8,0.2,COL.woodD,0,0.9,2.05));
      s.add(B(1.0,1.0,0.16,COL.white,-1.6,1.8,2.05)); s.add(B(1.0,1.0,0.16,COL.white,1.6,1.8,2.05));
      s.add(B(2.6,0.6,0.16,COL.gold,0,2.9,2.05));
      root.add(s); return s;
    }
    var school=schoolhouse(0,S+5,Math.PI);

    // ---- BOSS ARENA — "The Blight" (greying, collapsed ecosystem patch) --
    function bossArena(x,z){
      var b=new THREE.Group(); b.position.set(x,0,z);
      var plat=CY(8,8.6,0.7,COL.blightD,0,0.35,0,28); b.add(plat);
      var top=new THREE.Mesh(new THREE.CircleGeometry(7.4,28),mat(COL.blight)); top.rotation.x=-Math.PI/2; top.position.y=0.72; b.add(top);
      var ring=TO(6.6,0.22,COL.accent,0,0.78,0,40); ring.material=glow(COL.accent,0.6); ring.rotation.x=Math.PI/2; b.add(ring);
      pulse.push({mat:ring.material,base:0.6,amp:0.25,spd:1.0,off:1});
      // dead/greyed trees, drooping — the blight motif (restorable)
      for(var d=0;d<6;d++){ var da=d/6*Math.PI*2; var dt=new THREE.Group(); dt.position.set(Math.cos(da)*6,0,Math.sin(da)*6); dt.rotation.z=0.2;
        dt.add(CY(0.2,0.3,2.2,COL.blightD,0,1.1,0,6)); dt.add(SP(0.9,COL.blight,0,2.4,0,8)); b.add(dt); }
      // sickly spore puffs + veins
      for(var sp=0;sp<7;sp++){ var sa=sp/7*Math.PI*2; var puff=SP(0.7,COL.blightSpore,Math.cos(sa)*4.5,1.2,Math.sin(sa)*4.5,8); puff.material=trans(COL.blightSpore,0.6); b.add(puff); bob.push({obj:puff,baseY:1.2,amp:0.18,spd:0.8+sp*0.1,off:sp}); }
      // central blight core (a withered mass) hovering
      var core=new THREE.Mesh(new THREE.DodecahedronGeometry(1.6),glow(COL.blightVein,0.3)); core.position.y=3.5; b.add(core); spin.push({obj:core,spd:0.4}); bob.push({obj:core,baseY:3.5,amp:0.22,spd:0.7,off:0});
      root.add(b); return b;
    }
    var arena=bossArena(0,-(S+6));

    // ---- RAIL-RACER launch pad (river / canopy run) ----------------------
    function launchPad(x,z,ry){
      var l=new THREE.Group(); l.position.set(x,0,z); l.rotation.y=ry||0;
      l.add(B(4,0.4,7,COL.stoneD,0,0.2,0));
      l.add(B(4.4,0.15,7.4,COL.accent,0,0.05,0));
      l.add(B(0.5,4,0.5,COL.wood,-2.2,2,-3)); l.add(B(0.5,4,0.5,COL.wood,2.2,2,-3));
      l.add(B(5,0.7,0.6,COL.gold,0,4,-3));
      // a flowing river strip leading off
      var river=B(3,0.1,8,COL.water,0,0.3,4.5); river.material=trans(COL.water,0.7); l.add(river);
      for(var c=0;c<5;c++){ var lt=SP(0.18,c%2?COL.accent:COL.gold,-1.6+c*0.8,4,-3,8); lt.material=glow(c%2?COL.accent:COL.gold,0.7); l.add(lt); pulse.push({mat:lt.material,base:0.7,amp:0.3,spd:2+c*0.2,off:c}); }
      root.add(l); return l;
    }
    var pad=launchPad(S+5,0,-1.57);

    // ---- animation + API --------------------------------------------------
    var clock=0;
    root.animate=function(dt){ dt=dt||0.016; clock+=dt;
      for(var i=0;i<pulse.length;i++){ var p=pulse[i]; if(p.mat) p.mat.emissiveIntensity=p.base+Math.sin(clock*p.spd+p.off)*p.amp; }
      for(var j=0;j<bob.length;j++){ var b=bob[j]; if(b.amp) b.obj.position.y=b.baseY+Math.sin(clock*b.spd+b.off)*b.amp; }
      for(var k=0;k<spin.length;k++){ spin[k].obj.rotation.y+=dt*spin[k].spd; }
      for(var f=0;f<flow.length;f++){ var fl=flow[f]; fl.obj.position.x+=dt*fl.spd; if(fl.obj.position.x>fl.max) fl.obj.position.x=fl.min; }
    };
    root.biomes=biomes; root.pyramid=pyr; root.schoolhouse=school; root.bossArena=arena; root.launchPad=pad; root.accent=ACCENT;
    return root;
  }

  global.WebOfWildsForge={ build:build, ACCENT:ACCENT, COLORS:COL };
})(typeof window!=='undefined'?window:this);
