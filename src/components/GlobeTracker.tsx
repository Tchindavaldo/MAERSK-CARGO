import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import { getCountry } from '../lib/countries';

interface GlobeTrackerProps {
  originCountry: string;
  destinationCountry: string;
  transportMode: string;
  progress: number;
}

type PathPoint = [number, number, number]; // lat, lng, altitude

// ---------------------------------------------------------------------------
// Géométrie sphérique
// ---------------------------------------------------------------------------

function greatCircle(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  t: number
): [number, number] {
  const lat1 = (from.lat * Math.PI) / 180;
  const lng1 = (from.lng * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const lng2 = (to.lng * Math.PI) / 180;
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lng2 - lng1) / 2) ** 2
      )
    );
  if (d === 0) return [from.lat, from.lng];
  const A = Math.sin((1 - t) * d) / Math.sin(d);
  const B = Math.sin(t * d) / Math.sin(d);
  const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
  const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
  const z = A * Math.sin(lat1) + B * Math.sin(lat2);
  return [
    (Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI,
    (Math.atan2(y, x) * 180) / Math.PI,
  ];
}

// Couloir maritime Asie -> Afrique de l'Ouest (Malacca, océan Indien, cap de
// Bonne-Espérance, golfe de Guinée) pour éviter qu'un bateau traverse les terres
const SEA_CORRIDOR_ASIA_WAFRICA: [number, number][] = [
  [22.0, 114.0],
  [10.0, 108.0],
  [3.5, 104.5],
  [1.2, 103.6],
  [4.0, 97.0],
  [2.0, 88.0],
  [-2.0, 75.0],
  [-8.0, 60.0],
  [-14.0, 48.0],
  [-27.0, 37.0],
  [-35.5, 22.0],
  [-33.0, 12.0],
  [-22.0, 6.0],
  [-8.0, 3.0],
  [1.0, 4.0],
];

// Interpole chaque segment par grand cercle => polyligne parfaitement lisse
function smoothRoute(points: [number, number][], perSegment = 14): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = { lat: points[i][0], lng: points[i][1] };
    const b = { lat: points[i + 1][0], lng: points[i + 1][1] };
    for (let j = 0; j < perSegment; j++) out.push(greatCircle(a, b, j / perSegment));
  }
  out.push(points[points.length - 1]);
  return out;
}

const SEA_ALT = 0.006;
const AIR_ALT_BASE = 0.015;
const AIR_ALT_CRUISE = 0.16;

function buildRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  isAir: boolean
): PathPoint[] {
  if (isAir) {
    // Arc de grand cercle avec profil de vol : décollage, croisière, descente
    const n = 110;
    const pts: PathPoint[] = [];
    for (let i = 0; i <= n; i++) {
      const s = i / n;
      const [lat, lng] = greatCircle(from, to, s);
      const alt = AIR_ALT_BASE + AIR_ALT_CRUISE * Math.sin(Math.PI * s) ** 0.8;
      pts.push([lat, lng, alt]);
    }
    return pts;
  }
  const isAsia = from.lng > 60;
  const isWestAfrica = to.lng < 25 && to.lat > -35 && to.lat < 30;
  const base =
    isAsia && isWestAfrica
      ? smoothRoute([[from.lat, from.lng], ...SEA_CORRIDOR_ASIA_WAFRICA, [to.lat, to.lng]])
      : smoothRoute([[from.lat, from.lng], [to.lat, to.lng]], 80);
  return base.map(([lat, lng]) => [lat, lng, SEA_ALT]);
}

