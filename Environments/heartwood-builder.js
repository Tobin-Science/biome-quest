/* ============================================================================
 * heartwood-builder.js  —  ENGINE-READY environment for Three.js r128
 * ----------------------------------------------------------------------------
 * THE HEARTWOOD — the central hub of Biome Quest (trunk & roots of the World
 * Tree). Player starts here and returns between zones. Echoes the opening
 * cutscene: deep-forest greens, warm gold light, a great glowing World Tree.
 *
 * Same conventions as gear-builders.js / mount-builders.js:
 *   - global `HeartwoodForge`, global `THREE`
 *   - MeshLambertMaterial, low-poly, no shadows, shared/instanced materials
 *   - school-appropriate, Chromebook-safe
 *
 *   const hub = HeartwoodForge.build();      // returns a THREE.Group (+ helpers)
 *   scene.add(hub);
 *   hub.animate(dt);                         // call every frame (glow + drift)
 *   hub.seatStrand(0, true);                 // light portal/gate socket 0..4
 *   hub.portals[0].position;                 // portal anchors for nav/triggers
 *
 * Portals (radial, color = matching Strand from the intro):
 *   0 Kingdom Reaches  violet  #7c63ff   (S7L1)
 *   1 Inner Vasts      cyan    #4cc9f0   (S7L2)
 *   2 Helix Hollow     green   #43c785   (S7L3)
 *   3 Web of Wilds     emerald #2fa36b   (S7L4)
 *   4 Deeptime Drift   steel   #b7c0cc   (S7L5)
 * ========================================================================== */
