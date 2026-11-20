# Domain Glossary

Ubiquitous language and canonical terminology for the MedWay Campus Care Router & Pre-Triage platform.

## Terms

**Red-Flag Escalation**:
A deterministic clinical safety gate based on WHO/Red Cross emergency danger signs. Triggering any indicator locks out retail pharmacy routing and immediately redirects the user to 24/7 hospital emergency facilities.
*Avoid*: Diagnostic triage, AI triage, clinical consultation.

**TISHIP (Tertiary Institution Social Health Insurance Programme)**:
The mandatory federal student health insurance scheme covering outpatient consultations and essential national formulary medications at the campus medical center at ₦0 point-of-care cost.
*Avoid*: HMO insurance, commercial policy.

**TISHIP Hard Lock**:
A routing constraint that strictly prevents MedWay from rerouting a student away from the UNN Medical Centre to commercial pharmacies when the student selects a ₦0 cash budget, regardless of clinic queue congestion or wait times.
*Avoid*: Default reroute, auto-redirect.

**PCN-Verified Pharmacy**:
A private community pharmacy licensed by the Pharmacy Council of Nigeria (PCN) that has undergone physical in-person verification, credential onboarding, and active inventory telemetry compliance.
*Avoid*: Chemist, patent medicine store, drug vendor.

**Care Need Category**:
Broad, non-diagnostic logistical classification buckets used to track pharmacy stock availability without prescribing branded pharmaceuticals: Antimalarials (ACT), Analgesics & Fever, Typhoid / Lab Test, ORS & Hydration.
*Avoid*: Prescription, drug order, medical diagnosis.

**Crowd Telemetry**:
Real-time queue congestion ratings submitted by students on-site. Telemetry confidence decays over a 30-minute window unless validated by transactional counter check-in tokens.
*Avoid*: Permanent queue status, static wait time.

**Counter Check-In Token**:
A cryptographic or verifiable token generated during intake pass generation that is confirmed when presented or scanned at a participating counter, providing proof of presence to validate queue and stock telemetry.
*Avoid*: Check-in badge, reward point.

**Digital Pre-Visit Intake Pass**:
A client-generated, privacy-preserving, non-diagnostic summary slip (identifier format `MW-UNN-XXX`) formatted as a student self-advocacy tool displaying declared allergies, care need categories, and red-flag clearance status.
*Avoid*: Medical ticket, prescription slip, doctor referral.

**Institutional Population Health Telemetry**:
Aggregated, anonymized intelligence reports derived from search frequency, stockout events, and clinic queue loads sold to university administrators, HMO syndicates, and public health agencies.
*Avoid*: Student medical data, personal health records.

**Dual-Tier Emergency Facilities**:
The two primary accredited 24/7 emergency casualty destinations in Nsukka: UNN Medical Centre Emergency Casualty Bay (on-campus, covered by TISHIP) and Bishop Shanahan Specialist Hospital (off-campus, accredited mission hospital).
*Avoid*: Chemist, private dispensary, day clinic.
