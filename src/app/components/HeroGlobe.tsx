import { useEffect, useRef } from "react";
import { LAND_DOTS } from "./globe-dots";

/**
 * 첫 화면 배경: 천천히 도는 점 지구본.
 * 서울에서 레이더 고리가 퍼지고, 앞면에 보이는 도시마다 서울에서 파란 항로가 뻗어 간다.
 * 도착하면 도시에서 흰 신호가 퍼진다. 색은 회사 파랑 하나만 쓴다.
 * 움직임 줄이기 설정이면 정지 화면 한 장만 그린다.
 */
type City = { name: string; lat: number; lon: number };
// 항로 끝점. 지구본이 어느 쪽을 보여 주든 앞면에 있는 도시로 서울에서 항로가 뻗어 간다.
// 이름은 도시가 아니라 나라 이름(COUNTRIES)으로 보여 준다.

const SEOUL = { lat: 37.57, lon: 126.98 };
const CITIES: City[] = [
  { name: "New York", lat: 40.71, lon: -74.0 },
  { name: "Los Angeles", lat: 34.05, lon: -118.24 },
  { name: "San Francisco", lat: 37.77, lon: -122.42 },
  { name: "Chicago", lat: 41.88, lon: -87.63 },
  { name: "Toronto", lat: 43.65, lon: -79.38 },
  { name: "Vancouver", lat: 49.28, lon: -123.12 },
  { name: "Mexico City", lat: 19.43, lon: -99.13 },
  { name: "Sao Paulo", lat: -23.55, lon: -46.63 },
  { name: "Bogota", lat: 4.71, lon: -74.07 },
  { name: "London", lat: 51.5, lon: -0.12 },
  { name: "Paris", lat: 48.86, lon: 2.35 },
  { name: "Berlin", lat: 52.52, lon: 13.4 },
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "Mumbai", lat: 19.08, lon: 72.88 },
  { name: "Sydney", lat: -33.87, lon: 151.21 },
  { name: "Shanghai", lat: 31.23, lon: 121.47 },
  { name: "Hong Kong", lat: 22.3, lon: 114.17 },
  { name: "Taipei", lat: 25.03, lon: 121.56 },
  { name: "Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Osaka", lat: 34.69, lon: 135.5 },
  { name: "Singapore", lat: 1.35, lon: 103.82 },
  { name: "Bangkok", lat: 13.75, lon: 100.5 },
  { name: "Ho Chi Minh", lat: 10.82, lon: 106.63 },
  { name: "Jakarta", lat: -6.2, lon: 106.85 },
  { name: "Manila", lat: 14.6, lon: 120.98 },
];

const DOT = "196,206,232";
const GOLD = "235,240,255"; // 신호
const ORANGE = "92,124,255"; // 항로와 서울 (회사 파랑을 어두운 바탕용으로 밝힘)
const TEXT = "240,243,250";
const SUB = "150,162,196";
const DEG = Math.PI / 180;
const SPIN = 6; // 땅 위에서 초당 회전 각도
const SPIN_OCEAN = 30; // 태평양은 빨리 지나간다
const SPIN_ATLANTIC = 16;

/** 화면 가운데 경도에 따라 회전 속도를 바꾼다. 빈 바다(태평양, 대서양)는 빨리, 땅은 천천히. */
function spinAt(lonDeg: number) {
  const L = ((lonDeg % 360) + 360) % 360;
  const bump = (a: number, b: number, edge: number) => {
    if (L <= a - edge || L >= b + edge) return 0;
    if (L >= a && L <= b) return 1;
    const d = L < a ? (L - (a - edge)) / edge : ((b + edge) - L) / edge;
    return d * d * (3 - 2 * d);
  };
  return SPIN + (SPIN_OCEAN - SPIN) * bump(165, 238, 14) + (SPIN_ATLANTIC - SPIN) * bump(305, 345, 10);
}
const LAUNCH = 340; // 새 항로를 쏘는 간격(ms)
const GROW = 1000; // 서울에서 도시까지 뻗는 시간
const ARC_LIFE = 2800;
const MAX_ARCS = 9;