function positionAlong(path: PathPoint[], t: number): PathPoint {
  if (path.length < 2) return path[0] ?? [0, 0, 0];
  const idx = Math.max(0, Math.min(1, t)) * (path.length - 1);
  const i = Math.min(path.length - 2, Math.floor(idx));
  const f = idx - i;
  const a = path[i];
  const b = path[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

// ---------------------------------------------------------------------------
// Modèles 3D — construits à la main, nez/proue orientés vers +Z
// ---------------------------------------------------------------------------

const MAT = {
  white: () => new THREE.MeshPhongMaterial({ color: 0xf4f7fa, shininess: 60 }),
  navy: () => new THREE.MeshPhongMaterial({ color: 0x0b132b, shininess: 30 }),
  steel: () => new THREE.MeshPhongMaterial({ color: 0x3a506b, shininess: 30 }),
  accent: () =>
    new THREE.MeshPhongMaterial({ color: 0x42b0d5, emissive: 0x0e3c4e, shininess: 80 }),
  red: () => new THREE.MeshPhongMaterial({ color: 0xd64545, shininess: 40 }),
};

function buildPlane(): THREE.Group {
  const g = new THREE.Group();

  // Fuselage
  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 3.4, 6, 14), MAT.white());
  fuselage.rotation.x = Math.PI / 2;
  g.add(fuselage);

  // Nez vitré
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), MAT.navy());
  nose.position.z = 2.05;
  nose.scale.set(1, 1, 1.4);
  g.add(nose);

  // Ailes en flèche : trapèzes extrudés, blanches comme le fuselage
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0.55); // bord d'attaque à l'emplanture
  wingShape.lineTo(2.3, -0.75); // bord d'attaque au saumon (flèche arrière)
  wingShape.lineTo(2.3, -1.05);
  wingShape.lineTo(0, -0.55); // bord de fuite à l'emplanture
  wingShape.closePath();
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.08, bevelEnabled: false });
  wingGeo.rotateX(Math.PI / 2); // à plat, envergure sur X, corde sur Z
  const wingL = new THREE.Mesh(wingGeo, MAT.white());
  wingL.scale.x = -1; // aile gauche
  wingL.position.set(-0.3, -0.1, 0.2);
  g.add(wingL);
  const wingR = new THREE.Mesh(wingGeo, MAT.white());
  wingR.position.set(0.3, -0.1, 0.2);
  g.add(wingR);

  // Réacteurs sous les ailes, accolés à l'intrados
  const engGeo = new THREE.CylinderGeometry(0.17, 0.2, 0.75, 10);
  engGeo.rotateX(Math.PI / 2);
  const engL = new THREE.Mesh(engGeo, MAT.steel());
  engL.position.set(-1.05, -0.32, 0.35);
  g.add(engL);
  const engR = engL.clone();
  engR.position.x = 1.05;
  g.add(engR);

  // Empennage horizontal (mêmes trapèzes, réduits)
  const tailL = new THREE.Mesh(wingGeo, MAT.white());
  tailL.scale.set(-0.42, 1, 0.42);
  tailL.position.set(-0.1, 0.12, -1.75);
  g.add(tailL);
  const tailR = new THREE.Mesh(wingGeo, MAT.white());
  tailR.scale.set(0.42, 1, 0.42);
  tailR.position.set(0.1, 0.12, -1.75);
  g.add(tailR);

  // Dérive verticale (couleur accent = signature compagnie)
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(-0.9, 0);
  finShape.lineTo(-1.25, 1.05);
  finShape.lineTo(-0.85, 1.05);
  finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.08, bevelEnabled: false });
  const fin = new THREE.Mesh(finGeo, MAT.accent());
  fin.rotation.y = -Math.PI / 2;
  fin.position.set(0.04, 0.25, -1.15);
  g.add(fin);

  g.scale.setScalar(2.6);
  return g;
}

