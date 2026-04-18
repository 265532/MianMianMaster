// 测评系统工具函数

// 测评问题类型定义
export interface AssessmentQuestion {
  id: number;
  category: string;
  subcategory?: string;
  question: string;
  type: 'single' | 'multiple' | 'scale' | 'text';
  options?: Array<{
    value: string;
    label: string;
    score?: number;
  }>;
  weight: number;
  description?: string;
}

// 测评结果类型定义
export interface AssessmentResult {
  score: number;
  percentage: number;
  totalPossibleScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  personalityType?: string;
  careerFit?: string[];
  skillGaps?: string[];
  detailedScores: Record<string, number>;
}

// 岗位匹配结果类型定义
export interface JobMatch {
  id: number;
  title: string;
  company: string;
  matchRate: number;
  salary: string;
  location: string;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  experience: string;
  education: string;
  benefits: string[];
  logo: string;
  isFavorite: boolean;
  companyInfo: string;
  jobType: string;
  publishDate: string;
  deadline: string;
}

// 测评类型定义
export type AssessmentType = 'jobSkill' | 'psychological' | 'technical' | 'learningPlan';

// 扩展的测评问题库
export const comprehensiveAssessmentQuestions: AssessmentQuestion[] = [
  // 岗位技能测评 - 前端开发
  {
    id: 1,
    category: '岗位技能',
    subcategory: '前端开发',
    question: '您熟悉哪些前端框架？',
    type: 'multiple',
    options: [
      { value: 'vue', label: 'Vue', score: 1 },
      { value: 'react', label: 'React', score: 1 },
      { value: 'angular', label: 'Angular', score: 1 },
      { value: 'svelte', label: 'Svelte', score: 1 },
      { value: 'other', label: '其他', score: 0.5 }
    ],
    weight: 5,
    description: '前端框架是现代前端开发的核心工具，熟悉多种框架会增加您的竞争力。'
  },
  {
    id: 2,
    category: '岗位技能',
    subcategory: '前端开发',
    question: '您的前端开发经验有多少年？',
    type: 'single',
    options: [
      { value: '1', label: '1年以下', score: 1 },
      { value: '2', label: '1-2年', score: 2 },
      { value: '3', label: '3-5年', score: 3 },
      { value: '5', label: '5年以上', score: 4 }
    ],
    weight: 5,
    description: '开发经验是评估技术能力的重要指标。'
  },
  {
    id: 3,
    category: '岗位技能',
    subcategory: '前端开发',
    question: '您熟悉TypeScript吗？',
    type: 'single',
    options: [
      { value: '0', label: '不熟悉', score: 0 },
      { value: '1', label: '了解基本概念', score: 1 },
      { value: '2', label: '能够使用', score: 2 },
      { value: '3', label: '熟练使用', score: 3 }
    ],
    weight: 4,
    description: 'TypeScript已成为现代前端开发的标准工具，掌握它会提高代码质量。'
  },
  {
    id: 4,
    category: '岗位技能',
    subcategory: '前端开发',
    question: '您了解前端性能优化吗？',
    type: 'single',
    options: [
      { value: '0', label: '不了解', score: 0 },
      { value: '1', label: '了解基本概念', score: 1 },
      { value: '2', label: '有实际优化经验', score: 2 },
      { value: '3', label: '精通性能优化策略', score: 3 }
    ],
    weight: 4,
    description: '性能优化是前端开发的重要能力，直接影响用户体验。'
  },
  
  // 岗位技能测评 - 后端开发
  {
    id: 5,
    category: '岗位技能',
    subcategory: '后端开发',
    question: '您熟悉哪些后端编程语言？',
    type: 'multiple',
    options: [
      { value: 'java', label: 'Java', score: 1 },
      { value: 'python', label: 'Python', score: 1 },
      { value: 'nodejs', label: 'Node.js', score: 1 },
      { value: 'go', label: 'Go', score: 1 },
      { value: 'php', label: 'PHP', score: 1 },
      { value: 'other', label: '其他', score: 0.5 }
    ],
    weight: 5,
    description: '后端编程语言是后端开发的基础，熟悉多种语言会增加您的适应性。'
  },
  {
    id: 6,
    category: '岗位技能',
    subcategory: '后端开发',
    question: '您熟悉哪些数据库系统？',
    type: 'multiple',
    options: [
      { value: 'mysql', label: 'MySQL', score: 1 },
      { value: 'postgresql', label: 'PostgreSQL', score: 1 },
      { value: 'mongodb', label: 'MongoDB', score: 1 },
      { value: 'redis', label: 'Redis', score: 1 },
      { value: 'other', label: '其他', score: 0.5 }
    ],
    weight: 4,
    description: '数据库是后端系统的核心组件，熟悉多种数据库系统会提高您的设计能力。'
  },
  {
    id: 7,
    category: '岗位技能',
    subcategory: '后端开发',
    question: '您有API设计经验吗？',
    type: 'single',
    options: [
      { value: '0', label: '没有', score: 0 },
      { value: '1', label: '了解RESTful API', score: 1 },
      { value: '2', label: '有实际设计经验', score: 2 },
      { value: '3', label: '精通API设计原则', score: 3 }
    ],
    weight: 4,
    description: 'API设计是后端开发的重要技能，良好的API设计会提高系统的可维护性。'
  },
  
  // 职业心理测评
  {
    id: 8,
    category: '职业心理',
    subcategory: '工作动机',
    question: '您选择当前职业的主要动机是什么？',
    type: 'single',
    options: [
      { value: '0', label: '薪资待遇', score: 1 },
      { value: '1', label: '个人兴趣', score: 2 },
      { value: '2', label: '职业发展', score: 2 },
      { value: '3', label: '社会价值', score: 2 }
    ],
    weight: 3,
    description: '了解您的工作动机有助于找到更适合的职业发展路径。'
  },
  {
    id: 9,
    category: '职业心理',
    subcategory: '压力管理',
    question: '当工作压力较大时，您通常会如何应对？',
    type: 'single',
    options: [
      { value: '0', label: '感到焦虑，难以应对', score: 0 },
      { value: '1', label: '尝试放松，调整心态', score: 1 },
      { value: '2', label: '制定计划，逐步解决', score: 2 },
      { value: '3', label: '将压力转化为动力', score: 3 }
    ],
    weight: 3,
    description: '压力管理能力是职业成功的重要因素。'
  },
  {
    id: 10,
    category: '职业心理',
    subcategory: '职业价值观',
    question: '在选择工作时，您最看重什么？',
    type: 'multiple',
    options: [
      { value: 'salary', label: '薪资水平' },
      { value: 'growth', label: '成长空间' },
      { value: 'culture', label: '企业文化' },
      { value: 'balance', label: '工作生活平衡' },
      { value: 'impact', label: '工作影响力' },
      { value: 'stability', label: '工作稳定性' }
    ],
    weight: 3,
    description: '职业价值观会影响您的职业满意度和长期发展。'
  },
  {
    id: 11,
    category: '职业心理',
    subcategory: '自我认知',
    question: '您如何评价自己的学习能力？',
    type: 'single',
    options: [
      { value: '0', label: '学习速度较慢', score: 0 },
      { value: '1', label: '学习能力一般', score: 1 },
      { value: '2', label: '学习能力较强', score: 2 },
      { value: '3', label: '学习能力突出', score: 3 }
    ],
    weight: 3,
    description: '自我认知是职业发展的基础，准确的自我评估有助于制定合理的发展计划。'
  },
  
  // 综合技术测评
  {
    id: 12,
    category: '综合技术',
    subcategory: '技术广度',
    question: '您了解哪些技术领域？',
    type: 'multiple',
    options: [
      { value: 'frontend', label: '前端开发', score: 1 },
      { value: 'backend', label: '后端开发', score: 1 },
      { value: 'mobile', label: '移动开发', score: 1 },
      { value: 'devops', label: 'DevOps', score: 1 },
      { value: 'ai', label: '人工智能', score: 1 },
      { value: 'security', label: '网络安全', score: 1 }
    ],
    weight: 4,
    description: '技术广度反映了您的综合技术能力和适应性。'
  },
  {
    id: 13,
    category: '综合技术',
    subcategory: '技术深度',
    question: '在您的专业领域，您的技术深度如何？',
    type: 'single',
    options: [
      { value: '0', label: '了解基本概念', score: 1 },
      { value: '1', label: '能够应用现有技术', score: 2 },
      { value: '2', label: '能够解决复杂问题', score: 3 },
      { value: '3', label: '能够创新和优化技术', score: 4 }
    ],
    weight: 4,
    description: '技术深度反映了您在专业领域的精通程度。'
  },
  {
    id: 14,
    category: '综合技术',
    subcategory: '问题解决',
    question: '当遇到技术难题时，您通常会怎么做？',
    type: 'single',
    options: [
      { value: '0', label: '寻求他人帮助', score: 0.5 },
      { value: '1', label: '查阅文档', score: 1 },
      { value: '2', label: '尝试不同解决方案', score: 2 },
      { value: '3', label: '分析问题根因并系统性解决', score: 3 }
    ],
    weight: 4,
    description: '问题解决能力是技术人员的核心能力之一。'
  },
  {
    id: 15,
    category: '综合技术',
    subcategory: '持续学习',
    question: '您如何保持技术知识的更新？',
    type: 'multiple',
    options: [
      { value: 'docs', label: '阅读官方文档', score: 1 },
      { value: 'blog', label: '阅读技术博客', score: 1 },
      { value: 'course', label: '参加在线课程', score: 1 },
      { value: 'community', label: '参与技术社区', score: 1 },
      { value: 'conference', label: '参加技术会议', score: 1 },
      { value: 'project', label: '通过项目实践学习', score: 1 }
    ],
    weight: 3,
    description: '持续学习能力是技术人员保持竞争力的关键。'
  },
  
  // MBTI 性格测评完整版
  {
    id: 16,
    category: '性格测评',
    subcategory: 'MBTI',
    question: '在社交场合中，您更倾向于：',
    type: 'single',
    options: [
      { value: 'E', label: '外向，喜欢与人交流', score: 1 },
      { value: 'I', label: '内向，喜欢独处思考', score: 0 }
    ],
    weight: 2,
    description: '了解您的性格倾向有助于找到更适合的工作环境。'
  },
  {
    id: 17,
    category: '性格测评',
    subcategory: 'MBTI',
    question: '您获取信息的方式更倾向于：',
    type: 'single',
    options: [
      { value: 'S', label: '通过感官，注重事实和细节', score: 1 },
      { value: 'N', label: '通过直觉，注重可能性和未来', score: 0 }
    ],
    weight: 2,
    description: '不同的信息获取方式适合不同类型的工作。'
  },
  {
    id: 18,
    category: '性格测评',
    subcategory: 'MBTI',
    question: '您做决策的方式更倾向于：',
    type: 'single',
    options: [
      { value: 'T', label: '基于逻辑和客观分析', score: 1 },
      { value: 'F', label: '基于价值观和情感考虑', score: 0 }
    ],
    weight: 2,
    description: '决策方式会影响您在团队中的角色和贡献。'
  },
  {
    id: 19,
    category: '性格测评',
    subcategory: 'MBTI',
    question: '您的生活方式更倾向于：',
    type: 'single',
    options: [
      { value: 'J', label: '有计划，喜欢结构化', score: 1 },
      { value: 'P', label: '灵活，喜欢 spontaneity', score: 0 }
    ],
    weight: 2,
    description: '生活方式偏好会影响您的工作风格和满意度。'
  },
  
  // 学习计划测评
  {
    id: 20,
    category: '学习计划',
    subcategory: '学习目标',
    question: '您的学习目标是什么？',
    type: 'multiple',
    options: [
      { value: 'certification', label: '获取认证' },
      { value: 'skillUpgrade', label: '技能提升' },
      { value: 'careerChange', label: '职业转型' },
      { value: 'promotion', label: '晋升加薪' },
      { value: 'knowledge', label: '知识拓展' }
    ],
    weight: 3,
    description: '明确的学习目标有助于制定有效的学习计划。'
  },
  {
    id: 21,
    category: '学习计划',
    subcategory: '学习时间',
    question: '您每周能投入多少时间学习？',
    type: 'single',
    options: [
      { value: '0', label: '1-5小时', score: 1 },
      { value: '1', label: '6-10小时', score: 2 },
      { value: '2', label: '11-20小时', score: 3 },
      { value: '3', label: '20小时以上', score: 4 }
    ],
    weight: 3,
    description: '学习时间投入会影响学习计划的制定和执行。'
  },
  {
    id: 22,
    category: '学习计划',
    subcategory: '学习方式',
    question: '您偏好哪种学习方式？',
    type: 'multiple',
    options: [
      { value: 'online', label: '在线课程' },
      { value: 'book', label: '书籍阅读' },
      { value: 'project', label: '项目实践' },
      { value: 'mentor', label: '导师指导' },
      { value: 'community', label: '社区交流' }
    ],
    weight: 3,
    description: '不同的学习方式适合不同的学习内容和个人风格。'
  }
];