/** 지구본 위 나라 이름. 처음부터 보인다. 주요 시장은 밝게, 채널을 한 줄 더 쓴다. */
type Country = { name: string; lat: number; lon: number; key?: boolean; channel?: string; align?: "left" | "right" | "center" };
const COUNTRIES: Country[] = [
  { name: "Korea", lat: 37.2, lon: 127.2, key: true, align: "left" },
  { name: "Japan", lat: 36.5, lon: 139.0, key: true, channel: "X, Instagram" },
  { name: "China", lat: 33.5, lon: 106.0, key: true, channel: "Xiaohongshu", align: "center" },
  { name: "United States", lat: 39.5, lon: -99.0, key: true, channel: "Reddit", align: "center" },
  { name: "Canada", lat: 57, lon: -105, align: "center" },
  { name: "Mexico", lat: 23.5, lon: -102.5, align: "center" },
  { name: "Brazil", lat: -10, lon: -52, align: "center" },
  { name: "Colombia", lat: 4.5, lon: -74, align: "center" },
  { name: "Argentina", lat: -34, lon: -64, align: "center" },
  { name: "New Zealand", lat: -41, lon: 174, align: "center" },
  { name: "United Kingdom", lat: 54, lon: -2.5 },
  { name: "France", lat: 46.5, lon: 2.5, align: "left" },
  { name: "Germany", lat: 51.2, lon: 10.4 },
  { name: "UAE", lat: 24, lon: 54 },
  { name: "India", lat: 22, lon: 79, align: "center" },
  { name: "Thailand", lat: 15.5, lon: 101, align: "left" },
  { name: "Vietnam", lat: 14.5, lon: 108.3 },
  { name: "Taiwan", lat: 23.7, lon: 121 },
  { name: "Philippines", lat: 12.5, lon: 122.5 },
  { name: "Singapore", lat: 1.35, lon: 103.8, align: "left" },
  { name: "Indonesia", lat: -2.5, lon: 118, align: "center" },
  { name: "Australia", lat: -25, lon: 134, align: "center" },
];

type V3 = [number, number, number];

function toVec(lat: number, lon: number): V3 {
  const p = lat * DEG;
  const l = lon * DEG;
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
}

function slerp(a: V3, b: V3, t: number): V3 {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-6) return a;
  const s = Math.sin(om);
  const k0 = Math.sin((1 - t) * om) / s;
  const k1 = Math.sin(t * om) / s;
  return [a[0] * k0 + b[0] * k1, a[1] * k0 + b[1] * k1, a[2] * k0 + b[2] * k1];
}

function layout(w: number, h: number) {
  const mobile = w < 760;
  // 모바일은 지구본이 첫 화면 전체(버튼 뒤까지)에 깔리게 크게, 아래로
  if (mobile) return { cx: w * 0.5, cy: h * 0.47, R: Math.min(w * 1.0, h * 0.5), mobile, tilt: 6 };
  return { cx: w * 0.72, cy: h * 0.47, R: Math.min(w * 0.32, h * 0.5), mobile, tilt: 22 };
}

