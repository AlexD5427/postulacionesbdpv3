'use client';

import Link from 'next/link';
import { useCallback, useRef } from 'react';
import type { ElementType } from 'react';
import { cx } from '@/lib/utils';

function useSpecular<T extends HTMLElement>(){
  const ref=useRef<T|null>(null); const frame=useRef<number|null>(null); const next=useRef({x:50,y:0});
  const tick=useCallback(()=>{frame.current=null;const el=ref.current;if(!el)return;el.style.setProperty('--mx',`${next.current.x}%`);el.style.setProperty('--my',`${next.current.y}%`);},[]);
  const onMouseMove=useCallback((e:React.MouseEvent)=>{const el=ref.current;if(!el||window.matchMedia('(hover:none)').matches)return;const r=el.getBoundingClientRect();next.current={x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100};if(frame.current===null)frame.current=requestAnimationFrame(tick)},[tick]);
  return {ref,onMouseMove} as const;
}
function useMagnet<T extends HTMLElement>(strength=.18){
  const ref=useRef<T|null>(null); const frame=useRef<number|null>(null); const target=useRef({x:0,y:0}); const current=useRef({x:0,y:0});
  const tick=useCallback(()=>{frame.current=null;const el=ref.current;if(!el)return;current.current.x+=(target.current.x-current.current.x)*.22;current.current.y+=(target.current.y-current.current.y)*.22;el.style.setProperty('--tx',`${current.current.x}px`);el.style.setProperty('--ty',`${current.current.y}px`);el.style.setProperty('--mx',`${50+current.current.x*1.7}%`);el.style.setProperty('--my',`${50+current.current.y*1.7}%`);if(Math.abs(target.current.x-current.current.x)>.08||Math.abs(target.current.y-current.current.y)>.08)frame.current=requestAnimationFrame(tick)},[]);
  const move=useCallback((e:React.MouseEvent)=>{const el=ref.current;if(!el||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;const r=el.getBoundingClientRect();target.current={x:(e.clientX-(r.left+r.width/2))*strength,y:(e.clientY-(r.top+r.height/2))*strength};if(frame.current===null)frame.current=requestAnimationFrame(tick)},[strength,tick]);
  const leave=useCallback(()=>{target.current={x:0,y:0};if(frame.current===null)frame.current=requestAnimationFrame(tick)},[tick]);
  return {ref,onMouseMove:move,onMouseLeave:leave};
}
interface GlassCardProps extends React.HTMLAttributes<HTMLElement>{children:React.ReactNode;className?:string;variant?:'pad'|'pad-lg'|'frost'|'solid';edge?:boolean;sheen?:boolean;refract?:boolean;hover?:boolean;as?:ElementType}
export function GlassCard({children,className,variant,edge=false,sheen=false,refract=false,hover=true,as,...rest}:GlassCardProps){const {ref,onMouseMove}=useSpecular<HTMLDivElement>();const Comp:ElementType=as??'div';return <Comp ref={ref} onMouseMove={onMouseMove} className={cx('glass',variant&&`glass--${variant}`,hover&&'glass-hover',edge&&'liquid-edge',sheen&&'sheen',refract&&'refract',className)} {...rest}>{refract&&<span className="refract__layer" aria-hidden="true"/>}{sheen&&<span className="sheen__bar" aria-hidden="true"/>}{children}</Comp>}
type V='primary'|'institutional'|'ghost'|'quiet';type S='sm'|'md'|'lg';interface ButtonBase{children:React.ReactNode;swap?:boolean;variant?:V;size?:S;arrow?:boolean;block?:boolean;className?:string}
function classes(v:V|undefined,s:S,b:boolean,sw:boolean,c?:string){return cx('btn',v&&`btn--${v}`,s!=='md'&&`btn--${s}`,b&&'btn--block',sw&&'btn--swap',c)}
function Content({children,swap,arrow}:Pick<ButtonBase,'children'|'swap'|'arrow'>){return <>{swap?<span className="btn__labels"><span>{children}</span><span aria-hidden="true">{children}</span></span>:<span>{children}</span>}{arrow&&<span className="btn__arrow" aria-hidden="true">&#8594;</span>}</>}
export function GlassButton({children,swap=true,variant,size='md',arrow=false,block=false,className,...rest}:ButtonBase&React.ButtonHTMLAttributes<HTMLButtonElement>){const {ref,onMouseMove,onMouseLeave}=useMagnet<HTMLButtonElement>();return <button ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className={classes(variant,size,block,swap,className)} {...rest}><Content swap={swap} arrow={arrow}>{children}</Content></button>}
export function GlassLink({children,href,swap=true,variant,size='md',arrow=false,block=false,className,...rest}:ButtonBase&{href:string}&Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>,'href'>){const {ref,onMouseMove,onMouseLeave}=useMagnet<HTMLAnchorElement>();return <Link ref={ref} href={href} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className={classes(variant,size,block,swap,className)} {...rest}><Content swap={swap} arrow={arrow}>{children}</Content></Link>}
export function Tilt({children,className,intensidad=6}:{children:React.ReactNode;className?:string;intensidad?:number}){const ref=useRef<HTMLDivElement>(null);const frame=useRef<number|null>(null);const target=useRef({x:0,y:0});const move=(e:React.MouseEvent)=>{const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();target.current={x:((e.clientX-r.left)/r.width-.5)*intensidad,y:-((e.clientY-r.top)/r.height-.5)*intensidad};if(frame.current===null)frame.current=requestAnimationFrame(()=>{frame.current=null;if(ref.current){ref.current.style.setProperty('--ry',`${target.current.x}deg`);ref.current.style.setProperty('--rx',`${target.current.y}deg`)}})};const leave=()=>{if(ref.current){ref.current.style.setProperty('--ry','0deg');ref.current.style.setProperty('--rx','0deg')}};return <div ref={ref} className={cx('tilt',className)} onMouseMove={move} onMouseLeave={leave}>{children}</div>}