// 按测评类型分类的问题
export const getQuestionsByType = (type: AssessmentType): AssessmentQuestion[] => {
  switch (type) {
    case 'jobSkill':
      return comprehensiveAssessmentQuestions.filter(q => q.category === '岗位技能');
    case 'psychological':
      return comprehensiveAssessmentQuestions.filter(q => q.category === '职业心理' || q.category === '性格测评');
    case 'technical':
      return comprehensiveAssessmentQuestions.filter(q => q.category === '综合技术');
    case 'learningPlan':
      return comprehensiveAssessmentQuestions.filter(q => q.category === '学习计划');
    default:
      return [];
  }
};

// 计算测评结果
export const calculateAssessmentResult = (answers: any[], type?: AssessmentType): AssessmentResult => {
  // 根据测评类型筛选问题
  const questions = type ? getQuestionsByType(type) : comprehensiveAssessmentQuestions;
  
  // 计算总分和百分比
  const totalPossibleScore = questions.reduce((total, q) => {
    if (q.type === 'single') {
      const maxScore = Math.max(...q.options!.map(opt => 'score' in opt ? opt.score || 0 : 0));
      return total + maxScore * q.weight;
    } else if (q.type === 'multiple') {
      const maxScore = q.options!.reduce((sum, opt) => sum + ('score' in opt ? opt.score || 1 : 1), 0);
      return total + maxScore * q.weight;
    } else if (q.type === 'scale') {
      return total + 5 * q.weight; // 假设 scale 是 1-5 分
    } else {
      return total + q.weight; // 文本题默认满分
    }
  }, 0);
  
  let score = 0;
  const categoryScores: Record<string, number> = {};
  const categoryMaxScores: Record<string, number> = {};
  const subcategoryScores: Record<string, number> = {};
  const subcategoryMaxScores: Record<string, number> = {};
  
  // 计算得分并按类别统计
  answers.forEach((answer, index) => {
    const question = questions[index];
    if (!question) return;
    
    // 初始化类别分数
    if (!categoryScores[question.category]) {
      categoryScores[question.category] = 0;
      categoryMaxScores[question.category] = 0;
    }
    
    // 初始化子类别分数
    if (question.subcategory) {
      if (!subcategoryScores[question.subcategory]) {
        subcategoryScores[question.subcategory] = 0;
        subcategoryMaxScores[question.subcategory] = 0;
      }
    }
    
    // 计算本题最大可能分数
    let maxQuestionScore = 0;
    if (question.type === 'single') {
      maxQuestionScore = Math.max(...question.options!.map(opt => 'score' in opt ? opt.score || 0 : 0)) * question.weight;
    } else if (question.type === 'multiple') {
      const maxOptionScore = question.options!.reduce((sum, opt) => sum + ('score' in opt ? opt.score || 1 : 1), 0);
      maxQuestionScore = maxOptionScore * question.weight;
    } else if (question.type === 'scale') {
      maxQuestionScore = 5 * question.weight;
    } else {
      maxQuestionScore = question.weight;
    }
    
    // 累加类别最大分数
    categoryMaxScores[question.category] = (categoryMaxScores[question.category] || 0) + maxQuestionScore;
    if (question.subcategory) {
      subcategoryMaxScores[question.subcategory] = (subcategoryMaxScores[question.subcategory] || 0) + maxQuestionScore;
    }
    
    // 计算本题得分
    let questionScore = 0;
    if (question.type === 'single') {
      const selectedOption = question.options!.find(opt => opt.value === answer);
      if (selectedOption && 'score' in selectedOption && selectedOption.score !== undefined) {
        questionScore = selectedOption.score * question.weight;
      }
    } else if (question.type === 'multiple') {
      // 多选题得分基于选择的选项的分数总和
      if (Array.isArray(answer)) {
        questionScore = answer.reduce((sum, value) => {
          const option = question.options!.find(opt => opt.value === value);
          return sum + (option && 'score' in option ? option.score || 1 : 1);
        }, 0) * question.weight;
      }
    } else if (question.type === 'scale') {
      // 量表题直接使用分数
      questionScore = Number(answer) * question.weight;
    } else {
      // 文本题默认满分
      questionScore = question.weight;
    }
    
    // 累加总得分和类别得分
    score += questionScore;
    categoryScores[question.category] = (categoryScores[question.category] || 0) + questionScore;
    if (question.subcategory) {
      subcategoryScores[question.subcategory] = (subcategoryScores[question.subcategory] || 0) + questionScore;
    }
  });
  
  const scorePercentage = Math.round((score / totalPossibleScore) * 100);
  
  // 计算各维度得分百分比
  const detailedScores: Record<string, number> = {};
  Object.keys(categoryScores).forEach(category => {
    detailedScores[category] = Math.round(((categoryScores[category] || 0) / (categoryMaxScores[category] || 1)) * 100);
  });
  
  // 计算子类别得分百分比
  const subcategoryDetailedScores: Record<string, number> = {};
  Object.keys(subcategoryScores).forEach(subcategory => {
    subcategoryDetailedScores[subcategory] = Math.round(((subcategoryScores[subcategory] || 0) / (subcategoryMaxScores[subcategory] || 1)) * 100);
  });
  
  // 分析MBTI类型
  let mbtiType = '';
  const mbtiAnswers = answers.filter((_, index) => {
    const q = questions[index];
    return q && q.subcategory === 'MBTI';
  });
  
  if (mbtiAnswers.length === 4) {
    mbtiType = mbtiAnswers.join('');
  }
  
  // 生成测评结果
  const result: AssessmentResult = {
    score,
    percentage: scorePercentage,
    totalPossibleScore,
    strengths: [],
    weaknesses: [],
    recommendations: [],
    personalityType: mbtiType,
    careerFit: [],
    skillGaps: [],
    detailedScores
  };
  
  // 分析优势和劣势
  Object.entries(detailedScores).forEach(([category, categoryScore]) => {
    if (categoryScore >= 80) {
      result.strengths.push(category);
    } else if (categoryScore < 60) {
      result.weaknesses.push(category);
      result.skillGaps?.push(category);
    }
  });
  
  // 分析子类别优势和劣势
  Object.entries(subcategoryDetailedScores).forEach(([subcategory, subcategoryScore]) => {
    if (subcategoryScore >= 80) {
      result.strengths.push(subcategory);
    } else if (subcategoryScore < 60) {
      result.weaknesses.push(subcategory);
      result.skillGaps?.push(subcategory);
    }
  });
  
  // 基于测评类型和得分生成推荐
  switch (type) {
    case 'jobSkill':
      generateJobSkillRecommendations(result, scorePercentage, subcategoryDetailedScores);
      break;
    case 'psychological':
      generatePsychologicalRecommendations(result, scorePercentage, mbtiType);
      break;
    case 'technical':
      generateTechnicalRecommendations(result, scorePercentage, subcategoryDetailedScores);
      break;
    case 'learningPlan':
      generateLearningPlanRecommendations(result, scorePercentage, subcategoryDetailedScores);
      break;
    default:
      generateGeneralRecommendations(result, scorePercentage);
  }
  
  return result;
};

