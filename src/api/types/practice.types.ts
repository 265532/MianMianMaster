/** 练习题 */
export interface PracticeQuestion {
  id: number;
  title: string;
  description: string;
  question_type: string;
  difficulty: string;
  options: { id: string; text: string }[];
  correct_answer: string;
}

/** 题库（练习用视图模型，从 Course 映射） */
export interface PracticeBank {
  id: number;
  title: string;
  description: string;
  level: string;
  question_count: number;
  estimated_time: string;
  pass_rate: number;
  questions: PracticeQuestion[];
}
