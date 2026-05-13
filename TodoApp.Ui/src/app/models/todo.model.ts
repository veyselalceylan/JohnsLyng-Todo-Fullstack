export interface Todo {
  id: string;           
  title: string;        
  description?: string;    
  isCompleted: boolean;
  deadline?: Date | string;
  createdAt: Date | string; 
  updatedAt?: Date | string; 
  priority: string;      
}