// 生成岗位技能测评推荐
const generateJobSkillRecommendations = (result: AssessmentResult, scorePercentage: number, subcategoryScores: Record<string, number>) => {
  if (scorePercentage >= 80) {
    result.recommendations = [
      '您的岗位技能非常出色，适合申请高级职位',
      '建议专注于技术深度的进一步提升',
      '可以考虑成为技术团队的核心成员',
      '注重软技能的培养，为未来的管理岗位做准备'
    ];
    result.careerFit = ['高级工程师', '技术专家', '技术 lead'];
  } else if (scorePercentage >= 60) {
    result.recommendations = [
      '您的岗位技能良好，适合申请中级职位',
      '建议加强专业技能的深度和广度',
      '参与更多实际项目，积累实战经验',
      '注重技术文档和代码质量的提升'
    ];
    result.careerFit = ['中级工程师', '项目负责人', '技术顾问'];
  } else {
    result.recommendations = [
      '您的岗位技能有待提升，建议从初级职位开始',
      '系统学习专业基础知识',
      '参与实习或培训项目，积累经验',
      '制定详细的学习计划，逐步提升技能'
    ];
    result.careerFit = ['初级工程师', '实习生', '技术助理'];
  }
  
  // 基于具体技能的建议
  if (subcategoryScores['前端开发'] && subcategoryScores['前端开发'] < 60) {
    result.recommendations.push('加强前端开发技能，特别是现代框架的使用');
  }
  if (subcategoryScores['后端开发'] && subcategoryScores['后端开发'] < 60) {
    result.recommendations.push('加强后端开发技能，特别是API设计和数据库管理');
  }
};

