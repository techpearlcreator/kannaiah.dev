import { motion } from 'framer-motion';
import { GitHubIcon, GmailIcon, LinkedInIcon } from './SocialIcons';

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

const Hero = () => {
  return (
    <section className="portfolio-hero relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-lilac-light text-center">
      {/* Background Blobs */}
      <div className="float-blob absolute left-4 top-16 h-56 w-56 rounded-full bg-white/40 blur-[80px] sm:left-10 sm:top-10 sm:h-96 sm:w-96 sm:blur-[100px]" />
      <div className="float-blob absolute bottom-10 right-4 h-56 w-56 rounded-full bg-white/30 blur-[80px] sm:right-10 sm:h-96 sm:w-96 sm:blur-[100px]" style={{ animationDelay: '-5s' }} />
      <div className="float-blob absolute left-1/4 top-1/2 h-72 w-72 rounded-full bg-white/20 blur-[100px] sm:left-1/3 sm:h-[500px] sm:w-[500px] sm:blur-[120px]" style={{ animationDelay: '-10s' }} />

      <motion.h1
        initial={{ opacity: 1, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="portfolio-hero-title z-10 mb-6 font-sans font-bold leading-[0.92] tracking-normal sm:mb-8"
      >
        Crafting digital <br />
        <span className="font-serif italic font-normal">experiences</span> with passion
      </motion.h1>

      <motion.p
        initial={{ opacity: 1, y: 30 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="portfolio-hero-copy z-10"
      >
        I'm Kannaiah S, an aspiring <strong>Vibe-Code Developer</strong> and <strong>IT Student</strong> dedicated to building high-quality, responsive web & Mobile applications. Currently focused on mastering modern design and <strong>Interested in learning AI Engineering</strong>.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="portfolio-socials z-10 mt-7 flex flex-wrap items-center justify-center gap-4 sm:mt-8"
      >
        {socialLinks.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
            aria-label={label}
            title={label}
            data-cursor-type="lens"
            className="portfolio-social-link group inline-flex h-12 w-12 items-center justify-center text-black/70 transition duration-300 hover:-translate-y-1 hover:scale-110 hover:text-black sm:h-14 sm:w-14"
          >
            <Icon size={30} />
          </a>
        ))}
      </motion.div>

      <div className="portfolio-scroll-cue absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center opacity-30 sm:flex">
        <span className="text-[10px] tracking-[0.35em] uppercase font-bold mb-4 ">Scroll to Explore</span>
        <div className="w-px h-16 bg-black/20" />
      </div>
    </section>
  );
};

export default Hero;
