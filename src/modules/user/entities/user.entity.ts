import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  email: string;

  @Column()
  password: string;

  @Field(() => String)
  @Column()
  nickname: string;
}