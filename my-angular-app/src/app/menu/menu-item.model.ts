export interface MenuItem{
    title:string;
    key:string;
    enabled:boolean;
    below?:MenuItem[];
    absolute?: string;
}