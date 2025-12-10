import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const text = "FV";

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/seed/fv/1920/1080"
          alt="Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </motion.div>

      <div className="relative z-10 text-center">
        <h1 className="text-6xl md:text-8xl font-serif tracking-widest text-white font-light flex overflow-hidden">
          {text.split("").map((char, index) => {
            return (
              <motion.span
                key={index}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 2,
                  delay: 0.5 + index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
        </h1>
      </div>
    </section>
  );
}
