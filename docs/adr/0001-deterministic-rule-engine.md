# 0001: Deterministic Rule Engine Over Generative AI Triage

**Status:** Accepted  
**Date:** 2026-11-20

## Context & Problem Statement

The MedWay engineering team consists of Computer Science builders without licensed in-house medical practitioners. Integrating LLM-based symptom checkers introduces unacceptable clinical hallucination risks, legal liability, and network failure modes during campus connectivity drops.

## Decision Outcome

Chosen option: "Deterministic Rule Engine Over Generative AI Triage", using a boolean WHO/Red Cross emergency screening checklist and a mathematical logistics routing algorithm.

## Consequences

- **Positive:** Eliminates hallucination risk; zero medical diagnosis liability; sub-5ms offline execution latency; regulatory safety.
- **Negative / Trade-offs:** Lacks conversational free-text natural language symptom entry.

## Considered Options

- Deterministic Rule Engine (Chosen)
- Generative AI Diagnostic Chatbot (Rejected: Unacceptable clinical liability and offline failure modes)
