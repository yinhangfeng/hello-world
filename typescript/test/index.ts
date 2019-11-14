/**
 * 使用 vscode debug ts
 * https://github.com/TypeStrong/ts-node
 */

function greeter(person: string) {
  return "Hello, " + person;
}

let user = "Jane User";

console.log(greeter(user));

interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = {color: "white", area: 100};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let xxx = { colour11: "red", width: 100 };
let mySquare = createSquare(xxx);

interface SearchFunc {
  (source: string, subString: string): boolean;
}

// interface NumberDictionary {
//   [index: string]: number;
//   length: number;    // ok, length is a number
//   name: string;      // error, the type of 'name' is not a subtype of the indexer
// }


let s = "foo";
// s = null; // error, 'null' is not assignable to 'string'
let sn: string | null = "bar";
// sn = null; // ok

// let sn1: string & null = 'xxx';

function test1(s: string | null, s1?: string | null) {
  if (s != null) {
    console.log(s.length);
  }

  if (s1 != null) {
    console.log(s1,length);
  }
}

test1(sn);
test1(sn, null);
