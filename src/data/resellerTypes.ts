// Shared types for the reseller ↔ business agent-setup prototype.
// A reseller authors an agent workflow once; each business it's launched to
// must independently complete the handful of fields that are theirs
// (tags, users/roles, templates, brand assets, etc).

export type ToolKey = 'assign-tags' | 'publish-response' | 'create-ticket' | 'share-social'

export type ViewerRole =
  | { type: 'reseller' }
  | { type: 'business'; id: string; name: string }

export type ToolConfigStatus = Partial<Record<ToolKey, boolean>>

export const ALL_TOOL_KEYS: ToolKey[] = ['assign-tags', 'publish-response', 'create-ticket', 'share-social']

// Tools the "Review response agent replying autonomously" workflow actually wires up
// (see rra-7/rra-9/rra-10 in agentWorkflows.ts) — `assign-tags` isn't attached to any
// node by default, so it must not block this agent from reaching "Active".
export const REVIEW_RESPONSE_REQUIRED_TOOLS: ToolKey[] = ['publish-response', 'create-ticket', 'share-social']

// requiredKeys defaults to every possible tool, but callers should pass the
// specific tools a given agent's workflow actually uses — an agent that never
// wires up e.g. `assign-tags` should not be blocked from "Active" by it.
export function isFullyConfigured(status: ToolConfigStatus | undefined, requiredKeys: ToolKey[] = ALL_TOOL_KEYS): boolean {
  if (!status) return false
  return requiredKeys.every((key) => status[key])
}

// Single source of truth for a business's status on the shared "Review response
// agent replying autonomously" agent — used by both the agents table and the
// workflow editor's own header chip, so the two never disagree.
export function getReviewResponseBusinessStatus(
  viewerRole: ViewerRole,
  businessAgentSetup: Record<string, ToolConfigStatus>,
  businessPaused: Record<string, boolean>,
): string {
  if (viewerRole.type !== 'business') return 'Live'
  if (businessPaused[viewerRole.id]) return 'Paused'
  return isFullyConfigured(businessAgentSetup[viewerRole.id], REVIEW_RESPONSE_REQUIRED_TOOLS) ? 'Active' : 'Needs setup'
}
