// ===========================
// ApexKit Client SDK with Built-in Browser Storage Simulation
// ===========================

import { UserProfile, Assignment, Bid, Message, Course, Review, PaymentTransaction } from '../types';

export type ScopeType = 'root' | 'tenant' | 'sandbox';

export interface Scope {
  type: ScopeType;
  id: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  scope: string;
  metadata?: Record<string, any>;
  last_active?: string;
  [key: string]: any;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BaseRecord {
  id: string;
  created: string;
  updated: string;
  [key: string]: any;
}

export interface ListResult<T> {
  items: T[];
  total: number;
  page?: number;
  per_page?: number;
}

export interface QueryOptions {
  page?: number;
  per_page?: number;
  sort?: string;
  filter?: string | Record<string, any>;
  expand?: string;
  fields?: string;
  [key: string]: any;
}

export interface StoredFile {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
}

export class ApexError extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message);
    this.name = 'ApexError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Seed helper
const SEED_DATA_KEY = 'assignment_help_portal_seeded_v1';

const INITIAL_COURSES: Course[] = [
  { id: 'c1', code: 'CS 101', name: 'Introduction to Programming', category: 'Computer Science', iconName: 'Code', description: 'Basics of Python, object-oriented programming, and core algorithms.' },
  { id: 'c2', code: 'MATH 201', name: 'Calculus II', category: 'Mathematics', iconName: 'Calculator', description: 'Integration techniques, sequences, series, and polar coordinates.' },
  { id: 'c3', code: 'PHYS 150', name: 'Classical Mechanics', category: 'Physics', iconName: 'Atom', description: 'Newtonian mechanics, kinematics, work and energy, and gravitation.' },
  { id: 'c4', code: 'ENGL 110', name: 'Academic Writing & Rhetoric', category: 'Humanities', iconName: 'BookOpen', description: 'Critical analysis, essay structuring, citation formats, and argumentation.' },
  { id: 'c5', code: 'CHEM 102', name: 'General Chemistry II', category: 'Chemistry', iconName: 'FlaskConical', description: 'Chemical kinetics, thermodynamics, equilibrium, and electrochemistry.' },
];

const INITIAL_TUTORS: UserProfile[] = [
  {
    id: 'u_tutor_1',
    email: 'tutor.aris@edu.com',
    name: 'Dr. Aris Thorne',
    role: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    bio: 'Ph.D. in Computer Science with 8+ years of university lecturing experience. Passionate about algorithms, React fullstack engineering, and AI.',
    expertise: ['CS 101', 'Data Structures', 'Python', 'React', 'Java'],
    rating: 4.9,
    hourlyRate: 45,
    completedTasks: 142,
    balance: 1850,
    reviewsCount: 38
  },
  {
    id: 'u_tutor_2',
    email: 'tutor.maya@edu.com',
    name: 'Maya Lin',
    role: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    bio: 'Applied Mathematics graduate from MIT. Specialist in Calculus I-III, Linear Algebra, and Statistics. Friendly and very patient.',
    expertise: ['MATH 201', 'Calculus', 'Linear Algebra', 'Statistics'],
    rating: 4.8,
    hourlyRate: 35,
    completedTasks: 98,
    balance: 720,
    reviewsCount: 27
  },
  {
    id: 'u_tutor_3',
    email: 'tutor.liam@edu.com',
    name: 'Liam Sterling',
    role: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    bio: 'M.S. in Physics. Expert in Classical Mechanics, Quantum Theory, and General Physics homework. Helping you conquer complex problems step-by-step.',
    expertise: ['PHYS 150', 'Mechanics', 'Electromagnetism', 'Thermodynamics'],
    rating: 4.7,
    hourlyRate: 40,
    completedTasks: 73,
    balance: 480,
    reviewsCount: 19
  },
  {
    id: 'u_tutor_4',
    email: 'tutor.sarah@edu.com',
    name: 'Sarah Vance',
    role: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    bio: 'English literature scholar and professional editor. Here to review and level up your essays, research papers, and thesis writing.',
    expertise: ['ENGL 110', 'Academic Writing', 'Literature', 'APA/MLA Citation'],
    rating: 4.9,
    hourlyRate: 30,
    completedTasks: 114,
    balance: 930,
    reviewsCount: 42
  }
];

