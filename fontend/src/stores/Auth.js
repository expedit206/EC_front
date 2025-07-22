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
exports.useAuthStore = void 0;
const pinia_1 = require("pinia");
const index_js_1 = __importDefault(require("../api/index.js"));
exports.useAuthStore = (0, pinia_1.defineStore)("auth", {
    state: () => {
        const rawUser = localStorage.getItem("user");
        // console.log(rawUser=='undefined');
        const user = rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null;
        const token = localStorage.getItem("token") || null;
        // console.log(token);
        return {
            user,
            token,
        };
    },
    actions: {
        login(credentials) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield index_js_1.default.post("/login", credentials);
                // console.log(response.data);
                this.user = response.data.user;
                this.token = response.data.token;
                // localStorage.setItem("user", JSON.stringify(this.user));
                localStorage.setItem("token", this.token);
            });
        },
        register(data) {
            return __awaiter(this, void 0, void 0, function* () {
                // console.log(data);
                const response = yield index_js_1.default.post("/register", {
                    nom: data.nom,
                    telephone: data.telephone,
                    email: data.email || null,
                    ville: data.ville,
                    mot_de_passe: data.mot_de_passe,
                    parrain_id: data.parrain_id || null,
                });
                // console.log(response.data);
                this.user = response.data.user;
                this.token = response.data.token;
                localStorage.setItem("user", JSON.stringify(this.user));
                localStorage.setItem("token", this.token);
            });
        },
        checkAuth() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.token) {
                    this.logout();
                    return false;
                }
                try {
                    const response = yield index_js_1.default.get("/user");
                    // console.log(response.data);
                    this.user = response.data.user;
                    localStorage.setItem("user", JSON.stringify(this.user));
                    return true;
                }
                catch (error) {
                    this.logout();
                    return false;
                }
            });
        },
        updateJetons() {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield index_js_1.default.get("/user");
                this.user = response.data;
            });
        },
        logout() {
            index_js_1.default.post("/logout").catch(() => { }); // Ignorer les erreurs réseau
            this.user = null;
            this.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
});
