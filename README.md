# GAME_NAME

> A fast-paced 2D action roguelike about enforcement, escalation, and the cost of efficient violence.

---

## TABLE OF CONTENTS

- [Overview](#overview)
- [Design Pillars](#design-pillars)
- [Core Fantasy](#core-fantasy)
- [Core Loop](#core-loop)
- [Player Mechanics](#player-mechanics)
  - [Movement](#movement)
  - [Combat](#combat)
- [Run Structure](#run-structure)
- [Systems & Progression](#systems--progression)
- [Enemy Design](#enemy-design)
- [Boss Philosophy](#boss-philosophy)
- [Meta Progression](#meta-progression)
- [Visual & Audio Direction](#visual--audio-direction)
- [Technical Architecture](#technical-architecture)
- [Inspirations](#inspirations)
- [Development Roadmap](#development-roadmap)
- [Task Checklist](#task-checklist)
- [Commit History](#commit-history)

---

## OVERVIEW

**GAME_NAME** is a room-based 2D action roguelike built in HTML Canvas and vanilla JavaScript.

Each run places you inside a procedurally assembled enforcement district controlled by a failing administrative regime. Your job is simple:

Clear resistance.  
Process anomalies.  
Advance the sector.

You will not finish the system.  
You will escalate within it.

---

## DESIGN PILLARS

### 1. Speed Over Sprawl
No sprawling map.  
No backtracking labyrinth.

Combat rooms. Escalation. Choice nodes. Boss.

Tight, replayable loops.

---

### 2. Aggression Is Rewarded
Standing still gets you killed.

The system rewards:
- Mobility
- Precision
- Controlled risk

---

### 3. Builds Over Branches
Player power comes from:
- Temporary run modifiers
- Synergistic upgrades
- Trade-offs, not linear growth

---

### 4. Escalation Is the Story
Each floor grows harsher:
- Faster enemies
- Denser rooms
- Modifier stacking

The system adapts to efficiency.

---

## CORE LOOP

> Enter Run → Clear Combat Room → Choose Reward → Escalate Difficulty → Face Sector Boss → Extract → Permanent Unlocks

### Per Room

1. Enter sealed combat arena  
2. Survive waves or eliminate targets  
3. Room locks until cleared  
4. Select one of 2–3 upgrades  
5. Proceed to next node  

### Run Ends When

- Health reaches zero  
- Final boss defeated  
- You voluntarily extract (rare mechanic)  

Runs are designed for **15–30 minutes max**.

---

## PLAYER MECHANICS

### Movement

Built for responsiveness and flow.

- **Dash**
  - Fast, short invulnerability window
  - Directional
  - Core survival mechanic

- **Double Jump**
  - Air correction tool

- **Ground Sprint**
  - High-risk positioning tool

Movement remains the most polished system.

Combat difficulty comes from positioning, not stat inflation.

---

### Combat

Fast. Clean. High consequence.

#### Primary Attack
- Melee combo chain
- Cancel into dash
- Short recovery window

#### Secondary Ability
- Ranged or utility skill
- Limited charges or cooldown

#### Ultimate
- Charged by damage dealt or taken
- Screen-clearing effect
- High risk, high reward

---

## RUN STRUCTURE

Each run consists of:

### 1. Sector Entry
- Basic enemies
- Minimal modifiers
- Establish build direction

### 2. Escalation Layer
- Elite enemy variants
- Environmental hazards
- First synergy spike

### 3. Distortion Layer
- Stacked room modifiers
- Faster spawns
- Mini-boss encounter

### 4. Sector Boss
- Pattern-heavy fight
- Designed around dash mastery
- Tests build coherence

---

## SYSTEMS & PROGRESSION

### In-Run Systems

| System     | Description                                  |
|------------|----------------------------------------------|
| Integrity  | Player health                                |
| Clearance  | Currency gained per room                     |
| Directives | Run modifiers (buffs/debuffs)                |
| Escalation | Global difficulty scaler                     |

---

### Upgrade Types

- Flat stat boosts  
- Conditional damage (e.g., bonus after dash)  
- On-hit effects  
- Movement alterations  
- Risk modifiers (high damage, low health builds)  

Build depth comes from stacking interactions.

---

## ENEMY DESIGN

Enemies are simple individually, dangerous in groups.

Types include:

- **Chaser** – closes distance rapidly  
- **Sniper** – slow windup projectile  
- **Suppressor** – area denial  
- **Splitter** – divides on death  
- **Shield Unit** – directional blocking  

Each enemy pressures a different player habit.

---

## BOSS PHILOSOPHY

Bosses are not HP sponges.

They test:

- Dash timing  
- Spatial awareness  
- Build viability  

Bosses escalate patterns over phases.

No cutscenes.  
Minimal downtime.  
Immediate reset on death.

---

## META PROGRESSION

Between runs, players unlock:

- New upgrade pools  
- Weapon variants  
- Starting bonuses  
- Cosmetic changes  

Meta progression increases **variety**, not raw power.

Skilled players can win early.

---

## VISUAL & AUDIO DIRECTION

### Visuals

- High contrast  
- Strong silhouettes  
- Minimalist arenas  
- UI integrated into world space  

Runs must remain readable at high speed.

---

### Audio

- Impact-heavy combat sounds  
- Subtle escalating music layers  
- Audio cues for dash timing and elite spawns  

Clarity over ambience.

---

## TECHNICAL ARCHITECTURE

Designed for scalability within web constraints.

- HTML Canvas  
- Vanilla JavaScript  
- Centralized GameManager  
- State-driven architecture  
- Entity-based modular structure  
- Object pooling for performance  
- Deterministic room generation  

No external engine.  
No heavy frameworks.  

Optimized for portfolio visibility and code clarity.

---

## INSPIRATIONS

- *Hades* — run-based escalation and build synergies  
- *Dead Cells* — responsive movement and combat flow  
- *ULTRAKILL* — readable chaos and fast paced combat
- *Risk of Rain* — scaling pressure and stacking modifiers  

---

## DEVELOPMENT ROADMAP

### Phase 1 — Combat Core
- Finalize movement feel  
- Dash polish  
- Basic melee chain  
- 3 enemy types  
- Room lock system  

### Phase 2 — Run Structure
- Node map generation  
- Reward selection system  
- Upgrade framework  
- Mini-boss implementation  

### Phase 3 — Depth
- 10+ upgrade types  
- 6+ enemy types  
- Elite variants  
- Full boss encounter  

### Phase 4 — Polish
- Visual clarity pass  
- Performance optimization  
- Meta progression system  
- UI refinement  
- Sound integration  

---

## TASK CHECKLIST

### Core Engine
- [x] GameManager architecture  
- [x] Collision system  
- [x] Camera system  
- [ ] Object pooling  
- [ ] Deterministic RNG seed system  

### Player
- [x] Dash logic  
- [x] Double jump  
- [ ] Attack combo system  
- [ ] Hurtbox / hitbox separation  
- [ ] Invulnerability frames  

### Combat
- [x] Enemy base class  
- [ ] Wave spawner  
- [ ] Elite modifier system  
- [ ] Boss framework  
- [ ] Damage feedback system  

### Run Systems
- [ ] Room generator  
- [ ] Reward selection UI  
- [ ] Upgrade stacking logic  
- [ ] Escalation scaler  
- [ ] Run summary screen  

### Meta
- [ ] Unlock system  
- [ ] Persistent save  
- [ ] Starting loadout variants  

---

> “EFFICIENCY IS MERCY.”  
> “CLEARANCE GRANTED.”  
> “ESCALATION APPROVED.”  
> “YOU WERE REPLACED BEFORE YOU FAILED.”  

---

## COMMIT HISTORY

| #   | Commit                          | Description                                                                                            |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | Refactoring Progress (P1)       | Core architecture rebuilt: MAIN → GAMEMANAGER → GAMELOOP → STATEMANAGER → ENTITYMANAGER → PLAYER       |
| 2   | Refactoring Progress (P2)       | Bug fixes, sizing logic, refined movement, early level infrastructure                                  |
| 3   | Refactoring Progress (P3)       | Debug trajectory, improved collision detection, camera system, level system, core player movement      |
| 4   | Created New Preliminary Systems | Combat manager, interaction manager, ui + hud, better collision detection, ramp level object           |
| 5   | Updated Level System            | Created a more in-depth level, adjusted some ramp physics, began constructing python level editor      |
| 6   | Refined Object Instantiation    | Trimmed and refactored object instantiation, improved and simplified collision, interaction foundation |
| 7   | Attack Implementation & Enemies | Allowed player attacking, added enemies and adjusted gameManager declaration, interactable door        |
| 8   | Interaction & Improved Editor   | Added UI to the door interaction, cleaned up varius redundant code, massive editor upgrade (still WIP) |
| 9   | Main Menu & Editor Change       | Converted editor into HTML/JS for ease of use, added main menu, began working on level swapping        |
| 10  | Major Genre Change and "Rebrand"| Removed editor (bye 4 hours), removed any other bloat, layed groundwork for new roguelike system       |