// 生成职业心理测评推荐
const generatePsychologicalRecommendations = (result: AssessmentResult, scorePercentage: number, mbtiType: string) => {
  if (scorePercentage >= 80) {
    result.recommendations = [
      '您的职业心理素质优秀，能够应对各种工作挑战',
      '建议根据自己的性格特点选择适合的工作环境',
      '注重工作与生活的平衡，保持良好的心态',
      '利用自己的优势，在职业发展中取得更大的成就'
    ];
  } else if (scorePercentage >= 60) {
    result.recommendations = [
      '您的职业心理素质良好，但仍有提升空间',
      '建议学习压力管理技巧，提高应对挑战的能力',
      '更清楚地认识自己的职业价值观和动机',
      '建立积极的职业心态，增强职业满意度'
    ];
  } else {
    result.recommendations = [
      '您的职业心理素质有待提升',
      '建议寻求职业咨询或心理辅导',
      '学习情绪管理和压力应对技巧',
      '重新评估自己的职业选择，找到更适合的发展方向'
    ];
  }
  
  // 基于MBTI类型的职业建议
  if (mbtiType) {
    switch (mbtiType) {
      case 'ESTJ':
        result.careerFit?.push('项目经理', '技术总监', '团队负责人');
        break;
      case 'ENTJ':
        result.careerFit?.push('技术领导者', '创业', '高级管理层');
        break;
      case 'ISTJ':
        result.careerFit?.push('系统架构师', '质量保证', '技术文档专家');
        break;
      case 'INTJ':
        result.careerFit?.push('技术专家', '解决方案架构师', '技术战略师');
        break;
      case 'ESFJ':
        result.careerFit?.push('技术支持', '团队协调', '技术培训');
        break;
      case 'ENFJ':
        result.careerFit?.push('技术培训', '产品管理', '用户体验');
        break;
      case 'ISFJ':
        result.careerFit?.push('技术文档', '用户体验', '技术支持');
        break;
      case 'INFJ':
        result.careerFit?.push('产品设计', '技术战略', '创新顾问');
        break;
      case 'ESTP':
        result.careerFit?.push('技术销售', '技术咨询', '现场工程师');
        break;
      case 'ENTP':
        result.careerFit?.push('创新工程师', '技术创业者', '解决方案专家');
        break;
      case 'ISTP':
        result.careerFit?.push('系统工程师', '网络安全专家', '硬件工程师');
        break;
      case 'INTP':
        result.careerFit?.push('研究工程师', '算法专家', '系统架构师');
        break;
      case 'ESFP':
        result.careerFit?.push('前端开发', '用户界面设计', '技术培训');
        break;
      case 'ENFP':
        result.careerFit?.push('产品经理', '技术创意', '用户体验设计');
        break;
      case 'ISFP':
        result.careerFit?.push('UI/UX设计', '创意开发', '游戏开发');
        break;
      case 'INFP':
        result.careerFit?.push('技术教育', '社会 impact 技术', '产品设计');
        break;
    }
  }
};

