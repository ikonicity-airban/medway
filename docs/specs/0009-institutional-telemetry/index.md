# 0009 Institutional Population Health Telemetry Feed

**Status**: Accepted
**Date**: 2026-11-20

## Summary

The Institutional Population Health Telemetry Feed provides public health administrators, university medical directorships, and tertiary health insurance schemes (TISHIP) with real time, privacy preserving visibility into campus health logistics. The system aggregates search volumes by medication category, facility stockout frequencies, and clinic queue wait trends into high contrast accessible visualizations without capturing or storing any student personal identifiers.

## Context

During campus outbreaks such as seasonal malaria spikes, typhoid clusters in specific hostels, or examination period stress related analgesia demand surges, university administrators and state epidemiologists lack actionable signal until clinics overflow. Furthermore, stockouts at campus health centres remain invisible to HMO monitors until complaints escalate. By compiling anonymized search queries, facility stockout alerts, and counter check in counts directly from offline storage, MedWay equips institutional stakeholders with population level logistics intelligence while enforcing a strict zero student PII boundary.

## Requirements

- User story: As the UNN Director of Medical Services, I want to review daily search trends across medication categories so our procurement team can order replenishment stocks before total stockout occurs.
- User story: As a TISHIP coordinator, I want to monitor stockout incident rates and average clinic queue wait times across campus facilities to evaluate service delivery bottlenecks.
- User story: As a student privacy advocate, I want verification that institutional telemetry contains zero personal identifiers, zero IP addresses, and zero matriculation numbers.
- AC-1: Telemetry aggregation pipeline must calculate total category searches, stockout counts, and queue congestion distributions strictly from non PII telemetry records.
- AC-2: The telemetry view must be accessible at the route /telemetry and display high contrast SVG based data charts (category search volume breakdown and facility queue status) complying with WCAG AA contrast.
- AC-3: All telemetry calculations must run client side against local storage datasets with fallback sample data for demonstration when offline records are sparse.
- AC-4: An export control must enable downloading anonymized aggregated statistics as structured JSON without any individual timestamps or student identifiers.
- AC-5: Navigation links to the institutional telemetry view must be discoverable in the application header or footer.

## Options considered

### Option 1: Client Side Aggregation with Vector SVG Visualizations
- Pros: Zero external server dependencies; operates offline on campus networks; zero transmission risk of student identifiers; accessible pure SVG rendering with high contrast.
- Cons: Visualizations limited to datasets stored in the local client or synchronized cache.

### Option 2: Cloud Based SaaS Analytics (Google Analytics, Mixpanel, Datadog)
- Pros: Multi year data warehousing.
- Cons: Violates zero PII guarantees via third party cookie tracking and IP logging; breaks offline functionality; requires expensive monthly cloud subscriptions.

## Decision

Chosen option: Option 1 (Client Side Aggregation with Vector SVG Visualizations). Client side mathematical aggregation guarantees zero student tracking while delivering instant visual feedback across mobile and desktop displays.

## Consequences

- Positive: Total student privacy protection; fully functional offline; instant report generation; zero third party tracking scripts.
- Negative: Historical data is bounded by local browser storage limits until voluntary institutional export.
- Neutral: Aggregated figures reflect campus care router searches rather than confirmed diagnostic laboratory results.
