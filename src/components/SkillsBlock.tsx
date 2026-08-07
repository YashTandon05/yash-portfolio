"use client";

import { motion, useReducedMotion } from "framer-motion";
import { riseIn, stagger, viewportOnce } from "@/lib/motion";
import { skills } from "@/content/skills";

export default function SkillsBlock() {
  const reduce = useReducedMotion();

  return (
    <motion.dl
      variants={stagger}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4"
    >
      {skills.map((group) => (
        <motion.div key={group.label} variants={riseIn}>
          <dt className="font-mono text-[10px] tracking-[0.18em] text-graphite/80 uppercase">
            {group.label}
          </dt>
          <dd className="mt-3 flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-[2px] border border-ink/12 bg-card px-2 py-1 font-mono text-[11px] text-graphite"
              >
                {item}
              </span>
            ))}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}