// 生成综合技术测评推荐
const generateTechnicalRecommendations = (result: AssessmentResult, scorePercentage: number, subcategoryScores: Record<string, number>) => {
  if (scorePercentage >= 80) {
    result.recommendations = [
      '您的综合技术能力优秀，是技术团队的核心资产',
      '建议专注于技术创新和领导力的提升',
      '可以尝试解决更复杂的技术挑战',
      '考虑成为技术领域的专家或导师'
    ];
    result.careerFit = ['技术专家', '架构师', '技术总监'];
  } else if (scorePercentage >= 60) {
    result.recommendations = [
      '您的综合技术能力良好，有很大的发展潜力',
      '建议加强技术广度和深度的平衡发展',
      '参与更多跨领域的项目，拓展技术视野',
      '注重持续学习，跟踪技术发展趋势'
    ];
    result.careerFit = ['高级工程师', '技术 lead', '解决方案架构师'];
  } else {
    result.recommendations = [
      '您的综合技术能力有待提升',
      '建议系统学习基础技术知识',
      '参与实际项目，积累实战经验',
      '制定结构化的学习计划，逐步提升技术水平'
    ];
    result.careerFit = ['初级工程师', '技术助理', '实习生'];
  }
  
  // 基于具体技术维度的建议
  if (subcategoryScores['技术广度'] && subcategoryScores['技术广度'] < 60) {
    result.recommendations.push('拓展技术视野，了解不同领域的技术');
  }
  if (subcategoryScores['技术深度'] && subcategoryScores['技术深度'] < 60) {
    result.recommendations.push('加深专业领域的技术深度，成为领域专家');
  }
  if (subcategoryScores['问题解决'] && subcategoryScores['问题解决'] < 60) {
    result.recommendations.push('加强问题解决能力的培养，多参与挑战性项目');
  }
  if (subcategoryScores['持续学习'] && subcategoryScores['持续学习'] < 60) {
    result.recommendations.push('建立持续学习的习惯，跟踪技术发展趋势');
  }
};

