/* ============================================================================
 * themed-mounts.js  —  ENGINE-READY zone-themed mounts + pets (Three.js r128)
 * ----------------------------------------------------------------------------
 * Extends the MountForge pattern (see mount-builders.js). Same conventions:
 * global `ThemedMounts`, global THREE, MeshLambertMaterial, low-poly, rideable.
 *
 *   const m = ThemedMounts.createMount('vinesteed');
 *   scene.add(m.root);  m.saddle.add(hero.root);  m.animate(dt,{move:true});
 *
 *   const p = ThemedMounts.createPet('leafkit');     // small, follows player
 *   scene.add(p.root);  p.animate(dt,{move:true});   // engine drives position
 *
 * Mounts (one per zone): hexapod(S7L1) · cellskimmer(S7L2) · vinesteed(S7L3)
 *                        canopyglider(S7L4) · fossilraptor(S7L5)
 * Pets: sporepup · cellpet · helixwisp · leafkit · fossilchick
 * ========================================================================== */
(function (global) {
  var MOUNTS = { hexapod:'Crossroads Hexapod', cellskimmer:'Cell Skimmer', vinesteed:'Vine Steed', canopyglider:'Canopy Glider', fossilraptor:'Fossil Raptor' };
  var PETS = { sporepup:'Spore Pup', cellpet:'Cyto Blob', helixwisp:'Helix Wisp', leafkit:'Leaf Kit', fossilchick:'Fossil Chick' };
  var ZONE = { hexapod:0x7c63ff, cellskimmer:0x4cc9f0, vinesteed:0x43c785, canopyglider:0x2fa36b, fossilraptor:0xb7c0cc };

  function helpers(){
    var THREE=global.THREE, cache={};
    return {
      mat:function(c){ if(!cache['m'+c]) cache['m'+c]=new THREE.MeshLambertMaterial({color:c}); return cache['m'+c]; },
      glow:function(c,i){ var k='g'+c+(i||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:(i==null?0.5:i)}); return cache[k]; },
      trans:function(c,o){ var k='t'+c+o; if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,transparent:true,opacity:o}); return cache[k]; },
      THREE:THREE
    };
  }

  function createMount(name){
    var H=helpers(), THREE=H.THREE;
    function mat(c){return H.mat(c);} function glow(c,i){return H.glow(c,i);} function trans(c,o){return H.trans(c,o);}
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||10),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||12; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(8,seg-2)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||10),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,8,seg||16),mat(c)); m.position.set(x||0,y||0,z||0); return m; }

    var root=new THREE.Group(), saddle=new THREE.Group(), legs=[], wings=[];
    var accent=ZONE[name]||0xe6b84c, saddleH=1.3, hover=false;
    var COL={eye:0x20242e,white:0xf2f1ec,saddle:0x6e4a28,trim:0xe6b84c,bark:0x5a3f28,leaf:0x3f9e4a,leafD:0x2f7a39,bone:0xe8e0cc,stone:0x8a8f9a,stoneD:0x5f656e};
    function pad(y){ root.add(B(0.5,0.12,0.62,COL.saddle,0,y,-0.02)); root.add(B(0.54,0.05,0.16,COL.trim,0,y+0.07,-0.28)); }
    function legPivot(x,topY,z){ var g=new THREE.Group(); g.position.set(x,topY,z); root.add(g); legs.push(g); return g; }

    if(name==='hexapod'){
      saddleH=1.15;
      var body=SP(0.7,accent,0,0.85,0,16); body.scale.set(1.2,0.8,1.5); root.add(body);
      root.add(SP(0.42,0x5a44c6,0,0.95,0.85,14));                 // head
      root.add(SP(0.07,COL.white,0.16,1.05,1.18,8)); root.add(SP(0.07,COL.white,-0.16,1.05,1.18,8));
      root.add(SP(0.035,COL.eye,0.16,1.05,1.24,8)); root.add(SP(0.035,COL.eye,-0.16,1.05,1.24,8));
      var aL=CY(0.02,0.02,0.4,0x4a3a9a,0.14,1.3,1.05,6); aL.rotation.set(-0.5,0,0.3); root.add(aL);
      var aR=CY(0.02,0.02,0.4,0x4a3a9a,-0.14,1.3,1.05,6); aR.rotation.set(-0.5,0,-0.3); root.add(aR);
      for(var sp=0;sp<4;sp++){ var sa=sp/4*Math.PI*2; root.add(SP(0.1,0x9b7cff,Math.cos(sa)*0.5,1.2,Math.sin(sa)*0.6-0.2,8)); } // back gems
      [-1,1].forEach(function(s){ [0.55,0.05,-0.45].forEach(function(z){ var g=legPivot(s*0.55,0.85,z); var lg=CY(0.05,0.03,0.7,0x5a44c6,s*0.22,-0.28,0,6); lg.rotation.z=s*0.9; g.add(lg); g.add(SP(0.06,accent,s*0.42,-0.55,0,6)); }); });
      pad(1.18);
    }
    else if(name==='cellskimmer'){
      saddleH=1.05; hover=true;
      var blob=SP(1.0,accent,0,0.9,0,18); blob.scale.set(1.4,0.7,1.2); blob.material=trans(accent,0.55); root.add(blob);
      var nuc=SP(0.4,0x7c63ff,0,0.85,-0.1,12); nuc.material=glow(0x7c63ff,0.3); root.add(nuc);   // nucleus
      for(var v=0;v<5;v++){ root.add(SP(0.16,0x6fd8ef,(Math.random()-0.5)*1.6,0.9,(Math.random()-0.5)*1.4,8)); } // vacuoles
      root.add(SP(0.07,COL.white,0.25,1.05,0.95,8)); root.add(SP(0.07,COL.white,-0.25,1.05,0.95,8));
      root.add(SP(0.035,COL.eye,0.25,1.05,1.0,8)); root.add(SP(0.035,COL.eye,-0.25,1.05,1.0,8));
      // cilia ring
      for(var c=0;c<16;c++){ var ca=c/16*Math.PI*2; var ci=CY(0.02,0.01,0.3,0x6fd8ef,Math.cos(ca)*1.35,0.85,Math.sin(ca)*1.15,5); ci.rotation.z=Math.cos(ca)*0.8; ci.rotation.x=Math.sin(ca)*0.8; root.add(ci); legs.push(ci); }
      pad(1.08);
    }
    else if(name==='vinesteed'){
      saddleH=1.5;
      root.add(SP(0.42,COL.leafD,0,1.0,-0.45,14)); root.add(SP(0.4,COL.leafD,0,1.02,0.5,14));
      root.add(B(0.6,0.55,1.3,COL.leafD,0,1.0,0));
      var neck=B(0.3,0.6,0.32,COL.leafD,0,1.35,0.66); neck.rotation.x=-0.5; root.add(neck);
      root.add(B(0.28,0.3,0.52,COL.bark,0,1.6,0.92));            // bark head
      root.add(SP(0.04,COL.eye,0.13,1.62,1.08,8)); root.add(SP(0.04,COL.eye,-0.13,1.62,1.08,8));
      // leaf-frond mane + flowers
      for(var mz=0;mz<6;mz++){ var lf=CO(0.16,0.5,COL.leaf,0,1.5-mz*0.05,0.5-mz*0.12,5); lf.rotation.x=-0.8; root.add(lf); }
      [[0.2,1.1,0.4],[ -0.2,1.0,-0.5],[0.3,0.95,-0.2]].forEach(function(p){ root.add(SP(0.1,0xe6b84c,p[0],p[1],p[2],8)); });
      var tail=CO(0.18,0.8,COL.leaf,0,0.95,-0.85,5); tail.rotation.x=0.7; root.add(tail);
      [[0.22,0.45],[-0.22,0.45],[0.22,-0.45],[-0.22,-0.45]].forEach(function(p){ var g=legPivot(p[0],0.9,p[1]); g.add(CY(0.1,0.08,0.9,COL.bark,0,-0.45,0,8)); g.add(SP(0.1,COL.leafD,0,-0.88,0,8)); });
      pad(1.4);
    }
    else if(name==='canopyglider'){
      saddleH=1.2;
      var bd=SP(0.5,COL.leafD,0,1.0,0,16); bd.scale.set(1,0.9,1.4); root.add(bd);
      root.add(SP(0.32,0x3f9e4a,0,1.35,0.55,14));               // head
      var beak=CO(0.12,0.34,COL.trim,0,1.32,0.86,10); beak.rotation.x=Math.PI/2; root.add(beak);
      root.add(SP(0.05,COL.eye,0.16,1.44,0.78,8)); root.add(SP(0.05,COL.eye,-0.16,1.44,0.78,8));
      [-1,1].forEach(function(s){ var w=new THREE.Group(); w.position.set(s*0.45,1.05,0); root.add(w); wings.push(w);
        var memb=B(1.5,0.06,1.0,accent,s*0.85,0,-0.05); memb.material=trans(accent,0.85); w.add(memb);
        var rib=B(1.5,0.08,0.08,COL.leafD,s*0.85,0.04,0.4); w.add(rib); });
      for(var f=0;f<3;f++){ root.add(CO(0.1,0.5,COL.leafD,(f-1)*0.18,0.95,-0.7,5)); } // tail leaves
      [-1,1].forEach(function(s){ var g=legPivot(s*0.16,0.6,0.0); g.add(CY(0.05,0.05,0.5,COL.trim,0,-0.25,0,6)); g.add(B(0.16,0.05,0.22,COL.trim,0,-0.5,0.06)); });
      pad(1.22);
    }
    else { // fossilraptor
      saddleH=1.35;
      root.add(B(0.46,0.5,1.0,COL.stone,0,1.05,0.05));
      root.add(SP(0.26,COL.stone,0,1.05,0.55,12));
      var neck2=B(0.26,0.4,0.26,COL.stone,0,1.4,0.6); neck2.rotation.x=-0.4; root.add(neck2);
      root.add(B(0.26,0.26,0.5,COL.stoneD,0,1.62,0.86));
      root.add(B(0.22,0.16,0.22,COL.bone,0,1.55,1.12));         // bone snout
      root.add(SP(0.045,accent,0.12,1.66,1.0,8)); root.add(SP(0.045,accent,-0.12,1.66,1.0,8));
      // ribcage detail
      for(var r=0;r<4;r++){ var rib2=TO(0.26,0.03,COL.bone,0,1.0,0.3-r*0.22,10); rib2.rotation.y=Math.PI/2; root.add(rib2); }
      for(var i=0;i<5;i++){ root.add(B(0.3-i*0.045,0.3-i*0.045,0.28,COL.stone,0,1.0-i*0.02,-0.5-i*0.26)); } // tail
      [-1,1].forEach(function(s){ var g=legPivot(s*0.26,1.0,-0.05); g.add(B(0.2,0.46,0.24,COL.stone,0,-0.22,0)); g.add(B(0.14,0.4,0.16,COL.stoneD,0,-0.55,0.08)); g.add(B(0.16,0.1,0.32,COL.bone,0,-0.74,0.18)); });
      pad(1.32);
    }

    saddle.position.set(0,saddleH,-0.02); root.add(saddle);
    var t=0;
    function animate(dt,o){ o=o||{}; t+=dt; var moving=o.move;
      root.position.y = Math.sin(t*(moving?9:2))*(moving?0.05:0.02) + (hover?0.12+Math.sin(t*1.5)*0.06:0);
      if(wings.length){ var f=Math.sin(t*(moving?10:3))*(moving?0.6:0.25); wings[0].rotation.z=f; wings[1].rotation.z=-f; }
      else if(name==='cellskimmer'){ for(var i=0;i<legs.length;i++){ legs[i].rotation.z += Math.sin(t*6+i)*0.02; } }
      else { for(var j=0;j<legs.length;j++){ legs[j].rotation.x = moving? Math.sin(t*8+j*1.05)*0.4 : 0; } }
    }
    return { root:root, saddle:saddle, saddleHeight:saddleH, animate:animate, name:MOUNTS[name]||name, accent:accent, key:name };
  }

  function createPet(name){
    var H=helpers(), THREE=H.THREE;
    function mat(c){return H.mat(c);} function glow(c,i){return H.glow(c,i);} function trans(c,o){return H.trans(c,o);}
    function SP(r,c,x,y,z,seg){ seg=seg||10; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(6,seg-2)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||8),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||7),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    var root=new THREE.Group(); var float=false; var bobItems=[]; var accent;
    var eye=0x20242e, white=0xf2f1ec;
    function face(g,y,z,r){ g.add(SP(0.06,white,0.1,y,z,8)); g.add(SP(0.06,white,-0.1,y,z,8)); g.add(SP(0.03,eye,0.11,y,z+0.04,6)); g.add(SP(0.03,eye,-0.11,y,z+0.04,6)); }

    if(name==='sporepup'){ accent=0xd8654c;
      root.add(SP(0.32,0xece3d0,0,0.32,0,10));                 // body (stem-white)
      var cap=SP(0.34,accent,0,0.55,0,10); cap.scale.y=0.6; root.add(cap);
      for(var s=0;s<4;s++){ var sa=s/4*Math.PI*2; root.add(SP(0.05,0xf2d9a0,Math.cos(sa)*0.2,0.62,Math.sin(sa)*0.2,6)); }
      face(root,0.4,0.28,0); root.add(CY(0.05,0.04,0.2,0xece3d0,0,0.12,-0.3,6)); // tail
      [[0.14,0.12],[-0.14,0.12],[0.14,-0.12],[-0.14,-0.12]].forEach(function(p){ root.add(SP(0.07,0xece3d0,p[0],0.08,p[1],8)); });
    }
    else if(name==='cellpet'){ accent=0x4cc9f0; float=true;
      var b=SP(0.4,accent,0,0.4,0,12); b.scale.set(1.3,0.8,1); b.material=trans(accent,0.6); root.add(b);
      root.add(SP(0.14,0x7c63ff,0,0.38,-0.05,8));
      face(root,0.46,0.34,0);
      for(var c=0;c<10;c++){ var ca=c/10*Math.PI*2; root.add(CY(0.015,0.01,0.14,0x6fd8ef,Math.cos(ca)*0.5,0.4,Math.sin(ca)*0.42,4)); }
    }
    else if(name==='helixwisp'){ accent=0x43c785; float=true;
      var spin=new THREE.Group(); spin.position.y=0.5; root.add(spin); bobItems.push({obj:spin,spin:true});
      for(var i=0;i<=10;i++){ var ang=i/10*Math.PI*3, y=i*0.06-0.3; var a=SP(0.07,0xeef0ea,Math.cos(ang)*0.18,y,Math.sin(ang)*0.18,7); a.material=glow(0x9be8c0,0.4); spin.add(a); var bb=SP(0.07,0xeef0ea,Math.cos(ang+Math.PI)*0.18,y,Math.sin(ang+Math.PI)*0.18,7); bb.material=glow(0x9be8c0,0.4); spin.add(bb); }
      var halo=SP(0.5,accent,0,0.5,0,12); halo.material=trans(accent,0.12); root.add(halo);
    }
    else if(name==='leafkit'){ accent=0x2fa36b;
      root.add(SP(0.3,0xe0a85c,0,0.32,0,10));                  // fox-ish body (warm)
      root.add(SP(0.22,0xe0a85c,0,0.5,0.25,9));                // head
      root.add(CO(0.1,0.24,accent,0.13,0.7,0.22,5)); root.add(CO(0.1,0.24,accent,-0.13,0.7,0.22,5)); // leaf ears
      face(root,0.5,0.45,0);
      var tail=CO(0.16,0.5,accent,0,0.35,-0.35,6); tail.rotation.x=0.8; root.add(tail);
      [[0.12,0.1],[-0.12,0.1],[0.12,-0.12],[-0.12,-0.12]].forEach(function(p){ root.add(CY(0.05,0.05,0.18,0x8a5a30,p[0],0.1,p[1],6)); });
    }
    else { // fossilchick
      accent=0xb7c0cc;
      root.add(SP(0.3,0x8a8f9a,0,0.34,0,10));
      root.add(SP(0.2,0x8a8f9a,0,0.55,0.18,9));
      var fcBeak=CO(0.08,0.2,0xe8e0cc,0,0.55,0.4,8); fcBeak.rotation.x=Math.PI/2; root.add(fcBeak); // beak
      face(root,0.58,0.36,0);
      var tail=CO(0.14,0.3,0x5f656e,0,0.36,-0.3,6); tail.rotation.x=0.7; root.add(tail);
      [[0.1,0],[-0.1,0]].forEach(function(p){ root.add(CY(0.04,0.04,0.18,0xe8e0cc,p[0],0.08,0,6)); });
    }

    var t=0;
    function animate(dt,o){ o=o||{}; t+=dt; var moving=o.move;
      root.position.y = (float?0.2+Math.sin(t*1.8)*0.08 : Math.abs(Math.sin(t*(moving?10:3)))*(moving?0.06:0.02));
      for(var i=0;i<bobItems.length;i++){ if(bobItems[i].spin) bobItems[i].obj.rotation.y+=dt*1.2; }
    }
    return { root:root, animate:animate, name:PETS[name]||name, accent:accent, key:name };
  }

  global.ThemedMounts = { createMount:createMount, createPet:createPet, MOUNTS:MOUNTS, PETS:PETS, ZONE:ZONE };
})(typeof window!=='undefined'?window:this);
