import { useMemo } from "react";
import { BarChart3, Check, MapPin, Megaphone, Scale, Search } from "lucide-react";
import { OWNERS } from "../global";
import type { Owner, OverlayKind, StoryOverlayData } from "../global";
import { LAND_DOTS } from "./globe-dots";

/** 지도 범위(경도 -130~160, 위도 5~68). 미국, 중국, 일본이 한 줄에 들어온다. */
const MAP = { lon0: -130, lon1: 160, lat0: 5, lat1: 68, w: 1000 };
const MAP_H = Math.round((MAP.w * (MAP.lat1 - MAP.lat0)) / (MAP.lon1 - MAP.lon0));
const mapX = (lon: number) => ((lon - MAP.lon0) / (MAP.lon1 - MAP.lon0)) * MAP.w;
const mapY = (lat: number) => ((MAP.lat1 - lat) / (MAP.lat1 - MAP.lat0)) * MAP_H;

/** 장면 종류마다 자리(위치 CSS)를 정한다. 장면 순서는 탭마다 다를 수 있어 번호가 아니라 종류로 묶는다 */
const PLACE: Record<OverlayKind, string> = {
  questions: "gx-ov-1",
  scan: "gx-ov-2",
  run: "gx-ov-3",
  funnel: "gx-ov-4",
  industries: "gx-ov-5",
  prep: "gx-ov-prep",
};
const DEFAULT_ORDER: OverlayKind[] = ["questions", "scan", "run", "funnel", "industries"];

function Chip({ owner }: { owner: Owner }) {
  return <span className={`gx-ov-chip gx-owner is-${owner}`}>{OWNERS[owner].name}</span>;
}

/** 업종 칸마다 같은 네 단계(분석, 선택, 실행, 측정)를 기호로 보여 준다 */
function Steps() {
  return (
    <span className="gx-ov-steps">
      <Search /> <MapPin /> <Megaphone /> <BarChart3 />
    </span>
  );
}

/** 영상 위에 올리는 장면별 글자와 기호. 내용은 아래 자막과 이야기 글에 모두 있어 화면 낭독기에는 숨긴다. */
export function StoryOverlay({ overlay, beat, leaving }: { overlay: StoryOverlayData; beat: number; leaving: boolean }) {
  const dots = useMemo(() => {
    let d = "";
    for (let i = 0; i < LAND_DOTS.length; i += 2) {
      const lat = LAND_DOTS[i] / 10;
      const lon = LAND_DOTS[i + 1] / 10;
      if (lat < MAP.lat0 || lat > MAP.lat1 || lon < MAP.lon0 || lon > MAP.lon1) continue;
      d += `M${mapX(lon).toFixed(1)} ${mapY(lat).toFixed(1)}h0`;
    }
    return d;
  }, []);
  const order = overlay.order ?? DEFAULT_ORDER;
  const right = overlay.right ?? [];
  const cls = (kind: OverlayKind, i: number) =>
    `gx-ov-beat ${PLACE[kind]}${right.includes(kind) ? " is-right" : ""}${beat === i ? " is-on" : ""}${beat === i && leaving ? " is-leaving" : ""}`;

  const body = (kind: OverlayKind) => {
    switch (kind) {
      case "questions":
        return (
          <ul className="gx-ov-questions">
            {overlay.questions.map((q) => (
              <li key={q}>
                <span className="gx-ov-q">?</span>
                {q}
              </li>
            ))}
          </ul>
        );
      case "scan":
        return (
          <>
            <Chip owner="plurank" />
            <p className="gx-ov-figure">
              <span className="gx-ov-count" style={{ ["--to" as string]: overlay.scan.figure }} />
              <small>{overlay.scan.unit}</small>
            </p>
            <p className="gx-ov-line">{overlay.scan.line}</p>
            <ul className="gx-ov-engines">
              {overlay.scan.engines.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
            <span className="gx-ov-tag">{overlay.scan.tag}</span>
          </>
        );
      case "prep":
        return overlay.prep ? (
          <>
            <Chip owner="plurank" />
            <p className="gx-ov-title">
              <Scale aria-hidden="true" />
              {overlay.prep.title}
            </p>
            <ol className="gx-ov-prep-list">
              {overlay.prep.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <span className="gx-ov-tag">{overlay.prep.tag}</span>
          </>
        ) : null;
      case "run":
        return (
          <>
            <Chip owner="microwave" />
            <p className="gx-ov-title">{overlay.run.title}</p>
            {overlay.run.note && <p className="gx-ov-line">{overlay.run.note}</p>}
            <div className="gx-ov-map">
              <svg viewBox={`0 0 ${MAP.w} ${MAP_H}`} preserveAspectRatio="none">
                <path d={dots} className="gx-ov-land" />
              </svg>
              {/* 핀과 이름은 HTML로 올려 휴대폰에서도 글자 크기를 지킨다. 이름 방향은 핀마다 정한다(기본은 위, 아래, 왼쪽) */}
              {overlay.run.pins.map((p, i) => (
                <span
                  key={p.label}
                  className={`gx-ov-pin is-${p.dir ?? ["up", "down", "left"][i]}${p.on ? " is-lit" : ""}`}
                  style={{ left: `${(mapX(p.lon) / MAP.w) * 100}%`, top: `${(mapY(p.lat) / MAP_H) * 100}%` }}
                >
                  <i />
                  <b>{p.label}</b>
                </span>
              ))}
            </div>
          </>
        );
      case "funnel":
        return (
          <>
            <Chip owner="plurank" />
            <ol className="gx-ov-funnel">
              {overlay.funnel.steps.map((s) => (
                <li key={s}>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <p className="gx-ov-check">
              <Check aria-hidden="true" />
              {overlay.funnel.check}
            </p>
            <span className="gx-ov-tag">{overlay.funnel.tag}</span>
          </>
        );
      case "industries":
        return (
          <ul className="gx-ov-industries">
            {(overlay.industries ?? []).map((name) => (
              <li key={name}>
                <span className="gx-ov-label">{name}</span>
                <Steps />
              </li>
            ))}
          </ul>
        );
    }
  };

  return (
    <div className="gx-ov" aria-hidden="true">
      {order.map((kind, i) => (
        <div key={kind} className={cls(kind, i)}>
          {body(kind)}
        </div>
      ))}
    </div>
  );
}