const INITIAL_REVIEWS: Review[] = [
  { id: 'rev_1', tutorId: 'u_tutor_1', studentName: 'Evelyn P.', rating: 5, comment: 'Aris is an incredible tutor. He helped me debug my recursion assignment and explained it in a way that finally clicked!', assignmentTitle: 'Binary Search Tree Implementation', createdAt: '2026-06-28T14:30:00Z' },
  { id: 'rev_2', tutorId: 'u_tutor_2', studentName: 'Marcus T.', rating: 4.5, comment: 'Very responsive. Walks through equations step-by-step. Calculus doesn\'t feel like magic anymore!', assignmentTitle: 'Infinite Series Integration Problems', createdAt: '2026-07-01T09:15:00Z' },
  { id: 'rev_3', tutorId: 'u_tutor_1', studentName: 'Clara G.', rating: 5, comment: 'Extremely professional. Got an A on my React project! Worth every dollar.', assignmentTitle: 'State Management Web Application', createdAt: '2026-07-04T18:45:00Z' }
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'as_1',
    title: 'Python Recursion & Big O Homework',
    description: 'Need help optimizing a recursive algorithm and writing a formal complexity analysis (Big O) report. The project involves analyzing dynamic programming solutions.',
    courseId: 'c1',
    courseCode: 'CS 101',
    budget: 60,
    deadline: '2026-07-15T23:59:00Z',
    studentId: 'u_student_1',
    studentName: 'Julian Drake',
    status: 'open',
    bidsCount: 2,
    createdAt: '2026-07-05T10:00:00Z'
  },
  {
    id: 'as_2',
    title: 'Calculus II Integration Series',
    description: 'Struggling with Taylor series expansions and alternating series convergence tests. Need step-by-step handwritten explanations of 8 homework problems.',
    courseId: 'c2',
    courseCode: 'MATH 201',
    budget: 45,
    deadline: '2026-07-12T18:00:00Z',
    studentId: 'u_student_2',
    studentName: 'Hannah Abbott',
    status: 'bidded',
    bidsCount: 1,
    createdAt: '2026-07-06T14:20:00Z'
  }
];

const INITIAL_BIDS: Bid[] = [
  {
    id: 'bid_1',
    assignmentId: 'as_1',
    assignmentTitle: 'Python Recursion & Big O Homework',
    tutorId: 'u_tutor_1',
    tutorName: 'Dr. Aris Thorne',
    tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    tutorRating: 4.9,
    amount: 55,
    proposal: 'Hello! I specialize in algorithm design and complexity analysis. I can help you implement the Python recursion functions perfectly and provide a detailed, clear markdown report outlining the time and space complexity with illustrative charts. I can complete this within 24 hours.',
    createdAt: '2026-07-05T11:30:00Z'
  },
  {
    id: 'bid_2',
    assignmentId: 'as_1',
    assignmentTitle: 'Python Recursion & Big O Homework',
    tutorId: 'u_tutor_3',
    tutorName: 'Liam Sterling',
    tutorRating: 4.7,
    amount: 50,
    proposal: 'Hi Julian! I have a solid background in math and computer science. I can write clean, documented Python code and show you exactly how the recursion tree operates step-by-step so you feel ready for your exams. Let\'s get this done!',
    createdAt: '2026-07-06T09:00:00Z'
  },
  {
    id: 'bid_3',
    assignmentId: 'as_2',
    assignmentTitle: 'Calculus II Integration Series',
    tutorId: 'u_tutor_2',
    tutorName: 'Maya Lin',
    tutorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    tutorRating: 4.8,
    amount: 45,
    proposal: 'Hello Hannah! Calculus II can be tricky but once you see the patterns, it becomes very logical. I can provide fully annotated step-by-step written guides for all 8 problems showing convergence tests, and even set up a quick review chat to make sure you understand the core theorems. Feel free to hire me!',
    createdAt: '2026-07-06T15:10:00Z'
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm_1',
    assignmentId: 'as_1',
    chatRoomId: 'u_student_1_u_tutor_1',
    senderId: 'u_student_1',
    senderName: 'Julian Drake',
    text: 'Hello Dr. Aris! I saw your bid on my Python assignment. Would you be able to provide a helper script for visualizing the recurrence tree?',
    createdAt: '2026-07-06T10:15:00Z'
  },
  {
    id: 'm_2',
    assignmentId: 'as_1',
    chatRoomId: 'u_student_1_u_tutor_1',
    senderId: 'u_tutor_1',
    senderName: 'Dr. Aris Thorne',
    text: 'Absolutely, Julian! I can include a matplotlib-based visualizer script that plots the call tree of the Fibonacci and dynamic programming sequences so you can visually inspect the execution stack. It makes a great annex for your report.',
    createdAt: '2026-07-06T10:30:00Z'
  }
];

