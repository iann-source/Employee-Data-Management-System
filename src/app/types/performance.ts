export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewPeriod: string;
  reviewDate: string;
  reviewerId: string;
  ratings: {
    productivity: number;
    quality: number;
    communication: number;
    teamwork: number;
    leadership: number;
    initiative: number;
  };
  overallRating: number;
  strengths: string;
  areasForImprovement: string;
  goals: string;
  comments: string;
}

export interface KPI {
  id: string;
  employeeId: string;
  kpiName: string;
  description: string;
  target: number;
  actual: number;
  unit: string;
  period: string;
  status: 'Exceeded' | 'Met' | 'In Progress' | 'Not Met';
}
