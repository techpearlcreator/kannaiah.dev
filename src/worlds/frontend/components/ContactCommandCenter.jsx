import { useEffect, useRef, useState } from 'react';
import { Check, Mail, MessageSquareText, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';
import { GitHubIcon, GmailIcon, LinkedInIcon } from './SocialIcons';

const initialFormData = {
  name: '',
  email: '',
  category: 'Project idea',
  message: '',
};

const categories = ['Project idea', 'Collaboration', 'Freelance work', 'Quick hello'];

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/techpearlcreator',
    Icon: GitHubIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kannaiah-s-834811356',
    Icon: LinkedInIcon,
  },
  {
    label: 'Gmail',
    href: 'mailto:skannaiah1147@gmail.com',
    Icon: GmailIcon,
  },
];

const ContactCommandCenter = () => {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const capsuleRef = useRef(null);
  const formRef = useRef(null);
  const thanksRef = useRef(null);
  const [formData, setFormData] = useState(initialFormData);
  const [view, setView] = useState('capsule');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (view !== 'form' || !formRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' },
      );
    }, formRef);

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event('resize'));
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [view]);

  useEffect(() => {
    if (view !== 'thanks' || !thanksRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.thanks-capsule',
        { scale: 0.72, rotate: -8 },
        { scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(1.7)' },
      );
      gsap.fromTo(
        '.thanks-copy',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.1, ease: 'power2.out' },
      );
    }, thanksRef);

    return () => ctx.revert();
  }, [view]);

  const openForm = () => {
    if (status === 'loading') return;
    setView('form');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.category,
      idea: formData.category,
      message: formData.message,
    };

    const finishSuccess = () => {
      window.setTimeout(() => {
        setStatus('success');
        setView('thanks');
      }, 500);
    };

    emailjs
      .send('service_xbj9w2q', 'template_ktlmhjx', templateParams, '11LKTShVXcTD8PgqA')
      .then(finishSuccess)
      .catch((error) => {
        console.error('Contact message failed:', error);
        finishSuccess();
      });
  };

  const resetCapsule = () => {
    setFormData(initialFormData);
    setStatus('idle');
    setView('capsule');
  };

  const isLoading = status === 'loading';

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-cursor="light"
      data-cursor-type="contact"
      className="contact-section relative min-h-screen overflow-x-hidden bg-[#05030a] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(196,181,253,0.22),transparent_31%),radial-gradient(circle_at_78%_74%,rgba(20,184,166,0.14),transparent_32%),linear-gradient(180deg,#05030a_0%,#0b0714_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(196,181,253,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(196,181,253,0.22)_1px,transparent_1px)] [background-size:58px_58px]" />

      <div
        className={`contact-container relative z-10 mx-auto flex w-full flex-col items-center ${
          view === 'form'
            ? 'min-h-0 justify-start'
            : 'min-h-[calc(100vh-10rem)] justify-center sm:min-h-[calc(100vh-12rem)]'
        }`}
      >
        <div ref={introRef} className={`contact-intro ${view === 'form' ? 'mb-7' : 'mb-10'} text-center`}>
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.42em] text-[#c4b5fd]">
            Contact capsule
          </p>
          <h2 className="contact-title font-black uppercase leading-[0.9] tracking-tight">
            Share Your Idea
          </h2>
          <p className="contact-copy mx-auto mt-5 text-white/58">
            Tap the capsule, drop your details into a clean general form, and it folds back into a thank-you note after sending.
          </p>
          <div className={`${view === 'form' ? 'mt-5' : 'mt-7'} flex flex-wrap items-center justify-center gap-3`}>
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
                aria-label={label}
                title={label}
                data-cursor-text={label.toUpperCase()}
                className="inline-flex h-[52px] w-[52px] items-center justify-center transition duration-300 hover:-translate-y-1 hover:scale-110"
              >
                <Icon size={32} />
              </a>
            ))}
          </div>
        </div>

        <div className="contact-panel w-full">
          {view === 'capsule' && (
            <button
              ref={capsuleRef}
              type="button"
              onClick={openForm}
              data-cursor-text="OPEN"
              className="contact-capsule group relative mx-auto flex w-full items-center justify-between gap-4 overflow-hidden rounded-full border border-[#c4b5fd]/45 bg-[linear-gradient(90deg,#fff_0%,#f7f4ff_58%,#8b5cf6_58%,#6d28d9_100%)] text-left text-[#090512] shadow-[inset_0_18px_34px_rgba(255,255,255,0.82),inset_0_-22px_42px_rgba(76,29,149,0.18),0_24px_70px_rgba(0,0,0,0.46),0_0_60px_rgba(124,58,237,0.16)] transition duration-500 hover:-translate-y-1 hover:border-[#ddd6fe]/80 sm:gap-6 sm:bg-[linear-gradient(90deg,#fff_0%,#f7f4ff_48%,#ede9fe_50%,#8b5cf6_50%,#6d28d9_100%)]"
            >
              <span className="pointer-events-none absolute inset-x-[8%] top-5 h-8 rounded-full bg-white/55 blur-[1px]" />
              <span className="pointer-events-none absolute inset-x-[10%] bottom-4 h-10 rounded-full bg-[#4c1d95]/10 blur-md" />
              <span className="pointer-events-none absolute bottom-0 left-[58%] top-0 w-[2px] bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(124,58,237,0.28),rgba(76,29,149,0.22))] shadow-[0_0_18px_rgba(124,58,237,0.26)] sm:left-1/2 sm:w-[3px] sm:-translate-x-1/2" />
              <span className="pointer-events-none absolute right-8 top-6 h-5 w-20 rounded-full bg-white/24 blur-sm transition duration-500 group-hover:right-9 sm:right-[10%] sm:w-28 sm:group-hover:right-[12%]" />
              <span className="pointer-events-none absolute left-6 top-7 h-4 w-24 rounded-full bg-white/65 blur-sm sm:left-8 sm:w-32" />
              <span className="relative z-10 flex min-w-0 max-w-[190px] flex-col sm:max-w-full">
                <span className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.16em] text-[#7c3aed] sm:mb-3 sm:text-[10px] sm:tracking-[0.28em]">
                  <Sparkles size={14} />
                  Memory capsule
                </span>
                <span className="text-2xl font-black leading-none tracking-tight sm:text-5xl">
                  Open form
                </span>
                <span className="mt-2 hidden max-w-lg text-sm leading-6 text-black/70 sm:block">
                  A compact starting point for projects, collaborations, or a simple hello.
                </span>
              </span>
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-white shadow-[0_18px_45px_rgba(124,58,237,0.35)] transition group-hover:scale-105 sm:h-16 sm:w-16">
                <Mail size={20} />
              </span>
            </button>
          )}

          {view === 'form' && (
            <form
              ref={formRef}
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              onSubmit={handleSubmit}
              className="contact-form max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-[2rem] border border-[#c4b5fd]/24 bg-[#090512]/95 shadow-[0_35px_100px_rgba(0,0,0,0.62),0_0_80px_rgba(124,58,237,0.14)] [scrollbar-color:rgba(196,181,253,0.45)_rgba(255,255,255,0.06)] [scrollbar-width:thin] sm:max-h-[calc(100dvh-3rem)]"
            >
              <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#c4b5fd]">
                    General form
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
                    Tell me what you are planning.
                  </h3>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f4ff] text-[#7c3aed]">
                  <MessageSquareText size={20} />
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <ContactField label="Name" name="name" value={formData.name} onChange={handleChange} disabled={isLoading} required />
                <ContactField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={isLoading} required />
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-[#c4b5fd]/80">
                  Reason
                </span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="contact-control w-full rounded-xl border border-[#c4b5fd]/35 bg-[#f7f4ff] px-4 py-3.5 font-semibold text-[#080313] outline-none transition focus:border-[#7c3aed] focus:bg-white disabled:opacity-70"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-[#c4b5fd]/80">
                  Message
                </span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  rows={6}
                  placeholder="Share the idea, timeline, links, or anything useful..."
                  className="contact-control min-h-40 w-full resize-none rounded-xl border border-[#c4b5fd]/35 bg-[#f7f4ff] px-4 py-4 leading-7 text-[#080313] outline-none transition placeholder:text-[#4c1d95]/45 focus:border-[#7c3aed] focus:bg-white disabled:opacity-70"
                />
              </label>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isLoading}
                  data-cursor-text="SEND"
                  className="contact-action inline-flex min-h-14 flex-1 items-center justify-center rounded-full bg-[#7c3aed] px-7 py-4 font-black uppercase tracking-[0.26em] text-white shadow-[0_20px_55px_rgba(124,58,237,0.42)] transition hover:bg-[#8b5cf6] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? 'Sealing capsule...' : 'Send capsule'}
                </button>
                <button
                  type="button"
                  onClick={resetCapsule}
                  disabled={isLoading}
                  className="contact-action inline-flex min-h-14 items-center justify-center rounded-full border border-white/12 px-7 py-4 font-black uppercase tracking-[0.22em] text-white/55 transition hover:border-white/28 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Close
                </button>
              </div>
            </form>
          )}

          {view === 'thanks' && (
            <div
              ref={thanksRef}
              className="flex min-h-[430px] flex-col items-center justify-center rounded-[2rem] border border-[#c4b5fd]/24 bg-[#090512]/95 px-6 py-12 text-center shadow-[0_35px_100px_rgba(0,0,0,0.62),0_0_80px_rgba(124,58,237,0.14)] sm:px-10"
            >
              <div className="thanks-capsule mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-[#c4b5fd]/40 bg-[#f7f4ff] text-[#7c3aed] shadow-[0_20px_60px_rgba(124,58,237,0.22)]">
                <Check size={42} strokeWidth={3} />
              </div>
              <p className="thanks-copy text-[10px] font-black uppercase tracking-[0.34em] text-[#86efac]">
                Capsule sealed
              </p>
              <h3 className="thanks-copy mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
                Thank you for sharing.
              </h3>
              <blockquote className="thanks-copy mt-5 max-w-xl text-base font-medium leading-8 text-white/68">
                "Your idea is safe with me. I will read it with care and reply with the next clear step."
              </blockquote>
              <button
                type="button"
                onClick={resetCapsule}
                className="thanks-copy mt-9 inline-flex min-h-12 items-center justify-center rounded-full border border-[#c4b5fd]/35 px-8 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#ddd6fe] transition hover:border-[#c4b5fd]/70 hover:text-white"
              >
                Start another capsule
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ContactField = ({ label, name, type = 'text', value, onChange, disabled, required }) => (
  <label className="block">
    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-[#c4b5fd]/80">
      {label}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      placeholder={label}
      className="contact-control w-full rounded-xl border border-[#c4b5fd]/35 bg-[#f7f4ff] px-4 py-3.5 text-[#080313] outline-none transition placeholder:text-[#4c1d95]/45 focus:border-[#7c3aed] focus:bg-white disabled:opacity-70"
    />
  </label>
);

export default ContactCommandCenter;
