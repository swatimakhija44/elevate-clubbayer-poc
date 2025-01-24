export interface MenuItem{
 id: number;
  name: string;
  title?: string;  
  key?: string;    
  enabled: boolean;
  below?: MenuItem[];
  absolute?: string;
  enabledSubMenuItems?: MenuItem[];
  menu?: MenuItem[];
}