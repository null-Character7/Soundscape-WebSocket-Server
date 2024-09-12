export interface Stream {
    streamId :string,
    title: string;
    upvotes:number
}

export abstract class Store {
    constructor () {

    }

    initSpace(spaceId : string){

    }

    getStreams(spaceId: string, streamId:string){

    }

    addStreams(spaceId:string, streamId:string, title:string, upvotes:number){

    }

    upvote(spaceId: string, streamId:string){

    }

    downvote(spaceId: string, streamId:string){
        
    }
}