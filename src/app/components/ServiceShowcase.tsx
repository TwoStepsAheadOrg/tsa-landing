import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { SERVICE_ITEMS } from "../brand";
import "../../styles/service-showcase.css";

function ServiceStage({ index }: { index: number }) {
  if (index === 0) return (
    <div className="capability-stage capability-stage-content">
      <div className="capability-stage-title"><span>자체 제작·운영</span><strong>이야기에 맞는<br />모든 형태의 콘텐츠.</strong></div>
      <div className="capability-filmstrip">
        <figure><img src="/brand/rin-fashion.webp" alt="RIN AI 가상 모델의 패션 화보" width="700" height="1050" loading="lazy" /><figcaption>AI 모델</figcaption></figure>
        <figure><img src="/brand/jeonseolirae-ulsan.webp" alt="전설이래 울산바위 3D 애니메이션" width="1080" height="1920" loading="lazy" /><figcaption>애니메이션</figcaption></figure>
        <figure><img src="/brand/nextep-poster.webp" alt="다음화 AI 드라마 오른손의 반지" width="360" height="480" loading="lazy" /><figcaption>드라마</figcaption></figure>
      </div>
    </div>
  );
  if (index === 1) return (
    <div className="capability-stage capability-stage-data">
      <div className="capability-stage-title"><span>Plurank</span><strong>AI의 답변에서<br />브랜드의 기회를 읽다.</strong></div>
      <div className="capability-data-preview">
        <div className="capability-observation"><strong>14<small>개국</small></strong><strong>7<small>개 AI</small></strong><span>2026.09 자체 운영자료</span></div>
        <figure><img src="/brand/plurank.webp" alt="Plurank의 브랜드 언급과 인용 출처 분석 화면 예시" width="754" height="753" loading="lazy" /><figcaption>서비스 화면 예시</figcaption></figure>
      </div>
    </div>
  );
  return (
    <div className="capability-stage capability-stage-global">
      <div className="capability-stage-title"><span>MICROWAVE</span><strong>브랜드의 이야기를<br />현지의 대화 속으로.</strong></div>
      <div className="capability-community">
        <span className="capability-platform">Reddit</span>
        <p>질문이 모이는 커뮤니티에서<br />고객에게 필요한 콘텐츠를 찾습니다.</p>
        <ol aria-label="글로벌 콘텐츠 운영 과정"><li>관심사 조사</li><li>콘텐츠 발행</li><li>반응 확인</li></ol>
      </div>
    </div>
  );
}

export function ServiceShowcase({ onInterest }: { onInterest: (interest: string) => void }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const service = SERVICE_ITEMS[selected];
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % SERVICE_ITEMS.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index + SERVICE_ITEMS.length - 1) % SERVICE_ITEMS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = SERVICE_ITEMS.length - 1;
    else return;
    event.preventDefault();setSelected(next);tabs.current[next]?.focus();
  }
  return (
    <section className="capabilities-section" id="services" aria-labelledby="capabilities-heading">
      <div className="wrap">
        <div className="capabilities-heading">
          <div><span className="section-label">우리가 하는 일</span><h2 id="capabilities-heading">만드는 힘.<br />발견되게 하는 힘.</h2></div>
          <p>고객의 질문에서 출발해, 보고 싶은 콘텐츠로.<br />기획과 제작, 발행 이후의 운영까지 연결합니다.</p>
        </div>
        <div className="capabilities-studio">
          <div className="capability-navigation">
            <div role="tablist" aria-label="서비스 분야" className="capability-tabs">
              {SERVICE_ITEMS.map((item, index) => (
                <button key={item.interest} type="button" role="tab" id={`capability-tab-${index}`} aria-selected={selected === index} aria-controls={`capability-panel-${index}`} tabIndex={selected === index ? 0 : -1} ref={node => { tabs.current[index] = node; }} onClick={() => setSelected(index)} onKeyDown={event => onTabKey(event, index)}>
                  <span><strong>{item.title}</strong><small>{item.subtitle}</small></span><ArrowUpRight size={22} aria-hidden="true" />
                </button>
              ))}
            </div>
            <a href="#work" className="capability-work-link">어떻게 만들었는지, 실제 작업 보기<ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          {SERVICE_ITEMS.map((item, index) => (
            <div key={item.interest} role="tabpanel" id={`capability-panel-${index}`} aria-labelledby={`capability-tab-${index}`} hidden={selected !== index} className="capability-panel" tabIndex={0}>
              {selected === index && <>
                <ServiceStage index={index} />
                <div className="capability-details">
                  <p className="capability-description">{service.text}</p>
                  <ul>{service.outputs.map(output => <li key={output}><Check size={15} aria-hidden="true" />{output}</li>)}</ul>
                  <div className="capability-panel-footer"><p>{service.note}</p><a href="#contact" onClick={() => onInterest(service.interest)} aria-label={`${service.title} 프로젝트 문의`}>프로젝트 문의<ArrowRight size={17} aria-hidden="true" /></a></div>
                </div>
              </>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
