// Initialize dummy users and data for the application
export const initializeDummyData = () => {
  // Check if dummy data has already been initialized
  if (localStorage.getItem('dummyDataInitialized')) {
    return;
  }

  // Dummy Users
  const dummyUsers = [
    {
      id: 'user_1',
      email: 'sarah.johnson@university.edu',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'researcher',
      institution: 'Stanford University',
      department: 'Computer Science',
      bio: 'AI researcher specializing in machine learning and neural networks'
    },
    {
      id: 'user_2',
      email: 'michael.chen@university.edu',
      firstName: 'Michael',
      lastName: 'Chen',
      role: 'professor',
      institution: 'MIT',
      department: 'Data Science',
      bio: 'Professor of Data Science with focus on big data analytics'
    },
    {
      id: 'user_3',
      email: 'emma.wilson@university.edu',
      firstName: 'Emma',
      lastName: 'Wilson',
      role: 'researcher',
      institution: 'Harvard University',
      department: 'Environmental Science',
      bio: 'Climate change researcher studying coastal ecosystems'
    },
    {
      id: 'user_4',
      email: 'david.brown@university.edu',
      firstName: 'David',
      lastName: 'Brown',
      role: 'researcher',
      institution: 'UC Berkeley',
      department: 'Physics',
      bio: 'Quantum physics researcher working on quantum computing'
    },
    {
      id: 'user_5',
      email: 'lisa.anderson@university.edu',
      firstName: 'Lisa',
      lastName: 'Anderson',
      role: 'professor',
      institution: 'Yale University',
      department: 'Biology',
      bio: 'Molecular biology professor specializing in genetics'
    },
    {
      id: 'user_6',
      email: 'james.martinez@university.edu',
      firstName: 'James',
      lastName: 'Martinez',
      role: 'researcher',
      institution: 'Princeton University',
      department: 'Mathematics',
      bio: 'Mathematical modeling researcher in applied mathematics'
    }
  ];

  // Save dummy users to globalAllUsers
  localStorage.setItem('globalAllUsers', JSON.stringify(dummyUsers));

  // Dummy Projects
  const dummyProjects = [
    {
      id: 'proj_1',
      title: 'AI-Powered Climate Modeling',
      description: 'Developing machine learning models to predict climate change impacts on coastal regions using advanced neural networks and satellite data.',
      status: 'active',
      priority: 'high',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      budget: '$150,000',
      department: 'Computer Science',
      institution: 'Stanford University',
      createdBy: 'user_1',
      createdByName: 'Sarah Johnson',
      progress: 65,
      tasksCount: 24,
      documentsCount: 18,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-11-01T10:00:00.000Z'
    },
    {
      id: 'proj_2',
      title: 'Quantum Computing Algorithms',
      description: 'Research on developing new quantum algorithms for optimization problems and cryptography applications.',
      status: 'active',
      priority: 'high',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      budget: '$200,000',
      department: 'Physics',
      institution: 'UC Berkeley',
      createdBy: 'user_4',
      createdByName: 'David Brown',
      progress: 45,
      tasksCount: 18,
      documentsCount: 12,
      createdAt: '2024-03-01T10:00:00.000Z',
      updatedAt: '2024-11-01T10:00:00.000Z'
    },
    {
      id: 'proj_3',
      title: 'Marine Ecosystem Restoration',
      description: 'Studying the impact of climate change on marine biodiversity and developing restoration strategies for coral reefs.',
      status: 'active',
      priority: 'medium',
      startDate: '2024-02-10',
      endDate: '2024-11-30',
      budget: '$120,000',
      department: 'Environmental Science',
      institution: 'Harvard University',
      createdBy: 'user_3',
      createdByName: 'Emma Wilson',
      progress: 78,
      tasksCount: 32,
      documentsCount: 25,
      createdAt: '2024-02-10T10:00:00.000Z',
      updatedAt: '2024-11-01T10:00:00.000Z'
    },
    {
      id: 'proj_4',
      title: 'Big Data Analytics Framework',
      description: 'Building a scalable framework for processing and analyzing large-scale datasets using distributed computing.',
      status: 'planning',
      priority: 'medium',
      startDate: '2024-12-01',
      endDate: '2025-06-30',
      budget: '$180,000',
      department: 'Data Science',
      institution: 'MIT',
      createdBy: 'user_2',
      createdByName: 'Michael Chen',
      progress: 15,
      tasksCount: 8,
      documentsCount: 5,
      createdAt: '2024-10-15T10:00:00.000Z',
      updatedAt: '2024-11-01T10:00:00.000Z'
    },
    {
      id: 'proj_5',
      title: 'Genetic Engineering Techniques',
      description: 'Research on advanced CRISPR techniques for gene therapy applications in treating genetic disorders.',
      status: 'active',
      priority: 'high',
      startDate: '2024-01-20',
      endDate: '2024-12-15',
      budget: '$250,000',
      department: 'Biology',
      institution: 'Yale University',
      createdBy: 'user_5',
      createdByName: 'Lisa Anderson',
      progress: 82,
      tasksCount: 28,
      documentsCount: 20,
      createdAt: '2024-01-20T10:00:00.000Z',
      updatedAt: '2024-11-01T10:00:00.000Z'
    }
  ];

  localStorage.setItem('globalProjects', JSON.stringify(dummyProjects));

  // Dummy Research Papers
  const dummyPapers = [
    {
      id: 'paper_1',
      title: 'Deep Learning for Climate Prediction: A Comprehensive Analysis',
      abstract: 'This paper presents a novel deep learning approach for predicting climate patterns using convolutional neural networks and LSTM models. We analyze 50 years of climate data and achieve 92% accuracy in seasonal predictions.',
      authors: ['Sarah Johnson', 'Michael Chen', 'Emma Wilson'],
      keywords: ['deep learning', 'climate prediction', 'neural networks', 'LSTM'],
      category: 'computer-science',
      uploadedBy: 'user_1',
      uploadedByName: 'Sarah Johnson',
      file: null,
      fileName: 'climate-prediction-deep-learning.pdf',
      reviews: [
        {
          id: 'rev_1',
          reviewerId: 'user_2',
          reviewerName: 'Michael Chen',
          rating: 5,
          comment: 'Excellent work! The methodology is sound and the results are impressive.',
          createdAt: '2024-10-15T10:00:00.000Z'
        },
        {
          id: 'rev_2',
          reviewerId: 'user_3',
          reviewerName: 'Emma Wilson',
          rating: 4,
          comment: 'Great research, but I would like to see more discussion on the limitations.',
          createdAt: '2024-10-20T10:00:00.000Z'
        }
      ],
      views: 156,
      downloads: 42,
      createdAt: '2024-09-01T10:00:00.000Z'
    },
    {
      id: 'paper_2',
      title: 'Quantum Algorithms for Optimization: Theory and Applications',
      abstract: 'We explore quantum algorithms for solving optimization problems, focusing on quantum annealing and variational quantum eigensolvers. Our results show significant speedup for certain problem classes.',
      authors: ['David Brown', 'James Martinez'],
      keywords: ['quantum computing', 'optimization', 'algorithms', 'quantum annealing'],
      category: 'physics',
      uploadedBy: 'user_4',
      uploadedByName: 'David Brown',
      file: null,
      fileName: 'quantum-optimization-algorithms.pdf',
      reviews: [
        {
          id: 'rev_3',
          reviewerId: 'user_1',
          reviewerName: 'Sarah Johnson',
          rating: 5,
          comment: 'Fascinating research! The theoretical framework is well-developed.',
          createdAt: '2024-10-10T10:00:00.000Z'
        }
      ],
      views: 89,
      downloads: 23,
      createdAt: '2024-08-15T10:00:00.000Z'
    },
    {
      id: 'paper_3',
      title: 'Coral Reef Restoration Strategies in the Age of Climate Change',
      abstract: 'This study examines the effectiveness of various coral reef restoration techniques under different climate scenarios. We present data from 15 restoration sites over 5 years.',
      authors: ['Emma Wilson', 'Lisa Anderson'],
      keywords: ['coral reefs', 'restoration', 'climate change', 'marine biology'],
      category: 'environmental-science',
      uploadedBy: 'user_3',
      uploadedByName: 'Emma Wilson',
      file: null,
      fileName: 'coral-reef-restoration.pdf',
      reviews: [
        {
          id: 'rev_4',
          reviewerId: 'user_5',
          reviewerName: 'Lisa Anderson',
          rating: 4,
          comment: 'Very comprehensive study. The data collection methodology is excellent.',
          createdAt: '2024-10-25T10:00:00.000Z'
        }
      ],
      views: 124,
      downloads: 38,
      createdAt: '2024-07-20T10:00:00.000Z'
    },
    {
      id: 'paper_4',
      title: 'Scalable Distributed Computing for Big Data Analytics',
      abstract: 'We propose a new distributed computing framework that can process petabytes of data efficiently. The framework uses a novel partitioning strategy and achieves 3x speedup over existing solutions.',
      authors: ['Michael Chen', 'Sarah Johnson'],
      keywords: ['distributed computing', 'big data', 'scalability', 'analytics'],
      category: 'computer-science',
      uploadedBy: 'user_2',
      uploadedByName: 'Michael Chen',
      file: null,
      fileName: 'distributed-computing-framework.pdf',
      reviews: [],
      views: 67,
      downloads: 19,
      createdAt: '2024-09-10T10:00:00.000Z'
    },
    {
      id: 'paper_5',
      title: 'CRISPR-Cas9 Gene Editing: Advances and Ethical Considerations',
      abstract: 'This paper reviews recent advances in CRISPR-Cas9 technology and discusses the ethical implications of gene editing in humans and other organisms.',
      authors: ['Lisa Anderson', 'David Brown'],
      keywords: ['CRISPR', 'gene editing', 'biotechnology', 'ethics'],
      category: 'biology',
      uploadedBy: 'user_5',
      uploadedByName: 'Lisa Anderson',
      file: null,
      fileName: 'crispr-gene-editing.pdf',
      reviews: [
        {
          id: 'rev_5',
          reviewerId: 'user_4',
          reviewerName: 'David Brown',
          rating: 5,
          comment: 'Excellent overview of both technical and ethical aspects.',
          createdAt: '2024-10-30T10:00:00.000Z'
        }
      ],
      views: 201,
      downloads: 58,
      createdAt: '2024-06-15T10:00:00.000Z'
    }
  ];

  localStorage.setItem('globalResearchPapers', JSON.stringify(dummyPapers));

  // Dummy Connections (for each user)
  const connections = {
    'user_1': [
      { id: 'user_2', name: 'Michael Chen', email: 'michael.chen@university.edu' },
      { id: 'user_3', name: 'Emma Wilson', email: 'emma.wilson@university.edu' }
    ],
    'user_2': [
      { id: 'user_1', name: 'Sarah Johnson', email: 'sarah.johnson@university.edu' },
      { id: 'user_4', name: 'David Brown', email: 'david.brown@university.edu' }
    ],
    'user_3': [
      { id: 'user_1', name: 'Sarah Johnson', email: 'sarah.johnson@university.edu' },
      { id: 'user_5', name: 'Lisa Anderson', email: 'lisa.anderson@university.edu' }
    ],
    'user_4': [
      { id: 'user_2', name: 'Michael Chen', email: 'michael.chen@university.edu' },
      { id: 'user_6', name: 'James Martinez', email: 'james.martinez@university.edu' }
    ],
    'user_5': [
      { id: 'user_3', name: 'Emma Wilson', email: 'emma.wilson@university.edu' },
      { id: 'user_6', name: 'James Martinez', email: 'james.martinez@university.edu' }
    ],
    'user_6': [
      { id: 'user_4', name: 'David Brown', email: 'david.brown@university.edu' },
      { id: 'user_5', name: 'Lisa Anderson', email: 'lisa.anderson@university.edu' }
    ]
  };

  // Save connections for each user
  Object.keys(connections).forEach(userId => {
    localStorage.setItem(`connections_${userId}`, JSON.stringify(connections[userId]));
  });

  // Dummy Pending Requests
  const pendingRequests = {
    'user_1': [
      {
        id: 'req_1',
        senderId: 'user_4',
        senderName: 'David Brown',
        senderEmail: 'david.brown@university.edu',
        createdAt: '2024-11-01T08:00:00.000Z'
      }
    ],
    'user_2': [
      {
        id: 'req_2',
        senderId: 'user_6',
        senderName: 'James Martinez',
        senderEmail: 'james.martinez@university.edu',
        createdAt: '2024-11-01T09:00:00.000Z'
      }
    ]
  };

  // Save pending requests
  Object.keys(pendingRequests).forEach(userId => {
    localStorage.setItem(`pendingRequests_${userId}`, JSON.stringify(pendingRequests[userId]));
  });

  // Dummy Messages
  const messages = {
    'user_1': [
      {
        id: 'msg_1',
        from: 'user_2',
        fromName: 'Michael Chen',
        to: 'user_1',
        toName: 'Sarah Johnson',
        text: 'Hi Sarah! I read your latest paper on climate prediction. Great work!',
        timestamp: '2024-10-28T10:00:00.000Z',
        read: true
      },
      {
        id: 'msg_2',
        from: 'user_1',
        fromName: 'Sarah Johnson',
        to: 'user_2',
        toName: 'Michael Chen',
        text: 'Thank you, Michael! I\'d love to collaborate on a project combining our approaches.',
        timestamp: '2024-10-28T10:15:00.000Z',
        read: true
      },
      {
        id: 'msg_3',
        from: 'user_3',
        fromName: 'Emma Wilson',
        to: 'user_1',
        toName: 'Sarah Johnson',
        text: 'Hey Sarah! Are you available for a quick call about the climate modeling project?',
        timestamp: '2024-11-01T09:30:00.000Z',
        read: false
      }
    ],
    'user_2': [
      {
        id: 'msg_1',
        from: 'user_2',
        fromName: 'Michael Chen',
        to: 'user_1',
        toName: 'Sarah Johnson',
        text: 'Hi Sarah! I read your latest paper on climate prediction. Great work!',
        timestamp: '2024-10-28T10:00:00.000Z',
        read: true
      },
      {
        id: 'msg_2',
        from: 'user_1',
        fromName: 'Sarah Johnson',
        to: 'user_2',
        toName: 'Michael Chen',
        text: 'Thank you, Michael! I\'d love to collaborate on a project combining our approaches.',
        timestamp: '2024-10-28T10:15:00.000Z',
        read: true
      },
      {
        id: 'msg_4',
        from: 'user_4',
        fromName: 'David Brown',
        to: 'user_2',
        toName: 'Michael Chen',
        text: 'Michael, I think our quantum computing work could benefit from your data science expertise.',
        timestamp: '2024-10-30T14:00:00.000Z',
        read: true
      }
    ],
    'user_3': [
      {
        id: 'msg_3',
        from: 'user_3',
        fromName: 'Emma Wilson',
        to: 'user_1',
        toName: 'Sarah Johnson',
        text: 'Hey Sarah! Are you available for a quick call about the climate modeling project?',
        timestamp: '2024-11-01T09:30:00.000Z',
        read: false
      }
    ]
  };

  // Save messages for each user
  Object.keys(messages).forEach(userId => {
    localStorage.setItem(`messages_${userId}`, JSON.stringify(messages[userId]));
  });

  // Dummy Tasks for each user
  const tasks = {
    'user_1': [
      { id: 'task_1', title: 'Complete data analysis for climate model', completed: true, createdAt: '2024-10-25T10:00:00.000Z' },
      { id: 'task_2', title: 'Review paper submission from Michael', completed: false, createdAt: '2024-10-28T10:00:00.000Z' },
      { id: 'task_3', title: 'Prepare presentation for conference', completed: false, createdAt: '2024-10-30T10:00:00.000Z' },
      { id: 'task_4', title: 'Update project documentation', completed: true, createdAt: '2024-11-01T10:00:00.000Z' }
    ],
    'user_2': [
      { id: 'task_5', title: 'Design distributed computing framework architecture', completed: true, createdAt: '2024-10-20T10:00:00.000Z' },
      { id: 'task_6', title: 'Write grant proposal', completed: false, createdAt: '2024-10-25T10:00:00.000Z' },
      { id: 'task_7', title: 'Meet with research team', completed: false, createdAt: '2024-11-02T10:00:00.000Z' }
    ],
    'user_3': [
      { id: 'task_8', title: 'Collect coral reef data samples', completed: true, createdAt: '2024-10-15T10:00:00.000Z' },
      { id: 'task_9', title: 'Analyze restoration site results', completed: false, createdAt: '2024-10-30T10:00:00.000Z' },
      { id: 'task_10', title: 'Write research paper draft', completed: false, createdAt: '2024-11-01T10:00:00.000Z' }
    ],
    'user_4': [
      { id: 'task_11', title: 'Implement quantum algorithm prototype', completed: true, createdAt: '2024-10-18T10:00:00.000Z' },
      { id: 'task_12', title: 'Test quantum computing framework', completed: false, createdAt: '2024-10-28T10:00:00.000Z' }
    ],
    'user_5': [
      { id: 'task_13', title: 'Conduct gene editing experiments', completed: true, createdAt: '2024-10-22T10:00:00.000Z' },
      { id: 'task_14', title: 'Review ethical guidelines document', completed: false, createdAt: '2024-10-29T10:00:00.000Z' }
    ],
    'user_6': [
      { id: 'task_15', title: 'Develop mathematical model', completed: true, createdAt: '2024-10-20T10:00:00.000Z' },
      { id: 'task_16', title: 'Prepare conference paper', completed: false, createdAt: '2024-11-01T10:00:00.000Z' }
    ]
  };

  // Save tasks for each user
  Object.keys(tasks).forEach(userId => {
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks[userId]));
  });

  // Mark dummy data as initialized
  localStorage.setItem('dummyDataInitialized', 'true');
  
  console.log('✅ Dummy data initialized successfully!');
};



