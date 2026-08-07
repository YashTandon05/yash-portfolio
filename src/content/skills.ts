/**
 * Skills, grouped. Recruiters and keyword filters both read this section, so
 * keep the names conventional (spell out "PyTorch", not "torch").
 *
 * Only list things you'd be comfortable being asked about in an interview.
 */

export interface SkillGroup {
  label: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "C++", "TypeScript", "TODO: add / remove"],
  },
  {
    label: "ML & Perception",
    items: ["PyTorch", "CUDA", "TODO: OpenCV?", "TODO: add"],
  },
  {
    label: "Robotics",
    items: ["ROS", "TODO: simulator", "TODO: add"],
  },
  {
    label: "Systems & Tools",
    items: ["Next.js", "Git", "TODO: cloud", "TODO: database"],
  },
];
