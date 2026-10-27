"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import technologyIcons from "@/lib/technology-icons.json";
import { stack } from "@/lib/data";

const labels = ["Linguagens", "Pipelines", "Cloud", "Dados", "Observabilidade", "Infraestrutura", "Bancos"];
const descriptions = [
  "Desenvolvimento de serviços, pipelines e consultas.",
  "Agendamento, processamento distribuído e integração contínua.",
  "Armazenamento, processamento e catálogo no Google Cloud.",
  "Manipulação, validação, consulta e visualização de dados.",
  "Monitoramento de métricas, traces e linhagem dos pipelines.",
  "Mensageria, containers, cache e infraestrutura como código.",
  "Integração e extração de dados de bancos relacionais.",
];

export function StackExplorer() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = stack[selected];

  return <div className="stack-explorer">
    <div className="stack-selector" role="tablist" aria-label="Áreas de tecnologia" aria-orientation="vertical">
      {stack.map((item, index) => <button key={item.group} ref={node => { tabs.current[index] = node; }} type="button" role="tab" id={`stack-tab-${index}`} aria-selected={selected === index} aria-controls="stack-panel" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % stack.length;
        else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + stack.length) % stack.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = stack.length - 1;
        else return;
        event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
      }}><span className="eyebrow">0{index + 1}</span><span>{labels[index]}</span><span className="stack-tab-arrow" aria-hidden="true">↗</span></button>)}
    </div>
    <div className="stack-panel" id="stack-panel" role="tabpanel" aria-labelledby={`stack-tab-${selected}`} tabIndex={0}>
      <div className="stack-panel-top eyebrow"><span>STACK / {String(selected + 1).padStart(2, "0")}</span><span>{group.items.length} TECNOLOGIAS</span></div>
      <div className="stack-panel-content" key={selected}>
        <h3>{group.group}</h3><p>{descriptions[selected]}</p>
        <div className="technology-grid">{group.items.map((item, index) => <div className="technology-tile" key={item} style={{ animationDelay: `${index * 45}ms` }}><Image className="technology-icon" src={`/icons/${technologyIcons[item as keyof typeof technologyIcons]}.svg`} width={32} height={32} alt="" aria-hidden="true" /><span>{item}</span></div>)}</div>
      </div>
      <div className="stack-panel-foot eyebrow"><span>SELECIONE UMA ÁREA PARA EXPLORAR</span><span aria-hidden="true">{String(selected + 1).padStart(2, "0")} / 07</span></div>
    </div>
  </div>;
}
