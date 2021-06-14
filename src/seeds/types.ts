import { Node, NodeType } from '../models/nodes';

export interface SixthLayer {
    detelinara: NodeType[]
    liman: NodeType[]
}

export interface FifthLayer {
    subotica: NodeType[]
    noviSad: NodeType[]
    bezanija: NodeType[]
    neimar: NodeType[]
    crveniKrst: NodeType[]
}

export interface FourthLayer {
    severnobackiOkrug: NodeType[]
    juznobackiOkrug: NodeType[]
    noviBeograd: NodeType[]
    vracar: NodeType[]
}

export interface ThirdLayer {
    vojvodina: NodeType[]
    gradBeograd: NodeType[]
}

export interface SecondLayer {
    srbija: NodeType[]
}

export interface FirstLayer {
    countries: NodeType[]
}
