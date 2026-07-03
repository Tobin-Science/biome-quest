/* ============================================================================
 * gear-builders.js  —  ENGINE-READY low-poly character + gear for Three.js r128
 * ----------------------------------------------------------------------------
 * Framework-agnostic. No DC runtime, no React, no modules — just attaches a
 * global `HeroForge` and uses the global `THREE` (the same way earth_quest /
 * game.html load it). Drop this <script> in AFTER three.min.js.
 *
 *   const hero = HeroForge.createHero();        // build base body + default gear
 *   scene.add(hero.root);
 *   hero.equip('chest', 2);                     // swap a slot (see CATALOG below)
 *   // in your render loop:
 *   hero.animate(dt, { walk: isMoving });       // procedural walk / idle
 *
 * Slots: helm · chest · gloves · legs · boots   (variant 0 = none/bare)
 * Everything is MeshLambertMaterial (no shadow maps) and low poly — built to
 * run on classroom Chromebooks. School-appropriate: armor & tools, no weapons.
 * ========================================================================== */
(function (global) {
  var THREE;   // resolved lazily in createHero() so script load order never matters

  var COL = {
    skin:0xe8b48f, hair:0x5a3a22, eye:0x2a2433,
    tunic:0x3f8f5e, pants:0x6e5236,
    steel:0xb7c0cc, steelD:0x8b95a3, iron:0x6c7480,
    bronze:0xc08a44, bronzeD:0x9a6b32, gold:0xe6b84c, goldD:0xb88a2e,
    leather:0x9a6a3c, leatherD:0x6e4a28,
    clothG:0x2fa36b, clothC:0x3aa8c9, clothV:0x7c63ff, clothO:0xe6994c,
    gemC:0x4cc9f0, gemG:0x43c785, gemV:0x9b7cff, tan:0xcbb079, dark:0x33384a
  };

  // Human-readable variant names (index 0 = bare). Use for UI / customization menus.
  var CATALOG = {
    helm:   ['Bare Head','Explorer Hat','Steel Greathelm','Sage Circlet','Horned War Helm','Wizard Hat'],
    chest:  ['Plain Tunic','Field Jerkin','Steel Plate','Emerald Robe','Scaled Brigandine','Golden Cuirass'],
    gloves: ['Bare Hands','Leather Gloves','Plate Gauntlets','Cloth Wraps','Spiked Bracers'],
    legs:   ['Plain Pants','Leather Trousers','Plate Greaves','Robe Skirt','Scaled Leggings'],
    boots:  ['Bare Feet','Leather Boots','Plate Sabatons','Soft Shoes','Adventurer Boots']
  };

  function createHero(opts) {
    opts = opts || {};
    THREE = global.THREE;
    var matCache = {};
    function mat(c){ if(!matCache[c]) matCache[c]=new THREE.MeshLambertMaterial({color:c}); return matCache[c]; }
    function gem(c){ var k='g'+c; if(!matCache[k]) matCache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:.6}); return matCache[k]; }
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||14),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||14; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(8,seg-2)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||14),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,8,seg||18),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function GM(r,c,x,y,z){ var m=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),gem(c)); m.position.set(x||0,y||0,z||0); return m; }

    var root = new THREE.Group();
    var A = {};               // animation anchors
    var mounted = { helm:[], chest:[], gloves:[], legs:[], boots:[] };

    // ---- base body (customizable: pass opts.skin / opts.hair hex to recolor) ----
    var skin = opts.skin != null ? opts.skin : COL.skin;
    var hairC = opts.hair != null ? opts.hair : COL.hair;
    (function buildBody(){
      var torsoG=new THREE.Group(); root.add(torsoG); A.torsoG=torsoG;
      torsoG.add(B(0.5,0.6,0.32,COL.tunic,0,1.22,0));
      torsoG.add(B(0.52,0.12,0.34,0x356f4a,0,0.97,0));
      torsoG.add(CY(0.1,0.12,0.1,skin,0,1.55,0));
      var headG=new THREE.Group(); headG.position.set(0,1.84,0); torsoG.add(headG); A.headG=headG;
      headG.add(SP(0.27,skin,0,0,0,16));
      var hair=SP(0.285,hairC,0,0.05,-0.03,16); hair.scale.set(1,0.72,1); headG.add(hair); A.hair=hair;
      headG.add(SP(0.035,COL.eye,0.1,0,0.24,8));
      headG.add(SP(0.035,COL.eye,-0.1,0,0.24,8));
      A.headMeshes=[headG.children[0]];   // for live skin-tone recolor
      ['L','R'].forEach(function(side){
        var sx=side==='L'?0.34:-0.34;
        var sh=new THREE.Group(); sh.position.set(sx,1.46,0); torsoG.add(sh);
        sh.rotation.z=side==='L'?0.1:-0.1; A['sh'+side]=sh;
        sh.add(B(0.15,0.42,0.17,skin,0,-0.21,0));
        sh.add(B(0.13,0.4,0.15,skin,0,-0.6,0));
        var hand=new THREE.Group(); hand.position.set(0,-0.82,0); sh.add(hand); A['hand'+side]=hand;
        hand.add(SP(0.1,skin,0,0,0,12));
      });
      ['L','R'].forEach(function(side){
        var lx=side==='L'?0.17:-0.17;
        var leg=new THREE.Group(); leg.position.set(lx,0.92,0); root.add(leg); A['leg'+side]=leg;
        leg.add(B(0.2,0.48,0.22,COL.pants,0,-0.26,0));
        leg.add(B(0.17,0.42,0.19,COL.pants,0,-0.66,0));
        var foot=new THREE.Group(); foot.position.set(0,-0.9,0.04); leg.add(foot); A['foot'+side]=foot;
        foot.add(B(0.18,0.12,0.3,skin,0,0.05,0.04));
      });
    })();

    function add(slot,parent,m){ parent.add(m); mounted[slot].push(m); return m; }
    function removeSlot(slot){ mounted[slot].forEach(function(m){ if(m.parent)m.parent.remove(m); if(m.geometry)m.geometry.dispose(); }); mounted[slot]=[]; }

    // ---- HELMS (anchor: headG) ----
    function buildHelm(i){ var P=A.headG, a=function(m){return add('helm',P,m);};
      if(i===1){ a(CY(0.5,0.5,0.04,COL.tan,0,0.14,0,20)); a(CY(0.3,0.34,0.22,COL.tan,0,0.28,0,18)); var b=TO(0.32,0.035,COL.clothO,0,0.18,0); b.rotation.x=Math.PI/2; a(b); }
      else if(i===2){ a(B(0.5,0.48,0.5,COL.steel,0,0.05,0)); a(B(0.34,0.14,0.06,COL.eye,0,0,0.26)); a(B(0.05,0.34,0.46,COL.steelD,0,0.34,0)); a(SP(0.05,COL.gold,0.27,0.04,0.06,8)); a(SP(0.05,COL.gold,-0.27,0.04,0.06,8)); }
      else if(i===3){ var c=TO(0.3,0.04,COL.gold,0,0.05,0); c.rotation.x=Math.PI/2; a(c); a(GM(0.07,COL.gemV,0,0.13,0.28)); }
      else if(i===4){ a(CY(0.3,0.33,0.3,COL.bronze,0,0.06,0,16)); var d=SP(0.3,COL.bronze,0,0.18,0,16); d.scale.set(1,0.7,1); a(d); a(B(0.08,0.26,0.06,COL.bronzeD,0,-0.02,0.27)); var hl=CO(0.09,0.42,COL.bronze,0.32,0.22,0,12); hl.rotation.z=-1.0; a(hl); var hr=CO(0.09,0.42,COL.bronze,-0.32,0.22,0,12); hr.rotation.z=1.0; a(hr); }
      else if(i===5){ a(CY(0.46,0.46,0.04,COL.clothV,0,0.12,0,20)); a(CO(0.3,0.74,COL.clothV,0,0.52,0,18)); var bb=TO(0.3,0.04,COL.clothO,0,0.16,0); bb.rotation.x=Math.PI/2; a(bb); a(GM(0.04,COL.gold,0.12,0.55,0.18)); a(GM(0.035,COL.gemC,-0.05,0.78,0.14)); }
    }
    // ---- CHEST (anchor: torsoG) ----
    function buildChest(i){ var P=A.torsoG, a=function(m){return add('chest',P,m);};
      if(i===1){ a(B(0.56,0.6,0.4,COL.leather,0,1.22,0)); a(B(0.58,0.1,0.42,COL.leatherD,0,0.99,0)); var s1=B(0.06,0.5,0.02,COL.leatherD,0,1.24,0.21); s1.rotation.z=0.5; a(s1); var s2=B(0.06,0.5,0.02,COL.leatherD,0,1.24,0.21); s2.rotation.z=-0.5; a(s2); a(B(0.5,0.1,0.42,COL.leatherD,0,1.5,0)); }
      else if(i===2){ a(B(0.54,0.58,0.42,COL.steel,0,1.24,0)); a(B(0.08,0.5,0.04,COL.steelD,0,1.24,0.22)); var nk=TO(0.26,0.045,COL.gold,0,1.5,0); nk.rotation.x=Math.PI/2; a(nk); [0.42,-0.42].forEach(function(sx){ a(SP(0.24,COL.steel,sx,1.52,0,14)); var cap=SP(0.26,COL.steelD,sx,1.6,0,14); cap.scale.set(1,0.5,1); a(cap); a(SP(0.05,COL.gold,sx,1.66,0.18,8)); }); }
      else if(i===3){ a(B(0.54,0.62,0.4,COL.clothG,0,1.22,0)); a(CY(0.3,0.52,0.55,COL.clothG,0,0.7,0,16)); a(B(0.06,0.62,0.02,COL.gold,0,1.22,0.21)); a(SP(0.17,COL.clothV,0.37,1.5,0,12)); a(SP(0.17,COL.clothV,-0.37,1.5,0,12)); var hood=SP(0.26,COL.clothG,0,1.56,-0.06,14); hood.scale.set(1,0.7,1); a(hood); }
      else if(i===4){ a(B(0.54,0.6,0.4,COL.leatherD,0,1.22,0)); for(var r=0;r<4;r++){ [-0.16,0,0.16].forEach(function(sx){ a(B(0.13,0.1,0.04,COL.steel,sx,1.42-r*0.13,0.205)); }); } a(SP(0.18,COL.iron,0.38,1.5,0,12)); a(SP(0.18,COL.iron,-0.38,1.5,0,12)); }
      else if(i===5){ a(B(0.54,0.58,0.42,COL.gold,0,1.24,0)); a(GM(0.08,COL.gemG,0,1.3,0.23)); [0.42,-0.42].forEach(function(sx){ a(CY(0.1,0.26,0.18,COL.gold,sx,1.52,0,12)); a(CO(0.06,0.24,COL.goldD,sx,1.74,0,10)); }); var nk2=TO(0.26,0.05,COL.goldD,0,1.5,0); nk2.rotation.x=Math.PI/2; a(nk2); }
    }
    // ---- GLOVES (anchors: handL + handR) ----
    function buildGloves(i){ ['L','R'].forEach(function(side){ var P=A['hand'+side], a=function(m){return add('gloves',P,m);};
      if(i===1){ a(B(0.17,0.17,0.18,COL.leather,0,0,0)); a(CY(0.13,0.15,0.12,COL.leatherD,0,0.13,0,12)); }
      else if(i===2){ a(B(0.18,0.18,0.19,COL.steel,0,0,0)); var cuff=CO(0.19,0.18,COL.steelD,0,0.17,0,12); cuff.rotation.x=Math.PI; a(cuff); a(SP(0.035,COL.gold,0,0.02,0.11,8)); }
      else if(i===3){ for(var k=0;k<3;k++){ var w=TO(0.12,0.03,COL.clothC,0,0.05+k*0.08,0,12); w.rotation.x=Math.PI/2; a(w); } a(B(0.15,0.13,0.16,COL.clothC,0,-0.02,0)); }
      else if(i===4){ a(CY(0.14,0.15,0.28,COL.leatherD,0,0.12,0,12)); a(B(0.16,0.15,0.17,COL.leather,0,-0.04,0)); var sx=side==='L'?0.14:-0.14; var sp=CO(0.05,0.16,COL.steel,sx,0.13,0,8); sp.rotation.z=side==='L'?-Math.PI/2:Math.PI/2; a(sp); }
    }); }
    // ---- LEGS (anchors: legL + legR; Robe Skirt is one piece on torsoG) ----
    function buildLegs(i){
      if(i===3){ var P=A.torsoG, a=function(m){return add('legs',P,m);}; a(CY(0.34,0.62,0.62,COL.clothG,0,0.62,0,18)); var hem=TO(0.6,0.04,COL.gold,0,0.32,0); hem.rotation.x=Math.PI/2; a(hem); return; }
      ['L','R'].forEach(function(side){ var P=A['leg'+side], a=function(m){return add('legs',P,m);};
        if(i===1){ a(B(0.22,0.5,0.24,COL.leather,0,-0.28,0)); a(B(0.2,0.08,0.22,COL.leatherD,0,-0.54,0)); }
        else if(i===2){ a(B(0.24,0.46,0.26,COL.steel,0,-0.26,0)); a(SP(0.13,COL.steelD,0,-0.52,0.04,12)); a(B(0.2,0.34,0.22,COL.steel,0,-0.74,0)); }
        else if(i===4){ a(B(0.22,0.5,0.24,COL.leatherD,0,-0.28,0)); for(var r=0;r<3;r++){ a(B(0.18,0.09,0.04,COL.iron,0,-0.16-r*0.16,0.12)); } }
      });
    }
    // ---- BOOTS (anchors: footL + footR) ----
    function buildBoots(i){ ['L','R'].forEach(function(side){ var P=A['foot'+side], a=function(m){return add('boots',P,m);};
      if(i===1){ a(B(0.2,0.14,0.34,COL.leather,0,0.05,0.04)); a(CY(0.13,0.14,0.18,COL.leatherD,0,0.18,-0.02,12)); }
      else if(i===2){ a(B(0.2,0.15,0.3,COL.steel,0,0.05,0.04)); var toe=CO(0.1,0.2,COL.steel,0,0.05,0.24,10); toe.rotation.x=Math.PI/2; a(toe); a(B(0.18,0.16,0.2,COL.steelD,0,0.2,-0.02)); }
      else if(i===3){ a(B(0.18,0.1,0.3,COL.clothC,0,0.03,0.03)); }
      else if(i===4){ a(B(0.2,0.14,0.34,COL.leather,0,0.05,0.04)); a(CY(0.14,0.15,0.4,COL.leather,0,0.3,-0.02,12)); var cuff=TO(0.15,0.04,COL.leatherD,0,0.48,-0.02,12); cuff.rotation.x=Math.PI/2; a(cuff); }
    }); }

    var BUILDERS = { helm:buildHelm, chest:buildChest, gloves:buildGloves, legs:buildLegs, boots:buildBoots };

    function equip(slot, variant){ removeSlot(slot); if(variant>0) BUILDERS[slot](variant); }

    // live recolor for the customization menu (skin tone / hair color)
    function setSkin(hex){ mat(skin); A.headMeshes[0].material=mat(hex); /* extend to arms/hands/feet as needed */ }
    function setHair(hex){ A.hair.material=mat(hex); }

    // procedural animation — call each frame
    var t=0;
    function animate(dt, o){ o=o||{}; t+=dt;
      if(o.walk){ var s=Math.sin(t*6); A.legL.rotation.x=s*0.5; A.legR.rotation.x=-s*0.5; A.shL.rotation.x=-s*0.45; A.shR.rotation.x=s*0.45; root.position.y=Math.abs(Math.sin(t*12))*0.04; }
      else { var s2=Math.sin(t*2); A.legL.rotation.x=0; A.legR.rotation.x=0; A.shL.rotation.x=s2*0.05; A.shR.rotation.x=-s2*0.05; root.position.y=Math.sin(t*2)*0.012; }
    }

    // default loadout
    var defaults = opts.gear || { helm:2, chest:2, gloves:2, legs:2, boots:2 };
    Object.keys(defaults).forEach(function(s){ equip(s, defaults[s]); });

    return { root:root, anchors:A, equip:equip, animate:animate, setSkin:setSkin, setHair:setHair, catalog:CATALOG };
  }

  global.HeroForge = { createHero:createHero, CATALOG:CATALOG, COLORS:COL };
})(typeof window !== 'undefined' ? window : this);
