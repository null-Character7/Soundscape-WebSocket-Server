export interface Stream {
    streamId :string,
    title: string,
    upvotes:number,
    artist: string
}

export interface curStream {
    streamId: string,
    title: string,
    extractedId:string | null,
    artist: string
}

export abstract class Store {
    constructor () {

    }

    initSpace(spaceId : string){

    }

    getStreams(spaceId: string, streamId:string){

    }

    addStreams(spaceId:string, streamId:string, title:string, upvotes:number, artist: string){

    }

    upvote(spaceId: string, streamId:string){

    }

    downvote(spaceId: string, streamId:string){
        
    }

    addCurrentStream(spaceId:string, streamId:string, title:string, url:string, artist: string){
        
    }
}