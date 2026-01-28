# Development Guide

Ensure your code is _declarative_, _elegant_, _functional_, and _maintainable_. Prefer expressions, avoid nesting, and return early. Check your work using type checks linting, and the browser. After completing a task, commit your work.

## Commands

- Dev: `npm run dev` - Start development server
- Build: `npm run build` — bundles the project for production
- Type check: `npm run typecheck` — uses the TS typechecker to check for errors (prefer this over build when checking your work)
- Lint: `npm run lint` — uses ESLint to check for errors

## Standards

- Stack: Vue.js, Vue Router, vanilla reactive data stores, Tailwind
- Patterns: ALWAYS use Composition API with `<script setup lang="ts">`, NEVER use Options API
- ONLY add meaningful comments that explain why something is done, not what it does

## Vue Components

- Name files and components using PascalCase
- Compose names from general to specific (e.g., `SearchButtonClear`)
- Props: define with `defineProps<...>()` and TypeScript types; use `const props =` only if you reference `props` in script
- Naming: camelCase in JS for props and emits; kebab-case in templates for props and emits
- Templates: prefer prop shorthand (`:count`) and slot shorthand (`#default`)

## Tailwind

- GENERALLY, do not use top and bottom margin or padding to create space between elements, create a container with a flex layout and a gap for this.

## Pages and Routing

- Avoid files named `index.vue`; use meaningful names or groups instead
- ALWAYS use explicit, descriptive route param names (e.g., `userId`, `postSlug`)
- Use named route locations for type safety and clarity
