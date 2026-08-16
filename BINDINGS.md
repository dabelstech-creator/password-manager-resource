Bindings data and schema

This file (`quirks/bindings.json`) and schema (`quirks/schemas/bindings-schema.json`) introduce a structured binding model to represent domain ↔ app ↔ passkey/shared-credential associations.

Fields:
- domain: domain the entry applies to
- app_ids: Apple App IDs or bundle identifiers associated
- binding_type: one of shared-credentials, passkey, association, legacy
- trust_level: observed | tested | verified
- device_scope: device-bound | device-independent | unverified
- source_evidence: array of strings (URLs, notes)
- last_reviewed: ISO date
- status: active | historical | deprecated | blocked

The existing `tools/validate-json-schemas.sh` will validate `quirks/bindings.json` against its schema as long as the schema file is present at `quirks/schemas/bindings-schema.json`.
