-- Migration 007: Remove Policy Templates (replaced by Policy Compliance Checker)
-- The policy_templates table was used for the Policy Library feature, which is now replaced
-- by the Policy Compliance Checker that analyzes user-uploaded documents against statute requirements.

DROP TABLE IF EXISTS policy_templates CASCADE;
