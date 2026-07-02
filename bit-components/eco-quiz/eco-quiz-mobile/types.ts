/**
 * A single quiz question about animals or the environment.
 */
export type Question = {
  /** Unique identifier of the question. */
  id: number;
  /** The question text shown to the player. */
  text: string;
  /** List of possible answers. */
  options: string[];
  /** Index of the correct answer inside `options`. */
  correctIndex: number;
  /** Short explanation shown after answering. */
  explanation: string;
  /** Theme of the question. */
  category: 'animaux' | 'oceans' | 'environnement';
};

/**
 * A solidarity cause that receives the ad revenue.
 */
export type Cause = {
  /** Unique key of the cause. */
  key: 'spa' | 'oceans';
  /** Display label of the cause. */
  label: string;
  /** Emoji icon representing the cause. */
  icon: string;
  /** Accumulated funds in euros. */
  amount: number;
};
