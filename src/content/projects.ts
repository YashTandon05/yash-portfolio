/**
 * Project content. Everything the UI renders comes from this file — swapping in
 * real copy means editing here only, no component changes.
 *
 * PLACEHOLDER STATUS: titles and categories are real (carried over from the
 * previous build); every `hook`, `description`, `metric`, and link href marked
 * TODO still needs your words. Entries with `placeholder: true` render as an
 * obviously-empty dashed slot so nothing fake ships by accident.
 */

export type Category = "ai-ml" | "robotics" | "swe";

export interface ProjectLink {
  /** Spelled out on the case study; the card shows only the kind's icon, with
   *  this as its tooltip and accessible name. */
  label: string;
  href: string;
  kind: "repo" | "demo" | "paper" | "writeup";
}

/** One slide in a case study's slideshow — a still, a short clip, or a live embed. */
export interface ProjectMedia {
  /**
   * Path under `public/`, e.g. `"/projects/donkeycar/dashboard.png"`. Served as
   * a plain string rather than a static import so adding a screenshot is a
   * content edit, which is also why the slideshow letterboxes instead of
   * cropping — it never learns the real dimensions.
   *
   * `.png` / `.jpg` / `.webp` render as stills; `.mp4` / `.webm` render as a
   * muted, looping, pausable clip that plays only while its slide is showing.
   *
   * **Prefer `.mp4` over `.gif` for screen recordings.** A GIF of a ten-second
   * capture runs 5–20 MB against a few hundred KB for the same clip as H.264,
   * and quantizing to 256 colors wrecks exactly the thing a dashboard recording
   * needs to show: small text and thin gauge lines. `.gif` still works (it's
   * passed through un-re-encoded, since optimizing it would flatten it to one
   * frame) — it's just the expensive way to get a worse picture.
   *
   * When `embed` is set, this is an absolute `https://` URL instead of a file.
   */
  src: string;
  /**
   * Alt text — and for clips and embeds, the accessible name. Describe what the
   * slide *shows* ("Dashboard with the confidence gauge at 92%"), not that it is
   * a screenshot or a recording; the frame already says that. On an embed this
   * doubles as the blurb on the launch panel, so write it as an invitation:
   * "Place a shot, keeper, and defenders on the pitch and see xG update live."
   */
  alt: string;
  /** Optional one-liner under the frame. Say what the reader should notice. */
  caption?: string;
  /**
   * Clips: still shown before playback. Worth setting, since it's what a reader
   * with reduced motion enabled sees — the clip won't autostart for them, so
   * without a poster the frame is just black until they hit play.
   *
   * Embeds: optional screenshot, used as a faint backdrop behind the launch
   * button. Purely decorative; the panel reads fine without one.
   */
  poster?: string;
  /**
   * Makes this slide a live embed: `src` is framed in an iframe rather than
   * loaded as a file. Use it for a hosted interactive demo.
   *
   * The slideshow shows a launch panel inline and mounts the real iframe only
   * once the reader opens the overlay — an embed costs nothing until someone
   * asks for it, and gets near-full-viewport room when they do. That matters for
   * a demo talking to a host that sleeps: nobody pays a cold start just by
   * scrolling past the case study.
   *
   * The target must allow framing. Anything sending `X-Frame-Options: DENY` or a
   * `frame-ancestors` CSP renders as a blank panel with no error you can catch
   * from here, so check the response headers before adding one.
   */
  embed?: boolean;
}

export interface Project {
  slug: string;
  /**
   * Primary category — decides which block the project is listed under.
   *
   * A project is listed under exactly one category, never duplicated across two.
   * Cross-discipline work declares the extra fields in `alsoIn`, which shows as a
   * tag on the card: duplicating a card would make "3 latest" mean different
   * things in different blocks and make a recruiter read the same project twice
   * while scrolling. Cross-category discovery is handled by the skill filter,
   * which ignores category boundaries entirely.
   */
  category: Category;
  title: string;
  /** One-sentence hook — the only line a skimming recruiter is guaranteed to read. */
  hook: string;
  /** 2–3 sentences, used on the case-study page. */
  description: string;
  /**
   * Mono chips — and the source of truth for the Skills section. Every non-TODO
   * entry becomes a selectable skill chip, so spell names the conventional way
   * ("PyTorch", not "torch") or add an alias in content/skills.ts.
   */
  stack: string[];
  /** Extra categories this also belongs to, shown as a small tag on the card. */
  alsoIn?: Category[];
  /** Headline number, e.g. "+12.4 mAP" or "3rd / 48 teams". Optional. */
  metric?: string;
  /** Right-aligned mono timestamp on the card. */
  period?: string;
  /**
   * Sort key, `"YYYY-MM"` — ordering only, never rendered (`period` is the
   * display string). Each category block shows the three newest by this field
   * and hides the rest behind an expander, so set it on every real project.
   * Undated entries fall in after dated ones, keeping their order in this file.
   */
  date?: string;
  links?: ProjectLink[];
  /**
   * Screenshots/diagrams, shown as a slideshow high on the case-study page —
   * directly under the metric, before the prose. Optional and per-project: a
   * project with no `media` renders exactly as it does today. One entry is
   * fine; it renders as a plain captioned figure with no controls.
   */
  media?: ProjectMedia[];
  /** Deep-dive fields, used by /projects/[slug]. */
  problem?: string;
  approach?: string;
  result?: string;
  /** Renders an empty "slot reserved" card instead of real content. */
  placeholder?: boolean;
}

export interface CategoryMeta {
  id: Category;
  /** Short label used in headings, nav, and chips. */
  label: string;
  /** One line under the heading explaining what belongs here. */
  blurb: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "ai-ml",
    label: "AI / ML",
    blurb:
      "Machine learning and computer vision work: models, datasets, and the evaluation that says whether any of it actually helped.",
  },
  {
    id: "robotics",
    label: "Robotics",
    blurb:
      "Perception, planning, and control running on real hardware and in simulation.",
  },
  {
    id: "swe",
    label: "Software Engineering",
    blurb:
      "Full-stack products, data pipelines, and internal tooling built to be used by other people.",
  },
];

