<div align="center">

# 🧠 CORTEX

### Personal Intelligence & Memory OS

**From fragmented conversations to durable context and better decisions.**

[![Product](https://img.shields.io/badge/Product-Personal%20Intelligence-ffad1f?style=for-the-badge&labelColor=17120d)](#the-memory-loop)
[![Core](https://img.shields.io/badge/Core-Memory%20%C2%B7%20Retrieval%20%C2%B7%20Ownership-6f52ff?style=for-the-badge&labelColor=17120d)](#product-system)
[![Status](https://img.shields.io/badge/Status-Public%20Product%20Showcase-ffffff?style=for-the-badge&labelColor=17120d)](#showcase--privacy)

</div>

<p align="center">
  <img src="docs/cortex-overview.png" alt="CORTEX personal intelligence system and living memory map" width="100%" />
</p>

> **CORTEX is a user-owned memory layer for AI-powered work.** It turns conversations, documents, voice notes, decisions and durable preferences into connected context that remains visible, searchable and reusable.

---

## Why CORTEX

Most AI conversations disappear into a timeline. The useful context is scattered, decisions lose their rationale, preferences must be repeated and every new assistant starts almost from zero.

CORTEX converts that fragmentation into a memory system:

| Memory problem | CORTEX response |
|:--|:--|
| **“Where did that decision come from?”** | Preserve the event, source, date, domain and connected evidence |
| **“What does my AI know about me?”** | Make retained context visible in a living memory map |
| **“Why must I repeat the same rules?”** | Store durable instructions separately from temporary requests |
| **“Can I question my own history?”** | Answer from the user’s memory rather than generic model recall |
| **“What happens if I change models?”** | Keep memory readable and exportable outside the AI provider |
| **“Who owns the data?”** | Store the source of truth in the user’s own Google Drive |

---

## Product system

CORTEX is organised around six connected capabilities:

| Capability | What CORTEX does | Result |
|:--|:--|:--|
| **Capture** | Ingest conversations, notes, voice and documents | Valuable context stops disappearing |
| **Structure** | Separate history, instructions, prompts, knowledge and documents | Each memory has a clear role |
| **Connect** | Link related memories across projects, dates and domains | Context becomes a network instead of a folder |
| **Retrieve** | Ground answers in the user’s own memory | The assistant recalls without pretending to know |
| **Guide** | Apply durable preferences and working rules | Collaboration improves from one session to the next |
| **Preserve** | Keep JSON, Markdown and documents readable and exportable | Memory survives tools, models and interfaces |

---

## The memory loop

```mermaid
flowchart LR
    A["Capture<br/>conversation · voice · document"] --> B["Qualify<br/>keep only what matters"]
    B --> C["Structure<br/>history · rule · prompt · knowledge"]
    C --> D["Connect<br/>people · projects · dates · domains"]
    D --> E["Retrieve<br/>ask the memory"]
    E --> F["Decide<br/>act with context"]
    F -. "new evidence" .-> A
```

The objective is not to remember everything. It is to retain the **minimum durable context** that makes the next decision faster, clearer and more reliable.

---

## Product tour

### 01 — See memory as a living system

The mental map makes retained context inspectable: every node has a type, domain, date, source and relationship to other memories.

<p align="center">
  <img src="docs/cortex-overview.png" alt="CORTEX living memory map with connected history, instructions, knowledge, prompts and documents" width="100%" />
</p>

### 02 — Ask what your memory actually knows

The conversation layer answers from the user’s own context. When evidence is missing, the system is designed to say so instead of inventing an answer.

<p align="center">
  <img src="docs/cortex-memory-chat.png" alt="CORTEX grounded conversation with the user's connected memory" width="100%" />
</p>

### 03 — Turn events into a durable narrative

Decisions and milestones become a chronological, readable story that can be filtered by life domain and exported as Markdown.

<p align="center">
  <img src="docs/cortex-life-story.png" alt="CORTEX life and decision history organised as a readable narrative" width="100%" />
</p>

### 04 — Make working preferences explicit

Durable instructions are kept separate from project facts. The assistant can therefore respect the way the user wants to work without confusing a temporary request with a permanent rule.

<p align="center">
  <img src="docs/cortex-instructions.png" alt="CORTEX durable instruction wall for reliable AI collaboration" width="100%" />
</p>

### 05 — Keep the source of truth readable and yours

The memory is stored in the user’s own Drive, synchronised across devices and exportable as JSON and Markdown. The model can change; the memory does not disappear with it.

<p align="center">
  <img src="docs/cortex-data-ownership.png" alt="CORTEX data ownership, synchronisation and export controls" width="100%" />
</p>

---

## A connected transformation stack

CORTEX is the memory layer of a broader product system:

```mermaid
flowchart LR
    A["Boussole<br/>Prioritise · Govern · Measure"] --> B["Local AI<br/>Execute · Orchestrate · Deliver"]
    B --> C["CORTEX<br/>Remember · Connect · Learn"]
    C -. "durable context" .-> A
    C -. "reusable knowledge" .-> B
```

- **[Boussole](https://github.com/abbas-mistrah/boussole)** shows where transformation should go and how value is proven.
- **[Local AI](https://github.com/abbas-mistrah/lebon-ai)** gives teams an agentic workspace to execute the work.
- **CORTEX** preserves the context, rules and learning that make every new cycle stronger.

---

## Architecture

```mermaid
flowchart TB
    subgraph Inputs["Capture surfaces"]
      A["AI conversations"]
      B["Quick notes and voice"]
      C["Documents and links"]
      D["Manual decisions"]
    end

    subgraph Cortex["CORTEX memory engine"]
      E["Qualification and classification"]
      F["Deduplication and linking"]
      G["Instruction wall and retrieval"]
      H["History and export engine"]
    end

    subgraph Ownership["User-owned foundation"]
      I["Google Drive · cortex-data.json"]
      J["Readable history.md"]
      K["Document library"]
    end

    subgraph Outputs["Intelligence surfaces"]
      L["Living memory map"]
      M["Grounded conversation"]
      N["Reusable prompts and rules"]
      O["Durable personal narrative"]
    end

    A --> E
    B --> E
    C --> E
    D --> E
    E --> F --> G --> H
    F <--> I
    H --> J
    C --> K
    G --> L
    G --> M
    G --> N
    H --> O
```

The current implementation is a dependency-light Google Apps Script web application with a browser cache for responsiveness, Drive-backed persistence and an optional model layer for classification, transcription and grounded conversation.

---

## Product principles

1. **Visibility before trust.** The user can see what is remembered, why it is connected and how to correct it.
2. **Memory is editorial, not exhaustive.** CORTEX keeps what will matter again; noise is a failure mode.
3. **Facts, rules and prompts are different objects.** Clear separation prevents context from becoming an ungoverned blob.
4. **No evidence, no invention.** Missing context must remain visible as missing context.
5. **Ownership beats lock-in.** Data stays readable outside the interface and independent of the current model.
6. **F3 by default.** Read in 5 seconds, understand in 30 seconds, act in 2 clicks.

---

## Showcase & privacy

This repository presents the product logic and selected interface views of CORTEX.

All public screenshots use:

- fictional demonstration memories and documents;
- deliberately generic projects, decisions and metrics;
- no production records, private conversations or employer data;
- no passwords, API keys or confidential identifiers.

The visuals demonstrate the real interface and product behaviour; they are not exports of a personal memory dataset.

---

## Product leadership

**Abbas Mistrah** — AI Transformation, Product & Governance  
[mistrah.com](https://mistrah.com) · [LinkedIn](https://www.linkedin.com/in/abbas-mistrah-b0b53119a) · [ORCID](https://orcid.org/0009-0009-5944-585X)

<div align="center">

**Keep the context. Connect the learning. Make the next decision better.**

</div>
