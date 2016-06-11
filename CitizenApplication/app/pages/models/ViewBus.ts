
export class ViewBus { // why?, the bus-detail seems ti be dependend. We should remove it and use IBus.
    id: number;
    lineId: number;
    numberPlate: string;
    color: string;
    picture: string;
}