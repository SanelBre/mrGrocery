import { Node } from '../models/nodes';
import { insertNodes } from './node.seed';
import { insertUsers } from './user.seed';

export const seed = async () => {
    await Node.remove({}, (e) => {
        if(e) console.error(e);
        console.log('successfully dropped collection...');
    });
    await insertUsers();
    await insertNodes();
    console.log('successfully seeded data');
}
