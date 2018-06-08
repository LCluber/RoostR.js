

export class Uniform {
  type : string;
  value : number|Array<number>;

  constructor ( type:string, value:number|Array<number> ) {
    this.type = type;
    this.value = value;
  }

}
