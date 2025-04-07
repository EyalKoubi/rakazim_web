export interface Teacher {
  _id: string;
  fullName: string;
  idNumber: string;
}

export interface SchoolClass {
  _id: string;
  name: string;
  grade: string;
}

export interface Assignment {
  teacher: Teacher;
  class: SchoolClass;
  hours: number;
}

export interface newSchoolClass {
  _id: string;
  name: string;
  grade: string;
  totalHours: number;
  bonusHours: number;
}
