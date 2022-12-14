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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEntity = exports.transformStructure = exports.getTableStructure = exports.generateColumn = exports.handler = exports.parseArg = void 0;
var types_1 = require("../typings/types");
var index_1 = require("./index");
var client_1 = require("../client");
var fs_1 = require("fs");
var path_1 = require("path");
// ???????????????: ('table_name1', 'table_name2') => [table_name1, table_name2]
var parseArg = function (arg) {
    return arg
        ? arg.replace(/\(/g, "").replace(/\)/g, "").replace(/'/g, "").split(",")
        : arg;
};
exports.parseArg = parseArg;
// ??????????????????
var handler = function (type) {
    var columnType;
    var length;
    var precision;
    var scale;
    var enums;
    Object.keys(types_1.RULES).forEach(function (k) {
        var _a, _b, _c, _d;
        var key = k;
        // ????????????key
        if (type.startsWith(key)) {
            var reg = types_1.RULES[key];
            var check = reg.test(type);
            // ????????????
            if (check) {
                columnType = key;
                if (types_1.HAS_LENGTH.includes(columnType)) {
                    // ???length
                    length = Number((0, exports.parseArg)((_a = type.match(reg)) === null || _a === void 0 ? void 0 : _a[1]));
                }
                if (types_1.HAS_PRECISION.includes(columnType)) {
                    // ???precision
                    var ret = (0, exports.parseArg)((_b = type.match(reg)) === null || _b === void 0 ? void 0 : _b[1]);
                    if (ret && (0, index_1.isArray)(ret)) {
                        ret = ret[0];
                    }
                    precision = Number(ret);
                }
                if (types_1.HAS_SCALE.includes(columnType)) {
                    // ???scale
                    var ret = (0, exports.parseArg)((_c = type.match(reg)) === null || _c === void 0 ? void 0 : _c[1]);
                    if (ret && (0, index_1.isArray)(ret)) {
                        ret = ret[1];
                    }
                    scale = Number(ret);
                }
                if (columnType === "enum") {
                    // ???enum
                    enums = (0, exports.parseArg)((_d = type.match(reg)) === null || _d === void 0 ? void 0 : _d[1]);
                }
            }
        }
    });
    return { type: columnType, length: length, precision: precision, scale: scale, enums: enums };
};
exports.handler = handler;
// ????????????????????????
var generateColumn = function (_a) {
    var Field = _a.Field, Type = _a.Type, Collation = _a.Collation, Null = _a.Null, Key = _a.Key, Default = _a.Default, Extra = _a.Extra, Privileges = _a.Privileges, Comment = _a.Comment;
    var _b = (0, exports.handler)(Type), type = _b.type, length = _b.length, precision = _b.precision, scale = _b.scale, enums = _b.enums;
    var primaryGeneratedColumn = false;
    if (typeof length !== "number" || Number.isNaN(length))
        length = undefined;
    if (typeof precision !== "number" || Number.isNaN(length))
        precision = undefined;
    if (typeof scale !== "number" || Number.isNaN(length))
        precision = undefined;
    if (!(0, index_1.isArray)(enums))
        enums = undefined;
    if (Collation === null)
        Collation = undefined;
    if (Extra === "auto_increment")
        primaryGeneratedColumn = true;
    return {
        type: type,
        length: length,
        precision: precision,
        scale: scale,
        primaryGeneratedColumn: primaryGeneratedColumn,
        enum: JSON.stringify(enums),
        name: Field,
        collation: undefined,
        nullable: Null === "YES" ? true : undefined,
        default: Default === null ? undefined : Default,
        comment: Comment === "" ? undefined : Comment,
        update: Privileges.includes("update") ? undefined : false,
        // unique: Key === 'PRI' ? true : undefined,
        jsType: type === "enum" ? JSON.stringify(enums) : types_1.JSTYPEMAP[type],
        isIndex: Key === "MUL",
    };
};
exports.generateColumn = generateColumn;
// ???????????????
var getTableStructure = function (tableNames) { return __awaiter(void 0, void 0, void 0, function () {
    var structure;
    return __generator(this, function (_a) {
        structure = tableNames.reduce(function (map, name) { return __awaiter(void 0, void 0, void 0, function () {
            var newMap, _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, map];
                    case 1:
                        newMap = _c.sent();
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        _a = newMap;
                        _b = name;
                        return [4 /*yield*/, client_1.db.query("SHOW FULL FIELDS FROM ".concat(name))];
                    case 3:
                        _a[_b] = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _c.sent();
                        throw error_1;
                    case 5: return [2 /*return*/, map];
                }
            });
        }); }, {});
        return [2 /*return*/, structure];
    });
}); };
exports.getTableStructure = getTableStructure;
// ???????????????
var transformStructure = function (structure, collect) {
    return Object.keys(structure).reduce(function (map, tableName) {
        map[tableName] = [];
        structure[tableName].forEach(function (row) {
            // ??????????????????
            if (!collect.includes(row.Field)) {
                map[tableName].push((0, exports.generateColumn)(row));
            }
        });
        return map;
    }, {});
};
exports.transformStructure = transformStructure;
// ??????column???option
var generateOption = function (row) {
    return Object.keys(row).reduce(function (str, key, i, list) {
        // @ts-ignore
        var v = row[key]; // ?????????????????? ??????v???ignore?????? ??????????????????
        var ignoreKeys = ["primaryGeneratedColumn", "jsType", "isIndex"];
        var numberTypes = ["length", "scale", "precision"];
        if (!ignoreKeys.includes(key) && v !== undefined) {
            var value = function () {
                if (v === "")
                    return "''";
                if (typeof v === "boolean" ||
                    numberTypes.includes(key) ||
                    key === "enum")
                    return v;
                if (v != null)
                    return "'".concat(v, "'");
                return v;
            };
            str += "    ".concat(key, ": ").concat(value(), ", \n");
        }
        if (i === list.length - 1) {
            str = str.slice(0, str.length - 3);
        }
        return str;
    }, "");
};
// ???????????????
var generateEntity = function (columnStructure, targetPath, baseName) {
    Object.keys(columnStructure).forEach(function (tableName) {
        var tableScheme = columnStructure[tableName];
        var scheme = "";
        var hasPrimary = false;
        var hasIndex = false;
        // ????????????
        var segment = function (row, option) {
            if (row.primaryGeneratedColumn)
                return "  @PrimaryGeneratedColumn({\n".concat(option, " \n  })");
            if (row.isIndex)
                return "  @Index()\n  @Column({\n".concat(option, " \n  })");
            return "  @Column({\n".concat(option, " \n  })");
        };
        // ????????????
        var importDependences = function () {
            var dependence = "";
            if (hasIndex)
                dependence += ", Index";
            if (hasPrimary)
                dependence += ", PrimaryGeneratedColumn";
            return dependence;
        };
        // ??????flag
        var changeFlags = function (row, option) {
            if (row.isIndex)
                hasIndex = true;
            if (row.primaryGeneratedColumn)
                hasPrimary = true;
        };
        // ??????????????????
        var hasBaseEntity = function () { return (baseName !== "" ? "extends ".concat(baseName) : ""); };
        tableScheme.forEach(function (r) {
            var row = r;
            // ??????column???options
            var option = generateOption(row);
            changeFlags(row, option);
            scheme += "".concat(segment(row, option), "\n  ").concat((0, index_1.underlineToHump)(row.name), "!: ").concat(r.jsType, ";\n\n");
        });
        var entityStr = "import { Entity, Column".concat(importDependences(), " } from 'typeorm';\n\n@Entity('").concat(tableName, "')\nexport class ").concat((0, index_1.textCapitalize)(tableName), "Entity ").concat(hasBaseEntity(), " {\n").concat(scheme, "\n}");
        var dirPath = (0, path_1.join)(targetPath, "entities");
        var filepath = (0, path_1.join)(dirPath, "".concat(tableName, ".entity.ts"));
        (0, index_1.emptyTheMkdir)(dirPath);
        /**
         * ????????????
         * entities
         *  tableName.entity.ts
         */
        (0, fs_1.writeFileSync)(filepath, entityStr);
        console.log("create ".concat(filepath, " Success"));
    });
};
exports.generateEntity = generateEntity;
