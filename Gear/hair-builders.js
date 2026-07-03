/* ============================================================================
 * hair-builders.js  —  ENGINE-READY swappable hairstyles for HeroForge (r128)
 * ----------------------------------------------------------------------------
 * Companion to gear-builders.js. Hairstyle meshes mount on the hero's head
 * anchor (hero.anchors.headG; head sphere radius ~0.27, face faces +Z).
 * Same conventions: global `HairForge`, global THREE, MeshLambertMaterial,
 * low-poly, Chromebook-safe, school-appropriate.
 *
 *   const hero = HeroForge.createHero();
 *   scene.add(hero.root);
 *   HairForge.applyTo(hero, 'ponytail', 0x2a1a10);   // mount a style + color
 *   HairForge.setColor(hero, 0x9a6a3c);              // recolor current style
 *
 * Styles (see HairForge.CATALOG):
 *   bald · buzz · short · sideswept · long · ponytail · bun · topknot
 *   braids · afro · curls · locs
 * ========================================================================== */
(function (global) {
  var CATALOG = {
    bald:      'Bald',
    buzz:      'Buzz Cut',
    short:     'Short Crop',
    sideswept: 'Side Swept',
    long:      'Long',
    ponytail:  'Ponytail',
    bun:       'Top Bun',
    topknot:   'Top Knot',
    braids:    'Braids',
    afro:      'Afro',
    curls:     'Curls',
    locs:      'Locs'
  };
  var ORDER = ['bald','buzz','short','sideswept','long','ponytail','bun','topknot','braids','afro','curls','locs'];

  function createStyle(key, color) {
    var THREE = global.THREE;
    if (color == null) color = 0x3a2418;
    var g = new THREE.Group();
    g.userData.hairMats = [];
    function M(){ var m = new THREE.MeshLambertMaterial({ color: color }); g.userData.hairMats.push(m); return m; }
    function SP(r,x,y,z,sx,sy,sz,seg){ var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg||12,Math.max(8,(seg||12)-2)),M()); m.position.set(x||0,y||0,z||0); if(sx!=null)m.scale.set(sx,sy,sz); return m; }
    function CY(rt,rb,h,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||10),M()); m.position.set(x||0,y||0,z||0); return m; }
    function B(w,h,d,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M()); m.position.set(x||0,y||0,z||0); return m; }

    // a "cap" = hair shell hugging the scalp. Centered high and pushed back (clamped)
    // so the front hairline sits on the FOREHEAD, above the eyes (eyes at ~y0, z0.24).
    function cap(scale, back){ back = (back==null? -0.05 : Math.min(back,-0.05)); var c=SP(0.30, 0,0.10,back, 1, (scale||0.78), 1, 16); return c; }

    if (key==='bald'){
      // faint scalp shadow only — essentially nothing
    }
    else if (key==='buzz'){
      var b=cap(0.66,-0.02); b.scale.set(1.02,0.66,1.02); g.add(b);
    }
    else if (key==='short'){
      g.add(cap(0.82,-0.02));
      g.add(SP(0.16, 0.0,0.30,-0.04, 1,0.7,1, 12));   // little top tuft
      // sideburns
      g.add(SP(0.08, 0.23,-0.05,0.06, 1,1.4,1, 10));
      g.add(SP(0.08, -0.23,-0.05,0.06, 1,1.4,1, 10));
    }
    else if (key==='sideswept'){
      var c=cap(0.84,-0.05); g.add(c);
      // swept fringe across the upper forehead (kept above the eyes)
      var fr=SP(0.20, 0.08,0.21,0.16, 1.3,0.45,0.7, 12); fr.rotation.z=0.5; g.add(fr);
      g.add(SP(0.1, 0.26,0.10,0.10, 1,1.2,1,10));
    }
    else if (key==='long'){
      g.add(cap(0.84,-0.04));
      // back sheet + side lengths
      g.add(B(0.42,0.5,0.16, 0,-0.16,-0.22));          // back curtain
      g.add(SP(0.12, 0.27,-0.12,0.04, 1,2.0,1.1, 12)); // left length
      g.add(SP(0.12, -0.27,-0.12,0.04, 1,2.0,1.1, 12));// right length
    }
    else if (key==='ponytail'){
      g.add(cap(0.82,-0.02));
      var band=CY(0.07,0.07,0.06, 0,0.08,-0.30,10); band.rotation.x=0.4; g.add(band);
      // tail down the back
      var t1=SP(0.12, 0,-0.04,-0.34, 1,1.4,1, 12); g.add(t1);
      var t2=SP(0.1, 0,-0.34,-0.34, 1,1.5,1, 12); g.add(t2);
      var t3=CY(0.06,0.02,0.22, 0,-0.6,-0.32,10); g.add(t3);
    }
    else if (key==='bun' || key==='topknot'){
      g.add(cap(0.8,-0.02));
      var top = key==='topknot' ? 0.40 : 0.30;
      var bz = key==='topknot' ? -0.02 : -0.22;
      var by = key==='topknot' ? 0.36 : 0.20;
      g.add(SP(0.15, 0,by,bz, 1,1,1, 12));             // the bun
      var wrap=CY(0.16,0.16,0.05, 0,by,bz,12); wrap.rotation.x=Math.PI/2; g.add(wrap);
    }
    else if (key==='braids'){
      g.add(cap(0.8,-0.02));
      // center part ridge
      g.add(B(0.04,0.16,0.34, 0,0.22,-0.02));
      ['L','R'].forEach(function(s){ var sx=s==='L'?0.26:-0.26;
        for(var i=0;i<4;i++){ g.add(SP(0.08-i*0.01, sx,0.0-i*0.16,0.02, 1,1,1, 10)); } // beaded braid
      });
    }
    else if (key==='afro'){
      var a=SP(0.38, 0,0.13,-0.14, 1,1.0,1, 14); g.add(a);   // pushed back/up so the front halo clears the eyes
      // a couple of clustered lobes for texture
      g.add(SP(0.21, 0.24,0.20,-0.04, 1,1,1, 12));
      g.add(SP(0.21, -0.24,0.20,-0.04, 1,1,1, 12));
      g.add(SP(0.22, 0,0.24,-0.22, 1,1,1, 12));
    }
    else if (key==='curls'){
      g.add(cap(0.74,-0.02));
      var pts=[[0,0.30,0.02],[0.20,0.22,0.10],[-0.20,0.22,0.10],[0.26,0.05,0.02],[-0.26,0.05,0.02],[0.16,0.28,-0.16],[-0.16,0.28,-0.16],[0,0.12,-0.28]];
      pts.forEach(function(p){ g.add(SP(0.11, p[0],p[1],p[2], 1,1,1, 10)); });
    }
    else if (key==='locs'){
      g.add(cap(0.78,-0.02));
      // hanging locs around the back/sides
      var ring=[[0.24,0.18],[-0.24,0.18],[0.28,-0.02],[-0.28,-0.02],[0.18,-0.20],[-0.18,-0.20],[0,-0.30],[0.1,-0.28],[-0.1,-0.28]];
      ring.forEach(function(p,i){ var loc=CY(0.045,0.03,0.5, p[0],-0.18,p[1],7); g.add(loc); var tip=SP(0.05, p[0],-0.44,p[1], 1,1,1,8); g.add(tip); });
    }

    g.userData.styleKey = key;
    return g;
  }

  function applyTo(hero, key, color){
    if(!hero || !hero.anchors || !hero.anchors.headG) return null;
    var headG = hero.anchors.headG;
    // remove any prior HairForge style
    if(hero._hairStyle && hero._hairStyle.parent){ hero._hairStyle.parent.remove(hero._hairStyle); }
    // hide the hero's built-in default hair blob
    if(hero.anchors.hair){ hero.anchors.hair.visible = (key==null); }
    if(key==null || key==='bald'){
      if(hero.anchors.hair) hero.anchors.hair.visible = (key!=='bald' ? true : false);
      hero._hairStyle = null;
      if(key==='bald') return null;
    }
    var style = createStyle(key, color);
    headG.add(style);
    hero._hairStyle = style;
    hero._hairColor = color;
    return style;
  }

  function setColor(hero, color){
    hero._hairColor = color;
    if(hero._hairStyle && hero._hairStyle.userData.hairMats){
      hero._hairStyle.userData.hairMats.forEach(function(m){ m.color.setHex(color); });
    } else if(hero.anchors && hero.anchors.hair){
      hero.anchors.hair.material = new global.THREE.MeshLambertMaterial({ color: color });
    }
  }

  global.HairForge = { createStyle:createStyle, applyTo:applyTo, setColor:setColor, CATALOG:CATALOG, ORDER:ORDER };
})(typeof window !== 'undefined' ? window : this);
