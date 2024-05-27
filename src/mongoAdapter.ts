import {MongoClient, Collection} from "mongodb";

export class MongoConnector {
    client:MongoClient = new MongoClient('mongodb://127.0.0.1:27017/miserend');
    private collection: any;

    constructor() {
        // this.collection =collection;
        // this.collection = this.client.db().collection('events');
    }

    async connectToDB() {
        await this.client.connect();
        this.collection = this.client.db().collection('events');
    }

    async insert(event: Object) {
        console.log('> insert');

        try {
            const result = await this.collection.insertOne(event);
    
            console.log(result);
            console.log('< insert: SUCCESS');
            return result;
        } catch (error) {
            console.log("ERROR In insert")
        //   if (error instanceof MongoServerError) {
        //     console.log(`Error worth logging: ${error}`); // special case for some reason
        //   }
          throw error; // still want to crash
        }
    }
    
    async update(event: any) {
    //     console.log('> update');
    //     try {
    //         const _id = event.id;
    //         delete event._id;
    //         console.log(event)
    //         const result = await this.collection.updateOne({_id }, { $set: event });
    
    //         console.log(result);
    //         console.log('< update: SUCCESS');
    //         return result;
    //     } catch (error) {
    //         console.log("ERROR In update")
    //     //   if (error instanceof MongoServerError) {
    //     //     console.log(`Error worth logging: ${error}`); // special case for some reason
    //     //   }
    //       throw error; // still want to crash
    //     }
    }

    async remove(_id: String) {
        console.log('> remove');

        try {
            const result = await this.collection.deleteOne({_id });
    
            console.log(result);
            console.log('< remove: SUCCESS');
            return result;
        } catch (error) {
            console.log("ERROR In remove")
            throw error; // still want to crash
        }
    }
}

