export type CustomFadeOptions = {
  initialOpacity?: number;
  duration?: string | number;
  delay?: string | number;
  easing?: string;
};

export type TransitionAnimation = {
  name: string; // name is required for a single animation definition
  delay?: number | string;
  duration?: number | string;
  easing?: string;
  fillMode?: string;
  direction?: string;
  style?: Record<string, string>;
};

export type TransitionAnimationPair = {
  old: TransitionAnimation | TransitionAnimation[];
  new: TransitionAnimation | TransitionAnimation[];
};

export type TransitionDirectionalAnimations = {
  forwards: TransitionAnimationPair;
  backwards: TransitionAnimationPair;
};

export function customFade(options: CustomFadeOptions = {}): TransitionDirectionalAnimations {
  const {
    initialOpacity = 0,
    duration = '0.5s',
    easing = 'ease-in-out',
    delay,
  } = options;

  const baseState = {
    duration,
    easing,
    delay,
    fillMode: 'both' as const,
  };

  const incomingAnimate: TransitionAnimation = {
    name: 'customFadeIn',
    ...baseState,
    style: {
      '--fade-from': String(initialOpacity),
      '--fade-to': '1',
    },
  };

  const outgoingAnimate: TransitionAnimation = {
    name: 'customFadeOut',
    ...baseState,
    style: {
      '--fade-from': '0',
      '--fade-to': '1',
    },
  };

  return {
    forwards: {
      old: outgoingAnimate,
      new: incomingAnimate,
    },
    backwards: {
      old: outgoingAnimate,
      new: incomingAnimate,
    },
  };
}
