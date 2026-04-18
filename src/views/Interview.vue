<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Mic, 
  Send, 
  SkipForward, 
  Square, 
  Clock,
  AlertCircle,
  Brain,
  MessageCircle,
  Sparkles,
  Zap,
  Target,
  Languages,
  Users,
  Trophy,
  History,
  CheckCircle2,
  ChevronRight,
  Camera,
  FileUp,
  FileSearch,
  Settings,
  ShieldCheck,
  Briefcase,
  X
} from 'lucide-vue-next'

// 类型定义
interface CareerPath {
  title: string;
  description: string;
  salary: string;
}

interface TechType {
  id: string;
  name: string;
  questions: number;
  icon: string;
  description: string;
  skills: string[];
  sampleQuestions: string[];
  answers: string[];
  careerPaths: CareerPath[];
  trends: string[];
  tools: string[];
}

interface StarAnswer {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface AlternativeAnswer {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface IndustrySpecific {
  tech: string;
  finance: string;
  healthcare: string;
}

interface BQQuestion {
  id: string;
  question: string;
  category: string;
  description: string;
  starAnswer: StarAnswer;
  alternativeAnswers: AlternativeAnswer[];
  commonMistakes: string[];
  industrySpecific: IndustrySpecific;
  tips: string[];
}

interface CopingStrategy {
  step: number;
  title: string;
  description: string;
}

interface PressureLevelAssessment {
  low: string;
  medium: string;
  high: string;
}

interface PressureScenario {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  example: string;
  应对策略: CopingStrategy[];
  industrySpecific: IndustrySpecific;
  压力水平评估: PressureLevelAssessment;
  tips: string[];
  sampleQuestions: string[];
  answers: string[];
  feedback: string[];
}

const router = useRouter()

const currentStep = ref('home') // home, prepare, ongoing, finished
const timeLeft = ref(60)
const interviewTime = ref(0)
const isRecording = ref(false)
const answerText = ref('')
const currentQuestion = ref('请结合你的项目经历，谈谈你对 Vue3 响应式原理的理解，以及它与 Vue2 相比有哪些优势？')
const answeredCount = ref(0)
const totalQuestions = ref(5)

// New Feature States
const interviewMode = ref('technical') // technical, behavioral, pressure
const difficulty = ref('medium') // easy, medium, hard
const language = ref('zh') // zh, en, jp, de
const showModelAnswer = ref(false)

// Interview Question Bank
const questionBank = {
  // Technical Interview Questions
  technical: {
    frontend: {
      easy: [
        '请解释一下什么是 HTML5 语义化标签，以及它们的作用是什么？',
        'CSS 中的盒模型包括哪些部分？标准盒模型和 IE 盒模型有什么区别？',
        'JavaScript 中的闭包是什么？请举例说明它的应用场景。',
        '如何在 JavaScript 中实现继承？请简要说明几种常见的继承方式。',
        '什么是 DOM 事件冒泡？如何阻止事件冒泡？'
      ],
      medium: [
        '请解释一下 Vue3 中的 Composition API 与 Options API 的区别，以及各自的优缺点。',
        'React 中的虚拟 DOM 是什么？它是如何提高性能的？',
        '请解释一下 JavaScript 中的异步编程方式，包括回调函数、Promise 和 async/await。',
        '如何优化前端页面的加载性能？请列举几种常见的优化策略。',
        '什么是跨域请求？如何解决跨域问题？'
      ],
      hard: [
        '请详细解释 Vue3 的响应式原理，包括 Proxy 的工作机制和与 Vue2 的 Object.defineProperty 的区别。',
        '如何设计一个可扩展的前端组件系统？请考虑组件的复用性、可维护性和性能。',
        '前端中的微前端架构是什么？它的优缺点是什么？如何实现一个微前端应用？',
        '请解释一下 WebAssembly 的工作原理，以及它在前端性能优化中的应用。',
        '如何设计一个高可用的前端监控系统？请考虑数据采集、存储和分析等方面。'
      ]
    },
    backend: {
      easy: [
        '请解释一下 HTTP 协议的工作原理，包括请求方法、状态码和头部信息。',
        '什么是 RESTful API？它的设计原则是什么？',
        '数据库中的索引是什么？它是如何提高查询性能的？',
        '请解释一下什么是事务，以及事务的 ACID 特性。',
        '什么是缓存？为什么要使用缓存？常见的缓存策略有哪些？'
      ],
      medium: [
        '请解释一下 Java 中的多线程编程，包括线程的创建、同步和通信方式。',
        '什么是分布式系统？分布式系统面临的主要挑战有哪些？',
        '请解释一下数据库的事务隔离级别，以及不同隔离级别可能导致的问题。',
        '如何设计一个高并发的后端系统？请考虑负载均衡、缓存和数据库优化等方面。',
        '什么是消息队列？它在分布式系统中的作用是什么？'
      ],
      hard: [
        '请详细解释分布式一致性算法 Paxos 或 Raft 的工作原理。',
        '如何设计一个可伸缩的微服务架构？请考虑服务发现、负载均衡和容错等方面。',
        '数据库的分库分表策略是什么？如何选择合适的分库分表方案？',
        '请解释一下 CAP 定理，以及在分布式系统设计中如何权衡这三个特性。',
        '如何设计一个安全的后端系统？请考虑认证、授权、加密和防止常见攻击等方面。'
      ]
    },
    product: {
      easy: [
        '请解释一下什么是产品经理？产品经理的主要职责是什么？',
        '什么是用户故事？如何编写一个好的用户故事？',
        '产品开发的主要流程是什么？请简要描述各个阶段的工作内容。',
        '如何进行用户调研？常见的用户调研方法有哪些？',
        '什么是产品需求文档 (PRD)？它应该包含哪些内容？'
      ],
      medium: [
        '如何进行产品规划？请考虑市场分析、用户需求和技术可行性等方面。',
        '什么是产品的核心竞争力？如何打造产品的核心竞争力？',
        '如何进行产品迭代？迭代的原则和方法是什么？',
        '如何评估产品的成功？常见的产品 metrics 有哪些？',
        '如何与开发团队和设计团队有效协作？'
      ],
      hard: [
        '如何设计一个成功的产品？请考虑产品定位、用户体验和商业模式等方面。',
        '如何应对产品的增长瓶颈？请分析可能的原因并提出解决方案。',
        '如何进行产品创新？创新的方法和流程是什么？',
        '如何制定产品的长期战略？请考虑市场趋势和竞争格局等因素。',
        '如何管理产品的生命周期？从引入期到衰退期的策略是什么？'
      ]
    },
    ai: {
      easy: [
        '请解释一下什么是人工智能？人工智能的主要分支有哪些？',
        '什么是机器学习？机器学习与传统编程的区别是什么？',
        '请解释一下监督学习和无监督学习的区别，以及各自的应用场景。',
        '什么是神经网络？它的基本结构是什么？',
        '如何评估机器学习模型的性能？常见的评估指标有哪些？'
      ],
      medium: [
        '请解释一下深度学习的工作原理，以及它与传统机器学习的区别。',
        '什么是卷积神经网络 (CNN)？它在图像处理中的优势是什么？',
        '什么是循环神经网络 (RNN)？它在序列数据处理中的应用是什么？',
        '如何处理机器学习中的过拟合问题？常见的解决方法有哪些？',
        '什么是生成对抗网络 (GAN)？它的工作原理是什么？'
      ],
      hard: [
        '请详细解释 Transformer 模型的工作原理，以及它在自然语言处理中的应用。',
        '如何设计一个端到端的机器学习系统？请考虑数据处理、模型训练和部署等方面。',
        '什么是强化学习？请解释其基本原理和应用场景。',
        '如何解决大规模机器学习中的计算和存储问题？',
        '人工智能的伦理问题有哪些？如何确保 AI 系统的公平性和透明度？'
      ]
    }
  },
  // Behavioral Interview Questions
  behavioral: {
    teamwork: {
      easy: [
        '请描述一次你与团队成员合作完成任务的经历。',
        '当团队中出现意见分歧时，你是如何处理的？',
        '你如何看待团队中的不同角色和职责？',
        '请分享一次你帮助团队成员解决问题的经历。',
        '在团队合作中，你认为最重要的品质是什么？'
      ],
      medium: [
        '请描述一次团队项目失败的经历，你从中学到了什么？',
        '当团队成员工作表现不佳时，你会如何处理？',
        '请分享一次你在团队中担任领导角色的经历，以及你是如何带领团队达成目标的。',
        '如何平衡个人目标和团队目标？',
        '当你与团队成员发生冲突时，你是如何解决的？'
      ],
      hard: [
        '请描述一次你在团队中面临的最大挑战，以及你是如何克服的。',
        '当团队中出现文化差异或沟通障碍时，你会如何处理？',
        '如何激励团队成员提高工作积极性和创造力？',
        '请分享一次你在团队中推动创新的经历。',
        '如何处理团队中的权力斗争或政治问题？'
      ]
    },
    leadership: {
      easy: [
        '请描述一次你在学习或工作中担任领导角色的经历。',
        '你认为一个好的领导者应该具备哪些品质？',
        '如何设定团队目标并确保目标的实现？',
        '请分享一次你影响他人的经历。',
        '你如何看待授权和监督的关系？'
      ],
      medium: [
        '请描述一次你在领导过程中面临的困难，以及你是如何解决的。',
        '如何处理团队中的冲突和分歧？',
        '请分享一次你带领团队克服挑战的经历。',
        '如何评估团队成员的表现并提供反馈？',
        '你如何平衡团队的短期目标和长期发展？'
      ],
      hard: [
        '请描述一次你在领导过程中做出的艰难决策，以及你是如何权衡各种因素的。',
        '如何建立和维护团队的文化和价值观？',
        '请分享一次你带领团队进行变革的经历。',
        '如何处理团队中的绩效问题和人员管理挑战？',
        '你如何培养和发展团队中的人才？'
      ]
    },
    problemSolving: {
      easy: [
        '请描述一次你解决问题的经历。',
        '当你遇到困难时，你会如何应对？',
        '你如何分析和解决复杂问题？',
        '请分享一次你通过创新思维解决问题的经历。',
        '你如何处理意外情况和紧急事件？'
      ],
      medium: [
        '请描述一次你在时间紧迫的情况下解决问题的经历。',
        '当你面临多个问题需要同时解决时，你会如何优先级排序？',
        '请分享一次你解决技术难题的经历。',
        '你如何从失败中学习并改进？',
        '如何处理模糊和不确定的问题？'
      ],
      hard: [
        '请描述一次你解决的最复杂的问题，以及你的解决思路和方法。',
        '当你遇到没有先例的问题时，你会如何处理？',
        '请分享一次你通过跨学科知识解决问题的经历。',
        '如何在资源有限的情况下解决问题？',
        '你如何平衡短期解决方案和长期系统改进？'
      ]
    },
    communication: {
      easy: [
        '请描述一次你与他人有效沟通的经历。',
        '你如何向非技术人员解释技术概念？',
        '当你需要传达坏消息时，你会如何处理？',
        '请分享一次你倾听他人意见并采纳的经历。',
        '你如何在团队中有效表达自己的观点？'
      ],
      medium: [
        '请描述一次你在沟通中遇到的挑战，以及你是如何克服的。',
        '如何处理与不同文化背景的人之间的沟通？',
        '请分享一次你通过沟通解决冲突的经历。',
        '你如何在压力下保持清晰的沟通？',
        '如何确保团队中的信息传递准确和及时？'
      ],
      hard: [
        '请描述一次你进行高难度沟通的经历，例如与上级、客户或团队成员的敏感对话。',
        '如何在组织变革过程中有效沟通，减少阻力？',
        '请分享一次你通过沟通影响决策的经历。',
        '如何处理沟通中的误解和偏见？',
        '你如何构建和维护有效的跨团队沟通机制？'
      ]
    }
  },
  // Pressure Interview Questions
  pressure: {
    timePressure: {
      easy: [
        '如果现在给你一个紧急任务，需要在今天完成，你会如何安排时间？',
        '当你同时面临多个截止日期时，你会如何处理？',
        '请在1分钟内概述你的职业规划。',
        '如何在压力下保持工作质量？',
        '当你感到时间不够用时，你会如何应对？'
      ],
      medium: [
        '如果你的团队成员突然离职，你需要接管他们的工作，你会如何处理？',
        '当项目进度落后，需要加班赶工时，你会如何应对？',
        '请在2分钟内分析一个复杂问题并提出解决方案。',
        '如何在高压环境下做出正确的决策？',
        '当你面临多个紧急任务时，你会如何优先级排序？'
      ],
      hard: [
        '如果你的项目在上线前发现严重问题，需要在24小时内修复，你会如何处理？',
        '当你面临客户的紧急需求，而资源有限时，你会如何应对？',
        '请在3分钟内解决一个复杂的技术问题。',
        '如何在压力下保持团队的凝聚力和士气？',
        '当你连续工作很长时间后，如何保持工作效率和创造力？'
      ]
    },
    criticalQuestions: {
      easy: [
        '你的最大缺点是什么？',
        '为什么我们应该录用你而不是其他候选人？',
        '你如何看待加班？',
        '你对薪资的期望是多少？',
        '你为什么离开上一份工作？'
      ],
      medium: [
        '如果你的直接上级要求你做一件你认为不正确的事情，你会如何处理？',
        '你如何处理工作中的失败和挫折？',
        '如果你的团队成员对你的决策提出质疑，你会如何应对？',
        '你如何平衡工作和生活？',
        '如果你的工作表现没有达到预期，你会如何改进？'
      ],
      hard: [
        '如果我们发现你的简历中有夸大的内容，你会如何解释？',
        '如果你的项目失败了，你会如何向管理层和客户解释？',
        '如果你的同事在背后说你的坏话，你会如何处理？',
        '如果公司面临财务困难，需要裁员，你认为应该如何处理？',
        '如果你的价值观与公司的价值观发生冲突，你会如何应对？'
      ]
    },
    rolePlay: {
      easy: [
        '假设你是一名客服代表，如何处理客户的投诉？',
        '假设你是一名团队领导，如何向团队成员传达一个坏消息？',
        '假设你是一名销售代表，如何向客户推销产品？',
        '假设你是一名项目经理，如何向客户解释项目延期的原因？',
        '假设你是一名面试官，如何评估候选人？'
      ],
      medium: [
        '假设你是一名产品经理，如何向开发团队解释一个复杂的产品需求？',
        '假设你是一名技术主管，如何处理团队中的技术分歧？',
        '假设你是一名市场经理，如何应对竞争对手的挑战？',
        '假设你是一名人力资源经理，如何处理员工的绩效问题？',
        '假设你是一名财务经理，如何向管理层解释财务报表中的问题？'
      ],
      hard: [
        '假设你是一名CEO，如何应对公司的危机？',
        '假设你是一名技术总监，如何制定技术战略以应对市场变化？',
        '假设你是一名创业公司创始人，如何向投资者推销你的商业计划？',
        '假设你是一名部门经理，如何处理部门重组和人员调整？',
        '假设你是一名跨国公司高管，如何应对跨文化管理挑战？'
      ]
    }
  }
}

// Interview Results Analysis
interface InterviewResults {
  strengths: string[];
  weaknesses: string[];
  overallScore: number;
  detailedScores: {
    technicalKnowledge?: number;
    problemSolving?: number;
    communication?: number;
    depth?: number;
    practicalSkills?: number;
    teamwork?: number;
    leadership?: number;
    adaptability?: number;
    stressManagement?: number;
    quickThinking?: number;
    decisionMaking?: number;
    composure?: number;
  };
}

const interviewResults = ref<InterviewResults>({
  strengths: [],
  weaknesses: [],
  overallScore: 0,
  detailedScores: {}
})

const fluencyScore = ref(85)
const logicScore = ref(78)
const matchingScore = ref(92)

// Preparation States
const videoRef = ref<HTMLVideoElement | null>(null)
const videoRefOngoing = ref<HTMLVideoElement | null>(null)
const audioLevel = ref(0)
const resumeFile = ref<File | null>(null)
const isAnalyzingResume = ref(false)
const resumeAnalysisResult = ref('')
const selectedJob = ref('')
const cameraReady = ref(false)
const micReady = ref(false)

let timer: number
let interviewTimer: number
let mediaStream: MediaStream | null = null
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let dataArray: any = null
let animationFrame: number

const startInterviewProcess = () => {
  currentStep.value = 'prepare'
  initDevices()
}

const initDevices = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
    }
    cameraReady.value = true
    micReady.value = true
    initAudioMeter(mediaStream)
  } catch (err) {
    console.error('Error accessing media devices:', err)
  }
}

const initAudioMeter = (stream: MediaStream) => {
  audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const source = audioContext.createMediaStreamSource(stream)
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 256
  source.connect(analyser)
  dataArray = new Uint8Array(analyser.frequencyBinCount)
  
  const updateMeter = () => {
    if (analyser && dataArray) {
      analyser.getByteFrequencyData(dataArray as any)
      const sum = dataArray.reduce((a: number, b: number) => a + b, 0)
      audioLevel.value = Math.min(100, (sum / dataArray.length) * 2)
      animationFrame = requestAnimationFrame(updateMeter)
    }
  }
  updateMeter()
}

const handleResumeUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    resumeFile.value = target.files[0]
    analyzeResume()
  }
}

const analyzeResume = () => {
  isAnalyzingResume.value = true
  setTimeout(() => {
    isAnalyzingResume.value = false
    resumeAnalysisResult.value = '根据您的简历，您在 Vue.js 和 TypeScript 方面有深厚背景，适合高级前端开发工程师岗位。'
  }, 2000)
}

const startTimers = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
  }, 1000)

  interviewTimer = setInterval(() => {
    interviewTime.value++
  }, 1000)
}

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(interviewTimer)
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const toggleRecording = () => {
  isRecording.value = !isRecording.value
}

// Function to generate random questions based on selected type, job, and difficulty
const generateQuestions = (): string[] => {
  const questions: string[] = []
  const mode = interviewMode.value
  const job = selectedJob.value
  const level = difficulty.value as 'easy' | 'medium' | 'hard'
  
  if (mode === 'technical' && job) {
    // For technical interviews, use job-specific questions
    const jobKey = job as keyof typeof questionBank.technical
    const jobQuestions = questionBank.technical[jobKey]?.[level] || []
    if (jobQuestions.length > 0) {
      // Shuffle and select 5 questions
      const shuffled = [...jobQuestions].sort(() => 0.5 - Math.random())
      questions.push(...shuffled.slice(0, 5))
    }
  } else if (mode === 'behavioral') {
    // For behavioral interviews, select from different categories
    const categories = Object.keys(questionBank.behavioral) as Array<keyof typeof questionBank.behavioral>
    categories.forEach(category => {
      const categoryQuestions = questionBank.behavioral[category]?.[level] || []
      if (categoryQuestions.length > 0) {
        const randomQ = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)]
        if (randomQ) {
          questions.push(randomQ)
        }
      }
    })
    // Ensure we have at least 5 questions
    while (questions.length < 5) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      if (randomCategory) {
        const categoryQuestions = questionBank.behavioral[randomCategory]?.[level] || []
        if (categoryQuestions.length > 0) {
          const randomQ = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)]
          if (randomQ && !questions.includes(randomQ)) {
            questions.push(randomQ)
          }
        }
      }
    }
  } else if (mode === 'pressure') {
    // For pressure interviews, select from different scenarios
    const scenarios = Object.keys(questionBank.pressure) as Array<keyof typeof questionBank.pressure>
    scenarios.forEach(scenario => {
      const scenarioQuestions = questionBank.pressure[scenario]?.[level] || []
      if (scenarioQuestions.length > 0) {
        const randomQ = scenarioQuestions[Math.floor(Math.random() * scenarioQuestions.length)]
        if (randomQ) {
          questions.push(randomQ)
        }
      }
    })
    // Ensure we have at least 5 questions
    while (questions.length < 5) {
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
      if (randomScenario) {
        const scenarioQuestions = questionBank.pressure[randomScenario]?.[level] || []
        if (scenarioQuestions.length > 0) {
          const randomQ = scenarioQuestions[Math.floor(Math.random() * scenarioQuestions.length)]
          if (randomQ && !questions.includes(randomQ)) {
            questions.push(randomQ)
          }
        }
      }
    }
  }
  return questions
}

// Store current set of questions
const currentQuestions = ref<string[]>([])

const startRealInterview = () => {
  currentStep.value = 'ongoing'
  answeredCount.value = 0
  timeLeft.value = 60
  interviewTime.value = 0
  startTimers()
  
  // Generate questions based on selected type, job, and difficulty
  currentQuestions.value = generateQuestions()
  if (currentQuestions.value.length > 0) {
    const firstQuestion = currentQuestions.value[0]
    if (firstQuestion) {
      currentQuestion.value = firstQuestion
    }
  }
  
  // Attach stream to ongoing video ref after next tick
  setTimeout(() => {
    if (videoRefOngoing.value && mediaStream) {
      videoRefOngoing.value.srcObject = mediaStream
    }
  }, 0)
}

const submitAnswer = () => {
  if (answeredCount.value + 1 >= totalQuestions.value) {
    // Calculate interview results
    calculateInterviewResults()
    currentStep.value = 'finished'
    clearInterval(timer)
    clearInterval(interviewTimer)
  } else {
    answeredCount.value++
    timeLeft.value = 60
    answerText.value = ''
    showModelAnswer.value = false
    // Load next question
    if (currentQuestions.value.length > answeredCount.value) {
      const nextQuestion = currentQuestions.value[answeredCount.value]
      if (nextQuestion) {
        currentQuestion.value = nextQuestion
      }
    }
  }
}

// Function to calculate interview results
const calculateInterviewResults = () => {
  // Simulate AI analysis based on interview type
  if (interviewMode.value === 'technical') {
    interviewResults.value = {
      strengths: [
        '技术知识掌握扎实',
        '问题分析能力强',
        '表达逻辑清晰',
        '对专业领域有深入理解',
        '解决问题的思路明确'
      ],
      weaknesses: [
        '某些高级概念的理解不够深入',
        '可能需要更多实际项目经验',
        '技术广度可以进一步拓展',
        '面对复杂问题时的应变能力有待提高',
        '对新技术的了解可以更加及时'
      ],
      overallScore: 85,
      detailedScores: {
        technicalKnowledge: 88,
        problemSolving: 82,
        communication: 80,
        depth: 78,
        practicalSkills: 85
      }
    }
  } else if (interviewMode.value === 'behavioral') {
    interviewResults.value = {
      strengths: [
        '团队协作能力强',
        '沟通表达清晰',
        '领导力潜力明显',
        '问题解决能力突出',
        '抗压能力良好'
      ],
      weaknesses: [
        '在处理冲突时可以更加果断',
        '时间管理能力有待提高',
        '对团队的影响力可以进一步加强',
        '在压力下的表现可以更加稳定',
        '需要更多的跨团队协作经验'
      ],
      overallScore: 82,
      detailedScores: {
        teamwork: 85,
        leadership: 78,
        communication: 88,
        problemSolving: 80,
        adaptability: 75
      }
    }
  } else if (interviewMode.value === 'pressure') {
    interviewResults.value = {
      strengths: [
        '抗压能力强',
        '快速思维能力突出',
        '决策果断',
        '在压力下保持冷静',
        '应变能力良好'
      ],
      weaknesses: [
        '在极端压力下可能会出现轻微焦虑',
        '时间管理可以更加优化',
        '在压力下的细节处理能力有待提高',
        '需要更多的高压环境经验',
        '在压力下的创意表现可以更加稳定'
      ],
      overallScore: 78,
      detailedScores: {
        stressManagement: 85,
        quickThinking: 80,
        decisionMaking: 75,
        composure: 82,
        adaptability: 70
      }
    }
  }
}

const generateReport = () => {
  // 跳转到报告页面
  router.push('/report')
}



