'use client';

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/utils';

/* ==========================================================================
   useInView: base de todas las revelaciones al hacer scroll
   ========================================================================== */

export function useInView<T extends HTMLElement>(options?: { once?: boolean; amount?: number; rootMargin?: string }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (options?.once !== false) observer.unobserve(entry.target);
          } else if (options?.once === false) {
            setInView(false);
          }
        });
      },
      { threshold: options?.amount ?? 0.18, rootMargin: options?.rootMargin ?? '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView } as const;
}

/* ==========================================================================
   Reveal: aparicion con desenfoque y desplazamiento
   ========================================================================== */

type RevealVariant = 'up' | 'mask' | 'scale';

export function Reveal({
  children,
  delay = 0,
  variant = 'up',
  as: Tag = 'div',
  className,
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: RevealVariant;
  as?: 'div' | 'section' | 'span' | 'li' | 'article' | 'header' | 'p';
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const variantClass = variant === 'mask' ? 'reveal--mask' : variant === 'scale' ? 'reveal--scale' : '';

  return (
    // @ts-expect-error - Tag dinamico controlado por la union de `as`
    <Tag
      ref={ref}
      className={cx('reveal', variantClass, className)}
      data-inview={inView ? 'true' : 'false'}
      style={{ ['--reveal-delay' as string]: `${delay}s` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ==========================================================================
   SplitText: animacion por caracteres o por lineas
   ========================================================================== */

export function SplitChars({
  text,
  className,
  delay = 0,
  step = 0.022,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const palabras = text.split(' ');
  let indice = 0;

  return (
    <span ref={ref} className={className} data-inview={inView ? 'true' : 'false'} aria-label={text}>
      {palabras.map((palabra, wi) => (
        <span key={`${palabra}-${wi}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }} aria-hidden="true">
          {Array.from(palabra).map((char, ci) => {
            const d = delay + indice * step;
            indice += 1;
            return (
              <span key={`${char}-${ci}`} className="split-char" style={{ ['--char-delay' as string]: `${d}s` }}>
                {char}
              </span>
            );
          })}
          {wi < palabras.length - 1 && <span className="split-char" style={{ ['--char-delay' as string]: `${delay + indice++ * step}s` }}>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

export function SplitLines({
  lines,
  className,
  delay = 0,
  step = 0.11,
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  step?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={className} data-inview={inView ? 'true' : 'false'} style={{ display: 'block' }}>
      {lines.map((line, i) => (
        <span className="split-line" key={i}>
          <span style={{ ['--line-delay' as string]: `${delay + i * step}s` }}>{line}</span>
        </span>
      ))}
    </span>
  );
}

/* ==========================================================================
   Counter: numeros que suben al entrar en pantalla
   ========================================================================== */

export function Counter({
  to,
  duration = 1.8,
  suffix = '',
  prefix = '',
  decimals = 0,
  className,
}: {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const inicio = performance.now();
    const paso = (ahora: number) => {
      const p = Math.min(1, (ahora - inicio) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setValor(to * eased);
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={cx('num', className)}>
      {prefix}
      {valor.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ==========================================================================
   Marquee: cinta infinita
   ========================================================================== */

export function Marquee({
  items,
  duration = 34,
  reverse = false,
  className,
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  const contenido = (
    <div className="marquee__track" style={{ ['--marquee-dur' as string]: `${duration}s` }} aria-hidden="true">
      {items.map((item, i) => (
        <span className="marquee__item" key={`${item}-${i}`}>
          {item}
          <span className="dotsep">&#9679;</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cx('marquee', reverse && 'marquee--reverse', className)}>
      {contenido}
      {contenido}
    </div>
  );
}

/* ==========================================================================
   Parallax: desplazamiento suave ligado al scroll
   ========================================================================== */

export function Parallax({
  children,
  distance = 80,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [distance, -distance]), {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/** Escala suave ligada al scroll, para retratos y paneles de vidrio. */
export function ScrollScale({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1.14, 1]), { stiffness: 80, damping: 22 });
  const radius = useTransform(scrollYProgress, [0, 1], [64, 26]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale, borderRadius: radius, overflow: 'hidden' }}>{children}</motion.div>
    </div>
  );
}

/* ==========================================================================
   Rotator: palabras que se reemplazan en vertical
   ========================================================================== */

export function Rotator({ words, interval = 2600, className }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(() => setI((prev) => (prev + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className={cx('hero__rotator', className)} aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: '105%', opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-105%', opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
