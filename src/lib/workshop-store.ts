/**
 * workshop-store — a tiny external store over the persisted `WorkshopState`.
 *
 * The build lab subscribes to this via `useSyncExternalStore` (see
 * `useWorkshopState`), which is the SSR-safe, lint-clean way to read
 * client-only `localStorage` without a mount effect that cascades renders:
 *  - `getServerSnapshot` returns a deterministic fresh state during SSR /
 *    first paint, so server and client markup agree on the first render,
 *  - `getSnapshot` returns the cached client state, re-read from storage only
 *    when a write bumps the internal revision (so the reference stays stable
 *    between renders, as `useSyncExternalStore` requires).
 *
 * State is mutated through `update`/`reset`, which persist to `localStorage`
 * (via `storage.ts`) and notify subscribers. Nothing here imports React.
 */
import {
  createInitialState,
  loadState,
  saveState,
  clearState,
} from "@/lib/storage";
import type { WorkshopState } from "@/lib/types";

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * The stable server snapshot — `hydrated: false` so the lab can render a
 * skeleton on the server / first client paint and avoid both a hydration
 * mismatch and a one-frame flash of step 1 when resuming mid-flow. Created once
 * at module load so the reference is constant across every server render
 * (React requires a cached snapshot).
 */
const serverSnapshot: WorkshopSnapshot = {
  state: createInitialState(),
  hydrated: false,
};

/**
 * The state + a `hydrated` flag, surfaced together so a single
 * `useSyncExternalStore` subscription drives both the data and the "ready to
 * paint" gate (no separate mount effect / setState-in-effect needed).
 */
export type WorkshopSnapshot = {
  state: WorkshopState;
  hydrated: boolean;
};

/**
 * The cached client snapshot. `null` until the first client read, then kept in
 * sync with `localStorage` and only replaced when `update`/`reset` run — so
 * repeated `getSnapshot()` calls return an identical reference between writes.
 */
let clientSnapshot: WorkshopSnapshot | null = null;

function ensureClientSnapshot(): WorkshopSnapshot {
  if (clientSnapshot === null) {
    clientSnapshot = { state: loadState(), hydrated: true };
  }
  return clientSnapshot;
}

function emit(): void {
  for (const listener of listeners) listener();
}

export const workshopStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /** Client snapshot — stable reference until the next write. */
  getSnapshot(): WorkshopSnapshot {
    return ensureClientSnapshot();
  },

  /** Deterministic snapshot for SSR / hydration. */
  getServerSnapshot(): WorkshopSnapshot {
    return serverSnapshot;
  },

  /** Apply a pure updater, persist, and notify subscribers. */
  update(updater: (prev: WorkshopState) => WorkshopState): void {
    const prev = ensureClientSnapshot();
    const nextState = updater(prev.state);
    if (nextState === prev.state) return;
    clientSnapshot = { state: nextState, hydrated: true };
    saveState(nextState);
    emit();
  },

  /** Clear persisted state and reset to a fresh initial snapshot. */
  reset(): WorkshopState {
    clearState();
    const fresh = createInitialState();
    clientSnapshot = { state: fresh, hydrated: true };
    emit();
    return fresh;
  },
};
