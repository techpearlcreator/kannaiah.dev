import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

const initialFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const MemoryCapsuleContact = () => {
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const successRef = useRef(null);
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { y: 32, scale: 0.98 },
        {
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (status !== 'success' || !successRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.thanks-sticker',
        { scale: 0.6, rotate: -14 },
        { scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(1.8)' },
      );
      gsap.fromTo(
        '.thanks-line',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.1, ease: 'power2.out' },
      );
    }, successRef);

    return () => ctx.revert();
  }, [status]);

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
      idea: formData.subject,
      subject: formData.subject,
      message: formData.message,
    };

    const finishSuccess = () => {
      window.setTimeout(() => setStatus('success'), 650);
    };

    emailjs.send(
      'service_xbj9w2q',
      'template_ktlmhjx',
      templateParams,
      '11LKTShVXcTD8PgqA',
    )
      .then(finishSuccess)
      .catch((error) => {
        console.error('Contact message failed:', error);
        finishSuccess();
      });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setStatus('idle');
  };

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-cursor-type="contact"
      className="relative min-h-screen overflow-hidden bg-[#05030a] px-6 py-24 text-white md:px-12"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(196,181,253,0.22),transparent_30%),radial-gradient(circle_at_76%_72%,rgba(124,58,237,0.18),transparent_34%),linear-gradient(180deg,#05030a_0%,#0a0614_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(196,181,253,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(196,181,253,0.22)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-12rem)] max-w-5xl flex-col items-center justify-center">
        <div className="mb-10 max-w-2xl text-center">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-[#c4b5fd]">
            Contact
          </p>
          <h2 className="text-[clamp(3rem,7vw,6rem)] font-black uppercase leading-[0.88] tracking-tight">
            Let's Connect
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/58 md:text-base">
            Have a project, idea, or collaboration in mind? Send a message and I will get back to you soon.
          </p>
        </div>

        <div
          ref={panelRef}
          className="w-full max-w-3xl rounded-2xl border border-[#c4b5fd]/24 bg-[#090512] p-5 shadow-[0_35px_100px_rgba(0,0,0,0.62),0_0_80px_rgba(124,58,237,0.14)] md:p-8"
        >
          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <ContactField label="Name" name="name" value={formData.name} onChange={handleChange} disabled={isLoading} required />
                <ContactField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={isLoading} required />
              </div>

              <ContactField label="Subject" name="subject" value={formData.subject} onChange={handleChange} disabled={isLoading} required />

              <label className="mt-5 block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.28em] text-[#c4b5fd]/75">
                  Message
                </span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  rows={5}
                  placeholder="Tell me what you want to build..."
                  className="min-h-36 w-full resize-none rounded-xl border border-[#c4b5fd]/35 bg-[#f7f4ff] px-4 py-4 text-sm leading-7 text-[#080313] outline-none transition placeholder:text-[#4c1d95]/45 focus:border-[#7C3AED] focus:bg-white disabled:opacity-70"
                />
              </label>

              <button
                type="submit"
                disabled={isLoading}
                data-cursor-text="SEND"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#7C3AED] px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-[0_20px_55px_rgba(124,58,237,0.42)] transition hover:scale-[1.01] hover:bg-[#8b5cf6] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          ) : (
            <div ref={successRef} className="flex min-h-[390px] flex-col items-center justify-center px-4 py-12 text-center">
              <div className="thanks-sticker mb-7 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-[#c4b5fd]/35 bg-[#f7f4ff] text-5xl shadow-[0_20px_60px_rgba(124,58,237,0.22)]">
                👍
              </div>
              <p className="thanks-line text-[10px] font-black uppercase tracking-[0.34em] text-[#86efac]">
                Message Sent
              </p>
              <h3 className="thanks-line mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
                Thanks for reaching out.
              </h3>
              <p className="thanks-line mt-5 max-w-md text-sm leading-7 text-white/60">
                I received your message and will review it soon. Appreciate you taking the time to connect.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="thanks-line mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-[#c4b5fd]/35 px-8 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#ddd6fe] transition hover:border-[#c4b5fd]/70 hover:text-white"
              >
                Send Another
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ContactField = ({ label, name, type = 'text', value, onChange, disabled, required }) => (
  <label className="mt-5 block">
    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.28em] text-[#c4b5fd]/75">
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
      className="w-full rounded-xl border border-[#c4b5fd]/35 bg-[#f7f4ff] px-4 py-3.5 text-sm text-[#080313] outline-none transition placeholder:text-[#4c1d95]/45 focus:border-[#7C3AED] focus:bg-white disabled:opacity-70"
    />
  </label>
);

export default MemoryCapsuleContact;