// Technical Interview Details States
const showTechnicalDetails = ref(false)
const selectedTechType = ref<TechType | null>(null)
const showTechTypeDetails = ref(false)
const technicalDetails = ref({
  types: [
    {
      id: 'frontend', 
      name: '前端开发', 
      questions: 120, 
      icon: 'Languages',
      description: '前端开发是创建Web页面或应用程序前端部分的过程，负责用户界面和用户体验。随着Web技术的快速发展，前端开发已经从简单的HTML/CSS编码转变为复杂的单页应用开发，需要掌握多种框架和工具。',
      skills: ['HTML5/CSS3', 'JavaScript/TypeScript', 'React/Vue/Angular', 'Responsive Design', 'Performance Optimization', 'Webpack/Vite', 'CSS Preprocessors', 'Browser APIs', 'PWA', 'Accessibility'],
      sampleQuestions: [
        '请解释一下CSS盒模型及其工作原理',
        'React中的虚拟DOM是什么，它如何提高性能？',
        '如何优化前端页面的加载速度？',
        '请解释一下JavaScript中的闭包概念',
        'Vue 3的Composition API与Options API有什么区别？',
        '什么是CSS Grid，它与Flexbox有什么区别？',
        '如何实现前端的状态管理？',
        '什么是Webpack，它的工作原理是什么？',
        '如何处理前端的跨域问题？',
        '什么是PWA，它有什么优势？'
      ],
      answers: [
        'CSS盒模型是CSS中的一个核心概念，它描述了元素在页面中占据的空间。盒模型由四个部分组成：内容区(content)、内边距(padding)、边框(border)和外边距(margin)。\n\n工作原理：\n1. 内容区(content)：元素实际内容的区域，由width和height属性定义\n2. 内边距(padding)：内容区与边框之间的空间，可通过padding属性设置\n3. 边框(border)：围绕内容区和内边距的边界，可通过border属性设置\n4. 外边距(margin)：元素与其他元素之间的空间，可通过margin属性设置\n\n在标准盒模型中，width和height只应用于内容区，而在IE盒模型中，width和height包含了内容区、内边距和边框。可以通过box-sizing属性来切换盒模型类型。',
        '虚拟DOM是React中的一个重要概念，它是真实DOM的轻量级副本，以JavaScript对象的形式存在于内存中。\n\n虚拟DOM提高性能的原理：\n1. 当组件状态变化时，React会创建一个新的虚拟DOM树\n2. 与旧的虚拟DOM树进行比较，找出差异（这个过程称为diffing）\n3. 只将差异部分更新到真实DOM中，而不是重新渲染整个DOM树\n\n这样可以减少直接操作真实DOM的次数，因为DOM操作是相对昂贵的，从而提高应用的性能。',
        '优化前端页面加载速度的方法有：\n\n1. 减少HTTP请求：合并CSS和JavaScript文件，使用CSS sprites\n2. 压缩资源：压缩CSS、JavaScript和HTML文件\n3. 使用CDN：将静态资源部署到CDN上，减少服务器负载和网络延迟\n4. 启用浏览器缓存：设置适当的缓存头，让浏览器缓存静态资源\n5. 优化图片：使用适当的图片格式，压缩图片大小，使用懒加载\n6. 减少DOM元素数量：简化页面结构，减少不必要的元素\n7. 使用异步加载：对非关键资源使用异步加载\n8. 优化CSS和JavaScript：避免使用复杂的选择器，减少DOM操作\n9. 使用预加载：对关键资源使用预加载\n10. 监控性能：使用性能分析工具监控页面加载性能',
        '闭包是JavaScript中的一个重要概念，它指的是函数能够访问其词法作用域之外的变量，即使该函数在其原始作用域之外执行。\n\n闭包的工作原理：\n1. 当函数被定义时，它会捕获其周围的词法环境\n2. 即使函数在其原始作用域之外执行，它仍然可以访问这些被捕获的变量\n3. 这些变量会一直存在于内存中，直到闭包不再被引用\n\n闭包的应用场景：\n- 实现私有变量和方法\n- 实现函数工厂\n- 实现模块化\n- 处理异步操作\n\n示例：\nfunction createCounter() {\n  let count = 0;\n  return {\n    increment: function() {\n      count++\n      return count\n    },\n    decrement: function() {\n      count--\n      return count\n    }\n  }\n}\nconst counter = createCounter()\ncounter.increment() // 返回 1',
        'Vue 3的Composition API与Options API的区别：\n\n1. 组织方式：\n   - Options API：使用选项对象（data、methods、computed等）组织代码\n   - Composition API：使用函数组合的方式组织代码，通过setup()函数定义逻辑\n\n2. 逻辑复用：\n   - Options API：通过mixins实现逻辑复用，但可能导致命名冲突和代码来源不明确\n   - Composition API：通过组合函数（composables）实现逻辑复用，代码来源清晰\n\n3. 类型推断：\n   - Options API：TypeScript类型推断不够友好\n   - Composition API：更好的TypeScript类型推断支持\n\n4. 代码组织：\n   - Options API：相关逻辑可能分散在不同的选项中\n   - Composition API：相关逻辑可以组织在一起，提高代码可读性\n\n5. 响应式系统：\n   - Options API：使用defineProperty实现响应式\n   - Composition API：使用Proxy实现响应式，提供更好的响应式体验\n\n6. 适用场景：\n   - Options API：适合小型组件，学习曲线较平缓\n   - Composition API：适合大型组件和复杂逻辑，更灵活',
        'CSS Grid是一种二维布局系统，它允许你在网格中放置元素，同时控制行和列的大小和位置。\n\nCSS Grid与Flexbox的区别：\n\n1. 维度：\n   - Flexbox：一维布局系统，只能控制行或列的布局\n   - Grid：二维布局系统，可以同时控制行和列的布局\n\n2. 布局方向：\n   - Flexbox：主要关注内容的流动方向（水平或垂直）\n   - Grid：主要关注网格的结构和元素在网格中的位置\n\n3. 适用场景：\n   - Flexbox：适合导航栏、列表、卡片等一维布局\n   - Grid：适合页面布局、复杂的表单、图片画廊等二维布局\n\n4. 浏览器支持：\n   - Flexbox：支持所有现代浏览器，IE10+\n   - Grid：支持所有现代浏览器，IE11+（部分支持）\n\n5. 灵活性：\n   - Flexbox：更适合内容驱动的布局，元素大小可以根据内容自动调整\n   - Grid：更适合结构驱动的布局，元素位置和大小可以精确控制',
        '前端状态管理的实现方式有：\n\n1. 组件内部状态：使用React的useState或Vue的data选项管理组件内部状态\n2. Context API：使用React的Context API或Vue的provide/inject在组件树中共享状态\n3. 第三方状态管理库：\n   - React：Redux、MobX、Zustand、Jotai\n   - Vue：Vuex、Pinia\n4. 本地存储：使用localStorage或sessionStorage存储持久化状态\n5. URL参数：使用URL参数存储状态，实现页面间的状态传递\n\n选择状态管理方案的考虑因素：\n- 应用规模：小型应用可以使用组件内部状态或Context API，大型应用适合使用专门的状态管理库\n- 状态复杂度：复杂状态需要更强大的状态管理方案\n- 团队熟悉度：选择团队成员熟悉的技术栈\n- 性能要求：考虑状态更新对性能的影响',
        'Webpack是一个静态模块打包器，它将应用程序中的各种资源（JavaScript、CSS、图片等）视为模块，并将它们打包成一个或多个bundle文件。\n\nWebpack的工作原理：\n1. 入口：指定一个或多个入口文件，Webpack从这些文件开始构建依赖图\n2. 依赖解析：Webpack会递归分析入口文件及其依赖的模块，构建一个依赖图\n3. 模块转换：使用loader将不同类型的模块转换为Webpack可以处理的格式\n4. 打包：将所有模块打包成一个或多个bundle文件\n5. 输出：将打包后的文件输出到指定目录\n\nWebpack的核心概念：\n- 入口(Entry)：打包的起点\n- 输出(Output)：打包的结果\n- Loader：用于转换非JavaScript模块\n- 插件(Plugin)：用于执行额外的任务，如代码压缩、文件复制等\n- 模式(Mode)：指定构建模式，如development、production或none',
        '处理前端跨域问题的方法有：\n\n1. CORS（跨域资源共享）：在服务器端设置Access-Control-Allow-Origin响应头，允许指定的域名访问资源\n2. JSONP：利用script标签的跨域特性，通过回调函数获取数据\n3. 代理服务器：在开发环境中使用webpack-dev-server等工具设置代理，将请求转发到后端服务器\n4. Nginx反向代理：在生产环境中使用Nginx配置反向代理，将前端请求转发到后端服务器\n5. WebSocket：使用WebSocket协议，它不受同源策略的限制\n6. postMessage：使用HTML5的postMessage API在不同域的页面之间传递消息\n\n最常用的方法是CORS，它是一种标准的跨域解决方案，由浏览器和服务器共同实现。',
        'PWA（Progressive Web App）是一种结合了Web和原生应用优点的应用程序，它可以像Web应用一样通过浏览器访问，又可以像原生应用一样安装到设备上。\n\nPWA的优势：\n1. 可安装：可以添加到主屏幕，无需通过应用商店下载\n2. 离线访问：使用Service Worker缓存资源，支持离线访问\n3. 推送通知：支持推送通知，提高用户参与度\n4. 响应式设计：适配不同屏幕尺寸的设备\n5. 安全性：使用HTTPS确保数据传输安全\n6. 性能优化：加载速度快，用户体验流畅\n7. 可发现性：可以通过搜索引擎发现\n8. 低成本：开发和维护成本低于原生应用\n\nPWA的核心技术包括Service Worker、Web App Manifest和Cache API等。'
      ],
      careerPaths: [
        { title: '前端开发工程师', description: '负责Web应用的前端开发，实现用户界面和交互功能', salary: '15k-25k' },
        { title: '高级前端开发工程师', description: '负责复杂前端项目的架构设计和技术选型，指导初级工程师', salary: '25k-35k' },
        { title: '前端技术专家', description: '专注于前端技术的研究和创新，推动技术团队的技术进步', salary: '35k-50k' },
        { title: '全栈开发工程师', description: '同时负责前端和后端开发，能够独立完成整个应用的开发', salary: '20k-40k' }
      ],
      trends: ['TypeScript的广泛应用', 'React Server Components', 'AI辅助前端开发', 'WebAssembly', '微前端架构'],
      tools: ['VS Code', 'Chrome DevTools', 'Figma', 'npm/yarn', 'ESLint/Prettier']
    },
    {
      id: 'backend', 
      name: '后端开发', 
      questions: 150, 
      icon: 'Server',
      description: '后端开发负责服务器端逻辑，数据库管理，API设计和集成，确保应用程序的核心功能正常运行。后端开发需要掌握多种编程语言、数据库系统和服务器架构，以构建高性能、可扩展的服务。',
      skills: ['Java/Python/Node.js/Golang', 'Database Management (MySQL/PostgreSQL/MongoDB)', 'API Design (RESTful/GraphQL)', 'Security (JWT/OAuth)', 'Scalability', 'Docker/Kubernetes', 'CI/CD', 'Cloud Computing (AWS/Azure/GCP)', 'Message Queues', 'Microservices'],
      sampleQuestions: [
        '请解释一下RESTful API的设计原则',
        '数据库索引的工作原理是什么？',
        '如何处理高并发请求？',
        '请解释一下JWT的工作原理',
        '什么是微服务架构，它有什么优缺点？',
        '如何设计一个高可用的系统？',
        '数据库事务的ACID特性是什么？',
        '如何防止SQL注入攻击？',
        '什么是缓存，如何使用缓存提高性能？',
        '如何设计一个分布式系统？'
      ],
      answers: [
        'RESTful API的设计原则包括：\n\n1. 资源导向：将API围绕资源（如用户、产品、订单等）进行设计，每个资源有唯一的URI\n2. HTTP方法：使用HTTP方法（GET、POST、PUT、DELETE、PATCH等）来表示对资源的操作\n3. 无状态：服务器不保存客户端的状态，每个请求都包含所有必要的信息\n4. 统一接口：使用统一的接口设计，包括资源标识符、资源表示、自描述消息和超媒体作为应用状态的引擎\n5. 缓存：支持缓存，提高性能和可扩展性\n6. 分层系统：将系统分为多个层次，每层只与相邻层交互\n7. 代码按需：允许客户端从服务器获取可执行代码（如JavaScript）\n\nRESTful API的设计最佳实践：\n- 使用小写字母和连字符命名资源\n- 使用复数形式表示资源集合\n- 使用HTTP状态码表示操作结果\n- 提供适当的错误处理\n- 使用版本控制（如/v1/users）',
        '数据库索引的工作原理：\n\n1. 索引是一种数据结构，用于快速查找数据库表中的数据\n2. 索引通常基于B树或B+树等数据结构实现\n3. 当创建索引时，数据库会为索引列创建一个排序的数据结构\n4. 当查询时，数据库可以使用索引快速定位到数据，而不需要扫描整个表\n5. 索引可以大大提高查询性能，但会增加插入、更新和删除操作的开销\n\n索引的类型：\n- 主键索引：唯一标识表中的每一行\n- 唯一索引：确保索引列的值唯一\n- 普通索引：加速查询，但不保证唯一性\n- 复合索引：基于多个列创建的索引\n- 全文索引：用于全文搜索\n\n索引的使用建议：\n- 为经常用于查询条件的列创建索引\n- 为经常用于连接的列创建索引\n- 避免为经常更新的列创建索引\n- 避免创建过多的索引，因为它们会占用空间并影响写入性能',
        '处理高并发请求的方法：\n\n1. 垂直扩展：增加服务器的CPU、内存等硬件资源\n2. 水平扩展：增加服务器数量，通过负载均衡分发请求\n3. 缓存：使用缓存（如Redis、Memcached）存储热点数据，减少数据库访问\n4. 数据库优化：\n   - 使用索引加速查询\n   - 优化SQL语句\n   - 使用数据库连接池\n   - 读写分离\n   - 分库分表\n5. 异步处理：使用消息队列（如Kafka、RabbitMQ）处理非实时任务\n6. 代码优化：\n   - 减少I/O操作\n   - 优化算法\n   - 减少网络请求\n7. 负载均衡：使用负载均衡器（如Nginx、HAProxy）分发请求\n8. 限流：对请求进行限流，防止系统过载\n9. 降级：当系统负载过高时，关闭一些非核心功能\n10. 熔断：当服务调用失败率过高时，暂时停止调用该服务\n\n处理高并发的关键是系统的可扩展性和容错能力，需要根据具体业务场景选择合适的解决方案。',
        'JWT（JSON Web Token）的工作原理：\n\n1. 结构：JWT由三部分组成，用点分隔：\n   - Header：包含令牌类型和签名算法\n   - Payload：包含声明（如用户ID、过期时间等）\n   - Signature：使用密钥对Header和Payload进行签名\n\n2. 工作流程：\n   - 用户登录时，服务器验证用户凭据\n   - 服务器生成JWT，包含用户信息和过期时间\n   - 服务器将JWT返回给客户端\n   - 客户端在后续请求中携带JWT\n   - 服务器验证JWT的签名和过期时间\n   - 服务器根据JWT中的用户信息处理请求\n\n3. 优势：\n   - 无状态：服务器不需要存储会话信息\n   - 跨域：可以在不同域之间传递\n   - 自包含：包含所有必要的信息\n   - 可扩展：可以添加自定义声明\n\n4. 注意事项：\n   - 不要在JWT中存储敏感信息\n   - 设置合理的过期时间\n   - 使用安全的签名算法\n   - 保护密钥的安全\n   - 考虑使用HTTPS传输JWT',
        '微服务架构是一种软件架构风格，将应用程序拆分为多个独立的服务，每个服务专注于特定的业务功能。\n\n微服务架构的优点：\n1. 独立性：每个服务可以独立开发、部署和扩展\n2. 灵活性：可以使用不同的技术栈开发不同的服务\n3. 可扩展性：可以根据需要单独扩展某个服务\n4. 容错性：一个服务的故障不会影响其他服务\n5. 团队协作：不同团队可以负责不同的服务\n6. 持续部署：可以快速部署和更新服务\n\n微服务架构的缺点：\n1. 复杂性：系统变得更加复杂，需要更多的协调和管理\n2. 网络延迟：服务之间的通信会产生网络延迟\n3. 数据一致性：分布式系统的数据一致性更难保证\n4. 测试难度：测试跨服务的功能变得更加困难\n5. 部署和监控：需要更复杂的部署和监控系统\n6. 服务发现：需要服务发现机制来管理服务之间的通信\n\n微服务架构适合大型应用和团队，小型应用可能会因为过度复杂而不适合采用。',
        '设计高可用系统的方法：\n\n1. 冗余：\n   - 服务器冗余：部署多个服务器，避免单点故障\n   - 网络冗余：使用多条网络链路\n   - 数据冗余：备份数据，确保数据安全\n\n2. 负载均衡：\n   - 使用负载均衡器分发请求\n   - 健康检查：监测服务器状态，自动剔除故障节点\n\n3. 容错设计：\n   - 熔断：当服务调用失败率过高时，暂时停止调用\n   - 降级：当系统负载过高时，关闭非核心功能\n   - 限流：限制请求速率，防止系统过载\n   - 重试：对失败的请求进行重试\n\n4. 数据一致性：\n   - 使用分布式事务\n   - 最终一致性：允许暂时的数据不一致，但最终会达到一致\n\n5. 监控和告警：\n   - 实时监控系统状态\n   - 设置告警机制，及时发现和处理问题\n\n6. 灾难恢复：\n   - 备份策略：定期备份数据\n   - 恢复计划：制定详细的灾难恢复计划\n   - 演练：定期进行灾难恢复演练\n\n7. 架构设计：\n   - 模块化：将系统拆分为独立的模块\n   - 松耦合：减少模块之间的依赖\n   - 高内聚：每个模块专注于自己的功能\n\n高可用系统的设计需要考虑多方面的因素，包括硬件、软件、网络、数据等，需要根据具体业务场景进行调整。',
        '数据库事务的ACID特性：\n\n1. 原子性(Atomicity)：事务是一个不可分割的工作单位，要么全部执行，要么全部不执行。如果事务中的任何操作失败，整个事务都会回滚，回到事务开始前的状态。\n\n2. 一致性(Consistency)：事务执行前后，数据库从一个一致性状态转换到另一个一致性状态。一致性确保数据库中的数据符合所有预定的规则和约束。\n\n3. 隔离性(Isolation)：多个事务并发执行时，一个事务的执行不应影响其他事务的执行。隔离性可以防止脏读、不可重复读和幻读等问题。\n\n4. 持久性(Durability)：事务一旦提交，其结果就是永久性的，即使系统发生故障，数据也不会丢失。\n\n事务隔离级别：\n- 读未提交(Read Uncommitted)：最低隔离级别，可能导致脏读\n- 读已提交(Read Committed)：防止脏读，但可能导致不可重复读\n- 可重复读(Repeatable Read)：防止脏读和不可重复读，但可能导致幻读\n- 串行化(Serializable)：最高隔离级别，防止所有并发问题，但性能最差\n\n选择合适的隔离级别需要在一致性和性能之间进行权衡。',
        '防止SQL注入攻击的方法：\n\n1. 使用参数化查询：使用预编译语句或参数化查询，而不是直接拼接SQL语句\n   - 示例（Java）：PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE username = ?");\n   - 示例（Python）：cursor.execute("SELECT * FROM users WHERE username = %s", (username,))\n\n2. 输入验证：对用户输入进行验证，确保输入符合预期格式\n   - 检查输入长度\n   - 检查输入类型\n   - 使用白名单过滤\n\n3. 最小权限原则：数据库用户只授予必要的权限，不使用管理员权限\n\n4. 转义特殊字符：对SQL语句中的特殊字符进行转义\n\n5. 使用ORM框架：使用ORM（对象关系映射）框架，如Hibernate、Django ORM等，它们会自动处理SQL注入问题\n\n6. 定期更新和补丁：及时更新数据库系统和应用程序，修复已知的安全漏洞\n\n7. 安全审计：定期进行安全审计，检查系统中的安全问题\n\n8. 限制错误信息：不要向用户显示详细的错误信息，避免泄露系统信息\n\nSQL注入是一种常见的安全漏洞，需要从多个层面进行防范，确保系统的安全性。',
        '缓存是一种临时存储数据的机制，用于提高数据访问速度。\n\n缓存的工作原理：\n1. 当应用程序需要数据时，首先检查缓存中是否存在\n2. 如果缓存中存在数据，直接从缓存中获取，避免访问数据库\n3. 如果缓存中不存在数据，从数据库中获取，然后将数据存入缓存\n4. 当数据更新时，同时更新缓存中的数据\n\n使用缓存提高性能的方法：\n1. 选择合适的缓存策略：\n   - 内存缓存：如Redis、Memcached，速度快\n   - 磁盘缓存：如文件缓存，容量大\n   - 分布式缓存：如Redis Cluster，适合高并发场景\n\n2. 缓存策略：\n   - 缓存穿透：使用布隆过滤器防止不存在的数据请求\n   - 缓存击穿：对热点数据设置永不过期或使用互斥锁\n   - 缓存雪崩：设置不同的过期时间，避免缓存同时失效\n\n3. 缓存更新策略：\n   - 先更新数据库，再更新缓存\n   - 先删除缓存，再更新数据库\n   - 异步更新缓存\n\n4. 缓存大小：根据内存大小和业务需求设置合理的缓存大小\n\n5. 监控：监控缓存命中率，及时调整缓存策略\n\n缓存是提高系统性能的重要手段，但需要合理使用，避免缓存一致性问题和内存浪费。',
        '设计分布式系统的方法：\n\n1. 系统架构设计：\n   - 微服务架构：将系统拆分为独立的服务\n   - 分层架构：将系统分为表现层、业务逻辑层和数据层\n   - 事件驱动架构：使用事件进行服务间通信\n\n2. 数据管理：\n   - 数据分片：将数据分散到多个节点\n   - 数据复制：在多个节点上复制数据，提高可用性\n   - 数据一致性：使用分布式事务或最终一致性\n\n3. 服务通信：\n   - 同步通信：如RESTful API、gRPC\n   - 异步通信：如消息队列（Kafka、RabbitMQ）\n   - 服务发现：使用服务发现机制（如Consul、Eureka）\n\n4. 容错设计：\n   - 熔断：当服务调用失败率过高时，暂时停止调用\n   - 降级：当系统负载过高时，关闭非核心功能\n   - 限流：限制请求速率，防止系统过载\n   - 重试：对失败的请求进行重试\n\n5. 监控和告警：\n   - 分布式追踪：跟踪请求在系统中的流动\n   - 日志聚合：收集和分析分布式系统的日志\n   - 指标监控：监控系统的性能指标\n\n6. 部署和运维：\n   - 容器化：使用Docker容器化应用\n   - 编排：使用Kubernetes等工具编排容器\n   - CI/CD：实现持续集成和持续部署\n\n7. 安全设计：\n   - 身份认证：使用JWT、OAuth等进行身份认证\n   - 授权：控制用户对资源的访问权限\n   - 加密：对敏感数据进行加密\n   - 安全审计：记录系统的安全事件\n\n设计分布式系统需要考虑多方面的因素，包括性能、可用性、一致性、安全性等，需要根据具体业务场景进行调整。'
      ],
      careerPaths: [
        { title: '后端开发工程师', description: '负责服务器端应用的开发和维护，实现核心业务逻辑', salary: '15k-25k' },
        { title: '高级后端开发工程师', description: '负责后端系统的架构设计和性能优化，解决复杂技术问题', salary: '25k-35k' },
        { title: '后端技术专家', description: '专注于后端技术的研究和创新，推动技术团队的技术进步', salary: '35k-50k' },
        { title: '架构师', description: '负责整个系统的架构设计和技术决策，确保系统的可扩展性和可靠性', salary: '40k-60k' }
      ],
      trends: ['Serverless架构', 'GraphQL的兴起', 'AI辅助后端开发', '边缘计算', '低代码/无代码平台'],
      tools: ['IntelliJ IDEA', 'Postman', 'Docker', 'Kubernetes', 'Jenkins/GitLab CI']
    },
    {
      id: 'fullstack', 
      name: '全栈开发', 
      questions: 200, 
      icon: 'Code',
      description: '全栈开发工程师具备前端和后端开发能力，能够独立完成整个应用程序的开发。全栈开发需要掌握多种技术栈，能够理解整个系统的架构和工作原理。',
      skills: ['HTML/CSS/JavaScript', 'Backend Languages (Node.js/Python/Java)', 'Database Management', 'DevOps', 'System Design', 'API Design', 'Security', 'Cloud Computing', 'Version Control', 'Project Management'],
      sampleQuestions: [
        '请设计一个完整的电商网站架构',
        '如何平衡前端和后端的开发工作？',
        '全栈开发中常见的挑战有哪些？',
        '如何提高全栈应用的性能？',
        '请解释一下前后端分离架构的优缺点',
        '如何设计一个可扩展的全栈应用？',
        '如何处理全栈应用的部署和监控？',
        '如何确保全栈应用的安全性？',
        '如何优化全栈应用的数据库性能？',
        '如何实现全栈应用的实时通信？'
      ],
      answers: [
        '完整的电商网站架构设计：\n\n1. 前端层：\n   - 技术选型：React/Vue/Angular + TypeScript\n   - 组件设计：商品列表、商品详情、购物车、订单结算、用户中心等\n   - 状态管理：Redux/Vuex/Pinia\n   - 路由：React Router/Vue Router\n   - 响应式设计：适配不同设备\n\n2. 后端层：\n   - 技术选型：Node.js/Java/Python/Golang\n   - API设计：RESTful API/GraphQL\n   - 业务逻辑：用户管理、商品管理、订单管理、支付管理等\n   - 认证授权：JWT/OAuth\n\n3. 数据库层：\n   - 关系型数据库：MySQL/PostgreSQL（存储用户、商品、订单等结构化数据）\n   - 非关系型数据库：MongoDB/Redis（存储会话、缓存等非结构化数据）\n   - 搜索引擎：Elasticsearch（商品搜索）\n\n4. 中间件和服务：\n   - 缓存：Redis（缓存热点数据）\n   - 消息队列：Kafka/RabbitMQ（异步处理订单、库存等）\n   - 支付网关：对接支付宝、微信支付等\n   - CDN：加速静态资源访问\n\n5. 部署和运维：\n   - 容器化：Docker\n   - 编排：Kubernetes\n   - CI/CD：Jenkins/GitLab CI\n   - 监控：Prometheus/Grafana\n   - 日志：ELK Stack\n\n6. 安全考虑：\n   - HTTPS\n   - 防止SQL注入、XSS、CSRF等攻击\n   - 数据加密\n   - 权限控制\n\n7. 性能优化：\n   - 前端：代码分割、懒加载、缓存\n   - 后端：数据库索引、查询优化、缓存\n   - 服务器：负载均衡、水平扩展',
        '平衡前端和后端开发工作的方法：\n\n1. 合理分工：\n   - 根据团队成员的技能和经验分配任务\n   - 明确前后端的职责边界\n   - 建立清晰的API契约\n\n2. 沟通协作：\n   - 定期举行前后端同步会议\n   - 使用协作工具（如Jira、Trello）跟踪任务\n   - 建立共享的文档（如API文档、设计文档）\n\n3. 技术选型：\n   - 选择前后端都熟悉的技术栈\n   - 使用全栈框架（如Next.js、Nuxt.js）减少前后端差异\n   - 采用统一的代码规范和工具链\n\n4. 开发流程：\n   - 采用敏捷开发方法\n   - 实现持续集成和持续部署\n   - 自动化测试（单元测试、集成测试、端到端测试）\n\n5. 技能培养：\n   - 鼓励团队成员学习前后端技术\n   - 组织技术分享和培训\n   - 建立内部知识库\n\n6. 项目管理：\n   - 合理估算任务时间\n   - 监控项目进度\n   - 及时调整资源分配\n\n平衡前后端开发工作需要团队协作、清晰的流程和合理的资源分配，确保项目按时、高质量完成。',
        '全栈开发中常见的挑战：\n\n1. 技术栈管理：\n   - 需要掌握多种技术（前端、后端、数据库、DevOps等）\n   - 技术更新快，需要不断学习\n   - 不同技术栈之间的集成和兼容问题\n\n2. 代码质量：\n   - 代码量较大，难以维护\n   - 跨领域开发容易导致代码质量下降\n   - 缺乏专业领域的深度\n\n3. 时间管理：\n   - 任务范围广，时间分配困难\n   - 容易陷入细节，影响整体进度\n   - 多任务并行处理的压力\n\n4. 架构设计：\n   - 需要考虑整个系统的架构\n   - 前后端分离与集成的平衡\n   - 系统可扩展性和可维护性的设计\n\n5. 调试和问题排查：\n   - 问题可能出现在任何层面，排查难度大\n   - 跨系统的问题定位困难\n   - 缺乏专业工具和经验\n\n6. 团队协作：\n   - 与专业前端或后端开发人员的协作\n   - 代码风格和规范的统一\n   - 知识共享和技术传递\n\n7. 性能优化：\n   - 需要从前端到后端全方位考虑性能\n   - 不同层面的性能优化策略不同\n   - 性能测试和监控的复杂性\n\n应对这些挑战需要全栈开发人员具备广泛的技术知识、良好的时间管理能力和团队协作精神。',
        '提高全栈应用性能的方法：\n\n1. 前端优化：\n   - 代码分割：将代码分成多个小块，按需加载\n   - 懒加载：延迟加载非关键资源\n   - 缓存：使用浏览器缓存、Service Worker缓存\n   - 压缩：压缩CSS、JavaScript和HTML文件\n   - 图片优化：使用适当的图片格式，压缩图片大小\n   - 减少HTTP请求：合并文件，使用CSS sprites\n   - 使用CDN：加速静态资源访问\n\n2. 后端优化：\n   - 数据库优化：使用索引，优化查询，读写分离\n   - 缓存：使用Redis、Memcached缓存热点数据\n   - 异步处理：使用消息队列处理非实时任务\n   - 代码优化：优化算法，减少I/O操作\n   - 负载均衡：分发请求，提高系统吞吐量\n   - 水平扩展：增加服务器数量\n\n3. API优化：\n   - 减少API请求次数：合并请求，使用批量API\n   - 优化API响应时间：减少处理逻辑，使用缓存\n   - 分页：对大量数据使用分页\n   - 字段过滤：只返回必要的字段\n   - 使用HTTP缓存：设置适当的缓存头\n\n4. 数据库优化：\n   - 索引优化：为常用查询字段创建索引\n   - 查询优化：避免全表扫描，使用EXPLAIN分析查询\n   - 表结构优化：合理设计表结构，避免冗余\n   - 数据库连接池：减少连接开销\n   - 分库分表：处理大数据量\n\n5. 服务器优化：\n   - 配置优化：调整服务器参数\n   - 硬件优化：增加CPU、内存等资源\n   - 网络优化：使用更快的网络连接\n   - 容器化：使用Docker提高资源利用率\n\n6. 监控和分析：\n   - 性能监控：监控系统性能指标\n   - 日志分析：分析系统日志，发现性能瓶颈\n   - A/B测试：测试不同优化方案的效果\n   - 用户体验监控：监控用户体验指标\n\n提高全栈应用性能需要从多个层面入手，综合考虑前端、后端、数据库和服务器等各个环节。',
        '前后端分离架构的优缺点：\n\n优点：\n1. 开发效率：前后端可以并行开发，提高开发速度\n2. 技术栈灵活：前后端可以使用不同的技术栈\n3. 可维护性：代码职责清晰，易于维护和调试\n4. 可扩展性：前后端可以独立扩展\n5. 用户体验：前端可以实现更丰富的交互和动画\n6. 团队协作：不同团队可以专注于自己的领域\n7. 部署独立：前后端可以独立部署和更新\n\n缺点：\n1. 复杂性增加：需要处理跨域、API版本管理等问题\n2. 开发成本：需要额外的API设计和文档\n3. 性能开销：增加了网络请求的开销\n4. 调试困难：前后端分离，调试需要同时关注两个部分\n5. 一致性挑战：需要确保前后端数据结构和业务逻辑的一致性\n6. 安全风险：API暴露在网络中，需要额外的安全措施\n7. 首屏加载：可能导致首屏加载时间增加\n\n前后端分离架构适合大型应用和团队，小型应用可能会因为过度复杂而不适合采用。在选择架构时，需要根据项目规模、团队结构和业务需求进行权衡。',
        '设计可扩展的全栈应用的方法：\n\n1. 架构设计：\n   - 微服务架构：将应用拆分为独立的服务\n   - 分层架构：将系统分为表现层、业务逻辑层和数据层\n   - 事件驱动架构：使用事件进行服务间通信\n   - 领域驱动设计：根据业务领域设计系统\n\n2. 技术选型：\n   - 选择可扩展的技术栈\n   - 使用云服务：利用云平台的弹性伸缩能力\n   - 容器化：使用Docker容器化应用\n   - 编排：使用Kubernetes编排容器\n\n3. 数据管理：\n   - 数据库分库分表：处理大数据量\n   - 数据复制：提高数据可用性\n   - 缓存策略：使用Redis等缓存提高性能\n   - 数据一致性：使用分布式事务或最终一致性\n\n4. 服务通信：\n   - 同步通信：使用RESTful API、gRPC\n   - 异步通信：使用消息队列（Kafka、RabbitMQ）\n   - 服务发现：使用Consul、Eureka等服务发现机制\n   - 负载均衡：分发请求提高系统吞吐量\n\n5. 容错设计：\n   - 熔断：当服务调用失败率过高时，暂时停止调用\n   - 降级：当系统负载过高时，关闭非核心功能\n   - 限流：限制请求速率，防止系统过载\n   - 重试：对失败的请求进行重试\n\n6. 监控和告警：\n   - 分布式追踪：跟踪请求在系统中的流动\n   - 日志聚合：收集和分析分布式系统的日志\n   - 指标监控：监控系统的性能指标\n   - 自动告警：发现异常时及时告警\n\n7. 部署和运维：\n   - CI/CD：实现持续集成和持续部署\n   - 基础设施即代码：使用Terraform、Ansible等管理基础设施\n   - 环境一致性：开发、测试和生产环境保持一致\n   - 灾难恢复：制定详细的灾难恢复计划\n\n设计可扩展的全栈应用需要考虑多方面的因素，包括架构设计、技术选型、数据管理、服务通信、容错设计、监控和告警等。',
        '处理全栈应用部署和监控的方法：\n\n1. 部署策略：\n   - 容器化：使用Docker容器化应用\n   - 编排：使用Kubernetes编排容器\n   - 持续集成/持续部署（CI/CD）：自动化构建和部署流程\n   - 环境管理：开发、测试、预生产、生产环境的管理\n   - 蓝绿部署：减少部署风险\n   - 滚动更新：无停机部署\n\n2. 部署工具：\n   - CI/CD工具：Jenkins、GitLab CI、GitHub Actions\n   - 容器编排：Kubernetes、Docker Swarm\n   - 配置管理：Ansible、Chef、Puppet\n   - 基础设施即代码：Terraform、CloudFormation\n\n3. 监控策略：\n   - 应用监控：监控应用的运行状态和性能\n   - 服务器监控：监控服务器的CPU、内存、磁盘等指标\n   - 数据库监控：监控数据库的性能和状态\n   - 网络监控：监控网络流量和延迟\n   - 业务监控：监控业务指标和用户体验\n\n4. 监控工具：\n   - 指标监控：Prometheus、Grafana\n   - 日志管理：ELK Stack（Elasticsearch、Logstash、Kibana）\n   - 分布式追踪：Jaeger、Zipkin\n   - 应用性能监控：New Relic、Datadog\n   - 告警系统：Alertmanager、PagerDuty\n\n5. 日志管理：\n   - 集中式日志：收集所有服务的日志\n   - 日志结构化：使用结构化日志格式\n   - 日志分析：分析日志发现问题\n   - 日志保留：制定合理的日志保留策略\n\n6. 故障排查：\n   - 监控面板：实时查看系统状态\n   - 告警机制：及时发现和处理问题\n   - 故障演练：定期进行故障演练\n   - 根因分析：分析故障原因，避免类似问题再次发生\n\n7. 最佳实践：\n   - 自动化：自动化部署和监控流程\n   - 标准化：使用标准化的部署和监控配置\n   - 文档化：记录部署和监控流程\n   - 定期审查：定期审查部署和监控策略\n\n处理全栈应用的部署和监控需要综合考虑多个方面，包括部署策略、监控策略、工具选择和最佳实践等。',
        '确保全栈应用安全性的方法：\n\n1. 认证和授权：\n   - 使用JWT、OAuth等认证机制\n   - 多因素认证：提高账户安全性\n   - 基于角色的访问控制（RBAC）：控制用户权限\n   - 最小权限原则：只授予必要的权限\n\n2. 输入验证：\n   - 验证所有用户输入\n   - 使用参数化查询防止SQL注入\n   - 转义特殊字符防止XSS攻击\n   - 验证API请求参数\n\n3. 数据安全：\n   - 加密敏感数据：如密码、个人信息\n   - 使用HTTPS：加密数据传输\n   - 数据备份：定期备份数据\n   - 数据脱敏：处理敏感数据\n\n4. 网络安全：\n   - 防火墙：配置防火墙规则\n   - 防止CSRF攻击：使用CSRF令牌\n   - 防止DDoS攻击：使用CDN、速率限制\n   - 网络隔离：隔离不同环境\n\n5. 应用安全：\n   - 定期更新依赖库：修复安全漏洞\n   - 代码审查：检查代码中的安全问题\n   - 静态代码分析：使用工具检测安全漏洞\n   - 渗透测试：定期进行渗透测试\n\n6. 服务器安全：\n   - 系统更新：及时更新系统和软件\n   - 安全配置：配置服务器安全参数\n   - 访问控制：限制服务器访问\n   - 监控：监控服务器安全事件\n\n7. 安全审计：\n   - 安全日志：记录安全事件\n   - 合规性检查：确保符合安全规范\n   - 安全培训：提高开发人员安全意识\n   - 安全响应计划：制定安全事件响应计划\n\n8. 最佳实践：\n   - 遵循OWASP安全规范\n   - 使用安全开发框架\n   - 定期安全评估\n   - 建立安全文化\n\n确保全栈应用的安全性需要从多个层面入手，包括认证授权、输入验证、数据安全、网络安全、应用安全、服务器安全和安全审计等。',
        '优化全栈应用数据库性能的方法：\n\n1. 数据库设计：\n   - 合理的表结构：避免冗余字段，使用适当的数据类型\n   - 范式化：遵循数据库设计范式\n   - 反范式化：在适当情况下进行反范式化，提高查询性能\n   - 分区表：对大表进行分区，提高查询速度\n\n2. 索引优化：\n   - 为常用查询字段创建索引\n   - 复合索引：为多字段查询创建复合索引\n   - 索引覆盖：使用覆盖索引减少I/O操作\n   - 避免过度索引：索引过多会影响写入性能\n\n3. 查询优化：\n   - 避免全表扫描：使用索引\n   - 优化SQL语句：减少复杂查询\n   - 避免使用SELECT *：只选择必要的字段\n   - 使用EXPLAIN分析查询：了解查询执行计划\n\n4. 连接管理：\n   - 使用数据库连接池：减少连接开销\n   - 合理设置连接参数：如连接超时、最大连接数\n   - 及时释放连接：避免连接泄漏\n\n5. 缓存策略：\n   - 使用Redis、Memcached等缓存热点数据\n   - 缓存查询结果：减少数据库查询\n   - 缓存失效策略：合理设置缓存过期时间\n   - 防止缓存穿透、缓存击穿、缓存雪崩\n\n6. 读写分离：\n   - 主从复制：主库负责写入，从库负责读取\n   - 负载均衡：分发读请求到多个从库\n   - 提高系统吞吐量和可用性\n\n7. 分库分表：\n   - 水平分表：将大表分成多个小表\n   - 垂直分表：将表按列分成多个表\n   - 分库：将数据分散到多个数据库\n   - 提高系统的可扩展性\n\n8. 数据库监控：\n   - 监控数据库性能指标：如查询响应时间、连接数\n   - 监控慢查询：分析和优化慢查询\n   - 监控资源使用：如CPU、内存、磁盘\n   - 自动告警：发现异常时及时告警\n\n9. 数据库维护：\n   - 定期优化表：使用OPTIMIZE TABLE命令\n   - 定期备份：确保数据安全\n   - 统计信息更新：保持统计信息准确\n   - 碎片整理：减少数据碎片\n\n优化全栈应用的数据库性能需要综合考虑数据库设计、索引优化、查询优化、连接管理、缓存策略、读写分离、分库分表、数据库监控和数据库维护等多个方面。',
        '实现全栈应用实时通信的方法：\n\n1. WebSocket：\n   - 双向通信：服务器和客户端可以双向发送消息\n   - 低延迟：比HTTP请求更快\n   - 持久连接：保持连接状态\n   - 适合场景：聊天应用、实时游戏、实时协作工具\n\n2. Server-Sent Events (SSE)：\n   - 单向通信：服务器向客户端发送消息\n   - 基于HTTP：使用标准HTTP协议\n   - 自动重连：客户端会自动重连\n   - 适合场景：实时通知、实时数据更新\n\n3. 长轮询：\n   - 模拟实时通信：客户端定期发送请求，服务器保持连接直到有数据\n   - 兼容性好：支持所有浏览器\n   - 实现简单：不需要特殊的服务器支持\n   - 适合场景：对实时性要求不高的应用\n\n4. 消息队列：\n   - 解耦：生产者和消费者解耦\n   - 可靠性：保证消息的传递\n   - 可扩展性：支持高并发\n   - 适合场景：异步处理、事件驱动架构\n\n5. 实时数据库：\n   - Firebase：提供实时数据库服务\n   - Supabase：开源的Firebase替代方案\n   - 自动同步：数据变化自动同步到客户端\n   - 适合场景：实时协作、实时数据展示\n\n6. 技术实现：\n   - 前端：使用WebSocket API、Socket.IO等库\n   - 后端：使用Node.js的ws库、Socket.IO服务器等\n   - 负载均衡：使用Redis等实现WebSocket集群\n   - 消息广播：使用Redis的发布/订阅功能\n\n7. 最佳实践：\n   - 连接管理：处理连接建立、断开和重连\n   - 消息格式：使用JSON等轻量级格式\n   - 消息压缩：减少消息大小\n   - 错误处理：处理网络错误和服务器错误\n   - 安全：使用HTTPS、认证和授权\n\n8. 性能优化：\n   - 心跳机制：保持连接活跃\n   - 消息批处理：减少网络请求\n   - 缓存：缓存历史消息\n   - 限流：防止消息过载\n\n实现全栈应用的实时通信需要根据具体的业务需求选择合适的技术方案，同时考虑性能、可靠性和安全性等因素。'
      ],
      careerPaths: [
        { title: '全栈开发工程师', description: '负责整个应用的开发，包括前端和后端', salary: '18k-30k' },
        { title: '高级全栈开发工程师', description: '负责复杂全栈项目的架构设计和技术选型', salary: '30k-40k' },
        { title: '技术负责人', description: '负责技术团队的管理和技术决策，推动项目的顺利进行', salary: '35k-50k' },
        { title: 'CTO', description: '负责公司的技术战略和技术团队的管理，推动公司技术的发展', salary: '50k+' }
      ],
      trends: ['Jamstack架构', 'Low-code/No-code平台', 'AI辅助全栈开发', 'Serverless全栈应用', '微前端+微服务架构'],
      tools: ['VS Code', 'Docker', 'AWS/GCP/Azure', 'Git', 'Jira/Confluence']
    },
    {
      id: 'mobile', 
      name: '移动开发', 
      questions: 90, 
      icon: 'Smartphone',
      description: '移动开发负责开发移动应用程序，包括原生应用和跨平台应用。移动开发需要考虑不同设备的屏幕尺寸、性能限制和用户体验，以构建流畅、响应迅速的移动应用。',
      skills: ['Swift/Kotlin', 'React Native/Flutter', 'Mobile UI/UX', 'App Store Optimization', 'Mobile Security', 'Push Notifications', 'Offline Storage', 'Mobile Analytics', 'Cross-platform Development', 'App Monetization'],
      sampleQuestions: [
        'React Native与Flutter有什么区别？',
        '如何优化移动应用的性能？',
        '移动应用的安全最佳实践有哪些？',
        '请解释一下iOS和Android的生命周期差异',
        '如何处理移动应用的离线功能？',
        '如何实现移动应用的推送通知？',
        '如何优化移动应用的电池使用？',
        '如何进行App Store Optimization (ASO)？',
        '如何处理不同屏幕尺寸的适配？',
        '如何实现移动应用的国际化？'
      ],
      answers: [
        'React Native与Flutter的区别：\n\n1. 技术栈：\n   - React Native：使用JavaScript/TypeScript，基于React框架\n   - Flutter：使用Dart语言，基于Flutter框架\n\n2. UI渲染：\n   - React Native：使用原生组件，通过桥接与原生代码通信\n   - Flutter：使用自己的渲染引擎（Skia），不依赖原生组件\n\n3. 性能：\n   - React Native：由于桥接开销，性能可能稍逊\n   - Flutter：直接渲染，性能更接近原生应用\n\n4. 开发体验：\n   - React Native：热重载速度快，生态成熟\n   - Flutter：热重载速度快，UI组件丰富\n\n5. 生态系统：\n   - React Native：第三方库丰富，社区活跃\n   - Flutter：生态正在快速发展，组件库丰富\n\n6. 学习曲线：\n   - React Native：对于Web开发者来说学习曲线较平缓\n   - Flutter：需要学习Dart语言，学习曲线较陡\n\n7. 跨平台支持：\n   - React Native：支持iOS、Android，可通过第三方库支持Web\n   - Flutter：支持iOS、Android、Web、桌面平台\n\n8. 维护成本：\n   - React Native：需要维护iOS和Android的原生模块\n   - Flutter：大部分代码可在各平台共享，维护成本较低\n\n选择哪个框架取决于项目需求、团队技术栈和个人偏好。',
        '优化移动应用性能的方法：\n\n1. 内存管理：\n   - 避免内存泄漏：及时释放不再使用的对象\n   - 优化图片加载：使用适当的图片格式和大小\n   - 使用对象池：复用对象，减少GC压力\n\n2. UI优化：\n   - 减少布局层级：使用扁平化布局\n   - 避免过度绘制：减少不必要的渲染\n   - 使用缓存：缓存渲染结果\n   - 延迟加载：只加载可见区域的内容\n\n3. 网络优化：\n   - 减少网络请求：合并请求，使用批量API\n   - 使用缓存：缓存网络响应\n   - 压缩数据：使用GZIP等压缩方式\n   - 预加载：预加载可能需要的数据\n\n4. 代码优化：\n   - 减少计算量：优化算法\n   - 避免主线程阻塞：将耗时操作移至后台线程\n   - 使用适当的数据结构：选择高效的数据结构\n   - 代码分割：按需加载代码\n\n5. 存储优化：\n   - 使用合适的存储方式：SharedPreferences、SQLite、文件存储等\n   - 清理缓存：定期清理不必要的缓存\n   - 优化数据库操作：使用索引，批量操作\n\n6. 电池优化：\n   - 减少后台活动：避免不必要的后台任务\n   - 优化定位使用：合理使用定位服务\n   - 减少网络唤醒：批量处理网络请求\n   - 使用Doze模式：遵循系统的电池优化建议\n\n7. 启动优化：\n   - 减少启动时间：优化初始化过程\n   - 延迟加载：推迟非必要的初始化\n   - 使用启动屏幕：提供良好的用户体验\n\n8. 监控和分析：\n   - 性能监控：监控应用性能指标\n   - 崩溃分析：分析崩溃原因\n   - 用户体验监控：监控用户体验指标\n   - A/B测试：测试不同优化方案的效果\n\n优化移动应用性能需要综合考虑多个方面，包括内存管理、UI优化、网络优化、代码优化、存储优化、电池优化和启动优化等。',
        '移动应用安全最佳实践：\n\n1. 数据安全：\n   - 加密敏感数据：使用AES等加密算法加密存储的敏感数据\n   - 安全存储：使用Keychain（iOS）或Keystore（Android）存储密钥和凭证\n   - 数据传输加密：使用HTTPS加密数据传输\n   - 数据最小化：只收集必要的数据\n\n2. 认证和授权：\n   - 强密码策略：要求复杂密码\n   - 多因素认证：提供双因素认证选项\n   - 安全的登录流程：防止暴力破解\n   - 会话管理：合理设置会话超时\n\n3. 网络安全：\n   - 防止中间人攻击：使用证书固定（Certificate Pinning）\n   - 验证服务器身份：确保连接到正确的服务器\n   - 避免明文传输：所有数据传输都应加密\n   - 网络请求验证：验证所有网络请求的来源\n\n4. 代码安全：\n   - 防止代码注入：验证所有用户输入\n   - 防止反编译：使用代码混淆和加密\n   - 定期更新依赖：修复已知安全漏洞\n   - 安全代码审查：检查代码中的安全问题\n\n5. 应用安全：\n   - 权限管理：只请求必要的权限\n   - 防止应用克隆：使用应用签名\n   - 防止调试：检测并阻止调试器\n   - 防止Root/Jailbreak：检测并处理Root/Jailbreak设备\n\n6. 第三方库安全：\n   - 审核第三方库：检查第三方库的安全性\n   - 定期更新：及时更新第三方库\n   - 最小化依赖：只使用必要的第三方库\n\n7. 安全测试：\n   - 渗透测试：定期进行渗透测试\n   - 漏洞扫描：使用工具扫描应用中的漏洞\n   - 安全审计：定期进行安全审计\n\n8. 应急响应：\n   - 安全事件响应计划：制定安全事件响应计划\n   - 漏洞修复流程：及时修复发现的漏洞\n   - 安全公告：向用户通报安全问题\n\n移动应用安全是一个持续的过程，需要在开发、测试和部署的各个阶段都考虑安全因素。',
        'iOS和Android的生命周期差异：\n\n1. 应用状态：\n   - iOS：Not Running、Inactive、Active、Background、Suspended\n   - Android：Created、Started、Resumed、Paused、Stopped、Destroyed\n\n2. 生命周期方法：\n   - iOS：\n     * application:didFinishLaunchingWithOptions: (启动)\n     * applicationDidBecomeActive: (变为活跃)\n     * applicationWillResignActive: (将要失去活跃)\n     * applicationDidEnterBackground: (进入后台)\n     * applicationWillEnterForeground: (将要进入前台)\n     * applicationWillTerminate: (将要终止)\n   - Android：\n     * onCreate() (创建)\n     * onStart() (开始)\n     * onResume() (恢复)\n     * onPause() (暂停)\n     * onStop() (停止)\n     * onDestroy() (销毁)\n     * onRestart() (重启)\n\n3. 后台处理：\n   - iOS：应用进入后台后有短暂的后台执行时间，需要使用Background Modes或Background Tasks\n   - Android：应用可以在后台运行服务，但受Doze模式和应用 standby 限制\n\n4. 进程管理：\n   - iOS：系统会根据内存使用情况终止后台应用\n   - Android：系统会根据进程优先级终止后台进程\n\n5. 启动模式：\n   - iOS：应用通常只有一个实例\n   - Android：可以通过启动模式（如singleTop、singleTask）控制Activity的实例化\n\n6. 配置变更：\n   - iOS：设备旋转等配置变更会导致视图控制器重新布局\n   - Android：设备旋转等配置变更会导致Activity销毁和重建\n\n7. 权限模型：\n   - iOS：权限请求在运行时进行，用户可以随时在设置中修改\n   - Android：权限模型在不同版本有所不同，Android 6.0+需要运行时权限请求\n\n了解iOS和Android的生命周期差异对于开发跨平台应用或原生应用都非常重要，可以帮助开发者更好地管理应用状态和资源。',
        '处理移动应用离线功能的方法：\n\n1. 数据缓存：\n   - 本地存储：使用SQLite、Realm等数据库存储数据\n   - 缓存策略：制定合理的缓存过期策略\n   - 增量更新：只同步变化的数据\n\n2. 网络状态检测：\n   - 监听网络状态变化：检测网络连接和断开\n   - 网络类型检测：区分WiFi和移动数据\n   - 网络质量检测：评估网络速度和稳定性\n\n3. 离线操作：\n   - 队列操作：将离线操作加入队列，网络恢复后执行\n   - 乐观更新：先更新本地数据，网络恢复后同步到服务器\n   - 冲突解决：处理本地和服务器数据冲突\n\n4. 数据同步：\n   - 双向同步：确保本地和服务器数据一致\n   - 同步策略：制定合适的同步频率和策略\n   - 断点续传：支持大文件的断点续传\n\n5. 离线UI：\n   - 离线状态提示：向用户显示离线状态\n   - 离线功能引导：引导用户使用离线功能\n   - 缓存内容展示：显示缓存的内容\n\n6. 性能优化：\n   - 缓存大小控制：避免缓存过大占用存储空间\n   - 数据压缩：减少存储空间和传输数据量\n   - 后台同步：在合适的时机进行后台同步\n\n7. 安全考虑：\n   - 本地数据加密：加密存储的敏感数据\n   - 同步数据加密：加密同步的数据\n   - 认证令牌管理：处理离线状态下的认证\n\n8. 最佳实践：\n   - 设计离线优先架构：从设计阶段就考虑离线功能\n   - 测试离线场景：测试各种网络条件下的应用表现\n   - 监控离线使用：收集离线使用数据，优化离线体验\n\n处理移动应用的离线功能需要综合考虑数据缓存、网络状态检测、离线操作、数据同步、离线UI、性能优化和安全考虑等多个方面。',
        '实现移动应用推送通知的方法：\n\n1. 推送服务选择：\n   - Firebase Cloud Messaging (FCM)：支持iOS和Android\n   - Apple Push Notification Service (APNS)：iOS专用\n   - Google Cloud Messaging (GCM)：Android专用（已被FCM取代）\n   - 第三方推送服务：如极光推送、个推等\n\n2. 实现步骤：\n   - 注册推送服务：在开发者平台注册应用\n   - 配置推送证书：iOS需要APNS证书，Android需要FCM配置\n   - 集成推送SDK：在应用中集成推送SDK\n   - 获取设备令牌：获取设备的唯一标识\n   - 发送推送：通过服务器向设备发送推送通知\n\n3. 推送类型：\n   - 本地推送：应用在本地触发的推送\n   - 远程推送：服务器发送的推送\n   - 静默推送：不显示通知，只执行后台操作\n   - 富媒体推送：包含图片、视频等富媒体内容\n\n4. 推送内容：\n   - 标题：通知的标题\n   - 内容：通知的正文\n   - 图标：通知的图标\n   - 声音：通知的声音\n   - 数据：附加的自定义数据\n\n5. 推送处理：\n   - 前台处理：应用在前台时的处理逻辑\n   - 后台处理：应用在后台时的处理逻辑\n   - 点击处理：用户点击通知后的处理逻辑\n   - 权限管理：处理推送权限请求\n\n6. 最佳实践：\n   - 个性化推送：根据用户行为和偏好发送推送\n   - 推送频率控制：避免过度推送\n   - 推送时机选择：在合适的时间发送推送\n   - A/B测试：测试不同推送策略的效果\n   - 推送分析：分析推送的效果和用户反馈\n\n7. 注意事项：\n   - 权限请求：在适当的时机请求推送权限\n   - 隐私保护：遵守数据隐私法规\n   - 电量优化：避免频繁的推送导致电量消耗\n   - 网络优化：减少推送数据量\n\n实现移动应用的推送通知需要综合考虑推送服务选择、实现步骤、推送类型、推送内容、推送处理、最佳实践和注意事项等多个方面。',
        '优化移动应用电池使用的方法：\n\n1. 后台活动优化：\n   - 减少后台任务：只在必要时使用后台任务\n   - 优化后台同步：减少同步频率，批量处理\n   - 使用JobScheduler（Android）或BackgroundTasks（iOS）：在系统允许的时间执行后台任务\n\n2. 网络优化：\n   - 减少网络请求：合并请求，批量处理\n   - 优化网络连接：使用HTTP/2或HTTP/3\n   - 减少唤醒：避免频繁的网络唤醒\n   - 使用WiFi优先：在WiFi网络下进行大流量操作\n\n3. 定位优化：\n   - 减少定位频率：只在必要时获取位置\n   - 使用适当的定位精度：根据需求选择合适的定位精度\n   - 使用后台定位：只在必要时使用后台定位\n   - 缓存位置数据：避免重复获取位置\n\n4. 硬件使用优化：\n   - 减少CPU使用：优化算法，避免不必要的计算\n   - 减少GPU使用：优化UI渲染\n   - 减少屏幕亮度：使用自动亮度，避免过亮\n   - 减少传感器使用：只在必要时使用传感器\n\n5. 代码优化：\n   - 避免内存泄漏：及时释放不再使用的对象\n   - 优化循环和递归：减少CPU消耗\n   - 使用高效的数据结构：选择合适的数据结构\n   - 延迟加载：推迟非必要的初始化\n\n6. 系统API使用：\n   - 使用Doze模式（Android）：遵循系统的电池优化建议\n   - 使用低功耗模式（iOS）：适应系统的低功耗状态\n   - 使用WorkManager（Android）：优化后台任务调度\n   - 使用BackgroundFetch（iOS）：优化后台获取\n\n7. 监控和分析：\n   - 电池使用监控：监控应用的电池使用情况\n   - 电池分析工具：使用系统提供的电池分析工具\n   - 用户反馈：收集用户关于电池使用的反馈\n   - A/B测试：测试不同优化方案的效果\n\n8. 最佳实践：\n   - 提供电池使用设置：让用户控制应用的电池使用\n   - 教育用户：向用户解释应用的电池使用情况\n   - 定期优化：持续监控和优化电池使用\n\n优化移动应用的电池使用需要综合考虑后台活动、网络使用、定位使用、硬件使用、代码优化、系统API使用、监控和分析等多个方面。',
        '进行App Store Optimization (ASO)的方法：\n\n1. 关键词优化：\n   - 关键词研究：使用工具（如App Annie、Sensor Tower）研究热门关键词\n   - 关键词选择：选择相关度高、搜索量适中的关键词\n   - 关键词布局：在应用标题、副标题、描述和关键词字段中合理布局关键词\n   - 关键词监控：定期监控关键词排名，调整关键词策略\n\n2. 应用标题和副标题：\n   - 简洁明了：标题应简洁明了，突出应用的核心功能\n   - 包含关键词：在标题和副标题中包含核心关键词\n   - 吸引用户：标题应吸引用户点击\n   - 符合平台规范：遵守App Store和Google Play的标题长度限制\n\n3. 应用描述：\n   - 清晰准确：描述应清晰准确地介绍应用的功能和特点\n   - 包含关键词：在描述中自然地包含关键词\n   - 突出优势：突出应用的独特优势和价值\n   - 分段清晰：使用段落和列表，提高可读性\n\n4. 应用图标：\n   - 简洁美观：图标应简洁美观，易于识别\n   - 突出品牌：图标应突出应用的品牌形象\n   - 符合平台规范：遵守App Store和Google Play的图标尺寸和格式要求\n   - A/B测试：测试不同图标的效果\n\n5. 应用截图和视频：\n   - 展示核心功能：截图和视频应展示应用的核心功能\n   - 高质量：使用高质量的截图和视频\n   - 添加文字说明：为截图添加简洁的文字说明\n   - 本地化：为不同地区提供本地化的截图和视频\n\n6. 用户评价和评分：\n   - 鼓励用户评价：鼓励用户留下正面评价\n   - 及时回复：及时回复用户的评价，特别是负面评价\n   - 解决问题：积极解决用户反馈的问题\n   - 监控评价：定期监控用户评价，了解用户需求\n\n7. 下载量和活跃度：\n   - 提高下载量：通过营销活动提高应用的下载量\n   - 提高活跃度：提高用户的活跃度和留存率\n   - 社交分享：鼓励用户分享应用\n   - 应用更新：定期更新应用，保持用户兴趣\n\n8. 本地化：\n   - 语言本地化：将应用翻译成不同的语言\n   - 文化本地化：根据不同地区的文化调整应用内容\n   - 关键词本地化：为不同地区选择合适的关键词\n\n9. 数据分析：\n   - 监控ASO指标：监控下载量、排名、转化率等指标\n   - A/B测试：测试不同ASO策略的效果\n   - 竞争分析：分析竞争对手的ASO策略\n   - 调整策略：根据数据分析结果调整ASO策略\n\nApp Store Optimization是一个持续的过程，需要定期监控和调整策略，以提高应用的可见性和下载量。',
        '处理不同屏幕尺寸适配的方法：\n\n1. 响应式布局：\n   - 使用弹性布局：使用Flexbox或Grid等弹性布局系统\n   - 相对单位：使用dp（Android）或pt（iOS）等相对单位\n   - 约束布局：使用ConstraintLayout（Android）或Auto Layout（iOS）\n   - 百分比布局：使用百分比定义元素大小和位置\n\n2. 适配策略：\n   - 适配不同尺寸：为不同屏幕尺寸设计不同的布局\n   - 适配不同方向：为横屏和竖屏设计不同的布局\n   - 适配不同密度：考虑不同屏幕密度的显示效果\n   - 适配不同平台：考虑iOS和Android的设计差异\n\n3. 资源管理：\n   - 多分辨率资源：为不同分辨率提供不同的图片和资源\n   - 矢量图形：使用SVG等矢量图形，避免模糊\n   - 字体大小：使用相对字体大小，适应不同屏幕尺寸\n   - 图标适配：为不同屏幕尺寸提供合适的图标大小\n\n4. 布局优化：\n   - 避免硬编码：避免使用硬编码的尺寸和位置\n   - 自适应组件：使用自适应组件，根据屏幕尺寸调整\n   - 滚动视图：使用滚动视图处理内容超出屏幕的情况\n   - 动态调整：根据屏幕尺寸动态调整布局\n\n5. 测试策略：\n   - 多设备测试：在不同尺寸的设备上测试应用\n   - 模拟器测试：使用模拟器测试不同屏幕尺寸\n   - 自动测试：使用自动化测试工具测试布局适配\n   - 用户测试：收集用户关于布局适配的反馈\n\n6. 工具和框架：\n   - 响应式框架：使用React Native、Flutter等跨平台框架\n   - 布局工具：使用Android Studio的Layout Inspector或Xcode的View Debugger\n   - 设计工具：使用Figma、Sketch等设计工具创建响应式设计\n\n7. 最佳实践：\n   - 移动优先：以移动设备为基础，向上扩展\n   - 内容优先：确保核心内容在所有屏幕尺寸上都能正常显示\n   - 测试覆盖：测试尽可能多的屏幕尺寸和设备\n   - 持续优化：根据用户反馈和新设备不断优化布局\n\n处理不同屏幕尺寸的适配需要综合考虑响应式布局、适配策略、资源管理、布局优化、测试策略、工具和框架等多个方面。',
        '实现移动应用国际化的方法：\n\n1. 国际化准备：\n   - 识别可本地化内容：识别应用中需要本地化的文本、图像、日期格式等\n   - 分离文本和代码：将所有文本从代码中分离出来，使用字符串资源\n   - 避免硬编码：避免在代码中硬编码文本、日期格式等\n\n2. 字符串资源管理：\n   - 使用字符串资源文件：在Android中使用strings.xml，在iOS中使用Localizable.strings\n   - 命名规范：为字符串资源使用清晰的命名规范\n   - 占位符：使用占位符处理动态文本\n   - 复数形式：处理不同语言的复数形式\n\n3. 本地化文件：\n   - 创建本地化文件：为每种支持的语言创建本地化文件\n   - 翻译管理：使用专业的翻译工具或服务管理翻译\n   - 翻译质量：确保翻译的准确性和一致性\n   - 文化适配：考虑不同文化的表达习惯\n\n4. 日期和时间：\n   - 使用系统日期和时间格式：使用系统提供的日期和时间格式\n   - 时区处理：正确处理不同时区的日期和时间\n   - 日历系统：考虑不同地区的日历系统\n\n5. 数字和货币：\n   - 使用系统数字格式：使用系统提供的数字格式\n   - 货币符号：正确显示不同货币的符号\n   - 千位分隔符：根据不同地区使用不同的千位分隔符\n\n6. 图像和图标：\n   - 本地化图像：为不同地区提供合适的图像\n   - 文化敏感性：避免使用文化敏感的图像和图标\n   - 文本图像：避免在图像中包含文本，或为不同语言提供不同的图像\n\n7. 布局适配：\n   - 文本长度适配：考虑不同语言文本长度的差异\n   - 布局方向：支持从右到左（RTL）的语言\n   - 字体大小：适应不同语言的字体大小需求\n\n8. 测试和验证：\n   - 本地化测试：在每种支持的语言环境下测试应用\n   - 伪本地化：使用伪本地化测试布局和字符串处理\n   - 翻译验证：验证翻译的准确性和一致性\n   - 文化测试：测试应用在不同文化环境下的表现\n\n9. 工具和框架：\n   - 国际化框架：使用i18next、react-i18next等国际化框架\n   - 翻译管理工具：使用Lokalise、Phrase等翻译管理工具\n   - 自动化工具：使用自动化工具管理本地化流程\n\n10. 最佳实践：\n    - 早期规划：在项目早期就规划国际化\n    - 持续更新：随着应用的更新，同步更新本地化内容\n    - 用户反馈：收集用户关于本地化的反馈\n    - 文档：为本地化过程创建详细的文档\n\n实现移动应用的国际化需要综合考虑国际化准备、字符串资源管理、本地化文件、日期和时间、数字和货币、图像和图标、布局适配、测试和验证、工具和框架等多个方面。'
      ],
      careerPaths: [
        { title: '移动开发工程师', description: '负责移动应用的开发和维护，实现核心功能和用户界面', salary: '15k-25k' },
        { title: '高级移动开发工程师', description: '负责移动应用的架构设计和性能优化，解决复杂技术问题', salary: '25k-35k' },
        { title: '移动技术专家', description: '专注于移动技术的研究和创新，推动技术团队的技术进步', salary: '35k-45k' },
        { title: '移动产品负责人', description: '负责移动产品的规划和管理，协调开发、设计和测试团队', salary: '20k-40k' }
      ],
      trends: ['5G技术的应用', 'AI在移动应用中的集成', 'AR/VR移动应用', '折叠屏适配', '隐私保护技术'],
      tools: ['Xcode', 'Android Studio', 'VS Code', 'Figma', 'Firebase']
    },
    {
      id: 'devops', 
      name: 'DevOps', 
      questions: 80, 
      icon: 'Cloud',
      description: 'DevOps是一种软件开发方法论，强调开发和运维团队之间的协作，以提高软件交付速度和质量。DevOps工程师负责构建和维护CI/CD管道，确保应用的快速部署和稳定运行。',
      skills: ['CI/CD (Jenkins/GitLab CI/GitHub Actions)', 'Cloud Computing (AWS/Azure/GCP)', 'Containerization (Docker/Kubernetes)', 'Monitoring (Prometheus/Grafana)', 'Infrastructure as Code (Terraform/Ansible)', 'Networking', 'Security', 'Automation', 'Linux', 'Incident Response'],
      sampleQuestions: [
        '请解释一下CI/CD的工作原理',
        'Docker和Kubernetes的区别是什么？',
        '如何设计一个高可用的系统架构？',
        'DevOps的核心原则是什么？',
        '如何监控和排查系统故障？',
        '如何实现基础设施即代码？',
        '如何确保CI/CD管道的安全性？',
        '如何优化云资源的使用成本？',
        '如何处理系统的灾备和恢复？',
        '如何实现容器的编排和管理？'
      ],
      answers: [
        'CI/CD的工作原理：\n\n1. 持续集成（CI）：\n   - 开发人员将代码提交到版本控制系统（如Git）\n   - CI工具（如Jenkins、GitLab CI）检测到代码变更\n   - 自动构建代码，运行单元测试和集成测试\n   - 生成构建报告，通知开发人员构建结果\n   - 确保代码集成的质量，及早发现问题\n\n2. 持续交付（CD）：\n   - 代码通过CI后，自动部署到测试环境\n   - 运行进一步的测试（如端到端测试）\n   - 手动或自动批准部署到生产环境\n   - 确保代码可以随时部署到生产环境\n\n3. 持续部署（CD）：\n   - 在持续交付的基础上，自动部署到生产环境\n   - 不需要手动批准，完全自动化\n   - 快速交付新功能和修复，减少部署风险\n\n4. CI/CD pipeline：\n   - 代码提交 → 代码检查 → 构建 → 测试 → 部署 → 监控\n   - 每个阶段都有明确的目标和成功标准\n   - 失败时自动通知相关人员\n   - 提供可视化的pipeline状态和历史记录\n\n5. 工具链：\n   - 版本控制：Git、SVN\n   - CI工具：Jenkins、GitLab CI、GitHub Actions\n   - 构建工具：Maven、Gradle、npm\n   - 测试工具：JUnit、Selenium、Cypress\n   - 部署工具：Ansible、Terraform、Kubernetes\n   - 监控工具：Prometheus、Grafana、ELK Stack\n\nCI/CD的目标是通过自动化减少手动工作，提高代码质量，加快交付速度，降低部署风险。',
        'Docker和Kubernetes的区别：\n\n1. 定义和功能：\n   - Docker：是一个容器化平台，用于创建、运行和管理容器\n   - Kubernetes：是一个容器编排平台，用于管理容器化应用的部署、扩展和运维\n\n2. 核心功能：\n   - Docker：\n     * 容器创建和管理\n     * 镜像管理\n     * 容器网络\n     * 卷管理\n   - Kubernetes：\n     * 容器编排\n     * 自动扩缩容\n     * 服务发现和负载均衡\n     * 存储编排\n     * 自愈能力\n     * 配置管理\n     * 密钥管理\n\n3. 架构：\n   - Docker：\n     * Docker Engine：核心运行时\n     * Docker Hub：镜像仓库\n     * Docker Compose：多容器应用管理\n   - Kubernetes：\n     * Master节点：控制平面\n     * Worker节点：运行容器\n     * Pod：最小部署单位\n     * Service：服务发现和负载均衡\n     * Deployment：声明式部署\n\n4. 使用场景：\n   - Docker：\n     * 开发环境一致性\n     * 应用打包和分发\n     * 单容器应用部署\n   - Kubernetes：\n     * 大规模容器编排\n     * 微服务架构管理\n     * 高可用应用部署\n     * 混合云和多云环境\n\n5. 关系：\n   - Kubernetes通常使用Docker作为容器运行时（也支持其他运行时如containerd）\n   - Docker提供容器化技术，Kubernetes提供容器编排能力\n   - 两者可以一起使用，构建完整的容器化应用平台\n\nDocker和Kubernetes是容器生态系统中的两个重要组件，各自解决不同的问题，通常一起使用以构建现代化的应用部署平台。',
        '设计高可用系统架构的方法：\n\n1. 冗余设计：\n   - 服务器冗余：部署多个服务器，避免单点故障\n   - 网络冗余：使用多条网络链路，确保网络连通性\n   - 数据冗余：备份数据，确保数据安全\n   - 电源冗余：使用UPS和备用电源，确保电力供应\n\n2. 负载均衡：\n   - 前端负载均衡：分发用户请求到多个应用服务器\n   - 后端负载均衡：分发数据库请求到多个数据库服务器\n   - 健康检查：监控服务器状态，自动剔除故障节点\n   - 会话保持：确保用户会话的连续性\n\n3. 故障转移：\n   - 主动-被动模式：主节点故障时，备用节点接管\n   - 主动-主动模式：多个节点同时工作，负载均衡\n   - 自动故障转移：无需人工干预，自动切换到健康节点\n\n4. 数据一致性：\n   - 数据库复制：主从复制、多主复制\n   - 分布式事务：确保跨服务的数据一致性\n   - 最终一致性：在分布式系统中保持数据最终一致\n\n5. 伸缩性：\n   - 水平扩展：增加服务器数量，提高系统容量\n   - 垂直扩展：增加服务器资源，提高单节点性能\n   - 自动伸缩：根据负载自动调整资源\n\n6. 监控和告警：\n   - 系统监控：监控CPU、内存、磁盘等资源使用情况\n   - 应用监控：监控应用的运行状态和性能\n   - 业务监控：监控业务指标和用户体验\n   - 自动告警：发现异常时及时告警\n\n7. 灾难恢复：\n   - 备份策略：定期备份数据和配置\n   - 恢复计划：制定详细的灾难恢复计划\n   - 异地灾备：在不同地区部署灾备系统\n   - 演练：定期进行灾难恢复演练\n\n8. 架构设计：\n   - 微服务架构：将系统拆分为独立的服务，提高系统弹性\n   - 无状态设计：减少服务间的依赖，提高可扩展性\n   - 服务网格：管理服务间的通信，提高可靠性\n   - API网关：统一入口，提供安全和监控能力\n\n设计高可用系统需要综合考虑多个方面，包括冗余设计、负载均衡、故障转移、数据一致性、伸缩性、监控和告警、灾难恢复和架构设计等。',
        'DevOps的核心原则：\n\n1. 文化与协作：\n   - 打破组织壁垒：消除开发和运维之间的隔阂\n   - 跨职能团队：组建包含开发、运维、QA等角色的团队\n   - 共享责任：开发和运维共同负责应用的整个生命周期\n   - 持续学习：鼓励团队成员不断学习和提升技能\n\n2. 自动化：\n   - 基础设施即代码：使用代码管理基础设施\n   - 持续集成：自动化代码构建和测试\n   - 持续部署：自动化应用部署\n   - 自动化测试：提高测试效率和质量\n   - 自动化监控：自动检测和响应系统异常\n\n3. 度量与反馈：\n   - 关键绩效指标（KPI）：定义和跟踪重要指标\n   - 监控系统：实时监控系统状态和性能\n   - 日志管理：集中管理和分析系统日志\n   - 反馈循环：根据反馈持续改进\n   - A/B测试：测试不同方案的效果\n\n4. 安全：\n   - 安全左移：将安全考虑融入开发早期阶段\n   - 自动化安全测试：集成安全测试到CI/CD pipeline\n   - 安全审计：定期进行安全审计\n   - 合规性：确保系统符合相关法规和标准\n\n5. 可靠性工程：\n   - 故障注入：主动测试系统的容错能力\n   - 混沌工程：模拟系统故障，提高系统弹性\n   - 事件响应：建立有效的事件响应流程\n   - 事后分析：分析故障原因，防止类似问题再次发生\n\n6. 持续改进：\n   - 迭代式开发：采用敏捷开发方法\n   - 持续学习：从错误和经验中学习\n   - 流程优化：不断优化开发和运维流程\n   - 技术债务管理：定期清理技术债务\n\n7. 客户导向：\n   - 用户反馈：收集和分析用户反馈\n   - 快速交付：快速响应客户需求\n   - 质量保证：确保交付高质量的产品\n   - 价值流：优化从需求到交付的价值流\n\nDevOps的核心原则是通过文化、自动化、度量和反馈，实现开发和运维的紧密协作，提高软件交付速度和质量，同时确保系统的可靠性和安全性。',
        '监控和排查系统故障的方法：\n\n1. 监控系统：\n   - 基础设施监控：监控服务器的CPU、内存、磁盘、网络等指标\n   - 应用监控：监控应用的响应时间、错误率、吞吐量等指标\n   - 数据库监控：监控数据库的查询性能、连接数、缓存命中率等指标\n   - 业务监控：监控业务指标，如用户数、订单量、收入等\n\n2. 监控工具：\n   - 指标监控：Prometheus、Grafana\n   - 日志管理：ELK Stack（Elasticsearch、Logstash、Kibana）\n   - 分布式追踪：Jaeger、Zipkin\n   - 应用性能监控：New Relic、Datadog\n   - 告警系统：Alertmanager、PagerDuty\n\n3. 故障排查步骤：\n   - 确认问题：验证故障是否真实存在，收集故障现象\n   - 定位问题：使用监控工具定位故障位置\n   - 分析问题：分析故障原因，提出假设\n   - 验证假设：通过测试验证假设是否正确\n   - 解决问题：实施修复方案\n   - 验证修复：确认故障已解决\n   - 总结经验：记录故障原因和解决方案，防止类似问题再次发生\n\n4. 故障类型和排查方法：\n   - 性能问题：检查系统资源使用情况，分析瓶颈\n   - 连接问题：检查网络连接，防火墙规则\n   - 数据库问题：检查数据库连接，查询性能，死锁\n   - 应用崩溃：分析应用日志，堆栈跟踪\n   - 配置错误：检查配置文件，环境变量\n   - 依赖服务故障：检查依赖服务的状态\n\n5. 最佳实践：\n   - 建立监控面板：实时查看系统状态\n   - 设置合理的告警阈值：避免过多的误报\n   - 自动化告警：及时通知相关人员\n   - 故障演练：定期进行故障演练，提高团队的应急响应能力\n   - 知识共享：建立故障知识库，分享经验和解决方案\n   - 持续改进：根据故障分析结果，优化系统和流程\n\n监控和排查系统故障是DevOps的重要职责，需要建立完善的监控体系和故障响应流程，以确保系统的可靠性和可用性。',
        `实现基础设施即代码的方法：\n\n1. 工具选择：\n   - 配置管理工具：Ansible、Chef、Puppet\n   - 基础设施编排工具：Terraform、CloudFormation\n   - 容器编排工具：Kubernetes、Docker Swarm\n   - 版本控制工具：Git、SVN\n\n2. 实现步骤：\n   - 定义基础设施：使用代码描述基础设施的配置\n   - 版本控制：将基础设施代码存入版本控制系统\n   - 测试：测试基础设施代码，确保配置正确\n   - 部署：使用工具部署基础设施\n   - 监控：监控部署后的基础设施状态\n\n3. 最佳实践：\n   - 模块化：将基础设施代码模块化，提高可重用性\n   - 环境一致性：确保开发、测试和生产环境的一致性\n   - 变更管理：通过版本控制管理基础设施的变更\n   - 审计追踪：记录基础设施的变更历史\n   - 自动化：自动化基础设施的部署和管理\n\n4. 优势：\n   - 一致性：确保基础设施配置的一致性\n   - 可重复性：可以快速重现基础设施配置\n   - 版本控制：跟踪基础设施的变更历史\n   - 协作：团队成员可以协作管理基础设施\n   - 减少人为错误：减少手动配置的错误\n   - 快速部署：快速部署和扩展基础设施\n\n5. 挑战：\n   - 学习曲线：需要学习新的工具和技术\n   - 初始投入：需要投入时间和资源建立基础设施即代码的实践\n   - 安全性：确保基础设施代码的安全性\n   - 复杂性：管理复杂的基础设施配置\n\n6. 示例（使用Terraform）：
   <pre class="bg-gray-100 p-4 rounded-md text-sm">
   # 定义AWS EC2实例
   resource "aws_instance" "example" {
     ami           = "ami-0c55b159cbfafe1f0"
     instance_type = "t2.micro"
     
     tags = {
       Name = "ExampleInstance"
     }
   }
   </pre>

基础设施即代码是DevOps的核心实践之一，它可以提高基础设施管理的效率和可靠性，减少人为错误，确保环境的一致性。`,
        '确保CI/CD管道安全性的方法：\n\n1. 安全设计原则：\n   - 最小权限原则：为CI/CD管道赋予最小必要的权限\n   - 隔离环境：隔离不同环境（开发、测试、生产）的访问权限\n   - 加密传输：使用HTTPS加密所有通信\n   - 安全存储：安全存储敏感信息和凭证\n   - 审计日志：记录所有CI/CD操作的审计日志\n\n2. 安全措施：\n   - 代码扫描：集成静态代码分析工具（如SonarQube）扫描代码中的安全漏洞\n   - 依赖检查：检查依赖库中的安全漏洞（如OWASP Dependency Check）\n   - 容器安全：扫描容器镜像中的安全漏洞（如Trivy、Clair）\n   - 动态安全测试：在测试环境中进行动态安全测试（如OWASP ZAP）\n   - 基础设施安全：扫描基础设施配置中的安全问题（如Terraform Sentinel）\n\n3. 凭证管理：\n   - 使用凭证管理系统：如HashiCorp Vault、AWS Secrets Manager\n   - 避免硬编码凭证：不在代码和配置文件中硬编码凭证\n   - 轮换凭证：定期轮换CI/CD管道使用的凭证\n   - 限制凭证访问：只允许必要的组件访问凭证\n\n4. 安全流程：\n   - 代码审查：进行安全代码审查，检查潜在的安全问题\n   - 安全测试：在CI/CD管道中集成安全测试\n   - 安全扫描：定期扫描CI/CD环境中的安全漏洞\n   - 漏洞响应：建立安全漏洞的响应流程\n\n5. 最佳实践：\n   - 网络隔离：隔离CI/CD环境，减少攻击面\n   - 容器化CI/CD工具：使用容器化的CI/CD工具，减少环境差异\n   - 定期更新：定期更新CI/CD工具和依赖，修复安全漏洞\n   - 实施零信任架构：验证所有访问请求，无论来源\n   - 安全培训：对CI/CD团队进行安全培训，提高安全意识\n\n6. 示例CI/CD管道安全步骤：\n   - 代码提交 → 代码扫描 → 依赖检查 → 构建 → 容器扫描 → 部署到测试环境 → 动态安全测试 → 部署到生产环境 → 监控\n\n确保CI/CD管道的安全性需要综合考虑安全设计原则、安全措施、凭证管理、安全流程和最佳实践等多个方面，以确保CI/CD管道的安全性和可靠性。',
        '优化云资源使用成本的方法：\n\n1. 资源管理：\n   - 资源选型：根据实际需求选择合适的资源类型和规格\n   - 资源调度：合理调度资源，避免资源闲置\n   - 自动扩缩容：根据负载自动调整资源数量\n   - 资源回收：及时回收不需要的资源\n\n2. 定价模型：\n   - 预留实例：对于稳定负载，使用预留实例获得折扣\n   - 按需实例：对于波动负载，使用按需实例\n   - 竞价实例：对于非关键工作负载，使用竞价实例降低成本\n   -  Spot实例：利用云服务商的闲置资源，获得大幅折扣\n\n3. 存储优化：\n   - 存储选型：根据数据访问模式选择合适的存储类型\n   - 数据压缩：压缩数据减少存储成本\n   - 数据生命周期管理：自动将不常用数据迁移到低成本存储\n   - 数据备份策略：优化备份策略，减少备份存储成本\n\n4. 网络优化：\n   - 内容分发网络（CDN）：减少数据传输成本\n   - 区域选择：选择合适的区域，减少跨区域数据传输成本\n   - 网络流量监控：监控网络流量，优化网络使用\n\n5. 监控和分析：\n   - 成本监控：使用云服务商的成本监控工具监控成本\n   - 成本分析：分析成本构成，识别成本优化机会\n   - 预算管理：设置成本预算，避免超支\n   - 成本告警：设置成本告警，及时发现成本异常\n\n6. 自动化：\n   - 自动化资源管理：使用脚本或工具自动化资源的创建和销毁\n   - 自动化成本分析：定期生成成本分析报告\n   - 自动化标签管理：使用标签管理资源，便于成本分析和管理\n\n7. 最佳实践：\n   - 定期审计：定期审计云资源使用情况\n   - 权利化管理：实施最小权限原则，避免资源滥用\n   - 云成本优化工具：使用云成本优化工具（如CloudHealth、AWS Cost Explorer）\n   - 培训：对团队进行云成本管理培训，提高成本意识\n\n优化云资源使用成本需要综合考虑资源管理、定价模型、存储优化、网络优化、监控和分析、自动化和最佳实践等多个方面，以降低云资源使用成本，提高资源利用率。',
        '处理系统灾备和恢复的方法：\n\n1. 灾备策略：\n   - 本地灾备：在同一数据中心内建立备份系统\n   - 异地灾备：在不同地区建立灾备系统\n   - 多活架构：在多个地区部署生产系统，实现负载均衡和灾备\n\n2. 备份策略：\n   - 完全备份：备份所有数据\n   - 增量备份：只备份变化的数据\n   - 差异备份：备份自上次完全备份以来变化的数据\n   - 备份频率：根据数据重要性和变化频率确定备份频率\n   - 备份存储：将备份存储在安全的位置，如异地存储\n\n3. 恢复策略：\n   - 恢复时间目标（RTO）：系统从故障恢复到正常运行所需的时间\n   - 恢复点目标（RPO）：系统故障后可以恢复到的最近时间点\n   - 恢复测试：定期测试恢复流程，确保恢复的可靠性\n   - 恢复演练：定期进行灾难恢复演练，提高团队的应急响应能力\n\n4. 灾备技术：\n   - 数据复制：实时或定期复制数据到灾备站点\n   - 快照：创建系统和数据的快照，用于快速恢复\n   - 镜像：创建系统的镜像，用于快速部署\n   - 容器化：使用容器技术，提高系统的可移植性和恢复速度\n\n5. 监控和告警：\n   - 灾备状态监控：监控灾备系统的状态\n   - 数据一致性检查：定期检查主系统和灾备系统的数据一致性\n   - 灾备演练告警：在灾备演练过程中监控系统状态\n\n6. 文档和流程：\n   - 灾备计划：制定详细的灾备计划，包括恢复步骤和责任分工\n   - 操作手册：创建详细的操作手册，指导团队进行灾备和恢复操作\n   - 定期更新：定期更新灾备计划和操作手册，确保其与系统变化保持一致\n\n7. 最佳实践：\n   - 多层次保护：实施多层次的灾备措施，提高系统的可靠性\n   - 测试验证：定期测试灾备系统，确保其可用性\n   - 自动化：自动化灾备和恢复流程，减少人为错误\n   - 培训：对团队进行灾备和恢复培训，提高团队的应急响应能力\n\n处理系统的灾备和恢复需要综合考虑灾备策略、备份策略、恢复策略、灾备技术、监控和告警、文档和流程、最佳实践等多个方面，以确保系统在遇到灾难时能够快速恢复，减少业务中断时间。',
        '实现容器编排和管理的方法：\n\n1. 容器编排工具选择：\n   - Kubernetes：最流行的容器编排平台，功能丰富，生态成熟\n   - Docker Swarm：Docker原生的容器编排工具，简单易用\n   - Mesos：分布式系统内核，可用于容器编排\n\n2. Kubernetes核心概念：\n   - Pod：最小部署单位，包含一个或多个容器\n   - Service：服务发现和负载均衡\n   - Deployment：声明式部署，管理Pod的创建和更新\n   - ReplicaSet：确保指定数量的Pod运行\n   - ConfigMap：存储配置数据\n   - Secret：存储敏感信息\n   - PersistentVolume：持久化存储\n   - Namespace：资源隔离\n\n3. 部署和管理流程：\n   - 集群搭建：部署Kubernetes集群\n   - 应用部署：使用Deployment或StatefulSet部署应用\n   - 服务暴露：使用Service或Ingress暴露服务\n   - 配置管理：使用ConfigMap和Secret管理配置\n   - 存储管理：使用PersistentVolume和PersistentVolumeClaim管理存储\n   - 监控和日志：集成Prometheus、Grafana和ELK Stack\n   - 自动扩缩容：根据负载自动调整Pod数量\n\n4. 最佳实践：\n   - 资源限制：为容器设置合理的资源限制和请求\n   - 健康检查：为Pod配置存活和就绪探针\n   - 滚动更新：使用滚动更新策略，减少服务中断\n   - 命名规范：使用清晰的命名规范管理资源\n   - 标签和注解：使用标签和注解管理资源\n   - 安全：实施RBAC，限制资源访问权限\n   - 备份：定期备份集群配置和数据\n\n5. 工具链：\n   - 集群管理：kops、kubeadm、minikube\n   - 部署工具：Helm、Kustomize\n   - CI/CD：Jenkins、GitLab CI\n   - 监控：Prometheus、Grafana\n   - 日志：ELK Stack、Loki\n   - 服务网格：Istio、Linkerd\n\n6. 挑战和解决方案：\n   - 网络配置：使用CNI插件（如Calico、Flannel）配置网络\n   - 存储管理：使用云存储或本地存储解决方案\n   - 安全：实施网络策略，限制Pod间通信\n   - 扩展性：设计可扩展的应用架构\n\n实现容器的编排和管理需要综合考虑容器编排工具选择、核心概念、部署和管理流程、最佳实践、工具链、挑战和解决方案等多个方面，以确保容器化应用的可靠性、可扩展性和安全性。'
      ],
      careerPaths: [
        { title: 'DevOps工程师', description: '负责CI/CD管道的构建和维护，确保应用的快速部署和稳定运行', salary: '18k-28k' },
        { title: 'SRE工程师', description: '负责系统的可靠性和性能，确保服务的高可用性', salary: '25k-35k' },
        { title: '云平台工程师', description: '负责云基础设施的设计和管理，优化云资源的使用', salary: '20k-30k' },
        { title: 'DevOps经理', description: '负责DevOps团队的管理和战略规划，推动DevOps实践的落地', salary: '30k-45k' }
      ],
      trends: ['GitOps的兴起', 'AI辅助DevOps', 'Serverless架构', '混沌工程', '边缘计算'],
      tools: ['Jenkins', 'GitLab CI', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus', 'Grafana']
    },
    {
      id: 'ai', 
      name: 'AI 算法', 
      questions: 70, 
      icon: 'Brain',
      description: 'AI算法工程师负责设计、开发和优化人工智能算法，以解决各种复杂问题。AI算法工程师需要掌握机器学习、深度学习等技术，能够将AI技术应用到实际业务场景中。',
      skills: ['Machine Learning', 'Deep Learning', 'Data Analysis', 'Python', 'Mathematics (Linear Algebra/Calculus/Statistics)', 'TensorFlow/PyTorch', 'NLP', 'Computer Vision', 'Reinforcement Learning', 'Model Deployment'],
      sampleQuestions: [
        '请解释一下神经网络的工作原理',
        '什么是过拟合，如何防止？',
        '机器学习中的监督学习和无监督学习有什么区别？',
        '请解释一下卷积神经网络的结构',
        '如何评估机器学习模型的性能？',
        '什么是自然语言处理，如何实现？',
        '如何处理机器学习中的不平衡数据？',
        '什么是生成对抗网络(GAN)，它的工作原理是什么？',
        '如何优化深度学习模型的性能？',
        '如何将机器学习模型部署到生产环境？'
      ],
      answers: [
        '神经网络的工作原理：\n\n1. 基本结构：\n   - 神经元：神经网络的基本单元，接收输入，进行加权求和，通过激活函数输出\n   - 层：输入层、隐藏层、输出层\n   - 权重和偏置：连接神经元的参数，通过训练学习\n\n2. 前向传播：\n   - 输入数据通过输入层进入网络\n   - 每个神经元计算输入的加权和，加上偏置\n   - 通过激活函数（如ReLU、Sigmoid、Tanh）产生输出\n   - 输出层产生最终预测结果\n\n3. 反向传播：\n   - 计算预测值与真实值之间的损失（如均方误差、交叉熵）\n   - 从输出层开始，计算损失对每个权重和偏置的梯度\n   - 使用梯度下降法更新权重和偏置，最小化损失\n   - 重复前向传播和反向传播，直到损失收敛\n\n4. 激活函数：\n   - ReLU：f(x) = max(0, x)，解决梯度消失问题\n   - Sigmoid：f(x) = 1/(1+e^-x)，用于二分类问题\n   - Tanh：f(x) = (e^x - e^-x)/(e^x + e^-x)，输出范围[-1,1]\n   - Softmax：用于多分类问题，输出概率分布\n\n5. 神经网络类型：\n   - 前馈神经网络：数据从输入层流向输出层，无循环\n   - 卷积神经网络：处理图像等网格数据\n   - 循环神经网络：处理序列数据\n   - 生成对抗网络：生成新数据\n\n神经网络通过学习数据中的模式，能够处理复杂的非线性问题，在图像识别、自然语言处理、语音识别等领域取得了显著成果。',
        `过拟合及其防止方法：\n\n1. 过拟合定义：\n   - 模型在训练数据上表现很好，但在测试数据上表现差\n   - 模型过于复杂，学习了训练数据中的噪声和细节，而不是通用模式\n\n2. 过拟合的表现：\n   - 训练误差很小，测试误差很大\n   - 模型对训练数据过度拟合，缺乏泛化能力\n\n3. 防止过拟合的方法：\n   - 数据增强：通过旋转、缩放、裁剪等方式增加训练数据\n   - 正则化：\n     * L1正则化：添加权重绝对值的惩罚项\n     * L2正则化：添加权重平方的惩罚项\n   -  dropout：在训练过程中随机丢弃部分神经元，减少模型复杂度\n   - 早停：在验证集性能不再提升时停止训练\n   - 模型简化：减少网络层数、神经元数量等\n   - 交叉验证：使用k折交叉验证评估模型性能\n   - 集成学习：结合多个模型的预测结果\n\n4. 示例（使用dropout）：
   <pre class="bg-gray-100 p-4 rounded-md text-sm">
   from tensorflow.keras.models import Sequential
   from tensorflow.keras.layers import Dense, Dropout
   
   model = Sequential()
   model.add(Dense(64, activation='relu', input_shape=(10,)))
   model.add(Dropout(0.5))  # 50%的神经元被随机丢弃
   model.add(Dense(32, activation='relu'))
   model.add(Dropout(0.5))
   model.add(Dense(1, activation='sigmoid'))
   </pre>

防止过拟合是机器学习中的重要挑战，需要通过多种方法的组合使用来提高模型的泛化能力。`,
        '监督学习和无监督学习的区别：\n\n1. 监督学习：\n   - 定义：使用标记数据（输入和对应的输出）进行训练\n   - 目标：学习输入到输出的映射关系\n   - 常见算法：线性回归、逻辑回归、决策树、随机森林、支持向量机、神经网络\n   - 应用场景：分类、回归、预测\n   - 评估指标：准确率、精确率、召回率、F1分数、均方误差\n\n2. 无监督学习：\n   - 定义：使用未标记数据进行训练，无明确的输出标签\n   - 目标：发现数据中的模式、结构或关系\n   - 常见算法：聚类（K-means、层次聚类）、降维（PCA、t-SNE）、关联规则（Apriori）、自编码器\n   - 应用场景：数据聚类、异常检测、数据压缩、特征学习\n   - 评估指标：聚类纯度、轮廓系数、互信息\n\n3. 半监督学习：\n   - 结合监督学习和无监督学习，使用少量标记数据和大量未标记数据\n   - 适用于标记数据获取成本高的场景\n\n4. 强化学习：\n   - 通过与环境交互，学习最优策略以最大化奖励\n   - 与监督学习和无监督学习并列的第三种机器学习范式\n\n监督学习和无监督学习的选择取决于数据的可用性和任务的性质。如果有标记数据且任务是预测，则选择监督学习；如果数据无标记且任务是发现模式，则选择无监督学习。',
        `卷积神经网络的结构：\n\n1. 基本组成：\n   - 卷积层：提取局部特征，使用卷积核进行特征提取\n   - 池化层：减少特征图尺寸，保留重要信息，减少计算量\n   - 激活函数：引入非线性，如ReLU\n   - 全连接层：将特征映射到输出空间\n\n2. 卷积层：\n   - 卷积操作：使用卷积核与输入进行卷积，提取特征\n   - 感受野：卷积核覆盖的输入区域\n   - 填充（Padding）：保持输出尺寸与输入一致\n   - 步长（Stride）：卷积核移动的步长\n   - 多通道：使用多个卷积核提取不同特征\n\n3. 池化层：\n   - 最大池化：取感受野内的最大值\n   - 平均池化：取感受野内的平均值\n   - 作用：降维、防止过拟合、增加感受野\n\n4. 常见架构：\n   - LeNet-5：早期的CNN架构，用于手写数字识别\n   - AlexNet：更深的网络，在ImageNet竞赛中取得突破\n   - VGGNet：使用小卷积核，更深的网络\n   - ResNet：引入残差连接，解决深层网络的梯度消失问题\n   - Inception：使用不同大小的卷积核，增加网络宽度\n\n5. 工作原理：\n   - 输入图像通过多个卷积层和池化层，提取层次化特征\n   - 底层特征：边缘、纹理等\n   - 中层特征：形状、结构等\n   - 高层特征：物体、场景等\n   - 最终通过全连接层进行分类或回归\n\n6. 示例（简单CNN）：\n   <pre class="bg-gray-100 p-4 rounded-md text-sm">
   from tensorflow.keras.models import Sequential
   from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
   
   model = Sequential()
   model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)))
   model.add(MaxPooling2D((2, 2)))
   model.add(Conv2D(64, (3, 3), activation='relu'))
   model.add(MaxPooling2D((2, 2)))
   model.add(Conv2D(64, (3, 3), activation='relu'))
   model.add(Flatten())
   model.add(Dense(64, activation='relu'))
   model.add(Dense(10, activation='softmax'))
   </pre>\n\n卷积神经网络在图像处理任务中表现出色，通过局部连接和参数共享，减少了参数量，提高了训练效率和模型性能。`,
        '评估机器学习模型性能的方法：\n\n1. 评估指标：\n   - 分类任务：\n     * 准确率（Accuracy）：正确预测的样本数占总样本数的比例\n     * 精确率（Precision）：预测为正例的样本中实际为正例的比例\n     * 召回率（Recall）：实际为正例的样本中被正确预测的比例\n     * F1分数：精确率和召回率的调和平均\n     * ROC曲线：以假阳性率为横轴，真阳性率为纵轴的曲线\n     * AUC值：ROC曲线下的面积，衡量模型区分正例和负例的能力\n   - 回归任务：\n     * 均方误差（MSE）：预测值与真实值之差的平方的平均值\n     * 均方根误差（RMSE）：MSE的平方根\n     * 平均绝对误差（MAE）：预测值与真实值之差的绝对值的平均值\n     * R²分数：模型解释的方差占总方差的比例\n\n2. 评估方法：\n   - 训练集和测试集划分：将数据分为训练集和测试集，避免过拟合\n   - 交叉验证：\n     * k折交叉验证：将数据分为k份，轮流使用k-1份训练，1份测试\n     * 留一交叉验证：k等于样本数，计算成本高\n     * 留P交叉验证：保留P个样本作为测试集\n   - 自助法（Bootstrap）：通过有放回采样创建多个训练集和测试集\n\n3. 模型选择：\n   - 网格搜索：遍历超参数组合，选择性能最佳的模型\n   - 随机搜索：随机采样超参数组合，比网格搜索更高效\n   - 贝叶斯优化：基于贝叶斯定理，逐步优化超参数\n\n4. 偏差-方差权衡：\n   - 高偏差：模型过于简单，欠拟合\n   - 高方差：模型过于复杂，过拟合\n   - 目标：找到偏差和方差的平衡点\n\n5. 实际应用中的考虑：\n   - 业务指标：结合业务需求，选择合适的评估指标\n   - 计算效率：考虑模型的训练和推理时间\n   - 可解释性：模型的可解释性对某些应用很重要\n\n评估机器学习模型性能需要综合考虑多个指标和评估方法，选择最适合特定任务的评估策略。',
        `自然语言处理及其实现方法：\n\n1. 自然语言处理（NLP）定义：\n   - 研究如何让计算机理解和处理人类语言的技术\n   - 涉及语法、语义、语用等多个层面\n\n2. 主要任务：\n   - 文本分类：情感分析、垃圾邮件检测、主题分类\n   - 命名实体识别：识别文本中的实体（人名、地名、组织名等）\n   - 关系抽取：提取实体之间的关系\n   - 文本摘要：自动生成文本摘要\n   - 机器翻译：将一种语言翻译为另一种语言\n   - 问答系统：回答用户提出的问题\n   - 文本生成：生成符合语境的文本\n   - 语音识别：将语音转换为文本\n   - 语音合成：将文本转换为语音\n\n3. 实现方法：\n   - 传统方法：\n     * 词袋模型（Bag of Words）\n     * TF-IDF（Term Frequency-Inverse Document Frequency）\n     * 隐马尔可夫模型（HMM）\n     * 条件随机场（CRF）\n   - 深度学习方法：\n     * 词嵌入：Word2Vec、GloVe、FastText\n     * 循环神经网络（RNN）：LSTM、GRU\n     *  transformer：BERT、GPT、XLNet\n     * 预训练语言模型：BERT、GPT-3、ChatGPT\n\n4. 常用库和工具：\n   - NLTK（Natural Language Toolkit）：Python自然语言处理库\n   - spaCy：工业级NLP库\n   - Hugging Face Transformers：预训练模型库\n   - TensorFlow、PyTorch：深度学习框架\n   - Stanford CoreNLP：Java NLP工具包\n\n5. 实现流程：\n   - 数据预处理：分词、去停用词、词干提取、词性标注\n   - 特征提取：将文本转换为数值特征\n   - 模型训练：使用机器学习或深度学习算法训练模型\n   - 模型评估：使用评估指标评估模型性能\n   - 模型部署：将模型部署到生产环境\n\n6. 示例（使用BERT进行情感分析）：\n   <pre class="bg-gray-100 p-4 rounded-md text-sm">
   from transformers import BertTokenizer, BertForSequenceClassification
   import torch
   
   # 加载预训练模型和分词器
   tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
   model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=2)
   
   # 输入文本
   text = "I love this movie!"
   
   # 分词
   inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True, max_length=128)
   
   # 预测
   with torch.no_grad():
       outputs = model(**inputs)
       predictions = torch.argmax(outputs.logits, dim=1)
   
   # 输出结果
   print("Sentiment:", "Positive" if predictions.item() == 1 else "Negative")
   </pre>\n\n自然语言处理是人工智能的重要分支，随着深度学习和预训练语言模型的发展，NLP技术取得了显著进步，在许多应用场景中发挥着重要作用。`,
        `处理机器学习中不平衡数据的方法：\n\n1. 不平衡数据定义：\n   - 训练数据中不同类别的样本数量差异很大\n   - 例如，欺诈检测中，欺诈样本可能只占总样本的1%\n\n2. 不平衡数据的挑战：\n   - 模型倾向于预测多数类，忽略少数类\n   - 传统评估指标（如准确率）可能误导，因为模型可以通过预测多数类获得高准确率\n\n3. 处理方法：\n   - 数据层面：\n     * 过采样（Oversampling）：增加少数类样本数量\n       - 随机过采样：随机复制少数类样本\n       - SMOTE（Synthetic Minority Over-sampling Technique）：生成合成的少数类样本\n       - ADASYN（Adaptive Synthetic Sampling）：根据样本密度生成合成样本\n     * 欠采样（Undersampling）：减少多数类样本数量\n       - 随机欠采样：随机删除多数类样本\n       - Tomek Links：删除靠近决策边界的多数类样本\n       - 编辑近邻（Edited Nearest Neighbors）：删除被多数类包围的少数类样本\n     * 混合采样：结合过采样和欠采样\n   - 算法层面：\n     * 类别权重：为少数类分配更高的权重，在损失函数中体现\n     * 集成学习：使用多个模型的集成，如随机森林\n     * 异常检测：将少数类视为异常，使用异常检测算法\n     * 一分类（One-class Classification）：只使用多数类训练模型，将新样本与多数类比较\n   - 评估层面：\n     * 使用适合不平衡数据的评估指标：精确率、召回率、F1分数、AUC-ROC、混淆矩阵\n     * 分层交叉验证：确保每个折叠中类别比例与原始数据一致\n\n4. 示例（使用SMOTE）：\n   <pre class="bg-gray-100 p-4 rounded-md text-sm">
   from imblearn.over_sampling import SMOTE
   from sklearn.model_selection import train_test_split
   
   # 假设X是特征，y是标签
   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
   
   # 使用SMOTE过采样
   smote = SMOTE(random_state=42)
   X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
   </pre>\n\n处理不平衡数据需要根据具体问题选择合适的方法，通常需要结合数据层面和算法层面的方法，以提高模型对少数类的预测性能。`,
        '生成对抗网络(GAN)的工作原理：\n\n1. GAN的基本结构：\n   - 生成器（Generator）：生成假样本，尝试欺骗判别器\n   - 判别器（Discriminator）：区分真实样本和生成的假样本\n   - 两者通过对抗训练，相互提高能力\n\n2. 工作原理：\n   - 生成器接收随机噪声作为输入，生成假样本\n   - 判别器接收真实样本和生成的假样本，输出是样本为真实的概率\n   - 生成器的目标是生成尽可能真实的样本，使判别器无法区分\n   - 判别器的目标是尽可能准确地区分真实样本和假样本\n   - 两者通过极小极大博弈进行训练：\n     * 判别器最大化正确分类的概率\n     * 生成器最小化判别器正确分类的概率\n\n3. 训练过程：\n   - 步骤1：固定生成器，训练判别器，使其能正确区分真实样本和假样本\n   - 步骤2：固定判别器，训练生成器，使其生成的假样本能被判别器误判为真实样本\n   - 重复步骤1和步骤2，直到收敛\n\n4. GAN的变体：\n   - DCGAN（Deep Convolutional GAN）：使用卷积神经网络作为生成器和判别器\n   - CGAN（Conditional GAN）：通过条件信息控制生成内容\n   - WGAN（Wasserstein GAN）：使用Wasserstein距离代替JS散度，改善训练稳定性\n   - CycleGAN：实现无配对图像的风格转换\n   - StyleGAN：生成高质量、多样化的图像\n\n5. 应用场景：\n   - 图像生成：生成逼真的图像、艺术作品\n   - 图像修复：修复图像中的缺失部分\n   - 风格转换：将一种风格的图像转换为另一种风格\n   - 文本到图像生成：根据文本描述生成图像\n   - 数据增强：生成合成数据，增强训练集\n\n6. 挑战：\n   - 训练不稳定：模式崩溃（生成器只生成少数几种样本）\n   - 难以评估：生成样本的质量和多样性难以量化\n   - 计算资源需求高：需要大量的计算资源进行训练\n\nGAN是一种强大的生成模型，通过对抗训练的方式，能够生成高质量的合成数据，在图像处理、自然语言处理等领域有广泛应用。',
        '优化深度学习模型性能的方法：\n\n1. 模型架构优化：\n   - 网络深度和宽度：根据任务复杂度调整网络深度和宽度\n   - 残差连接：解决深层网络的梯度消失问题\n   - 批归一化：加速训练，提高模型稳定性\n   - 注意力机制：让模型关注重要的输入部分\n   - 迁移学习：利用预训练模型，减少训练时间和数据需求\n\n2. 训练策略优化：\n   - 学习率调度：使用学习率衰减、余弦退火等策略\n   - 优化器选择：Adam、SGD、RMSprop等不同优化器\n   - 批量大小：选择合适的批量大小，平衡内存使用和训练稳定性\n   - 数据增强：通过旋转、缩放、裁剪等方式增加训练数据\n   - 早停：在验证集性能不再提升时停止训练\n\n3. 正则化技术：\n   - Dropout：随机丢弃部分神经元，减少过拟合\n   - L1/L2正则化：添加权重惩罚项，减少模型复杂度\n   - 数据增强：增加数据多样性，减少过拟合\n   - 标签平滑：减少模型对标签的过度自信\n\n4. 硬件优化：\n   - GPU加速：使用GPU进行并行计算\n   - 混合精度训练：使用半精度浮点数，加快训练速度\n   - 分布式训练：使用多GPU或多机训练，加快训练速度\n   - 模型量化：降低模型精度，减少内存使用和推理时间\n\n5. 推理优化：\n   - 模型压缩：剪枝、知识蒸馏等方法减小模型大小\n   - 批处理：批量处理输入，提高推理效率\n   - 缓存：缓存中间计算结果，避免重复计算\n   - 硬件加速：使用TPU、NPU等专用硬件加速推理\n\n6. 超参数调优：\n   - 网格搜索：遍历超参数组合\n   - 随机搜索：随机采样超参数组合\n   - 贝叶斯优化：基于贝叶斯定理优化超参数\n   - 自动机器学习（AutoML）：自动搜索最佳模型架构和超参数\n\n7. 监控和分析：\n   - 损失曲线：监控训练和验证损失\n   - 学习曲线：分析模型的学习进度\n   - 梯度分析：检查梯度大小，避免梯度爆炸或消失\n   - 激活函数分析：确保激活函数在合理范围内\n\n优化深度学习模型性能需要综合考虑模型架构、训练策略、正则化技术、硬件优化、推理优化、超参数调优和监控分析等多个方面，以提高模型的准确性、训练速度和推理效率。',
        `将机器学习模型部署到生产环境的方法：\n\n1. 模型选择和准备：\n   - 选择适合部署的模型：考虑模型大小、推理速度和准确性\n   - 模型训练和评估：确保模型在测试集上表现良好\n   - 模型版本控制：使用版本控制系统管理模型\n\n2. 模型转换和优化：\n   - 模型转换：将模型转换为适合部署的格式（如ONNX、TensorFlow Lite、TorchScript）\n   - 模型压缩：剪枝、量化、知识蒸馏等方法减小模型大小\n   - 推理优化：使用推理引擎（如TensorRT、OpenVINO）加速推理\n\n3. 部署方式：\n   - 服务器部署：部署在云服务器或本地服务器上\n   - 容器化部署：使用Docker容器，确保环境一致性\n   - 边缘部署：部署在边缘设备上，减少延迟\n   - 移动部署：部署在移动设备上，使用TensorFlow Lite或Core ML\n   - 无服务器部署：使用AWS Lambda、Google Cloud Functions等无服务器服务\n\n4. 部署架构：\n   - 批处理：离线处理大量数据\n   - 实时推理：在线处理单个请求\n   - 流式处理：处理连续的数据流\n\n5. 监控和维护：\n   - 模型监控：监控模型的性能指标（准确率、延迟等）\n   - 数据监控：监控输入数据的分布变化\n   - 模型更新：定期重新训练模型，适应数据变化\n   - A/B测试：比较不同模型版本的性能\n   - 回滚机制：在模型性能下降时回滚到之前的版本\n\n6. 工具和平台：\n   - 模型管理：MLflow、Weights & Biases\n   - 部署平台：Kubernetes、SageMaker、Azure ML\n   - API框架：Flask、FastAPI、Django\n   - 监控工具：Prometheus、Grafana\n\n7. 最佳实践：\n   - 自动化部署：使用CI/CD pipeline自动化模型部署\n   - 文档：记录模型的使用方法、性能指标和更新历史\n   - 安全性：保护模型和数据的安全\n   - 可扩展性：设计可扩展的部署架构\n   - 成本优化：优化资源使用，降低部署成本\n\n8. 示例（使用FastAPI部署模型）：\n   <pre class="bg-gray-100 p-4 rounded-md text-sm">
   from fastapi import FastAPI
   import uvicorn
   import pickle
   
   # 加载模型
   with open('model.pkl', 'rb') as f:
       model = pickle.load(f)
   
   app = FastAPI()
   
   @app.post('/predict')
   def predict(data: dict):
       # 处理输入数据
       features = data['features']
       # 预测
       prediction = model.predict([features])[0]
       # 返回结果
       return {'prediction': prediction}
   
   if __name__ == '__main__':
       uvicorn.run(app, host='0.0.0.0', port=8000)
   </pre>\n\n将机器学习模型部署到生产环境需要综合考虑模型准备、转换和优化、部署方式、监控和维护等多个方面，以确保模型在生产环境中稳定、高效地运行。`
      ],
      careerPaths: [
        { title: 'AI算法工程师', description: '负责AI算法的设计和开发，将AI技术应用到实际业务场景中', salary: '20k-35k' },
        { title: '机器学习工程师', description: '负责机器学习模型的训练和优化，提高模型的性能和准确性', salary: '25k-40k' },
        { title: '数据科学家', description: '负责数据分析和建模，从数据中提取有价值的 insights', salary: '20k-35k' },
        { title: 'AI研究科学家', description: '负责AI技术的前沿研究和创新，推动AI技术的发展', salary: '35k-60k' }
      ],
      trends: ['大语言模型(LLM)', '生成式AI', '联邦学习', '边缘AI', 'AI伦理和可解释性'],
      tools: ['Python', 'TensorFlow/PyTorch', 'Jupyter Notebook', 'Scikit-learn', 'Docker']
    }
  ],
  difficulty: [
    { level: 'easy', name: '入门级', description: '适合初学者，基础概念考查', color: 'bg-auxiliary-green' },
    { level: 'medium', name: '进阶级', description: '适合有一定经验的开发者', color: 'bg-primary' },
    { level: 'hard', name: '专家级', description: '适合高级工程师，深度技术考查', color: 'bg-auxiliary-orange' }
  ],
  criteria: [
    { name: '技术深度', weight: 40 },
    { name: '解决问题能力', weight: 25 },
    { name: '代码质量', weight: 20 },
    { name: '表达清晰度', weight: 15 }
  ],
  features: [
    '实时代码编辑器',
    '多语言支持 (JavaScript, Python, Java, Go)',
    'AI 实时评估反馈',
    '面试复盘与同行对比',
    '个性化学习路径推荐'
  ]
})

const showTechDetails = (type: TechType) => {
  selectedTechType.value = type
  showTechTypeDetails.value = true
}

const closeTechDetails = () => {
  showTechTypeDetails.value = false
  selectedTechType.value = null
}

const toggleTechnicalDetails = () => {
  showTechnicalDetails.value = !showTechnicalDetails.value
}

// Behavioral Interview (BQ) Details States
const showBQDetails = ref(false)
const selectedBQQuestion = ref<BQQuestion | null>(null)
const showBQQuestionDetails = ref(false)
const bqDetails = ref({
  commonQuestions: [
    {
      id: 'conflict', 
      question: '描述一次你与团队成员发生冲突的经历，你是如何解决的？', 
      category: '团队协作',
      description: '这个问题考查你如何处理团队内部的冲突，以及你的沟通和解决问题的能力。面试官希望了解你是否能够以建设性的方式解决冲突，而不是激化矛盾。',
      starAnswer: {
        situation: '在我之前的项目中，我和一位团队成员在技术实现方案上产生了分歧。我倾向于使用新框架，而他坚持使用传统方法。',
        task: '我需要找到一种方法来解决这个冲突，确保项目能够顺利进行，同时保持团队的和谐。',
        action: '我首先与他进行了一对一的沟通，了解他的顾虑。他担心新框架的稳定性和学习成本。然后我收集了相关数据和案例，证明新框架的优势，并提出了分阶段迁移的方案，以降低风险。最后，我们进行了小组讨论，共同评估两种方案的优缺点。',
        result: '最终，我们决定采用新框架，并成功完成了项目，比预期时间提前了10%。这次经历也加强了我们之间的合作关系，他后来成为了新框架的积极推广者。'
      },
      alternativeAnswers: [
        {
          situation: '在一个跨部门项目中，市场部门和开发部门在功能优先级上产生了冲突。市场部门希望优先开发用户界面功能，而开发部门希望优先解决后端架构问题。',
          task: '作为项目协调人，我需要找到一个平衡点，确保两个部门的需求都能得到满足。',
          action: '我组织了一次跨部门会议，让双方充分表达各自的观点和理由。然后我提出了一个分阶段的开发计划，先解决后端架构的关键问题，同时开始用户界面的设计工作，这样两个部门可以并行工作。',
          result: '通过这种方式，我们既保证了系统的稳定性，又满足了市场部门的需求，项目最终按时交付，得到了高层的认可。'
        }
      ],
      commonMistakes: [
        '将冲突归咎于他人，而不是分析问题本身',
        '回避冲突，希望问题自行解决',
        '过于强调自己的观点，忽视他人的想法',
        '在团队面前公开争论，激化矛盾',
        '没有提供具体的解决方案，只是抱怨问题'
      ],
      industrySpecific: {
        tech: '在科技行业，技术选型冲突很常见。强调你如何基于数据和最佳实践做出决策，同时考虑团队的技术栈和学习曲线。',
        finance: '在金融行业，合规和风险控制是关键。强调你如何在遵守 regulations 的前提下解决冲突，确保业务目标的实现。',
        healthcare: '在医疗行业，患者安全是首要考虑。强调你如何在保证患者安全的前提下解决团队冲突，确保医疗质量。'
      },
      tips: ['保持冷静，避免情绪化', '倾听对方的观点，理解其顾虑', '寻找共同点，建立共识', '提出具体的数据和案例支持你的观点', '注重团队整体利益，而非个人立场', '采用分阶段实施方案，降低风险', '及时跟进，确保解决方案的有效执行']
    },
    {
      id: 'failure', 
      question: '分享一次你经历的重大失败，你从中学到了什么？', 
      category: '自我认知',
      description: '这个问题考查你的自我反思能力和从失败中学习的能力。面试官希望了解你是否能够诚实面对失败，分析原因，并从中吸取教训。',
      starAnswer: {
        situation: '在我负责的一个项目中，由于我对时间估计不足，导致项目延期交付，给客户带来了不便。',
        task: '我需要分析失败的原因，并采取措施确保类似问题不再发生。',
        action: '我首先向客户道歉并解释情况，然后与团队一起加班完成项目。之后，我对整个过程进行了复盘，识别出时间估计不足的原因：我没有充分考虑到第三方API集成的复杂性和潜在的技术风险。我制定了更准确的项目规划方法，包括更详细的任务分解和风险评估。',
        result: '通过这次经历，我学会了更全面地评估项目风险和时间需求，并且在之后的项目中都能按时或提前交付。我还开发了一个项目风险评估模板，被团队广泛采用。'
      },
      alternativeAnswers: [
        {
          situation: '我曾经负责一个产品的市场推广活动，但活动效果远低于预期，没有达到销售目标。',
          task: '我需要分析活动失败的原因，并提出改进措施。',
          action: '我收集了活动数据，进行了用户调研，并与团队成员进行了深入讨论。我发现问题在于目标受众定位不准确，推广渠道选择不当，以及活动内容不够吸引人。我重新制定了推广策略，调整了目标受众和渠道，并优化了活动内容。',
          result: '在后续的推广活动中，我们的转化率提高了30%，成功达到了销售目标。这次经历让我深刻认识到市场调研和数据分析的重要性。'
        }
      ],
      commonMistakes: [
        '回避失败，只谈论成功经历',
        '将失败归咎于他人或外部因素',
        '没有具体的失败案例，泛泛而谈',
        '没有分析失败的原因，只是描述事件',
        '没有说明从失败中学习到的经验和改进措施',
        '过于消极，只强调失败的负面影响'
      ],
      industrySpecific: {
        tech: '在科技行业，快速迭代和试错是常态。强调你如何将失败视为学习机会，快速调整策略，持续改进产品。',
        finance: '在金融行业，风险管理至关重要。强调你如何从失败中识别风险因素，完善风险控制机制。',
        healthcare: '在医疗行业，错误可能带来严重后果。强调你如何从失败中学习，改进医疗流程和患者安全措施。'
      },
      tips: ['诚实面对失败，选择一个有意义的失败案例', '分析具体原因，避免泛泛而谈', '强调从失败中学习到的经验和教训', '展示如何将经验应用到后续工作中，取得积极成果', '保持积极的态度，将失败视为成长的机会', '使用具体的数据和例子来支持你的故事', '展示你如何帮助团队从失败中学习']
    },
    {
      id: 'leadership', 
      question: '描述一次你领导团队完成项目的经历，你采取了哪些策略？', 
      category: '领导力',
      description: '这个问题考查你的领导能力和团队管理能力。面试官希望了解你如何激励团队，解决问题，以及实现项目目标。',
      starAnswer: {
        situation: '我被任命为一个新项目的负责人，需要带领一个由5人组成的团队完成一个复杂的软件开发项目。团队成员来自不同背景，有些缺乏相关经验。',
        task: '我需要确保团队成员明确各自的职责，保持良好的沟通，并按时完成项目。同时，我需要帮助经验不足的成员快速成长。',
        action: '我首先组织了团队会议，明确项目目标和每个人的职责，根据成员的技能和经验分配任务。然后建立了每周例会制度，及时解决问题和调整计划。我还定期与团队成员进行一对一沟通，了解他们的困难并提供支持。对于经验不足的成员，我提供了额外的培训和指导，并安排有经验的成员进行结对编程。',
        result: '项目最终按时完成，质量达到了客户的要求。团队成员也表示在这个过程中收获了很多，团队凝聚力得到了提升。有两位经验不足的成员在项目结束后获得了晋升。'
      },
      alternativeAnswers: [
        {
          situation: '我所在的团队面临一个紧急项目，需要在两周内完成一个重要客户的定制化需求。团队成员都已经有其他工作负担。',
          task: '作为团队负责人，我需要合理分配任务，激励团队成员，确保项目按时完成。',
          action: '我首先与团队成员进行了沟通，了解他们的当前工作负担，然后重新调整了工作优先级。我将项目分解为小任务，明确每个任务的截止时间和负责人。我还与上级沟通，获得了额外的资源支持。在项目过程中，我每天与团队成员进行简短的站会，及时解决问题，并对团队的进展给予肯定和鼓励。',
          result: '团队最终按时完成了项目，客户非常满意。这次经历也增强了团队的凝聚力和应对紧急任务的能力。'
        }
      ],
      commonMistakes: [
        '将领导力等同于命令和控制，忽视团队成员的意见',
        '只强调自己的贡献，忽视团队的集体努力',
        '没有具体的领导案例，泛泛而谈',
        '没有说明如何应对挑战和解决问题',
        '没有展示如何帮助团队成员成长',
        '只关注任务完成，忽视团队氛围和成员感受'
      ],
      industrySpecific: {
        tech: '在科技行业，敏捷开发和协作至关重要。强调你如何采用敏捷方法，促进团队协作，快速响应变化。',
        finance: '在金融行业，合规和准确性是关键。强调你如何在确保合规的前提下，带领团队实现业务目标。',
        healthcare: '在医疗行业，患者安全和团队协作是核心。强调你如何带领跨专业团队，确保医疗质量和患者安全。'
      },
      tips: ['明确目标和职责，确保每个人都了解自己的角色', '建立有效的沟通机制，保持信息透明', '提供支持和指导，帮助团队成员成长', '激励团队成员，认可他们的贡献', '及时解决问题，调整计划', '展示如何处理团队冲突和挑战', '强调团队的集体成就，而非个人英雄主义']
    },
    {
      id: 'pressure', 
      question: '分享一次你在高压环境下工作的经历，你是如何应对的？', 
      category: '抗压能力',
      description: '这个问题考查你的抗压能力和在压力下的表现。面试官希望了解你是否能够在压力下保持冷静，有效管理时间和资源，确保任务完成。',
      starAnswer: {
        situation: '在我之前的工作中，有一次客户突然要求在一周内完成原本需要一个月的项目修改。这意味着我们需要在短时间内完成大量工作，同时确保质量。',
        task: '我需要在短时间内完成项目修改，同时确保团队成员的工作负荷合理，避免 burnout。',
        action: '我首先制定了详细的工作计划，优先处理重要任务，并将工作分解为可管理的小块。然后与团队成员分工合作，明确每个任务的截止时间。我还与客户沟通，确认哪些功能是最关键的，哪些可以后续迭代。在工作过程中，我保持了良好的心态，通过短暂的休息和运动来缓解压力，并鼓励团队成员也这样做。',
        result: '我们最终按时完成了项目修改，客户对结果非常满意。这次经历也让我学会了如何在高压环境下保持高效工作，以及如何有效地管理时间和资源。'
      },
      alternativeAnswers: [
        {
          situation: '我曾经负责一个重要项目的上线，在上线前一天发现了一个严重的技术问题，需要在24小时内解决。',
          task: '我需要在有限的时间内解决技术问题，确保项目按时上线。',
          action: '我首先组建了一个应急团队，明确分工，然后分析问题的根本原因。我采用了系统化的调试方法，逐步缩小问题范围。在解决问题的过程中，我保持了冷静的心态，鼓励团队成员集思广益，并定期与上级沟通进展。',
          result: '我们最终在上线前成功解决了问题，项目按时上线，没有出现任何故障。这次经历让我学会了如何在高压环境下保持冷静，快速解决问题。'
        }
      ],
      commonMistakes: [
        '将压力归咎于他人或外部因素，表现出消极态度',
        '没有具体的高压场景，泛泛而谈',
        '没有说明如何具体应对压力，只是说自己能够承受压力',
        '忽视团队合作，强调个人英雄主义',
        '没有展示如何在压力下保持工作质量',
        '过于强调压力的负面影响，而不是如何积极应对'
      ],
      industrySpecific: {
        tech: '在科技行业，项目 deadlines和技术挑战很常见。强调你如何通过技术专长和有效的时间管理来应对压力。',
        finance: '在金融行业，市场波动和 regulatory changes 可能带来压力。强调你如何在保持合规的前提下，应对紧急情况。',
        healthcare: '在医疗行业，紧急情况和患者安全压力很大。强调你如何在高压环境下保持专业判断，确保患者安全。'
      },
      tips: ['制定详细的计划，优先处理重要任务', '将大任务分解为小步骤，避免 overwhelm', '与团队成员合作，合理分配工作', '保持良好的心态，通过适当的方式缓解压力', '与 stakeholders 沟通，管理期望', '保持专注，避免分心', '定期休息，保持精力充沛', '事后复盘，总结经验教训']
    },
    {
      id: 'innovation', 
      question: '描述一次你提出创新解决方案的经历，结果如何？', 
      category: '创新能力',
      description: '这个问题考查你的创新能力和解决问题的能力。面试官希望了解你是否能够识别问题，提出创造性的解决方案，并成功实施。',
      starAnswer: {
        situation: '在我之前的公司，我们的客户服务流程效率低下，导致客户满意度下降。客户需要通过多个渠道提交请求，信息分散在不同系统中，导致响应时间长，错误率高。',
        task: '我需要找到一种方法来提高客户服务的效率和质量，提升客户满意度。',
        action: '我分析了现有的服务流程，发现问题在于信息传递不及时和重复工作。我提出了一个基于自动化的客户服务系统，将各个环节的信息整合起来，减少了重复工作。我与技术团队合作，设计了系统架构，并进行了原型测试。我还与客户服务团队沟通，了解他们的需求和痛点，确保系统能够满足实际需求。',
        result: '新系统实施后，客户服务响应时间减少了50%，客户满意度提高了20%。这个解决方案也被公司推广到其他部门，成为公司的标杆项目。我因此获得了年度创新奖。'
      },
      alternativeAnswers: [
        {
          situation: '我所在的团队负责开发一个移动应用，但用户留存率一直很低。通过用户调研，我发现用户对应用的导航和功能设计不满意。',
          task: '我需要提出创新的解决方案，提高用户留存率。',
          action: '我组织了一个设计思维工作坊，与团队成员和用户代表一起 brainstorming。我提出了一个基于用户行为数据的个性化导航系统，根据用户的使用习惯和偏好，动态调整应用的界面和功能。我与设计和开发团队合作，实现了这个功能，并进行了A/B测试。',
          result: '新功能上线后，用户留存率提高了35%，用户满意度也显著提升。这个功能成为了应用的核心特色，吸引了更多用户。'
        }
      ],
      commonMistakes: [
        '没有具体的创新案例，泛泛而谈',
        '只提出了想法，没有说明如何实施和落地',
        '忽视团队合作，强调个人的创新，而不是团队的集体努力',
        '没有展示创新的实际效果和影响',
        '没有分析创新过程中遇到的挑战和如何克服',
        '将常规的改进误认为是创新'
      ],
      industrySpecific: {
        tech: '在科技行业，技术创新是核心竞争力。强调你如何利用新技术和方法，解决业务问题。',
        finance: '在金融行业，合规和风险管理是创新的前提。强调你如何在遵守 regulations 的前提下，创新金融产品和服务。',
        healthcare: '在医疗行业，患者安全是创新的首要考虑。强调你如何通过创新，提高医疗质量和患者体验。'
      },
      tips: ['分析问题的根本原因，而不是只解决表面症状', '寻找创新的解决方案，挑战传统思维', '收集数据和案例支持你的方案，验证可行性', '与团队合作实施，充分利用团队的专业知识', '进行原型测试，快速迭代改进', '评估和调整方案，确保实际效果', '展示创新的商业价值和影响', '分享创新过程中遇到的挑战和如何克服']
    }
  ],
  strategies: [
    { name: 'STAR法则', description: '情境(Situation)、任务(Task)、行动(Action)、结果(Result)，结构化回答问题' },
    { name: '量化成果', description: '使用具体数字和数据来展示你的成就和影响' },
    { name: '自我反思', description: '展示你如何从失败中学习并不断改进' },
    { name: '团队导向', description: '强调团队合作和集体成就，而非个人英雄主义' },
    { name: '积极态度', description: '保持积极正面的语言，避免抱怨或指责他人' }
  ],
  evaluationCriteria: [
    { name: '沟通表达', weight: 25 },
    { name: '领导力', weight: 20 },
    { name: '团队协作', weight: 20 },
    { name: '问题解决', weight: 15 },
    { name: '抗压能力', weight: 10 },
    { name: '自我认知', weight: 10 }
  ],
  features: [
    'AI 行为模式分析',
    'STAR 法则结构化引导',
    '实时反馈与改进建议',
    '软技能全方位评估',
    '行业标准行为模型对比'
  ]
})

const toggleBQDetails = () => {
  showBQDetails.value = !showBQDetails.value
}

const openBQQuestionDetails = (question: BQQuestion) => {
  selectedBQQuestion.value = question
  showBQQuestionDetails.value = true
}

const closeBQQuestionDetails = () => {
  showBQQuestionDetails.value = false
  selectedBQQuestion.value = null
}

// Pressure Interview Details States
const showPressureDetails = ref(false)
const selectedPressureScenario = ref<PressureScenario | null>(null)
const showPressureScenarioDetails = ref(false)
const pressureDetails = ref({
  strategies: [
    { name: '保持冷静', description: '通过深呼吸和积极的自我暗示，保持冷静的心态面对压力' },
    { name: '快速分析', description: '快速理解问题核心，识别关键信息，避免陷入次要细节' },
    { name: '结构化回答', description: '即使时间有限，也要保持回答的结构清晰，先给出核心观点' },
    { name: '寻求澄清', description: '如果问题不够明确，礼貌地请求面试官澄清，争取思考时间' },
    { name: '练习准备', description: '提前练习常见问题的简要回答，提高反应速度和表达能力' }
  ],
  sampleQuestions: [
    '请在30秒内介绍一下你的优势',
    '如何在一天内完成一周的工作？',
    '你如何处理多个截止日期？',
    '请快速分析这个问题并给出解决方案',
    '你如何在压力下保持高效？',
    '你的项目经验看起来很普通，有什么特别之处吗？',
    '你在项目中遇到的最大挑战是什么？如何解决的？',
    '你的技术能力看起来不够深入，你如何看待这个问题？',
    '你为什么离开上一家公司？',
    '你的薪资要求似乎高于市场水平，你认为你值这个价吗？'
  ],
  scenarios: [
    {
      id: 'time-pressure', 
      name: '时间压力', 
      description: '面试官快速连续提问，要求在极短时间内给出答案，测试你的快速思维和表达能力。这种场景模拟了真实工作中需要快速决策的情况。', 
      difficulty: '高',
      example: '面试官在5分钟内提出10个问题，每个问题只给30秒思考时间，包括技术问题、行为问题和情景问题。',
     应对策略: [
        {
          step: 1,
          title: '保持冷静',
          description: '深呼吸，保持微笑，避免表现出紧张或焦虑。记住，面试官是在测试你的抗压能力，而不是故意为难你。'
        },
        {
          step: 2,
          title: '快速分析',
          description: '快速理解问题的核心，识别关键信息，避免陷入次要细节。'
        },
        {
          step: 3,
          title: '结构化回答',
          description: '即使时间有限，也要保持回答的结构清晰，先给出核心观点，再简要展开。'
        },
        {
          step: 4,
          title: '寻求澄清',
          description: '如果问题不够明确，礼貌地请求面试官澄清，争取思考时间。'
        },
        {
          step: 5,
          title: '练习准备',
          description: '提前练习常见问题的简要回答，提高反应速度和表达能力。'
        }
      ],
      industrySpecific: {
        tech: '在科技行业，时间压力场景常见于产品发布、技术故障等紧急情况。强调你如何在保证代码质量的同时快速解决问题。',
        finance: '在金融行业，时间压力场景常见于市场波动、交易截止等情况。强调你如何在遵守 regulations 的前提下快速做出决策。',
        healthcare: '在医疗行业，时间压力场景常见于急诊、手术等情况。强调你如何在保证患者安全的前提下快速做出诊断和治疗决策。'
      },
     压力水平评估: {
        low: '能够在时间压力下保持冷静，回答准确但可能不够详细',
        medium: '能够在时间压力下快速思考，给出结构化的回答',
        high: '能够在时间压力下保持清晰思路，给出全面且有深度的回答'
      },
      tips: [
        '提前准备常见问题的简要回答',
        '保持冷静，不要因为时间紧张而慌乱',
        '优先回答问题的核心部分',
        '如果需要时间思考，明确告知面试官',
        '练习快速思考和表达的能力',
        '使用简洁明了的语言',
        '保持积极的态度，即使遇到困难也不要放弃'
      ],
      sampleQuestions: [
        '请在30秒内介绍一下你的优势',
        '如何在一天内完成一周的工作？',
        '你如何处理多个截止日期？',
        '请快速分析这个问题并给出解决方案',
        '你如何在压力下保持高效？'
      ],
      answers: [
        '我的优势主要体现在三个方面：技术能力、团队协作和问题解决。技术上，我精通前端开发，熟悉React和Vue框架；团队协作方面，我善于沟通，能够与不同背景的人合作；问题解决上，我能够快速分析问题并找到最优解决方案。',
        '我会首先评估任务的优先级，将重要且紧急的任务放在首位，然后制定详细的工作计划，合理分配时间，同时寻求团队成员的帮助，确保在一天内完成最重要的工作。',
        '我会使用时间管理工具，将任务按照紧急程度和重要性分类，优先处理紧急且重要的任务，同时设置合理的截止日期提醒，确保不会错过任何截止日期。',
        '首先，我需要理解问题的本质，然后分析可能的解决方案，评估每个方案的优缺点，最后选择最优方案并实施。在实施过程中，我会不断监控进度并根据需要调整方案。',
        '我会通过深呼吸和短暂的休息来缓解压力，同时保持清晰的思路，优先处理重要任务，避免分心，确保工作质量。'
      ],
      feedback: [
        '时间压力面试结束后，回顾自己的表现，分析哪些问题回答得好，哪些需要改进。',
        '注意观察面试官的反应，了解他们对自己回答的满意度。',
        '总结经验教训，为下次面试做准备。'
      ]
    },
    {
      id: 'critical-questions', 
      name: '批判性问题', 
      description: '面试官质疑你的专业能力和项目经历，测试你的抗压能力和应变能力。这种场景模拟了真实工作中可能遇到的挑战和质疑。', 
      difficulty: '高',
      example: '面试官质疑你的项目经验的真实性，或者对你的技术能力表示怀疑，不断追问细节，测试你的专业知识和自信心。',
     应对策略: [
        {
          step: 1,
          title: '保持冷静',
          description: '不要被面试官的质疑激怒或 defensive，保持专业和礼貌。'
        },
        {
          step: 2,
          title: '倾听理解',
          description: '认真倾听面试官的质疑，理解他们的关注点。'
        },
        {
          step: 3,
          title: '提供证据',
          description: '用具体的例子、数据和细节来证明自己的能力和经验。'
        },
        {
          step: 4,
          title: '承认不足',
          description: '如果确实存在不足，诚实承认，但同时强调自己的学习能力和进步。'
        },
        {
          step: 5,
          title: '转化机会',
          description: '将质疑视为展示自己能力和潜力的机会，积极回应。'
        }
      ],
      industrySpecific: {
        tech: '在科技行业，批判性问题常见于技术面试中对技术方案的质疑。强调你如何基于数据和最佳实践做出决策。',
        finance: '在金融行业，批判性问题常见于对投资决策或风险管理的质疑。强调你如何在遵守 regulations 的前提下做出决策。',
        healthcare: '在医疗行业，批判性问题常见于对诊断或治疗方案的质疑。强调你如何基于医学证据和患者需求做出决策。'
      },
     压力水平评估: {
        low: '能够应对基本的质疑，但可能在压力下表现出紧张或防御性',
        medium: '能够冷静应对质疑，提供合理的解释和证据',
        high: '能够将质疑转化为展示自己能力的机会，表现出自信和专业'
      },
      tips: [
        '保持冷静，不要被面试官的质疑激怒',
        '用具体的例子和数据来证明自己的能力',
        '承认自己的不足，但同时强调自己的学习能力',
        '保持专业和礼貌，不要与面试官争论',
        '将质疑视为展示自己能力的机会',
        '保持自信，但不要傲慢',
        '专注于问题本身，而不是面试官的态度'
      ],
      sampleQuestions: [
        '你的项目经验看起来很普通，有什么特别之处吗？',
        '你在项目中遇到的最大挑战是什么？如何解决的？',
        '你的技术能力看起来不够深入，你如何看待这个问题？',
        '你为什么离开上一家公司？',
        '你的薪资要求似乎高于市场水平，你认为你值这个价吗？'
      ],
      answers: [
        '虽然我的项目经验看起来普通，但我在项目中负责了核心功能的开发，并且通过优化代码提高了系统性能。例如，在最近的项目中，我通过重构代码将页面加载时间减少了50%，同时提高了代码的可维护性。',
        '我在项目中遇到的最大挑战是团队成员突然离职，导致项目进度延迟。我通过重新分配任务，加班加点工作，同时寻求其他团队成员的帮助，最终按时完成了项目。',
        '我承认我的技术能力还有提升空间，但我一直在不断学习和进步。我经常参加技术培训和研讨会，阅读技术书籍和博客，同时在项目中不断实践和应用新技术。我相信通过不断学习，我可以成为一名技术专家。',
        '我离开上一家公司是因为我希望寻求更多的挑战和成长机会。我已经在那里工作了三年，完成了多个项目，积累了丰富的经验，现在我希望能够在一个更大的平台上发挥我的能力。',
        '我认为我的薪资要求是合理的，因为我具备丰富的经验和技能，能够为公司创造价值。我在之前的工作中通过优化系统提高了效率，为公司节省了成本，同时我一直在不断学习和提升自己的能力，能够适应不断变化的技术环境。'
      ],
      feedback: [
        '批判性面试结束后，回顾面试官的质疑，分析自己的回应是否有效。',
        '思考如何在未来的面试中更好地应对类似的质疑。',
        '总结自己的优势和不足，制定改进计划。'
      ]
    },
    {
      id: 'role-play', 
      name: '角色扮演', 
      description: '模拟真实工作场景中的紧急情况，要求快速做出决策，测试你的应变能力和问题解决能力。这种场景模拟了真实工作中可能遇到的各种挑战。', 
      difficulty: '中',
      example: '模拟客户投诉、团队冲突或项目紧急情况等场景，要求你在短时间内做出决策并采取行动。',
     应对策略: [
        {
          step: 1,
          title: '快速进入角色',
          description: '迅速理解场景的背景和你的角色，明确你的职责和目标。'
        },
        {
          step: 2,
          title: '分析问题',
          description: '快速分析问题的根本原因和影响，识别关键问题点。'
        },
        {
          step: 3,
          title: '制定方案',
          description: '提出多种可能的解决方案，评估每个方案的优缺点。'
        },
        {
          step: 4,
          title: '做出决策',
          description: '选择最优解决方案，并说明决策的理由。'
        },
        {
          step: 5,
          title: '执行行动',
          description: '具体说明你将如何执行决策，包括步骤、时间线和资源需求。'
        }
      ],
      industrySpecific: {
        tech: '在科技行业，角色扮演场景常见于产品开发、技术支持等情况。强调你如何平衡技术可行性和业务需求。',
        finance: '在金融行业，角色扮演场景常见于客户服务、风险评估等情况。强调你如何在遵守 regulations 的前提下满足客户需求。',
        healthcare: '在医疗行业，角色扮演场景常见于患者沟通、急诊处理等情况。强调你如何在保证患者安全的前提下提供优质医疗服务。'
      },
     压力水平评估: {
        low: '能够理解场景并做出基本决策，但可能缺乏全面性和细节',
        medium: '能够快速分析场景并做出合理决策，考虑到主要因素',
        high: '能够全面分析场景，做出最优决策，并提供详细的执行计划'
      },
      tips: [
        '快速进入角色，理解场景的核心问题',
        '分析问题的根本原因',
        '提出具体的解决方案',
        '考虑解决方案的可行性和影响',
        '展示良好的沟通和决策能力',
        '保持冷静，即使面对紧急情况也不要慌乱',
        '关注问题的解决，而不是推卸责任'
      ],
      sampleQuestions: [
        '你是一名客服经理，有客户投诉产品质量问题，要求退款，你如何处理？',
        '你是一名项目经理，项目进度落后，你如何与团队沟通并调整计划？',
        '你是一名技术主管，团队成员之间发生冲突，你如何解决？',
        '你是一名产品经理，客户要求在短时间内添加新功能，你如何处理？',
        '你是一名销售经理，客户突然取消订单，你如何挽回？'
      ],
      answers: [
        '首先，我会向客户道歉，表达对他们的理解和关心。然后，我会详细了解产品质量问题的具体情况，确认问题的真实性。如果问题确实存在，我会按照公司的政策为客户办理退款，并提供一些额外的补偿，同时记录问题并反馈给产品团队，以避免类似问题再次发生。',
        '首先，我会召开团队会议，分析项目进度落后的原因，然后与团队成员一起制定调整计划，重新分配任务，设置新的里程碑和截止日期。同时，我会与上级沟通，说明情况并寻求支持，确保项目能够按时完成。',
        '首先，我会分别与冲突的团队成员沟通，了解冲突的原因，然后组织团队会议，让双方表达自己的观点，寻找共同点，提出解决方案。同时，我会强调团队合作的重要性，帮助团队成员建立良好的沟通和合作关系。',
        '首先，我会评估客户要求的新功能的可行性和优先级，然后与开发团队沟通，了解实现所需的时间和资源。如果时间允许，我会调整项目计划，添加新功能；如果时间不允许，我会与客户沟通，说明情况，建议将新功能推迟到下一版本。',
        '首先，我会与客户沟通，了解取消订单的原因，然后根据客户的需求提供解决方案，例如调整产品规格、提供折扣或延长交货期等。同时，我会强调我们产品的优势和价值，争取客户改变决定。'
      ],
      feedback: [
        '角色扮演结束后，回顾自己的决策过程，分析是否考虑了所有重要因素。',
        '思考如何在未来的类似场景中做出更好的决策。',
        '总结经验教训，提高自己的应变能力和问题解决能力。'
      ]
    },
    {
      id: 'multi-tasking', 
      name: '多任务处理', 
      description: '同时处理多个问题，测试你的注意力和优先级管理能力。这种场景模拟了真实工作中需要同时处理多项任务的情况。', 
      difficulty: '中',
      example: '同时处理多个任务，如回答问题、查看文档、解决技术问题等，测试你的注意力分配和任务管理能力。',
     应对策略: [
        {
          step: 1,
          title: '优先级排序',
          description: '快速评估任务的紧急程度和重要性，确定优先级。'
        },
        {
          step: 2,
          title: '时间分配',
          description: '为每个任务分配合理的时间，确保重要任务得到足够的关注。'
        },
        {
          step: 3,
          title: '专注执行',
          description: '一次只专注于一个任务，避免任务之间的干扰。'
        },
        {
          step: 4,
          title: '有效沟通',
          description: '及时与相关人员沟通，确保任务进展顺利。'
        },
        {
          step: 5,
          title: '灵活调整',
          description: '根据任务进展和新的情况，灵活调整优先级和时间分配。'
        }
      ],
      industrySpecific: {
        tech: '在科技行业，多任务处理场景常见于产品开发、技术支持等情况。强调你如何在保证代码质量的同时处理多个任务。',
        finance: '在金融行业，多任务处理场景常见于交易、风险管理等情况。强调你如何在遵守 regulations 的前提下处理多个任务。',
        healthcare: '在医疗行业，多任务处理场景常见于急诊、病房管理等情况。强调你如何在保证患者安全的前提下处理多个任务。'
      },
     压力水平评估: {
        low: '能够处理基本的多任务，但可能在压力下出现混乱或错误',
        medium: '能够有效地管理多个任务，保持清晰的思路',
        high: '能够高效地处理多个任务，保持工作质量和效率'
      },
      tips: [
        '优先处理重要且紧急的任务',
        '合理分配时间和注意力',
        '保持清晰的思路，避免任务之间的干扰',
        '及时沟通，寻求帮助',
        '保持冷静，不要因为任务多而慌乱',
        '使用任务管理工具，提高效率',
        '定期检查任务进展，确保按时完成'
      ],
      sampleQuestions: [
        '你如何同时处理多个任务？',
        '如果同时有多个紧急任务，你如何优先级排序？',
        '你如何避免任务之间的干扰？',
        '如果任务太多，你如何寻求帮助？',
        '你如何在多任务处理中保持工作质量？'
      ],
      answers: [
        '我会使用时间管理工具，将任务按照紧急程度和重要性分类，优先处理紧急且重要的任务，然后合理分配时间，确保每个任务都能得到适当的关注。同时，我会保持清晰的思路，避免任务之间的干扰。',
        '我会根据任务的紧急程度、重要性和影响范围来优先级排序，优先处理紧急且重要的任务，然后处理重要但不紧急的任务，最后处理紧急但不重要的任务。同时，我会与相关人员沟通，确保优先级的合理性。',
        '我会为每个任务设置专门的时间段，避免在同一时间段处理多个任务，同时保持工作环境的整洁和有序，减少干扰因素。此外，我会使用任务管理工具，记录任务的进展和状态，避免任务之间的混淆。',
        '如果任务太多，我会与上级沟通，说明情况，请求调整任务优先级或分配更多资源。同时，我会与团队成员合作，寻求帮助，确保任务能够按时完成。',
        '我会在处理每个任务时保持专注，确保工作质量，同时定期检查和测试，避免错误。此外，我会保持良好的工作习惯，如记录工作进展、备份数据等，确保工作的可靠性。'
      ],
      feedback: [
        '多任务处理面试结束后，回顾自己的任务管理策略，分析是否有效。',
        '思考如何在未来的工作中更好地管理多个任务。',
        '总结经验教训，提高自己的时间管理和多任务处理能力。'
      ]
    },
    {
      id: 'technical-challenge', 
      name: '技术挑战', 
      description: '现场解决复杂技术问题，面试官不断追问细节，测试你的技术能力和抗压能力。这种场景模拟了真实工作中需要解决复杂技术问题的情况。', 
      difficulty: '高',
      example: '现场解决算法问题、系统设计问题或调试问题，面试官不断追问技术细节和决策理由。',
     应对策略: [
        {
          step: 1,
          title: '理解问题',
          description: '仔细阅读问题，确保理解正确，如有疑问及时澄清。'
        },
        {
          step: 2,
          title: '分析问题',
          description: '分析问题的本质和要求，识别关键技术点。'
        },
        {
          step: 3,
          title: '制定方案',
          description: '提出多种解决方案，评估每个方案的优缺点。'
        },
        {
          step: 4,
          title: '实施解决方案',
          description: '选择最优方案，逐步实施，同时解释自己的思路。'
        },
        {
          step: 5,
          title: '优化和测试',
          description: '测试解决方案，优化性能和可靠性。'
        }
      ],
      industrySpecific: {
        tech: '在科技行业，技术挑战场景常见于技术面试、代码审查等情况。强调你如何利用技术专长解决复杂问题。',
        finance: '在金融行业，技术挑战场景常见于系统开发、风险建模等情况。强调你如何在保证安全性和合规性的前提下解决技术问题。',
        healthcare: '在医疗行业，技术挑战场景常见于医疗系统开发、数据分析等情况。强调你如何在保证患者安全和数据隐私的前提下解决技术问题。'
      },
     压力水平评估: {
        low: '能够解决基本的技术问题，但可能在压力下表现出紧张或思路不清',
        medium: '能够解决复杂的技术问题，保持清晰的思路',
        high: '能够高效地解决复杂的技术问题，展示深厚的技术功底和解决问题的能力'
      },
      tips: [
        '保持冷静，不要因为问题复杂而慌乱',
        '分析问题的根本原因',
        '提出多种解决方案并评估其优缺点',
        '与面试官沟通，确认理解正确',
        '展示解决问题的思路和过程',
        '注意代码的可读性和可维护性',
        '考虑边界情况和异常处理'
      ],
      sampleQuestions: [
        '请设计一个高可用的系统架构',
        '如何优化数据库查询性能？',
        '请解决这个算法问题',
        '如何处理系统的高并发请求？',
        '如何确保系统的安全性？'
      ],
      answers: [
        '我会设计一个高可用的系统架构，包括多服务器部署、负载均衡、数据备份和恢复机制等。具体来说，我会使用多个服务器实例，通过负载均衡器分配请求，确保系统的可用性；同时，我会使用数据库集群和缓存机制，提高系统的性能和可靠性。',
        '我会通过以下方法优化数据库查询性能：1. 添加适当的索引，2. 优化查询语句，避免全表扫描，3. 使用分页查询，限制返回数据量，4. 使用缓存机制，减少数据库访问，5. 定期清理和优化数据库。',
        '对于算法问题，我会首先理解问题的要求，然后分析可能的解决方案，选择最优的算法，编写代码实现，然后测试和优化。在解决过程中，我会与面试官沟通，确保理解正确，并展示我的思路和过程。',
        '我会通过以下方法处理系统的高并发请求：1. 使用负载均衡器分配请求，2. 使用缓存机制，减少数据库访问，3. 优化代码和数据库查询，提高系统性能，4. 使用消息队列，异步处理请求，5. 水平扩展，增加服务器实例。',
        '我会通过以下方法确保系统的安全性：1. 使用加密技术保护数据，2. 实施访问控制和权限管理，3. 定期进行安全审计和漏洞扫描，4. 实施防火墙和入侵检测系统，5. 培训员工，提高安全意识。'
      ],
      feedback: [
        '技术挑战面试结束后，回顾自己的解题过程，分析是否有更优的解决方案。',
        '思考如何在未来的技术面试中更好地展示自己的技术能力。',
        '总结经验教训，提高自己的技术水平和解决问题的能力。'
      ]
    }
  ],
  evaluationCriteria: [
    { name: '抗压能力', weight: 30 },
    { name: '快速思维', weight: 25 },
    { name: '决策能力', weight: 20 },
    { name: '沟通表达', weight: 15 },
    { name: '专业知识', weight: 10 }
  ],
  features: [
    'AI 实时压力指数监测',
    '真实大厂面试场景模拟',
    '多维度抗压能力评估',
    '个性化应对策略建议',
    '压力下的表现复盘分析'
  ]
})

const togglePressureDetails = () => {
  showPressureDetails.value = !showPressureDetails.value
}

const openPressureScenarioDetails = (scenario: PressureScenario) => {
  selectedPressureScenario.value = scenario
  showPressureScenarioDetails.value = true
}

const closePressureScenarioDetails = () => {
  showPressureScenarioDetails.value = false
  selectedPressureScenario.value = null
}
</script>

<template>
  <div class="flex flex-col gap-6 max-w-7xl mx-auto min-h-[80vh]">
    <!-- 1. Home Step -->
    <div v-if="currentStep === 'home'" class="flex flex-col gap-8 animate-in fade-in duration-500">
      <div class="text-center space-y-4 py-8">
        <h1 class="text-4xl font-black text-neutral-title tracking-tight">AI 面试实战中心</h1>
        <p class="text-neutral-helper max-w-2xl mx-auto">
          通过高度仿真的 AI 面试官，进行多维度岗位技能评测。提供实时反馈、压力测试及详细的能力报告。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="card in [
          { title: '技术专项面试', desc: '深度考查前端、后端、架构等专业技术能力', icon: Zap, color: 'gradient-primary', action: toggleTechnicalDetails },
          { title: '行为面试 (BQ)', desc: '评估软技能、领导力、团队协作及解决问题的能力', icon: Target, color: 'gradient-cyan-yellow', action: toggleBQDetails },
          { title: '压力模拟面试', desc: '高强度连环追问，模拟真实大厂高压面试环境', icon: Zap, color: 'bg-auxiliary-orange', action: togglePressureDetails }
        ]" :key="card.title" class="bg-white rounded-3xl border border-neutral-border p-8 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg" :class="card.color">
            <component :is="card.icon" :size="28" />
          </div>
          <h3 class="text-xl font-bold text-neutral-title mb-2 group-hover:text-primary transition-colors">{{ card.title }}</h3>
          <p class="text-neutral-helper text-sm leading-relaxed mb-6">{{ card.desc }}</p>
          <div @click="card.action" class="flex items-center gap-2 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform cursor-pointer">
            了解详情 <ChevronRight :size="16" />
          </div>
        </div>
      </div>



      <!-- Technical Interview Details Modal -->
      <Transition name="fade">
        <div v-if="showTechnicalDetails" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div class="p-8 border-b border-neutral-border">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
                  <Zap class="text-primary" :size="28" />
                  技术专项面试详情
                </h2>
                <button @click="toggleTechnicalDetails" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
                  <X :size="20" />
                </button>
              </div>
              <p class="text-neutral-helper mt-4">
                深度考查专业技术能力，覆盖多个技术领域，提供真实的面试体验和详细的能力评估。
              </p>
            </div>
            
            <!-- Interview Types -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">技术领域覆盖</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="type in technicalDetails.types" :key="type.id" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group" @click="showTechDetails(type)">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <component :is="type.icon" :size="20" />
                    </div>
                    <div>
                      <h4 class="font-bold text-neutral-title">{{ type.name }}</h4>
                      <p class="text-xs text-neutral-helper">{{ type.questions }}+ 题目</p>
                    </div>
                  </div>
                  <div class="w-full h-1 bg-neutral-border/30 rounded-full overflow-hidden">
                    <div class="h-full bg-primary transition-all duration-500 group-hover:width-full" :style="{ width: `${(type.questions / 200) * 100}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Technical Type Details Modal -->
            <Transition name="fade">
              <div v-if="showTechTypeDetails" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                  <div class="p-8 border-b border-neutral-border">
                    <div class="flex justify-between items-center">
                      <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
                        <component :is="selectedTechType?.icon" class="text-primary" :size="28" />
                        {{ selectedTechType?.name }} 详情
                      </h2>
                      <button @click="closeTechDetails" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
                        <X :size="20" />
                      </button>
                    </div>
                    <p class="text-neutral-helper mt-4">
                      {{ selectedTechType?.description }}
                    </p>
                  </div>
                  
                  <!-- Skills -->
                  <div class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">核心技能</h3>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="(skill, index) in selectedTechType?.skills" :key="index" class="px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Sample Questions -->
                  <div class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">示例问题</h3>
                    <div class="space-y-4">
                      <div v-for="(question, index) in selectedTechType?.sampleQuestions" :key="index" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <p class="text-sm font-medium text-neutral-title leading-relaxed">
                          {{ index + 1 }}. {{ question }}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Career Paths -->
                  <div class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">职业发展路径</h3>
                    <div class="space-y-4">
                      <div v-for="(path, index) in selectedTechType?.careerPaths" :key="index" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:shadow-md transition-all">
                        <div class="flex justify-between items-start mb-2">
                          <h4 class="font-bold text-neutral-title">{{ path.title }}</h4>
                          <span class="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary">{{ path.salary }}</span>
                        </div>
                        <p class="text-sm text-neutral-helper">{{ path.description }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Technical Trends -->
                  <div class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">技术趋势</h3>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="(trend, index) in selectedTechType?.trends" :key="index" class="px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                        {{ trend }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Common Tools -->
                  <div class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">常用工具</h3>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="(tool, index) in selectedTechType?.tools" :key="index" class="px-4 py-2 bg-neutral-bg rounded-full text-sm font-medium text-neutral-title border border-neutral-border/50">
                        {{ tool }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="p-8">
                    <div class="flex flex-col sm:flex-row gap-4">
                      <button 
                        @click="startInterviewProcess"
                        class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                      >
                        开始 {{ selectedTechType?.name }} 面试
                        <ChevronRight :size="20" />
                      </button>
                      <button 
                        @click="closeTechDetails"
                        class="flex-1 py-4 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center justify-center gap-2"
                      >
                        关闭
                        <X :size="20" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
            
            <!-- Difficulty Levels -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">难度等级</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="level in technicalDetails.difficulty" :key="level.level" class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:shadow-md transition-all">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white" :class="level.color">
                      <Trophy :size="16" />
                    </div>
                    <h4 class="font-bold text-neutral-title">{{ level.name }}</h4>
                  </div>
                  <p class="text-sm text-neutral-helper">{{ level.description }}</p>
                </div>
              </div>
            </div>
            
            <!-- Evaluation Criteria -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">评分标准</h3>
              <div class="space-y-4">
                <div v-for="criterion in technicalDetails.criteria" :key="criterion.name" class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-medium text-neutral-body">{{ criterion.name }}</span>
                    <span class="font-bold text-primary">{{ criterion.weight }}%</span>
                  </div>
                  <div class="h-2 bg-neutral-bg rounded-full overflow-hidden">
                    <div class="h-full bg-primary transition-all duration-1000" :style="{ width: `${criterion.weight}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Key Features -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">核心功能</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(feature, index) in technicalDetails.features" :key="index" class="flex items-center gap-3 p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                  <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 :size="16" />
                  </div>
                  <p class="text-sm font-medium text-neutral-title">{{ feature }}</p>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="p-8">
              <div class="flex flex-col sm:flex-row gap-4">
                <button 
                  @click="startInterviewProcess"
                  class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                >
                  开始技术面试
                  <ChevronRight :size="20" />
                </button>
                <button 
                  @click="toggleTechnicalDetails"
                  class="flex-1 py-4 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center justify-center gap-2"
                >
                  关闭
                  <X :size="20" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Behavioral Interview (BQ) Details Modal -->
      <Transition name="fade">
        <div v-if="showBQDetails" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div class="p-8 border-b border-neutral-border">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
                  <Target class="text-primary" :size="28" />
                  行为面试 (BQ) 详情
                </h2>
                <button @click="toggleBQDetails" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
                  <X :size="20" />
                </button>
              </div>
              <p class="text-neutral-helper mt-4">
                评估软技能、领导力、团队协作及解决问题的能力，帮助您在面试中展现最佳的职业素养。
              </p>
            </div>
            
            <!-- Common BQ Questions -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">常见 BQ 问题</h3>
              <div class="space-y-4">
                <div v-for="question in bqDetails.commonQuestions" :key="question.id" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group" @click="openBQQuestionDetails(question)">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary">
                        {{ question.category }}
                      </div>
                    </div>
                  </div>
                  <p class="text-sm font-medium text-neutral-title leading-relaxed">
                    {{ question.question }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- BQ Question Details Modal -->
            <Transition name="fade">
              <div v-if="showBQQuestionDetails" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                  <div class="p-8 border-b border-neutral-border">
                    <div class="flex justify-between items-center">
                      <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
                        <Target class="text-primary" :size="28" />
                        BQ 问题详情
                      </h2>
                      <button @click="closeBQQuestionDetails" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
                        <X :size="20" />
                      </button>
                    </div>
                    <div class="mt-4">
                      <div class="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary inline-block mb-3">
                        {{ selectedBQQuestion?.category }}
                      </div>
                      <h3 class="text-xl font-bold text-neutral-title mb-3">
                        {{ selectedBQQuestion?.question }}
                      </h3>
                      <p class="text-neutral-helper">
                        {{ selectedBQQuestion?.description }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- STAR Answer -->
                  <div class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">STAR 法则参考答案</h3>
                    <div class="space-y-4">
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-primary mb-2">情境 (Situation)</h4>
                        <p class="text-sm text-neutral-title">
                          {{ selectedBQQuestion?.starAnswer.situation }}
                        </p>
                      </div>
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-primary mb-2">任务 (Task)</h4>
                        <p class="text-sm text-neutral-title">
                          {{ selectedBQQuestion?.starAnswer.task }}
                        </p>
                      </div>
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-primary mb-2">行动 (Action)</h4>
                        <p class="text-sm text-neutral-title">
                          {{ selectedBQQuestion?.starAnswer.action }}
                        </p>
                      </div>
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-primary mb-2">结果 (Result)</h4>
                        <p class="text-sm text-neutral-title">
                          {{ selectedBQQuestion?.starAnswer.result }}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Alternative Answers -->
                  <div v-if="selectedBQQuestion?.alternativeAnswers && selectedBQQuestion.alternativeAnswers.length > 0" class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">备选答案</h3>
                    <div class="space-y-6">
                      <div v-for="(answer, index) in selectedBQQuestion?.alternativeAnswers" :key="index" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-primary mb-2">示例 {{ index + 2 }}</h4>
                        <div class="space-y-3 mt-3">
                          <div>
                            <h5 class="text-xs font-medium text-neutral-helper mb-1">情境 (Situation)</h5>
                            <p class="text-sm text-neutral-title">{{ answer.situation }}</p>
                          </div>
                          <div>
                            <h5 class="text-xs font-medium text-neutral-helper mb-1">任务 (Task)</h5>
                            <p class="text-sm text-neutral-title">{{ answer.task }}</p>
                          </div>
                          <div>
                            <h5 class="text-xs font-medium text-neutral-helper mb-1">行动 (Action)</h5>
                            <p class="text-sm text-neutral-title">{{ answer.action }}</p>
                          </div>
                          <div>
                            <h5 class="text-xs font-medium text-neutral-helper mb-1">结果 (Result)</h5>
                            <p class="text-sm text-neutral-title">{{ answer.result }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Common Mistakes -->
                  <div v-if="selectedBQQuestion?.commonMistakes && selectedBQQuestion.commonMistakes.length > 0" class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">常见误区</h3>
                    <div class="space-y-2">
                      <div v-for="(mistake, index) in selectedBQQuestion?.commonMistakes" :key="index" class="flex items-start gap-3 p-3 bg-neutral-bg rounded-xl border border-neutral-border/50">
                        <div class="w-6 h-6 rounded-full bg-auxiliary-red/10 flex items-center justify-center text-auxiliary-red flex-shrink-0 mt-0.5">
                          <X :size="14" />
                        </div>
                        <p class="text-sm text-neutral-title">{{ mistake }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Industry Specific Advice -->
                  <div v-if="selectedBQQuestion?.industrySpecific" class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">行业特定建议</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-primary mb-2">科技行业</h4>
                        <p class="text-sm text-neutral-title">{{ selectedBQQuestion?.industrySpecific.tech }}</p>
                      </div>
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-primary mb-2">金融行业</h4>
                        <p class="text-sm text-neutral-title">{{ selectedBQQuestion?.industrySpecific.finance }}</p>
                      </div>
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-primary mb-2">医疗行业</h4>
                        <p class="text-sm text-neutral-title">{{ selectedBQQuestion?.industrySpecific.healthcare }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Tips -->
                  <div class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">回答技巧</h3>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="(tip, index) in selectedBQQuestion?.tips" :key="index" class="px-4 py-2 bg-neutral-bg rounded-full text-sm font-medium text-neutral-title border border-neutral-border/50">
                        {{ tip }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="p-8">
                    <div class="flex flex-col sm:flex-row gap-4">
                      <button 
                        @click="startInterviewProcess"
                        class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                      >
                        开始 BQ 面试
                        <ChevronRight :size="20" />
                      </button>
                      <button 
                        @click="closeBQQuestionDetails"
                        class="flex-1 py-4 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center justify-center gap-2"
                      >
                        关闭
                        <X :size="20" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
            
            <!-- Answering Strategies -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">回答策略</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="strategy in bqDetails.strategies" :key="strategy.name" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:shadow-md transition-all">
                  <h4 class="font-bold text-neutral-title mb-2">{{ strategy.name }}</h4>
                  <p class="text-sm text-neutral-helper">{{ strategy.description }}</p>
                </div>
              </div>
            </div>
            
            <!-- Evaluation Criteria -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">评分标准</h3>
              <div class="space-y-4">
                <div v-for="criterion in bqDetails.evaluationCriteria" :key="criterion.name" class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-medium text-neutral-body">{{ criterion.name }}</span>
                    <span class="font-bold text-primary">{{ criterion.weight }}%</span>
                  </div>
                  <div class="h-2 bg-neutral-bg rounded-full overflow-hidden">
                    <div class="h-full bg-primary transition-all duration-1000" :style="{ width: `${criterion.weight}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Key Features -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">核心功能</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(feature, index) in bqDetails.features" :key="index" class="flex items-center gap-3 p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                  <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 :size="16" />
                  </div>
                  <p class="text-sm font-medium text-neutral-title">{{ feature }}</p>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="p-8">
              <div class="flex flex-col sm:flex-row gap-4">
                <button 
                  @click="startInterviewProcess"
                  class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                >
                  开始行为面试
                  <ChevronRight :size="20" />
                </button>
                <button 
                  @click="toggleBQDetails"
                  class="flex-1 py-4 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center justify-center gap-2"
                >
                  关闭
                  <X :size="20" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Pressure Interview Details Modal -->
      <Transition name="fade">
        <div v-if="showPressureDetails" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div class="p-8 border-b border-neutral-border">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
                  <Zap class="text-auxiliary-orange" :size="28" />
                  压力模拟面试详情
                </h2>
                <button @click="togglePressureDetails" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
                  <X :size="20" />
                </button>
              </div>
              <p class="text-neutral-helper mt-4">
                高强度连环追问，模拟真实大厂高压面试环境，测试你的抗压能力和应变能力。
              </p>
            </div>
            
            <!-- Pressure Scenarios -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">压力场景模拟</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="scenario in pressureDetails.scenarios" :key="scenario.id" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group" @click="openPressureScenarioDetails(scenario)">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="px-3 py-1 bg-auxiliary-orange/10 rounded-full text-xs font-bold text-auxiliary-orange">
                      {{ scenario.difficulty }}难度
                    </div>
                  </div>
                  <h4 class="font-bold text-neutral-title mb-2">{{ scenario.name }}</h4>
                  <p class="text-sm text-neutral-helper">{{ scenario.description }}</p>
                </div>
              </div>
            </div>
            
            <!-- Pressure Scenario Details Modal -->
            <Transition name="fade">
              <div v-if="showPressureScenarioDetails" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                  <div class="p-8 border-b border-neutral-border">
                    <div class="flex justify-between items-center">
                      <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
                        <Zap class="text-auxiliary-orange" :size="28" />
                        {{ selectedPressureScenario?.name }} 详情
                      </h2>
                      <button @click="closePressureScenarioDetails" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
                        <X :size="20" />
                      </button>
                    </div>
                    <div class="mt-4">
                      <div class="px-3 py-1 bg-auxiliary-orange/10 rounded-full text-xs font-bold text-auxiliary-orange inline-block mb-3">
                        {{ selectedPressureScenario?.difficulty }}难度
                      </div>
                      <p class="text-neutral-helper mb-4">
                        {{ selectedPressureScenario?.description }}
                      </p>
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-neutral-title mb-2">场景示例</h4>
                        <p class="text-sm text-neutral-helper">
                          {{ selectedPressureScenario?.example }}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Coping Strategies -->
                  <div v-if="selectedPressureScenario?.应对策略 && selectedPressureScenario.应对策略.length > 0" class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">应对策略</h3>
                    <div class="space-y-4">
                      <div v-for="(strategy, index) in selectedPressureScenario?.应对策略" :key="index" class="flex gap-4 p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <div class="w-8 h-8 rounded-full bg-auxiliary-orange/10 flex items-center justify-center text-auxiliary-orange flex-shrink-0">
                          {{ strategy.step }}
                        </div>
                        <div>
                          <h4 class="text-sm font-bold text-neutral-title mb-1">{{ strategy.title }}</h4>
                          <p class="text-sm text-neutral-helper">{{ strategy.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Industry Specific Advice -->
                  <div v-if="selectedPressureScenario?.industrySpecific" class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">行业特定建议</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-auxiliary-orange mb-2">科技行业</h4>
                        <p class="text-sm text-neutral-title">{{ selectedPressureScenario?.industrySpecific.tech }}</p>
                      </div>
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-auxiliary-orange mb-2">金融行业</h4>
                        <p class="text-sm text-neutral-title">{{ selectedPressureScenario?.industrySpecific.finance }}</p>
                      </div>
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-auxiliary-orange mb-2">医疗行业</h4>
                        <p class="text-sm text-neutral-title">{{ selectedPressureScenario?.industrySpecific.healthcare }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Pressure Level Assessment -->
                  <div v-if="selectedPressureScenario?.压力水平评估" class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">压力水平评估</h3>
                    <div class="space-y-3">
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <div class="flex justify-between items-center mb-2">
                          <h4 class="text-sm font-bold text-neutral-title">低压力水平</h4>
                          <span class="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary">基础</span>
                        </div>
                        <p class="text-sm text-neutral-helper">{{ selectedPressureScenario?.压力水平评估.low }}</p>
                      </div>
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <div class="flex justify-between items-center mb-2">
                          <h4 class="text-sm font-bold text-neutral-title">中等压力水平</h4>
                          <span class="px-3 py-1 bg-auxiliary-orange/10 rounded-full text-xs font-bold text-auxiliary-orange">进阶</span>
                        </div>
                        <p class="text-sm text-neutral-helper">{{ selectedPressureScenario?.压力水平评估.medium }}</p>
                      </div>
                      <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <div class="flex justify-between items-center mb-2">
                          <h4 class="text-sm font-bold text-neutral-title">高压力水平</h4>
                          <span class="px-3 py-1 bg-auxiliary-red/10 rounded-full text-xs font-bold text-auxiliary-red">高级</span>
                        </div>
                        <p class="text-sm text-neutral-helper">{{ selectedPressureScenario?.压力水平评估.high }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Tips -->
                  <div class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">应对技巧</h3>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="(tip, index) in selectedPressureScenario?.tips" :key="index" class="px-4 py-2 bg-neutral-bg rounded-full text-sm font-medium text-neutral-title border border-neutral-border/50">
                        {{ tip }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Sample Questions and Answers -->
                  <div class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">示例问题及参考答案</h3>
                    <div class="space-y-6">
                      <div v-for="(question, index) in selectedPressureScenario?.sampleQuestions" :key="index" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                        <h4 class="text-sm font-bold text-neutral-title mb-3">
                          {{ index + 1 }}. {{ question }}
                        </h4>
                        <div class="p-3 bg-primary/5 rounded-xl">
                          <h5 class="text-xs font-bold text-primary mb-2">参考答案</h5>
                          <p class="text-sm text-neutral-title">
                            {{ selectedPressureScenario?.answers[index] }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Feedback -->
                  <div v-if="selectedPressureScenario?.feedback && selectedPressureScenario.feedback.length > 0" class="p-8 border-b border-neutral-border">
                    <h3 class="text-lg font-bold text-neutral-title mb-6">面试后反馈建议</h3>
                    <div class="space-y-2">
                      <div v-for="(item, index) in selectedPressureScenario?.feedback" :key="index" class="flex items-start gap-3 p-3 bg-neutral-bg rounded-xl border border-neutral-border/50">
                        <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          <CheckCircle2 :size="14" />
                        </div>
                        <p class="text-sm text-neutral-title">{{ item }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="p-8">
                    <div class="flex flex-col sm:flex-row gap-4">
                      <button 
                        @click="startInterviewProcess"
                        class="flex-1 py-4 bg-auxiliary-orange text-white font-bold rounded-2xl shadow-lg hover:shadow-auxiliary-orange/30 transition-all flex items-center justify-center gap-2"
                      >
                        开始压力面试
                        <ChevronRight :size="20" />
                      </button>
                      <button 
                        @click="closePressureScenarioDetails"
                      class="flex-1 py-4 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center justify-center gap-2"
                    >
                      关闭
                      <X :size="20" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
            
            <!-- Coping Strategies -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">应对策略</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="strategy in pressureDetails.strategies" :key="strategy.name" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:shadow-md transition-all">
                  <h4 class="font-bold text-neutral-title mb-2">{{ strategy.name }}</h4>
                  <p class="text-sm text-neutral-helper">{{ strategy.description }}</p>
                </div>
              </div>
            </div>
            
            <!-- Evaluation Criteria -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">评分标准</h3>
              <div class="space-y-4">
                <div v-for="criterion in pressureDetails.evaluationCriteria" :key="criterion.name" class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-medium text-neutral-body">{{ criterion.name }}</span>
                    <span class="font-bold text-auxiliary-orange">{{ criterion.weight }}%</span>
                  </div>
                  <div class="h-2 bg-neutral-bg rounded-full overflow-hidden">
                    <div class="h-full bg-auxiliary-orange transition-all duration-1000" :style="{ width: `${criterion.weight}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Sample Questions -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">示例问题</h3>
              <div class="space-y-4">
                <div v-for="(question, index) in pressureDetails.sampleQuestions" :key="index" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all">
                  <p class="text-sm font-medium text-neutral-title leading-relaxed">
                    {{ question }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Key Features -->
            <div class="p-8 border-b border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-6">核心功能</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(feature, index) in pressureDetails.features" :key="index" class="flex items-center gap-3 p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                  <div class="w-8 h-8 rounded-full bg-auxiliary-orange/10 flex items-center justify-center text-auxiliary-orange">
                    <CheckCircle2 :size="16" />
                  </div>
                  <p class="text-sm font-medium text-neutral-title">{{ feature }}</p>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="p-8">
              <div class="flex flex-col sm:flex-row gap-4">
                <button 
                  @click="startInterviewProcess"
                  class="flex-1 py-4 bg-auxiliary-orange text-white font-bold rounded-2xl shadow-lg hover:shadow-auxiliary-orange/30 transition-all flex items-center justify-center gap-2"
                >
                  开始压力面试
                  <ChevronRight :size="20" />
                </button>
                <button 
                  @click="togglePressureDetails"
                  class="flex-1 py-4 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center justify-center gap-2"
                >
                  关闭
                  <X :size="20" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-3xl border border-neutral-border p-12 shadow-sm flex flex-col items-center text-center" style="width: 1280px;">
          <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <Briefcase :size="40" />
          </div>
          <h2 class="text-2xl font-bold text-neutral-title mb-4">准备好开始你的挑战了吗？</h2>
          <p class="text-neutral-helper mb-8 max-w-md">
            我们将引导您完成设备测试、简历上传及岗位选择，确保面试环境达到最佳状态。
          </p>
          <button 
            @click="startInterviewProcess"
            class="px-12 py-4 gradient-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3"
          >
            立即开启面试 <Zap :size="20" />
          </button>
        </div>
        

      </div>
    </div>

    <!-- 2. Prepare Step -->
    <div v-else-if="currentStep === 'prepare'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-500">
      <!-- Left: Device & Resume -->
      <div class="lg:col-span-8 flex flex-col gap-6">
        <div class="bg-white rounded-3xl border border-neutral-border p-8 shadow-sm">
          <h3 class="text-xl font-bold text-neutral-title mb-8 flex items-center gap-2">
            <Settings :size="24" class="text-primary" />
            面试环境预备
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Camera Test -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <p class="text-sm font-bold text-neutral-title flex items-center gap-2">
                  <Camera :size="18" class="text-primary" />
                  摄像头测试
                </p>
                <span v-if="cameraReady" class="text-xs text-auxiliary-green font-bold flex items-center gap-1">
                  <ShieldCheck :size="14" /> 正常
                </span>
              </div>
              <div class="aspect-video bg-neutral-bg rounded-2xl border-2 border-dashed border-neutral-border overflow-hidden relative group">
                <video ref="videoRef" autoplay playsinline muted class="w-full h-full object-cover"></video>
                <div v-if="!cameraReady" class="absolute inset-0 flex items-center justify-center text-neutral-helper">
                  正在请求摄像头权限...
                </div>
              </div>
            </div>

            <!-- Mic Test -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <p class="text-sm font-bold text-neutral-title flex items-center gap-2">
                  <Mic :size="18" class="text-primary" />
                  麦克风测试
                </p>
                <span v-if="micReady" class="text-xs text-auxiliary-green font-bold flex items-center gap-1">
                  <ShieldCheck :size="14" /> 正常
                </span>
              </div>
              <div class="h-[120px] bg-neutral-bg rounded-2xl flex items-center justify-center px-8 relative">
                <div class="w-full h-4 bg-neutral-border/30 rounded-full overflow-hidden">
                  <div class="h-full gradient-primary transition-all duration-100" :style="{ width: `${audioLevel}%` }"></div>
                </div>
                <p class="absolute bottom-4 text-[10px] text-neutral-helper font-medium">请尝试说话，观察能量条波动</p>
              </div>
              
              <!-- Job Selection -->
              <div class="pt-4 space-y-3">
                <p class="text-sm font-bold text-neutral-title flex items-center gap-2">
                  <Target :size="18" class="text-primary" />
                  目标岗位选择
                </p>
                <select v-model="selectedJob" class="w-full p-4 bg-neutral-bg rounded-xl border-none text-sm font-bold text-neutral-title focus:ring-2 focus:ring-primary/20 cursor-pointer">
                  <option value="">请选择面试岗位</option>
                  <option value="frontend">高级前端开发工程师</option>
                  <option value="backend">后端架构师 (Java/Go)</option>
                  <option value="product">资深产品经理</option>
                  <option value="ai">AI 算法工程师</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Resume Upload -->
        <div class="bg-white rounded-3xl border border-neutral-border p-8 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-neutral-title flex items-center gap-2">
              <FileUp :size="20" class="text-primary" />
              简历 AI 分析
            </h3>
            <span v-if="resumeFile" class="text-xs text-primary font-bold">{{ resumeFile.name }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              @click="(($refs.fileInput as HTMLInputElement).click())"
              class="border-2 border-dashed border-neutral-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group"
            >
              <input type="file" ref="fileInput" class="hidden" @change="handleResumeUpload" accept=".pdf,.doc,.docx" />
              <div class="w-12 h-12 bg-neutral-bg rounded-full flex items-center justify-center text-neutral-helper group-hover:text-primary group-hover:bg-primary/10 transition-all">
                <FileUp :size="24" />
              </div>
              <p class="text-sm font-bold text-neutral-title">点击或拖拽上传简历</p>
              <p class="text-xs text-neutral-helper">支持 PDF, DOCX (最大 10MB)</p>
            </div>

            <div class="bg-neutral-bg rounded-2xl p-6 relative overflow-hidden">
              <div v-if="isAnalyzingResume" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10">
                <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p class="text-xs font-bold text-primary animate-pulse">AI 正在深度解析简历内容...</p>
              </div>
              <div v-if="resumeAnalysisResult" class="space-y-3">
                <p class="text-xs font-bold text-primary flex items-center gap-1 uppercase">
                  <FileSearch :size="14" /> AI 分析结果
                </p>
                <p class="text-sm text-neutral-body leading-relaxed">{{ resumeAnalysisResult }}</p>
              </div>
              <div v-else class="h-full flex items-center justify-center text-center px-4">
                <p class="text-xs text-neutral-helper italic">上传简历后，AI 将自动分析您的优势并定制面试题目</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Start Action -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        <div class="bg-white rounded-3xl border border-neutral-border p-8 shadow-sm sticky top-6">
          <h4 class="font-bold text-neutral-title mb-6">面试准备清单</h4>
          <div class="space-y-4 mb-8">
            <div v-for="item in [
              { label: '摄像头状态', ready: cameraReady },
              { label: '麦克风状态', ready: micReady },
              { label: '简历已上传', ready: !!resumeFile },
              { label: '岗位已选择', ready: !!selectedJob }
            ]" :key="item.label" class="flex items-center justify-between p-4 rounded-2xl bg-neutral-bg transition-all">
              <span class="text-sm font-medium text-neutral-body">{{ item.label }}</span>
              <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="item.ready ? 'bg-auxiliary-green text-white' : 'bg-neutral-border/50 text-white'">
                <CheckCircle2 :size="14" />
              </div>
            </div>
          </div>

          <button 
            @click="startRealInterview"
            :disabled="!cameraReady || !micReady || !resumeFile || !selectedJob"
            class="w-full py-5 gradient-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
          >
            开始正式面试 <ChevronRight :size="20" />
          </button>
          
          <p class="mt-4 text-[10px] text-neutral-helper text-center leading-relaxed">
            点击“开始面试”即代表您同意 AI 实时捕捉音视频画面用于面试评估，数据将在会话结束后自动加密。
          </p>
        </div>
      </div>
    </div>

    <!-- 3. Ongoing Step -->
    <template v-else-if="currentStep === 'ongoing'">
      <!-- Header: Mode & Settings -->
      <div class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-border shadow-sm">
        <div class="flex items-center gap-6">
          <!-- Mode Switcher -->
          <div class="flex bg-neutral-bg p-1 rounded-xl">
            <button 
              v-for="mode in [{id:'technical', label:'技术面试', icon:Zap}, {id:'group', label:'小组面试', icon:Users}, {id:'leaderless', label:'无领导小组', icon:MessageCircle}]"
              :key="mode.id"
              @click="interviewMode = mode.id"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              :class="interviewMode === mode.id ? 'bg-white text-primary shadow-sm' : 'text-neutral-helper hover:text-neutral-body'"
            >
              <component :is="mode.icon" :size="16" />
              {{ mode.label }}
            </button>
          </div>

          <!-- Difficulty -->
          <div class="flex items-center gap-2 px-4 py-2 bg-neutral-bg rounded-xl">
            <Trophy :size="16" class="text-auxiliary-orange" />
            <select v-model="difficulty" class="bg-transparent border-none text-xs font-bold text-neutral-title focus:ring-0 cursor-pointer">
              <option value="easy">入门难度</option>
              <option value="medium">进阶难度</option>
              <option value="hard">专业难度</option>
            </select>
          </div>

          <!-- Language -->
          <div class="flex items-center gap-2 px-4 py-2 bg-neutral-bg rounded-xl">
            <Languages :size="16" class="text-primary" />
            <select v-model="language" class="bg-transparent border-none text-xs font-bold text-neutral-title focus:ring-0 cursor-pointer">
              <option value="zh">中文 (CN)</option>
              <option value="en">English (US)</option>
              <option value="jp">日本語 (JP)</option>
              <option value="de">Deutsch (DE)</option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl text-primary font-bold text-sm">
            <History :size="16" />
            {{ formatTime(interviewTime) }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <!-- Left: Interview Area -->
        <div class="lg:col-span-8 flex flex-col gap-6">
          <!-- Question Card -->
          <div class="bg-white rounded-3xl border border-neutral-border p-8 shadow-sm relative overflow-hidden group">
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary font-bold text-xl shadow-inner">
                  Q{{ answeredCount + 1 }}
                </div>
                <div>
                  <h2 class="text-lg font-bold text-neutral-title">当前挑战</h2>
                  <p class="text-xs text-neutral-helper">智能题库随机生成</p>
                </div>
              </div>
              <div class="flex items-center gap-2 px-4 py-2 bg-neutral-bg rounded-xl">
                <Clock :size="18" class="text-primary" />
                <span class="text-xl font-mono font-bold" :class="timeLeft < 10 ? 'text-auxiliary-orange animate-pulse' : 'text-primary'">
                  00:{{ timeLeft.toString().padStart(2, '0') }}
                </span>
              </div>
            </div>
            
            <p class="text-xl text-neutral-title leading-relaxed font-medium mb-6">
              {{ currentQuestion }}
            </p>
            
            <div class="flex items-center gap-4">
              <button 
                @click="showModelAnswer = !showModelAnswer"
                class="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Sparkles :size="14" />
                {{ showModelAnswer ? '隐藏参考答案' : '查看 AI 参考答案' }}
              </button>
            </div>

            <!-- Model Answer Comparison -->
            <Transition name="fade">
              <div v-if="showModelAnswer" class="mt-6 p-6 bg-primary/5 rounded-2xl border border-primary/20 animate-in slide-in-from-top-4 duration-300">
                <p class="text-xs font-bold text-primary mb-2 uppercase tracking-widest">AI 模型参考答案：</p>
                <p class="text-sm text-neutral-body leading-relaxed">
                  Vue3 响应式原理基于 ES6 的 Proxy 实现。相比 Vue2 的 Object.defineProperty，Proxy 可以直接监听对象而非属性，支持数组索引变化监听，且无需递归初始化，极大提升了性能和灵活性。
                </p>
              </div>
            </Transition>
          </div>

          <!-- Answer Area -->
          <div class="bg-white rounded-3xl border border-neutral-border p-8 shadow-sm flex-1 flex flex-col gap-6 relative">
            <!-- Floating Camera Feed -->
            <div class="absolute top-6 right-6 w-32 aspect-video bg-neutral-bg rounded-xl border border-neutral-border overflow-hidden shadow-lg z-10">
              <video ref="videoRefOngoing" autoplay playsinline muted class="w-full h-full object-cover"></video>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-6 gradient-primary rounded-full"></div>
                <h3 class="font-bold text-neutral-title">多维度交互输入</h3>
              </div>
              <div class="flex items-center gap-4 mr-36">
                <div v-if="isRecording" class="flex items-center gap-2 text-auxiliary-orange bg-auxiliary-orange/10 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  语音识别中...
                </div>
                <span class="text-xs text-neutral-helper">{{ answerText.length }} / 2000 字</span>
              </div>
            </div>

            <textarea 
              v-model="answerText"
              class="w-full h-48 p-6 bg-neutral-bg rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white resize-none text-neutral-title transition-all duration-300 placeholder:text-neutral-helper/50"
              placeholder="支持语音及文字双向输入，AI 将自动分析您的表达深度..."
            ></textarea>

            <div class="flex items-center justify-between">
              <button 
                @click="toggleRecording"
                class="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md group"
                :class="isRecording ? 'bg-auxiliary-orange text-white' : 'bg-neutral-bg text-neutral-title hover:bg-primary/10 hover:text-primary'"
              >
                <Mic v-if="!isRecording" :size="20" />
                <Square v-else :size="20" />
                {{ isRecording ? '停止说话' : '语音回答' }}
              </button>

              <div class="flex gap-3">
                <button class="px-6 py-3 bg-neutral-bg text-neutral-body font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center gap-2">
                  <SkipForward :size="18" />
                  跳过
                </button>
                <button 
                  @click="submitAnswer"
                  class="px-10 py-3 gradient-primary text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 transform active:scale-95"
                >
                  <Send :size="18" />
                  提交并继续
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: AI Analysis -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          <!-- Progress Card -->
          <div class="bg-white rounded-3xl border border-neutral-border p-6 shadow-sm">
            <div class="flex justify-between items-end mb-4">
              <div>
                <p class="text-xs text-neutral-helper uppercase mb-1">已完成题数</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-4xl font-black text-primary">{{ answeredCount + 1 }}</span>
                  <span class="text-sm text-neutral-helper font-medium">/ {{ totalQuestions }}</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-neutral-helper uppercase mb-1">岗位匹配度</p>
                <p class="text-xl font-black text-auxiliary-green">{{ matchingScore }}%</p>
              </div>
            </div>
            <div class="flex gap-1 mb-6">
              <div 
                v-for="i in totalQuestions" 
                :key="i"
                class="h-2 flex-1 rounded-full transition-all duration-500"
                :class="i <= answeredCount + 1 ? 'bg-primary' : 'bg-neutral-bg'"
              ></div>
            </div>
          </div>

          <!-- AI Feedback -->
          <div class="bg-white rounded-3xl border border-neutral-border p-6 shadow-sm flex-1 flex flex-col">
            <h3 class="font-bold text-neutral-title mb-6 flex items-center gap-2">
              <Brain :size="20" class="text-primary" />
              即时能力评估
            </h3>
            
            <div class="space-y-6 flex-1">
              <div v-for="metric in [{label:'专业知识深度', value:fluencyScore}, {label:'表达逻辑条理', value:logicScore}]" :key="metric.label" class="space-y-2">
                <div class="flex justify-between text-xs">
                  <span class="text-neutral-body">{{ metric.label }}</span>
                  <span class="font-bold text-primary">{{ metric.value }}%</span>
                </div>
                <div class="h-1.5 bg-neutral-bg rounded-full overflow-hidden">
                  <div class="h-full bg-primary transition-all duration-1000" :style="{ width: `${metric.value}%` }"></div>
                </div>
              </div>

              <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
                <p class="text-xs font-bold text-neutral-title mb-1 flex items-center gap-1">
                  <AlertCircle :size="12" class="text-auxiliary-orange" />
                  面试复盘建议
                </p>
                <p class="text-[11px] text-neutral-body leading-relaxed">
                  在回答 Vue3 优势时，如果能对比 **Tree-shaking** 的支持，评分将更高。
                </p>
              </div>
            </div>
          </div>

          <button @click="currentStep = 'home'" class="w-full py-4 bg-auxiliary-orange/10 text-auxiliary-orange font-bold rounded-2xl hover:bg-auxiliary-orange hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm">
            <Square :size="18" />
            终止当前面试
          </button>
        </div>
      </div>
    </template>

    <!-- 4. Finished Step -->
    <div v-else-if="currentStep === 'finished'" class="bg-white rounded-[32px] p-12 shadow-xl border border-neutral-border max-w-5xl mx-auto animate-in zoom-in-95 duration-500">
      <div class="text-center mb-12">
        <div class="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-primary/30">
          <CheckCircle2 :size="40" />
        </div>
        <h2 class="text-4xl font-black text-neutral-title mb-4 tracking-tight">面试挑战已完成！</h2>
        <p class="text-neutral-helper">基于 AI 岗位图谱分析，您本次的表现如下：</p>
      </div>

      <!-- Overall Scores -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-neutral-bg p-6 rounded-3xl border border-neutral-border/50">
          <p class="text-xs text-neutral-helper uppercase mb-2">Offer 胜算 Rank</p>
          <p class="text-3xl font-black text-primary">TOP {{ Math.floor(Math.random() * 20) + 1 }}%</p>
        </div>
        <div class="bg-neutral-bg p-6 rounded-3xl border border-neutral-border/50">
          <p class="text-xs text-neutral-helper uppercase mb-2">岗位匹配度</p>
          <p class="text-3xl font-black text-auxiliary-green">{{ interviewResults.overallScore + 5 }}%</p>
        </div>
        <div class="bg-neutral-bg p-6 rounded-3xl border border-neutral-border/50">
          <p class="text-xs text-neutral-helper uppercase mb-2">综合评分</p>
          <p class="text-3xl font-black text-auxiliary-orange">{{ interviewResults.overallScore >= 90 ? 'A+' : interviewResults.overallScore >= 80 ? 'A' : interviewResults.overallScore >= 70 ? 'B+' : 'B' }}</p>
        </div>
      </div>

      <!-- Strengths and Weaknesses -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <!-- Strengths -->
        <div class="bg-auxiliary-green/5 p-6 rounded-3xl border border-auxiliary-green/20">
          <h3 class="text-xl font-bold text-auxiliary-green mb-6 flex items-center gap-2">
            <CheckCircle2 :size="24" />
            优势分析
          </h3>
          <ul class="space-y-4">
            <li v-for="(strength, index) in interviewResults.strengths" :key="index" class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-auxiliary-green/20 flex items-center justify-center text-auxiliary-green mt-0.5 flex-shrink-0">
                <CheckCircle2 :size="14" />
              </div>
              <p class="text-neutral-title text-sm leading-relaxed">{{ strength }}</p>
            </li>
          </ul>
        </div>

        <!-- Weaknesses -->
        <div class="bg-auxiliary-orange/5 p-6 rounded-3xl border border-auxiliary-orange/20">
          <h3 class="text-xl font-bold text-auxiliary-orange mb-6 flex items-center gap-2">
            <AlertCircle :size="24" />
            改进空间
          </h3>
          <ul class="space-y-4">
            <li v-for="(weakness, index) in interviewResults.weaknesses" :key="index" class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-auxiliary-orange/20 flex items-center justify-center text-auxiliary-orange mt-0.5 flex-shrink-0">
                <AlertCircle :size="14" />
              </div>
              <p class="text-neutral-title text-sm leading-relaxed">{{ weakness }}</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Detailed Scores -->
      <div class="bg-neutral-bg p-8 rounded-3xl border border-neutral-border/50 mb-12">
        <h3 class="text-xl font-bold text-neutral-title mb-6">能力维度评估</h3>
        <div class="space-y-4">
          <div v-for="(score, key) in interviewResults.detailedScores" :key="key" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="font-medium text-neutral-body">{{ key === 'technicalKnowledge' ? '技术知识' : key === 'problemSolving' ? '问题解决' : key === 'communication' ? '沟通表达' : key === 'depth' ? '知识深度' : key === 'practicalSkills' ? '实践能力' : key === 'teamwork' ? '团队协作' : key === 'leadership' ? '领导力' : key === 'adaptability' ? '适应能力' : key === 'stressManagement' ? '压力管理' : key === 'quickThinking' ? '快速思维' : key === 'decisionMaking' ? '决策能力' : key === 'composure' ? '冷静应对' : key }}</span>
              <span class="font-bold text-primary">{{ score }}%</span>
            </div>
            <div class="h-2 bg-white rounded-full overflow-hidden">
              <div class="h-full bg-primary transition-all duration-1000" :style="{ width: `${score}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Improvement Suggestions -->
      <div class="bg-primary/5 p-8 rounded-3xl border border-primary/20 mb-12">
        <h3 class="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <Brain :size="24" />
          个性化提升建议
        </h3>
        <ul class="space-y-4">
          <li v-if="interviewMode === 'technical'" class="text-neutral-title text-sm leading-relaxed">
            • 建议加强对高级技术概念的学习，特别是 {{ selectedJob === 'frontend' ? '前端框架的底层原理' : selectedJob === 'backend' ? '分布式系统设计' : selectedJob === 'product' ? '产品战略规划' : '深度学习模型优化' }}。
          </li>
          <li v-if="interviewMode === 'behavioral'" class="text-neutral-title text-sm leading-relaxed">
            • 建议参与更多团队项目，提升 {{ (interviewResults.detailedScores.leadership || 0) < 80 ? '领导力' : (interviewResults.detailedScores.teamwork || 0) < 80 ? '团队协作' : '沟通表达' }} 能力。
          </li>
          <li v-if="interviewMode === 'pressure'" class="text-neutral-title text-sm leading-relaxed">
            • 建议进行更多高压场景的模拟训练，提升 {{ (interviewResults.detailedScores.stressManagement || 0) < 80 ? '压力管理' : (interviewResults.detailedScores.quickThinking || 0) < 80 ? '快速思维' : '决策能力' }}。
          </li>
          <li class="text-neutral-title text-sm leading-relaxed">
            • 建议定期回顾面试表现，总结经验教训，不断优化回答策略。
          </li>
          <li class="text-neutral-title text-sm leading-relaxed">
            • 建议多参与行业交流，了解最新技术趋势和最佳实践。
          </li>
        </ul>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="generateReport" class="px-10 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2">
            一键生成多维度报告
            <ChevronRight :size="20" />
          </button>
          <button @click="currentStep = 'home'" class="px-10 py-4 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all">
            返回主页
          </button>
        </div>
    </div>


  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.gradient-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #6366f1 100%);
}
.gradient-cyan-yellow {
  background: linear-gradient(135deg, #06b6d4 0%, #eab308 100%);
}
</style>
