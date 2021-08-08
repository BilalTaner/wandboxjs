"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compiler = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const languages_json_1 = __importDefault(require("./languages.json"));
function compiler(lang, code) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = {
                compiler: languages_json_1.default[lang].compiler,
                code: code,
                codes: [],
                stdin: "",
                options: languages_json_1.default[lang].options,
                "compiler-option-raw": "",
                "runtime-option-raw": "",
            };
            const compiled = yield node_fetch_1.default("https://wandbox.org/compile", {
                headers: {
                    accept: "text/event-stream",
                    "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "sec-gpc": "1",
                    "x-requested-with": "XMLHttpRequest",
                },
                body: JSON.stringify(body),
                method: "POST",
            })
                .then((x) => x.text())
                .catch((e) => e);
            const splitted = compiled === null || compiled === void 0 ? void 0 : compiled.split("\n");
            if (!splitted.length)
                throw new Error("There was an error executing the command please make sure the language or code you entered is correct.");
            const exitCode = ((_a = splitted
                .find((x) => x.includes("data: ExitCode"))) === null || _a === void 0 ? void 0 : _a.replace("data: ExitCode:", "")) || null;
            const signalCode = ((_b = splitted
                .find((x) => x.includes("Signal:"))) === null || _b === void 0 ? void 0 : _b.replace(/(data:|Signal:|\\n)/g, "")) || null;
            const end = splitted.findIndex((x) => x.includes("data: ExitCode"));
            const result = ((_c = splitted
                .slice(5, end - 3)
                .filter((i) => !i.includes("\r"))
                .join("\n")) === null || _c === void 0 ? void 0 : _c.replace(/(data: |data:|StdOut:|StdErr:|\\n)/g, "").split("\n").filter((i) => i !== "" && i !== "\r").join("\n")) || null;
            if (result === null || result === void 0 ? void 0 : result.length) {
                return {
                    result: result,
                    exitCode: exitCode,
                    signalCode: signalCode,
                };
            }
            throw new Error("There was an error executing the command please make sure the language or code you entered is correct.");
        }
        catch (error) {
            return console.log(error);
        }
    });
}
exports.compiler = compiler;
//# sourceMappingURL=main.js.map