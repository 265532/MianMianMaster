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
  Briefcase
} from 'lucide-vue-next'

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
const technicalDetails = ref({
  types: [
    { id: 'frontend', name: '前端开发', questions: 120, icon: 'Languages' },
    { id: 'backend', name: '后端开发', questions: 150, icon: 'Server' },
    { id: 'fullstack', name: '全栈开发', questions: 200, icon: 'Code' },
    { id: 'mobile', name: '移动开发', questions: 90, icon: 'Smartphone' },
    { id: 'devops', name: 'DevOps', questions: 80, icon: 'Cloud' },
    { id: 'ai', name: 'AI 算法', questions: 70, icon: 'Brain' }
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

const toggleTechnicalDetails = () => {
  showTechnicalDetails.value = !showTechnicalDetails.value
}

// Behavioral Interview (BQ) Details States
const showBQDetails = ref(false)
const bqDetails = ref({
  commonQuestions: [
    { id: 'conflict', question: '描述一次你与团队成员发生冲突的经历，你是如何解决的？', category: '团队协作' },
    { id: 'failure', question: '分享一次你经历的重大失败，你从中学到了什么？', category: '自我认知' },
    { id: 'leadership', question: '描述一次你领导团队完成项目的经历，你采取了哪些策略？', category: '领导力' },
    { id: 'pressure', question: '分享一次你在高压环境下工作的经历，你是如何应对的？', category: '抗压能力' },
    { id: 'innovation', question: '描述一次你提出创新解决方案的经历，结果如何？', category: '创新能力' }
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

// Pressure Interview Details States
const showPressureDetails = ref(false)
const pressureDetails = ref({
  scenarios: [
    { id: 'time-pressure', name: '时间压力', description: '面试官快速连续提问，要求在极短时间内给出答案', difficulty: '高' },
    { id: 'critical-questions', name: '批判性问题', description: '面试官质疑你的专业能力和项目经历，测试你的抗压能力', difficulty: '高' },
    { id: 'role-play', name: '角色扮演', description: '模拟真实工作场景中的紧急情况，要求快速做出决策', difficulty: '中' },
    { id: 'multi-tasking', name: '多任务处理', description: '同时处理多个问题，测试你的注意力和优先级管理能力', difficulty: '中' },
    { id: 'technical-challenge', name: '技术挑战', description: '现场解决复杂技术问题，面试官不断追问细节', difficulty: '高' }
  ],
  strategies: [
    { name: '保持冷静', description: '深呼吸，保持微笑，避免表现出紧张或焦虑' },
    { name: '结构化思考', description: '使用逻辑框架组织思路，即使时间紧迫也要保持清晰' },
    { name: '主动沟通', description: '如果需要时间思考，明确告知面试官，争取缓冲时间' },
    { name: '聚焦重点', description: '识别问题核心，避免在次要细节上浪费时间' },
    { name: '积极心态', description: '将压力视为展示能力的机会，保持自信和专业' }
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
  ],
  sampleQuestions: [
    '在过去的项目中，你遇到的最大挑战是什么？如何解决的？',
    '如果你的团队成员突然离职，你如何应对工作压力？',
    '你如何在有限时间内完成多个紧急任务？',
    '如果你的方案被上级否定，你会如何处理？',
    '在高压环境下，你如何保持工作质量？'
  ]
})

const togglePressureDetails = () => {
  showPressureDetails.value = !showPressureDetails.value
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
                  <Square :size="20" />
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
                <div v-for="type in technicalDetails.types" :key="type.id" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group">
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
                  <Square :size="20" />
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
                  <Square :size="20" />
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
                <div v-for="question in bqDetails.commonQuestions" :key="question.id" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group">
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
                  <Square :size="20" />
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
                  <Square :size="20" />
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
                <div v-for="scenario in pressureDetails.scenarios" :key="scenario.id" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group">
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
                  <Square :size="20" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <div class="bg-white rounded-3xl border border-neutral-border p-12 shadow-sm flex flex-col items-center text-center">
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
