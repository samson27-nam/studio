import type { Executive, NewsArticle, ForumThread, User } from './types';

export const users: Record<string, User> = {
  'sarah-jones': {
    name: 'Sarah Jones',
    avatar: 'https://picsum.photos/seed/user-1/40/40',
  },
  'mike-davis': {
    name: 'Mike Davis',
    avatar: 'https://picsum.photos/seed/user-2/40/40',
  },
  'emily-chen': {
    name: 'Emily Chen',
    avatar: 'https://picsum.photos/seed/user-3/40/40',
  },
  'david-lee': {
    name: 'David Lee',
    avatar: 'https://picsum.photos/seed/user-4/40/40',
  },
   'jane-doe': {
    name: 'Jane Doe',
    avatar: 'https://picsum.photos/seed/exec-1/40/40'
  },
};

export const executives: Executive[] = [
  {
    id: '1',
    name: 'Jane Doe',
    role: 'President',
    avatar: 'https://picsum.photos/seed/exec-1/200/200',
  },
  {
    id: '2',
    name: 'John Smith',
    role: 'Vice President',
    avatar: 'https://picsum.photos/seed/exec-2/200/200',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    role: 'Secretary',
    avatar: 'https://picsum.photos/seed/exec-3/200/200',
  },
  {
    id: '4',
    name: 'Robert Brown',
    role: 'Treasurer',
    avatar: 'https://picsum.photos/seed/exec-4/200/200',
  },
  {
    id: '5',
    name: 'Chris Green',
    role: 'Events Coordinator',
    avatar: 'https://picsum.photos/seed/exec-5/200/200',
  },
  {
    id: '6',
    name: 'Patricia White',
    role: 'Marketing Officer',
    avatar: 'https://picsum.photos/seed/exec-6/200/200',
  },
];

export const news: NewsArticle[] = [
  {
    id: '1',
    title: 'Annual Bridge Building Competition Announced',
    date: '2024-08-15',
    excerpt:
      'Get your teams ready! The annual bridge building competition is back, challenging students to design and construct the most efficient model bridge.',
    image: 'https://picsum.photos/seed/news-1/400/225',
    imageHint: 'bridge construction',
  },
  {
    id: '2',
    title: 'Guest Lecture: Sustainable Infrastructure',
    date: '2024-08-10',
    excerpt:
      'Join us for an inspiring talk by Dr. Eleanor Vance on the future of sustainable design in urban environments.',
    image: 'https://picsum.photos/seed/news-2/400/225',
    imageHint: 'sustainable city',
  },
  {
    id: '3',
    title: 'Society Dinner & Awards Night',
    date: '2024-07-28',
    excerpt:
      'A night to celebrate the achievements of our members and look forward to the year ahead. Tickets on sale now!',
    image: 'https://picsum.photos/seed/news-3/400/225',
    imageHint: 'formal dinner',
  },
];

export const forumThreads: ForumThread[] = [
  {
    id: '1',
    title: 'Discussion: The Future of Geotechnical Engineering',
    author: users['sarah-jones'],
    replies: 5,
    lastActivity: '2 hours ago',
    posts: [
      {
        id: 'p1-1',
        author: users['sarah-jones'],
        timestamp: '1 day ago',
        content: `I've been reading a lot about the integration of AI and machine learning in geotechnical site investigation. It seems like we're on the cusp of a major revolution in how we predict soil behavior and design foundations. Technologies like automated drone surveys for creating 3D terrain models, combined with ML algorithms that analyze vast datasets from historical projects, could drastically reduce uncertainty and improve safety. What are your thoughts on this? Are there any specific new technologies or methodologies you're excited about? I also wonder about the challenges, like the need for high-quality, standardized data and the potential for black-box algorithms to be difficult to validate for critical structures. It's a double-edged sword, but the potential upside for efficiency and accuracy is immense. Let's discuss the pros and cons.`,
      },
      {
        id: 'p1-2',
        author: users['mike-davis'],
        timestamp: '22 hours ago',
        content: `Great topic, Sarah! I'm particularly interested in the use of IoT sensors embedded in foundations and retaining walls. Real-time monitoring of strain, pressure, and displacement could provide invaluable data for validating our initial design assumptions and for long-term structural health monitoring. Imagine a bridge that can report back on how its foundations are settling in real-time.`,
      },
      {
        id: 'p1-3',
        author: users['emily-chen'],
        timestamp: '15 hours ago',
        content: `I agree with the potential, but I'm also cautious about the data requirements. As you mentioned, Sarah, standardized data is key. Without it, we risk 'garbage in, garbage out.' There needs to be a big push for industry-wide data standards before we can fully trust these AI models.`,
      },
    ],
  },
  {
    id: '2',
    title: 'Tips for the upcoming Fundamentals of Engineering (FE) Exam?',
    author: users['mike-davis'],
    replies: 12,
    lastActivity: '30 minutes ago',
    posts: [
       {
        id: 'p2-1',
        author: users['mike-davis'],
        timestamp: '2 days ago',
        content: `Hey everyone, I'm planning to take the FE Civil exam in a few months and feeling a bit overwhelmed by the amount of material. For those who have already passed, what are your best tips for studying? Which resources did you find most helpful? Any advice on time management during the exam would be great too! Thanks in advance!`,
      },
    ],
  },
  {
    id: '3',
    title: 'Project Showcase: My Senior Design Project on Water Treatment',
    author: users['emily-chen'],
    replies: 8,
    lastActivity: '5 hours ago',
     posts: [
       {
        id: 'p3-1',
        author: users['emily-chen'],
        timestamp: '3 days ago',
        content: `Just finished my senior design project! We designed a decentralized water treatment system for a small rural community. I've attached some diagrams and our final report. Would love to get some feedback from you all. It was a challenging but incredibly rewarding experience.`,
      },
    ],
  },
  {
    id: '4',
    title: 'Internship Opportunities - Summer 2025',
    author: users['david-lee'],
    replies: 21,
    lastActivity: '1 day ago',
     posts: [
       {
        id: 'p4-1',
        author: users['david-lee'],
        timestamp: '4 days ago',
        content: `Let's start a thread to share any summer 2025 internship postings for civil engineering roles. If you see something, post it here! Let's help each other out.`,
      },
    ],
  },
];