function buildShip(): THREE.Group {
  const g = new THREE.Group();

  // Coque : boîte effilée vers la proue via une géométrie extrudée
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-2.6, -0.75); // arrière bâbord
  hullShape.lineTo(1.8, -0.75);
  hullShape.lineTo(3.1, 0); // proue en pointe
  hullShape.lineTo(1.8, 0.75);
  hullShape.lineTo(-2.6, 0.75);
  hullShape.closePath();
  const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 0.75, bevelEnabled: false });
  hullGeo.rotateX(Math.PI / 2); // extrusion verticale
  hullGeo.rotateY(Math.PI / 2); // proue vers +Z
  const hull = new THREE.Mesh(hullGeo, MAT.navy());
  hull.position.y = 0.75;
  g.add(hull);

  // Ligne de flottaison rouge
  const keel = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.16, 5.1), MAT.red());
  keel.position.set(0, 0.02, -0.3);
  g.add(keel);

  // Piles de conteneurs multicolores
  const colors = [MAT.accent(), MAT.steel(), MAT.red(), MAT.white()];
  let ci = 0;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 2; col++) {
      const stack = 1 + ((row + col) % 2);
      for (let lvl = 0; lvl < stack; lvl++) {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(0.62, 0.34, 0.95),
          colors[ci++ % colors.length]
        );
        box.position.set(-0.36 + col * 0.72, 0.95 + lvl * 0.36, 1.15 - row * 1.05);
        g.add(box);
      }
    }
  }

  // Château (passerelle) à l'arrière
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.15, 0.8), MAT.white());
  bridge.position.set(0, 1.35, -2.05);
  g.add(bridge);
  const windows = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.18, 0.7), MAT.navy());
  windows.position.set(0, 1.75, -2.05);
  g.add(windows);
  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.5, 8), MAT.accent());
  funnel.position.set(0, 2.1, -2.3);
  g.add(funnel);

  g.scale.setScalar(2.1);
  return g;
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

const EASE_MS = 3200; // durée de l'animation d'entrée du véhicule

