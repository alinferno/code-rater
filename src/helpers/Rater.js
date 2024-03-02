class Rater {
  constructor(code) {
    this.text = "def hello world";
    this.nesting = {};
    this.code = code.trim();
    this.codeLines = this.code.split("\n");
  }

  calculateNestingLevels(indentation = 4) {
    let nesting_level = 0;
    const lines = [];
    for (let lineIndex = 0; lineIndex < this.codeLines.length; lineIndex++) {
      const line = this.codeLines[lineIndex];
      if (line.trim().length == 0) {
        this.nesting[lineIndex + 1] = undefined;
        continue;
      }
      const leading_spaces = line.length - line.trimLeft().length;
      const current_level = Math.floor(leading_spaces / indentation);

      if (current_level >= 4) {
        lines.push([lineIndex + 1, current_level - 3]);
      }
      if (this.nesting[lineIndex] == undefined) {
        this.nesting[lineIndex] = current_level;
      }
      this.nesting[lineIndex + 1] = current_level;
      nesting_level = Math.max(nesting_level, current_level);
    }

    return lines;
  }

  getFuncs() {
    const longFuncs = [];
    let i = 0;
    while (i < this.codeLines.length) {
      const line = this.codeLines[i];
      if (line.includes("def ")) {
        const curr_level = this.nesting[i + 1];
        let j = i + 1;
        while (j < this.codeLines.length && this.nesting[j + 1] > curr_level) {
          j++;
        }
        if (j - i > 15) {
          longFuncs.push([i + 1, j + 1, j - i]);
        }
      }
      i++;
    }
    return longFuncs;
  }

  getCommentsCount() {
    let comments_count = 0;
    let comments_length = 0;
    for (const line of this.codeLines) {
      const stripped = line.trimLeft();
      if (stripped && stripped[0] === "#") {
        comments_count++;
        comments_length += stripped.length;
      }
    }
    return [comments_count, comments_length];
  }

  getVariableNamingFormat() {
    const vars = [];
    for (let line_num = 0; line_num < this.codeLines.length; line_num++) {
      const line = this.codeLines[line_num];
      const splitted = line.split("=");
      if (splitted.length < 2) {
        continue;
      }
      let i = 0;
      while (i + 1 < splitted.length) {
        if (
          splitted[i].trimRight().slice(-1) !== " " ||
          splitted[i + 1].trimLeft()[0] !== " "
        ) {
          vars.push(String(line_num + 1));
        }
        i++;
      }
    }
    if (vars.length > 0) {
      console.log(
        "Make sure to leave a space before and after the equal sign at line",
        vars.join(", ")
      );
    }
  }

  checkInheritance() {
    const inheritances = [];
    this.codeLines.forEach((line, lineIndex) => {
      if (line.includes("class")) {
        let characters = Array.from(line.trim());
        characters.forEach((character, charIndex) => {
          if (
            character == "(" &&
            characters[charIndex + 1] != ")" &&
            characters.slice(charIndex + 1, characters.length - 2).join("") !=
              "object"
          ) {
            inheritances.push(lineIndex + 1);
          }
        });
      }
    });
    return inheritances;
  }

  async analyseCode() {
    return new Promise(async (resolve, reject) => {
      try {
        var nestingLines = this.calculateNestingLevels();
        var longFuncs = this.getFuncs();
        // var commentsCount = this.getCommentsCount();
        // var variableNamingFormat = this.getVariableNamingFormat();
        var inheritances = this.checkInheritance();
        await new Promise((resolve) => setTimeout(resolve, 0));

        // console.log("Nesting Lines:", nestingLines);
        // console.log("Long Functions:", longFuncs);
        // console.log("Comments Count:", commentsCount);
        // console.log("Variable Naming Format:", variableNamingFormat);
        // console.log("Inheritances:", inheritances);

        resolve({
          nestingLines,
          longFuncs,
          // commentsCount,
          // variableNamingFormat,
          inheritances,
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export { Rater };
