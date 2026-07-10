export type UserRole = 'student' | 'tutor';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  expertise?: string[];
  rating?: number;
  hourlyRate?: number;
  completedTasks?: number;
  balance?: number;
  reviewsCount?: number;
  enrolledCourseIds?: string[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseCode: string;
  budget: number;
  deadline: string;
  studentId: string;
  studentName: string;
  tutorId?: string;
  tutorName?: string;
  status: 'open' | 'bidded' | 'active' | 'completed' | 'paid' | 'cancelled';
  fileUrls?: { name: string; url: string; size: number }[];
  solutionUrls?: { name: string; url: string; size: number }[];
  bidsCount?: number;
  createdAt: string;
}

export interface Bid {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  tutorRating?: number;
  amount: number;
  proposal: string;
  createdAt: string;
}

export interface Message {
  id: string;
  assignmentId?: string;
  chatRoomId: string; // "studentId_tutorId"
  senderId: string;
  senderName: string;
  text: string;
  file?: {
    name: string;
    url: string;
    size: number;
    mime: string;
  };
  createdAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  category: string;
  iconName: string;
  description: string;
}

export interface Review {
  id: string;
  tutorId: string;
  studentName: string;
  rating: number;
  comment: string;
  assignmentTitle: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  amount: number;
  status: 'escrow' | 'released' | 'refunded';
  stripePaymentId: string;
  createdAt: string;
}
