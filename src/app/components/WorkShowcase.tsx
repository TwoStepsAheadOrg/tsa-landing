import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, X } from "lucide-react";
import { CHANNELS, INSTAGRAM_CASE, WORKS } from "../brand";
import "../../styles/work-showcase.css";

type WorkId = "rin" | "nextep" | "jeonseolirae" | "telling" | "plurank" | "microwave";
type Category = "전체" | "콘텐츠" | "데이터·마케팅";
type Project = {
  id: WorkId;
  name: string;
  category: Exclude<Category, "전체">;
  kind: string;
  title: string;
  description: string;
  image: string | null;
  alt: string;
  href: string;
  cta: string;
};

const PROJECT_ORDER: WorkId[] = ["rin", "nextep", "jeonseolirae", "telling", "plurank", "microwave"];
const PROJECT_DETAILS: Record<WorkId, { scope: string[]; heading: string; text: string }> = {
  rin: {
    scope: ["AI 가상 인물", "뷰티·패션 비주얼", "캐릭터 기획"],
    heading: "같은 인물로, 다른 장면을 만듭니다.",
    text: "인물의 얼굴과 분위기를 중심에 두고 메이크업, 일상, 패션으로 표현을 넓힙니다. 하나의 캐릭터를 여러 콘텐츠로 이어가는 자체 제작 사례입니다. 메이크업 이미지는 AI 표현 예시입니다.",
  },
  nextep: {
    scope: ["드라마 기획·제작", "한국어·일본어", "플랫폼 운영"],
    heading: "제작한 이야기가, 다음 화로 이어지도록.",
    text: "드라마와 SF·미스터리 콘텐츠를 만들고, 자체 플랫폼에서 작품과 회차를 연결합니다. 영상 한 편의 제작부터 공개 이후의 시청 경험까지 직접 다룹니다.",
  },
  jeonseolirae: {
    scope: ["지역 전설 리서치", "AI 애니메이션", "릴스 연재"],
    heading: "익숙한 지명에서, 보고 싶은 이야기를 찾습니다.",
    text: INSTAGRAM_CASE.description,
  },
  telling: {
    scope: ["개인화 콘텐츠", "AI 캐릭터", "서비스 기획·개발"],
    heading: "누군가의 이야기가, 나의 콘텐츠가 됩니다.",
    text: "AI 캐릭터와 개인화 콘텐츠를 직접 서비스하며, 콘텐츠와 제품 경험을 함께 설계합니다. 이미지의 ‘견생사주’는 반려견을 소재로 한 개인화 콘텐츠 사례입니다.",
  },
  plurank: {
    scope: ["AI 답변 관측", "브랜드 언급·인용 분석", "콘텐츠 주제 발굴"],
    heading: "무엇을 만들지 정하기 전에, 질문부터 읽습니다.",
    text: "국가·언어·AI별 답변에서 브랜드가 어떻게 언급되고 어떤 출처가 인용되는지 살핍니다. 그 관측을 콘텐츠의 주제와 근거, 발행 맥락을 정하는 판단에 연결합니다.",
  },
  microwave: {
    scope: ["글로벌 주제 조사", "Reddit 콘텐츠", "커뮤니티 운영"],
    heading: "데이터에서 찾은 주제를, 현지의 대화로 옮깁니다.",
    text: "고객의 질문과 AI 인용 출처를 살펴 콘텐츠 주제를 정합니다. 현지 맥락에 맞는 글을 기획·발행하고 댓글과 반응을 확인합니다. 커뮤니티 규칙과 필요한 광고 관계 공개를 반영해 운영합니다.",
  },
};

const PROJECTS = PROJECT_ORDER.map((id): Project => {
  if (id === "jeonseolirae") return {
    id,
    name: INSTAGRAM_CASE.name,
    category: "콘텐츠",
    kind: "AI 애니메이션·Instagram",
    title: "지명에 숨어 있던 이야기를, 1분의 애니메이션으로.",
    description: INSTAGRAM_CASE.description,
    image: INSTAGRAM_CASE.reels[0].image,
    alt: "전설이래의 지역 전설 AI 애니메이션",
    href: INSTAGRAM_CASE.href,
    cta: "Instagram 보기",
  };
  return WORKS.find((work) => work.id === id)! as Project;
});

