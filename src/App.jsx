import { useState } from "react";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  :root {
    --deep: #0F0D0B; --ink: #1A1714; --fog: #EDE9E3; --ash: #D9D4CE;
    --steel: #6B7280; --text-on-dark: #E8E4DF; --text-muted: #A09C96;
    --rule: rgba(237,233,227,0.12);
  }
  body { background: var(--deep); font-family: 'Libre Baskerville', Georgia, serif; color: var(--text-on-dark); -webkit-font-smoothing: antialiased; }
  body::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; z-index: 0; opacity: 0.6; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .st-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; padding: 20px 48px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--rule); background: rgba(15,13,11,0.88); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
  .st-nav-left { display: flex; align-items: center; gap: 20px; }
  .st-wordmark { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.08em; color: var(--fog); text-decoration: none; }
  .st-wordmark span { color: var(--steel); font-size: 13px; font-family: 'DM Mono', monospace; letter-spacing: 0.15em; margin-left: 10px; vertical-align: middle; }
  .st-back-btn { background: none; border: none; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--steel); cursor: pointer; display: flex; align-items: center; gap: 8px; padding: 0; transition: color 0.2s; }
  .st-back-btn:hover { color: var(--fog); }

  /* PROGRESS */
  .st-progress { height: 2px; background: var(--rule); position: relative; z-index: 1; }
  .st-progress-fill { height: 100%; background: var(--fog); transition: width 0.5s ease; }

  /* MAIN + FOOTER */
  .st-main { flex: 1; position: relative; z-index: 1; padding-top: 63px; }
  .st-footer { border-top: 1px solid var(--rule); padding: 20px 48px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; background: var(--ink); }
  .st-footer-l { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.08em; color: var(--fog); }
  .st-footer-r { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); }

  /* HERO STRIP */
  .st-hero { position: relative; overflow: hidden; padding: 80px 48px 64px; border-bottom: 1px solid var(--rule); }
  .st-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px); background-size: 80px 80px; opacity: 0.5; }
  .st-hero-ghost { position: absolute; top: 50%; right: -1vw; transform: translateY(-50%); font-family: 'Bebas Neue', sans-serif; font-size: clamp(120px, 18vw, 240px); color: rgba(237,233,227,0.03); line-height: 1; pointer-events: none; user-select: none; }
  .st-hero-content { position: relative; z-index: 1; max-width: 800px; }

  /* SECTION TAG */
  .st-tag { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--steel); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
  .st-tag::before { content: ''; display: inline-block; width: 24px; height: 1px; background: var(--steel); }

  /* TYPOGRAPHY */
  .st-display { font-family: 'Bebas Neue', sans-serif; line-height: 0.92; letter-spacing: 0.01em; color: var(--fog); }
  .st-body { font-size: 17px; line-height: 1.85; color: var(--text-muted); }
  .st-italic { font-style: italic; border-left: 2px solid var(--steel); padding-left: 24px; }
  .st-rule { height: 1px; background: var(--rule); margin: 40px 0; }
  .st-content { max-width: 760px; margin: 0 auto; padding: 64px 48px 96px; }

  /* STAT ROW */
  .st-stat-row { display: flex; gap: 48px; padding: 32px 0; border-bottom: 1px solid var(--rule); margin-bottom: 44px; }
  .st-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 44px; color: var(--fog); line-height: 1; display: block; }
  .st-stat-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); display: block; margin-top: 4px; }

  /* TOOL CARDS */
  .st-card-grid { display: flex; flex-direction: column; gap: 2px; }
  .st-tool-card { display: grid; grid-template-columns: 80px 1fr 32px; align-items: center; gap: 32px; padding: 32px 40px; border: 1px solid var(--rule); background: rgba(237,233,227,0.02); cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; }
  .st-tool-card:hover { background: rgba(237,233,227,0.05); border-color: rgba(237,233,227,0.22); }
  .st-tool-card.featured { background: var(--fog); border-color: var(--fog); }
  .st-tool-card.featured:hover { background: var(--ash); }
  .st-tool-num { font-family: 'Bebas Neue', sans-serif; font-size: 56px; line-height: 1; letter-spacing: 0.02em; color: var(--fog); }
  .st-tool-card.featured .st-tool-num { color: var(--deep); }
  .st-tool-type { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); display: block; margin-bottom: 6px; }
  .st-tool-card.featured .st-tool-type { color: #888; }
  .st-tool-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 0.03em; color: var(--fog); display: block; margin-bottom: 8px; }
  .st-tool-card.featured .st-tool-title { color: var(--deep); }
  .st-tool-desc { font-family: 'Libre Baskerville', serif; font-size: 14px; line-height: 1.65; color: var(--text-muted); }
  .st-tool-card.featured .st-tool-desc { color: #555; }
  .st-tool-arrow { font-size: 20px; color: var(--fog); }
  .st-tool-card.featured .st-tool-arrow { color: var(--deep); }

  /* QUIZ OPTIONS */
  .st-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 44px; }
  .st-option { display: flex; align-items: flex-start; gap: 16px; padding: 20px 24px; border: 1px solid var(--rule); background: rgba(237,233,227,0.02); cursor: pointer; text-align: left; width: 100%; transition: all 0.15s; }
  .st-option:hover { border-color: rgba(237,233,227,0.25); background: rgba(237,233,227,0.04); }
  .st-option.selected { border-color: var(--fog); background: var(--fog); }
  .st-option-marker { flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; border: 1px solid rgba(237,233,227,0.25); display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--steel); margin-top: 1px; transition: all 0.15s; }
  .st-option.selected .st-option-marker { border-color: var(--deep); background: var(--deep); color: var(--fog); }
  .st-option-text { font-family: 'Libre Baskerville', serif; font-size: 14px; line-height: 1.7; color: var(--text-muted); }
  .st-option.selected .st-option-text { color: var(--ink); }

  /* SCORE GRID */
  .st-score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-bottom: 48px; }
  .st-score-cell { padding: 20px 18px; background: rgba(237,233,227,0.03); }
  .st-score-cell.dominant { background: var(--fog); }
  .st-score-label { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); display: block; margin-bottom: 8px; }
  .st-score-cell.dominant .st-score-label { color: #888; }
  .st-score-num { font-family: 'Bebas Neue', sans-serif; font-size: 44px; color: var(--fog); line-height: 1; display: block; margin-bottom: 10px; }
  .st-score-cell.dominant .st-score-num { color: var(--ink); }
  .st-score-bar-track { height: 2px; background: var(--rule); margin-bottom: 10px; }
  .st-score-cell.dominant .st-score-bar-track { background: rgba(26,23,20,0.15); }
  .st-score-bar-fill { height: 100%; background: var(--fog); }
  .st-score-cell.dominant .st-score-bar-fill { background: var(--ink); }
  .st-score-name { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); }
  .st-score-cell.dominant .st-score-name { color: var(--ink); }

  /* RESULT BLOCKS */
  .st-result-block { margin-bottom: 36px; padding-bottom: 36px; border-bottom: 1px solid var(--rule); }
  .st-callout { background: var(--fog); padding: 32px 36px; margin-bottom: 32px; }
  .st-callout .st-tag { color: #888; }
  .st-callout .st-tag::before { background: #888; }
  .st-callout p { font-size: 14px; line-height: 1.85; color: var(--ink); }

  /* BLUEPRINT */
  .st-tabs { display: flex; gap: 2px; margin-bottom: 48px; flex-wrap: wrap; }
  .st-tab { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; padding: 12px 20px; border: 1px solid var(--rule); background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
  .st-tab:hover { border-color: rgba(237,233,227,0.25); color: var(--fog); }
  .st-tab.active { background: var(--fog); color: var(--ink); border-color: var(--fog); }
  .st-prompt-box { background: rgba(237,233,227,0.03); border: 1px solid var(--rule); padding: 28px 32px; margin-top: 20px; margin-bottom: 8px; }
  .st-prompt-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); display: block; margin-bottom: 16px; }
  .st-prompt-text { font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.9; color: var(--text-muted); white-space: pre-wrap; }
  .st-highlight { background: var(--fog); padding: 20px 24px; margin-top: 24px; }
  .st-highlight p { font-family: 'Libre Baskerville', serif; font-size: 13px; font-style: italic; line-height: 1.75; color: var(--ink); }

  /* BUILDER */
  .st-progress-bar { background: rgba(237,233,227,0.04); border: 1px solid var(--rule); padding: 20px 28px; margin-bottom: 40px; display: flex; align-items: center; gap: 24px; }
  .st-progress-inner { flex: 1; }
  .st-progress-meta { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .st-progress-meta span { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); }
  .st-progress-meta span:last-child { color: var(--fog); }
  .st-progress-track { height: 2px; background: var(--rule); }
  .st-progress-filled { height: 100%; background: var(--fog); transition: width 0.4s ease; }
  .st-progress-pct { font-family: 'Bebas Neue', sans-serif; font-size: 44px; color: var(--fog); line-height: 1; }
  .st-comp-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-bottom: 44px; }
  .st-comp-tab { padding: 18px 14px; border: 1px solid var(--rule); background: rgba(237,233,227,0.02); cursor: pointer; text-align: left; transition: all 0.15s; }
  .st-comp-tab:hover { background: rgba(237,233,227,0.05); }
  .st-comp-tab.active { background: var(--fog); border-color: var(--fog); }
  .st-comp-num { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: var(--fog); line-height: 1; display: block; margin-bottom: 6px; }
  .st-comp-tab.active .st-comp-num { color: var(--ink); }
  .st-comp-done { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--steel); display: block; margin-bottom: 8px; }
  .st-comp-track { height: 2px; background: var(--rule); }
  .st-comp-tab.active .st-comp-track { background: rgba(26,23,20,0.15); }
  .st-comp-fill { height: 100%; background: var(--fog); transition: width 0.3s; }
  .st-comp-tab.active .st-comp-fill { background: var(--ink); }
  .st-steps { display: flex; flex-direction: column; gap: 8px; margin-bottom: 40px; }
  .st-step { display: flex; align-items: flex-start; gap: 16px; padding: 20px 24px; border: 1px solid var(--rule); background: rgba(237,233,227,0.02); cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; }
  .st-step:hover { background: rgba(237,233,227,0.05); }
  .st-step.done { border-color: var(--fog); background: var(--fog); }
  .st-step-marker { flex-shrink: 0; width: 24px; height: 24px; border: 1px solid rgba(237,233,227,0.2); display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--steel); margin-top: 2px; transition: all 0.2s; }
  .st-step.done .st-step-marker { border-color: var(--ink); background: var(--ink); color: var(--fog); }
  .st-step-text { font-family: 'Libre Baskerville', serif; font-size: 14px; line-height: 1.75; color: var(--text-muted); }
  .st-step.done .st-step-text { color: #666; text-decoration: line-through; }
  .st-complete { background: var(--fog); padding: 32px 36px; margin-bottom: 32px; }
  .st-complete .st-tag { color: #888; }
  .st-complete .st-tag::before { background: #888; }
  .st-complete p { font-size: 14px; line-height: 1.85; color: var(--ink); margin-bottom: 12px; }
  .st-complete p.muted { color: #666; margin-bottom: 20px; }

  /* INPUTS */
  .st-input { border: 1px solid rgba(237,233,227,0.15); padding: 14px 18px; width: 100%; font-family: 'Libre Baskerville', serif; font-size: 14px; color: var(--fog); background: rgba(237,233,227,0.04); outline: none; transition: border-color 0.2s; margin-bottom: 12px; }
  .st-input::placeholder { color: var(--steel); }
  .st-input:focus { border-color: rgba(237,233,227,0.35); }

  /* BUTTONS */
  .st-btn { display: inline-flex; align-items: center; gap: 10px; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; padding: 16px 32px; border: none; cursor: pointer; transition: all 0.2s; }
  .st-btn-primary { background: var(--fog); color: var(--deep); }
  .st-btn-primary:hover { background: var(--ash); }
  .st-btn-primary:disabled { opacity: 0.3; cursor: default; }
  .st-btn-ghost { background: transparent; color: var(--fog); border: 1px solid rgba(237,233,227,0.2); }
  .st-btn-ghost:hover { background: var(--fog); color: var(--deep); border-color: var(--fog); }
  .st-btn-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 40px; }

  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.4s ease forwards; }

  /* RESPONSIVE */
  @media (max-width: 640px) {
    .st-nav { padding: 16px 20px; }
    .st-wordmark span { display: none; }
    .st-hero { padding: 60px 24px 48px; }
    .st-content { padding: 48px 24px 72px; }
    .st-tool-card { grid-template-columns: 56px 1fr 24px; gap: 16px; padding: 24px 20px; }
    .st-comp-tabs { grid-template-columns: repeat(2, 1fr); }
    .st-stat-row { gap: 28px; }
    .st-footer { padding: 16px 20px; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id: 1, section: "Your First Week", question: "It's Day 1 with your new client. What does your onboarding process look like?", options: [{ text: "I have a step-by-step process — welcome message, intake form, scope confirmation, first check-in", scores: { D: 0, U: 0, S: 0 } }, { text: "I send a few questions and figure out the rest as we go", scores: { D: 1, U: 0, S: 0 } }, { text: "I ask what they need and start working immediately", scores: { D: 2, U: 0, S: 0 } }, { text: "I don't have an onboarding — I just wait for instructions", scores: { D: 2, U: 1, S: 0 } }] },
  { id: 2, section: "Your First Week", question: "Before you start working, do you and your client have a written agreement about what you'll deliver, by when, and at what rate?", options: [{ text: "Yes — I always confirm scope in writing before starting", scores: { D: 0, U: 0, S: 0 } }, { text: "We discussed it verbally but nothing is in writing", scores: { D: 1, U: 1, S: 0 } }, { text: "They told me what they needed and I just started", scores: { D: 1, U: 2, S: 0 } }, { text: "No — I didn't want to seem difficult by asking for a contract", scores: { D: 0, U: 2, S: 0 } }] },
  { id: 3, section: "Your First Week", question: "Does your client know exactly what to expect from you each week — your availability, response time, how you'll communicate?", options: [{ text: "Yes — I set this out clearly in my onboarding materials", scores: { D: 0, U: 0, S: 0 } }, { text: "Sort of — we talked about it loosely but nothing is formalised", scores: { D: 1, U: 0, S: 1 } }, { text: "No — they just message me when they need something", scores: { D: 1, U: 0, S: 2 } }, { text: "No — I didn't know I should set this up", scores: { D: 2, U: 0, S: 1 } }] },
  { id: 4, section: "Your Delivery", question: "When you complete a task or deliverable, what do you send the client?", options: [{ text: "The finished work plus a brief note explaining what I did and what's next", scores: { D: 0, U: 0, S: 0 } }, { text: "Just the finished work — they can see it for themselves", scores: { D: 0, U: 0, S: 2 } }, { text: "The finished work with a message asking if it's okay", scores: { D: 0, U: 1, S: 1 } }, { text: "Whatever they asked for — I don't add anything extra", scores: { D: 1, U: 0, S: 2 } }] },
  { id: 5, section: "Your Delivery", question: "Do you proactively update your client during the week — even when there's nothing urgent to report?", options: [{ text: "Yes — I send a short weekly update regardless of whether they ask", scores: { D: 0, U: 0, S: 0 } }, { text: "I update them when I finish something significant", scores: { D: 0, U: 0, S: 1 } }, { text: "I wait for them to ask — I don't want to bother them", scores: { D: 0, U: 0, S: 2 } }, { text: "No — I assumed they'd reach out if they needed an update", scores: { D: 1, U: 0, S: 2 } }] },
  { id: 6, section: "Your Delivery", question: "Are you tracking the results of your work — even informally — so you can show the client what's improved?", options: [{ text: "Yes — I keep a simple log of tasks completed and outcomes", scores: { D: 0, U: 0, S: 0 } }, { text: "I track tasks but not business outcomes or impact", scores: { D: 0, U: 0, S: 1 } }, { text: "No — I just do the work and move on", scores: { D: 0, U: 0, S: 2 } }, { text: "I wouldn't know what to track", scores: { D: 1, U: 0, S: 2 } }] },
  { id: 7, section: "Your Boundaries", question: "Your client asks you to do something that wasn't in your original agreement. What do you do?", options: [{ text: "I note the scope change, confirm the additional rate or adjustment, then do it", scores: { D: 0, U: 0, S: 0 } }, { text: "I do it — I don't want to seem difficult or lose the client", scores: { D: 0, U: 2, S: 0 } }, { text: "I do it this time but feel resentful about it", scores: { D: 0, U: 2, S: 0 } }, { text: "I'm not sure what the right response is", scores: { D: 1, U: 1, S: 0 } }] },
  { id: 8, section: "Your Boundaries", question: "Are you charging your client an amount that reflects what the work is actually worth to their business?", options: [{ text: "Yes — my rate is fair and I feel confident about it", scores: { D: 0, U: 0, S: 0 } }, { text: "Probably not — I lowered my rate to secure the client", scores: { D: 0, U: 2, S: 0 } }, { text: "No — I'm working for much less than I should be", scores: { D: 0, U: 2, S: 0 } }, { text: "I don't know what fair looks like yet", scores: { D: 0, U: 1, S: 0 } }] },
  { id: 9, section: "Your Retainer Plan", question: "Do you have a plan for how you'll transition this client into a retainer relationship?", options: [{ text: "Yes — I know when I'll bring it up and roughly what I'll say", scores: { D: 0, U: 0, S: 0 } }, { text: "I hope it happens naturally but I haven't planned it", scores: { D: 0, U: 1, S: 0 } }, { text: "No — I'm focused on just getting through the project first", scores: { D: 0, U: 0, S: 0 } }, { text: "I didn't know I was supposed to plan for this", scores: { D: 1, U: 1, S: 0 } }] },
  { id: 10, section: "Your Retainer Plan", question: "If this client asked you today whether they can hire you ongoing — what would you say?", options: [{ text: "I'd have a clear monthly package ready to propose", scores: { D: 0, U: 0, S: 0 } }, { text: "I'd say yes but figure out the details after", scores: { D: 1, U: 1, S: 0 } }, { text: "I'd panic a little — I haven't thought that far ahead", scores: { D: 1, U: 1, S: 0 } }, { text: "I'm not sure I'm ready for a full retainer yet", scores: { D: 0, U: 2, S: 0 } }] },
];

const RESULTS = {
  D: { code: "THE DEER IN HEADLIGHTS", tagline: "You got the client. Now you're frozen. No onboarding, no process, no plan — and the first impression is everything.", diagnosis: "The first week with a new client is the highest-stakes week of the entire relationship. It's when they're paying the closest attention, forming their strongest opinions, and deciding — often unconsciously — whether hiring you was the right call. Right now, you don't have a system for that week. That gap between what a professional first week looks like and what you're currently doing is costing you trust before you've even delivered your first piece of work.", costs: "Clients who experience a disorganized first week feel like they have to manage you — and premium clients don't want to manage their VA. Every day without a clear onboarding process is a day the client's confidence in you slowly erodes, even if they don't say anything.", fix: "Build your Week 1 Onboarding process this week — before you deliver anything else. A welcome message, an intake questionnaire, a scope confirmation, and a first check-in. These four steps alone transform how every new client experiences working with you from Day 1.", next: "The First 90 Days Blueprint walks you through building your Week 1 process step by step — including an AI prompt that creates all your onboarding documents in one session." },
  U: { code: "THE UNDERVALUER", tagline: "You're doing the work. But you're giving too much away — and letting the client shape a relationship that doesn't serve you.", diagnosis: "Something in how you entered this client relationship put the power in their hands from the start — maybe you lowered your rate to get the yes, maybe you agreed to work without a clear scope, maybe you keep saying yes to tasks outside the agreement because you're afraid to lose them. Each of these feels small in the moment. Together they create a dynamic where the client expects more and more while you earn less and less relative to the actual work you're doing.", costs: "Undervaluing yourself at the start of a client relationship rarely corrects itself naturally. The rate you accepted becomes the rate they expect forever. The tasks you did for free become tasks they assume are included. You end up working harder each month for the same or less money — and the resentment builds until you quietly stop enjoying the work.", fix: "The reset starts with clarity — a written scope of what's included, what isn't, and what additional work costs. A simple 'going forward' message reframes expectations without making the client feel attacked. The First 90 Days Blueprint includes the exact language for this conversation.", next: "The First 90 Days Blueprint includes Shift 02 — how to reposition yourself as an indispensable partner in the first 30 days, including how to reset scope and rate expectations without losing the client." },
  S: { code: "THE SILENT DELIVERER", tagline: "You're doing the work. But the client can't see it — and invisible work doesn't build the trust that leads to retainers.", diagnosis: "You're reliable. You deliver. But you do it quietly — dropping off finished work without context, waiting to be asked for updates, assuming the client can see the value without it being pointed out. Clients are busy. They're not watching your work unfold. They experience your contribution as a series of files delivered — without any narrative connecting those tasks to their business outcomes. When there's no narrative, there's no reason to keep you beyond the current project.", costs: "Silent deliverers get genuine praise at the end of a project — and then nothing. The client liked you. They just didn't think to continue with you, because nothing you communicated made the value of doing so obvious. You become a positive memory instead of an ongoing resource.", fix: "Start communicating your work before your client has to ask. A short weekly update — 100 words, sent every Friday — covering what you completed, what's coming next, and one positive observation about their business. This one habit makes your presence felt even when you're working quietly in the background.", next: "The First 90 Days Blueprint includes Shift 01 — the exact weekly communication rhythm that makes clients feel informed, supported, and confident in the decision to keep you." },
};

const KILLER_NAMES = { D: "Deer in Headlights", U: "Undervaluer", S: "Silent Deliverer" };
const MARKERS = ["A", "B", "C", "D"];

const BLUEPRINT_SECTIONS = [
  { number: "SHIFT 01", title: "From Winging It to a Real First Week", subtitle: "One afternoon of setup. A first impression that lasts.", body: "The first week with a new client is the most important week of the entire relationship. It's when they're watching most closely, deciding whether they made the right call hiring you, and forming the habits and expectations that will define how they treat you for the rest of your working relationship. You can change that in a single afternoon — before you deliver a single piece of work.", action: "The Professional First Week Setup", action_desc: "Four documents. One afternoon. A Welcome Message sent within 1 hour of them saying yes. A Client Intake Form with 8–10 questions about their business, goals, and preferences. A Scope Confirmation Document summarising what you'll deliver, by when, at what rate. And a 30-Day Expectations Email telling them exactly what working with you looks and feels like. Use the AI prompt below to generate all four in one session.", ai_prompt: `Use this prompt in ChatGPT or Claude:\n\n"I am a VA who offers [your services]. My client is a [type of business]. Please create four onboarding documents:\n\n1. A warm Welcome Message to send within 1 hour of them saying yes — include what happens next, my hours, and one thing I'm excited to work on.\n\n2. A Client Intake Form with 10 questions covering: their business goals, definition of success in 30 days, preferred communication style, tools they use, and anything they want me to know upfront.\n\n3. A one-page Scope Confirmation Document summarising what I will deliver, timeline, rate, and what falls outside this agreement.\n\n4. A 30-Day Expectations Email covering my check-in rhythm, response times, how I handle problems, and what they can expect in our first month.\n\nMake all four warm and professional — not corporate."`, highlight: "VAs who complete a structured onboarding in their first week are twice as likely to receive a retainer offer before the original project ends." },
  { number: "SHIFT 02", title: "From Invisible to Indispensable", subtitle: "Make your value undeniable in the first 30 days.", body: "Getting through the first 30 days without a problem is not the same as making the client feel like they can't live without you. There's a difference between a VA who delivers what was asked and a VA who makes the client feel informed, supported, and better off every single week. The second type gets retainers. The first type gets thanked and not rehired. The shift is about communication — not more work.", action: "The Weekly Value Visibility Rhythm", action_desc: "Every Friday, send your client a short update — 100 words maximum. What you completed this week. What you're working on next. One positive observation about their business. This is not a report — it's a heartbeat. A consistent signal that you're present, on top of things, and thinking about their business even when they're not watching. Use the AI prompt below to write your first three weeks of updates in advance.", ai_prompt: `Use this prompt to write your first three weekly updates in one session:\n\n"I am a VA working with a [type of business] client. My tasks this month include [list your main tasks]. Please write three 100-word Friday update messages — one for each of the first three weeks.\n\nEach message should cover:\n1. What I completed this week\n2. What I'm working on next week\n3. One positive observation about the client's business showing I'm paying attention beyond just completing tasks\n\nKeep the tone warm, professional, and confident — not apologetic or overly formal."`, highlight: "Clients who receive consistent weekly updates are 3× more likely to initiate a retainer conversation themselves — without you ever having to ask." },
  { number: "SHIFT 03", title: "From One Project to First Retainer", subtitle: "Plant the seed early. Have the conversation at the right moment.", body: "Most VAs wait for the client to bring up ongoing work. It almost never comes unprompted — not because the client doesn't want ongoing support, but because they assume you're only available for what they hired you for. The retainer conversation is yours to start. The best time is around Day 45 — halfway through — when the client's satisfaction is high and the relationship is still being shaped.", action: "The Day 45 Retainer Conversation", action_desc: "Around Day 45, after you've delivered something the client was happy with, send this message or raise it on your next call. The goal is not to close a sale — it's to open a conversation that makes a retainer feel like the obvious next step for both of you. Use the AI prompt below to customize it for your specific client and situation.", ai_prompt: `Use this prompt to customize your retainer conversation message:\n\n"I am a VA who has been working with [type of client] for about 45 days. My main tasks have been [list 2-3 things]. The client has been happy with [specific result or positive feedback].\n\nWrite me a short, natural message that opens a conversation about transitioning to a monthly retainer. The message should:\n1. Reference a specific result I've produced for them\n2. Note that a lot of what I do each month is ongoing in nature\n3. Suggest that a monthly arrangement might make more sense than project-by-project\n4. Invite them to have a short conversation about it — without pressure\n\nKeep it under 120 words. Make it feel like a natural next step, not a sales pitch."`, highlight: "The retainer conversation is 4× more likely to succeed when it happens after a specific win — not at the end of a project when both sides feel the pressure of what comes next." },
];

const SYSTEM_COMPONENTS = [
  { number: "01", title: "Week 1 Onboarding Checklist", desc: "Everything you need to set up before or during your first week with a new client. Done once — used forever.", steps: [{ id: "o1", text: "Write your Welcome Message — warm, confident, sent within 1 hour of them saying yes. Include: what happens in the next 24 hours, your communication hours, and one thing you're excited to work on for them." }, { id: "o2", text: "Build your Client Intake Form using Google Forms or Typeform — 8–10 questions about their business goals, preferred communication style, tools they use, definition of success in 30 days, and anything they want you to know upfront." }, { id: "o3", text: "Write your Scope Confirmation Document — one page, plain language. What you will deliver. By when. At what rate. What falls outside this agreement and what it costs. Send for confirmation before any work begins." }, { id: "o4", text: "Write your 30-Day Expectations Email. Send it on Day 1. Covers: your weekly check-in schedule, response time, how you handle problems, and what they can expect from the first month." }, { id: "o5", text: "Schedule your Week 1 Check-In — a 20-minute call or voice note on Day 7 to confirm alignment and catch any mismatches before they become issues." }], output: "Your Week 1 Onboarding System — five documents and touchpoints that make every new client feel professionally onboarded from the very first hour. Built once, used forever." },
  { number: "02", title: "Month 1 Communication Rhythm", desc: "A weekly communication system that keeps your client informed and confident — without requiring extra work on your part.", steps: [{ id: "c1", text: "Set a recurring Friday calendar block — 20 minutes, every week — titled 'Client Update.' This does not move." }, { id: "c2", text: "Write your weekly update template: (1) What I completed this week. (2) What I'm working on next week. (3) One thing I noticed about your business. Under 100 words. No exceptions." }, { id: "c3", text: "Write your first three weekly updates in advance using the AI prompt from Shift 01 of the Blueprint. Save as drafts. Edit slightly each week to reflect what actually happened." }, { id: "c4", text: "Set a monthly 30-minute block on the last working day of each month — titled 'Monthly Wrap-Up.' This is when you write your monthly impact summary and plan the following month's priorities." }, { id: "c5", text: "Define and communicate your response time commitment to your client. (Example: 'I respond within 4 hours, 9am–5pm, Monday to Friday.') Put this in your 30-Day Expectations Email." }], output: "Your Month 1 Communication Rhythm — a weekly update system, a monthly ritual, and a clear response time commitment that makes your client feel supported every single week." },
  { number: "03", title: "Value Documentation System", desc: "A simple tracker that makes your impact visible — to yourself and your client — every month.", steps: [{ id: "v1", text: "Create a Google Sheet or Notion table with columns: Week / Tasks Completed / Business Outcome / Time Saved (estimate) / Client Feedback. Update it every Friday." }, { id: "v2", text: "For each major task, write one sentence connecting it to a business outcome. Not 'managed inbox' — 'cleared 280 emails, flagged 3 urgent client issues, prevented one missed payment deadline.'" }, { id: "v3", text: "At the end of Month 1, write a one-paragraph Month 1 Summary using your tracker data. Send it to your client before your Month 2 invoice." }, { id: "v4", text: "Set a recurring monthly reminder to write and send the impact report. The report always goes out before the invoice — client sees value before they see a bill." }, { id: "v5", text: "Save every piece of positive client feedback in a separate 'Wins' tab. This becomes your testimonial bank and your retainer negotiation evidence." }], output: "Your Value Documentation System — a living tracker that makes your monthly impact undeniable and builds your testimonial bank automatically as you work." },
  { number: "04", title: "Retainer Conversation Planner", desc: "The timing, framing, and exact words for the retainer conversation. Planned in advance so you don't fumble it when the moment comes.", steps: [{ id: "r1", text: "Choose your trigger moment. The best time is around Day 45 — after your first meaningful win. Mark it in your calendar now: 'Retainer Conversation Window.'" }, { id: "r2", text: "Use the AI prompt from Shift 03 of the Blueprint to write your customized retainer message now — before Day 45. Written in advance means sent with confidence, not panic." }, { id: "r3", text: "Define your retainer package before the conversation. What does ongoing monthly support look like? What's included, what isn't, and what's the monthly rate? Three bullet points is enough." }, { id: "r4", text: "Practice the rate out loud. Say your monthly rate number three times, alone. The moment you can say it without hesitating is the moment clients accept it without hesitating." }, { id: "r5", text: "After the conversation — yes or no — write a one-paragraph follow-up summary and send it to the client within 24 hours. This professional close signals that you mean what you say." }], output: "Your Retainer Conversation Planner — your trigger moment chosen, your message written, your package defined, and your rate rehearsed. The retainer conversation becomes something you plan, not something you hope for." },
];

// ─────────────────────────────────────────────────────────────────────────────
function Hub({ onSelect }) {
  const tools = [
    { id: "t1", num: "01", type: "Diagnostic Quiz · 5 min", title: "First Client Readiness Audit", desc: "Find out exactly where you're at risk of losing the client you just worked so hard to get — before it happens." },
    { id: "t2", num: "02", type: "Guide · 20 min read", title: "The First 90 Days Blueprint", desc: "Three shifts that turn your first project into a long-term retainer — with AI prompts for every step." },
    { id: "t3", num: "03", type: "Interactive Builder · 45–60 min", title: "Client Success System Builder", desc: "Build your onboarding, communication rhythm, value tracker, and retainer plan in one sitting. Leave with everything operational." },
  ];
  return (
    <>
      <div className="st-hero fade-up">
        <div className="st-hero-grid" />
        <div className="st-hero-ghost">F90</div>
        <div className="st-hero-content">
          <div className="st-tag">Stage 02 — First 90 Days Trifecta · Just Got Your First Client</div>
          <h1 className="st-display" style={{ fontSize: "clamp(64px, 9vw, 120px)", marginBottom: 28 }}>
            YOUR FIRST<br />90 DAYS<br /><span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>TRIFECTA</span>
          </h1>
          <p className="st-body" style={{ maxWidth: 560 }}>Landing the client was step one. Keeping them — and turning them into stable monthly income — is what these three tools are built for. The next 90 days are the most important 90 days of your VA business.</p>
        </div>
      </div>
      <div className="st-content">
        <div className="st-stat-row">
          {[["3", "Free tools"], ["10", "Questions"], ["90", "Days"]].map(([n, l]) => (
            <div key={l}><span className="st-stat-num">{n}</span><span className="st-stat-label">{l}</span></div>
          ))}
        </div>
        <div className="st-card-grid">
          {tools.map((t, i) => (
            <button key={t.id} onClick={() => onSelect(t.id)} className={`st-tool-card${i === 0 ? " featured" : ""}`}>
              <span className="st-tool-num">{t.num}</span>
              <div><span className="st-tool-type">{t.type}</span><span className="st-tool-title">{t.title}</span><span className="st-tool-desc">{t.desc}</span></div>
              <span className="st-tool-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Tool1({ onBack }) {
  const [stage, setStage]         = useState("intro");
  const [qIndex, setQIndex]       = useState(0);
  const [answers, setAnswers]     = useState({});
  const [selected, setSelected]   = useState(null);
  const [email, setEmail]         = useState("");
  const [firstName, setFirstName] = useState("");
  const [result, setResult]       = useState(null);
  const [scores, setScores]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const progress = stage === "intro" ? 0 : stage === "quiz" ? Math.round((qIndex / QUESTIONS.length) * 100) : stage === "gate" ? 95 : 100;
  const currentQ = QUESTIONS[qIndex];

  const nextQuestion = () => {
    const updated = { ...answers, [currentQ.id]: selected };
    setAnswers(updated);
    setSelected(null);
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      const totals = { D: 0, U: 0, S: 0 };
      Object.values(updated).forEach(opt => { totals.D += opt.scores.D; totals.U += opt.scores.U; totals.S += opt.scores.S; });
      setScores(totals);
      setResult(Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0]);
      setStage("gate");
    }
  };

  const submitEmail = async () => {
    if (!email || !firstName) return;
    setSubmitting(true);
    try {
      await fetch("https://api.convertkit.com/v3/forms/9140190/subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: "eC5dt0WcDmbUQmw8RVYytA", first_name: firstName, email, tags: [result === "D" ? "Deer in Headlights" : result === "U" ? "Undervaluer" : "Silent Deliverer"] }),
      });
    } catch (e) { console.error(e); }
    setSubmitting(false);
    setStage("result");
  };

  const maxScore = scores ? Math.max(...Object.values(scores)) || 1 : 1;

  return (
    <>
      <div className="st-progress"><div className="st-progress-fill" style={{ width: `${progress}%` }} /></div>
      {stage === "intro" && (
        <div className="fade-up">
          <div className="st-hero"><div className="st-hero-grid" /><div className="st-hero-ghost">FCR</div>
            <div className="st-hero-content">
              <div className="st-tag">Tool 01 · Diagnostic Quiz · 5 min</div>
              <h2 className="st-display" style={{ fontSize: "clamp(52px, 8vw, 100px)", marginBottom: 28 }}>FIRST CLIENT<br /><span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>READINESS</span><br />AUDIT</h2>
              <p className="st-body st-italic" style={{ maxWidth: 520 }}>You got the client. That was the hard part — but it wasn't the last part. The next 90 days decide whether this becomes a one-time project or the start of stable monthly income. This audit finds out exactly where you're at risk of losing what you just worked so hard to get.</p>
            </div>
          </div>
          <div className="st-content">
            <div className="st-stat-row">{[["10", "Questions"], ["5", "Minutes"], ["1", "Clear risk"]].map(([n, l]) => (<div key={l}><span className="st-stat-num">{n}</span><span className="st-stat-label">{l}</span></div>))}</div>
            <button className="st-btn st-btn-primary" onClick={() => setStage("quiz")}>Find my risk →</button>
          </div>
        </div>
      )}
      {stage === "quiz" && currentQ && (
        <div className="st-content fade-up" key={qIndex}>
          <div className="st-tag">{currentQ.section}</div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: "rgba(237,233,227,0.2)", marginBottom: 28 }}>Question {qIndex + 1} of {QUESTIONS.length}</p>
          <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(18px, 2.8vw, 26px)", fontWeight: 700, lineHeight: 1.4, color: "var(--fog)", marginBottom: 36 }}>{currentQ.question}</h3>
          <div className="st-options">
            {currentQ.options.map((opt, i) => (
              <button key={i} onClick={() => setSelected(opt)} className={`st-option${selected === opt ? " selected" : ""}`}>
                <div className="st-option-marker">{selected === opt ? "✓" : MARKERS[i]}</div>
                <span className="st-option-text">{opt.text}</span>
              </button>
            ))}
          </div>
          <button className="st-btn st-btn-primary" onClick={nextQuestion} disabled={!selected} style={{ opacity: selected ? 1 : 0, pointerEvents: selected ? "all" : "none", transition: "opacity 0.2s" }}>
            {qIndex < QUESTIONS.length - 1 ? "Next question →" : "See my result →"}
          </button>
        </div>
      )}
      {stage === "gate" && (
        <div className="st-content fade-up">
          <div className="st-tag">Audit Complete</div>
          <h2 className="st-display" style={{ fontSize: "clamp(48px, 7vw, 88px)", marginBottom: 24 }}>YOUR RISK<br />IS IDENTIFIED.</h2>
          <p className="st-body" style={{ maxWidth: 480, marginBottom: 36 }}>Enter your name and email to get your personalized diagnosis — exactly where you're at risk of losing this client and the one thing to fix right now.</p>
          <div style={{ maxWidth: 440 }}>
            <input className="st-input" type="text" placeholder="Your first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input className="st-input" type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} />
            <button className="st-btn st-btn-primary" onClick={submitEmail} disabled={!email || !firstName || submitting}>{submitting ? "One moment..." : "Show me my risk →"}</button>
          </div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: "rgba(237,233,227,0.2)", marginTop: 16 }}>No spam. Just your result and your next step.</p>
        </div>
      )}
      {stage === "result" && result && scores && (
        <div className="st-content fade-up">
          <div className="st-tag">{firstName ? `${firstName}'s` : "Your"} First Client Readiness Diagnosis</div>
          <h2 className="st-display" style={{ fontSize: "clamp(40px, 6vw, 72px)", marginBottom: 20 }}>{RESULTS[result].code}</h2>
          <p className="st-body st-italic" style={{ maxWidth: 560, marginBottom: 40 }}>{RESULTS[result].tagline}</p>
          <div className="st-rule" />
          <div className="st-score-grid">
            {Object.entries(scores).map(([key, val]) => (
              <div key={key} className={`st-score-cell${result === key ? " dominant" : ""}`}>
                <span className="st-score-label">{result === key ? "Primary risk" : "Also present"}</span>
                <span className="st-score-num">{val}</span>
                <div className="st-score-bar-track"><div className="st-score-bar-fill" style={{ width: `${(val / maxScore) * 100}%` }} /></div>
                <span className="st-score-name">{KILLER_NAMES[key]}</span>
              </div>
            ))}
          </div>
          {[["What This Means Right Now", RESULTS[result].diagnosis], ["What It's Costing You", RESULTS[result].costs], ["Your Immediate Fix", RESULTS[result].fix]].map(([label, text]) => (
            <div key={label} className="st-result-block"><div className="st-tag">{label}</div><p className="st-body">{text}</p></div>
          ))}
          <div className="st-callout"><div className="st-tag">Your Next Step</div><p>{RESULTS[result].next}</p></div>
          <button className="st-btn st-btn-ghost" onClick={onBack}>← Back to all tools</button>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Tool2({ onBack }) {
  const [active, setActive]       = useState(0);
  const [showPrompt, setShowPrompt] = useState(null);
  const sec = BLUEPRINT_SECTIONS[active];
  return (
    <>
      <div className="st-hero fade-up"><div className="st-hero-grid" /><div className="st-hero-ghost">F9B</div>
        <div className="st-hero-content">
          <div className="st-tag">Tool 02 · Guide · 20 min read</div>
          <h2 className="st-display" style={{ fontSize: "clamp(52px, 8vw, 100px)", marginBottom: 28 }}>THE FIRST<br />90 DAYS<br /><span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>BLUEPRINT</span></h2>
          <p className="st-body st-italic" style={{ maxWidth: 540 }}>Three shifts that turn your first client relationship into a retainer before the project ends. Each one comes with an AI prompt you can use today.</p>
        </div>
      </div>
      <div className="st-content fade-up">
        <div className="st-tabs">{BLUEPRINT_SECTIONS.map((s, i) => (<button key={i} onClick={() => { setActive(i); setShowPrompt(null); }} className={`st-tab${active === i ? " active" : ""}`}>{s.number}</button>))}</div>
        <div key={active} className="fade-up">
          <div className="st-tag">{sec.number}</div>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(32px, 4vw, 52px)", color: "var(--fog)", letterSpacing: "0.02em", marginBottom: 8 }}>{sec.title}</h3>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--steel)", marginBottom: 28 }}>{sec.subtitle}</p>
          <p className="st-body" style={{ marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid var(--rule)" }}>{sec.body}</p>
          <div className="st-tag">The Action</div>
          <h4 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontWeight: 700, color: "var(--fog)", marginBottom: 14 }}>{sec.action}</h4>
          <p className="st-body" style={{ marginBottom: 28 }}>{sec.action_desc}</p>
          <button className="st-btn st-btn-ghost" onClick={() => setShowPrompt(showPrompt === active ? null : active)}>{showPrompt === active ? "Hide AI prompt ↑" : "View AI prompt →"}</button>
          {showPrompt === active && (<div className="st-prompt-box fade-up"><span className="st-prompt-label">Copy this prompt into ChatGPT or Claude</span><p className="st-prompt-text">{sec.ai_prompt}</p></div>)}
          <div className="st-highlight"><p>— {sec.highlight}</p></div>
          <div className="st-btn-row">
            {active > 0 && <button className="st-btn st-btn-ghost" onClick={() => { setActive(active - 1); setShowPrompt(null); }}>← Previous shift</button>}
            {active < BLUEPRINT_SECTIONS.length - 1 ? <button className="st-btn st-btn-primary" onClick={() => { setActive(active + 1); setShowPrompt(null); }}>Next shift →</button> : <button className="st-btn st-btn-ghost" onClick={onBack}>← Back to all tools</button>}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Tool3({ onBack }) {
  const [checked, setChecked] = useState({});
  const [active, setActive]   = useState(0);
  const toggle    = id => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const getPct    = comp => Math.round((comp.steps.filter(s => checked[s.id]).length / comp.steps.length) * 100);
  const totalSteps = SYSTEM_COMPONENTS.reduce((a, c) => a + c.steps.length, 0);
  const totalDone  = SYSTEM_COMPONENTS.reduce((a, c) => a + c.steps.filter(s => checked[s.id]).length, 0);
  const overallPct = Math.round((totalDone / totalSteps) * 100);
  const comp = SYSTEM_COMPONENTS[active];
  return (
    <>
      <div className="st-hero fade-up"><div className="st-hero-grid" /><div className="st-hero-ghost">CSS</div>
        <div className="st-hero-content">
          <div className="st-tag">Tool 03 · Interactive Builder · 45–60 min</div>
          <h2 className="st-display" style={{ fontSize: "clamp(52px, 8vw, 100px)", marginBottom: 28 }}>CLIENT SUCCESS<br /><span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>SYSTEM BUILDER</span></h2>
          <p className="st-body st-italic" style={{ maxWidth: 520 }}>Build the four systems that protect your first client relationship and turn it into a retainer — in one sitting. Check off each step as you complete it.</p>
        </div>
      </div>
      <div className="st-content fade-up">
        <div className="st-progress-bar">
          <div className="st-progress-inner">
            <div className="st-progress-meta"><span>Overall Progress</span><span>{totalDone}/{totalSteps} steps</span></div>
            <div className="st-progress-track"><div className="st-progress-filled" style={{ width: `${overallPct}%` }} /></div>
          </div>
          <span className="st-progress-pct">{overallPct}%</span>
        </div>
        <div className="st-comp-tabs">
          {SYSTEM_COMPONENTS.map((c, i) => {
            const pct = getPct(c);
            return (
              <button key={i} onClick={() => setActive(i)} className={`st-comp-tab${active === i ? " active" : ""}`}>
                <span className="st-comp-num">{c.number}</span>
                <span className="st-comp-done">{pct}% done</span>
                <div className="st-comp-track"><div className="st-comp-fill" style={{ width: `${pct}%` }} /></div>
              </button>
            );
          })}
        </div>
        <div key={active} className="fade-up">
          <div className="st-tag">Component {comp.number}</div>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", color: "var(--fog)", letterSpacing: "0.02em", marginBottom: 16 }}>{comp.title}</h3>
          <p className="st-body" style={{ marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid var(--rule)" }}>{comp.desc}</p>
          <div className="st-tag">Build Steps</div>
          <div className="st-steps">
            {comp.steps.map((step, i) => (
              <button key={step.id} onClick={() => toggle(step.id)} className={`st-step${checked[step.id] ? " done" : ""}`}>
                <div className="st-step-marker">{checked[step.id] ? "✓" : i + 1}</div>
                <span className="st-step-text">{step.text}</span>
              </button>
            ))}
          </div>
          {getPct(comp) === 100 && (
            <div className="st-complete fade-up"><div className="st-tag">Component Complete ✓</div><p>{comp.output}</p></div>
          )}
          <div className="st-btn-row">
            {active > 0 && <button className="st-btn st-btn-ghost" onClick={() => setActive(active - 1)}>← Previous</button>}
            {active < SYSTEM_COMPONENTS.length - 1
              ? <button className="st-btn st-btn-primary" onClick={() => setActive(active + 1)}>Next component →</button>
              : overallPct === 100
                ? (<div className="st-complete fade-up" style={{ width: "100%" }}><div className="st-tag">Client Success System Complete</div><p>Your Client Success System is built. The onboarding, the communication rhythm, the value tracker, the retainer plan — all operational. Your first 90 days are now something you run, not something that happens to you. Systems Over Hustle™.</p><p className="muted">Ready for what comes after? The Lean Trifecta shows you how to keep clients long-term and build stable monthly retainer income.</p><button className="st-btn st-btn-ghost" onClick={onBack} style={{ borderColor: "rgba(26,23,20,0.25)", color: "var(--ink)" }}>← Back to all tools</button></div>)
                : <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "var(--steel)", paddingTop: 16 }}>Complete all steps to finish your system.</p>
            }
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("hub");
  return (
    <div className="app">
      <style>{GLOBAL_CSS}</style>
      <header className="st-nav">
        <div className="st-nav-left">
          {view !== "hub" && <button className="st-back-btn" onClick={() => setView("hub")}>← All tools</button>}
          <a href="https://marginmomentum.co" className="st-wordmark">Margin &amp; Momentum™ <span>First 90 Days</span></a>
        </div>
      </header>
      <main className="st-main">
        {view === "hub" && <Hub onSelect={id => setView(id)} />}
        {view === "t1"  && <Tool1 onBack={() => setView("hub")} />}
        {view === "t2"  && <Tool2 onBack={() => setView("hub")} />}
        {view === "t3"  && <Tool3 onBack={() => setView("hub")} />}
      </main>
      <footer className="st-footer">
        <span className="st-footer-l">Margin &amp; Momentum™</span>
        <span className="st-footer-r">Systems Over Hustle™</span>
      </footer>
    </div>
  );
}
