import Image from "next/image";

export default function chordList({}) {
  console.log("chord page!");
  const baseList: string[] = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"]; // 12種
  const codeVarList: string[] = [
    "",
    "m",
    "7",
    "m7",
    "M7",
    "sus4",
    "7sus4",
    "add9",
    "m7♭5",
    "dim7",
    "6",
    "aug",
    "mM7",
    "m6",
  ]; // 14種
  const convImageName = (c: string, v: string) => {
    let name = "";
    c = c.toLowerCase();
    if (c.indexOf("♯") > -1) {
      c = c.replace("♯", "");
      name += `${c}3`;
    } else name += c;

    if (v.indexOf("mM7") > -1) name += "mm7";
    else if (v.indexOf("M7") > -1) name += "m72";
    else if (v.indexOf("♭") > -1) name += "m7b5";
    else if (v.indexOf("dim7") > -1) name += "dim";
    else name += v;

    return `chord/${name}-ss.jpg`;
  };
  return (
    <div>
      <table>
        {baseList.map((c) => {
          return [0, 1].map((i) => {
            return !i ? (
              <thead key={c + i}>
                <tr>
                  {codeVarList.map((v) => {
                    return <th key={c + v}>{`${c}${v}`}</th>;
                  })}
                </tr>
              </thead>
            ) : (
              <tbody key={c + i}>
                <tr>
                  {codeVarList.map((v) => {
                    return (
                      <td key={c + v}>
                        {
                          <Image
                            priority
                            src={`/${convImageName(c, v)}`}
                            className="max-w-none"
                            alt=""
                            height={100}
                            width={100}
                          />
                        }
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            );
          });
        })}
      </table>
    </div>
  );
}
