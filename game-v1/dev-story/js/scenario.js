/**
 * dev-story/js/scenario.js
 * Opening dialogue scenes for the Sam Rivera developer story.
 * The 'open-bob' sentinel redirects to scene-developer.html
 * which runs the existing game engine with developer.json.
 */

const DEV_STORY_SCENES = [

  // ── Opening narration ────────────────────────────────────────────────────────
  {
    type: 'narration',
    text: 'Friday, 3:47 PM.\nThe CEO just forwarded a Slack message to the entire engineering channel.'
  },

  // ── Sam discovers the message ────────────────────────────────────────────────
  {
    type: 'dialogue',
    char: 'sam',
    expr: 'stressed',
    text: 'Taylor. TAYLOR.\n\nDid you see the Slack? The CEO wants the company website redesigned. By Monday. I\'m the only frontend dev on this. I haven\'t touched that CSS in two years.'
  },

  {
    type: 'dialogue',
    char: 'taylor',
    expr: 'lecturing',
    text: 'I saw it. How bad is the current site?'
  },

  {
    type: 'dialogue',
    char: 'sam',
    expr: 'stressed',
    text: 'It\'s flat white with system fonts and hardcoded hex colours everywhere. No variables, no responsive layout, nothing. The CEO called it "embarrassing" in the message. In writing. To everyone.'
  },

  {
    type: 'dialogue',
    char: 'taylor',
    expr: 'lecturing',
    text: 'Okay. Before you spiral — have you tried Bob?'
  },

  {
    type: 'dialogue',
    char: 'sam',
    expr: 'skeptical',
    text: 'Bob. The AI thing IT rolled out last month?'
  },

  {
    type: 'dialogue',
    char: 'taylor',
    expr: 'lecturing',
    text: 'It\'s not just an AI thing. I used it last week to audit our entire infrastructure config. It found three misconfigurations I\'d been missing for months.\n\nJust open it. Tell it your problem. Exactly like you told me.'
  },

  {
    type: 'dialogue',
    char: 'sam',
    expr: 'skeptical',
    text: 'You\'re serious.'
  },

  {
    type: 'dialogue',
    char: 'taylor',
    expr: 'relief',
    text: 'Monday delivery. Open Bob.'
  },

  {
    type: 'dialogue',
    char: 'sam',
    expr: 'stressed',
    text: 'Fine. If this doesn\'t work I\'m blaming you.\n\n...\n\nOkay. Opening it now.'
  },

  // ── Handoff narration — Bob chat opens after this ────────────────────────────
  {
    type: 'narration',
    text: 'Sam opens IBM Bob inside VS Code.\nFor the first time.'
  },

  // Sentinel: redirect to the existing developer scene
  { type: 'open-bob' }

];
