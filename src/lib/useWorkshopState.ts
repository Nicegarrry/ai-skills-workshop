"use client";

/**
 * useWorkshopState — React binding for the persisted workshop store.
 *
 * Reads the `WorkshopState` via `useSyncExternalStore` (SSR-safe: a stable
 * server snapshot keeps first-paint markup consistent, then the client snapshot
 * — restored from localStorage — takes over after hydration). Exposes typed
 * mutators that the lab uses instead of `setState`, so persistence happens
 * automatically on every change and a refresh never loses work.
 */
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { workshopStore } from "@/lib/workshop-store";
import type {
  SkillFields,
  VoiceFields,
  WorkshopState,
} from "@/lib/types";

export type WorkshopApi = {
  state: WorkshopState;
  /** False during SSR / first paint; true once localStorage is read on the client. */
  hydrated: boolean;
  /** Shallow-merge a patch into the root state. */
  patch: (next: Partial<WorkshopState>) => void;
  /** Shallow-merge a patch into the SKILL.md fields. */
  patchSkill: (next: Partial<SkillFields>) => void;
  /** Shallow-merge a patch into the voice.md fields. */
  patchVoice: (next: Partial<VoiceFields>) => void;
  /** Replace state wholesale (e.g. re-seed from a scenario). */
  replace: (next: WorkshopState) => void;
  /** Clear persisted state and return to a fresh initial state. */
  reset: () => void;
};

export function useWorkshopState(): WorkshopApi {
  const { state, hydrated } = useSyncExternalStore(
    workshopStore.subscribe,
    workshopStore.getSnapshot,
    workshopStore.getServerSnapshot,
  );

  const patch = useCallback((next: Partial<WorkshopState>) => {
    workshopStore.update((prev) => ({ ...prev, ...next }));
  }, []);

  const patchSkill = useCallback((next: Partial<SkillFields>) => {
    workshopStore.update((prev) => ({
      ...prev,
      skill: { ...prev.skill, ...next },
    }));
  }, []);

  const patchVoice = useCallback((next: Partial<VoiceFields>) => {
    workshopStore.update((prev) => ({
      ...prev,
      voice: { ...prev.voice, ...next },
    }));
  }, []);

  const replace = useCallback((next: WorkshopState) => {
    workshopStore.update(() => next);
  }, []);

  const reset = useCallback(() => {
    workshopStore.reset();
  }, []);

  return useMemo(
    () => ({ state, hydrated, patch, patchSkill, patchVoice, replace, reset }),
    [state, hydrated, patch, patchSkill, patchVoice, replace, reset],
  );
}