// 生成学习计划测评推荐
const generateLearningPlanRecommendations = (result: AssessmentResult, _scorePercentage: number, subcategoryScores: Record<string, number>) => {
  result.recommendations = [
    '根据您的学习目标和时间投入，制定个性化的学习计划',
    '选择适合自己的学习方式，提高学习效率',
    '建立学习习惯，保持持续学习的动力',
    '定期评估学习效果，调整学习计划'
  ];
  
  // 基于学习时间和方式的建议
  if (subcategoryScores['学习时间'] && subcategoryScores['学习时间'] < 60) {
    result.recommendations.push('合理安排学习时间，提高时间利用效率');
  }
  
  // 基于学习目标的建议
  if (subcategoryScores['学习目标'] && subcategoryScores['学习目标'] >= 80) {
    result.recommendations.push('您的学习目标明确，建议制定详细的学习路径');
  } else {
    result.recommendations.push('建议更明确地定义学习目标，提高学习的针对性');
  }
};

// 生成通用推荐
const generateGeneralRecommendations = (result: AssessmentResult, scorePercentage: number) => {
  if (scorePercentage >= 80) {
    result.recommendations = [
      '您的综合能力优秀，可以考虑申请高级职位',
      '建议专注于技术深度和领导力的提升',
      '可以尝试挑战更复杂的项目和技术难题',
      '考虑成为团队的技术骨干或领导者'
    ];
    result.careerFit = ['高级工程师', '技术专家', '技术管理者'];
  } else if (scorePercentage >= 60) {
    result.recommendations = [
      '您的能力良好，可以考虑申请中级职位',
      '建议加强技术广度和项目经验',
      '注重软技能的培养，尤其是沟通和团队协作',
      '可以尝试主导一些小型项目，积累经验'
    ];
    result.careerFit = ['中级工程师', '项目负责人', '技术顾问'];
  } else {
    result.recommendations = [
      '您的能力有待提升，建议从初级职位开始',
      '系统学习基础技术知识',
      '参与更多实际项目，积累经验',
      '注重基础知识的扎实掌握'
    ];
    result.careerFit = ['初级工程师', '实习生', '技术助理'];
  }
};

