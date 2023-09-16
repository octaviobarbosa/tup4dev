export class Log {
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  userId: number;
  content: any;
}
