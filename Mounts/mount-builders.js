/* ============================================================================
 * mount-builders.js  —  ENGINE-READY low-poly rideable mounts for Three.js r128
 * ----------------------------------------------------------------------------
 * Same conventions as gear-builders.js: global `MountForge`, global `THREE`,
 * Lambert / low-poly / Chromebook-safe, school-appropriate (friendly creatures).
 *
 *   const m = MountForge.createMount('pony');
 *   scene.add(m.root);
 *   m.saddle.add(rider.root);          // seat a HeroForge hero on the saddle anchor
 *   m.animate(dt, { move: isMoving }); // call every frame
 *
 * Keys: pony · beetle · raptor · ram · glider   (see MountForge.CATALOG)
 * ========================================================================== */
(function (global) {
  var THREE;

  var CATALOG = {
    pony:   'Meadow Pony',
    beetle: 'Iron Beetle',
    raptor: 'Forest Raptor',
    ram:    'Highland Ram',
    glider: 'Sky Glider'
  };

  var COL = {
    pony:0x8a5a36, ponyD:0x5e3c22, hoof:0x2e2620, mane:0x3e2817,
    shellA:0x2fa36b, shellB:0x1d7a52, beetleHead:0x14533a, antenna:0x0e3a28,
    rapt:0x4f9e54, raptD:0x356e3a, raptBelly:0xc7d98a, claw:0xe7e0c8,
    wool:0xefe9dc, woolD:0xd6cdb8, ramFace:0x5a4a38, horn:0xc8a25a,
    bird:0x3aa8c9, birdD:0x2b7f99, beak:0xe6994c, feather:0x9bd6e8, leg:0xe6994c,
    eye:0x20242e, white:0xf2f1ec, saddle:0x6e4a28, saddleTrim:0xe6b84c, gemC:0x4cc9f0
  };

  function createMount(name, opts) {
    opts = opts || {};
    THREE = global.THREE;
    var cache = {};
    function mat(c){ if(!cache[c]) cache[c]=new THREE.MeshLambertMaterial({color:c}); return cache[c]; }
    function gem(c){ var k='g'+c; if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:.5}); return cache[k]; }
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||12),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||14; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(8,seg-2)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||12),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,8,seg||16),mat(c)); m.position.set(x||0,y||0,z||0); return m; }

    var root = new THREE.Group();
    var saddle = new THREE.Group();       // rider sits here
    var legs = [];                        // animated limb pivots
    var wings = [];
    var saddleH = 1.3;

    function saddlePad(y){ var s=B(0.5,0.12,0.62,COL.saddle,0,y,-0.02); root.add(s); var t=B(0.54,0.05,0.16,COL.saddleTrim,0,y+0.07,-0.28); root.add(t); }
    function legPivot(x,topY,z){ var g=new THREE.Group(); g.position.set(x,topY,z); root.add(g); legs.push(g); return g; }

    if(name==='pony'){
      saddleH=1.45;
      root.add(SP(0.42,COL.pony,0,1.0,-0.45,14));      // rear
      root.add(SP(0.4,COL.pony,0,1.02,0.5,14));        // chest
      root.add(B(0.6,0.55,1.3,COL.pony,0,1.0,0));      // barrel
      var neck=B(0.3,0.6,0.32,COL.pony,0,1.35,0.66); neck.rotation.x=-0.5; root.add(neck);
      root.add(B(0.28,0.3,0.52,COL.pony,0,1.6,0.92));  // head
      root.add(B(0.24,0.18,0.2,COL.ponyD,0,1.52,1.18));// snout
      root.add(CO(0.07,0.16,COL.pony,0.1,1.78,0.82,8));// ears
      root.add(CO(0.07,0.16,COL.pony,-0.1,1.78,0.82,8));
      root.add(SP(0.04,COL.eye,0.13,1.62,1.08,8)); root.add(SP(0.04,COL.eye,-0.13,1.62,1.08,8));
      for(var mz=0;mz<5;mz++){ root.add(B(0.1,0.16,0.12,COL.mane,0,1.5-mz*0.02,0.5-mz*0.13)); } // mane
      var tail=CY(0.1,0.04,0.7,COL.mane,0,0.85,-0.78,8); tail.rotation.x=0.5; root.add(tail);
      [[0.22,0.45],[-0.22,0.45],[0.22,-0.45],[-0.22,-0.45]].forEach(function(p){ var g=legPivot(p[0],0.9,p[1]); g.add(CY(0.1,0.09,0.9,COL.pony,0,-0.45,0,10)); g.add(CY(0.11,0.11,0.14,COL.hoof,0,-0.86,0,10)); });
      saddlePad(1.33);
    }
    else if(name==='beetle'){
      saddleH=1.0;
      var shell=SP(0.72,COL.shellA,0,0.7,0,18); shell.scale.set(1.05,0.7,1.25); root.add(shell);
      root.add(B(0.04,0.5,1.3,COL.shellB,0,1.06,0));   // seam
      [[-0.32,0.4],[0.32,0.4],[-0.32,-0.2],[0.32,-0.2]].forEach(function(p){ root.add(SP(0.08,COL.shellB,p[0],0.95,p[1],8)); }); // spots
      root.add(SP(0.34,COL.beetleHead,0,0.5,0.78,14));  // head
      root.add(SP(0.06,COL.white,0.15,0.58,0.98,8)); root.add(SP(0.06,COL.white,-0.15,0.58,0.98,8));
      root.add(SP(0.03,COL.eye,0.16,0.58,1.03,8)); root.add(SP(0.03,COL.eye,-0.16,0.58,1.03,8));
      var aL=CY(0.02,0.02,0.36,COL.antenna,0.12,0.78,0.95,6); aL.rotation.set(-0.6,0,0.3); root.add(aL);
      var aR=CY(0.02,0.02,0.36,COL.antenna,-0.12,0.78,0.95,6); aR.rotation.set(-0.6,0,-0.3); root.add(aR);
      [-1,1].forEach(function(s){ [0.45,0.05,-0.35].forEach(function(z){ var g=legPivot(s*0.55,0.55,z); var lg=CY(0.04,0.03,0.6,COL.beetleHead,s*0.18,-0.2,0,6); lg.rotation.z=s*0.9; g.add(lg); }); });
      saddlePad(1.0);
    }
    else if(name==='raptor'){
      saddleH=1.35;
      root.add(B(0.46,0.5,1.0,COL.rapt,0,1.05,0.05));
      root.add(SP(0.26,COL.rapt,0,1.05,0.55,12));
      var neck2=B(0.26,0.4,0.26,COL.rapt,0,1.4,0.6); neck2.rotation.x=-0.4; root.add(neck2);
      root.add(B(0.26,0.26,0.5,COL.rapt,0,1.62,0.86));
      root.add(B(0.22,0.16,0.22,COL.raptD,0,1.55,1.12));
      root.add(SP(0.045,COL.eye,0.12,1.66,1.0,8)); root.add(SP(0.045,COL.eye,-0.12,1.66,1.0,8));
      for(var i=0;i<5;i++){ var seg=B(0.3-i*0.045,0.3-i*0.045,0.28,COL.rapt,0,1.0-i*0.02,-0.5-i*0.26); root.add(seg); } // tail
      root.add(B(0.5,0.14,0.6,COL.raptBelly,0,0.84,0.05)); // belly
      [-1,1].forEach(function(s){ var g=legPivot(s*0.26,1.0,-0.05); var thigh=B(0.2,0.46,0.24,COL.rapt,0,-0.22,0); g.add(thigh); var shin=B(0.14,0.4,0.16,COL.raptD,0,-0.55,0.08); g.add(shin); g.add(B(0.16,0.1,0.32,COL.claw,0,-0.74,0.18)); });
      [-1,1].forEach(function(s){ var arm=B(0.08,0.26,0.1,COL.raptD,s*0.24,1.1,0.42); arm.rotation.x=0.6; root.add(arm); });
      saddlePad(1.32);
    }
    else if(name==='ram'){
      saddleH=1.3;
      [[0,1.0,-0.3,0.5],[0,1.05,0.25,0.46],[0.28,0.95,0,0.34],[-0.28,0.95,0,0.34],[0,1.2,-0.05,0.36]].forEach(function(p){ root.add(SP(p[3],COL.wool,p[0],p[1],p[2],14)); });
      root.add(SP(0.26,COL.ramFace,0,0.92,0.62,12));   // face
      root.add(B(0.2,0.16,0.18,COL.ramFace,0,0.84,0.8));// muzzle
      root.add(SP(0.04,COL.eye,0.12,0.98,0.78,8)); root.add(SP(0.04,COL.eye,-0.12,0.98,0.78,8));
      [-1,1].forEach(function(s){ var h1=TO(0.16,0.05,COL.horn,s*0.2,1.04,0.55,12); h1.rotation.set(Math.PI/2,0,0); root.add(h1); var h2=TO(0.1,0.045,COL.horn,s*0.26,0.92,0.42,12); h2.rotation.set(Math.PI/2,0,0); root.add(h2); });
      [[0.2,0.32],[-0.2,0.32],[0.2,-0.34],[-0.2,-0.34]].forEach(function(p){ var g=legPivot(p[0],0.62,p[1]); g.add(CY(0.09,0.08,0.62,COL.ramFace,0,-0.31,0,8)); });
      saddlePad(1.42);
    }
    else { // glider (friendly bird)
      saddleH=1.25;
      var bd=SP(0.5,COL.bird,0,1.0,0,16); bd.scale.set(1,0.9,1.3); root.add(bd);
      root.add(B(0.5,0.12,0.62,COL.feather,0,0.7,-0.1)); // belly fade
      root.add(SP(0.3,COL.bird,0,1.4,0.5,14));            // head
      var beak=CO(0.12,0.34,COL.beak,0,1.36,0.82,10); beak.rotation.x=Math.PI/2; root.add(beak);
      root.add(SP(0.05,COL.eye,0.15,1.48,0.74,8)); root.add(SP(0.05,COL.eye,-0.15,1.48,0.74,8));
      [-1,1].forEach(function(s){ var w=new THREE.Group(); w.position.set(s*0.45,1.05,0); root.add(w); wings.push(w); var pf=B(0.9,0.08,0.7,COL.feather,s*0.5,0,-0.05); pf.rotation.z=s*0.15; w.add(pf); var tf=B(0.5,0.07,0.4,COL.bird,s*0.85,0.02,-0.1); w.add(tf); });
      for(var f=0;f<3;f++){ root.add(B(0.16,0.06,0.5,COL.feather,(f-1)*0.16,0.95,-0.7)); } // tail fan
      [-1,1].forEach(function(s){ var g=legPivot(s*0.16,0.6,0.0); g.add(CY(0.05,0.05,0.6,COL.leg,0,-0.3,0,8)); g.add(B(0.16,0.05,0.22,COL.leg,0,-0.6,0.06)); });
      saddlePad(1.28);
    }

    saddle.position.set(0, saddleH, -0.02);
    root.add(saddle);

    var t=0;
    function animate(dt, o){ o=o||{}; t+=dt; var moving=o.move;
      root.position.y = Math.sin(t*(moving?9:2)) * (moving?0.05:0.02);
      if(wings.length){ var f=Math.sin(t*(moving?10:3))*(moving?0.6:0.2); wings[0].rotation.z=f; wings[1].rotation.z=-f; }
      else { for(var i=0;i<legs.length;i++){ legs[i].rotation.x = moving ? Math.sin(t*8 + i*Math.PI/2)*0.4 : 0; } }
    }

    return { root:root, saddle:saddle, saddleHeight:saddleH, animate:animate, name:name };
  }

  global.MountForge = { createMount:createMount, CATALOG:CATALOG, COLORS:COL };
})(typeof window !== 'undefined' ? window : this);
