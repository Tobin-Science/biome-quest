/* ============================================================================
 * npc-roster.js  —  ENGINE-READY NPC roster for Biome Quest (Three.js r128)
 * ----------------------------------------------------------------------------
 * NPCs are HeroForge figures with distinct gear / hair / skin / a held prop,
 * driven by the configs in NpcForge.ROSTER. Reuses gear-builders.js +
 * hair-builders.js. Same conventions: global `NpcForge`, global THREE, Lambert.
 *
 *   const npc = NpcForge.createNpc('teacher_classification');
 *   scene.add(npc.root);
 *   npc.animate(dt);                 // gentle idle
 *
 * Each config is a plain preset the engine can read directly:
 *   { name, role, zone, accent, skin, hairColor, style, gear:{slot:variant}, prop }
 * Props (new small meshes, see buildProp): scroll · net · flask · satchel ·
 *   staff · trowel · lantern · clipboard · book   (prop:null = empty hands)
 * ========================================================================== */
(function (global) {
  // gear variant indices map to HeroForge.CATALOG (0 = bare/none)
  var ROSTER = {
    // ---- FIVE ZONE TEACHERS ----
    teacher_classification: { name:'Maple Thornwood', role:'Classification Scholar', zone:'S7L1', accent:0x7c63ff,
      skin:0xe8b48f, hairColor:0x5a3a22, style:'bun', gear:{helm:3,chest:3,gloves:3,legs:3,boots:3}, prop:'scroll' },
    teacher_cells: { name:'Dr. Vela Marrow', role:'Cell Biologist', zone:'S7L2', accent:0x4cc9f0,
      skin:0xc68642, hairColor:0x1c130c, style:'short', gear:{helm:0,chest:3,gloves:3,legs:3,boots:3}, prop:'flask' },
    teacher_genetics: { name:'Professor Gil Strand', role:'Geneticist', zone:'S7L3', accent:0x43c785,
      skin:0x6e4326, hairColor:0xcfd6dd, style:'locs', gear:{helm:0,chest:3,gloves:3,legs:3,boots:3}, prop:'flask' },
    teacher_ecology: { name:'Ranger Fern Oakes', role:'Ecologist / Ranger', zone:'S7L4', accent:0x2fa36b,
      skin:0x8a5a30, hairColor:0x3a2418, style:'ponytail', gear:{helm:1,chest:1,gloves:1,legs:1,boots:4}, prop:'net' },
    teacher_evolution: { name:'Dr. Cassia Flint', role:'Paleontologist', zone:'S7L5', accent:0xb7c0cc,
      skin:0xd99a6c, hairColor:0x8a5a30, style:'braids', gear:{helm:1,chest:1,gloves:1,legs:1,boots:4}, prop:'trowel' },

    // ---- VENDORS ----
    vendor_consumables: { name:'Pip Brambles', role:'Consumables Seller', zone:'Hub', accent:0xe6994c,
      skin:0xf6cda6, hairColor:0xc8893c, style:'curls', gear:{helm:1,chest:1,gloves:0,legs:1,boots:1}, prop:'satchel' },
    vendor_shop: { name:'Tobias Crate', role:'Shopkeeper', zone:'Hub', accent:0x9a6a3c,
      skin:0x5a3420, hairColor:0x1c130c, style:'buzz', gear:{helm:0,chest:4,gloves:4,legs:4,boots:1}, prop:'book' },

    // ---- TRAINERS ----
    trainer_guardian: { name:'Sergeant Bryn', role:'Guardian Trainer', zone:'Hub', accent:0xb7c0cc,
      skin:0xa86b3c, hairColor:0x1c130c, style:'short', gear:{helm:2,chest:2,gloves:2,legs:2,boots:2}, prop:'staff' },
    trainer_field: { name:'Wren Dapple', role:'Field Trainer', zone:'Hub', accent:0x2fa36b,
      skin:0xfce0c8, hairColor:0xd9b56a, style:'ponytail', gear:{helm:1,chest:1,gloves:1,legs:4,boots:4}, prop:'net' },
    trainer_lore: { name:'Elder Moss', role:'Lore Trainer', zone:'Hub', accent:0x7c63ff,
      skin:0x8a5a30, hairColor:0xcfd6dd, style:'long', gear:{helm:5,chest:3,gloves:3,legs:3,boots:3}, prop:'staff' },

    // ---- SPECIALS ----
    ms_quill: { name:'Ms. Quill', role:'Classroom Quartermaster', zone:'Hub', accent:0xe6b84c,
      skin:0xe8b48f, hairColor:0x3a2418, style:'bun', gear:{helm:3,chest:3,gloves:3,legs:3,boots:3}, prop:'book' },
    hub_guide: { name:'Sprout', role:'Heartwood Guide', zone:'Hub', accent:0xe6b84c,
      skin:0xd99a6c, hairColor:0x43c785, style:'afro', gear:{helm:1,chest:1,gloves:1,legs:1,boots:1}, prop:'lantern' }
  };
  var ORDER = ['teacher_classification','teacher_cells','teacher_genetics','teacher_ecology','teacher_evolution',
               'vendor_consumables','vendor_shop','trainer_guardian','trainer_field','trainer_lore','ms_quill','hub_guide'];

  function buildProp(key, accent){
    var THREE = global.THREE;
    var g = new THREE.Group();
    function mat(c){ return new THREE.MeshLambertMaterial({color:c}); }
    function glow(c){ return new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:0.5}); }
    function mesh(geo,m,x,y,z,rx,rz){ var o=new THREE.Mesh(geo,m); o.position.set(x||0,y||0,z||0); if(rx)o.rotation.x=rx; if(rz)o.rotation.z=rz; g.add(o); return o; }
    var C={wood:0x6e4a28,paper:0xefe7d4,steel:0xb7c0cc,leather:0x9a6a3c,glass:0x4cc9f0,gold:0xe6b84c};
    if(key==='scroll'){
      mesh(new THREE.CylinderGeometry(0.05,0.05,0.34,10), mat(C.paper), 0,0,0, 0,Math.PI/2);
      mesh(new THREE.CylinderGeometry(0.06,0.06,0.06,10), mat(C.wood), 0.19,0,0, 0,Math.PI/2);
      mesh(new THREE.CylinderGeometry(0.06,0.06,0.06,10), mat(C.wood), -0.19,0,0, 0,Math.PI/2);
    } else if(key==='net'){
      mesh(new THREE.CylinderGeometry(0.025,0.025,0.9,8), mat(C.wood), 0,0.35,0);
      var ring=new THREE.Mesh(new THREE.TorusGeometry(0.16,0.02,6,16), mat(accent||C.glass)); ring.position.set(0,0.85,0); g.add(ring);
    } else if(key==='flask'){
      mesh(new THREE.SphereGeometry(0.12,12,10), mat(accent||C.glass), 0,0.04,0);
      mesh(new THREE.CylinderGeometry(0.04,0.05,0.12,8), mat(C.steel), 0,0.16,0);
    } else if(key==='satchel'){
      mesh(new THREE.BoxGeometry(0.26,0.22,0.12), mat(C.leather), 0,0,0);
      mesh(new THREE.BoxGeometry(0.27,0.1,0.13), mat(0x6e4a28), 0,0.08,0);
    } else if(key==='staff'){
      mesh(new THREE.CylinderGeometry(0.03,0.035,1.15,8), mat(C.wood), 0,0.3,0);
      mesh(new THREE.OctahedronGeometry(0.08), glow(accent||C.gold), 0,0.92,0);
    } else if(key==='trowel'){
      mesh(new THREE.CylinderGeometry(0.03,0.03,0.18,8), mat(C.wood), 0,0.12,0);
      mesh(new THREE.ConeGeometry(0.08,0.22,4), mat(C.steel), 0,-0.06,0);
    } else if(key==='lantern'){
      mesh(new THREE.CylinderGeometry(0.02,0.02,0.5,8), mat(C.wood), 0,0.22,0);
      var arm=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.02,0.02), mat(C.wood)); arm.position.set(0.07,0.45,0); g.add(arm);
      mesh(new THREE.SphereGeometry(0.07,10,8), glow(C.gold), 0.14,0.4,0);
    } else if(key==='clipboard' || key==='book'){
      mesh(new THREE.BoxGeometry(0.24,0.3,0.04), mat(accent||C.leather), 0,0,0);
      mesh(new THREE.BoxGeometry(0.2,0.26,0.02), mat(C.paper), 0,0,0.03);
    }
    return g;
  }

  function createNpc(key, opts){
    opts = opts || {};
    var THREE = global.THREE;
    var cfg = ROSTER[key] || ROSTER.hub_guide;
    var hero = global.HeroForge.createHero({ skin:cfg.skin, hair:cfg.hairColor, gear:cfg.gear });
    if(global.HairForge && cfg.style){ global.HairForge.applyTo(hero, cfg.style, cfg.hairColor); }
    // held prop in the right hand
    var propGroup = null;
    if(cfg.prop && hero.anchors && hero.anchors.handR){
      propGroup = buildProp(cfg.prop, cfg.accent);
      propGroup.position.set(0,-0.06,0.06);
      hero.anchors.handR.add(propGroup);
      // close the hand a touch around the prop
      hero.anchors.handR.rotation.x = -0.5;
    }
    return {
      root: hero.root, hero: hero, animate: function(dt,o){ hero.animate(dt, o||{}); },
      name: cfg.name, role: cfg.role, zone: cfg.zone, accent: cfg.accent, prop: propGroup, config: cfg, key: key
    };
  }

  global.NpcForge = { createNpc:createNpc, buildProp:buildProp, ROSTER:ROSTER, ORDER:ORDER };
})(typeof window !== 'undefined' ? window : this);
