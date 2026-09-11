import { useEffect, useRef, useState } from 'react';
import type { Answers } from '../types/survey';

/**
 * Bump this whenever the shape of `PersistedState` or the option-id scheme in
 * data/survey.ts changes, so stale answers are discarded instead of silently
 * mapping onto the wrong options.
 */
export const STORAGE_VERSION = 1;

const STORAGE_KEY = 'islamic-app-requirements-survey';

export interface PersistedState {
  version: number;
  answers: Answers;
  sectionIndex: number;
  updatedAt: string;
}

export type SaveStatus = 'idle' | 'saving' | 'saved';

/** Reads saved progress. Returns null for missing, corrupt, or outdated data. */
export function loadPersistedState(): PersistedState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed?.version !== STORAGE_VERSION || typeof parsed.answers !== 'object') return null;
    if (!parsed.answers || Object.keys(parsed.answers).length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPersistedState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable (private mode) — nothing to clear */
  }
}

/**
 * Debounced autosave. Writing on every keystroke would be wasteful and would
 * make the "saved" indicator flicker; 600ms is long enough to batch typing and
 * short enough that an accidental refresh costs nothing.
 */
export function useAutosave(answers: Answers, sectionIndex: number): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>('idle');
  /**
   * The mounted-with values. Comparing identities (rather than counting
   * renders) keeps this correct under StrictMode's double-invoked effects —
   * otherwise the indicator flashes "جارٍ الحفظ…" before anything is edited.
   */
  const mountedWith = useRef({ answers, sectionIndex });

  useEffect(() => {
    if (
      answers === mountedWith.current.answers &&
      sectionIndex === mountedWith.current.sectionIndex
    ) {
      return;
    }

    setStatus('saving');
    const writeTimer = window.setTimeout(() => {
      // After "مسح جميع الإجابات" there is nothing to keep — leave no record
      // behind rather than storing an empty one.
      if (Object.keys(answers).length === 0) {
        clearPersistedState();
        setStatus('idle');
        return;
      }

      const payload: PersistedState = {
        version: STORAGE_VERSION,
        answers,
        sectionIndex,
        updatedAt: new Date().toISOString(),
      };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setStatus('saved');
      } catch {
        setStatus('idle');
      }
    }, 600);

    return () => window.clearTimeout(writeTimer);
  }, [answers, sectionIndex]);

  return status;
}