export default function GlobeTracker({
  originCountry,
  destinationCountry,
  transportMode,
  progress,
}: GlobeTrackerProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const vehicleRef = useRef<THREE.Group | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [countries, setCountries] = useState<any>({ features: [] });
  const [size, setSize] = useState({ width: 1050, height: 720 });
  const [globeReady, setGlobeReady] = useState(false);
  // Découpe parcouru/restant, mise à jour à ~8 Hz pour ne pas reconstruire
  // les tubes de trajectoire à 60 fps
  const [displayT, setDisplayT] = useState(0);

  const isAir = transportMode === 'air';
  const from = useMemo(() => getCountry(originCountry), [originCountry]);
  const to = useMemo(() => getCountry(destinationCountry), [destinationCountry]);
  const targetT = Math.max(0, Math.min(1, progress / 100));

  // --- Responsive ---
  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.clientWidth || window.innerWidth;
      const width = Math.min(1050, w);
      setSize({ width, height: Math.round(width * 0.7) });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // --- Frontières des pays (topojson -> geojson) ---
  useEffect(() => {
    const fallback = () =>
      fetch('//raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then((r) => r.json())
        .then(setCountries)
        .catch(() => undefined);
    fetch('//unpkg.com/world-atlas/countries-110m.json')
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((topology: any) =>
        // @ts-expect-error - pas de types pour topojson-client
        import('topojson-client')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((topo: any) => setCountries(topo.feature(topology, topology.objects.countries)))
          .catch(fallback)
      )
      .catch(fallback);
  }, []);

  const path = useMemo(
    () => (from && to ? buildRoute(from, to, isAir) : []),
    [from, to, isAir]
  );

  // --- Véhicule 3D : ajout à la scène + boucle d'animation ---
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !globeReady || !path.length) return;

    const vehicle = isAir ? buildPlane() : buildShip();
    vehicleRef.current = vehicle;
    globe.scene().add(vehicle);

    const start = performance.now();
    let raf = 0;
    let lastSplit = 0;
    const curV = new THREE.Vector3();
    const nextV = new THREE.Vector3();

    const frame = (now: number) => {
      const p = Math.min(1, (now - start) / EASE_MS);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const t = eased * targetT;

      const [lat, lng, alt0] = positionAlong(path, t);
      // Tangage léger du navire sur l'eau ; l'avion reste stable
      const bob = isAir ? 0 : Math.sin(now / 650) * 0.0012;
      const alt = alt0 + bob;

      const cur = globe.getCoords(lat, lng, alt);
      curV.set(cur.x, cur.y, cur.z);
      const [nlat, nlng, nalt] = positionAlong(path, Math.min(1, t + 0.008));
      const next = globe.getCoords(nlat, nlng, nalt);
      nextV.set(next.x, next.y, next.z);

      vehicle.position.copy(curV);
      if (curV.distanceToSquared(nextV) > 1e-6) {
        // "haut" = normale à la sphère, +Z du modèle pointe vers la direction du trajet
        vehicle.up.copy(curV).normalize();
        vehicle.lookAt(nextV);
      }
      if (!isAir) vehicle.rotation.z += Math.sin(now / 900) * 0.04; // roulis du navire

      // Découpe de trajectoire à basse fréquence
      if (now - lastSplit > 125) {
        lastSplit = now;
        setDisplayT(t);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      globe.scene().remove(vehicle);
      vehicle.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
    };
  }, [globeReady, path, targetT, isAir]);

  // --- Caméra : cadrage initial sur le milieu du trajet ---
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !globeReady || !from || !to) return;
    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.25;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 140;
    }
    const [midLat, midLng] = greatCircle(from, to, 0.5);
    globe.pointOfView({ lat: midLat, lng: midLng, altitude: 2.1 }, 1800);
  }, [globeReady, from, to]);

  // --- Trajectoires parcourue / restante ---
  const { traveled, remaining } = useMemo(() => {
    if (!path.length) return { traveled: [] as PathPoint[], remaining: [] as PathPoint[] };
    const head = positionAlong(path, displayT);
    const cut = Math.min(path.length - 2, Math.floor(displayT * (path.length - 1)));
    return {
      traveled: [...path.slice(0, cut + 1), head],
      remaining: [head, ...path.slice(cut + 1)],
    };
  }, [path, displayT]);

  // --- Couleurs pays origine/destination ---
  const ISO2_TO_NAME: Record<string, string[]> = useMemo(
    () => ({
      CN: ['China', 'Chine'], HK: ['Hong Kong'], JP: ['Japan'],
      KR: ['South Korea', 'Korea, Republic of'], IN: ['India'],
      AE: ['United Arab Emirates'], TR: ['Turkey'], TH: ['Thailand'], VN: ['Vietnam'],
      CM: ['Cameroon'], NG: ['Nigeria'], CI: ["Côte d'Ivoire", 'Ivory Coast'],
      SN: ['Senegal'], GA: ['Gabon'], CG: ['Republic of the Congo', 'Congo'],
      CD: ['Democratic Republic of the Congo', 'Dem. Rep. Congo'], BJ: ['Benin'],
      TG: ['Togo'], BF: ['Burkina Faso'], ML: ['Mali'], MA: ['Morocco'],
      DZ: ['Algeria'], TN: ['Tunisia'], EG: ['Egypt'], KE: ['Kenya'],
      ZA: ['South Africa'], GH: ['Ghana'], GN: ['Guinea'], MR: ['Mauritania'],
      TD: ['Chad'], CF: ['Central African Republic', 'Central African Rep.'],
      FR: ['France'], BE: ['Belgium'], NL: ['Netherlands'], DE: ['Germany'],
      IT: ['Italy'], ES: ['Spain'], GB: ['United Kingdom'],
      US: ['United States of America', 'United States'], CA: ['Canada'], BR: ['Brazil'],
    }),
    []
  );

  const matchCountry = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feat: any, iso2: string) => {
      const names = ISO2_TO_NAME[iso2] || [];
      const featName =
        feat.properties?.name || feat.properties?.NAME || feat.properties?.ADMIN || '';
      return names.includes(featName);
    },
    [ISO2_TO_NAME]
  );

  if (!from || !to) {
    return (
      <div className="bg-amber-50 border border-amber-300 p-6 rounded-xl mt-6 text-amber-800">
        ⚠️ Pays d'origine ou de destination non défini pour ce colis. Veuillez les renseigner
        dans l'admin.
      </div>
    );
  }

  const isLoading = !countries.features || countries.features.length === 0;
  const pct = Math.round(displayT * 100);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center rounded-2xl overflow-hidden w-full mt-6 border border-brand-secondary/40 shadow-2xl"
      style={{
        background:
          'radial-gradient(ellipse at 50% 35%, #16234a 0%, #0B132B 62%, #060b1c 100%)',
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-brand-dark/95 backdrop-blur-sm">
          <svg className="animate-spin h-12 w-12 text-brand-accent mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm font-medium text-gray-200">Chargement du suivi…</p>
          <p className="text-xs text-gray-400 mt-1">Initialisation de la vue satellite</p>
        </div>
      )}

      {/* HUD : itinéraire + progression */}
      <div className="absolute top-4 left-4 z-10 bg-brand-dark/70 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-200 pointer-events-none select-none">
        <div className="flex items-center gap-2 font-semibold text-sm text-white">
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]"></span>
          {from.name}
          <span className="text-brand-accent mx-1">{isAir ? '✈' : '⚓'}</span>
          <span className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_6px_#42B0D5]"></span>
          {to.name}
        </div>
        <div className="mt-2 flex items-center gap-2 text-gray-300">
          <span className="uppercase tracking-wider text-[10px]">
            {isAir ? 'Fret aérien' : 'Fret maritime'}
          </span>
          <span className="text-brand-accent font-bold text-sm">{pct}%</span>
        </div>
      </div>

      {/* Barre de progression intégrée en bas du cadre */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-1.5 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-green-400 via-brand-accent to-white rounded-r-full transition-[width] duration-200 shadow-[0_0_10px_rgba(66,176,213,0.9)]"
          style={{ width: `${pct}%` }}
        ></div>
      </div>

      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#42B0D5"
        atmosphereAltitude={0.16}
        onGlobeReady={() => setGlobeReady(true)}
        /* Pays */
        polygonsData={countries.features || []}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        polygonAltitude={(d: any) =>
          matchCountry(d, from.code) || matchCountry(d, to.code) ? 0.016 : 0.003
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        polygonCapColor={(d: any) => {
          if (matchCountry(d, from.code)) return 'rgba(74,222,128,0.85)';
          if (matchCountry(d, to.code)) return 'rgba(66,176,213,0.85)';
          return 'rgba(255,255,255,0.05)';
        }}
        polygonSideColor={() => 'rgba(255,255,255,0.06)'}
        polygonStrokeColor={() => 'rgba(6,11,28,0.85)'}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        polygonLabel={(d: any) =>
          `<div style="background:rgba(11,19,43,0.92);color:#fff;padding:4px 10px;border-radius:6px;font-size:12px;border:1px solid rgba(66,176,213,0.45)">
            ${d.properties?.name || d.properties?.ADMIN || ''}
          </div>`
        }
        /* Trajectoire : parcourue (pleine, lumineuse) / restante (pointillés animés) */
        pathsData={[
          { pts: traveled, kind: 'traveled' },
          { pts: remaining, kind: 'remaining' },
        ]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathPoints={(d: any) => d.pts}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathPointLat={(p: any) => p[0]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathPointLng={(p: any) => p[1]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathPointAlt={(p: any) => p[2]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathColor={(d: any) =>
          d.kind === 'traveled'
            ? ['rgba(74,222,128,0.95)', 'rgba(66,176,213,1)']
            : ['rgba(180,200,220,0.5)', 'rgba(180,200,220,0.18)']
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathStroke={(d: any) => (d.kind === 'traveled' ? 3.2 : 1.6)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathDashLength={(d: any) => (d.kind === 'traveled' ? 1 : 0.018)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathDashGap={(d: any) => (d.kind === 'traveled' ? 0 : 0.01)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathDashAnimateTime={(d: any) => (d.kind === 'remaining' ? 14000 : 0)}
        pathTransitionDuration={0}
        /* Anneaux radar pulsants au départ et à l'arrivée */
        ringsData={[
          { lat: from.lat, lng: from.lng, color: '74,222,128' },
          { lat: to.lat, lng: to.lng, color: '66,176,213' },
        ]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ringColor={(d: any) => (rt: number) => `rgba(${d.color},${Math.max(0, 1 - rt)})`}
        ringMaxRadius={4.5}
        ringPropagationSpeed={2.2}
        ringRepeatPeriod={900}
        ringAltitude={0.012}
        /* Étiquettes des villes/pays */
        labelsData={[
          { lat: from.lat, lng: from.lng, text: from.name, color: 'rgba(74,222,128,0.95)' },
          { lat: to.lat, lng: to.lng, text: to.name, color: 'rgba(120,205,235,0.95)' },
        ]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        labelText={(d: any) => d.text}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        labelColor={(d: any) => d.color}
        labelSize={1.3}
        labelDotRadius={0.45}
        labelAltitude={0.015}
        labelResolution={2}
      />
    </div>
  );
}