export function HeroGlobe() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const land: V3[] = [];
    for (let i = 0; i < LAND_DOTS.length; i += 2) land.push(toVec(LAND_DOTS[i] / 10, LAND_DOTS[i + 1] / 10));
    const seoul = toVec(SEOUL.lat, SEOUL.lon);
    const cities = CITIES.map((c) => ({ ...c, v: toVec(c.lat, c.lon) }));
    const countries = COUNTRIES.map((c) => ({ ...c, v: toVec(c.lat, c.lon) }));

    let w = 0;
    let h = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    const start = performance.now();
    let lonDeg = 104;
    let last = start;
    let lastLaunch = -1e9;
    const arcs: { i: number; born: number }[] = [];
    const launchedAt: number[] = CITIES.map(() => -1e9);

    const resize = () => {
      const rect = box.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still || !running) draw(still ? 0 : performance.now() - start);
    };

    function draw(t: number) {
      const { cx, cy, R, mobile, tilt } = layout(w, h);
      const lon0 = (still ? 112 : lonDeg) * DEG;
      const lat0 = tilt * DEG;
      const cl = Math.cos(lon0);
      const sl = Math.sin(lon0);
      const cp = Math.cos(lat0);
      const sp = Math.sin(lat0);
      // 세계 좌표를 화면 좌표로: x 오른쪽, y 아래, z 보는 쪽
      const rot = (v: V3): V3 => {
        const x1 = v[0] * cl + v[1] * sl;
        const y1 = -v[0] * sl + v[1] * cl;
        const z1 = v[2];
        return [y1, -(z1 * cp - x1 * sp), x1 * cp + z1 * sp];
      };
      const sx = (p: V3, lift = 1) => cx + p[0] * R * lift;
      const sy = (p: V3, lift = 1) => cy + p[1] * R * lift;

      ctx.clearRect(0, 0, w, h);

      // 대기와 구
      const glow = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.28);
      glow.addColorStop(0, "rgba(70,100,255,0.16)");
      glow.addColorStop(1, "rgba(70,100,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.28, 0, Math.PI * 2);
      ctx.fill();
      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      body.addColorStop(0, "#121a36");
      body.addColorStop(1, "#070a16");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(196,206,232,0.22)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 위도선
      ctx.strokeStyle = "rgba(196,206,232,0.06)";
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let pen = false;
        for (let lon = -180; lon <= 180; lon += 4) {
          const p = rot(toVec(lat, lon));
          if (p[2] > 0) {
            if (pen) ctx.lineTo(sx(p), sy(p));
            else ctx.moveTo(sx(p), sy(p));
            pen = true;
          } else pen = false;
        }
        ctx.stroke();
      }

      // 육지 점
      const size = mobile ? 1.6 : 2;
      for (const v of land) {
        const p = rot(v);
        if (p[2] <= 0.02) continue;
        ctx.fillStyle = `rgba(${DOT},${mobile ? 0.16 + p[2] * 0.5 : 0.22 + p[2] * 0.7})`;
        ctx.fillRect(sx(p) - size / 2, sy(p) - size / 2, size, size);
      }

      // 서울 레이더 고리: 구 위에서 퍼지는 원
      const s = rot(seoul);
      const axis = seoul;
      const ref: V3 = Math.abs(axis[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
      const u: V3 = [
        axis[1] * ref[2] - axis[2] * ref[1],
        axis[2] * ref[0] - axis[0] * ref[2],
        axis[0] * ref[1] - axis[1] * ref[0],
      ];
      const ul = Math.hypot(...u);
      u[0] /= ul; u[1] /= ul; u[2] /= ul;
      const vv: V3 = [
        axis[1] * u[2] - axis[2] * u[1],
        axis[2] * u[0] - axis[0] * u[2],
        axis[0] * u[1] - axis[1] * u[0],
      ];
      const rings = still ? [0.5] : [0, 1 / 3, 2 / 3].map((o) => ((t / 2600 + o) % 1));
      for (const k of rings) {
        const ang = (3 + k * 15) * DEG;
        const alpha = still ? 0.35 : (1 - k) * 0.6;
        ctx.strokeStyle = `rgba(${ORANGE},${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        let pen = false;
        for (let a = 0; a <= 360; a += 6) {
          const ca = Math.cos(ang);
          const sa = Math.sin(ang);
          const ct = Math.cos(a * DEG);
          const st = Math.sin(a * DEG);
          const q: V3 = [
            axis[0] * ca + (u[0] * ct + vv[0] * st) * sa,
            axis[1] * ca + (u[1] * ct + vv[1] * st) * sa,
            axis[2] * ca + (u[2] * ct + vv[2] * st) * sa,
          ];
          const p = rot(q);
          if (p[2] > 0) {
            if (pen) ctx.lineTo(sx(p), sy(p));
            else ctx.moveTo(sx(p), sy(p));
            pen = true;
          } else pen = false;
        }
        ctx.stroke();
      }

      // 항로: 앞면에 보이는 도시를 골라 서울에서 계속 쏜다. 서울이 뒤편이면 지평선 너머에서 솟아 내려온다.
      const front = cities.map((c) => rot(c.v));
      if (!still && t - lastLaunch > LAUNCH && arcs.length < MAX_ARCS) {
        const pool = cities
          .map((c, i) => i)
          .filter((i) => front[i][2] > 0.12 && t - launchedAt[i] > 3200);
        if (pool.length) {
          const far = pool.filter((i) => Math.acos(Math.min(1, seoul[0] * cities[i].v[0] + seoul[1] * cities[i].v[1] + seoul[2] * cities[i].v[2])) > 0.7);
          const src = far.length && Math.random() < 0.7 ? far : pool;
          const i = src[Math.floor(Math.random() * src.length)];
          arcs.push({ i, born: t });
          launchedAt[i] = t;
          lastLaunch = t;
        }
      }
      for (let k = arcs.length - 1; k >= 0; k--) if (t - arcs[k].born > ARC_LIFE) arcs.splice(k, 1);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 76, w, h);
      ctx.clip();
      const list = still
        ? cities.map((c, i) => ({ i, born: -GROW * 2 })).filter(({ i }) => front[i][2] > 0.12)
        : arcs;
      for (const arc of list) {
        const c = cities[arc.i];
        const age = still ? GROW * 1.5 : t - arc.born;
        const grow = Math.min(1, Math.max(0, age / GROW));
        const ease = 1 - Math.pow(1 - grow, 3);
        const fade = still ? 0.55 : age > ARC_LIFE - 900 ? Math.max(0, (ARC_LIFE - age) / 900) : 1;
        const dot = Math.min(1, Math.max(-1, seoul[0] * c.v[0] + seoul[1] * c.v[1] + seoul[2] * c.v[2]));
        const om = Math.acos(dot);
        const lift = Math.min(0.42, 0.06 + om * 0.2);
        const steps = Math.max(24, Math.round(om * 40));
        const pts: ([number, number] | null)[] = [];
        for (let k = 0; k <= steps * ease; k++) {
          const f = k / steps;
          const q = rot(slerp(seoul, c.v, f));
          const up = 1 + lift * Math.sin(Math.PI * f);
          const vis = q[2] > 0 || Math.hypot(q[0] * up, q[1] * up) > 1;
          pts.push(vis ? [sx(q, up), sy(q, up)] : null);
        }
        // 꼬리는 옅게, 머리 쪽은 밝고 굵게
        const drawPath = (from: number, alpha: number, width: number) => {
          ctx.strokeStyle = `rgba(${ORANGE},${alpha})`;
          ctx.lineWidth = width;
          ctx.beginPath();
          let pen = false;
          for (let k = from; k < pts.length; k++) {
            const pt = pts[k];
            if (pt) {
              if (pen) ctx.lineTo(pt[0], pt[1]);
              else ctx.moveTo(pt[0], pt[1]);
              pen = true;
            } else pen = false;
          }
          ctx.stroke();
        };
        drawPath(0, 0.35 * fade, 1.1);
        if (!still) drawPath(Math.max(0, pts.length - 14), 0.95 * fade, 2);
        const head = pts[pts.length - 1];
        if (head && !still && grow < 1) {
          const g = ctx.createRadialGradient(head[0], head[1], 0, head[0], head[1], 10);
          g.addColorStop(0, "rgba(200,212,255,0.95)");
          g.addColorStop(1, "rgba(92,124,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(head[0], head[1], 10, 0, Math.PI * 2);
          ctx.fill();
        }
        // 도착하면 도시에서 신호가 퍼진다
        const p = front[arc.i];
        const hit = still ? -1 : age - GROW;
        if (p[2] > 0.05 && hit >= 0 && hit < 1000) {
          const r = 1 - hit / 1000;
          ctx.strokeStyle = `rgba(${GOLD},${r * 0.9})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(sx(p), sy(p), 4 + (1 - r) * 20, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 도시 점
      cities.forEach((c, i) => {
        const p = front[i];
        if (p[2] <= 0.05) return;
        ctx.fillStyle = `rgba(${GOLD},${0.35 + p[2] * 0.55})`;
        ctx.beginPath();
        ctx.arc(sx(p), sy(p), 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 서울
      if (s[2] > 0) {
        const x = sx(s);
        const y = sy(s);
        ctx.fillStyle = `rgba(${ORANGE},1)`;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 나라 이름
      ctx.textBaseline = "middle";
      for (const c of countries) {
        const p = rot(c.v);
        if (p[2] <= 0.16) continue;
        const a = Math.min(1, (p[2] - 0.16) * 3);
        const x = sx(p);
        const y = sy(p);
        if (!c.key) {
          ctx.fillStyle = `rgba(${TEXT},${a * 0.45})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
        const align = c.align ?? "right";
        ctx.textAlign = align === "left" ? "right" : align === "center" ? "center" : "left";
        let tx = align === "left" ? x - 9 : align === "center" ? x : x + 9;
        const ty = align === "center" ? y - (c.channel ? 16 : 11) : y - (c.channel ? 7 : 0);
        const big = mobile ? 12 : 13;
        const small = mobile ? 10 : 11;
        ctx.font = `${c.key ? 600 : 500} ${c.key ? big : small}px "GX Pretendard", sans-serif`;
        // 이름표가 화면 밖으로 잘리지 않게 안쪽으로 민다
        const tw = Math.max(ctx.measureText(c.name).width, c.channel ? c.channel.length * small * 0.55 : 0);
        if (ctx.textAlign === "center") tx = Math.min(Math.max(tx, tw / 2 + 8), w - tw / 2 - 8);
        else if (ctx.textAlign === "left") tx = Math.min(tx, w - tw - 8);
        else tx = Math.max(tx, tw + 8);
        ctx.fillStyle = `rgba(${TEXT},${a * (c.key ? 0.95 : 0.6)})`;
        ctx.fillText(c.name, tx, ty);
        if (c.channel) {
          ctx.font = `500 ${small}px "GX Pretendard", sans-serif`;
          ctx.fillStyle = `rgba(${SUB},${a * 0.95})`;
          ctx.fillText(c.channel, tx, ty + 15);
        }
      }
      ctx.textAlign = "left";
    }

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      lonDeg += spinAt(lonDeg) * dt;
      draw(now - start);
      frame = requestAnimationFrame(loop);
    };
    const play = () => {
      if (still || running || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(box);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(box);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);
    resize();
    play();
    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="gx-globe" ref={wrap} aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
