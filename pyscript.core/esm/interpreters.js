// ⚠️ Part of this file is automatically generated
//    The :RUNTIMES comment is a delimiter and no code should be written/changed after
//    See rollup/build_interpreters.cjs to know more

import { base } from "./interpreter/_utils.js";

/** @type {Map<string, object>} */
export const registry = new Map();

/** @type {Map<string, object>} */
export const configs = new Map();

/** @type {string[]} */
export const selectors = [];

/** @type {string[]} */
export const prefixes = [];

export const interpreter = new Proxy(new Map(), {
    get(map, id) {
        if (!map.has(id)) {
            const [type, ...rest] = id.split("@");
            const interpreter = registry.get(type);
            const url = /^https?:\/\//i.test(rest)
                ? rest[0]
                : interpreter.module(...rest);
            map.set(id, {
                url,
                module: import(url),
                engine: interpreter.engine.bind(interpreter),
            });
        }
        const { url, module, engine } = map.get(id);
        return (config, baseURL) =>
            module.then((module) => {
                configs.set(id, config);
                const fetch = config?.fetch;
                if (fetch) base.set(fetch, baseURL);
                return engine(module, config, url);
            });
    },
});

const register = (interpreter) => {
    for (const type of [].concat(interpreter.type)) {
        registry.set(type, interpreter);
        selectors.push(`script[type="${type}"]`);
        prefixes.push(`${type}-`);
    }
};

//:RUNTIMES
import micropython from "./interpreter/micropython.js";
import pyodide from "./interpreter/pyodide.js";
import ruby from "./interpreter/ruby.js";
import wasmoon from "./interpreter/wasmoon.js";
for (const interpreter of [micropython, pyodide, ruby, wasmoon])
    register(interpreter);