// 岗位匹配算法
export const calculateJobMatch = (assessmentResult: AssessmentResult, jobs: JobMatch[]): JobMatch[] => {
  return jobs.map(job => {
    // 基于测评结果计算匹配度
    let matchRate = 0;
    
    // 技术能力匹配
    if ((assessmentResult.detailedScores['技术能力'] || 0) >= 70) {
      matchRate += 30;
    } else if ((assessmentResult.detailedScores['技术能力'] || 0) >= 50) {
      matchRate += 20;
    } else {
      matchRate += 10;
    }
    
    // 项目经验匹配
    if ((assessmentResult.detailedScores['项目经验'] || 0) >= 70) {
      matchRate += 25;
    } else if ((assessmentResult.detailedScores['项目经验'] || 0) >= 50) {
      matchRate += 15;
    } else {
      matchRate += 5;
    }
    
    // 软技能匹配
    if ((assessmentResult.detailedScores['软技能'] || 0) >= 70) {
      matchRate += 20;
    } else if ((assessmentResult.detailedScores['软技能'] || 0) >= 50) {
      matchRate += 15;
    } else {
      matchRate += 10;
    }
    
    // 职业倾向匹配
    if ((assessmentResult.detailedScores['职业倾向'] || 0) >= 70) {
      matchRate += 25;
    } else if ((assessmentResult.detailedScores['职业倾向'] || 0) >= 50) {
      matchRate += 15;
    } else {
      matchRate += 5;
    }
    
    // 性格匹配（如果有MBTI结果）
    if (assessmentResult.personalityType) {
      matchRate += 5;
    }
    
    // 确保匹配度在合理范围内
    matchRate = Math.min(100, Math.max(0, matchRate));
    
    return {
      ...job,
      matchRate: Math.round(matchRate)
    };
  }).sort((a, b) => b.matchRate - a.matchRate);
};