function ProjectVisual({ project, detail = false }: { project: Project; detail?: boolean }) {
  if (project.id === "rin") return (
    <div className="ws-visual ws-rin-visual">
      <img className="ws-rin-beauty" src="/brand/rin-beauty.webp" alt="AI 가상 인물 RIN의 메이크업 표현 두 가지" width="1000" height="667" loading="lazy" />
      <img className="ws-rin-fashion" src="/brand/rin-fashion.webp" alt="RIN의 패션 전신 비주얼" width="700" height="1050" loading="lazy" />
      <img className="ws-rin-life" src="/brand/rin-life.webp" alt="카페를 배경으로 한 RIN의 일상 비주얼" width="900" height="603" loading="lazy" />
      <span className="ws-image-caption">RIN <span>하나의 인물, 여러 개의 장면.</span></span>
    </div>
  );
  if (project.id === "jeonseolirae") return (
    <div className="ws-visual ws-legend-visual">
      <div className="ws-legend-title"><span>전설이래</span><p>우리 동네에<br />이런 이야기가?</p></div>
      <div className="ws-reel-pair">
        {INSTAGRAM_CASE.reels.map((reel) => <figure key={reel.href}>
          <img src={reel.image} alt={`전설이래: ${reel.title}`} width="1080" height="1920" loading="lazy" />
          <figcaption>{reel.title}</figcaption>
        </figure>)}
      </div>
    </div>
  );
  if (project.id === "nextep") return (
    <div className="ws-visual ws-nextep-visual">
      <div><span className="ws-nextep-brand">다음화</span><p>한 편의 몰입.<br />그다음 이야기.</p></div>
      <div className="ws-poster-frame"><img src={project.image!} alt={project.alt} width="360" height="480" loading="lazy" /></div>
      <span className="ws-nextep-caption">AI 드라마 제작부터 공개까지</span>
    </div>
  );
  if (project.id === "telling") return (
    <div className="ws-visual ws-telling-visual">
      <div><span>Telling</span><p>나에게만 있는<br />이야기.</p></div>
      <img src={project.image!} alt={project.alt} width="720" height="960" loading="lazy" />
    </div>
  );
  if (project.id === "plurank") return (
    <div className="ws-visual ws-plurank-visual">
      <div className="ws-product-heading"><span>Plurank</span><span>질문에서 찾는 콘텐츠의 단서</span></div>
      <div className="ws-dashboard-frame"><img src={project.image!} alt={project.alt} width="754" height="753" loading="lazy" /></div>
      <p>서비스 화면 예시 · 개별 고객의 성과 수치가 아닙니다</p>
    </div>
  );
  return (
    <div className="ws-visual ws-microwave-visual">
      <span className="ws-microwave-brand">MICROWAVE</span>
      <p className="ws-microwave-statement">고객이 묻는 곳에,<br />브랜드의 답을.</p>
      <div className="ws-community-flow" aria-label="고객 질문과 주제 조사, 현지 맥락에 맞춘 콘텐츠 제작, 발행과 반응 확인">
        <div><span>고객의 질문</span><strong>어떤 정보가 필요할까?</strong></div>
        <ArrowRight size={20} aria-hidden="true" />
        <div><span>현지의 문맥</span><strong>어떻게 이야기할까?</strong></div>
        <ArrowRight size={20} aria-hidden="true" />
        <div><span>발행과 운영</span><strong>어떤 반응이 돌아올까?</strong></div>
      </div>
      <span className="ws-microwave-caption">Reddit 콘텐츠 · 커뮤니티 운영{detail ? " · 작업 흐름" : ""}</span>
    </div>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  const detail = PROJECT_DETAILS[project.id];
  return (
    <>
      <div className="ws-dialog-heading"><span>{project.kind}</span><h2 id="ws-dialog-title">{project.name}</h2><p>{detail.heading}</p></div>
      <ProjectVisual project={project} detail />
      <div className="ws-dialog-copy"><h3>우리가 한 일</h3><ul className="ws-scope-tags">{detail.scope.map((scope) => <li key={scope}>{scope}</li>)}</ul><p id="ws-dialog-description">{detail.text}</p></div>
      {project.id === "jeonseolirae" && <div className="ws-detail-evidence">
        <dl><div><dt>제작 2일의 조회 기록</dt><dd>약 10.1만<span>릴스 10편 표시 조회수 합산</span></dd></div><div><dt>팔로워 · 회사 제공 업데이트</dt><dd>{INSTAGRAM_CASE.metrics[2].value}명<span>첫 1주일 {INSTAGRAM_CASE.initialFollowers}명</span></dd></div></dl>
        <p>{INSTAGRAM_CASE.sourceNote}</p>
        <div className="ws-reel-links">{INSTAGRAM_CASE.reels.map((reel) => <a key={reel.href} href={reel.href} target="_blank" rel="noopener noreferrer">{reel.title}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (새 탭)</span></a>)}</div>
      </div>}
      {project.id === "plurank" && <p className="ws-detail-note">Plurank는 AI 답변의 언급과 인용을 관측하는 서비스입니다. 콘텐츠의 인용 가능성 예측을 위한 Pluora는 별도로 학습·개발 중입니다.</p>}
      <a className="ws-dialog-visit" href={project.href} target="_blank" rel="noopener noreferrer">{project.cta}<ArrowUpRight size={20} aria-hidden="true" /><span className="sr-only"> (새 탭)</span></a>
    </>
  );
}

export function WorkShowcase() {
  const [filter, setFilter] = useState<Category>("전체");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const backdropPressRef = useRef(false);
  const visible = PROJECTS.filter((project) => filter === "전체" || project.category === filter);

  useEffect(() => {
    if (!activeProject || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.scrollTop = 0;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (triggerRef.current?.isConnected) triggerRef.current.focus({ preventScroll: true });
    };
  }, [activeProject]);

  function openProject(project: Project, trigger: HTMLElement) {
    triggerRef.current = trigger;
    setActiveProject(project);
  }

  return (
    <section className="work-showcase wrap" id="work" aria-labelledby="ws-heading">
      <div className="ws-heading-row">
        <div><span className="section-label">실제 작업</span><h2 id="ws-heading">설명보다 먼저,<br />우리가 만든 것들.</h2></div>
        <p>인물과 이야기, 데이터와 서비스.<br />직접 만들고 운영하는 작업을 만나보세요.</p>
      </div>
      <div className="ws-filter-row"><div className="ws-filters" role="group" aria-label="작업 분야 필터">{(["전체", "콘텐츠", "데이터·마케팅"] as Category[]).map((category) => <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div><span className="ws-result-count" role="status" aria-live="polite">{visible.length}개의 작업</span></div>
      <div className={`ws-gallery${filter === "데이터·마케팅" ? " ws-gallery-data" : ""}`}>
        {visible.map((project) => <article key={project.id} className={`ws-project ws-project-${project.id}`}>
          <button type="button" className="ws-image-button" onClick={(event) => openProject(project, event.currentTarget)} aria-label={`${project.name} 프로젝트 상세 보기`} aria-haspopup="dialog"><ProjectVisual project={project} /><span className="ws-image-open"><ArrowUpRight size={24} aria-hidden="true" /></span></button>
          <div className="ws-project-heading"><h3>{project.name}</h3><span>{project.kind}</span></div>
          <p className="ws-project-title">{project.title}</p>
          <ul className="ws-scope-tags">{PROJECT_DETAILS[project.id].scope.map((scope) => <li key={scope}>{scope}</li>)}</ul>
          <div className="ws-project-actions"><button type="button" onClick={(event) => openProject(project, event.currentTarget)} aria-haspopup="dialog" aria-label={`${project.name} 프로젝트 상세 보기`}>프로젝트 상세 보기<ArrowRight size={16} aria-hidden="true" /></button><a href={project.href} target="_blank" rel="noopener noreferrer">{project.cta}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (새 탭)</span></a></div>
        </article>)}
      </div>
      <div className="ws-channel-section" aria-labelledby="ws-channel-heading">
        <div className="ws-channel-intro"><h3 id="ws-channel-heading">직접 키우며,<br />반응을 배웁니다.</h3><p>첫 1주일의 성장에서 시작해<br />한국어·일본어 드라마와 SF 콘텐츠를 이어갑니다.</p></div>
        <div className="ws-channel-list">{CHANNELS.map((channel) => <a className="ws-channel" key={channel.name} href={channel.href} target="_blank" rel="noopener noreferrer"><div><span className="ws-channel-kind">{channel.lang}</span><h4>{channel.name}<ArrowUpRight size={16} aria-hidden="true" /></h4></div><div className="ws-channel-numbers"><span>구독자 <strong>{channel.subscribers}명</strong></span><small>첫 1주일 구독자 {channel.initialSubscribers}명</small></div><span className="sr-only"> (새 탭)</span></a>)}</div>
        <p className="ws-channel-source">구독자는 2026.10.13 회사 제공 업데이트입니다. 기존 수치의 1.5배를 정수로 반올림했으며, 첫 1주일의 기록과 구분해 표시했습니다.</p>
      </div>
      <dialog ref={dialogRef} className="ws-dialog" aria-labelledby="ws-dialog-title" aria-describedby="ws-dialog-description" onCancel={(event) => { event.preventDefault(); setActiveProject(null); }} onClose={(event) => { if (!event.currentTarget.open) setActiveProject(null); }} onPointerDown={(event) => { const rect = event.currentTarget.getBoundingClientRect(); backdropPressRef.current = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom; }} onClick={(event) => { if (event.target === event.currentTarget && backdropPressRef.current) setActiveProject(null); backdropPressRef.current = false; }}>
        <div className="ws-dialog-content"><button ref={closeRef} className="ws-dialog-close" type="button" onClick={() => setActiveProject(null)} aria-label="프로젝트 상세 닫기"><X size={23} aria-hidden="true" /></button>{activeProject && <ProjectDetails project={activeProject} />}</div>
      </dialog>
    </section>
  );
}
