import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #fff; }
  .app { font-family: 'Libre Baskerville', Georgia, serif; background: #fff; color: #0a0a0a; min-height: 100vh; display: flex; flex-direction: column; }
  .hdr { border-bottom: 2px solid #0a0a0a; padding: 14px 40px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: #fff; z-index: 200; }
  .hdr-left { display: flex; align-items: center; gap: 20px; }
  .back-btn { background: none; border: none; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #888; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0; transition: color 0.2s; }
  .back-btn:hover { color: #0a0a0a; }
  .brand { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: #0a0a0a; }
  .tag { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #aaa; }
  .prog { height: 3px; background: #ebebeb; }
  .prog-fill { height: 100%; background: #0a0a0a; transition: width 0.5s ease; }
  .mm-main { flex: 1; display: flex; flex-direction: column; }
  .ftr { background: #0a0a0a; padding: 16px 40px; display: flex; justify-content: space-between; align-items: center; }
  .ftr-l { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: #fff; }
  .ftr-r { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: #555; }
  .btn-primary { display: inline-flex; align-items: center; gap: 10px; background: #0a0a0a; color: #fff; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; padding: 16px 32px; border: none; cursor: pointer; transition: background 0.2s; }
  .btn-primary:hover { background: #333; }
  .btn-primary:disabled { opacity: 0.35; cursor: default; }
  .btn-outline { display: inline-flex; align-items: center; gap: 10px; background: transparent; color: #0a0a0a; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; padding: 15px 31px; border: 1.5px solid #0a0a0a; cursor: pointer; transition: all 0.2s; }
  .btn-outline:hover { background: #0a0a0a; color: #fff; }
  .mm-input { border: 1.5px solid #0a0a0a; padding: 14px 18px; font-family: 'Libre Baskerville', serif; font-size: 14px; color: #0a0a0a; background: #fff; outline: none; width: 100%; }
  .mm-input::placeholder { color: #bbb; }
  .mm-input:focus { box-shadow: 3px 3px 0 #0a0a0a; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
  @media (max-width: 640px) { .hdr { padding: 12px 20px; } .ftr { padding: 14px 20px; } }
`;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id: 1, section: "YOUR FIRST WEEK", question: "It's Day 1 with your new client. What does your onboarding process look like?", options: [
    { text: "I have a step-by-step process — welcome message, intake form, scope confirmation, first check-in", scores: { D: 0, U: 0, S: 0 } },
    { text: "I send a few questions and figure out the rest as we go", scores: { D: 1, U: 0, S: 0 } },
    { text: "I ask what they need and start working immediately", scores: { D: 2, U: 0, S: 0 } },
    { text: "I don't have an onboarding — I just wait for instructions", scores: { D: 2, U: 1, S: 0 } },
  ]},
  { id: 2, section: "YOUR FIRST WEEK", question: "Before you start working, do you and your client have a written agreement about what you'll deliver, by when, and at what rate?", options: [
    { text: "Yes — I always confirm scope in writing before starting", scores: { D: 0, U: 0, S: 0 } },
    { text: "We discussed it verbally but nothing is in writing", scores: { D: 1, U: 1, S: 0 } },
    { text: "They told me what they needed and I just started", scores: { D: 1, U: 2, S: 0 } },
    { text: "No — I didn't want to seem difficult by asking for a contract", scores: { D: 0, U: 2, S: 0 } },
  ]},
  { id: 3, section: "YOUR FIRST WEEK", question: "Does your client know exactly what to expect from you each week — your availability, response time, how you'll communicate?", options: [
    { text: "Yes — I set this out clearly in my onboarding materials", scores: { D: 0, U: 0, S: 0 } },
    { text: "Sort of — we talked about it loosely but nothing is formalised", scores: { D: 1, U: 0, S: 1 } },
    { text: "No — they just message me when they need something", scores: { D: 1, U: 0, S: 2 } },
    { text: "No — I didn't know I should set this up", scores: { D: 2, U: 0, S: 1 } },
  ]},
  { id: 4, section: "YOUR DELIVERY", question: "When you complete a task or deliverable, what do you send the client?", options: [
    { text: "The finished work plus a brief note explaining what I did and what's next", scores: { D: 0, U: 0, S: 0 } },
    { text: "Just the finished work — they can see it for themselves", scores: { D: 0, U: 0, S: 2 } },
    { text: "The finished work with a message asking if it's okay", scores: { D: 0, U: 1, S: 1 } },
    { text: "Whatever they asked for — I don't add anything extra", scores: { D: 1, U: 0, S: 2 } },
  ]},
  { id: 5, section: "YOUR DELIVERY", question: "Do you proactively update your client during the week — even when there's nothing urgent to report?", options: [
    { text: "Yes — I send a short weekly update regardless of whether they ask", scores: { D: 0, U: 0, S: 0 } },
    { text: "I update them when I finish something significant", scores: { D: 0, U: 0, S: 1 } },
    { text: "I wait for them to ask — I don't want to bother them", scores: { D: 0, U: 0, S: 2 } },
    { text: "No — I assumed they'd reach out if they needed an update", scores: { D: 1, U: 0, S: 2 } },
  ]},
  { id: 6, section: "YOUR DELIVERY", question: "Are you tracking the results of your work — even informally — so you can show the client what's improved?", options: [
    { text: "Yes — I keep a simple log of tasks completed and outcomes", scores: { D: 0, U: 0, S: 0 } },
    { text: "I track tasks but not business outcomes or impact", scores: { D: 0, U: 0, S: 1 } },
    { text: "No — I just do the work and move on", scores: { D: 0, U: 0, S: 2 } },
    { text: "I wouldn't know what to track", scores: { D: 1, U: 0, S: 2 } },
  ]},
  { id: 7, section: "YOUR BOUNDARIES", question: "Your client asks you to do something that wasn't in your original agreement. What do you do?", options: [
    { text: "I note the scope change, confirm the additional rate or adjustment, then do it", scores: { D: 0, U: 0, S: 0 } },
    { text: "I do it — I don't want to seem difficult or lose the client", scores: { D: 0, U: 2, S: 0 } },
    { text: "I do it this time but feel resentful about it", scores: { D: 0, U: 2, S: 0 } },
    { text: "I'm not sure what the right response is", scores: { D: 1, U: 1, S: 0 } },
  ]},
  { id: 8, section: "YOUR BOUNDARIES", question: "Are you charging your client an amount that reflects what the work is actually worth to their business?", options: [
    { text: "Yes — my rate is fair and I feel confident about it", scores: { D: 0, U: 0, S: 0 } },
    { text: "Probably not — I lowered my rate to secure the client", scores: { D: 0, U: 2, S: 0 } },
    { text: "No — I'm working for much less than I should be", scores: { D: 0, U: 2, S: 0 } },
    { text: "I don't know what fair looks like yet", scores: { D: 0, U: 1, S: 0 } },
  ]},
  { id: 9, section: "YOUR RETAINER PLAN", question: "Do you have a plan for how you'll transition this client into a retainer relationship?", options: [
    { text: "Yes — I know when I'll bring it up and roughly what I'll say", scores: { D: 0, U: 0, S: 0 } },
    { text: "I hope it happens naturally but I haven't planned it", scores: { D: 0, U: 1, S: 0 } },
    { text: "No — I'm focused on just getting through the project first", scores: { D: 0, U: 0, S: 0 } },
    { text: "I didn't know I was supposed to plan for this", scores: { D: 1, U: 1, S: 0 } },
  ]},
  { id: 10, section: "YOUR RETAINER PLAN", question: "If this client asked you today whether they can hire you ongoing — what would you say?", options: [
    { text: "I'd have a clear monthly package ready to propose", scores: { D: 0, U: 0, S: 0 } },
    { text: "I'd say yes but figure out the details after", scores: { D: 1, U: 1, S: 0 } },
    { text: "I'd panic a little — I haven't thought that far ahead", scores: { D: 1, U: 1, S: 0 } },
    { text: "I'm not sure I'm ready for a full retainer yet", scores: { D: 0, U: 2, S: 0 } },
  ]},
];

const RESULTS = {
  D: {
    code: "THE DEER IN HEADLIGHTS",
    tagline: "You got the client. Now you're frozen. No onboarding, no process, no plan — and the first impression is everything.",
    diagnosis: "The first week with a new client is the highest-stakes week of the entire relationship. It's when they're paying the closest attention, forming their strongest opinions, and deciding — often unconsciously — whether hiring you was the right call. Right now, you don't have a system for that week. That gap between what a professional first week looks like and what you're currently doing is costing you trust before you've even delivered your first piece of work.",
    costs: "Clients who experience a disorganized first week feel like they have to manage you — and premium clients don't want to manage their VA. Every day without a clear onboarding process is a day the client's confidence in you slowly erodes, even if they don't say anything.",
    fix: "Build your Week 1 Onboarding process this week — before you deliver anything else. A welcome message, an intake questionnaire, a scope confirmation, and a first check-in. These four steps alone transform how every new client experiences working with you from Day 1.",
    next: "The First 90 Days Blueprint walks you through building your Week 1 process step by step — including an AI prompt that creates all your onboarding documents in one session.",
  },
  U: {
    code: "THE UNDERVALUER",
    tagline: "You're doing the work. But you're giving too much away — and letting the client shape a relationship that doesn't serve you.",
    diagnosis: "Something in how you entered this client relationship put the power in their hands from the start — maybe you lowered your rate to get the yes, maybe you agreed to work without a clear scope, maybe you keep saying yes to tasks outside the agreement because you're afraid to lose them. Each of these feels small in the moment. Together they create a dynamic where the client expects more and more while you earn less and less relative to the actual work you're doing.",
    costs: "Undervaluing yourself at the start of a client relationship rarely corrects itself naturally. The rate you accepted becomes the rate they expect forever. The tasks you did for free become tasks they assume are included. You end up working harder each month for the same or less money — and the resentment builds until you quietly stop enjoying the work.",
    fix: "The reset starts with clarity — a written scope of what's included, what isn't, and what additional work costs. A simple 'going forward' message reframes expectations without making the client feel attacked. The First 90 Days Blueprint includes the exact language for this conversation.",
    next: "The First 90 Days Blueprint includes Shift 02 — how to reposition yourself as an indispensable partner in the first 30 days, including how to reset scope and rate expectations without losing the client.",
  },
  S: {
    code: "THE SILENT DELIVERER",
    tagline: "You're doing the work. But the client can't see it — and invisible work doesn't build the trust that leads to retainers.",
    diagnosis: "You're reliable. You deliver. But you do it quietly — dropping off finished work without context, waiting to be asked for updates, assuming the client can see the value without it being pointed out. Clients are busy. They're not watching your work unfold. They experience your contribution as a series of files delivered — without any narrative connecting those tasks to their business outcomes. When there's no narrative, there's no reason to keep you beyond the current project.",
    costs: "Silent deliverers get genuine praise at the end of a project — and then nothing. The client liked you. They just didn't think to continue with you, because nothing you communicated made the value of doing so obvious. You become a positive memory instead of an ongoing resource.",
    fix: "Start communicating your work before your client has to ask. A short weekly update — 100 words, sent every Friday — covering what you completed, what's coming next, and one positive observation about their business. This one habit makes your presence felt even when you're working quietly in the background.",
    next: "The First 90 Days Blueprint includes Shift 01 — the exact weekly communication rhythm that makes clients feel informed, supported, and confident in the decision to keep you.",
  },
};

const BLUEPRINT_SECTIONS = [
  {
    number: "SHIFT 01", title: "From Winging It to a Real First Week", subtitle: "One afternoon of setup. A first impression that lasts.",
    body: "The first week with a new client is the most important week of the entire relationship. It's when they're watching most closely, deciding whether they made the right call hiring you, and forming the habits and expectations that will define how they treat you for the rest of your working relationship. You can change that in a single afternoon — before you deliver a single piece of work.",
    action: "The Professional First Week Setup",
    action_desc: "Four documents. One afternoon. A Welcome Message sent within 1 hour of them saying yes. A Client Intake Form with 8–10 questions about their business, goals, and preferences. A Scope Confirmation Document summarising what you'll deliver, by when, at what rate. And a 30-Day Expectations Email telling them exactly what working with you looks and feels like. Use the AI prompt below to generate all four in one session.",
    ai_prompt: `Use this prompt in ChatGPT or Claude:\n\n"I am a VA who offers [your services]. My client is a [type of business]. Please create four onboarding documents:\n\n1. A warm Welcome Message to send within 1 hour of them saying yes — include what happens next, my hours, and one thing I'm excited to work on.\n\n2. A Client Intake Form with 10 questions covering: their business goals, definition of success in 30 days, preferred communication style, tools they use, and anything they want me to know upfront.\n\n3. A one-page Scope Confirmation Document summarising what I will deliver, timeline, rate, and what falls outside this agreement.\n\n4. A 30-Day Expectations Email covering my check-in rhythm, response times, how I handle problems, and what they can expect in our first month.\n\nMake all four warm and professional — not corporate."`,
    highlight: "VAs who complete a structured onboarding in their first week are twice as likely to receive a retainer offer before the original project ends.",
  },
  {
    number: "SHIFT 02", title: "From Invisible to Indispensable", subtitle: "Make your value undeniable in the first 30 days.",
    body: "Getting through the first 30 days without a problem is not the same as making the client feel like they can't live without you. There's a difference between a VA who delivers what was asked and a VA who makes the client feel informed, supported, and better off every single week. The second type gets retainers. The first type gets thanked and not rehired. The shift is about communication — not more work.",
    action: "The Weekly Value Visibility Rhythm",
    action_desc: "Every Friday, send your client a short update — 100 words maximum. What you completed this week. What you're working on next. One positive observation about their business. This is not a report — it's a heartbeat. A consistent signal that you're present, on top of things, and thinking about their business even when they're not watching. Use the AI prompt below to write your first three weeks of updates in advance.",
    ai_prompt: `Use this prompt to write your first three weekly updates in one session:\n\n"I am a VA working with a [type of business] client. My tasks this month include [list your main tasks]. Please write three 100-word Friday update messages — one for each of the first three weeks.\n\nEach message should cover:\n1. What I completed this week\n2. What I'm working on next week\n3. One positive observation about the client's business showing I'm paying attention beyond just completing tasks\n\nKeep the tone warm, professional, and confident — not apologetic or overly formal."`,
    highlight: "Clients who receive consistent weekly updates are 3× more likely to initiate a retainer conversation themselves — without you ever having to ask.",
  },
  {
    number: "SHIFT 03", title: "From One Project to First Retainer", subtitle: "Plant the seed early. Have the conversation at the right moment.",
    body: "Most VAs wait for the client to bring up ongoing work. It almost never comes unprompted — not because the client doesn't want ongoing support, but because they assume you're only available for what they hired you for. The retainer conversation is yours to start. The best time is around Day 45 — halfway through — when the client's satisfaction is high and the relationship is still being shaped.",
    action: "The Day 45 Retainer Conversation",
    action_desc: "Around Day 45, after you've delivered something the client was happy with, send this message or raise it on your next call. The goal is not to close a sale — it's to open a conversation that makes a retainer feel like the obvious next step for both of you. Use the AI prompt below to customize it for your specific client and situation.",
    ai_prompt: `Use this prompt to customize your retainer conversation message:\n\n"I am a VA who has been working with [type of client] for about 45 days. My main tasks have been [list 2-3 things]. The client has been happy with [specific result or positive feedback].\n\nWrite me a short, natural message that opens a conversation about transitioning to a monthly retainer. The message should:\n1. Reference a specific result I've produced for them\n2. Note that a lot of what I do each month is ongoing in nature\n3. Suggest that a monthly arrangement might make more sense than project-by-project\n4. Invite them to have a short conversation about it — without pressure\n\nKeep it under 120 words. Make it feel like a natural next step, not a sales pitch."`,
    highlight: "The retainer conversation is 4× more likely to succeed when it happens after a specific win — not at the end of a project when both sides feel the pressure of what comes next.",
  },
];

const SYSTEM_COMPONENTS = [
  {
    number: "01", title: "Week 1 Onboarding Checklist",
    desc: "Everything you need to set up before or during your first week with a new client. Done once — used forever.",
    steps: [
      { id: "o1", text: "Write your Welcome Message — warm, confident, sent within 1 hour of them saying yes. Include: what happens in the next 24 hours, your communication hours, and one thing you're excited to work on for them." },
      { id: "o2", text: "Build your Client Intake Form using Google Forms or Typeform — 8–10 questions about their business goals, preferred communication style, tools they use, definition of success in 30 days, and anything they want you to know upfront." },
      { id: "o3", text: "Write your Scope Confirmation Document — one page, plain language. What you will deliver. By when. At what rate. What falls outside this agreement and what it costs. Send for confirmation before any work begins." },
      { id: "o4", text: "Write your 30-Day Expectations Email. Send it on Day 1. Covers: your weekly check-in schedule, response time, how you handle problems, and what they can expect from the first month." },
      { id: "o5", text: "Schedule your Week 1 Check-In — a 20-minute call or voice note on Day 7 to confirm alignment and catch any mismatches before they become issues." },
    ],
    output: "Your Week 1 Onboarding System — five documents and touchpoints that make every new client feel professionally onboarded from the very first hour. Built once, used forever.",
  },
  {
    number: "02", title: "Month 1 Communication Rhythm",
    desc: "A weekly communication system that keeps your client informed and confident — without requiring extra work on your part.",
    steps: [
      { id: "c1", text: "Set a recurring Friday calendar block — 20 minutes, every week — titled 'Client Update.' This does not move." },
      { id: "c2", text: "Write your weekly update template: (1) What I completed this week. (2) What I'm working on next week. (3) One thing I noticed about your business. Under 100 words. No exceptions." },
      { id: "c3", text: "Write your first three weekly updates in advance using the AI prompt from Shift 01 of the Blueprint. Save as drafts. Edit slightly each week to reflect what actually happened." },
      { id: "c4", text: "Set a monthly 30-minute block on the last working day of each month — titled 'Monthly Wrap-Up.' This is when you write your monthly impact summary and plan the following month's priorities." },
      { id: "c5", text: "Define and communicate your response time commitment to your client. (Example: 'I respond within 4 hours, 9am–5pm, Monday to Friday.') Put this in your 30-Day Expectations Email." },
    ],
    output: "Your Month 1 Communication Rhythm — a weekly update system, a monthly ritual, and a clear response time commitment that makes your client feel supported every single week.",
  },
  {
    number: "03", title: "Value Documentation System",
    desc: "A simple tracker that makes your impact visible — to yourself and your client — every month. This feeds directly into your monthly impact reports and makes the retainer conversation easy.",
    steps: [
      { id: "v1", text: "Create a Google Sheet or Notion table with columns: Week / Tasks Completed / Business Outcome / Time Saved (estimate) / Client Feedback. Update it every Friday." },
      { id: "v2", text: "For each major task, write one sentence connecting it to a business outcome. Not 'managed inbox' — 'cleared 280 emails, flagged 3 urgent client issues, prevented one missed payment deadline.'" },
      { id: "v3", text: "At the end of Month 1, write a one-paragraph Month 1 Summary using your tracker data. Send it to your client before your Month 2 invoice." },
      { id: "v4", text: "Set a recurring monthly reminder to write and send the impact report. The report always goes out before the invoice — client sees value before they see a bill." },
      { id: "v5", text: "Save every piece of positive client feedback in a separate 'Wins' tab. This becomes your testimonial bank and your retainer negotiation evidence." },
    ],
    output: "Your Value Documentation System — a living tracker that makes your monthly impact undeniable and builds your testimonial bank automatically as you work.",
  },
  {
    number: "04", title: "Retainer Conversation Planner",
    desc: "The timing, framing, and exact words for the retainer conversation. Planned in advance so you don't fumble it when the moment comes.",
    steps: [
      { id: "r1", text: "Choose your trigger moment. The best time is around Day 45 — after your first meaningful win. Mark it in your calendar now: 'Retainer Conversation Window.'" },
      { id: "r2", text: "Use the AI prompt from Shift 03 of the Blueprint to write your customized retainer message now — before Day 45. Written in advance means sent with confidence, not panic." },
      { id: "r3", text: "Define your retainer package before the conversation. What does ongoing monthly support look like? What's included, what isn't, and what's the monthly rate? Three bullet points is enough." },
      { id: "r4", text: "Practice the rate out loud. Say your monthly rate number three times, alone. The moment you can say it without hesitating is the moment clients accept it without hesitating." },
      { id: "r5", text: "After the conversation — yes or no — write a one-paragraph follow-up summary and send it to the client within 24 hours. This professional close signals that you mean what you say." },
    ],
    output: "Your Retainer Conversation Planner — your trigger moment chosen, your message written, your package defined, and your rate rehearsed. The retainer conversation becomes something you plan, not something you hope for.",
  },
];

const MARKERS = ["A", "B", "C", "D"];
const KILLER_NAMES = { D: "Deer in Headlights", U: "Undervaluer", S: "Silent Deliverer" };

// ─────────────────────────────────────────────────────────────────────────────
// HUB
// ─────────────────────────────────────────────────────────────────────────────
function Hub({ onSelect }) {
  const tools = [
    { id: "t1", num: "01", type: "Diagnostic Quiz · 5 min", title: "First Client Readiness Audit", desc: "Find out exactly where you're at risk of losing the client you just worked so hard to get — before it happens." },
    { id: "t2", num: "02", type: "Guide · 20 min read", title: "The First 90 Days Blueprint", desc: "Three shifts that turn your first project into a long-term retainer — with AI prompts for every step." },
    { id: "t3", num: "03", type: "Interactive Builder · 45–60 min", title: "Client Success System Builder", desc: "Build your onboarding, communication rhythm, value tracker, and retainer plan in one sitting. Leave with everything operational." },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 40px 80px" }} className="fade-up">
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 20 }}>
        Margin &amp; Momentum™ · First 90 Days Trifecta
      </span>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 9vw, 88px)", lineHeight: 0.9, color: "#0a0a0a", marginBottom: 28, letterSpacing: 1 }}>
        YOUR FIRST<br /><span style={{ WebkitTextStroke: "2px #0a0a0a", color: "transparent" }}>90 DAYS</span><br />TRIFECTA
      </h1>
      <div style={{ width: 48, height: 3, background: "#0a0a0a", marginBottom: 28 }} />
      <p style={{ fontSize: 15, lineHeight: 1.85, color: "#444", marginBottom: 56, maxWidth: 560 }}>
        Landing the client was step one. Keeping them — and turning them into stable monthly income — is what these three tools are built for. The next 90 days are the most important 90 days of your VA business.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {tools.map((t, i) => (
          <button key={t.id} onClick={() => onSelect(t.id)} style={{
            display: "grid", gridTemplateColumns: "64px 1fr auto", alignItems: "center", gap: 24,
            padding: "28px 32px", border: "1.5px solid #0a0a0a",
            background: i === 0 ? "#0a0a0a" : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s",
          }}
            onMouseEnter={e => { if (i !== 0) e.currentTarget.style.background = "#f5f5f5"; }}
            onMouseLeave={e => { if (i !== 0) e.currentTarget.style.background = "#fff"; }}
          >
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: i === 0 ? "#fff" : "#0a0a0a", lineHeight: 1 }}>{t.num}</span>
            <div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: i === 0 ? "#888" : "#aaa", display: "block", marginBottom: 6 }}>{t.type}</span>
              <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 16, fontWeight: 700, color: i === 0 ? "#fff" : "#0a0a0a", display: "block", marginBottom: 6 }}>{t.title}</span>
              <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 13, lineHeight: 1.6, color: i === 0 ? "#aaa" : "#666" }}>{t.desc}</span>
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: i === 0 ? "#fff" : "#0a0a0a" }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 1 — AUDIT
// ─────────────────────────────────────────────────────────────────────────────
function Tool1({ onBack }) {
  const [stage, setStage]           = useState("intro");
  const [qIndex, setQIndex]         = useState(0);
  const [answers, setAnswers]       = useState({});
  const [selected, setSelected]     = useState(null);
  const [email, setEmail]           = useState("");
  const [firstName, setFirstName]   = useState("");
  const [result, setResult]         = useState(null);
  const [scores, setScores]         = useState(null);
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
  const ey = { fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 20 };
  const bt = { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(42px, 8vw, 72px)", lineHeight: 0.92, color: "#0a0a0a", letterSpacing: 1, marginBottom: 28 };

  return (
    <div>
      <div style={{ height: 3, background: "#ebebeb" }}><div style={{ height: "100%", background: "#0a0a0a", width: `${progress}%`, transition: "width 0.5s ease" }} /></div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "56px 40px 80px" }} className="fade-up">

        {stage === "intro" && (
          <>
            <span style={ey}>Diagnostic Audit · First 90 Days Trifecta</span>
            <h2 style={bt}>FIRST CLIENT<br /><span style={{ WebkitTextStroke: "2px #0a0a0a", color: "transparent" }}>READINESS</span><br />AUDIT</h2>
            <div style={{ width: 40, height: 3, background: "#0a0a0a", marginBottom: 28 }} />
            <p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#333", marginBottom: 36 }}>You got the client. That was the hard part — but it wasn't the last part. The next 90 days decide whether this becomes a one-time project or the start of stable monthly income. This audit finds out exactly where you're at risk of losing what you just worked so hard to get.</p>
            <div style={{ display: "flex", gap: 32, marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid #e8e8e8", flexWrap: "wrap" }}>
              {[["10", "Questions"], ["5", "Minutes"], ["1", "Clear risk"]].map(([n, l]) => (
                <div key={l} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#0a0a0a", lineHeight: 1 }}>{n}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#aaa" }}>{l}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => setStage("quiz")}>Find my risk →</button>
          </>
        )}

        {stage === "quiz" && currentQ && (
          <div key={qIndex} className="fade-up">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 10 }}>{currentQ.section}</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#ccc", display: "block", marginBottom: 28 }}>Question {qIndex + 1} of {QUESTIONS.length}</span>
            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 700, lineHeight: 1.35, color: "#0a0a0a", marginBottom: 36 }}>{currentQ.question}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 44 }}>
              {currentQ.options.map((opt, i) => {
                const sel = selected === opt;
                return (
                  <button key={i} onClick={() => setSelected(opt)} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 22px", border: `1.5px solid ${sel ? "#0a0a0a" : "#e0e0e0"}`, background: sel ? "#0a0a0a" : "#fff", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s" }}>
                    <div style={{ flexShrink: 0, width: 24, height: 24, border: `1.5px solid ${sel ? "#fff" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 10, color: sel ? "#0a0a0a" : "#ccc", background: sel ? "#fff" : "transparent", marginTop: 1 }}>{sel ? "✓" : MARKERS[i]}</div>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 14, lineHeight: 1.6, color: sel ? "#fff" : "#333" }}>{opt.text}</span>
                  </button>
                );
              })}
            </div>
            <button className="btn-primary" onClick={nextQuestion} disabled={!selected} style={{ opacity: selected ? 1 : 0, transition: "opacity 0.2s", pointerEvents: selected ? "all" : "none" }}>
              {qIndex < QUESTIONS.length - 1 ? "Next question →" : "See my result →"}
            </button>
          </div>
        )}

        {stage === "gate" && (
          <div className="fade-up">
            <span style={ey}>Audit Complete · Your Result Is Ready</span>
            <h2 style={{ ...bt, marginBottom: 24 }}>YOUR RISK<br />IS IDENTIFIED.</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#333", marginBottom: 36, maxWidth: 480 }}>Enter your name and email to get your personalized diagnosis — exactly where you're at risk of losing this client and the one thing to fix right now.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420 }}>
              <input className="mm-input" type="text" placeholder="Your first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
              <input className="mm-input" type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} />
              <button className="btn-primary" onClick={submitEmail} disabled={!email || !firstName || submitting}>{submitting ? "One moment..." : "Show me my risk →"}</button>
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1, color: "#bbb", marginTop: 16 }}>No spam. Just your result and your next step.</p>
          </div>
        )}

        {stage === "result" && result && scores && (
          <div className="fade-up">
            <div style={{ borderBottom: "2px solid #0a0a0a", paddingBottom: 32, marginBottom: 40 }}>
              <span style={ey}>{firstName ? `${firstName}'s` : "Your"} First Client Readiness Diagnosis</span>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(34px, 6vw, 60px)", lineHeight: 0.92, color: "#0a0a0a", letterSpacing: 1, marginBottom: 20 }}>{RESULTS[result].code}</div>
              <p style={{ fontSize: 15, fontStyle: "italic", lineHeight: 1.65, color: "#333", paddingLeft: 20, borderLeft: "3px solid #0a0a0a", maxWidth: 520 }}>{RESULTS[result].tagline}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, background: "#0a0a0a", border: "1.5px solid #0a0a0a", marginBottom: 44 }}>
              {Object.entries(scores).map(([key, val]) => {
                const dom = result === key;
                return (
                  <div key={key} style={{ background: dom ? "#0a0a0a" : "#fff", padding: "18px 16px" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "#888", display: "block", marginBottom: 6 }}>{dom ? "Primary risk" : "Also present"}</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: dom ? "#fff" : "#0a0a0a", display: "block", lineHeight: 1, marginBottom: 8 }}>{val}</span>
                    <div style={{ height: 3, background: dom ? "#444" : "#ebebeb", marginBottom: 8 }}><div style={{ height: "100%", background: dom ? "#fff" : "#0a0a0a", width: `${(val / maxScore) * 100}%` }} /></div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: dom ? "#fff" : "#0a0a0a", fontWeight: 500 }}>{KILLER_NAMES[key]}</span>
                  </div>
                );
              })}
            </div>
            {[["What This Means Right Now", RESULTS[result].diagnosis], ["What It's Costing You", RESULTS[result].costs], ["Your Immediate Fix", RESULTS[result].fix]].map(([label, text]) => (
              <div key={label} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #ebebeb" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 14 }}>{label}</span>
                <p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#222" }}>{text}</p>
              </div>
            ))}
            <div style={{ background: "#0a0a0a", padding: 32, marginBottom: 32 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#888", display: "block", marginBottom: 14 }}>Your Next Step</span>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#e8e8e8" }}>{RESULTS[result].next}</p>
            </div>
            <button className="btn-outline" onClick={onBack}>← Back to all tools</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 2 — BLUEPRINT
// ─────────────────────────────────────────────────────────────────────────────
function Tool2({ onBack }) {
  const [active, setActive]         = useState(0);
  const [showPrompt, setShowPrompt] = useState(null);
  const sec = BLUEPRINT_SECTIONS[active];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 40px 80px" }} className="fade-up">
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 20 }}>Guide · First 90 Days Trifecta</span>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(44px, 8vw, 76px)", lineHeight: 0.92, color: "#0a0a0a", letterSpacing: 1, marginBottom: 28 }}>THE FIRST<br /><span style={{ WebkitTextStroke: "2px #0a0a0a", color: "transparent" }}>90 DAYS</span><br />BLUEPRINT</h2>
      <div style={{ width: 40, height: 3, background: "#0a0a0a", marginBottom: 28 }} />
      <p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#333", marginBottom: 40 }}>Three shifts that turn your first client relationship into a retainer before the project ends. Each one comes with an AI prompt you can use today.</p>

      <div style={{ display: "flex", gap: 2, marginBottom: 48, flexWrap: "wrap" }}>
        {BLUEPRINT_SECTIONS.map((s, i) => (
          <button key={i} onClick={() => { setActive(i); setShowPrompt(null); }} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", padding: "10px 18px", border: "1.5px solid #0a0a0a", cursor: "pointer", background: active === i ? "#0a0a0a" : "#fff", color: active === i ? "#fff" : "#0a0a0a", transition: "all 0.15s" }}>{s.number}</button>
        ))}
      </div>

      <div key={active} className="fade-up">
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 8 }}>{sec.number}</span>
        <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 700, color: "#0a0a0a", marginBottom: 8 }}>{sec.title}</h3>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#888", marginBottom: 24 }}>{sec.subtitle}</p>
        <p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#333", marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #ebebeb" }}>{sec.body}</p>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 10 }}>The Action</span>
        <h4 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 17, fontWeight: 700, color: "#0a0a0a", marginBottom: 14 }}>{sec.action}</h4>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "#333", marginBottom: 24 }}>{sec.action_desc}</p>
        <button className="btn-outline" style={{ marginBottom: 4 }} onClick={() => setShowPrompt(showPrompt === active ? null : active)}>{showPrompt === active ? "Hide AI prompt ↑" : "View AI prompt →"}</button>
        {showPrompt === active && (
          <div style={{ background: "#f5f5f5", border: "1.5px solid #e0e0e0", padding: 24, marginTop: 20, marginBottom: 8 }} className="fade-up">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "#888", display: "block", marginBottom: 12 }}>Copy this prompt into ChatGPT or Claude</span>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, lineHeight: 1.9, color: "#333", whiteSpace: "pre-wrap" }}>{sec.ai_prompt}</p>
          </div>
        )}
        <div style={{ background: "#0a0a0a", padding: "16px 20px", marginTop: 24 }}>
          <span style={{ fontSize: 16, color: "#fff" }}>— </span>
          <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 13, fontStyle: "italic", lineHeight: 1.7, color: "#e8e8e8" }}>{sec.highlight}</span>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 44, flexWrap: "wrap" }}>
          {active > 0 && <button className="btn-outline" onClick={() => { setActive(active - 1); setShowPrompt(null); }}>← Previous shift</button>}
          {active < BLUEPRINT_SECTIONS.length - 1
            ? <button className="btn-primary" onClick={() => { setActive(active + 1); setShowPrompt(null); }}>Next shift →</button>
            : <button className="btn-outline" onClick={onBack}>← Back to all tools</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 3 — BUILDER
// ─────────────────────────────────────────────────────────────────────────────
function Tool3({ onBack }) {
  const [checked, setChecked] = useState({});
  const [active, setActive]   = useState(0);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const getPct = (comp) => Math.round((comp.steps.filter(s => checked[s.id]).length / comp.steps.length) * 100);
  const totalSteps = SYSTEM_COMPONENTS.reduce((a, c) => a + c.steps.length, 0);
  const totalDone  = SYSTEM_COMPONENTS.reduce((a, c) => a + c.steps.filter(s => checked[s.id]).length, 0);
  const overallPct = Math.round((totalDone / totalSteps) * 100);
  const comp = SYSTEM_COMPONENTS[active];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 40px 80px" }} className="fade-up">
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 20 }}>Interactive Builder · First 90 Days Trifecta</span>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 7vw, 68px)", lineHeight: 0.92, color: "#0a0a0a", letterSpacing: 1, marginBottom: 28 }}>CLIENT SUCCESS<br /><span style={{ WebkitTextStroke: "2px #0a0a0a", color: "transparent" }}>SYSTEM BUILDER</span></h2>
      <div style={{ width: 40, height: 3, background: "#0a0a0a", marginBottom: 28 }} />
      <p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#333", marginBottom: 20 }}>Build the four systems that protect your first client relationship and turn it into a retainer — in one sitting. Check off each step as you complete it.</p>

      <div style={{ background: "#f5f5f5", padding: "20px 24px", marginBottom: 44, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#888" }}>Overall Progress</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#0a0a0a" }}>{totalDone}/{totalSteps} steps</span>
          </div>
          <div style={{ height: 4, background: "#e0e0e0" }}><div style={{ height: "100%", background: "#0a0a0a", width: `${overallPct}%`, transition: "width 0.4s ease" }} /></div>
        </div>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#0a0a0a", lineHeight: 1 }}>{overallPct}%</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 44 }}>
        {SYSTEM_COMPONENTS.map((c, i) => {
          const pct = getPct(c);
          const isActive = active === i;
          return (
            <button key={i} onClick={() => setActive(i)} style={{ padding: "16px 12px", border: "1.5px solid #0a0a0a", background: isActive ? "#0a0a0a" : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: isActive ? "#fff" : "#0a0a0a", display: "block", lineHeight: 1, marginBottom: 6 }}>{c.number}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: "#888", display: "block", marginBottom: 8 }}>{pct}% done</span>
              <div style={{ height: 2, background: isActive ? "#444" : "#ebebeb" }}><div style={{ height: "100%", background: isActive ? "#fff" : "#0a0a0a", width: `${pct}%`, transition: "width 0.3s" }} /></div>
            </button>
          );
        })}
      </div>

      <div key={active} className="fade-up">
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 8 }}>Component {comp.number}</span>
        <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, color: "#0a0a0a", marginBottom: 16 }}>{comp.title}</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "#555", marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid #ebebeb" }}>{comp.desc}</p>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 20 }}>Build Steps</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
          {comp.steps.map((step, i) => {
            const done = !!checked[step.id];
            return (
              <button key={step.id} onClick={() => toggle(step.id)} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 20px", border: `1.5px solid ${done ? "#0a0a0a" : "#e0e0e0"}`, background: done ? "#0a0a0a" : "#fff", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.2s" }}>
                <div style={{ flexShrink: 0, width: 22, height: 22, border: `1.5px solid ${done ? "#fff" : "#ccc"}`, background: done ? "#fff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 10, color: done ? "#0a0a0a" : "#ccc", marginTop: 2 }}>{done ? "✓" : i + 1}</div>
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 13.5, lineHeight: 1.75, color: done ? "#aaa" : "#333", textDecoration: done ? "line-through" : "none" }}>{step.text}</span>
              </button>
            );
          })}
        </div>
        {getPct(comp) === 100 && (
          <div style={{ background: "#0a0a0a", padding: "24px 28px", marginBottom: 32 }} className="fade-up">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#888", display: "block", marginBottom: 12 }}>Component Complete ✓</span>
            <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "#e8e8e8" }}>{comp.output}</p>
          </div>
        )}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {active > 0 && <button className="btn-outline" onClick={() => setActive(active - 1)}>← Previous</button>}
          {active < SYSTEM_COMPONENTS.length - 1
            ? <button className="btn-primary" onClick={() => setActive(active + 1)}>Next component →</button>
            : overallPct === 100
              ? (
                <div style={{ background: "#0a0a0a", padding: "20px 28px", width: "100%" }} className="fade-up">
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#888", display: "block", marginBottom: 10 }}>Client Success System Complete</span>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: "#e8e8e8", marginBottom: 16 }}>Your Client Success System is built. The onboarding, the communication rhythm, the value tracker, the retainer plan — all operational. Your first 90 days are now something you run, not something that happens to you. Systems Over Hustle™.</p>
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: "#666", marginBottom: 20 }}>Ready for what comes after? The Lean Trifecta shows you how to keep clients long-term and build stable monthly retainer income.</p>
                  <button className="btn-outline" onClick={onBack} style={{ background: "transparent", borderColor: "#fff", color: "#fff" }}>← Back to all tools</button>
                </div>
              )
              : <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: "#aaa", paddingTop: 16 }}>Complete all steps to finish your system.</p>
          }
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("hub");

  return (
    <div className="app">
      <style>{GLOBAL_CSS}</style>
      <header className="hdr">
        <div className="hdr-left">
          {view !== "hub" && <button className="back-btn" onClick={() => setView("hub")}>← All tools</button>}
          <a href="https://systems.marginmomentum.co" className="brand" style={{textDecoration:"none"}}>Margin &amp; Momentum™</a>
        </div>
        <div className="tag">Systems Over Hustle™</div>
      </header>

      <main className="mm-main">
        {view === "hub" && <Hub onSelect={id => setView(id)} />}
        {view === "t1"  && <Tool1 onBack={() => setView("hub")} />}
        {view === "t2"  && <Tool2 onBack={() => setView("hub")} />}
        {view === "t3"  && <Tool3 onBack={() => setView("hub")} />}
      </main>

      <footer className="ftr">
        <span className="ftr-l">Margin &amp; Momentum™</span>
        <span className="ftr-r">Systems Over Hustle™</span>
      </footer>
    </div>
  );
}