// 生成个性化学习计划
export const generateLearningPlan = (assessmentResult: AssessmentResult) => {
  const plan = {
    title: '个性化学习计划',
    duration: '12周',
    focusAreas: [] as string[],
    weeklyPlan: [] as string[],
    resources: [] as string[]
  };
  
  // 根据测评结果确定重点领域
  if (assessmentResult.weaknesses.includes('技术能力')) {
    plan.focusAreas.push('技术能力提升');
  }
  if (assessmentResult.weaknesses.includes('项目经验')) {
    plan.focusAreas.push('项目经验积累');
  }
  if (assessmentResult.weaknesses.includes('软技能')) {
    plan.focusAreas.push('软技能培养');
  }
  if (assessmentResult.weaknesses.includes('职业倾向')) {
    plan.focusAreas.push('职业规划');
  }
  
  // 生成周计划
  let week = 1;
  plan.focusAreas.forEach(area => {
    switch (area) {
      case '技术能力提升':
        plan.weeklyPlan.push(`第${week}-3周：系统学习核心技术知识`);
        plan.resources.push('官方文档', '在线课程', '技术书籍');
        week += 3;
        break;
      case '项目经验积累':
        plan.weeklyPlan.push(`第${week}-5周：参与实际项目或开源项目`);
        plan.resources.push('GitHub', '项目实战课程');
        week += 3;
        break;
      case '软技能培养':
        plan.weeklyPlan.push(`第${week}-4周：提升沟通和团队协作能力`);
        plan.resources.push('沟通技巧书籍', '团队协作课程');
        week += 2;
        break;
      case '职业规划':
        plan.weeklyPlan.push(`第${week}-2周：明确职业目标和发展路径`);
        plan.resources.push('职业规划书籍', '行业导师');
        week += 2;
        break;
    }
  });
  
  // 调整计划持续时间
  plan.duration = `${week-1}周`;
  
  return plan;
};
