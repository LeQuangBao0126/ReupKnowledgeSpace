export class KnowledgeBase{
    id: number ;
    categoryId: number;
    title: string;
    seoAlias :string;
    description :string;
    environment:string;
    problem:string;
    stepToReproduce:string;
    errorMessage:string;
    workaround:string;
    note:string;
    ownerUserId:string;
    labels: any ;   //string []
    createDate: Date;
    lastModifiedDate: Date;
    numberOfComments:number;
    numberOfVotes:number;
    numberOfReports:number;

}