(function (global) {
  var COL = {
    forestA: 0x143a2a, forestB: 0x1f5038, forestC: 0x2a6e4a,
    ground:  0x1d4a36, groundEdge: 0x163b2c, path: 0x6f5536,
    bark:    0x5a3f28, barkD: 0x3f2c1c, root: 0x4a3422,
    canopyA: 0x2fa36b, canopyB: 0x43c785, canopyC: 0x1d7a52,
    core:    0xffe39a, gold: 0xe6b84c, leather: 0x9a6a3c,
    hut:     0x7c5230, hutRoof: 0x3a6e4a, stone: 0x8a8f7c,
    lantern: 0xffd27a, plank: 0x8a6238, white: 0xf2f1ec, dark: 0x12241b
  };

  // The five zone portals — order is canonical (matches Strand colors)
  var PORTALS = [
    { key:'kingdom',  name:'Kingdom Reaches', color:0x7c63ff },
    { key:'cells',    name:'Inner Vasts',     color:0x4cc9f0 },
    { key:'genetics', name:'Helix Hollow',    color:0x43c785 },
    { key:'ecology',  name:'Web of Wilds',    color:0x2fa36b },
    { key:'evolution',name:'Deeptime Drift',  color:0xb7c0cc }
  ];

  function build(opts) {
    opts = opts || {};
    var THREE = global.THREE;
    var cache = {};
    function mat(c){ if(!cache['m'+c]) cache['m'+c]=new THREE.MeshLambertMaterial({color:c}); return cache['m'+c]; }
    function glow(c, i){ var k='g'+c+(i||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:(i==null?0.6:i)}); return cache[k]; }
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||10),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||12; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(6,seg-4)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||9),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,7,seg||20),mat(c)); m.position.set(x||0,y||0,z||0); return m; }

    var root = new THREE.Group();
    var pulse = [];      // {mesh, base, amp, spd, off}  emissive pulsers
    var bob = [];        // {obj, baseY, amp, spd, off}
    var spin = [];       // {obj, spd}
    var portalAnchors = [];
    var sockets = [];    // genome-gate socket meshes (lit state toggled)
    var portalGems = []; // per-portal core gem (for seatStrand visual)

    // ---- GROUND + TERRAIN -------------------------------------------------
    var groundR = 32;   // a bit of flat margin beyond the portal ring (r28) so bases don't clip the rim
    var ground = CY(groundR, groundR+1, 0.6, COL.ground, 0, -0.3, 0, 40);
    root.add(ground);
    // soft clearing disc (lighter) under the tree
    var clearing = new THREE.Mesh(new THREE.CircleGeometry(13, 36), mat(COL.forestB));
    clearing.rotation.x = -Math.PI/2; clearing.position.y = 0.02; root.add(clearing);
    // radial path ring connecting portals (sits at the very outer edge, matching the portal ring)
    var pathRing = TO(28, 0.22, COL.path, 0, 0.04, 0, 64); pathRing.rotation.x = Math.PI/2; root.add(pathRing);

    // surrounding low hills (flattened cones) ringing the clearing
    for (var h=0; h<11; h++){
      var ha = h/11*Math.PI*2 + 0.3;
      var hr = groundR - 0.5 - (h%2)*1.2;   // ring the rim, just behind the portals
      var hill = CO(4.5+(h%3)*1.6, 3+(h%4), h%2?COL.forestA:COL.forestC, Math.cos(ha)*hr, 0.4, Math.sin(ha)*hr, 7);
      hill.scale.y = 0.55; root.add(hill);
    }
    // little conifer trees scattered on the rim
    for (var t=0; t<16; t++){
      var ta = t/16*Math.PI*2 + 0.15;
      var tr = groundR - 0.3 - (t%2)*0.6;   // thin tree line at the very rim, behind the portals
      var tx = Math.cos(ta)*tr, tz = Math.sin(ta)*tr;
      var tg = new THREE.Group(); tg.position.set(tx, 0, tz);
      tg.add(CY(0.18,0.26,1.1, COL.bark, 0,0.55,0,6));
      tg.add(CO(1.0,1.6, COL.forestA, 0,1.5,0,7));
      tg.add(CO(0.8,1.3, COL.canopyC, 0,2.2,0,7));
      tg.add(CO(0.6,1.0, COL.forestC, 0,2.9,0,7));
      tg.scale.setScalar(0.8+(t%3)*0.18); root.add(tg);
    }

    // ---- ROOTS radiating from the tree base ------------------------------
    for (var r0=0; r0<8; r0++){
      var ra = r0/8*Math.PI*2 + 0.2;
      var rootArm = new THREE.Group(); rootArm.rotation.y = -ra;
      var seg0 = CY(0.55, 0.9, 5.5, COL.root, 0, 0.18, 3.2, 7);
      seg0.rotation.x = Math.PI/2 - 0.06; seg0.position.set(0,0.2,2.8);
      rootArm.add(seg0);
      var knee = SP(0.7, COL.root, 0, 0.25, 5.4, 8); rootArm.add(knee);
      var tip = CY(0.32,0.5,3.2, COL.barkD, 0, 0.12, 7.0, 6); tip.rotation.x = Math.PI/2; rootArm.add(tip);
      root.add(rootArm);
    }

    // ---- THE WORLD TREE (central landmark) -------------------------------
    var tree = new THREE.Group(); root.add(tree);
    // trunk — tapered, gently buttressed
    var trunk = CY(1.7, 2.8, 11, COL.bark, 0, 5.4, 0, 12); tree.add(trunk);
    var trunkHi = CY(1.1, 1.7, 5, COL.barkD, 0, 12.5, 0, 10); tree.add(trunkHi);
    // bark ridges
    for (var br=0; br<7; br++){
      var ba = br/7*Math.PI*2;
      var ridge = B(0.25, 9, 0.5, COL.barkD, Math.cos(ba)*1.9, 5.6, Math.sin(ba)*1.9);
      ridge.lookAt(0, 5.6, 0); tree.add(ridge);
    }
    // glowing CORE seam up the trunk
    var coreSeam = CY(0.45, 0.6, 9, COL.core, 0.0, 5.6, 1.7, 8);
    var coreMat = glow(COL.core, 0.7); coreSeam.material = coreMat; tree.add(coreSeam);
    pulse.push({mesh:coreSeam, mat:coreMat, base:0.7, amp:0.35, spd:1.4, off:0});
    // a bright heartwood orb nested where canopy meets trunk
    var heart = SP(1.4, COL.core, 0, 15, 0, 16); var heartMat = glow(COL.core, 0.85); heart.material = heartMat; tree.add(heart);
    pulse.push({mesh:heart, mat:heartMat, base:0.85, amp:0.4, spd:1.0, off:1.1});

    // layered low-poly canopy (stacked, offset blobs)
    var canopyDefs = [
      [0, 17.5, 0, 6.5, COL.canopyC],
      [3.2, 18.5, 1.5, 4.6, COL.canopyA],
      [-3.5, 18.2, -1.8, 4.4, COL.canopyB],
      [1.0, 21, -2.5, 4.8, COL.canopyA],
      [-1.5, 21.5, 2.2, 4.6, COL.canopyC],
      [0, 23.5, 0, 5.2, COL.canopyB],
      [2.6, 24.5, 1.0, 3.4, COL.canopyA],
      [-2.4, 24.2, -1.2, 3.4, COL.canopyC],
      [0, 26.5, 0, 3.2, COL.canopyB]
    ];
    var canopy = new THREE.Group(); tree.add(canopy);
    canopyDefs.forEach(function(d,i){
      var blob = SP(d[3], d[4], d[0], d[1], d[2], 12);
      blob.scale.y = 0.85; canopy.add(blob);
      bob.push({obj:blob, baseY:d[1], amp:0.12+0.04*(i%3), spd:0.5+0.1*i, off:i*0.7});
    });
    // a few gold light-motes drifting in the canopy
    for (var mo=0; mo<7; mo++){
      var ma = mo/7*Math.PI*2;
      var mote = SP(0.16, COL.gold, Math.cos(ma)*5, 20+mo*0.7, Math.sin(ma)*5, 8);
      mote.material = glow(COL.gold, 0.8); canopy.add(mote);
      bob.push({obj:mote, baseY:20+mo*0.7, amp:0.5, spd:0.8+mo*0.15, off:mo});
    }

    // ---- FIVE ZONE PORTALS (radial, on the OUTER EDGE) -------------------
    var portalR = 28;
    PORTALS.forEach(function(p, i){
      // 6 evenly-spaced slots; the back slot (-90°) is reserved for the Genome Gate
      var ang = -Math.PI/2 + (i+1)*(Math.PI*2/6);
      var px = Math.cos(ang)*portalR, pz = Math.sin(ang)*portalR;
      var g = new THREE.Group(); g.position.set(px, 0, pz);
      g.lookAt(0, 0, 0);
      // stone base platform
      g.add(CY(2.0, 2.3, 0.5, COL.stone, 0, 0.22, 0, 16));
      var baseRing = TO(1.85, 0.12, p.color, 0, 0.5, 0, 24); baseRing.material = glow(p.color, 0.7); baseRing.rotation.x = Math.PI/2;
      pulse.push({mesh:baseRing, mat:baseRing.material, base:0.7, amp:0.3, spd:1.6, off:i}); g.add(baseRing);
      // archway: two posts + lintel
      g.add(B(0.5, 4.2, 0.5, COL.stone, -1.5, 2.3, 0));
      g.add(B(0.5, 4.2, 0.5, COL.stone, 1.5, 2.3, 0));
      g.add(B(3.7, 0.6, 0.6, COL.stone, 0, 4.5, 0));
      // glowing portal plane inside the arch
      var disc = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.6), glow(p.color, 0.55));
      disc.position.set(0, 2.4, 0.05); g.add(disc);
      var portalMat = glow(p.color, 0.55); disc.material = portalMat;
      pulse.push({mesh:disc, mat:portalMat, base:0.55, amp:0.22, spd:1.1, off:i*0.6});
      // floating capstone gem (themed)
      var gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.42), glow(p.color, 0.9));
      gem.position.set(0, 5.4, 0); g.add(gem);
      portalGems.push(gem); spin.push({obj:gem, spd:1.2}); bob.push({obj:gem, baseY:5.4, amp:0.18, spd:1.3, off:i});
      // a little signpost naming the zone (plank)
      var sign = B(1.5, 0.5, 0.1, COL.plank, 2.4, 1.4, 0.4); g.add(sign);
      g.add(CY(0.09,0.09,1.6, COL.bark, 2.4, 0.8, 0.4, 6));
      root.add(g);
      portalAnchors.push(g);
    });

    // ---- GENOME GATE (dormant landmark at the back) ----------------------
    var gate = new THREE.Group();
    var gateAng = -Math.PI/2; // back slot (on the outer ring with the portals)
    gate.position.set(Math.cos(gateAng)*28, 0, Math.sin(gateAng)*28);
    gate.lookAt(0, 1, 0);
    // dark monolithic archway
    gate.add(CY(3.0, 3.4, 0.6, COL.dark, 0, 0.28, 0, 20));
    gate.add(B(0.9, 6.5, 0.9, COL.barkD, -2.4, 3.4, 0));
    gate.add(B(0.9, 6.5, 0.9, COL.barkD, 2.4, 3.4, 0));
    var lintel = B(6.4, 1.2, 1.0, COL.dark, 0, 6.6, 0); gate.add(lintel);
    // dark inner void
    var voidPane = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 5.6), mat(0x0c1812));
    voidPane.position.set(0, 3.6, 0.08); gate.add(voidPane);
    // FIVE empty Strand sockets across the lintel, one per zone color
    for (var s=0; s<5; s++){
      var sx = -3.2 + s*1.6;
      var ring = TO(0.42, 0.1, COL.barkD, sx, 6.6, 0.55, 16); gate.add(ring);
      var socketMat = glow(PORTALS[s].color, 0.0);     // starts dark (dormant)
      var orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.3), socketMat);
      orb.position.set(sx, 6.6, 0.62); gate.add(orb);
      sockets.push({mesh:orb, mat:socketMat, color:PORTALS[s].color, lit:false});
    }
    root.add(gate);

    // ---- HUB SET-DRESSING PROPS ------------------------------------------
    function hut(x, z, ry, c){
      var hg = new THREE.Group(); hg.position.set(x, 0, z); hg.rotation.y = ry||0;
      hg.add(B(3, 2.2, 2.6, c||COL.hut, 0, 1.1, 0));
      var roof = CO(2.6, 1.7, COL.hutRoof, 0, 3.0, 0, 4); roof.rotation.y = Math.PI/4; hg.add(roof);
      hg.add(B(1.0, 1.4, 0.2, COL.barkD, 0, 0.7, 1.32));            // doorway
      hg.add(B(2.4, 0.5, 0.3, COL.plank, 0, 1.9, 1.35));            // awning sign
      // a couple of crates
      hg.add(B(0.7,0.7,0.7, COL.leather, 1.9, 0.35, 1.0));
      hg.add(B(0.6,0.6,0.6, COL.leather, -1.8, 0.3, 0.9));
      root.add(hg);
      return hg;
    }
    hut(-7.5, 5.5, 0.6);
    hut(7.5, 5.5, -0.6, 0x6e4a28);
    hut(0, 8.5, Math.PI);

    function bench(x, z, ry){
      var bg = new THREE.Group(); bg.position.set(x, 0, z); bg.rotation.y = ry||0;
      bg.add(B(1.8, 0.18, 0.5, COL.plank, 0, 0.55, 0));
      bg.add(B(1.8, 0.4, 0.12, COL.plank, 0, 0.85, -0.2));
      bg.add(B(0.14,0.55,0.45, COL.bark, -0.75, 0.27, 0));
      bg.add(B(0.14,0.55,0.45, COL.bark, 0.75, 0.27, 0));
      root.add(bg);
    }
    bench(-4, 7, 0.3); bench(4, 7, -0.3); bench(-9, 2, 1.2); bench(9, 2, -1.2);

    function lantern(x, z){
      var lg = new THREE.Group(); lg.position.set(x, 0, z);
      lg.add(CY(0.1,0.13,2.4, COL.bark, 0, 1.2, 0, 6));
      var arm = B(0.7,0.1,0.1, COL.bark, 0.3, 2.4, 0); lg.add(arm);
      var bulb = SP(0.26, COL.lantern, 0.6, 2.3, 0, 8); var lm = glow(COL.lantern, 0.85); bulb.material = lm; lg.add(bulb);
      pulse.push({mesh:bulb, mat:lm, base:0.85, amp:0.18, spd:2.2+Math.random(), off:Math.random()*6});
      root.add(lg);
    }
    // lanterns line a mid-ring avenue between the tree village and the portals
    for (var L=0; L<10; L++){ var la=L/10*Math.PI*2+0.4; lantern(Math.cos(la)*13, Math.sin(la)*13); }

    // central signpost (welcome marker) by the tree
    var post = new THREE.Group(); post.position.set(3.5, 0, 4.5);
    post.add(CY(0.13,0.16,2.6, COL.bark, 0, 1.3, 0, 6));
    [[0.9,2.0,0.4],[ -0.9,1.55,-0.4],[0.9,1.1,0.35]].forEach(function(pl){
      var plank = B(1.6,0.42,0.12, COL.plank, pl[0], pl[1], 0); plank.rotation.y = pl[2]; post.add(plank);
    });
    root.add(post);

    // ---- animation + API on the returned group ---------------------------
    var clock = 0;
    root.animate = function(dt){
      dt = dt || 0.016; clock += dt;
      for (var i=0;i<pulse.length;i++){ var p=pulse[i]; p.mat.emissiveIntensity = p.base + Math.sin(clock*p.spd + p.off)*p.amp; }
      for (var j=0;j<bob.length;j++){ var b=bob[j]; b.obj.position.y = b.baseY + Math.sin(clock*b.spd + b.off)*b.amp; }
      for (var k=0;k<spin.length;k++){ spin[k].obj.rotation.y += dt*spin[k].spd; spin[k].obj.rotation.x += dt*spin[k].spd*0.4; }
    };
    // seat / clear a Strand: lights the gate socket AND the matching portal gem brighter
    root.seatStrand = function(i, on){
      if (i<0 || i>4) return;
      var lit = on !== false;
      sockets[i].lit = lit;
      sockets[i].mat.emissiveIntensity = lit ? 0.95 : 0.0;
      sockets[i].mat.color.setHex(lit ? PORTALS[i].color : 0x1a2a20);
    };
    root.portals = portalAnchors;
    root.gate = gate;
    root.sockets = sockets;
    root.tree = tree;
    root.PORTALS = PORTALS;
    return root;
  }

  global.HeartwoodForge = { build: build, PORTALS: PORTALS, COLORS: COL };
})(typeof window !== 'undefined' ? window : this);
