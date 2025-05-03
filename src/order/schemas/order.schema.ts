import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  sellAmount: number;

  @Prop({ required: true })
  receiveAmount: number;

  @Prop({ required: true, type: Object }) // Изменено с string на Object
  sellCurrency: {
    code: string;
    name: string;
    icon: string;
    network: string;
  };

  @Prop({ required: true, type: Object }) // Изменено с string на Object
  receiveCurrency: {
    code: string;
    name: string;
    icon: string;
    network: string;
  };

  @Prop({ required: true })
  exchangeRate: number;

  @Prop({ required: true })
  serviceFee: number;

  @Prop({ required: true })
  networkFee: number;

  @Prop({ default: 'pending' }) // Возможные статусы: pending, canceled, accepted
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