export const projects: Project[] = [
  // ── AI / ML ──────────────────────────────────────────────────────────────
  {
    slug: "occlusion-aware-pedestrian-detection",
    category: "ai-ml",
    alsoIn: [],
    title: "Robust Detection of Occluded Pedestrians",
    hook: "A YOLOv8 detector trained to spot pedestrians partially hidden behind cars or poles, without GAN-level compute cost.",
    description:
      "I fine-tuned YOLOv8s on the Caltech Pedestrian dataset, masking 20-60% of each pedestrian's bounding box with either solid black rectangles or random noise during training, then tested the resulting models against clean data, synthetically occluded test sets, and 58 real photos we shot driving through University City near UCSD. The project became a full ECE 176 paper (Winter 2026) comparing a baseline, black-mask, and noise-mask model head-to-head on precision, recall, and mAP.",
    stack: ["PyTorch", "Ultralytics YOLOv8s", "OpenCV", "Caltech Pedestrian Dataset"],
    metric: "+4.4pt precision / +2.0pt mAP@0.5:0.95 vs. baseline (real-world test)",
    period: "Feb-March 2026",
    links: [
      { label: "GitHub", href: "https://github.com/YashTandon05/occluded-pedestrian-detection", kind: "repo" },
      { label: "Project Report", href: "https://drive.google.com/file/d/1pEzNfxpmhpgFq_yjRnhd0uykwYXPmTyj/view?usp=sharing", kind: "paper" },
      { label: "Presentation Slides", href: "https://docs.google.com/presentation/d/1i8_v29QiyqyS9S9pJnnwV3AgW_89d0zgCLGi7COmZVo/edit?usp=sharing", kind: "writeup" },
      { label: "Presentation Video", href: "https://youtu.be/EosV5Tgpn6I", kind: "demo" },
    ],
    media: [
      {
         src: "/projects/occlusion-aware-pedestrian-detection/augmented-detection.png",
         alt: "Side-by-side detections from the black-mask and noise-mask augmented models on a real street scene.",
         caption: "Both occlusion-augmented models pick out a distant, blended-in pedestrian that the unaugmented baseline missed entirely.",
       },
       {
         src: "/projects/occlusion-aware-pedestrian-detection/results-on-real.png",
         alt: "Bar chart comparing baseline, black-mask, and noise-mask model precision, recall, mAP50, and mAP50-95 on the real UCSD dataset.",
         caption: "On real-world UCSD footage, the occlusion-augmented models edge out the baseline across precision, recall, and mAP.",
       },
       {
         src: "/projects/occlusion-aware-pedestrian-detection/hallucinations.png",
         alt: "The noise-mask model drawing a low-confidence pedestrian box around a street sign.",
         caption: "A failure case: the noise-mask model hallucinates a pedestrian out of a street sign, at just 0.05 confidence.",
       },
       {
         src: "/projects/occlusion-aware-pedestrian-detection/overfitting-on-synthetic.png",
         alt: "Line charts of precision, recall, mAP50, and mAP50-95 across increasing occlusion levels for the black-mask and noise-mask synthetic datasets.",
         caption: "On synthetic occlusion test sets, each augmented model dominates on the occlusion type it was trained on, revealing it overfit to that specific mask style rather than learning general occlusion robustness.",
       },
     ],
    problem: "Pedestrian detectors trained on mostly unobstructed people degrade badly the moment someone is partially blocked by a car, pole, or other pedestrian. That's exactly the situation that matters most for an autonomous vehicle trying to react in time. Existing fixes like GAN-based reconstruction can close that gap, but they're too heavy to run in a real-time driving stack.",
    approach: "My piece of the two-person team was the augmentation pipeline, training, and evaluation: I wrote the script that masks 20%, 40%, or 60% of a pedestrian's bounding box with solid black or uniform random noise on one randomly chosen side, for about half of the training images, while keeping the ground-truth box at its full extent so the model still had to learn to predict the whole person from partial cues. I then fine-tuned three separate YOLOv8s models (baseline, black-mask, noise-mask) for 30 epochs each and ran all three against four different test conditions.",
    result: "On our own real-world test photos, the black-mask model beat the baseline by 4.4 points of precision (0.707 vs. 0.663) and 2.0 points of mAP@0.5:0.95 (0.249 vs. 0.229), with mAP@0.5 staying roughly flat. The synthetic occlusion test sets told a more complicated story: scores there jumped 10-40%, but digging in showed the models were overfitting to the shape of the mask itself rather than genuinely getting better at reading partial pedestrians, a limitation we called out directly instead of reporting the inflated number.",
  },
  {
    slug: "freeze-frame-xg-model",
    category: "ai-ml",
    alsoIn: ["swe"],
    title: "Beyond Distance and Angle: xG Shot Quality Model",
    hook: "An xG model that reads goalkeeper and defender positions straight from tracking data, not just shot distance and angle.",
    description:
      "Most public xG models score a shot using only distance and angle, since real player-tracking data was never open. I built an XGBoost pipeline that engineers goalkeeper, defender, and key-pass features from StatsBomb's freeze-frame data and calibrates it so predicted probabilities actually mean what they say, detailed in our paper 'Beyond Distance and Angle.' A live demo lets you place players on a pitch and see the model predict xG in real time.",
    stack: ["Python", "XGBoost", "scikit-learn", "pandas", "FastAPI", "StatsBomb Open Data"],
    metric: "0.812 AUC-ROC, 0.258 log loss (tuned XGBoost)",
    period: "May-June 2026",
    links: [
      { label: "GitHub Repo", href: "https://github.com/YashTandon05/novel-xg-modelling", kind: "repo" },
      { label: "Project Report", href: "https://drive.google.com/file/d/19wksJHcRbQSD3isx7wp6KtT9wiekLJhD/view?usp=sharing", kind: "paper"},
      { label: "Live Demo", href: "https://yashtandon05.github.io/novel-xg-modelling", kind: "demo" },
    ],
    media: [
      {
        // Trailing slash on purpose: GitHub Pages 301s the bare path, and an
        // avoidable redirect inside an iframe is an avoidable second of blank.
        src: "https://yashtandon05.github.io/novel-xg-modelling/",
        embed: true,
        alt: "Place a shot, a goalkeeper, and defenders anywhere on the attacking half and the model scores the chance live.",
        caption:
          "The same feature pipeline the model was trained on, served straight from the paper's XGBoost model.",
      },
      {
         src: "/projects/freeze-frame-xg-model/live-demo.png",
         alt: "An image of the interactive demo - a shot taken from the edge of the box with defenders pressuring results in an xG of 13.4%.",
         caption: "The interactive demo: drag shot takers, the keeper, and defenders onto the pitch to get a live xG estimate, 13.4% for this crowded shot.",
       },
       {
         src: "/projects/freeze-frame-xg-model/heatmap.png",
         alt: "Shot-location heatmaps for all shots versus goals only, alongside a chart of goal rate falling off sharply with distance.",
         caption: "Shots cluster tightly around the box, and goals cluster even tighter: goal rate drops from over 50% inside 5m to under 5% past 30m.",
       },
       {
         src: "/projects/freeze-frame-xg-model/model-ablation.png",
         alt: "Table comparing AUC, log loss, and Brier score across XGBoost, random forest, logistic regression, decision tree, and naive Bayes models.",
         caption: "Tuned XGBoost came out on top, though it barely edged out a vanilla XGBoost and random forest. Model choice mattered far less than the features.",
       },
       {
         src: "/projects/freeze-frame-xg-model/feature-ablation.png",
         alt: "Table showing AUC, log loss, and Brier score improving as feature tiers (geometry, then defender, goalkeeper, and freeze-frame data) are added.",
         caption: "Most of the predictive power comes from shot geometry alone; adding defender and goalkeeper positioning tiers on top delivers the rest of the gains, with diminishing returns each tier in.",
       },
    ],
    problem: "xG models have stayed stuck on geometry because tracking data showing defender and keeper positions was locked behind commercial licenses. Worse, most papers report only AUC-ROC, a ranking metric that ignores whether a 0.30-xG shot actually scores 30% of the time, miscalibration that quietly distorts season-long xG totals.",
    approach: "I engineered ~45 features from StatsBomb's freeze frames, including available_goal_angle, which models the keeper and each defender as angular arcs blocking the goal mouth and unions overlapping arcs so double-coverage isn't double-counted. I structured these into 5 cumulative tiers for a clean ablation study, tuned five model families culminating in XGBoost, and applied isotonic calibration since tree ensembles push raw probabilities toward the extremes. I also shipped a live FastAPI + GitHub Pages demo that reuses the exact training feature pipeline, so there's no train/serve skew.",
    result: "Tuned XGBoost hit 0.812 AUC-ROC and 0.258 log loss on a 17k-shot held-out test set. The three freeze-frame feature tiers accounted for 42.5% of total predictive gain over a geometry-only baseline, and goalkeeper-to-shooter distance ranked as the single most important feature, above shot angle.",
  },
  {
    slug: "simcivics",
    category: "ai-ml",
    alsoIn: ["swe"],
    title: "SimCivics",
    hook: "An LLM policy compiler kept on a tight leash: bounded outputs, then fairness-tested to catch whose ideas it scores unfairly.",
    description:
      "SimCivics lets anyone submit a U.S. policy idea in plain English and watch a deterministic society model run it forward against real state demographics. I built the math engine those policies run on and the GPT-4.1-mini compiler that turns free text into inputs for it, then fairness-tested the compiler until I trusted the numbers it was producing. Built in a day for the Claude Builders Club @ UC San Diego hackathon (Track II: Governance & Collaboration).",
    stack: ["TypeScript", "Python", "GPT-4.1-mini", "GPT-4.1-nano", "NumPy", "Jupyter", "ACS/BLS/BEA/CDC PLACES/FBI-CDE"],
    metric: "Phrasing bias cut from 21.84% to 5.57%",
    period: "May 2026",
    links: [
      { label: "GitHub", href: "https://github.com/ShivUCSD1104/SimCivics", kind: "repo" },
      { label: "Devpost", href: "https://devpost.com/software/sim-civics", kind: "demo" },
      { label: "Demo video", href: "https://www.youtube.com/watch?v=-piU1wr-fMg", kind: "demo" },
      { label: 'Writeup', href: "https://docs.google.com/document/d/1HVSEB_fA3_IHBzItrfntV4UoZq8y6xCQaLDoHPUTKV4/edit?usp=sharing", kind: "writeup"}
    ],
    problem: "The easy version of this project asks an LLM 'what happens if we pass this policy' and prints its guess as fact. That launders a hallucination through a confident paragraph, and it's worse than no simulation at all for something meant to teach people how policy actually works. I needed the LLM to interpret intent without being trusted to know outcomes, and I needed to prove that trust boundary actually held instead of just asserting it.",
    approach: "I built an 8-variable environment model (economy, inequality, crime, freedom, etc.) with a hand-tuned cross-variable coupling matrix, per-turn baseline drift, and Box-Muller Gaussian noise, so a state's trajectory is driven by deterministic dynamics rather than model output. The GPT-4.1-mini compiler's only job is to read a policy and emit a shock schedule split across three temporal offsets (immediate, short-term, medium-term). Every delta is hard-clamped to [-0.4, 0.4] at generation time and clamped again when shocks combine in the turn queue, so no single policy or stacked combination can blow out the state space. I wrote a separate GPT-4.1-nano guardrail for comment moderation with a fail-open design: if the moderation call errors, content is allowed through rather than silently blocked. I chose that deliberately over fail-closed, since the whole point of the platform is open debate.",
    result: "I ran a fairness notebook that submitted identical policies in formal versus layperson phrasing and found the compiler was scoring diction, not substance: a 21.84% divergence in resulting deltas. Adding one explicit instruction (weigh content over framing) cut that to 5.57%. I also ran a partisan-skew test and published the finding instead of hiding it: liberal-coded policies scored a mean 3.96 against 3.20 for Republican-coded ones, which is now a documented, unresolved limitation rather than a silent thumb on the scale.",
  },
  {
    slug: "socalguessr-cnn-classifier",
    category: "ai-ml",
    alsoIn: [],
    title: "SoCalGuessr: Street View City Classifier",
    hook: "A CNN that beats humans by a wide margin at guessing which Southern California city a street view photo came from.",
    description:
      "Built for a class-wide image classification competition, this model looks at a single street-view style photo and predicts which of six Southern California cities it was taken in: Anaheim, Bakersfield, LA, Riverside, San Diego, or San Luis Obispo. I fine-tuned an EfficientNet-B2 backbone pretrained on ImageNet-1k on 9,181 labeled images collected for the competition, split 80/20 with class balance preserved. The final model placed 1st out of 200 students on the held-out leaderboard.",
    stack: ["PyTorch", "torchvision", "EfficientNet-B2 (ImageNet-1k pretrained)", "AdamW", "Mixed Precision (AMP)", "scikit-learn"],
    metric: "94.95% accuracy, 1st of 200 in class competition",
    period: "March 2026",
    links: [
      { label: 'Writeup', href: "https://docs.google.com/document/d/1wqnShgV0tpkQziR6Gt7DE5Knzy6orog8SUgs38VW-4Q/edit?usp=sharing", kind: "writeup"},

    ],
    problem: "These six cities share a lot of visual DNA: palm trees, highways, strip malls, and near-identical stucco architecture, so telling them apart from one street-level photo is genuinely hard, even for someone who has lived in California. I tested this on myself with a 50-question version of the quiz and only scored 17/50 (34%), barely better than the 16.7% you'd get guessing randomly across six classes. That gap between how hard the task is for a person and how solvable it should be for a model trained on thousands of examples is what made this worth building.",
    approach: "The images are wide panorama crops (224x448, a 2:1 aspect ratio), so standard square-crop augmentation would either squash the geometry or cut out the horizon line, which carries a lot of the signal, like SLO's mountains versus LA's flatter sprawl. I wrote a custom RandomResizedCrop with a matched aspect ratio range to preserve that geometry, then trained EfficientNet-B2 in two phases: two epochs with the backbone frozen to adapt the classifier head, then a full unfreeze with discriminative learning rates (1e-4 for the backbone, 5e-4 for the head) and cosine annealing down to 1e-7. I used label smoothing, dropout, mixed-precision training with gradient clipping for stability, and added 5-way test-time augmentation at inference, horizontal flip, multiple crop scales, and color jitter, averaging logits across all five passes.",
    result: "The model hit 94.50% validation accuracy around epoch 22 of a 25-epoch run, then scored 0.94947 on the final competition leaderboard, good for 1st place out of 200 students, edging out 2nd place's 0.94250. That's roughly 60 percentage points above my own human baseline on the exact same task.",
  },
  {
    slug: "var-referee-bias-champions-league",
    category: "ai-ml",
    alsoIn: ["swe"],
    title: "VAR and Referee Bias in the Champions League",
    hook: "Scraped 25 years of Champions League match data to test whether VAR actually closed the home-team referee bias gap.",
    description:
      "For a five-person data science course project, we tested whether the introduction of VAR in 2018 actually reduced home-field bias in UEFA Champions League refereeing. I built the scraping pipeline in Python and R that pulled match reports, advanced team stats, and UEFA club-coefficient data from FBRef and a separate UEFA archive, standardized team names across four incompatible datasets, and merged them into a single pre- and post-VAR comparison spanning roughly 7,000 matches from 1999 to 2025.",
    stack: ["Python", "R", "pandas", "BeautifulSoup", "SciPy", "statsmodels", "seaborn"],
    metric: "Foul gap: -0.70 to -0.05 post-VAR (p=0.039); yellow-card bias persists at p<0.0001",
    period: "Spring 2025",
    links: [
      { label: "Project Write-up", href: "/projects/var-referee-bias-champions-league/writeup.html", kind: "writeup"},
      { label: "Project video", href: "https://drive.google.com/file/d/1umrtsmK0bOTrS8U-wN5zY05SBrQ2GOBn/view?usp=sharing", kind: "demo" },
    ],
    media: [
      {
        src: "/projects/var-referee-bias-champions-league/writeup.html",
        embed: true,
        alt: "The full project write-up, covering the scraping pipeline, the pre/post-VAR comparison, and the permutation and regression results.",
        caption: "The full write-up. Open it inline to read the methodology and results in detail.",
      },
    ],
    problem: "Home-field advantage in football officiating is well documented, but once UEFA started using VAR in 2018 it wasn't clear whether video review actually closed that gap or just made the debate quieter. Existing studies mostly predate VAR or cover other leagues, and none of them checked whether the bias that remained was real referee favoritism or just a side effect of home teams usually being the stronger side on paper.",
    approach: "A raw comparison of home versus away cards doesn't separate referee bias from team quality, since stronger teams simply commit fewer fouls regardless of venue. I identified goal differential and UEFA club-coefficient difference as the confounders that mattered, then ran permutation tests holding both constant to isolate the referee-driven signal, and fit an OLS regression on yellow cards using home status, goal differential, coefficient gap, and season. I also used the pandemic's fan-less 'ghost games' as a natural experiment to check whether crowd presence, not VAR, was doing the real work.",
    result: "Fouls and red cards converged between home and away teams after VAR arrived, with the home-away foul gap narrowing from -0.70 to -0.05 (p=0.039). Yellow cards told a different story: even after controlling for team strength, home teams still drew significantly fewer of them (permutation test differences of -0.36 and -0.48, both p<0.0001), and home status alone predicted a 0.15-card drop in the regression (p<0.0001). The ghost-games comparison found no significant shift, though with only 14 fan-less matches in the data that result is suggestive at best.",
  },
  {
    slug: "food-bank-site-optimization",
    category: "ai-ml",
    alsoIn: [],
    title: "Optimizing Food Bank Locations using ML",
    hook: "An optimizer that recommends new distribution sites using real driving distances and need-weighted census data, not just an empty gap on a map.",
    description:
      "Working with Feeding San Diego and the Jacobs and Cushman San Diego Food Bank, our team built a system that scores about 825 existing and candidate agency sites against real driving distance costs (computed with OSMnx and NetworkX, not straight lines) and need-weighted socioeconomic data pulled from Census ACS tracts. I implemented and benchmarked four competing facility-location algorithms on that data, and the team later wrapped the strongest results into an interactive ArcGIS tool so FSD and SDFB staff could re-weight poverty, income, and unemployment themselves. We presented it as a poster through UC San Diego's Data Science Alliance and the HDSI Undergraduate Scholarship Program.",
    stack: ["PuLP (CBC MILP solver)", "NetworkX", "OSMnx", "scikit-learn-extra (KMedoids)", "scikit-learn", "pandas", "Census ACS API"],
    metric: "4 optimization algorithms benchmarked across 825 real agency sites",
    period: "Sep 2024-May 2025",
    links: [
      { label: "Interactive site-weighting demo", href: "https://peter-shamoun.github.io/ArcGIS-web-vis/", kind: "demo" },
      { label: "Poster for HDSI Research Scholarship Showcase", href: "https://drive.google.com/file/d/10mnlXbCi-TEkwb2v-4z9gd-uIS2o1Kaz/view?usp=sharing", kind: "writeup"},
    ],
    media: [
      {
        src: "https://peter-shamoun.github.io/ArcGIS-web-vis/",
        embed: true,
        alt: "The interactive site-weighting tool. Sliders control the number of facilities and the importance of poverty, income, and unemployment, and a San Diego County map updates to show which agency sites get chosen for each combination.",
        caption:
          "The interactive tool built from these results. Drag the facility count and re-weight poverty, income, and unemployment to see how the recommended sites shift.",
      },
      {
        src: "/projects/food-bank-site-optimization/poster.png",
        alt: "The project poster, covering the problem statement, the p-median formulation, the four-algorithm comparison, and two results figures: a San Diego County map of optimized facility locations and a side-by-side comparison of two different weighting scenarios.",
        caption: "Our HDSI Data Science Alliance poster, presenting the p-median model and the resulting facility recommendations for Feeding San Diego and SDFB.",
      },
    ],
    problem: "FSD and SDFB's existing network of about 825 sites grew organically over decades. Nobody had ever systematically checked whether it actually lines up with where need is highest. I helped run stakeholder interviews with FSD and SDFB staff and kept hearing the same real decision factors: proximity to existing agencies, transit access, income, family and youth population. But none of that had been turned into a rigorous, data-driven siting process, and straight-line distance badly misrepresents how far someone without a car actually has to travel.",
    approach: "I built and stress-tested four competing facility-location algorithms: an exact p-median MILP solved with PuLP and CBC, K-medoids on a precomputed distance matrix, MST partitioning, and greedy marginal-gain selection. All four ran against the same real driving-distance cost matrix, built by snapping every agency to San Diego's OSMnx street graph and computing shortest paths in NetworkX. The need weights (poverty, unemployment, income, rent burden, youth population, SNAP participation) came straight out of the interviews I helped conduct, got normalized with MinMaxScaler, and were swept across a full grid of weight multipliers and facility counts (p=10 and p=20) so we could see how recommendations shifted as priorities changed. Before trusting the full 825-node runs, I validated the whole approach on a synthetic 10-node sample: artificially inflate one node's need and confirm every model actually shifts a facility toward it.",
    result: "The p-median MILP I built turned out to be the most reliable model, and its picks lined up closely with the independently computed MST-clustering results. That agreement is what gave the team real confidence in the recommendations instead of a single black-box answer. The analysis surfaced concrete coverage gaps, including underserved tracts along the northern coast, and pointed to Carlsbad and eastern San Diego County as priority areas for new sites. We handed those findings to FSD and SDFB along with the interactive tool so they could explore the poverty, income, and unemployment trade-offs on their own.",
  },

  // ── Robotics ─────────────────────────────────────────────────────────────
  {
    slug: "robocup",
    category: "robotics",
    title: "RoboCup",
    hook: "TODO: one sentence on your role and what the robots had to do.",
    description:
      "TODO: 2–3 sentences on the stack you owned and how the team placed.",
    stack: ["C++", "ROS", "TODO: sim", "TODO: hardware"],
    metric: "TODO: placement or key result",
    period: "TODO — 20XX",
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
  {
    slug: "donkeycar-xai-toolkit",
    category: "robotics",
    alsoIn: ["ai-ml"],
    title: "DonkeyCar Explainability & Uncertainty Toolkit",
    hook: "A live confidence/novelty dashboard for a self-driving RC car: good enough that the framework's own maintainers asked me to upstream it.",
    description:
      "Stock DonkeyCar's autopilot outputs a steering number and nothing else, so I built a toolkit that exposes what the CNN is actually thinking: live confidence, out-of-distribution novelty, and prediction-stability signals on the dashboard, plus an offline Grad-CAM/saliency viewer for diagnosing exactly where and why the model failed. It's my slice of a 4-person, 5-week robotics course project built on top of the open-source DonkeyCar framework.",
    stack: ["Python", "TensorFlow / Keras", "DonkeyCar (Raspberry Pi)", "OpenCV", "MobileNetV2", "Grad-CAM / Integrated Gradients", "Flask"],
    metric: "2 upstream PRs to a 3.5k★ OSS framework (1 merged)",
    period: "July-Aug 2026",
    links: [
      { label: "Class project repo", href: "https://github.com/UCSD-Silberman-Classes-and-Projects/UCSD-DSC190-SUMMER_I-Final_Project-Team_5-6", kind: "repo" },
      { label: "Final Presentation", href: "https://docs.google.com/presentation/d/1pt5OJfPrH0suxoJ4y6KRCdK32uakrAbemNvmKHkS6AM/edit", kind: "writeup"},
      { label: "Merged PR: OAK-D FOV/crash fix", href: "https://github.com/autorope/donkeycar/commit/38dd2b4fa82a504ee1a0e0d4409d81183051a125", kind: "repo" },
      { label: "Open PR: XAI Toolkit Expansion", href: "https://github.com/autorope/donkeycar/pull/1247", kind: "repo" },
    ],
    // Slideshow, shown under the metric. Drop the files in
    // `public/projects/donkeycar-xai-toolkit/` and uncomment — the section only
    // renders when `media` is present, so this stays invisible until then.
    // Stills and clips can be mixed in any order; see `ProjectMedia` above for
    // why a screen recording should be an .mp4 rather than a .gif.
    media: [
      {
         src: "/projects/donkeycar-xai-toolkit/DSC190-Robot.png",
         alt: "A picture of our robot.",
         caption: "A Raspberry-Pi powered car that runs CNN models to autonomously drive.",
       },
       {
         src: "/projects/donkeycar-xai-toolkit/web-dashboard.png",
         alt: "Live dashboard with confidence, novelty, and stability gauges beside the camera feed.",
         caption: "All three uncertainty signals, streamed live on the car's dashboard.",
       },
       {
         src: "/projects/donkeycar-xai-toolkit/novelty.mp4",
         poster: "/projects/donkeycar-xai-toolkit/novelty-poster.png",
         alt: "Confidence gauge dropping as the car sees unfamiliar objects in front of it.",
         caption: "The throttle scaler reacting as novelty crosses threshold, eventually coming to a stop.",
       },
       {
         src: "/projects/donkeycar-xai-toolkit/grad-cam-viewer.png",
         alt: "Grad-CAM overlay highlighting the novel features of the image.",
         caption: "Offline viewer: where the CNN found the novelty (the person). Dropdown available to view uncertainty and saliency maps",
       },
     ],
    problem: "Stock DonkeyCar's CNN autopilot gives you one steering number and nothing else. There's no way to tell whether the model is actually confident, or which part of the frame it's reacting to. On hardware that can hit a wall or a person, that's the wrong way to trust a black box, so my slice of the team's project was building the piece that answers 'how sure are you, and why.'",
    approach: "The toolkit layers three live uncertainty signals on the existing steering model: Monte Carlo Dropout confidence, Mahalanobis-distance novelty detection against a frozen ImageNet encoder, and test-time-augmentation stability. Each is calibrated into a 0-100% score that feeds an optional throttle scaler slowing or stopping the car when a signal crosses threshold, steering untouched. An offline viewer replays a recorded drive with four attribution overlays (Grad-CAM, Grad-CAM++, Integrated Gradients, saliency) for post-hoc debugging.",
    result: "The novelty detector's first version measured distance in the driving model's own features and failed instructively: a model trained only on steering discards texture and color, so grass and open track collapsed to nearly the same feature vector, with grass scoring more 'familiar' than real track in testing. Swapping to a frozen ImageNet encoder fixed it. A second calibration bug, augmented lighting getting flagged as 'novel,' showed up as 79% of augmented frames crossing threshold versus 38% for clean ones before the fix. That work caught the actual DonkeyCar maintainers' attention: I'd already shipped a merged PR fixing an OAK-D camera field-of-view bug, and they asked me to open a second PR upstreaming the full toolkit, now pending review.",
  },

  // ── Software Engineering ─────────────────────────────────────────────────
  {
    slug: "tritonwatch",
    category: "swe",
    alsoIn: [],
    title: "TritonWatch",
    hook: "Watches UCSD's enrollment system for real seat openings, after reverse-engineering its JSON API instead of trusting misleading seat counts.",
    description:
      "TritonWatch runs entirely on a student's own laptop: it signs into UCSD's Triton Student System through the student's real login session (Duo included), then polls the specific sections they're waiting on for seat count, waitlist size, and enrollment status. It surfaces a change as a push notification within minutes and draws the ongoing watch as a live chart-recorder trace, so a quiet screen still reads as 'watching' rather than 'frozen.' There's no server and no shared account. Every install talks to TSS only as the student running it.",
    stack: ["Python", "Playwright", "FastAPI", "TSS OData v4 API", "uvicorn", "httpx"],
    metric: "~100 UCSD students running it independently",
    period: "July-Aug 2026",
    links: [{ label: "GitHub", href: "https://github.com/YashTandon05/triton-watch", kind: "repo" }],
    media: [
      {
         src: "/projects/tritonwatch/dashboard.png",
         alt: "The main dashboard of the tritonwatch tool.",
         caption: "The main dashboard to see a graph view of seat changes, logs, and manage the watch.",
       },
       {
         src: "/projects/tritonwatch/classes_list.png",
         alt: "Searching for COGS courses and browsing the results list in TritonWatch.",
         caption: "Search for a department to pull up every course offered that quarter, with unit counts at a glance.",
       },
       {
         src: "/projects/tritonwatch/section-list.png",
         alt: "Selecting a specific course section to watch, showing enrollment counts and waitlist status.",
         caption: "Drill into a course to see each section's meeting time, instructor, and live seat count, then tick the ones to watch.",
       },
       {
         src: "/projects/tritonwatch/alerts.png",
         alt: "QR code and private channel setup for receiving push notifications via ntfy.",
         caption: "Scan a QR code to link the ntfy app to a private alert channel, so a seat opening pushes straight to your phone.",
       },
     ],
    problem: "TSS makes you babysit a refresh button, and its own display actively misleads you while you do: a section can show every seat 'available' while its status is still Waitlist Only, meaning nobody can actually enroll in it. Students trying to get into a full or waitlisted class either miss the real opening or get trained to ignore false alarms.",
    approach: "I started by scraping the TSS page with Playwright, then reverse-engineered the OData v4 JSON API underneath its Fiori frontend and rebuilt polling on top of that instead. One JSON GET per course replaces the regex section parser, the stale-page guards, and the SAP modal handling the scraper needed. Playwright's browser context still stays open, but only to hold the authenticated session cookie, which its request client shares directly with the JSON calls. Two edge cases mattered most: an unauthenticated request returns HTTP 200 with an HTML login page instead of a 401, so the health check has to be 'did I get JSON back,' not the status code; and each API row is a single meeting (lecture, discussion, or lab), not a section, so seats have to be grouped by section ID or they get double-counted. Notifications key off enrollment-status transitions like Waitlist Only → Scheduled rather than raw seat counts, since TSS reports full seats on sections nobody can take.",
    result: "Poll cost dropped from rendering a full single-page app (~5 seconds) to a single JSON request per course (~50ms), a 100x reduction in latency. The bigger result is adoption: with no promotion beyond friends telling friends, it's now running independently on close to 100 UCSD students' own machines, each signed in under their own account with no shared backend to strain.",
  },
  {
    slug: "reprolint",
    category: "swe",
    alsoIn: ["ai-ml"],
    title: "reprolint",
    hook: "An AST-based auditor that scores ML repos for reproducibility against peer-reviewed checklists and can fail a CI build over it.",
    description:
      "reprolint walks a Python codebase's AST to check for six concrete reproducibility failure modes: missing random seeds, loose or unpinned dependencies, hardcoded absolute paths, GPU non-determinism, untracked datasets, and missing environment capture. Then it rolls the results into a weighted 0-100 score. It runs against a local directory or any public GitHub URL, and ships as a pip-installable CLI with a matching GitHub Actions workflow that can fail a build below a configurable threshold. Every check cites the specific paper or checklist it's grounded in, from the AAAI-25 reproducibility checklist to Sculley et al.'s work on hidden technical debt in ML systems.",
    stack: ["Python", "ast (stdlib)", "Typer", "Rich", "GitPython", "packaging", "uv", "GitHub Actions"],
    metric: "Published to PyPI + GitHub Actions CI gate",
    period: "June 2026",
    links: [
      { label: "GitHub", href: "https://github.com/YashTandon05/reprolint", kind: "repo" },
      { label: "PyPI", href: "https://pypi.org/project/reprolint/", kind: "writeup" },
    ],
    media: [
      {
         src: "/projects/reprolint/reprolint_check.png",
         alt: "Terminal output of reprolint scanning a GitHub repo, showing a per-check score table, a category breakdown, and a list of specific findings with suggested fixes.",
         caption: "Running reprolint against one of my own ML repos: it caught a missing random seed and five unpinned dependencies, and scored the repo 55/100.",
       },
    ],
    problem: "ML repos routinely fail to reproduce for boring, avoidable reasons: no seed set, a dependency that silently drifted to a new major version, GPU kernels running non-deterministically, a dataset nobody versioned. People usually find out the hard way, after cloning a repo and getting different numbers than the paper claims. I wanted something that catches these gaps automatically, before a repo ever gets shared or graded.",
    approach: "Instead of grepping for keywords, each check parses the file into a real AST and walks it. The seed and determinism checks recognize an actual call chain like torch.manual_seed(...) regardless of aliasing, and the hardcoded-path check flags string literals that look like absolute filesystem paths while excluding system roots like /usr or /etc to cut noise. Findings roll up into four weighted categories, and the scorer renormalizes weights when a category has no applicable checks, so a repo with no deep-learning framework isn't dinged for skipping a GPU-determinism check it doesn't need. I built the six checks incrementally over about ten days, then wired the aggregate score into a GitHub Actions workflow (--min-score N --fail) and published the package to PyPI with a trusted-publishing release action tied to git tags.",
    result: "It works as advertised on real repos, including its own. Pointed at its own source, reprolint currently scores 68/100, clean on dependency pinning and data tracking. It even flags its own path-checker for a hardcoded path: the literal string 'c:\\users' that the checker uses internally to define what counts as user-specific gets caught by the same string-pattern heuristic it's checking for elsewhere. It's a fair catch, and a good reminder that pattern-matching can't distinguish code from data, which is exactly the kind of edge case I'd tighten next.",
  },
  {
    slug: "doplan-long-horizon-driving-instructions",
    category: "swe",
    alsoIn: ["ai-ml", "robotics"],
    title: "doPlan: Long-Horizon Driving Instructions",
    hook: "Built the data pipeline behind a driving-instruction dataset that captures what a passenger wants over a whole trip, not just the next turn.",
    description:
      "doPlan is a dataset built on nuPlan that pairs synced 9-camera driving footage and a heading-aligned street map with free-form instructions, collected using a 'taxi test': annotators write whatever they'd actually tell a human driver to trigger the behavior they see. Unlike prior datasets that use short fixed clips, doPlan samples variable-length segments from continuous nuPlan trajectories so instructions can persist across evolving traffic contexts. The paper documenting the methodology is being finalized for submission to ICRA.",
    stack: ["Python", "nuPlan devkit", "OpenCV", "Tkinter", "GeoPandas", "OSMnx", "Pandas", "Plotly", "Google Drive API", "GitHub Actions", "GitHub Pages"],
    metric: "1,108 annotations across 660 clips (117.4 hrs)",
    period: "Jan 2026–",
    links: [
      { label: "GitHub", href: "https://github.com/25marcusb/doPlan", kind: "repo" },
      { label: "Live dashboard", href: "https://25marcusb.github.io/doPlan/dashboard.html", kind: "demo" },
    ],
    problem: "Existing instruction datasets like Talk2Car and doScenes use short, fixed-duration clips and describe what's visible in a scene rather than what a passenger actually wants over time, so there was no way to study instructions that persist and evolve across a driving sequence. Separately, the annotation effort itself had 15 volunteer labelers exporting CSVs by hand with no reliable way to see how the dataset was actually growing without someone manually collecting and merging files.",
    approach: "I worked on the nuPlan video generation pipeline, pulling synced camera and GPS/trajectory data through nuPlan's NuPlanScenario and CameraChannel APIs and building the heading-aligned OSMnx/GeoPandas street map that keeps the ego vehicle centered and pointing up, plus the uniform-random segment sampling logic that picks variable start times and durations instead of hand-curated or fixed-length clips, so the dataset doesn't overrepresent rare or scripted events. On my own, I then built the automated data pipeline end to end: a GitHub Actions workflow on a 6-hour cron pulls every annotator's CSV out of a shared Drive folder through a read-only service account, retries with exponential backoff on Google's transient errors, and de-duplicates annotators who accidentally re-exported the same filename twice so later uploads don't silently overwrite earlier submissions. It normalizes each annotator's inconsistent CSV schema, recomputes every table and figure from the paper's dataset-analysis section live, and auto-commits the rendered dashboard to GitHub Pages.",
    result: "The pipeline currently supports 15 annotators and has produced 1,108 instructions across 660 unique nuPlan clips, 117.4 hours of driving time, all trackable live on a public dashboard instead of through manual spreadsheet merging. The paper is being finalized for ICRA submission, with dataset experiments planned as a follow-on phase once annotation scales further.",
  },
  {
    slug: "astera-quant",
    category: "swe",
    alsoIn: [],
    title: "Kalshi Order Book Pipeline & Backtesting Engine",
    hook: "A fault-tolerant AWS pipeline streaming live prediction market order book data into a vectorized backtesting engine.",
    description:
      "At Astera Holdings, an early stage quant firm building a market making strategy on Kalshi, I designed and prototyped the data infrastructure from scratch. The system connects to Kalshi's WebSocket API, captures Level 1 and Level 2 order book updates across 10 markets, and streams them through an AWS pipeline into long term cloud storage that fed a Python backtesting engine.",
    stack: ["Python", "AWS EC2", "AWS S3", "boto3", "WebSockets", "Parquet", "pandas", "NumPy", "systemd", "cron"],
    metric: "99.9% uptime across 10 live markets, compressed to <50MB of order book data per week",
    period: "June-Sept 2026",
    links: [],
    problem: "Astera was early enough in building its Kalshi market making strategy that there was no infrastructure to actually observe the markets. Testing any statistical arbitrage idea meant having continuous, granular order book data across many markets at once, and nobody wanted that running off a laptop that could disconnect at any time.",
    approach: "I designed a pipeline where a Python service on a t3.micro EC2 instance held a persistent WebSocket connection to Kalshi, timestamped every Level 1 and Level 2 update across 10 markets, and batched it into compressed files pushed to S3 on a schedule. Reading raw gzipped JSON line by line was too slow for backtesting, so I restructured the stored data into a timestamp-indexed, per-market Parquet layout, which let the backtester load and slice a week of order book history without re-parsing JSON on every run. I also had to debug why the cron-based restart was silently failing before I could trust the uptime numbers. I worked alongside one other engineer on the project.",
    result: "The pipeline ran for about a week with 99.9% uptime across all 10 markets and ingested roughly 50MB of compressed L1 and L2 order book data. That data was enough for the backtesting engine, which modeled fill probability, slippage, and latency in a vectorized way, to actually validate the statistical arbitrage ideas: several strategies showed around 10% returns on a typical day, though with real downside days too, and separate market-by-market analysis pointed at specific event-driven volatility worth exploiting.",
  },
  {
    slug: "car-damage-detection-service",
    category: "swe",
    alsoIn: ["ai-ml"],
    title: "Car Damage Detection & Classification Service",
    hook: "A FastAPI service that chains two PyTorch models but skips the second one whenever the first finds no damage.",
    description:
      "A FastAPI backend that takes a car photo, decides if it's damaged, and if so classifies the damage type, all through one REST endpoint. Both PyTorch models load once at startup and live in app.state for the life of the process, and the route validates and rejects bad uploads before an image ever reaches inference. It runs CPU-only, ships as a Docker image, and was trained on CarDD for damage examples and Stanford Cars for clean ones.",
    stack: ["FastAPI", "Docker", "PyTorch (TorchScript)", "Pydantic", "pytest", "Uvicorn"],
    metric: "~30-40ms CPU-only latency (single forward pass on the no-damage path)",
    period: "Dec 2025",
    links: [{ label: "GitHub", href: "https://github.com/YashTandon05/car-damage-detection-service", kind: "repo" }],
    problem: "A model that scores well offline doesn't help much if the service around it falls over on a corrupted upload, reloads its weights from disk on every request, or needs a GPU box just to respond in reasonable time. I wanted this to behave like something you could actually put behind a real endpoint, not a notebook demo: fail cleanly on bad input, keep latency predictable, and let the model files change without a code deploy.",
    approach: "Models load once in a FastAPI startup event and sit in app.state for the life of the process, so no request pays disk I/O for weights. The route validates content type and a 5MB size cap before an image ever reaches PyTorch, returning a clean 400 or 413 instead of failing deep inside inference. The predictor short-circuits: it only runs the second-stage damage-type classifier when the binary detector clears its threshold, so the common no-damage case costs one forward pass instead of two. Each model ships as a TorchScript artifact next to a JSON metadata file holding its threshold, input size, and label mapping, so a retrained model drops in as a config change, and the whole thing is Dockerized with API-level tests through FastAPI's TestClient.",
    result: "The service holds ~30-40ms CPU-only latency per request, and the short-circuit means the no-damage path, which is most real traffic, is cheaper than that number suggests. It's still a single-container deployment with no batching, model versioning, or monitoring, and I've called those gaps out directly in the README instead of glossing over them.",
  },
  {
    slug: "lexi-learn",
    category: "swe",
    alsoIn: ["ai-ml"],
    title: "Lexi Learn",
    hook: "TODO: one sentence on what it teaches and how the ML fits in.",
    description: "TODO: 2–3 sentences on the stack and what shipped.",
    stack: ["TypeScript", "TODO: model", "TODO: infra"],
    period: "TODO — 20XX",
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
];

/**
 * Newest first.
 *
 * Placeholders sink to the bottom regardless of date — a "slot reserved" card
 * must never take one of the three visible spots while a real project sits
 * hidden behind the expander. Undated entries return 0 against each other,
 * which `Array.sort` (stable since ES2019) resolves as "keep file order".
 */
function byRecency(a: Project, b: Project): number {
  if (Boolean(a.placeholder) !== Boolean(b.placeholder)) {
    return a.placeholder ? 1 : -1;
  }
  if (a.date && b.date) return b.date.localeCompare(a.date);
  if (a.date) return -1;
  if (b.date) return 1;
  return 0;
}

export function projectsByCategory(category: Category): Project[] {
  return projects.filter((p) => p.category === category).sort(byRecency);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug && !p.placeholder);
}

export function categoryMeta(category: Category): CategoryMeta {
  // CATEGORIES covers every Category value, so this is total.
  return CATEGORIES.find((c) => c.id === category)!;
}
