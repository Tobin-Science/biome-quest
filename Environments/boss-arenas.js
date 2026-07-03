/* ============================================================================
 * boss-arenas.js  —  ENGINE-READY boss arenas for Three.js r128
 * ----------------------------------------------------------------------------
 * SIX one-of-a-kind BOSS ARENAS for Biome Quest. Each is a climactic, walk-in
 * 3D venue the player is teleported into to fight that zone's boss. Built for
 * "epic through SHAPE, SCALE and GLOW" — low-poly, no textures, no shadows,
 * Chromebook-safe. Same conventions as the zone builders (global, global THREE,
 * Lambert, emissive glow).
 *
 *   const arena = BossArenaForge.build('kingdom');   // see BossArenaForge.CATALOG
 *   scene.add(arena);
 *   arena.animate(dt);                 // ambient glow / motes / motion
 *   arena.bossAnchor                   // Object3D — where the boss stands
 *   arena.spawnAnchor                  // Object3D — where the player appears (faces boss)
 *
 * Keys:  kingdom · cells · genetics · ecology · evolution · finale
 * (The bosses themselves come from BossForge and are placed on .bossAnchor —
 *  the arena does NOT include the boss.)
 * ========================================================================== */
(function (global) {

  var CATALOG = {
    kingdom:   { name:'Crossroads of Kingdoms', boss:'Chimerus',         accent:0x7c63ff },
    cells:     { name:'The Living Vast',         boss:'The Contagion',    accent:0x4cc9f0 },
    genetics:  { name:'The Helix Sanctum',       boss:'The Replicator',   accent:0x43c785 },
    ecology:   { name:'The World-Tree Stage',    boss:'The Blight',       accent:0x2fa36b },
    evolution: { name:'The Deeptime Chasm',      boss:'The Everchanging', accent:0xb7c0cc },
    finale:    { name:'The Crown of the Tree',   boss:'The Withering',    accent:0xe6b84c }
  };

  function build(key, opts){
    opts = opts || {};
    key = CATALOG[key] ? key : 'kingdom';
    var THREE = global.THREE;
    var info = CATALOG[key];
    var ACCENT = info.accent;

    var cache = {};
    function mat(c){ if(!cache['m'+c]) cache['m'+c]=new THREE.MeshLambertMaterial({color:c}); return cache['m'+c]; }
    function glow(c,i){ var k='g'+c+(i||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:(i==null?0.55:i)}); return cache[k]; }
    function trans(c,o,e){ var k='t'+c+o+(e||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,transparent:true,opacity:o,emissive:c,emissiveIntensity:e||0,side:THREE.DoubleSide}); return cache[k]; }
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||10),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TUBE(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||10,1,true),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||12; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(6,seg-4)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function HEMI(r,c,x,y,z,seg){ seg=seg||14; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(7,seg-4),0,Math.PI*2,0,Math.PI/2),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||8),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,7,seg||28),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function OCT(r,c,x,y,z){ var m=new THREE.Mesh(new THREE.OctahedronGeometry(r),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function ICO(r,c,x,y,z){ var m=new THREE.Mesh(new THREE.IcosahedronGeometry(r),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function disc(r,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CircleGeometry(r,seg||40),mat(c)); m.rotation.x=-Math.PI/2; m.position.set(x||0,y||0,z||0); return m; }

    var root = new THREE.Group();
    var pulse=[], bob=[], spin=[], orbit=[], drift=[], breathe=[];
    function P(m,base,amp,spd,off){ pulse.push({mat:m,base:base,amp:amp,spd:spd,off:off||0}); return m; }
    function BO(o,baseY,amp,spd,off){ bob.push({obj:o,baseY:baseY,amp:amp,spd:spd,off:off||0}); return o; }
    function SPN(o,spd){ spin.push({obj:o,spd:spd}); return o; }
    function ORB(o,spd){ orbit.push({obj:o,spd:spd}); return o; }
    function DR(o,baseY,top,spd,off){ drift.push({obj:o,baseY:baseY,top:top,spd:spd,off:off||0}); return o; }
    function BR(o,base,amp,spd,off){ breathe.push({obj:o,base:base,amp:amp,spd:spd,off:off||0}); return o; }

    var platTopY = 0.8;   // default boss/player standing height; arenas may override

    // =====================================================================
    // 1) KINGDOM — Crossroads of Kingdoms colosseum (violet)
    // =====================================================================
    function buildKingdom(){
      var KINGS=[
        {name:'fungi',   col:0xd8654c},
        {name:'bacteria',col:0x2fa36b},
        {name:'protist', col:0x6fb6a0},
        {name:'plant',   col:0x43c785},
        {name:'animal',  col:0xb98a52},
        {name:'archaea', col:0xe6b84c}
      ];
      // ---- COLOSSEUM: sunken battle floor ringed by stepped seating + drum wall
      function wmat(c){ return new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide}); }
      var STEPS=4;
      for(var t=0;t<STEPS;t++){
        var ri=16.5+t*2.8, hy=1.0+t*2.6;
        // riser wall (open cylinder) rising to this step's tread
        var riser=new THREE.Mesh(new THREE.CylinderGeometry(ri,ri,2.6,52,1,true), wmat(t%2?0x6a6f7a:0x767c88)); riser.position.y=hy-1.3; root.add(riser);
        // flat ring tread
        var tread=new THREE.Mesh(new THREE.RingGeometry(ri,ri+2.8,52), wmat(t%2?0x7c828e:0x6f7480)); tread.rotation.x=-Math.PI/2; tread.position.y=hy; root.add(tread);
      }
      // outer colosseum drum wall + arcade of arches
      var wallR=16.5+STEPS*2.8;
      root.add(new THREE.Mesh(new THREE.CylinderGeometry(wallR,wallR,20,56,1,true), wmat(0x565b66)));
      for(var ar=0;ar<18;ar++){ var aa=ar/18*Math.PI*2; var col=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.9,11,7), mat(0x4e535d)); col.position.set(Math.cos(aa)*(wallR-0.8),hy+5.5-0.0,Math.sin(aa)*(wallR-0.8)); root.add(col); }
      // crenellated crown ring on top of the wall
      for(var cr2=0;cr2<28;cr2++){ var ca2=cr2/28*Math.PI*2; root.add(B(1.4,1.6,1.4,0x4e535d,Math.cos(ca2)*wallR,18.6,Math.sin(ca2)*wallR)); }
      // ground arena platform (the battle floor, lower than the seating)
      root.add(CY(15.5, 16.2, 1.2, 0x8a8f9a, 0, 0.0, 0, 48));
      root.add(disc(14.6, 0x9296a0, 0, 0.62, 0, 48));
      platTopY = 0.62;
      // ceremonial inlay rings (glow)
      var ring=TO(13.4,0.22,ACCENT, 0,0.66,0,52); ring.rotation.x=Math.PI/2; ring.material=glow(ACCENT,0.55); root.add(ring); P(ring.material,0.55,0.22,1.0,0);
      var ring2=TO(5.6,0.16,ACCENT, 0,0.67,0,40); ring2.rotation.x=Math.PI/2; ring2.material=glow(ACCENT,0.45); root.add(ring2); P(ring2.material,0.45,0.2,1.3,0.6);
      // central raised dais where the boss stands
      var dais=CY(5.2,5.8,0.9,0x787e8c,0,1.05,0,32); root.add(dais);
      root.add(disc(4.9,0x9aa0ac,0,1.52,0,32));
      // six colossal totem-pillars, one per kingdom
      KINGS.forEach(function(k,i){
        var a=-Math.PI/2 + i*(Math.PI*2/6);
        var px=Math.cos(a)*12, pz=Math.sin(a)*12;
        var g=new THREE.Group(); g.position.set(px,0,pz); g.rotation.y=-a+Math.PI/2;
        // stacked carved stone shaft
        g.add(B(2.6,1.0,2.6,0x6f7480,0,1.1,0));
        g.add(B(2.2,7.0,2.2,0x787e8c,0,4.6,0));
        g.add(B(2.7,0.8,2.7,0x6f7480,0,8.4,0));
        // glowing kingdom-rune band on the face
        var rune=B(1.5,2.4,0.2,k.col,0,5.0,1.12); rune.material=glow(k.col,0.5); g.add(rune); P(rune.material,0.5,0.18,0.9+i*0.1,i*0.7);
        // crowning kingdom emblem (floating octahedron)
        var em=OCT(0.95,k.col,0,10.2,0); em.material=glow(k.col,0.7); g.add(em); SPN(em,0.6); BO(em,10.2,0.25,1.0,i); P(em.material,0.7,0.25,1.1,i*0.5);
        // ceremonial brazier glow at base
        var bz=SP(0.5,ACCENT,0,9.0,0,10); bz.material=trans(ACCENT,0.3,0.4); g.add(bz);
        root.add(g);
        // hanging banner between pillars
        var ba=a + (Math.PI*2/6)/2;
        var ban=B(0.16,5.0,2.0, ACCENT, Math.cos(ba)*12.4, 6.0, Math.sin(ba)*12.4); ban.material=trans(ACCENT,0.42,0.25); ban.lookAt(0,6,0); root.add(ban);
      });
      // a few drifting ceremonial sparks
      for(var s=0;s<14;s++){ var sa=Math.random()*Math.PI*2, sr=2+Math.random()*11; var sp=SP(0.1,ACCENT,Math.cos(sa)*sr,1+Math.random()*8,Math.sin(sa)*sr,6); sp.material=glow(ACCENT,0.6); root.add(sp); DR(sp,sp.position.y,sp.position.y+5,0.5+Math.random()*0.5,s); }
    }

    // =====================================================================
    // 2) CELLS — inside a living organism (cyan)
    // =====================================================================
    function buildCells(){
      // enclosing membrane dome (translucent, breathes)
      var dome=new THREE.Mesh(new THREE.SphereGeometry(30,20,16), trans(0xc06a9a,0.16,0.12)); dome.position.y=2; dome.material.side=THREE.BackSide; root.add(dome); BR(dome,1,0.012,0.7,0); P(dome.material,0.12,0.05,0.7,0);
      var dome2=new THREE.Mesh(new THREE.SphereGeometry(29,18,14), trans(ACCENT,0.08,0.18)); dome2.position.y=2; dome2.material.side=THREE.BackSide; root.add(dome2);
      // membrane floor — bioluminescent fluid that pulses like a heartbeat
      root.add(CY(15.5,16.5,1.0,0x7a4a6a,0,-0.2,0,44));
      var fluid=disc(15.0, ACCENT, 0,0.42,0,48); fluid.material=trans(ACCENT,0.5,0.4); root.add(fluid); P(fluid.material,0.4,0.32,1.4,0);
      var fluid2=disc(8.5, 0x6fe0ff, 0,0.46,0,40); fluid2.material=trans(0x6fe0ff,0.4,0.5); root.add(fluid2); P(fluid2.material,0.5,0.35,1.4,0.4);
      platTopY = 0.46;
      // membrane rim ring
      var rim=TO(15.0,0.3,ACCENT,0,0.5,0,52); rim.rotation.x=Math.PI/2; rim.material=glow(ACCENT,0.5); root.add(rim); P(rim.material,0.5,0.25,1.4,0);
      // NUCLEUS dome — towering organelle at the back
      var nuc=new THREE.Group(); nuc.position.set(0,0,-11);
      var ndome=HEMI(5.5,0x9a78d8,0,0.4,0,16); ndome.material=trans(0x9a78d8,0.5,0.25); nuc.add(ndome);
      nuc.add(TO(5.5,0.35,ACCENT,0,0.5,0,40)); 
      var nucleolus=SP(1.8,0x6fe0ff,0,3.2,0,14); nucleolus.material=glow(0x6fe0ff,0.6); nuc.add(nucleolus); P(nucleolus.material,0.6,0.25,1.1,0); BO(nucleolus,3.2,0.2,0.8,0);
      // nuclear pores around the dome rim
      for(var pr=0;pr<10;pr++){ var pa=pr/10*Math.PI*2; var pore=SP(0.32,ACCENT,Math.cos(pa)*5.2,0.6+Math.abs(Math.sin(pa))*0.6,Math.sin(pa)*5.2,8); var pm=glow(ACCENT,0.5); pore.material=pm; nuc.add(pore); P(pm,0.5,0.2,1.0,pr*0.4); }
      root.add(nuc);
      // MITOCHONDRIA pillars (capsule bodies with cristae bands)
      [[-12,5],[12,5],[-12,-5],[12,-4]].forEach(function(m,i){
        var g=new THREE.Group(); g.position.set(m[0],0,m[1]);
        var body=CY(1.8,1.8,7,0xe0894c,0,4,0,14); body.scale.z=0.65; g.add(body);
        g.add(SP(1.8,0xe0894c,0,7.5,0,12)); g.add(SP(1.8,0xe0894c,0,0.6,0,12));
        for(var c=0;c<6;c++){ var cr=TO(1.55,0.16,0xffb27a,0,1.4+c*1.0,0,16); cr.rotation.x=Math.PI/2; cr.material=glow(0xffb27a,0.4); g.add(cr); P(cr.material,0.4,0.18,1.0,c*0.4+i); }
        g.scale.setScalar(0.85); root.add(g);
      });
      // floating vacuole / vesicle bubbles
      for(var v=0;v<7;v++){ var va=v/7*Math.PI*2, vr=8+Math.random()*4; var bub=SP(0.9+Math.random()*0.9, 0x6fe0ff, Math.cos(va)*vr, 3+Math.random()*5, Math.sin(va)*vr, 12); bub.material=trans(0x6fe0ff,0.22,0.3); root.add(bub); BO(bub,bub.position.y,0.6,0.5+Math.random()*0.5,v); }
      // bioluminescent motes
      for(var s=0;s<22;s++){ var sa=Math.random()*Math.PI*2, sr=Math.random()*14; var sp=SP(0.12,0x6fe0ff,Math.cos(sa)*sr,1+Math.random()*10,Math.sin(sa)*sr,6); sp.material=glow(0x6fe0ff,0.6); root.add(sp); DR(sp,sp.position.y,sp.position.y+6,0.4+Math.random()*0.5,s); }
    }

    // =====================================================================
    // 3) GENETICS — the Helix Sanctum (bright-green)
    // =====================================================================
    function buildGenetics(){
      // luminous garden platform
      root.add(CY(15,16,1.1,0x2c4a3a,0,-0.1,0,46));
      var deck=disc(14.2,0x1f6e4a,0,0.5,0,46); deck.material=glow(0x1f6e4a,0.12); root.add(deck);
      platTopY=0.5;
      var ring=TO(13.0,0.24,ACCENT,0,0.54,0,52); ring.rotation.x=Math.PI/2; ring.material=glow(ACCENT,0.55); root.add(ring); P(ring.material,0.55,0.22,1.0,0);
      var ring2=TO(5.4,0.16,ACCENT,0,0.56,0,40); ring2.rotation.x=Math.PI/2; ring2.material=glow(ACCENT,0.45); root.add(ring2); P(ring2.material,0.45,0.2,1.3,0.5);
      // helper: a giant rotating DNA double helix
      function helix(x,z,h,turns,r){
        var g=new THREE.Group(); g.position.set(x,0.5,z);
        var steps=Math.round(h*1.4);
        for(var i=0;i<=steps;i++){
          var f=i/steps, ang=f*turns*Math.PI*2, y=f*h;
          var ax=Math.cos(ang)*r, az=Math.sin(ang)*r, bx=Math.cos(ang+Math.PI)*r, bz=Math.sin(ang+Math.PI)*r;
          g.add(SP(0.45,0xeaf6ee,ax,y,az,9));
          g.add(SP(0.45,ACCENT,bx,y,bz,9));
          if(i%2===0){ // base-pair rung of light
            var rung=CY(0.13,0.13,r*2,0xbff0d2,0,y,0,6); rung.rotation.z=Math.PI/2; rung.rotation.y=-ang; rung.material=glow(0xbff0d2,0.45); g.add(rung); P(rung.material,0.45,0.2,1.2,i*0.2);
          }
        }
        SPN(g,0.25); root.add(g); return g;
      }
      helix(-10,-2,16,2.5,2.2);
      helix(10,2,16,2.5,2.2);
      helix(2,-12,13,2.2,1.9);
      // chromosome columns (X-shaped, glowing) framing the entry
      [[-7,9],[7,9]].forEach(function(c,i){
        var g=new THREE.Group(); g.position.set(c[0],0.5,c[1]);
        [[-1,1],[1,1],[-1,-1],[1,-1]].forEach(function(arm){
          var a=CY(0.7,0.5,5,0x43c785,arm[0]*1.2,3.2,0,10); a.rotation.z=arm[0]*arm[1]*0.5; a.material=glow(0x43c785,0.3); g.add(a);
        });
        var cen=SP(1.1,0xbff0d2,0,3.2,0,12); cen.material=glow(0xbff0d2,0.5); g.add(cen); P(cen.material,0.5,0.2,1.0,i);
        SPN(g,0.4); root.add(g);
      });
      // garden-of-life buds on the platform
      for(var b=0;b<10;b++){ var ba=b/10*Math.PI*2, br=6+Math.random()*5; var bx=Math.cos(ba)*br, bz=Math.sin(ba)*br;
        root.add(CY(0.08,0.1,0.8,0x2f7a39,bx,0.9,bz,5));
        var bud=SP(0.3,ACCENT,bx,1.4,bz,8); bud.material=glow(ACCENT,0.5); root.add(bud); P(bud.material,0.5,0.2,1.0,b); BO(bud,1.4,0.1,1.0,b);
      }
      // floating base-pair sparks
      for(var s=0;s<16;s++){ var sa=Math.random()*Math.PI*2, sr=Math.random()*12; var sp=SP(0.1,0xbff0d2,Math.cos(sa)*sr,1+Math.random()*9,Math.sin(sa)*sr,6); sp.material=glow(0xbff0d2,0.6); root.add(sp); DR(sp,sp.position.y,sp.position.y+5,0.4+Math.random()*0.5,s); }
    }

    // =====================================================================
    // 4) ECOLOGY — the World-Tree Stage (emerald), half-lush / half-blighted
    // =====================================================================
    function buildEcology(){
      // tiered living amphitheater (earth steps) — split lush vs blighted.
      // ⚠ walls must be OPEN-ENDED (openEnded=true): closed cylinders get solid top caps that bury the
      // whole arena (boss, hero, stage were hidden under them). Open walls + flat ring treads, like Kingdom.
      var wmL=new THREE.MeshLambertMaterial({color:0x3f7a3a,side:THREE.DoubleSide});
      var wmB=new THREE.MeshLambertMaterial({color:0x6e6a58,side:THREE.DoubleSide});
      for(var t=0;t<4;t++){
        var rr=17+t*3.0, hh=2.0+t*1.8;
        // lush half + blighted half wall rings (x>0 = lush, x<0 = blighted)
        var half1=new THREE.Mesh(new THREE.CylinderGeometry(rr,rr+0.6,hh,28,1,true,0,Math.PI), wmL); half1.position.y=hh/2-1.0; root.add(half1);
        var half2=new THREE.Mesh(new THREE.CylinderGeometry(rr,rr+0.6,hh,28,1,true,Math.PI,Math.PI), wmB); half2.position.y=hh/2-1.0; root.add(half2);
        // flat half-ring treads on each wall top (theta offset -π/2 aligns ring halves with the cylinder halves)
        var tr1=new THREE.Mesh(new THREE.RingGeometry(rr,rr+3.0,28,1,-Math.PI/2,Math.PI), wmL); tr1.rotation.x=-Math.PI/2; tr1.position.y=hh-1.0; root.add(tr1);
        var tr2=new THREE.Mesh(new THREE.RingGeometry(rr,rr+3.0,28,1,Math.PI/2,Math.PI), wmB); tr2.rotation.x=-Math.PI/2; tr2.position.y=hh-1.0; root.add(tr2);
      }
      // soft emerald canopy enclosing the stage — gives the arena a backdrop (like the other arenas) so the
      // boss isn't washed out against the open sky
      var canopy=new THREE.Mesh(new THREE.SphereGeometry(34,20,14), trans(0x2f6a48,0.13,0.10)); canopy.position.y=3; canopy.material.side=THREE.BackSide; root.add(canopy);
      // arena floor
      root.add(CY(15,16,1.1,0x55503e,0,-0.1,0,46));
      var lushF=new THREE.Mesh(new THREE.CircleGeometry(14.4,40,0,Math.PI), glow(0x2fa36b,0.12)); lushF.rotation.x=-Math.PI/2; lushF.position.y=0.5; root.add(lushF);
      var blightF=new THREE.Mesh(new THREE.CircleGeometry(14.4,40,Math.PI,Math.PI), mat(0x5a5648)); blightF.rotation.x=-Math.PI/2; blightF.position.y=0.5; root.add(blightF);
      platTopY=0.5;
      var ring=TO(13.0,0.24,ACCENT,0,0.54,0,52); ring.rotation.x=Math.PI/2; ring.material=glow(ACCENT,0.5); root.add(ring); P(ring.material,0.5,0.22,1.0,0);
      // raised central stage so the boss stands out clearly (framed like the other arenas' daises)
      var dais=CY(4.8,5.4,1.1,0x3d4a34,0,0.6,0,36); root.add(dais);
      var drim=TO(4.9,0.2,ACCENT,0,1.18,0,44); drim.rotation.x=Math.PI/2; drim.material=glow(ACCENT,0.6); root.add(drim); P(drim.material,0.6,0.22,1.0,0.5);
      // the great WORLD-TREE at the back (lush side glowing, blight side grey) — set well back so it frames
      // the boss instead of camouflaging it
      var tree=new THREE.Group(); tree.position.set(0,0,-18);
      tree.add(CY(2.0,3.2,14,0x5a3f28,0,7,0,12));
      // lush canopy blobs
      [[ -3,15,1,4,0x43c785],[ -5,12,-1,3.4,0x2fa36b],[-2,18,0,3.6,0x6fe0a0]].forEach(function(d){ var b=SP(d[3],d[4],d[0],d[1],d[2],12); b.material=glow(d[4],0.22); tree.add(b); BO(b,d[1],0.2,0.5,d[0]); });
      // blighted canopy blobs (grey)
      [[3,15,1,3.8,0x6e6a58],[5,12,-1,3.2,0x787463],[2,18,0,3.4,0x5a5648]].forEach(function(d){ var b=SP(d[3],d[4],d[0],d[1],d[2],12); tree.add(b); });
      root.add(tree);
      // food-web motif: nodes connected by glowing strands, arcing over the stage
      var nodes=[];
      for(var n=0;n<7;n++){ var na=Math.PI*0.15 + n/6*Math.PI*0.7; var nx=Math.cos(na)*11*(n%2?-1:1), ny=7+Math.sin(na)*5, nz=-7-(n%3)*1.5;
        var nd=SP(0.5, n%2?ACCENT:0x6fe0a0, nx,ny,nz,9); nd.material=glow(n%2?ACCENT:0x6fe0a0,0.6); root.add(nd); P(nd.material,0.6,0.2,1.0,n); nodes.push(new THREE.Vector3(nx,ny,nz)); }
      for(var e=0;e<nodes.length-1;e++){ var aPt=nodes[e], bPt=nodes[e+1]; var mid=aPt.clone().add(bPt).multiplyScalar(0.5); var len=aPt.distanceTo(bPt);
        var strand=CY(0.05,0.05,len,ACCENT,mid.x,mid.y,mid.z,5); strand.material=glow(ACCENT,0.4); strand.lookAt(bPt); strand.rotateX(Math.PI/2); root.add(strand); }
      // spore drift on the blighted side, light motes on lush side
      for(var s=0;s<18;s++){ var side=s%2?1:-1; var sx=side*(2+Math.random()*11), sz=Math.random()*12-6; var col=side>0?0x8a9a5a:0x6fe0a0; var sp=SP(0.12,col,sx,1+Math.random()*8,sz,6); sp.material=glow(col,0.5); root.add(sp); DR(sp,sp.position.y,sp.position.y+5,0.4+Math.random()*0.5,s); }
    }

    // =====================================================================
    // 5) EVOLUTION — the Deeptime Chasm (steel), a ledge over an ancient canyon
    // =====================================================================
    function buildEvolution(){
      // battle ledge jutting out over the chasm (front half is the platform, drop beyond)
      root.add(CY(13.5,14.5,1.4,0x787e8c,0,-0.1,0,40));
      var ledge=disc(12.8,0x8a8f9a,0,0.6,0,40); root.add(ledge);
      platTopY=0.6;
      var ring=TO(11.6,0.22,ACCENT,0,0.64,0,48); ring.rotation.x=Math.PI/2; ring.material=glow(ACCENT,0.5); root.add(ring); P(ring.material,0.5,0.2,0.9,0);
      // towering LAYERED STRATA cliffs (stacked colored rock bands) on far side + flanks
      var strata=[0x6f5a44,0x806a4e,0x6a5f52,0x8a7d62,0x5f5648,0x9a8a68];
      function cliff(cx,cz,ry,wide){
        var g=new THREE.Group(); g.position.set(cx,0,cz); g.rotation.y=ry;
        var y=-6;
        for(var b=0;b<9;b++){ var h=2.0+Math.random()*1.6; var w=wide*(0.85+Math.random()*0.4); var col=strata[b%strata.length];
          var slab=B(w, h, 7+Math.random()*3, col, (Math.random()-0.5)*2, y+h/2, 0); g.add(slab); y+=h;
          // embedded fossil (faint glow) on some bands
          if(b%3===1){ var foss=TO(0.8,0.18,ACCENT, (Math.random()-0.5)*w*0.5, y-h/2, 4.0, 14); foss.material=glow(ACCENT,0.3); g.add(foss); P(foss.material,0.3,0.12,0.7,b); }
          if(b%3===2){ for(var rb=0;rb<3;rb++){ var bone=CY(0.16,0.16,1.6+rb*0.2,0xcfd4dc,(rb-1)*0.7,y-h/2,4.0,6); bone.material=glow(0xcfd4dc,0.18); bone.rotation.z=0.2; g.add(bone); } }
        }
        root.add(g);
      }
      cliff(0,-16,0,22);      // far wall across the chasm
      cliff(-18,-2,Math.PI/2,20);  // left flank
      cliff(18,-2,-Math.PI/2,20);  // right flank
      // a thin distant mist floor far below (suggests the canyon depth)
      var depths=new THREE.Mesh(new THREE.CircleGeometry(40,40), trans(0x3a4250,0.5,0.05)); depths.rotation.x=-Math.PI/2; depths.position.set(0,-12,-8); root.add(depths);
      // a couple of stone spires rising from the chasm
      [[ -8,-9,0.9],[9,-10,1.1],[3,-13,0.7]].forEach(function(s,i){ var sp=CY(s[2],s[2]*2.2,16,0x6a5f52,s[0],-2,s[1],8); root.add(sp); var cap=ICO(1.2,0x8a8f9a,s[0],6,s[1]); root.add(cap); });
      // drifting deep-time dust
      for(var d=0;d<26;d++){ var dx=(Math.random()-0.5)*40, dz=-2-Math.random()*16, dy=Math.random()*16-4; var du=SP(0.1+Math.random()*0.08, 0xcfd4dc, dx,dy,dz,5); du.material=trans(0xcfd4dc,0.4,0.2); root.add(du); DR(du,dy,dy+8,0.2+Math.random()*0.4,d); }
      // a low steel beacon at the ledge entry
      var bec=OCT(0.7,ACCENT,0,2.4,9); bec.material=glow(ACCENT,0.6); root.add(bec); SPN(bec,0.6); BO(bec,2.4,0.2,1.0,0); P(bec.material,0.6,0.2,1.1,0);
    }

    // =====================================================================
    // 6) FINALE — the Crown of the Tree (gold), radiant restored canopy
    // =====================================================================
    function buildFinale(){
      var STRANDS=[0x7c63ff,0x4cc9f0,0x43c785,0x2fa36b,0xb7c0cc];
      // climactic golden stage at the heart of the tree
      root.add(CY(15,16,1.2,0x9a7a4c,0,-0.1,0,48));
      var deck=disc(14.2,0xc9a85c,0,0.55,0,48); deck.material=glow(0xc9a85c,0.18); root.add(deck);
      platTopY=0.55;
      var ring=TO(13.0,0.28,ACCENT,0,0.6,0,56); ring.rotation.x=Math.PI/2; ring.material=glow(ACCENT,0.6); root.add(ring); P(ring.material,0.6,0.25,0.9,0);
      var ring2=TO(5.6,0.18,ACCENT,0,0.62,0,40); ring2.rotation.x=Math.PI/2; ring2.material=glow(ACCENT,0.5); root.add(ring2); P(ring2.material,0.5,0.22,1.2,0.5);
      // central World-Tree trunk rising BEHIND the boss (boss stands at the heart-stage)
      var trunk=CY(2.2,3.0,18,0x5a3f28,0,9,-6.5,12); root.add(trunk);
      var core=SP(2.6,0xffe39a,0,15,-6.5,16); core.material=glow(0xffe39a,0.7); root.add(core); P(core.material,0.7,0.25,0.8,0); BO(core,15,0.3,0.6,0);
      // luminous canopy blobs overhead
      var canopy=[[0,19,-6.5,5,0x2fa36b],[4,17,-3.5,3.8,0x43c785],[-4,17,-9.5,3.8,0x6fe0a0],[2,21,-8.5,3.6,0x43c785],[-2,21,-4.5,3.6,0x2fa36b]];
      canopy.forEach(function(d,i){ var b=SP(d[3],d[4],d[0],d[1],d[2],12); b.material=glow(d[4],0.2); b.scale.y=0.85; root.add(b); BO(b,d[1],0.2,0.45+0.05*i,i); });
      // light shafts beaming down through the canopy
      for(var sh=0;sh<6;sh++){ var sa=sh/6*Math.PI*2; var shaft=TUBE(0.5,3.2,18,0xffe39a,Math.cos(sa)*8,9,Math.sin(sa)*8,10); shaft.material=trans(0xffe39a,0.1,0.35); shaft.rotation.z=Math.cos(sa)*0.12; shaft.rotation.x=Math.sin(sa)*0.12; root.add(shaft); }
      // five Strand-beacons around the rim
      STRANDS.forEach(function(col,i){
        var a=-Math.PI/2 + i*(Math.PI*2/5);
        var g=new THREE.Group(); g.position.set(Math.cos(a)*12.5,0.55,Math.sin(a)*12.5);
        g.add(CY(1.0,1.4,2.6,0x8a8f9a,0,1.3,0,8));
        var cr=OCT(1.1,col,0,4.0,0); cr.material=glow(col,0.7); g.add(cr); SPN(cr,0.7); BO(cr,4.0,0.22,0.9,i); P(cr.material,0.7,0.25,1.2,i);
        var beam=TUBE(0.5,0.5,9,col,0,8.5,0,10); beam.material=trans(col,0.12,0.5); g.add(beam);
        var br=TO(1.5,0.13,col,0,0.4,0,26); br.rotation.x=Math.PI/2; br.material=glow(col,0.5); g.add(br); P(br.material,0.5,0.2,1.0,i);
        root.add(g);
      });
      // rising golden motes
      for(var s=0;s<26;s++){ var sa=Math.random()*Math.PI*2, sr=Math.random()*13; var sp=SP(0.12,0xffe39a,Math.cos(sa)*sr,1+Math.random()*14,Math.sin(sa)*sr,6); sp.material=glow(0xffe39a,0.6); root.add(sp); DR(sp,sp.position.y,sp.position.y+8,0.4+Math.random()*0.6,s); }
    }

    var BUILDERS={ kingdom:buildKingdom, cells:buildCells, genetics:buildGenetics, ecology:buildEcology, evolution:buildEvolution, finale:buildFinale };
    BUILDERS[key]();

    // ---- anchors ----------------------------------------------------------
    var bossAnchor=new THREE.Object3D(); bossAnchor.position.set(0, platTopY+2.55, 0); root.add(bossAnchor);
    var spawnAnchor=new THREE.Object3D(); spawnAnchor.position.set(0, platTopY, 11); root.add(spawnAnchor); // default forward (-Z) faces the boss

    // ---- animation + API --------------------------------------------------
    var clock=0;
    root.animate=function(dt){ dt=dt||0.016; clock+=dt;
      for(var i=0;i<pulse.length;i++){ var p=pulse[i]; if(p.mat) p.mat.emissiveIntensity=p.base+Math.sin(clock*p.spd+p.off)*p.amp; }
      for(var j=0;j<bob.length;j++){ var b=bob[j]; b.obj.position.y=b.baseY+Math.sin(clock*b.spd+b.off)*b.amp; }
      for(var k=0;k<spin.length;k++){ spin[k].obj.rotation.y+=dt*spin[k].spd; }
      for(var o=0;o<orbit.length;o++){ orbit[o].obj.rotation.y+=dt*orbit[o].spd; }
      for(var d=0;d<drift.length;d++){ var dr=drift[d]; dr.obj.position.y+=dt*dr.spd; if(dr.obj.position.y>dr.top){ dr.obj.position.y=dr.baseY; } }
      for(var br=0;br<breathe.length;br++){ var be=breathe[br]; var sc=be.base+Math.sin(clock*be.spd+be.off)*be.amp; be.obj.scale.setScalar(sc); }
    };
    root.bossAnchor=bossAnchor; root.spawnAnchor=spawnAnchor; root.accent=ACCENT; root.arenaKey=key; root.info=info;
    return root;
  }

  global.BossArenaForge={ build:build, CATALOG:CATALOG };
})(typeof window!=='undefined'?window:this);
