export interface Cell {
  capacity: number;
  lock: string;
  type: string;
  data: string;
}

export interface ReturnCapacity {
  capacity: string;
  emptyCapacity: string;
}
