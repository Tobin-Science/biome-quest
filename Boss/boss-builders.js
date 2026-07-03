/* ============================================================================
 * boss-builders.js  —  ENGINE-READY low-poly bosses for Three.js r128
 * ----------------------------------------------------------------------------
 * The six Biome Quest bosses. Each is a FORCE or ORGANISM defeated by KNOWLEDGE
 * — menacing in silhouette but completely school-appropriate (no gore, no
 * weapons, big friendly-ish eyes, abstract forms). Same conventions as the
 * other builders: global `BossForge`, global THREE, Lambert, low-poly.
 *
 *   const b = BossForge.createBoss('chimerus');   // see BossForge.CATALOG
 *   scene.add(b.root);
 *   b.animate(dt);                                 // idle float / pulse
 *
 * Bosses face +Z (front-facing for the turn-based battle portrait).
 * Keys: chimerus · contagion · replicator · blight · everchanging · withering
 * ========================================================================== */
(function (global) {
  var CATALOG = {
    chimerus:    { name:'Chimerus, the Unclassified', zone:'S7L1', accent:0x7c63ff },
    contagion:   { name:'The Contagion',              zone:'S7L2', accent:0x4cc9f0 },
    replicator:  { name:'The Replicator',             zone:'S7L3', accent:0x43c785 },
    blight:      { name:'The Blight',                 zone:'S7L4', accent:0x2fa36b },
    everchanging:{ name:'The Everchanging',           zone:'S7L5', accent:0xb7c0cc },
    withering:   { name:'The Withering',              zone:'Finale', accent:0xe6b84c }
  };

  function createBoss(key, opts){
    opts=opts||{};
    var THREE=global.THREE;
    var cache={};
    function mat(c){ if(!cache['m'+c]) cache['m'+c]=new THREE.MeshLambertMaterial({color:c}); return cache['m'+c]; }
    function glow(c,i){ var k='g'+c+(i||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:(i==null?0.5:i)}); return cache[k]; }
    function trans(c,o,e){ var k='t'+c+o+(e||''); if(!cache[k]) cache[k]=new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:e||0,transparent:true,opacity:o,side:THREE.DoubleSide}); return cache[k]; }
    function B(w,h,d,c,x,y,z){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CY(rt,rb,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||10),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function SP(r,c,x,y,z,seg){ seg=seg||12; var m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(6,seg-4)),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function CO(r,h,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||8),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function TO(r,t,c,x,y,z,seg){ var m=new THREE.Mesh(new THREE.TorusGeometry(r,t,8,seg||20),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function ICO(r,c,x,y,z){ var m=new THREE.Mesh(new THREE.IcosahedronGeometry(r),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function DOD(r,c,x,y,z){ var m=new THREE.Mesh(new THREE.DodecahedronGeometry(r),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    function OCT(r,c,x,y,z){ var m=new THREE.Mesh(new THREE.OctahedronGeometry(r),mat(c)); m.position.set(x||0,y||0,z||0); return m; }
    // friendly-menacing eye: white sphere + dark pupil + glow ring
    function eye(g,x,y,z,r,col){ var w=SP(r,0xf2f1ec,x,y,z,10); g.add(w); var p=SP(r*0.5,0x1a1f26,x,y,z+r*0.7,8); g.add(p); var ring=TO(r*1.1,r*0.16,col||0xe6b84c,x,y,z,12); ring.material=glow(col||0xe6b84c,0.6); g.add(ring); return w; }

    var root=new THREE.Group();
    var info=CATALOG[key]||CATALOG.chimerus;
    var accent=info.accent;
    var pulse=[], bob=[], spin=[], orbit=[], morph=[];

    if(key==='chimerus'){
      // shapeshifter blending all six kingdoms — a central body w/ 6 mismatched features
      var body=SP(2.2,0x6e5a8c,0,0,0,14); body.scale.set(1,1.15,0.9); body.material=glow(0x6e5a8c,0.12); root.add(body);
      // violet aura shell
      var aura=SP(2.7,accent,0,0,0,16); aura.material=trans(accent,0.16,0.3); root.add(aura);
      // face
      eye(root,-0.7,0.6,1.9,0.42,accent); eye(root,0.7,0.6,1.9,0.42,accent);
      root.add(SP(0.18,0x2a2436,0,0.0,2.3,8)); // small nose nub
      // six kingdom "features" sprouting:
      var mush=SP(0.7,0xd8654c,-1.9,1.4,0.2,10); mush.scale.y=0.55; root.add(mush); root.add(CY(0.2,0.24,0.7,0xece3d0,-1.9,0.95,0.2,7));     // fungi cap
      var frond=CO(0.5,1.6,0x43c785,1.7,1.8,0.1,6); frond.rotation.z=-0.4; root.add(frond);                                                    // plant frond
      root.add(TO(0.4,0.13,0xe6b84c,0,2.6,0.2,14));                                                                                            // protist ring crown
      var horn=CO(0.28,1.1,0xe8e0cc,-0.9,2.3,0.3,6); horn.rotation.z=0.3; root.add(horn); var horn2=CO(0.28,1.1,0xe8e0cc,0.9,2.3,0.3,6); horn2.rotation.z=-0.3; root.add(horn2); // animal horns
      var bact=SP(0.5,0x2fa36b,1.9,-0.4,0.4,9); bact.scale.set(1.5,0.7,1); root.add(bact);                                                      // monera blob
      // archaea steam vents (little glow puffs)
      for(var c=0;c<3;c++){ var puff=SP(0.3,0xffd27a,-2.0+c*0.4,-1.6,0.5,8); puff.material=glow(0xffd27a,0.5); root.add(puff); bob.push({obj:puff,baseY:-1.6,amp:0.2,spd:1.5+c,off:c}); }
      // stubby legs
      root.add(SP(0.5,0x4a3f66,-1.0,-2.2,0.3,9)); root.add(SP(0.5,0x4a3f66,1.0,-2.2,0.3,9));
      bob.push({obj:root,baseY:0,amp:0.12,spd:1.2,off:0}); pulse.push({mat:aura.material,base:0.3,amp:0.12,spd:1.0,off:0});
    }
    else if(key==='contagion'){
      // giant invading pathogen — spiky viral capsid w/ protein spikes + tendrils
      var capsid=ICO(2.0,0x9a4acf,0,0.2,0); capsid.material=glow(0x9a4acf,0.25); root.add(capsid); spin.push({obj:capsid,spd:0.4});
      // spike proteins all over
      for(var s=0;s<14;s++){ var sa=s/14*Math.PI*2, sb=(s%4-1.5)*0.7; var sx=Math.cos(sa)*2.0*Math.cos(sb), sy=0.2+Math.sin(sb)*2.0, sz=Math.sin(sa)*2.0*Math.cos(sb);
        var spike=CY(0.05,0.18,0.9,0xc07aef,sx*1.2,sy*1.0,sz*1.2,5); spike.lookAt(new THREE.Vector3(sx*3,sy*2,sz*3)); spike.position.set(sx*1.25,sy*1.05,sz*1.25); root.add(spike);
        var knob=SP(0.22,accent,sx*1.55,sy*1.3,sz*1.55,8); knob.material=glow(accent,0.5); root.add(knob);
      }
      // menacing eyes on the front
      eye(root,-0.7,0.5,1.9,0.36,accent); eye(root,0.7,0.5,1.9,0.36,accent);
      // infection tendrils dangling below
      for(var t=0;t<5;t++){ var ta=(t-2)*0.5; var tend=CY(0.16,0.06,1.8,0x7c4acf,ta,-2.2,0.3,6); tend.rotation.z=ta*0.2; root.add(tend); bob.push({obj:tend,baseY:-2.2,amp:0.15,spd:1.5+t*0.2,off:t}); }
      bob.push({obj:root,baseY:0,amp:0.14,spd:1.0,off:0}); pulse.push({mat:capsid.material,base:0.25,amp:0.12,spd:1.4,off:0});
    }
    else if(key==='replicator'){
      // splits into identical clones — a central body w/ smaller orbiting copies
      function unit(scale,col){ var g=new THREE.Group(); var bd=ICO(1.6*scale,col,0,0,0); bd.material=glow(col,0.2); g.add(bd);
        var w1=SP(0.34*scale,0xf2f1ec,-0.5*scale,0.3*scale,1.3*scale,9); g.add(w1); var w2=SP(0.34*scale,0xf2f1ec,0.5*scale,0.3*scale,1.3*scale,9); g.add(w2);
        g.add(SP(0.17*scale,0x1a1f26,-0.5*scale,0.3*scale,1.55*scale,7)); g.add(SP(0.17*scale,0x1a1f26,0.5*scale,0.3*scale,1.55*scale,7));
        return {g:g, mat:bd.material}; }
      var main=unit(1.3,accent); root.add(main.g); pulse.push({mat:main.mat,base:0.2,amp:0.1,spd:1.2,off:0});
      // orbiting clones (the "duplication" motif)
      for(var c=0;c<4;c++){ var u=unit(0.55,accent); var holder=new THREE.Group(); holder.add(u.g); u.g.position.set(3.2,Math.sin(c)*0.6,0); holder.rotation.y=c/4*Math.PI*2; root.add(holder); orbit.push({obj:holder,spd:0.5+c*0.05}); }
      bob.push({obj:root,baseY:0,amp:0.12,spd:1.0,off:0});
    }
    else if(key==='blight'){
      // ecosystem-collapse titan — hunched mass of greyed withered vines + spores
      var mass=DOD(2.2,0x66704e,0,0.1,0); mass.material=glow(0x66704e,0.22); root.add(mass);
      var aura=SP(2.75,accent,0,0.15,0,16); aura.material=trans(accent,0.16,0.4); root.add(aura);   // emerald aura → clear silhouette against any backdrop
      var hump=SP(1.6,0x51553c,0,1.4,-0.6,12); root.add(hump);
      // withered drooping vine-arms
      for(var a=0;a<5;a++){ var aa=(a-2)*0.6; var arm=CY(0.22,0.08,2.4,0x4a4838,aa*0.9,-0.4,1.2,6); arm.rotation.set(0.6,0,aa*0.2); root.add(arm); var tip=SP(0.4,0x6e6a58,aa*1.3,-1.6,2.1,8); root.add(tip); bob.push({obj:tip,baseY:-1.6,amp:0.12,spd:1+a*0.2,off:a}); }
      // sickly spore puffs rising
      for(var s2=0;s2<6;s2++){ var sa2=s2/6*Math.PI*2; var puff=SP(0.4,0x9fb45f,Math.cos(sa2)*2.2,0.6+Math.sin(s2)*1.2,Math.sin(sa2)*2.2,8); puff.material=glow(0x9fb45f,0.5); root.add(puff); bob.push({obj:puff,baseY:puff.position.y,amp:0.3,spd:0.8+s2*0.1,off:s2}); }
      // dim glowing eyes
      eye(root,-0.7,0.7,1.8,0.4,accent); eye(root,0.7,0.7,1.8,0.4,accent);
      bob.push({obj:root,baseY:0,amp:0.08,spd:0.7,off:0}); pulse.push({mat:mass.material,base:0.22,amp:0.1,spd:0.8,off:0}); pulse.push({mat:aura.material,base:0.4,amp:0.14,spd:0.9,off:0.5});
    }
    else if(key==='everchanging'){
      // shifting/adapting creature — morphing crystalline form, color cycles
      var coreM=glow(0xb7c0cc,0.4); var core=ICO(2.0,0xb7c0cc,0,0.1,0); core.material=coreM; root.add(core); spin.push({obj:core,spd:0.3}); morph.push({mat:coreM,off:0});
      // crystal shards orbiting/jutting — each shifts color
      for(var s3=0;s3<8;s3++){ var sa3=s3/8*Math.PI*2; var shard=OCT(0.6,0xb7c0cc,Math.cos(sa3)*2.3,Math.sin(s3*1.3)*1.2,Math.sin(sa3)*2.3); var sm=glow(0xb7c0cc,0.4); shard.material=sm; root.add(shard); spin.push({obj:shard,spd:0.4+s3*0.05}); morph.push({mat:sm,off:s3*0.5}); }
      eye(root,-0.7,0.6,1.9,0.38,0xe6b84c); eye(root,0.7,0.6,1.9,0.38,0xe6b84c);
      bob.push({obj:root,baseY:0,amp:0.12,spd:1.1,off:0});
    }
    else { // withering (finale) — force unraveling life; dramatic dark core + fraying tendrils + gold heart
      var voidCore=DOD(2.0,0x2a2436,0,0.1,0); root.add(voidCore); spin.push({obj:voidCore,spd:0.2});
      var heart=SP(1.0,0xe6b84c,0,0.1,0,12); heart.material=glow(0xe6b84c,0.7); root.add(heart); pulse.push({mat:heart.material,base:0.7,amp:0.3,spd:1.3,off:0});
      // fraying tendrils radiating in all 5 strand colors (it unravels every branch)
      var strandCols=[0x7c63ff,0x4cc9f0,0x43c785,0x2fa36b,0xb7c0cc];
      for(var t2=0;t2<10;t2++){ var ta2=t2/10*Math.PI*2; var col=strandCols[t2%5];
        var tend=CY(0.12,0.02,2.6,col,Math.cos(ta2)*1.6,Math.sin(t2*0.7)*1.0,Math.sin(ta2)*1.6,5); tend.lookAt(new THREE.Vector3(Math.cos(ta2)*5,Math.sin(t2*0.7)*2,Math.sin(ta2)*5)); tend.material=glow(col,0.5); root.add(tend);
        var spark=SP(0.16,col,Math.cos(ta2)*3.2,Math.sin(t2*0.7)*1.8,Math.sin(ta2)*3.2,7); spark.material=glow(col,0.7); root.add(spark); bob.push({obj:spark,baseY:spark.position.y,amp:0.3,spd:1+t2*0.1,off:t2}); }
      eye(root,-0.7,0.5,1.7,0.34,0xe6b84c); eye(root,0.7,0.5,1.7,0.34,0xe6b84c);
      bob.push({obj:root,baseY:0,amp:0.1,spd:0.9,off:0});
    }

    // ---- animation --------------------------------------------------------
    var clock=0;
    var palette=[0x7c63ff,0x4cc9f0,0x43c785,0x2fa36b,0xb7c0cc], ca=new THREE.Color(), cb=new THREE.Color(), tc=new THREE.Color();
    function animate(dt){ dt=dt||0.016; clock+=dt;
      for(var i=0;i<pulse.length;i++){ var p=pulse[i]; p.mat.emissiveIntensity=p.base+Math.sin(clock*p.spd+p.off)*p.amp; }
      for(var j=0;j<bob.length;j++){ var b=bob[j]; b.obj.position.y=b.baseY+Math.sin(clock*b.spd+b.off)*b.amp; }
      for(var k=0;k<spin.length;k++){ spin[k].obj.rotation.y+=dt*spin[k].spd; }
      for(var o=0;o<orbit.length;o++){ orbit[o].obj.rotation.y+=dt*orbit[o].spd; }
      for(var m=0;m<morph.length;m++){ var mo=morph[m]; var ph=(clock*0.4+mo.off)%palette.length, i0=Math.floor(ph), f=ph-i0; ca.setHex(palette[i0%palette.length]); cb.setHex(palette[(i0+1)%palette.length]); tc.copy(ca).lerp(cb,f); mo.mat.color.copy(tc); mo.mat.emissive.copy(tc); }
    }

    return { root:root, animate:animate, name:info.name, zone:info.zone, accent:accent, key:key };
  }

  global.BossForge={ createBoss:createBoss, CATALOG:CATALOG };
})(typeof window!=='undefined'?window:this);
