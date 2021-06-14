import { v4 as uuidv4 } from 'uuid';
import { Node, NodeType } from '../models/nodes';
import { FifthLayer, FirstLayer, FourthLayer, SecondLayer, SixthLayer, ThirdLayer } from './types';
import { users } from './user.seed';

const extractNodeIds = (node: NodeType[]) => node.map(item => item._id);

const generateNodeSample = (): NodeType => ({
    _id: uuidv4(),
    employees: [],
    managers: [],
    name: "default",
    descendants: null
});

const sixthLayer: SixthLayer = {
    detelinara: [
        {
            ...generateNodeSample(),
            name: "radnja 2",
            nodeType: "store"
        },
        {
            ...generateNodeSample(),
            name: "radnja 3",
            nodeType: "store"
        }
    ],
    liman: [
        {
            ...generateNodeSample(),
            name: "radnja 4",
            nodeType: "store"
        },
        {
            ...generateNodeSample(),
            name: "radnja 5",
            nodeType: "store"
        },
    ],
}

const fifthLayer: FifthLayer = {
    subotica: [
        {
            ...generateNodeSample(),
            name: "radnja 1",
            nodeType: "store"
        }
    ],
    noviSad: [
        {
            ...generateNodeSample(),
            name: "Detelinara",
            descendants: extractNodeIds(sixthLayer.detelinara)
        },
        {
            ...generateNodeSample(),
            name: "Liman",
            descendants: extractNodeIds(sixthLayer.liman)
        }
    ],
    bezanija: [
        {
            ...generateNodeSample(),
            name: "radnja 6",
            nodeType: "store"
        }
    ],
    neimar: [
        {
            ...generateNodeSample(),
            name: "radnja 7",
            nodeType: "store"
        }
    ],
    crveniKrst: [
        {
            ...generateNodeSample(),
            name: "radnja 8",
            nodeType: "store"
        },
    ]
}

const fourthLayer: FourthLayer = {
    severnobackiOkrug: [
        {
            ...generateNodeSample(),
            name: "Subotica",
            descendants: extractNodeIds(fifthLayer.subotica)
        }
    ],
    juznobackiOkrug: [
        {
            ...generateNodeSample(),
            name: "Novi Sad",
            descendants: extractNodeIds(fifthLayer.noviSad)
        }
    ],
    noviBeograd: [
        {
            ...generateNodeSample(),
            name: "Bezanija",
            descendants: extractNodeIds(fifthLayer.bezanija)
        }
    ],
    vracar: [
        {
            ...generateNodeSample(),
            name: "Neimar",
            descendants: extractNodeIds(fifthLayer.neimar)
        },
        {
            ...generateNodeSample(),
            name: "Crveni krst",
            descendants: extractNodeIds(fifthLayer.crveniKrst)
        },
    ]
};

const thirdLayer: ThirdLayer = {
    vojvodina: [
        {
            ...generateNodeSample(),
            name: "Severnobacki okrug",
            descendants: extractNodeIds(fourthLayer.severnobackiOkrug)
        },
        {
            ...generateNodeSample(),
            name: "Juznobacki okrug",
            descendants: extractNodeIds(fourthLayer.juznobackiOkrug)
        }
    ],
    gradBeograd: [
        {
            ...generateNodeSample(),
            name: "Novi Beograd",
            descendants: extractNodeIds(fourthLayer.noviBeograd)
        },
        {
            ...generateNodeSample(),
            name: "Vracar",
            descendants: extractNodeIds(fourthLayer.vracar)
        }
    ]
};

const secondLayer: SecondLayer = {
    srbija: [
        {
            ...generateNodeSample(),
            name: "Vojvodina",
            descendants: extractNodeIds(thirdLayer.vojvodina)
        },
        {
            ...generateNodeSample(),
            name: "Grad Beograd",
            descendants: extractNodeIds(thirdLayer.gradBeograd)
        }
    ]
};


const firstLayer: FirstLayer = {
    countries: [
        {
            ...generateNodeSample(),
            name: "Srbija",
            descendants: extractNodeIds(secondLayer.srbija)
        }
    ]
};

const allRecords = {
    ...firstLayer,
    ...secondLayer,
    ...thirdLayer,
    ...fourthLayer,
    ...fifthLayer,
    ...sixthLayer,
};

export const insertNodes = async () => {
    const allRecordsFlat = Object.keys(allRecords).reduce(
        (acc: NodeType[], record) => [...acc, ...allRecords[record]], []
    );

    const numberOfRecords = allRecordsFlat.length;

    users.forEach((user, index) => {
        const spreadOffset = index % numberOfRecords;

        const keyPick = user.role === "manager"
            ? "managers"
            : "employees";
        
        allRecordsFlat[spreadOffset][keyPick].push(user._id);
    })

    await Node.insertMany(allRecordsFlat);
}
