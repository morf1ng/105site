
type Project = {
  id: string,
  title: string,
  preview_img: string,
  url: string,
  date: Date,

  notebook_img: string,
  main_img: string,
  target: string,
  task: string,
  about_company: {
    title: string,
    description: string
  },
  stages: { title: string, description: string, img: string }[],
  result: {
    title: string,
    description: string,
    images: { type: string, img: string }[]
  },
  progess: { stat: string, text: string }[]
}

const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    preview_img: '/assets/images/delta-construction-page.png',
    url: 'https://github.com/user/ecommerce',
    date: new Date('2024-01-15'),
    notebook_img: '/assets/images/delta-construction-page.png',
    main_img: '/assets/images/after-about.png',
    target: 'Develop a modern e-commerce platform with seamless user experience',
    task: 'Create a full-stack e-commerce solution with payment integration and admin dashboard',
    about_company: {
      title: 'Retail Tech Solutions',
      description: 'A technology company focused on revolutionizing online retail experiences through innovative solutions'
    },
    stages: [
      { title: 'Аналитика', description: 'Market analysis and requirement gathering', img: '/assets/images/after-about.png' },
      { title: 'Проектирование', description: 'Wireframing and prototyping the user interface', img: '/assets/images/after-about.png' },
      { title: 'Дизайн', description: 'Frontend and backend implementation', img: '/assets/images/after-about.png' }
    ],
    result: {
      title: 'Successful E-Commerce Launch',
      description: 'Delivered a fully functional e-commerce platform with 99.9% uptime',
      images: [
        { type: 'dashboard', img: '/assets/images/after-about.png' },
        { type: 'product-page', img: '/assets/images/after-about.png' },
        { type: 'checkout', img: '/assets/images/after-about.png' }
      ]
    },
    progess: [
      { stat: '150', text: 'Products Listed' },
      { stat: '5000', text: 'Active Users' },
      { stat: '99', text: 'Satisfaction Rate' }
    ]
  },
  {
    id: '2',
    title: 'Task Management App',
    preview_img: '/assets/images/after-about.png',
    url: 'https://github.com/user/taskapp',
    date: new Date('2024-02-01'),
    notebook_img: '/assets/images/after-about.png',
    main_img: '/assets/images/after-about.png',
    target: 'Build a collaborative task management application for teams',
    task: 'Develop a real-time task tracking system with team collaboration features',
    about_company: {
      title: 'Productivity Labs',
      description: 'Specializing in creating tools that enhance team productivity and workflow efficiency'
    },
    stages: [
      { title: 'Аналитика', description: 'Define app structure and user flows', img: '/assets/images/after-about.png' },
      { title: 'Проектирование', description: 'Create interactive prototypes for user testing', img: '/assets/images/after-about.png' },
      { title: 'Дизайн', description: 'Build the application with real-time features', img: '/assets/images/after-about.png' }
    ],
    result: {
      title: 'Efficient Task Management Solution',
      description: 'Released a robust task management app used by 100+ teams',
      images: [
        { type: 'dashboard', img: '/assets/images/after-about.png' },
        { type: 'task-board', img: '/assets/images/after-about.png' },
        { type: 'team-view', img: '/assets/images/after-about.png' }
      ]
    },
    progess: [
      { stat: '100', text: 'Teams Using' },
      { stat: '5000', text: 'Tasks Created' },
      { stat: '95', text: 'Productivity Increase' }
    ]
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    preview_img: '/assets/images/after-about.png',
    url: 'https://github.com/user/weather',
    date: new Date('2024-01-28'),
    notebook_img: '/assets/images/after-about.png',
    main_img: '/assets/images/after-about.png',
    target: 'Create a comprehensive weather monitoring dashboard with real-time data',
    task: 'Develop a responsive weather application with multiple data sources and visualization',
    about_company: {
      title: 'Climate Insights Inc',
      description: 'Providing accurate weather data and analytics for businesses and individuals'
    },
    stages: [
      { title: 'Аналитика', description: 'Connect to multiple weather data providers', img: '/assets/images/after-about.png' },
      { title: 'Проектирование', description: 'Design intuitive weather visualization interfaces', img: '/assets/images/after-about.png' },
      { title: 'Дизайн', description: 'Implement data aggregation and caching systems', img: '/assets/images/after-about.png' }
    ],
    result: {
      title: 'Advanced Weather Platform',
      description: 'Built a reliable weather dashboard serving 10,000+ daily users',
      images: [
        { type: 'main-dashboard', img: '/assets/images/after-about.png' },
        { type: 'forecast-view', img: '/assets/images/after-about.png' },
        { type: 'mobile-app', img: '/assets/images/after-about.png' }
      ]
    },
    progess: [
      { stat: '10000', text: 'Daily Users' },
      { stat: '99', text: 'Data Accuracy' },
      { stat: '200', text: 'Cities Covered' }
    ]
  },
  {
    id: '4',
    title: 'Social Media Analytics',
    preview_img: '/assets/images/after-about.png',
    url: 'https://github.com/user/analytics',
    date: new Date('2024-02-10'),
    notebook_img: '/assets/images/after-about.png',
    main_img: '/assets/images/after-about.png',
    target: 'Develop an analytics platform for social media performance tracking',
    task: 'Create a comprehensive analytics dashboard with real-time social media metrics',
    about_company: {
      title: 'Digital Presence Co',
      description: 'Helping businesses understand and improve their social media impact through data-driven insights'
    },
    stages: [
      { title: 'Аналитика', description: 'Integrate with social media APIs', img: '/assets/images/after-about.png' },
      { title: 'Проектирование', description: 'Build data processing and analysis algorithms', img: '/assets/images/after-about.png' },
      { title: 'Дизайн', description: 'Create interactive charts and reports', img: '/assets/images/after-about.png' }
    ],
    result: {
      title: 'Comprehensive Analytics Suite',
      description: 'Delivered a powerful analytics platform used by marketing agencies',
      images: [
        { type: 'analytics-dashboard', img: '/assets/images/after-about.png' },
        { type: 'report-builder', img: '/assets/images/after-about.png' },
        { type: 'campaign-view', img: '/assets/images/after-about.png' }
      ]
    },
    progess: [
      { stat: '50', text: 'Agencies Using' },
      { stat: '1000', text: 'Brands Monitored' },
      { stat: '89', text: 'ROI Improvement' }
    ]
  },
  {
    id: '5',
    title: 'Portfolio Website',
    preview_img: '/assets/images/after-about.png',
    url: 'https://github.com/user/portfolio',
    date: new Date('2024-01-20'),
    notebook_img: '/assets/images/after-about.png',
    main_img: '/assets/images/after-about.png',
    target: 'Design and develop a modern portfolio website for creative professionals',
    task: 'Create a responsive portfolio website with smooth animations and CMS integration',
    about_company: {
      title: 'Creative Studio',
      description: 'A boutique design studio specializing in digital experiences and brand identity'
    },
    stages: [
      { title: 'Аналитика', description: 'Define visual style and brand elements', img: '/assets/images/after-about.png' },
      { title: 'Проектирование', description: 'Layout structure and content organization', img: '/assets/images/after-about.png' },
      { title: 'Дизайн', description: 'Implement responsive design and interactions', img: '/assets/images/after-about.png' }
    ],
    result: {
      title: 'Stunning Portfolio Platform',
      description: 'Created an award-winning portfolio website with excellent user experience',
      images: [
        { type: 'homepage', img: '/assets/images/after-about.png' },
        { type: 'project-gallery', img: '/assets/images/after-about.png' },
        { type: 'contact-page', img: '/assets/images/after-about.png' }
      ]
    },
    progess: [
      { stat: '100', text: 'Performance Score' },
      { stat: '95', text: 'Client Satisfaction' },
      { stat: '50', text: 'Projects Showcased' }
    ]
  }
];

const getProjects = () => projects

const getProjectById = (id: string): Project | null => {
    const found = projects.find(proj => proj.id == id)
    console.log(found)
    return found ? found : null
}

const getProjectByName = (name: string) : Project | null => {
    const found = projects.find(proj => proj.title == name)

    return found ? found : null
}

export type { Project }
export { getProjects, getProjectById, getProjectByName }