// Browser DB Controller
class BrowserStorageDB {
  constructor() {
    this.seedIfNeeded();
  }

  private seedIfNeeded() {
    if (!localStorage.getItem(SEED_DATA_KEY)) {
      localStorage.setItem('users_profiles', JSON.stringify([
        { id: 'u_student_1', email: 'julian@edu.com', name: 'Julian Drake', role: 'student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', balance: 500 },
        { id: 'u_student_2', email: 'hannah@edu.com', name: 'Hannah Abbott', role: 'student', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', balance: 350 },
        ...INITIAL_TUTORS
      ]));
      localStorage.setItem('courses', JSON.stringify(INITIAL_COURSES));
      localStorage.setItem('tutors_reviews', JSON.stringify(INITIAL_REVIEWS));
      localStorage.setItem('assignments', JSON.stringify(INITIAL_ASSIGNMENTS));
      localStorage.setItem('bids', JSON.stringify(INITIAL_BIDS));
      localStorage.setItem('messages', JSON.stringify(INITIAL_MESSAGES));
      localStorage.setItem('payments', JSON.stringify([]));
      localStorage.setItem('uploaded_files', JSON.stringify([]));
      localStorage.setItem(SEED_DATA_KEY, 'true');
    }
  }

  get<T>(key: string): T[] {
    this.seedIfNeeded();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  save<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export const browserDB = new BrowserStorageDB();

/**
 * ApexKit Client SDK
 * Complete with local client-side API simulation so that authentication, 
 * databases, chatrooms, payments, and files persist and work locally seamlessly.
 */
export class ApexKit {
  public baseUrl: string;
  private token: string | null = null;
  private currentUser: User | null = null;
  private scopeType: ScopeType;
  private scopeId: string;
  public isTenantFallback: boolean = false;
  public missingCollectionsHandled: string[] = [];

  constructor(baseUrl: string, scopeType: ScopeType = 'root', scopeId: string = '') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.scopeType = scopeType;
    this.scopeId = scopeId;

    // Load active session from localStorage if present
    const cachedToken = localStorage.getItem('apex_token');
    const cachedUser = localStorage.getItem('apex_user');
    if (cachedToken && cachedUser) {
      this.token = cachedToken;
      this.currentUser = JSON.parse(cachedUser);
      if (this.currentUser && this.currentUser.scope) {
        this.setScopeFromTag(this.currentUser.scope);
      }
    }
  }

  get scope(): Scope {
    return { type: this.scopeType, id: this.scopeId };
  }

  sandbox(uuid: string): ApexKit {
    const instance = new ApexKit(`${this.baseUrl}/sandbox/${uuid}`, 'sandbox', uuid);
    instance.setToken(this.token || '', this.currentUser || undefined);
    return instance;
  }

  tenant(tenantId: string): ApexKit {
    const instance = new ApexKit(`${this.baseUrl}/tenant/${tenantId}`, 'tenant', tenantId);
    instance.setToken(this.token || '', this.currentUser || undefined);
    return instance;
  }

  setToken(token: string, user?: User) {
    this.token = token;
    if (token) {
      localStorage.setItem('apex_token', token);
    } else {
      localStorage.removeItem('apex_token');
    }

    if (user) {
      this.currentUser = user;
      localStorage.setItem('apex_user', JSON.stringify(user));
      if (user.scope) {
        this.setScopeFromTag(user.scope);
      }
    } else {
      this.currentUser = null;
      localStorage.removeItem('apex_user');
    }
  }

  private setScopeFromTag(tag: string) {
    if (tag === 'root') {
      this.scopeType = 'root';
      this.scopeId = '';
    } else if (tag.startsWith('tenant:')) {
      this.scopeType = 'tenant';
      this.scopeId = tag.split(':')[1] || '';
    } else if (tag.startsWith('sandbox:')) {
      this.scopeType = 'sandbox';
      this.scopeId = tag.split(':')[1] || '';
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  get auth() {
    return {
      listRoles: async () => ({ roles: ['student', 'tutor', 'admin'] }),

      login: async (email: string, password: string): Promise<AuthResponse> => {
        // Simulate a 400ms network delay
        await new Promise((resolve) => setTimeout(resolve, 400));
        
        const profiles = browserDB.get<any>('users_profiles');
        const userProfile = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());

        if (!userProfile) {
          throw new ApexError('Invalid email or password combination', 400);
        }

        const simulatedToken = 'mock_jwt_token_' + userProfile.id;
        const apiUser: User = {
          id: userProfile.id,
          email: userProfile.email,
          role: userProfile.role,
          scope: 'root',
          metadata: {
            name: userProfile.name,
            avatar: userProfile.avatar,
            bio: userProfile.bio || '',
            expertise: userProfile.expertise || [],
            hourlyRate: userProfile.hourlyRate || 0,
            completedTasks: userProfile.completedTasks || 0,
            balance: userProfile.balance ?? 200,
            reviewsCount: userProfile.reviewsCount || 0
          }
        };

        this.setToken(simulatedToken, apiUser);
        return { token: simulatedToken, user: apiUser };
      },

      register: async (
        email: string,
        password: string,
        metadata: Record<string, any> = {}
      ): Promise<AuthResponse> => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const profiles = browserDB.get<any>('users_profiles');
        const exists = profiles.some((p) => p.email.toLowerCase() === email.toLowerCase());

        if (exists) {
          throw new ApexError('Email is already registered.', 400);
        }

        const newId = 'u_' + Math.random().toString(36).substr(2, 9);
        const newProfile = {
          id: newId,
          email,
          name: metadata.name || email.split('@')[0],
          role: metadata.role || 'student',
          avatar: metadata.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${newId}`,
          bio: metadata.bio || '',
          expertise: metadata.expertise || [],
          hourlyRate: metadata.hourlyRate || 30,
          completedTasks: 0,
          balance: metadata.role === 'student' ? 500 : 0, // Students get some starter budget!
          reviewsCount: 0
        };

        profiles.push(newProfile);
        browserDB.save('users_profiles', profiles);

        const simulatedToken = 'mock_jwt_token_' + newId;
        const apiUser: User = {
          id: newId,
          email: email,
          role: newProfile.role,
          scope: 'root',
          metadata: {
            name: newProfile.name,
            avatar: newProfile.avatar,
            bio: newProfile.bio,
            expertise: newProfile.expertise,
            hourlyRate: newProfile.hourlyRate,
            completedTasks: 0,
            balance: newProfile.balance,
            reviewsCount: 0
          }
        };

        this.setToken(simulatedToken, apiUser);
        return { token: simulatedToken, user: apiUser };
      },

      getMe: async (): Promise<User> => {
        if (!this.currentUser) throw new ApexError('Unauthorized', 401);
        
        // Fetch fresh copy from profiles
        const profiles = browserDB.get<any>('users_profiles');
        const prof = profiles.find(p => p.id === this.currentUser?.id);
        if (prof) {
          this.currentUser.metadata = {
            name: prof.name,
            avatar: prof.avatar,
            bio: prof.bio,
            expertise: prof.expertise,
            hourlyRate: prof.hourlyRate,
            completedTasks: prof.completedTasks,
            balance: prof.balance,
            reviewsCount: prof.reviewsCount
          };
        }
        return this.currentUser;
      },

      updateMe: async (metadata?: Record<string, any>): Promise<User> => {
        if (!this.currentUser) throw new ApexError('Unauthorized', 401);

        const profiles = browserDB.get<any>('users_profiles');
        const index = profiles.findIndex((p) => p.id === this.currentUser?.id);

        if (index === -1) {
          throw new ApexError('User not found', 404);
        }

        const updatedProfile = {
          ...profiles[index],
          ...metadata,
        };

        profiles[index] = updatedProfile;
        browserDB.save('users_profiles', profiles);

        this.currentUser.metadata = {
          ...this.currentUser.metadata,
          ...metadata,
        };

        localStorage.setItem('apex_user', JSON.stringify(this.currentUser));
        return this.currentUser;
      },

      logout: () => {
        this.setToken('', undefined);
      }
    };
  }

  getTenantStatus(): { exists: boolean; fallbackActive: boolean; tenantId: string } {
    const exists = this.scopeType !== 'tenant' || this.scopeId === 'apex-assignment-help';
    return {
      exists,
      fallbackActive: !exists,
      tenantId: this.scopeType === 'tenant' ? this.scopeId : 'root'
    };
  }

  // Collection simulation for assignments, bids, courses, reviews, payments
  collection(collectionId: string | number) {
    const cid = String(collectionId);
    
    const validCollections = [
      'users_profiles',
      'courses',
      'assignments',
      'bids',
      'tutors_reviews',
      'messages',
      'payments',
      'uploaded_files'
    ];
    
    const isCollectionValid = validCollections.includes(cid);
    const isTenantValid = this.scopeType !== 'tenant' || this.scopeId === 'apex-assignment-help';
    
    if (!isTenantValid && this.scopeType === 'tenant') {
      if (!this.isTenantFallback) {
        this.isTenantFallback = true;
        console.warn(`[ApexKit] Tenant '${this.scopeId}' does not exist! Gracefully falling back to data scope 'apex-assignment-help'.`);
      }
    }
    
    if (!isCollectionValid) {
      if (!this.missingCollectionsHandled.includes(cid)) {
        this.missingCollectionsHandled.push(cid);
        console.warn(`[ApexKit] Collection '${cid}' does not exist! Gracefully initializing a dynamic blank collection in memory.`);
      }
    }
    
    return {
      list: async (options: QueryOptions = {}): Promise<ListResult<any>> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        
        if (!isCollectionValid) {
          // If collection does not exist, return a graceful empty listing
          return {
            items: [],
            total: 0,
            page: options.page || 1,
            per_page: options.per_page || 100
          };
        }

        let items = browserDB.get<any>(cid);
 
        // Simple mock filtering
        if (options.filter) {
          let filters: Record<string, any> = {};
          if (typeof options.filter === 'string') {
            try {
              filters = JSON.parse(options.filter);
            } catch (e) {
              // fall back
            }
          } else {
            filters = options.filter;
          }
 
          items = items.filter((item) => {
            for (const key of Object.keys(filters)) {
              if (item[key] !== filters[key]) return false;
            }
            return true;
          });
        }
 
        return {
          items,
          total: items.length,
          page: options.page || 1,
          per_page: options.per_page || 100
        };
      },
 
      create: async (payload: { data: any }): Promise<BaseRecord> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const items = browserDB.get<any>(cid);
        const recordId = cid.substring(0, 3) + '_' + Math.random().toString(36).substr(2, 9);
        const now = new Date().toISOString();
         
        const newRecord: BaseRecord = {
          ...payload.data,
          id: recordId,
          created: now,
          updated: now
        };
 
        items.push(newRecord);
        browserDB.save(cid, items);
 
        // Update relations counters if needed
        if (cid === 'bids') {
          const ass = browserDB.get<any>('assignments');
          const assignmentIndex = ass.findIndex(a => a.id === payload.data.assignmentId);
          if (assignmentIndex !== -1) {
            ass[assignmentIndex].bidsCount = (ass[assignmentIndex].bidsCount || 0) + 1;
            if (ass[assignmentIndex].status === 'open') {
              ass[assignmentIndex].status = 'bidded';
            }
            browserDB.save('assignments', ass);
          }
        }
 
        return newRecord;
      },
 
      get: async (recordId: string | number): Promise<any> => {
        const items = browserDB.get<any>(cid);
        const record = items.find((i) => i.id === String(recordId));
        if (!record) {
          if (!isCollectionValid) {
            // Gracefully return a blank mock record to prevent a full page crash
            return { id: String(recordId), name: 'Unknown', isMockFallback: true };
          }
          throw new ApexError('Record not found', 404);
        }
        return record;
      },
 
      update: async (recordId: string | number, payload: { data: any }): Promise<any> => {
        const items = browserDB.get<any>(cid);
        const index = items.findIndex((i) => i.id === String(recordId));
        if (index === -1) {
          if (!isCollectionValid) return { id: String(recordId), ...payload.data };
          throw new ApexError('Record not found', 404);
        }
 
        const updated = {
          ...items[index],
          ...payload.data,
          updated: new Date().toISOString()
        };
 
        items[index] = updated;
        browserDB.save(cid, items);
        return updated;
      },
 
      patch: async (recordId: string | number, payload: { data: any }): Promise<any> => {
        const items = browserDB.get<any>(cid);
        const index = items.findIndex((i) => i.id === String(recordId));
        if (index === -1) {
          if (!isCollectionValid) return { id: String(recordId), ...payload.data };
          throw new ApexError('Record not found', 404);
        }
 
        const updated = {
          ...items[index],
          ...payload.data,
          updated: new Date().toISOString()
        };
 
        items[index] = updated;
        browserDB.save(cid, items);
        return updated;
      },
 
      delete: async (recordId: string | number): Promise<void> => {
        let items = browserDB.get<any>(cid);
        items = items.filter((i) => i.id !== String(recordId));
        browserDB.save(cid, items);
      }
    };
  }

  get files() {
    return {
      list: async (page = 1, perPage = 20): Promise<ListResult<StoredFile>> => {
        const files = browserDB.get<any>('uploaded_files');
        return {
          items: files,
          total: files.length,
          page,
          per_page: perPage
        };
      },

      upload: async (file: File): Promise<StoredFile> => {
        await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate upload latency
        
        const files = browserDB.get<any>('uploaded_files');
        const id = 'file_' + Math.random().toString(36).substr(2, 9);
        
        // Convert to mock file link (we can use standard document links or mock data URLs)
        const mockUrl = URL.createObjectURL(file);

        const stored: StoredFile = {
          id,
          filename: file.name,
          original_name: file.name,
          mime_type: file.type || 'application/octet-stream',
          size: file.size,
          url: mockUrl,
          created_at: new Date().toISOString()
        };

        files.push(stored);
        browserDB.save('uploaded_files', files);
        return stored;
      },

      delete: async (id: string | number): Promise<void> => {
        let files = browserDB.get<any>('uploaded_files');
        files = files.filter((f) => f.id !== String(id));
        browserDB.save('uploaded_files', files);
      },

      getFileUrl: (filename: string): string => {
        const files = browserDB.get<any>('uploaded_files');
        const found = files.find(f => f.filename === filename);
        if (found) return found.url;
        
        // Fallback or static asset
        return `https://documents.edu.com/drafts/${filename}`;
      }
    };
  }
}

// Websocket connection event listener manager
export class ApexKitRealtimeWSClient {
  private url: string;
  private token: string | null;
  private listeners: Array<(msg: any) => void> = [];
  public isConnected: boolean = false;
  private currentFilter: any = null;

  constructor(url: string, token: string | null) {
    this.url = url;
    this.token = token;
  }

  connect() {
    this.isConnected = true;
    console.log('[ApexKit WS] Simulated Realtime Connected');
    
    // Auto-listen to localStorage changes to mock cross-tab real-time sync for demo!
    window.addEventListener('storage', (e) => {
      if (e.key === 'messages') {
        const newMsgs = JSON.parse(e.newValue || '[]');
        const lastMsg = newMsgs[newMsgs.length - 1];
        if (lastMsg) {
          this.notify({
            type: 'Signal',
            event: 'NewMessage',
            payload: lastMsg
          });
        }
      }
    });
  }

  disconnect() {
    this.isConnected = false;
  }

  subscribe(filter: any) {
    this.currentFilter = filter;
  }

  sendSignal(channel: string, eventName: string, data: any) {
    // Intercept client signals (e.g. typing or messaging)
    if (eventName === 'NewMessage') {
      const msgs = browserDB.get<any>('messages');
      const now = new Date().toISOString();
      const newMsg = {
        id: 'm_' + Math.random().toString(36).substr(2, 9),
        chatRoomId: channel,
        ...data,
        createdAt: now
      };
      msgs.push(newMsg);
      browserDB.save('messages', msgs);

      // Trigger standard instant local socket notification for the current tab
      setTimeout(() => {
        this.notify({
          type: 'Signal',
          event: 'NewMessage',
          payload: newMsg
        });
      }, 50);

      // Trigger automatic simulated tutor reply if the message was sent to a tutor!
      // This is a super high-fidelity, delight-oriented UX polish!
      const currentUserId = data.senderId;
      const [studentId, tutorId] = channel.split('_');
      if (studentId && tutorId && currentUserId === studentId) {
        setTimeout(async () => {
          const profiles = browserDB.get<any>('users_profiles');
          const tutorProf = profiles.find(p => p.id === tutorId);
          if (tutorProf) {
            const replyMsg = {
              id: 'm_reply_' + Math.random().toString(36).substr(2, 9),
              chatRoomId: channel,
              senderId: tutorId,
              senderName: tutorProf.name,
              text: `Thanks for reaching out! I reviewed your message about the assignment. Let me know if you would like me to get started, and we can secure the milestone payment right away.`,
              createdAt: new Date().toISOString()
            };
            const updatedMsgs = browserDB.get<any>('messages');
            updatedMsgs.push(replyMsg);
            browserDB.save('messages', updatedMsgs);

            this.notify({
              type: 'Signal',
              event: 'NewMessage',
              payload: replyMsg
            });
          }
        }, 3000); // 3 seconds typing speed simulation
      }
    }
  }

  onEvent(callback: (msg: any) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify(msg: any) {
    this.listeners.forEach((cb) => cb(msg));
  }
}

export class ApexKitRealtimeSSEClient {
  constructor(baseUrl: string, token: string | null = null) {}
  connect() {}
  disconnect() {}
  onEvent() {
    return () => {};
  }
}
