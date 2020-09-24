import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";

export type MessageType = "Palindrome" | "NobPalindrome";

@Entity({ name: "Messages" })
export class Message {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column()
  payload: string;

  @Column()
  type: MessageType;  
}
