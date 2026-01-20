// Sample data for demo 
const sampleJobs = [
  {
    title: "Full Stack Developer",
    company: "Tech Innovations Inc",
    description: "Build scalable web applications using modern technologies. Work with React, Node.js, and cloud services.",
    requirements: "3+ years experience with React, Node.js, MongoDB, REST APIs, Git version control",
    location: "Remote",
    salary: "$80,000 - $120,000",
    postedBy: "Sarah Johnson, HR Manager"
  },
  {
    title: "Data Scientist",
    company: "Analytics Pro",
    description: "Analyze large datasets and build machine learning models to drive business insights.",
    requirements: "Python, pandas, scikit-learn, SQL, statistics, machine learning algorithms",
    location: "New York, NY",
    salary: "$90,000 - $140,000",
    postedBy: "Mike Chen, Data Team Lead"
  },
  {
    title: "Frontend Developer",
    company: "Design Studio",
    description: "Create beautiful, responsive user interfaces using React and modern CSS frameworks.",
    requirements: "React, JavaScript, HTML5, CSS3, Bootstrap, responsive design, UI/UX principles",
    location: "San Francisco, CA",
    salary: "$70,000 - $110,000",
    postedBy: "Lisa Park, Creative Director"
  }
];

const sampleCandidates = [
  {
    candidateName: "John Smith",
    email: "john.smith@email.com",
    phone: "555-0123",
    skills: "React, Node.js, JavaScript, MongoDB, Express.js",
    experience: "4 years full-stack development, built 10+ web applications",
    education: "BS Computer Science, State University",
    content: "Experienced Full Stack Developer with 4 years building modern web applications using React, Node.js, and MongoDB. Proficient in JavaScript, Express.js, REST APIs, and Git. Built scalable applications serving 10,000+ users."
  },
  {
    candidateName: "Emily Davis",
    email: "emily.davis@email.com", 
    phone: "555-0456",
    skills: "Python, pandas, scikit-learn, SQL, machine learning",
    experience: "3 years data analysis, ML model development",
    education: "MS Data Science, Tech University",
    content: "Data Scientist with 3 years experience in machine learning and statistical analysis. Expert in Python, pandas, scikit-learn, and SQL. Developed predictive models improving business metrics by 25%. Strong background in statistics and data visualization."
  },
  {
    candidateName: "Alex Rodriguez",
    email: "alex.rodriguez@email.com",
    phone: "555-0789", 
    skills: "React, JavaScript, HTML5, CSS3, Bootstrap, UI/UX",
    experience: "2 years frontend development, responsive design",
    education: "BS Web Design, Design College",
    content: "Frontend Developer specializing in React and responsive web design. 2 years experience creating user-friendly interfaces with HTML5, CSS3, Bootstrap, and modern JavaScript. Strong eye for UI/UX design principles and cross-browser compatibility."
  }
];



console.log('Sample data ready for demo');
console.log('Jobs:', sampleJobs.length);
console.log('Candidates:', sampleCandidates.length);