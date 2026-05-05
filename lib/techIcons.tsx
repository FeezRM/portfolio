import React from 'react';
import {
  SiPython, SiTypescript, SiJavascript, SiOpenjdk, SiMysql, SiCplusplus, SiHtml5,
  SiScikitlearn, SiOpencv, SiFfmpeg, SiOpenai, SiGoogle,
  SiLangchain, SiJson,
  SiAnthropic,
  SiNextdotjs, SiReact, SiFastapi, SiNodedotjs, SiFlask, SiSpringboot, SiElectron, SiDjango, SiVuedotjs,
  SiPostgresql, SiSupabase, SiDocker, SiGit, SiNotion, SiPostman, SiLinux,
} from 'react-icons/si';
import { TbWaveSine, TbRouter, TbVectorBezier2, TbBrain, TbNetwork, TbRoute } from 'react-icons/tb';
import { BsGraphUp, BsCameraVideo, BsSearch } from 'react-icons/bs';
import { FaJava, FaAws, FaRobot, FaDatabase } from 'react-icons/fa';

type IconComp = React.ComponentType<{ style?: React.CSSProperties; className?: string }>;

export const techIconMap: Record<string, IconComp> = {
  // Languages
  'Python':     SiPython,
  'TypeScript': SiTypescript,
  'JavaScript': SiJavascript,
  'Java':       FaJava as IconComp,
  'SQL':        SiMysql,
  'C++':        SiCplusplus,
  'HTML/CSS':   SiHtml5,

  // ML / CV
  'scikit-learn':     SiScikitlearn,
  'OpenCV':           SiOpencv,
  'MediaPipe':        SiGoogle,
  'faster-whisper':   SiOpenai,
  'librosa':          TbWaveSine as IconComp,
  'ffmpeg':           SiFfmpeg,
  'model evaluation': BsGraphUp as IconComp,
  'computer vision':  BsCameraVideo as IconComp,

  // AI / APIs
  'OpenRouter':        TbRouter as IconComp,
  'RAG':               FaDatabase as IconComp,
  'LangChain':         SiLangchain,
  'embeddings':        TbVectorBezier2 as IconComp,
  'vector search':     BsSearch as IconComp,
  'vector database':   SiPostgresql,
  'prompt engineering': TbBrain as IconComp,
  'JSON schemas':      SiJson,
  'LLM agents':        FaRobot as IconComp,
  'LLM APIs':          SiOpenai,
  'LLM pipelines':     TbBrain as IconComp,
  'Claude API':        SiAnthropic,
  'Notion API':        SiNotion,
  'Automation':        TbRoute as IconComp,

  // Agents
  'Codex':                 SiOpenai,
  'Claude Code':           SiAnthropic,
  'multi-agent workflows': TbNetwork as IconComp,
  'routing':               TbRoute as IconComp,

  // Frameworks
  'Next.js':    SiNextdotjs,
  'React':      SiReact,
  'FastAPI':    SiFastapi,
  'Node.js':    SiNodedotjs,
  'Flask':      SiFlask,
  'Spring Boot': SiSpringboot,
  'Electron':   SiElectron,
  'Django':     SiDjango,
  'Vue 3':      SiVuedotjs,

  // Tools & Infra
  'PostgreSQL':   SiPostgresql,
  'Supabase':     SiSupabase,
  'AWS S3/Polly': FaAws as IconComp,
  'AWS Polly':    FaAws as IconComp,
  'S3':           FaAws as IconComp,
  'Docker':       SiDocker,
  'Git':          SiGit,
  'Notion':       SiNotion,
  'Postman':      SiPostman,
  'Linux':        SiLinux,
};

export function TechTag({
  tag,
  className = '',
}: {
  tag: string;
  className?: string;
}) {
  const Icon = techIconMap[tag];
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {Icon && <Icon className="flex-shrink-0 opacity-70" style={{ fontSize: '0.85em' }} />}
      {tag}
    </span>
  );
}
